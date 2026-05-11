// scripts/upload.ts
/**
 *   시리즈 전체:  pnpm upload 001/KOR
 *   단일 에피소드: pnpm upload 001/KOR/003
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

import crypto from "crypto";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import type { youtube_v3 } from "googleapis";
import path from "path";

import { getYouTubeClient } from "./youtube-auth";

function fileHash(filePath: string): string {
  return crypto.createHash("md5").update(readFileSync(filePath)).digest("hex");
}

const SRC_DIR = "src/compositions";
const OUT_DIR = "out";

// ── 플래그 파싱 ─────────────────────────────────────────────
const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((a) => a.startsWith("--")));
const positional = rawArgs.filter((a) => !a.startsWith("--"));
const arg = positional[0];

// --thumb-only:   썸네일만 업로드
// --caption-only: 자막만 업로드
// --caption-lang: 특정 언어 자막만 (e.g. --caption-lang=ko-KR)
const thumbOnly = flags.has("--thumb-only");
const captionOnly = flags.has("--caption-only");
const captionLangFlag = [...flags].find((f) => f.startsWith("--caption-lang="));
const captionLang = captionLangFlag?.split("=")[1] ?? null;
// --caption-only --caption-lang=ko-KR 이면 해당 언어만 올림
// --thumb-only 이면 자막 스킵
// --caption-only 이면 썸네일/메타 스킵
// 플래그 없으면 전부 실행

if (!arg || !arg.includes("/")) {
  console.error(
    "Usage: pnpm upload <series>/<lang>[/<episode>] [--thumb-only] [--caption-only] [--caption-lang=ko-KR]",
  );
  process.exit(1);
}

// ── 인자 파싱 ───────────────────────────────────────────────
const parts = arg.split("/");
const seriesArg = parts[0];
const langDir = parts[1]; // KOR, ENG, ...
const singleEpisode = parts[2] ?? null; // null이면 전체

type PrivacyStatus = "private" | "public" | "unlisted";

// ── 유틸 함수 ───────────────────────────────────────────────

/** 재생목록 생성 또는 기존 ID 반환 */
async function ensurePlaylist(
  yt: youtube_v3.Youtube,
  title: string,
  description: string,
): Promise<string> {
  // 내 재생목록 검색 (페이지네이션)
  let pageToken: string | undefined;
  let existing: { id?: string | null } | undefined;
  do {
    const res = await yt.playlists.list({
      part: ["snippet"],
      mine: true,
      maxResults: 50,
      pageToken,
    });
    existing = res.data.items?.find((p) => p.snippet?.title === title);
    if (existing) break;
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);
  if (existing?.id) {
    console.log(`📋  재생목록 발견: "${title}" (${existing.id})`);
    return existing.id;
  }

  // 생성
  const created = await yt.playlists.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: { title, description },
      status: { privacyStatus: "private" },
    },
  });
  const id = created.data.id;
  if (!id) throw new Error("재생목록 생성 실패: API 응답에 id 없음");
  console.log(`📋  재생목록 생성: "${title}" (${id})`);
  console.log(
    `⚠️  YouTube Studio에서 이 재생목록을 '공식 시리즈'로 설정해주세요.`,
  );
  return id;
}

/** 영상 업로드 */
async function uploadVideo(
  yt: youtube_v3.Youtube,
  videoPath: string,
  meta: {
    title: string;
    description: string;
    tags: string[];
    categoryId: string;
    privacyStatus: PrivacyStatus;
    language: string;
  },
): Promise<string> {
  console.log(`⬆️  업로드 중: "${meta.title}"`);
  const res = await yt.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: meta.title,
        description: meta.description,
        tags: meta.tags,
        categoryId: meta.categoryId,
        defaultLanguage: meta.language,
        defaultAudioLanguage: meta.language,
      },
      status: {
        privacyStatus: meta.privacyStatus,
        selfDeclaredMadeForKids: false,
      },
    },
    media: { body: createReadStream(videoPath) },
  });
  const videoId = res.data.id;
  if (!videoId) throw new Error("영상 업로드 실패: API 응답에 id 없음");
  console.log(`   ✅  업로드 완료: https://youtu.be/${videoId}`);
  return videoId;
}

/** 썸네일 업로드 */
async function uploadThumbnail(
  yt: youtube_v3.Youtube,
  videoId: string,
  thumbPath: string,
): Promise<void> {
  await yt.thumbnails.set({
    videoId,
    media: { body: createReadStream(thumbPath) },
  });
  console.log(`   🖼️  썸네일 설정 완료`);
}

/** 자막 업로드 */
function captionDisplayName(language: string): string {
  switch (language) {
    case "ko":
    case "ko-KR":
      return "한국어";
    case "en":
      return "English";
    case "en-US":
      return "English (US)";
    default:
      return language;
  }
}

async function uploadCaption(
  yt: youtube_v3.Youtube,
  videoId: string,
  srtPath: string,
  language: string,
): Promise<void> {
  const existing = await yt.captions.list({
    part: ["snippet"],
    videoId,
  });

  for (const item of existing.data.items ?? []) {
    if (item.id && item.snippet?.language === language) {
      await yt.captions.delete({ id: item.id });
    }
  }

  await yt.captions.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        videoId,
        language,
        name: captionDisplayName(language),
      },
    },
    media: { body: createReadStream(srtPath) },
  });
  console.log(`   📝  자막 업로드 완료 (${language})`);
}

function collectCaptionTracks(
  seriesDir: string,
  langDir: string,
  episode: string,
  defaultLanguage: string,
): Array<{ language: string; path: string }> {
  const outputDir = path.join(OUT_DIR, seriesDir, langDir);
  if (!existsSync(outputDir)) return [];

  const localizedTracks = readdirSync(outputDir)
    .filter(
      (file) =>
        file.startsWith(`${episode}.`) &&
        file.endsWith(".srt") &&
        file !== `${episode}.srt`,
    )
    .map((file) => ({
      language: file.slice(episode.length + 1, -4),
      path: path.join(outputDir, file),
    }))
    .sort((a, b) => {
      if (a.language === defaultLanguage) return -1;
      if (b.language === defaultLanguage) return 1;
      return a.language.localeCompare(b.language);
    });

  if (localizedTracks.length > 0) {
    return localizedTracks;
  }

  const fallbackPath = path.join(outputDir, `${episode}.srt`);
  return existsSync(fallbackPath)
    ? [{ language: defaultLanguage, path: fallbackPath }]
    : [];
}

/** 기존 영상 메타데이터 업데이트 */
async function updateVideoMeta(
  yt: youtube_v3.Youtube,
  videoId: string,
  meta: {
    title: string;
    description: string;
    tags: string[];
    categoryId: string;
    privacyStatus: PrivacyStatus;
    language: string;
  },
): Promise<void> {
  await yt.videos.update({
    part: ["snippet", "status"],
    requestBody: {
      id: videoId,
      snippet: {
        title: meta.title,
        description: meta.description,
        tags: meta.tags,
        categoryId: meta.categoryId,
        defaultLanguage: meta.language,
        defaultAudioLanguage: meta.language,
      },
      status: {
        privacyStatus: meta.privacyStatus,
      },
    },
  });
  console.log(
    `   ✅  메타데이터 업데이트 완료 (${meta.privacyStatus}): https://youtu.be/${videoId}`,
  );
}

/** 재생목록에 영상 추가 */
async function addToPlaylist(
  yt: youtube_v3.Youtube,
  playlistId: string,
  videoId: string,
): Promise<void> {
  await yt.playlistItems.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        playlistId,
        resourceId: { kind: "youtube#video", videoId },
      },
    },
  });
  console.log(`   📋  재생목록에 추가 완료`);
}

// ── 메인 ────────────────────────────────────────────────────
(async () => {
  // 1. 시리즈 폴더 찾기
  const seriesDirs = readdirSync(SRC_DIR)
    .filter((d) => statSync(path.join(SRC_DIR, d)).isDirectory())
    .sort();

  const seriesDir =
    seriesDirs.find((d) => d === seriesArg) ??
    seriesDirs.find((d) => d.startsWith(seriesArg));
  if (!seriesDir) {
    console.error(`❌  시리즈 "${seriesArg}" 를 찾을 수 없습니다.`);
    process.exit(1);
  }

  // 2. youtube.ts 로드
  const ytConfigPath = path.resolve(SRC_DIR, seriesDir, langDir, "youtube.ts");
  const { pathToFileURL } = await import("url");
  const { YOUTUBE_CONFIG } = await import(pathToFileURL(ytConfigPath).href);

  // 3. 에피소드 목록 (정렬)
  const episodeKeys = Object.keys(YOUTUBE_CONFIG.episodes).sort();
  const targets = singleEpisode
    ? episodeKeys.filter((k: string) => k === singleEpisode)
    : episodeKeys;

  if (targets.length === 0) {
    console.error("❌  업로드할 에피소드가 없습니다.");
    process.exit(1);
  }

  // 4. video-ids.json 로드 (playlistId + 에피소드 → videoId 매핑)
  const videoIdsPath = path.resolve(
    SRC_DIR,
    seriesDir,
    langDir,
    "video-ids.json",
  );
  const videoIdsData: {
    playlistId?: string | null;
    playlistHash?: string;
    episodes: Record<string, string>;
    thumbHashes?: Record<string, string>;
    captionHashes?: Record<string, string>;
    metaHashes?: Record<string, string>;
  } = existsSync(videoIdsPath)
    ? JSON.parse(readFileSync(videoIdsPath, "utf-8"))
    : { episodes: {} };
  if (!videoIdsData.thumbHashes) videoIdsData.thumbHashes = {};
  if (!videoIdsData.captionHashes) videoIdsData.captionHashes = {};
  if (!videoIdsData.metaHashes) videoIdsData.metaHashes = {};
  const videoIds = videoIdsData.episodes;

  // 5. YouTube 인증
  console.log(`\n🔐  YouTube 인증 중…`);
  const yt = await getYouTubeClient();

  // 6. 재생목록 확보 (저장된 ID가 있으면 재사용)
  let playlistId: string;
  if (videoIdsData.playlistId) {
    playlistId = videoIdsData.playlistId;
    console.log(`📋  저장된 재생목록 ID 사용: ${playlistId}`);
    // 재생목록 메타도 업데이트 (해시 비교 → 변경 시에만)
    const playlistMeta = {
      title: YOUTUBE_CONFIG.playlist.title,
      description: YOUTUBE_CONFIG.playlist.description,
    };
    const playlistHash = crypto
      .createHash("md5")
      .update(JSON.stringify(playlistMeta))
      .digest("hex");
    if (playlistHash !== videoIdsData.playlistHash) {
      await yt.playlists.update({
        part: ["snippet"],
        requestBody: {
          id: playlistId,
          snippet: playlistMeta,
        },
      });
      videoIdsData.playlistHash = playlistHash;
      writeFileSync(videoIdsPath, JSON.stringify(videoIdsData, null, 2) + "\n");
      console.log(`📋  재생목록 메타 업데이트 완료`);
    }
  } else {
    playlistId = await ensurePlaylist(
      yt,
      YOUTUBE_CONFIG.playlist.title,
      YOUTUBE_CONFIG.playlist.description,
    );
    videoIdsData.playlistId = playlistId;
    videoIdsData.playlistHash = crypto
      .createHash("md5")
      .update(
        JSON.stringify({
          title: YOUTUBE_CONFIG.playlist.title,
          description: YOUTUBE_CONFIG.playlist.description,
        }),
      )
      .digest("hex");
    writeFileSync(videoIdsPath, JSON.stringify(videoIdsData, null, 2) + "\n");
  }

  // 7. 썸네일용 Remotion 번들 (필요 시)
  let bundled: string | null = null;
  let uploaded = 0;
  const failed: string[] = [];

  // 8. 에피소드별 처리
  for (const ep of targets) {
    const epConfig =
      YOUTUBE_CONFIG.episodes[ep as keyof typeof YOUTUBE_CONFIG.episodes];
    const title = epConfig.title;

    const existingVideoId = videoIds[ep];
    const isUpdate = !!existingVideoId;

    const outputDir = path.join(OUT_DIR, seriesDir, langDir);
    const mp4Path = path.join(outputDir, `${ep}.mp4`);

    // 신규 업로드인데 mp4 없으면 스킵
    if (!isUpdate && !existsSync(mp4Path)) {
      console.warn(`⚠️  ${mp4Path} 없음, 스킵 (pnpm render 먼저 실행)`);
      continue;
    }

    try {
      const defaults = YOUTUBE_CONFIG.defaults;
      const ep_ = epConfig as Record<string, unknown>;
      const meta = {
        title,
        description: (ep_.description as string) ?? "",
        tags: Array.isArray(ep_.tags)
          ? (ep_.tags as string[])
          : [...defaults.tags],
        categoryId: (ep_.categoryId as string) ?? defaults.categoryId,
        privacyStatus:
          (ep_.privacyStatus as PrivacyStatus) ?? defaults.privacyStatus,
        language: defaults.language,
      };
      const captionTracks = collectCaptionTracks(
        seriesDir,
        langDir,
        ep,
        meta.language,
      );

      // 썸네일 렌더링 (--caption-only 시 스킵)
      const thumbPath = path.join(outputDir, `${ep}-thumb.jpeg`);
      mkdirSync(outputDir, { recursive: true });
      if (!captionOnly) {
        if (!bundled) {
          console.log(`\n🎬  Remotion 번들링 (썸네일용)…`);
          bundled = await bundle({
            entryPoint: path.resolve("src/index.ts"),
            webpackOverride: (c) => c,
          });
        }
        const dirPrefix = seriesDir.match(/^(\d+)/)?.[1] ?? "";
        const compositionId = langDir
          ? [dirPrefix, langDir, ep].join("-")
          : [dirPrefix, ep].join("-");

        const composition = await selectComposition({
          serveUrl: bundled,
          id: compositionId,
        });
        await renderStill({
          composition,
          serveUrl: bundled,
          output: thumbPath,
          frame: 0,
          imageFormat: "jpeg",
          jpegQuality: 90,
        });
        console.log(`   🖼️  썸네일 렌더링 완료: ${thumbPath}`);
      }

      let videoId: string;

      // 메타데이터 해시 (title, description, tags, privacyStatus 등)
      const metaHash = crypto
        .createHash("md5")
        .update(JSON.stringify(meta))
        .digest("hex");

      if (captionOnly) {
        // --caption-only: 메타/영상 업로드 스킵
        if (!isUpdate) {
          console.warn(`⚠️  ${ep}: videoId 없음 — 자막만 올릴 수 없음, 스킵`);
          continue;
        }
        videoId = existingVideoId;
        console.log(`📝  "${title}" — 자막만 업로드`);
      } else if (isUpdate) {
        videoId = existingVideoId;
        const prevMetaHash = videoIdsData.metaHashes![ep];
        if (metaHash !== prevMetaHash) {
          console.log(`🔄  "${title}" — 기존 영상 메타 업데이트`);
          await updateVideoMeta(yt, videoId, meta);
          videoIdsData.metaHashes![ep] = metaHash;
        } else {
          console.log(`✅  "${title}" — 메타 변경 없음`);
        }
      } else {
        // 신규 → 영상 업로드 + 재생목록 추가
        videoId = await uploadVideo(yt, mp4Path, meta);
        await addToPlaylist(yt, playlistId, videoId);
        videoIdsData.metaHashes![ep] = metaHash;
      }

      // 썸네일 설정 (--caption-only 시 스킵)
      if (!captionOnly) {
        const thumbHash = fileHash(thumbPath);
        const prevHash = videoIdsData.thumbHashes![ep];
        if (thumbHash !== prevHash) {
          try {
            await uploadThumbnail(yt, videoId, thumbPath);
            videoIdsData.thumbHashes![ep] = thumbHash;
          } catch (e: unknown) {
            console.warn(
              `   ⚠️  썸네일 설정 실패 (채널 인증 필요?): ${e instanceof Error ? e.message : e}`,
            );
          }
        } else {
          console.log(`   🖼️  썸네일 변경 없음 — 스킵`);
        }
      }

      // 자막 업로드 (--thumb-only 시 스킵)
      if (!thumbOnly) {
        const filteredTracks = captionLang
          ? captionTracks.filter((t) => t.language === captionLang)
          : captionTracks;
        for (const track of filteredTracks) {
          const captionKey = `${ep}:${track.language}`;
          const captionHash = fileHash(track.path);
          const prevCaptionHash = videoIdsData.captionHashes![captionKey];
          if (captionHash !== prevCaptionHash) {
            await uploadCaption(yt, videoId, track.path, track.language);
            videoIdsData.captionHashes![captionKey] = captionHash;
          } else {
            console.log(`   📝  자막 변경 없음 — 스킵 (${track.language})`);
          }
        }
      }

      // videoId 저장
      videoIdsData.episodes[ep] = videoId;
      writeFileSync(videoIdsPath, JSON.stringify(videoIdsData, null, 2) + "\n");

      uploaded++;
    } catch (err: unknown) {
      console.error(
        `\n❌  "${title}" ${isUpdate ? "업데이트" : "업로드"} 실패: ${err instanceof Error ? err.message : err}`,
      );
      failed.push(ep);
    }
  }

  console.log(`\n🎉  업로드 ${uploaded}개 / 전체 ${targets.length}개 에피소드`);
  if (failed.length > 0) {
    console.error(`⚠️  실패: ${failed.join(", ")}`);
    process.exit(1);
  }
  console.log();
})().catch((err) => {
  console.error("\n❌ ", err.message ?? err);
  process.exit(1);
});

// scripts/update-meta.ts
/**
 * 이미 업로드된 영상의 제목/설명/태그를 youtube.ts 설정으로 갱신한다.
 *
 * 사용법:
 *   pnpm run update-meta <series>/<lang>/<episode> <videoId>
 * 예)
 *   pnpm run update-meta 002-Java-Class/KOR/003 MtywqsXbLRE
 */
import path from "path";
import { pathToFileURL } from "url";

import { getYouTubeClient } from "./youtube-auth";

const SRC_DIR = "src/compositions";

const arg = process.argv[2];
const videoId = process.argv[3];

if (!arg || !videoId || !arg.includes("/")) {
  console.error(
    "Usage: pnpm run update-meta <series>/<lang>/<episode> <videoId>",
  );
  process.exit(1);
}

const parts = arg.split("/");
if (parts.length !== 3) {
  console.error("❌  형식은 <series>/<lang>/<episode> 입니다.");
  process.exit(1);
}
const [seriesArg, langDir, episode] = parts;

async function main(): Promise<void> {
  // 1. youtube.ts 로드
  const ytConfigPath = path.resolve(SRC_DIR, seriesArg, langDir, "youtube.ts");
  const { YOUTUBE_CONFIG } = await import(pathToFileURL(ytConfigPath).href);

  const ep = YOUTUBE_CONFIG.episodes[episode];
  if (!ep) {
    console.error(`❌  episode "${episode}"가 youtube.ts에 없습니다.`);
    process.exit(1);
  }

  const title: string = ep.title;
  const description: string = ep.description;
  const tags: string[] = [
    ...YOUTUBE_CONFIG.defaults.tags,
    ...(ep.tags ?? []),
  ];
  const categoryId: string = YOUTUBE_CONFIG.defaults.categoryId;
  const language: string = YOUTUBE_CONFIG.defaults.language;

  console.log(`🎯  대상 영상: https://youtu.be/${videoId}`);
  console.log(`📝  새 제목: "${title}"`);

  // 2. YouTube 클라이언트
  const yt = await getYouTubeClient();

  // 3. videos.update
  const res = await yt.videos.update({
    part: ["snippet"],
    requestBody: {
      id: videoId,
      snippet: {
        title,
        description,
        tags,
        categoryId,
        defaultLanguage: language,
        defaultAudioLanguage: language,
      },
    },
  });

  if (res.data.id) {
    console.log(`✅  메타데이터 업데이트 완료: https://youtu.be/${res.data.id}`);
  } else {
    console.error(`❌  업데이트 실패: ${JSON.stringify(res.data)}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ ", err instanceof Error ? err.message : String(err));
  process.exit(1);
});

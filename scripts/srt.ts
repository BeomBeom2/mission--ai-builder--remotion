/**
 * scripts/srt.ts
 *
 *   단일 에피소드:  pnpm srt 001-Java-Basic/KOR/001
 *   시리즈 전체:   pnpm srt 001
 *   전체:          pnpm srt
 */
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import path from "path";

const SRC_DIR = "src/compositions";
const arg = process.argv[2] ?? "";
type Target = { seriesDir: string; langDir: string | null; episodeNum: string };

// ── 대상 목록 수집 (render.ts 동일 로직) ─────────────────────
function collectTargets(): Target[] {
  const allSeries = readdirSync(SRC_DIR)
    .filter((d) => statSync(path.join(SRC_DIR, d)).isDirectory())
    .sort();

  if (!arg) {
    return allSeries.flatMap((s) => episodesOf(s));
  }

  if (arg.includes("/")) {
    const parts = arg.split("/");
    const seriesArg = parts[0];
    const seriesDir =
      allSeries.find((d) => d === seriesArg) ??
      allSeries.find((d) => d.startsWith(seriesArg));
    if (!seriesDir) {
      console.error(`No series folder matching "${seriesArg}" found.`);
      process.exit(1);
    }

    // series/LANG (e.g. 001-Java-Basic/KOR) → all episodes in that lang
    if (parts.length === 2 && /^[A-Z]{2,3}$/.test(parts[1])) {
      return episodesOf(seriesDir).filter((t) => t.langDir === parts[1]);
    }

    const episodeNum = parts[parts.length - 1];
    const langDir =
      parts.length >= 3 && /^[A-Z]{2,3}$/.test(parts[parts.length - 2])
        ? parts[parts.length - 2]
        : null;
    return [{ seriesDir, langDir, episodeNum }];
  }

  const matched = allSeries.filter((d) => d.startsWith(arg));
  if (matched.length === 0) {
    console.error(`No series folder matching "${arg}" found.`);
    process.exit(1);
  }
  return matched.flatMap((s) => episodesOf(s));
}

function episodesOf(seriesDir: string) {
  const seriesPath = path.join(SRC_DIR, seriesDir);
  const entries = readdirSync(seriesPath, { withFileTypes: true });
  const langDirs = entries
    .filter((e) => e.isDirectory() && /^[A-Z]{2,3}$/.test(e.name))
    .map((e) => e.name);
  const scanDirs =
    langDirs.length > 0
      ? langDirs.map((l) => path.join(seriesPath, l))
      : [seriesPath];

  return scanDirs
    .flatMap((dir) =>
      readdirSync(dir)
        .filter((f) => /^\d+-1-.+\.tsx$/.test(f))
        .map((f) => f.match(/^(\d+)-1-/)?.[1])
        .filter((ep): ep is string => !!ep)
        .map((episodeNum) => ({
          seriesDir,
          langDir: dir === seriesPath ? null : path.basename(dir),
          episodeNum,
        })),
    )
    .sort(
      (a, b) =>
        a.episodeNum.localeCompare(b.episodeNum) ||
        (a.langDir ?? "").localeCompare(b.langDir ?? ""),
    );
}

// ── 프레임 → SRT 타임스탬프 변환 ────────────────────────────
function frameToTimestamp(frame: number, fps: number): string {
  const ms = Math.round((frame / fps) * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const msPart = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(msPart).padStart(3, "0")}`;
}

// ── SRT 문자열 생성 ───────────────────────────────────────────
function buildSRT(
  entries: Array<{ startFrame: number; endFrame: number; text: string }>,
  fps: number,
): string {
  if (entries.length === 0) return "";
  return (
    entries
      .map((entry, i) => {
        const start = frameToTimestamp(entry.startFrame, fps);
        const end = frameToTimestamp(entry.endFrame, fps);
        return `${i + 1}\n${start} --> ${end}\n${entry.text}`;
      })
      .join("\n\n") + "\n"
  );
}

function writeTrackFile(
  outputDir: string,
  filename: string,
  entries: Array<{ startFrame: number; endFrame: number; text: string }>,
  fps: number,
): void {
  const outputFile = path.join(outputDir, filename);
  writeFileSync(outputFile, buildSRT(entries, fps), "utf-8");
  console.log(`  ${filename} (${entries.length} cues)`);
}

function prepareImportableModule(sourcePath: string): string {
  const source = readFileSync(sourcePath, "utf-8");
  const patched = source
    .replace(
      /import\s+\{\s*Audio\s*\}\s+from\s+"@remotion\/media";/,
      "const Audio = () => null;",
    )
    .replace(/from\s+"(\.\.\/\.\.\/\.\.\/utils\/scene)";/g, 'from "$1.srt";')
    .replace(/from\s+"(\.\.\/\.\.\/\.\.\/utils\/code)";/g, 'from "$1.srt";')
    .replace(/from\s+"(\.\.\/\.\.\/\.\.\/utils\/tree)";/g, 'from "$1.srt";');
  const tempPath = sourcePath.replace(/\.tsx$/, ".srt-import.tmp.tsx");
  writeFileSync(tempPath, patched, "utf-8");
  return tempPath;
}

// ── 메인 ─────────────────────────────────────────────────────
(async () => {
  const targets = collectTargets();
  if (targets.length === 0) {
    console.error("No targets found.");
    process.exit(1);
  }

  for (const { seriesDir, langDir, episodeNum } of targets) {
    // 메인 컴포지션 파일 경로 탐색 — 언어 서브폴더(KOR 등) 안도 확인
    const seriesPath = path.join(SRC_DIR, seriesDir);
    const compFilePattern = new RegExp(`^${episodeNum}-1-.+\\.tsx$`);

    const seriesEntries = readdirSync(seriesPath, { withFileTypes: true });
    const langDirs = seriesEntries
      .filter((e) => e.isDirectory() && /^[A-Z]{2,3}$/.test(e.name))
      .map((e) => path.join(seriesPath, e.name));
    const searchDirs = langDirs.length > 0 ? langDirs : [seriesPath];
    const effectiveSearchDirs = langDir
      ? searchDirs.filter((dir) => path.basename(dir) === langDir)
      : searchDirs;

    const foundDir = effectiveSearchDirs.find((d) =>
      readdirSync(d).some((file) => compFilePattern.test(file)),
    );
    if (!foundDir) {
      console.error(
        `  No composition file for episode ${episodeNum} in ${seriesDir}`,
      );
      continue;
    }
    const srtFilename = readdirSync(foundDir).find((file) =>
      compFilePattern.test(file),
    );
    if (!srtFilename) {
      console.error(
        `  No composition file for episode ${episodeNum} in ${seriesDir}`,
      );
      continue;
    }
    const srtFilePath = path.join(foundDir, srtFilename);
    const compFile = path.resolve(srtFilePath);
    const importableFile = prepareImportableModule(compFile);

    // 동적 import
    let mod: { SRT_DATA?: unknown; SRT_TRACKS?: unknown; fps?: number };
    try {
      mod = await import(importableFile);
    } catch (err) {
      console.error(`  Failed to import ${compFile}:`, (err as Error).message);
      continue;
    } finally {
      unlinkSync(importableFile);
    }

    const srtData = mod.SRT_DATA;
    const srtTracks = mod.SRT_TRACKS;
    const meta = (mod as Record<string, unknown>).compositionMeta as
      | { fps?: number }
      | undefined;
    const fps = mod.fps ?? meta?.fps ?? 30;

    const outputDir = langDir
      ? path.join("out", seriesDir, langDir)
      : path.join("out", seriesDir);
    mkdirSync(outputDir, { recursive: true });

    if (
      srtTracks &&
      typeof srtTracks === "object" &&
      !Array.isArray(srtTracks) &&
      Object.values(srtTracks).every((track) => Array.isArray(track))
    ) {
      const tracks = Object.entries(
        srtTracks as Record<
          string,
          Array<{ startFrame: number; endFrame: number; text: string }>
        >,
      );

      if (tracks.length === 0) {
        console.warn(`  ${srtFilePath}: SRT_TRACKS is empty — skipping`);
        continue;
      }

      console.log(`  ${srtFilename} -> ${outputDir}`);
      for (const [language, entries] of tracks) {
        writeTrackFile(
          outputDir,
          `${episodeNum}.${language}.srt`,
          entries,
          fps,
        );
      }
      continue;
    }

    if (!Array.isArray(srtData)) {
      console.warn(
        `  ${srtFilePath}: SRT_DATA not found or not an array — skipping`,
      );
      continue;
    }

    console.log(`  ${srtFilename} -> ${outputDir}`);
    writeTrackFile(
      outputDir,
      `${episodeNum}.srt`,
      srtData as Array<{ startFrame: number; endFrame: number; text: string }>,
      fps,
    );
  }

  console.log(`\nDone. ${targets.length} episode(s) processed.`);
})().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});

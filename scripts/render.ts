/**
 * scripts/render.ts
 *
 *   단일 에피소드:  pnpm render 001-Java-Basic/KOR/001
 *   시리즈 전체:   pnpm render 001          (001-* 폴더 안의 모든 에피소드)
 *   전체:          pnpm render              (모든 시리즈)
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

import { mkdirSync, readdirSync, statSync } from "fs";
import path from "path";

const SRC_DIR = "src/compositions";
const arg = process.argv[2] ?? "";

type Target = { seriesDir: string; langDir: string | null; episodeNum: string };

// ── 렌더링 대상 목록 수집 ─────────────────────────────────────
function collectTargets(): Target[] {
  const allSeries = readdirSync(SRC_DIR)
    .filter((d) => statSync(path.join(SRC_DIR, d)).isDirectory())
    .sort();

  if (!arg) {
    // 전체 시리즈
    return allSeries.flatMap((s) => episodesOf(s));
  }

  if (arg.includes("/")) {
    const parts = arg.split("/");
    const seriesArg = parts[0];
    const seriesDir =
      allSeries.find((d) => d === seriesArg) ??
      allSeries.find((d) => d.startsWith(seriesArg));
    if (!seriesDir) {
      console.error(`❌  No series folder matching "${seriesArg}" found.`);
      process.exit(1);
    }

    const lastPart = parts[parts.length - 1];

    // 시리즈/언어 전체: 001-Java-Basic/ENG  또는  001/ENG
    if (parts.length === 2 && /^[A-Z]{2,3}$/.test(lastPart)) {
      return episodesOf(seriesDir).filter((t) => t.langDir === lastPart);
    }

    // 단일 에피소드: 001-Java-Basic/KOR/001  또는  001/KOR/001
    const episodeNum = lastPart;
    const langDir =
      parts.length >= 3 && /^[A-Z]{2,3}$/.test(parts[parts.length - 2])
        ? parts[parts.length - 2]
        : null;
    return [{ seriesDir, langDir, episodeNum }];
  }

  // 시리즈 prefix: "001" → 001-* 폴더
  const matched = allSeries.filter((d) => d.startsWith(arg));
  if (matched.length === 0) {
    console.error(`❌  No series folder matching "${arg}" found.`);
    process.exit(1);
  }
  return matched.flatMap((s) => episodesOf(s));
}

function episodesOf(seriesDir: string): Target[] {
  // 시리즈 폴더 안에서 언어 서브폴더(KOR, ENG 등)를 포함해 에피소드 tsx 를 수집한다.
  const seriesPath = path.join(SRC_DIR, seriesDir);
  const entries = readdirSync(seriesPath, { withFileTypes: true });

  // 언어 서브폴더가 있으면 그 안을 스캔, 없으면 seriesDir 직접 스캔 (하위 호환)
  const langDirs = entries
    .filter((e) => e.isDirectory() && /^[A-Z]{2,3}$/.test(e.name))
    .map((e) => e.name);

  if (langDirs.length > 0) {
    return langDirs
      .flatMap((langDir) =>
        readdirSync(path.join(seriesPath, langDir))
          // 패턴: {episodeNum}-1-{name}.tsx (타입 1 = 메인 tsx)
          .filter((f) => /^\d+-1-.+\.tsx$/.test(f))
          .map((f) => f.match(/^(\d+)-1-/)?.[1])
          .filter((ep): ep is string => !!ep)
          .map((episodeNum) => ({ seriesDir, langDir, episodeNum })),
      )
      .sort((a, b) => Number(a.episodeNum) - Number(b.episodeNum));
  }

  return readdirSync(seriesPath)
    .filter((f) => /^\d+-.+\.tsx$/.test(f))
    .map((f) => f.match(/^(\d+)/)?.[1])
    .filter((ep): ep is string => !!ep)
    .sort()
    .map((episodeNum) => ({ seriesDir, langDir: null, episodeNum }));
}

// ── 메인 ─────────────────────────────────────────────────────
(async () => {
  const targets = collectTargets();
  if (targets.length === 0) {
    console.error("❌  No targets found.");
    process.exit(1);
  }

  console.log(`\n🎬  Bundling…`);
  const bundled = await bundle({
    entryPoint: path.resolve("src/index.ts"),
    webpackOverride: (c) => c,
  });

  for (const { seriesDir, langDir, episodeNum } of targets) {
    const dirPrefix = seriesDir.match(/^(\d+)/)?.[1] ?? "";
    // 언어 폴더가 있으면 "001-KOR-001", 없으면 "001-001" (Root.tsx 와 동일 규칙)
    const compositionId = langDir
      ? [dirPrefix, langDir, episodeNum].join("-")
      : [dirPrefix, episodeNum].filter(Boolean).join("-");
    const outputDir = langDir
      ? path.join("out", seriesDir, langDir)
      : path.join("out", seriesDir);
    const outputFile = path.join(outputDir, episodeNum + ".mp4");

    mkdirSync(outputDir, { recursive: true });
    console.log(`\n▶  "${compositionId}" → ${outputFile}`);
    const inputProps =
      langDir === "ENG" ? { subtitleMode: "primary-only" as const } : {};

    const composition = await selectComposition({
      serveUrl: bundled,
      id: compositionId,
      inputProps,
    });
    const scale = 4 / 3; // 1080×1920 → 1440×2560 (2K)
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      scale,
      inputProps,
      outputLocation: outputFile,
      onProgress: ({ progress }) =>
        process.stdout.write(`\r   ⏳  ${(progress * 100).toFixed(1)}%`),
    });
    const outW = Math.round(composition.width * scale);
    const outH = Math.round(composition.height * scale);
    console.log(`\n   ✅  Done (${outW}×${outH})`);
  }

  console.log(`\n🎉  All ${targets.length} video(s) rendered.\n`);
})().catch((err) => {
  console.error("\n❌ ", err.message ?? err);
  process.exit(1);
});

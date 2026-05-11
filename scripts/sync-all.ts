/**
 * scripts/sync-all.ts — 사용법: pnpm sync:all
 * src/compositions/ 하위 모든 에피소드를 순서대로 sync 처리
 * 언어 서브폴더(KOR, ENG 등) 구조를 지원한다.
 */
import { spawnSync } from "child_process";
import { readdirSync, statSync } from "fs";
import path from "path";

const SRC_DIR = "src/compositions";
const seriesDirs = readdirSync(SRC_DIR)
  .filter((d) => statSync(path.join(SRC_DIR, d)).isDirectory())
  .sort();

interface Target {
  series: string;
  lang: string | null;
  ep: string;
}

function collectTargets(): Target[] {
  const targets: Target[] = [];
  for (const series of seriesDirs) {
    const seriesPath = path.join(SRC_DIR, series);
    const entries = readdirSync(seriesPath, { withFileTypes: true });

    const langDirs = entries
      .filter((e) => e.isDirectory() && /^[A-Z]{2,3}$/.test(e.name))
      .map((e) => e.name);

    if (langDirs.length > 0) {
      for (const lang of langDirs) {
        const langPath = path.join(seriesPath, lang);
        const eps = readdirSync(langPath)
          .filter((f) => /^\d+-1-.+\.tsx$/.test(f))
          .map((f) => f.match(/^(\d+)-1-/)?.[1])
          .filter((ep): ep is string => !!ep)
          .sort();
        for (const ep of eps) targets.push({ series, lang, ep });
      }
    } else {
      const eps = readdirSync(seriesPath)
        .filter((f) => /^\d+-.+\.tsx$/.test(f))
        .map((f) => f.match(/^(\d+)/)?.[1])
        .filter((ep): ep is string => !!ep)
        .sort();
      for (const ep of eps) targets.push({ series, lang: null, ep });
    }
  }
  return targets;
}

const targets = collectTargets();
let anyFailed = false;
for (const { series, lang, ep } of targets) {
  const target = lang ? `${series}/${lang}/${ep}` : `${series}/${ep}`;
  console.log(`\n${"━".repeat(50)}\n  sync ${target}\n${"━".repeat(50)}`);
  const res = spawnSync("pnpm", ["sync", target], {
    stdio: "inherit",
    shell: true,
  });
  if (res.status !== 0) {
    console.error(`❌  Failed: ${target}`);
    anyFailed = true;
  }
}
if (anyFailed) process.exit(1);

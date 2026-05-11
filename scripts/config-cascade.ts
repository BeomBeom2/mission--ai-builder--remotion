/**
 * config-cascade.ts — 4단계 config cascade 로딩
 *
 * 우선순위 (낮은 순서 → 높은 순서):
 *   1. 루트  src/config.ts
 *   2. 강좌  {seriesDir}/config.ts          (예: 001-Java-Basic/config.ts)
 *   3. 언어  {episodeDir}/config.ts          (예: 001-Java-Basic/KOR/config.ts)
 *   4. 강의  {episodeDir}/{id}.config.ts     (선택, 예: 001-Java-Basic/KOR/001.config.ts)
 *
 * loadMergedConfig 는 episodeDir 에서 compositionsRoot 까지 거슬러 올라가며
 * 각 단계의 config.ts 를 자동으로 수집한다 (디렉터리 깊이에 무관하게 동작).
 *
 * 주의: config 파일은 remotion 심볼을 import하면 안 됨 (esbuild로 번들링됨)
 */
import { buildSync } from "esbuild";
import { existsSync } from "fs";
import path from "path";

/** TypeScript config 파일을 esbuild로 번들하여 exports 객체로 반환 */
export function loadTsExports(filePath: string): Record<string, unknown> {
  if (!existsSync(filePath)) return {};
  const result = buildSync({
    entryPoints: [filePath],
    bundle: true,
    format: "cjs",
    platform: "node",
    write: false,
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const mod = { exports: {} as Record<string, unknown> };
  new Function("module", "exports", "require", code)(mod, mod.exports, require);
  return mod.exports as Record<string, unknown>;
}

/**
 * 루트 → 강좌 → 언어 → 강의 순으로 merge (오른쪽이 이긴다).
 *
 * @param episodeDir      강의 파일이 있는 폴더 (예: "src/compositions/001-Java-Basic/KOR")
 * @param episodeId       강의 ID (예: "001") — {episodeId}.config.ts 탐색
 * @param rootConfigPath  루트 config 경로 (기본: "src/config.ts")
 * @param compositionsRoot  이 디렉터리에 도달하면 walk-up 중단 (기본: "src/compositions")
 */
export function loadMergedConfig(
  episodeDir: string,
  episodeId: string,
  rootConfigPath = path.resolve("src/config.ts"),
  compositionsRoot = path.resolve("src/compositions"),
): Record<string, unknown> {
  const root = loadTsExports(rootConfigPath);

  // episodeDir 에서 compositionsRoot 까지 역방향으로 올라가며 config.ts 수집.
  // unshift 를 사용해 상위 레벨 config 가 낮은 인덱스에 위치하도록 한다
  // → spread 시 하위 레벨이 상위를 덮어쓴다.
  const configs: Record<string, unknown>[] = [];
  let dir = path.resolve(episodeDir);
  const stopAt = path.resolve(compositionsRoot);

  while (dir !== stopAt && dir !== path.dirname(dir)) {
    configs.unshift(loadTsExports(path.join(dir, "config.ts")));
    dir = path.dirname(dir);
  }

  const episode = loadTsExports(
    path.join(path.resolve(episodeDir), `${episodeId}.config.ts`),
  );

  return Object.assign({}, root, ...configs, episode);
}

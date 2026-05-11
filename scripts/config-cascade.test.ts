import { mkdirSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { loadMergedConfig, loadTsExports } from "./config-cascade";

// ── 임시 fixtures 폴더 ───────────────────────────────────────
const FIXTURES = path.join(process.cwd(), ".test-fixtures");
const COURSE_DIR = path.join(FIXTURES, "test-course");
const LANG_DIR = path.join(COURSE_DIR, "KOR");

beforeAll(() => {
  mkdirSync(LANG_DIR, { recursive: true });

  // 루트 config
  writeFileSync(
    path.join(FIXTURES, "root.config.ts"),
    `export const FPS = 30;\nexport const VOICE = "root-voice";\nexport const RATE = "+0%";\n`,
  );

  // 강좌 config (강좌 전용 값)
  writeFileSync(
    path.join(COURSE_DIR, "config.ts"),
    `export const COURSE_ONLY = "course-value";\n`,
  );

  // 언어 config (VOICE, RATE override)
  writeFileSync(
    path.join(LANG_DIR, "config.ts"),
    `export const VOICE = "kor-voice";\nexport const RATE = "+30%";\n`,
  );

  // 에피소드 config (RATE만 override)
  writeFileSync(
    path.join(LANG_DIR, "ep001.config.ts"),
    `export const RATE = "+50%";\n`,
  );
});

afterAll(() => {
  rmSync(FIXTURES, { recursive: true, force: true });
});

// ── loadTsExports ────────────────────────────────────────────

describe("loadTsExports", () => {
  it("존재하는 ts 파일의 exports를 객체로 반환", () => {
    const result = loadTsExports(path.join(FIXTURES, "root.config.ts"));
    expect(result.FPS).toBe(30);
    expect(result.VOICE).toBe("root-voice");
    expect(result.RATE).toBe("+0%");
  });

  it("존재하지 않는 파일은 빈 객체 반환", () => {
    const result = loadTsExports(path.join(FIXTURES, "nonexistent.ts"));
    expect(result).toEqual({});
  });
});

// ── loadMergedConfig (4단계 cascade) ─────────────────────────

describe("loadMergedConfig — 4단계 cascade", () => {
  // 공통 호출 헬퍼
  const cfg = () =>
    loadMergedConfig(
      LANG_DIR,
      "ep001",
      path.join(FIXTURES, "root.config.ts"),
      FIXTURES,
    );

  it("루트 → 강좌 → 언어 순으로 merge: 언어 값이 루트를 override", () => {
    expect(cfg().VOICE).toBe("kor-voice");
  });

  it("루트에만 있는 값은 그대로 내려옴", () => {
    expect(cfg().FPS).toBe(30);
  });

  it("강좌 config 에만 있는 값도 내려옴", () => {
    expect(cfg().COURSE_ONLY).toBe("course-value");
  });

  it("에피소드 config가 언어 config를 override", () => {
    expect(cfg().RATE).toBe("+50%");
  });

  it("에피소드 config 없으면 언어 값 그대로 사용", () => {
    const result = loadMergedConfig(
      LANG_DIR,
      "ep999", // 존재하지 않는 에피소드
      path.join(FIXTURES, "root.config.ts"),
      FIXTURES,
    );
    expect(result.RATE).toBe("+30%");
    expect(result.VOICE).toBe("kor-voice");
  });

  it("에피소드 config 없어도 루트 값은 내려옴", () => {
    const result = loadMergedConfig(
      LANG_DIR,
      "ep999",
      path.join(FIXTURES, "root.config.ts"),
      FIXTURES,
    );
    expect(result.FPS).toBe(30);
  });

  it("강좌 레벨 없이 언어 레벨만 있어도 동작", () => {
    // LANG_DIR 직접 사용, compositionsRoot = COURSE_DIR (강좌 아래를 stop으로 설정)
    const result = loadMergedConfig(
      LANG_DIR,
      "ep001",
      path.join(FIXTURES, "root.config.ts"),
      COURSE_DIR, // 강좌 config를 포함하지 않는 범위
    );
    expect(result.VOICE).toBe("kor-voice");
    expect(result.FPS).toBe(30);
  });
});

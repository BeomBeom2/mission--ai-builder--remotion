// src/compositions/001-Java-Basic/KOR/config.ts — KOR 언어 레벨 설정
import { FPS as ROOT_FPS, PRONUNCIATION as ROOT_PRON } from "../../../config";

// ── 프레임레이트 (루트에서 상속) ─────────────────────────────
export const FPS = ROOT_FPS;

// ── 영상 크기 ────────────────────────────────────────────────
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ── TTS 언어 설정 ─────────────────────────────────────────────
export const VOICE = "ko-KR-HyunsuMultilingualNeural";
export const RATE = "+30%";

// ── 발음맵 (루트 상속 + Java/KOR 전용 override) ───────────────
export const PRONUNCIATION: Record<string, string> = {
  ...ROOT_PRON,
  // Java KOR 전용 추가 발음이 생기면 여기에
};

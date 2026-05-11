// src/compositions/001-Java-Basic/ENG/config.ts — ENG language-level settings
import { FPS as ROOT_FPS } from "../../../config";

// ── Frame rate (inherited from root) ─────────────────────────
export const FPS = ROOT_FPS;

// ── Video size ───────────────────────────────────────────────
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ── TTS language settings ────────────────────────────────────
export const VOICE = "en-US-EmmaMultilingualNeural";
export const RATE = "+15%";

// ── Pronunciation map (ENG-specific overrides only) ──────────
export const PRONUNCIATION: Record<string, string> = {
  // Add English-specific pronunciation overrides here if needed.
};

// src/compositions/003-Git-Merge/KOR/config.ts
import { FPS as ROOT_FPS, PRONUNCIATION as ROOT_PRON } from "../../../config";

export const FPS = ROOT_FPS;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const VOICE = "ko-KR-HyunsuMultilingualNeural";
export const RATE = "+30%";
export const PRONUNCIATION: Record<string, string> = { ...ROOT_PRON };

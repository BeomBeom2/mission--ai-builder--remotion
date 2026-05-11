import React from "react";

import { CHARS_PER_SEC, CROSS, THUMB_CROSS } from "../config";

export { CHARS_PER_SEC, CROSS, THUMB_CROSS };

export const MONO_NO_LIGA = '"calt" 0, "liga" 0' as const;
export const monoFont = "JetBrains Mono, monospace";
export const uiFont = "Noto Sans KR, sans-serif";
export const monoStyle = {
  fontFamily: monoFont,
  fontFeatureSettings: MONO_NO_LIGA,
} as const;

export const FONT = {
  label: 26,
  heading: 32,
  title: 44,
  display: 56,
} as const;

export const CODE = {
  xs: 18,
  sm: 22,
  md: 24,
  lg: 28,
  xl: 32,
} as const;

export const ContentArea: React.FC<{ children?: React.ReactNode }> = () => null;
export const SceneTitle: React.FC<{ title: string }> = () => null;
export const Subtitle: React.FC<Record<string, unknown>> = () => null;
export const TypingCodeLine: React.FC<Record<string, unknown>> = () => null;

export function useFade(): number {
  return 1;
}

export function useTypingEffect(text: string): {
  visibleText: string;
  isDone: boolean;
} {
  return { visibleText: text, isDone: true };
}

export function calcTypingEndFrame(
  chars: number,
  startFrame: number,
  fps: number,
  charsPerSecond = CHARS_PER_SEC,
): number {
  return startFrame + Math.ceil((chars / charsPerSecond) * fps);
}

export function computeLineVisibility<T>(
  lines: readonly T[],
  visibleChars: number,
  getLineLength: (line: T) => number,
): number[] {
  let remaining = Math.floor(visibleChars);
  return lines.map((line) => {
    const lineLength = getLineLength(line);
    const show = Math.min(lineLength, remaining);
    remaining = Math.max(0, remaining - lineLength);
    return show;
  });
}

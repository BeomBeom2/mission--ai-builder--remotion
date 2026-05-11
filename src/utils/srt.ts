// ── src/utils/srt.ts ─────────────────────────────────────────
// SRT_DATA 생성 공유 유틸리티
// ─────────────────────────────────────────────────────────────
import { CROSS } from "../config";
import { toDisplayText } from "./narration";

export type SrtEntry = {
  startFrame: number;
  endFrame: number;
  text: string;
};

export type SrtTracks = Record<string, SrtEntry[]>;

export type SrtSceneConfig = {
  offset: number;
  narration: string[];
  speechStartFrame: number;
  narrationSplits: readonly number[];
  sentenceEndFrames: readonly number[];
  sceneDuration: number;
};

function toSrtText(text: string): string {
  return toDisplayText(text).replace(/\n/g, " ");
}

/**
 * 씬 하나의 나레이션을 SRT 엔트리로 변환하여 entries 배열에 추가한다.
 */
export function addSrtScene(
  entries: SrtEntry[],
  offset: number,
  narration: string[],
  speechStartFrame: number,
  narrationSplits: readonly number[],
  sentenceEndFrames: readonly number[],
  sceneDuration: number,
): void {
  const starts = [speechStartFrame, ...narrationSplits];
  const ends = [...sentenceEndFrames, sceneDuration];
  narration.forEach((text, i) => {
    const s = starts[i];
    const e = ends[i] ?? ends[ends.length - 1];
    if (s !== undefined && e !== undefined && e > s) {
      entries.push({
        startFrame: offset + s,
        endFrame: offset + e,
        text: toSrtText(text),
      });
    }
  });
}

export function buildSrtData(scenes: readonly SrtSceneConfig[]): SrtEntry[] {
  const entries: SrtEntry[] = [];
  scenes.forEach((scene) => {
    addSrtScene(
      entries,
      scene.offset,
      scene.narration,
      scene.speechStartFrame,
      scene.narrationSplits,
      scene.sentenceEndFrames,
      scene.sceneDuration,
    );
  });
  return entries;
}

export function localizeSrtData(
  entries: readonly SrtEntry[],
  texts: readonly string[],
): SrtEntry[] {
  if (entries.length !== texts.length) {
    throw new Error(
      `SRT cue count mismatch: entries=${entries.length}, texts=${texts.length}`,
    );
  }

  return entries.map((entry, index) => ({
    ...entry,
    text: toSrtText(texts[index]),
  }));
}

/**
 * sceneList의 durationInFrames로 각 씬의 시작 프레임(fromValues)을 계산한다.
 * CROSS만큼 씬이 겹친다 (마지막 씬 제외).
 */
export function computeFromValues(
  sceneDurations: number[],
  {
    cross = CROSS,
    firstOverlap,
  }: { cross?: number; firstOverlap?: number } = {},
): number[] {
  const froms: number[] = [];
  let f = 0;
  for (let i = 0; i < sceneDurations.length; i++) {
    froms.push(f);
    const overlap =
      i >= sceneDurations.length - 1
        ? 0
        : i === 0 && firstOverlap !== undefined
          ? firstOverlap
          : cross;
    f += sceneDurations[i] - overlap;
  }
  return froms;
}

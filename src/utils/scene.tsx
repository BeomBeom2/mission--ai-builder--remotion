// ── src/utils/scene.tsx ───────────────────────────────────────
// 모든 씬 파일이 공유하는 상수 · 훅 · 컴포넌트
// ─────────────────────────────────────────────────────────────
import {
  continueRender,
  delayRender,
  getInputProps,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadNotoSans } from "@remotion/google-fonts/NotoSansKR";
import { Audio } from "@remotion/media";

import React from "react";

import { CHARS_PER_SEC, CROSS, SCENE_TAIL_FRAMES } from "../config";
import { JavaLine } from "./code";
import { toDisplayText } from "./narration";

// ── 폰트 ─────────────────────────────────────────────────────
export let monoFont = "JetBrains Mono, monospace";
export let uiFont = "Noto Sans KR, sans-serif";

if (typeof window !== "undefined") {
  const _jb = loadJetBrains("normal", { ignoreTooManyRequestsWarning: true });
  const _ns = loadNotoSans("normal", { ignoreTooManyRequestsWarning: true });
  monoFont = _jb.fontFamily;
  uiFont = _ns.fontFamily;
  const _h = delayRender("Loading Google Fonts");
  Promise.all([_jb.waitUntilDone(), _ns.waitUntilDone()]).then(() =>
    continueRender(_h),
  );
}

// ── 상수 ─────────────────────────────────────────────────────

/** JetBrains Mono 리가처 비활성화 — !=, ==, >= 가 합자로 변환되는 것을 막는다 */
export const MONO_NO_LIGA = '"calt" 0, "liga" 0' as const;

/** monoFont + 리가처 비활성화를 한번에 적용하는 스타일 객체 */
export const monoStyle = {
  fontFamily: monoFont,
  fontFeatureSettings: MONO_NO_LIGA,
} as const;

export { CROSS, CHARS_PER_SEC, THUMB_CROSS } from "../config";

export type SubtitleMode = "primary-only" | "secondary-only" | "bilingual";

const AudioBaseDirContext = React.createContext("");

export const AudioBaseDirProvider: React.FC<{
  baseDir: string;
  children: React.ReactNode;
}> = ({ baseDir, children }) => (
  <AudioBaseDirContext.Provider value={baseDir}>
    {children}
  </AudioBaseDirContext.Provider>
);

export const SceneAudio: React.FC<{ src: string }> = ({ src }) => {
  const baseDir = React.useContext(AudioBaseDirContext);
  const resolvedSrc = baseDir ? `${baseDir}/${src}` : src;
  return <Audio src={staticFile(resolvedSrc)} />;
};

// ── 폰트 스케일 ──────────────────────────────────────────────
/**
 * 글로벌 폰트 사이즈 스케일.
 * 매번 하드코딩하지 않고 이 상수를 사용한다.
 */
export const FONT = {
  /** 26px — 라벨, 뱃지, 코드 블록 위 설명 텍스트 */
  label: 26,
  /** 32px — 씬 소제목, 섹션 헤더 */
  heading: 32,
  /** 44px — 큰 제목, 카드 텍스트 */
  title: 44,
  /** 56px — 강조 텍스트, 핵심 키워드 */
  display: 56,
} as const;

/** 코드 블록(monoStyle) 전용 폰트 스케일 — 5단계 */
export const CODE = {
  /** 18px — 밀집 코드 (Before/After 비교, 7줄+ 긴 코드) */
  xs: 18,
  /** 22px — 보조 코드 (주석 설명, 활용 예시 보조) */
  sm: 22,
  /** 24px — 중간 코드 (실행 흐름, 3~5줄 블록) */
  md: 24,
  /** 28px — 기본 코드 (메인 예시, 2~3줄) */
  lg: 28,
  /** 32px — 강조 코드 (단일 줄, 핵심 코드) */
  xl: 32,
} as const;

// ── 컴포넌트: CodeBlock ──────────────────────────────────────
/**
 * 코드 블록 래퍼.
 * 너비: width - 200 (기본) ~ width - 10 (최대).
 * 배경: BG_CODE (#2d2d2d), borderRadius: 12.
 */
export const CodeBlock: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  const { width } = useVideoConfig();
  return (
    <div
      style={{
        width: width - 200,
        maxWidth: width - 10,
        background: "#2d2d2d",
        borderRadius: 12,
        padding: "20px 32px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── 훅: useFade ───────────────────────────────────────────────
/** fadeIn/fadeOut에 사용할 프레임 수 (CROSS=0이어도 강제 fade 시 사용) */
const FADE_FRAMES = 20;

/**
 * 씬 경계 크로스페이드 opacity 값을 반환한다.
 * @param d 씬의 durationInFrames
 * @param opts.out false → fadeOut 없이 (마지막 씬)
 * @param opts.in true → CROSS=0이어도 강제 fadeIn (썸네일 직후 첫 씬)
 */
export function useFade(
  d: number,
  { out = true, in: forceIn = false }: { out?: boolean; in?: boolean } = {},
) {
  const frame = useCurrentFrame();
  const doFadeIn = CROSS > 0 || forceIn;
  const fadeLen = CROSS > 0 ? CROSS : FADE_FRAMES;
  const fadeIn = doFadeIn
    ? interpolate(frame, [0, fadeLen], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const fadeOut =
    out && CROSS > 0
      ? interpolate(frame, [d - CROSS, d], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  return fadeIn * fadeOut;
}

export function useTypingEffect(
  text: string,
  startFrame: number,
  charsPerSecond = CHARS_PER_SEC,
): { visibleText: string; isDone: boolean } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsVisible = Math.floor(
    (Math.max(0, frame - startFrame) / fps) * charsPerSecond,
  );
  return {
    visibleText: text.slice(0, charsVisible),
    isDone: charsVisible >= text.length,
  };
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

// ── 상수: 하단 여백 / 자막 영역 ────────────────────────────────
/** 영상 하단 빈 여백 (px) */
export const BOTTOM_MARGIN = 350;
/** 자막(bottom) + 자막 높이(~65px). ContentArea의 하단 여백으로 사용. */
export const SUBTITLE_DEAD_ZONE = BOTTOM_MARGIN + 75;
const SECONDARY_SUBTITLE_GAP = 0;

// ── 컴포넌트: ContentArea ─────────────────────────────────────
/**
 * 자막 영역을 제외한 콘텐츠 전용 컨테이너.
 * 이 안의 position:absolute 요소들은 자막 위 공간을 기준으로 배치된다.
 * → 화면 수직 중앙이 자막 위 공간의 중앙과 일치하게 된다.
 * Thumbnail/Overview 씬(flex centering 사용)에는 사용하지 않는다.
 */
export const ContentArea: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { height } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: height - SUBTITLE_DEAD_ZONE,
        overflow: "visible",
      }}
    >
      {children}
    </div>
  );
};

// ── 컴포넌트: SceneTitle ───────────────────────────────────────
/** 씬 상단 제목 (예: "1. 변수 선언 (Declaration)") */
export const SceneTitle: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      left: 60,
      textAlign: "left",
      fontFamily: uiFont,
      fontSize: 42,
      fontWeight: 700,
      color: "#ffffff",
      letterSpacing: 1,
    }}
  >
    {title}
  </div>
);

// ── 컴포넌트: Subtitle ────────────────────────────────────────
/**
 * 씬 하단 자막.
 * - `speechStart` 프레임 전에는 숨김
 * - `splits` 기준으로 문장 전환
 * - `wordFrames` 전달 시 현재 발화 단어 노란색 하이라이팅
 */
export const Subtitle: React.FC<{
  sentences: string[];
  secondarySentences?: readonly string[];
  splits?: readonly number[];
  speechStart?: number;
  wordFrames?: readonly (readonly number[])[];
}> = ({
  sentences,
  secondarySentences,
  splits,
  speechStart = 0,
  wordFrames,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  if (frame < speechStart) return null;

  const starts = [speechStart, ...(splits ?? [])];
  const idx = starts.reduce((acc, s, i) => (frame >= s ? i : acc), 0);
  const displayText = toDisplayText(sentences[idx]);
  const secondaryText = secondarySentences?.[idx]
    ? toDisplayText(secondarySentences[idx])
    : null;
  const { subtitleMode } = getInputProps() as { subtitleMode?: SubtitleMode };
  const fallbackMode: SubtitleMode = secondaryText
    ? "bilingual"
    : "primary-only";
  const mode =
    subtitleMode === "secondary-only" && !secondaryText
      ? "primary-only"
      : (subtitleMode ?? fallbackMode);
  const primaryText = mode === "secondary-only" ? secondaryText : displayText;
  const showPrimary = Boolean(primaryText);
  const showSecondary = Boolean(secondaryText) && mode === "bilingual";
  const currentWordFrames = wordFrames?.[idx];

  const outerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: BOTTOM_MARGIN + 10,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  };

  const innerStyle: React.CSSProperties = {
    position: "relative",
    fontFamily: uiFont,
    color: "#ffffff",
    background: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    padding: "10px 20px",
    maxWidth: width - 80,
    whiteSpace: "pre-wrap",
  };

  const secondaryOuterStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: SECONDARY_SUBTITLE_GAP,
  };

  const secondaryStyle: React.CSSProperties = {
    fontFamily: uiFont,
    fontSize: 30,
    fontWeight: 600,
    lineHeight: 1.45,
    color: "rgba(255,255,255,0.92)",
    background: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    padding: "10px 18px",
    width: "100%",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
  };

  const renderSecondary = () =>
    showSecondary ? (
      <div style={secondaryOuterStyle}>
        <div style={secondaryStyle}>{secondaryText}</div>
      </div>
    ) : null;

  if (!showPrimary) return null;

  // wordFrames 없으면 기존 방식
  if (
    mode === "secondary-only" ||
    !currentWordFrames ||
    currentWordFrames.length === 0
  ) {
    return (
      <div style={outerStyle}>
        <div style={innerStyle}>
          <div style={{ fontSize: 42, lineHeight: 1.45 }}>{primaryText}</div>
          {renderSecondary()}
        </div>
      </div>
    );
  }

  // 현재 발화 중인 단어 인덱스
  const currentWordIdx = currentWordFrames.reduce(
    (acc, f, i) => (frame >= f ? i : acc),
    -1,
  );

  // 공백/줄바꿈 토큰 보존하며 분리
  const tokens = displayText.split(/(\s+)/);

  let wordIdx = 0;
  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        <div style={{ fontSize: 42, lineHeight: 1.45 }}>
          {tokens.map((token, i) => {
            if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;
            const thisWordIdx = wordIdx++;
            return (
              <span
                key={i}
                style={{
                  color: thisWordIdx === currentWordIdx ? "#fbbf24" : "#ffffff",
                }}
              >
                {token}
              </span>
            );
          })}
        </div>
        {renderSecondary()}
      </div>
    </div>
  );
};

// ── 유틸: calcDuration ────────────────────────────────────────
/**
 * 씬 durationInFrames 계산 — 오디오와 애니메이션 중 더 긴 쪽 반환 (헌법 6조)
 * @param audioDurationInFrames  AUDIO_CONFIG.scene.durationInFrames
 * @param animEndFrame           애니메이션 마지막 프레임 번호 (씬 기준 상대값)
 * @param cross                  크로스페이드 프레임 (기본: CROSS=20)
 * @param tail                   오디오 후 여유 프레임 (기본: SCENE_TAIL_FRAMES=15)
 */
export function calcDuration(
  audioDurationInFrames: number,
  animEndFrame: number,
  {
    cross = CROSS,
    tail = SCENE_TAIL_FRAMES,
  }: { cross?: number; tail?: number } = {},
): number {
  return Math.max(audioDurationInFrames, animEndFrame + cross + tail);
}

// ── 컴포넌트: TypingCodeLine ─────────────────────────────────
/** 타이핑 애니메이션이 적용된 한 줄 코드 */
export const TypingCodeLine: React.FC<{
  text: string;
  startFrame: number;
  cps?: number;
  color?: string;
  lineHeight?: string | number;
}> = ({
  text,
  startFrame,
  cps = CHARS_PER_SEC,
  color = "#d4d4d4",
  lineHeight = "1.9",
}) => {
  const { visibleText } = useTypingEffect(text, startFrame, cps);
  return (
    <div style={{ lineHeight, color, whiteSpace: "pre" }}>
      <JavaLine text={visibleText} />
    </div>
  );
};

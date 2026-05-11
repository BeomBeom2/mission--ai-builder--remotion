// src/compositions/001-Java-Basic/008-JavaWhile.tsx
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import React from "react";

import { FPS, SCENE_TAIL_FRAMES } from "../../../config";
import { JavaLine } from "../../../utils/code";
import {
  CODE,
  CROSS,
  ContentArea,
  FONT,
  SceneAudio,
  SceneTitle,
  Subtitle,
  THUMB_CROSS,
  calcTypingEndFrame,
  computeLineVisibility,
  monoStyle,
  uiFont,
  useFade,
} from "../../../utils/scene";
import {
  SrtEntry,
  SrtTracks,
  buildSrtData,
  computeFromValues,
  localizeSrtData,
} from "../../../utils/srt";
import { TreeDiagram, TreeNode } from "../../../utils/tree";
import { CONTENT as ENG_CONTENT } from "../ENG/008-2-content";
import { CONTENT } from "./008-2-content";
import { AUDIO_CONFIG } from "./008-3-audio.gen";
import { BG } from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── 색상 상수 ─────────────────────────────────────────────────
const C_WHILE = "#c586c0"; // while 키워드 — 보라
const C_COND = "#e5c07b"; // 조건식 — amber
const C_TEAL = "#4ec9b0"; // 카운터/증감/참 — teal
const C_RED = "#f47c7c"; // 거짓/경고
const C_NUM = "#b5cea8"; // 숫자 리터럴
const C_INT = "#4e9cd5"; // int 키워드

// ── WhileScene 타이핑 애니메이션 완료 프레임 ─────────────────────
// CODE_LINES 전체 글자(77자) + 줄바꿈(4자) = 81자, 10자/초, 60fps
// durationInFrames = max(오디오, 타이핑완료 + CROSS + SCENE_TAIL_FRAMES)
const WHILE_TYPING_CHARS = 81; // FULL_CODE.length
const WHILE_CHARS_PER_SEC_CONST = 10;
const WHILE_TYPING_END = calcTypingEndFrame(
  WHILE_TYPING_CHARS,
  AUDIO_CONFIG.whileScene.speechStartFrame,
  FPS,
  WHILE_CHARS_PER_SEC_CONST,
);
const WHILE_SCENE_DURATION = Math.max(
  AUDIO_CONFIG.whileScene.durationInFrames,
  WHILE_TYPING_END + CROSS + SCENE_TAIL_FRAMES,
);

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  overview: {
    audio: "while-overview.mp3",
    durationInFrames: AUDIO_CONFIG.overview.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.overview.speechStartFrame,
    narration: CONTENT.overview.narration as string[],
    narrationSplits: AUDIO_CONFIG.overview.narrationSplits,
  },
  intro: {
    audio: "while-intro.mp3",
    durationInFrames: AUDIO_CONFIG.intro.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
    narration: CONTENT.intro.narration as string[],
    narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
  },
  whileScene: {
    audio: "while-while.mp3",
    durationInFrames: WHILE_SCENE_DURATION,
    speechStartFrame: AUDIO_CONFIG.whileScene.speechStartFrame,
    narration: CONTENT.whileScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.whileScene.narrationSplits,
  },
  executionScene: {
    audio: "while-execution.mp3",
    durationInFrames: AUDIO_CONFIG.executionScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.executionScene.speechStartFrame,
    narration: CONTENT.executionScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.executionScene.narrationSplits,
  },
  infiniteScene: {
    audio: "while-infinite.mp3",
    durationInFrames: AUDIO_CONFIG.infiniteScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.infiniteScene.speechStartFrame,
    narration: CONTENT.infiniteScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.infiniteScene.narrationSplits,
  },
  summaryScene: {
    audio: "while-summary.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
};

// ── 스텁 씬 컴포넌트 — 다음 태스크에서 완전히 구현 ───────────
const ThumbnailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [60 - THUMB_CROSS, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "#050510",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        opacity: fadeOut,
      }}
    >
      {/* 배경 글로우 */}
      <div
        style={{
          position: "absolute",
          width: 860,
          height: 860,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(78,201,176,0.12) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 26,
          fontWeight: 700,
          color: "#4ec9b0",
          letterSpacing: 10,
          opacity: 0.8,
        }}
      >
        JAVA
      </div>
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 108,
          fontWeight: 900,
          lineHeight: 1,
          textAlign: "center",
          color: "#fff",
          textShadow:
            "0 0 60px rgba(78,201,176,0.6), 0 0 120px rgba(78,201,176,0.3)",
        }}
      >
        Java
        <br />
        <span style={{ color: "#4ec9b0" }}>반복문</span>
      </div>
      {/* while 키워드 */}
      <div
        style={{
          ...monoStyle,
          fontSize: 64,
          fontWeight: 900,
          color: "#4ec9b0",
          background: "#4ec9b018",
          border: "2px solid #4ec9b055",
          borderRadius: 18,
          padding: "18px 56px",
          marginTop: 8,
        }}
      >
        while
      </div>
    </AbsoluteFill>
  );
};

const OverviewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { overview: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const opacity = useFade(d, { in: true });

  const rootAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const leftAppear = spring({
    frame: frame - s - 20,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const rightAppear = spring({
    frame: frame - s - 40,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const whileAppear = spring({
    frame: frame - AUDIO_CONFIG.overview.wordTiming["while"][0],
    fps,
    config: { damping: 12, stiffness: 160 },
    durationInFrames: 44,
  });

  const treeData: TreeNode = {
    label: "제어문",
    color: "#9cdcfe",
    appear: rootAppear,
    children: [
      {
        label: "조건문",
        color: "#c586c0",
        dim: true,
        appear: leftAppear,
      },
      {
        label: "반복문",
        color: "#4ec9b0",
        appear: rightAppear,
        children: [
          {
            label: "while",
            color: C_WHILE,
            mono: true,
            fontSize: 44,
            appear: whileAppear,
            glow: true,
          },
        ],
      },
    ],
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 반복문 개요" />

          <div
            style={{
              position: "absolute",
              top: "38%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <TreeDiagram
              data={treeData}
              width={800}
              height={420}
              leafSpacing={240}
            />
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.overview.wordStartFrames}
      />
    </>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { intro: cfg } = VIDEO_CONFIG;
  const opacity = useFade(cfg.durationInFrames);

  const blockAppear = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 56,
  });
  const sc = interpolate(blockAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. while 문이란?" />
          <div
            style={{
              position: "absolute",
              top: "44%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${sc})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              opacity: blockAppear,
            }}
          >
            {/* while (조건) { 실행코드 } — 단일 컨테이너 */}
            <div
              style={{
                ...monoStyle,
                background: "#252525",
                borderRadius: 16,
                padding: "28px 52px",
                border: "2px solid #3a3a3a",
                lineHeight: 1.9,
              }}
            >
              <div style={{ fontSize: 42 }}>
                <span style={{ color: C_WHILE, fontWeight: 900 }}>while</span>
                <span style={{ color: "#d4d4d4" }}> (</span>
                <span style={{ color: C_COND, fontWeight: 900 }}>조건</span>
                <span style={{ color: "#d4d4d4" }}>) {"{"}</span>
              </div>
              <div
                style={{
                  fontSize: 38,
                  paddingLeft: 44,
                  color: "#888",
                  fontStyle: "italic",
                }}
              >
                실행코드
              </div>
              <div style={{ fontSize: 42, color: "#d4d4d4" }}>{"}"}</div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={AUDIO_CONFIG.intro.wordStartFrames}
      />
    </>
  );
};

// ── 코드 라인 데이터 ──────────────────────────────────────────
const CODE_LINES = [
  {
    parts: [
      { text: "int", color: C_INT },
      { text: " count = ", color: "#d4d4d4" },
      { text: "1", color: C_NUM },
      { text: ";", color: "#d4d4d4" },
    ],
  },
  {
    parts: [
      { text: "while", color: C_WHILE, bold: true },
      { text: " (", color: "#d4d4d4" },
      { text: "count <= 5", color: C_COND },
      { text: ") {", color: "#d4d4d4" },
    ],
  },
  {
    parts: [
      { text: "    System", color: C_INT },
      { text: ".out.", color: "#d4d4d4" },
      { text: "println", color: "#dcdcaa" },
      { text: "(", color: "#d4d4d4" },
      { text: "count", color: "#d4d4d4" },
      { text: ");", color: "#d4d4d4" },
    ],
  },
  {
    parts: [
      { text: "    count++", color: C_TEAL },
      { text: ";", color: "#d4d4d4" },
    ],
  },
  { parts: [{ text: "}", color: "#d4d4d4" }] },
] as const;

const FULL_CODE = CODE_LINES.map((l) =>
  l.parts.map((p) => p.text).join(""),
).join("\n");
const TOTAL_CHARS = FULL_CODE.length; // = WHILE_TYPING_CHARS (81)

const WhileScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { whileScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const [split0 = Infinity] = cfg.narrationSplits as readonly number[];
  const opacity = useFade(d);

  // 타이핑 애니메이션
  const charsVisible = Math.min(
    TOTAL_CHARS,
    Math.max(0, ((frame - s) / fps) * WHILE_CHARS_PER_SEC_CONST),
  );

  const lineVisibility = computeLineVisibility(
    CODE_LINES,
    charsVisible,
    (line) => line.parts.reduce((acc, p) => acc + p.text.length, 0),
  );

  const blockAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 48,
  });
  const sc = interpolate(blockAppear, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const incrementExplainAppear = spring({
    frame:
      frame - (AUDIO_CONFIG.whileScene.wordTiming["증가시켜"]?.[0] ?? split0),
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 40,
  });
  const slideY = (a: number) =>
    `translateY(${interpolate(a, [0, 1], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`;

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. while 문법" />
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "46%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${sc})`,
              }}
            >
              <div
                style={{
                  ...monoStyle,
                  fontSize: CODE.xl,
                  lineHeight: 1.95,
                  background: "#252525",
                  borderRadius: 20,
                  padding: "32px 48px",
                  opacity: blockAppear,
                  width: 860,
                  boxShadow: "0 6px 40px rgba(0,0,0,0.45)",
                  whiteSpace: "pre",
                }}
              >
                {CODE_LINES.map((line, lineIdx) => {
                  const showChars = lineVisibility[lineIdx];
                  const isCountPlusPlus =
                    lineIdx === 3 &&
                    frame >=
                      (AUDIO_CONFIG.whileScene.wordTiming["조건을"][1] ??
                        split0);
                  let rem = showChars;
                  return (
                    <div key={lineIdx} style={{ lineHeight: 1.95 }}>
                      {line.parts.map((part, pi) => {
                        const show = Math.min(part.text.length, rem);
                        rem = Math.max(0, rem - part.text.length);
                        if (show <= 0) return null;
                        const highlighted = isCountPlusPlus && pi === 0;
                        return (
                          <span
                            key={pi}
                            style={{
                              color: highlighted ? C_TEAL : part.color,
                              fontWeight: (part as { bold?: boolean }).bold
                                ? 900
                                : undefined,
                              background: highlighted
                                ? `${C_TEAL}18`
                                : undefined,
                              borderRadius: highlighted ? 4 : undefined,
                              padding: highlighted ? "0 4px" : undefined,
                            }}
                          >
                            {part.text.slice(0, show)}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    color: C_TEAL,
                    background: `${C_TEAL}18`,
                    border: `2px solid ${C_TEAL}55`,
                    borderRadius: 12,
                    padding: "10px 20px",
                    opacity: incrementExplainAppear,
                    transform: slideY(incrementExplainAppear),
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      ...monoStyle,
                      fontSize: CODE.lg,
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    <JavaLine text="count++" /> 와{" "}
                    <JavaLine text="count = count + 1" />
                    <br />은 같은 표현, count를 1 증가
                  </div>
                </div>
              </div>
            </div>
          )}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.whileScene.wordStartFrames}
      />
    </>
  );
};

const EXEC_STEPS = [
  { count: 1, condPass: true, output: ["1"] },
  { count: 2, condPass: true, output: ["1", "2"] },
  { count: 3, condPass: true, output: ["1", "2", "3"] },
  { count: 4, condPass: true, output: ["1", "2", "3", "4"] },
  { count: 5, condPass: true, output: ["1", "2", "3", "4", "5"] },
  { count: 6, condPass: false, output: ["1", "2", "3", "4", "5"] },
] as const;

const ExecutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { executionScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const opacity = useFade(d);

  // Step timing: 각 narration 문장 = 각 반복 1단계 (0~5)
  const splits = cfg.narrationSplits as readonly number[];
  let stepIdx = 0;
  if (frame >= s) {
    stepIdx = splits.length; // 기본: 마지막 단계
    for (let i = 0; i < splits.length; i++) {
      if (frame < splits[i]) {
        stepIdx = i;
        break;
      }
    }
  }

  const step = EXEC_STEPS[stepIdx];

  // count 숫자 spring — 단계 전환마다 bounce
  const stepStartFrame = stepIdx === 0 ? s : splits[stepIdx - 1];
  const countSpring = spring({
    frame: frame - stepStartFrame,
    fps,
    config: { damping: 14, stiffness: 180 },
    durationInFrames: 36,
  });

  // condPass=false(count=6)일 때만 조건 줄 강조
  const activeLineIsCondition = !step.condPass;

  // 조건 하이라이트 — "참" 발화 시 count <= 5 span에 amber glow
  const COND_TRUE_FRAMES: Record<number, number> = {
    0: AUDIO_CONFIG.executionScene.wordTiming["참이므로"][0], // 51
    1: AUDIO_CONFIG.executionScene.wordTiming["참이므로"][1], // 186
    2: AUDIO_CONFIG.executionScene.wordTiming["참입니다"][0], // 304
    3: AUDIO_CONFIG.executionScene.wordTiming["마찬가지입니다"][0], // 370
    4: AUDIO_CONFIG.executionScene.wordTiming["참인"][0], // 467
  };

  // 출력 로그 — "실행" 발화 시점 이후에만 표시
  const EXEC_FRAMES: Record<number, number> = {
    0: AUDIO_CONFIG.executionScene.wordTiming["실행하고"][0],
    1: AUDIO_CONFIG.executionScene.wordTiming["실행합니다"][0],
    2: AUDIO_CONFIG.executionScene.wordTiming["참입니다"][0],
    3: AUDIO_CONFIG.executionScene.wordTiming["마찬가지입니다"][0],
    4: AUDIO_CONFIG.executionScene.wordTiming["실행입니다"][0],
  };
  const OUTPUT_DELAY = 20; // 조건 하이라이트 후 약간 딜레이
  const showOutput =
    step.condPass && frame >= (EXEC_FRAMES[stepIdx] ?? Infinity) + OUTPUT_DELAY;
  const condHLStart = step.condPass
    ? (COND_TRUE_FRAMES[stepIdx] ?? Infinity)
    : Infinity;
  const condHL = interpolate(
    frame - condHLStart,
    [0, 12, 44, 76],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. while 실행 흐름" />

          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "48%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                width: 920,
              }}
            >
              {/* 상단: 코드 패널 */}
              <div
                style={{
                  ...monoStyle,
                  fontSize: CODE.xl,
                  lineHeight: 2.0,
                  background: "#252525",
                  borderRadius: 16,
                  padding: "20px 8px",
                }}
              >
                {/* int count = 1; — 모든 줄에 동일한 borderLeft(transparent) + paddingLeft 적용으로 인덴트 통일 */}
                <div
                  style={{
                    borderLeft: "3px solid transparent",
                    paddingLeft: 16,
                    color: "#d4d4d4",
                  }}
                >
                  <span style={{ color: C_INT }}>int</span>
                  <span> count = </span>
                  <span style={{ color: C_NUM }}>1</span>
                  <span>;</span>
                </div>
                {/* while 조건 줄 */}
                <div
                  style={{
                    borderLeft: activeLineIsCondition
                      ? `3px solid ${C_COND}`
                      : "3px solid transparent",
                    paddingLeft: 16,
                    background: activeLineIsCondition
                      ? `${C_COND}22`
                      : "transparent",
                    borderRadius: "0 6px 6px 0",
                  }}
                >
                  <span style={{ color: C_WHILE, fontWeight: 900 }}>while</span>
                  <span style={{ color: "#d4d4d4" }}> (</span>
                  <span
                    style={{
                      color: C_COND,
                      background: `rgba(229,192,123,${condHL * 0.38})`,
                      borderRadius: 4,
                      padding: "1px 5px",
                      margin: "0 -5px",
                    }}
                  >
                    count {"<="} 5
                  </span>
                  <span style={{ color: "#d4d4d4" }}>) {"{"}</span>
                </div>
                {/* println 줄 — 인덴트: 16(base) + 40(indent) = 56 */}
                <div
                  style={{
                    borderLeft:
                      !activeLineIsCondition && step.condPass
                        ? `3px solid ${C_TEAL}`
                        : "3px solid transparent",
                    paddingLeft: 56,
                    background:
                      !activeLineIsCondition && step.condPass
                        ? `${C_TEAL}18`
                        : "transparent",
                    borderRadius: "0 6px 6px 0",
                  }}
                >
                  <span style={{ color: C_INT }}>System</span>
                  <span style={{ color: "#d4d4d4" }}>.out.</span>
                  <span style={{ color: "#dcdcaa" }}>println</span>
                  <span style={{ color: "#d4d4d4" }}>(count);</span>
                </div>
                {/* count++ */}
                <div
                  style={{
                    borderLeft: "3px solid transparent",
                    paddingLeft: 56,
                    color: C_TEAL,
                  }}
                >
                  count++;
                </div>
                {/* } */}
                <div
                  style={{
                    borderLeft: "3px solid transparent",
                    paddingLeft: 16,
                    color: "#d4d4d4",
                  }}
                >
                  {"}"}
                </div>
              </div>

              {/* 하단: 상태 패널 */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* count 박스 */}
                <div
                  style={{
                    background: "#2a2a2a",
                    borderRadius: 16,
                    padding: "20px 32px",
                    border: `2px solid ${step.condPass ? C_TEAL : C_RED}55`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      color: "#d4d4d4",
                      fontSize: CODE.xl,
                    }}
                  >
                    count =
                  </span>
                  <span
                    style={{
                      ...monoStyle,
                      color: step.condPass ? C_TEAL : C_RED,
                      fontSize: 52,
                      fontWeight: 900,
                      display: "inline-block",
                      transform: `scale(${interpolate(countSpring, [0, 1], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                    }}
                  >
                    {step.count}
                  </span>
                </div>

                {/* 조건 배지 */}
                <div
                  style={{
                    background: step.condPass ? `${C_TEAL}18` : `${C_RED}18`,
                    border: `2px solid ${step.condPass ? C_TEAL : C_RED}66`,
                    borderRadius: 14,
                    padding: "14px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      color: C_COND,
                      fontSize: CODE.lg,
                    }}
                  >
                    count {"<="} 5
                  </span>
                  <span style={{ fontSize: 30 }}>
                    {step.condPass ? "✓" : "✗"}
                  </span>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: 24,
                      color: step.condPass ? C_TEAL : C_RED,
                      fontWeight: 700,
                    }}
                  >
                    {step.condPass ? "참" : "거짓"}
                  </span>
                </div>

                {/* 출력 로그 — 이전 출력은 유지, 현재 숫자는 "실행" 발화 시 추가 */}
                <div
                  style={{
                    background: "#252525",
                    borderRadius: 14,
                    padding: "16px 28px",
                    ...monoStyle,
                    fontSize: CODE.lg,
                    opacity: stepIdx > 0 || showOutput ? 1 : 0,
                  }}
                >
                  <div
                    style={{
                      color: "#888",
                      fontSize: FONT.label,
                      marginBottom: 8,
                      fontFamily: uiFont,
                    }}
                  >
                    출력
                  </div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {(step.output as readonly string[]).map((n, i) => {
                      const isNew =
                        step.condPass &&
                        i === (step.output as readonly string[]).length - 1;
                      const execFrame =
                        (EXEC_FRAMES[stepIdx] ?? Infinity) + OUTPUT_DELAY;
                      const highlight =
                        isNew && showOutput
                          ? interpolate(frame - execFrame, [0, 60], [1, 0], {
                              extrapolateLeft: "clamp",
                              extrapolateRight: "clamp",
                            })
                          : 0;
                      return (
                        <span
                          key={i}
                          style={{
                            color: isNew && highlight > 0 ? C_TEAL : C_NUM,
                            opacity: isNew && !showOutput ? 0 : 1,
                            textShadow:
                              highlight > 0
                                ? `0 0 ${highlight * 12}px ${C_TEAL}aa`
                                : "none",
                            fontWeight: highlight > 0 ? 900 : 400,
                          }}
                        >
                          {n}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.executionScene.wordStartFrames}
      />
    </>
  );
};

const InfiniteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { infiniteScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const opacity = useFade(d);

  const MUHANROOP_FRAME = AUDIO_CONFIG.infiniteScene.wordTiming["됩니다"][0]; // "무한루프"
  const blockAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 48,
  });
  const warnAppear = spring({
    frame: frame - MUHANROOP_FRAME,
    fps,
    config: { damping: 10, stiffness: 160 },
    durationInFrames: 40,
  });
  const infAppear = spring({
    frame: frame - MUHANROOP_FRAME - 20,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 44,
  });

  // 펄싱 — interpolate 패턴 (CSS animation 금지)
  const pulse = Math.abs(Math.sin(frame * 0.1));
  const borderOpacity = interpolate(pulse, [0, 1], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowSize = interpolate(pulse, [0, 1], [8, 28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 무한 루프" />

          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              {/* 코드 블록 — 펄싱 빨간 테두리 */}
              <div
                style={{
                  ...monoStyle,
                  fontSize: CODE.xl,
                  lineHeight: 1.95,
                  background: "#252525",
                  borderRadius: 20,
                  padding: "32px 48px",
                  opacity: blockAppear,
                  border: `2px solid rgba(244, 124, 124, ${borderOpacity})`,
                  boxShadow: `0 0 ${glowSize}px rgba(244,124,124,0.35)`,
                  width: 820,
                }}
              >
                <div>
                  <span style={{ color: C_INT }}>int</span>
                  <span style={{ color: "#d4d4d4" }}> count = </span>
                  <span style={{ color: C_NUM }}>1</span>
                  <span style={{ color: "#d4d4d4" }}>;</span>
                </div>
                <div>
                  <span style={{ color: C_WHILE, fontWeight: 900 }}>while</span>
                  <span style={{ color: "#d4d4d4" }}> (</span>
                  <span style={{ color: C_COND }}>count {"<="} 5</span>
                  <span style={{ color: "#d4d4d4" }}>) {"{"}</span>
                </div>
                <div style={{ paddingLeft: 40 }}>
                  <span style={{ color: C_INT }}>System</span>
                  <span style={{ color: "#d4d4d4" }}>.out.</span>
                  <span style={{ color: "#dcdcaa" }}>println</span>
                  <span style={{ color: "#d4d4d4" }}>(count);</span>
                </div>
                {/* count++ 없는 자리 — 빨간 취소선 강조 */}
                <div style={{ paddingLeft: 40 }}>
                  <span
                    style={{
                      color: C_RED,
                      fontSize: CODE.lg,
                      opacity: 0.75,
                      textDecoration: "line-through",
                    }}
                  >
                    {"// count++ 없음!"}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#d4d4d4" }}>{"}"}</span>
                </div>
              </div>

              {/* phase2: ⚠️ + ∞ 무한루프 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: warnAppear,
                  transform: `scale(${interpolate(warnAppear, [0, 1], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                }}
              >
                <span style={{ fontSize: 48 }}>⚠️</span>
                <span
                  style={{
                    fontFamily: uiFont,
                    fontSize: 40,
                    fontWeight: 900,
                    color: C_RED,
                    opacity: infAppear,
                  }}
                >
                  ∞ 무한루프
                </span>
              </div>
            </div>
          )}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.infiniteScene.wordStartFrames}
      />
    </>
  );
};

const SUMMARY_CARDS = [
  {
    emoji: "🔁",
    label: "조건 참",
    color: C_TEAL,
    desc: "블록 실행 후 조건 재확인",
  },
  { emoji: "⛔", label: "조건 거짓", color: C_RED, desc: "반복 종료" },
] as const;

const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false }); // 마지막 씬 — fadeOut 없음

  const codeAppear = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 52,
  });
  const codeSc = interpolate(codeAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="6. while 정리" />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: 880,
            }}
          >
            {/* while 코드 정적 표시 */}
            <div
              style={{
                ...monoStyle,
                fontSize: CODE.xl,
                lineHeight: 1.9,
                background: "#252525",
                borderRadius: 16,
                padding: "24px 40px",
                opacity: codeAppear,
                transform: `scale(${codeSc})`,
              }}
            >
              <div>
                <span style={{ color: C_INT }}>int</span>
                <span style={{ color: "#d4d4d4" }}> count = </span>
                <span style={{ color: C_NUM }}>1</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </div>
              <div>
                <span style={{ color: C_WHILE, fontWeight: 900 }}>while</span>
                <span style={{ color: "#d4d4d4" }}> (</span>
                <span style={{ color: C_COND }}>count {"<="} 5</span>
                <span style={{ color: "#d4d4d4" }}>) {"{"}</span>
              </div>
              <div style={{ paddingLeft: 56 }}>
                <span style={{ color: C_INT }}>System</span>
                <span style={{ color: "#d4d4d4" }}>.out.</span>
                <span style={{ color: "#dcdcaa" }}>println</span>
                <span style={{ color: "#d4d4d4" }}>(count);</span>
              </div>
              <div style={{ paddingLeft: 56 }}>
                <span style={{ color: C_TEAL }}>count++</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </div>
              <div>
                <span style={{ color: "#d4d4d4" }}>{"}"}</span>
              </div>
            </div>

            {/* 요약 카드 */}
            {SUMMARY_CARDS.map((card, i) => {
              const triggerFrame =
                i === 0
                  ? (AUDIO_CONFIG.summaryScene.wordTiming["while은"]?.[0] ??
                    cfg.speechStartFrame)
                  : (AUDIO_CONFIG.summaryScene.wordTiming["거짓이"]?.[0] ??
                    cfg.narrationSplits[0] ??
                    cfg.speechStartFrame);
              const appear = spring({
                frame: frame - triggerFrame,
                fps,
                config: { damping: 13, stiffness: 140 },
                durationInFrames: 52,
              });
              const sc = interpolate(appear, [0, 1], [0.85, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    background: "#2a2a2a",
                    border: `2px solid ${card.color}55`,
                    borderRadius: 18,
                    padding: "22px 36px",
                    opacity: appear,
                    transform: `scale(${sc})`,
                  }}
                >
                  <span style={{ fontSize: 34 }}>{card.emoji}</span>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: 30,
                      fontWeight: 900,
                      color: card.color,
                      minWidth: 110,
                    }}
                  >
                    {card.label}
                  </span>
                  <span style={{ color: "#3a3a3a", fontSize: 26 }}>—</span>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: 28,
                      color: "#d4d4d4",
                    }}
                  >
                    {card.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={AUDIO_CONFIG.summaryScene.wordStartFrames}
      />
    </>
  );
};

// ── sceneList + fromValues ────────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.overview,
  VIDEO_CONFIG.intro,
  VIDEO_CONFIG.whileScene,
  VIDEO_CONFIG.executionScene,
  VIDEO_CONFIG.infiniteScene,
  VIDEO_CONFIG.summaryScene,
];
const sceneDurations = sceneList.map((s) => s.durationInFrames);
const fromValues = computeFromValues(sceneDurations, {
  cross: CROSS,
  firstOverlap: THUMB_CROSS,
});
const totalDuration =
  fromValues[fromValues.length - 1] + sceneDurations[sceneDurations.length - 1];

// ── SRT 데이터 (scripts/srt.ts 에서 사용) ────────────────────
/** 절대 프레임 기준 자막 큐 목록 — srt.ts가 읽어서 .srt 파일 생성 */
export const SRT_DATA: SrtEntry[] = (() => {
  const froms = computeFromValues(sceneDurations, {
    cross: CROSS,
    firstOverlap: THUMB_CROSS,
  });
  return buildSrtData([
    {
      offset: froms[1],
      narration: VIDEO_CONFIG.overview.narration,
      speechStartFrame: AUDIO_CONFIG.overview.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.overview.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.overview.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.overview.durationInFrames,
    },
    {
      offset: froms[2],
      narration: VIDEO_CONFIG.intro.narration,
      speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.intro.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.intro.durationInFrames,
    },
    {
      offset: froms[3],
      narration: VIDEO_CONFIG.whileScene.narration,
      speechStartFrame: AUDIO_CONFIG.whileScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.whileScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.whileScene.sentenceEndFrames,
      sceneDuration: WHILE_SCENE_DURATION,
    },
    {
      offset: froms[4],
      narration: VIDEO_CONFIG.executionScene.narration,
      speechStartFrame: AUDIO_CONFIG.executionScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.executionScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.executionScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.executionScene.durationInFrames,
    },
    {
      offset: froms[5],
      narration: VIDEO_CONFIG.infiniteScene.narration,
      speechStartFrame: AUDIO_CONFIG.infiniteScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.infiniteScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.infiniteScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.infiniteScene.durationInFrames,
    },
    {
      offset: froms[6],
      narration: VIDEO_CONFIG.summaryScene.narration,
      speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.summaryScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
    },
  ]);
})();

export const SRT_DATA_EN: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...ENG_CONTENT.overview.narration,
  ...ENG_CONTENT.intro.narration,
  ...ENG_CONTENT.whileScene.narration,
  ...ENG_CONTENT.executionScene.narration,
  ...ENG_CONTENT.infiniteScene.narration,
  ...ENG_CONTENT.summaryScene.narration,
]);

export const SRT_TRACKS: SrtTracks = {
  "ko-KR": SRT_DATA,
  "en-US": SRT_DATA_EN,
};

// ── Composition 메타 ──────────────────────────────────────────
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export const JavaWhile: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.overview.durationInFrames}
    >
      <OverviewScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.intro.durationInFrames}
    >
      <IntroScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.whileScene.durationInFrames}
    >
      <WhileScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.executionScene.durationInFrames}
    >
      <ExecutionScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.infiniteScene.durationInFrames}
    >
      <InfiniteScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaWhile;

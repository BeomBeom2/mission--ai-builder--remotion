// src/compositions/001-Java-Basic/KOR/010-1-JavaFunction.tsx
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
  CodeBlock,
  ContentArea,
  FONT,
  SceneAudio,
  SceneTitle,
  Subtitle,
  THUMB_CROSS,
  TypingCodeLine,
  monoStyle,
  uiFont,
  useFade,
  useTypingEffect,
} from "../../../utils/scene";
import {
  SrtEntry,
  SrtTracks,
  buildSrtData,
  computeFromValues,
  localizeSrtData,
} from "../../../utils/srt";
import { CONTENT as KOR_CONTENT } from "../KOR/010-2-content";
import { CONTENT } from "./010-2-content";
import { AUDIO_CONFIG } from "./010-3-audio.gen";
import {
  BG,
  BG_THUMB,
  C_FUNC,
  C_KEYWORD,
  C_NUMBER,
  C_PAIN,
  C_PURPLE,
  C_STRING,
  C_TEAL,
  C_VAR,
  TEXT,
} from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── PainScene duration 계산 (VIDEO_CONFIG 앞에 선언) ────────────
const PAIN_LINES = [
  'System.out.println("Hello Mike");',
  "// ...",
  'System.out.println("Hello Mike");',
  "// ...",
  'System.out.println("Hello Mike");',
  "// ...",
  'System.out.println("Hello Mike");',
  "// ...",
  'System.out.println("Hello Mike");',
];
const PAIN_CPS = 28;
const REPLACE_DUR = 60;
const REPLACE_GAP = 40;

const PAIN_TYPING_END = (() => {
  let f = AUDIO_CONFIG.painScene.speechStartFrame;
  for (const line of PAIN_LINES) f += Math.ceil((line.length / PAIN_CPS) * FPS);
  return f;
})();
const PAIN_REPLACE_END =
  Math.max(AUDIO_CONFIG.painScene.narrationSplits[0] ?? 0, PAIN_TYPING_END) +
  REPLACE_GAP * 4 +
  REPLACE_DUR;
const PAIN_SCENE_DURATION = Math.max(
  AUDIO_CONFIG.painScene.durationInFrames,
  PAIN_REPLACE_END + CROSS + SCENE_TAIL_FRAMES,
);

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  painScene: {
    audio: "fn-pain.mp3",
    durationInFrames: PAIN_SCENE_DURATION,
    speechStartFrame: AUDIO_CONFIG.painScene.speechStartFrame,
    narration: CONTENT.painScene.narration as string[],
    subtitleKo: KOR_CONTENT.painScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.painScene.narrationSplits,
  },
  conceptScene: {
    audio: "fn-concept.mp3",
    durationInFrames: AUDIO_CONFIG.conceptScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.conceptScene.speechStartFrame,
    narration: CONTENT.conceptScene.narration as string[],
    subtitleKo: KOR_CONTENT.conceptScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.conceptScene.narrationSplits,
  },
  declarationScene: {
    audio: "fn-declare.mp3",
    durationInFrames: AUDIO_CONFIG.declarationScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.declarationScene.speechStartFrame,
    narration: CONTENT.declarationScene.narration as string[],
    subtitleKo: KOR_CONTENT.declarationScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.declarationScene.narrationSplits,
  },
  callScene: {
    audio: "fn-call.mp3",
    durationInFrames: AUDIO_CONFIG.callScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.callScene.speechStartFrame,
    narration: CONTENT.callScene.narration as string[],
    subtitleKo: KOR_CONTENT.callScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.callScene.narrationSplits,
  },
  summaryScene: {
    audio: "fn-summary.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    subtitleKo: KOR_CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
  comparisonScene: {
    audio: "fn-compare.mp3",
    durationInFrames: AUDIO_CONFIG.comparisonScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.comparisonScene.speechStartFrame,
    narration: CONTENT.comparisonScene.narration as string[],
    subtitleKo: KOR_CONTENT.comparisonScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.comparisonScene.narrationSplits,
  },
  realExampleScene: {
    audio: "fn-real.mp3",
    durationInFrames: AUDIO_CONFIG.realExampleScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.realExampleScene.speechStartFrame,
    narration: CONTENT.realExampleScene.narration as string[],
    subtitleKo: KOR_CONTENT.realExampleScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.realExampleScene.narrationSplits,
  },
  outroScene: {
    audio: "fn-outro.mp3",
    durationInFrames: AUDIO_CONFIG.outroScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.outroScene.speechStartFrame,
    narration: CONTENT.outroScene.narration as string[],
    subtitleKo: KOR_CONTENT.outroScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.outroScene.narrationSplits,
  },
} as const;

// ── 씬: ThumbnailScene — 006 스타일 통일 ─────────────────────
// 색상 통일: "Java" = C_FUNC(노란색), "Functions" = 흰색, JAVA 라벨 = 흰색(저채도)
// 배지 = 선언 void greet() / 사용 greet();
const ThumbnailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [60 - THUMB_CROSS, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: BG_THUMB,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        opacity: fadeOut,
      }}
    >
      {/* 배경 글로우 원 */}
      <div
        style={{
          position: "absolute",
          width: 860,
          height: 860,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C_TEAL}1e 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* JAVA 라벨 */}
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 26,
          fontWeight: 700,
          color: C_TEAL,
          letterSpacing: 10,
          opacity: 0.8,
        }}
      >
        JAVA
      </div>
      {/* 메인 타이틀: Java(흰색) + Functions(teal) — 다른 에피소드와 통일 */}
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 108,
          fontWeight: 900,
          lineHeight: 1,
          textAlign: "center",
          color: "#ffffff",
          textShadow: `0 0 60px ${C_TEAL}99, 0 0 120px ${C_TEAL}44`,
        }}
      >
        Java
        <br />
        <span style={{ color: C_TEAL }}>Functions</span>
      </div>
      {/* 배지 2개: Function Declaration / Functions 사용 */}
      <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
        {["Declare", "Call"].map((label) => (
          <div
            key={label}
            style={{
              fontFamily: uiFont,
              fontSize: 44,
              fontWeight: 900,
              color: C_TEAL,
              background: `${C_TEAL}18`,
              border: `2px solid ${C_TEAL}55`,
              borderRadius: 18,
              padding: "18px 44px",
              textAlign: "center",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 씬: PainScene ─────────────────────────────────────────────

// "Mike" → 공백 → "Chris" 교체 애니메이션
// phase 0→0.5: Mike → 공백, 0.5→1: 공백 → Chris
function getReplaceWord(progress: number): { text: string; blank: boolean } {
  if (progress <= 0) return { text: "Mike", blank: false };
  if (progress >= 1) return { text: "Chris", blank: false };
  if (progress < 0.5) return { text: "　　", blank: true }; // 전각 공백 2자 (폭 유지)
  return { text: "Chris", blank: false };
}

// println 줄: 타이핑 후 Mike→공백→Chris 교체 + 하이라이트 사각형
const PainPrintlnLine: React.FC<{
  startFrame: number;
  replaceStart: number;
}> = ({ startFrame, replaceStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(
    frame,
    [replaceStart, replaceStart + REPLACE_DUR],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const { text: word, blank } = getReplaceWord(progress);

  // 하이라이트 사각형: 교체 진행 중일 때 표시
  const highlightOpacity =
    progress > 0 && progress < 1
      ? spring({
          frame: frame - replaceStart,
          fps,
          config: { damping: 14, stiffness: 120 },
          durationInFrames: 24,
        })
      : 0;

  if (frame < replaceStart) {
    return (
      <TypingCodeLine
        text={'System.out.println("Hello Mike");'}
        startFrame={startFrame}
        cps={PAIN_CPS}
      />
    );
  }
  return (
    <div
      style={{
        lineHeight: "1.9",
        color: TEXT,
        whiteSpace: "pre",
        position: "relative",
      }}
    >
      <span>
        <span style={{ color: C_TEAL }}>System</span>.
        <span style={{ color: C_VAR }}>out</span>.
        <span style={{ color: C_FUNC }}>println</span>(
      </span>
      <span style={{ color: C_STRING }}>"Hello </span>
      <span
        style={{
          color: blank ? "transparent" : C_STRING,
          position: "relative",
          display: "inline-block",
        }}
      >
        {word}
        {/* 하이라이트 사각형 */}
        <span
          style={{
            position: "absolute",
            inset: "-2px -4px",
            border: `2px solid ${C_PAIN}`,
            borderRadius: 4,
            background: `${C_PAIN}18`,
            opacity: highlightOpacity,
            pointerEvents: "none",
          }}
        />
      </span>
      <span style={{ color: C_STRING }}>"</span>
      <span>);</span>
    </div>
  );
};

const PainScene: React.FC = () => {
  const { painScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { in: true });
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const { fps } = useVideoConfig();

  // 순차 타이핑 — 5줄 lineStarts 계산
  const lineStarts: number[] = [];
  let cumFrame = s;
  for (const line of PAIN_LINES) {
    lineStarts.push(cumFrame);
    cumFrame += Math.ceil((line.length / PAIN_CPS) * fps);
  }

  // 교체는 5줄 타이핑 완료 후 시작 (split과 비교해 늦은 쪽 사용)
  const typingDone = cumFrame;
  const replaceBegin = Math.max(split, typingDone);
  const replaceStarts = [
    replaceBegin,
    replaceBegin + REPLACE_GAP,
    replaceBegin + REPLACE_GAP * 2,
    replaceBegin + REPLACE_GAP * 3,
    replaceBegin + REPLACE_GAP * 4,
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. The Pain of Repetition" />
          <CodeBlock
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "28px 44px",
              ...monoStyle,
              fontSize: CODE.lg,
            }}
          >
            {PAIN_LINES.map((line, i) => {
              if (line.startsWith("//")) {
                return (
                  <TypingCodeLine
                    key={i}
                    text={line}
                    startFrame={lineStarts[i]}
                    cps={PAIN_CPS}
                  />
                );
              }
              // println 줄: 교체 애니메이션
              const rIdx = [0, 2, 4, 6, 8].indexOf(i);
              return (
                <PainPrintlnLine
                  key={i}
                  startFrame={lineStarts[i]}
                  replaceStart={replaceStarts[rIdx]}
                />
              );
            })}
          </CodeBlock>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.painScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ConceptScene ──────────────────────────────────────────
const ConceptScene: React.FC = () => {
  const { conceptScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const descAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. What Is a Function?" />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              textAlign: "center",
            }}
          >
            <div
              style={{
                ...monoStyle,
                fontSize: 96,
                fontWeight: 900,
                color: C_FUNC,
                opacity: titleAppear,
                transform: `scale(${interpolate(titleAppear, [0, 1], [0.7, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              Functions
            </div>
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 40,
                color: TEXT,
                opacity: descAppear,
                lineHeight: 1.6,
              }}
            >
              A <span style={{ color: C_FUNC, fontWeight: 700 }}>named</span>{" "}
              block of code
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.conceptScene.wordStartFrames}
      />
    </>
  );
};

// ── 컴포넌트: TypingGreetLine (첫 줄 전용 — greet 밑줄) ────────
const TypingGreetLine: React.FC<{
  text: string;
  startFrame: number;
  cps: number;
  underlineAppear: number;
}> = ({ text, startFrame, cps, underlineAppear }) => {
  const { visibleText } = useTypingEffect(text, startFrame, cps);
  const parts = visibleText.split("greet");
  return (
    <div style={{ lineHeight: "1.9", color: TEXT, whiteSpace: "pre" }}>
      <span style={{ color: C_KEYWORD }}>
        {parts[0]?.startsWith("void") ? "void" : ""}
      </span>
      {parts[0]?.replace("void", "")}
      {parts.length > 1 && (
        <span
          style={{
            color: C_FUNC,
            position: "relative",
            display: "inline",
          }}
        >
          greet
          <span
            style={{
              position: "absolute",
              bottom: -2,
              left: 0,
              right: 0,
              height: 3,
              background: C_PAIN,
              borderRadius: 2,
              opacity: underlineAppear,
              transform: `scaleX(${underlineAppear})`,
              transformOrigin: "left",
            }}
          />
        </span>
      )}
      {parts[1] ?? ""}
    </div>
  );
};

// ── 씬: DeclarationScene ──────────────────────────────────────
const DECLARE_LINES = [
  "void greet() {",
  '    System.out.println("Hello Mike");',
  "}",
];
const DECLARE_CPS = 18;

const DeclarationScene: React.FC = () => {
  const { declarationScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineStarts: number[] = [];
  let cumFrame = s;
  for (const line of DECLARE_LINES) {
    lineStarts.push(cumFrame);
    cumFrame += Math.ceil((line.length / DECLARE_CPS) * fps);
  }

  // "이름에만" 발화 시점에 greet Functions명에 빨간 밑줄
  const nameWordFrame = AUDIO_CONFIG.declarationScene.wordStartFrames[1][2];
  const underlineAppear = spring({
    frame: frame - nameWordFrame,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 32,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. Function Declaration" />
          <CodeBlock
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "40px 56px",
              ...monoStyle,
              fontSize: CODE.xl,
            }}
          >
            {DECLARE_LINES.map((line, i) =>
              i === 0 ? (
                <TypingGreetLine
                  key={i}
                  text={line}
                  startFrame={lineStarts[i]}
                  cps={DECLARE_CPS}
                  underlineAppear={underlineAppear}
                />
              ) : (
                <TypingCodeLine
                  key={i}
                  text={line}
                  startFrame={lineStarts[i]}
                  cps={DECLARE_CPS}
                />
              ),
            )}
          </CodeBlock>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.declarationScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: CallScene ─────────────────────────────────────────────
const CALL_LINES = ["greet();", "greet();", "greet();"];
const CALL_CPS = 20;

const CallScene: React.FC = () => {
  const { callScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];

  const lineStarts = CALL_LINES.map((_, i) => {
    const lineDuration = (split - s) / CALL_LINES.length;
    return Math.round(s + i * lineDuration);
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. Function Call" />
          <CodeBlock
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "40px 56px",
              ...monoStyle,
              fontSize: 40,
            }}
          >
            {CALL_LINES.map((line, i) => (
              <TypingCodeLine
                key={i}
                text={line}
                startFrame={lineStarts[i]}
                cps={CALL_CPS}
              />
            ))}
          </CodeBlock>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.callScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: SummaryScene ──────────────────────────────────────────
const SUMMARY_CARDS = CONTENT.summaryScene.cards as string[];

const SummaryScene: React.FC = () => {
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 요약 타이틀 등장
  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 48,
  });
  // 2문장 시작 시 타이틀 퇴장
  const titleExit = interpolate(frame, [split - 20, split], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = titleAppear * (1 - titleExit);

  const card0Appear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const card1Appear = spring({
    frame: frame - (split + 12),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const cardAppears = [card0Appear, card1Appear];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. Function Summary" />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
            }}
          >
            {/* 1문장: 요약 타이틀 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 52,
                fontWeight: 700,
                color: C_TEAL,
                textAlign: "center",
                opacity: titleOpacity,
                transform: `scale(${interpolate(
                  titleAppear,
                  [0, 1],
                  [0.85, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -30,
                marginLeft: -200,
                width: 400,
              }}
            >
              A function is a{"\n"}named block of code
            </div>
            {/* 2문장: 카드 2장 */}
            <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
              {SUMMARY_CARDS.map((card, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: uiFont,
                    fontSize: 44,
                    fontWeight: 700,
                    color: "#ffffff",
                    background: `${C_FUNC}18`,
                    border: `3px solid ${C_FUNC}66`,
                    borderRadius: 16,
                    padding: "32px 48px",
                    textAlign: "center",
                    opacity: cardAppears[i],
                    transform: `scale(${interpolate(
                      cardAppears[i],
                      [0, 1],
                      [0.8, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      },
                    )})`,
                  }}
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.summaryScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ComparisonScene — 고통코드 → 화살표 → 개선코드 ───────
const BEFORE_LINES = PAIN_LINES; // Functions 없이: 5줄 반복
const AFTER_LINES = [
  "void greet() {",
  '    System.out.println("Hello Mike");',
  "}",
  "",
  "greet();",
  "greet();",
  "greet();",
  "greet();",
  "greet();",
];

// 하이라이트할 줄 인덱스 (반복되는 println 줄)
const BEFORE_HIGHLIGHT = [0, 2, 4, 6, 8]; // println 5줄
// Function Declaration 블록 + 간결한 호출부
const AFTER_HIGHLIGHT_DECLARE = [0, 1, 2]; // void greet() { ... }
const AFTER_HIGHLIGHT_CALL = [4, 5, 6, 7, 8]; // greet(); x5

const ComparisonScene: React.FC = () => {
  const { comparisonScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d); // 마지막 씬 아님 → fadeOut 있음
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beforeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const arrowAppear = spring({
    frame: frame - (s + Math.round((split - s) / 2)),
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 40,
  });
  const afterAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  // 하이라이트 사각형은 after 등장 후 살짝 뒤에
  const highlightAppear = spring({
    frame: frame - (split + 24),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });

  const codeBoxExtraStyle: React.CSSProperties = {
    ...monoStyle,
    fontSize: CODE.lg,
    position: "relative",
  };

  const labelStyle = (color: string): React.CSSProperties => ({
    fontFamily: uiFont,
    fontSize: FONT.label,
    fontWeight: 700,
    color,
    letterSpacing: 2,
    marginBottom: 10,
    opacity: 0.85,
  });

  // 줄 하이라이트 사각형 (absolute overlay) — 연속 블록 단위로 분리
  const HighlightRect: React.FC<{
    lineIndices: number[];
    color: string;
    appear: number;
  }> = ({ lineIndices, color, appear }) => {
    if (lineIndices.length === 0) return null;
    const lineH = CODE.lg * 1.7; // fontSize * lineHeight
    // 연속 구간별 그룹핑
    const groups: number[][] = [];
    let cur: number[] = [];
    for (const idx of lineIndices) {
      if (cur.length > 0 && idx !== cur[cur.length - 1] + 1) {
        groups.push(cur);
        cur = [];
      }
      cur.push(idx);
    }
    if (cur.length > 0) groups.push(cur);
    return (
      <>
        {groups.map((g, gi) => (
          <div
            key={gi}
            style={{
              position: "absolute",
              left: 4,
              right: 4,
              top: 20 + g[0] * lineH, // padding offset
              height: g.length * lineH,
              border: `2px solid ${color}`,
              borderRadius: 6,
              background: `${color}12`,
              opacity: appear,
              pointerEvents: "none",
            }}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="6. Before / After" />
          <div
            style={{
              position: "absolute",
              top: "46%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              width: 900,
            }}
          >
            {/* repeated code — 위 */}
            <div style={{ opacity: beforeAppear, width: "100%" }}>
              <div style={labelStyle(C_PAIN)}>repeated code</div>
              <CodeBlock style={codeBoxExtraStyle}>
                {BEFORE_LINES.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      lineHeight: "1.7",
                      color: TEXT,
                      whiteSpace: "pre",
                    }}
                  >
                    <JavaLine text={line} />
                  </div>
                ))}
                <HighlightRect
                  lineIndices={BEFORE_HIGHLIGHT}
                  color={C_PAIN}
                  appear={highlightAppear}
                />
              </CodeBlock>
            </div>
            {/* 화살표 ▼ */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 48,
                color: C_TEAL,
                opacity: arrowAppear,
                transform: `translateY(${interpolate(
                  arrowAppear,
                  [0, 1],
                  [10, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )}px)`,
              }}
            >
              ▼
            </div>
            {/* cleaner code — 아래 */}
            <div style={{ opacity: afterAppear, width: "100%" }}>
              <div style={labelStyle(C_FUNC)}>cleaner code</div>
              <CodeBlock style={codeBoxExtraStyle}>
                {AFTER_LINES.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      lineHeight: "1.7",
                      color: TEXT,
                      whiteSpace: "pre",
                    }}
                  >
                    {line ? <JavaLine text={line} /> : "\u00A0"}
                  </div>
                ))}
                <HighlightRect
                  lineIndices={AFTER_HIGHLIGHT_DECLARE}
                  color={C_FUNC}
                  appear={highlightAppear}
                />
                <HighlightRect
                  lineIndices={AFTER_HIGHLIGHT_CALL}
                  color={C_TEAL}
                  appear={highlightAppear}
                />
              </CodeBlock>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.comparisonScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: RealExampleScene — 할인 가격 하드코딩 → Functions로 해결 ────
const REAL_PAIN_CARD1 = [
  "if (price > 30000) {",
  "    price = (int)(price * 0.9);",
  "}",
];
const REAL_PAIN_CARD2 = [
  "if (price > 30000) {",
  "    price = (int)(price * 0.9);",
  "}",
];
const REAL_CLEAN_FUNC = [
  "int discount(int price) {",
  "    if (price > 30000) {",
  "        return (int)(price * 0.9);",
  "    }",
  "    return price;",
  "}",
];
const REAL_CLEAN_CART = ["discount(50000);"];
const REAL_CLEAN_PAY = ["discount(80000);"];

const RealExampleScene: React.FC = () => {
  const { realExampleScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split1 = cfg.narrationSplits[0]; // 2번째 문장 시작
  const split2 = cfg.narrationSplits[1]; // 3번째 문장 시작
  const split3 = cfg.narrationSplits[2]; // 4번째 문장 시작
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: "실감나는 예시" → 고통 카드 2개 등장
  const beforeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  // 2문장: 밑줄 애니메이션 (반복 지점 강조)
  const underlineAppear = spring({
    frame: frame - (split1 + 30),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });
  // 3→4문장 사이: 화살표 등장
  const arrowAppear = spring({
    frame: frame - (split2 + Math.round((split3 - split2) * 0.7)),
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 40,
  });
  // 4문장: "Functions로 만들면" → 개선 코드 등장
  const afterAppear = spring({
    frame: frame - split3,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });

  const codeBoxExtraStyle: React.CSSProperties = {
    padding: "14px 20px",
    ...monoStyle,
    fontSize: CODE.sm,
  };

  const labelStyle = (color: string): React.CSSProperties => ({
    fontFamily: uiFont,
    fontSize: FONT.label,
    fontWeight: 700,
    color,
    letterSpacing: 2,
    marginBottom: 8,
    opacity: 0.85,
  });

  // 코드 컬러링 — 할인 계산 예시
  const colorCode = (text: string) => {
    const parts = text.split(
      /(0\.\d+|\d+|"[^"]*"|\*|>|return|if|double|int|void)/g,
    );
    return parts.map((p, i) => {
      if (p === "if")
        return (
          <span key={i} style={{ color: C_PURPLE }}>
            {p}
          </span>
        );
      if (["double", "int", "void"].includes(p))
        return (
          <span key={i} style={{ color: C_KEYWORD }}>
            {p}
          </span>
        );
      if (p === "return")
        return (
          <span key={i} style={{ color: C_KEYWORD }}>
            {p}
          </span>
        );
      if (/^[\d.]+$/.test(p))
        return (
          <span key={i} style={{ color: C_NUMBER }}>
            {p}
          </span>
        );
      if (/^"/.test(p))
        return (
          <span key={i} style={{ color: C_STRING }}>
            {p}
          </span>
        );
      if (p.includes("discount"))
        return (
          <span key={i}>
            {p.split("discount").map((seg, j, arr) => (
              <React.Fragment key={j}>
                {seg}
                {j < arr.length - 1 && (
                  <span style={{ color: C_FUNC }}>discount</span>
                )}
              </React.Fragment>
            ))}
          </span>
        );
      return <span key={i}>{p}</span>;
    });
  };

  // 반복 강조 밑줄이 필요한 줄 (> 30000, * 0.9 부분)
  const painLineWithUnderline = (text: string, ul: number) => {
    // > 30000 과 * 0.9 에 밑줄
    const highlighted = text
      .replace(/(> 30000)/, "{{UL1}}")
      .replace(/(\* 0\.9)/, "{{UL2}}");
    const segs = highlighted.split(/({{UL[12]}})/);
    return segs.map((seg, i) => {
      if (seg === "{{UL1}}") {
        return (
          <span key={i} style={{ position: "relative", display: "inline" }}>
            {colorCode("> 30000")}
            <span
              style={{
                position: "absolute",
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: C_PAIN,
                transform: `scaleX(${ul})`,
                transformOrigin: "left",
              }}
            />
          </span>
        );
      }
      if (seg === "{{UL2}}") {
        return (
          <span key={i} style={{ position: "relative", display: "inline" }}>
            {colorCode("* 0.9")}
            <span
              style={{
                position: "absolute",
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: C_PAIN,
                transform: `scaleX(${ul})`,
                transformOrigin: "left",
              }}
            />
          </span>
        );
      }
      return <React.Fragment key={i}>{colorCode(seg)}</React.Fragment>;
    });
  };

  // 고통 카드 렌더러
  const PainCard: React.FC<{ lines: string[]; label: string }> = ({
    lines,
    label,
  }) => (
    <div style={{ flex: 1 }}>
      <div style={labelStyle(C_PAIN)}>{label}</div>
      <CodeBlock style={codeBoxExtraStyle}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{ lineHeight: "1.7", color: TEXT, whiteSpace: "pre" }}
          >
            {line.includes("30000") || line.includes("0.9")
              ? painLineWithUnderline(line, underlineAppear)
              : colorCode(line)}
          </div>
        ))}
      </CodeBlock>
    </div>
  );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="7. Real Example" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              width: 920,
            }}
          >
            {/* 상단: 고통 카드 2개 위아래 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                width: "100%",
                opacity: beforeAppear,
              }}
            >
              <PainCard
                lines={REAL_PAIN_CARD1}
                label="cart-related source code"
              />
              <PainCard
                lines={REAL_PAIN_CARD2}
                label="payment-related source code"
              />
            </div>
            {/* 화살표 ▼ */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 36,
                color: C_TEAL,
                opacity: arrowAppear,
                transform: `translateY(${interpolate(
                  arrowAppear,
                  [0, 1],
                  [10, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )}px)`,
              }}
            >
              ▼
            </div>
            {/* 하단: 3개 카드 — Function Declaration + cart 호출 + payment 호출 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: "100%",
                opacity: afterAppear,
              }}
            >
              {/* Function Declaration */}
              <div>
                <div style={labelStyle(C_FUNC)}>Function Declaration</div>
                <CodeBlock style={codeBoxExtraStyle}>
                  {REAL_CLEAN_FUNC.map((line, i) => (
                    <div
                      key={i}
                      style={{
                        lineHeight: "1.7",
                        color: TEXT,
                        whiteSpace: "pre",
                      }}
                    >
                      {colorCode(line)}
                    </div>
                  ))}
                </CodeBlock>
              </div>
              {/* 호출부 2개 나란히 */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle(C_TEAL)}>cart</div>
                  <CodeBlock style={codeBoxExtraStyle}>
                    {REAL_CLEAN_CART.map((line, i) => (
                      <div
                        key={i}
                        style={{
                          lineHeight: "1.7",
                          color: TEXT,
                          whiteSpace: "pre",
                        }}
                      >
                        {colorCode(line)}
                      </div>
                    ))}
                  </CodeBlock>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle(C_TEAL)}>payment</div>
                  <CodeBlock style={codeBoxExtraStyle}>
                    {REAL_CLEAN_PAY.map((line, i) => (
                      <div
                        key={i}
                        style={{
                          lineHeight: "1.7",
                          color: TEXT,
                          whiteSpace: "pre",
                        }}
                      >
                        {colorCode(line)}
                      </div>
                    ))}
                  </CodeBlock>
                </div>
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.realExampleScene.wordStartFrames}
      />
    </>
  );
};

// ── OutroScene — return 예고 ─────────────────────────────────
const OutroScene: React.FC = () => {
  const { outroScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false }); // 마지막 씬 → fadeOut 없음
  const s = cfg.speechStartFrame;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "return" 발화 시점
  const returnFrame = AUDIO_CONFIG.outroScene.wordStartFrames[0][0];

  const returnAppear = spring({
    frame: frame - returnFrame,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });

  // 밑줄 애니메이션 — 발화 시점 + 16프레임 후 시작
  const returnUnderline = spring({
    frame: frame - returnFrame - 16,
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="8. Next Time" />

          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* return */}
            <div
              style={{
                ...monoStyle,
                fontSize: 64,
                fontWeight: 900,
                color: C_KEYWORD,
                opacity: returnAppear,
                display: "inline-block",
                position: "relative" as const,
              }}
            >
              return
              <div
                style={{
                  position: "absolute",
                  bottom: -6,
                  left: 0,
                  height: 3,
                  background: C_TEAL,
                  borderRadius: 2,
                  width: `${returnUnderline * 100}%`,
                }}
              />
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.outroScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues 계산 ─────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.painScene,
  VIDEO_CONFIG.conceptScene,
  VIDEO_CONFIG.declarationScene,
  VIDEO_CONFIG.callScene,
  VIDEO_CONFIG.summaryScene,
  VIDEO_CONFIG.comparisonScene,
  VIDEO_CONFIG.realExampleScene,
  VIDEO_CONFIG.outroScene,
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
export const SRT_DATA: SrtEntry[] = buildSrtData([
  {
    offset: fromValues[1],
    narration: VIDEO_CONFIG.painScene.narration,
    speechStartFrame: AUDIO_CONFIG.painScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.painScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.painScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.painScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: VIDEO_CONFIG.conceptScene.narration,
    speechStartFrame: AUDIO_CONFIG.conceptScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.conceptScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.conceptScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.conceptScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: VIDEO_CONFIG.declarationScene.narration,
    speechStartFrame: AUDIO_CONFIG.declarationScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.declarationScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.declarationScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.declarationScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: VIDEO_CONFIG.callScene.narration,
    speechStartFrame: AUDIO_CONFIG.callScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.callScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.callScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.callScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: VIDEO_CONFIG.summaryScene.narration,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.summaryScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
  },
  {
    offset: fromValues[6],
    narration: VIDEO_CONFIG.comparisonScene.narration,
    speechStartFrame: AUDIO_CONFIG.comparisonScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.comparisonScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.comparisonScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.comparisonScene.durationInFrames,
  },
  {
    offset: fromValues[7],
    narration: VIDEO_CONFIG.realExampleScene.narration,
    speechStartFrame: AUDIO_CONFIG.realExampleScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.realExampleScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.realExampleScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.realExampleScene.durationInFrames,
  },
  {
    offset: fromValues[8],
    narration: VIDEO_CONFIG.outroScene.narration,
    speechStartFrame: AUDIO_CONFIG.outroScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.outroScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.outroScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.outroScene.durationInFrames,
  },
]);

export const SRT_DATA_KO: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...VIDEO_CONFIG.painScene.subtitleKo,
  ...VIDEO_CONFIG.conceptScene.subtitleKo,
  ...VIDEO_CONFIG.declarationScene.subtitleKo,
  ...VIDEO_CONFIG.callScene.subtitleKo,
  ...VIDEO_CONFIG.summaryScene.subtitleKo,
  ...VIDEO_CONFIG.comparisonScene.subtitleKo,
  ...VIDEO_CONFIG.realExampleScene.subtitleKo,
  ...VIDEO_CONFIG.outroScene.subtitleKo,
]);

export const SRT_TRACKS: SrtTracks = {
  "en-US": SRT_DATA,
  "ko-KR": SRT_DATA_KO,
};

// ── compositionMeta ───────────────────────────────────────────
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

// ── Root Component ────────────────────────────────────────────
const JavaFunction: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.painScene.durationInFrames}
    >
      <PainScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.conceptScene.durationInFrames}
    >
      <ConceptScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.declarationScene.durationInFrames}
    >
      <DeclarationScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.callScene.durationInFrames}
    >
      <CallScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.comparisonScene.durationInFrames}
    >
      <ComparisonScene />
    </Sequence>
    <Sequence
      from={fromValues[7]}
      durationInFrames={VIDEO_CONFIG.realExampleScene.durationInFrames}
    >
      <RealExampleScene />
    </Sequence>
    <Sequence
      from={fromValues[8]}
      durationInFrames={VIDEO_CONFIG.outroScene.durationInFrames}
    >
      <OutroScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaFunction;

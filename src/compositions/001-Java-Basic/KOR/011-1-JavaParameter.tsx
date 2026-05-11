// src/compositions/001-Java-Basic/KOR/011-1-JavaParameter.tsx
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import React from "react";

import { FPS } from "../../../config";
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
import { CONTENT as ENG_CONTENT } from "../ENG/011-2-content";
import { CONTENT } from "./011-2-content";
import { AUDIO_CONFIG } from "./011-3-audio.gen";
import {
  BG,
  BG_THUMB,
  C_FUNC,
  C_KEYWORD,
  C_PAIN,
  C_STRING,
  C_TEAL,
  C_TYPE,
  TEXT,
} from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  painScene: {
    audio: "param-pain.mp3",
    durationInFrames: AUDIO_CONFIG.painScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.painScene.speechStartFrame,
    narration: CONTENT.painScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.painScene.narrationSplits,
  },
  conceptScene: {
    audio: "param-concept.mp3",
    durationInFrames: AUDIO_CONFIG.conceptScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.conceptScene.speechStartFrame,
    narration: CONTENT.conceptScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.conceptScene.narrationSplits,
  },
  paramScene: {
    audio: "param-param.mp3",
    durationInFrames: AUDIO_CONFIG.paramScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.paramScene.speechStartFrame,
    narration: CONTENT.paramScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.paramScene.narrationSplits,
  },
  callScene: {
    audio: "param-call.mp3",
    durationInFrames: AUDIO_CONFIG.callScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.callScene.speechStartFrame,
    narration: CONTENT.callScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.callScene.narrationSplits,
  },
  multiParamScene: {
    audio: "param-multi.mp3",
    durationInFrames: AUDIO_CONFIG.multiParamScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.multiParamScene.speechStartFrame,
    narration: CONTENT.multiParamScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.multiParamScene.narrationSplits,
  },
  argParamScene: {
    audio: "param-argparam.mp3",
    durationInFrames: AUDIO_CONFIG.argParamScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.argParamScene.speechStartFrame,
    narration: CONTENT.argParamScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.argParamScene.narrationSplits,
  },
} as const;

// ── 씬: ThumbnailScene ──────────────────────────────────────
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
      {/* 메인 타이틀 */}
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
        <span style={{ color: C_TEAL }}>매개변수</span>
      </div>
      {/* 배지: 매개변수 & 인자 */}
      <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
        {["매개변수", "인자"].map((label) => (
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

// ── 씬: PainScene — 고정된 함수의 한계 ──────────────────────
const PAIN_FUNC_LINES = [
  "void greet() {",
  '    System.out.println("안녕 민준");',
  "}",
];
const PAIN_EXTRAS = [
  "void greetCheolsu() { ... }",
  "void greetYounghee() { ... }",
];
const PAIN_CPS = 22;

const PainScene: React.FC = () => {
  const { painScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { in: true });
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 순차 타이핑 — 3줄
  const lineStarts: number[] = [];
  let cumFrame = s;
  for (const line of PAIN_FUNC_LINES) {
    lineStarts.push(cumFrame);
    cumFrame += Math.ceil((line.length / PAIN_CPS) * fps);
  }

  // 추가 함수 스텁: split 시점에 등장
  const extrasAppear = spring({
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
          <SceneTitle title="1. 고정된 함수" />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: 860,
            }}
          >
            {/* 원래 greet() 함수 */}
            <CodeBlock
              style={{
                padding: "32px 44px",
                ...monoStyle,
                fontSize: CODE.xl,
              }}
            >
              {PAIN_FUNC_LINES.map((line, i) => (
                <TypingCodeLine
                  key={i}
                  text={line}
                  startFrame={lineStarts[i]}
                  cps={PAIN_CPS}
                />
              ))}
            </CodeBlock>
            {/* 추가 함수 스텁 — 2문장 시점에 등장 */}
            <CodeBlock
              style={{
                opacity: extrasAppear,
                transform: `scale(${interpolate(
                  extrasAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
                padding: "20px 44px",
                ...monoStyle,
                fontSize: CODE.xl,
                border: `2px dashed ${C_PAIN}55`,
              }}
            >
              {PAIN_EXTRAS.map((line, i) => (
                <div
                  key={i}
                  style={{
                    lineHeight: "1.9",
                    color: C_PAIN,
                    whiteSpace: "pre",
                    opacity: 0.8,
                  }}
                >
                  <JavaLine text={line} />
                </div>
              ))}
            </CodeBlock>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.painScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ConceptScene — 매개변수 = 통로 ──────────────────────
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
          <SceneTitle title="2. 매개변수란?" />
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
                fontFamily: uiFont,
                fontSize: 84,
                fontWeight: 900,
                color: C_FUNC,
                opacity: titleAppear,
                transform: `scale(${interpolate(titleAppear, [0, 1], [0.7, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              매개변수
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
              함수에 <span style={{ color: C_FUNC, fontWeight: 700 }}>값</span>
              을 전달하는{" "}
              <span style={{ color: C_TEAL, fontWeight: 700 }}>통로</span>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.conceptScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ParamScene — 매개변수 선언 ──────────────────────────
const PARAM_LINES = [
  "void greet(String name) {",
  '    System.out.println("안녕 " + name);',
  "}",
];
const PARAM_CPS = 18;

// greet 함수 첫 줄 — "String name" 매개변수에 밑줄
const TypingParamLine: React.FC<{
  text: string;
  startFrame: number;
  cps: number;
  underlineAppear: number;
}> = ({ text, startFrame, cps, underlineAppear }) => {
  const { visibleText } = useTypingEffect(text, startFrame, cps);
  // "String name" 구간 하이라이팅
  const paramStart = visibleText.indexOf("String name");
  if (paramStart < 0) {
    return (
      <div style={{ lineHeight: "1.9", color: TEXT, whiteSpace: "pre" }}>
        <JavaLine text={visibleText} />
      </div>
    );
  }

  const before = visibleText.slice(0, paramStart);
  const after = visibleText.slice(paramStart + "String name".length);

  return (
    <div style={{ lineHeight: "1.9", color: TEXT, whiteSpace: "pre" }}>
      <JavaLine text={before} />
      <span style={{ position: "relative", display: "inline" }}>
        <span style={{ color: C_TYPE }}>String</span>
        <span> </span>
        <span style={{ color: C_FUNC }}>name</span>
        {/* 밑줄 */}
        <span
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: 3,
            background: C_TEAL,
            borderRadius: 2,
            opacity: underlineAppear,
            transform: `scaleX(${underlineAppear})`,
            transformOrigin: "left",
          }}
        />
      </span>
      <JavaLine text={after} />
    </div>
  );
};

const ParamScene: React.FC = () => {
  const { paramScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 순차 타이핑
  const lineStarts: number[] = [];
  let cumFrame = s;
  for (const line of PARAM_LINES) {
    lineStarts.push(cumFrame);
    cumFrame += Math.ceil((line.length / PARAM_CPS) * fps);
  }

  // 밑줄: split 시점에 등장
  const underlineAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 32,
  });

  // 라벨 "← 매개변수": split + 12프레임 후 등장
  const labelAppear = spring({
    frame: frame - split - 12,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 30,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 매개변수 선언" />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* 라벨: 매개변수 ↓ — 코드 블록 위 */}
            <div
              style={{
                opacity: labelAppear,
                fontFamily: uiFont,
                fontSize: FONT.label,
                fontWeight: 700,
                color: C_TEAL,
                marginBottom: 16,
                textAlign: "center",
                letterSpacing: 2,
              }}
            >
              매개변수 ↓
            </div>
            <CodeBlock
              style={{
                padding: "36px 48px",
                ...monoStyle,
                fontSize: CODE.md,
                position: "relative",
              }}
            >
              {/* 코드 줄 */}
              {PARAM_LINES.map((line, i) =>
                i === 0 ? (
                  <TypingParamLine
                    key={i}
                    text={line}
                    startFrame={lineStarts[i]}
                    cps={PARAM_CPS}
                    underlineAppear={underlineAppear}
                  />
                ) : (
                  <TypingCodeLine
                    key={i}
                    text={line}
                    startFrame={lineStarts[i]}
                    cps={PARAM_CPS}
                  />
                ),
              )}
            </CodeBlock>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.paramScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: CallScene — 인자 전달 ───────────────────────────────
const CALL_LINES = [
  'greet("민준");   // 안녕 민준',
  'greet("철수");   // 안녕 철수',
  'greet("영희");   // 안녕 영희',
];
const CALL_CPS = 20;

const CallScene: React.FC = () => {
  const { callScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const { fps } = useVideoConfig();

  // 1문장: 첫 줄 타이핑, 2문장: 나머지 줄 타이핑
  const lineGap = Math.ceil((CALL_LINES[0].length / CALL_CPS) * fps) + 10;
  const lineStarts = [s, split, split + lineGap];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 인자 전달" />
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
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.callScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: MultiParamScene — 여러 매개변수 ─────────────────────
const MULTI_DECLARE_LINES = [
  "void add(int a, int b) {",
  "    System.out.println(a + b);",
  "}",
];
const MULTI_CALL_LINE = "add(3, 5);   // 8";
const MULTI_CPS = 18;

// 첫 줄 — "int a, int b" 매개변수에 밑줄
const TypingMultiParamLine: React.FC<{
  text: string;
  startFrame: number;
  cps: number;
  underlineAppear: number;
}> = ({ text, startFrame, cps, underlineAppear }) => {
  const { visibleText } = useTypingEffect(text, startFrame, cps);
  const paramStr = "int a, int b";
  const paramStart = visibleText.indexOf(paramStr);
  if (paramStart < 0) {
    return (
      <div style={{ lineHeight: "1.9", color: TEXT, whiteSpace: "pre" }}>
        <JavaLine text={visibleText} />
      </div>
    );
  }

  const before = visibleText.slice(0, paramStart);
  const after = visibleText.slice(paramStart + paramStr.length);

  return (
    <div style={{ lineHeight: "1.9", color: TEXT, whiteSpace: "pre" }}>
      <JavaLine text={before} />
      <span style={{ position: "relative", display: "inline" }}>
        <span style={{ color: C_TYPE }}>int</span>
        <span> a, </span>
        <span style={{ color: C_TYPE }}>int</span>
        <span> b</span>
        {/* 밑줄 */}
        <span
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: 3,
            background: C_TEAL,
            borderRadius: 2,
            opacity: underlineAppear,
            transform: `scaleX(${underlineAppear})`,
            transformOrigin: "left",
          }}
        />
      </span>
      <JavaLine text={after} />
    </div>
  );
};

const MultiParamScene: React.FC = () => {
  const { multiParamScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const split0 = splits[0] ?? s + 80;
  const split1 = splits[1] ?? split0 + 100;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 선언부 타이핑
  const declareStarts: number[] = [];
  let cumFrame = s;
  for (const line of MULTI_DECLARE_LINES) {
    declareStarts.push(cumFrame);
    cumFrame += Math.ceil((line.length / MULTI_CPS) * fps);
  }

  // 호출부: split0 시점에 타이핑 시작
  const callStart = split0;

  // 매개변수 밑줄: split0 시점에 등장
  const underlineAppear = spring({
    frame: frame - split0,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 32,
  });

  // 3문장: 매핑 화살표 등장 — split1 시점
  const arrow1Appear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });
  const arrow2Appear = spring({
    frame: frame - (split1 + 18),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 여러 매개변수" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            {/* 코드 블록 */}
            <CodeBlock
              style={{
                padding: "40px 56px",
                ...monoStyle,
                fontSize: CODE.xl,
              }}
            >
              {/* 함수 선언부 */}
              {MULTI_DECLARE_LINES.map((line, i) =>
                i === 0 ? (
                  <TypingMultiParamLine
                    key={i}
                    text={line}
                    startFrame={declareStarts[i]}
                    cps={MULTI_CPS}
                    underlineAppear={underlineAppear}
                  />
                ) : (
                  <TypingCodeLine
                    key={i}
                    text={line}
                    startFrame={declareStarts[i]}
                    cps={MULTI_CPS}
                  />
                ),
              )}
              {/* 빈 줄 */}
              <div style={{ lineHeight: "1.9" }}>{"\u00A0"}</div>
              {/* 호출부 */}
              <TypingCodeLine
                text={MULTI_CALL_LINE}
                startFrame={callStart}
                cps={CALL_CPS}
              />
            </CodeBlock>

            {/* 매핑 다이어그램: 3문장 시점에 등장 */}
            <div
              style={{
                marginTop: 36,
                display: "flex",
                gap: 64,
                justifyContent: "center",
              }}
            >
              {/* 첫 번째 인자 → 첫 번째 매개변수 */}
              <div
                style={{
                  opacity: arrow1Appear,
                  transform: `translateY(${interpolate(
                    arrow1Appear,
                    [0, 1],
                    [12, 0],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  )}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    ...monoStyle,
                    fontSize: CODE.xl,
                    fontWeight: 700,
                    color: C_STRING,
                  }}
                >
                  3
                </div>
                <div style={{ fontSize: 28, color: C_TEAL }}>↓</div>
                <div
                  style={{
                    ...monoStyle,
                    fontSize: CODE.xl,
                    fontWeight: 700,
                    color: C_TEAL,
                  }}
                >
                  a
                </div>
              </div>

              {/* 두 번째 인자 → 두 번째 매개변수 */}
              <div
                style={{
                  opacity: arrow2Appear,
                  transform: `translateY(${interpolate(
                    arrow2Appear,
                    [0, 1],
                    [12, 0],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  )}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    ...monoStyle,
                    fontSize: CODE.xl,
                    fontWeight: 700,
                    color: C_STRING,
                  }}
                >
                  5
                </div>
                <div style={{ fontSize: 28, color: C_TEAL }}>↓</div>
                <div
                  style={{
                    ...monoStyle,
                    fontSize: CODE.xl,
                    fontWeight: 700,
                    color: C_TEAL,
                  }}
                >
                  b
                </div>
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.multiParamScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ArgParamScene — 인자 vs 매개변수 비교 ──────────────
const ArgParamScene: React.FC = () => {
  const { argParamScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false }); // 마지막 씬 → fadeOut 없음
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 선언부 (매개변수 강조) 등장
  const declAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 2문장: 호출부 (인자 강조) 등장
  const split0 = splits[0] ?? s + 90;
  const callAppear = spring({
    frame: frame - split0,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 라벨 하이라이트 — 각 블록 등장 후 12프레임 뒤
  const paramHighlight = spring({
    frame: frame - (s + 12),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });
  const argHighlight = spring({
    frame: frame - (split0 + 12),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });

  const declScale = interpolate(declAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const callScale = interpolate(callAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="6. 인자 vs 매개변수" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              width: "90%",
            }}
          >
            {/* 선언부 — 매개변수 */}
            <div
              style={{
                opacity: declAppear,
                transform: `scale(${declScale})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  color: C_TEAL,
                  letterSpacing: 2,
                  opacity: paramHighlight * 0.85,
                }}
              >
                매개변수
              </div>
              <CodeBlock
                style={{
                  width: "100%",
                  textAlign: "center",
                  border: `2px solid ${C_TEAL}${Math.round(paramHighlight * 85)
                    .toString(16)
                    .padStart(2, "0")}`,
                }}
              >
                <span style={{ ...monoStyle, fontSize: CODE.xl, color: TEXT }}>
                  <span style={{ color: C_KEYWORD }}>void</span>{" "}
                  <span style={{ color: C_FUNC }}>greet</span>(
                  <span
                    style={{
                      color: C_TYPE,
                      textDecoration:
                        paramHighlight > 0.5 ? "underline" : "none",
                      textDecorationColor: C_TEAL,
                      textUnderlineOffset: 6,
                    }}
                  >
                    String
                  </span>{" "}
                  <span
                    style={{
                      color: C_TEAL,
                      textDecoration:
                        paramHighlight > 0.5 ? "underline" : "none",
                      textDecorationColor: C_TEAL,
                      textUnderlineOffset: 6,
                    }}
                  >
                    name
                  </span>
                  )
                </span>
              </CodeBlock>
            </div>

            {/* 화살표 */}
            <div
              style={{
                opacity: callAppear,
                fontSize: 36,
                color: C_TEAL,
              }}
            >
              ▼
            </div>

            {/* 호출부 — 인자 */}
            <div
              style={{
                opacity: callAppear,
                transform: `scale(${callScale})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                width: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  color: C_STRING,
                  letterSpacing: 2,
                  opacity: argHighlight * 0.85,
                }}
              >
                인자
              </div>
              <CodeBlock
                style={{
                  width: "100%",
                  textAlign: "center",
                  border: `2px solid ${C_STRING}${Math.round(argHighlight * 85)
                    .toString(16)
                    .padStart(2, "0")}`,
                }}
              >
                <span style={{ ...monoStyle, fontSize: CODE.xl, color: TEXT }}>
                  <span style={{ color: C_FUNC }}>greet</span>(
                  <span
                    style={{
                      color: C_STRING,
                      textDecoration: argHighlight > 0.5 ? "underline" : "none",
                      textDecorationColor: C_STRING,
                      textUnderlineOffset: 6,
                    }}
                  >
                    "민준"
                  </span>
                  );
                </span>
              </CodeBlock>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.argParamScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues 계산 ─────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.painScene,
  VIDEO_CONFIG.conceptScene,
  VIDEO_CONFIG.paramScene,
  VIDEO_CONFIG.callScene,
  VIDEO_CONFIG.multiParamScene,
  VIDEO_CONFIG.argParamScene,
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
    narration: VIDEO_CONFIG.paramScene.narration,
    speechStartFrame: AUDIO_CONFIG.paramScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.paramScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.paramScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.paramScene.durationInFrames,
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
    narration: VIDEO_CONFIG.multiParamScene.narration,
    speechStartFrame: AUDIO_CONFIG.multiParamScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.multiParamScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.multiParamScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.multiParamScene.durationInFrames,
  },
  {
    offset: fromValues[6],
    narration: VIDEO_CONFIG.argParamScene.narration,
    speechStartFrame: AUDIO_CONFIG.argParamScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.argParamScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.argParamScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.argParamScene.durationInFrames,
  },
]);

export const SRT_DATA_EN: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...ENG_CONTENT.painScene.narration,
  ...ENG_CONTENT.conceptScene.narration,
  ...ENG_CONTENT.paramScene.narration,
  ...ENG_CONTENT.callScene.narration,
  ...ENG_CONTENT.multiParamScene.narration,
  ...ENG_CONTENT.argParamScene.narration,
]);

export const SRT_TRACKS: SrtTracks = {
  "ko-KR": SRT_DATA,
  "en-US": SRT_DATA_EN,
};

// ── compositionMeta ───────────────────────────────────────────
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

// ── Root Component ────────────────────────────────────────────
const JavaParameter: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.paramScene.durationInFrames}
    >
      <ParamScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.callScene.durationInFrames}
    >
      <CallScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.multiParamScene.durationInFrames}
    >
      <MultiParamScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.argParamScene.durationInFrames}
    >
      <ArgParamScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaParameter;

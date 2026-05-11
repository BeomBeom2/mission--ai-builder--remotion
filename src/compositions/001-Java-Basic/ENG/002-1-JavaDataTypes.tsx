// src/compositions/0002-JavaDataTypes.tsx
import {
  AbsoluteFill,
  Easing,
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
  CHARS_PER_SEC,
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
} from "../../../utils/scene";
import {
  SrtEntry,
  SrtTracks,
  buildSrtData,
  computeFromValues,
  localizeSrtData,
} from "../../../utils/srt";
import { CONTENT as KOR_CONTENT } from "../KOR/002-2-content";
import { CONTENT } from "./002-2-content";
import { AUDIO_CONFIG } from "./002-3-audio.gen";
import { BG, BG_THUMB, C_OPERATOR, C_TEAL, C_TYPE, TEXT } from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── 상수 ─────────────────────────────────────────────────────
const typingDone = (chars: number, speechStart: number) =>
  speechStart + Math.ceil((chars / CHARS_PER_SEC) * FPS);

const TYPE_COLORS: Record<string, string> = {
  int: C_TYPE,
  double: "#d4c04e",
  String: "#4ec970",
  boolean: C_OPERATOR,
};

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: {
    durationInFrames: 60,
  },
  intro: {
    audio: "dt-intro.mp3",
    durationInFrames: AUDIO_CONFIG.intro.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
    narration: CONTENT.intro.narration as string[],
    subtitleKo: KOR_CONTENT.intro.narration as string[],
    narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
  },
  valueVsVar: {
    audio: "dt-value-vs-var.mp3",
    durationInFrames: AUDIO_CONFIG.valueVsVar.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.valueVsVar.speechStartFrame,
    narration: CONTENT.valueVsVar.narration as string[],
    subtitleKo: KOR_CONTENT.valueVsVar.narration as string[],
    narrationSplits: AUDIO_CONFIG.valueVsVar.narrationSplits,
  },
  intScene: {
    audio: "dt-int.mp3",
    durationInFrames: AUDIO_CONFIG.intScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.intScene.speechStartFrame,
    narration: CONTENT.intScene.narration as string[],
    subtitleKo: KOR_CONTENT.intScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.intScene.narrationSplits,
  },
  doubleScene: {
    audio: "dt-double.mp3",
    durationInFrames: AUDIO_CONFIG.doubleScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.doubleScene.speechStartFrame,
    narration: CONTENT.doubleScene.narration as string[],
    subtitleKo: KOR_CONTENT.doubleScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.doubleScene.narrationSplits,
  },
  stringScene: {
    audio: "dt-string.mp3",
    durationInFrames: AUDIO_CONFIG.stringScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.stringScene.speechStartFrame,
    narration: CONTENT.stringScene.narration as string[],
    subtitleKo: KOR_CONTENT.stringScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.stringScene.narrationSplits,
  },
  booleanScene: {
    audio: "dt-boolean.mp3",
    durationInFrames: AUDIO_CONFIG.booleanScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.booleanScene.speechStartFrame,
    narration: CONTENT.booleanScene.narration as string[],
    subtitleKo: KOR_CONTENT.booleanScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.booleanScene.narrationSplits,
  },
  summaryScene: {
    audio: "dt-summary.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    subtitleKo: KOR_CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
};

// ── 컴포넌트: CodeBox ─────────────────────────────────────────
const StaticLine: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ color: TEXT, lineHeight: "1.8" }}>
    <JavaLine text={text} />
  </div>
);

const CodeBox: React.FC<{
  lines: { text: string; isNew: boolean }[];
  startFrame: number;
  charsPerSecond?: number;
}> = ({ lines, startFrame, charsPerSecond = CHARS_PER_SEC }) => (
  <CodeBlock
    style={{
      position: "absolute",
      top: "57%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "40px 56px",
      ...monoStyle,
      fontSize: CODE.xl,
    }}
  >
    {lines.map((line, i) =>
      line.isNew ? (
        <TypingCodeLine
          key={`new-${i}`}
          text={line.text}
          startFrame={startFrame}
          cps={charsPerSecond}
          lineHeight="1.8"
        />
      ) : (
        <StaticLine key={`static-${i}`} text={line.text} />
      ),
    )}
  </CodeBlock>
);

// ── 컴포넌트: TypeBox ─────────────────────────────────────────
// 색상 상자 spring 등장 + 값 낙하 애니메이션 (단일 엘리먼트, 깜빡임 없음)
const TypeBox: React.FC<{
  color: string;
  value: string;
  label?: string;
  startFrame?: number;
  dropStartFrame?: number;
}> = ({ color, value, label, startFrame = 0, dropStartFrame = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxE = frame - startFrame;
  const boxAppear = spring({
    frame: boxE,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 70,
  });
  const boxScale = interpolate(boxAppear, [0, 1], [0.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dropE = frame - dropStartFrame;
  const DROP_FRAMES = 60;
  const dropY = interpolate(dropE, [0, DROP_FRAMES], [-140, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const dropO = interpolate(dropE, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dropGlow = interpolate(
    dropE,
    [DROP_FRAMES - 4, DROP_FRAMES + 4, DROP_FRAMES + 28],
    [0, 1, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (boxE < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transform: `scale(${boxScale})`,
        opacity: boxAppear,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: uiFont,
            fontSize: 38,
            fontWeight: 700,
            color,
            letterSpacing: 4,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          position: "relative",
          border: `4px solid ${color}`,
          borderRadius: 20,
          width: 260,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}1a`,
          boxShadow:
            dropGlow > 0.05
              ? `0 0 ${Math.round(dropGlow * 50)}px ${color}`
              : "none",
        }}
      >
        {dropE >= 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translateX(-50%) translateY(calc(-50% + ${dropY}px))`,
              ...monoStyle,
              fontSize: 64,
              fontWeight: 700,
              color: TEXT,
              opacity: dropO,
            }}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

// ── 컴포넌트: BooleanToggleAnim ───────────────────────────────
// boolean 씬 전용: true↔false 토글 (45프레임 = 1.5초 주기)
const BooleanToggleAnim: React.FC<{
  startFrame?: number;
  dropStartFrame?: number;
}> = ({ startFrame = 0, dropStartFrame = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const COLOR = TYPE_COLORS.boolean; // "#d4834e"

  const boxE = frame - startFrame;
  const boxAppear = spring({
    frame: boxE,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 70,
  });
  const boxScale = interpolate(boxAppear, [0, 1], [0.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const PERIOD = 90;
  const elapsed = Math.max(0, frame - dropStartFrame);
  const cycleFrame = elapsed % (PERIOD * 2);
  const showTrue = cycleFrame < PERIOD;
  const toggleColor = showTrue ? C_TEAL : "#f44747";
  const displayValue = showTrue ? "true" : "false";

  const valueOpacity = interpolate(frame - dropStartFrame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (boxE < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transform: `scale(${boxScale})`,
        opacity: boxAppear,
      }}
    >
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 38,
          fontWeight: 700,
          color: COLOR,
          letterSpacing: 4,
        }}
      >
        boolean
      </div>
      <div
        style={{
          position: "relative",
          border: `4px solid ${COLOR}`,
          borderRadius: 20,
          width: 260,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${COLOR}1a`,
        }}
      >
        <span
          style={{
            ...monoStyle,
            fontSize: 56,
            fontWeight: 700,
            color: toggleColor,
            opacity: valueOpacity,
          }}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
};

// ── 씬: ThumbnailScene ───────────────────────────────────────
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
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
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
          fontSize: 28,
          fontWeight: 700,
          color: C_TEAL,
          letterSpacing: 10,
          opacity: 0.8,
        }}
      >
        JAVA
      </div>
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 140,
          fontWeight: 900,
          lineHeight: 1,
          textAlign: "center",
          color: "#ffffff",
          textShadow:
            "0 0 60px rgba(78,201,176,0.6), 0 0 120px rgba(78,201,176,0.3)",
        }}
      >
        Java
        <br />
        <span style={{ color: C_TEAL }}>Data Types</span>
      </div>
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 32,
          color: C_TEAL,
          letterSpacing: 4,
          opacity: 0.7,
        }}
      >
        int · double · String · boolean
      </div>
    </AbsoluteFill>
  );
};

// ── 씬: IntroScene ────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { intro } = VIDEO_CONFIG;
  const opacity = useFade(intro.durationInFrames, { in: true });
  const s = intro.speechStartFrame;
  const split1 = intro.narrationSplits[0]; // 2문장 시작 (frame 106)

  // 1문장: data type concept title
  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 48,
  });
  const titleExit = interpolate(frame, [split1 - 20, split1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = titleAppear * (1 - titleExit);

  const boxes = [
    { label: "int", color: TYPE_COLORS.int },
    { label: "double", color: TYPE_COLORS.double },
    { label: "String", color: TYPE_COLORS.String },
    { label: "boolean", color: TYPE_COLORS.boolean },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={intro.audio} />
          <SceneTitle title="1. What Is a Data Type?" />
          {/* 1문장: data type concept title */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${interpolate(
                titleAppear,
                [0, 1],
                [0.85, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              )})`,
              opacity: titleOpacity,
              textAlign: "center",
              fontFamily: uiFont,
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: 56, fontWeight: 700, color: C_TEAL }}>
              kind of value
            </span>
          </div>
          {/* 2문장~: Data Types 박스 4개 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 28,
            }}
          >
            {boxes.map(({ label, color }, i) => {
              const wordTriggers = AUDIO_CONFIG.intro
                .wordStartFrames[1] as readonly number[];
              const triggerFrame = wordTriggers[i * 2] ?? i * 5;
              const appear = spring({
                frame: frame - triggerFrame,
                fps,
                config: { damping: 14, stiffness: 140 },
                durationInFrames: 70,
              });
              const boxScale = interpolate(appear, [0, 1], [0.2, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={label}
                  style={{
                    transform: `scale(${boxScale})`,
                    opacity: appear,
                    border: `4px solid ${color}`,
                    borderRadius: 20,
                    width: 220,
                    height: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${color}1a`,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: 38,
                      fontWeight: 700,
                      color,
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={intro.narration}
        secondarySentences={intro.subtitleKo}
        splits={intro.narrationSplits}
        speechStart={intro.speechStartFrame}
        wordFrames={AUDIO_CONFIG.intro.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ValueVsVarScene ──────────────────────────────────────
const ValueVsVarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { valueVsVar } = VIDEO_CONFIG;
  const d = valueVsVar.durationInFrames;
  const s = valueVsVar.speechStartFrame;
  const splits = valueVsVar.narrationSplits;
  const split0 = splits[0] ?? 90;
  const split1 = splits[1] ?? 180;
  const COLOR = TYPE_COLORS.int;
  const opacity = useFade(d);

  // 1문장: "변수와 값은 엄연히 서로 다릅니다" 타이틀
  const msgAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 48,
  });
  const msgExit = interpolate(frame, [split0 - 20, split0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const msgOpacity = msgAppear * (1 - msgExit);

  // "int value" → wordTiming "int"[0] (sentence 2), "int variable" → wordTiming "int"[1] (sentence 3)
  const valueWordFrame = AUDIO_CONFIG.valueVsVar.wordTiming["int"][0] ?? split0;
  const varWordFrame = AUDIO_CONFIG.valueVsVar.wordTiming["int"][1] ?? split1;

  const valueAppear = spring({
    frame: frame - valueWordFrame,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 60,
  });
  const valueScale = interpolate(valueAppear, [0, 1], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const varAppear = spring({
    frame: frame - varWordFrame,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 60,
  });
  const varScale = interpolate(varAppear, [0, 1], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowOp = interpolate(
    frame,
    [varWordFrame, varWordFrame + 30],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={valueVsVar.audio} />
          <SceneTitle title="2. Value vs Variable" />

          {/* 1문장: 핵심 메시지 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${interpolate(
                msgAppear,
                [0, 1],
                [0.85, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              )})`,
              opacity: msgOpacity,
              fontFamily: uiFont,
              fontSize: 46,
              fontWeight: 700,
              color: C_TEAL,
              textAlign: "center",
              lineHeight: 1.5,
              pointerEvents: "none",
            }}
          >
            A value and a variable{"\n"}are not the same thing
          </div>

          {/* 제목 */}
          <div
            style={{
              position: "absolute",
              top: 160,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: uiFont,
              fontSize: 34,
              color: "#666",
              letterSpacing: 4,
              whiteSpace: "nowrap",
            }}
          >
            Value vs Variable
          </div>

          {/* 두 패널 */}
          <div
            style={{
              position: "absolute",
              top: "46%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: 60,
              alignItems: "center",
            }}
          >
            {/* 왼쪽: int형 값 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 300,
                gap: 20,
                opacity: valueAppear,
                transform: `scale(${valueScale})`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                integer value
              </div>
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  border: `3px dashed ${COLOR}88`,
                  background: `${COLOR}0d`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    ...monoStyle,
                    fontSize: 80,
                    fontWeight: 700,
                    color: COLOR,
                  }}
                >
                  25
                </span>
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 24,
                  color: "#666",
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                the data itself
              </div>
            </div>

            {/* 화살표 */}
            <div style={{ fontSize: 56, color: "#555", opacity: arrowOp }}>
              →
            </div>

            {/* 오른쪽: int형 변수 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 300,
                gap: 20,
                opacity: varAppear,
                transform: `scale(${varScale})`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                integer variable
              </div>
              <div
                style={{
                  width: 240,
                  height: 200,
                  borderRadius: 20,
                  border: `4px solid ${COLOR}`,
                  background: `${COLOR}1a`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  position: "relative",
                }}
              >
                {/* 타입 태그 */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    background: COLOR,
                    borderRadius: 6,
                    padding: "4px 16px",
                    ...monoStyle,
                    fontSize: FONT.label,
                    fontWeight: 700,
                    color: BG,
                  }}
                >
                  int
                </div>
                {/* 변수명 */}
                <div
                  style={{
                    ...monoStyle,
                    fontSize: CODE.lg,
                    color: "#888",
                  }}
                >
                  age
                </div>
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 24,
                  color: "#666",
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                a named space for a value
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={valueVsVar.narration}
        secondarySentences={valueVsVar.subtitleKo}
        splits={splits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.valueVsVar.wordStartFrames}
      />
    </>
  );
};

// ── 씬: TypeScene (int / double / String 공통) ─────────────────
const TYPE_SCENE_DATA = {
  intScene: {
    code: "int age = 25;",
    value: "25",
    color: TYPE_COLORS.int,
    label: "int",
    title: "3. int - whole numbers",
  },
  doubleScene: {
    code: "double height = 175.5;",
    value: "175.5",
    color: TYPE_COLORS.double,
    label: "double",
    title: "4. double - decimals",
  },
  stringScene: {
    code: 'String name = "Java";',
    value: '"Java"',
    color: TYPE_COLORS.String,
    label: "String",
    title: "5. String - text",
  },
} as const;

const TypeScene: React.FC<{
  sceneKey: keyof typeof TYPE_SCENE_DATA;
  config: {
    audio: string;
    durationInFrames: number;
    speechStartFrame: number;
    narration: string[];
    subtitleKo: string[];
    narrationSplits: readonly number[];
  };
}> = ({ sceneKey, config }) => {
  const d = config.durationInFrames;
  const s = config.speechStartFrame;
  const { code, value, color, label, title } = TYPE_SCENE_DATA[sceneKey];

  const opacity = useFade(d);
  // TypeBox는 두 번째 문장 시작(narrationSplits[0]) 또는 타이핑 완료 시점에 드롭
  const dropStart = config.narrationSplits[0] ?? typingDone(code.length, s);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={config.audio} />
          <SceneTitle title={title} />
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <TypeBox
              color={color}
              value={value}
              label={label}
              startFrame={s}
              dropStartFrame={dropStart}
            />
          </div>
          <CodeBox lines={[{ text: code, isNew: true }]} startFrame={s} />
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={config.narration}
        secondarySentences={config.subtitleKo}
        splits={config.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG[sceneKey].wordStartFrames}
      />
    </>
  );
};

// ── 씬: BooleanScene ──────────────────────────────────────────
const BooleanScene: React.FC = () => {
  const { booleanScene } = VIDEO_CONFIG;
  const d = booleanScene.durationInFrames;
  const s = booleanScene.speechStartFrame;
  const code = "boolean isStudent = true;";
  const opacity = useFade(d);
  const dropStart =
    booleanScene.narrationSplits[0] ?? typingDone(code.length, s);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={booleanScene.audio} />
          <SceneTitle title="6. boolean - true or false" />
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <BooleanToggleAnim startFrame={s} dropStartFrame={dropStart} />
          </div>
          <CodeBox lines={[{ text: code, isNew: true }]} startFrame={s} />
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={booleanScene.narration}
        secondarySentences={booleanScene.subtitleKo}
        splits={booleanScene.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.booleanScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: SummaryScene ─────────────────────────────────────────
const SUMMARY_LINES = [
  "int age = 25;",
  "double height = 175.5;",
  'String name = "Java";',
  "boolean isStudent = true;",
];
const SUMMARY_CPS = 20; // 요약 씬은 빠르게 타이핑

const SummaryScene: React.FC = () => {
  const { summaryScene } = VIDEO_CONFIG;
  const d = summaryScene.durationInFrames;
  const opacity = useFade(d, { out: false });

  // 캐릭터 수 비례로 각 라인 시작 타이밍 계산
  const totalChars = SUMMARY_LINES.reduce((sum, l) => sum + l.length, 0);
  let cumChars = 0;
  const starts = SUMMARY_LINES.map((line) => {
    const start = Math.floor((cumChars / totalChars) * (d - CROSS));
    cumChars += line.length;
    return start;
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={summaryScene.audio} />
          <SceneTitle title="7. Data Type Summary" />
          {starts.map((startFrom, i) => (
            <Sequence key={i} from={startFrom} durationInFrames={d - startFrom}>
              <CodeBox
                lines={SUMMARY_LINES.slice(0, i + 1).map((text, j) => ({
                  text,
                  isNew: j === i,
                }))}
                startFrame={0}
                charsPerSecond={SUMMARY_CPS}
              />
            </Sequence>
          ))}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={summaryScene.narration}
        secondarySentences={summaryScene.subtitleKo}
        splits={summaryScene.narrationSplits}
        speechStart={summaryScene.speechStartFrame}
        wordFrames={AUDIO_CONFIG.summaryScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues 계산 ─────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.intro,
  VIDEO_CONFIG.valueVsVar,
  VIDEO_CONFIG.intScene,
  VIDEO_CONFIG.doubleScene,
  VIDEO_CONFIG.stringScene,
  VIDEO_CONFIG.booleanScene,
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
      narration: VIDEO_CONFIG.intro.narration,
      speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.intro.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.intro.durationInFrames,
    },
    {
      offset: froms[2],
      narration: VIDEO_CONFIG.valueVsVar.narration,
      speechStartFrame: AUDIO_CONFIG.valueVsVar.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.valueVsVar.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.valueVsVar.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.valueVsVar.durationInFrames,
    },
    {
      offset: froms[3],
      narration: VIDEO_CONFIG.intScene.narration,
      speechStartFrame: AUDIO_CONFIG.intScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.intScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.intScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.intScene.durationInFrames,
    },
    {
      offset: froms[4],
      narration: VIDEO_CONFIG.doubleScene.narration,
      speechStartFrame: AUDIO_CONFIG.doubleScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.doubleScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.doubleScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.doubleScene.durationInFrames,
    },
    {
      offset: froms[5],
      narration: VIDEO_CONFIG.stringScene.narration,
      speechStartFrame: AUDIO_CONFIG.stringScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.stringScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.stringScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.stringScene.durationInFrames,
    },
    {
      offset: froms[6],
      narration: VIDEO_CONFIG.booleanScene.narration,
      speechStartFrame: AUDIO_CONFIG.booleanScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.booleanScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.booleanScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.booleanScene.durationInFrames,
    },
    {
      offset: froms[7],
      narration: VIDEO_CONFIG.summaryScene.narration,
      speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.summaryScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
    },
  ]);
})();

export const SRT_DATA_KO: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...VIDEO_CONFIG.intro.subtitleKo,
  ...VIDEO_CONFIG.valueVsVar.subtitleKo,
  ...VIDEO_CONFIG.intScene.subtitleKo,
  ...VIDEO_CONFIG.doubleScene.subtitleKo,
  ...VIDEO_CONFIG.stringScene.subtitleKo,
  ...VIDEO_CONFIG.booleanScene.subtitleKo,
  ...VIDEO_CONFIG.summaryScene.subtitleKo,
]);

export const SRT_TRACKS: SrtTracks = {
  "en-US": SRT_DATA,
  "ko-KR": SRT_DATA_KO,
};

// ── Composition 메타 ──────────────────────────────────────────
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export const JavaDataTypes: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.intro.durationInFrames}
    >
      <IntroScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.valueVsVar.durationInFrames}
    >
      <ValueVsVarScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.intScene.durationInFrames}
    >
      <TypeScene sceneKey="intScene" config={VIDEO_CONFIG.intScene} />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.doubleScene.durationInFrames}
    >
      <TypeScene sceneKey="doubleScene" config={VIDEO_CONFIG.doubleScene} />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.stringScene.durationInFrames}
    >
      <TypeScene sceneKey="stringScene" config={VIDEO_CONFIG.stringScene} />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.booleanScene.durationInFrames}
    >
      <BooleanScene />
    </Sequence>
    <Sequence
      from={fromValues[7]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export { JavaDataTypes as Component };

// src/compositions/001-Java-Basic/003-JavaOperators.tsx
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
import { CONTENT as ENG_CONTENT } from "../ENG/003-2-content";
import { CONTENT } from "./003-2-content";
import { AUDIO_CONFIG } from "./003-3-audio.gen";
import {
  BG,
  BG_CODE,
  BG_THUMB,
  C_NUMBER,
  C_OPERATOR,
  C_TEAL,
  TEXT,
} from "./colors";
import { HEIGHT, WIDTH } from "./config";

// 씬 내부에서 사용하는 색상 별칭
const C_INT = C_NUMBER; // 숫자 리터럴
const C_OP = C_OPERATOR; // 연산자
const C_NUM = C_NUMBER; // 숫자 리터럴 (몫 등)
const C_REM = C_TEAL; // 나머지(%) 강조

// ── 상수 ─────────────────────────────────────────────────────

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  intro: {
    audio: "op-intro.mp3",
    durationInFrames: AUDIO_CONFIG.intro.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
    narration: CONTENT.intro.narration as string[],
    narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
  },
  addSubScene: {
    audio: "op-addsub.mp3",
    durationInFrames: AUDIO_CONFIG.addSubScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.addSubScene.speechStartFrame,
    narration: CONTENT.addSubScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.addSubScene.narrationSplits,
  },
  mulDivScene: {
    audio: "op-muldiv.mp3",
    durationInFrames: AUDIO_CONFIG.mulDivScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.mulDivScene.speechStartFrame,
    narration: CONTENT.mulDivScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.mulDivScene.narrationSplits,
  },
  remScene: {
    audio: "op-rem.mp3",
    durationInFrames: AUDIO_CONFIG.remScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.remScene.speechStartFrame,
    narration: CONTENT.remScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.remScene.narrationSplits,
  },
  summaryScene: {
    audio: "op-summary.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
};

// ── 공통: 코드 라인 점진적 등장 블록 ─────────────────────────
const CodeLines: React.FC<{
  lines: { text: string; startFrame: number }[];
  cps?: number;
}> = ({ lines, cps = 40 }) => {
  const frame = useCurrentFrame();
  const visibleLines = lines.filter((l) => frame >= l.startFrame);
  if (visibleLines.length === 0) return null;
  return (
    <CodeBlock
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: 14,
        padding: "36px 56px",
        ...monoStyle,
        fontSize: CODE.xl,
        lineHeight: 1.9,
      }}
    >
      {visibleLines.map((l, i) => {
        const isLast = i === visibleLines.length - 1;
        if (!isLast) {
          return (
            <div key={i} style={{ color: TEXT, opacity: 0.55 }}>
              <JavaLine text={l.text} />
            </div>
          );
        }
        return (
          <TypingCodeLine
            key={i}
            text={l.text}
            startFrame={l.startFrame}
            cps={cps}
            lineHeight="inherit"
          />
        );
      })}
    </CodeBlock>
  );
};

// ── 씬: ThumbnailScene ────────────────────────────────────────
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
          fontSize: 120,
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
        <span style={{ color: C_TEAL }}>산술 연산자</span>
      </div>
      <div
        style={{
          ...monoStyle,
          fontSize: 44,
          color: C_TEAL,
          letterSpacing: 12,
          opacity: 0.7,
        }}
      >
        + &nbsp; - &nbsp; * &nbsp; / &nbsp; %
      </div>
    </AbsoluteFill>
  );
};

// ── 씬: IntroScene ────────────────────────────────────────────
const INTRO_OPS = ["+", "-", "*", "/", "%"];

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { intro } = VIDEO_CONFIG;
  const opacity = useFade(intro.durationInFrames, { in: true });

  // 두 번째 문장(더하기, 빼기, 곱하기, 나누기, 나머지)의 앞 5단어 발화 프레임
  // TODO: wordTiming 미지원 — 동적 인덱스 (slice(0,5) 후 reduce로 순회)
  const opWordFrames = (AUDIO_CONFIG.intro.wordStartFrames[1] ??
    []) as readonly number[];
  const currentOpIdx = opWordFrames
    .slice(0, 5)
    .reduce((acc, f, i) => (frame >= f ? i : acc), -1);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={intro.audio} />
          <SceneTitle title="1. 산술 연산자란?" />
          <div
            style={{
              position: "absolute",
              top: "46%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: 24,
            }}
          >
            {INTRO_OPS.map((op, i) => {
              const appear = spring({
                frame: frame - i * 12,
                fps,
                config: { damping: 14, stiffness: 140 },
                durationInFrames: 60,
              });
              const sc = interpolate(appear, [0, 1], [0.3, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const highlighted = i === currentOpIdx;
              return (
                <div
                  key={op}
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 24,
                    border: `3px solid ${highlighted ? C_OP : `${C_OP}88`}`,
                    background: highlighted ? `${C_OP}40` : `${C_OP}1a`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${sc * (highlighted ? 1.08 : 1)})`,
                    opacity: appear,
                    boxShadow: highlighted ? `0 0 24px ${C_OP}66` : "none",
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: 72,
                      fontWeight: 700,
                      color: C_OP,
                    }}
                  >
                    {op}
                  </span>
                </div>
              );
            })}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={intro.narration}
        splits={intro.narrationSplits}
        speechStart={intro.speechStartFrame}
        wordFrames={AUDIO_CONFIG.intro.wordStartFrames}
      />
    </>
  );
};

// ── 씬: AddSubScene ───────────────────────────────────────────
const AddSubScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { addSubScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const [split0] = cfg.narrationSplits as readonly number[];
  const opacity = useFade(d);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 덧셈 · 뺄셈" />
          <div style={{ opacity: frame >= s ? 1 : 0 }}>
            <CodeLines
              lines={[
                { text: "int a = 10, b = 3;", startFrame: s },
                { text: "int sum  = a + b;   // 13", startFrame: s + 5 },
                { text: "int diff = a - b;   //  7", startFrame: split0 },
              ]}
            />
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.addSubScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: MulDivScene ───────────────────────────────────────────
const MulDivScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { mulDivScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const [split0, split1] = cfg.narrationSplits as readonly number[];
  const opacity = useFade(d);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 곱셈 · 나눗셈" />
          {frame >= s && (
            <CodeLines
              lines={[
                { text: "int a = 10, b = 3;", startFrame: s },
                { text: "int prod = a * b;   // 30", startFrame: s + 5 },
                { text: "int quot = a / b;   //  3", startFrame: split0 },
                {
                  text: "// 정수끼리 나누면 소수점은 버려집니다.",
                  startFrame: split1,
                },
              ]}
            />
          )}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.mulDivScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: RemScene (나머지 연산자) ──────────────────────────────
const RemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { remScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const [split0, split1] = cfg.narrationSplits as readonly number[];
  const opacity = useFade(d);

  // 나눗셈 시각화 등장
  const divAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 60,
  });

  // split0: 몫/나머지 강조 등장
  const detailAppear = spring({
    frame: frame - split0,
    fps,
    config: { damping: 12, stiffness: 160 },
    durationInFrames: 50,
  });

  // split1: 활용 예시 등장
  const usageAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 50,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 나머지 연산" />

          {/* 메인: 11 % 3 == 2 */}
          <div
            style={{
              position: "absolute",
              top: "36%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${interpolate(divAppear, [0, 1], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              opacity: divAppear,
              display: "flex",
              alignItems: "center",
              gap: 20,
              ...monoStyle,
              fontSize: 80,
              fontWeight: 900,
            }}
          >
            <span style={{ color: C_INT }}>11</span>
            <span style={{ color: C_REM }}>%</span>
            <span style={{ color: C_INT }}>3</span>
            <span style={{ color: C_OP }}>==</span>
            <span style={{ color: C_REM, textShadow: `0 0 30px ${C_REM}88` }}>
              2
            </span>
          </div>

          {/* split0: 몫 3, 나머지 2 분리 설명 */}
          <div
            style={{
              position: "absolute",
              top: "58%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
              opacity: detailAppear,
              display: "flex",
              gap: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                background: BG_CODE,
                borderRadius: 16,
                padding: "20px 40px",
              }}
            >
              <div style={{ fontFamily: uiFont, fontSize: 24, color: "#888" }}>
                몫
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 64,
                  fontWeight: 900,
                  color: C_NUM,
                }}
              >
                3
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: CODE.md,
                  color: "#555",
                }}
              >
                11 / 3
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                background: `${C_REM}1a`,
                border: `2px solid ${C_REM}66`,
                borderRadius: 16,
                padding: "20px 40px",
              }}
            >
              <div style={{ fontFamily: uiFont, fontSize: 24, color: C_REM }}>
                나머지
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 64,
                  fontWeight: 900,
                  color: C_REM,
                }}
              >
                2
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: CODE.md,
                  color: C_REM,
                  opacity: 0.6,
                }}
              >
                11 % 3
              </div>
            </div>
          </div>

          {/* split1: 활용 예시 */}
          <CodeBlock
            style={{
              position: "absolute",
              bottom: 230,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: usageAppear,
              display: "flex",
              gap: 20,
              ...monoStyle,
              fontSize: CODE.xl,
              padding: "14px 32px",
            }}
          >
            <span style={{ color: TEXT }}>n</span>
            <span style={{ color: C_OP }}>%</span>
            <span style={{ color: C_INT }}>2</span>
            <span style={{ color: C_OP }}>==</span>
            <span style={{ color: C_INT }}>0</span>
            <span
              style={{
                fontFamily: uiFont,
                fontSize: 24,
                color: "#666",
                marginLeft: 4,
              }}
            >
              → 짝수
            </span>
            <span style={{ color: "#444", margin: "0 8px" }}>/</span>
            <span style={{ color: TEXT }}>n</span>
            <span style={{ color: C_OP }}>%</span>
            <span style={{ color: C_INT }}>2</span>
            <span style={{ color: C_OP }}>==</span>
            <span style={{ color: C_INT }}>1</span>
            <span
              style={{
                fontFamily: uiFont,
                fontSize: 24,
                color: "#666",
                marginLeft: 4,
              }}
            >
              → 홀수
            </span>
          </CodeBlock>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.remScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: SummaryScene ─────────────────────────────────────────
const SUMMARY_LINES = [
  "int a = 10, b = 3;",
  "int sum  = a + b;   // 13",
  "int diff = a - b;   //  7",
  "int prod = a * b;   // 30",
  "int quot = a / b;   //  3",
  "int rem  = a % b;   //  1",
];
const SUMMARY_CPS = 22;

const SummaryScene: React.FC = () => {
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });

  const totalChars = SUMMARY_LINES.reduce((sum, l) => sum + l.length, 0);
  let cum = 0;
  const starts = SUMMARY_LINES.map((line) => {
    const start = Math.floor((cum / totalChars) * (d - CROSS));
    cum += line.length;
    return start;
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 산술 연산자 정리" />
          {starts.map((startFrom, i) => (
            <Sequence key={i} from={startFrom} durationInFrames={d - startFrom}>
              <CodeBlock
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "36px 56px",
                  ...monoStyle,
                  fontSize: CODE.xl,
                  lineHeight: 1.85,
                }}
              >
                {SUMMARY_LINES.slice(0, i + 1).map((text, j) =>
                  j < i ? (
                    <div key={j} style={{ color: TEXT }}>
                      <JavaLine text={text} />
                    </div>
                  ) : (
                    <TypingCodeLine
                      key={j}
                      text={text}
                      startFrame={0}
                      cps={SUMMARY_CPS}
                      lineHeight="inherit"
                    />
                  ),
                )}
              </CodeBlock>
            </Sequence>
          ))}
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

// ── 씬 목록 + fromValues ──────────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.intro,
  VIDEO_CONFIG.addSubScene,
  VIDEO_CONFIG.mulDivScene,
  VIDEO_CONFIG.remScene,
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
      narration: VIDEO_CONFIG.addSubScene.narration,
      speechStartFrame: AUDIO_CONFIG.addSubScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.addSubScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.addSubScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.addSubScene.durationInFrames,
    },
    {
      offset: froms[3],
      narration: VIDEO_CONFIG.mulDivScene.narration,
      speechStartFrame: AUDIO_CONFIG.mulDivScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.mulDivScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.mulDivScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.mulDivScene.durationInFrames,
    },
    {
      offset: froms[4],
      narration: VIDEO_CONFIG.remScene.narration,
      speechStartFrame: AUDIO_CONFIG.remScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.remScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.remScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.remScene.durationInFrames,
    },
    {
      offset: froms[5],
      narration: VIDEO_CONFIG.summaryScene.narration,
      speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.summaryScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
    },
  ]);
})();

export const SRT_DATA_EN: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...ENG_CONTENT.intro.narration,
  ...ENG_CONTENT.addSubScene.narration,
  ...ENG_CONTENT.mulDivScene.narration,
  ...ENG_CONTENT.remScene.narration,
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
export const JavaOperators: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.addSubScene.durationInFrames}
    >
      <AddSubScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.mulDivScene.durationInFrames}
    >
      <MulDivScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.remScene.durationInFrames}
    >
      <RemScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaOperators;

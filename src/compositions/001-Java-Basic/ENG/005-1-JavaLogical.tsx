// src/compositions/001-Java-Basic/005-JavaLogical.tsx
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
import {
  CODE,
  CROSS,
  ContentArea,
  FONT,
  SceneAudio,
  SceneTitle,
  Subtitle,
  THUMB_CROSS,
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
import { CONTENT as KOR_CONTENT } from "../KOR/005-2-content";
import { CONTENT } from "./005-2-content";
import { AUDIO_CONFIG } from "./005-3-audio.gen";
import { BG } from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── 상수 ─────────────────────────────────────────────────────
const C_LOG = "#e5c07b"; // Logical Operators — 골든
const C_TRUE = "#4ec9b0"; // true  → 틸
const C_FALSE = "#f47c7c"; // false → 붉은
const C_BOOL = "#d4834e"; // boolean 키워드

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  intro: {
    audio: "lgc-intro.mp3",
    durationInFrames: AUDIO_CONFIG.intro.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
    narration: CONTENT.intro.narration as string[],
    subtitleKo: KOR_CONTENT.intro.narration as string[],
    narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
  },
  andScene: {
    audio: "lgc-and.mp3",
    durationInFrames: AUDIO_CONFIG.andScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.andScene.speechStartFrame,
    narration: CONTENT.andScene.narration as string[],
    subtitleKo: KOR_CONTENT.andScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.andScene.narrationSplits,
  },
  orScene: {
    audio: "lgc-or.mp3",
    durationInFrames: AUDIO_CONFIG.orScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.orScene.speechStartFrame,
    narration: CONTENT.orScene.narration as string[],
    subtitleKo: KOR_CONTENT.orScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.orScene.narrationSplits,
  },
  notScene: {
    audio: "lgc-not.mp3",
    durationInFrames: AUDIO_CONFIG.notScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.notScene.speechStartFrame,
    narration: CONTENT.notScene.narration as string[],
    subtitleKo: KOR_CONTENT.notScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.notScene.narrationSplits,
  },
  summaryScene: {
    audio: "lgc-summary.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    subtitleKo: KOR_CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
};

// ── 컴포넌트: BoolPill ────────────────────────────────────────
const BoolPill: React.FC<{ value: boolean; size?: number }> = ({
  value,
  size = 52,
}) => {
  const color = value ? C_TRUE : C_FALSE;
  return (
    <span
      style={{
        ...monoStyle,
        fontSize: size,
        fontWeight: 700,
        color,
        background: `${color}22`,
        border: `2px solid ${color}88`,
        borderRadius: 12,
        padding: "6px 22px",
        display: "inline-block",
      }}
    >
      {value ? "true" : "false"}
    </span>
  );
};

// ── 컴포넌트: EvalRow (A OP B = result) ──────────────────────
//   AND/OR 용: [left] [op] [right] → [result]
//   NOT 용:   prefixOp="!" → [!left] → [result]
const EvalRow: React.FC<{
  left: boolean;
  op: string;
  right?: boolean;
  result: boolean;
  startFrame: number;
  dim?: boolean;
  prefixOp?: string; // NOT 연산자용: op를 left pill 앞에 붙임
}> = ({ left, op, right, result, startFrame, dim = false, prefixOp }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 44,
  });
  const sc = interpolate(appear, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const resultApp = spring({
    frame: frame - startFrame - 30,
    fps,
    config: { damping: 11, stiffness: 120 },
    durationInFrames: 40,
  });
  const resultSc = interpolate(resultApp, [0, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rowOpacity = dim
    ? 0.38
    : interpolate(appear, [0, 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const opStyle: React.CSSProperties = {
    ...monoStyle,
    fontSize: 56,
    fontWeight: 900,
    color: C_LOG,
    textShadow: `0 0 24px ${C_LOG}66`,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: rowOpacity,
        transform: `scale(${sc})`,
      }}
    >
      {prefixOp ? (
        /* NOT: !를 pill 앞에 붙여서 하나처럼 표시 */
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={opStyle}>{prefixOp}</span>
          <BoolPill value={left} />
        </div>
      ) : (
        /* AND / OR */
        <>
          <BoolPill value={left} />
          <span style={opStyle}>{op}</span>
          {right !== undefined && <BoolPill value={right} />}
        </>
      )}

      {/* 화살표 + 결과 */}
      {frame >= startFrame + 30 && (
        <>
          <span
            style={{
              fontSize: 40,
              color: "#444",
              transform: `scale(${resultSc})`,
            }}
          >
            →
          </span>
          <div style={{ transform: `scale(${resultSc})` }}>
            <BoolPill value={result} size={56} />
          </div>
        </>
      )}
    </div>
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
        background: "#0d0d1a",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        opacity: fadeOut,
      }}
    >
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
        <span style={{ color: "#4ec9b0" }}>Logical Operators</span>
      </div>
      {/* 세 연산자 */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: 12,
          ...monoStyle,
        }}
      >
        {[
          ["&&", "AND"],
          ["||", "OR"],
          ["!", "NOT"],
        ].map(([op, label]) => (
          <div
            key={op}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              background: "#4ec9b018",
              border: "2px solid #4ec9b055",
              borderRadius: 20,
              padding: "22px 36px",
            }}
          >
            <span style={{ fontSize: 56, fontWeight: 900, color: "#4ec9b0" }}>
              {op}
            </span>
            <span
              style={{
                fontFamily: uiFont,
                fontSize: 22,
                color: C_LOG,
                opacity: 0.7,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 씬: IntroScene ────────────────────────────────────────────
const INTRO_OPS = ["&&", "||", "!"];

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { intro } = VIDEO_CONFIG;
  const opacity = useFade(intro.durationInFrames, { in: true });

  const titleAppear = spring({
    frame: frame - intro.speechStartFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 48,
  });
  const titleScale = interpolate(titleAppear, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 카드 등장 시 타이틀이 위로 올라감
  const split0 = intro.narrationSplits[0] ?? Infinity;
  const titleSlide = spring({
    frame: frame - split0,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 40,
  });
  const titleTop = interpolate(titleSlide, [0, 1], [40, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={intro.audio} />
          <SceneTitle title="1. What Are Logical Operators?" />

          {/* 핵심 키워드 타이틀 */}
          <div
            style={{
              position: "absolute",
              top: `${titleTop}%`,
              left: "50%",
              transform: `translate(-50%, -50%) scale(${titleScale})`,
              fontFamily: uiFont,
              fontSize: 72,
              fontWeight: 900,
              color: "#4ec9b0",
              opacity: titleAppear,
              textShadow: "0 0 40px rgba(78,201,176,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            Logical Operators
          </div>

          <div
            style={{
              position: "absolute",
              top: "52%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            {INTRO_OPS.map((op, i) => {
              const opFrames = [
                AUDIO_CONFIG.intro.wordTiming["AND"][0],
                AUDIO_CONFIG.intro.wordTiming["OR"][0],
                AUDIO_CONFIG.intro.wordTiming["NOT"][0],
              ];
              const appear = spring({
                frame: frame - opFrames[i],
                fps,
                config: { damping: 13, stiffness: 140 },
                durationInFrames: 60,
              });
              const sc = interpolate(appear, [0, 1], [0.3, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={op}
                  style={{
                    width: i === 2 ? 140 : 200,
                    height: 200,
                    borderRadius: 28,
                    border: `3px solid ${C_LOG}88`,
                    background: `${C_LOG}18`,
                    boxShadow: `0 0 36px ${C_LOG}22`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transform: `scale(${sc})`,
                    opacity: appear,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: 64,
                      fontWeight: 700,
                      color: C_LOG,
                    }}
                  >
                    {op}
                  </span>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: FONT.label,
                      color: C_LOG,
                      opacity: 0.7,
                    }}
                  >
                    {op === "&&" ? "AND" : op === "||" ? "OR" : "NOT"}
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

// ── 씬: AndScene ─────────────────────────────────────────────
const AndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { andScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const [split0] = cfg.narrationSplits as readonly number[];
  const opacity = useFade(d);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. AND (&&)" />

          {/* 헤더 */}
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "18%",
                left: "50%",
                transform: "translateX(-50%)",
                ...monoStyle,
                fontSize: CODE.xl,
                opacity: 0.5,
                color: "#d4d4d4",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              <div>
                <span style={{ color: C_BOOL }}>boolean</span>
                <span style={{ color: "#d4d4d4" }}> x = </span>
                <span style={{ color: C_TRUE }}>true</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </div>
              <div>
                <span style={{ color: C_BOOL }}>boolean</span>
                <span style={{ color: "#d4d4d4" }}> y = </span>
                <span style={{ color: C_FALSE }}>false</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </div>
            </div>
          )}

          {/* 식 레이블: x && y → false */}
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translateX(-50%)",
                ...monoStyle,
                fontSize: CODE.xl,
                color: "#aaaaaa",
              }}
            >
              <span style={{ color: "#d4d4d4" }}>x </span>
              <span style={{ color: C_LOG }}>&amp;&amp;</span>
              <span style={{ color: "#d4d4d4" }}> y</span>
              <span style={{ color: "#555" }}> → </span>
              <span style={{ color: C_FALSE }}>false</span>
            </div>
          )}

          {/* 케이스 1: true && false → false */}
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "54%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <EvalRow
                left={true}
                op="&&"
                right={false}
                result={false}
                startFrame={s}
                dim={frame >= split0}
              />
            </div>
          )}

          {/* 케이스 2: true && true → true */}
          {frame >= split0 && (
            <div
              style={{
                position: "absolute",
                top: "72%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <EvalRow
                left={true}
                op="&&"
                right={true}
                result={true}
                startFrame={split0}
              />
            </div>
          )}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.andScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: OrScene ──────────────────────────────────────────────
const OrScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { orScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const [split0] = cfg.narrationSplits as readonly number[];
  const opacity = useFade(d);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. OR (||)" />

          {/* 헤더: 변수 선언 (두 줄) */}
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "18%",
                left: "50%",
                transform: "translateX(-50%)",
                ...monoStyle,
                fontSize: CODE.xl,
                opacity: 0.5,
                color: "#d4d4d4",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              <div>
                <span style={{ color: C_BOOL }}>boolean</span>
                <span style={{ color: "#d4d4d4" }}> x = </span>
                <span style={{ color: C_TRUE }}>true</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </div>
              <div>
                <span style={{ color: C_BOOL }}>boolean</span>
                <span style={{ color: "#d4d4d4" }}> y = </span>
                <span style={{ color: C_FALSE }}>false</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </div>
            </div>
          )}

          {/* 식 레이블: x || y → true */}
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translateX(-50%)",
                ...monoStyle,
                fontSize: CODE.xl,
                color: "#aaaaaa",
              }}
            >
              <span style={{ color: "#d4d4d4" }}>x </span>
              <span style={{ color: C_LOG }}>||</span>
              <span style={{ color: "#d4d4d4" }}> y</span>
              <span style={{ color: "#555" }}> → </span>
              <span style={{ color: C_TRUE }}>true</span>
            </div>
          )}

          {/* 케이스 1: true || false → true */}
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "54%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <EvalRow
                left={true}
                op="||"
                right={false}
                result={true}
                startFrame={s}
                dim={frame >= split0}
              />
            </div>
          )}

          {/* 케이스 2: false || false → false */}
          {frame >= split0 && (
            <div
              style={{
                position: "absolute",
                top: "72%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <EvalRow
                left={false}
                op="||"
                right={false}
                result={false}
                startFrame={split0}
              />
            </div>
          )}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.orScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: NotScene ─────────────────────────────────────────────
const NotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { notScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const [split0] = cfg.narrationSplits as readonly number[];
  const opacity = useFade(d);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. NOT (!)" />

          {/* !true → false */}
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "42%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <EvalRow
                left={true}
                op="!"
                result={false}
                startFrame={s}
                dim={frame >= split0}
                prefixOp="!"
              />
            </div>
          )}

          {/* !false → true */}
          {frame >= split0 && (
            <div
              style={{
                position: "absolute",
                top: "62%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <EvalRow
                left={false}
                op="!"
                result={true}
                startFrame={split0}
                prefixOp="!"
              />
            </div>
          )}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.notScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: SummaryScene ─────────────────────────────────────────
const SUMMARY_ROWS = [
  { op: "&&", label: "AND", desc: "every condition must be true" },
  { op: "||", label: "OR", desc: "one true condition is enough" },
  { op: "!", label: "NOT", desc: "flips true and false" },
] as const;

const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });
  const s = cfg.speechStartFrame;
  const split0 = cfg.narrationSplits[0] ?? Infinity;

  // 1문장: 타이틀 등장
  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 48,
  });
  const titleScale = interpolate(titleAppear, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 2문장: 타이틀 위로 + 카드 등장
  const titleSlide = spring({
    frame: frame - split0,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 40,
  });
  const titleTop = interpolate(titleSlide, [0, 1], [40, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. Logical Operator Summary" />

          {/* 타이틀: Logical Operator Summary */}
          <div
            style={{
              position: "absolute",
              top: `${titleTop}%`,
              left: "50%",
              transform: `translate(-50%, -50%) scale(${titleScale})`,
              fontFamily: uiFont,
              fontSize: 64,
              fontWeight: 900,
              color: C_LOG,
              opacity: titleAppear,
              textShadow: `0 0 40px ${C_LOG}44`,
              whiteSpace: "nowrap",
            }}
          >
            Logical Operator Summary
          </div>

          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 22,
              width: 900,
            }}
          >
            {SUMMARY_ROWS.map((row, i) => {
              // &&(idx 0→85), ||(idx 5→150), !(idx 10→216) 발화 시점 기준
              // TODO: wordTiming 미지원 — 동적 인덱스
              const opWordIndices = [0, 5, 10] as const;
              const triggerFrame =
                AUDIO_CONFIG.summaryScene.wordStartFrames[1][
                  opWordIndices[i]
                ] ?? i * 10;
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
                    border: `2px solid ${C_LOG}44`,
                    borderRadius: 20,
                    padding: "24px 36px",
                    opacity: appear,
                    transform: `scale(${sc})`,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      color: C_LOG,
                      fontSize: 44,
                      fontWeight: 900,
                      minWidth: 72,
                      textAlign: "center",
                    }}
                  >
                    {row.op}
                  </span>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: FONT.label,
                      color: C_LOG,
                      opacity: 0.65,
                      minWidth: 54,
                    }}
                  >
                    {row.label}
                  </span>
                  <span style={{ color: "#555", fontSize: 28 }}>—</span>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: 30,
                      color: "#d4d4d4",
                    }}
                  >
                    {row.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
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
  VIDEO_CONFIG.andScene,
  VIDEO_CONFIG.orScene,
  VIDEO_CONFIG.notScene,
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
      narration: VIDEO_CONFIG.andScene.narration,
      speechStartFrame: AUDIO_CONFIG.andScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.andScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.andScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.andScene.durationInFrames,
    },
    {
      offset: froms[3],
      narration: VIDEO_CONFIG.orScene.narration,
      speechStartFrame: AUDIO_CONFIG.orScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.orScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.orScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.orScene.durationInFrames,
    },
    {
      offset: froms[4],
      narration: VIDEO_CONFIG.notScene.narration,
      speechStartFrame: AUDIO_CONFIG.notScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.notScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.notScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.notScene.durationInFrames,
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

export const SRT_DATA_KO: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...VIDEO_CONFIG.intro.subtitleKo,
  ...VIDEO_CONFIG.andScene.subtitleKo,
  ...VIDEO_CONFIG.orScene.subtitleKo,
  ...VIDEO_CONFIG.notScene.subtitleKo,
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
export const JavaLogical: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.andScene.durationInFrames}
    >
      <AndScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.orScene.durationInFrames}
    >
      <OrScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.notScene.durationInFrames}
    >
      <NotScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaLogical;

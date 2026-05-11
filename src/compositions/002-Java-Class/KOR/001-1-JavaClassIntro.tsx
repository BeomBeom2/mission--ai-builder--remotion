// src/compositions/002-Java-Class/KOR/001-1-JavaClassIntro.tsx
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
import { buildSrtData, computeFromValues } from "../../../utils/srt";
import type { SrtEntry, SrtTracks } from "../../../utils/srt";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { CONTENT } from "./001-2-content";
import { AUDIO_CONFIG } from "./001-3-audio.gen";
import { BG, BG_CODE, BG_THUMB, C_PAIN, C_TEAL, TEXT } from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  painScene: {
    audio: "cls-painScene.mp3",
    durationInFrames: AUDIO_CONFIG.painScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.painScene.speechStartFrame,
    narration: CONTENT.painScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.painScene.narrationSplits,
  },
  packageScene: {
    audio: "cls-packageScene.mp3",
    durationInFrames: AUDIO_CONFIG.packageScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.packageScene.speechStartFrame,
    narration: CONTENT.packageScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.packageScene.narrationSplits,
  },
  codeAnalogy: {
    audio: "cls-codeAnalogy.mp3",
    durationInFrames: AUDIO_CONFIG.codeAnalogy.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.codeAnalogy.speechStartFrame,
    narration: CONTENT.codeAnalogy.narration as string[],
    narrationSplits: AUDIO_CONFIG.codeAnalogy.narrationSplits,
  },
  bundleScene: {
    audio: "cls-bundleScene.mp3",
    durationInFrames: AUDIO_CONFIG.bundleScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.bundleScene.speechStartFrame,
    narration: CONTENT.bundleScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.bundleScene.narrationSplits,
  },
  objectPreview: {
    audio: "cls-objectPreview.mp3",
    durationInFrames: AUDIO_CONFIG.objectPreview.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.objectPreview.speechStartFrame,
    narration: CONTENT.objectPreview.narration as string[],
    narrationSplits: AUDIO_CONFIG.objectPreview.narrationSplits,
  },
  outroScene: {
    audio: "cls-outroScene.mp3",
    durationInFrames: AUDIO_CONFIG.outroScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.outroScene.speechStartFrame,
    narration: CONTENT.outroScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.outroScene.narrationSplits,
  },
} as const;

// ── 씬: ThumbnailScene ──────────────────────────────────────
const ThumbnailScene: React.FC = () => (
  <Thumb
    seriesLabel={CONTENT.thumbnail.seriesLabel}
    title={CONTENT.thumbnail.title}
    subtitle={CONTENT.thumbnail.subtitle}
    badge={CONTENT.thumbnail.badge}
  />
);

// ── 씬: PainScene — 따로 보내는 고통 ──────────────────────────
const BOXES = ["📦 A", "📦 B", "📦 C", "📦 D"];
const STEPS = [
  { emoji: "🚢", label: "싣기" },
  { emoji: "📥", label: "내리기" },
  { emoji: "🚛", label: "옮기기" },
];
const NE_BUN_RANGES = [
  [3, 4],
  [6, 7],
  [10, 11],
] as const;
const PACKAGE_STEP_RANGES = [
  [0, 0],
  [1, 1],
  [2, 2],
] as const;
const ACTIVE_HOLD_SECONDS = 0.5;

const getActiveStepIndex = (
  frame: number,
  wordStartFrames: readonly number[],
  wordEndFrames: readonly number[],
  ranges: readonly (readonly [number, number])[],
  holdFrames: number,
) =>
  ranges.findIndex(([startIdx, endIdx], idx) => {
    const start = wordStartFrames[startIdx];
    const end = wordEndFrames[endIdx];
    const nextStart =
      idx + 1 < ranges.length
        ? wordStartFrames[ranges[idx + 1][0]]
        : Number.POSITIVE_INFINITY;
    const holdEnd = Math.min(end + holdFrames, nextStart - 1);
    return (
      (frame >= start && frame <= end) || (frame > end && frame <= holdEnd)
    );
  });

const PainScene: React.FC = () => {
  const { painScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const holdFrames = Math.round(fps * ACTIVE_HOLD_SECONDS);
  const activeStepIdx = getActiveStepIndex(
    frame,
    AUDIO_CONFIG.painScene.wordStartFrames[1],
    AUDIO_CONFIG.painScene.wordEndFrames[1],
    NE_BUN_RANGES,
    holdFrames,
  );

  // 1문장: 상자 4개 등장
  const boxAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 2문장: "× 4" 라벨 등장
  const timesAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 따로 보내는 고통" />
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
            }}
          >
            {/* 상자 4개 */}
            <div
              style={{
                display: "flex",
                gap: 16,
                opacity: boxAppear,
                transform: `scale(${interpolate(boxAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              {BOXES.map((box, i) => (
                <div
                  key={i}
                  style={{
                    background: BG_CODE,
                    borderRadius: 12,
                    padding: "18px 22px",
                    fontFamily: uiFont,
                    fontSize: 28,
                    fontWeight: 700,
                    color: TEXT,
                    border: `2px solid ${C_PAIN}44`,
                    textAlign: "center",
                  }}
                >
                  {box}
                </div>
              ))}
            </div>

            {/* 단계 × 4 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                opacity: timesAppear,
                transform: `scale(${interpolate(timesAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 12,
                      fontFamily: uiFont,
                      fontSize: 32,
                      fontWeight: 700,
                      color:
                        activeStepIdx >= 0
                          ? activeStepIdx === i
                            ? "#ffffff"
                            : TEXT
                          : TEXT,
                      padding: "12px 20px",
                      border: `2px solid ${
                        activeStepIdx >= 0
                          ? activeStepIdx === i
                            ? C_PAIN
                            : `${C_PAIN}33`
                          : `${C_PAIN}33`
                      }`,
                      background:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? `${C_PAIN}22`
                          : BG_CODE,
                      boxShadow:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? `0 0 0 2px ${C_PAIN}55`
                          : "none",
                      minWidth: 180,
                      textAlign: "center",
                    }}
                  >
                    {step.emoji} {step.label}
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 36,
                      fontWeight: 900,
                      color:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? "#ffffff"
                          : C_PAIN,
                      textShadow:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? `0 0 18px ${C_PAIN}99`
                          : "none",
                    }}
                  >
                    × 4
                  </div>
                </div>
              ))}
            </div>
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

// ── 씬: PackageScene — 묶어서 보내기 ──────────────────────────
const PackageScene: React.FC = () => {
  const { packageScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const holdFrames = Math.round(fps * ACTIVE_HOLD_SECONDS);
  const activeStepIdx = getActiveStepIndex(
    frame,
    AUDIO_CONFIG.packageScene.wordStartFrames[1],
    AUDIO_CONFIG.packageScene.wordEndFrames[1],
    PACKAGE_STEP_RANGES,
    holdFrames,
  );

  // 1문장: 묶음 패키지 등장
  const packageAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 2문장: "× 1" 등장
  const timesAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 묶어서 보내기" />
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
            }}
          >
            {/* 묶음 패키지 */}
            <div
              style={{
                background: BG_CODE,
                borderRadius: 12,
                display: "flex",
                gap: 0,
                border: `3px solid ${C_TEAL}88`,
                padding: "20px 28px",
                opacity: packageAppear,
                transform: `scale(${interpolate(packageAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              {BOXES.map((box, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: uiFont,
                    fontSize: 28,
                    fontWeight: 700,
                    color: C_TEAL,
                    padding: "10px 14px",
                    textAlign: "center",
                  }}
                >
                  {box}
                </div>
              ))}
            </div>

            {/* 라벨 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.label,
                fontWeight: 700,
                color: C_TEAL,
                opacity: packageAppear * 0.85,
                letterSpacing: 2,
              }}
            >
              하나로 묶음
            </div>

            {/* 단계 × 1 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                opacity: timesAppear,
                transform: `scale(${interpolate(timesAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 12,
                      fontFamily: uiFont,
                      fontSize: 32,
                      fontWeight: 700,
                      color:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? "#ffffff"
                          : TEXT,
                      padding: "12px 20px",
                      border: `2px solid ${
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? C_TEAL
                          : `${C_TEAL}33`
                      }`,
                      background:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? `${C_TEAL}22`
                          : BG_CODE,
                      boxShadow:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? `0 0 0 2px ${C_TEAL}55`
                          : "none",
                      minWidth: 180,
                      textAlign: "center",
                    }}
                  >
                    {step.emoji} {step.label}
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 36,
                      fontWeight: 900,
                      color:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? "#ffffff"
                          : C_TEAL,
                      textShadow:
                        activeStepIdx >= 0 && activeStepIdx === i
                          ? `0 0 18px ${C_TEAL}99`
                          : "none",
                    }}
                  >
                    × 1
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.packageScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: CodeAnalogy — 코드에서도 마찬가지 ─────────────────────
const SCATTERED_VARS = [
  'String name = "김민준";',
  "int age = 15;",
  "int score = 85;",
  "int grade = 2;",
];
const SCATTERED_POSITIONS = [
  { top: "18%", left: "8%", rotate: -3 },
  { top: "32%", left: "52%", rotate: 2 },
  { top: "52%", left: "12%", rotate: -1 },
  { top: "66%", left: "48%", rotate: 3 },
];

const CodeAnalogy: React.FC = () => {
  const { codeAnalogy: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: "프로그램에서도 마찬가지" 타이틀
  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 24,
  });
  const titleExit = interpolate(frame, [split - 20, split], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = titleAppear * (1 - titleExit);

  // 2문장: 변수 박스 4개 등장 (scattered)
  const varAppears = SCATTERED_VARS.map((_, i) =>
    spring({
      frame: frame - split - i * 8,
      fps,
      config: { damping: 12, stiffness: 130 },
      durationInFrames: 24,
    }),
  );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 코드에서도" />

          {/* 1문장: 타이틀 */}
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${interpolate(titleAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              fontFamily: uiFont,
              fontSize: FONT.title,
              fontWeight: 700,
              color: C_TEAL,
              textAlign: "center",
              opacity: titleOpacity,
            }}
          >
            프로그램에서도 마찬가지
          </div>

          {/* 2문장: 흩어진 변수 박스 */}
          {SCATTERED_VARS.map((code, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: SCATTERED_POSITIONS[i].top,
                left: SCATTERED_POSITIONS[i].left,
                display: "inline-flex",
                background: BG_CODE,
                borderRadius: 10,
                padding: "14px 20px",
                border: `2px solid ${C_PAIN}55`,
                opacity: varAppears[i],
                transform: `rotate(${SCATTERED_POSITIONS[i].rotate}deg) scale(${interpolate(varAppears[i], [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                ...monoStyle,
                fontSize: CODE.md,
                color: TEXT,
                whiteSpace: "pre" as const,
              }}
            >
              <JavaLine text={code} />
            </div>
          ))}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.codeAnalogy.wordStartFrames}
      />
    </>
  );
};

// ── 씬: BundleScene — 묶으면 편하다 ──────────────────────────
const BundleScene: React.FC = () => {
  const { bundleScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 묶인 변수 그룹 등장
  const groupAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 2문장: 전달 애니메이션
  const passAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });
  const passX = interpolate(passAppear, [0, 1], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 묶으면 편하다" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}
          >
            {/* 묶인 변수 그룹 */}
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 6,
                background: BG_CODE,
                borderRadius: 14,
                padding: "24px 36px",
                border: `3px solid ${C_TEAL}66`,
                opacity: groupAppear,
                transform: `translateX(${passX}px) scale(${interpolate(groupAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                ...monoStyle,
                fontSize: CODE.md,
              }}
            >
              {SCATTERED_VARS.map((code, i) => (
                <div
                  key={i}
                  style={{
                    lineHeight: "1.8",
                    color: TEXT,
                    whiteSpace: "pre",
                  }}
                >
                  <JavaLine text={code} />
                </div>
              ))}
            </div>

            {/* "묶음째 전달" 라벨 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                color: C_TEAL,
                background: `${C_TEAL}16`,
                border: `2px solid ${C_TEAL}44`,
                borderRadius: 12,
                padding: "14px 28px",
                opacity: passAppear,
                transform: `translateX(${passX}px) scale(${interpolate(passAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              묶음째 전달 →
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.bundleScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ObjectPreviewScene — 객체란? ──────────────────────────
const OBJECT_FIELDS = [
  { label: "이름", value: '"민준"', color: C_TEAL },
  { label: "나이", value: "17", color: C_TEAL },
  { label: "점수", value: "85", color: C_TEAL },
];

const ObjectPreviewScene: React.FC = () => {
  const { objectPreview: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 객체 카드 등장
  const cardAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 2문장: 필드 강조 펄싱
  const fieldPulse =
    frame >= split ? 0.4 + 0.6 * Math.abs(Math.sin((frame - split) * 0.05)) : 0;

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 객체란?" />
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
            {/* 객체 카드 */}
            <div
              style={{
                opacity: cardAppear,
                transform: `scale(${interpolate(cardAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
              }}
            >
              {/* 카드 헤더 — 객체 이름 */}
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  fontWeight: 800,
                  color: "#fff",
                  background: C_TEAL,
                  borderRadius: "14px 14px 0 0",
                  padding: "14px 0",
                  textAlign: "center",
                  letterSpacing: 2,
                  width: "100%",
                }}
              >
                민준
              </div>

              {/* 카드 바디 — 필드 목록 */}
              <div
                style={{
                  background: BG_CODE,
                  borderRadius: "0 0 14px 14px",
                  border: `3px solid ${C_TEAL}66`,
                  borderTop: "none",
                  padding: "24px 48px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  minWidth: 340,
                }}
              >
                {OBJECT_FIELDS.map((field, i) => {
                  const fieldAppear = spring({
                    frame: frame - s - 10 - i * 8,
                    fps,
                    config: { damping: 12, stiffness: 130 },
                    durationInFrames: 24,
                  });
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        opacity: fieldAppear,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: uiFont,
                          fontSize: FONT.label,
                          fontWeight: 700,
                          color: TEXT,
                          minWidth: 60,
                          textAlign: "right",
                        }}
                      >
                        {field.label}
                      </div>
                      <div
                        style={{
                          fontFamily: uiFont,
                          fontSize: 28,
                          fontWeight: 400,
                          color: TEXT,
                          opacity: 0.5,
                        }}
                      >
                        :
                      </div>
                      <div
                        style={{
                          ...monoStyle,
                          fontSize: FONT.heading,
                          fontWeight: 700,
                          color: field.color,
                          textShadow:
                            fieldPulse > 0
                              ? `0 0 ${fieldPulse * 12}px ${field.color}66`
                              : "none",
                        }}
                      >
                        {field.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.objectPreview.wordStartFrames}
      />
    </>
  );
};

// ── 씬: OutroScene — 다음 시간에 ─────────────────────────────
const OutroScene: React.FC = () => {
  const { outroScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false }); // 마지막 씬 → fadeOut 없음
  const s = cfg.speechStartFrame;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "객체" 키워드 등장
  const keywordFrame = s;
  const keywordAppear = spring({
    frame: frame - keywordFrame,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });

  // 밑줄 애니메이션 — 발화 시점 + 16프레임 후 시작
  const keywordUnderline = spring({
    frame: frame - keywordFrame - 16,
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="6. 다음 시간에" />

          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.display,
                fontWeight: 900,
                color: C_TEAL,
                opacity: keywordAppear,
                display: "inline-block",
                position: "relative" as const,
              }}
            >
              객체
              <div
                style={{
                  position: "absolute",
                  bottom: -6,
                  left: 0,
                  height: 3,
                  background: C_TEAL,
                  borderRadius: 2,
                  width: `${keywordUnderline * 100}%`,
                }}
              />
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
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
  VIDEO_CONFIG.packageScene,
  VIDEO_CONFIG.codeAnalogy,
  VIDEO_CONFIG.bundleScene,
  VIDEO_CONFIG.objectPreview,
  VIDEO_CONFIG.outroScene,
];
const sceneDurations = sceneList.map((s) => s.durationInFrames);
const fromValues = computeFromValues(sceneDurations, {
  cross: CROSS,
  firstOverlap: THUMB_CROSS,
});
const totalDuration =
  fromValues[fromValues.length - 1] + sceneDurations[sceneDurations.length - 1];

// ── compositionMeta ───────────────────────────────────────────
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

// ── SRT ──────────────────────────────────────────────────────
export const SRT_DATA: SrtEntry[] = buildSrtData([
  {
    offset: fromValues[1],
    narration: CONTENT.painScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.painScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.painScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.painScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.painScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.packageScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.packageScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.packageScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.packageScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.packageScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.codeAnalogy.narration as string[],
    speechStartFrame: AUDIO_CONFIG.codeAnalogy.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.codeAnalogy.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.codeAnalogy.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.codeAnalogy.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.bundleScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.bundleScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.bundleScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.bundleScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.bundleScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: CONTENT.objectPreview.narration as string[],
    speechStartFrame: AUDIO_CONFIG.objectPreview.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.objectPreview.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.objectPreview.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.objectPreview.durationInFrames,
  },
  {
    offset: fromValues[6],
    narration: CONTENT.outroScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.outroScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.outroScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.outroScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.outroScene.durationInFrames,
  },
]);

export const SRT_TRACKS: SrtTracks = { "ko-KR": SRT_DATA };

// ── Root Component ────────────────────────────────────────────
const JavaClassIntro: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.packageScene.durationInFrames}
    >
      <PackageScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.codeAnalogy.durationInFrames}
    >
      <CodeAnalogy />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.bundleScene.durationInFrames}
    >
      <BundleScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.objectPreview.durationInFrames}
    >
      <ObjectPreviewScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.outroScene.durationInFrames}
    >
      <OutroScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaClassIntro;

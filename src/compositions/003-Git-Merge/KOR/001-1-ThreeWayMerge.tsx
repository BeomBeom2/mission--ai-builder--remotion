// src/compositions/003-Git-Merge/KOR/001-1-ThreeWayMerge.tsx
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import React from "react";

import {
  CROSS,
  CODE,
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
import { AUDIO_CONFIG as _AC } from "./001-3-audio.gen";
import {
  BG,
  BG_CODE,
  C_BASE,
  C_DIM,
  C_FEATURE,
  C_GIT_RED,
  C_MAIN,
  C_MERGE,
  TEXT,
} from "./colors";
import { FPS, HEIGHT, WIDTH } from "./config";

// AUDIO_CONFIG 타입 — 스텁(pre-sync)과 실제 gen 파일 모두 호환
type AudioScene = {
  durationInFrames: number;
  narrationSplits: readonly number[];
  speechStartFrame: number;
  speechEndFrame: number;
  sentenceEndFrames: readonly number[];
  wordStartFrames: readonly (readonly number[])[];
  wordEndFrames: readonly (readonly number[])[];
  wordTiming: Record<string, readonly number[]>;
};
const AUDIO_CONFIG = _AC as unknown as Record<string, AudioScene>;

// ── 브랜치 다이어그램 공유 상수 ───────────────────────────────
const DG = {
  W: 840,
  H: 460,
  BASE_X: 180,
  BASE_Y: 230,
  F1_X: 380,
  F1_Y: 85,
  F2_X: 560,
  F2_Y: 85,
  M1_X: 380,
  M1_Y: 375,
  M2_X: 560,
  M2_Y: 375,
  MG_X: 740,
  MG_Y: 230,
  R: 34,
} as const;

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  introScene: {
    audio: "git-introScene.mp3",
    durationInFrames: AUDIO_CONFIG.introScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.introScene.speechStartFrame,
    narration: CONTENT.introScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.introScene.narrationSplits as number[],
  },
  branchScene: {
    audio: "git-branchScene.mp3",
    durationInFrames: AUDIO_CONFIG.branchScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.branchScene.speechStartFrame,
    narration: CONTENT.branchScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.branchScene.narrationSplits as number[],
  },
  compareScene: {
    audio: "git-compareScene.mp3",
    durationInFrames: AUDIO_CONFIG.compareScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.compareScene.speechStartFrame,
    narration: CONTENT.compareScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.compareScene.narrationSplits as number[],
  },
  resultScene: {
    audio: "git-resultScene.mp3",
    durationInFrames: AUDIO_CONFIG.resultScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.resultScene.speechStartFrame,
    narration: CONTENT.resultScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.resultScene.narrationSplits as number[],
  },
} as const;

// ── 씬: ThumbnailScene ──────────────────────────────────────
const ThumbnailScene: React.FC = () => (
  <Thumb
    seriesLabel={CONTENT.thumbnail.seriesLabel}
    title={CONTENT.thumbnail.title}
    badge={CONTENT.thumbnail.badge}
    accentColor={C_GIT_RED}
  />
);

// ── 공용: 커밋 노드 (SVG g 요소) ─────────────────────────────
const CommitNode: React.FC<{
  cx: number;
  cy: number;
  r: number;
  color: string;
  label: string;
  sublabel?: string;
  opacity: number;
}> = ({ cx, cy, r, color, label, sublabel, opacity }) => (
  <g opacity={opacity}>
    <circle cx={cx} cy={cy} r={r} fill="#252525" stroke={color} strokeWidth={3} />
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontFamily: uiFont, fontSize: 20, fontWeight: 700, fill: color }}
    >
      {label}
    </text>
    {sublabel && (
      <text
        x={cx}
        y={cy + r + 22}
        textAnchor="middle"
        style={{
          fontFamily: uiFont,
          fontSize: FONT.label,
          fontWeight: 700,
          fill: color,
          opacity: 0.9,
        }}
      >
        {sublabel}
      </text>
    )}
  </g>
);

// ── 씬: IntroScene — 개념 소개 ────────────────────────────────
const IntroScene: React.FC = () => {
  const { introScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { in: true });
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0] ?? Math.floor(d / 2);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 30,
  });
  const baseAppear = spring({
    frame: frame - s - 6,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 30,
  });
  const featureAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });
  const mainAppear = spring({
    frame: frame - split - 12,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });
  const lineP = interpolate(frame, [split + 5, split + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleIn = (v: number) =>
    interpolate(v, [0, 1], [0.85, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // 삼각형 배치: Base(정상), Feature(좌하), Main(우하)
  const BX = 350, BY = 80, FX = 100, FY = 340, MX = 600, MY = 340;
  const R = 46;

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 3-way merge" />

          {/* 제목 */}
          <div
            style={{
              position: "absolute",
              top: 190,
              left: "50%",
              transform: `translateX(-50%) scale(${scaleIn(titleAppear)})`,
              fontFamily: uiFont,
              fontSize: FONT.display,
              fontWeight: 900,
              color: C_GIT_RED,
              opacity: titleAppear,
              whiteSpace: "nowrap",
            }}
          >
            3-way merge
          </div>

          {/* 삼각형 다이어그램 */}
          <div
            style={{
              position: "absolute",
              top: 350,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <svg width={700} height={490} style={{ overflow: "visible" }}>
              {/* 연결선 — 원 아래 렌더링 */}
              <path
                d={`M ${BX} ${BY} L ${FX} ${FY}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - lineP}
                stroke={C_FEATURE}
                strokeWidth={3}
                fill="none"
                opacity={featureAppear}
              />
              <path
                d={`M ${BX} ${BY} L ${MX} ${MY}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - lineP}
                stroke={C_MAIN}
                strokeWidth={3}
                fill="none"
                opacity={mainAppear}
              />

              {/* 커밋 노드 */}
              <CommitNode
                cx={BX}
                cy={BY}
                r={R}
                color={C_BASE}
                label="Base"
                sublabel="공통 조상"
                opacity={baseAppear}
              />
              <CommitNode
                cx={FX}
                cy={FY}
                r={R}
                color={C_FEATURE}
                label="A"
                sublabel="feature"
                opacity={featureAppear}
              />
              <CommitNode
                cx={MX}
                cy={MY}
                r={R}
                color={C_MAIN}
                label="B"
                sublabel="main"
                opacity={mainAppear}
              />
            </svg>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.introScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: BranchScene — 브랜치 분기 다이어그램 ─────────────────
const BranchScene: React.FC = () => {
  const { branchScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0] ?? Math.floor(d / 2);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 문장 1: Base + pre-base 라인 등장
  const baseAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });
  const preLineP = interpolate(frame, [s, s + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 문장 2: 브랜치 분기 라인 + 커밋들 등장
  const branchLineP = interpolate(frame, [split, split + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const horizLineP = interpolate(frame, [split + 25, split + 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const f1Appear = spring({
    frame: frame - split - 5,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 24,
  });
  const f2Appear = spring({
    frame: frame - split - 25,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 24,
  });
  const m1Appear = spring({
    frame: frame - split - 10,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 24,
  });
  const m2Appear = spring({
    frame: frame - split - 30,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 24,
  });

  const {
    W,
    H,
    BASE_X,
    BASE_Y,
    F1_X,
    F1_Y,
    F2_X,
    F2_Y,
    M1_X,
    M1_Y,
    M2_X,
    M2_Y,
    R,
  } = DG;

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 브랜치 분기" />

          <div
            style={{
              position: "absolute",
              top: "44%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg width={W} height={H} style={{ overflow: "visible" }}>
              {/* 히스토리 라인 (pre-base) */}
              <path
                d={`M 0 ${BASE_Y} L ${BASE_X} ${BASE_Y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - preLineP}
                stroke={C_BASE}
                strokeWidth={3}
                fill="none"
                opacity={baseAppear}
              />

              {/* feature 브랜치 대각선 */}
              <path
                d={`M ${BASE_X} ${BASE_Y} L ${F1_X} ${F1_Y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - branchLineP}
                stroke={C_FEATURE}
                strokeWidth={3}
                fill="none"
              />
              {/* feature 수평선 */}
              <path
                d={`M ${F1_X} ${F1_Y} L ${F2_X} ${F2_Y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - horizLineP}
                stroke={C_FEATURE}
                strokeWidth={3}
                fill="none"
              />

              {/* main 브랜치 대각선 */}
              <path
                d={`M ${BASE_X} ${BASE_Y} L ${M1_X} ${M1_Y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - branchLineP}
                stroke={C_MAIN}
                strokeWidth={3}
                fill="none"
              />
              {/* main 수평선 */}
              <path
                d={`M ${M1_X} ${M1_Y} L ${M2_X} ${M2_Y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - horizLineP}
                stroke={C_MAIN}
                strokeWidth={3}
                fill="none"
              />

              {/* 커밋 노드 */}
              <CommitNode
                cx={BASE_X}
                cy={BASE_Y}
                r={R}
                color={C_BASE}
                label="Base"
                sublabel="공통 조상"
                opacity={baseAppear}
              />
              <CommitNode
                cx={F1_X}
                cy={F1_Y}
                r={R}
                color={C_FEATURE}
                label="f1"
                opacity={f1Appear}
              />
              <CommitNode
                cx={F2_X}
                cy={F2_Y}
                r={R}
                color={C_FEATURE}
                label="f2"
                opacity={f2Appear}
              />
              <CommitNode
                cx={M1_X}
                cy={M1_Y}
                r={R}
                color={C_MAIN}
                label="m1"
                opacity={m1Appear}
              />
              <CommitNode
                cx={M2_X}
                cy={M2_Y}
                r={R}
                color={C_MAIN}
                label="m2"
                opacity={m2Appear}
              />

              {/* 브랜치 라벨 */}
              <text
                x={F2_X + R + 16}
                y={F1_Y}
                dominantBaseline="middle"
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  fill: C_FEATURE,
                  opacity: f2Appear,
                }}
              >
                feature
              </text>
              <text
                x={M2_X + R + 16}
                y={M1_Y}
                dominantBaseline="middle"
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  fill: C_MAIN,
                  opacity: m2Appear,
                }}
              >
                main
              </text>
            </svg>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.branchScene.wordStartFrames}
      />
    </>
  );
};

// ── CompareScene 코드 내용 ─────────────────────────────────────
const BASE_LINES = ['greeting = "Hi"', "version = 1", 'author = "Alice"'] as const;
const FEAT_LINES = ['greeting = "Hi"', "version = 2", 'author = "Alice"'] as const;
const MAIN_LINES = ['greeting = "Hi"', "version = 1", 'author = "Bob"'] as const;
const FEAT_CHANGED = [false, true, false] as const;
const MAIN_CHANGED = [false, false, true] as const;

// ── 씬: CompareScene — 3-way 비교 카드 ───────────────────────
const CompareScene: React.FC = () => {
  const { compareScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0] ?? Math.floor(d / 2);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });
  const featAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });
  const mainAppear = spring({
    frame: frame - split - 12,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  const scaleIn = (v: number) =>
    interpolate(v, [0, 1], [0.92, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const cardStyle = (
    borderColor: string,
    appear: number,
  ): React.CSSProperties => ({
    width: 840,
    borderRadius: 14,
    border: `2px solid ${borderColor}55`,
    overflow: "hidden" as const,
    opacity: appear,
    transform: `scale(${scaleIn(appear)})`,
    transformOrigin: "top center",
  });

  const headerStyle = (color: string): React.CSSProperties => ({
    background: color + "22",
    borderBottom: `2px solid ${color}44`,
    padding: "12px 24px",
    fontFamily: uiFont,
    fontSize: FONT.label,
    fontWeight: 700,
    color,
  });

  const lineStyle = (changed: boolean, color: string): React.CSSProperties => ({
    ...monoStyle,
    fontSize: CODE.md,
    lineHeight: "2.0",
    color: changed ? color : TEXT,
    opacity: changed ? 1 : 0.5,
    background: changed ? color + "18" : "transparent",
    borderRadius: 6,
    padding: "0 8px",
    marginLeft: -8,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 3-way 비교" />

          <div
            style={{
              position: "absolute",
              top: 145,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* Base 카드 */}
            <div style={cardStyle(C_BASE, baseAppear)}>
              <div style={headerStyle(C_BASE)}>공통 조상 (Base)</div>
              <div style={{ background: BG_CODE, padding: "14px 24px" }}>
                {BASE_LINES.map((line, i) => (
                  <div key={i} style={{ ...monoStyle, fontSize: CODE.md, lineHeight: "2.0", color: TEXT }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* feature 카드 */}
            <div style={cardStyle(C_FEATURE, featAppear)}>
              <div style={headerStyle(C_FEATURE)}>feature 브랜치</div>
              <div style={{ background: BG_CODE, padding: "14px 24px" }}>
                {FEAT_LINES.map((line, i) => (
                  <div key={i} style={lineStyle(FEAT_CHANGED[i], C_FEATURE)}>
                    {line}
                    {FEAT_CHANGED[i] && (
                      <span
                        style={{
                          fontFamily: uiFont,
                          fontSize: 20,
                          color: C_FEATURE,
                          marginLeft: 16,
                          opacity: 0.75,
                        }}
                      >
                        ← 변경
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* main 카드 */}
            <div style={cardStyle(C_MAIN, mainAppear)}>
              <div style={headerStyle(C_MAIN)}>main 브랜치</div>
              <div style={{ background: BG_CODE, padding: "14px 24px" }}>
                {MAIN_LINES.map((line, i) => (
                  <div key={i} style={lineStyle(MAIN_CHANGED[i], C_MAIN)}>
                    {line}
                    {MAIN_CHANGED[i] && (
                      <span
                        style={{
                          fontFamily: uiFont,
                          fontSize: 20,
                          color: C_MAIN,
                          marginLeft: 16,
                          opacity: 0.75,
                        }}
                      >
                        ← 변경
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.compareScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ResultScene — 머지 커밋 생성 (마지막) ─────────────────
const ResultScene: React.FC = () => {
  const { resultScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0] ?? Math.floor(d / 2);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const diagramAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 30,
  });
  const mergeAppear = spring({
    frame: frame - s - 20,
    fps,
    config: { damping: 11, stiffness: 110 },
    durationInFrames: 36,
  });
  const mergeLabelAppear = spring({
    frame: frame - s - 35,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 30,
  });
  // 문장 2에 등장하는 하단 요약 라벨
  const sentence2Appear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 30,
  });
  // 머지 커밋 글로우 펄싱 (등장 후)
  const glow =
    mergeAppear > 0.5
      ? 0.5 + 0.5 * Math.abs(Math.sin((frame - s - 35) * 0.04))
      : 0;

  const {
    W,
    H,
    BASE_X,
    BASE_Y,
    F1_X,
    F1_Y,
    F2_X,
    F2_Y,
    M1_X,
    M1_Y,
    M2_X,
    M2_Y,
    MG_X,
    MG_Y,
    R,
  } = DG;

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 머지 커밋" />

          <div
            style={{
              position: "absolute",
              top: "44%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: diagramAppear,
            }}
          >
            <svg width={W} height={H} style={{ overflow: "visible" }}>
              {/* 기존 브랜치 라인 (완성된 상태) */}
              <path
                d={`M 0 ${BASE_Y} L ${BASE_X} ${BASE_Y}`}
                stroke={C_BASE}
                strokeWidth={3}
                fill="none"
              />
              <path
                d={`M ${BASE_X} ${BASE_Y} L ${F1_X} ${F1_Y}`}
                stroke={C_FEATURE}
                strokeWidth={3}
                fill="none"
              />
              <path
                d={`M ${F1_X} ${F1_Y} L ${F2_X} ${F2_Y}`}
                stroke={C_FEATURE}
                strokeWidth={3}
                fill="none"
              />
              <path
                d={`M ${BASE_X} ${BASE_Y} L ${M1_X} ${M1_Y}`}
                stroke={C_MAIN}
                strokeWidth={3}
                fill="none"
              />
              <path
                d={`M ${M1_X} ${M1_Y} L ${M2_X} ${M2_Y}`}
                stroke={C_MAIN}
                strokeWidth={3}
                fill="none"
              />

              {/* 머지 수렴 라인 */}
              <path
                d={`M ${F2_X} ${F2_Y} L ${MG_X} ${MG_Y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - mergeAppear}
                stroke={C_MERGE}
                strokeWidth={3}
                fill="none"
              />
              <path
                d={`M ${M2_X} ${M2_Y} L ${MG_X} ${MG_Y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - mergeAppear}
                stroke={C_MERGE}
                strokeWidth={3}
                fill="none"
              />

              {/* 기존 커밋 노드 */}
              <CommitNode
                cx={BASE_X}
                cy={BASE_Y}
                r={R}
                color={C_BASE}
                label="Base"
                opacity={1}
              />
              <CommitNode
                cx={F1_X}
                cy={F1_Y}
                r={R}
                color={C_FEATURE}
                label="f1"
                opacity={1}
              />
              <CommitNode
                cx={F2_X}
                cy={F2_Y}
                r={R}
                color={C_FEATURE}
                label="f2"
                opacity={1}
              />
              <CommitNode
                cx={M1_X}
                cy={M1_Y}
                r={R}
                color={C_MAIN}
                label="m1"
                opacity={1}
              />
              <CommitNode
                cx={M2_X}
                cy={M2_Y}
                r={R}
                color={C_MAIN}
                label="m2"
                opacity={1}
              />

              {/* 머지 커밋 노드 (글로우 포함) */}
              <g opacity={mergeAppear}>
                {glow > 0 && (
                  <circle
                    cx={MG_X}
                    cy={MG_Y}
                    r={R + 16}
                    fill="none"
                    stroke={C_MERGE}
                    strokeWidth={2}
                    opacity={glow * 0.45}
                  />
                )}
                <circle
                  cx={MG_X}
                  cy={MG_Y}
                  r={R}
                  fill="#252525"
                  stroke={C_MERGE}
                  strokeWidth={3.5}
                />
                <text
                  x={MG_X}
                  y={MG_Y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: uiFont,
                    fontSize: 20,
                    fontWeight: 700,
                    fill: C_MERGE,
                  }}
                >
                  merge
                </text>
              </g>

              {/* 머지 커밋 라벨 */}
              <text
                x={MG_X}
                y={MG_Y + R + 22}
                textAnchor="middle"
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  fill: C_MERGE,
                  opacity: mergeLabelAppear * 0.95,
                }}
              >
                Merge Commit
              </text>

              {/* 브랜치 라벨 */}
              <text
                x={F2_X + R + 10}
                y={F1_Y}
                dominantBaseline="middle"
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  fill: C_FEATURE,
                }}
              >
                feature
              </text>
              <text
                x={M2_X + R + 10}
                y={M1_Y}
                dominantBaseline="middle"
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  fill: C_MAIN,
                }}
              >
                main
              </text>
            </svg>
          </div>

          {/* 핵심 문구 (문장 2 — "이것이 3-way merge의 핵심 원리입니다") */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: C_MERGE,
              opacity: sentence2Appear,
              whiteSpace: "nowrap",
            }}
          >
            3-way merge
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.resultScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues 계산 ─────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.introScene,
  VIDEO_CONFIG.branchScene,
  VIDEO_CONFIG.compareScene,
  VIDEO_CONFIG.resultScene,
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
    narration: CONTENT.introScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.introScene.speechStartFrame ?? 3,
    narrationSplits: AUDIO_CONFIG.introScene.narrationSplits ?? [],
    sentenceEndFrames: AUDIO_CONFIG.introScene.sentenceEndFrames ?? [],
    sceneDuration: VIDEO_CONFIG.introScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.branchScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.branchScene.speechStartFrame ?? 3,
    narrationSplits: AUDIO_CONFIG.branchScene.narrationSplits ?? [],
    sentenceEndFrames: AUDIO_CONFIG.branchScene.sentenceEndFrames ?? [],
    sceneDuration: VIDEO_CONFIG.branchScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.compareScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.compareScene.speechStartFrame ?? 3,
    narrationSplits: AUDIO_CONFIG.compareScene.narrationSplits ?? [],
    sentenceEndFrames: AUDIO_CONFIG.compareScene.sentenceEndFrames ?? [],
    sceneDuration: VIDEO_CONFIG.compareScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.resultScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.resultScene.speechStartFrame ?? 3,
    narrationSplits: AUDIO_CONFIG.resultScene.narrationSplits ?? [],
    sentenceEndFrames: AUDIO_CONFIG.resultScene.sentenceEndFrames ?? [],
    sceneDuration: VIDEO_CONFIG.resultScene.durationInFrames,
  },
]);

export const SRT_TRACKS: SrtTracks = { "ko-KR": SRT_DATA };

// ── Root Component ────────────────────────────────────────────
const ThreeWayMerge: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.introScene.durationInFrames}
    >
      <IntroScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.branchScene.durationInFrames}
    >
      <BranchScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.compareScene.durationInFrames}
    >
      <CompareScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.resultScene.durationInFrames}
    >
      <ResultScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = ThreeWayMerge;

// src/compositions/002-Java-Class/KOR/004-1-JavaObjects.tsx
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
import { ElementArrow } from "../../../utils/Arrow";
import {
  CROSS,
  CodeBlock,
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
import { CONTENT } from "./004-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./004-3-audio.gen";
import {
  BG,
  BG_CODE,
  BG_THUMB,
  C_COMMENT,
  C_DIM,
  C_KEYWORD,
  C_NUMBER,
  C_PAIN,
  C_TEAL,
  C_TYPE,
  C_VAR,
  TEXT,
} from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  scatteredScene: {
    audio: "obj-scatteredScene.mp3",
    durationInFrames: AUDIO_CONFIG.scatteredScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.scatteredScene.speechStartFrame,
    narration: CONTENT.scatteredScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.scatteredScene.narrationSplits,
  },
  arraySolution: {
    audio: "obj-arraySolution.mp3",
    durationInFrames: AUDIO_CONFIG.arraySolution.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.arraySolution.speechStartFrame,
    narration: CONTENT.arraySolution.narration as string[],
    narrationSplits: AUDIO_CONFIG.arraySolution.narrationSplits,
  },
  instanceScene: {
    audio: "obj-instanceScene.mp3",
    durationInFrames: AUDIO_CONFIG.instanceScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.instanceScene.speechStartFrame,
    narration: CONTENT.instanceScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.instanceScene.narrationSplits,
  },
  comparisonScene: {
    audio: "obj-comparisonScene.mp3",
    durationInFrames: AUDIO_CONFIG.comparisonScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.comparisonScene.speechStartFrame,
    narration: CONTENT.comparisonScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.comparisonScene.narrationSplits,
  },
  summaryScene: {
    audio: "obj-summaryScene.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
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

// ── 코드 라인 데이터 ────────────────────────────────────────
const SCATTERED_LINES = [
  { code: "int person1_0 = 1;", comment: "사람 1의 번호" },
  { code: "int person1_1 = 20;", comment: "사람 1의 나이" },
  { code: "int person1_2 = 170;", comment: "사람 1의 키" },
  { code: "" },
  { code: "int person2_0 = 2;", comment: "사람 2의 번호" },
  { code: "int person2_1 = 30;", comment: "사람 2의 나이" },
  { code: "int person2_2 = 180;", comment: "사람 2의 키" },
];

const PERSON_OBJECTS = [
  {
    name: "person1",
    address: "0xA1",
    values: ["1", "20", "170"],
    labels: ["번호", "나이", "키"],
  },
  {
    name: "person2",
    address: "0xB4",
    values: ["2", "30", "180"],
    labels: ["번호", "나이", "키"],
  },
] as const;

const panelBaseStyle: React.CSSProperties = {
  background: `${BG_CODE}cc`,
  borderRadius: 18,
  padding: "26px 28px",
  position: "relative",
};

const MemoryPanel: React.FC<{
  title: string;
  color: string;
  width?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ title, color, width, style, children }) => (
  <div
    style={{
      ...panelBaseStyle,
      width,
      border: `2px solid ${color}55`,
      boxShadow: `0 0 30px ${color}18`,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -22,
        left: 16,
        padding: "4px 12px",
        borderRadius: 999,
        background: BG,
        border: `1px solid ${color}44`,
        fontFamily: uiFont,
        fontSize: 14,
        fontWeight: 800,
        color,
        letterSpacing: 2,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const StackReferenceCard: React.FC<{
  name: string;
  address: string;
  opacity: number;
  accentColor?: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  highlight?: number;
}> = ({
  name,
  address,
  opacity,
  accentColor = C_VAR,
  cardRef,
  highlight = 0,
}) => {
  const active = Math.max(0, Math.min(1, highlight));

  return (
    <div
      ref={cardRef}
      style={{
        opacity,
        background: active > 0.1 ? "rgba(90, 224, 211, 0.07)" : BG_CODE,
        border: `2px solid ${active > 0.05 ? `${C_TEAL}dd` : `${accentColor}77`}`,
        borderRadius: 12,
        padding: "14px 18px",
        minWidth: 210,
        boxShadow:
          active > 0.05
            ? `0 0 0 2px ${C_TEAL}aa, 0 0 18px ${C_TEAL}55`
            : `0 0 18px ${accentColor}22`,
      }}
    >
      <div
        style={{
          ...monoStyle,
          fontSize: 18,
          color: accentColor,
          marginBottom: 6,
        }}
      >
        int[] {name}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          ...monoStyle,
          fontSize: 26,
        }}
      >
        <span style={{ color: C_DIM }}>addr</span>
        <span style={{ color: TEXT }}>=</span>
        <span style={{ color: C_TEAL, fontWeight: 800 }}>{address}</span>
      </div>
    </div>
  );
};

const ArrayObjectCard: React.FC<{
  name: string;
  address: string;
  values: readonly string[];
  labels: readonly string[];
  opacity: number;
  scale?: number;
  valueProgress?: number | readonly number[];
  valueHighlight?: number;
  valueHighlightOnly?: boolean;
  objectRef?: React.RefObject<HTMLDivElement | null>;
}> = ({
  name,
  address,
  values,
  labels,
  opacity,
  scale = 1,
  valueProgress = 1,
  valueHighlight = 0,
  valueHighlightOnly = false,
  objectRef,
}) => {
  const active = Math.max(0, Math.min(1, valueHighlight));

  return (
    <div
      ref={objectRef}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        background: `${C_TEAL}10`,
        border:
          active > 0.1 ? `2px solid ${C_TEAL}dd` : `2px solid ${C_TEAL}88`,
        borderRadius: 16,
        padding: "18px 18px 14px",
        minWidth: 340,
        boxShadow:
          active > 0.1
            ? `0 0 0 2px ${C_TEAL}aa, 0 0 20px ${C_TEAL}55`
            : `0 0 28px ${C_TEAL}22`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: uiFont,
            fontSize: 18,
            fontWeight: 800,
            color: C_TEAL,
          }}
        >
          배열 객체
        </div>
        <div style={{ ...monoStyle, fontSize: 18, color: C_TEAL }}>
          {address}
        </div>
      </div>
      <div
        style={{
          ...monoStyle,
          fontSize: 15,
          color: C_DIM,
          marginBottom: 16,
        }}
      >
        {name}[0..2]
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {values.map((value, i) => (
          <div key={`${name}-${i}`} style={{ textAlign: "center" }}>
            {(() => {
              const cellProgress = Array.isArray(valueProgress)
                ? (valueProgress[i] ?? 0)
                : valueProgress;
              const displayValue = cellProgress > 0.6 ? value : "0";
              const cellHighlight =
                active > 0.05
                  ? valueHighlightOnly && typeof valueProgress === "number"
                    ? active
                    : Math.max(cellProgress, active)
                  : 0;
              return (
                <>
                  <div
                    style={{
                      ...monoStyle,
                      fontSize: 14,
                      color: C_DIM,
                      marginBottom: 6,
                    }}
                  >
                    [{i}]
                  </div>
                  <div
                    style={{
                      width: 82,
                      height: 72,
                      borderRadius: 10,
                      border: `2px solid ${
                        cellHighlight > 0.55 ? `${C_TEAL}dd` : `${C_TEAL}77`
                      }`,
                      background: BG_CODE,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...monoStyle,
                      fontSize: 28,
                      color: C_NUMBER,
                      fontWeight: 800,
                      opacity: Math.max(0.5, cellProgress),
                      transform: `scale(${interpolate(
                        cellProgress,
                        [0, 1],
                        [0.84, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        },
                      )})`,
                      boxShadow:
                        cellHighlight > 0.55
                          ? `0 0 0 2px ${C_TEAL}55, 0 0 12px ${C_TEAL}33`
                          : "none",
                    }}
                  >
                    {displayValue}
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 15,
                      fontWeight: 700,
                      color: TEXT,
                      marginTop: 8,
                      opacity: Math.max(0.55, cellProgress),
                    }}
                  >
                    {labels[i]}
                  </div>
                </>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 씬: ScatteredScene — 개별 변수의 고통 ────────────────────
const ScatteredScene: React.FC = () => {
  const { scatteredScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 코드 등장
  const codeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 2문장: "× N" 강조
  const countAppear = spring({
    frame: frame - splits[0],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  // 3문장: 혼란 강조
  const painAppear = spring({
    frame: frame - splits[1],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 개별 변수의 고통" />

          {/* 코드 블록 */}
          <CodeBlock
            style={{
              position: "absolute",
              top: "28%",
              left: "50%",
              opacity: codeAppear,
              transform: `translate(-50%, 0) scale(${interpolate(codeAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            }}
          >
            {SCATTERED_LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  ...monoStyle,
                  fontSize: 24,
                  lineHeight: 1.8,
                  color: TEXT,
                  whiteSpace: "nowrap",
                }}
              >
                {line.code ? (
                  <>
                    <span style={{ color: C_TYPE }}>int</span>{" "}
                    <span style={{ color: C_VAR }}>
                      {line.code.match(/(\w+)\s*=/)?.[1]}
                    </span>
                    {" = "}
                    <span style={{ color: C_NUMBER }}>
                      {line.code.match(/=\s*(\d+)/)?.[1]}
                    </span>
                    {";"}
                    {line.comment && (
                      <span
                        style={{ color: C_COMMENT }}
                      >{` // ${line.comment}`}</span>
                    )}
                  </>
                ) : (
                  <br />
                )}
              </div>
            ))}
          </CodeBlock>

          {/* 메모리 스택: 변수 6개가 흩어진 모습 */}
          <div
            style={{
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 700,
              height: 240,
              background: `${BG_CODE}88`,
              border: `1px solid ${C_DIM}`,
              borderRadius: 12,
              opacity: countAppear,
              padding: "28px 32px",
            }}
          >
            {/* Stack 라벨 */}
            <div
              style={{
                position: "absolute",
                top: -24,
                left: 12,
                fontFamily: uiFont,
                fontSize: 14,
                color: C_DIM,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              STACK MEMORY
            </div>
            {/* 6개 변수 — 3×2 그리드, 상자 중앙 정렬 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 12,
                width: 620,
              }}
            >
              {[
                { name: "person1_0", val: "1" },
                { name: "person1_1", val: "20" },
                { name: "person1_2", val: "170" },
                { name: "person2_0", val: "2" },
                { name: "person2_1", val: "30" },
                { name: "person2_2", val: "180" },
              ].map((v, i) => {
                const cellAppear = spring({
                  frame: frame - splits[0] - i * 6,
                  fps,
                  config: { damping: 14, stiffness: 140 },
                  durationInFrames: 20,
                });
                return (
                  <div
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: BG_CODE,
                      border: `1px solid ${C_PAIN}55`,
                      borderRadius: 6,
                      padding: "8px 14px",
                      opacity: cellAppear,
                      transform: `scale(${interpolate(cellAppear, [0, 1], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                      ...monoStyle,
                      fontSize: 18,
                    }}
                  >
                    <span style={{ color: C_VAR }}>{v.name}</span>
                    <span style={{ color: C_DIM }}>=</span>
                    <span style={{ color: C_NUMBER }}>{v.val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 변수 개수 강조 */}
          <div
            style={{
              position: "absolute",
              top: "82%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: painAppear,
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 700,
                color: C_PAIN,
              }}
            >
              2명 = 변수 6개
            </span>
            <span
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 700,
                color: TEXT,
                opacity: 0.5,
              }}
            >
              →
            </span>
            <span
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 700,
                color: C_PAIN,
              }}
            >
              10명 = 변수 30개
            </span>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.scatteredScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ArraySolutionScene — 배열로 묶기 ────────────────────
const ArraySolutionScene: React.FC = () => {
  const { arraySolution: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const memoryLayoutRef = React.useRef<HTMLDivElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);
  const stackRef2 = React.useRef<HTMLDivElement>(null);
  const heapObjectRef = React.useRef<HTMLDivElement>(null);
  const heapObjectRef2 = React.useRef<HTMLDivElement>(null);

  const introAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  const declAppear = spring({
    frame: frame - splits[0],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  const arrayWordTiming = AUDIO_CONFIG.arraySolution
    .wordTiming as unknown as Record<string, number[]>;
  const wordTiming = AUDIO_CONFIG.arraySolution.wordTiming as unknown as Record<
    string,
    number[]
  >;
  const getWordFrame = (keys: string[], minFrame: number = s) =>
    keys
      .flatMap((key) => wordTiming[key] ?? [])
      .filter((frame) => frame >= minFrame)
      .sort((a, b) => a - b)[0] ?? 0;

  const person1SentenceStart = getWordFrame(["person1"], splits[3]);
  const person2SentenceStart = Math.min(
    ...[
      getWordFrame(["person2"], splits[4]),
      getWordFrame(["변수로도"], splits[4]),
    ].filter((f) => f > 0),
    10000,
  );
  const arraySolutionEnd =
    (AUDIO_CONFIG.arraySolution as { speechEndFrame?: number })
      .speechEndFrame ?? 0;
  const person1SentenceEnd =
    splits[4] > person1SentenceStart ? splits[4] : person1SentenceStart + 80;
  const person2SentenceEnd =
    arraySolutionEnd > person2SentenceStart
      ? arraySolutionEnd
      : person2SentenceStart + 80;
  const person1BindHighlight =
    person1SentenceStart > 0
      ? interpolate(
          frame,
          [
            person1SentenceStart,
            person1SentenceStart + 4,
            Math.min(person1SentenceStart + 30, person1SentenceEnd - 1),
            person1SentenceEnd,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  const person2BindHighlight =
    person2SentenceStart > 0
      ? interpolate(
          frame,
          [
            person2SentenceStart,
            person2SentenceStart + 4,
            Math.min(person2SentenceStart + 30, person2SentenceEnd - 1),
            person2SentenceEnd,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  const person1ValueStarts = [
    arrayWordTiming["번호"]?.[0] ?? splits[1],
    arrayWordTiming["나이"]?.[0] ?? splits[1] + 18,
    arrayWordTiming["키를"]?.[0] ?? splits[1] + 36,
  ];
  const person1ValueProgress = person1ValueStarts.map((startFrame) =>
    spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 13, stiffness: 140 },
      durationInFrames: 18,
    }),
  );

  const secondBundleAppear = spring({
    frame: frame - splits[2],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  const heapScale = interpolate(declAppear, [0, 1], [0.88, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 배열로 묶기" />

          <CodeBlock
            style={{
              position: "absolute",
              top: "12%",
              left: "50%",
              transform: "translate(-50%, 0)",
              width: 860,
              maxWidth: 860,
              padding: "16px 24px",
            }}
          >
            <div
              style={{
                ...monoStyle,
                fontSize: 24,
                lineHeight: 1.8,
                color: TEXT,
                opacity: declAppear,
              }}
            >
              <span style={{ color: C_TYPE }}>int</span>
              {"[] "}
              <span style={{ color: C_VAR }}>person1</span>
              {" = "}
              <span style={{ color: C_KEYWORD }}>new</span>{" "}
              <span style={{ color: C_TYPE }}>int</span>
              {"["}
              <span style={{ color: C_NUMBER }}>3</span>
              {"];"}
              <span style={{ color: C_COMMENT }}>{" // 객체 생성"}</span>
            </div>

            {/* 대입부 */}
            {[
              { idx: "0", val: "1", comment: "번호" },
              { idx: "1", val: "20", comment: "나이" },
              { idx: "2", val: "170", comment: "키" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  ...monoStyle,
                  fontSize: 24,
                  lineHeight: 1.8,
                  color: TEXT,
                  opacity: person1ValueProgress[i] as number,
                  transform: `translateX(${interpolate(
                    person1ValueProgress[i] as number,
                    [0, 1],
                    [18, 0],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  )}px)`,
                }}
              >
                <span style={{ color: C_VAR }}>person1</span>
                {"["}
                <span style={{ color: C_NUMBER }}>{item.idx}</span>
                {"] = "}
                <span style={{ color: C_NUMBER }}>{item.val}</span>
                {";"}
                <span
                  style={{ color: C_COMMENT }}
                >{` // ${item.comment}`}</span>
              </div>
            ))}

            <div
              style={{
                ...monoStyle,
                fontSize: 22,
                lineHeight: 1.8,
                color: TEXT,
                opacity: secondBundleAppear,
                marginTop: 8,
              }}
            >
              <span style={{ color: C_TYPE }}>int</span>
              {"[] "}
              <span style={{ color: C_VAR }}>person2</span>
              {" = {"}
              <span style={{ color: C_NUMBER }}>2</span>
              {", "}
              <span style={{ color: C_NUMBER }}>30</span>
              {", "}
              <span style={{ color: C_NUMBER }}>180</span>
              {"};"}
              <span style={{ color: C_COMMENT }}>
                {" // 선언과 동시에 초기화"}
              </span>
            </div>
          </CodeBlock>

          <div
            ref={memoryLayoutRef}
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: 30,
              alignItems: "flex-start",
            }}
          >
            <MemoryPanel title="STACK MEMORY" color={C_VAR} width={260}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 18,
                    fontWeight: 700,
                    color: TEXT,
                    lineHeight: 1.5,
                  }}
                >
                  배열 변수는 스택에 있고,
                  <br />
                  객체는 힙에 생성됩니다.
                </div>
                <StackReferenceCard
                  name={PERSON_OBJECTS[0].name}
                  address={PERSON_OBJECTS[0].address}
                  opacity={declAppear}
                  cardRef={stackRef}
                  highlight={person1BindHighlight}
                />
                <StackReferenceCard
                  name={PERSON_OBJECTS[1].name}
                  address={PERSON_OBJECTS[1].address}
                  opacity={secondBundleAppear}
                  cardRef={stackRef2}
                  highlight={person2BindHighlight}
                />
              </div>
            </MemoryPanel>

            <MemoryPanel title="HEAP MEMORY" color={C_TEAL} width={430}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <ArrayObjectCard
                  name={PERSON_OBJECTS[0].name}
                  address={PERSON_OBJECTS[0].address}
                  values={PERSON_OBJECTS[0].values}
                  labels={PERSON_OBJECTS[0].labels}
                  opacity={declAppear}
                  scale={heapScale}
                  valueProgress={person1ValueProgress}
                  valueHighlight={person1BindHighlight}
                  objectRef={heapObjectRef}
                />
                <ArrayObjectCard
                  name={PERSON_OBJECTS[1].name}
                  address={PERSON_OBJECTS[1].address}
                  values={PERSON_OBJECTS[1].values}
                  labels={PERSON_OBJECTS[1].labels}
                  opacity={secondBundleAppear}
                  scale={heapScale}
                  valueProgress={secondBundleAppear}
                  valueHighlight={person2BindHighlight}
                  valueHighlightOnly={true}
                  objectRef={heapObjectRef2}
                />
              </div>
            </MemoryPanel>

            <ElementArrow
              containerRef={memoryLayoutRef}
              from={{ ref: stackRef, anchor: "right-center", padding: 10 }}
              to={{ ref: heapObjectRef, anchor: "left-center", padding: 14 }}
              color={C_TEAL}
              opacity={declAppear}
              strokeWidth={4}
            />
            <ElementArrow
              containerRef={memoryLayoutRef}
              from={{ ref: stackRef2, anchor: "right-center", padding: 10 }}
              to={{ ref: heapObjectRef2, anchor: "left-center", padding: 14 }}
              color={C_TEAL}
              opacity={secondBundleAppear}
              strokeWidth={4}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: "84%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: introAppear,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 34,
                fontWeight: 800,
                color: C_TEAL,
                whiteSpace: "nowrap",
              }}
            >
              한 사람의 데이터를 하나의 배열 객체로 묶기
            </div>
            <div
              style={{
                ...monoStyle,
                fontSize: 24,
                color: "rgba(255,255,255,0.52)",
                fontWeight: 700,
              }}
            >
              {PERSON_OBJECTS[0].address} → [1, 20, 170]
            </div>
            <div
              style={{
                ...monoStyle,
                fontSize: 24,
                color: "rgba(255,255,255,0.52)",
                fontWeight: 700,
                opacity: secondBundleAppear,
              }}
            >
              {PERSON_OBJECTS[1].address} → [2, 30, 180]
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.arraySolution.wordStartFrames}
      />
    </>
  );
};

// ── 씬: InstanceScene — 용어 설명 ───────────────────────────
const InstanceScene: React.FC = () => {
  const { instanceScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordTiming = AUDIO_CONFIG.instanceScene.wordTiming as unknown as Record<
    string,
    number[]
  >;

  const getWordFrame = (keys: string[], minFrame: number = s) =>
    keys
      .flatMap((key) => wordTiming[key] ?? [])
      .filter((f) => f >= minFrame)
      .sort((a, b) => a - b)[0] ?? 0;

  const termAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  const varAppear = spring({
    frame: frame - splits[0],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });
  const instanceElementStart = getWordFrame(["하나하나를"], splits[0]);
  const instanceElementHighlight =
    instanceElementStart > 0
      ? interpolate(
          frame,
          [
            instanceElementStart,
            instanceElementStart + 4,
            instanceElementStart + 30,
            instanceElementStart + 50,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 용어 정리" />

          <div
            style={{
              position: "absolute",
              top: "25%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              alignItems: "center",
            }}
          >
            <div
              style={{
                opacity: termAppear,
                transform: `scale(${interpolate(termAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                background: BG_CODE,
                borderRadius: 16,
                padding: "28px 48px",
                textAlign: "center",
                border: `2px solid ${C_TEAL}44`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.title,
                  fontWeight: 900,
                  color: C_TEAL,
                }}
              >
                객체 / 인스턴스
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  color: TEXT,
                  marginTop: 12,
                }}
              >
                배열 하나하나가 객체
              </div>
            </div>

            <MemoryPanel
              title="HEAP MEMORY"
              color={C_TEAL}
              width={470}
              style={{
                opacity: varAppear,
                transform: `scale(${interpolate(varAppear, [0, 1], [0.9, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              <ArrayObjectCard
                name={PERSON_OBJECTS[0].name}
                address={PERSON_OBJECTS[0].address}
                values={PERSON_OBJECTS[0].values}
                labels={PERSON_OBJECTS[0].labels}
                opacity={varAppear}
                valueProgress={varAppear}
                valueHighlight={instanceElementHighlight}
                valueHighlightOnly={true}
              />
            </MemoryPanel>
          </div>

          <div
            style={{
              position: "absolute",
              top: "72%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: 18,
              alignItems: "center",
              opacity: varAppear,
            }}
          >
            <div
              style={{
                background: BG_CODE,
                borderRadius: 16,
                padding: "22px 28px",
                border: `2px solid ${C_VAR}44`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 900,
                  color: C_VAR,
                  whiteSpace: "nowrap",
                }}
              >
                요소 / 인스턴스 변수
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  color: TEXT,
                  marginTop: 10,
                }}
              >
                배열 안의 칸 하나하나
              </div>
            </div>

            <CodeBlock
              style={{ padding: "16px 24px", width: 420, maxWidth: 420 }}
            >
              <div
                style={{
                  ...monoStyle,
                  fontSize: 22,
                  lineHeight: 1.8,
                  color: TEXT,
                }}
              >
                <span style={{ color: C_VAR }}>person1</span>
                {"["}
                <span style={{ color: C_NUMBER }}>0</span>
                {"] = "}
                <span style={{ color: C_NUMBER }}>1</span>
                {";"}
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 18,
                  color: C_COMMENT,
                  marginTop: 8,
                }}
              >
                // [0], [1], [2] 각각이 요소, 혹은 인스턴스 변수
              </div>
            </CodeBlock>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.instanceScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ComparisonScene — Before/After ──────────────────────
const ComparisonScene: React.FC = () => {
  const { comparisonScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const afterRef = React.useRef<HTMLDivElement>(null);
  const stackPerson1Ref = React.useRef<HTMLDivElement>(null);
  const stackPerson2Ref = React.useRef<HTMLDivElement>(null);
  const heapPerson1Ref = React.useRef<HTMLDivElement>(null);
  const heapPerson2Ref = React.useRef<HTMLDivElement>(null);

  const leftAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // "오른쪽은" 발화 타이밍에 맞춰 등장
  const belowWordFrame =
    AUDIO_CONFIG.comparisonScene.wordTiming["오른쪽은"]?.[0] ?? splits[0];
  const rightAppear = spring({
    frame: frame - belowWordFrame,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. Before / After" />

          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              gap: 28,
              alignItems: "flex-start",
            }}
          >
            <MemoryPanel
              title="BEFORE"
              color={C_PAIN}
              width={400}
              style={{
                opacity: leftAppear,
                minHeight: 520,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  color: C_PAIN,
                  marginBottom: 12,
                }}
              >
                ❌ 개별 변수
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                {[
                  { name: "person1_0", val: "1" },
                  { name: "person1_1", val: "20" },
                  { name: "person1_2", val: "170" },
                  { name: "person2_0", val: "2" },
                  { name: "person2_1", val: "30" },
                  { name: "person2_2", val: "180" },
                ].map((v, i) => {
                  const itemAppear = spring({
                    frame: frame - s - i * 4,
                    fps,
                    config: { damping: 14, stiffness: 150 },
                    durationInFrames: 18,
                  });
                  return (
                    <div
                      key={v.name}
                      style={{
                        background: BG_CODE,
                        borderRadius: 10,
                        border: `1px solid ${C_PAIN}55`,
                        padding: "10px 12px",
                        opacity: itemAppear,
                        ...monoStyle,
                        fontSize: 18,
                        width: "100%",
                      }}
                    >
                      <span style={{ color: C_VAR }}>{v.name}</span>{" "}
                      <span style={{ color: C_DIM }}>=</span>{" "}
                      <span style={{ color: C_NUMBER }}>{v.val}</span>
                    </div>
                  );
                })}
              </div>
            </MemoryPanel>

            <div
              ref={afterRef}
              style={{
                opacity: rightAppear,
                display: "flex",
                flexDirection: "column",
                gap: 30,
                position: "relative",
              }}
            >
              <MemoryPanel title="AFTER / STACK" color={C_VAR} width={300}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    marginTop: 18,
                  }}
                >
                  {PERSON_OBJECTS.map((person, i) => {
                    const refAppear = spring({
                      frame: frame - belowWordFrame - i * 8,
                      fps,
                      config: { damping: 14, stiffness: 150 },
                      durationInFrames: 20,
                    });
                    return (
                      <StackReferenceCard
                        key={person.name}
                        name={person.name}
                        address={person.address}
                        opacity={refAppear}
                        cardRef={i === 0 ? stackPerson1Ref : stackPerson2Ref}
                      />
                    );
                  })}
                </div>
              </MemoryPanel>

              <MemoryPanel
                title="AFTER / HEAP"
                color={C_TEAL}
                width={420}
                style={{ marginTop: 6 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginTop: 12,
                  }}
                >
                  {PERSON_OBJECTS.map((person, i) => {
                    const objectAppear = spring({
                      frame: frame - belowWordFrame - i * 10,
                      fps,
                      config: { damping: 14, stiffness: 150 },
                      durationInFrames: 22,
                    });
                    return (
                      <ArrayObjectCard
                        key={person.name}
                        name={person.name}
                        address={person.address}
                        values={person.values}
                        labels={person.labels}
                        opacity={objectAppear}
                        valueProgress={objectAppear}
                        objectRef={i === 0 ? heapPerson1Ref : heapPerson2Ref}
                      />
                    );
                  })}
                </div>
              </MemoryPanel>

              <ElementArrow
                containerRef={afterRef}
                from={{
                  ref: stackPerson1Ref,
                  anchor: "bottom-center",
                  padding: 10,
                }}
                to={{ ref: heapPerson1Ref, anchor: "top-right", padding: 14 }}
                color={C_TEAL}
                opacity={rightAppear}
                strokeWidth={3}
                curve={-28}
              />
              <ElementArrow
                containerRef={afterRef}
                from={{
                  ref: stackPerson2Ref,
                  anchor: "bottom-center",
                  padding: 10,
                }}
                to={{ ref: heapPerson2Ref, anchor: "top-right", padding: 14 }}
                color={C_TEAL}
                opacity={rightAppear}
                strokeWidth={3}
                curve={-22}
              />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: "82%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: rightAppear,
              width: 760,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                lineHeight: 1.45,
                color: "#fff",
              }}
            >
              <span style={{ color: C_TEAL }}>묶으면</span> 한 사람의 데이터가{" "}
              <span style={{ fontWeight: 900 }}>하나의 단위</span>로{" "}
              <span style={{ color: C_TEAL }}>관리됩니다.</span>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.comparisonScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: SummaryScene — 핵심 정리 ────────────────────────────
const SummaryScene: React.FC = () => {
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1 = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  const card2 = spring({
    frame: frame - splits[0],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  const cardStyle = (appear: number, borderColor: string) => ({
    background: BG_CODE,
    borderRadius: 16,
    padding: "28px 40px",
    textAlign: "center" as const,
    border: `2px solid ${borderColor}44`,
    opacity: appear,
    transform: `scale(${interpolate(appear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 핵심 정리" />

          <div
            style={{
              position: "absolute",
              top: "38%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 36,
              alignItems: "center",
            }}
          >
            <div style={cardStyle(card1, C_TEAL)}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.title,
                  fontWeight: 900,
                  color: C_TEAL,
                }}
              >
                객체의 핵심
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  color: TEXT,
                  marginTop: 12,
                }}
              >
                관련 데이터를 하나로 묶는 것
              </div>
            </div>

            <div style={cardStyle(card2, C_VAR)}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  fontWeight: 700,
                  color: TEXT,
                }}
              >
                다음 시간:
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.title,
                  fontWeight: 900,
                  color: C_VAR,
                  marginTop: 8,
                }}
              >
                클래스에 대해서 알아보기
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.summaryScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues 계산 ─────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.scatteredScene,
  VIDEO_CONFIG.arraySolution,
  VIDEO_CONFIG.instanceScene,
  VIDEO_CONFIG.comparisonScene,
  VIDEO_CONFIG.summaryScene,
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
    narration: CONTENT.scatteredScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.scatteredScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.scatteredScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.scatteredScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.scatteredScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.arraySolution.narration as string[],
    speechStartFrame: AUDIO_CONFIG.arraySolution.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.arraySolution.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.arraySolution.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.arraySolution.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.instanceScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.instanceScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.instanceScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.instanceScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.instanceScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.comparisonScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.comparisonScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.comparisonScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.comparisonScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.comparisonScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: CONTENT.summaryScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.summaryScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
  },
]);

export const SRT_TRACKS: SrtTracks = { "ko-KR": SRT_DATA };

// ── Root Component ────────────────────────────────────────────
const JavaObjects: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.scatteredScene.durationInFrames}
    >
      <ScatteredScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.arraySolution.durationInFrames}
    >
      <ArraySolutionScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.instanceScene.durationInFrames}
    >
      <InstanceScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.comparisonScene.durationInFrames}
    >
      <ComparisonScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaObjects;

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
import { CONTENT } from "./011-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./011-3-audio.gen";
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

/* ─── Audio helper ─── */

const AUDIO_SCENE_STUB = {
  durationInFrames: 30,
  speechStartFrame: 0,
  narrationSplits: [] as readonly number[],
  sentenceEndFrames: [] as readonly number[],
  wordStartFrames: [] as readonly number[][],
};

const getAudioScene = (key: string) => {
  const scene = (
    AUDIO_CONFIG as unknown as Record<string, typeof AUDIO_SCENE_STUB>
  )[key];
  return scene ?? AUDIO_SCENE_STUB;
};

/* ─── VIDEO_CONFIG ─── */

export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  painScene: {
    audio: "ctor-painScene.mp3",
    durationInFrames: getAudioScene("painScene").durationInFrames,
    speechStartFrame: getAudioScene("painScene").speechStartFrame,
    narration: CONTENT.painScene.narration as string[],
    narrationSplits: getAudioScene("painScene").narrationSplits,
  },
  whatIsScene: {
    audio: "ctor-whatIsScene.mp3",
    durationInFrames: getAudioScene("whatIsScene").durationInFrames,
    speechStartFrame: getAudioScene("whatIsScene").speechStartFrame,
    narration: CONTENT.whatIsScene.narration as string[],
    narrationSplits: getAudioScene("whatIsScene").narrationSplits,
  },
  defaultScene: {
    audio: "ctor-defaultScene.mp3",
    durationInFrames: getAudioScene("defaultScene").durationInFrames,
    speechStartFrame: getAudioScene("defaultScene").speechStartFrame,
    narration: CONTENT.defaultScene.narration as string[],
    narrationSplits: getAudioScene("defaultScene").narrationSplits,
  },
  customScene: {
    audio: "ctor-customScene.mp3",
    durationInFrames: getAudioScene("customScene").durationInFrames,
    speechStartFrame: getAudioScene("customScene").speechStartFrame,
    narration: CONTENT.customScene.narration as string[],
    narrationSplits: getAudioScene("customScene").narrationSplits,
  },
  comparisonScene: {
    audio: "ctor-comparisonScene.mp3",
    durationInFrames: getAudioScene("comparisonScene").durationInFrames,
    speechStartFrame: getAudioScene("comparisonScene").speechStartFrame,
    narration: CONTENT.comparisonScene.narration as string[],
    narrationSplits: getAudioScene("comparisonScene").narrationSplits,
  },
  summaryScene: {
    audio: "ctor-summaryScene.mp3",
    durationInFrames: getAudioScene("summaryScene").durationInFrames,
    speechStartFrame: getAudioScene("summaryScene").speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    narrationSplits: getAudioScene("summaryScene").narrationSplits,
  },
} as const;

/* ─── Shared styles ─── */

const panelStyle: React.CSSProperties = {
  background: `${BG_CODE}d8`,
  borderRadius: 22,
  padding: "28px 30px",
  position: "relative",
};

const codeBlock: React.CSSProperties = {
  ...monoStyle,
  fontSize: 26,
  lineHeight: 2,
};

/* ─── Scenes ─── */

const ThumbnailScene: React.FC = () => (
  <Thumb
    seriesLabel={CONTENT.thumbnail.seriesLabel}
    title={CONTENT.thumbnail.title}
    subtitle={CONTENT.thumbnail.subtitle}
    badge={CONTENT.thumbnail.badge}
  />
);

const PainScene: React.FC = () => {
  const { painScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const warningAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  const wordTiming =
    (
      getAudioScene("painScene") as {
        wordTiming?: Record<string, readonly number[]>;
      }
    ).wordTiming ?? {};
  const findWordFrame = (keys: string[]) =>
    keys.flatMap((key) => wordTiming[key] ?? []).sort((a, b) => a - b)[0] ?? 0;
  const buildUnderline = (wordFrame: number) =>
    wordFrame > 0
      ? interpolate(
          frame,
          [wordFrame - 4, wordFrame + 8, wordFrame + 38, wordFrame + 60],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;

  const assignmentHighlight = buildUnderline(findWordFrame(["하나하나"]));
  const newPersonHighlight = buildUnderline(findWordFrame(["뒤"]));

  const lines = [
    {
      parts: [
        { text: "Person", color: C_TEAL },
        { text: " person1 = ", color: TEXT },
        { text: "new", color: C_KEYWORD },
        { text: " ", color: TEXT },
        { text: "Person", color: C_TEAL },
        { text: "();", color: TEXT },
      ],
    },
    {
      parts: [
        { text: "person1", color: C_VAR },
        { text: ".id = ", color: TEXT },
        { text: "1", color: C_NUMBER },
        { text: ";", color: TEXT },
      ],
    },
    {
      parts: [
        { text: "person1", color: C_VAR },
        { text: ".age = ", color: TEXT },
        { text: "20", color: C_NUMBER },
        { text: ";", color: TEXT },
      ],
    },
    {
      parts: [
        { text: "person1", color: C_VAR },
        { text: ".height = ", color: TEXT },
        { text: "170", color: C_NUMBER },
        { text: ";", color: TEXT },
      ],
    },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 지금까지의 방식" />

          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
              width: 920,
            }}
          >
            <div
              style={{
                ...panelStyle,
                width: 820,
                border: `2px solid ${C_PAIN}44`,
                opacity: codeAppear,
                transform: `scale(${interpolate(codeAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                padding: "32px 44px",
              }}
            >
              <div style={codeBlock}>
                {lines.map((line, li) => {
                  const lineHighlight =
                    li === 0
                      ? newPersonHighlight
                      : li >= 1 && li <= 3
                        ? assignmentHighlight
                        : 0;
                  const isLineActive = lineHighlight > 0.05;

                  return (
                    <div
                      key={`line-${li}`}
                      style={{
                        paddingLeft: 0,
                        textDecorationLine: isLineActive ? "underline" : "none",
                        textDecorationColor: C_TEAL,
                        textDecorationThickness: `${2 + lineHighlight * 3}px`,
                        textUnderlineOffset: `${4 + lineHighlight * 2}px`,
                      }}
                    >
                      {line.parts.map((p, pi) => (
                        <span key={`p-${li}-${pi}`} style={{ color: p.color }}>
                          {p.text}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                color: C_PAIN,
                textAlign: "center",
                lineHeight: 1.5,
                opacity: warningAppear,
                transform: `scale(${interpolate(warningAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              매번 하나하나 세팅...
              <br />
              빠뜨리면?
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("painScene").wordStartFrames}
      />
    </>
  );
};

const WhatIsScene: React.FC = () => {
  const { whatIsScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const highlightAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const labelAppear = spring({
    frame: frame - (splits[1] ?? s + 80),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  const highlightGlow =
    highlightAppear > 0.5 ? 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.08)) : 0;

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 생성자란?" />

          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 50,
              width: 920,
            }}
          >
            {/* new Person() code */}
            <div
              style={{
                ...panelStyle,
                width: 720,
                border: `2px solid ${C_TEAL}44`,
                padding: "40px 56px",
                opacity: codeAppear,
                transform: `scale(${interpolate(codeAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div style={{ ...monoStyle, fontSize: 38, textAlign: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    textDecorationLine:
                      highlightGlow > 0.05 ? "underline" : "none",
                    textDecorationColor: C_TEAL,
                    textDecorationThickness: `${2 + highlightGlow * 3}px`,
                    textUnderlineOffset: `${4 + highlightGlow * 2}px`,
                  }}
                >
                  <span style={{ color: C_KEYWORD }}>new</span>{" "}
                  <span style={{ color: C_TEAL }}>Person()</span>
                </span>{" "}
              </div>
            </div>

            {/* Arrow + label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                opacity: highlightAppear,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 50,
                  fontWeight: 700,
                  color: C_TEAL,
                }}
              >
                ↑
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.title,
                  fontWeight: 900,
                  color: C_TEAL,
                  textAlign: "center",
                }}
              >
                생성자 호출!
              </div>
            </div>

            {/* Definition card */}
            <div
              style={{
                background: BG_CODE,
                borderRadius: 16,
                padding: "32px 48px",
                border: `2px solid ${C_TEAL}33`,
                opacity: labelAppear,
                transform: `scale(${interpolate(labelAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  fontWeight: 800,
                  color: TEXT,
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                객체가 만들어질 때
                <br />
                <span style={{ color: C_TEAL }}>자동으로 실행</span>되는 메서드
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("whatIsScene").wordStartFrames}
      />
    </>
  );
};

const DefaultScene: React.FC = () => {
  const { defaultScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const classAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const ghostAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  const labelAppear = spring({
    frame: frame - (splits[1] ?? s + 80),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 기본 생성자" />

          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
              width: 920,
            }}
          >
            {/* Class without constructor */}
            <div
              style={{
                ...panelStyle,
                width: 700,
                border: `2px solid ${C_TEAL}44`,
                padding: "32px 44px",
                opacity: classAppear,
                transform: `scale(${interpolate(classAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div style={codeBlock}>
                <span style={{ color: C_KEYWORD }}>class</span>{" "}
                <span style={{ color: C_TEAL }}>Person</span>{" "}
                <span style={{ color: TEXT }}>{"{"}</span>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>age</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>height</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <span style={{ color: TEXT }}>{"}"}</span>
              </div>
            </div>

            {/* Java auto-generated constructor (ghost) */}
            <div
              style={{
                ...panelStyle,
                width: 700,
                border: `2px dashed ${C_COMMENT}66`,
                padding: "28px 44px",
                opacity: ghostAppear * 0.85,
                transform: `scale(${interpolate(ghostAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 20,
                  fontWeight: 800,
                  color: C_COMMENT,
                  marginBottom: 12,
                }}
              >
                Java가 자동 생성 ↓
              </div>
              <div style={codeBlock}>
                <span style={{ color: C_TEAL }}>Person</span>
                <span style={{ color: TEXT }}>() {"{"}</span>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_COMMENT }}>// 비어 있음</span>
                </div>
                <span style={{ color: TEXT }}>{"}"}</span>
              </div>
            </div>

            {/* Label */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 900,
                color: C_TEAL,
                textAlign: "center",
                opacity: labelAppear,
                transform: `scale(${interpolate(labelAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              이것이 &quot;기본 생성자&quot;
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("defaultScene").wordStartFrames}
      />
    </>
  );
};

const CustomScene: React.FC = () => {
  const { customScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const classAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const resultAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 직접 만들기" />

          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
              width: 920,
            }}
          >
            {/* Class with custom constructor */}
            <div
              style={{
                ...panelStyle,
                width: 780,
                border: `2px solid ${C_TEAL}55`,
                padding: "28px 40px",
                opacity: classAppear,
                transform: `scale(${interpolate(classAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div style={{ ...codeBlock, fontSize: 24 }}>
                <span style={{ color: C_KEYWORD }}>class</span>{" "}
                <span style={{ color: C_TEAL }}>Person</span>{" "}
                <span style={{ color: TEXT }}>{"{"}</span>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>age</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>height</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ height: 8 }} />
                <div style={{ height: 16 }} />
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}>() {"{"}</span>
                </div>
                <div style={{ paddingLeft: 72 }}>
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_NUMBER }}>1</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 72 }}>
                  <span style={{ color: C_VAR }}>age</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_NUMBER }}>20</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 72 }}>
                  <span style={{ color: C_VAR }}>height</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_NUMBER }}>170</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: TEXT }}>{"}"}</span>
                </div>
                <span style={{ color: TEXT }}>{"}"}</span>
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 50,
                fontWeight: 700,
                color: C_TEAL,
                opacity: resultAppear,
              }}
            >
              ↓
            </div>

            {/* Result: new Person() auto-sets values */}
            <div
              style={{
                ...panelStyle,
                width: 780,
                border: `2px solid ${C_TEAL}44`,
                padding: "24px 40px",
                opacity: resultAppear,
                transform: `scale(${interpolate(resultAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div style={{ ...monoStyle, fontSize: 26, lineHeight: 1.8 }}>
                <span style={{ color: C_TEAL }}>Person</span>{" "}
                <span style={{ color: C_VAR }}>p</span>
                <span style={{ color: TEXT }}> = </span>
                <span style={{ color: C_KEYWORD }}>new</span>{" "}
                <span style={{ color: C_TEAL }}>Person</span>
                <span style={{ color: TEXT }}>();</span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 16,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { field: "p.id", value: "1" },
                  { field: "p.age", value: "20" },
                  { field: "p.height", value: "170" },
                ].map((item, i) => (
                  <div
                    key={`result-${i}`}
                    style={{
                      background: `${BG}88`,
                      borderRadius: 10,
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{ ...monoStyle, fontSize: 24, color: C_TEAL }}>
                      {item.field}
                    </span>
                    <span style={{ ...monoStyle, fontSize: 24, color: C_DIM }}>
                      →
                    </span>
                    <span
                      style={{ ...monoStyle, fontSize: 24, color: C_NUMBER }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 22,
                  fontWeight: 800,
                  color: C_TEAL,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                자동으로 세팅 완료!
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("customScene").wordStartFrames}
      />
    </>
  );
};

const ComparisonScene: React.FC = () => {
  const { comparisonScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });
  const topAppear = spring({
    frame: frame - (splits[0] ?? s + 30),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const bottomAppear = spring({
    frame: frame - (splits[1] ?? s + 60),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const halfStyle: React.CSSProperties = {
    ...panelStyle,
    width: 880,
    padding: "24px 36px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 비교" />

          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
              width: 920,
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                color: TEXT,
                opacity: titleAppear,
              }}
            >
              생성자 없이 vs 생성자 사용
            </div>

            {/* Without constructor */}
            <div
              style={{
                ...halfStyle,
                border: `2px solid ${C_PAIN}55`,
                opacity: topAppear,
                transform: `scale(${interpolate(topAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 22,
                  fontWeight: 800,
                  color: C_PAIN,
                  marginBottom: 4,
                }}
              >
                생성자 없이 — 4줄 필요
              </div>
              <div style={{ ...monoStyle, fontSize: 22, lineHeight: 1.8 }}>
                <div>
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}> p = </span>
                  <span style={{ color: C_KEYWORD }}>new</span>{" "}
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}>();</span>
                </div>
                <div>
                  <span style={{ color: C_VAR }}>p</span>
                  <span style={{ color: TEXT }}>.id = </span>
                  <span style={{ color: C_NUMBER }}>1</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div>
                  <span style={{ color: C_VAR }}>p</span>
                  <span style={{ color: TEXT }}>.age = </span>
                  <span style={{ color: C_NUMBER }}>20</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div>
                  <span style={{ color: C_VAR }}>p</span>
                  <span style={{ color: TEXT }}>.height = </span>
                  <span style={{ color: C_NUMBER }}>170</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
              </div>
            </div>

            {/* VS */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 36,
                fontWeight: 900,
                color: C_DIM,
                opacity: bottomAppear,
              }}
            >
              VS
            </div>

            {/* With constructor */}
            <div
              style={{
                ...halfStyle,
                border: `2px solid ${C_TEAL}55`,
                opacity: bottomAppear,
                transform: `scale(${interpolate(bottomAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 22,
                  fontWeight: 800,
                  color: C_TEAL,
                  marginBottom: 4,
                }}
              >
                생성자 사용 — 1줄로 끝!
              </div>
              <div style={{ ...monoStyle, fontSize: 22, lineHeight: 1.8 }}>
                <div>
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}> p = </span>
                  <span style={{ color: C_KEYWORD }}>new</span>{" "}
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}>();</span>
                </div>
                <div style={{ color: C_COMMENT }}>
                  // id = 1, age = 20, height = 170 자동 세팅!
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
        wordFrames={getAudioScene("comparisonScene").wordStartFrames}
      />
    </>
  );
};

const SummaryScene: React.FC = () => {
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const points = [
    {
      text: "new Person()에서\nPerson()은 생성자 호출",
      color: C_TEAL,
    },
    {
      text: "생성자가 없으면\nJava가 기본 생성자를 자동 생성",
      color: C_KEYWORD,
    },
    {
      text: "직접 만들면\n원하는 초기값을 자동 세팅",
      color: C_TEAL,
    },
  ];

  const lineAppears = points.map((_, i) =>
    spring({
      frame: frame - (splits[i] ?? s),
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
          <SceneTitle title="6. 정리" />

          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 36,
              alignItems: "center",
            }}
          >
            {points.map((point, i) => {
              const appear = lineAppears[i];
              return (
                <div
                  key={`summary-${i}`}
                  style={{
                    background: BG_CODE,
                    padding: "28px 44px",
                    border: `2px solid ${point.color}44`,
                    borderRadius: 16,
                    fontFamily: uiFont,
                    fontSize: FONT.heading,
                    fontWeight: 800,
                    color: TEXT,
                    textAlign: "center",
                    lineHeight: 1.5,
                    opacity: appear,
                    transform: `scale(${interpolate(appear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                    whiteSpace: "pre-line",
                  }}
                >
                  {point.text}
                </div>
              );
            })}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("summaryScene").wordStartFrames}
      />
    </>
  );
};

/* ─── Composition ─── */

const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.painScene,
  VIDEO_CONFIG.whatIsScene,
  VIDEO_CONFIG.defaultScene,
  VIDEO_CONFIG.customScene,
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

export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

export const SRT_DATA: SrtEntry[] = buildSrtData([
  {
    offset: fromValues[1],
    narration: CONTENT.painScene.narration as string[],
    speechStartFrame: getAudioScene("painScene").speechStartFrame,
    narrationSplits: getAudioScene("painScene").narrationSplits,
    sentenceEndFrames: getAudioScene("painScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.painScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.whatIsScene.narration as string[],
    speechStartFrame: getAudioScene("whatIsScene").speechStartFrame,
    narrationSplits: getAudioScene("whatIsScene").narrationSplits,
    sentenceEndFrames: getAudioScene("whatIsScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.whatIsScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.defaultScene.narration as string[],
    speechStartFrame: getAudioScene("defaultScene").speechStartFrame,
    narrationSplits: getAudioScene("defaultScene").narrationSplits,
    sentenceEndFrames: getAudioScene("defaultScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.defaultScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.customScene.narration as string[],
    speechStartFrame: getAudioScene("customScene").speechStartFrame,
    narrationSplits: getAudioScene("customScene").narrationSplits,
    sentenceEndFrames: getAudioScene("customScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.customScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: CONTENT.comparisonScene.narration as string[],
    speechStartFrame: getAudioScene("comparisonScene").speechStartFrame,
    narrationSplits: getAudioScene("comparisonScene").narrationSplits,
    sentenceEndFrames: getAudioScene("comparisonScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.comparisonScene.durationInFrames,
  },
  {
    offset: fromValues[6],
    narration: CONTENT.summaryScene.narration as string[],
    speechStartFrame: getAudioScene("summaryScene").speechStartFrame,
    narrationSplits: getAudioScene("summaryScene").narrationSplits,
    sentenceEndFrames: getAudioScene("summaryScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
  },
]);

export const SRT_TRACKS: SrtTracks = { "ko-KR": SRT_DATA };

const JavaConstructor: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.whatIsScene.durationInFrames}
    >
      <WhatIsScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.defaultScene.durationInFrames}
    >
      <DefaultScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.customScene.durationInFrames}
    >
      <CustomScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.comparisonScene.durationInFrames}
    >
      <ComparisonScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaConstructor;

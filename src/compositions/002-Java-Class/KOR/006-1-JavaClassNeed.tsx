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
import { CONTENT } from "./006-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./006-3-audio.gen";
import {
  BG,
  BG_CODE,
  BG_THUMB,
  C_DIM,
  C_KEYWORD,
  C_NUMBER,
  C_PAIN,
  C_PURPLE,
  C_STRING,
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
  arrayPainScene: {
    audio: "cls2-arrayPainScene.mp3",
    durationInFrames: getAudioScene("arrayPainScene").durationInFrames,
    speechStartFrame: getAudioScene("arrayPainScene").speechStartFrame,
    narration: CONTENT.arrayPainScene.narration as string[],
    narrationSplits: getAudioScene("arrayPainScene").narrationSplits,
  },
  classSolutionScene: {
    audio: "cls2-classSolutionScene.mp3",
    durationInFrames: getAudioScene("classSolutionScene").durationInFrames,
    speechStartFrame: getAudioScene("classSolutionScene").speechStartFrame,
    narration: CONTENT.classSolutionScene.narration as string[],
    narrationSplits: getAudioScene("classSolutionScene").narrationSplits,
  },
  flexScene: {
    audio: "cls2-flexScene.mp3",
    durationInFrames: getAudioScene("flexScene").durationInFrames,
    speechStartFrame: getAudioScene("flexScene").speechStartFrame,
    narration: CONTENT.flexScene.narration as string[],
    narrationSplits: getAudioScene("flexScene").narrationSplits,
  },
  comparisonScene: {
    audio: "cls2-comparisonScene.mp3",
    durationInFrames: getAudioScene("comparisonScene").durationInFrames,
    speechStartFrame: getAudioScene("comparisonScene").speechStartFrame,
    narration: CONTENT.comparisonScene.narration as string[],
    narrationSplits: getAudioScene("comparisonScene").narrationSplits,
  },
  summaryScene: {
    audio: "cls2-summaryScene.mp3",
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

/* ─── Scenes ─── */

const ThumbnailScene: React.FC = () => (
  <Thumb
    seriesLabel={CONTENT.thumbnail.seriesLabel}
    title={CONTENT.thumbnail.title}
    subtitle={CONTENT.thumbnail.subtitle}
    badge={CONTENT.thumbnail.badge}
  />
);

const ArrayPainScene: React.FC = () => {
  const { arrayPainScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* Step 1: 번호, 나이, 키 카드 (1st sentence) */
  const infoAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const infoItems = [
    { label: "번호", example: "1", color: C_VAR },
    { label: "나이", example: "20", color: C_VAR },
    { label: "키", example: "170", color: C_VAR },
  ];

  /* Step 2: int 배열 코드 (2nd sentence) */
  const codeAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  /* Step 3: 접근 예시 + 혼란 (3rd sentence) */
  const accessItems = [
    { index: "person1[0]", value: "1", question: "번호? 나이?" },
    { index: "person1[1]", value: "20", question: "나이? 키?" },
    { index: "person1[2]", value: "170", question: "???" },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 배열의 불편함" />

          <div
            style={{
              position: "absolute",
              top: "14%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
              width: 920,
            }}
          >
            {/* Info cards: 번호, 나이, 키 */}
            <div
              style={{
                display: "flex",
                gap: 24,
                opacity: infoAppear,
                transform: `scale(${interpolate(infoAppear, [0, 1], [0.88, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              {infoItems.map((item, i) => {
                const itemDelay = spring({
                  frame: frame - s - i * 6,
                  fps,
                  config: { damping: 13, stiffness: 140 },
                  durationInFrames: 22,
                });
                return (
                  <div
                    key={`info-${i}`}
                    style={{
                      ...panelStyle,
                      padding: "20px 36px",
                      border: `2px solid ${C_TEAL}44`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 160,
                      opacity: itemDelay,
                      transform: `translateY(${interpolate(
                        itemDelay,
                        [0, 1],
                        [12, 0],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        },
                      )}px)`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: uiFont,
                        fontSize: FONT.label,
                        fontWeight: 800,
                        color: C_TEAL,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        ...monoStyle,
                        fontSize: 28,
                        color: C_NUMBER,
                      }}
                    >
                      {item.example}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Code block */}
            <div
              style={{
                ...panelStyle,
                width: 880,
                border: `2px solid ${C_PAIN}44`,
                opacity: codeAppear,
                transform: `scale(${interpolate(codeAppear, [0, 1], [0.92, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
                padding: "28px 36px",
              }}
            >
              <div style={{ ...monoStyle, fontSize: 30, lineHeight: 1.6 }}>
                <span style={{ color: C_TYPE }}>int</span>
                <span style={{ color: TEXT }}>[] person1 = {"{"}</span>
                <span style={{ color: C_NUMBER }}>1</span>
                <span style={{ color: TEXT }}>, </span>
                <span style={{ color: C_NUMBER }}>20</span>
                <span style={{ color: TEXT }}>, </span>
                <span style={{ color: C_NUMBER }}>170</span>
                <span style={{ color: TEXT }}>{"}"}</span>
                <span style={{ color: TEXT }}>;</span>
              </div>
            </div>

            {/* Access examples with confusion */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                width: 880,
              }}
            >
              {accessItems.map((item, i) => {
                const itemAppear = spring({
                  frame: frame - (splits[0] ?? s + 40),
                  fps,
                  config: { damping: 13, stiffness: 140 },
                  durationInFrames: 22,
                });
                return (
                  <div
                    key={`access-${i}`}
                    style={{
                      ...panelStyle,
                      padding: "20px 32px",
                      border: `2px solid ${C_PAIN}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      opacity: itemAppear,
                      transform: `translateY(${interpolate(
                        itemAppear,
                        [0, 1],
                        [16, 0],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        },
                      )}px)`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      <span
                        style={{
                          ...monoStyle,
                          fontSize: FONT.label,
                          color: C_VAR,
                        }}
                      >
                        {item.index}
                      </span>
                      <span
                        style={{
                          fontFamily: uiFont,
                          fontSize: FONT.label,
                          color: C_DIM,
                        }}
                      >
                        →
                      </span>
                      <span
                        style={{
                          ...monoStyle,
                          fontSize: FONT.label,
                          color: C_NUMBER,
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: uiFont,
                        fontSize: 24,
                        fontWeight: 800,
                        color: C_PAIN,
                      }}
                    >
                      {item.question}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("arrayPainScene").wordStartFrames}
      />
    </>
  );
};

const ClassSolutionScene: React.FC = () => {
  const { classSolutionScene: cfg } = VIDEO_CONFIG;
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
  const accessAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const wordTiming =
    (
      getAudioScene("classSolutionScene") as {
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
  const idAssignHighlight = buildUnderline(
    findWordFrame([".id", "person1.id"]),
  );
  const ageAssignHighlight = buildUnderline(
    findWordFrame([".age", "person1.age"]),
  );
  const heightAssignHighlight = buildUnderline(
    findWordFrame([".height처럼", ".height", "person1.height"]),
  );

  const fields = [
    { type: "int", name: "id" },
    { type: "int", name: "age" },
    { type: "int", name: "height" },
  ];

  const accessItems = [
    { field: "person1.id", value: "1" },
    { field: "person1.age", value: "20" },
    { field: "person1.height", value: "170" },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 클래스로 해결" />

          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
              width: 920,
            }}
          >
            {/* Class definition */}
            <div
              style={{
                ...panelStyle,
                width: 680,
                border: `2px solid ${C_TEAL}55`,
                opacity: classAppear,
                transform: `scale(${interpolate(
                  classAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
                padding: "28px 40px",
              }}
            >
              <div style={{ ...monoStyle, fontSize: 28, lineHeight: 2 }}>
                <span style={{ color: C_KEYWORD }}>class</span>{" "}
                <span style={{ color: C_TEAL }}>Person</span>{" "}
                <span style={{ color: TEXT }}>{"{"}</span>
                {fields.map((f) => (
                  <div key={f.name} style={{ paddingLeft: 36 }}>
                    <span style={{ color: C_TYPE }}>{f.type}</span>{" "}
                    <span style={{ color: C_VAR }}>{f.name}</span>
                    <span style={{ color: TEXT }}>;</span>
                  </div>
                ))}
                <span style={{ color: TEXT }}>{"}"}</span>
              </div>
            </div>

            {/* Object creation + init */}
            <div
              style={{
                ...panelStyle,
                width: 680,
                border: `2px solid ${C_TEAL}33`,
                opacity: accessAppear,
                transform: `scale(${interpolate(
                  accessAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
                padding: "24px 40px",
              }}
            >
              <div style={{ ...monoStyle, fontSize: 26, lineHeight: 2 }}>
                <span style={{ color: C_TEAL }}>Person</span>{" "}
                <span style={{ color: C_VAR }}>person1</span>
                <span style={{ color: TEXT }}> = </span>
                <span style={{ color: C_KEYWORD }}>new</span>{" "}
                <span style={{ color: C_TEAL }}>Person</span>
                <span style={{ color: TEXT }}>();</span>
                <div
                  style={{
                    paddingLeft: 0,
                    textDecorationLine:
                      idAssignHighlight > 0.05 ? "underline" : "none",
                    textDecorationColor: C_TEAL,
                    textDecorationThickness: `${2 + idAssignHighlight * 3}px`,
                    textUnderlineOffset: `${4 + idAssignHighlight * 2}px`,
                  }}
                >
                  <span style={{ color: C_VAR }}>person1</span>
                  <span style={{ color: TEXT }}>.id = </span>
                  <span style={{ color: C_NUMBER }}>1</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div
                  style={{
                    paddingLeft: 0,
                    textDecorationLine:
                      ageAssignHighlight > 0.05 ? "underline" : "none",
                    textDecorationColor: C_TEAL,
                    textDecorationThickness: `${2 + ageAssignHighlight * 3}px`,
                    textUnderlineOffset: `${4 + ageAssignHighlight * 2}px`,
                  }}
                >
                  <span style={{ color: C_VAR }}>person1</span>
                  <span style={{ color: TEXT }}>.age = </span>
                  <span style={{ color: C_NUMBER }}>20</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div
                  style={{
                    paddingLeft: 0,
                    textDecorationLine:
                      heightAssignHighlight > 0.05 ? "underline" : "none",
                    textDecorationColor: C_TEAL,
                    textDecorationThickness: `${2 + heightAssignHighlight * 3}px`,
                    textUnderlineOffset: `${4 + heightAssignHighlight * 2}px`,
                  }}
                >
                  <span style={{ color: C_VAR }}>person1</span>
                  <span style={{ color: TEXT }}>.height = </span>
                  <span style={{ color: C_NUMBER }}>170</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 50,
                fontWeight: 700,
                lineHeight: 1,
                color: C_TEAL,
                opacity: accessAppear,
              }}
            >
              ↓
            </div>

            {/* Named access */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: 680,
                opacity: accessAppear,
                transform: `scale(${interpolate(
                  accessAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
              }}
            >
              {accessItems.map((item, i) => (
                <div
                  key={`named-${i}`}
                  style={{
                    ...panelStyle,
                    padding: "18px 32px",
                    border: `2px solid ${C_TEAL}44`,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: FONT.label,
                      color: C_TEAL,
                    }}
                  >
                    {item.field}
                  </span>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: FONT.label,
                      color: C_DIM,
                    }}
                  >
                    →
                  </span>
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: FONT.label,
                      color: C_NUMBER,
                    }}
                  >
                    {item.value}
                  </span>
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
        wordFrames={getAudioScene("classSolutionScene").wordStartFrames}
      />
    </>
  );
};

const FlexScene: React.FC = () => {
  const { flexScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typeChangeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const newFieldsAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const originalFields = [
    { type: "int", name: "id", changed: false },
    { type: "int", name: "age", changed: false },
    { type: "double", name: "height", changed: true },
  ];

  const newFields = [
    { type: "String", name: "name" },
    { type: "boolean", name: "married" },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 자유로운 구성" />

          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
              width: 920,
            }}
          >
            {/* Type change card */}
            <div
              style={{
                ...panelStyle,
                width: 720,
                border: `2px solid ${C_TEAL}55`,
                opacity: typeChangeAppear,
                transform: `scale(${interpolate(
                  typeChangeAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
                padding: "32px 44px",
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 22,
                  fontWeight: 800,
                  color: C_TEAL,
                  marginBottom: 20,
                }}
              >
                타입 변경
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {originalFields.map((f) => (
                  <div
                    key={f.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        ...monoStyle,
                        fontSize: FONT.label,
                        color: f.changed ? C_TEAL : C_TYPE,
                        fontWeight: f.changed ? 900 : 400,
                      }}
                    >
                      {f.type}
                    </span>
                    <span
                      style={{
                        ...monoStyle,
                        fontSize: FONT.label,
                        color: C_VAR,
                      }}
                    >
                      {f.name};
                    </span>
                    {f.changed && (
                      <span
                        style={{
                          fontFamily: uiFont,
                          fontSize: 22,
                          fontWeight: 800,
                          color: C_TEAL,
                          marginLeft: 8,
                        }}
                      >
                        ← int에서 변경!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* New fields card */}
            <div
              style={{
                ...panelStyle,
                width: 720,
                border: `2px solid ${C_VAR}55`,
                opacity: newFieldsAppear,
                transform: `scale(${interpolate(
                  newFieldsAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
                padding: "32px 44px",
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 22,
                  fontWeight: 800,
                  color: C_VAR,
                  marginBottom: 20,
                }}
              >
                + 필드 추가
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {newFields.map((f) => (
                  <div
                    key={f.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        ...monoStyle,
                        fontSize: FONT.label,
                        color: C_TYPE,
                      }}
                    >
                      {f.type}
                    </span>
                    <span
                      style={{
                        ...monoStyle,
                        fontSize: FONT.label,
                        color: C_VAR,
                      }}
                    >
                      {f.name};
                    </span>
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
        wordFrames={getAudioScene("flexScene").wordStartFrames}
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
  const arrayAppear = spring({
    frame: frame - (splits[0] ?? s + 30),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const classAppear = spring({
    frame: frame - (splits[1] ?? s + 60),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const arrayAccess = [
    { code: "person1[0]", value: "1", label: "int" },
    { code: "person1[1]", value: "20", label: "int" },
    { code: "person1[2]", value: "170", label: "int" },
  ];

  const classAccess = [
    { code: "person1.id", value: "1", type: "int" },
    { code: "person1.age", value: "20", type: "int" },
    { code: "person1.height", value: "170.5", type: "double" },
    { code: "person1.name", value: '"Chris"', type: "String" },
    { code: "person1.married", value: "false", type: "boolean" },
  ];

  const halfStyle: React.CSSProperties = {
    ...panelStyle,
    width: 880,
    padding: "28px 36px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 비교" />

          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
              width: 920,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                color: TEXT,
                opacity: titleAppear,
              }}
            >
              배열 vs 클래스
            </div>

            {/* Array panel (top) */}
            <div
              style={{
                ...halfStyle,
                border: `2px solid ${C_PAIN}55`,
                opacity: arrayAppear,
                transform: `scale(${interpolate(
                  arrayAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
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
                배열 — 인덱스 접근, int만
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 22,
                  lineHeight: 1.5,
                  marginBottom: 6,
                  padding: "8px 12px",
                  background: `${BG}88`,
                  borderRadius: 8,
                }}
              >
                <span style={{ color: C_TYPE }}>int</span>
                <span style={{ color: TEXT }}>[] person1 = </span>
                <span style={{ color: C_KEYWORD }}>new </span>
                <span style={{ color: C_TYPE }}>int</span>
                <span style={{ color: TEXT }}>[]{"{"}</span>
                <span style={{ color: C_NUMBER }}>1</span>
                <span style={{ color: TEXT }}>, </span>
                <span style={{ color: C_NUMBER }}>20</span>
                <span style={{ color: TEXT }}>, </span>
                <span style={{ color: C_NUMBER }}>170</span>
                <span style={{ color: TEXT }}>{"}"}</span>
                <span style={{ color: TEXT }}>;</span>
              </div>
              {arrayAccess.map((item, i) => (
                <div
                  key={`arr-${i}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: FONT.label,
                      color: C_VAR,
                      width: 260,
                    }}
                  >
                    {item.code}
                  </span>
                  <span
                    style={{ ...monoStyle, fontSize: FONT.label, color: C_DIM }}
                  >
                    →
                  </span>
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: FONT.label,
                      color: C_NUMBER,
                    }}
                  >
                    {item.value}
                  </span>
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: 20,
                      color: C_DIM,
                      marginLeft: "auto",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* VS divider */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 36,
                fontWeight: 900,
                color: C_DIM,
                opacity: classAppear,
              }}
            >
              VS
            </div>

            {/* Class panel (bottom) */}
            <div
              style={{
                ...halfStyle,
                border: `2px solid ${C_TEAL}55`,
                opacity: classAppear,
                transform: `scale(${interpolate(
                  classAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
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
                클래스 — 이름 접근, 다양한 타입
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 22,
                  lineHeight: 1.5,
                  marginBottom: 6,
                  padding: "8px 12px",
                  background: `${BG}88`,
                  borderRadius: 8,
                }}
              >
                <span style={{ color: C_TEAL }}>Person</span>
                <span style={{ color: TEXT }}> person1 = </span>
                <span style={{ color: C_KEYWORD }}>new </span>
                <span style={{ color: C_TEAL }}>Person</span>
                <span style={{ color: TEXT }}>();</span>
              </div>
              {classAccess.map((item, i) => (
                <div
                  key={`cls-${i}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: FONT.label,
                      color: C_TEAL,
                      width: 260,
                    }}
                  >
                    {item.code}
                  </span>
                  <span
                    style={{ ...monoStyle, fontSize: FONT.label, color: C_DIM }}
                  >
                    →
                  </span>
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: FONT.label,
                      color:
                        item.type === "String"
                          ? C_STRING
                          : item.type === "boolean"
                            ? C_PURPLE
                            : C_NUMBER,
                    }}
                  >
                    {item.value}
                  </span>
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: 20,
                      color: item.type !== "int" ? C_TEAL : C_TYPE,
                      fontWeight: item.type !== "int" ? 800 : 400,
                      marginLeft: "auto",
                    }}
                  >
                    {item.type}
                  </span>
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
      text: "배열은 인덱스로만 접근하고,\n같은 타입만 담을 수 있습니다.",
      color: C_PAIN,
    },
    {
      text: "클래스로 객체를 만들면 이름으로 접근하고,\n다양한 타입을 자유롭게 구성할 수 있습니다.",
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
          <SceneTitle title="5. 정리" />

          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 44,
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
                    padding: "32px 48px",
                    border: `2px solid ${point.color}44`,
                    borderRadius: 16,
                    fontFamily: uiFont,
                    fontSize: FONT.heading,
                    fontWeight: 800,
                    color: TEXT,
                    textAlign: "center",
                    lineHeight: 1.5,
                    opacity: appear,
                    transform: `scale(${interpolate(appear, [0, 1], [0.92, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })})`,
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
  VIDEO_CONFIG.arrayPainScene,
  VIDEO_CONFIG.classSolutionScene,
  VIDEO_CONFIG.flexScene,
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
    narration: CONTENT.arrayPainScene.narration as string[],
    speechStartFrame: getAudioScene("arrayPainScene").speechStartFrame,
    narrationSplits: getAudioScene("arrayPainScene").narrationSplits,
    sentenceEndFrames: getAudioScene("arrayPainScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.arrayPainScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.classSolutionScene.narration as string[],
    speechStartFrame: getAudioScene("classSolutionScene").speechStartFrame,
    narrationSplits: getAudioScene("classSolutionScene").narrationSplits,
    sentenceEndFrames: getAudioScene("classSolutionScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.classSolutionScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.flexScene.narration as string[],
    speechStartFrame: getAudioScene("flexScene").speechStartFrame,
    narrationSplits: getAudioScene("flexScene").narrationSplits,
    sentenceEndFrames: getAudioScene("flexScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.flexScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.comparisonScene.narration as string[],
    speechStartFrame: getAudioScene("comparisonScene").speechStartFrame,
    narrationSplits: getAudioScene("comparisonScene").narrationSplits,
    sentenceEndFrames: getAudioScene("comparisonScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.comparisonScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: CONTENT.summaryScene.narration as string[],
    speechStartFrame: getAudioScene("summaryScene").speechStartFrame,
    narrationSplits: getAudioScene("summaryScene").narrationSplits,
    sentenceEndFrames: getAudioScene("summaryScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
  },
]);

export const SRT_TRACKS: SrtTracks = { "ko-KR": SRT_DATA };

const JavaClassNeed: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.arrayPainScene.durationInFrames}
    >
      <ArrayPainScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.classSolutionScene.durationInFrames}
    >
      <ClassSolutionScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.flexScene.durationInFrames}
    >
      <FlexScene />
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

export const Component = JavaClassNeed;

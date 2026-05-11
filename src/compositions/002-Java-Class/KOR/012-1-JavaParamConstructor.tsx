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
import { CONTENT } from "./012-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./012-3-audio.gen";
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
  wordTiming: {} as Record<string, number[]>,
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
    audio: "ctor2-painScene.mp3",
    durationInFrames: getAudioScene("painScene").durationInFrames,
    speechStartFrame: getAudioScene("painScene").speechStartFrame,
    narration: CONTENT.painScene.narration as string[],
    narrationSplits: getAudioScene("painScene").narrationSplits,
  },
  paramScene: {
    audio: "ctor2-paramScene.mp3",
    durationInFrames: getAudioScene("paramScene").durationInFrames,
    speechStartFrame: getAudioScene("paramScene").speechStartFrame,
    narration: CONTENT.paramScene.narration as string[],
    narrationSplits: getAudioScene("paramScene").narrationSplits,
  },
  thisScene: {
    audio: "ctor2-thisScene.mp3",
    durationInFrames: getAudioScene("thisScene").durationInFrames,
    speechStartFrame: getAudioScene("thisScene").speechStartFrame,
    narration: CONTENT.thisScene.narration as string[],
    narrationSplits: getAudioScene("thisScene").narrationSplits,
  },
  multiScene: {
    audio: "ctor2-multiScene.mp3",
    durationInFrames: getAudioScene("multiScene").durationInFrames,
    speechStartFrame: getAudioScene("multiScene").speechStartFrame,
    narration: CONTENT.multiScene.narration as string[],
    narrationSplits: getAudioScene("multiScene").narrationSplits,
  },
  summaryScene: {
    audio: "ctor2-summaryScene.mp3",
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
  fontSize: 24,
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

  const wordTiming = getAudioScene("painScene").wordStartFrames;
  // "사람이" = 두 번째 문장 첫 단어 = wordTiming[1][0]
  const saramiFrame = wordTiming[1]?.[0] ?? (splits[0] as number) ?? s + 40;

  const card1Appear = spring({
    frame: frame - s,
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const card2Appear = spring({
    frame: frame - saramiFrame,
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });
  const card3Appear = spring({
    frame: frame - (saramiFrame + 12),
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  // "반복하게" 발화 → 초기화 9줄에 밑줄
  const wt = getAudioScene("painScene").wordTiming as
    | Record<string, number[]>
    | undefined;
  const repeatingFrame = wt?.["반복하게"]?.[0] ?? 450;
  const underlineProgress = spring({
    frame: frame - repeatingFrame,
    fps: 30,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const underlineStyle: React.CSSProperties = {
    textDecoration: "underline",
    textDecorationColor: `rgba(244, 124, 124, ${underlineProgress})`,
    textUnderlineOffset: 4,
    textDecorationThickness: 2,
  };

  const personCards = [
    { name: "person1", appear: card1Appear, id: "1", age: "20", height: "170" },
    { name: "person2", appear: card2Appear, id: "2", age: "25", height: "180" },
    { name: "person3", appear: card3Appear, id: "3", age: "30", height: "165" },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 기본 생성자의 한계" />

          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              width: 920,
            }}
          >
            {personCards.map(({ name, appear, id, age, height }) => (
              <div
                key={name}
                style={{
                  ...panelStyle,
                  width: 820,
                  border: `2px solid ${C_PAIN}55`,
                  padding: "14px 36px",
                  opacity: appear,
                  transform: `scale(${interpolate(appear, [0, 1], [0.92, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                <div style={{ ...monoStyle, fontSize: 20, lineHeight: 1.8 }}>
                  <div>
                    <span style={{ color: C_TEAL }}>Person</span>{" "}
                    <span style={{ color: C_VAR }}>{name}</span>
                    <span style={{ color: TEXT }}> = </span>
                    <span style={{ color: C_KEYWORD }}>new</span>{" "}
                    <span style={{ color: C_TEAL }}>Person</span>
                    <span style={{ color: TEXT }}>();</span>
                  </div>
                  <div
                    style={underlineProgress > 0 ? underlineStyle : undefined}
                  >
                    <span style={{ color: C_VAR }}>{name}</span>
                    <span style={{ color: TEXT }}>.id = </span>
                    <span style={{ color: C_NUMBER }}>{id}</span>
                    <span style={{ color: TEXT }}>;</span>
                  </div>
                  <div
                    style={underlineProgress > 0 ? underlineStyle : undefined}
                  >
                    <span style={{ color: C_VAR }}>{name}</span>
                    <span style={{ color: TEXT }}>.age = </span>
                    <span style={{ color: C_NUMBER }}>{age}</span>
                    <span style={{ color: TEXT }}>;</span>
                  </div>
                  <div
                    style={underlineProgress > 0 ? underlineStyle : undefined}
                  >
                    <span style={{ color: C_VAR }}>{name}</span>
                    <span style={{ color: TEXT }}>.height = </span>
                    <span style={{ color: C_NUMBER }}>{height}</span>
                    <span style={{ color: TEXT }}>;</span>
                  </div>
                </div>
              </div>
            ))}
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

const ParamScene: React.FC = () => {
  const { paramScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();

  const constructorAppear = spring({
    frame: frame - s,
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const usageAppear = spring({
    frame: frame - (splits[0] ?? s + 70),
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  // "int id", "int age", "int height" 발화 타이밍에 맞춘 밑줄
  const wt = getAudioScene("paramScene").wordTiming as
    | Record<string, number[]>
    | undefined;
  const intFrames = wt?.["int"] ?? [388, 444, 503];
  // 모든 시그니처 밑줄은 "넣고" 발화 시 소멸
  const sigExitFrame = wt?.["넣고"]?.[0] ?? 585;
  const paramUnderlines = intFrames.map((startFrame) => {
    const appear = spring({
      frame: frame - startFrame,
      fps: 30,
      config: { damping: 14, stiffness: 200 },
      durationInFrames: 18,
    });
    const exit = interpolate(frame, [sigExitFrame - 15, sigExitFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { appear, exit };
  });

  const paramUnderlineStyle = (idx: number): React.CSSProperties => {
    const { appear, exit } = paramUnderlines[idx];
    const opacity = appear * (1 - exit);
    return {
      textDecoration: "underline",
      textDecorationColor: `rgba(78, 201, 176, ${opacity})`,
      textUnderlineOffset: 4,
      textDecorationThickness: 2,
    };
  };

  // "값을 받을 수 있으면 기본값의 제약에서 벗어납니다" → 1, 20, 170 밑줄
  const valuesFrame = wt?.["값을"]?.[1] ?? 741; // 3rd sentence "값을"
  const valuesUnderline = spring({
    frame: frame - valuesFrame,
    fps: 30,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const valuesUnderlineStyle: React.CSSProperties = {
    textDecoration: "underline",
    textDecorationColor: `rgba(78, 201, 176, ${valuesUnderline})`,
    textUnderlineOffset: 4,
    textDecorationThickness: 2,
  };

  // "그 값을 필드에 넣으면 됩니다" → this.xxx = xxx; 줄 밑줄
  const bodyStartFrame = wt?.["그"]?.[0] ?? 621;
  const bodyFieldFrame = wt?.["필드에"]?.[0] ?? 650;
  const bodyEndFrame = wt?.["됩니다"]?.[0] ?? 684;
  const bodyExitFrame = splits[1] ?? 741;

  const bodyUnderlines = [bodyStartFrame, bodyFieldFrame, bodyEndFrame].map(
    (startFrame) => {
      const appear = spring({
        frame: frame - startFrame,
        fps: 30,
        config: { damping: 14, stiffness: 200 },
        durationInFrames: 18,
      });
      const exit = interpolate(
        frame,
        [bodyExitFrame - 15, bodyExitFrame],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      return { appear, exit };
    },
  );

  const bodyUnderlineStyle = (idx: number): React.CSSProperties => {
    const { appear, exit } = bodyUnderlines[idx];
    const opacity = appear * (1 - exit);
    return {
      textDecoration: "underline",
      textDecorationColor: `rgba(78, 201, 176, ${opacity})`,
      textUnderlineOffset: 4,
      textDecorationThickness: 2,
    };
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 매개변수로 값 전달" />

          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              width: 920,
            }}
          >
            <div
              style={{
                ...panelStyle,
                width: 860,
                border: `2px solid ${C_TEAL}55`,
                padding: "28px 40px",
                opacity: constructorAppear,
                transform: `scale(${interpolate(
                  constructorAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
              }}
            >
              <div style={codeBlock}>
                <span style={{ color: C_TEAL }}>Person</span>
                <span style={{ color: TEXT }}>(</span>
                <span style={paramUnderlineStyle(0)}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>id</span>
                </span>
                <span style={{ color: TEXT }}>, </span>
                <span style={paramUnderlineStyle(1)}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>age</span>
                </span>
                <span style={{ color: TEXT }}>, </span>
                <span style={paramUnderlineStyle(2)}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>height</span>
                </span>
                <span style={{ color: TEXT }}>) {"{"}</span>
                <div style={{ paddingLeft: 36, ...bodyUnderlineStyle(0) }}>
                  <span style={{ color: C_KEYWORD }}>this</span>
                  <span style={{ color: TEXT }}>.id = id;</span>
                </div>
                <div style={{ paddingLeft: 36, ...bodyUnderlineStyle(1) }}>
                  <span style={{ color: C_KEYWORD }}>this</span>
                  <span style={{ color: TEXT }}>.age = age;</span>
                </div>
                <div style={{ paddingLeft: 36, ...bodyUnderlineStyle(2) }}>
                  <span style={{ color: C_KEYWORD }}>this</span>
                  <span style={{ color: TEXT }}>.height = height;</span>
                </div>
                <span style={{ color: TEXT }}>{"}"}</span>
              </div>
            </div>

            {/* 사용 예시 + 결과 주석 */}
            <div
              style={{
                ...panelStyle,
                width: 860,
                border: `2px solid ${C_TEAL}44`,
                padding: "24px 36px",
                opacity: usageAppear,
                transform: `scale(${interpolate(
                  usageAppear,
                  [0, 1],
                  [0.92, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
              }}
            >
              <div style={{ ...monoStyle, fontSize: 24, lineHeight: 2 }}>
                <div>
                  <span style={{ color: C_TEAL }}>Person</span>{" "}
                  <span style={{ color: C_VAR }}>p</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_KEYWORD }}>new</span>{" "}
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}>(</span>
                  <span
                    style={
                      valuesUnderline > 0 ? valuesUnderlineStyle : undefined
                    }
                  >
                    <span style={{ color: C_NUMBER }}>1</span>
                    <span style={{ color: TEXT }}>, </span>
                    <span style={{ color: C_NUMBER }}>20</span>
                    <span style={{ color: TEXT }}>, </span>
                    <span style={{ color: C_NUMBER }}>170</span>
                  </span>
                  <span style={{ color: TEXT }}>);</span>
                </div>
                <div>
                  <span style={{ color: C_COMMENT }}>// p.id == 1</span>
                </div>
                <div>
                  <span style={{ color: C_COMMENT }}>// p.age == 20</span>
                </div>
                <div>
                  <span style={{ color: C_COMMENT }}>// p.height == 170</span>
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
        wordFrames={getAudioScene("paramScene").wordStartFrames}
      />
    </>
  );
};

const ThisScene: React.FC = () => {
  const { thisScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const conflictAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const thisAppear = spring({
    frame: frame - (splits[0] ?? s + 60),
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const arrowGlow = interpolate(thisAppear, [0, 0.2, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. this로 구분하기" />

          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              width: 920,
            }}
          >
            <div
              style={{
                ...panelStyle,
                width: 760,
                border: `2px solid ${C_PAIN}44`,
                padding: "28px 40px",
                opacity: conflictAppear,
                transform: `scale(${interpolate(
                  conflictAppear,
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
                  fontSize: 20,
                  fontWeight: 800,
                  color: C_PAIN,
                  marginBottom: 12,
                }}
              >
                이름이 같으면?
              </div>
              <div style={codeBlock}>
                <span style={{ color: C_TEAL }}>Person</span>
                <span style={{ color: TEXT }}>(</span>
                <span style={{ color: C_TYPE }}>int</span>{" "}
                <span style={{ color: C_VAR }}>id</span>
                <span style={{ color: TEXT }}>) {"{"}</span>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: C_COMMENT }}>; // 모호함</span>
                </div>
                <span style={{ color: TEXT }}>{"}"}</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: thisAppear,
              }}
            >
              <div
                style={{
                  ...panelStyle,
                  width: 360,
                  border: `2px solid ${C_TEAL}55`,
                  padding: "20px 24px",
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 20,
                    fontWeight: 800,
                    color: C_TEAL,
                    marginBottom: 8,
                  }}
                >
                  this.id
                </div>
                <div style={{ ...monoStyle, fontSize: 28 }}>
                  <span style={{ color: C_KEYWORD }}>this</span>
                  <span style={{ color: TEXT }}>.id = id</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 40,
                  color: C_TEAL,
                  fontWeight: 800,
                  opacity: arrowGlow,
                  textShadow:
                    thisAppear > 0.25 ? `0 0 12px ${C_TEAL}66` : "none",
                }}
              >
                →
              </div>
              <div
                style={{
                  ...panelStyle,
                  width: 360,
                  border: `2px solid ${C_KEYWORD}55`,
                  padding: "20px 24px",
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 20,
                    fontWeight: 800,
                    color: C_KEYWORD,
                    marginBottom: 8,
                  }}
                >
                  매개변수 id
                </div>
                <div style={{ ...monoStyle, fontSize: 28, color: C_VAR }}>
                  id
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: uiFont,
                fontSize: 22,
                color: C_DIM,
                opacity: thisAppear,
              }}
            >
              this는 필드를, 같은 이름의 지역 변수는 매개변수로 해석됩니다.
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("thisScene").wordStartFrames}
      />
    </>
  );
};

const MultiScene: React.FC = () => {
  const { multiScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();

  const firstAppear = spring({
    frame: frame - s,
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const secondAppear = spring({
    frame: frame - (splits[0] ?? s + 60),
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const creators = [
    {
      name: "p1",
      args: "1, 20, 170",
      detail: [
        { field: "p1.id", value: "1" },
        { field: "p1.age", value: "20" },
        { field: "p1.height", value: "170" },
      ],
      color: C_TEAL,
      appear: firstAppear,
    },
    {
      name: "p2",
      args: "2, 25, 175",
      detail: [
        { field: "p2.id", value: "2" },
        { field: "p2.age", value: "25" },
        { field: "p2.height", value: "175" },
      ],
      color: C_KEYWORD,
      appear: secondAppear,
    },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 여러 필드 초기화" />

          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              width: 920,
            }}
          >
            {creators.map((creator, i) => (
              <div
                key={`creator-${i}`}
                style={{
                  ...panelStyle,
                  width: 880,
                  border: `2px solid ${creator.color}55`,
                  padding: "24px 32px",
                  opacity: creator.appear,
                  transform: `scale(${interpolate(
                    creator.appear,
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
                    ...monoStyle,
                    fontSize: 24,
                    lineHeight: 1.8,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ color: C_TEAL }}>Person</span>{" "}
                  <span style={{ color: C_VAR }}>{creator.name}</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_KEYWORD }}>new</span>{" "}
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}>(</span>
                  <span style={{ color: C_NUMBER }}>{creator.args}</span>
                  <span style={{ color: TEXT }}>);</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {creator.detail.map((item) => (
                    <div
                      key={`${creator.name}-${item.field}`}
                      style={{
                        background: `${BG}88`,
                        borderRadius: 10,
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{ ...monoStyle, fontSize: 20, color: C_TEAL }}
                      >
                        {item.field}
                      </span>
                      <span
                        style={{ ...monoStyle, fontSize: 20, color: C_DIM }}
                      >
                        →
                      </span>
                      <span
                        style={{ ...monoStyle, fontSize: 20, color: C_NUMBER }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("multiScene").wordStartFrames}
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

  const points = [
    {
      text: "기본 생성자보다 매개변수 생성자가\n서로 다른 객체를 만든다",
      color: C_TEAL,
    },
    {
      text: "this는 필드와 매개변수를\n정확히 구분하는 표식이다",
      color: C_KEYWORD,
    },
  ];

  const lineAppears = points.map((_, i) =>
    spring({
      frame: frame - (splits[i] ?? s),
      fps: 30,
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
  VIDEO_CONFIG.painScene,
  VIDEO_CONFIG.paramScene,
  VIDEO_CONFIG.thisScene,
  VIDEO_CONFIG.multiScene,
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
    narration: CONTENT.paramScene.narration as string[],
    speechStartFrame: getAudioScene("paramScene").speechStartFrame,
    narrationSplits: getAudioScene("paramScene").narrationSplits,
    sentenceEndFrames: getAudioScene("paramScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.paramScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.thisScene.narration as string[],
    speechStartFrame: getAudioScene("thisScene").speechStartFrame,
    narrationSplits: getAudioScene("thisScene").narrationSplits,
    sentenceEndFrames: getAudioScene("thisScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.thisScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.multiScene.narration as string[],
    speechStartFrame: getAudioScene("multiScene").speechStartFrame,
    narrationSplits: getAudioScene("multiScene").narrationSplits,
    sentenceEndFrames: getAudioScene("multiScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.multiScene.durationInFrames,
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

const JavaParamConstructor: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.paramScene.durationInFrames}
    >
      <ParamScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.thisScene.durationInFrames}
    >
      <ThisScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.multiScene.durationInFrames}
    >
      <MultiScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaParamConstructor;

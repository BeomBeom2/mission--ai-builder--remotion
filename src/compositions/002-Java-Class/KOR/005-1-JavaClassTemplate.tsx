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
import { CONTENT } from "./005-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./005-3-audio.gen";
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
    audio: "cls-painScene.mp3",
    durationInFrames: getAudioScene("painScene").durationInFrames,
    speechStartFrame: getAudioScene("painScene").speechStartFrame,
    narration: CONTENT.painScene.narration as string[],
    narrationSplits: getAudioScene("painScene").narrationSplits,
  },
  analogyScene: {
    audio: "cls-analogyScene.mp3",
    durationInFrames: getAudioScene("analogyScene").durationInFrames,
    speechStartFrame: getAudioScene("analogyScene").speechStartFrame,
    narration: CONTENT.analogyScene.narration as string[],
    narrationSplits: getAudioScene("analogyScene").narrationSplits,
  },
  arrayScene: {
    audio: "cls-arrayScene.mp3",
    durationInFrames: getAudioScene("arrayScene").durationInFrames,
    speechStartFrame: getAudioScene("arrayScene").speechStartFrame,
    narration: CONTENT.arrayScene.narration as string[],
    narrationSplits: getAudioScene("arrayScene").narrationSplits,
  },
  limitScene: {
    audio: "cls-limitScene.mp3",
    durationInFrames: getAudioScene("limitScene").durationInFrames,
    speechStartFrame: getAudioScene("limitScene").speechStartFrame,
    narration: CONTENT.limitScene.narration as string[],
    narrationSplits: getAudioScene("limitScene").narrationSplits,
  },
  summaryScene: {
    audio: "cls-summaryScene.mp3",
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

const MoldCard: React.FC<{
  title?: string;
  color: string;
  width?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, color, width, children, style }) => (
  <div
    style={{
      ...panelStyle,
      width,
      border: `2px solid ${color}55`,
      boxShadow: `0 0 28px ${color}20`,
      ...style,
    }}
  >
    {title ? (
      <div
        style={{
          position: "absolute",
          top: -26,
          left: 18,
          padding: "6px 14px",
          borderRadius: 999,
          background: BG,
          border: `1px solid ${color}44`,
          fontFamily: uiFont,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 2,
          color,
        }}
      >
        {title}
      </div>
    ) : null}
    {children}
  </div>
);

/* ─── SVG Icons ─── */

const STAR_COOKIE_PATH =
  "M80 8L98 56H150L108 88L124 140L80 110L36 140L52 88L10 56H62L80 8Z";

type CookieFlavor =
  | "cinnamon"
  | "strawberry"
  | "choco"
  | "vanilla"
  | "blueberry"
  | "matcha";

const COOKIE_PALETTES: Record<
  CookieFlavor,
  { fill: string; stroke: string; chip: string; shine: string }
> = {
  cinnamon: {
    fill: "#c4783a",
    stroke: "#9b5a28",
    chip: "#7a421a",
    shine: "#e8a86d",
  },
  strawberry: {
    fill: "#ffb7c9",
    stroke: "#e67f98",
    chip: "#d84d68",
    shine: "#fff4f8",
  },
  choco: {
    fill: "#6b4326",
    stroke: "#4b2b15",
    chip: "#32190f",
    shine: "#a57854",
  },
  vanilla: {
    fill: "#f5e6b8",
    stroke: "#d4c48a",
    chip: "#c4a44a",
    shine: "#fdf6e3",
  },
  blueberry: {
    fill: "#8b9fd6",
    stroke: "#6474b0",
    chip: "#3f4f8a",
    shine: "#c8d4f0",
  },
  matcha: {
    fill: "#8cb87a",
    stroke: "#5f8a50",
    chip: "#3d6630",
    shine: "#c8e6b8",
  },
};

const StarCookieIcon: React.FC<{
  size?: number;
  flavor?: CookieFlavor;
}> = ({ size = 112, flavor = "cinnamon" }) => {
  const palette = COOKIE_PALETTES[flavor];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <path
        d={STAR_COOKIE_PATH}
        fill={palette.fill}
        stroke={palette.stroke}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="56" cy="68" r="4.6" fill={palette.chip} />
      <circle cx="88" cy="60" r="4" fill={palette.chip} />
      <circle cx="109" cy="84" r="4.2" fill={palette.chip} />
      <circle cx="72" cy="100" r="4" fill={palette.chip} />
      <circle cx="95" cy="115" r="3.4" fill={palette.chip} />
      <ellipse
        cx="93"
        cy="48"
        rx="16"
        ry="7"
        fill={palette.shine}
        opacity="0.28"
      />
    </svg>
  );
};

const DoughBlob: React.FC<{ opacity: number; frame: number }> = ({
  opacity,
  frame,
}) => {
  const wobble = interpolate(frame, [0, 8, 20], [0, -2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stretch = interpolate(frame, [0, 12, 24], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: 84,
        height: 28,
        opacity,
        transform: `translateY(${wobble}px) scale(${stretch})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 4,
          bottom: 0,
          borderRadius: "999px",
          background:
            "linear-gradient(90deg, #f8d7a8 0%, #efc37f 40%, #ecd2a9 80%, #e0b279 100%)",
          boxShadow: "inset 0 -2px 4px #be8d56aa, 0 4px 10px #d6a56b55",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 24,
          height: 24,
          borderRadius: "50%",
          left: 6,
          top: 0,
          background: "#f7ddba",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 26,
          height: 26,
          borderRadius: "50%",
          left: 28,
          top: -2,
          background: "#f7ddba",
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 22,
          height: 22,
          borderRadius: "50%",
          right: 8,
          top: 1,
          background: "#edd0a7",
          opacity: 0.68,
        }}
      />
    </div>
  );
};

const CookieCutterIcon: React.FC<{ size?: number }> = ({ size = 132 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 148"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: "visible" }}
  >
    <path
      d={STAR_COOKIE_PATH}
      stroke="#d7e3ff"
      strokeWidth="10"
      strokeLinejoin="round"
    />
    <path
      d={STAR_COOKIE_PATH}
      stroke="#8aa4d8"
      strokeWidth="2"
      strokeLinejoin="round"
      opacity="0.65"
    />
  </svg>
);

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

  const cookies: { label: string; flavor: CookieFlavor }[] = [
    { label: "시나몬", flavor: "cinnamon" },
    { label: "딸기", flavor: "strawberry" },
    { label: "초코", flavor: "choco" },
    { label: "바닐라", flavor: "vanilla" },
    { label: "블루베리", flavor: "blueberry" },
    { label: "말차", flavor: "matcha" },
  ];

  const tiredAppear = spring({
    frame: frame - (splits[0] ?? s + 30),
    fps,
    config: { damping: 13, stiffness: 140 },
    durationInFrames: 24,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 손으로 만들기" />

          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 20,
              width: 700,
            }}
          >
            {cookies.map(({ label, flavor }, index) => {
              const appear = spring({
                frame: frame - s - index * 6,
                fps,
                config: { damping: 13, stiffness: 140 },
                durationInFrames: 22,
              });
              return (
                <div
                  key={`pain-${index}`}
                  style={{
                    ...panelStyle,
                    width: 200,
                    border: `2px solid ${C_PAIN}44`,
                    opacity: appear,
                    transform: `translateY(${interpolate(
                      appear,
                      [0, 1],
                      [20, 0],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      },
                    )}px)`,
                    padding: "20px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 36, lineHeight: 1 }}>🖐️</div>
                  <DoughBlob opacity={appear} frame={frame - s - index * 6} />
                  <StarCookieIcon size={72} flavor={flavor} />
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 18,
                      fontWeight: 800,
                      color: C_DIM,
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: "absolute",
              top: "72%",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 900,
              color: C_PAIN,
              textAlign: "center",
              lineHeight: 1.4,
              opacity: tiredAppear,
            }}
          >
            6개를 손으로 만들려면
            <br />
            정말 힘듭니다…
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

const AnalogyScene: React.FC = () => {
  const { analogyScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const moldAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const wordTiming = getAudioScene("analogyScene")
    .wordTiming as unknown as Record<string, number[]>;
  const sameShapeStart =
    wordTiming["같은"]?.[0] ?? wordTiming["모양의"]?.[0] ?? splits[0] ?? s + 40;
  const cookiesAppear = spring({
    frame: frame - sameShapeStart,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  // "쿠키 틀 = class / 쿠키 = object" labels appear at 2nd sentence
  const labelsStart = splits[0] ?? s + 80;
  const labelsAppear = spring({
    frame: frame - labelsStart,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 쿠키 틀 = 클래스" />

          {/* Mold (left) + Arrow + Cookies (right) — vertical layout for portrait */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
            }}
          >
            {/* Cookie Cutter */}
            <div
              style={{
                ...panelStyle,
                width: 340,
                border: `2px solid ${C_TEAL}66`,
                opacity: moldAppear,
                transform: `scale(${interpolate(moldAppear, [0, 1], [0.9, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: "28px 30px 22px",
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 900,
                  color: C_TEAL,
                }}
              >
                쿠키 틀
              </div>
              <CookieCutterIcon size={138} />
            </div>

            {/* Arrow */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 50,
                fontWeight: 700,
                lineHeight: 1,
                color: C_TEAL,
                opacity: moldAppear,
              }}
            >
              ↓
            </div>

            {/* Cookies row */}
            <div
              style={{
                display: "flex",
                gap: 24,
                opacity: cookiesAppear,
                transform: `scale(${interpolate(
                  cookiesAppear,
                  [0, 1],
                  [0.88, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
              }}
            >
              {[
                { label: "시나몬", flavor: "cinnamon" as const },
                { label: "딸기", flavor: "strawberry" as const },
                { label: "초코", flavor: "choco" as const },
              ].map(({ label, flavor }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <StarCookieIcon size={100} flavor={flavor} />
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 20,
                      fontWeight: 800,
                      color: TEXT,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Labels — appear at 2nd sentence */}
            <div
              style={{
                display: "flex",
                gap: 40,
                marginTop: 20,
                opacity: labelsAppear,
                transform: `scale(${interpolate(
                  labelsAppear,
                  [0, 1],
                  [0.85, 1],
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
                  fontSize: FONT.heading,
                  fontWeight: 900,
                  color: C_TEAL,
                }}
              >
                쿠키 틀 = class
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  fontWeight: 900,
                  color: C_VAR,
                }}
              >
                쿠키 = object
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("analogyScene").wordStartFrames}
      />
    </>
  );
};

const ArrayScene: React.FC = () => {
  const { arrayScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const moldAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const instancesAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  const intSlot = (label: string, index: number) => (
    <div
      key={`${label}-${index}`}
      style={{
        width: 100,
        height: 74,
        borderRadius: 14,
        border: `2px solid ${C_TEAL}66`,
        background: `${C_TEAL}10`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...monoStyle,
        fontSize: FONT.label,
        color: C_TYPE,
      }}
    >
      {label}
    </div>
  );

  const arrayInstance = (name: string, values: string[], delay: number) => {
    const appear = spring({
      frame: frame - (splits[0] ?? s + 40) - delay,
      fps,
      config: { damping: 13, stiffness: 140 },
      durationInFrames: 22,
    });
    return (
      <div
        key={name}
        style={{
          ...panelStyle,
          width: 400,
          border: `2px solid ${C_VAR}44`,
          opacity: appear,
          transform: `scale(${interpolate(appear, [0, 1], [0.88, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: uiFont,
            fontSize: 22,
            fontWeight: 900,
            color: C_VAR,
          }}
        >
          {name}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {values.map((v, i) => (
            <div
              key={`${name}-v-${i}`}
              style={{
                width: 80,
                height: 64,
                borderRadius: 12,
                background: BG_CODE,
                border: `2px solid ${C_VAR}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...monoStyle,
                fontSize: FONT.label,
                color: C_NUMBER,
              }}
            >
              {v}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. int[3]도 일종의 틀" />

          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}
          >
            {/* Mold: int[3] */}
            <MoldCard
              title="틀 (MOLD)"
              color={C_TEAL}
              width={460}
              style={{
                opacity: moldAppear,
                transform: `scale(${interpolate(moldAppear, [0, 1], [0.9, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 38,
                    fontWeight: 900,
                    color: TEXT,
                    background: BG_CODE,
                    border: `2px solid ${C_TEAL}55`,
                    borderRadius: 16,
                    padding: "12px 22px",
                  }}
                >
                  <span style={{ color: C_TYPE }}>int</span>[3]
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[0, 1, 2].map((i) => intSlot("int", i))}
                </div>
              </div>
            </MoldCard>

            {/* Arrow */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.title,
                fontWeight: 700,
                color: C_TEAL,
                opacity: instancesAppear,
              }}
            >
              ↓ 찍어내기
            </div>

            {/* Instances */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                alignItems: "center",
              }}
            >
              {arrayInstance("scores", ["90", "85", "70"], 0)}
              {arrayInstance("ages", ["20", "25", "30"], 10)}
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("arrayScene").wordStartFrames}
      />
    </>
  );
};

const LimitScene: React.FC = () => {
  const { limitScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slotsAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const stringXAppear = spring({
    frame: frame - (splits[0] ?? s + 40),
    fps,
    config: { damping: 13, stiffness: 140 },
    durationInFrames: 22,
  });
  const solutionAppear = spring({
    frame: frame - (splits[1] ?? s + 80),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 배열의 한계" />

          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
              width: 900,
            }}
          >
            {/* Array slots */}
            <MoldCard
              title="int[3] 배열"
              color={C_PAIN}
              width={680}
              style={{
                opacity: slotsAppear,
                transform: `scale(${interpolate(
                  slotsAppear,
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                }}
              >
                {["int", "int"].map((t, i) => (
                  <div
                    key={`slot-${i}`}
                    style={{
                      width: 112,
                      height: 88,
                      borderRadius: 18,
                      border: `2px solid ${C_PAIN}55`,
                      background: `${C_PAIN}10`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...monoStyle,
                      fontSize: 28,
                      color: C_NUMBER,
                    }}
                  >
                    {t}
                  </div>
                ))}

                {/* String slot with X */}
                <div
                  style={{
                    position: "relative",
                    width: 140,
                    height: 88,
                    borderRadius: 18,
                    border: `2px dashed ${C_PAIN}55`,
                    background: `${C_PAIN}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...monoStyle,
                    fontSize: 28,
                    color: C_COMMENT,
                    opacity: stringXAppear,
                  }}
                >
                  String
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -56%)",
                      fontFamily: uiFont,
                      fontSize: 48,
                      fontWeight: 900,
                      color: C_PAIN,
                      lineHeight: 1,
                      pointerEvents: "none",
                      opacity: stringXAppear,
                    }}
                  >
                    ×
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 800,
                  color: C_PAIN,
                  textAlign: "center",
                  marginTop: 20,
                  opacity: stringXAppear,
                }}
              >
                int 배열은 int만 담을 수 있다
              </div>
            </MoldCard>

            {/* Solution: class */}
            <MoldCard
              color={C_TEAL}
              width={680}
              style={{
                opacity: solutionAppear,
                transform: `scale(${interpolate(
                  solutionAppear,
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
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.heading,
                    fontWeight: 900,
                    color: C_TEAL,
                    textAlign: "center",
                    lineHeight: 1.45,
                  }}
                >
                  이 문제를 해결하는 것이
                  <br />
                  바로 <span style={{ color: C_KEYWORD }}>class</span>입니다.
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  {["int", "String", "double"].map((t) => (
                    <div
                      key={t}
                      style={{
                        width: 120,
                        height: 74,
                        borderRadius: 14,
                        border: `2px solid ${C_TEAL}66`,
                        background: `${C_TEAL}10`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...monoStyle,
                        fontSize: FONT.label,
                        color: C_TEAL,
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 22,
                    fontWeight: 800,
                    color: C_DIM,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  자유롭게 구성 가능
                </div>
              </div>
            </MoldCard>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("limitScene").wordStartFrames}
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
    { text: "클래스는 객체를 만드는 틀입니다.", color: C_TEAL },
    {
      text: "틀이 있으면 비슷한 객체를 쉽게 여러 개 만들 수 있습니다.",
      color: C_VAR,
    },
    {
      text: "int 배열도 일종의 틀이지만, 구성요소를 자유롭게 정할 수 없습니다.",
      color: C_PAIN,
    },
    {
      text: "class를 사용하면 객체의 구성을 마음대로 정할 수 있습니다.",
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
                    padding: "28px 48px",
                    border: `2px solid ${point.color}44`,
                    borderRadius: 16,
                    whiteSpace: "nowrap",
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
  VIDEO_CONFIG.analogyScene,
  VIDEO_CONFIG.arrayScene,
  VIDEO_CONFIG.limitScene,
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
    narration: CONTENT.analogyScene.narration as string[],
    speechStartFrame: getAudioScene("analogyScene").speechStartFrame,
    narrationSplits: getAudioScene("analogyScene").narrationSplits,
    sentenceEndFrames: getAudioScene("analogyScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.analogyScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.arrayScene.narration as string[],
    speechStartFrame: getAudioScene("arrayScene").speechStartFrame,
    narrationSplits: getAudioScene("arrayScene").narrationSplits,
    sentenceEndFrames: getAudioScene("arrayScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.arrayScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.limitScene.narration as string[],
    speechStartFrame: getAudioScene("limitScene").speechStartFrame,
    narrationSplits: getAudioScene("limitScene").narrationSplits,
    sentenceEndFrames: getAudioScene("limitScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.limitScene.durationInFrames,
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

const JavaClassTemplate: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.analogyScene.durationInFrames}
    >
      <AnalogyScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.arrayScene.durationInFrames}
    >
      <ArrayScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.limitScene.durationInFrames}
    >
      <LimitScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaClassTemplate;

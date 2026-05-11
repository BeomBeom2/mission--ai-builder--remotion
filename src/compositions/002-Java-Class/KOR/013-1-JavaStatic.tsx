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
import { CONTENT } from "./013-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./013-3-audio.gen";
import {
  BG,
  BG_CODE,
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
    audio: "st-painScene.mp3",
    durationInFrames: getAudioScene("painScene").durationInFrames,
    speechStartFrame: getAudioScene("painScene").speechStartFrame,
    narration: CONTENT.painScene.narration as string[],
    narrationSplits: getAudioScene("painScene").narrationSplits,
  },
  introScene: {
    audio: "st-introScene.mp3",
    durationInFrames: getAudioScene("introScene").durationInFrames,
    speechStartFrame: getAudioScene("introScene").speechStartFrame,
    narration: CONTENT.introScene.narration as string[],
    narrationSplits: getAudioScene("introScene").narrationSplits,
  },
  staticFieldScene: {
    audio: "st-staticFieldScene.mp3",
    durationInFrames: getAudioScene("staticFieldScene").durationInFrames,
    speechStartFrame: getAudioScene("staticFieldScene").speechStartFrame,
    narration: CONTENT.staticFieldScene.narration as string[],
    narrationSplits: getAudioScene("staticFieldScene").narrationSplits,
  },
  summaryScene: {
    audio: "st-summaryScene.mp3",
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

/* PainScene: 인스턴스 필드로 count를 각자 갖는 방식의 한계 */
const PainScene: React.FC = () => {
  const { painScene: cfg } = VIDEO_CONFIG;
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

  // 두 번째 문장 시작 프레임에 3개 객체 카드 등장
  const cardsStart = (splits[0] as number) ?? s + 80;
  const cardAppears = [0, 1, 2].map((i) =>
    spring({
      frame: frame - (cardsStart + i * 10),
      fps,
      config: { damping: 12, stiffness: 130 },
      durationInFrames: 24,
    }),
  );

  // "알 수 없습니다" 발화 근처에서 물음표 강조
  const wt = getAudioScene("painScene").wordTiming as
    | Record<string, number[]>
    | undefined;
  const questionFrame = wt?.["없습니다"]?.[0] ?? cardsStart + 80;
  const questionAppear = spring({
    frame: frame - questionFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 20,
  });

  const cards = [
    { name: "p1", count: "0" },
    { name: "p2", count: "0" },
    { name: "p3", count: "0" },
  ];

  // 객체 생성 코드는 클래스 정의 직후, 카드보다 조금 일찍 등장
  const usageAppear = spring({
    frame: frame - (s + 20),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 인스턴스 필드로 count?" />

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
            {/* 클래스 정의 코드 */}
            <div
              style={{
                ...panelStyle,
                width: 820,
                border: `2px solid ${C_PAIN}55`,
                padding: "24px 36px",
                opacity: classAppear,
                transform: `scale(${interpolate(classAppear, [0, 1], [0.92, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              <div style={codeBlock}>
                <span style={{ color: C_KEYWORD }}>class</span>{" "}
                <span style={{ color: C_TEAL }}>Person</span>{" "}
                <span style={{ color: TEXT }}>{"{"}</span>
                <div style={{ paddingLeft: 36 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>count</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_NUMBER }}>0</span>
                  <span style={{ color: TEXT }}>;</span>{" "}
                  <span style={{ color: C_COMMENT }}>// 각 객체마다 따로</span>
                </div>
                <span style={{ color: TEXT }}>{"}"}</span>
              </div>
            </div>

            {/* 객체 생성 코드 */}
            <div
              style={{
                ...panelStyle,
                width: 820,
                border: `2px solid ${C_TEAL}44`,
                padding: "20px 36px",
                opacity: usageAppear,
                transform: `scale(${interpolate(usageAppear, [0, 1], [0.94, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              <div style={{ ...monoStyle, fontSize: 22, lineHeight: 1.8 }}>
                {["p1", "p2", "p3"].map((name) => (
                  <div key={name}>
                    <span style={{ color: C_TEAL }}>Person</span>{" "}
                    <span style={{ color: C_VAR }}>{name}</span>
                    <span style={{ color: TEXT }}> = </span>
                    <span style={{ color: C_KEYWORD }}>new</span>{" "}
                    <span style={{ color: C_TEAL }}>Person</span>
                    <span style={{ color: TEXT }}>();</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3개 객체 카드 */}
            <div
              style={{
                display: "flex",
                gap: 20,
                justifyContent: "center",
              }}
            >
              {cards.map((c, i) => {
                const appear = cardAppears[i];
                return (
                  <div
                    key={c.name}
                    style={{
                      ...panelStyle,
                      width: 220,
                      border: `2px solid ${C_PAIN}55`,
                      padding: "20px 24px",
                      opacity: appear,
                      transform: `scale(${interpolate(appear, [0, 1], [0.9, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })})`,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: uiFont,
                        fontSize: FONT.label,
                        fontWeight: 800,
                        color: C_TEAL,
                        marginBottom: 10,
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ ...monoStyle, fontSize: 24 }}>
                      <span style={{ color: C_VAR }}>count</span>
                      <span style={{ color: TEXT }}> = </span>
                      <span style={{ color: C_NUMBER }}>{c.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 물음표 강조 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                color: C_PAIN,
                opacity: questionAppear,
                transform: `scale(${interpolate(
                  questionAppear,
                  [0, 1],
                  [0.9, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )})`,
                textShadow:
                  questionAppear > 0.3 ? `0 0 16px ${C_PAIN}66` : "none",
              }}
            >
              전체 몇 명?
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

/* IntroScene: static 키워드 소개 */
const IntroScene: React.FC = () => {
  const { introScene: cfg } = VIDEO_CONFIG;
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

  // "static" 발화 타이밍
  const wt = getAudioScene("introScene").wordTiming as
    | Record<string, number[]>
    | undefined;
  const staticFrame = wt?.["static"]?.[0] ?? s + 4;
  const staticHighlight = spring({
    frame: frame - staticFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const staticUnderlineStyle: React.CSSProperties = {
    textDecoration: "underline",
    textDecorationColor: `rgba(78, 201, 176, ${staticHighlight})`,
    textUnderlineOffset: 6,
    textDecorationThickness: 3,
  };
  const staticGlow =
    0.4 + 0.6 * Math.abs(Math.sin(((frame - staticFrame) * Math.PI) / 60));

  // 두 번째 문장에서 보조 문구 등장
  const hintFrame = (splits[0] as number) ?? s + 80;
  const hintAppear = spring({
    frame: frame - hintFrame,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. static 키워드" />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              width: 920,
            }}
          >
            <div
              style={{
                ...panelStyle,
                width: 820,
                border: `2px solid ${C_TEAL}55`,
                padding: "40px 48px",
                opacity: codeAppear,
                transform: `scale(${interpolate(codeAppear, [0, 1], [0.9, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...monoStyle,
                  fontSize: 44,
                  lineHeight: 1.4,
                }}
              >
                <span
                  style={{
                    color: C_KEYWORD,
                    textShadow:
                      staticHighlight > 0
                        ? `0 0 ${12 * staticGlow}px ${C_KEYWORD}aa`
                        : "none",
                    ...(staticHighlight > 0 ? staticUnderlineStyle : {}),
                  }}
                >
                  static
                </span>{" "}
                <span style={{ color: C_TYPE }}>int</span>{" "}
                <span style={{ color: C_VAR }}>count</span>
                <span style={{ color: TEXT }}>;</span>
              </div>
            </div>

            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                color: TEXT,
                textAlign: "center",
                opacity: hintAppear,
                transform: `scale(${interpolate(hintAppear, [0, 1], [0.95, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              클래스 영역에{" "}
              <span style={{ color: C_TEAL }}>단 하나</span>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("introScene").wordStartFrames}
      />
    </>
  );
};

/* StaticFieldScene: 메모리 다이어그램 (클래스 영역 vs 힙) */
const StaticFieldScene: React.FC = () => {
  const { staticFieldScene: cfg } = VIDEO_CONFIG;
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

  // 두 번째 문장: 메모리 다이어그램으로 초점 이동
  const diagramStart = (splits[0] as number) ?? s + 120;
  const staticBoxAppear = spring({
    frame: frame - diagramStart,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const heapBoxAppear = spring({
    frame: frame - (diagramStart + 6),
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  // 인스턴스 3개가 순차 등장
  const instanceAppears = [0, 1, 2].map((i) =>
    spring({
      frame: frame - (diagramStart + 20 + i * 14),
      fps,
      config: { damping: 12, stiffness: 130 },
      durationInFrames: 20,
    }),
  );

  // 각 인스턴스 등장 시 count 값이 1씩 증가 (1 → 2 → 3)
  const countValue = instanceAppears.reduce(
    (acc, a) => acc + (a > 0.6 ? 1 : 0),
    0,
  );

  const instances = [
    { name: "#1", id: "1", age: "20" },
    { name: "#2", id: "2", age: "25" },
    { name: "#3", id: "3", age: "30" },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 클래스 영역 vs 힙" />

          <div
            style={{
              position: "absolute",
              top: "13%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              width: 980,
            }}
          >
            {/* 코드 블록 */}
            <div
              style={{
                ...panelStyle,
                width: 880,
                border: `2px solid ${C_TEAL}55`,
                padding: "22px 32px",
                opacity: codeAppear,
                transform: `scale(${interpolate(codeAppear, [0, 1], [0.94, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              <div style={{ ...monoStyle, fontSize: 22, lineHeight: 1.7 }}>
                <div>
                  <span style={{ color: C_KEYWORD }}>class</span>{" "}
                  <span style={{ color: C_TEAL }}>Person</span>{" "}
                  <span style={{ color: TEXT }}>{"{"}</span>
                </div>
                <div style={{ paddingLeft: 28 }}>
                  <span style={{ color: C_KEYWORD }}>static</span>{" "}
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>count</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_NUMBER }}>0</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 28 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 28 }}>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>age</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 28 }}>
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}>(</span>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: TEXT }}>, </span>
                  <span style={{ color: C_TYPE }}>int</span>{" "}
                  <span style={{ color: C_VAR }}>age</span>
                  <span style={{ color: TEXT }}>) {"{"}</span>
                </div>
                <div style={{ paddingLeft: 56 }}>
                  <span style={{ color: C_KEYWORD }}>this</span>
                  <span style={{ color: TEXT }}>.</span>
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_VAR }}>id</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 56 }}>
                  <span style={{ color: C_KEYWORD }}>this</span>
                  <span style={{ color: TEXT }}>.</span>
                  <span style={{ color: C_VAR }}>age</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_VAR }}>age</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 56 }}>
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}>.</span>
                  <span style={{ color: C_VAR }}>count</span>
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_TEAL }}>Person</span>
                  <span style={{ color: TEXT }}>.</span>
                  <span style={{ color: C_VAR }}>count</span>
                  <span style={{ color: TEXT }}> + </span>
                  <span style={{ color: C_NUMBER }}>1</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                <div style={{ paddingLeft: 28 }}>
                  <span style={{ color: TEXT }}>{"}"}</span>
                </div>
                <span style={{ color: TEXT }}>{"}"}</span>
              </div>
            </div>

            {/* 메모리 다이어그램: 2 컬럼 */}
            <div
              style={{
                display: "flex",
                gap: 24,
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {/* 클래스 영역 */}
              <div
                style={{
                  ...panelStyle,
                  width: 380,
                  minHeight: 260,
                  border: `2px solid ${C_KEYWORD}66`,
                  padding: "32px 24px 24px",
                  opacity: staticBoxAppear,
                  transform: `scale(${interpolate(
                    staticBoxAppear,
                    [0, 1],
                    [0.92, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  )})`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: 20,
                    background: BG,
                    padding: "2px 12px",
                    fontFamily: uiFont,
                    fontSize: 20,
                    fontWeight: 800,
                    color: C_KEYWORD,
                    letterSpacing: 1,
                  }}
                >
                  클래스 영역 (Static)
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      ...monoStyle,
                      fontSize: 32,
                      fontWeight: 800,
                      color: TEXT,
                      padding: "18px 24px",
                      background: `${C_KEYWORD}18`,
                      border: `2px solid ${C_KEYWORD}66`,
                      borderRadius: 12,
                      textShadow: `0 0 12px ${C_KEYWORD}55`,
                    }}
                  >
                    <span style={{ color: C_TEAL }}>Person</span>
                    <span style={{ color: TEXT }}>.</span>
                    <span style={{ color: C_VAR }}>count</span>
                    <span style={{ color: TEXT }}> = </span>
                    <span style={{ color: C_NUMBER }}>{countValue}</span>
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 18,
                      color: C_DIM,
                      textAlign: "center",
                    }}
                  >
                    모두가 공유
                  </div>
                </div>
              </div>

              {/* 힙 */}
              <div
                style={{
                  ...panelStyle,
                  width: 420,
                  minHeight: 260,
                  border: `2px solid ${C_TEAL}66`,
                  padding: "32px 20px 20px",
                  opacity: heapBoxAppear,
                  transform: `scale(${interpolate(
                    heapBoxAppear,
                    [0, 1],
                    [0.92, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  )})`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: 20,
                    background: BG,
                    padding: "2px 12px",
                    fontFamily: uiFont,
                    fontSize: 20,
                    fontWeight: 800,
                    color: C_TEAL,
                    letterSpacing: 1,
                  }}
                >
                  힙 (Heap)
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    paddingTop: 8,
                  }}
                >
                  {instances.map((inst, i) => {
                    const appear = instanceAppears[i];
                    return (
                      <div
                        key={inst.name}
                        style={{
                          background: `${BG}88`,
                          border: `2px solid ${C_TEAL}44`,
                          borderRadius: 10,
                          padding: "10px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          opacity: appear,
                          transform: `scale(${interpolate(
                            appear,
                            [0, 1],
                            [0.88, 1],
                            {
                              extrapolateLeft: "clamp",
                              extrapolateRight: "clamp",
                            },
                          )})`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: uiFont,
                            fontSize: 18,
                            fontWeight: 800,
                            color: C_TEAL,
                          }}
                        >
                          Person {inst.name}
                        </span>
                        <span style={{ ...monoStyle, fontSize: 18 }}>
                          <span style={{ color: C_VAR }}>id</span>
                          <span style={{ color: TEXT }}>=</span>
                          <span style={{ color: C_NUMBER }}>{inst.id}</span>
                          <span style={{ color: TEXT }}>, </span>
                          <span style={{ color: C_VAR }}>age</span>
                          <span style={{ color: TEXT }}>=</span>
                          <span style={{ color: C_NUMBER }}>{inst.age}</span>
                        </span>
                      </div>
                    );
                  })}
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
        wordFrames={getAudioScene("staticFieldScene").wordStartFrames}
      />
    </>
  );
};

/* SummaryScene: 핵심 정리 카드 3장 */
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
      text: "static 필드는\n클래스 영역에 하나만",
      color: C_KEYWORD,
    },
    {
      text: "모든 인스턴스가\n공유하는 값",
      color: C_TEAL,
    },
    {
      text: "클래스 전체 상태\n관리에 사용",
      color: C_TYPE,
    },
  ];

  // 3장의 카드를 나레이션 타이밍에 맞춰 등장
  // 문장 1: "정리하겠습니다" (카드 없음)
  // 문장 2: "static 필드는 … 모든 인스턴스가 공유합니다" — card 0, card 1 (분리)
  // 문장 3: "객체 수 세기처럼 … 관리할 때 씁니다" — card 2
  const wt = getAudioScene("summaryScene").wordTiming as
    | Record<string, number[]>
    | undefined;
  const card0Frame = (splits[0] as number) ?? s + 40; // sentence 2 start
  const card1Frame = wt?.["모든"]?.[0] ?? card0Frame + 160;
  const card2Frame = (splits[1] as number) ?? card0Frame + 280; // sentence 3 start
  const cardFrames = [card0Frame, card1Frame, card2Frame];

  const lineAppears = points.map((_, i) =>
    spring({
      frame: frame - cardFrames[i],
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
          <SceneTitle title="4. 정리" />

          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 28,
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
                    border: `2px solid ${point.color}55`,
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
                    minWidth: 620,
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
  VIDEO_CONFIG.introScene,
  VIDEO_CONFIG.staticFieldScene,
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
    narration: CONTENT.introScene.narration as string[],
    speechStartFrame: getAudioScene("introScene").speechStartFrame,
    narrationSplits: getAudioScene("introScene").narrationSplits,
    sentenceEndFrames: getAudioScene("introScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.introScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.staticFieldScene.narration as string[],
    speechStartFrame: getAudioScene("staticFieldScene").speechStartFrame,
    narrationSplits: getAudioScene("staticFieldScene").narrationSplits,
    sentenceEndFrames: getAudioScene("staticFieldScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.staticFieldScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.summaryScene.narration as string[],
    speechStartFrame: getAudioScene("summaryScene").speechStartFrame,
    narrationSplits: getAudioScene("summaryScene").narrationSplits,
    sentenceEndFrames: getAudioScene("summaryScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
  },
]);

export const SRT_TRACKS: SrtTracks = { "ko-KR": SRT_DATA };

const JavaStatic: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.introScene.durationInFrames}
    >
      <IntroScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.staticFieldScene.durationInFrames}
    >
      <StaticFieldScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaStatic;

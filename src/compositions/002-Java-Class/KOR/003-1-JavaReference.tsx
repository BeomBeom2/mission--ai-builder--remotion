// src/compositions/002-Java-Class/KOR/003-1-JavaReference.tsx
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import React from "react";

import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { FPS } from "../../../config";
import { ElementArrow } from "../../../utils/Arrow";
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
import { computeFromValues } from "../../../utils/srt";
import { CONTENT } from "./003-2-content";
import { AUDIO_CONFIG } from "./003-3-audio.gen";
import {
  BG,
  BG_CODE,
  C_DIM,
  C_KEYWORD,
  C_NUMBER,
  C_TEAL,
  C_TYPE,
  C_VAR,
  TEXT,
} from "./colors";
import { HEIGHT, WIDTH } from "./config";

const AUDIO_SCENE_STUB = {
  durationInFrames: 30,
  speechStartFrame: 0,
  narrationSplits: [] as readonly number[],
  wordStartFrames: [] as readonly number[][],
};

const getAudioScene = (key: string) => {
  const scene = (
    AUDIO_CONFIG as unknown as Record<string, typeof AUDIO_SCENE_STUB>
  )[key];
  return scene ?? AUDIO_SCENE_STUB;
};

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  introScene: {
    audio: "ref-introScene.mp3",
    durationInFrames: getAudioScene("introScene").durationInFrames,
    speechStartFrame: getAudioScene("introScene").speechStartFrame,
    narration: CONTENT.introScene.narration as string[],
    narrationSplits: getAudioScene("introScene").narrationSplits,
  },
  analogyScene: {
    audio: "ref-analogyScene.mp3",
    durationInFrames: getAudioScene("analogyScene").durationInFrames,
    speechStartFrame: getAudioScene("analogyScene").speechStartFrame,
    narration: CONTENT.analogyScene.narration as string[],
    narrationSplits: getAudioScene("analogyScene").narrationSplits,
  },
  whyRefScene: {
    audio: "ref-whyRefScene.mp3",
    durationInFrames: getAudioScene("whyRefScene").durationInFrames,
    speechStartFrame: getAudioScene("whyRefScene").speechStartFrame,
    narration: CONTENT.whyRefScene.narration as string[],
    narrationSplits: getAudioScene("whyRefScene").narrationSplits,
  },
  memoryScene: {
    audio: "ref-memoryScene.mp3",
    durationInFrames: getAudioScene("memoryScene").durationInFrames,
    speechStartFrame: getAudioScene("memoryScene").speechStartFrame,
    narration: CONTENT.memoryScene.narration as string[],
    narrationSplits: getAudioScene("memoryScene").narrationSplits,
  },
  summaryScene: {
    audio: "ref-summaryScene.mp3",
    durationInFrames: getAudioScene("summaryScene").durationInFrames,
    speechStartFrame: getAudioScene("summaryScene").speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    narrationSplits: getAudioScene("summaryScene").narrationSplits,
  },
};

// ── ThumbnailScene ─────────────────────────────────────────────
const ThumbnailSceneWrapper: React.FC = () => (
  <Thumb
    seriesLabel={CONTENT.thumbnail.seriesLabel}
    title={CONTENT.thumbnail.title}
    subtitle={CONTENT.thumbnail.subtitle}
    badge={CONTENT.thumbnail.badge}
  />
);

// ── IntroScene ────────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const { introScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const splits = cfg.narrationSplits;

  const titleAppear = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 24,
  });

  // 3문장: 기본형 8가지
  const primitiveListAppear =
    splits.length > 1
      ? spring({
          frame: frame - splits[1],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;

  // 4문장: 그 외 참조형
  const refLabelAppear =
    splits.length > 2
      ? spring({
          frame: frame - splits[2],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;

  const primitiveTypes = [
    "byte",
    "short",
    "int",
    "long",
    "float",
    "double",
    "char",
    "boolean",
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 두 가지 변수" />

          <div
            style={{
              position: "absolute",
              top: "25%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: 40,
              alignItems: "center",
              opacity: titleAppear,
            }}
          >
            {/* 기본형 */}
            <div
              style={{
                background: `${C_VAR}18`,
                border: `2px solid ${C_VAR}66`,
                borderRadius: 16,
                padding: "28px 36px",
                textAlign: "center",
                minWidth: 240,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  fontWeight: 700,
                  color: C_VAR,
                  marginBottom: 12,
                }}
              >
                기본형 변수
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 22,
                  color: TEXT,
                  whiteSpace: "nowrap",
                }}
              >
                값을 직접 가짐
              </div>
            </div>

            <div
              style={{
                fontFamily: uiFont,
                fontSize: 36,
                fontWeight: 700,
                color: C_DIM,
              }}
            >
              vs
            </div>

            {/* 참조형 */}
            <div
              style={{
                background: `${C_TEAL}18`,
                border: `2px solid ${C_TEAL}66`,
                borderRadius: 16,
                padding: "28px 36px",
                textAlign: "center",
                minWidth: 240,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  fontWeight: 700,
                  color: C_TEAL,
                  marginBottom: 12,
                }}
              >
                참조형 변수
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 22,
                  color: TEXT,
                  whiteSpace: "nowrap",
                }}
              >
                객체를 가리킴
              </div>
            </div>
          </div>

          {/* 기본형 8가지 목록 */}
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: primitiveListAppear as number,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 20,
                fontWeight: 700,
                color: C_VAR,
              }}
            >
              기본형 자료형 8가지
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {primitiveTypes.map((t, i) => {
                const chipAppear =
                  splits.length > 1
                    ? spring({
                        frame: frame - splits[1] - 5 - i * 4,
                        fps,
                        config: { damping: 14, stiffness: 160 },
                        durationInFrames: 18,
                      })
                    : 0;
                // 발화 타이밍에 해당 칩 활성화 (wordTiming 기반)
                const wt = AUDIO_CONFIG.introScene.wordTiming;
                const wordFrame =
                  (wt as unknown as Record<string, number[]>)[t]?.[0] ?? 0;
                const isActive =
                  wordFrame > 0 && frame >= wordFrame && frame < wordFrame + 30;
                return (
                  <div
                    key={t}
                    style={{
                      ...monoStyle,
                      fontSize: 20,
                      color: C_TYPE,
                      background: BG_CODE,
                      border: `1px solid ${isActive ? C_TYPE : `${C_VAR}44`}`,
                      borderRadius: 8,
                      padding: "8px 16px",
                      opacity: chipAppear as number,
                      transform: `scale(${interpolate(chipAppear as number, [0, 1], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                      boxShadow: isActive
                        ? `0 0 0 2px ${C_TYPE}, 0 0 12px ${C_TYPE}88`
                        : "none",
                    }}
                  >
                    {t}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 그 외 = 참조형 */}
          <div
            style={{
              position: "absolute",
              top: "75%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: refLabelAppear as number,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 28,
                fontWeight: 700,
                color: C_TEAL,
              }}
            >
              그 외 전부 → 참조형 변수
            </div>
            <div
              style={{
                ...monoStyle,
                fontSize: 22,
                color: C_DIM,
                marginTop: 10,
              }}
            >
              String, 배열, 클래스 ...
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={splits}
        speechStart={cfg.speechStartFrame}
        wordFrames={AUDIO_CONFIG.introScene.wordStartFrames}
      />
    </>
  );
};

// ── AnalogyScene — 보물상자 비유 ─────────────────────────────
const AnalogyScene: React.FC = () => {
  const { analogyScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;

  // 1문장: "변수를 상자로 비유해서 설명해보겠습니다" → 도입
  // 2문장: "참조가 뭔지 자세히 알아보겠습니다" → 큰 텍스트만
  // 3문장: 기본형 — 보물이 직접
  const box1Appear =
    splits.length > 1
      ? spring({
          frame: frame - splits[1],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;
  // 4문장: 참조형 — 쪽지만
  const box2Appear =
    splits.length > 2
      ? spring({
          frame: frame - splits[2],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;

  const cardBase: React.CSSProperties = {
    borderRadius: 20,
    padding: "32px 36px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    width: 400,
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 비유로 이해하기" />

          <div
            style={{
              position: "absolute",
              top: "15%",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
            }}
          >
            {/* 1문장: "참조란?" 큰 텍스트 */}
            {(box1Appear as number) < 0.1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                  marginTop: 240,
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.display,
                    fontWeight: 900,
                    color: C_TEAL,
                    textAlign: "center",
                    opacity: spring({
                      frame: frame - s,
                      fps,
                      config: { damping: 13, stiffness: 130 },
                      durationInFrames: 24,
                    }),
                  }}
                >
                  참조란?
                </div>
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 46,
                    fontWeight: 700,
                    color: TEXT,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${C_TEAL}44`,
                    borderRadius: 999,
                    padding: "18px 38px",
                    boxShadow: `0 0 24px rgba(74, 233, 217, 0.16)`,
                    opacity: spring({
                      frame: frame - s - 6,
                      fps,
                      config: { damping: 13, stiffness: 130 },
                      durationInFrames: 24,
                    }),
                  }}
                >
                  <span style={{ color: C_VAR }}>변수</span>
                  <span style={{ color: C_DIM }}> == </span>
                  <span style={{ color: C_TEAL }}>상자</span>
                </div>
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 38,
                    fontWeight: 700,
                    color: TEXT,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${C_VAR}44`,
                    borderRadius: 999,
                    padding: "16px 34px",
                    boxShadow: `0 0 22px rgba(114, 193, 255, 0.12)`,
                    opacity: spring({
                      frame: frame - s - 12,
                      fps,
                      config: { damping: 13, stiffness: 130 },
                      durationInFrames: 24,
                    }),
                  }}
                >
                  <span style={{ color: C_NUMBER }}>값</span>
                  <span style={{ color: C_DIM }}> == </span>
                  <span style={{ color: "#ffd166" }}>보물</span>
                </div>
              </div>
            )}

            {/* 기본형: 보물 직접 */}
            <div
              style={{
                ...cardBase,
                background: `${C_VAR}12`,
                border: `2px solid ${C_VAR}55`,
                opacity: box1Appear,
                transform: `scale(${interpolate(box1Appear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div style={{ fontSize: 64 }}>📦</div>
              <div style={{ fontSize: 48 }}>💎</div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 22,
                  fontWeight: 700,
                  color: C_VAR,
                }}
              >
                기본형
              </div>
              <div style={{ fontFamily: uiFont, fontSize: 18, color: TEXT }}>
                상자 안에 보물이 직접 들어있음
              </div>
            </div>

            {/* 참조형: 쪽지만 — 객체는 멀리 */}
            <div
              style={{
                opacity: box2Appear as number,
                transform: `scale(${interpolate(box2Appear as number, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                display: "flex",
                alignItems: "center",
                gap: 0,
                width: "100%",
                justifyContent: "center",
              }}
            >
              {/* 상자 + 쪽지 */}
              <div
                style={{
                  background: `${C_TEAL}12`,
                  border: `2px solid ${C_TEAL}55`,
                  borderRadius: 20,
                  padding: "28px 32px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 56 }}>📦</div>
                <div style={{ fontSize: 36 }}>📝</div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 20,
                    fontWeight: 700,
                    color: C_TEAL,
                  }}
                >
                  참조형
                </div>
                <div style={{ fontFamily: uiFont, fontSize: 18, color: C_DIM }}>
                  쪽지만 있음
                </div>
              </div>

              {/* 점선 화살표 — 멀리 떨어진 객체를 가리킴 */}
              <svg width={160} height={20} style={{ margin: "0 8px" }}>
                <defs>
                  <marker
                    id="analogy-arrow"
                    markerWidth="10"
                    markerHeight="8"
                    refX="9"
                    refY="4"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 4, 0 8" fill={C_TEAL} />
                  </marker>
                </defs>
                <line
                  x1={0}
                  y1={10}
                  x2={148}
                  y2={10}
                  stroke={C_TEAL}
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                  markerEnd="url(#analogy-arrow)"
                />
              </svg>

              {/* 객체 (보물) — 멀리 떨어져 있음 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 56 }}>💎</div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 18,
                    fontWeight: 700,
                    color: C_TEAL,
                    background: `${C_TEAL}18`,
                    border: `1px solid ${C_TEAL}44`,
                    borderRadius: 8,
                    padding: "4px 14px",
                  }}
                >
                  객체
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
        wordFrames={AUDIO_CONFIG.analogyScene.wordStartFrames}
      />
    </>
  );
};

// ── WhyRefScene — 왜 참조를 쓰는가 ──────────────────────────
const WhyRefScene: React.FC = () => {
  const { whyRefScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;

  const bigAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 24,
  });
  const heapAppear =
    splits.length > 0
      ? spring({
          frame: frame - splits[0],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;
  const remoteAppear =
    splits.length > 1
      ? spring({
          frame: frame - splits[1],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;
  const whyWordTiming = AUDIO_CONFIG.whyRefScene
    .wordTiming as unknown as Record<string, number[]>;
  const addressFrames = [
    ...(whyWordTiming["주소만"] ?? []),
    ...(whyWordTiming["주소를"] ?? []),
  ];
  const addressActive = addressFrames.some(
    (wordFrame) => frame >= wordFrame && frame < wordFrame + 36,
  );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 왜 참조를 쓸까?" />

          <div
            style={{
              position: "absolute",
              top: "15%",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
            }}
          >
            {/* 1: 객체가 큼 */}
            <div
              style={{
                opacity: bigAppear,
                transform: `scale(${interpolate(bigAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div style={{ fontSize: 60 }}>📦</div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 20,
                  color: TEXT,
                  maxWidth: 400,
                }}
              >
                <span style={{ color: C_TEAL, fontWeight: 700, fontSize: 24 }}>
                  객체
                </span>
                는 너무 커서
                <br />
                하나의 변수에 들어갈 수 없습니다
              </div>
            </div>

            {/* 2: 힙에 만들고 주소만 — 위아래로 멀리 */}
            <div
              style={{
                opacity: heapAppear as number,
                transform: `scale(${interpolate(heapAppear as number, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
              }}
            >
              {/* 스택 (주소만) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 15,
                      fontWeight: 700,
                      color: C_VAR,
                      background: `${C_VAR}14`,
                      border: `1px solid ${C_VAR}44`,
                      borderRadius: 999,
                      padding: "5px 12px",
                      lineHeight: 1,
                    }}
                  >
                    변수
                  </div>
                  <div
                    style={{
                      border: `2px solid ${C_VAR}66`,
                      borderRadius: 10,
                      padding: "12px 24px",
                      background: `${BG_CODE}cc`,
                      ...monoStyle,
                      fontSize: 22,
                      whiteSpace: "pre" as const,
                    }}
                  >
                    <span style={{ color: C_VAR }}>numbers</span>{" "}
                    <span style={{ color: C_DIM }}>=</span>{" "}
                    <span
                      style={{
                        color: C_TEAL,
                        display: "inline-block",
                        padding: "2px 8px 3px",
                        marginLeft: 2,
                        borderRadius: 8,
                        border: `1px solid ${
                          addressActive ? `${C_TEAL}cc` : "transparent"
                        }`,
                        background: addressActive
                          ? `${C_TEAL}18`
                          : "transparent",
                        boxShadow: addressActive
                          ? `0 0 0 2px ${C_TEAL}22, 0 0 18px ${C_TEAL}33`
                          : "none",
                        transform: addressActive ? "translateY(-1px)" : "none",
                        textDecoration: addressActive ? "underline" : "none",
                        textUnderlineOffset: 5,
                        textDecorationThickness: 2,
                      }}
                    >
                      0x7f
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 18,
                    fontWeight: 700,
                    color: C_DIM,
                  }}
                >
                  주소만 가짐
                </div>
              </div>

              {/* 점선 화살표 — 길게 아래로 */}
              <svg width={20} height={200} style={{ margin: "4px 0" }}>
                <defs>
                  <marker
                    id="why-arrow"
                    markerWidth="10"
                    markerHeight="8"
                    refX="9"
                    refY="4"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 4, 0 8" fill={C_TEAL} />
                  </marker>
                </defs>
                <line
                  x1={10}
                  y1={0}
                  x2={10}
                  y2={188}
                  stroke={C_TEAL}
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                  markerEnd="url(#why-arrow)"
                />
              </svg>

              {/* 힙 (객체) — 멀리 아래 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    border: `2px solid ${C_TEAL}66`,
                    borderRadius: 12,
                    padding: "16px 24px",
                    background: `${BG_CODE}cc`,
                    fontSize: 48,
                  }}
                >
                  📦
                </div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 18,
                    fontWeight: 700,
                    color: C_TEAL,
                    background: `${C_TEAL}18`,
                    border: `1px solid ${C_TEAL}44`,
                    borderRadius: 8,
                    padding: "4px 14px",
                  }}
                >
                  객체 (힙)
                </div>
              </div>
            </div>

            {/* 3: 리모콘 비유 */}
            <div
              style={{
                opacity: remoteAppear as number,
                transform: `translateY(${interpolate(remoteAppear as number, [0, 1], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: `${C_TEAL}12`,
                border: `2px solid ${C_TEAL}44`,
                borderRadius: 16,
                padding: "24px 36px",
              }}
            >
              <div style={{ fontSize: 60 }}>🎮</div>
              <div style={{ fontFamily: uiFont, fontSize: 28, color: TEXT }}>
                <span style={{ color: C_TEAL, fontWeight: 700 }}>
                  객체 주소
                </span>{" "}
                <span style={{ color: C_DIM }}>==</span>{" "}
                <span style={{ color: C_TEAL, fontWeight: 700 }}>리모콘</span>
                <div
                  style={{
                    fontSize: 23,
                    lineHeight: 1.45,
                    color: C_DIM,
                    marginTop: 10,
                  }}
                >
                  변수에는 객체가 아닌, 객체를 조종할 수 있는 리모콘이
                  들어있습니다
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
        wordFrames={AUDIO_CONFIG.whyRefScene.wordStartFrames}
      />
    </>
  );
};

// ── MemoryScene — 코드 + 실시간 메모리 다이어그램 ──────────────
const MemoryScene: React.FC = () => {
  const { memoryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;

  // 화살표용 ref
  const containerRef = React.useRef<HTMLDivElement>(null);
  const arrCellRef = React.useRef<HTMLDivElement>(null);
  const heapObjectRef = React.useRef<HTMLDivElement>(null);

  // 단계별 등장 타이밍 (7문장)
  // 1: int age = 25 코드 + 스택에 age=25
  const step1 = spring({
    frame: frame - s,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 24,
  });
  // 2: "값 자체를 가짐" 강조 글로우
  const step2Glow =
    splits.length > 0
      ? interpolate(
          frame,
          [splits[0], splits[0] + 15, splits[0] + 50, splits[0] + 65],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;
  // 3: int[] arr = new int[3] 코드 + 힙에 배열 생성
  const step3 =
    splits.length > 1
      ? spring({
          frame: frame - splits[1],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;
  // 4: "주의하셔야 할 점" — 경고 텍스트
  const step4 =
    splits.length > 2
      ? spring({
          frame: frame - splits[2],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;
  // 5: arr은 지역변수, 객체 아님 — 스택에 arr 생성 + ❌
  const step5 =
    splits.length > 3
      ? spring({
          frame: frame - splits[3],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;
  // 6: arr은 스택에 생성, 주소만 들어있음
  const step6 =
    splits.length > 4
      ? spring({
          frame: frame - splits[4],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;
  // 7: "가리키고 있는 겁니다" — 화살표
  const step7 =
    splits.length > 5
      ? spring({
          frame: frame - splits[5],
          fps,
          config: { damping: 13, stiffness: 130 },
          durationInFrames: 24,
        })
      : 0;

  const step1p = step1 as number;
  const step3p = step3 as number;
  const step4p = step4 as number;
  const step5p = step5 as number;
  const step6p = step6 as number;
  const step7p = step7 as number;

  const panelStyle: React.CSSProperties = {
    borderRadius: 14,
    padding: "24px 28px",
    background: `${BG_CODE}cc`,
  };

  const sectionStyle = (
    progress: number,
    offset = 18,
  ): React.CSSProperties => ({
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [offset, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })}px)`,
  });

  const newWordFrame =
    (
      AUDIO_CONFIG.memoryScene.wordTiming as unknown as Record<string, number[]>
    )["new를"]?.[0] ?? 0;
  const newGlow =
    newWordFrame > 0
      ? interpolate(
          frame,
          [
            newWordFrame,
            newWordFrame + 10,
            newWordFrame + 60,
            newWordFrame + 75,
          ],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 메모리에 저장되는 과정" />

          <div
            style={{
              position: "absolute",
              top: "13%",
              left: 34,
              right: 34,
              bottom: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                ...sectionStyle(Math.max(step1p, step3p), 12),
                background: BG_CODE,
                borderRadius: 16,
                border: `1px solid ${C_DIM}33`,
                padding: "18px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                width: 980,
              }}
            >
              <div style={{ ...monoStyle, fontSize: 24, opacity: step1p }}>
                <span style={{ color: C_KEYWORD }}>int</span>{" "}
                <span style={{ color: C_VAR }}>age</span>{" "}
                <span style={{ color: TEXT }}>=</span>{" "}
                <span style={{ color: C_NUMBER }}>25</span>
                <span style={{ color: TEXT }}>;</span>
              </div>
              <div style={{ ...monoStyle, fontSize: 24, opacity: step3p }}>
                <span style={{ color: C_TYPE }}>int</span>
                <span style={{ color: TEXT }}>[]</span>{" "}
                <span
                  style={{
                    color: C_VAR,
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  numbers
                  {(() => {
                    const arrUnderline =
                      splits.length > 3
                        ? interpolate(
                            frame,
                            [
                              splits[3],
                              splits[3] + 10,
                              splits[3] + 60,
                              splits[3] + 75,
                            ],
                            [0, 1, 1, 0],
                            {
                              extrapolateLeft: "clamp",
                              extrapolateRight: "clamp",
                            },
                          )
                        : 0;
                    return arrUnderline > 0 ? (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -4,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: C_VAR,
                          borderRadius: 2,
                          opacity: arrUnderline,
                        }}
                      />
                    ) : null;
                  })()}
                </span>{" "}
                <span style={{ color: TEXT }}>=</span>{" "}
                <span
                  style={{
                    color: C_KEYWORD,
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  new
                  {newGlow > 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: "#e74c3c",
                        borderRadius: 2,
                        opacity: newGlow,
                      }}
                    />
                  ) : null}
                </span>{" "}
                <span style={{ color: C_TYPE }}>int</span>
                <span style={{ color: TEXT }}>[</span>
                <span style={{ color: C_NUMBER }}>3</span>
                <span style={{ color: TEXT }}>];</span>
              </div>
            </div>

            <div
              ref={containerRef}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
                gap: 30,
                width: 970,
                height: 750,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 360,
                  height: "100%",
                  border: `2px solid ${C_VAR}66`,
                  ...panelStyle,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: 20,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 18,
                    fontWeight: 900,
                    color: C_VAR,
                    letterSpacing: 3,
                    textAlign: "center",
                  }}
                >
                  STACK
                </div>

                <div
                  style={{
                    border: `1px solid ${C_VAR}33`,
                    borderRadius: 14,
                    padding: "18px 18px 16px",
                    background: `${C_VAR}10`,
                    ...sectionStyle(step1p, 14),
                  }}
                >
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 17,
                      fontWeight: 800,
                      color: C_VAR,
                      marginBottom: 10,
                    }}
                  >
                    기본형 변수
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 18,
                      lineHeight: 1.55,
                      color: TEXT,
                      opacity: 0.88,
                      marginBottom: 16,
                    }}
                  >
                    값이 변수 칸 안에
                    <br />
                    직접 들어갑니다.
                  </div>
                  <div
                    style={{
                      background: BG_CODE,
                      border: `1px solid ${C_VAR}44`,
                      borderRadius: 12,
                      padding: "12px 16px",
                      ...monoStyle,
                      fontSize: 26,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      gap: 18,
                      boxShadow:
                        step2Glow > 0
                          ? `0 0 0 3px ${C_VAR}, 0 0 20px ${C_VAR}88`
                          : "none",
                    }}
                  >
                    <span style={{ color: C_VAR }}>age</span>
                    <span style={{ color: C_DIM }}>=</span>
                    <span style={{ color: C_NUMBER, fontWeight: 700 }}>25</span>
                  </div>
                </div>

                <div
                  style={{
                    border: `1px solid ${C_TEAL}33`,
                    borderRadius: 14,
                    padding: "18px 18px 16px",
                    background: `${C_TEAL}10`,
                    ...sectionStyle(Math.max(step5p, step6p), 18),
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: uiFont,
                        fontSize: 15,
                        fontWeight: 800,
                        color: C_TEAL,
                      }}
                    >
                      참조형 변수
                    </div>
                    {step4p > 0.2 ? (
                      <div
                        style={{
                          fontFamily: uiFont,
                          fontSize: 13,
                          fontWeight: 800,
                          color: "#f0c674",
                          background: "rgba(240, 198, 116, 0.14)",
                          border: "1px solid rgba(240, 198, 116, 0.32)",
                          borderRadius: 999,
                          padding: "4px 10px",
                          opacity: step4p,
                        }}
                      >
                        주의
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: TEXT,
                      opacity: 0.88,
                      marginBottom: 16,
                    }}
                  >
                    객체 자체가 아니라
                    <br />
                    주소만 들어갑니다.
                  </div>
                  <div
                    ref={arrCellRef}
                    style={{
                      background: BG_CODE,
                      border: `1px solid ${C_TEAL}44`,
                      borderRadius: 12,
                      padding: "14px 18px",
                      ...monoStyle,
                      fontSize: 24,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      gap: 18,
                      position: "relative",
                      boxShadow:
                        step5p > 0.5 && step6p < 0.45
                          ? `0 0 0 2px #e74c3c, 0 0 12px #e74c3c88`
                          : step7p > 0
                            ? `0 0 0 2px ${C_TEAL}, 0 0 12px ${C_TEAL}88`
                            : "none",
                    }}
                  >
                    <span style={{ color: C_VAR }}>numbers</span>
                    <span style={{ color: C_DIM }}>=</span>
                    <span style={{ color: C_TEAL, fontWeight: 700 }}>0x7f</span>
                    {step5p > 0.5 && step6p < 0.45 ? (
                      <div
                        style={{
                          position: "absolute",
                          top: -12,
                          right: -12,
                          background: "#e74c3c",
                          color: "#fff",
                          borderRadius: "50%",
                          width: 26,
                          height: 26,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: uiFont,
                          fontSize: 14,
                          fontWeight: 900,
                        }}
                      >
                        ✕
                      </div>
                    ) : null}
                  </div>
                  {step5p > 0.5 && step6p < 0.45 ? (
                    <div
                      style={{
                        fontFamily: uiFont,
                        fontSize: 15,
                        color: "#e74c3c",
                        fontWeight: 700,
                        marginTop: 10,
                      }}
                    >
                      numbers 자체가 배열 객체는 아닙니다.
                    </div>
                  ) : null}
                  {step6p > 0.3 && step7p < 0.45 ? (
                    <div
                      style={{
                        fontFamily: uiFont,
                        fontSize: 15,
                        color: C_TEAL,
                        fontWeight: 700,
                        marginTop: 10,
                        opacity: step6p,
                      }}
                    >
                      numbers 안에는 배열의 주소만 저장됩니다.
                    </div>
                  ) : null}
                </div>

                <div
                  style={{
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${C_DIM}22`,
                    padding: "14px 16px",
                    ...sectionStyle(step7p, 10),
                  }}
                >
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 14,
                      color: C_DIM,
                      marginBottom: 6,
                    }}
                  >
                    결론
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 20,
                      lineHeight: 1.55,
                      fontWeight: 800,
                      color: TEXT,
                    }}
                  >
                    <span style={{ color: C_VAR }}>기본형</span>은 값을 담고,
                    <br />
                    <span style={{ color: C_TEAL }}>참조형</span>은 객체의
                    주소를 담습니다.
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: 554,
                  height: "100%",
                  border: `2px solid ${C_TEAL}66`,
                  ...panelStyle,
                  opacity: step3p,
                  transform: `translateY(${interpolate(
                    step3p,
                    [0, 1],
                    [20, 0],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  )}px) scale(${interpolate(step3p, [0, 1], [0.96, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 18,
                    fontWeight: 900,
                    color: C_TEAL,
                    letterSpacing: 3,
                    textAlign: "center",
                  }}
                >
                  HEAP
                </div>

                <div
                  ref={heapObjectRef}
                  style={{
                    borderRadius: 16,
                    border: `2px solid ${C_TEAL}55`,
                    background: "rgba(74, 233, 217, 0.08)",
                    padding: "24px 26px 22px",
                    marginTop: 10,
                    boxShadow:
                      step7p > 0
                        ? `0 0 0 2px rgba(74, 233, 217, 0.25), 0 0 24px rgba(74, 233, 217, 0.18)`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
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
                    <div
                      style={{
                        ...monoStyle,
                        fontSize: 18,
                        fontWeight: 700,
                        color: C_TEAL,
                      }}
                    >
                      0x7f
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 19,
                      color: C_DIM,
                      marginBottom: 22,
                    }}
                  >
                    new int[3]으로 생성된 실제 객체
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    {["[0]", "[1]", "[2]"].map((idx) => (
                      <div key={idx} style={{ textAlign: "center" }}>
                        <div
                          style={{
                            ...monoStyle,
                            fontSize: 16,
                            color: C_DIM,
                            marginBottom: 6,
                          }}
                        >
                          {idx}
                        </div>
                        <div
                          style={{
                            width: 76,
                            height: 62,
                            background: BG_CODE,
                            border: `2px solid ${C_TEAL}88`,
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...monoStyle,
                            fontSize: 26,
                            fontWeight: 700,
                            color: C_NUMBER,
                            boxShadow:
                              newGlow > 0
                                ? `0 0 0 3px ${C_TEAL}, 0 0 16px ${C_TEAL}88`
                                : "none",
                          }}
                        >
                          0
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: 17,
                      lineHeight: 1.55,
                      color: C_TEAL,
                      fontWeight: 700,
                      textAlign: "center",
                      opacity: Math.max(step6p, step7p),
                    }}
                  >
                    numbers는 이 객체를 직접 담지 않고
                    <br />
                    주소로만 연결됩니다.
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    ...sectionStyle(step6p, 12),
                  }}
                >
                  <div
                    style={{
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: `1px solid ${C_VAR}33`,
                      background: `${C_VAR}10`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: uiFont,
                        fontSize: 14,
                        color: C_VAR,
                        fontWeight: 800,
                        marginBottom: 6,
                      }}
                    >
                      기본형
                    </div>
                    <div
                      style={{
                        fontFamily: uiFont,
                        fontSize: 17,
                        lineHeight: 1.4,
                        color: TEXT,
                        fontWeight: 700,
                      }}
                    >
                      변수 칸 안에
                      <br />값 자체가 저장됨
                    </div>
                  </div>

                  <div
                    style={{
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: `1px solid ${C_TEAL}33`,
                      background: `${C_TEAL}10`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: uiFont,
                        fontSize: 14,
                        color: C_TEAL,
                        fontWeight: 800,
                        marginBottom: 6,
                      }}
                    >
                      참조형
                    </div>
                    <div
                      style={{
                        fontFamily: uiFont,
                        fontSize: 17,
                        lineHeight: 1.4,
                        color: TEXT,
                        fontWeight: 700,
                      }}
                    >
                      변수 칸 안에
                      <br />
                      객체의 주소만 저장됨
                    </div>
                  </div>
                </div>
              </div>

              <ElementArrow
                containerRef={containerRef}
                from={{ ref: arrCellRef, anchor: "right-center", padding: 14 }}
                to={{ ref: heapObjectRef, anchor: "left-center", padding: 18 }}
                color={C_TEAL}
                opacity={step7p}
                strokeWidth={3}
                curve={-22}
              />
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.memoryScene.wordStartFrames}
      />
    </>
  );
};

// ── SummaryScene ──────────────────────────────────────────────
const SummaryScene: React.FC = () => {
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const splits = cfg.narrationSplits;

  const items = [
    { text: "기본형 → 값을 직접 가짐", color: C_VAR },
    { text: "참조형 → 객체를 가리킴", color: C_TEAL },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 정리" />

          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {items.map((item, i) => {
              const appear = spring({
                frame: frame - (i === 0 ? 10 : splits[i - 1] + 10),
                fps,
                config: { damping: 12, stiffness: 130 },
                durationInFrames: 24,
              });
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.heading,
                    fontWeight: 700,
                    color: item.color,
                    opacity: appear,
                    transform: `translateY(${interpolate(appear, [0, 1], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                  }}
                >
                  {item.text}
                </div>
              );
            })}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={splits}
        speechStart={cfg.speechStartFrame}
        wordFrames={AUDIO_CONFIG.summaryScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues ──────────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.introScene,
  VIDEO_CONFIG.analogyScene,
  VIDEO_CONFIG.whyRefScene,
  VIDEO_CONFIG.memoryScene,
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

// ── Root Component ────────────────────────────────────────────
const JavaReference: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailSceneWrapper />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.introScene.durationInFrames}
    >
      <IntroScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.analogyScene.durationInFrames}
    >
      <AnalogyScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.whyRefScene.durationInFrames}
    >
      <WhyRefScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.memoryScene.durationInFrames}
    >
      <MemoryScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaReference;

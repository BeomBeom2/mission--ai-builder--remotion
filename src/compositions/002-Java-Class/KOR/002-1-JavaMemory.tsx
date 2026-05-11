// src/compositions/002-Java-Class/KOR/002-1-JavaMemory.tsx
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import React from "react";

// ── ThumbnailScene ─────────────────────────────────────────────
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
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
import { CONTENT } from "./002-2-content";
import { AUDIO_CONFIG } from "./002-3-audio.gen";
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
  sentenceEndFrames: [] as readonly number[],
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
  processScene: {
    audio: "mem-processScene.mp3",
    durationInFrames: AUDIO_CONFIG.processScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.processScene.speechStartFrame,
    narration: CONTENT.processScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.processScene.narrationSplits,
  },
  memoryScene: {
    audio: "mem-memoryScene.mp3",
    durationInFrames: AUDIO_CONFIG.memoryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.memoryScene.speechStartFrame,
    narration: CONTENT.memoryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.memoryScene.narrationSplits,
  },
  variableIntroScene: {
    audio: "mem-variableIntroScene.mp3",
    durationInFrames: getAudioScene("variableIntroScene").durationInFrames,
    speechStartFrame: getAudioScene("variableIntroScene").speechStartFrame,
    narration: CONTENT.variableIntroScene.narration as string[],
    narrationSplits: getAudioScene("variableIntroScene").narrationSplits,
  },
  variableScene: {
    audio: "mem-variableScene.mp3",
    durationInFrames: AUDIO_CONFIG.variableScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.variableScene.speechStartFrame,
    narration: CONTENT.variableScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.variableScene.narrationSplits,
  },
  summaryScene: {
    audio: "mem-summaryScene.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
};

const ThumbnailSceneWrapper: React.FC = () => (
  <Thumb
    seriesLabel={CONTENT.thumbnail.seriesLabel}
    title={CONTENT.thumbnail.title}
    subtitle={CONTENT.thumbnail.subtitle}
    badge={CONTENT.thumbnail.badge}
  />
);

// ── ProcessScene — 프로그램 → 프로세스 ──────────────────────────
const ProcessScene: React.FC = () => {
  const { processScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 파일 아이콘 등장
  const fileAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  // 1문장 중반: 프로세스 박스 등장
  const processAppear = spring({
    frame: frame - s - 30,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 2문장: 설명 텍스트
  const descAppear = spring({
    frame: frame - splits[0],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 24,
  });

  const arrowProgress = interpolate(frame - s - 20, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 프로그램 → 프로세스" />

          {/* 파일 아이콘 */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "25%",
              transform: `translate(-50%, -50%) scale(${interpolate(fileAppear, [0, 1], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              opacity: fileAppear,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 80 }}>📄</div>
            <div
              style={{
                ...monoStyle,
                fontSize: FONT.label,
                color: C_VAR,
              }}
            >
              Main.class
            </div>
          </div>

          {/* 화살표 */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "42%",
              transform: "translate(-50%, -50%)",
              opacity: arrowProgress,
              fontFamily: uiFont,
              fontSize: 40,
              color: C_DIM,
            }}
          >
            ▶ 실행
          </div>

          {/* 프로세스 박스 */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "70%",
              transform: `translate(-50%, -50%) scale(${interpolate(processAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              opacity: processAppear,
              width: 280,
              height: 320,
              border: `3px solid ${C_TEAL}88`,
              borderRadius: 16,
              background: `${BG_CODE}cc`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 18,
                fontWeight: 700,
                color: C_TEAL,
                letterSpacing: 3,
              }}
            >
              PROCESS
            </div>
            <div style={{ fontSize: 60 }}>⚙️</div>
            <div
              style={{
                ...monoStyle,
                fontSize: FONT.label,
                color: C_VAR,
              }}
            >
              Main.class
            </div>
          </div>

          {/* 설명 */}
          <div
            style={{
              position: "absolute",
              top: "75%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 700,
              color: TEXT,
              opacity: descAppear,
              textAlign: "center",
            }}
          >
            프로세스 = <span style={{ color: C_TEAL }}>실행 중인 프로그램</span>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.processScene.wordStartFrames}
      />
    </>
  );
};

// ── MemoryScene — 메모리 구조 (스택/힙) ──────────────────────────
const MemoryScene: React.FC = () => {
  const { memoryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 메모리 박스 등장
  const memAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 메모리 구조" />

          {/* 프로세스 외곽 */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "50%",
              transform: "translate(-50%, 0)",
              width: 600,
              height: 700,
              border: `2px solid ${C_DIM}`,
              borderRadius: 20,
              opacity: memAppear,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -38,
                left: 20,
                fontFamily: uiFont,
                fontSize: 18,
                fontWeight: 700,
                color: C_DIM,
                letterSpacing: 2,
              }}
            >
              PROCESS
            </div>

            {/* RAM 영역 */}
            <div
              style={{
                position: "absolute",
                top: 52,
                left: 24,
                right: 24,
                bottom: 24,
                border: `2px solid ${C_TEAL}44`,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                paddingTop: 12,
                overflow: "visible",
              }}
            >
              {/* RAM 라벨 */}
              <div
                style={{
                  position: "absolute",
                  top: -35,
                  left: 16,
                  fontFamily: uiFont,
                  fontSize: 18,
                  fontWeight: 700,
                  color: C_TEAL,
                  letterSpacing: 2,
                }}
              >
                MEMORY (RAM)
              </div>

              {/* HEAP (위) — flex: 1 반반 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px 16px",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 22,
                    fontWeight: 900,
                    color: C_TEAL,
                    letterSpacing: 3,
                  }}
                >
                  HEAP
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {[
                    { label: "int[3] {1, 3, 5}", color: C_TEAL },
                    { label: '"홍길동"', color: C_TEAL },
                  ].map((block, i) => {
                    const blockDelay = spring({
                      frame: frame - splits[0] - 30 - i * 12,
                      fps,
                      config: { damping: 14, stiffness: 140 },
                      durationInFrames: 20,
                    });
                    // 3번째 발화(splits[1]) 시 동그라미 강조
                    const circleGlow =
                      splits.length > 1
                        ? interpolate(
                            frame,
                            [
                              splits[1],
                              splits[1] + 15,
                              splits[1] + 45,
                              splits[1] + 60,
                            ],
                            [0, 1, 1, 0],
                            {
                              extrapolateLeft: "clamp",
                              extrapolateRight: "clamp",
                            },
                          )
                        : 0;
                    return (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          background: BG_CODE,
                          border: `1px solid ${block.color}44`,
                          borderRadius: 8,
                          padding: "8px 20px",
                          ...monoStyle,
                          fontSize: 18,
                          color: block.color,
                          opacity: blockDelay,
                          transform: `scale(${interpolate(blockDelay, [0, 1], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                          boxShadow:
                            circleGlow > 0
                              ? `0 0 0 3px ${C_TEAL}, 0 0 16px ${C_TEAL}88`
                              : "none",
                        }}
                      >
                        {block.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STACK (아래) — flex: 1 반반 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px 16px",
                  gap: 12,
                  borderTop: `2px solid ${C_DIM}`,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 22,
                    fontWeight: 900,
                    color: C_VAR,
                    letterSpacing: 3,
                  }}
                >
                  STACK
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {["int age = 25", "String name", "int score = 85"].map(
                    (label, i) => {
                      const cellDelay = spring({
                        frame: frame - splits[0] - 20 - i * 10,
                        fps,
                        config: { damping: 14, stiffness: 140 },
                        durationInFrames: 20,
                      });
                      // 4번째 발화(splits[2]) "그 외 자료는 스택" 시 글로우
                      const stackGlow =
                        splits.length > 2
                          ? interpolate(
                              frame,
                              [
                                splits[2],
                                splits[2] + 15,
                                splits[2] + 45,
                                splits[2] + 60,
                              ],
                              [0, 1, 1, 0],
                              {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                              },
                            )
                          : 0;
                      return (
                        <div
                          key={i}
                          style={{
                            background: BG_CODE,
                            border: `1px solid ${C_VAR}44`,
                            borderRadius: 6,
                            padding: "6px 16px",
                            ...monoStyle,
                            fontSize: 18,
                            color: C_VAR,
                            opacity: cellDelay,
                            transform: `scale(${interpolate(cellDelay, [0, 1], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                            boxShadow:
                              stackGlow > 0
                                ? `0 0 0 3px ${C_VAR}, 0 0 16px ${C_VAR}88`
                                : "none",
                          }}
                        >
                          {label}
                        </div>
                      );
                    },
                  )}
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
        wordFrames={AUDIO_CONFIG.memoryScene.wordStartFrames}
      />
    </>
  );
};

// ── VariableIntroScene — 전제 분리 ────────────────────────────
const VariableIntroScene: React.FC = () => {
  const { variableIntroScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1 = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 28,
  });
  const card2 = spring({
    frame: frame - splits[0],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 28,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 먼저 짚고 가기" />

          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 26,
              alignItems: "center",
              width: 760,
            }}
          >
            <div
              style={{
                width: "100%",
                background: BG_CODE,
                border: `2px solid ${C_VAR}44`,
                borderRadius: 20,
                padding: "28px 36px",
                textAlign: "center",
                opacity: card1,
                transform: `scale(${interpolate(card1, [0, 1], [0.9, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 34,
                  fontWeight: 900,
                  color: TEXT,
                  lineHeight: 1.35,
                }}
              >
                지금부터 말하는 변수는 모두{" "}
                <span style={{ color: C_VAR }}>메서드(함수)</span> 안의{" "}
                <span style={{ color: C_TEAL }}>지역 변수</span>입니다.
              </div>
            </div>

            <div
              style={{
                width: "100%",
                background: BG_CODE,
                border: `2px solid ${C_DIM}44`,
                borderRadius: 20,
                padding: "26px 34px",
                textAlign: "center",
                opacity: card2,
                transform: `scale(${interpolate(card2, [0, 1], [0.9, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 30,
                  fontWeight: 800,
                  color: C_DIM,
                  lineHeight: 1.35,
                }}
              >
                지역 변수와 인스턴스 변수의 개념은
                <br />
                나중에 다루겠습니다.
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={getAudioScene("variableIntroScene").wordStartFrames}
      />
    </>
  );
};

// ── VariableScene — 변수 저장 위치 ─────────────────────────────
const VariableScene: React.FC = () => {
  const { variableScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 변수 자체는 스택
  const stackAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 3문장: 객체 → 힙 + 참조
  const heapAppear = spring({
    frame: frame - splits[1],
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 화살표 애니메이션
  const arrowProgress = interpolate(frame - splits[1] - 22, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const refDeclarationOpacity = stackAppear * (1 - heapAppear);
  const refInitializedOpacity = stackAppear * heapAppear;

  const wordTiming = AUDIO_CONFIG.variableScene.wordTiming as unknown as Record<
    string,
    number[]
  >;
  const getWordFrame = (keys: string[], minFrame = 0) =>
    keys
      .flatMap((key) => wordTiming[key] ?? [])
      .filter((frame) => frame >= minFrame)
      .sort((a, b) => a - b)[0] ?? 0;
  const heapWordFrame = getWordFrame(["힙에"]);
  const referenceWordFrame = getWordFrame(["참조가"]);
  const directWordFrame = getWordFrame(["직접"]);
  const stackWordFrame = getWordFrame(["스택에"]);
  const addressWordFrame = getWordFrame([
    "주소[(리모콘)(pron:)]가",
    "주소(리모콘)가",
    "주소만",
  ]);
  const finalSentenceReferenceWordFrame = getWordFrame(
    ["참조형", "주소[(리모콘)(pron:)]가", "저장됩니다"],
    splits[2],
  );
  const heapHighlight =
    heapWordFrame > 0
      ? interpolate(
          frame,
          [
            heapWordFrame - 6,
            heapWordFrame + 8,
            heapWordFrame + 38,
            heapWordFrame + 58,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  const finalSentenceHighlight =
    finalSentenceReferenceWordFrame > 0
      ? interpolate(
          frame,
          [
            finalSentenceReferenceWordFrame - 4,
            finalSentenceReferenceWordFrame + 10,
            finalSentenceReferenceWordFrame + 44,
            finalSentenceReferenceWordFrame + 70,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  const refHighlight =
    referenceWordFrame > 0
      ? interpolate(
          frame,
          [
            referenceWordFrame - 6,
            referenceWordFrame + 10,
            referenceWordFrame + 42,
            referenceWordFrame + 62,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  const directHighlight =
    directWordFrame > 0
      ? interpolate(
          frame,
          [
            directWordFrame - 4,
            directWordFrame + 8,
            directWordFrame + 36,
            directWordFrame + 52,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  const addressHighlight =
    addressWordFrame > 0
      ? interpolate(
          frame,
          [
            addressWordFrame - 4,
            addressWordFrame + 8,
            addressWordFrame + 36,
            addressWordFrame + 52,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  const stackHighlight =
    stackWordFrame > 0
      ? interpolate(
          frame,
          [
            stackWordFrame - 4,
            stackWordFrame + 8,
            stackWordFrame + 36,
            stackWordFrame + 56,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  const referenceHighlight = Math.max(
    refHighlight,
    addressHighlight,
    finalSentenceHighlight,
  );
  const heapReferenceHighlight = Math.max(
    heapHighlight,
    finalSentenceHighlight,
  );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 변수 저장 위치" />

          {/* 코드 영역 (위) */}
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: 720,
            }}
          >
            {/* 기본형 코드: int age = 25; */}
            <pre
              style={{
                margin: 0,
                display: "inline-block",
                background: BG_CODE,
                borderRadius: 10,
                padding: "12px 20px",
                opacity: stackAppear,
                ...monoStyle,
                fontSize: 22,
              }}
            >
              <span style={{ color: C_TYPE }}>int</span>
              <span style={{ color: TEXT }}> </span>
              <span style={{ color: C_VAR }}>age</span>
              <span style={{ color: TEXT }}>{" = "}</span>
              <span style={{ color: C_NUMBER }}>25</span>
              <span style={{ color: TEXT }}>;</span>
            </pre>

            <div style={{ position: "relative", height: 50 }}>
              {/* 참조형 변수 선언: int[] numbers; */}
              <pre
                style={{
                  position: "absolute",
                  inset: 0,
                  margin: 0,
                  display: "inline-block",
                  background: BG_CODE,
                  borderRadius: 10,
                  padding: "12px 20px",
                  opacity: refDeclarationOpacity,
                  ...monoStyle,
                  fontSize: 22,
                }}
              >
                <span style={{ color: C_TYPE }}>int</span>
                <span style={{ color: TEXT }}>[]</span>
                <span style={{ color: TEXT }}> </span>
                <span style={{ color: C_VAR }}>numbers</span>
                <span style={{ color: TEXT }}>;</span>
              </pre>

              {/* 객체 생성 후 초기화: int[] numbers = new int[3]; */}
              <pre
                style={{
                  position: "absolute",
                  inset: 0,
                  margin: 0,
                  display: "inline-block",
                  background: BG_CODE,
                  borderRadius: 10,
                  padding: "12px 20px",
                  opacity: refInitializedOpacity,
                  ...monoStyle,
                  fontSize: 22,
                }}
              >
                <span style={{ color: C_TYPE }}>int</span>
                <span style={{ color: TEXT }}>[]</span>
                <span style={{ color: TEXT }}> </span>
                <span style={{ color: C_VAR }}>numbers</span>
                <span style={{ color: TEXT }}>{" = "}</span>
                <span style={{ color: C_KEYWORD }}>new</span>
                <span style={{ color: TEXT }}> </span>
                <span style={{ color: C_TYPE }}>int</span>
                <span style={{ color: TEXT }}>[</span>
                <span style={{ color: C_NUMBER }}>3</span>
                <span style={{ color: TEXT }}>];</span>
              </pre>
            </div>
          </div>

          {/* 메모리 영역 (아래) */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 24,
              height: "58%",
            }}
          >
            {/* HEAP */}
            <div
              style={{
                width: 320,
                border: `2px solid ${heapReferenceHighlight > 0 ? "rgba(90, 224, 211, 0.95)" : `${C_TEAL}66`}`,
                borderRadius: 12,
                background: `${BG_CODE}88`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px 12px",
                gap: 12,
                boxShadow:
                  heapReferenceHighlight > 0
                    ? `0 0 0 2px rgba(90, 224, 211, 0.85), 0 0 16px rgba(90, 224, 211, 0.42)`
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 18,
                  fontWeight: 900,
                  color: C_TEAL,
                  letterSpacing: 2,
                }}
              >
                HEAP
              </div>

              {/* 배열 블록 */}
              <div
                style={{
                  opacity: heapAppear,
                  transform: `scale(${interpolate(heapAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px 12px",
                  borderRadius: 10,
                  boxShadow:
                    heapReferenceHighlight > 0
                      ? `0 0 0 2px rgba(90, 224, 211, 0.9), 0 0 20px rgba(90, 224, 211, 0.45)`
                      : "none",
                  background:
                    heapReferenceHighlight > 0
                      ? "rgba(90, 224, 211, 0.08)"
                      : "transparent",
                }}
              >
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 18,
                    color: C_TEAL,
                    opacity: 0.7,
                  }}
                >
                  0x7f
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["[0]", "[1]", "[2]"].map((idx, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: uiFont,
                          fontSize: 18,
                          color: C_DIM,
                        }}
                      >
                        {idx}
                      </div>
                      <div
                        style={{
                          width: 60,
                          height: 50,
                          background: BG_CODE,
                          border: `1px solid ${C_TEAL}66`,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ...monoStyle,
                          fontSize: 18,
                          color: C_NUMBER,
                        }}
                      >
                        0
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STACK */}
            <div
              style={{
                width: 260,
                border: `2px solid ${
                  stackHighlight > 0.05
                    ? "rgba(194, 227, 169, 0.95)"
                    : `${C_VAR}66`
                }`,
                borderRadius: 12,
                background:
                  stackHighlight > 0.05
                    ? "rgba(194, 227, 169, 0.12)"
                    : `${BG_CODE}88`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px 12px",
                gap: 12,
                boxShadow:
                  stackHighlight > 0.05
                    ? "0 0 0 2px rgba(194, 227, 169, 0.85), 0 0 18px rgba(194, 227, 169, 0.35)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 18,
                  fontWeight: 900,
                  color: C_VAR,
                  letterSpacing: 2,
                }}
              >
                STACK
              </div>

              {/* age = 25 */}
              <div
                style={{
                  background: BG_CODE,
                  border: `1px solid ${C_VAR}44`,
                  borderRadius: 6,
                  padding: "8px 16px",
                  ...monoStyle,
                  fontSize: 18,
                  color: C_VAR,
                  opacity: stackAppear,
                  transform: `translateY(${interpolate(stackAppear, [0, 1], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                  boxShadow:
                    stackHighlight > 0.05
                      ? `0 0 0 2px rgba(194, 227, 169, 0.95), 0 0 16px rgba(194, 227, 169, 0.45)`
                      : "none",
                }}
              >
                <span style={{ color: C_VAR }}>age</span>
                <span style={{ color: C_DIM }}> = </span>
                <span
                  style={{
                    color: C_NUMBER,
                    textDecorationLine:
                      directHighlight > 0.05 ? "underline" : "none",
                    textDecorationColor: C_NUMBER,
                    textDecorationThickness: `${2 + directHighlight * 3}px`,
                    textUnderlineOffset: `${4 + directHighlight * 2}px`,
                    textShadow:
                      directHighlight > 0 || stackHighlight > 0.05
                        ? `0 0 ${6 + directHighlight * 8}px rgba(194, 227, 169, 0.65)`
                        : "none",
                  }}
                >
                  25
                </span>
              </div>

              {/* numbers 참조 */}
              <div
                style={{
                  position: "relative",
                  background: BG_CODE,
                  border: `1px solid ${C_TEAL}44`,
                  borderRadius: 6,
                  padding: "8px 16px",
                  ...monoStyle,
                  fontSize: 18,
                  opacity: stackAppear,
                  transform: `translateY(${interpolate(stackAppear, [0, 1], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                  boxShadow:
                    referenceHighlight > 0
                      ? `0 0 0 2px rgba(90, 224, 211, 0.95), 0 0 16px rgba(90, 224, 211, 0.45)`
                      : stackHighlight > 0.05
                        ? `0 0 0 2px rgba(194, 227, 169, 0.95), 0 0 16px rgba(194, 227, 169, 0.45)`
                        : "none",
                }}
              >
                <span style={{ color: C_VAR }}>numbers</span>
                <span style={{ color: C_DIM }}>
                  {heapAppear > 0.5 ? " → " : " = "}
                </span>
                <span
                  style={{
                    color: heapAppear > 0.5 ? C_TEAL : C_DIM,
                    fontSize: 18,
                    textDecorationLine:
                      heapAppear > 0.5 && referenceHighlight > 0.05
                        ? "underline"
                        : "none",
                    textDecorationColor: C_TEAL,
                    textDecorationThickness: `${2 + referenceHighlight * 3}px`,
                    textUnderlineOffset: `${4 + referenceHighlight * 2}px`,
                    textShadow:
                      heapAppear > 0.5 && referenceHighlight > 0
                        ? `0 0 ${6 + referenceHighlight * 8}px rgba(90, 224, 211, 0.75)`
                        : "none",
                  }}
                >
                  {heapAppear > 0.5 ? "0x7f" : "null"}
                </span>

                {/* 화살표: numbers 셀 왼쪽 → HEAP 방향 */}
                <svg
                  width="76"
                  height="24"
                  style={{
                    position: "absolute",
                    left: -84,
                    top: "50%",
                    transform: "translateY(-46%)",
                    opacity: Math.max(arrowProgress, referenceHighlight),
                    pointerEvents: "none",
                  }}
                >
                  <defs>
                    <marker
                      id="ref-arrow"
                      markerWidth="10"
                      markerHeight="8"
                      refX="9"
                      refY="4"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 4, 0 8" fill={C_TEAL} />
                    </marker>
                  </defs>
                  <path
                    d="M72 7 C54 7, 30 10, 4 14"
                    stroke={C_TEAL}
                    strokeWidth={referenceHighlight > 0 ? 3 : 2}
                    fill="none"
                    markerEnd="url(#ref-arrow)"
                    style={{
                      filter:
                        referenceHighlight > 0
                          ? "drop-shadow(0 0 6px rgba(90, 224, 211, 0.9))"
                          : "none",
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.variableScene.wordStartFrames}
      />
    </>
  );
};

// ── SummaryScene ────────────────────────────────────────────────
const SummaryScene: React.FC = () => {
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 5문장 각각에 대응하는 카드 등장
  const makeSpring = (startFrame: number) =>
    spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 12, stiffness: 130 },
      durationInFrames: 30,
    });

  const card1 = makeSpring(s); // 문장1: 프로세스 생성
  const card2 = makeSpring(splits[0]); // 문장2: 메모리 4영역
  const card3 = makeSpring(splits[1]); // 문장3: 힙/스택
  const card4 = makeSpring(splits[2]); // 문장4: 데이터/코드 나중에

  const cardStyle = (appear: number, color: string) => ({
    opacity: appear,
    transform: `scale(${interpolate(appear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
    background: BG_CODE,
    borderRadius: 16,
    padding: "28px 48px",
    textAlign: "center" as const,
    whiteSpace: "nowrap" as const,
    border: `2px solid ${color}44`,
  });

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
            {/* 1. 프로세스 */}
            <div style={cardStyle(card1, C_TEAL)}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  color: TEXT,
                }}
              >
                프로그램 실행 →{" "}
                <span style={{ color: C_TEAL, fontWeight: 900 }}>프로세스</span>{" "}
                생성
              </div>
            </div>

            {/* 2. 메모리 4영역 */}
            <div style={cardStyle(card2, C_VAR)}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  color: TEXT,
                }}
              >
                메모리 ={" "}
                <span style={{ color: C_VAR, fontWeight: 900 }}>스택</span> +{" "}
                <span style={{ color: C_TEAL, fontWeight: 900 }}>힙</span> +
                데이터 + 코드
              </div>
            </div>

            {/* 3. 힙/스택 */}
            <div style={cardStyle(card3, C_TEAL)}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  color: TEXT,
                }}
              >
                객체 →{" "}
                <span style={{ color: C_TEAL, fontWeight: 900 }}>힙</span> / 그
                외 → <span style={{ color: C_VAR, fontWeight: 900 }}>스택</span>
              </div>
            </div>

            {/* 4. 나중에 */}
            <div style={cardStyle(card4, C_DIM)}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  color: C_DIM,
                }}
              >
                데이터 · 코드 영역은 나중에…
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
  VIDEO_CONFIG.processScene,
  VIDEO_CONFIG.memoryScene,
  VIDEO_CONFIG.variableIntroScene,
  VIDEO_CONFIG.variableScene,
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
    narration: CONTENT.processScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.processScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.processScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.processScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.processScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.memoryScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.memoryScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.memoryScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.memoryScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.memoryScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.variableIntroScene.narration as string[],
    speechStartFrame: getAudioScene("variableIntroScene").speechStartFrame,
    narrationSplits: getAudioScene("variableIntroScene").narrationSplits,
    sentenceEndFrames: getAudioScene("variableIntroScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.variableIntroScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.variableScene.narration as string[],
    speechStartFrame: AUDIO_CONFIG.variableScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.variableScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.variableScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.variableScene.durationInFrames,
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
const JavaMemory: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailSceneWrapper />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.processScene.durationInFrames}
    >
      <ProcessScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.memoryScene.durationInFrames}
    >
      <MemoryScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.variableIntroScene.durationInFrames}
    >
      <VariableIntroScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.variableScene.durationInFrames}
    >
      <VariableScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaMemory;

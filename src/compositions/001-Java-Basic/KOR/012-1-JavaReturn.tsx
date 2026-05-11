// src/compositions/001-Java-Basic/KOR/012-1-JavaReturn.tsx
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
import {
  SrtEntry,
  SrtTracks,
  buildSrtData,
  computeFromValues,
  localizeSrtData,
} from "../../../utils/srt";
import { CONTENT as ENG_CONTENT } from "../ENG/012-2-content";
import { CONTENT } from "./012-2-content";
import { AUDIO_CONFIG } from "./012-3-audio.gen";
import {
  BG,
  BG_CODE,
  BG_THUMB,
  C_FUNC,
  C_KEYWORD,
  C_PAIN,
  C_TEAL,
  TEXT,
} from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  painScene: {
    audio: "ret-pain.mp3",
    durationInFrames: AUDIO_CONFIG.painScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.painScene.speechStartFrame,
    narration: CONTENT.painScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.painScene.narrationSplits,
  },
  conceptScene: {
    audio: "ret-concept.mp3",
    durationInFrames: AUDIO_CONFIG.conceptScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.conceptScene.speechStartFrame,
    narration: CONTENT.conceptScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.conceptScene.narrationSplits,
  },
  returnTypeScene: {
    audio: "ret-returnType.mp3",
    durationInFrames: AUDIO_CONFIG.returnTypeScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.returnTypeScene.speechStartFrame,
    narration: CONTENT.returnTypeScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.returnTypeScene.narrationSplits,
  },
  returnFlowScene: {
    audio: "ret-returnFlow.mp3",
    durationInFrames: AUDIO_CONFIG.returnFlowScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.returnFlowScene.speechStartFrame,
    narration: CONTENT.returnFlowScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.returnFlowScene.narrationSplits,
  },
  useReturnScene: {
    audio: "ret-useReturn.mp3",
    durationInFrames: AUDIO_CONFIG.useReturnScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.useReturnScene.speechStartFrame,
    narration: CONTENT.useReturnScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.useReturnScene.narrationSplits,
  },
  comparisonScene: {
    audio: "ret-comparison.mp3",
    durationInFrames: AUDIO_CONFIG.comparisonScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.comparisonScene.speechStartFrame,
    narration: CONTENT.comparisonScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.comparisonScene.narrationSplits,
  },
  summaryScene: {
    audio: "ret-summary.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
  realExampleScene: {
    audio: "ret-real.mp3",
    durationInFrames: AUDIO_CONFIG.realExampleScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.realExampleScene.speechStartFrame,
    narration: CONTENT.realExampleScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.realExampleScene.narrationSplits,
  },
} as const;

// ── 씬: ThumbnailScene ──────────────────────────────────────
const ThumbnailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [60 - THUMB_CROSS, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: BG_THUMB,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 860,
          height: 860,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C_TEAL}1e 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 26,
          fontWeight: 700,
          color: C_TEAL,
          letterSpacing: 10,
          opacity: 0.8,
        }}
      >
        JAVA
      </div>
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 108,
          fontWeight: 900,
          lineHeight: 1,
          textAlign: "center",
          color: "#ffffff",
          textShadow: `0 0 60px ${C_TEAL}99, 0 0 120px ${C_TEAL}44`,
        }}
      >
        Java
        <br />
        <span style={{ color: C_TEAL }}>return</span>
      </div>
    </AbsoluteFill>
  );
};

// ── 씬: PainScene — void 함수의 한계 ─────────────────────────
const PAIN_CODE = [
  "void printSum(int a, int b) {",
  "    System.out.println(a + b);",
  "}",
];

const PainScene: React.FC = () => {
  const { painScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 30,
  });

  // 2문장: "꺼낼 방법이 없습니다" → 빨간 X 표시
  const noWayAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 36,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 문제 상황" />
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                background: BG_CODE,
                borderRadius: 12,
                padding: "28px 40px",
                ...monoStyle,
                fontSize: CODE.xl,
                opacity: codeAppear,
                transform: `scale(${interpolate(codeAppear, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              {PAIN_CODE.map((line, i) => (
                <div
                  key={i}
                  style={{ lineHeight: "1.9", color: TEXT, whiteSpace: "pre" }}
                >
                  <JavaLine text={line} />
                </div>
              ))}
            </div>
            {/* "출력만 가능" 라벨 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.label,
                fontWeight: 700,
                color: C_PAIN,
                opacity: codeAppear * 0.85,
              }}
            >
              출력만 가능
            </div>
            {/* 2문장: 꺼낼 수 없다 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                color: C_PAIN,
                background: `${C_PAIN}16`,
                border: `2px solid ${C_PAIN}55`,
                borderRadius: 14,
                padding: "16px 28px",
                opacity: noWayAppear,
                transform: `scale(${interpolate(noWayAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              결과를 꺼낼 수 없음
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

// ── 씬: ConceptScene — return으로 값 돌려주기 ─────────────────
const CONCEPT_CODE = ["int sum(int a, int b) {", "    return a + b;", "}"];

const ConceptScene: React.FC = () => {
  const { conceptScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 30,
  });

  // return 키워드 하이라이트 — 1회성 (등장 후 소멸)
  const highlightIn = spring({
    frame: frame - (s + 20),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });
  const highlightOut = interpolate(frame, [s + 70, s + 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const highlight = highlightIn * (1 - highlightOut);

  // 2문장: 활용 카드
  const useAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 36,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. return이란?" />
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                background: BG_CODE,
                borderRadius: 12,
                padding: "28px 40px",
                ...monoStyle,
                fontSize: CODE.xl,
                opacity: codeAppear,
              }}
            >
              {CONCEPT_CODE.map((line, i) => (
                <div
                  key={i}
                  style={{
                    lineHeight: "1.9",
                    color: TEXT,
                    whiteSpace: "pre",
                    position: "relative",
                  }}
                >
                  <JavaLine text={line} />
                  {i === 1 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `${C_KEYWORD}`,
                        borderRadius: 6,
                        opacity: highlight * 0.15,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 2문장: 활용 예시 */}
            <div
              style={{
                display: "flex",
                gap: 20,
                opacity: useAppear,
              }}
            >
              {["변수에 저장", "바로 사용"].map((label) => (
                <div
                  key={label}
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.label,
                    fontWeight: 700,
                    color: C_TEAL,
                    background: `${C_TEAL}16`,
                    border: `2px solid ${C_TEAL}55`,
                    borderRadius: 12,
                    padding: "14px 24px",
                  }}
                >
                  {label}
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
        wordFrames={AUDIO_CONFIG.conceptScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ReturnTypeScene — 리턴 타입 (3문장: 설명 → void → int/double) ──
const ReturnTypeScene: React.FC = () => {
  const { returnTypeScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split1 = cfg.narrationSplits[0];
  const split2 = cfg.narrationSplits[1];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 타이틀 등장
  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 36,
  });
  const titleExit = interpolate(frame, [split1 - 20, split1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = titleAppear * (1 - titleExit);

  // 2문장: void 카드
  const voidAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 36,
  });

  // 3문장: int/double 카드
  const intAppear = spring({
    frame: frame - split2,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 36,
  });

  const cardStyle = (appear: number, color: string): React.CSSProperties => ({
    background: BG_CODE,
    borderRadius: 16,
    padding: "24px 32px",
    width: 480,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    opacity: appear,
    transform: `scale(${interpolate(appear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
    border: `2px solid ${color}44`,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 리턴 타입" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}
          >
            {/* 1문장: 타이틀 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 44,
                fontWeight: 700,
                color: C_TEAL,
                textAlign: "center",
                opacity: titleOpacity,
              }}
            >
              돌려줄 값의 타입
            </div>

            {/* 2문장: void 카드 */}
            <div style={cardStyle(voidAppear, C_PAIN)}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  color: C_PAIN,
                  letterSpacing: 2,
                }}
              >
                돌려줄 값 없음
              </div>
              <div style={{ ...monoStyle, fontSize: CODE.xl, color: TEXT }}>
                <span style={{ color: C_KEYWORD }}>void</span>{" "}
                <span style={{ color: C_FUNC }}>greet</span>() {"{"}...{"}"}
              </div>
            </div>

            {/* 3문장: int / double 카드 */}
            <div
              style={{
                display: "flex",
                gap: 16,
                opacity: intAppear,
                transform: `scale(${interpolate(intAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              <div
                style={{
                  background: BG_CODE,
                  borderRadius: 16,
                  padding: "20px 28px",
                  border: `2px solid ${C_TEAL}44`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 22,
                    fontWeight: 700,
                    color: C_TEAL,
                    letterSpacing: 2,
                  }}
                >
                  정수
                </div>
                <div style={{ ...monoStyle, fontSize: CODE.lg, color: TEXT }}>
                  <span style={{ color: C_KEYWORD }}>int</span>{" "}
                  <span style={{ color: C_FUNC }}>sum</span>()
                </div>
              </div>
              <div
                style={{
                  background: BG_CODE,
                  borderRadius: 16,
                  padding: "20px 28px",
                  border: `2px solid ${C_TEAL}44`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 22,
                    fontWeight: 700,
                    color: C_TEAL,
                    letterSpacing: 2,
                  }}
                >
                  실수
                </div>
                <div style={{ ...monoStyle, fontSize: CODE.lg, color: TEXT }}>
                  <span style={{ color: C_KEYWORD }}>double</span>{" "}
                  <span style={{ color: C_FUNC }}>avg</span>()
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
        wordFrames={AUDIO_CONFIG.returnTypeScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ReturnFlowScene — return 후 즉시 종료 ────────────────
const FLOW_CODE = [
  "int check(int x) {",
  "    return x * 2;",
  '    System.out.println("여기는 실행 안 됨");',
  "}",
];

const ReturnFlowScene: React.FC = () => {
  const { returnFlowScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 30,
  });

  // 2문장: 실행 안 되는 줄에 취소선 등장
  const strikeAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 36,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 실행 흐름" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                background: BG_CODE,
                borderRadius: 12,
                padding: "28px 40px",
                ...monoStyle,
                fontSize: CODE.lg,
                opacity: codeAppear,
              }}
            >
              {FLOW_CODE.map((line, i) => (
                <div
                  key={i}
                  style={{
                    lineHeight: "1.9",
                    color: i === 2 ? C_PAIN : TEXT,
                    whiteSpace: "pre",
                    position: "relative",
                    opacity: i === 2 ? 0.5 + 0.5 * (1 - strikeAppear) : 1,
                  }}
                >
                  <JavaLine text={line} />
                  {/* 취소선 */}
                  {i === 2 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: 3,
                        background: C_PAIN,
                        borderRadius: 2,
                        opacity: strikeAppear,
                        transform: `scaleX(${strikeAppear})`,
                        transformOrigin: "left",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 설명 라벨 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.label,
                fontWeight: 700,
                color: C_PAIN,
                opacity: strikeAppear * 0.85,
              }}
            >
              실행되지 않는 코드
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.returnFlowScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: UseReturnScene — 돌려받은 값 활용 ─────────────────────
// 밑줄 헬퍼 — inline 요소에 하단 밑줄 + 1회성 소멸
const Underlined: React.FC<{
  children: React.ReactNode;
  color: string;
  appear: number;
}> = ({ children, color, appear }) => (
  <span style={{ position: "relative", display: "inline" }}>
    {children}
    <span
      style={{
        position: "absolute",
        bottom: -3,
        left: 0,
        right: 0,
        height: 3,
        background: color,
        borderRadius: 2,
        transform: `scaleX(${appear})`,
        transformOrigin: "left",
      }}
    />
  </span>
);

const UseReturnScene: React.FC = () => {
  const { useReturnScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 변수에 저장
  const saveAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 30,
  });

  // 1문장: sum(3,5) 밑줄 (영구 유지 — 밑줄은 예외)
  const saveUl = spring({
    frame: frame - (s + 20),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });

  // 2문장: 바로 인자로 넘기기
  const directAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });

  // 2문장: sum(3,5)가 인자 위치에 있음 — 밑줄 (영구 유지)
  const directUl = spring({
    frame: frame - (split + 20),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 값 활용" />
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
              width: 860,
            }}
          >
            {/* 1: 변수에 저장 */}
            <div style={{ width: "100%", opacity: saveAppear }}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  color: C_TEAL,
                  letterSpacing: 2,
                  marginBottom: 8,
                  opacity: 0.85,
                }}
              >
                변수에 저장
              </div>
              <div
                style={{
                  background: BG_CODE,
                  borderRadius: 12,
                  padding: "24px 36px",
                  ...monoStyle,
                  fontSize: CODE.xl,
                  lineHeight: "1.9",
                  color: TEXT,
                  whiteSpace: "pre",
                }}
              >
                <JavaLine text="int result = " />
                <Underlined color={C_TEAL} appear={saveUl}>
                  <JavaLine text="sum(3, 5)" />
                </Underlined>
                <JavaLine text=";" />
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 18,
                  fontWeight: 600,
                  color: C_TEAL,
                  opacity: saveUl * 0.8,
                  marginTop: 6,
                }}
              >
                ↑ 함수의 결과를 변수에 담기
              </div>
            </div>

            {/* 2: 바로 인자로 넘기기 */}
            <div style={{ width: "100%", opacity: directAppear }}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  color: C_FUNC,
                  letterSpacing: 2,
                  marginBottom: 8,
                  opacity: 0.85,
                }}
              >
                바로 인자로 넘기기
              </div>
              <div
                style={{
                  background: BG_CODE,
                  borderRadius: 12,
                  padding: "24px 36px",
                  ...monoStyle,
                  fontSize: CODE.xl,
                  lineHeight: "1.9",
                  color: TEXT,
                  whiteSpace: "pre",
                }}
              >
                <JavaLine text="System.out.println(" />
                <Underlined color={C_FUNC} appear={directUl}>
                  <JavaLine text="sum(3, 5)" />
                </Underlined>
                <JavaLine text=");" />
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 18,
                  fontWeight: 600,
                  color: C_FUNC,
                  opacity: directUl * 0.8,
                  marginTop: 6,
                }}
              >
                ↑ 함수 호출을 그대로 다른 함수의 인자로
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.useReturnScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: ComparisonScene — void vs return Before/After ─────────
const BEFORE_CODE = [
  "void printSum(int a, int b) {",
  "    System.out.println(a + b);",
  "}",
];
const AFTER_CODE = ["int sum(int a, int b) {", "    return a + b;", "}"];
const AFTER_USE = [
  "int result = sum(3, 5);  // 변수에 저장",
  "System.out.println(sum(3, 5));  // 바로 활용",
];

const ComparisonScene: React.FC = () => {
  const { comparisonScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beforeAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 36,
  });

  const afterAppear = spring({
    frame: frame - split,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 36,
  });

  const arrowAppear = spring({
    frame: frame - (split - 10),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 30,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="6. Before / After" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Before — void */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.label,
                fontWeight: 700,
                color: C_PAIN,
                letterSpacing: 2,
                opacity: beforeAppear * 0.85,
              }}
            >
              출력만 가능
            </div>
            <div
              style={{
                background: BG_CODE,
                borderRadius: 12,
                padding: "20px 32px",
                ...monoStyle,
                fontSize: CODE.lg,
                opacity: beforeAppear,
                border: `2px solid ${C_PAIN}33`,
              }}
            >
              {BEFORE_CODE.map((line, i) => (
                <div
                  key={i}
                  style={{ lineHeight: "1.9", color: TEXT, whiteSpace: "pre" }}
                >
                  <JavaLine text={line} />
                </div>
              ))}
            </div>

            {/* 화살표 */}
            <div
              style={{
                fontSize: 32,
                color: C_TEAL,
                opacity: arrowAppear,
              }}
            >
              ▼
            </div>

            {/* After — return */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.label,
                fontWeight: 700,
                color: C_TEAL,
                letterSpacing: 2,
                opacity: afterAppear * 0.85,
              }}
            >
              결과를 자유롭게 활용
            </div>
            <div
              style={{
                background: BG_CODE,
                borderRadius: 12,
                padding: "20px 32px",
                ...monoStyle,
                fontSize: CODE.lg,
                opacity: afterAppear,
                border: `2px solid ${C_TEAL}33`,
              }}
            >
              {AFTER_CODE.map((line, i) => (
                <div
                  key={i}
                  style={{ lineHeight: "1.9", color: TEXT, whiteSpace: "pre" }}
                >
                  <JavaLine text={line} />
                </div>
              ))}
            </div>

            {/* 활용 예시 */}
            <div
              style={{
                background: BG_CODE,
                borderRadius: 12,
                padding: "14px 32px",
                ...monoStyle,
                fontSize: CODE.md,
                opacity: afterAppear,
                border: `2px solid ${C_TEAL}22`,
              }}
            >
              {AFTER_USE.map((line, i) => (
                <div
                  key={i}
                  style={{ lineHeight: "1.7", color: TEXT, whiteSpace: "pre" }}
                >
                  <JavaLine text={line} />
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
        wordFrames={AUDIO_CONFIG.comparisonScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: SummaryScene — 정리 ──────────────────────────────────
const SUMMARY_CARDS = CONTENT.summaryScene.cards as string[];

const SummaryScene: React.FC = () => {
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const split = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 48,
  });
  const titleExit = interpolate(frame, [split - 20, split], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = titleAppear * (1 - titleExit);

  const card0Frame = AUDIO_CONFIG.summaryScene.wordStartFrames[1]?.[0] ?? split;
  const card0Appear = spring({
    frame: frame - card0Frame,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const card1Frame =
    AUDIO_CONFIG.summaryScene.wordStartFrames[1]?.[3] ?? split + 40;
  const card1Appear = spring({
    frame: frame - card1Frame,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  const cardAppears = [card0Appear, card1Appear];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="7. 정리" />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
            }}
          >
            {/* 1문장: 타이틀 */}
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 48,
                fontWeight: 700,
                color: C_KEYWORD,
                textAlign: "center",
                opacity: titleOpacity,
                transform: `scale(${interpolate(titleAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            >
              return = 결과 돌려주기
            </div>
            {/* 2문장: 카드 */}
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {SUMMARY_CARDS.map((card, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: uiFont,
                    fontSize: 40,
                    fontWeight: 700,
                    color: "#ffffff",
                    background: `${C_FUNC}18`,
                    border: `3px solid ${C_FUNC}66`,
                    borderRadius: 16,
                    padding: "32px 40px",
                    textAlign: "center",
                    whiteSpace: "pre-line",
                    opacity: cardAppears[i],
                    transform: `scale(${interpolate(cardAppears[i], [0, 1], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                  }}
                >
                  {card}
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
        wordFrames={AUDIO_CONFIG.summaryScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: RealExampleScene — return 활용 실전 예시 ─────────────
const DISCOUNT_FUNC = [
  "// 할인 가격을 돌려주는 함수",
  "int discount(int price) {",
  "    if (price > 30000) {  // 3만 원 초과",
  "        return (int)(price * 0.9);",
  "    }",
  "    return price;",
  "}",
];
const DISCOUNT_USE = [
  "int cart = discount(50000);  // 45000",
  "int pay = discount(80000);  // 72000",
];

const RealExampleScene: React.FC = () => {
  const { realExampleScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false }); // 마지막 씬 → fadeOut 없음
  const s = cfg.speechStartFrame;
  const split1 = cfg.narrationSplits[0];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1문장: 함수 선언 등장
  const funcAppear = spring({
    frame: frame - s,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  // 2문장: 호출 + 변수 저장 등장
  const useAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 48,
  });
  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="8. 실전 예시" />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              width: 860,
            }}
          >
            {/* 함수 선언 */}
            <div style={{ width: "100%", opacity: funcAppear }}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  color: C_FUNC,
                  letterSpacing: 2,
                  marginBottom: 8,
                  opacity: 0.85,
                }}
              >
                함수 선언
              </div>
              <div
                style={{
                  background: BG_CODE,
                  borderRadius: 12,
                  padding: "20px 28px",
                  ...monoStyle,
                  fontSize: CODE.lg,
                  position: "relative",
                }}
              >
                {DISCOUNT_FUNC.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      lineHeight: "1.7",
                      color: TEXT,
                      whiteSpace: "pre",
                    }}
                  >
                    <JavaLine text={line} />
                  </div>
                ))}
              </div>
            </div>

            {/* 활용 */}
            <div style={{ width: "100%", opacity: useAppear }}>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  fontWeight: 700,
                  color: C_TEAL,
                  letterSpacing: 2,
                  marginBottom: 8,
                  opacity: 0.85,
                }}
              >
                활용
              </div>
              <div
                style={{
                  background: BG_CODE,
                  borderRadius: 12,
                  padding: "20px 28px",
                  ...monoStyle,
                  fontSize: CODE.lg,
                }}
              >
                {DISCOUNT_USE.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      lineHeight: "1.7",
                      color: TEXT,
                      whiteSpace: "pre",
                    }}
                  >
                    <JavaLine text={line} />
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
        wordFrames={AUDIO_CONFIG.realExampleScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues 계산 ─────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.painScene,
  VIDEO_CONFIG.conceptScene,
  VIDEO_CONFIG.returnTypeScene,
  VIDEO_CONFIG.returnFlowScene,
  VIDEO_CONFIG.useReturnScene,
  VIDEO_CONFIG.comparisonScene,
  VIDEO_CONFIG.summaryScene,
  VIDEO_CONFIG.realExampleScene,
];
const sceneDurations = sceneList.map((s) => s.durationInFrames);
const fromValues = computeFromValues(sceneDurations, {
  cross: CROSS,
  firstOverlap: THUMB_CROSS,
});
const totalDuration =
  fromValues[fromValues.length - 1] + sceneDurations[sceneDurations.length - 1];

// ── SRT 데이터 (scripts/srt.ts 에서 사용) ────────────────────
/** 절대 프레임 기준 자막 큐 목록 — srt.ts가 읽어서 .srt 파일 생성 */
export const SRT_DATA: SrtEntry[] = buildSrtData([
  {
    offset: fromValues[1],
    narration: VIDEO_CONFIG.painScene.narration,
    speechStartFrame: AUDIO_CONFIG.painScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.painScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.painScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.painScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: VIDEO_CONFIG.conceptScene.narration,
    speechStartFrame: AUDIO_CONFIG.conceptScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.conceptScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.conceptScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.conceptScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: VIDEO_CONFIG.returnTypeScene.narration,
    speechStartFrame: AUDIO_CONFIG.returnTypeScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.returnTypeScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.returnTypeScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.returnTypeScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: VIDEO_CONFIG.returnFlowScene.narration,
    speechStartFrame: AUDIO_CONFIG.returnFlowScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.returnFlowScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.returnFlowScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.returnFlowScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: VIDEO_CONFIG.useReturnScene.narration,
    speechStartFrame: AUDIO_CONFIG.useReturnScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.useReturnScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.useReturnScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.useReturnScene.durationInFrames,
  },
  {
    offset: fromValues[6],
    narration: VIDEO_CONFIG.comparisonScene.narration,
    speechStartFrame: AUDIO_CONFIG.comparisonScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.comparisonScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.comparisonScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.comparisonScene.durationInFrames,
  },
  {
    offset: fromValues[7],
    narration: VIDEO_CONFIG.summaryScene.narration,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.summaryScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
  },
  {
    offset: fromValues[8],
    narration: VIDEO_CONFIG.realExampleScene.narration,
    speechStartFrame: AUDIO_CONFIG.realExampleScene.speechStartFrame,
    narrationSplits: AUDIO_CONFIG.realExampleScene.narrationSplits,
    sentenceEndFrames: AUDIO_CONFIG.realExampleScene.sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.realExampleScene.durationInFrames,
  },
]);

export const SRT_DATA_EN: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...ENG_CONTENT.painScene.narration,
  ...ENG_CONTENT.conceptScene.narration,
  ...ENG_CONTENT.returnTypeScene.narration,
  ...ENG_CONTENT.returnFlowScene.narration,
  ...ENG_CONTENT.useReturnScene.narration,
  ...ENG_CONTENT.comparisonScene.narration,
  ...ENG_CONTENT.summaryScene.narration,
  ...ENG_CONTENT.realExampleScene.narration,
]);

export const SRT_TRACKS: SrtTracks = {
  "ko-KR": SRT_DATA,
  "en-US": SRT_DATA_EN,
};

// ── compositionMeta ───────────────────────────────────────────
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

// ── Root Component ────────────────────────────────────────────
const JavaReturn: React.FC = () => (
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
      durationInFrames={VIDEO_CONFIG.conceptScene.durationInFrames}
    >
      <ConceptScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.returnTypeScene.durationInFrames}
    >
      <ReturnTypeScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.returnFlowScene.durationInFrames}
    >
      <ReturnFlowScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.useReturnScene.durationInFrames}
    >
      <UseReturnScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.comparisonScene.durationInFrames}
    >
      <ComparisonScene />
    </Sequence>
    <Sequence
      from={fromValues[7]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
    <Sequence
      from={fromValues[8]}
      durationInFrames={VIDEO_CONFIG.realExampleScene.durationInFrames}
    >
      <RealExampleScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaReturn;

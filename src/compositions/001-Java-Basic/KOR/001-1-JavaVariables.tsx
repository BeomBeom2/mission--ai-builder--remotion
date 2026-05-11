// ─────────────────────────────────────────────────────────────
// 01-JavaVariables.tsx  —  Java 변수 설명 영상 (쇼츠 1080×1920)
//
// 이 파일 하나에 영상에 필요한 모든 것이 들어 있습니다:
//   씬 데이터(자막·코드), 폰트, 훅, UI 컴포넌트, 씬, 컴포지션
// TTS 설정·PRONUNCIATION 전역값은 global.config.ts 에서 관리합니다.
// ─────────────────────────────────────────────────────────────
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import React from "react";

import { FPS, SCENE_TAIL_FRAMES } from "../../../config";
import {
  CHARS_PER_SEC,
  CODE,
  CROSS,
  CodeBlock,
  ContentArea,
  FONT,
  SceneAudio,
  SceneTitle,
  Subtitle,
  THUMB_CROSS,
  TypingCodeLine,
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
import { CONTENT as ENG_CONTENT } from "../ENG/001-2-content";
import { CONTENT } from "./001-2-content";
import { AUDIO_CONFIG } from "./001-3-audio.gen";
import { BG, BG_CODE, BG_THUMB, C_NUMBER, C_TEAL, C_VAR, TEXT } from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── 타입 ─────────────────────────────────────────────────────
export interface CodeLine {
  text: string;
  isNew: boolean;
}

/** 음성 길이(초) → 장면 프레임 수 (꼬리 여유 포함). 나중을 위해 유지. */
export const f = (secs: number) => Math.ceil(secs * FPS) + SCENE_TAIL_FRAMES;

/** 코드 라인 — 한 곳에서만 정의 */
const ALL_CODE = ["int age;", "age = 25;", "System.out.println(age);"];
/** n줄까지 표시, 마지막 줄만 타이핑 */
const codeUpTo = (n: number): CodeLine[] =>
  ALL_CODE.slice(0, n).map((text, i) => ({ text, isNew: i === n - 1 }));

// ── 씬 데이터 ─────────────────────────────────────────────────
// durationInFrames / narrationSplits 는 AUDIO_CONFIG (0001-audio.ts) 에서 자동 관리됩니다.
export const VIDEO_CONFIG = {
  thumbnail: {
    durationInFrames: 60,
  },

  intro: {
    audio: "scene0.mp3",
    durationInFrames: AUDIO_CONFIG.intro.durationInFrames,
    narration: CONTENT.intro.narration as string[],
    narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
  },

  declaration: {
    audio: "scene1.mp3",
    durationInFrames: AUDIO_CONFIG.declaration.durationInFrames,
    title: "변수 선언 (Declaration)",
    code: codeUpTo(1),
    narration: CONTENT.declaration.narration as string[],
    narrationSplits: AUDIO_CONFIG.declaration.narrationSplits,
  },

  initialization: {
    audio: "scene2.mp3",
    durationInFrames: AUDIO_CONFIG.initialization.durationInFrames,
    title: "변수 초기화 (Initialization)",
    code: codeUpTo(2),
    narration: CONTENT.initialization.narration as string[],
    narrationSplits: AUDIO_CONFIG.initialization.narrationSplits,
  },

  interpret: {
    audio: "interpret.mp3",
    durationInFrames: AUDIO_CONFIG.interpret.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.interpret.speechStartFrame,
    narration: CONTENT.interpret.narration as string[],
    narrationSplits: AUDIO_CONFIG.interpret.narrationSplits,
  },

  interpretQuiz: {
    audio: "interpret-quiz.mp3",
    durationInFrames: AUDIO_CONFIG.interpretQuiz.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.interpretQuiz.speechStartFrame,
    narration: CONTENT.interpretQuiz.narration as string[],
    narrationSplits: AUDIO_CONFIG.interpretQuiz.narrationSplits,
  },

  interpretReveal: {
    audio: "interpret-reveal.mp3",
    durationInFrames: AUDIO_CONFIG.interpretReveal.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.interpretReveal.speechStartFrame,
    narration: CONTENT.interpretReveal.narration as string[],
    narrationSplits: AUDIO_CONFIG.interpretReveal.narrationSplits,
  },

  print: {
    audio: "scene3.mp3",
    durationInFrames: AUDIO_CONFIG.print.durationInFrames,
    title: "변수 출력 (Print)",
    code: codeUpTo(3),
    consoleOutput: "> 25",
    narration: CONTENT.print.narration as string[],
    narrationSplits: AUDIO_CONFIG.print.narrationSplits,
  },
};

const StaticLine: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ opacity: 0.5, color: TEXT, lineHeight: "1.8" }}>{text}</div>
);

const CodeBox: React.FC<{
  lines: CodeLine[];
  startFrame: number;
  charsPerSecond?: number;
}> = ({ lines, startFrame, charsPerSecond = 10 }) => (
  <CodeBlock
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "48px 64px",
      ...monoStyle,
      fontSize: CODE.xl,
    }}
  >
    {lines.map((line, i) =>
      line.isNew ? (
        <TypingCodeLine
          key={`new-${i}-${line.text}`}
          text={line.text}
          startFrame={startFrame}
          cps={charsPerSecond}
          lineHeight="1.8"
        />
      ) : (
        <StaticLine key={`static-${i}-${line.text}`} text={line.text} />
      ),
    )}
  </CodeBlock>
);

// ── 컴포넌트: ConsoleOutput ───────────────────────────────────
const ConsoleOutput: React.FC<{ text: string; startFrame: number }> = ({
  text,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(50% + 180px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0a0a0a",
        borderRadius: 8,
        padding: "12px 32px",
        ...monoStyle,
        fontSize: CODE.xl,
        color: "#89d185",
        opacity,
        minWidth: 300,
        textAlign: "left",
      }}
    >
      {text}
    </div>
  );
};

// ── 컴포넌트: BoxMetaphorAnim ─────────────────────────────────
// 인트로 씬용: 상자 등장 → 이름 태그 → 값 투입 → 값 꺼내기
const BoxMetaphorAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 발화 프레임 직접 참조 (CLAUDE.md 6번 원칙: 애니메이션은 발화 시작에 맞춘다)
  const NAME_TAG_START = AUDIO_CONFIG.intro.wordTiming["이름을"][0]; // "이름을"
  const DROP_START = AUDIO_CONFIG.intro.wordTiming["값을"][0]; // "값을"
  const EXTRACT_START = AUDIO_CONFIG.intro.wordTiming["꺼내"][0]; // "꺼내"

  // 1) 상자 + 라벨 동시 등장
  const boxAppear = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, stiffness: 90 },
    durationInFrames: 90,
  });
  const boxScale = interpolate(boxAppear, [0, 1], [0.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelAppear = boxAppear; // 상자와 같은 타이밍

  // 3) "변수 : age" 이름 태그 — "이름을" 발화 시점에 등장
  const nameTag = spring({
    frame: frame - NAME_TAG_START,
    fps,
    config: { damping: 12, stiffness: 180 },
    durationInFrames: 50,
  });
  const nameTagScale = interpolate(nameTag, [0, 1], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4) 값(25) 낙하 — 단일 엘리먼트, Y만 이동하고 opacity 유지 (두 애니메이션 분리 → 깜빡임 제거)
  const dropE = frame - DROP_START;
  const DROP_FRAMES = 60;
  // Y: -160(박스 위) → 0(중앙) easeOut
  const dropY = interpolate(dropE, [0, DROP_FRAMES], [-160, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  // opacity: 처음 4프레임에만 0→1, 이후 계속 1 (절대 0으로 돌아가지 않음)
  const dropO = interpolate(dropE, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 착지 글로우
  const dropGlow = interpolate(
    dropE,
    [DROP_FRAMES - 4, DROP_FRAMES + 4, DROP_FRAMES + 28],
    [0, 1, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 5) 값(25) 꺼내기
  const extE = frame - EXTRACT_START;
  const ext = spring({
    frame: extE,
    fps,
    config: { damping: 200 },
    durationInFrames: 60,
  });
  // 꺼내진 값 + 화살표: 박스 오른쪽에서 fade-in
  const extractO = interpolate(extE, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowO = extractO;
  // 꺼낼 때 박스 테두리 강조
  const extGlow = interpolate(ext, [0, 0.3, 1], [0, 0.8, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const totalGlow = Math.max(dropGlow, extGlow);

  return (
    <div
      style={{
        position: "absolute",
        top: "28%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* "변수" 라벨 */}
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 42,
          fontWeight: 700,
          color: C_TEAL,
          letterSpacing: 6,
          opacity: labelAppear,
        }}
      >
        변수
      </div>

      {/* 상자 + 꺼내기 레이어 */}
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        {/* 상자 */}
        <div
          style={{
            transform: `scale(${boxScale})`,
            position: "relative",
            border: `4px solid rgba(78,201,176,${0.45 + totalGlow * 0.55})`,
            borderRadius: 24,
            width: 300,
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(78,201,176,0.05)",
            boxShadow: `0 0 ${totalGlow * 50}px rgba(78,201,176,${totalGlow * 0.55})`,
          }}
        >
          {/* 25 단일 엘리먼트: 위에서 Y 이동 후 중앙 고정 (깜빡임 없음) */}
          {dropE >= 0 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translateX(-50%) translateY(calc(-50% + ${dropY}px))`,
                ...monoStyle,
                fontSize: 90,
                color: C_NUMBER,
                fontWeight: 700,
                opacity: dropO,
                pointerEvents: "none",
              }}
            >
              25
            </div>
          )}
        </div>

        {/* 화살표 + 꺼낸 값 — 박스 오른쪽에 절대 위치 */}
        {extE >= 0 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 300,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: arrowO,
                pointerEvents: "none",
              }}
            >
              {/* 화살표 */}
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: 52,
                  color: C_TEAL,
                  lineHeight: 1,
                }}
              >
                →
              </span>
              {/* 꺼낸 값 */}
              <span
                style={{
                  ...monoStyle,
                  fontSize: 80,
                  color: C_NUMBER,
                  fontWeight: 700,
                  opacity: extractO,
                  display: "inline-block",
                }}
              >
                25
              </span>
            </div>
          </>
        )}
      </div>

      {/* "변수 : age" 이름 태그 */}
      <div
        style={{
          transform: `scale(${nameTagScale})`,
          opacity: nameTag,
          ...monoStyle,
          fontSize: 38,
        }}
      >
        <span style={{ color: C_TEAL }}>변수</span>
        <span style={{ color: "#808080", margin: "0 10px" }}>:</span>
        <span style={{ color: C_VAR }}>age</span>
      </div>
    </div>
  );
};

// ── 씬: IntroScene ────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const { intro } = VIDEO_CONFIG;
  const opacity = useFade(intro.durationInFrames, { in: true });
  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={intro.audio} />
          <SceneTitle title="1. 변수란?" />
          <BoxMetaphorAnim />
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={intro.narration}
        splits={intro.narrationSplits}
        speechStart={AUDIO_CONFIG.intro.speechStartFrame}
        wordFrames={AUDIO_CONFIG.intro.wordStartFrames}
      />
    </>
  );
};

// ── 씬 컴포넌트 ───────────────────────────────────────────────
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
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        opacity: fadeOut,
      }}
    >
      {/* 글로우 원형 배경 */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(78,201,176,0.12) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 28,
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
          fontSize: 160,
          fontWeight: 900,
          lineHeight: 1,
          textAlign: "center",
          color: "#ffffff",
          textShadow:
            "0 0 60px rgba(78,201,176,0.6), 0 0 120px rgba(78,201,176,0.3)",
        }}
      >
        Java
        <br />
        <span style={{ color: C_TEAL }}>변수</span>
      </div>
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 32,
          color: C_TEAL,
          letterSpacing: 4,
          opacity: 0.7,
        }}
      >
        선언 · 초기화 · 출력
      </div>
    </AbsoluteFill>
  );
};

const QUIZ_THINKING_FRAMES = 300; // 퀴즈 대기 시간 (5초)
const typingDone = (chars: number, speechStart: number) =>
  speechStart + Math.ceil((chars / CHARS_PER_SEC) * FPS);

const {
  thumbnail,
  intro,
  declaration,
  initialization,
  interpret,
  interpretQuiz,
  interpretReveal,
  print,
} = VIDEO_CONFIG;
const QUIZ_TOTAL_DURATION =
  interpretQuiz.durationInFrames +
  QUIZ_THINKING_FRAMES +
  interpretReveal.durationInFrames;

// ── 컴포넌트: CombinedVariableBox ────────────────────────────
// 선언(빈 박스) → 초기화(값 낙하) 전 구간을 하나의 박스로 이어서 표현
const CombinedVariableBox: React.FC<{
  emptyStart: number;
  fillStart: number;
}> = ({ emptyStart, fillStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame - emptyStart;
  const fillElapsed = frame - fillStart;

  // 박스 등장 (아래서 올라옴)
  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 70,
  });
  const translateY = interpolate(appear, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 값 낙하 스프링
  const dropProgress = spring({
    frame: fillElapsed,
    fps,
    config: { damping: 10, stiffness: 120 },
    durationInFrames: 80,
  });
  const valueY = interpolate(dropProgress, [0, 1], [-110, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fallingOpacity = interpolate(
    dropProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const insideOpacity = interpolate(dropProgress, [0.85, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const borderGlow = interpolate(dropProgress, [0.8, 0.9, 1], [0, 1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (elapsed < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "64%",
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity: appear,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 26,
          color: C_TEAL,
          opacity: 0.85,
          letterSpacing: 2,
        }}
      >
        age
      </div>
      <div
        style={{
          position: "relative",
          border: `3px solid rgba(78,201,176,${0.45 + borderGlow * 0.55})`,
          borderRadius: 10,
          width: 160,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(78,201,176,0.04)",
          boxShadow: `0 0 ${borderGlow * 24}px rgba(78,201,176,${borderGlow * 0.6})`,
        }}
      >
        {/* 착지 후 숫자 */}
        <span
          style={{
            position: "absolute",
            ...monoStyle,
            fontSize: 44,
            color: C_NUMBER,
            opacity: insideOpacity,
          }}
        >
          25
        </span>
        {/* 낙하 중인 숫자 */}
        <div
          style={{
            position: "absolute",
            top: valueY,
            left: "50%",
            transform: "translateX(-50%)",
            ...monoStyle,
            fontSize: 44,
            color: C_NUMBER,
            opacity: fallingOpacity,
            pointerEvents: "none",
          }}
        >
          25
        </div>
      </div>
    </div>
  );
};

// ── 씬: CombinedDeclarationInitScene ─────────────────────────
// 선언 + 초기화를 하나의 연속 씬으로 처리 (박스 애니메이션이 끊기지 않음)
const SPLIT = declaration.durationInFrames; // 선언 끝 = 초기화 시작 지점
const COMBINED_DURATION =
  declaration.durationInFrames + initialization.durationInFrames;

const CombinedDeclarationInitScene: React.FC = () => {
  const opacity = useFade(COMBINED_DURATION);

  const emptyBoxStart = typingDone(
    "int age;".length,
    AUDIO_CONFIG.declaration.speechStartFrame,
  );
  const fillBoxStart =
    SPLIT +
    typingDone(
      "age = 25;".length,
      AUDIO_CONFIG.initialization.speechStartFrame,
    );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          {/* 오디오: 선언 오디오 끝나는 즉시 초기화 오디오 시작 (SCENE_TAIL_FRAMES 공백 제거) */}
          <Sequence durationInFrames={SPLIT}>
            <SceneAudio src={declaration.audio} />
          </Sequence>
          <Sequence from={SPLIT - SCENE_TAIL_FRAMES}>
            <SceneAudio src={initialization.audio} />
          </Sequence>

          {/* 제목: 씬 전환 시 교체 */}
          <Sequence durationInFrames={SPLIT}>
            <SceneTitle title={`2. ${declaration.title}`} />
          </Sequence>
          <Sequence from={SPLIT}>
            <SceneTitle title={`3. ${initialization.title}`} />
          </Sequence>

          {/* 코드: 선언 코드 → 초기화 코드 (int age;는 isNew:false로 이미 표시됨) */}
          <Sequence durationInFrames={SPLIT}>
            <CodeBox
              lines={declaration.code}
              startFrame={AUDIO_CONFIG.declaration.speechStartFrame}
            />
          </Sequence>
          <Sequence from={SPLIT}>
            <CodeBox
              lines={initialization.code}
              startFrame={AUDIO_CONFIG.initialization.speechStartFrame}
            />
          </Sequence>

          {/* 박스: 전 구간에 걸쳐 살아있는 단일 박스 */}
          <CombinedVariableBox
            emptyStart={emptyBoxStart}
            fillStart={fillBoxStart}
          />
        </ContentArea>
      </AbsoluteFill>

      {/* 자막: opacity 영향 없이 항상 선명하게
          initialization 오디오가 SPLIT-SCENE_TAIL_FRAMES 부터 시작하므로
          자막 Sequence도 같은 시점에서 시작해야 speechStartFrame 기준이 맞음 */}
      <Sequence durationInFrames={SPLIT - SCENE_TAIL_FRAMES}>
        <Subtitle
          sentences={declaration.narration}
          splits={declaration.narrationSplits}
          speechStart={AUDIO_CONFIG.declaration.speechStartFrame}
          wordFrames={AUDIO_CONFIG.declaration.wordStartFrames}
        />
      </Sequence>
      <Sequence from={SPLIT - SCENE_TAIL_FRAMES}>
        <Subtitle
          sentences={initialization.narration}
          splits={initialization.narrationSplits}
          speechStart={AUDIO_CONFIG.initialization.speechStartFrame}
          wordFrames={AUDIO_CONFIG.initialization.wordStartFrames}
        />
      </Sequence>
    </>
  );
};

// ── 씬: InterpretScene — 변수 해석 (공간 vs 값) ──────────────
//   Phase 0: 3줄 코드 모두 표시
//   Phase 1 (split0~): int age; / age = 25; 의 age → "공간" 배지
//   Phase 2 (split1~): println(age) 의 age → "값 (= 25)" 배지
const InterpretScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { interpret: cfg } = VIDEO_CONFIG;
  const s = cfg.speechStartFrame;
  const [split0 = Infinity, split1 = Infinity] =
    cfg.narrationSplits as readonly number[];
  const { fps } = useVideoConfig();
  const opacity = useFade(cfg.durationInFrames);

  const phase = frame >= split1 ? 2 : frame >= split0 ? 1 : 0;

  const ann1 = spring({
    frame: frame - split0,
    fps,
    config: { damping: 13, stiffness: 140 },
    durationInFrames: 48,
  });
  const ann2 = spring({
    frame: frame - split1,
    fps,
    config: { damping: 13, stiffness: 140 },
    durationInFrames: 48,
  });

  const C_SPACE = "#e5c07b"; // 공간: amber
  const C_AGE = C_VAR; // 변수 이름 기본 색
  const C_VAL = C_TEAL; // 값: teal

  const badge = (label: string, color: string, anim: number) => (
    <span
      style={{
        opacity: anim,
        color,
        fontSize: FONT.label,
        fontFamily: uiFont,
        background: `${color}1a`,
        borderRadius: 6,
        padding: "2px 10px",
        border: `1px solid ${color}55`,
      }}
    >
      {label}
    </span>
  );

  const ageSpan = (active: boolean, color: string) => (
    <span
      style={{
        color: active ? color : C_AGE,
        fontWeight: active ? 700 : 400,
        background: active ? `${color}28` : "transparent",
        borderRadius: 4,
        padding: "1px 5px",
        outline: active ? `1.5px solid ${color}66` : "none",
      }}
    >
      age
    </span>
  );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 변수의 해석" />

          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "46%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                ...monoStyle,
                fontSize: CODE.xl,
                lineHeight: 2.1,
                background: "#252525",
                borderRadius: 20,
                padding: "36px 48px",
                width: 900,
                boxShadow: "0 6px 40px rgba(0,0,0,0.45)",
              }}
            >
              {/* Line 1: int age; */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: phase === 2 ? 0.2 : 1,
                }}
              >
                <div>
                  <span style={{ color: C_TEAL }}>int</span>{" "}
                  {ageSpan(phase === 1, C_SPACE)}
                  <span style={{ color: TEXT }}>;</span>
                </div>
                {badge("← 공간", C_SPACE, phase >= 1 ? ann1 : 0)}
              </div>

              {/* Line 2: age = 25; */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: phase === 2 ? 0.2 : 1,
                }}
              >
                <div>
                  {ageSpan(phase === 1, C_SPACE)}
                  <span style={{ color: TEXT }}> = </span>
                  <span style={{ color: C_NUMBER }}>25</span>
                  <span style={{ color: TEXT }}>;</span>
                </div>
                {badge("← 공간", C_SPACE, phase >= 1 ? ann1 : 0)}
              </div>

              {/* Line 3: System.out.println(age); */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: phase < 2 ? 0.28 : 1,
                }}
              >
                <div>
                  <span style={{ color: "#569cd6" }}>System</span>
                  <span style={{ color: TEXT }}>.out.</span>
                  <span style={{ color: "#dcdcaa" }}>println</span>
                  <span style={{ color: TEXT }}>(</span>
                  {ageSpan(phase === 2, C_VAL)}
                  <span style={{ color: TEXT }}>);</span>
                </div>
                <div
                  style={{
                    opacity: phase >= 2 ? ann2 : 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {badge("← 값", C_VAL, ann2)}
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: CODE.lg,
                      color: C_NUMBER,
                      background: BG_CODE,
                      borderRadius: 8,
                      padding: "4px 14px",
                      border: "1px solid #444",
                    }}
                  >
                    = 25
                  </span>
                </div>
              </div>
            </div>
          )}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.interpret.wordStartFrames}
      />
    </>
  );
};

// ── 씬: QuizScene — 변수 해석 퀴즈 (age = age + 2;) ──────────
//   Phase A (0..qDur): 문제 제시 + 오디오
//   Phase B (qDur..qDur+150): 카운트다운 대기 (5초)
//   Phase C (qDur+150..): 정답 공개 + 오디오
const QuizScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qCfg = interpretQuiz;
  const rCfg = interpretReveal;

  const qDur = qCfg.durationInFrames;
  const REVEAL_START = qDur + QUIZ_THINKING_FRAMES;
  const totalDur = QUIZ_TOTAL_DURATION;

  const opacity = useFade(totalDur);

  const isCountdown = frame >= qDur && frame < REVEAL_START;
  const isReveal = frame >= REVEAL_START;

  // 카운트다운
  const cdFrame = frame - qDur;
  const cdProgress = isCountdown
    ? interpolate(cdFrame, [0, QUIZ_THINKING_FRAMES], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const secondsLeft = isCountdown
    ? Math.ceil((QUIZ_THINKING_FRAMES - cdFrame) / 60)
    : 0;

  // 정답 공개 애니메이션
  const revealAnim = spring({
    frame: frame - REVEAL_START,
    fps,
    config: { damping: 13, stiffness: 140 },
    durationInFrames: 48,
  });

  const C_SPACE = "#e5c07b"; // 공간: amber
  const C_AGE = C_VAR; // 변수 이름 기본 색
  const C_VAL = C_TEAL; // 값: teal

  // 질문 단계에서 왼쪽 age 펄싱 — "age" 단어 발화 시점부터
  const AGE_WORD_FRAME = AUDIO_CONFIG.interpretQuiz.wordTiming["age"][0]; // "age"
  const pulseAlpha = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.04));
  const showPulse = !isReveal && frame >= AGE_WORD_FRAME;

  // "우측의 age는 값으로 해석해야 합니다" 발화 시 우측 age glow (등장 후 소멸)
  const REVEAL_SPLIT2 =
    REVEAL_START + AUDIO_CONFIG.interpretReveal.narrationSplits[1];
  const valueGlowIn = spring({
    frame: frame - REVEAL_SPLIT2,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 60,
  });
  const GLOW_FADE_START = REVEAL_SPLIT2 + 50;
  const valueGlowOut = interpolate(
    frame,
    [GLOW_FADE_START, GLOW_FADE_START + 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const valueGlow = valueGlowIn * (1 - valueGlowOut);

  // age 스팬: 질문=왼쪽 펄싱, 공개 후=역할별 색
  const ageSpan = (role: "space" | "value") => {
    const color = role === "space" ? C_SPACE : C_VAL;

    if (isReveal) {
      const glowing = role === "value" && frame >= REVEAL_SPLIT2;
      // 정답 공개: 역할별 색 + 하이라이트
      return (
        <span
          style={{
            color,
            fontWeight: 700,
            background: `${color}28`,
            borderRadius: 4,
            padding: "1px 5px",
            outline: `1.5px solid ${color}66`,
            boxShadow: glowing
              ? `0 0 ${interpolate(valueGlow, [0, 1], [0, 18], { extrapolateRight: "clamp" })}px ${C_VAL}88, 0 0 ${interpolate(valueGlow, [0, 1], [0, 40], { extrapolateRight: "clamp" })}px ${C_VAL}44`
              : "none",
          }}
        >
          age
        </span>
      );
    }

    if (role === "space" && showPulse) {
      // 질문 단계: 왼쪽 age 펄싱 흰색 하이라이트 (정답 색 노출 없이)
      return (
        <span
          style={{
            color: "#ffffff",
            fontWeight: 700,
            background: `rgba(255,255,255,0.10)`,
            borderRadius: 4,
            padding: "1px 5px",
            outline: `2px solid rgba(255,255,255,${pulseAlpha.toFixed(2)})`,
          }}
        >
          age
        </span>
      );
    }

    // 중립 (오른쪽 age, 발화 전)
    return (
      <span style={{ color: C_AGE, borderRadius: 4, padding: "1px 5px" }}>
        age
      </span>
    );
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneTitle title="5. 해석 퀴즈" />
          {/* 오디오: 문제 */}
          <Sequence durationInFrames={qDur}>
            <SceneAudio src={qCfg.audio} />
          </Sequence>
          {/* 오디오: 정답 */}
          <Sequence from={REVEAL_START}>
            <SceneAudio src={rCfg.audio} />
          </Sequence>

          {/* Quiz 라벨 */}
          {frame >= qCfg.speechStartFrame && !isReveal && (
            <div
              style={{
                position: "absolute",
                top: 180,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: uiFont,
                fontSize: 48,
                fontWeight: 900,
                color: "#f5c842",
                letterSpacing: 6,
              }}
            >
              QUIZ
            </div>
          )}

          {/* 정답 라벨 */}
          {isReveal && (
            <div
              style={{
                position: "absolute",
                top: 180,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: uiFont,
                fontSize: 48,
                fontWeight: 900,
                color: C_TEAL,
                letterSpacing: 6,
                opacity: revealAnim,
              }}
            >
              정답
            </div>
          )}

          {/* 코드 블록: int age = 4; / age = age + 2; */}
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#252525",
              borderRadius: 20,
              padding: "36px 56px",
              boxShadow: "0 6px 40px rgba(0,0,0,0.45)",
            }}
          >
            {/* Line 1: int age = 4; */}
            <div
              style={{
                ...monoStyle,
                fontSize: 38,
                color: TEXT,
                opacity: 0.5,
                marginBottom: 4,
              }}
            >
              <span style={{ color: C_TEAL }}>int</span>
              <span style={{ color: C_VAR }}> age</span>
              <span> = </span>
              <span style={{ color: C_NUMBER }}>4</span>
              <span>;</span>
            </div>

            {/* Line 2: age = age + 2; — 코드 + 어노테이션 */}
            <div
              style={{
                ...monoStyle,
                fontSize: 38,
                color: TEXT,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              {/* 왼쪽 age + ↑공간 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {ageSpan("space")}
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.label,
                    color: C_SPACE,
                    lineHeight: 1.3,
                    textAlign: "center",
                    marginTop: 6,
                    opacity: isReveal ? revealAnim : 0,
                  }}
                >
                  ↑<br />
                  공간
                </div>
              </div>

              {/* = */}
              <span style={{ alignSelf: "flex-start", margin: "0 8px" }}>
                =
              </span>

              {/* 오른쪽 age + ↑값 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {ageSpan("value")}
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.label,
                    color: C_VAL,
                    lineHeight: 1.3,
                    textAlign: "center",
                    marginTop: 6,
                    opacity: isReveal ? revealAnim : 0,
                  }}
                >
                  ↑<br />값 (= 4)
                </div>
              </div>

              {/* + 2; */}
              <span
                style={{
                  alignSelf: "flex-start",
                  color: TEXT,
                  margin: "0 8px",
                }}
              >
                +
              </span>
              <span style={{ alignSelf: "flex-start", color: C_NUMBER }}>
                2
              </span>
              <span style={{ alignSelf: "flex-start" }}>;</span>
            </div>
          </div>

          {/* 카운트다운 */}
          {isCountdown && (
            <div
              style={{
                position: "absolute",
                top: "60%",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  ...monoStyle,
                  fontSize: 120,
                  fontWeight: 700,
                  color: "#f5c842",
                  opacity: 0.9,
                }}
              >
                {secondsLeft}
              </div>
              <div
                style={{
                  width: 500,
                  height: 8,
                  background: "#333",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${cdProgress * 100}%`,
                    height: "100%",
                    background: "#f5c842",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          )}
        </ContentArea>
      </AbsoluteFill>

      {/* 자막: 문제 */}
      <Sequence durationInFrames={qDur}>
        <Subtitle
          sentences={qCfg.narration}
          splits={[]}
          speechStart={qCfg.speechStartFrame}
          wordFrames={AUDIO_CONFIG.interpretQuiz.wordStartFrames}
        />
      </Sequence>
      {/* 자막: 정답 */}
      <Sequence from={REVEAL_START}>
        <Subtitle
          sentences={rCfg.narration}
          splits={rCfg.narrationSplits as unknown as number[]}
          speechStart={rCfg.speechStartFrame}
          wordFrames={AUDIO_CONFIG.interpretReveal.wordStartFrames}
        />
      </Sequence>
    </>
  );
};

const PrintScene: React.FC = () => {
  const opacity = useFade(print.durationInFrames, { out: false });
  const newLine = print.code.find((l) => l.isNew)!;
  const s = AUDIO_CONFIG.print.speechStartFrame;
  const consoleStart = typingDone(newLine.text.length, s);
  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={print.audio} />
          <SceneTitle title={`6. ${print.title}`} />
          <CodeBox lines={print.code} startFrame={s} />
          <ConsoleOutput text={print.consoleOutput} startFrame={consoleStart} />
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={print.narration}
        splits={print.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.print.wordStartFrames}
      />
    </>
  );
};

// ── Composition ───────────────────────────────────────────────
const mergedSceneList = [
  { durationInFrames: thumbnail.durationInFrames },
  { durationInFrames: intro.durationInFrames },
  { durationInFrames: COMBINED_DURATION },
  { durationInFrames: interpret.durationInFrames },
  { durationInFrames: QUIZ_TOTAL_DURATION },
  { durationInFrames: print.durationInFrames },
];
let _from = 0;
const fromValues = mergedSceneList.map((s, i) => {
  const f = _from;
  const overlap =
    i === 0 ? THUMB_CROSS : i < mergedSceneList.length - 1 ? CROSS : 0;
  _from += s.durationInFrames - overlap;
  return f;
});
const totalDuration = _from;

// ── SRT 데이터 (scripts/srt.ts 에서 사용) ────────────────────
/** 절대 프레임 기준 자막 큐 목록 — srt.ts가 읽어서 .srt 파일 생성 */
export const SRT_DATA: SrtEntry[] = (() => {
  const sceneDurations = [
    thumbnail.durationInFrames,
    intro.durationInFrames,
    COMBINED_DURATION,
    interpret.durationInFrames,
    QUIZ_TOTAL_DURATION,
    print.durationInFrames,
  ];
  const froms = computeFromValues(sceneDurations, {
    cross: CROSS,
    firstOverlap: THUMB_CROSS,
  });

  // froms[2] = CombinedDeclarationInitScene (declaration + initialization)
  // declaration: offset = froms[2], initialization: offset = froms[2] + SPLIT - SCENE_TAIL_FRAMES
  // (initialization 오디오가 SPLIT-SCENE_TAIL_FRAMES 에서 시작)
  const SPLIT = declaration.durationInFrames;
  const qDur = interpretQuiz.durationInFrames;
  const REVEAL_START = qDur + QUIZ_THINKING_FRAMES;
  return buildSrtData([
    {
      offset: froms[1],
      narration: intro.narration,
      speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.intro.sentenceEndFrames,
      sceneDuration: intro.durationInFrames,
    },
    {
      offset: froms[2],
      narration: declaration.narration,
      speechStartFrame: AUDIO_CONFIG.declaration.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.declaration.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.declaration.sentenceEndFrames,
      sceneDuration: SPLIT,
    },
    {
      offset: froms[2] + SPLIT - SCENE_TAIL_FRAMES,
      narration: initialization.narration,
      speechStartFrame: AUDIO_CONFIG.initialization.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.initialization.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.initialization.sentenceEndFrames,
      sceneDuration: initialization.durationInFrames,
    },
    {
      offset: froms[3],
      narration: interpret.narration,
      speechStartFrame: AUDIO_CONFIG.interpret.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.interpret.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.interpret.sentenceEndFrames,
      sceneDuration: interpret.durationInFrames,
    },
    {
      offset: froms[4],
      narration: interpretQuiz.narration,
      speechStartFrame: AUDIO_CONFIG.interpretQuiz.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.interpretQuiz.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.interpretQuiz.sentenceEndFrames,
      sceneDuration: qDur,
    },
    {
      offset: froms[4] + REVEAL_START,
      narration: interpretReveal.narration,
      speechStartFrame: AUDIO_CONFIG.interpretReveal.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.interpretReveal.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.interpretReveal.sentenceEndFrames,
      sceneDuration: interpretReveal.durationInFrames,
    },
    {
      offset: froms[5],
      narration: print.narration,
      speechStartFrame: AUDIO_CONFIG.print.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.print.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.print.sentenceEndFrames,
      sceneDuration: print.durationInFrames,
    },
  ]);
})();

export const SRT_DATA_EN: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...ENG_CONTENT.intro.narration,
  ...ENG_CONTENT.declaration.narration,
  ...ENG_CONTENT.initialization.narration,
  ...ENG_CONTENT.interpret.narration,
  ...ENG_CONTENT.interpretQuiz.narration,
  ...ENG_CONTENT.interpretReveal.narration,
  ...ENG_CONTENT.print.narration,
]);

export const SRT_TRACKS: SrtTracks = {
  "ko-KR": SRT_DATA,
  "en-US": SRT_DATA_EN,
};

// ── 자동 등록용 메타 (Root.tsx 가 이 값을 읽어 Composition 을 생성) ─
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

export const JavaVariables: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence from={fromValues[1]} durationInFrames={intro.durationInFrames}>
      <IntroScene />
    </Sequence>
    <Sequence from={fromValues[2]} durationInFrames={COMBINED_DURATION}>
      <CombinedDeclarationInitScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={interpret.durationInFrames}
    >
      <InterpretScene />
    </Sequence>
    <Sequence from={fromValues[4]} durationInFrames={QUIZ_TOTAL_DURATION}>
      <QuizScene />
    </Sequence>
    <Sequence from={fromValues[5]} durationInFrames={print.durationInFrames}>
      <PrintScene />
    </Sequence>
  </AbsoluteFill>
);

// Root.tsx 가 require.context 로 동적 로드할 때 사용하는 표준 export
export { JavaVariables as Component };

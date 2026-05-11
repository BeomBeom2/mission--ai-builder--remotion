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
import { CONTENT } from "./007-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./007-3-audio.gen";
import {
  BG,
  BG_CODE,
  BG_THUMB,
  C_AMBER,
  C_COMMENT,
  C_DIM,
  C_FUNC,
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
  fieldDefineScene: {
    audio: "fm-fieldDefineScene.mp3",
    durationInFrames: getAudioScene("fieldDefineScene").durationInFrames,
    speechStartFrame: getAudioScene("fieldDefineScene").speechStartFrame,
    narration: CONTENT.fieldDefineScene.narration as string[],
    narrationSplits: getAudioScene("fieldDefineScene").narrationSplits,
  },
  objectFieldScene: {
    audio: "fm-objectFieldScene.mp3",
    durationInFrames: getAudioScene("objectFieldScene").durationInFrames,
    speechStartFrame: getAudioScene("objectFieldScene").speechStartFrame,
    narration: CONTENT.objectFieldScene.narration as string[],
    narrationSplits: getAudioScene("objectFieldScene").narrationSplits,
  },
  instanceVarScene: {
    audio: "fm-instanceVarScene.mp3",
    durationInFrames: getAudioScene("instanceVarScene").durationInFrames,
    speechStartFrame: getAudioScene("instanceVarScene").speechStartFrame,
    narration: CONTENT.instanceVarScene.narration as string[],
    narrationSplits: getAudioScene("instanceVarScene").narrationSplits,
  },
  methodScene: {
    audio: "fm-methodScene.mp3",
    durationInFrames: getAudioScene("methodScene").durationInFrames,
    speechStartFrame: getAudioScene("methodScene").speechStartFrame,
    narration: CONTENT.methodScene.narration as string[],
    narrationSplits: getAudioScene("methodScene").narrationSplits,
  },
  nounVerbScene: {
    audio: "fm-nounVerbScene.mp3",
    durationInFrames: getAudioScene("nounVerbScene").durationInFrames,
    speechStartFrame: getAudioScene("nounVerbScene").speechStartFrame,
    narration: CONTENT.nounVerbScene.narration as string[],
    narrationSplits: getAudioScene("nounVerbScene").narrationSplits,
  },
  summaryScene: {
    audio: "fm-summaryScene.mp3",
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

const codeBoxStyle: React.CSSProperties = {
  background: BG_CODE,
  borderRadius: 12,
  padding: "20px 32px",
  whiteSpace: "pre-wrap",
  ...monoStyle,
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

/* ── FieldDefineScene ── */

const FieldDefineScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.fieldDefineScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("fieldDefineScene").wordStartFrames;

  // 클래스 코드 등장
  const codeAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  // "정의한다" 강조 — 2번째 문장 시작
  const split1 = (cfg.narrationSplits[0] ?? d * 0.5) as number;
  const defineHighlight = interpolate(
    frame,
    [split1, split1 + 12, d - 30, d - 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // X 표시 (엄밀히 틀림) — 1번째 문장 중반
  const xAppear = spring({
    frame: frame - cfg.speechStartFrame - 20,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  // "객체" 강조 — 2번째 문장
  const objHighlight = interpolate(
    frame,
    [split1 + 8, split1 + 20, d - 30, d - 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const codeScale = interpolate(codeAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 필드를 정의 vs 가진다" />

          {/* 클래스 코드 */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              width: 860,
            }}
          >
            <div
              style={{
                ...codeBoxStyle,
                fontSize: 28,
                lineHeight: 1.8,
                color: TEXT,
              }}
            >
              <span style={{ color: C_KEYWORD }}>class</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              {" {"}
              <br />
              {"  "}
              <span style={{ color: C_TYPE }}>int</span>{" "}
              <span style={{ color: C_VAR }}>id</span>;
              <br />
              {"  "}
              <span style={{ color: C_TYPE }}>int</span>{" "}
              <span style={{ color: C_VAR }}>age</span>;
              <br />
              {"  "}
              <span style={{ color: C_TYPE }}>int</span>{" "}
              <span style={{ color: C_VAR }}>height</span>;
              <br />
              {"}"}
            </div>
          </div>

          {/* 클래스는 필드를 "가진다" — X */}
          <div
            style={{
              position: "absolute",
              top: "58%",
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
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: codeAppear,
              }}
            >
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  color: TEXT,
                }}
              >
                클래스는 필드를{" "}
                <span style={{ color: C_PAIN, fontWeight: 800 }}>가진다</span>
              </span>
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: 44,
                  fontWeight: 900,
                  color: C_PAIN,
                  opacity: xAppear,
                }}
              >
                ✗
              </span>
            </div>

            {/* 클래스는 필드를 "정의한다" — O */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: defineHighlight,
              }}
            >
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  color: TEXT,
                }}
              >
                클래스는 필드를{" "}
                <span style={{ color: C_TEAL, fontWeight: 800 }}>정의한다</span>
              </span>
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: 44,
                  fontWeight: 900,
                  color: C_TEAL,
                  opacity: defineHighlight,
                }}
              >
                ✓
              </span>
            </div>

            {/* 객체는 필드를 가진다 — O */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: objHighlight,
              }}
            >
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  color: TEXT,
                }}
              >
                <span style={{ color: C_VAR, fontWeight: 800 }}>객체</span>는
                필드를{" "}
                <span style={{ color: C_TEAL, fontWeight: 800 }}>가진다</span>
              </span>
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: 44,
                  fontWeight: 900,
                  color: C_TEAL,
                }}
              >
                ✓
              </span>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={wordFrames}
      />
    </>
  );
};

/* ── ObjectFieldScene ── */

const ObjectFieldScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.objectFieldScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const audioScene = getAudioScene("objectFieldScene");
  const wordFrames = audioScene.wordStartFrames;
  const wordTiming = audioScene.wordTiming;

  // 클래스 틀(왼쪽)
  const classAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  // 화살표 + 객체(오른쪽)
  const objAppear = spring({
    frame: frame - cfg.speechStartFrame - 15,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  // 힙 강조
  const split1 = (cfg.narrationSplits[0] ?? d * 0.5) as number;
  const heapGlow = interpolate(
    frame,
    [cfg.speechStartFrame, cfg.speechStartFrame + 15, split1 + 10, split1 + 22],
    [0, 0.3, 0.3, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const classScale = interpolate(classAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const objScale = interpolate(objAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fieldRows = [
    { type: "int", name: "id", val: "1" },
    { type: "int", name: "age", val: "20" },
    { type: "int", name: "height", val: "170" },
  ];

  // "필드 공간" 발화 시 필드 행 하이라이트
  const fieldHighlightStart = wordTiming["필드"]?.[0] ?? 173;
  const fieldHighlightFade = interpolate(
    frame,
    [fieldHighlightStart + 50, fieldHighlightStart + 70],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 객체가 필드를 가진다" />

          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
            }}
          >
            {/* 클래스 정의 */}
            <div
              style={{
                opacity: classAppear,
                transform: `scale(${classScale})`,
                ...panelStyle,
                width: 700,
                border: `2px solid ${C_TEAL}55`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  left: 18,
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: BG,
                  border: `1px solid ${C_TEAL}44`,
                  fontFamily: uiFont,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: C_TEAL,
                }}
              >
                CLASS (정의)
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 26,
                  lineHeight: 1.8,
                  color: TEXT,
                  whiteSpace: "pre-wrap",
                }}
              >
                <span style={{ color: C_KEYWORD }}>class</span>{" "}
                <span style={{ color: C_TEAL }}>Person</span>
                {" {\n"}
                {"    "}
                <span style={{ color: C_TYPE }}>int</span> id;{"\n"}
                {"    "}
                <span style={{ color: C_TYPE }}>int</span> age;{"\n"}
                {"    "}
                <span style={{ color: C_TYPE }}>int</span> height;{"\n"}
                {"}"}
              </div>
            </div>

            {/* 화살표 */}
            <div
              style={{
                opacity: objAppear,
                ...monoStyle,
                fontSize: 28,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: C_TEAL, fontSize: 22 }}>▼</span>
              <span style={{ color: C_KEYWORD }}>new</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              <span style={{ color: TEXT }}>()</span>
            </div>

            {/* 힙 객체 */}
            <div
              style={{
                opacity: objAppear,
                transform: `scale(${objScale})`,
                ...panelStyle,
                width: 700,
                border: `2px solid ${C_VAR}55`,
                boxShadow: `0 0 ${30 + heapGlow * 20}px ${C_VAR}${Math.round(
                  heapGlow * 40,
                )
                  .toString(16)
                  .padStart(2, "0")}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  left: 18,
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: BG,
                  border: `1px solid ${C_VAR}44`,
                  fontFamily: uiFont,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: C_VAR,
                }}
              >
                HEAP (객체)
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {fieldRows.map((row, i) => {
                  const rowAppear = spring({
                    frame: frame - cfg.speechStartFrame - 20 - i * 6,
                    fps,
                    config: { damping: 13, stiffness: 140 },
                    durationInFrames: 24,
                  });
                  const rowHL =
                    spring({
                      frame: frame - fieldHighlightStart - i * 4,
                      fps,
                      config: { damping: 12, stiffness: 140 },
                      durationInFrames: 20,
                    }) * fieldHighlightFade;
                  return (
                    <div
                      key={row.name}
                      style={{
                        opacity: rowAppear,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        ...monoStyle,
                        fontSize: 28,
                        padding: "6px 14px",
                        borderRadius: 8,
                        background: `rgba(156,220,254,${rowHL * 0.12})`,
                        boxShadow:
                          rowHL > 0.01
                            ? `0 0 ${12 + rowHL * 10}px rgba(156,220,254,${rowHL * 0.3})`
                            : "none",
                      }}
                    >
                      <span style={{ color: C_TYPE }}>{row.type}</span>
                      <span style={{ color: C_VAR, fontWeight: 700 }}>
                        {row.name}
                      </span>
                      <span style={{ color: C_DIM }}>=</span>
                      <span style={{ color: C_NUMBER }}>{row.val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={wordFrames}
      />
    </>
  );
};

/* ── InstanceVarScene ── */

const InstanceVarScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.instanceVarScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("instanceVarScene").wordStartFrames;

  const appear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  const split1 = (cfg.narrationSplits[0] ?? d * 0.5) as number;
  const approxAppear = interpolate(frame, [split1, split1 + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 필드 ≈ 인스턴스 변수" />

          <div
            style={{
              position: "absolute",
              top: "28%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 50,
            }}
          >
            {/* 큰 원: 필드 */}
            <div
              style={{
                opacity: appear,
                position: "relative",
                width: 500,
                height: 500,
                borderRadius: "50%",
                border: `3px solid ${C_TEAL}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  fontFamily: uiFont,
                  fontSize: FONT.heading,
                  fontWeight: 800,
                  color: C_TEAL,
                }}
              >
                필드
              </div>

              {/* 작은 원: 인스턴스 변수 */}
              <div
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  border: `3px solid ${C_VAR}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 40,
                }}
              >
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.label,
                    fontWeight: 700,
                    color: C_VAR,
                    textAlign: "center",
                  }}
                >
                  인스턴스
                  <br />
                  변수
                </div>
              </div>
            </div>

            {/* ≈ 표시 */}
            <div
              style={{
                opacity: approxAppear,
                fontFamily: uiFont,
                fontSize: FONT.title,
                fontWeight: 900,
                color: C_TEAL,
                textAlign: "center",
              }}
            >
              지금은 같다고 생각해도 OK
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={wordFrames}
      />
    </>
  );
};

/* ── MethodScene ── */

const MethodScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.methodScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("methodScene").wordStartFrames;

  const codeAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  const split1 = (cfg.narrationSplits[0] ?? d * 0.5) as number;

  // 메서드 부분 강조
  const methodGlow = interpolate(
    frame,
    [split1, split1 + 12, d - 30, d - 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 라벨 등장
  const labelAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  const codeScale = interpolate(codeAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 메서드" />

          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              width: 860,
            }}
          >
            <div
              style={{
                ...codeBoxStyle,
                fontSize: 26,
                lineHeight: 2,
                color: TEXT,
              }}
            >
              <span style={{ color: C_KEYWORD }}>class</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              {" {"}
              <br />
              <br />
              {"  "}
              <span style={{ color: C_COMMENT }}>// 필드</span>
              <br />
              {"  "}
              <span style={{ color: C_TYPE }}>int</span>{" "}
              <span style={{ color: C_VAR }}>id</span>;
              <br />
              {"  "}
              <span style={{ color: C_TYPE }}>int</span>{" "}
              <span style={{ color: C_VAR }}>age</span>;
              <br />
              <br />
              {/* 메서드 영역 */}
              <span
                style={{
                  background:
                    methodGlow > 0.05
                      ? `${C_FUNC}${Math.round(methodGlow * 15)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 8,
                  padding: "4px 8px",
                }}
              >
                {"  "}
                <span style={{ color: C_COMMENT }}>// 메서드</span>
                <br />
                {"  "}
                <span style={{ color: C_KEYWORD }}>void</span>{" "}
                <span style={{ color: C_FUNC }}>sayHello</span>
                {"() {"}
                <br />
                {"    "}
                <span style={{ color: C_VAR }}>System.out.println</span>
                {"("}
                <span style={{ color: C_STRING }}>&quot;안녕하세요&quot;</span>
                {");"}
                <br />
                {"  }"}
              </span>
              <br />
              {"}"}
            </div>
          </div>

          {/* 클래스 안의 함수 = 메서드 */}
          <div
            style={{
              position: "absolute",
              bottom: "16%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: labelAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: C_FUNC,
              textAlign: "center",
            }}
          >
            클래스 안의 함수 = 메서드
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={wordFrames}
      />
    </>
  );
};

/* ── NounVerbScene ── */

const NounVerbScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.nounVerbScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const audioScene = getAudioScene("nounVerbScene");
  const wordFrames = audioScene.wordStartFrames;
  const wt = audioScene.wordTiming;

  const splits = cfg.narrationSplits;
  const split1 = (splits[0] ?? 140) as number; // 문장2: 현실세계 존재들은...
  const split2 = (splits[1] ?? 411) as number; // 문장3: 변호사는...
  const split3 = (splits[2] ?? 843) as number; // 문장4: 자동차도...
  const split4 = (splits[3] ?? 1282) as number; // 문장5: 객체를 기준으로...

  /* ── Phase 1: 현실세계 예시 카드 (문장 2~4) ── */
  const exAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });
  const exScale = interpolate(exAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 문장5 시작 시 퇴장
  const exExit = interpolate(frame, [split4 - 20, split4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exOp = exAppear * exExit;

  // 변호사 카드 하이라이트 (문장3)
  const lawyerHLStart = wt["변호사는"]?.[0] ?? split2;
  const lawyerHL = spring({
    frame: frame - lawyerHLStart,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 20,
  });
  const lawyerHLFade = interpolate(frame, [split3 - 20, split3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 자동차 카드 하이라이트 (문장4)
  const carHLStart = wt["자동차도"]?.[0] ?? split3;
  const carHL = spring({
    frame: frame - carHLStart,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 20,
  });
  const carHLFade = interpolate(frame, [split4 - 20, split4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Phase 2: 필드/메서드 카드 (문장 5) ── */
  const codeAppear = spring({
    frame: frame - split4,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });
  const codeScale = interpolate(codeAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 필드/메서드 발화 하이라이트
  const fieldHLStart = wt["필드는"]?.[0] ?? 1366;
  const methodHLStart = wt["메서드는"]?.[0] ?? 1429;
  const fieldHL = spring({
    frame: frame - fieldHLStart,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 20,
  });
  const methodHL = spring({
    frame: frame - methodHLStart,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 20,
  });

  // "명사적인" / "동사적인" 발화 하이라이트 (문장2)
  const nounHLStart = wt["명사적인"]?.[0] ?? 211;
  const verbHLStart = wt["동사적인"]?.[0] ?? 272;
  const nounHL = spring({
    frame: frame - nounHLStart,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 20,
  });
  const verbHL = spring({
    frame: frame - verbHLStart,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 20,
  });

  const cardStyle: React.CSSProperties = {
    ...panelStyle,
    width: 400,
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 16,
    padding: "32px 28px",
  };

  // 단어별 발화 프레임 (변호사/자동차 항목)
  const itemFrameMap: Record<string, number> = {
    // 변호사 명사
    이름: wt["이름"]?.[0] ?? 446,
    소속: wt["소속"]?.[0] ?? 481,
    전문분야: wt["전문분야"]?.[0] ?? 518,
    // 변호사 동사
    변론하다: wt["변론하다"]?.[0] ?? 636,
    상담하다: wt["상담하다"]?.[0] ?? 689,
    // 자동차 명사
    브랜드: wt["브랜드"]?.[0] ?? 875,
    색상: wt["색상"]?.[0] ?? 917,
    속도: wt["속도"]?.[0] ?? 959,
    // 자동차 동사
    달리다: wt["달리다"]?.[0] ?? 1060,
    멈추다: wt["멈추다"]?.[0] ?? 1113,
  };

  const exExamples = [
    {
      name: "철수",
      color: C_TEAL,
      nouns: ["이름", "나이", "키"],
      verbs: ["걷다", "말하다", "먹다"],
    },
    {
      name: "고양이",
      color: C_AMBER,
      nouns: ["이름", "색깔", "무게"],
      verbs: ["야옹", "점프", "잠자기"],
    },
    {
      name: "변호사",
      color: C_PURPLE,
      nouns: ["이름", "소속", "전문분야"],
      verbs: ["변론하다", "상담하다", "계약하다"],
    },
    {
      name: "자동차",
      color: C_STRING,
      nouns: ["브랜드", "색상", "속도"],
      verbs: ["달리다", "멈추다", "경적울리다"],
    },
  ];

  // 밑줄 진행도 (0~1): 해당 카드의 아이템이 발화되면 밑줄 등장
  const getUnderlineProgress = (cardName: string, item: string) => {
    const key = cardName === "변호사" || cardName === "자동차" ? item : null;
    if (!key || !(key in itemFrameMap)) return 0;
    const start = itemFrameMap[key];
    return spring({
      frame: frame - start,
      fps,
      config: { damping: 14, stiffness: 200 },
      durationInFrames: 18,
    });
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 명사와 동사" />

          {/* ── 현실세계 예시 카드 ── */}
          <div
            style={{
              position: "absolute",
              top: "14%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${exScale})`,
              opacity: exOp,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            {exExamples.map((ex) => {
              const hl =
                ex.name === "변호사"
                  ? lawyerHL * lawyerHLFade
                  : ex.name === "자동차"
                    ? carHL * carHLFade
                    : 0;
              return (
                <div
                  key={ex.name}
                  style={{
                    ...panelStyle,
                    width: 400,
                    border: `2px solid ${ex.color}${hl > 0.01 ? "88" : "44"}`,
                    padding: "24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 20,
                    boxShadow:
                      hl > 0.01
                        ? `0 0 ${20 + hl * 20}px ${ex.color}${Math.round(
                            30 + hl * 50,
                          )
                            .toString(16)
                            .padStart(2, "0")}`
                        : "none",
                  }}
                >
                  {/* 존재 이름 라벨 */}
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: FONT.heading,
                      fontWeight: 900,
                      color: ex.color,
                    }}
                  >
                    {ex.name}
                  </div>

                  {/* 내부 카드 2개 (위/아래) */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      width: "100%",
                    }}
                  >
                    {/* 명사적 요소 */}
                    <div
                      style={{
                        flex: 1,
                        background: `${C_VAR}0a`,
                        border: `1.5px solid ${C_VAR}44`,
                        borderRadius: 10,
                        padding: "14px 12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        boxShadow:
                          nounHL > 0.01
                            ? `0 0 ${14 + nounHL * 14}px ${C_VAR}${Math.round(
                                20 + nounHL * 35,
                              )
                                .toString(16)
                                .padStart(2, "0")}`
                            : "none",
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
                        명사적 요소
                      </div>
                      {ex.nouns.map((n) => {
                        const ulP = getUnderlineProgress(ex.name, n);
                        return (
                          <div
                            key={n}
                            style={{
                              fontFamily: uiFont,
                              fontSize: 20,
                              color: TEXT,
                              lineHeight: 1.5,
                              position: "relative",
                              paddingBottom: 3,
                            }}
                          >
                            {n}
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: 2,
                                background: C_VAR,
                                transform: `scaleX(${ulP})`,
                                transformOrigin: "left",
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* 동사적 요소 */}
                    <div
                      style={{
                        flex: 1,
                        background: `${C_FUNC}0a`,
                        border: `1.5px solid ${C_FUNC}44`,
                        borderRadius: 10,
                        padding: "14px 12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        boxShadow:
                          verbHL > 0.01
                            ? `0 0 ${14 + verbHL * 14}px ${C_FUNC}${Math.round(
                                20 + verbHL * 35,
                              )
                                .toString(16)
                                .padStart(2, "0")}`
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: uiFont,
                          fontSize: 20,
                          fontWeight: 700,
                          color: C_FUNC,
                        }}
                      >
                        동사적 요소
                      </div>
                      {ex.verbs.map((v) => {
                        const ulP = getUnderlineProgress(ex.name, v);
                        return (
                          <div
                            key={v}
                            style={{
                              fontFamily: uiFont,
                              fontSize: 20,
                              color: TEXT,
                              lineHeight: 1.5,
                              position: "relative",
                              paddingBottom: 3,
                            }}
                          >
                            {v}
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: 2,
                                background: C_FUNC,
                                transform: `scaleX(${ulP})`,
                                transformOrigin: "left",
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 필드 = 명사, 메서드 = 동사 카드 ── */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              display: "flex",
              gap: 40,
            }}
          >
            {/* 필드 = 명사 */}
            <div
              style={{
                ...cardStyle,
                border: `2px solid ${C_VAR}55`,
                boxShadow:
                  fieldHL > 0.01
                    ? `0 0 ${30 + fieldHL * 20}px ${C_VAR}${Math.round(
                        30 + fieldHL * 40,
                      )
                        .toString(16)
                        .padStart(2, "0")}`
                    : `0 0 30px ${C_VAR}18`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.display,
                  fontWeight: 900,
                  color: C_VAR,
                }}
              >
                필드
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.title,
                  fontWeight: 700,
                  color: TEXT,
                }}
              >
                명사
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  color: C_DIM,
                  lineHeight: 1.6,
                }}
              >
                상태
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 24,
                  color: C_VAR,
                  lineHeight: 1.6,
                }}
              >
                id, age, height
              </div>
            </div>

            {/* 메서드 = 동사 */}
            <div
              style={{
                ...cardStyle,
                border: `2px solid ${C_FUNC}55`,
                boxShadow:
                  methodHL > 0.01
                    ? `0 0 ${30 + methodHL * 20}px ${C_FUNC}${Math.round(
                        30 + methodHL * 40,
                      )
                        .toString(16)
                        .padStart(2, "0")}`
                    : `0 0 30px ${C_FUNC}18`,
              }}
            >
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.display,
                  fontWeight: 900,
                  color: C_FUNC,
                }}
              >
                메서드
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.title,
                  fontWeight: 700,
                  color: TEXT,
                }}
              >
                동사
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: FONT.label,
                  color: C_DIM,
                  lineHeight: 1.6,
                }}
              >
                행동
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 24,
                  color: C_FUNC,
                  lineHeight: 1.6,
                }}
              >
                sayHello()
              </div>
            </div>
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={wordFrames}
      />
    </>
  );
};

/* ── SummaryScene ── */

const SummaryScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.summaryScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("summaryScene").wordStartFrames;
  const splits = cfg.narrationSplits;

  const cards = [
    {
      text: "클래스는 필드를 정의한다",
      color: C_TEAL,
      startFrame: splits[0] ?? cfg.speechStartFrame + 10,
    },
    {
      text: "클래스 안의 함수 = 메서드",
      color: C_FUNC,
      startFrame: splits[1] ?? cfg.speechStartFrame + 40,
    },
    {
      text: "필드 = 명사 · 메서드 = 동사",
      color: C_VAR,
      startFrame: splits[2] ?? cfg.speechStartFrame + 70,
    },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="6. 정리" />

          <div
            style={{
              position: "absolute",
              top: "25%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              flexDirection: "column",
              gap: 32,
              width: 840,
            }}
          >
            {cards.map((card, i) => {
              const appear = spring({
                frame: frame - (card.startFrame as number),
                fps,
                config: { damping: 13, stiffness: 130 },
                durationInFrames: 26,
              });
              const scale = interpolate(appear, [0, 1], [0.85, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: appear,
                    transform: `scale(${scale})`,
                    ...panelStyle,
                    border: `2px solid ${card.color}55`,
                    boxShadow: `0 0 24px ${card.color}18`,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `${card.color}22`,
                      border: `2px solid ${card.color}88`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: uiFont,
                      fontSize: 18,
                      fontWeight: 900,
                      color: card.color,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: uiFont,
                      fontSize: FONT.heading,
                      fontWeight: 700,
                      color: TEXT,
                    }}
                  >
                    {card.text}
                  </div>
                </div>
              );
            })}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={wordFrames}
      />
    </>
  );
};

/* ─── Composition ─── */

const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.fieldDefineScene,
  VIDEO_CONFIG.objectFieldScene,
  VIDEO_CONFIG.instanceVarScene,
  VIDEO_CONFIG.methodScene,
  VIDEO_CONFIG.nounVerbScene,
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
    narration: CONTENT.fieldDefineScene.narration as string[],
    speechStartFrame: getAudioScene("fieldDefineScene").speechStartFrame,
    narrationSplits: getAudioScene("fieldDefineScene").narrationSplits,
    sentenceEndFrames: getAudioScene("fieldDefineScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.fieldDefineScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.objectFieldScene.narration as string[],
    speechStartFrame: getAudioScene("objectFieldScene").speechStartFrame,
    narrationSplits: getAudioScene("objectFieldScene").narrationSplits,
    sentenceEndFrames: getAudioScene("objectFieldScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.objectFieldScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.instanceVarScene.narration as string[],
    speechStartFrame: getAudioScene("instanceVarScene").speechStartFrame,
    narrationSplits: getAudioScene("instanceVarScene").narrationSplits,
    sentenceEndFrames: getAudioScene("instanceVarScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.instanceVarScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.methodScene.narration as string[],
    speechStartFrame: getAudioScene("methodScene").speechStartFrame,
    narrationSplits: getAudioScene("methodScene").narrationSplits,
    sentenceEndFrames: getAudioScene("methodScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.methodScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: CONTENT.nounVerbScene.narration as string[],
    speechStartFrame: getAudioScene("nounVerbScene").speechStartFrame,
    narrationSplits: getAudioScene("nounVerbScene").narrationSplits,
    sentenceEndFrames: getAudioScene("nounVerbScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.nounVerbScene.durationInFrames,
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

const JavaFieldMethod: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.fieldDefineScene.durationInFrames}
    >
      <FieldDefineScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.objectFieldScene.durationInFrames}
    >
      <ObjectFieldScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.instanceVarScene.durationInFrames}
    >
      <InstanceVarScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.methodScene.durationInFrames}
    >
      <MethodScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.nounVerbScene.durationInFrames}
    >
      <NounVerbScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaFieldMethod;

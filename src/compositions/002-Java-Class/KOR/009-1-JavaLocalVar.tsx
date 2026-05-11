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
import { CONTENT } from "./009-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./009-3-audio.gen";
import {
  BG,
  BG_CODE,
  BG_THUMB,
  C_COMMENT,
  C_DIM,
  C_FUNC,
  C_KEYWORD,
  C_NUMBER,
  C_PAIN,
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
  instanceVarScene: {
    audio: "lv-instanceVarScene.mp3",
    durationInFrames: getAudioScene("instanceVarScene").durationInFrames,
    speechStartFrame: getAudioScene("instanceVarScene").speechStartFrame,
    narration: CONTENT.instanceVarScene.narration as string[],
    narrationSplits: getAudioScene("instanceVarScene").narrationSplits,
  },
  localVarScene: {
    audio: "lv-localVarScene.mp3",
    durationInFrames: getAudioScene("localVarScene").durationInFrames,
    speechStartFrame: getAudioScene("localVarScene").speechStartFrame,
    narration: CONTENT.localVarScene.narration as string[],
    narrationSplits: getAudioScene("localVarScene").narrationSplits,
  },
  paramScene: {
    audio: "lv-paramScene.mp3",
    durationInFrames: getAudioScene("paramScene").durationInFrames,
    speechStartFrame: getAudioScene("paramScene").speechStartFrame,
    narration: CONTENT.paramScene.narration as string[],
    narrationSplits: getAudioScene("paramScene").narrationSplits,
  },
  comparisonScene: {
    audio: "lv-comparisonScene.mp3",
    durationInFrames: getAudioScene("comparisonScene").durationInFrames,
    speechStartFrame: getAudioScene("comparisonScene").speechStartFrame,
    narration: CONTENT.comparisonScene.narration as string[],
    narrationSplits: getAudioScene("comparisonScene").narrationSplits,
  },
  exampleScene: {
    audio: "lv-exampleScene.mp3",
    durationInFrames: getAudioScene("exampleScene").durationInFrames,
    speechStartFrame: getAudioScene("exampleScene").speechStartFrame,
    narration: CONTENT.exampleScene.narration as string[],
    narrationSplits: getAudioScene("exampleScene").narrationSplits,
  },
  summaryScene: {
    audio: "lv-summaryScene.mp3",
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
  color: TEXT,
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

/* ── InstanceVarScene ── */

const InstanceVarScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.instanceVarScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("instanceVarScene").wordStartFrames;

  const codeAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });
  const codeScale = interpolate(codeAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const split1 = (cfg.narrationSplits[0] ?? d * 0.5) as number;

  // 인스턴스 변수 하이라이트
  const fieldGlow = spring({
    frame: frame - cfg.speechStartFrame - 10,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  // "어디서든 접근" 강조
  const accessAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 인스턴스 변수" />

          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              width: 860,
            }}
          >
            <div style={{ ...codeBoxStyle, fontSize: 24, lineHeight: 2 }}>
              <span style={{ color: C_KEYWORD }}>class</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              {" {\n"}
              <span
                style={{
                  background:
                    fieldGlow > 0.05
                      ? `${C_VAR}${Math.round(fieldGlow * 12)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 6,
                  padding: "2px 6px",
                }}
              >
                {"  "}
                <span style={{ color: C_TYPE }}>String</span>{" "}
                <span style={{ color: C_VAR }}>name</span>
                {";     "}
                <span style={{ color: C_COMMENT }}>// 인스턴스 변수</span>
                {"\n"}
                {"  "}
                <span style={{ color: C_TYPE }}>int</span>{" "}
                <span style={{ color: C_VAR }}>age</span>
                {";        "}
                <span style={{ color: C_COMMENT }}>// 인스턴스 변수</span>
              </span>
              {"\n\n"}
              {"  "}
              <span style={{ color: C_KEYWORD }}>void</span>{" "}
              <span style={{ color: C_FUNC }}>sayHello</span>
              {"() {\n"}
              {"    "}
              <span style={{ color: C_VAR }}>System.out.println</span>
              {"("}
              <span style={{ color: C_VAR }}>name</span>
              {");  "}
              <span style={{ color: C_COMMENT }}>// ✓ 접근 가능</span>
              {"\n  }\n\n"}
              {"  "}
              <span style={{ color: C_KEYWORD }}>void</span>{" "}
              <span style={{ color: C_FUNC }}>showAge</span>
              {"() {\n"}
              {"    "}
              <span style={{ color: C_VAR }}>System.out.println</span>
              {"("}
              <span style={{ color: C_VAR }}>age</span>
              {");   "}
              <span style={{ color: C_COMMENT }}>// ✓ 접근 가능</span>
              {"\n  }\n}"}
            </div>
          </div>

          {/* 설명 */}
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: accessAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: C_VAR,
              textAlign: "center",
            }}
          >
            객체가 살아있는 동안 유지 · 객체 안 어디서든 접근
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

/* ── LocalVarScene ── */

const LocalVarScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.localVarScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("localVarScene").wordStartFrames;

  const codeAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });
  const codeScale = interpolate(codeAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const split1 = (cfg.narrationSplits[0] ?? d * 0.5) as number;

  // 지역변수 하이라이트
  const localGlow = spring({
    frame: frame - cfg.speechStartFrame - 10,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  // "사라진다" 강조
  const disappearAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 지역변수" />

          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              width: 860,
            }}
          >
            <div style={{ ...codeBoxStyle, fontSize: 24, lineHeight: 2 }}>
              <span style={{ color: C_KEYWORD }}>class</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              {" {\n"}
              {"  "}
              <span style={{ color: C_TYPE }}>String</span>{" "}
              <span style={{ color: C_VAR }}>name</span>
              {";\n\n"}
              {"  "}
              <span style={{ color: C_KEYWORD }}>void</span>{" "}
              <span style={{ color: C_FUNC }}>greet</span>
              {"() {\n"}
              <span
                style={{
                  background:
                    localGlow > 0.05
                      ? `${C_TEAL}${Math.round(localGlow * 12)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 6,
                  padding: "2px 6px",
                }}
              >
                {"    "}
                <span style={{ color: C_TYPE }}>String</span>{" "}
                <span style={{ color: C_TEAL }}>msg</span>
                {" = "}
                <span style={{ color: C_STRING }}>&quot;안녕&quot;</span>
                {";  "}
                <span style={{ color: C_COMMENT }}>// 지역변수</span>
              </span>
              {"\n"}
              {"    "}
              <span style={{ color: C_VAR }}>System.out.println</span>
              {"("}
              <span style={{ color: C_TEAL }}>msg</span>
              {" + "}
              <span style={{ color: C_VAR }}>name</span>
              {");\n"}
              {"  }\n"}
              {"  "}
              <span style={{ color: C_COMMENT }}>// 여기서 msg는 사라짐</span>
              {"\n}"}
            </div>
          </div>

          {/* 설명 */}
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: disappearAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: C_TEAL,
              textAlign: "center",
            }}
          >
            메서드가 끝나면 사라진다
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

/* ── ParamScene ── */

const ParamScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.paramScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("paramScene").wordStartFrames;

  const codeAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });
  const codeScale = interpolate(codeAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const splits = cfg.narrationSplits;
  const split1 = (splits[0] ?? d * 0.33) as number;
  const split2 = (splits[1] ?? d * 0.66) as number;

  // 매개변수 하이라이트
  const paramGlow = spring({
    frame: frame - cfg.speechStartFrame - 10,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  // "메서드 안에서만" 강조
  const scopeAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  // "사라진다" 강조
  const disappearAppear = spring({
    frame: frame - split2,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 매개변수" />

          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              width: 860,
            }}
          >
            <div style={{ ...codeBoxStyle, fontSize: 24, lineHeight: 2 }}>
              <span style={{ color: C_KEYWORD }}>class</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              {" {\n"}
              {"  "}
              <span style={{ color: C_TYPE }}>String</span>{" "}
              <span style={{ color: C_VAR }}>name</span>
              {";\n\n"}
              {"  "}
              <span style={{ color: C_KEYWORD }}>void</span>{" "}
              <span style={{ color: C_FUNC }}>setName</span>
              {"("}
              <span
                style={{
                  background:
                    paramGlow > 0.05
                      ? `${C_FUNC}${Math.round(paramGlow * 15)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 4,
                  padding: "1px 4px",
                }}
              >
                <span style={{ color: C_TYPE }}>String</span>{" "}
                <span style={{ color: C_FUNC }}>newName</span>
              </span>
              {") {\n"}
              {"    "}
              <span style={{ color: C_VAR }}>name</span>
              {" = "}
              <span style={{ color: C_FUNC }}>newName</span>
              {";\n"}
              {"  }\n"}
              {"  "}
              <span style={{ color: C_COMMENT }}>
                // setName 메서드 밖에서는 newName 변수에 접근 할 수 없음
              </span>
              {"\n}"}
            </div>
          </div>

          {/* 설명 라벨 */}
          <div
            style={{
              position: "absolute",
              bottom: "16%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                opacity: scopeAppear,
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 800,
                color: C_FUNC,
              }}
            >
              매개변수 = 지역변수의 일종
            </div>
            <div
              style={{
                opacity: disappearAppear,
                fontFamily: uiFont,
                fontSize: FONT.label,
                fontWeight: 700,
                color: C_DIM,
              }}
            >
              메서드가 끝나면 사라진다
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

/* ── ComparisonScene ── */

const ComparisonScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.comparisonScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("comparisonScene").wordStartFrames;
  const splits = cfg.narrationSplits;
  const split1 = (splits[0] ?? d * 0.33) as number;
  const split2 = (splits[1] ?? d * 0.66) as number;

  const headerAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  const rows = [
    {
      label: "소속",
      instance: "객체",
      local: "메서드",
      startFrame: split1,
    },
    {
      label: "수명",
      instance: "객체가 살아있는 동안",
      local: "메서드 실행 중만",
      startFrame: split1 + 10,
    },
    {
      label: "범위",
      instance: "객체 전체",
      local: "선언된 메서드 안",
      startFrame: split2,
    },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 비교" />

          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "50%",
              transform: "translate(-50%, 0)",
              width: 860,
            }}
          >
            {/* 테이블 헤더 */}
            <div
              style={{
                opacity: headerAppear,
                display: "flex",
                gap: 0,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 160,
                  fontFamily: uiFont,
                  fontSize: 20,
                  fontWeight: 700,
                  color: C_DIM,
                  padding: "14px 16px",
                }}
              />
              <div
                style={{
                  flex: 1,
                  fontFamily: uiFont,
                  fontSize: 22,
                  fontWeight: 800,
                  color: C_VAR,
                  padding: "14px 20px",
                  textAlign: "center",
                }}
              >
                인스턴스 변수
              </div>
              <div
                style={{
                  flex: 1,
                  fontFamily: uiFont,
                  fontSize: 22,
                  fontWeight: 800,
                  color: C_TEAL,
                  padding: "14px 20px",
                  textAlign: "center",
                }}
              >
                지역변수
              </div>
            </div>

            {/* 테이블 행 */}
            {rows.map((row, i) => {
              const rowAppear = spring({
                frame: frame - (row.startFrame as number),
                fps,
                config: { damping: 13, stiffness: 140 },
                durationInFrames: 24,
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: rowAppear,
                    display: "flex",
                    gap: 0,
                    background: i % 2 === 0 ? `${BG_CODE}88` : "transparent",
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 160,
                      fontFamily: uiFont,
                      fontSize: 22,
                      fontWeight: 700,
                      color: C_DIM,
                      padding: "18px 20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontFamily: uiFont,
                      fontSize: 22,
                      fontWeight: 700,
                      color: C_VAR,
                      padding: "18px 20px",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {row.instance}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontFamily: uiFont,
                      fontSize: 22,
                      fontWeight: 700,
                      color: C_TEAL,
                      padding: "18px 20px",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {row.local}
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

/* ── SummaryScene ── */

/* ── ExampleScene ── */

const ExampleScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.exampleScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const audioScene = getAudioScene("exampleScene");
  const wordFrames = audioScene.wordStartFrames;
  const wt = audioScene.wordTiming;
  const splits = cfg.narrationSplits;

  const split1 = (splits[0] ?? 146) as number; // 문장2: balance는 인스턴스...
  // split2 = 416: 문장3: deposit 1000
  // split3 = 690: 문장4: 하지만 balance는
  // split4 = 869: 문장5: 한 번 더 deposit 500
  // split5 = 1145: 문장6: 메서드가 끝나면...

  /* ── 코드 등장 (문장1) ── */
  const codeAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });
  const codeScale = interpolate(codeAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── 메모리 다이어그램 등장 (문장2) ── */
  const memAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  /* ── 문장2: 코드 밑줄 ── */
  const balanceHL = wt["balance는"]?.[0] ?? 146;
  const amountHL = wt["amount와"]?.[0] ?? 265;
  const newBalHL = wt["newBal은"]?.[0] ?? 305;

  const ulBalance = spring({
    frame: frame - balanceHL,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const ulAmount = spring({
    frame: frame - amountHL,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const ulNewBal = spring({
    frame: frame - newBalHL,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  /* ── 1차 deposit(1000): 문장3 ── */
  const dep1Start = wt["deposit"]?.[0] ?? 416;
  const local1Born = wt["지역변수가"]?.[0] ?? 486;
  const local1Die = wt["사라집니다"]?.[0] ?? 619;

  const call1Appear = spring({
    frame: frame - dep1Start,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const local1Appear = spring({
    frame: frame - local1Born,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 24,
  });
  const local1Fade = interpolate(frame, [local1Die, local1Die + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const local1Op = local1Appear * local1Fade;

  const die1Op = interpolate(frame, [local1Die, local1Die + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 문장5 시작 전에 1차 소멸 텍스트 페이드
  const dep2Start = wt["deposit"]?.[1] ?? 909;
  const die1FadeOut = interpolate(frame, [dep2Start - 20, dep2Start], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── 문장4: balance 1000 유지 강조 ── */
  const bal1SurviveStart = wt["balance는"]?.[1] ?? 713;
  const bal1SurviveHL = spring({
    frame: frame - bal1SurviveStart,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 20,
  });
  const bal1SurviveFade = interpolate(
    frame,
    [dep2Start - 20, dep2Start],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /* ── 2차 deposit(500): 문장5 ── */
  const local2Born = wt["지역변수는"]?.[0] ?? 1003;
  const local2Die = wt["사라지지만"]?.[0] ?? 1254;

  const call2Appear = spring({
    frame: frame - dep2Start,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const local2Appear = spring({
    frame: frame - local2Born,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 24,
  });
  const local2Fade = interpolate(frame, [local2Die, local2Die + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const local2Op = local2Appear * local2Fade;

  const die2Op = interpolate(frame, [local2Die, local2Die + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── 문장6: balance 1500 최종 강조 ── */
  const bal2SurviveStart = wt["balance만"]?.[0] ?? 1306;
  const bal2SurviveHL = spring({
    frame: frame - bal2SurviveStart,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 20,
  });

  /* ── balance 값 계산 ── */
  // 0 → 1000 (1차 deposit 시)
  const toVal1 = interpolate(
    frame,
    [local1Born + 10, local1Born + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // 1000 → 1500 (2차 deposit 시)
  const toVal2 = interpolate(
    frame,
    [local2Born + 10, local2Born + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const balanceVal = toVal2 >= 0.5 ? "1500" : toVal1 >= 0.5 ? "1000" : "0";

  /* ── 호출 텍스트: 1차 vs 2차 ── */
  const call1FadeOut = interpolate(frame, [dep2Start - 10, dep2Start], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── 객체 글로우 (문장4 or 문장6) ── */
  const objGlow = Math.max(bal1SurviveHL * bal1SurviveFade, bal2SurviveHL);

  /* ── 코드 밑줄 헬퍼 ── */
  const CodeUL: React.FC<{
    progress: number;
    color: string;
    children: React.ReactNode;
  }> = ({ progress, color, children }) => (
    <span style={{ position: "relative" }}>
      {children}
      <span
        style={{
          position: "absolute",
          bottom: -2,
          left: 0,
          width: "100%",
          height: 2,
          background: color,
          transform: `scaleX(${progress})`,
          transformOrigin: "left",
        }}
      />
    </span>
  );

  /* ── 메서드 영역 블록 ── */
  const MethodBlock: React.FC<{
    op: number;
    amountVal: string;
    newBalVal: string;
  }> = ({ op, amountVal, newBalVal }) => (
    <div
      style={{
        ...panelStyle,
        border: `2px solid ${C_TEAL}55`,
        padding: "20px 24px",
        opacity: op,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -18,
          left: 16,
          padding: "3px 12px",
          borderRadius: 999,
          background: BG,
          border: `1px solid ${C_TEAL}44`,
          fontFamily: uiFont,
          fontSize: 16,
          fontWeight: 800,
          color: C_TEAL,
          letterSpacing: 1,
        }}
      >
        메서드 (deposit)
      </div>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          ...monoStyle,
          fontSize: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: C_TYPE }}>int</span>
          <span style={{ color: C_TEAL, fontWeight: 700 }}>amount</span>
          <span style={{ color: C_DIM }}>=</span>
          <span style={{ color: C_NUMBER }}>{amountVal}</span>
          <span
            style={{
              fontFamily: uiFont,
              fontSize: 14,
              color: C_DIM,
              marginLeft: 6,
            }}
          >
            매개변수
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: C_TYPE }}>int</span>
          <span style={{ color: C_TEAL, fontWeight: 700 }}>newBal</span>
          <span style={{ color: C_DIM }}>=</span>
          <span style={{ color: C_NUMBER }}>{newBalVal}</span>
          <span
            style={{
              fontFamily: uiFont,
              fontSize: 14,
              color: C_DIM,
              marginLeft: 6,
            }}
          >
            지역변수
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 현실 예시" />

          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
            }}
          >
            {/* ── 왼쪽: 코드 ── */}
            <div
              style={{
                opacity: codeAppear,
                transform: `scale(${codeScale})`,
                width: 540,
              }}
            >
              <div style={{ ...codeBoxStyle, fontSize: 22, lineHeight: 2 }}>
                <span style={{ color: C_KEYWORD }}>class</span>{" "}
                <span style={{ color: C_TEAL }}>BankAccount</span>
                {" {\n"}
                {"\n"}
                {"  "}
                <span style={{ color: C_COMMENT }}>// 인스턴스 변수</span>
                {"\n"}
                {"  "}
                <span style={{ color: C_TYPE }}>int</span>{" "}
                <CodeUL progress={ulBalance} color={C_VAR}>
                  <span style={{ color: C_VAR }}>balance</span>
                </CodeUL>
                ;{"\n"}
                {"\n"}
                {"  "}
                <span style={{ color: C_KEYWORD }}>void</span>{" "}
                <span style={{ color: C_FUNC }}>deposit</span>
                {"("}
                <span style={{ color: C_TYPE }}>int</span>{" "}
                <CodeUL progress={ulAmount} color={C_TEAL}>
                  <span style={{ color: C_TEAL }}>amount</span>
                </CodeUL>
                {") {\n"}
                {"    "}
                <span style={{ color: C_TYPE }}>int</span>{" "}
                <CodeUL progress={ulNewBal} color={C_TEAL}>
                  <span style={{ color: C_TEAL }}>newBal</span>
                </CodeUL>
                {" = "}
                <span style={{ color: C_VAR }}>balance</span>
                {" + "}
                <span style={{ color: C_TEAL }}>amount</span>;{"\n"}
                {"    "}
                <span style={{ color: C_VAR }}>balance</span>
                {" = "}
                <span style={{ color: C_TEAL }}>newBal</span>;{"\n"}
                {"  }\n"}
                {"}\n"}
                {"\n"}
                <span style={{ color: C_TEAL }}>BankAccount</span>{" "}
                <span style={{ color: C_VAR }}>bankAccount</span>
                {" = "}
                <span style={{ color: C_KEYWORD }}>new</span>{" "}
                <span style={{ color: C_TEAL }}>BankAccount</span>
                {"();\n"}
                <span style={{ opacity: call1Appear }}>
                  <span style={{ color: C_VAR }}>bankAccount</span>
                  {"."}
                  <span style={{ color: C_FUNC }}>deposit</span>
                  {"("}
                  <span style={{ color: C_NUMBER }}>1000</span>
                  {");"}
                </span>
                {"\n"}
                <span style={{ opacity: call2Appear }}>
                  <span style={{ color: C_VAR }}>bankAccount</span>
                  {"."}
                  <span style={{ color: C_FUNC }}>deposit</span>
                  {"("}
                  <span style={{ color: C_NUMBER }}>500</span>
                  {");"}
                </span>
              </div>
            </div>

            {/* ── 오른쪽: 메모리 다이어그램 ── */}
            <div
              style={{
                opacity: memAppear,
                width: 380,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {/* 객체 영역 */}
              <div
                style={{
                  ...panelStyle,
                  border: `2px solid ${C_VAR}55`,
                  boxShadow:
                    objGlow > 0.01
                      ? `0 0 ${20 + objGlow * 20}px ${C_VAR}${Math.round(
                          30 + objGlow * 50,
                        )
                          .toString(16)
                          .padStart(2, "0")}`
                      : `0 0 20px ${C_VAR}10`,
                  padding: "20px 24px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    left: 16,
                    padding: "3px 12px",
                    borderRadius: 999,
                    background: BG,
                    border: `1px solid ${C_VAR}44`,
                    fontFamily: uiFont,
                    fontSize: 16,
                    fontWeight: 800,
                    color: C_VAR,
                    letterSpacing: 1,
                  }}
                >
                  객체 (BankAccount)
                </div>
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    ...monoStyle,
                    fontSize: 24,
                  }}
                >
                  <span style={{ color: C_TYPE }}>int</span>
                  <span style={{ color: C_VAR, fontWeight: 700 }}>balance</span>
                  <span style={{ color: C_DIM }}>=</span>
                  <span style={{ color: C_NUMBER, fontWeight: 700 }}>
                    {balanceVal}
                  </span>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: 16,
                      color: C_VAR,
                      opacity: objGlow,
                      marginLeft: 8,
                    }}
                  >
                    ✓ 유지
                  </span>
                </div>
              </div>

              {/* ── 1차 호출: deposit(1000) ── */}
              <div
                style={{
                  opacity: call1Appear * call1FadeOut,
                  textAlign: "center",
                  ...monoStyle,
                  fontSize: 22,
                }}
              >
                <span style={{ color: C_DIM }}>1차 </span>
                <span style={{ color: C_FUNC }}>deposit</span>
                <span style={{ color: TEXT }}>(</span>
                <span style={{ color: C_NUMBER }}>1000</span>
                <span style={{ color: TEXT }}>)</span>
              </div>

              <MethodBlock op={local1Op} amountVal="1000" newBalVal="1000" />

              {/* 1차 소멸 */}
              <div
                style={{
                  opacity: die1Op * die1FadeOut,
                  textAlign: "center",
                  fontFamily: uiFont,
                  fontSize: 20,
                  fontWeight: 700,
                  color: C_PAIN,
                }}
              >
                ✕ 메서드 종료 → 지역변수 소멸
              </div>

              {/* ── 2차 호출: deposit(500) ── */}
              <div
                style={{
                  opacity: call2Appear,
                  textAlign: "center",
                  ...monoStyle,
                  fontSize: 22,
                }}
              >
                <span style={{ color: C_DIM }}>2차 </span>
                <span style={{ color: C_FUNC }}>deposit</span>
                <span style={{ color: TEXT }}>(</span>
                <span style={{ color: C_NUMBER }}>500</span>
                <span style={{ color: TEXT }}>)</span>
              </div>

              <MethodBlock op={local2Op} amountVal="500" newBalVal="1500" />

              {/* 2차 소멸 */}
              <div
                style={{
                  opacity: die2Op,
                  textAlign: "center",
                  fontFamily: uiFont,
                  fontSize: 20,
                  fontWeight: 700,
                  color: C_PAIN,
                }}
              >
                ✕ 또 소멸 — 지역변수는 매번 사라진다
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
      text: "인스턴스 변수: 객체에 속하고, 객체와 함께 유지",
      color: C_VAR,
      startFrame: splits[0] ?? cfg.speechStartFrame + 10,
    },
    {
      text: "지역변수·매개변수: 메서드에 속하고, 메서드와 함께 사라짐",
      color: C_TEAL,
      startFrame: splits[1] ?? cfg.speechStartFrame + 40,
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
              top: "28%",
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
                      fontSize: FONT.heading - 2,
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
  VIDEO_CONFIG.instanceVarScene,
  VIDEO_CONFIG.localVarScene,
  VIDEO_CONFIG.paramScene,
  VIDEO_CONFIG.comparisonScene,
  VIDEO_CONFIG.exampleScene,
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
    narration: CONTENT.instanceVarScene.narration as string[],
    speechStartFrame: getAudioScene("instanceVarScene").speechStartFrame,
    narrationSplits: getAudioScene("instanceVarScene").narrationSplits,
    sentenceEndFrames: getAudioScene("instanceVarScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.instanceVarScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.localVarScene.narration as string[],
    speechStartFrame: getAudioScene("localVarScene").speechStartFrame,
    narrationSplits: getAudioScene("localVarScene").narrationSplits,
    sentenceEndFrames: getAudioScene("localVarScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.localVarScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.paramScene.narration as string[],
    speechStartFrame: getAudioScene("paramScene").speechStartFrame,
    narrationSplits: getAudioScene("paramScene").narrationSplits,
    sentenceEndFrames: getAudioScene("paramScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.paramScene.durationInFrames,
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
    narration: CONTENT.exampleScene.narration as string[],
    speechStartFrame: getAudioScene("exampleScene").speechStartFrame,
    narrationSplits: getAudioScene("exampleScene").narrationSplits,
    sentenceEndFrames: getAudioScene("exampleScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.exampleScene.durationInFrames,
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

const JavaLocalVar: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.instanceVarScene.durationInFrames}
    >
      <InstanceVarScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.localVarScene.durationInFrames}
    >
      <LocalVarScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.paramScene.durationInFrames}
    >
      <ParamScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.comparisonScene.durationInFrames}
    >
      <ComparisonScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.exampleScene.durationInFrames}
    >
      <ExampleScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaLocalVar;

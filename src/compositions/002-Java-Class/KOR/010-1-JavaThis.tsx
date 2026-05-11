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
import { CONTENT } from "./010-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./010-3-audio.gen";
import {
  BG,
  BG_CODE,
  BG_THUMB,
  C_COMMENT,
  C_DIM,
  C_FUNC,
  C_KEYWORD,
  C_PAIN,
  C_PURPLE,
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
  problemScene: {
    audio: "this-problemScene.mp3",
    durationInFrames: getAudioScene("problemScene").durationInFrames,
    speechStartFrame: getAudioScene("problemScene").speechStartFrame,
    narration: CONTENT.problemScene.narration as string[],
    narrationSplits: getAudioScene("problemScene").narrationSplits,
  },
  whyScene: {
    audio: "this-whyScene.mp3",
    durationInFrames: getAudioScene("whyScene").durationInFrames,
    speechStartFrame: getAudioScene("whyScene").speechStartFrame,
    narration: CONTENT.whyScene.narration as string[],
    narrationSplits: getAudioScene("whyScene").narrationSplits,
  },
  thisIntroScene: {
    audio: "this-thisIntroScene.mp3",
    durationInFrames: getAudioScene("thisIntroScene").durationInFrames,
    speechStartFrame: getAudioScene("thisIntroScene").speechStartFrame,
    narration: CONTENT.thisIntroScene.narration as string[],
    narrationSplits: getAudioScene("thisIntroScene").narrationSplits,
  },
  thisSolveScene: {
    audio: "this-thisSolveScene.mp3",
    durationInFrames: getAudioScene("thisSolveScene").durationInFrames,
    speechStartFrame: getAudioScene("thisSolveScene").speechStartFrame,
    narration: CONTENT.thisSolveScene.narration as string[],
    narrationSplits: getAudioScene("thisSolveScene").narrationSplits,
  },
  noConflictScene: {
    audio: "this-noConflictScene.mp3",
    durationInFrames: getAudioScene("noConflictScene").durationInFrames,
    speechStartFrame: getAudioScene("noConflictScene").speechStartFrame,
    narration: CONTENT.noConflictScene.narration as string[],
    narrationSplits: getAudioScene("noConflictScene").narrationSplits,
  },
  whenToUseScene: {
    audio: "this-whenToUseScene.mp3",
    durationInFrames: getAudioScene("whenToUseScene").durationInFrames,
    speechStartFrame: getAudioScene("whenToUseScene").speechStartFrame,
    narration: CONTENT.whenToUseScene.narration as string[],
    narrationSplits: getAudioScene("whenToUseScene").narrationSplits,
  },
  summaryScene: {
    audio: "this-summaryScene.mp3",
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

/* ── ProblemScene ── */

const ProblemScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.problemScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("problemScene").wordStartFrames;

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

  // 매개변수 name 하이라이트
  const paramHL = spring({
    frame: frame - cfg.speechStartFrame - 8,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  // 인스턴스 변수 name 하이라이트
  const fieldHL = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  // name = name 문제 하이라이트
  const problemHL = interpolate(
    frame,
    [split2, split2 + 15, d - 30, d - 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // "name" 발화 순간 밑줄 (fade-in → hold → fade-out)
  const nameUnderline = (startFrame: number | undefined): number => {
    if (startFrame === undefined || startFrame <= 0) return 0;
    return interpolate(
      frame,
      [startFrame, startFrame + 6, startFrame + 30, startFrame + 50],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  };
  // 문장0 "name입니다" → 매개변수 name
  const paramNameUL = nameUnderline(wordFrames[0]?.[4]);
  // 문장1 "name입니다" → 인스턴스 변수 name
  const fieldNameUL = nameUnderline(wordFrames[1]?.[4]);
  // 문장2 "name = name이라고" → 각각 첫/두 번째 name
  const leftNameUL = nameUnderline(wordFrames[2]?.[0]);
  const rightNameUL = nameUnderline(wordFrames[2]?.[2]);

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 이름이 같을 때" />

          <div
            style={{
              position: "absolute",
              top: "14%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              width: 860,
            }}
          >
            <div style={{ ...codeBoxStyle, fontSize: 24, lineHeight: 2.2 }}>
              <span style={{ color: C_KEYWORD }}>class</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              {" {\n"}
              {"  "}
              <span
                style={{
                  background:
                    fieldHL > 0.05
                      ? `${C_VAR}${Math.round(fieldHL * 18)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 4,
                  padding: "1px 4px",
                }}
              >
                <span style={{ color: C_TYPE }}>String</span>{" "}
                <span
                  style={{
                    color: C_VAR,
                    textDecoration: "underline",
                    textDecorationColor: `rgba(156,220,254,${fieldNameUL})`,
                    textDecorationThickness: 2,
                    textUnderlineOffset: 4,
                  }}
                >
                  name
                </span>
              </span>
              {";  "}
              <span style={{ color: C_COMMENT }}>// 인스턴스 변수</span>
              {"\n\n"}
              {"  "}
              <span style={{ color: C_KEYWORD }}>void</span>{" "}
              <span style={{ color: C_FUNC }}>setName</span>
              {"("}
              <span
                style={{
                  background:
                    paramHL > 0.05
                      ? `${C_FUNC}${Math.round(paramHL * 18)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 4,
                  padding: "1px 4px",
                }}
              >
                <span style={{ color: C_TYPE }}>String</span>{" "}
                <span
                  style={{
                    color: C_FUNC,
                    textDecoration: "underline",
                    textDecorationColor: `rgba(220,220,170,${paramNameUL})`,
                    textDecorationThickness: 2,
                    textUnderlineOffset: 4,
                  }}
                >
                  name
                </span>
              </span>
              {") {\n"}
              {"    "}
              <span
                style={{
                  background:
                    problemHL > 0.05
                      ? `${C_PAIN}${Math.round(problemHL * 20)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                <span
                  style={{
                    color: C_PAIN,
                    textDecoration: "underline",
                    textDecorationColor: `rgba(244,124,124,${leftNameUL})`,
                    textDecorationThickness: 2,
                    textUnderlineOffset: 4,
                  }}
                >
                  name
                </span>
                {" = "}
                <span
                  style={{
                    color: C_PAIN,
                    textDecoration: "underline",
                    textDecorationColor: `rgba(244,124,124,${rightNameUL})`,
                    textDecorationThickness: 2,
                    textUnderlineOffset: 4,
                  }}
                >
                  name
                </span>
                {";"}
              </span>
              {"  "}
              <span style={{ color: C_COMMENT }}>// ❌ 둘 다 매개변수!</span>
              {"\n  }\n}"}
            </div>
          </div>

          {/* 설명 라벨 */}
          <div
            style={{
              position: "absolute",
              bottom: "12%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: problemHL,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: C_PAIN,
              textAlign: "center",
            }}
          >
            name = name → 둘 다 매개변수를 가리킴
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

/* ── WhyScene ── */

const WhyScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.whyScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("whyScene").wordStartFrames;

  const splits = cfg.narrationSplits;
  const split1 = (splits[0] ?? d * 0.33) as number;
  const split2 = (splits[1] ?? d * 0.66) as number;

  const ruleAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  const diagramAppear = spring({
    frame: frame - split2,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 가까운 변수 우선" />

          {/* 규칙 */}
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: ruleAppear,
              fontFamily: uiFont,
              fontSize: FONT.title,
              fontWeight: 900,
              color: C_TEAL,
              textAlign: "center",
            }}
          >
            가까운 범위의 변수를 우선한다
          </div>

          {/* 스코프 다이어그램 */}
          <div
            style={{
              position: "absolute",
              top: "36%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: diagramAppear,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            {/* 바깥: 클래스 */}
            <div
              style={{
                width: 700,
                border: `2px solid ${C_VAR}44`,
                borderRadius: 20,
                padding: "32px 36px 28px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  left: 24,
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: BG,
                  border: `1px solid ${C_VAR}44`,
                  fontFamily: uiFont,
                  fontSize: 18,
                  fontWeight: 800,
                  color: C_VAR,
                }}
              >
                클래스 범위
              </div>
              <div
                style={{
                  ...monoStyle,
                  fontSize: 22,
                  color: C_VAR,
                  marginBottom: 24,
                  marginTop: 12,
                }}
              >
                String <span style={{ fontWeight: 700 }}>name</span>;{"  "}
                <span style={{ color: C_COMMENT }}>
                  // 멀다 (인스턴스 변수)
                </span>
              </div>

              {/* 안쪽: 메서드 */}
              <div
                style={{
                  border: `2px solid ${C_FUNC}66`,
                  borderRadius: 16,
                  padding: "28px 28px 24px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    left: 20,
                    padding: "4px 12px",
                    borderRadius: 999,
                    background: BG,
                    border: `1px solid ${C_FUNC}44`,
                    fontFamily: uiFont,
                    fontSize: 16,
                    fontWeight: 800,
                    color: C_FUNC,
                  }}
                >
                  메서드 범위
                </div>
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 22,
                    color: C_FUNC,
                    marginTop: 8,
                  }}
                >
                  String <span style={{ fontWeight: 700 }}>name</span>
                  {"  "}
                  <span style={{ color: C_COMMENT }}>
                    // 가깝다 (매개변수) ← 우선!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 결론 */}
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: diagramAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: C_FUNC,
              textAlign: "center",
            }}
          >
            name → 매개변수 name을 가리킴
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

/* ── ThisIntroScene ── */

const ThisIntroScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.thisIntroScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("thisIntroScene").wordStartFrames;

  const keywordAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const keywordScale = interpolate(keywordAppear, [0, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const split1 = (cfg.narrationSplits[0] ?? d * 0.5) as number;
  const meaningAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. this란" />

          {/* this 키워드 */}
          <div
            style={{
              position: "absolute",
              top: "25%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${keywordScale})`,
              opacity: keywordAppear,
              ...monoStyle,
              fontSize: 100,
              fontWeight: 900,
              color: C_PURPLE,
              textShadow: `0 0 50px ${C_PURPLE}66`,
            }}
          >
            this
          </div>

          {/* = 자기 자신 객체 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: meaningAppear,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.title,
                fontWeight: 900,
                color: TEXT,
              }}
            >
              = <span style={{ color: C_PURPLE }}>자기 자신</span> 객체
            </div>
            <div
              style={{
                ...panelStyle,
                border: `2px solid ${C_PURPLE}55`,
                padding: "20px 32px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  ...monoStyle,
                  fontSize: 26,
                  color: C_PURPLE,
                  fontWeight: 700,
                }}
              >
                this
              </span>
              <span style={{ fontFamily: uiFont, fontSize: 22, color: C_DIM }}>
                →
              </span>
              <span style={{ fontFamily: uiFont, fontSize: 22, color: TEXT }}>
                이 메서드를 실행하고 있는{" "}
                <span style={{ color: C_PURPLE, fontWeight: 700 }}>
                  그 객체
                </span>
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

/* ── ThisSolveScene ── */

const ThisSolveScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.thisSolveScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("thisSolveScene").wordStartFrames;

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

  // this.name 하이라이트
  const thisHL = spring({
    frame: frame - cfg.speechStartFrame - 10,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  // 라벨 등장
  const labelAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  // 성공 표시
  const successAppear = spring({
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
          <SceneTitle title="4. this로 해결" />

          <div
            style={{
              position: "absolute",
              top: "14%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              width: 860,
            }}
          >
            <div style={{ ...codeBoxStyle, fontSize: 24, lineHeight: 2.2 }}>
              <span style={{ color: C_KEYWORD }}>class</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              {" {\n"}
              {"  "}
              <span style={{ color: C_TYPE }}>String</span>{" "}
              <span style={{ color: C_VAR }}>name</span>
              {";  "}
              <span style={{ color: C_COMMENT }}>// 인스턴스 변수</span>
              {"\n\n"}
              {"  "}
              <span style={{ color: C_KEYWORD }}>void</span>{" "}
              <span style={{ color: C_FUNC }}>setName</span>
              {"("}
              <span style={{ color: C_TYPE }}>String</span>{" "}
              <span style={{ color: C_FUNC }}>name</span>
              {") {\n"}
              {"    "}
              <span
                style={{
                  background:
                    thisHL > 0.05
                      ? `${C_TEAL}${Math.round(thisHL * 18)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                <span style={{ color: C_PURPLE, fontWeight: 700 }}>this</span>
                <span>.</span>
                <span style={{ color: C_VAR }}>name</span>
              </span>
              {" = "}
              <span style={{ color: C_FUNC }}>name</span>
              {";  "}
              <span style={{ color: C_COMMENT }}>// ✓ 구분 완료!</span>
              {"\n  }\n}"}
            </div>
          </div>

          {/* 화살표 라벨 */}
          <div
            style={{
              position: "absolute",
              top: "56%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: labelAppear,
              display: "flex",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div
              style={{
                ...panelStyle,
                border: `2px solid ${C_PURPLE}55`,
                padding: "16px 22px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...monoStyle,
                  fontSize: 24,
                  color: C_PURPLE,
                  fontWeight: 700,
                }}
              >
                this.name
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 20,
                  color: C_VAR,
                  marginTop: 6,
                }}
              >
                인스턴스 변수
              </div>
            </div>

            <div style={{ fontFamily: uiFont, fontSize: 30, color: C_DIM }}>
              ≠
            </div>

            <div
              style={{
                ...panelStyle,
                border: `2px solid ${C_FUNC}55`,
                padding: "16px 22px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...monoStyle,
                  fontSize: 24,
                  color: C_FUNC,
                  fontWeight: 700,
                }}
              >
                name
              </div>
              <div
                style={{
                  fontFamily: uiFont,
                  fontSize: 20,
                  color: C_FUNC,
                  marginTop: 6,
                }}
              >
                매개변수
              </div>
            </div>
          </div>

          {/* 성공 */}
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: successAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: C_TEAL,
            }}
          >
            ✓ 이제 둘이 구분됩니다
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

/* ── NoConflictScene ── */

const NoConflictScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.noConflictScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("noConflictScene").wordStartFrames;

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

  const okAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  const skipAppear = spring({
    frame: frame - split2,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 이름이 다르면" />

          <div
            style={{
              position: "absolute",
              top: "14%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${codeScale})`,
              opacity: codeAppear,
              width: 860,
            }}
          >
            <div style={{ ...codeBoxStyle, fontSize: 24, lineHeight: 2.2 }}>
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
              <span style={{ color: C_TYPE }}>String</span>{" "}
              <span style={{ color: C_TEAL }}>newName</span>
              {") {\n"}
              {"    "}
              <span style={{ color: C_VAR }}>name</span>
              {" = "}
              <span style={{ color: C_TEAL }}>newName</span>
              {";  "}
              <span style={{ color: C_COMMENT }}>// ✓ 이름이 달라서 OK</span>
              {"\n  }\n}"}
            </div>
          </div>

          {/* 설명 */}
          <div
            style={{
              position: "absolute",
              top: "56%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: okAppear,
              display: "flex",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div
              style={{
                ...monoStyle,
                fontSize: 24,
                color: C_VAR,
                fontWeight: 700,
              }}
            >
              name
            </div>
            <div style={{ fontFamily: uiFont, fontSize: 22, color: C_DIM }}>
              ≠
            </div>
            <div
              style={{
                ...monoStyle,
                fontSize: 24,
                color: C_TEAL,
                fontWeight: 700,
              }}
            >
              newName
            </div>
            <div style={{ fontFamily: uiFont, fontSize: 22, color: C_TEAL }}>
              → 겹치지 않음
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "12%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: skipAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: C_TEAL,
              textAlign: "center",
            }}
          >
            this 없이도 문제 없다
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

/* ── WhenToUseScene ── */

const WhenToUseScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.whenToUseScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("whenToUseScene").wordStartFrames;
  const splits = cfg.narrationSplits;
  const split1 = (splits[0] ?? d * 0.33) as number;
  const split2 = (splits[1] ?? d * 0.66) as number;

  const questionAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  const useAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  const skipAppear = spring({
    frame: frame - split2,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  const cardBase: React.CSSProperties = {
    ...panelStyle,
    width: 780,
    display: "flex",
    alignItems: "center",
    gap: 18,
    padding: "22px 28px",
  };

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="6. 언제 쓰나?" />

          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: questionAppear,
              fontFamily: uiFont,
              fontSize: FONT.title,
              fontWeight: 900,
              color: C_PURPLE,
            }}
          >
            this는 언제?
          </div>

          <div
            style={{
              position: "absolute",
              top: "36%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* 쓸 때 */}
            <div
              style={{
                ...cardBase,
                opacity: useAppear,
                border: `2px solid ${C_PURPLE}55`,
              }}
            >
              <span style={{ fontSize: 32, color: C_PURPLE }}>✓</span>
              <div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.heading,
                    fontWeight: 800,
                    color: C_PURPLE,
                  }}
                >
                  이름이 같을 때
                </div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 20,
                    color: C_DIM,
                    marginTop: 4,
                  }}
                >
                  매개변수와 인스턴스 변수 이름이 겹치면 this 필요
                </div>
              </div>
            </div>

            {/* 안 쓸 때 */}
            <div
              style={{
                ...cardBase,
                opacity: skipAppear,
                border: `2px solid ${C_TEAL}55`,
              }}
            >
              <span style={{ fontSize: 32, color: C_TEAL }}>−</span>
              <div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.heading,
                    fontWeight: 800,
                    color: C_TEAL,
                  }}
                >
                  이름이 다르면
                </div>
                <div
                  style={{
                    fontFamily: uiFont,
                    fontSize: 20,
                    color: C_DIM,
                    marginTop: 4,
                  }}
                >
                  겹치지 않으면 this 생략 가능
                </div>
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
      text: "this = 자기 자신 객체",
      color: C_PURPLE,
      startFrame: splits[0] ?? cfg.speechStartFrame + 10,
    },
    {
      text: "이름이 같을 때 → this로 인스턴스 변수 구분",
      color: C_VAR,
      startFrame: splits[1] ?? cfg.speechStartFrame + 40,
    },
    {
      text: "이름이 다르면 → this 생략 OK",
      color: C_TEAL,
      startFrame: splits[2] ?? cfg.speechStartFrame + 70,
    },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="7. 정리" />

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
  VIDEO_CONFIG.problemScene,
  VIDEO_CONFIG.whyScene,
  VIDEO_CONFIG.thisIntroScene,
  VIDEO_CONFIG.thisSolveScene,
  VIDEO_CONFIG.noConflictScene,
  VIDEO_CONFIG.whenToUseScene,
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
    narration: CONTENT.problemScene.narration as string[],
    speechStartFrame: getAudioScene("problemScene").speechStartFrame,
    narrationSplits: getAudioScene("problemScene").narrationSplits,
    sentenceEndFrames: getAudioScene("problemScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.problemScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.whyScene.narration as string[],
    speechStartFrame: getAudioScene("whyScene").speechStartFrame,
    narrationSplits: getAudioScene("whyScene").narrationSplits,
    sentenceEndFrames: getAudioScene("whyScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.whyScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.thisIntroScene.narration as string[],
    speechStartFrame: getAudioScene("thisIntroScene").speechStartFrame,
    narrationSplits: getAudioScene("thisIntroScene").narrationSplits,
    sentenceEndFrames: getAudioScene("thisIntroScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.thisIntroScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.thisSolveScene.narration as string[],
    speechStartFrame: getAudioScene("thisSolveScene").speechStartFrame,
    narrationSplits: getAudioScene("thisSolveScene").narrationSplits,
    sentenceEndFrames: getAudioScene("thisSolveScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.thisSolveScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: CONTENT.noConflictScene.narration as string[],
    speechStartFrame: getAudioScene("noConflictScene").speechStartFrame,
    narrationSplits: getAudioScene("noConflictScene").narrationSplits,
    sentenceEndFrames: getAudioScene("noConflictScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.noConflictScene.durationInFrames,
  },
  {
    offset: fromValues[6],
    narration: CONTENT.whenToUseScene.narration as string[],
    speechStartFrame: getAudioScene("whenToUseScene").speechStartFrame,
    narrationSplits: getAudioScene("whenToUseScene").narrationSplits,
    sentenceEndFrames: getAudioScene("whenToUseScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.whenToUseScene.durationInFrames,
  },
  {
    offset: fromValues[7],
    narration: CONTENT.summaryScene.narration as string[],
    speechStartFrame: getAudioScene("summaryScene").speechStartFrame,
    narrationSplits: getAudioScene("summaryScene").narrationSplits,
    sentenceEndFrames: getAudioScene("summaryScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
  },
]);

export const SRT_TRACKS: SrtTracks = { "ko-KR": SRT_DATA };

const JavaThis: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.problemScene.durationInFrames}
    >
      <ProblemScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.whyScene.durationInFrames}
    >
      <WhyScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.thisIntroScene.durationInFrames}
    >
      <ThisIntroScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.thisSolveScene.durationInFrames}
    >
      <ThisSolveScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.noConflictScene.durationInFrames}
    >
      <NoConflictScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.whenToUseScene.durationInFrames}
    >
      <WhenToUseScene />
    </Sequence>
    <Sequence
      from={fromValues[7]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaThis;

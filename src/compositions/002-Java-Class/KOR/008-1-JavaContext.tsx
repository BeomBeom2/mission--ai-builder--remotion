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
import { CONTENT } from "./008-2-content";
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";
import { AUDIO_CONFIG } from "./008-3-audio.gen";
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
  contextIntroScene: {
    audio: "ctx-contextIntroScene.mp3",
    durationInFrames: getAudioScene("contextIntroScene").durationInFrames,
    speechStartFrame: getAudioScene("contextIntroScene").speechStartFrame,
    narration: CONTENT.contextIntroScene.narration as string[],
    narrationSplits: getAudioScene("contextIntroScene").narrationSplits,
  },
  carExampleScene: {
    audio: "ctx-carExampleScene.mp3",
    durationInFrames: getAudioScene("carExampleScene").durationInFrames,
    speechStartFrame: getAudioScene("carExampleScene").speechStartFrame,
    narration: CONTENT.carExampleScene.narration as string[],
    narrationSplits: getAudioScene("carExampleScene").narrationSplits,
  },
  objectContextScene: {
    audio: "ctx-objectContextScene.mp3",
    durationInFrames: getAudioScene("objectContextScene").durationInFrames,
    speechStartFrame: getAudioScene("objectContextScene").speechStartFrame,
    narration: CONTENT.objectContextScene.narration as string[],
    narrationSplits: getAudioScene("objectContextScene").narrationSplits,
  },
  personClassScene: {
    audio: "ctx-personClassScene.mp3",
    durationInFrames: getAudioScene("personClassScene").durationInFrames,
    speechStartFrame: getAudioScene("personClassScene").speechStartFrame,
    narration: CONTENT.personClassScene.narration as string[],
    narrationSplits: getAudioScene("personClassScene").narrationSplits,
  },
  personExampleScene: {
    audio: "ctx-personExampleScene.mp3",
    durationInFrames: getAudioScene("personExampleScene").durationInFrames,
    speechStartFrame: getAudioScene("personExampleScene").speechStartFrame,
    narration: CONTENT.personExampleScene.narration as string[],
    narrationSplits: getAudioScene("personExampleScene").narrationSplits,
  },
  summaryScene: {
    audio: "ctx-summaryScene.mp3",
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

/* ─── Car visual ─── */

const CarCard: React.FC<{
  label: string;
  speed: number;
  mileage: number | null;
  color: string;
  opacity: number;
  mileageOpacity?: number;
  driveCount?: number;
  driveOpacity?: number;
}> = ({
  label,
  speed,
  mileage,
  color,
  opacity,
  mileageOpacity = 0,
  driveCount,
  driveOpacity = 0,
}) => (
  <div
    style={{
      opacity,
      ...panelStyle,
      width: 420,
      border: `2px solid ${color}55`,
      boxShadow: `0 0 24px ${color}18`,
      display: "flex",
      flexDirection: "column",
      gap: 14,
    }}
  >
    <div
      style={{
        fontFamily: uiFont,
        fontSize: FONT.label,
        fontWeight: 800,
        color,
      }}
    >
      {label}
    </div>
    <div style={{ ...monoStyle, fontSize: 26, color: TEXT }}>
      <span style={{ color: C_DIM }}>speed</span>{" "}
      <span style={{ color: C_DIM }}>=</span>{" "}
      <span style={{ color: C_NUMBER, fontWeight: 700 }}>{speed}</span>
    </div>
    <div
      style={{
        opacity: driveOpacity,
        ...monoStyle,
        fontSize: 26,
        color: TEXT,
      }}
    >
      <span style={{ color: C_FUNC }}>drive</span>
      {"()"}
      {driveCount !== undefined && driveCount > 1 && (
        <span style={{ color: C_DIM }}> × {driveCount}</span>
      )}
    </div>
    <div
      style={{
        opacity: mileageOpacity,
        ...monoStyle,
        fontSize: 26,
        color: TEXT,
      }}
    >
      <span style={{ color: C_DIM }}>mileage</span>{" "}
      <span style={{ color: C_DIM }}>=</span>{" "}
      <span style={{ color: C_NUMBER, fontWeight: 700, fontSize: 30 }}>
        {mileage ?? "?"}
      </span>
    </div>
  </div>
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

/* ── ContextIntroScene ── */

const ContextIntroScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.contextIntroScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("contextIntroScene").wordStartFrames;

  const textAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  const split1 = (cfg.narrationSplits[0] ?? d * 0.5) as number;
  const contextAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 24,
  });
  const contextScale = interpolate(contextAppear, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="1. 맥락이란" />

          {/* 같은 행동, 다른 결과 */}
          <div
            style={{
              position: "absolute",
              top: "28%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: textAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 700,
              color: TEXT,
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            같은 행동 →{" "}
            <span style={{ color: C_TEAL, fontWeight: 800 }}>다른 결과</span>
          </div>

          {/* Context 키워드 */}
          <div
            style={{
              position: "absolute",
              top: "48%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${contextScale})`,
              opacity: contextAppear,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: uiFont,
                fontSize: 80,
                fontWeight: 900,
                color: C_TEAL,
                letterSpacing: 6,
                textShadow: `0 0 40px ${C_TEAL}66`,
              }}
            >
              Context
            </div>
            <div
              style={{
                fontFamily: uiFont,
                fontSize: FONT.heading,
                fontWeight: 700,
                color: C_DIM,
                marginTop: 12,
              }}
            >
              맥락
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

/* ── CarExampleScene ── */

const CarExampleScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.carExampleScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("carExampleScene").wordStartFrames;
  const splits = cfg.narrationSplits;
  const split1 = (splits[0] ?? d * 0.33) as number;
  const split2 = (splits[1] ?? d * 0.66) as number;

  // 자동차 카드 등장
  const carAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  // drive() 등장
  const driveAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  // 마일리지 결과 등장
  const resultAppear = spring({
    frame: frame - split1 - 20,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  // "같은 행동, 다른 결과" 강조
  const conclusionAppear = spring({
    frame: frame - split2,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. 자동차 예시" />

          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              gap: 30,
            }}
          >
            <CarCard
              label="자동차 A"
              speed={30}
              mileage={60}
              color={C_VAR}
              opacity={carAppear}
              driveCount={2}
              driveOpacity={driveAppear}
              mileageOpacity={resultAppear}
            />
            <CarCard
              label="자동차 B"
              speed={230}
              mileage={460}
              color={C_TEAL}
              opacity={carAppear}
              driveCount={2}
              driveOpacity={driveAppear}
              mileageOpacity={resultAppear}
            />
          </div>

          {/* 결론 */}
          <div
            style={{
              position: "absolute",
              bottom: "14%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: conclusionAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: TEXT,
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            같은 행동(<span style={{ color: C_FUNC }}>drive</span>) →{" "}
            <span style={{ color: C_TEAL }}>상태</span>가 다르면 →{" "}
            <span style={{ color: C_PAIN }}>결과</span>가 다르다
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

/* ── ObjectContextScene ── */

const ObjectContextScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.objectContextScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("objectContextScene").wordStartFrames;
  const splits = cfg.narrationSplits;
  const split1 = (splits[0] ?? d * 0.33) as number;
  const split2 = (splits[1] ?? d * 0.66) as number;

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

  // 호출 + 결과
  const callAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 13, stiffness: 140 },
    durationInFrames: 24,
  });

  // 맥락 강조
  const contextAppear = spring({
    frame: frame - split2,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });
  const contextScale = interpolate(contextAppear, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. 객체 = 맥락" />

          {/* 코드 예시 */}
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
            <div
              style={{
                ...codeBoxStyle,
                fontSize: 24,
                lineHeight: 2,
              }}
            >
              <span style={{ color: C_VAR }}>carA</span>
              <span>.</span>
              <span style={{ color: C_KEYWORD }}>speed</span>
              <span> = </span>
              <span style={{ color: C_NUMBER }}>30</span>
              <span>;</span>
              {"\n"}
              <span style={{ color: C_VAR }}>carB</span>
              <span>.</span>
              <span style={{ color: C_KEYWORD }}>speed</span>
              <span> = </span>
              <span style={{ color: C_NUMBER }}>230</span>
              <span>;</span>
              {"\n\n"}
              <span style={{ color: C_VAR }}>carA</span>
              <span>.</span>
              <span style={{ color: C_FUNC }}>drive</span>
              <span>();</span>
              {"  "}
              <span style={{ color: C_COMMENT }}>// mileage → 30</span>
              {"\n"}
              <span style={{ color: C_VAR }}>carB</span>
              <span>.</span>
              <span style={{ color: C_FUNC }}>drive</span>
              <span>();</span>
              {"  "}
              <span style={{ color: C_COMMENT }}>// mileage → 230</span>
            </div>
          </div>

          {/* 같은 메서드, 다른 결과 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: callAppear,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            {/* 같은 .drive() 코드 한 줄 */}
            <div
              style={{
                ...monoStyle,
                fontSize: 22,
                color: C_DIM,
              }}
            >
              같은 <span style={{ color: C_FUNC }}>.drive()</span>
            </div>

            {/* carA / carB 카드 가로 배치 */}
            <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
              <div
                style={{
                  ...panelStyle,
                  border: `2px solid ${C_VAR}55`,
                  padding: "18px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 22,
                    color: C_VAR,
                    marginBottom: 6,
                  }}
                >
                  carA
                </div>
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 20,
                    color: C_DIM,
                  }}
                >
                  speed = <span style={{ color: C_NUMBER }}>30</span>
                </div>
              </div>

              <div
                style={{
                  ...panelStyle,
                  border: `2px solid ${C_TEAL}55`,
                  padding: "18px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 22,
                    color: C_TEAL,
                    marginBottom: 6,
                  }}
                >
                  carB
                </div>
                <div
                  style={{
                    ...monoStyle,
                    fontSize: 20,
                    color: C_DIM,
                  }}
                >
                  speed = <span style={{ color: C_NUMBER }}>230</span>
                </div>
              </div>
            </div>
          </div>

          {/* 객체 = 맥락 */}
          <div
            style={{
              position: "absolute",
              bottom: "12%",
              left: "50%",
              transform: `translate(-50%, 0) scale(${contextScale})`,
              opacity: contextAppear,
              fontFamily: uiFont,
              fontSize: FONT.title,
              fontWeight: 900,
              color: C_TEAL,
              textAlign: "center",
            }}
          >
            객체 = 메서드가 실행되는 맥락
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

/* ── PersonClassScene ── */

const PersonClassScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.personClassScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("personClassScene").wordStartFrames;

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

  // 메서드 부분 하이라이트
  const methodGlow = spring({
    frame: frame - split1 - 20,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. Person 클래스" />

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
            <div
              style={{
                ...codeBoxStyle,
                fontSize: 24,
                lineHeight: 2,
              }}
            >
              <span style={{ color: C_KEYWORD }}>class</span>{" "}
              <span style={{ color: C_TEAL }}>Person</span>
              {" {\n"}
              {"  "}
              <span style={{ color: C_TYPE }}>String</span>{" "}
              <span style={{ color: C_VAR }}>name</span>
              {";\n"}
              {"  "}
              <span style={{ color: C_TYPE }}>int</span>{" "}
              <span style={{ color: C_VAR }}>age</span>
              {";\n"}
              {"  "}
              <span style={{ color: C_TYPE }}>int</span>{" "}
              <span style={{ color: C_VAR }}>height</span>
              {";\n"}
              {"  "}
              <span style={{ color: C_TYPE }}>String</span>{" "}
              <span style={{ color: C_VAR }}>gender</span>
              {";\n\n"}
              <span
                style={{
                  background:
                    methodGlow > 0.05
                      ? `${C_FUNC}${Math.round(methodGlow * 15)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  borderRadius: 8,
                  padding: "2px 6px",
                }}
              >
                {"  "}
                <span style={{ color: C_KEYWORD }}>void</span>{" "}
                <span style={{ color: C_FUNC }}>introduce</span>
                {"() {\n"}
                {"    "}
                <span style={{ color: C_VAR }}>System.out.println</span>
                {"("}
                <span style={{ color: C_STRING }}>&quot;이름: &quot;</span>
                {" + "}
                <span style={{ color: C_VAR }}>name</span>
                {");\n"}
                {"    "}
                <span style={{ color: C_VAR }}>System.out.println</span>
                {"("}
                <span style={{ color: C_STRING }}>&quot;나이: &quot;</span>
                {" + "}
                <span style={{ color: C_VAR }}>age</span>
                {");\n"}
                {"    "}
                <span style={{ color: C_VAR }}>System.out.println</span>
                {"("}
                <span style={{ color: C_STRING }}>&quot;키: &quot;</span>
                {" + "}
                <span style={{ color: C_VAR }}>height</span>
                {");\n"}
                {"    "}
                <span style={{ color: C_VAR }}>System.out.println</span>
                {"("}
                <span style={{ color: C_STRING }}>&quot;성별: &quot;</span>
                {" + "}
                <span style={{ color: C_VAR }}>gender</span>
                {");\n"}
                {"  }"}
              </span>
              {"\n}"}
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

/* ── PersonExampleScene ── */

const PERSON_A = {
  name: "철수",
  age: 25,
  height: 180,
  gender: "남",
  color: C_VAR,
  output: ["이름: 철수", "나이: 25", "키: 180", "성별: 남"],
};
const PERSON_B = {
  name: "영희",
  age: 22,
  height: 165,
  gender: "여",
  color: C_TEAL,
  output: ["이름: 영희", "나이: 22", "키: 165", "성별: 여"],
};

const PersonCard: React.FC<{
  person: typeof PERSON_A;
  opacity: number;
  callOpacity: number;
  outputOpacity: number;
  frame: number;
  fps: number;
  outputStartFrame: number;
}> = ({
  person,
  opacity,
  callOpacity,
  outputOpacity,
  frame,
  fps,
  outputStartFrame,
}) => (
  <div
    style={{
      opacity,
      ...panelStyle,
      width: 420,
      border: `2px solid ${person.color}55`,
      boxShadow: `0 0 24px ${person.color}18`,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    {/* 필드 값 */}
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {[
        { key: "name", val: `"${person.name}"`, valColor: C_STRING },
        { key: "age", val: String(person.age), valColor: C_NUMBER },
        { key: "height", val: String(person.height), valColor: C_NUMBER },
        { key: "gender", val: `"${person.gender}"`, valColor: C_STRING },
      ].map((f) => (
        <div key={f.key} style={{ ...monoStyle, fontSize: 22, color: TEXT }}>
          <span style={{ color: C_DIM }}>{f.key}</span>
          {" = "}
          <span style={{ color: f.valColor, fontWeight: 700 }}>{f.val}</span>
        </div>
      ))}
    </div>

    {/* .introduce() 호출 */}
    <div
      style={{
        opacity: callOpacity,
        ...monoStyle,
        fontSize: 22,
        color: TEXT,
        marginTop: 8,
        padding: "6px 10px",
        background: `${person.color}11`,
        borderRadius: 8,
      }}
    >
      .<span style={{ color: C_FUNC }}>introduce</span>()
    </div>

    {/* 출력 결과 */}
    <div
      style={{
        opacity: outputOpacity,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginTop: 4,
        padding: "10px 12px",
        background: `${BG}cc`,
        borderRadius: 8,
        border: `1px solid ${person.color}33`,
      }}
    >
      {person.output.map((line, i) => {
        const lineAppear = spring({
          frame: frame - outputStartFrame - i * 5,
          fps,
          config: { damping: 14, stiffness: 200 },
          durationInFrames: 18,
        });
        return (
          <div
            key={i}
            style={{
              opacity: lineAppear,
              ...monoStyle,
              fontSize: 20,
              color: person.color,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  </div>
);

const PersonExampleScene: React.FC = () => {
  const cfg = VIDEO_CONFIG.personExampleScene;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFrames = getAudioScene("personExampleScene").wordStartFrames;
  const splits = cfg.narrationSplits;
  const split1 = (splits[0] ?? d * 0.33) as number;
  const split2 = (splits[1] ?? d * 0.66) as number;

  const cardAppear = spring({
    frame: frame - cfg.speechStartFrame,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  const callAppear = spring({
    frame: frame - split1,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });

  const outputAppear = spring({
    frame: frame - split1 - 12,
    fps,
    config: { damping: 13, stiffness: 130 },
    durationInFrames: 26,
  });

  // 결론 강조
  const conclusionAppear = spring({
    frame: frame - split2,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 26,
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="5. 같은 메서드, 다른 결과" />

          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "50%",
              transform: "translate(-50%, 0)",
              display: "flex",
              gap: 24,
            }}
          >
            <PersonCard
              person={PERSON_A}
              opacity={cardAppear}
              callOpacity={callAppear}
              outputOpacity={outputAppear}
              frame={frame}
              fps={fps}
              outputStartFrame={split1 + 12}
            />
            <PersonCard
              person={PERSON_B}
              opacity={cardAppear}
              callOpacity={callAppear}
              outputOpacity={outputAppear}
              frame={frame}
              fps={fps}
              outputStartFrame={split1 + 12}
            />
          </div>

          {/* 결론 */}
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              left: "50%",
              transform: "translate(-50%, 0)",
              opacity: conclusionAppear,
              fontFamily: uiFont,
              fontSize: FONT.heading,
              fontWeight: 800,
              color: TEXT,
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            같은 <span style={{ color: C_FUNC }}>introduce()</span> →{" "}
            <span style={{ color: C_TEAL }}>필드</span>가 다르면 →{" "}
            <span style={{ color: C_PAIN }}>결과</span>도 다르다
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
      text: "같은 행동도 맥락에 따라 다른 결과를 낸다",
      color: C_TEAL,
      startFrame: splits[0] ?? cfg.speechStartFrame + 10,
    },
    {
      text: "객체의 필드 = 맥락, 메서드 = 행동",
      color: C_FUNC,
      startFrame: splits[1] ?? cfg.speechStartFrame + 40,
    },
  ];

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="4. 정리" />

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
  VIDEO_CONFIG.contextIntroScene,
  VIDEO_CONFIG.carExampleScene,
  VIDEO_CONFIG.objectContextScene,
  VIDEO_CONFIG.personClassScene,
  VIDEO_CONFIG.personExampleScene,
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
    narration: CONTENT.contextIntroScene.narration as string[],
    speechStartFrame: getAudioScene("contextIntroScene").speechStartFrame,
    narrationSplits: getAudioScene("contextIntroScene").narrationSplits,
    sentenceEndFrames: getAudioScene("contextIntroScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.contextIntroScene.durationInFrames,
  },
  {
    offset: fromValues[2],
    narration: CONTENT.carExampleScene.narration as string[],
    speechStartFrame: getAudioScene("carExampleScene").speechStartFrame,
    narrationSplits: getAudioScene("carExampleScene").narrationSplits,
    sentenceEndFrames: getAudioScene("carExampleScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.carExampleScene.durationInFrames,
  },
  {
    offset: fromValues[3],
    narration: CONTENT.objectContextScene.narration as string[],
    speechStartFrame: getAudioScene("objectContextScene").speechStartFrame,
    narrationSplits: getAudioScene("objectContextScene").narrationSplits,
    sentenceEndFrames: getAudioScene("objectContextScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.objectContextScene.durationInFrames,
  },
  {
    offset: fromValues[4],
    narration: CONTENT.personClassScene.narration as string[],
    speechStartFrame: getAudioScene("personClassScene").speechStartFrame,
    narrationSplits: getAudioScene("personClassScene").narrationSplits,
    sentenceEndFrames: getAudioScene("personClassScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.personClassScene.durationInFrames,
  },
  {
    offset: fromValues[5],
    narration: CONTENT.personExampleScene.narration as string[],
    speechStartFrame: getAudioScene("personExampleScene").speechStartFrame,
    narrationSplits: getAudioScene("personExampleScene").narrationSplits,
    sentenceEndFrames: getAudioScene("personExampleScene").sentenceEndFrames,
    sceneDuration: VIDEO_CONFIG.personExampleScene.durationInFrames,
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

const JavaContext: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.contextIntroScene.durationInFrames}
    >
      <ContextIntroScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.carExampleScene.durationInFrames}
    >
      <CarExampleScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.objectContextScene.durationInFrames}
    >
      <ObjectContextScene />
    </Sequence>
    <Sequence
      from={fromValues[4]}
      durationInFrames={VIDEO_CONFIG.personClassScene.durationInFrames}
    >
      <PersonClassScene />
    </Sequence>
    <Sequence
      from={fromValues[5]}
      durationInFrames={VIDEO_CONFIG.personExampleScene.durationInFrames}
    >
      <PersonExampleScene />
    </Sequence>
    <Sequence
      from={fromValues[6]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaContext;

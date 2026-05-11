// src/compositions/001-Java-Basic/004-JavaComparison.tsx
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
import { CONTENT as KOR_CONTENT } from "../KOR/004-2-content";
import { CONTENT } from "./004-2-content";
import { AUDIO_CONFIG } from "./004-3-audio.gen";
import { BG, C_NUMBER, C_PAIN, C_PURPLE, C_TEAL, C_VAR, TEXT } from "./colors";
import { HEIGHT, WIDTH } from "./config";

// ── 상수 ─────────────────────────────────────────────────────
const BEAT_CROSS = 24; // 연산자 비트 간 크로스페이드

// ── 비트 데이터 ───────────────────────────────────────────────
const BEATS = [
  { op: "==", result: false },
  { op: "!=", result: true },
  { op: ">", result: true },
  { op: "<", result: false },
  { op: ">=", result: true },
  { op: "<=", result: false },
] as const;

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 60 },
  intro: {
    audio: "cmp-intro.mp3",
    durationInFrames: AUDIO_CONFIG.intro.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
    narration: CONTENT.intro.narration as string[],
    subtitleKo: KOR_CONTENT.intro.narration as string[],
    narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
  },
  compareScene: {
    audio: "cmp-compare.mp3",
    durationInFrames: AUDIO_CONFIG.compareScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.compareScene.speechStartFrame,
    narration: CONTENT.compareScene.narration as string[],
    subtitleKo: KOR_CONTENT.compareScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.compareScene.narrationSplits,
  },
  summaryScene: {
    audio: "cmp-summary.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as string[],
    subtitleKo: KOR_CONTENT.summaryScene.narration as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
};

// ── 컴포넌트: BeatCard (연산자 1개 평가 화면) ─────────────────
const BeatCard: React.FC<{
  op: string;
  result: boolean;
  totalDur: number;
  isLast: boolean;
}> = ({ op, result, totalDur, isLast }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, BEAT_CROSS], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = isLast
    ? 1
    : interpolate(frame, [totalDur - BEAT_CROSS, totalDur], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const opacity = fadeIn * fadeOut;

  // 수식 spring — 비트 시작 시 튀어오름
  const exprSpring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 130 },
    durationInFrames: 44,
  });
  const exprScale = interpolate(exprSpring, [0, 1], [0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 결과 배지 — 40프레임 후 위에서 내려옴
  const resultSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 10, stiffness: 110 },
    durationInFrames: 44,
  });
  const resultY = interpolate(resultSpring, [0, 1], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const resultOp = interpolate(resultSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resultColor = result ? C_TEAL : C_PAIN;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 수식: 10  OP  3 */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${exprScale})`,
          display: "flex",
          alignItems: "center",
          gap: 32,
          ...monoStyle,
        }}
      >
        <span style={{ color: C_NUMBER, fontSize: 92, fontWeight: 700 }}>
          10
        </span>
        <span
          style={{
            color: C_PURPLE,
            fontSize: 100,
            fontWeight: 900,
            textShadow: `0 0 40px ${C_PURPLE}88`,
          }}
        >
          {op}
        </span>
        <span style={{ color: C_NUMBER, fontSize: 92, fontWeight: 700 }}>
          3
        </span>
      </div>

      {/* 결과 배지 */}
      <div
        style={{
          position: "absolute",
          top: "64%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${resultY}px)`,
          opacity: resultOp,
          background: `${resultColor}20`,
          border: `3px solid ${resultColor}`,
          borderRadius: 22,
          padding: "18px 88px",
        }}
      >
        <span
          style={{
            ...monoStyle,
            fontSize: 72,
            fontWeight: 900,
            color: resultColor,
            textShadow: `0 0 24px ${resultColor}66`,
          }}
        >
          {result ? "true" : "false"}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── 씬: ThumbnailScene ────────────────────────────────────────
const ThumbnailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [60 - THUMB_CROSS, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          background: "#0d0d1a",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 860,
            height: 860,
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
            color: "#fff",
            textShadow:
              "0 0 60px rgba(78,201,176,0.6), 0 0 120px rgba(78,201,176,0.3)",
          }}
        >
          Java
          <br />
          <span style={{ color: C_TEAL }}>Comparison Operators</span>
        </div>
        {/* 예시: 10 == 3 → false */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 8,
            ...monoStyle,
          }}
        >
          <span style={{ fontSize: 56, fontWeight: 700, color: C_NUMBER }}>
            10
          </span>
          <span style={{ fontSize: 64, fontWeight: 900, color: C_TEAL }}>
            ==
          </span>
          <span style={{ fontSize: 56, fontWeight: 700, color: C_NUMBER }}>
            3
          </span>
          <span style={{ fontSize: 44, color: "#444", marginLeft: 4 }}>→</span>
          <span style={{ fontSize: 56, fontWeight: 900, color: C_PAIN }}>
            false
          </span>
        </div>
        {/* 6개 나열 */}
        <div
          style={{
            ...monoStyle,
            fontSize: CODE.xl,
            color: C_PURPLE,
            opacity: 0.5,
            letterSpacing: 6,
            whiteSpace: "pre",
          }}
        >
          {"==  !=  >  <  >=  <="}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 씬: IntroScene ────────────────────────────────────────────
const INTRO_OPS = ["==", "!=", ">", "<", ">=", "<="];

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { intro } = VIDEO_CONFIG;
  const opacity = useFade(intro.durationInFrames, { in: true });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={intro.audio} />
          <SceneTitle title="1. What Are Comparison Operators?" />
          <div
            style={{
              position: "absolute",
              top: "46%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "center",
            }}
          >
            {[
              INTRO_OPS.slice(0, 2),
              INTRO_OPS.slice(2, 4),
              INTRO_OPS.slice(4),
            ].map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 20 }}>
                {row.map((op, i) => {
                  const idx = ri * 2 + i;
                  const startFrame = Math.round(
                    interpolate(
                      idx,
                      [0, 5],
                      [
                        AUDIO_CONFIG.intro.wordTiming["compare"][0],
                        AUDIO_CONFIG.intro.wordTiming["false"][0],
                      ],
                    ),
                  );
                  const appear = spring({
                    frame: frame - startFrame,
                    fps,
                    config: { damping: 13, stiffness: 145 },
                    durationInFrames: 60,
                  });
                  const sc = interpolate(appear, [0, 1], [0.3, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  return (
                    <div
                      key={op}
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: 24,
                        border: `3px solid ${C_PURPLE}88`,
                        background: `${C_PURPLE}18`,
                        boxShadow: `0 0 30px ${C_PURPLE}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${sc})`,
                        opacity: appear,
                      }}
                    >
                      <span
                        style={{
                          ...monoStyle,
                          fontSize: 52,
                          fontWeight: 700,
                          color: C_PURPLE,
                        }}
                      >
                        {op}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={intro.narration}
        secondarySentences={intro.subtitleKo}
        splits={intro.narrationSplits}
        speechStart={intro.speechStartFrame}
        wordFrames={AUDIO_CONFIG.intro.wordStartFrames}
      />
    </>
  );
};

// ── 씬: CompareScene (비트 기반 평가) ────────────────────────
const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { compareScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const s = cfg.speechStartFrame;
  const splits = cfg.narrationSplits as readonly number[];
  const opacity = useFade(d);

  // 비트 경계: [s, split0, split1, split2, split3, split4]
  const beatStarts = [s, ...splits];

  // 헤더 등장
  const headerOpacity = interpolate(frame, [s, s + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="2. Comparison in Action" />

          {/* 상단 고정 헤더 */}
          {frame >= s && (
            <div
              style={{
                position: "absolute",
                top: "26%",
                left: "50%",
                transform: "translateX(-50%)",
                ...monoStyle,
                fontSize: CODE.xl,
                opacity: headerOpacity * 0.55,
                color: TEXT,
              }}
            >
              <JavaLine text="int a = 10, b = 3;" />
            </div>
          )}

          {/* 비트별 BeatCard */}
          {BEATS.map((beat, i) => {
            const from = beatStarts[i];
            const isLast = i === BEATS.length - 1;
            const nextFrom = isLast ? d : beatStarts[i + 1];
            const dur = nextFrom - from + (isLast ? 0 : BEAT_CROSS);
            return (
              <Sequence key={i} from={from} durationInFrames={dur}>
                <BeatCard
                  op={beat.op}
                  result={beat.result}
                  totalDur={dur}
                  isLast={isLast}
                />
              </Sequence>
            );
          })}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.compareScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬: SummaryScene (2×3 그리드) ────────────────────────────
const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false });

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <SceneAudio src={cfg.audio} />
          <SceneTitle title="3. Comparison Summary" />

          {/* 헤더 */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "50%",
              transform: "translateX(-50%)",
              ...monoStyle,
              fontSize: FONT.heading,
              color: TEXT,
              opacity: 0.6,
            }}
          >
            <JavaLine text="int a = 10, b = 3;" />
          </div>

          {/* 2×3 그리드 */}
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              width: 920,
            }}
          >
            {BEATS.map((beat, i) => {
              const appear = spring({
                frame: frame - i * 18,
                fps,
                config: { damping: 13, stiffness: 140 },
                durationInFrames: 52,
              });
              const sc = interpolate(appear, [0, 1], [0.82, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const resColor = beat.result ? C_TEAL : C_PAIN;
              return (
                <div
                  key={i}
                  style={{
                    background: "#2a2a2a",
                    border: `2px solid ${resColor}44`,
                    borderRadius: 18,
                    padding: "20px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    opacity: appear,
                    transform: `scale(${sc})`,
                  }}
                >
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: CODE.xl,
                      fontWeight: 700,
                      minWidth: 200,
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C_VAR, opacity: 0.45 }}>a</span>
                    <span style={{ color: C_PURPLE }}>{beat.op}</span>
                    <span style={{ color: C_VAR, opacity: 0.45 }}>b</span>
                  </span>
                  <span style={{ color: "#666", fontSize: 28 }}>→</span>
                  <span
                    style={{
                      ...monoStyle,
                      color: resColor,
                      fontSize: CODE.xl,
                      fontWeight: 700,
                    }}
                  >
                    {beat.result ? "true" : "false"}
                  </span>
                </div>
              );
            })}
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        secondarySentences={cfg.subtitleKo}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={AUDIO_CONFIG.summaryScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues ──────────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.intro,
  VIDEO_CONFIG.compareScene,
  VIDEO_CONFIG.summaryScene,
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
export const SRT_DATA: SrtEntry[] = (() => {
  const froms = computeFromValues(sceneDurations, {
    cross: CROSS,
    firstOverlap: THUMB_CROSS,
  });
  return buildSrtData([
    {
      offset: froms[1],
      narration: VIDEO_CONFIG.intro.narration,
      speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.intro.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.intro.durationInFrames,
    },
    {
      offset: froms[2],
      narration: VIDEO_CONFIG.compareScene.narration,
      speechStartFrame: AUDIO_CONFIG.compareScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.compareScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.compareScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.compareScene.durationInFrames,
    },
    {
      offset: froms[3],
      narration: VIDEO_CONFIG.summaryScene.narration,
      speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
      narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
      sentenceEndFrames: AUDIO_CONFIG.summaryScene.sentenceEndFrames,
      sceneDuration: VIDEO_CONFIG.summaryScene.durationInFrames,
    },
  ]);
})();

export const SRT_DATA_KO: SrtEntry[] = localizeSrtData(SRT_DATA, [
  ...VIDEO_CONFIG.intro.subtitleKo,
  ...VIDEO_CONFIG.compareScene.subtitleKo,
  ...VIDEO_CONFIG.summaryScene.subtitleKo,
]);

export const SRT_TRACKS: SrtTracks = {
  "en-US": SRT_DATA,
  "ko-KR": SRT_DATA_KO,
};

// ── Composition 메타 ──────────────────────────────────────────
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export const JavaComparison: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence
      from={fromValues[0]}
      durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}
    >
      <ThumbnailScene />
    </Sequence>
    <Sequence
      from={fromValues[1]}
      durationInFrames={VIDEO_CONFIG.intro.durationInFrames}
    >
      <IntroScene />
    </Sequence>
    <Sequence
      from={fromValues[2]}
      durationInFrames={VIDEO_CONFIG.compareScene.durationInFrames}
    >
      <CompareScene />
    </Sequence>
    <Sequence
      from={fromValues[3]}
      durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}
    >
      <SummaryScene />
    </Sequence>
  </AbsoluteFill>
);

export const Component = JavaComparison;

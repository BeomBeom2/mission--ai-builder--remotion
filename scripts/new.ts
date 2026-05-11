/**
 * scripts/new.ts
 *
 * 사용법: pnpm new <series>/<lang>/<ep> --title <Title> [--prefix <prefix>]
 * 예)    pnpm new 001-Java-Basic/KOR/011 --title "JavaArray" --prefix arr
 *
 * 생성 파일:
 *   src/compositions/{series}/{lang}/{ep}-1-{Title}.tsx
 *   src/compositions/{series}/{lang}/{ep}-2-content.ts
 *
 * --prefix: 오디오 파일명 접두사 (예: arr → arr-intro.mp3). 생략 시 title 소문자.
 */
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

const SRC_DIR = "src/compositions";

// ── 인자 파싱 ──────────────────────────────────────────────────
const arg = process.argv[2];
if (!arg) {
  console.error(
    "Usage: pnpm new <series>/<lang>/<ep> --title <Title> [--prefix <prefix>]",
  );
  console.error(
    'Example: pnpm new 001-Java-Basic/KOR/011 --title "JavaArray" --prefix arr',
  );
  process.exit(1);
}

function getFlag(name: string, fallback: string): string {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 && process.argv[idx + 1] ? process.argv[idx + 1] : fallback;
}

const title = getFlag("title", "NewEpisode");
const titleCamel = title.replace(/\s+/g, "");
const prefix = getFlag("prefix", title.toLowerCase().slice(0, 4));

const parts = arg.split("/");
const episodeId = parts[parts.length - 1]; // "011"
const dirRelParts = parts.slice(0, -1); // ["001-Java-Basic", "KOR"]
const dirPath = path.join(SRC_DIR, ...dirRelParts);

mkdirSync(dirPath, { recursive: true });

const tsxPath = path.join(dirPath, `${episodeId}-1-${titleCamel}.tsx`);
const contentPath = path.join(dirPath, `${episodeId}-2-content.ts`);

if (existsSync(tsxPath) || existsSync(contentPath)) {
  console.error(`❌  파일이 이미 존재합니다.`);
  if (existsSync(tsxPath)) console.error(`   ${tsxPath}`);
  if (existsSync(contentPath)) console.error(`   ${contentPath}`);
  process.exit(1);
}

const depthUp = dirRelParts.length + 1;
const utilsRel = Array(depthUp).fill("..").join("/");
const audioGenRel = `./${episodeId}-3-audio.gen`;
const contentRel = `./${episodeId}-2-content`;

// ── content.ts ─────────────────────────────────────────────────
writeFileSync(
  contentPath,
  `// ${contentPath}
export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\\n${title}",
    badge: "${title}",
  },
  intro: {
    narration: [
      "나레이션 첫 번째 문장.",
      "나레이션 두 번째 문장.",
    ],
  },
  summaryScene: {
    narration: [
      "정리 첫 번째 문장.",
      "정리 두 번째 문장.",
    ],
    cards: ["카드 1", "카드 2"],
  },
  // TODO: 씬 추가
} as const;
`,
  "utf-8",
);

// ── main tsx ────────────────────────────────────────────────────
writeFileSync(
  tsxPath,
  `// ${tsxPath}
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  CHARS_PER_SEC,
  CROSS,
  ContentArea,
  FONT,
  MONO_NO_LIGA,
  Subtitle,
  monoFont,
  uiFont,
  useFade,
} from "${utilsRel}/utils/scene";
import { FPS } from "${utilsRel}/config";
import { AUDIO_CONFIG } from "${audioGenRel}";
import { CONTENT } from "${contentRel}";
import { HEIGHT, WIDTH } from "./config";
import {
  BG, BG_CODE, BG_THUMB,
  C_TEAL, C_KEYWORD, C_TYPE, C_STRING, C_NUMBER,
  C_FUNC, C_VAR, C_COMMENT, C_PURPLE, C_PAIN, TEXT,
} from "./colors";

// ── VIDEO_CONFIG ──────────────────────────────────────────────
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 30 },
  intro: {
    audio: "${prefix}-intro.mp3",
    durationInFrames: AUDIO_CONFIG.intro.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
    narration: CONTENT.intro.narration as unknown as string[],
    narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
  },
  summaryScene: {
    audio: "${prefix}-summary.mp3",
    durationInFrames: AUDIO_CONFIG.summaryScene.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.summaryScene.speechStartFrame,
    narration: CONTENT.summaryScene.narration as unknown as string[],
    narrationSplits: AUDIO_CONFIG.summaryScene.narrationSplits,
  },
  // TODO: 씬 추가
} as const;

// ── 씬: ThumbnailScene ─────────────────────────────────────────
const ThumbnailScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: BG_THUMB,
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
        color: "#fff",
        textAlign: "center",
        lineHeight: 1,
        textShadow:
          "0 0 60px rgba(78,201,176,0.6), 0 0 120px rgba(78,201,176,0.3)",
      }}
    >
      Java
      <br />
      <span style={{ color: C_TEAL }}>
        {CONTENT.thumbnail.title.split("\\n")[1]}
      </span>
    </div>
    {CONTENT.thumbnail.badge && (
      <div
        style={{
          fontFamily: monoFont,
          fontFeatureSettings: MONO_NO_LIGA,
          fontSize: 64,
          fontWeight: 900,
          color: C_TEAL,
          background: "#4ec9b018",
          border: "2px solid #4ec9b055",
          borderRadius: 18,
          padding: "18px 56px",
          marginTop: 8,
        }}
      >
        {CONTENT.thumbnail.badge}
      </div>
    )}
  </AbsoluteFill>
);

// ── 씬: IntroScene ──────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const { intro: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const s = cfg.speechStartFrame;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // TODO: 비주얼 구현

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <Audio src={staticFile(cfg.audio)} />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: uiFont,
              fontSize: 48,
              fontWeight: 700,
              color: C_TEAL,
              textAlign: "center",
            }}
          >
            TODO: IntroScene
          </div>
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={s}
        wordFrames={AUDIO_CONFIG.intro.wordStartFrames}
      />
    </>
  );
};

// ── 씬: SummaryScene ────────────────────────────────────────────
const SUMMARY_CARDS = CONTENT.summaryScene.cards as unknown as string[];

const SummaryScene: React.FC = () => {
  const { summaryScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d, { out: false }); // 마지막 씬 → fadeOut 없음
  const s = cfg.speechStartFrame;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <Audio src={staticFile(cfg.audio)} />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: 48,
              alignItems: "center",
            }}
          >
            {SUMMARY_CARDS.map((card, i) => {
              const appear = spring({
                frame:
                  frame -
                  (AUDIO_CONFIG.summaryScene.wordStartFrames[
                    cfg.narrationSplits.length > 0 ? 1 : 0
                  ]?.[i * 2] ?? s + i * 30),
                fps,
                config: { damping: 12, stiffness: 130 },
                durationInFrames: 24,
              });
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: uiFont,
                    fontSize: FONT.title,
                    fontWeight: 700,
                    color: "#ffffff",
                    background: \`\${C_FUNC}18\`,
                    border: \`3px solid \${C_FUNC}66\`,
                    borderRadius: 16,
                    padding: "32px 48px",
                    textAlign: "center",
                    opacity: appear,
                    transform: \`scale(\${interpolate(appear, [0, 1], [0.8, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })})\`,
                  }}
                >
                  {card}
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
        wordFrames={AUDIO_CONFIG.summaryScene.wordStartFrames}
      />
    </>
  );
};

// ── 씬 목록 + fromValues 계산 ─────────────────────────────────
const sceneList = [
  VIDEO_CONFIG.thumbnail,
  VIDEO_CONFIG.intro,
  VIDEO_CONFIG.summaryScene,
  // TODO: 씬 추가 시 여기도 업데이트
];

let _from = 0;
const fromValues = sceneList.map((s, i) => {
  const f = _from;
  _from += s.durationInFrames - (i < sceneList.length - 1 ? CROSS : 0);
  return f;
});
const totalDuration = _from;

// ── compositionMeta ───────────────────────────────────────────
export const compositionMeta = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  durationInFrames: totalDuration,
};

// ── Root Component ────────────────────────────────────────────
const ${titleCamel}: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={fromValues[0]} durationInFrames={VIDEO_CONFIG.thumbnail.durationInFrames}>
      <ThumbnailScene />
    </Sequence>
    <Sequence from={fromValues[1]} durationInFrames={VIDEO_CONFIG.intro.durationInFrames}>
      <IntroScene />
    </Sequence>
    <Sequence from={fromValues[2]} durationInFrames={VIDEO_CONFIG.summaryScene.durationInFrames}>
      <SummaryScene />
    </Sequence>
    {/* TODO: 씬 추가 시 Sequence 추가 */}
  </AbsoluteFill>
);

export const Component = ${titleCamel};
`,
  "utf-8",
);

console.log(`✅  Created:`);
console.log(`   ${tsxPath}`);
console.log(`   ${contentPath}`);
console.log(`\n▶  Next steps:`);
console.log(`   1. 나레이션 작성: ${contentPath}`);
console.log(`   2. pnpm sync ${arg}`);
console.log(`   3. 씬 컴포넌트 구현: ${tsxPath}`);
console.log(`   4. pnpm dev → localhost:3000 에서 확인`);

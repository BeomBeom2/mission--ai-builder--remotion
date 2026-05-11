# Remotion 영상 프로젝트 — Claude 작업 가이드

## 관련 문서

- `src/compositions/001-Java-Basic/CLAUDE.md` — Java 기초 시리즈 콘텐츠 스펙 (나레이션 톤, 문장 규칙 등)
- `src/compositions/001-Java-Basic/TRANSLATION_NOTES.md` — ENG 번역 시 초월번역 기록

---

# YouTube 채널

| 언어 | 채널                 | 채널 ID                  |
| ---- | -------------------- | ------------------------ |
| KOR  | 몰입코딩 (@micoding) | UCrzfEJknj3SPqveyYnl-SvQ |
| ENG  | RGB-DEV              | (별도 채널)              |

**KOR과 ENG는 완전히 다른 YouTube 채널에 업로드된다.** 혼동하지 않는다.

---

# 아키텍처

## 헌법

### 씬 전환은 오디오와 애니메이션 둘 다 끝난 후에 한다

씬의 `durationInFrames`는 **오디오 길이와 애니메이션 완료 프레임 중 더 긴 쪽** 기준.

```ts
const sceneDuration = Math.max(
  AUDIO_CONFIG.xxx.durationInFrames,
  ANIM_END_FRAME + CROSS + SCENE_TAIL_FRAMES,
);
```

### 애니메이션은 반드시 발화 시작 프레임에 맞춘다

- `wordStartFrames` / `speechStartFrame` / `narrationSplits` 직접 참조.
- **`durationInFrames / 2 + offset` 같은 하드코딩 오프셋 절대 금지.**

### 등장 요소는 조건부 렌더링 대신 opacity로 제어한다

```tsx
// ❌ { phase2 && <div>키워드</div> }
// ✅ <div style={{ opacity: appear }}>키워드</div>
```

### 퇴장에는 spring을 쓰지 않는다 — interpolate를 쓴다

spring 오버슈트로 사라진 요소가 깜빡인다. 퇴장과 다음 등장이 같은 프레임에 겹쳐서도 안 된다.

```tsx
const exit = interpolate(frame, [split - 20, split], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

### 마지막 씬은 fadeOut 없이 끝낸다

`useFade(d, { out: false })` 사용.

### 모든 나레이션 씬에 SceneTitle을 넣는다

ThumbnailScene을 제외한 모든 씬 상단에 `<SceneTitle title="N. 제목" />` 필수.

### ThumbnailScene은 항상 공용 컴포넌트를 쓴다

**절대로 썸네일을 하드코딩하지 않는다.** 컴포지션 파일 안에 JSX(`<AbsoluteFill>`, `<div>` 등)로 썸네일을 직접 그리면 `content.ts`의 thumbnail 값이 무시되어 편집해도 화면에 반영되지 않는다.

```tsx
// ✅ 공용 컴포넌트 — title/subtitle/badge 모두 content.ts에서 읽는다
import { ThumbnailScene as Thumb } from "../../../components/ThumbnailScene";

const ThumbnailScene: React.FC = () => (
  <Thumb
    seriesLabel={CONTENT.thumbnail.seriesLabel}
    title={CONTENT.thumbnail.title}
    subtitle={CONTENT.thumbnail.subtitle}
    badge={CONTENT.thumbnail.badge}
  />
);

// ❌ 하드코딩 — 절대 금지
const ThumbnailScene: React.FC = () => (
  <AbsoluteFill>
    <div>Java</div>
    <div>객체</div>
    ...
  </AbsoluteFill>
);
```

`content.ts`의 `thumbnail`에는 `{ seriesLabel, title, subtitle?, badge }`를 반드시 정의한다.

### CSS transition / animation 사용 금지

렌더링 시 무시된다. `interpolate` / `spring`만 사용.

### AbsoluteFill에 반드시 background: BG

크로스페이드 시 뒤가 비침 방지. Subtitle은 AbsoluteFill **바깥**(opacity wrapper 밖)에 둔다.

---

## 법률

### JetBrains Mono 리가처는 항상 끈다

`...monoStyle` 스프레드로 `fontFamily` + `fontFeatureSettings` 동시 적용.

### 모든 텍스트는 최소 18px 이상이어야 한다

- 화면에 보이는 모든 텍스트의 기본 최소값은 `18px`이다.
- 작다고 느껴지면 폰트를 줄여서 우겨 넣지 말고, 레이아웃을 다시 잡는다.
- 정보 라벨(`스택 (주소만 가짐)`, 인덱스, 상태 설명, 보조 문장 등)도 예외 없이 읽히는 크기를 유지한다.

### 칩형 라벨은 의미가 있을 때만 쓴다

- pill/chip 형태 라벨은 정보 계층, 그룹 이름, 상태 표시처럼 실제 의미가 있을 때만 사용한다.
- 단순 장식, 분위기용, 이미 본문으로 충분한 내용을 한 번 더 감싸는 용도로는 쓰지 않는다.
- 의미가 약하면 칩을 붙이지 말고 본문만 남긴다.

### 박스 라벨은 테두리와 충분히 떨어뜨린다

- `PROCESS`, `MEMORY (RAM)` 같은 박스 라벨은 테두리에 딱 붙이면 안 된다.
- 라벨과 박스 테두리 사이에는 최소 `12~16px` 이상의 시각적 여백을 둔다.
- 답답해 보이면 폰트를 줄이지 말고 라벨 위치와 박스 위치를 다시 조정한다.

### 카드/패널은 세로 배열이 기본이다

- 코드 블록, 결과 카드, 비교 패널 등은 **세로(column)** 배열이 기본이다.
- 좌우(row) 배열은 아주 짧은 라벨 2개 정도만 허용한다.
- 코드가 들어간 카드를 좌우로 놓으면 줄바꿈이 생겨서 가독성이 떨어진다.

### 코드의 모든 문자는 반드시 색상이 지정되어야 한다

- `<span>` 밖에 `;`, `(`, `)`, `{`, `}` 등의 문자를 두면 기본 검은색으로 렌더링된다.
- **모든 코드 문자**는 반드시 `<span style={{ color: ... }}>` 안에 넣는다.
- `);` → `<span style={{ color: TEXT }}>);</span>`

### 중간 작업마다 커밋/푸시한다

기능·씬 단위 완료 시 즉시. 사용자 요청 없이 자동 판단.

### 하이라이트(glow/boxShadow)는 영구 유지하지 않는다

- **반복(펄싱)**: `Math.sin(frame * speed)`
- **1회성**: 등장(spring) → 소멸(interpolate)
- **예외**: 밑줄은 영구 유지 허용.

### 발화 타이밍에 맞춰 하이라이팅/밑줄을 적극 활용한다

- 키워드를 발화할 때 해당 코드/요소에 **밑줄**, **글로우**, **boxShadow** 등으로 시각적 강조.
- `wordTiming`을 활용하여 정확한 프레임에 등장 → 유지 → 소멸.
- 코드 키워드(`new`, 변수명 등), 메모리 다이어그램 셀, 개념 카드 등 모두 대상.

### 화살표는 시작점과 끝점이 명확해야 한다

- 화살표는 반드시 **출발 요소**에서 시작하여 **도착 요소**를 가리켜야 한다.
- SVG 하드코딩 좌표 대신 [`ElementArrow`](/Users/jangka512/Custom/remotions/p1/src/utils/Arrow.tsx)를 사용한다.
- 입력은 `containerRef`, `from`, `to` 구조로 넘긴다. `from/to`에는 `ref`, `anchor`, `padding`, `offsetX`, `offsetY`를 사용한다.
- `anchor`로 시작점/끝점의 방향(`right-center`, `left-top`, `bottom-center` 등)을 명시하고, 요소에 너무 딱 붙으면 `padding`으로 8~12px 정도 띄운다.
- 어떤 요소가 어떤 요소를 가리키는지 **한눈에** 알 수 있어야 한다.

### 너비 기준

CSS `100dvw`도 허용하지만, `useVideoConfig().width`도 사용 가능. 코드 블록에는 `CodeBlock` 컴포넌트 사용 권장.

### 자막(SRT) 업로드 룰

- **KOR 영상**: 한국어 자막 필수. 같은 시리즈에 ENG 폴더가 있으면 영어 자막을 서브로 추가.
- **ENG 영상**: 영어 자막 필수. 같은 시리즈에 KOR 폴더가 있으면 한국어 자막을 서브로 추가.
- 구현: 컴포지션 파일에서 `SRT_TRACKS`로 `{ "ko-KR": ..., "en-US": ... }` 형태로 export. 상대 언어 content를 import하여 `localizeSrtData`로 타이밍 복사.

---

# 스펙 (교육 콘텐츠)

## 헌법

### 자막에 긴 코드를 쓰지 않는다

`score += 10`, `count++` 같은 **긴 코드 구문**은 자막에 넣지 않는다.
단, **짧고 읽기 쉬운 코드**(`int`, `String`, `System.out.println`, `age`, `for`, `if`)는 허용.

### TTS가 잘못 읽을 단어는 인라인 발음 문법을 쓴다

```
[표시텍스트(pron:TTS읽기)]
```

- `[System.out.println(pron:print line)]` → 자막: System.out.println / TTS: print line
- `[(자료)(pron:)]` → 자막: (자료) / TTS: 묵음
- `상자(mute:변수)` → 자막: 상자(변수) / TTS: 상자

**나레이션을 쓸 때마다 반드시 확인한다.**

### 빈 화면을 만들지 않는다

나레이션이 시작되면 반드시 관련 비주얼이 함께 표시되어야 한다.

### 정리/요약 씬에서 기존 코드 줄을 비활성화하지 않는다

새 줄이 타이핑되더라도 이전 줄의 opacity를 낮추지 않는다.
(상세 설명 씬에서 포커싱 목적으로 흐리게 하는 것은 허용)

### 자막에 숫자는 아라비아 숫자로 표시한다

화면에 보이는 코드 값을 가리키는 숫자는 아라비아 숫자로 쓴다. TTS가 자연스럽게 읽는다.
일반 서술에서 쓰이는 숫자는 영문 그대로 둔다.

```ts
// ✅ 코드 값을 가리킬 때 — 아라비아 숫자
"10 is not less than 3, so the result is false."; // 화면: 10 < 3
"The variable age now stores 25."; // 화면: age = 25

// ✅ 일반 서술 — 영문 그대로
"Let's look at four main data types.";
"The addition operator adds two values.";
```

### 코드 연산자 양옆에 반드시 공백을 넣는다

`✅ age = age + 2;` / `❌ age=age+2;`

### 나레이션 문장 규칙

- **문장 수**: 씬당 2~4문장. 짧고 명확하게.
- **톤**: 교육적, 설명 중심. "~입니다", "~합니다" 체.
- **줄바꿈**: 나레이션 문자열 안에서 `\n`으로 자막 줄 분리.

---

## 법률

### 나레이션 속 코드 구문은 토큰별로 pron을 분리한다

`id = id`, `age + 2`, `count++` 같은 코드 구문이 나레이션에 들어갈 때, **변수·연산자·값을 각각 별도 `[...(pron:...)]`로 감싼다.**
TTS가 토큰을 합쳐 읽는 것을 방지하고, 하이라이팅을 개별 단어에 걸 수 있게 한다.

```ts
// ✅ 토큰별 분리
"`[id(pron:아이디)] [=(pron:이퀄)] [id(pron:아이디)]` 처럼"

// ❌ 한 덩어리
"`[id = id(pron:아이디 이퀄 아이디)]` 처럼"
```

- 백틱(`` ` ``) 닫은 뒤 한글 조사가 바로 붙으면 TTS가 합친다 → **공백을 넣는다** (`` ` 처럼``).
- `pron` 안에서 한국어 발음·영어 발음 모두 허용.
- **pron 문법 `]` 뒤에 괄호·숫자가 바로 붙으면 TTS가 합친다** → `]`와 `(` 사이에 **공백**을 넣는다.

```ts
// ✅ Person과 (2 분리됨
"`new [Person(pron:퍼슨)] (2, 25, 175)`"

// ❌ TTS가 "Person(2"를 한 단어로 합침
"`new [Person(pron:퍼슨)](2, 25, 175)`"
```

### 인라인 발음 문법 상세

```ts
"[유튜브(pron:유튭)]에서 확인할 수 있습니다.";
// 자막: 유튜브  /  TTS: 유튭
```

- `src/utils/narration.ts`의 `toDisplayText` / `toTTSText`로 파싱

### 묵음(mute) 문법

```ts
"상자(mute:변수)에 값을 넣습니다.";
// 자막: 상자(변수)에 값을 넣습니다.  /  TTS: 상자에 값을 넣습니다.
```

- `(mute:텍스트)` → 자막에는 `(텍스트)`로 표시, TTS에서는 통째로 제거.
- 괄호 안 보충 설명을 자막에만 보여주고 TTS가 읽지 않게 할 때 사용.

### ENG 번역 시 한국 이름은 영어권 이름으로 변경한다

철수→Chris, 영희→Emma 등. 한국어 고유명사가 영어판에 그대로 남으면 안 된다.

---

# edge-tts

## 사용 모델

| 언어         | 모델 ID                          | 약칭   |
| ------------ | -------------------------------- | ------ |
| 한국어 (KOR) | `ko-KR-HyunsuMultilingualNeural` | Hyunsu |
| 영어 (ENG)   | `en-US-EmmaMultilingualNeural`   | Emma   |

각 언어 폴더의 `config.ts`에서 `VOICE`로 설정한다.

## Word Boundary (Hyunsu / Emma 공통)

구두점에 따라 단어가 합쳐지거나 분리된다.

| TTS 텍스트       | 결과       | 비고                      |
| ---------------- | ---------- | ------------------------- |
| `AND, OR, NOT`   | 3개 분리   | ✅ 쉼표 1개               |
| `AND. OR. NOT`   | 3개 분리   | ✅ 마침표 — 자연스러운 쉼 |
| `AND,, OR,, NOT` | 1개 합쳐짐 | ❌ 쉼표 2개 이상          |
| `AND.. OR.. NOT` | 1개 합쳐짐 | ❌ 마침표 2개             |

**쉼을 넣고 싶을 때**: 마침표(`.`) 1개 사용.

```
[AND,(pron:AND.)] [OR,(pron:OR.)] and NOT.
→ 자막: AND, OR, and NOT.  /  TTS: AND. OR. and NOT.
```

## Emma (영어) — 코드 기호 발음

| 텍스트               | Emma 발음             | 해결                                    |
| -------------------- | --------------------- | --------------------------------------- |
| `!true`              | "true" (! 무시)       | `[!true(pron:not true)]`                |
| `!false`             | "false" (! 무시)      | `[!false(pron:not false)]`              |
| `!=`                 | 불안정                | `[!=(pron:not equal)]`                  |
| `&&`                 | "and and" 또는 무시   | `[&&(pron:and)]`                        |
| `\|\|`               | 무시 또는 이상한 발음 | `[\|\|(pron:or)]`                       |
| `System.out.println` | 부자연스러운 분절     | `[System.out.println(pron:print line)]` |

## Hyunsu (한국어) — 고유 버그

Hyunsu는 영어 단어/기호를 한국어식으로 잘못 읽는다.

| 텍스트               | Hyunsu 발음           | 해결                                     |
| -------------------- | --------------------- | ---------------------------------------- |
| `OR`                 | "오얼"                | `[OR(pron:오어)]`                        |
| `!은`                | "나슨"                | `[!(pron:느낌표)]` 또는 우회             |
| `!true`              | "true" (! 무시)       | `[!true(pron:낫 트루)]`                  |
| `!false`             | "false" (! 무시)      | `[!false(pron:낫 폴스)]`                 |
| `!=`                 | 불안정                | `[!=(pron:낫 이퀄)]`                     |
| `&&`                 | 무시 또는 이상한 발음 | `[&&(pron:앤드)]`                        |
| `\|\|`               | 무시 또는 이상한 발음 | `[\|\|(pron:오어)]`                      |
| `System.out.println` | 부자연스러운 분절     | `[System.out.println(pron:프린트 라인)]` |

**원칙: 코드 기호가 나레이션에 포함되면 반드시 인라인 발음을 확인한다.**

---

# 에피소드 제작 레시피

## 파일 구조

```
{id}-1-{ComponentName}.tsx   — 메인 컴포지션
{id}-2-content.ts            — 나레이션/콘텐츠 데이터 (satisfies EpisodeContent)
{id}-3-audio.gen.ts          — AUTO-GENERATED (pnpm sync)
{id}-4-sub.gen.ts            — AUTO-GENERATED (SRT)
```

## 에피소드 골격 (씬 순서)

```
1. ThumbnailScene     — 30프레임, 정지 화면, 오디오 없음
2. [PainScene]        — (선택) 기존 방식의 고통
3. IntroScene         — 주제 소개 + 핵심 키워드
4. DetailScene ×N     — 개념 설명 (2~5개)
5. SummaryScene       — 핵심 정리 카드
6. [ComparisonScene]  — (선택) Before/After 비교
7. [RealExampleScene] — (선택) 실전 예시
```

## content.ts 작성법

```ts
export const CONTENT = {
  thumbnail: { seriesLabel: "JAVA", title: "Java\n배열", badge: "배열" },
  intro: { narration: ["첫 번째 문장.", "두 번째 문장."] },
} satisfies EpisodeContent;
```

- `satisfies EpisodeContent` 사용 (`as const` 금지).

## 메인 컴포지션 파일 구조

### VIDEO_CONFIG

```tsx
export const VIDEO_CONFIG = {
  thumbnail: { durationInFrames: 30 },
  intro: {
    audio: "prefix-intro.mp3",
    durationInFrames: AUDIO_CONFIG.intro.durationInFrames,
    speechStartFrame: AUDIO_CONFIG.intro.speechStartFrame,
    narration: CONTENT.intro.narration as string[],
    narrationSplits: AUDIO_CONFIG.intro.narrationSplits,
  },
};
```

### sceneList → fromValues → totalDuration

```tsx
const sceneList = [VIDEO_CONFIG.thumbnail, VIDEO_CONFIG.intro, ...];
let _from = 0;
const fromValues = sceneList.map((s, i) => {
  const f = _from;
  _from += s.durationInFrames - (i < sceneList.length - 1 ? CROSS : 0);
  return f;
});
const totalDuration = _from;
```

### 일반 씬 골격

```tsx
const SomeScene: React.FC = () => {
  const { someScene: cfg } = VIDEO_CONFIG;
  const d = cfg.durationInFrames;
  const opacity = useFade(d);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <AbsoluteFill style={{ background: BG, opacity }}>
        <ContentArea>
          <Audio src={staticFile(cfg.audio)} />
          {/* 비주얼 */}
        </ContentArea>
      </AbsoluteFill>
      <Subtitle
        sentences={cfg.narration}
        splits={cfg.narrationSplits}
        speechStart={cfg.speechStartFrame}
        wordFrames={AUDIO_CONFIG.someScene.wordStartFrames}
      />
    </>
  );
};
```

## 애니메이션 패턴

### Spring 설정 표준

| 용도        | damping | stiffness | durationInFrames |
| ----------- | ------- | --------- | ---------------- |
| 일반 등장   | 12~14   | 130~140   | 24~30            |
| 빠른 등장   | 14      | 200       | 18               |
| 느슨한 등장 | 10~11   | 90~120    | 30~35            |
| 카드 등장   | 12~13   | 130~140   | 24~26            |

### Scale 보간

```tsx
const scale = interpolate(appear, [0, 1], [0.8, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

### 타이핑 애니메이션

```tsx
const charsVisible = Math.floor(
  (Math.max(0, frame - startFrame) / fps) * charsPerSec,
);
const visibleText = fullText.slice(0, charsVisible);
```

## 비주얼 스타일

### 코드 블록

```tsx
{ background: BG_CODE, borderRadius: 12, padding: "20px 32px", ...monoStyle }
```

### 폰트 스케일 (FONT 상수)

```ts
FONT.label; // 26px — 라벨, 뱃지
FONT.heading; // 32px — 소제목
FONT.title; // 44px — 큰 제목
FONT.display; // 56px — 핵심 키워드
```

### 코드 구문 색상 (colors.ts)

| 요소                           | 상수         | 색상                   |
| ------------------------------ | ------------ | ---------------------- |
| 키워드 (void, for, if, return) | `C_KEYWORD`  | #569cd6                |
| 자료형 (int, double, String)   | `C_TYPE`     | #4e9cd5                |
| 문자열                         | `C_STRING`   | #ce9178                |
| 숫자                           | `C_NUMBER`   | #b5cea8                |
| 함수 이름                      | `C_FUNC`     | #dcdcaa                |
| 변수 이름                      | `C_VAR`      | #9cdcfe                |
| 주석                           | `C_COMMENT`  | #6a9955                |
| 비교/조건 연산자               | `C_PURPLE`   | #c586c0                |
| 논리 연산자                    | `C_AMBER`    | #e5c07b                |
| 산술 연산자                    | `C_OPERATOR` | #d4834e                |
| 강조 (teal)                    | `C_TEAL`     | #4ec9b0                |
| 고통/경고                      | `C_PAIN`     | #f47c7c                |
| 흐릿한 텍스트                  | `C_DIM`      | rgba(255,255,255,0.22) |
| 기본 텍스트                    | `TEXT`       | #d4d4d4                |

### 콘텐츠 배치

`ContentArea` 안에서 `position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%)`.

## 크로스페이드 전환

- CROSS = 20프레임.
- CROSS 만큼 콘텐츠 시작을 딜레이하지 않는다.

## 오디오 파일 prefix 컨벤션

| 에피소드           | prefix   |
| ------------------ | -------- |
| 001-JavaVariables  | `var-`   |
| 002-JavaDataTypes  | `dt-`    |
| 003-JavaOperators  | `op-`    |
| 004-JavaComparison | `cmp-`   |
| 005-JavaLogical    | `log-`   |
| 006-JavaIf         | `if-`    |
| 007-JavaSwitch     | `sw-`    |
| 008-JavaWhile      | `while-` |
| 009-JavaFor        | `for-`   |
| 010-JavaFunction   | `fn-`    |
| 011-JavaParameter  | `param-` |

## AUDIO_CONFIG 참조

```ts
AUDIO_CONFIG.{sceneKey} = {
  durationInFrames, narrationSplits, sentenceEndFrames,
  speechStartFrame, speechEndFrame,
  wordStartFrames: number[][],  // [문장][단어]
  wordEndFrames: number[][],
  wordTiming: Record<string, number[]>,  // 단어→프레임 매핑
}
```

---

# 프로젝트 구조 & 워크플로우

## 디렉토리

```
src/
  global.config.ts              — 전역 설정 (VOICE, RATE, SCENE_TAIL_FRAMES)
  index.ts                      — Remotion 엔트리포인트
  Root.tsx                      — 컴포지션 자동 등록 + Folder 그룹핑
  utils/
    narration.ts                — toDisplayText / toTTSText
    scene.tsx                   — monoStyle, FONT, useFade, Subtitle 등
    srt.ts                      — SRT_DATA 생성 유틸
  types/episode.ts              — EpisodeContent 타입
  compositions/
    001-Java-Basic/{KOR,ENG}/
      {id}-1-{Name}.tsx         — 메인 컴포지션
      {id}-2-content.ts         — 나레이션/콘텐츠 데이터
      {id}-3-audio.gen.ts       — AUTO-GENERATED
      {id}-4-sub.gen.ts         — AUTO-GENERATED (SRT)
      colors.ts / config.ts     — 시리즈 공유 설정
scripts/
  sync.ts / sync-all.ts        — TTS 생성 + audio config
  render.ts                     — 렌더링
  new.ts                        — 에피소드 스캐폴딩
```

## 워크플로우

나레이션·발음 변경 시 **즉시** sync. 묻지 않는다.

```bash
pnpm sync 001-Java-Basic/KOR/001
pnpm sync:all
```

## 핵심 상수

```ts
CHARS_PER_SEC = 10; // 타이핑 속도 — scene.tsx
CROSS = 20; // 크로스페이드 — scene.tsx
SCENE_TAIL_FRAMES = 15; // 오디오 후 여유 — global.config.ts
```

## 공유 유틸 import

```ts
import {
  CHARS_PER_SEC,
  CROSS,
  ContentArea,
  FONT,
  MONO_NO_LIGA,
  Subtitle,
  monoFont,
  monoStyle,
  uiFont,
  useFade,
} from "../../utils/scene";
```

## 렌더링

```bash
pnpm dev                           # Studio 미리보기
pnpm render 001-Java-Basic/KOR/001 # 렌더링
```

## 새 에피소드 추가

```bash
pnpm new 001-Java-Basic/KOR/011 --title "JavaArray" --prefix arr
```

## 주의

- 새 씬 추가 시 `sceneList` 배열도 업데이트
- 해시 파일: `.{시리즈}-{lang}-{id}-audio-hashes.json`
- 강제 재생성: 해시 파일 삭제 후 `pnpm sync:all`
- 실험 브랜치: `feat/karaoke-subtitles`

## 금지 사항 체크리스트

- [ ] CSS `transition` / `animation` 사용
- [ ] `monoFont`에 `MONO_NO_LIGA` 누락
- [ ] `as const` 사용 (→ `satisfies EpisodeContent`)
- [ ] 자막에 긴 코드 구문
- [ ] 하드코딩 타이밍 오프셋
- [ ] 조건부 렌더링으로 요소 등장
- [ ] 마지막 씬에 fadeOut
- [ ] `AbsoluteFill`에 `background: BG` 누락
- [ ] `Subtitle`이 opacity wrapper 안쪽
- [ ] 연산자 양옆 공백 누락
- [ ] FONT 하드코딩
- [ ] 요약 씬에서 기존 줄 비활성화
- [ ] 빈 화면
- [ ] 퇴장에 spring 사용

# Remotion 영상 프로젝트

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

## 자주 쓰는 명령어

### 개발 미리보기

```bash
pnpm dev
# → http://localhost:3000 에서 Remotion Studio 열림
```

### 딥링크 규칙

- 브라우저 주소로 바로 프레임 이동이 가능합니다.
  - 형식: `/[composition-id][?frame=N|#N]`
  - 초 단위도 지원: `frame=35.53s`
  - 예시: `http://localhost:3000/001-ENG-001?frame=1333`
  - 예시: `http://localhost:3000/001-ENG-001#1333`
- 현재 지원 중인 composition-id 예시:
  - `002-KOR-002`, `001-ENG-001`, 기타 `/{series-prefix}-{LANG}-{episode}` 패턴

### TTS 싱크 (나레이션 수정 후 필수)

```bash
# 특정 에피소드 싱크
pnpm sync 001-Java-Basic/KOR/001
pnpm sync 001-Java-Basic/KOR/002

# 전체 에피소드 일괄 싱크
pnpm sync:all
```

`sync`가 자동으로 처리하는 것:

- 변경된 씬만 TTS 재생성 (hash 기반 감지)
- `durationInFrames`, `speechStartFrame`, `narrationSplits` 자동 계산 → `{id}-audio.ts` 저장

### 렌더링

```bash
# 특정 에피소드 렌더링
pnpm render 001-Java-Basic/KOR/001
pnpm render 001-Java-Basic/KOR/002
# → out/ 폴더에 mp4 파일 생성

# Remotion CLI 직접 사용
npx remotion render src/index.ts 001-001 out/001.mp4
```

### 코드 품질 검사

```bash
# 전체 검사 (format → tsc → lint → test 순서)
pnpm check

# 개별 실행
pnpm format   # Prettier 포맷 적용
pnpm tsc      # TypeScript 타입 체크
pnpm lint     # ESLint 검사
pnpm test     # Vitest 단위 테스트
```

### 패키지 설치 / 업그레이드

```bash
pnpm install

# Remotion 버전 업그레이드
npx remotion upgrade
```

---

## 프로젝트 구조

```
src/
  config.ts                     — 루트 전역 설정 (FPS, CROSS, CHARS_PER_SEC 등)
  utils/
    narration.ts                — toDisplayText / toTTSText (인라인 발음 문법 파싱)
    scene.tsx                   — 공유 상수·훅·컴포넌트 (모든 씬 파일이 import)
  compositions/
    001-Java-Basic/
      config.ts                 — 강좌 레벨 설정 (언어 무관한 공통값)
      KOR/
        config.ts               — 언어 레벨 설정 (VOICE, RATE, WIDTH, HEIGHT)
        001.config.ts           — 에피소드 레벨 설정 (선택, 언어 설정 override)
        001-JavaVariables.tsx   — 에피소드 컴포지션
        001-audio.ts            — AUTO-GENERATED: durationInFrames, narrationSplits 등
scripts/
  sync.ts                       — TTS 생성 + audio config 자동 업데이트
  sync-all.ts                   — 전체 에피소드 일괄 sync
  config-cascade.ts             — 설정 계층 로드 유틸 (loadTsExports, loadMergedConfig)
  render.ts                     — 프로그래매틱 렌더링
public/                         — 생성된 mp3 파일
out/                            — 렌더링 출력
```

## 설정 계층 (Config Cascade)

```
src/config.ts                                    ← 루트 (FPS, CROSS, CHARS_PER_SEC, SCENE_TAIL_FRAMES)
  └─ compositions/001-Java-Basic/config.ts       ← 강좌 (언어 무관한 공통값)
       └─ compositions/001-Java-Basic/KOR/config.ts     ← 언어 (VOICE, RATE, WIDTH, HEIGHT)
            └─ compositions/001-Java-Basic/KOR/001.config.ts  ← 에피소드 (선택적 override)
```

하위 레벨이 상위 레벨을 덮어씀. `pnpm sync` 시 자동으로 cascade된 설정값 사용.

## 인라인 발음 문법

나레이션 텍스트에서 자막 표시와 TTS 읽기를 분리:

```
[표시텍스트(pron:TTS텍스트)]
```

예시:

```
[double(pron:더블)]          → 자막: double / TTS: 더블
[System.out.println(pron:print line)]  → 자막: System.out.println / TTS: print line
[(자료)(pron:)]형이란         → 자막: (자료)형이란 / TTS: 형이란 (묵음)
```

## 참고

- [Remotion 공식 문서](https://www.remotion.dev/docs/the-fundamentals)
- [Remotion Discord](https://discord.gg/6VzzNDwUwV)

// src/types/episode.ts
// 에피소드 콘텐츠 파일(*-2-content.ts)의 타입 정의

export type SceneContent = {
  /** 나레이션 문장 배열 (TTS + 자막에 사용) */
  narration?: string[];
  /** 화면에 표시되는 코드 스니펫 */
  code?: string;
  /** 썸네일 시리즈 라벨 (e.g. "JAVA") */
  seriesLabel?: string;
  /** 썸네일 제목 (줄바꿈: \n 사용) */
  title?: string;
  /** 썸네일 배지 텍스트 (e.g. "for") */
  badge?: string;
  /** 카드 목록 (e.g. summaryScene 카드) */
  cards?: string[];
  /** 임의 레이블 (씬별 커스텀 텍스트) */
  labels?: Record<string, string>;
  /** 항목 목록 (e.g. 개념 설명 bullet) */
  items?: string[];
  /** 씬별 추가 콘텐츠 — 자유 확장 */
  [key: string]: unknown;
};

/** 에피소드 콘텐츠 파일 전체 타입 (씬 이름 → SceneContent) */
export type EpisodeContent = Record<string, SceneContent>;

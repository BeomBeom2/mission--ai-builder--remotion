// src/compositions/001-Java-Basic/KOR/004-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n비교 연산자",
  },
  intro: {
    narration: [
      "비교 연산자는 두 값을 비교해 참 또는 거짓을 반환합니다.",
      "결과는 boolean 타입으로,\n조건문과 함께 자주 사용됩니다.",
    ],
  },
  compareScene: {
    narration: [
      "같음 연산자입니다,\n10과 3은 같지 않아 [false(pron:폴스)]입니다.",
      "다름 연산자입니다,\n10과 3은 서로 다르므로 [true(pron:트루)]입니다.",
      "초과 연산자입니다,\n10이 3보다 크므로 [true(pron:트루)]입니다.",
      "미만 연산자입니다,\n10이 3보다 작지 않아 [false(pron:폴스)]입니다.",
      "이상 연산자입니다,\n10이 3 이상이므로 [true(pron:트루)]입니다.",
      "이하 연산자입니다,\n10이 3 이하가 아니므로 [false(pron:폴스)]입니다.",
    ],
  },
  summaryScene: {
    narration: [
      "여섯 가지 비교 연산자를 정리하면 이렇습니다.",
      "결과가 참이면 [true(pron:트루)], [거짓이면(pron:거지시면)] [false(pron:폴스)]가 됩니다.",
    ],
  },
} satisfies EpisodeContent;

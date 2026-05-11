// src/compositions/001-Java-Basic/KOR/006-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n조건문",
  },
  overview: {
    narration: [
      "제어문에는 조건문과 반복문이 있습니다.",
      "조건문 중에 기본인 if 문을 알아보겠습니다.",
    ],
  },
  intro: {
    narration: [
      "조건문은 조건이 참일 때만 코드를 실행합니다.",
      "조건이 거짓일 때도 처리하려면\nelse를 사용합니다.",
    ],
  },
  ifScene: {
    narration: [
      "score가 60 이상이면 합격 메시지를 출력합니다.",
      "75는 60 이상이므로 조건이 참,\n블록 안의 코드가 실행됩니다.",
    ],
  },
  ifElseScene: {
    narration: [
      "else는 조건이 거짓일 때 실행되는 블록입니다.",
      "score가 45라면 조건이 거짓이므로\nelse 블록이 실행됩니다.",
    ],
  },
  summaryScene: {
    narration: [
      "if는 조건이 참일 때, else는 거짓일 때 실행됩니다.",
      "조건에 따라 서로 다른 코드를 실행할 수 있습니다.",
    ],
  },
} satisfies EpisodeContent;

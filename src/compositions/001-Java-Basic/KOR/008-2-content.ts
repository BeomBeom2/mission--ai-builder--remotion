// src/compositions/001-Java-Basic/KOR/008-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n반복문",
    badge: "while",
  },
  overview: {
    narration: [
      "반복문에는 여러 종류가 있습니다.",
      "그 중 기본인 [while(pron:와일)] 문을 알아보겠습니다.",
    ],
  },
  intro: {
    narration: [
      "[while(pron:와일)] 문은 조건이 참인 동안\n코드 블록을 반복 실행합니다.",
      "조건이 거짓이 되는 순간 반복을 멈춥니다.",
    ],
  },
  whileScene: {
    narration: [
      "괄호 안 조건이 참이면 블록을 실행하고\n다시 조건을 확인합니다.",
      "카운터를 증가시켜 조건을 변화시키고\n반복이 끝나게 합니다.",
    ],
  },
  executionScene: {
    narration: [
      "카운트가 1일 때, 조건이 참이므로\n블록을 실행하고 1을 출력합니다.",
      "카운트가 2일 때도 조건이 참이므로\n다시 실행합니다.",
      "카운트가 3일 때도 조건은 여전히 참입니다.",
      "카운트가 4일 때도 마찬가지입니다.",
      "카운트가 5일 때,\n조건이 참인 마지막 실행입니다.",
      "카운트가 6이 되면 조건이 거짓이 되어\n반복이 종료됩니다.",
    ],
  },
  infiniteScene: {
    narration: [
      "탈출 조건이 없으면 무한루프가 됩니다.",
      "반드시 조건을 거짓으로 만드는\n코드가 필요합니다.",
    ],
  },
  summaryScene: {
    narration: [
      "[while(pron:와일)]은 조건이 참인 동안 반복합니다.",
      "조건이 거짓이 되면 멈춥니다.",
    ],
  },
} satisfies EpisodeContent;

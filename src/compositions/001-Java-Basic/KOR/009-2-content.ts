// src/compositions/001-Java-Basic/KOR/009-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n반복문",
    badge: "for",
  },
  overview: {
    narration: [
      "반복문에는 여러 종류가 있습니다.",
      "이번엔 [for(pron:포)] 문을 알아보겠습니다.",
    ],
  },
  intro: {
    narration: [
      "[for(pron:포)] 문은 초기식, 조건식, 증감식을\n한 줄에 씁니다.",
      "조건이 참인 동안 블록을 반복 실행합니다.",
    ],
  },
  forScene: {
    narration: [
      "초기식에서 변수를 초기화하고 조건식을 확인합니다.",
      "블록 실행 후 증감식으로 변수를 변화시킵니다.",
    ],
  },
  executionScene: {
    narration: [
      "[i(pron:아이)]가 0일 때 조건이 참이므로 블록을 실행합니다.",
      "[i(pron:아이)]가 1일 때도 조건이 참입니다.",
      "[i(pron:아이)]가 2일 때도 조건이 참입니다.",
      "[i(pron:아이)]가 3일 때도 조건이 참입니다.",
      "[i(pron:아이)]가 4일 때, 조건이 참인 마지막 실행입니다.",
      "[i(pron:아이)]가 5가 되면 조건이 거짓이 되어\n반복이 종료됩니다.",
    ],
  },
  summaryScene: {
    narration: [
      "[for(pron:포)] 문은 초기식, 조건식, 증감식으로\n반복을 제어합니다.",
      "횟수가 정해진 반복에 적합합니다.",
    ],
    cards: ["초기식", "조건식", "증감식"],
  },
} satisfies EpisodeContent;

// src/compositions/001-Java-Basic/KOR/005-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n논리 연산자",
  },
  intro: {
    narration: [
      "논리 연산자는 조건들을 연결하거나 뒤집는 연산자입니다.",
      "[&&(pron:AND)], [||(pron:오얼)], [!(pron:NOT)], 세 가지를 알아봅니다.",
    ],
  },
  andScene: {
    narration: [
      "AND 연산자입니다.\nx가 [true(pron:트루)]여도 y가 [false(pron:폴스)]면\n결과는 [false(pron:폴스)]입니다.",
      "두 조건이 모두 [true(pron:트루)]여야\n비로소 [true(pron:트루)]가 됩니다.",
    ],
  },
  orScene: {
    narration: [
      "OR 연산자입니다.\nx가 [true(pron:트루)]이므로 x || y는 [true(pron:트루)]입니다.",
      "하나라도 [true(pron:트루)]면 [true(pron:트루)],\n둘 다 [false(pron:폴스)]여야 [false(pron:폴스)]가 됩니다.",
    ],
  },
  notScene: {
    narration: [
      "NOT 연산자는 참을 거짓으로,\n거짓을 참으로 뒤집습니다.",
      "[!true(pron:낫 트루)]는 [false(pron:폴스)], [!false(pron:낫 폴스)]는 [true(pron:트루)]입니다.",
    ],
  },
  summaryScene: {
    narration: [
      "세 가지 논리 연산자를 정리해보겠습니다.",
      "[&&(pron:AND)]는 모두 참이어야 결과가 참,\n[||(pron:OR)]는 하나라도 참이면 결과가 참,\n[!은(pron:나슨)] 반전입니다.",
    ],
  },
} satisfies EpisodeContent;

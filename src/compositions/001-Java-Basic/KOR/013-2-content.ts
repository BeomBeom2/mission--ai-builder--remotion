// src/compositions/001-Java-Basic/KOR/013-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n함수 실전",
    badge: "함수 실전",
  },
  printScene: {
    narration: [
      "시작 숫자와 끝 숫자를 받아서, 그 사이의 숫자를 전부 출력하는 함수입니다.",
      "결과를 예상해 보세요.",
    ],
  },
  printRevealScene: {
    narration: ["반복문이 시작부터 끝까지 하나씩 돌면서 출력합니다."],
  },
  sumScene: {
    narration: [
      "출력 대신, 합을 구해서 돌려주는 함수입니다.",
      "결과를 예상해 보세요.",
    ],
  },
  sumRevealScene: {
    narration: ["변수 하나에 숫자를 하나씩 더해서 결과를 돌려줍니다."],
  },
  sumEvenScene: {
    narration: ["짝수만 골라서 더하는 함수입니다.", "결과를 예상해 보세요."],
  },
  sumEvenRevealScene: {
    narration: ["조건문으로 나머지가 [0(pron:영)]인 숫자만 골라서 더합니다."],
  },
  comparisonScene: {
    narration: [
      "세 함수는 같은 매개변수를 받지만, 하는 일이 다릅니다.",
      "출력만 하거나, 합을 구하거나, 짝수만 합산합니다.",
    ],
  },
  callScene: {
    narration: [
      "[1(pron:일)]부터 [5(pron:오)]까지 넣으면 숫자가 차례로 출력됩니다.",
      "같은 범위의 합은 [15(pron:십오)], [1(pron:일)]부터 [6(pron:육)]까지 짝수의 합은 [12(pron:십이)]입니다.",
    ],
  },
  summaryScene: {
    narration: [
      "함수는 이름, 매개변수, 로직, [return(pron:리턴)]으로 구성됩니다.",
      "같은 구조에 로직만 바꾸면 전혀 다른 기능을 만들 수 있습니다.",
    ],
    cards: ["이름\n+\n매개변수", "로직\n+\nreturn"],
  },
} satisfies EpisodeContent;

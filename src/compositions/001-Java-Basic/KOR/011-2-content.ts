// src/compositions/001-Java-Basic/KOR/011-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n매개변수",
    badge: "매개변수",
  },
  painScene: {
    narration: [
      "이 인사 함수는 민준에게만 인사할 수 있습니다.",
      "다른 사람에게 인사하려면 함수를 더 만들어야 합니다.",
    ],
  },
  conceptScene: {
    narration: [
      "매개변수를 사용하면 하나의 함수로 해결됩니다.",
      "매개변수는 함수에 값을 전달하는 통로입니다.",
    ],
  },
  paramScene: {
    narration: [
      "괄호 안에 자료형과 이름을 쓰면 매개변수가 됩니다.",
      "이 함수는 문자열을 하나 전달받습니다.",
    ],
  },
  callScene: {
    narration: [
      "호출할 때 괄호 안에 넣는 값을 인자라고 합니다.",
      "인자가 매개변수로 전달되어 결과가 출력됩니다.",
    ],
  },
  multiParamScene: {
    narration: [
      "매개변수는 여러 개 선언할 수 있습니다.",
      "쉼표로 구분하며 순서대로 전달됩니다.",
      "첫 번째 인자는 첫 번째 매개변수로, 두 번째 인자는 두 번째 매개변수로 전달됩니다.",
    ],
  },
  argParamScene: {
    narration: [
      "선언할 때 괄호 안에 만드는 자리가 매개변수입니다.",
      "호출할 때 괄호 안에 넣는 실제 값이 인자입니다.",
    ],
  },
} satisfies EpisodeContent;

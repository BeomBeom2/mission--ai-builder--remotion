// src/compositions/001-Java-Basic/KOR/012-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nreturn",
  },
  painScene: {
    narration: [
      "이 함수는 두 수의 합을 화면에 출력만 합니다.",
      "결과를 변수에 저장하거나, 다른 계산에 쓸 수가 없습니다.",
    ],
  },
  conceptScene: {
    narration: [
      "[return(pron:리턴)]을 쓰면 함수가 결과를 밖으로 돌려줍니다.",
      "돌려받은 값은 변수에 담거나, 다른 식에 바로 사용할 수 있습니다.",
    ],
  },
  returnTypeScene: {
    narration: [
      "함수 이름 앞에는 돌려줄 값의 타입을 적어야 합니다.",
      "돌려줄 값이 없으면 [void(pron:보이드)]를 씁니다.",
      "정수를 돌려주면 [int(pron:인트)], 실수를 돌려주면 [double(pron:더블)]을 씁니다.",
    ],
  },
  returnFlowScene: {
    narration: [
      "[return(pron:리턴)]을 만나면 함수 실행이 즉시 끝납니다.",
      "그래서 [return(pron:리턴)] 아래에 있는 코드는 절대 실행되지 않습니다.",
    ],
  },
  useReturnScene: {
    narration: [
      "함수가 돌려준 값을 변수에 저장할 수 있습니다.",
      "저장 없이 바로 다른 함수의 인자로 넘길 수도 있습니다.",
    ],
  },
  comparisonScene: {
    narration: [
      "[void(pron:보이드)] 함수는 출력만 할 수 있습니다.",
      "[return(pron:리턴)]을 쓰면 결과를 가져와서 자유롭게 활용할 수 있습니다.",
    ],
  },
  summaryScene: {
    narration: [
      "[return(pron:리턴)]은 함수가 결과를 돌려주는 방법입니다.",
      "리턴 타입은 돌려줄 값의 종류를 미리 알려주는 것입니다.",
    ],
    cards: ["return\n=\n결과 돌려주기", "리턴 타입\n=\n값의 종류"],
  },
  realExampleScene: {
    narration: [
      "실감나는 예시를 보겠습니다.",
      "가격을 넣으면 할인된 가격을 돌려주는 함수를 만들 수 있습니다.",
      "이렇게 [return(pron:리턴)]을 쓰면 결과를 어디서든 활용할 수 있습니다.",
    ],
  },
} satisfies EpisodeContent;

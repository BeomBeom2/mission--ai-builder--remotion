import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n자료형",
    badge: "int · double · String · boolean",
  },
  intro: {
    narration: [
      "자료형은 값의 종류를 구분하는 기준입니다.",
      "자료형은 변수에 어떤 종류의 데이터를\n넣을 수 있는지 결정합니다.",
      "[Java(pron:자바)]의 주요 자료형 4개를 알아보겠습니다.",
    ],
  },
  valueVsVar: {
    narration: [
      "먼저 자료형 값과 자료형 변수의\n차이를 살펴보겠습니다.",
      "int형 값은 숫자 25처럼 데이터 자체입니다.",
      "int형 변수는\n그 값을 담는 이름 있는 공간입니다.",
    ],
  },
  intScene: {
    narration: [
      "int는 정수를 표현하는 자료형입니다.",
      "int형 변수는 소수점 없는 정수만\n담을 수 있습니다.",
      "나이나 [개수(pron:개쑤)]처럼\n소수점이 없는 숫자에 사용합니다.",
    ],
  },
  doubleScene: {
    narration: [
      "[double(pron:더블)]은 실수를 표현하는 자료형입니다.",
      "[double(pron:더블)]형 변수는 소수점이 있는 수를 담습니다.",
      "키나 무게처럼 정밀한 값이 필요할 때 사용합니다.",
    ],
  },
  stringScene: {
    narration: [
      "String은 문자열을 표현하는 자료형입니다.",
      "String형 변수는 텍스트 데이터를 담습니다.",
      "정확히는 참조이지만, 지금은 넘어가겠습니다.",
      "이름이나 메시지처럼 텍스트를 다룰 때 사용합니다.",
    ],
  },
  booleanScene: {
    narration: [
      "boolean은 참 또는 거짓을 표현하는 자료형입니다.",
      "boolean형 변수는\ntrue 또는 false 값만 가질 수 있습니다.",
      "조건 검사 결과를 담을 때 사용합니다.",
    ],
  },
  summaryScene: {
    narration: [
      "네 가지 자료형을 코드로 정리하면 이렇습니다.",
      "상황에 맞는 자료형을 선택하는 것이 중요합니다.",
    ],
  },
} satisfies EpisodeContent;

import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n산술 연산자",
    badge: "+ - * / %",
  },
  intro: {
    narration: [
      "산술 연산자는 수학적 계산을 수행하는 연산자입니다.",
      "더하기, 빼기, 곱하기, 나누기, 나머지,\n총 다섯 가지를 알아봅니다.",
    ],
  },
  addSubScene: {
    narration: [
      "더하기 연산자는 두 값을 더합니다.",
      "빼기 연산자는 첫 번째 값에서\n두 번째 값을 뺍니다.",
    ],
  },
  mulDivScene: {
    narration: [
      "곱하기 연산자는 두 값을 곱합니다.",
      "나누기 연산자는 첫 번째 값을\n두 번째 값으로 나눕니다.",
      "정수끼리 나누면 소수점은 버려집니다.",
    ],
  },
  remScene: {
    narration: [
      "나머지 연산자는 나눗셈에서\n몫이 아닌 나머지를 구합니다.",
      "11을 3으로 나누면\n몫은 3이고 나머지는 2입니다.",
      "짝수 홀수 판별처럼 다양한 계산에 활용됩니다.",
    ],
  },
  summaryScene: {
    narration: [
      "다섯 가지 산술 연산자를 코드로 정리하면 이렇습니다.",
      "각 연산의 결과를 변수에 저장해 활용할 수 있습니다.",
    ],
  },
} satisfies EpisodeContent;

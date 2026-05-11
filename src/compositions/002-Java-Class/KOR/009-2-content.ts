import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "변수는 언제 생성되고,\n언제 사라지나",
    subtitle: "지역변수 vs\n인스턴스 변수",
    badge: "변수 범위",
  },
  instanceVarScene: {
    narration: [
      "이전 시간에 배운 필드, 즉 인스턴스 변수는 객체 안에 존재합니다.",
      "객체가 살아있는 동안 값이 유지되고, 객체 안 어디서든 접근할 수 있습니다.",
    ],
  },
  localVarScene: {
    narration: [
      "메서드 안에서 선언한 변수는 지역변수라고 합니다.",
      "지역변수는 메서드가 실행될 때 생기고, 메서드가 끝나면 사라집니다.",
    ],
  },
  paramScene: {
    narration: [
      "매개변수도 지역변수의 일종입니다.",
      "메서드를 호출할 때 전달받은 값(mute:인자)이 저장되는 변수인데, 메서드 안에서만 사용할 수 있습니다.",
      "메서드가 끝나면 매개변수도 사라집니다.",
    ],
  },
  comparisonScene: {
    narration: [
      "둘의 차이를 정리하면 이렇습니다.",
      "인스턴스 변수는 객체와 함께 살고, 지역변수는 메서드와 함께 삽니다.",
      "인스턴스 변수는 객체 전체에서 쓸 수 있고, 지역변수는 선언된 메서드 안에서만 쓸 수 있습니다.",
    ],
  },
  exampleScene: {
    narration: [
      "현실적인 예를 들어보겠습니다.",
      "[balance(pron:밸런스)]는 인스턴스 변수이고, [amount(pron:어마운트)]와 [newBal(pron:뉴발란스)]는 지역변수입니다.",
      "[deposit(pron:디파짓)] 1000을 호출하면 지역변수가 생기고, 메서드가 끝나면 사라집니다.",
      "하지만 [balance(pron:밸런스)]는 1000이 그대로 남아있습니다.",
      "한 번 더 [deposit(pron:디파짓)] 500을 호출하면, 지역변수는 다시 새로 생깁니다.",
      "메서드가 끝나면 지역변수는 또 사라지지만, [balance(pron:밸런스)]만 1500으로 유지됩니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "인스턴스 변수는 객체에 속하고, 객체가 살아있는 동안 유지됩니다.",
      "지역변수와 매개변수는 메서드에 속하고, 메서드가 끝나면 사라집니다.",
    ],
  },
} satisfies EpisodeContent;

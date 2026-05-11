import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "클래스는 객체를\n생성하기 위한 틀이다",
    subtitle: "틀이 있다면 제품을\n쉽게 많이 만들 수 있다",
    badge: "클래스",
  },
  painScene: {
    narration: [
      "6가지 맛의 별 모양 쿠키를 만들어야 합니다.",
      "그런데 밀가루 반죽을 손으로 직접 빚어 별 모양으로 만들기는 쉽지 않습니다.",
    ],
  },
  analogyScene: {
    narration: [
      "쿠키를 만들 때 쿠키 틀을 사용하면, 같은 모양의 쿠키를 쉽게 여러 개 만들 수 있습니다.",
      "프로그래밍에서도 이런 틀이 있습니다. 바로 클래스입니다.",
    ],
  },
  arrayScene: {
    narration: [
      "사실 [int(pron:인트)] 배열도 일종의 틀입니다.",
      "크기가 3인 [int(pron:인트)] 배열이라는 틀이 있으면, 같은 구조의 배열객체를 여러 개 만들 수 있습니다.",
    ],
  },
  limitScene: {
    narration: [
      "하지만 배열에는 한계가 있습니다.",
      "[int(pron:인트)] 배열은 [int(pron:인트)]만 담을 수 있어서, 객체의 구성요소를 마음대로 정할 수 없습니다.",
      "이 문제를 해결하는 것이 바로 class입니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "클래스는 객체를 만드는 틀입니다.",
      "틀이 있으면 비슷한 객체를 쉽게 여러 개 만들 수 있습니다.",
      "[int(pron:인트)] 배열도 일종의 틀이지만, 구성요소를 자유롭게 정할 수 없습니다.",
      "class를 사용하면 객체의 구성을 마음대로 정할 수 있습니다.",
    ],
  },
} satisfies EpisodeContent;

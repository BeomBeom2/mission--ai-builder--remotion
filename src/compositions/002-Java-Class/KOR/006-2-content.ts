import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "왜 클래스가\n필요한가",
    subtitle: "배열과 달리 클래스로 객체를 만들면\n자유도가 높아진다",
    badge: "class",
  },
  arrayPainScene: {
    narration: [
      "한 사람을 구성하는 정보가 번호, 나이, 키, 이렇게 3개라고 가정해보겠습니다.",
      "[int(pron:인트)] 배열로 사람 정보를 담으면, [[0]번이(pron:인덱스 영번이)] 번호인지, 나이인지 알기 어렵습니다.",
      "배열은 인덱스로만 접근하기 때문에, 어떤 값이 무엇을 의미하는지 한눈에 알 수 없습니다.",
    ],
  },
  classSolutionScene: {
    narration: [
      "클래스를 쓰면 이 문제가 해결됩니다.",
      "[.id(pron:닷 아이디)], [.age(pron:닷 에이지)], [.height(pron:닷 하이트)]처럼 이름으로 접근할 수 있습니다.",
    ],
  },
  flexScene: {
    narration: [
      "게다가 [height(pron:하이트)]를 [double(pron:더블)]로 바꿀 수도 있고,",
      "[name(pron:네임)]이나 [married(pron:매리드)] 같은 필드도 자유롭게 추가할 수 있습니다.",
    ],
  },
  comparisonScene: {
    narration: [
      "두 방식을 비교해 보겠습니다.",
      "배열은 인덱스로만 접근하고, [int(pron:인트)]만 담을 수 있습니다.",
      "클래스는 이름으로 접근하고, 다양한 타입을 자유롭게 구성할 수 있습니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "배열은 인덱스로만 접근하고, 같은 타입만 담을 수 있습니다.",
      "클래스로 객체를 만들면 이름으로 접근하고, 다양한 타입을 자유롭게 구성할 수 있습니다.",
    ],
  },
} satisfies EpisodeContent;

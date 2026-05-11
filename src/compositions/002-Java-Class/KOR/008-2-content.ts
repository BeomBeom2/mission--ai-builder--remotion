import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "같은 행동\n다른 결과",
    subtitle: "객체마다 다른\n맥락을 가진다",
    badge: "context",
  },
  contextIntroScene: {
    narration: [
      "같은 행동이라도, 상황에 따라 결과가 달라질 수 있습니다.",
      "이 상황을 프로그래밍에서는 맥락, 영어로 [context(pron:컨텍스트)]라고 합니다.",
    ],
  },
  carExampleScene: {
    narration: [
      "예를 들어, 속력이 30인 자동차와 속력이 230인 자동차가 있습니다.",
      "두 자동차가 똑같이 [2번(pron:두번)] 주행하면, 주행거리[(마일리지)(pron:)]는 완전히 다릅니다.",
      "같은 행동이지만, 자동차의 상태가 다르기 때문에 결과가 달라진 것입니다.",
    ],
  },
  objectContextScene: {
    narration: [
      "객체도 마찬가지입니다.",
      "같은 메서드를 호출해도, 객체의 필드 값에 따라 결과가 달라집니다.",
      "즉, 객체는 메서드가 실행되는 맥락입니다.",
    ],
  },
  personClassScene: {
    narration: [
      "조금 더 현실적인 예시를 살펴보겠습니다.",
      "이름, 나이, 키, 성별을 필드로 갖고, [introduce(pron:인트로듀스)]라는 메서드를 가진 [Person(pron:퍼슨)] 클래스입니다.",
    ],
  },
  personExampleScene: {
    narration: [
      "철수는 25살 남성이고, 영희는 22살 여성입니다.",
      "둘 다 똑같은 [introduce(pron:인트로듀스)]를 호출하지만, 출력 결과는 전혀 다릅니다.",
      "같은 메서드라도, 객체의 필드가 다르면 결과가 완전히 달라집니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "같은 행동도 맥락에 따라 다른 결과를 냅니다.",
      "객체의 필드가 바로 그 맥락이고, 메서드는 그 맥락 위에서 실행됩니다.",
    ],
  },
} satisfies EpisodeContent;

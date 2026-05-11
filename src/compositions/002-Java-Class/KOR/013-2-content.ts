import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "모든 객체가\n공유하는 값",
    subtitle: "static 필드로\n클래스 레벨 상태 관리",
    badge: "static",
  },
  painScene: {
    narration: [
      "`[Person(pron:퍼슨)]` 객체를 만들 때마다 `count` 필드가 각자 생깁니다.",
      "`[p1.count(pron:피원 점 카운트)]`, `[p2.count(pron:피투 점 카운트)]`, `[p3.count(pron:피쓰리 점 카운트)]` 모두 따로 존재합니다.",
    ],
  },
  introScene: {
    narration: [
      "`[static(pron:스태틱)]` 키워드를 붙이면 필드가 클래스 영역에 단 하나만 만들어집니다.",
      "객체가 몇 개 생기든, 이 하나를 모두 함께 씁니다.",
    ],
  },
  staticFieldScene: {
    narration: [
      "생성자에서 `[Person.count(pron:퍼슨 점 카운트)]`를 1씩 올리면, 객체가 생길 때마다 자동으로 누적됩니다.",
      "힙에는 객체가 각자의 `id`, `age`를 갖고, 클래스 영역의 `count`는 모두가 공유합니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "`[static(pron:스태틱)]` 필드는 클래스 영역에 하나만 존재하며, 모든 인스턴스가 공유합니다.",
      "객체 수 세기처럼 클래스 전체에 걸친 상태를 관리할 때 씁니다.",
    ],
  },
} satisfies EpisodeContent;

import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "이름이\n겹칠 때 this",
    subtitle: "지역 변수와 인스턴스 변수를\n구분하는 법",
    badge: "this",
  },
  problemScene: {
    narration: [
      "[setName(pron:셋 네임)] 메서드의 매개변수 이름이 [name(pron:네임)]입니다.",
      "그런데 인스턴스 변수 이름도 [name(pron:네임)]입니다.",
      "[name(pron:네임)] = [name(pron:네임)]이라고 쓰면, 자바는 둘 다 매개변수로 인식합니다.",
    ],
  },
  whyScene: {
    narration: [
      "왜 그럴까요?",
      "자바는 가까운 범위의 변수를 우선합니다.",
      "메서드 안에서 [name(pron:네임)]이라고 쓰면, 매개변수 [name(pron:네임)]이 더 가깝기 때문에 매개변수를 가리킵니다.",
    ],
  },
  thisIntroScene: {
    narration: [
      "이 문제를 해결하는 키워드가 [this(pron:디스)]입니다.",
      "[this(pron:디스)]는 지금 이 메서드를 실행하고 있는 객체 자기 자신을 가리킵니다.",
    ],
  },
  thisSolveScene: {
    narration: [
      "[this(pron:디스)].[name(pron:네임)]이라고 쓰면, 인스턴스 변수 [name(pron:네임)]을 가리킵니다.",
      "오른쪽의 [name(pron:네임)]은 매개변수이고, 왼쪽의 [this(pron:디스)].[name(pron:네임)]은 인스턴스 변수입니다.",
      "이제 둘이 구분됩니다.",
    ],
  },
  noConflictScene: {
    narration: [
      "만약 매개변수 이름을 [newName(pron:뉴 네임)]처럼 다르게 지으면 어떨까요?",
      "이름이 겹치지 않으면, [this(pron:디스)] 없이도 자바가 알아서 구분합니다.",
      "[this(pron:디스)]를 생략해도 문제가 없습니다.",
    ],
  },
  whenToUseScene: {
    narration: [
      "그래서 [this(pron:디스)]는 언제 써야 할까요?",
      "매개변수와 인스턴스 변수의 이름이 같을 때 사용합니다.",
      "이름이 다르면 쓰지 않아도 됩니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "[this(pron:디스)]는 자기 자신 객체를 가리킵니다.",
      "매개변수와 인스턴스 변수 이름이 같을 때, [this(pron:디스)]로 인스턴스 변수를 구분합니다.",
      "이름이 다르면 [this(pron:디스)]를 생략해도 됩니다.",
    ],
  },
} satisfies EpisodeContent;

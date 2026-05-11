import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "필드 초기화\n자동화하기",
    subtitle: "객체를 만들 때마다\n반복하는 걸 없앤다",
    badge: "생성자",
  },
  painScene: {
    narration: [
      "지금까지 객체를 만든 뒤, 필드를 하나하나 세팅했습니다.",
      "객체를 만들 때마다 각 필드마다 초기화를 해야하니 번거롭고, 일부 필드에는 실수로 초기화를 빠뜨릴 수도 있습니다.",
    ],
  },
  whatIsScene: {
    narration: [
      "[new Person()(pron:뉴 퍼슨)]을 자세히 보겠습니다.",
      "여기서 [Person()(pron:퍼슨)]은, 사실 생성자를 호출한 것입니다.",
      "생성자는 객체가 만들어질 때 자동으로 실행되는 특별한 메서드입니다.",
    ],
  },
  defaultScene: {
    narration: [
      "그런데 우리는 생성자를 만든 적이 없습니다.",
      "[Java(pron:자바)]는 생성자가 없으면, 빈 생성자를 자동으로 만들어 줍니다.",
      "이것을 기본 생성자라고 합니다.",
    ],
  },
  customScene: {
    narration: [
      "생성자를 직접 만들 수도 있습니다.",
      "생성자 안에 초기값을 넣으면, 객체가 만들어질 때 자동으로 세팅됩니다.",
    ],
  },
  comparisonScene: {
    narration: [
      "두 방식을 비교해 보겠습니다.",
      "생성자가 없으면, 필드를 하나하나 세팅해야 합니다.",
      "생성자를 만들면, 객체를 만드는 순간 자동으로 초기화됩니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "[new Person()(pron:뉴 퍼슨)]에서 [Person()(pron:퍼슨)]은 생성자 호출입니다.",
      "생성자가 없으면 [Java(pron:자바)]가 기본 생성자를 자동으로 만들어 줍니다.",
      "직접 생성자를 만들면, 객체 생성 시 원하는 초기값을 세팅할 수 있습니다.",
    ],
  },
} satisfies EpisodeContent;

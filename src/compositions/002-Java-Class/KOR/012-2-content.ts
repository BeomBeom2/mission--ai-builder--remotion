import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "객체 생성을\n한 줄로",
    subtitle: "매개변수 생성자로\n필드 초기화를 편하게",
    badge: "파라미터 생성자",
  },
  painScene: {
    narration: [
      "지금까지는 `new [Person(pron:퍼슨)]()` 처럼 객체를 만들고, 필드를 하나씩 같은 값으로 초기화했습니다.",
      "사람이 여러 명이 되면 매번 비슷한 코드를 반복하게 되어 작성도 길고 실수 가능성도 커집니다.",
    ],
  },
  paramScene: {
    narration: [
      "이제 매개변수 생성자를 쓰면 객체 생성 시점에 필요한 값들을 같이 전달할 수 있습니다.",
      "생성자 메서드에 `int id`, `int age`, `int [height(pron:하이트)]` 같은 매개변수를 넣고, 그 값을 필드에 넣으면 됩니다.",
      "값을 받을 수 있으면 기본값의 제약에서 벗어납니다.",
    ],
  },
  thisScene: {
    narration: [
      "[this(pron:디스)]가 없으면, 생성자 내부에서 `[id(pron:아이디)] [=(pron:이퀄)] [id(pron:아이디)]` 처럼 이상한 코드가 발생하고 제대로 작동하지도 않습니다.",
      "[this(pron:디스)]는 현재 객체 자신을 가리키므로 `[this.id(pron:디스 점 아이디)]`는 필드임을 명확히 합니다.",
    ],
  },
  multiScene: {
    narration: [
      "동일한 생성자로 `id`, `age`, `[height(pron:하이트)]`를 한 번에 받으면 필드 초기화가 한 흐름으로 끝납니다.",
      "필요할 때마다 `new [Person(pron:퍼슨)] (2, 25, 175)` 와 같이 객체별 상태를 다르게 만들 수 있습니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "매개변수 생성자는 객체 생성과 동시에 외부 값을 받아 필드를 초기화합니다.",
      "[this(pron:디스)]는 필드와 매개변수를 구분하는 핵심 문법입니다.",
    ],
  },
} satisfies EpisodeContent;

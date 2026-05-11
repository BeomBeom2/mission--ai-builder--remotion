import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\n변수",
    badge: "선언 · 초기화 · 출력",
  },
  intro: {
    narration: [
      "변수는 데이터를 담는 상자입니다.",
      "상자에 이름을 붙이고, 값을 넣고,\n꺼내 쓸 수 있습니다.",
    ],
  },
  declaration: {
    title: "1. 변수 선언 (Declaration)",
    narration: [
      "변수를 사용하려면 먼저 선언이 필요합니다.",
      "int age 라고 쓰면\n정수형 변수 age가 만들어집니다.",
      "[int(pron:인트)]가 정확히 뭔지는 나중에 알아보겠습니다.",
      "지금은 일단 변수를, 데이터를 담을 수 있는 공간으로 이해하시면 됩니다.",
    ],
  },
  initialization: {
    title: "2. 변수 초기화 (Initialization)",
    narration: [
      "선언한 변수에 처음으로 값을 넣는 것을\n초기화라고 합니다.",
      "age 변수에는 25가 저장되었습니다.",
    ],
  },
  interpret: {
    narration: [
      "변수의 해석은 두 가지로 구분됩니다.",
      "선언하거나 값을 넣을 때만 공간으로 인식되고,\n그 외에는 값으로 인식됩니다.",
      "이 부분의 age는 25로 해석됩니다.",
    ],
  },
  interpretQuiz: {
    narration: [
      "앞 부분의 age 변수는\n공간으로 해석해야 할까요?\n아니면 값으로 해석해야 할까요?",
    ],
  },
  interpretReveal: {
    narration: [
      "정답은 공간입니다.",
      "값을 대입받는 왼쪽 자리이기 때문이죠.",
      "우측의 [age(pron:에이지)]는 값으로 해석해야 합니다.\n즉 4라고 해석해야 합니다.",
    ],
  },
  print: {
    title: "3. 변수 출력 (Print)",
    narration: [
      "이제 변수의 값을 화면에 출력해보겠습니다.",
      "[System.out.println(pron:print line)] 메서드를 사용하면\n괄호 안에 있는 변수의 값이 콘솔에 출력됩니다.",
      "실행하면 25가 출력되는 것을 확인할 수 있습니다.",
    ],
  },
} satisfies EpisodeContent;

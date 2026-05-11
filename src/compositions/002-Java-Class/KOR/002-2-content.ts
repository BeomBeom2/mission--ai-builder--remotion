import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "객체는\n힙에 산다",
    subtitle: "힙과 스택의\n역할 분담",
    badge: "메모리",
  },
  processScene: {
    narration: [
      "프로그램이 실행되면 프로세스가 생성됩니다.",
      "지금은 프로세스가 실행 중인 프로그램이라고 생각하시면 됩니다.",
    ],
  },
  memoryScene: {
    narration: [
      "프로그램이 실행되면서 생성되는 변수는 실제로는 메모리에 위치하게 됩니다.",
      "메모리는 크게 스택 영역과 힙 영역으로 나뉩니다.",
      "객체는 힙에 저장됩니다.",
      "그 외 자료는 스택 영역에 저장됩니다.",
    ],
  },
  variableIntroScene: {
    narration: [
      "지금부터 말하는 변수는 모두 [메서드(함수)(pron:메써드)] 안의 지역 변수라고 생각하시면 됩니다.",
      "지역 변수와 인스턴스 변수에 대한 개념은 나중에 다루겠습니다.",
    ],
  },
  variableScene: {
    narration: [
      "기본형 변수와 참조형 변수 모두,\n변수 자체는 스택에 생성됩니다.",
      "상자(mute:변수) 안에 보물(mute:값)이 직접 들어있으면\n기본형 변수입니다.",
      "new 키워드로 만든 객체는 힙에 생성되고,\n변수에는 해당 객체의 참조가 저장됩니다.",
      "중요하니 다시 한번 강조하겠습니다. 참조형 변수에는 해당 객체의 주소[(리모콘)(pron:)]가 저장됩니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.\n프로그램이 실행되면 프로세스가 생성됩니다.",
      "프로세스의 메모리는 스택, 힙, 데이터, 코드 영역으로 나뉩니다.",
      "객체는 힙에, 그 외 변수는 스택에 저장됩니다.",
      "데이터 영역과 코드 영역은 나중에 알아보겠습니다.",
    ],
  },
} satisfies EpisodeContent;

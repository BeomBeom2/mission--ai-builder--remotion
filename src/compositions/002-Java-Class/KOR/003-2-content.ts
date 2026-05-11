import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "참조형 변수",
    subtitle: "객체는 너무 커서\n변수 밖에 위치합니다",
    badge: "참조 타입",
  },
  introScene: {
    narration: [
      "변수에는 두 가지 종류가 있습니다.\n기본형 변수와 참조형 변수입니다.",
      "기본형 변수는 값을 직접 가지고,\n참조형 변수는 객체를 가지지 않고 가리킵니다.",
      "기본형 자료형은 8가지입니다.\n[byte(pron:바이트)], [short(pron:쇼트)], int, long, [float(pron:플롯)], [double(pron:더블)], [char(pron:캐릭터)], boolean.",
      "그 외에는 전부 참조형 변수입니다.",
      "중요하니 다시 한번 강조하겠습니다.\n자바에서 기본형 변수 8종을 제외한 모든 변수는 값이 아닌 실체의 위치정보만 가집니다.",
    ],
  },
  analogyScene: {
    narration: [
      "변수는 상자, 값은 보물이라고 생각하고 설명해보겠습니다.",
      "참조가 뭔지 자세히 알아보겠습니다.",
      "상자 안에 보물이 직접 들어있으면 기본형입니다.",
      "상자 안에 보물의 위치가 적힌 쪽지만 들어있으면\n이것이 참조형 변수입니다.",
    ],
  },
  whyRefScene: {
    narration: [
      "객체는 너무 커서 하나의 변수에 들어갈 수 없습니다.",
      "그래서 자바에서는 객체를 변수 밖, 힙에 만들고\n변수로는 해당 객체의 주소만 가지게 합니다.",
      "이때 변수에 들어있는 주소를\n리모콘으로 이해하시면 편합니다.",
    ],
  },
  memoryScene: {
    narration: [
      "int age를 선언하면\n스택에 age 칸이 생기고 25가 직접 들어갑니다.",
      "기본형 변수는 이렇게 값 자체를 가집니다.",
      "이번에는 배열 객체를 만들어 보겠습니다.\n[new(pron:뉴)]를 쓰면 힙에 객체가 만들어집니다.",
      "여기서 주의하셔야 할 점이 있습니다.",
      "[numbers(pron:넘버즈)]는 지역 변수입니다. 객체가 아닙니다.\n[numbers(pron:넘버즈)]는 객체의 주소를 가질 뿐입니다.",
      "[numbers(pron:넘버즈)]는 스택에 생성되고,\n그 안에는 힙에 있는 [배열(객체)(pron:배열)]의 주소만 들어있습니다.",
      "[numbers(pron:넘버즈)]는 배열을 가진 게 아니라\n가리키고 있는 겁니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.\n기본형 변수는 값을 직접 가집니다.",
      "참조형 변수는 객체를 가지지 않고 가리킵니다.",
    ],
  },
} satisfies EpisodeContent;

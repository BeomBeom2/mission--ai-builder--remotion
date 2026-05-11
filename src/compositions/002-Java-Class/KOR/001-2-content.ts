// src/compositions/002-Java-Class/KOR/001-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "객체는\n묶음이다",
    subtitle: "객체 == 데이터 묶음",
    badge: "객체",
  },
  painScene: {
    narration: [
      "미국에 있는 친구에게 상자 네 개를 보내야 합니다.",
      "따로 보내면 배에 네 번 싣고, 네 번 내리고, 트레일러에 네 번 실어야 합니다.",
    ],
  },
  packageScene: {
    narration: [
      "하나로 묶어서 보내면 한 번이면 됩니다.",
      "싣고, 내리고, 옮기는 과정이 전부 한 번으로 줄어듭니다.",
    ],
  },
  codeAnalogy: {
    narration: [
      "프로그램에서도 마찬가지입니다.",
      "한 사람의 이름, 나이, 점수, 학년을 따로 관리하면 불편합니다.",
    ],
  },
  bundleScene: {
    narration: [
      "관련된 데이터끼리 하나로 묶은 것을 객체라고 합니다.",
      "필요할 때 객체째로 전달하면 됩니다.",
      "정확히는 객체의 참조를 전달하는 것이지만, 지금은 넘어가겠습니다.",
    ],
  },
  objectPreview: {
    narration: [
      "이름, 나이, 점수를 하나의 객체로 묶으면 이렇게 됩니다.",
      "객체 하나에 관련된 데이터가 전부 들어 있습니다.",
    ],
  },
  outroScene: {
    narration: ["객체를 만드는 방법은 다음에 알아보겠습니다."],
  },
} satisfies EpisodeContent;

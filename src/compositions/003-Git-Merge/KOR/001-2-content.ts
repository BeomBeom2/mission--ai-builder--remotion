// src/compositions/003-Git-Merge/KOR/001-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "GIT",
    title: "3-way\nmerge",
    badge: "merge",
  },
  introScene: {
    narration: [
      "Git에서 브랜치를 합칠 때는, [3-way merge(pron:쓰리 웨이 머지)]가 사용됩니다.",
      "두 브랜치와 공통 조상, 총 세 지점을 비교하는 방식입니다.",
    ],
  },
  branchScene: {
    narration: [
      "두 브랜치가 같은 커밋에서 분기된 지점을 공통 조상이라고 합니다.",
      "이후 각 브랜치는 독립적으로 변경 사항을 추가합니다.",
    ],
  },
  compareScene: {
    narration: [
      "Git은 공통 조상을 기준으로, 각 브랜치가 어떤 부분을 바꿨는지 파악합니다.",
      "한쪽만 수정한 줄은 자동으로 합쳐지고, 양쪽이 같은 줄을 다르게 바꿨을 때 충돌이 발생합니다.",
    ],
  },
  resultScene: {
    narration: [
      "충돌이 없다면, 두 브랜치의 변경 사항이 합쳐진 머지 커밋이 만들어집니다.",
      "이것이 [3-way merge(pron:쓰리 웨이 머지)]의 핵심 원리입니다.",
    ],
  },
} satisfies EpisodeContent;

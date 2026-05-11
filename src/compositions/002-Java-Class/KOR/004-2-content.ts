// src/compositions/002-Java-Class/KOR/002-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "배열 객체도\n객체다",
    subtitle: "new 로 생성하면\n객체다",
    badge: "배열",
  },
  scatteredScene: {
    narration: [
      "객체가 없다면 한 사람의 번호, 나이, 키를 변수 3개로 따로 관리해야 합니다.",
      "사람이 2명이면 변수가 6개, 10명이면 30개가 필요합니다.",
      "이름도 헷갈리고, 관리도 어렵습니다.",
    ],
  },
  arraySolution: {
    narration: [
      "배열을 쓰면 한 사람의 데이터를 하나로 묶을 수 있습니다.",
      "[new(pron:뉴)] 키워드를 사용하면\n힙에 객체가 생성되고, 그 안에 3개의 값을 넣을 수 있습니다.",
      "번호, 나이, 키를 순서대로 넣어 보겠습니다.",
      "객체를 하나 더 만들어 보겠습니다.",
      "[person1(pron:퍼슨1)] 변수로 숫자 3개를 컨트롤 할 수 있고,",
      "[person2(pron:퍼슨2)] 변수로도 숫자 3개를 컨트롤 할 수 있습니다.",
    ],
  },
  instanceScene: {
    narration: [
      "이렇게 만들어진 배열 하나하나를 객체, 또는 인스턴스라고 합니다.",
      "그 안에 있는 변수 하나하나를 요소, 혹은 인스턴스 변수라고 합니다.",
    ],
  },
  comparisonScene: {
    narration: [
      "왼쪽은 변수를 따로 관리하는 방식이고,\n오른쪽은 배열로 묶은 방식입니다.",
      "묶으면 한 사람의 데이터가 하나의 단위로 관리됩니다.",
    ],
  },
  summaryScene: {
    narration: [
      "관련 데이터를 하나로 묶는 것이 객체의 핵심입니다.",
      "다음에는 클래스에 대해서 알아보겠습니다.",
    ],
  },
} satisfies EpisodeContent;

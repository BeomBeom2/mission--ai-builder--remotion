// src/compositions/001-Java-Basic/KOR/007-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nswitch",
  },
  overview: {
    narration: [
      "다양한 조건을 처리할 때\n[switch(pron:스위치)] 표현식을 사용할 수 있습니다.",
      "[if(pron:이프)]문 대신 더 깔끔하게\n조건을 분기할 수 있습니다.",
    ],
  },
  intro: {
    narration: [
      "요일에 따라 다른 메시지를 출력하려면\n[if(pron:이프)]문을 여러 번 반복해야 합니다.",
      "[switch(pron:스위치)] 표현식을 쓰면\n훨씬 간결하게 작성할 수 있습니다.",
    ],
  },
  syntaxScene: {
    narration: [
      "[switch(pron:스위치)] 뒤에 조건값을 쓰고,\n각 케이스에 화살표로 결과를 연결합니다.",
      "화살표 문법을 사용하면 코드가 훨씬 간결해집니다.",
    ],
  },
  multiCaseScene: {
    narration: [
      "여러 값을 하나의 케이스로 묶어\n중복 없이 처리할 수 있습니다.",
      "[switch(pron:스위치)] 표현식은 값을 반환하므로\n변수에 바로 대입할 수 있습니다.",
    ],
  },
  summaryScene: {
    narration: [
      "정리하겠습니다.",
      "화살표 문법으로 각 케이스를\n간결하게 작성할 수 있습니다.",
      "화살표 문법에서는 각 케이스가 끝나면\n자동으로 종료됩니다.",
      "값 반환과 케이스 묶기로\n[if(pron:이프)]문 보다 더 유용하게 사용할 수 있습니다.",
    ],
  },
} satisfies EpisodeContent;

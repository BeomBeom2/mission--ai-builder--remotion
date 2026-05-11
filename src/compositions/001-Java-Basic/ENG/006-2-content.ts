// src/compositions/001-Java-Basic/ENG/006-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nConditionals",
  },
  overview: {
    narration: [
      "Control flow includes conditionals and loops.",
      "Let's start with the most basic conditional, if.",
    ],
  },
  intro: {
    narration: [
      "A conditional runs code only when its condition is true.",
      "If you also want to handle the false case,\nuse else.",
    ],
  },
  ifScene: {
    narration: [
      "If the score is at least 60,\nit prints a pass message.",
      "75 is at least 60,\nso the condition is true and the block runs.",
    ],
  },
  ifElseScene: {
    narration: [
      "Else is the block that runs\nwhen the condition is false.",
      "If the score is 45,\nthe condition is false, so the else block runs.",
    ],
  },
  summaryScene: {
    narration: [
      "If runs when the condition is true.\nElse runs when the condition is false.",
      "This lets you run different code\nbased on different situations.",
    ],
  },
} satisfies EpisodeContent;

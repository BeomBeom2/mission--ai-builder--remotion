// src/compositions/001-Java-Basic/ENG/005-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nLogical Operators",
  },
  intro: {
    narration: [
      "Logical operators connect conditions\nor flip them around.",
      "We will look at three of them:\n[AND,(pron:AND.)] [OR,(pron:OR.)] and NOT.",
    ],
  },
  andScene: {
    narration: [
      "This is the AND operator.\nEven if x is true, if y is false,\nthe result is false.",
      "The result becomes true\nonly when both conditions are true.",
    ],
  },
  orScene: {
    narration: [
      "This is the OR operator.\nBecause x is true, the whole expression is true.",
      "If even one side is true, the result is true.\nIt becomes false only when both sides are false.",
    ],
  },
  notScene: {
    narration: [
      "The NOT operator flips true to false\nand false to true.",
      "[!true(pron:not true)] is false, and [!false(pron:not false)] is true.",
    ],
  },
  summaryScene: {
    narration: [
      "Let's summarize the three logical operators.",
      "AND needs every condition to be true.\nOR needs at least one true condition.\nNOT reverses the result.",
    ],
  },
} satisfies EpisodeContent;

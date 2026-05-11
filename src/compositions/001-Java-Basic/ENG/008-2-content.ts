// src/compositions/001-Java-Basic/ENG/008-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nLoops",
    badge: "while",
  },
  overview: {
    narration: [
      "There are several kinds of loops.",
      "Let's start with the basic while statement.",
    ],
  },
  intro: {
    narration: [
      "A while loop keeps running the block\nwhile the condition stays true.",
      "As soon as the condition becomes false,\nthe loop stops.",
    ],
  },
  whileScene: {
    narration: [
      "If the condition inside the parentheses is true,\nthe block runs and the condition is checked again.",
      "The counter increases,\nwhich changes the condition and eventually ends the loop.",
    ],
  },
  executionScene: {
    narration: [
      "When count is 1, the condition is true,\nso the block runs and prints 1.",
      "When count is 2, the condition is still true,\nso it runs again.",
      "When count is 3, the condition is still true.",
      "The same is true when count is 4.",
      "When count is 5,\nthis is the last time the condition is true.",
      "When count becomes 6, the condition is false,\nso the loop ends.",
    ],
  },
  infiniteScene: {
    narration: [
      "Without an exit condition, it becomes an infinite loop.",
      "You need code that eventually\nmakes the condition false.",
    ],
  },
  summaryScene: {
    narration: [
      "While keeps running while the condition is true.",
      "It stops when the condition becomes false.",
    ],
  },
} satisfies EpisodeContent;

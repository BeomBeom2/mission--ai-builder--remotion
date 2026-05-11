// src/compositions/001-Java-Basic/ENG/010-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nFunctions",
    badge: "Function",
  },
  painScene: {
    narration: [
      "The same code is repeated five times.",
      "If you had to change one name later,\nyou would have to fix every copy by hand.",
    ],
  },
  conceptScene: {
    narration: [
      "That is exactly what functions are for.",
      "A function is a named block of code.",
    ],
  },
  declarationScene: {
    narration: [
      "This is how a function is declared.",
      "For now, focus on the function name.",
    ],
  },
  callScene: {
    narration: [
      "To use a function, you call it by name.",
      "You can declare it once and call it many times.",
    ],
  },
  summaryScene: {
    narration: [
      "A function groups repeated code under one name.",
      "You declare it once and call it many times.",
    ],
    cards: ["Declare once", "Call many times"],
  },
  comparisonScene: {
    narration: [
      "Without a function, you keep repeating the same code.",
      "With a function, you can remove that repetition.",
    ],
  },
  realExampleScene: {
    narration: [
      "Let's look at a more realistic example.",
      "Without a function, you have to write the discount logic every time.",
      "If the discount rule changes,\nyou have to fix it in many places.",
      "A function turns that into one clean name.",
    ],
  },
  outroScene: {
    narration: ["We will talk about return next."],
  },
} satisfies EpisodeContent;

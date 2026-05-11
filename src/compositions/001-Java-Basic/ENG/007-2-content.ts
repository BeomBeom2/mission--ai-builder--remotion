// src/compositions/001-Java-Basic/ENG/007-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nswitch",
  },
  overview: {
    narration: [
      "When you need to handle many cases,\nyou can use switch.",
      "It can branch conditions more cleanly\nthan a long if chain.",
    ],
  },
  intro: {
    narration: [
      "If you want different messages for different days,\nan if chain gets repetitive.",
      "Switch lets you write\nthat logic much more cleanly.",
    ],
  },
  syntaxScene: {
    narration: [
      "After switch, you place the value to inspect,\nand each case points to a result with an arrow.",
      "This arrow style makes the code much shorter.",
    ],
  },
  multiCaseScene: {
    narration: [
      "You can group several values into one case\nand handle them without duplication.",
      "With arrow syntax, switch can produce a value,\nso you can assign it directly to a variable.",
    ],
  },
  summaryScene: {
    narration: [
      "Let's summarize.",
      "The arrow syntax makes each case concise.",
      "With arrow syntax, each case ends automatically.",
      "Grouped cases and returned values make switch\nmore useful than a long if chain.",
    ],
  },
} satisfies EpisodeContent;

// src/compositions/001-Java-Basic/ENG/004-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nComparison Operators",
  },
  intro: {
    narration: [
      "Comparison operators compare two values\nand return true or false.",
      "The result is a boolean value,\noften used with if statements.",
    ],
  },
  compareScene: {
    narration: [
      "This is the equality operator.\n10 and 3 are not equal, so the result is false.",
      "This is the inequality operator.\n10 and 3 are different, so the result is true.",
      "This is the greater-than operator.\n10 is greater than 3, so the result is true.",
      "This is the less-than operator.\n10 is not less than 3, so the result is false.",
      "This is the greater-than-or-equal operator.\n10 is greater than or equal to 3, so the result is true.",
      "This is the less-than-or-equal operator.\n10 is not less than or equal to 3, so the result is false.",
    ],
  },
  summaryScene: {
    narration: [
      "Here is a summary of the six comparison operators.",
      "True means the condition is met.\nFalse means it is not.",
    ],
  },
} satisfies EpisodeContent;

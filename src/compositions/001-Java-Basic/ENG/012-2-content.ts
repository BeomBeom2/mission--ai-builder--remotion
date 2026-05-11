// src/compositions/001-Java-Basic/ENG/012-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nReturn",
  },
  painScene: {
    narration: [
      "This function only prints the sum of two numbers.",
      "You cannot store the result in a variable\nor use it in another calculation.",
    ],
  },
  conceptScene: {
    narration: [
      "With return, a function sends a value back to the caller.",
      "You can store that returned value\nor use it directly in another expression.",
    ],
  },
  returnTypeScene: {
    narration: [
      "Before the function name,\nyou write the type of value it will return.",
      "If it returns no value, you use void.",
      "If it returns a whole number, you use int.\nIf it returns a decimal number, you use double.",
    ],
  },
  returnFlowScene: {
    narration: [
      "As soon as the function hits return,\nit stops running immediately.",
      "That means code below return\nnever runs.",
    ],
  },
  useReturnScene: {
    narration: [
      "You can store the returned value in a variable.",
      "Or you can pass it directly\ninto another function call.",
    ],
  },
  comparisonScene: {
    narration: [
      "A void function cannot return a value to the caller.",
      "With return, you can take that value\nand use it freely.",
    ],
  },
  summaryScene: {
    narration: [
      "Return is how a function sends a value back.",
      "The return type tells you\nwhat kind of value will come back.",
    ],
    cards: ["return\n=\nsend a value back", "return type\n=\nkind of value"],
  },
  realExampleScene: {
    narration: [
      "Let's look at a more realistic example.",
      "You can make a function that returns a discounted price\nwhen you pass in the original price.",
      "With return, that result can be used anywhere.",
    ],
  },
} satisfies EpisodeContent;

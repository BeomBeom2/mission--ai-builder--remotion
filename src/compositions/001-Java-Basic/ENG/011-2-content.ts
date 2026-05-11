// src/compositions/001-Java-Basic/ENG/011-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nParameters",
    badge: "Parameter",
  },
  painScene: {
    narration: [
      "This greeting function can greet only one person.",
      "To greet someone else,\nyou would need another function.",
    ],
  },
  conceptScene: {
    narration: [
      "Parameters let one function handle all of that.",
      "A parameter is the slot that receives a value in a function.",
    ],
  },
  paramScene: {
    narration: [
      "If you write a type and a name inside the parentheses,\nthat becomes a parameter.",
      "This function receives one piece of text.",
    ],
  },
  callScene: {
    narration: [
      "The value you put inside the parentheses when calling it\nis called an argument.",
      "That argument is passed into the parameter,\nand then the result is printed.",
    ],
  },
  multiParamScene: {
    narration: [
      "You can declare several parameters.",
      "They are separated by commas and passed in order.",
      "The first argument goes to the first parameter,\nand the second goes to the second.",
    ],
  },
  argParamScene: {
    narration: [
      "The slot you create when declaring the function\nis the parameter.",
      "The actual value you place there when calling it\nis the argument.",
    ],
  },
} satisfies EpisodeContent;

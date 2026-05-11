// src/compositions/001-Java-Basic/ENG/013-2-content.ts
import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nFunction Practice",
    badge: "Function Practice",
  },
  printScene: {
    narration: [
      "This function takes a start number and an end number,\nand prints every number in between.",
      "Try to predict the result.",
    ],
  },
  printRevealScene: {
    narration: [
      "The loop runs from the start to the end,\nprinting each number one by one.",
    ],
  },
  sumScene: {
    narration: [
      "This function returns the total instead of printing it.",
      "Try to predict the result.",
    ],
  },
  sumRevealScene: {
    narration: [
      "It adds each number into one running total\nand returns that result.",
    ],
  },
  sumEvenScene: {
    narration: [
      "This function adds only the even numbers.",
      "Try to predict the result.",
    ],
  },
  sumEvenRevealScene: {
    narration: [
      "It uses a condition to select only numbers\nwhose remainder is zero.",
    ],
  },
  comparisonScene: {
    narration: [
      "All three functions take the same parameters,\nbut they do different jobs.",
      "One prints, one sums, and one sums only the even numbers.",
    ],
  },
  callScene: {
    narration: [
      "From 1 to 5, the first function prints each number in order.",
      "The total from 1 to 5 is 15,\nand the sum of even numbers from 1 to 6 is 12.",
    ],
  },
  summaryScene: {
    narration: [
      "A function is made of a name, parameters, logic, and return.",
      "If you keep the structure and change only the logic,\nyou can build very different behavior.",
    ],
    cards: ["name\n+\nparameters", "logic\n+\nreturn"],
  },
} satisfies EpisodeContent;

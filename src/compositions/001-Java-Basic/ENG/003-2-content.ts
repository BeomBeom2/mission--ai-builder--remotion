import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nArithmetic Operators",
    badge: "+ - * / %",
  },
  intro: {
    narration: [
      "Arithmetic operators perform math calculations.",
      "We will look at five of them:\nplus, minus, multiply, divide, and remainder.",
    ],
  },
  addSubScene: {
    narration: [
      "The addition operator adds two values.",
      "The subtraction operator subtracts\nthe second value from the first.",
    ],
  },
  mulDivScene: {
    narration: [
      "The multiplication operator multiplies two values.",
      "The division operator divides\nthe first value by the second.",
      "When you divide whole numbers,\nthe decimal part is dropped.",
    ],
  },
  remScene: {
    narration: [
      "The remainder operator gives you\nwhat is left after division.",
      "If you divide 11 by 3,\nthe quotient is 3 and the remainder is 2.",
      "It is useful for checks like even or odd.",
    ],
  },
  summaryScene: {
    narration: [
      "Here is a code summary of the five arithmetic operators.",
      "You can store each result in a variable and use it later.",
    ],
  },
} satisfies EpisodeContent;

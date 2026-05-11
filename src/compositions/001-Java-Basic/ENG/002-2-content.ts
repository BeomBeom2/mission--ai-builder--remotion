import type { EpisodeContent } from "../../../types/episode";

export const CONTENT = {
  thumbnail: {
    seriesLabel: "JAVA",
    title: "Java\nData Types",
    badge: "int · double · String · boolean",
  },
  intro: {
    narration: [
      "A data type is how we classify values by kind.",
      "It decides what kind of data\na variable can store.",
      "Let's look at four main data types in Java.",
    ],
  },
  valueVsVar: {
    narration: [
      "First, let's look at the difference\nbetween a data type value and a data type variable.",
      "An int value is the data itself,\nlike the number 25.",
      "An int variable is a named space\nthat holds that value.",
    ],
  },
  intScene: {
    narration: [
      "int is a data type for integers.",
      "An int variable can only store\nwhole numbers without a decimal point.",
      "Use it for things like age or count.",
    ],
  },
  doubleScene: {
    narration: [
      "double is a data type for decimal numbers.",
      "A double variable stores numbers\nwith a decimal point.",
      "Use it when you need precise values,\nlike height or weight.",
    ],
  },
  stringScene: {
    narration: [
      "String is a data type for text.",
      "A String variable stores text data.",
      "Technically it's a reference type,\nbut we'll skip that for now.",
      "Use it for things like names or messages.",
    ],
  },
  booleanScene: {
    narration: [
      "boolean is a data type for true or false.",
      "A boolean variable can only hold\ntrue or false.",
      "Use it to store the result of a condition check.",
    ],
  },
  summaryScene: {
    narration: [
      "Here are all four data types summarized in code.",
      "Choosing the right data type for each situation is important.",
    ],
  },
} satisfies EpisodeContent;

// src/compositions/001-Java-Basic/ENG/youtube.ts
// YouTube metadata for the 001-Java-Basic series (ENG)

export const YOUTUBE_CONFIG = {
  playlist: {
    title: "Java Basics - From Variables to Functions",
    description:
      "A beginner-friendly series that teaches Java from variables and data types to conditionals, loops, and functions.",
  },
  defaults: {
    tags: ["java", "programming", "coding", "beginner", "java basics"],
    categoryId: "27", // Education
    privacyStatus: "public" as const,
    language: "en-US",
  },
  episodes: {
    "001": {
      title:
        "Java Variables - Declaration, Initialization, and Printing #Java #JavaBasics",
      description:
        "Learn how to declare a variable, initialize it, and print its value in Java.",
    },
    "002": {
      title: "Java Data Types - int, double, String, boolean #Java #JavaBasics",
      description: "Learn the core Java data types and when to use each one.",
    },
    "003": {
      title:
        "Java Arithmetic Operators - Add, Subtract, Multiply, Divide #Java #JavaBasics",
      description:
        "Learn the main arithmetic operators in Java with clear examples.",
    },
    "004": {
      title:
        "Java Comparison Operators - Greater, Less, Equal #Java #JavaBasics",
      description: "Learn how Java comparison operators evaluate two values.",
    },
    "005": {
      title: "Java Logical Operators - AND, OR, NOT #Java #JavaBasics",
      description:
        "Learn how logical operators combine or reverse conditions in Java.",
    },
    "006": {
      title: "Java Conditionals - if / else if / else #Java #JavaBasics",
      description:
        "Learn how Java conditionals run different code based on different situations.",
    },
    "007": {
      title: "Java switch - Cleaner Multi-Branch Logic #Java #JavaBasics",
      description:
        "Learn how switch expressions make multi-branch logic cleaner in Java.",
    },
    "008": {
      title: "Java while Loop - How Repetition Works #Java #JavaBasics",
      description:
        "Learn how the while loop repeats code while a condition stays true.",
    },
    "009": {
      title: "Java for Loop - Initializer, Condition, Update #Java #JavaBasics",
      description:
        "Learn how the Java for loop combines the initializer, condition, and update in one line.",
    },
    "010": {
      title: "Java Functions - Declaration and Calls #Java #JavaBasics",
      description:
        "Learn how Java functions are declared and called to remove repeated code.",
    },
    "011": {
      title:
        "Java Parameters - Passing Values into Functions #Java #JavaBasics",
      description:
        "Learn the difference between parameters and arguments in Java functions.",
    },
    "012": {
      title:
        "Java return - Getting Values Back from Functions #Java #JavaBasics",
      description:
        "Learn how Java return sends results back so you can store and reuse them.",
    },
    "013": {
      title:
        "Java Function Practice - Build 3 Useful Functions #Java #JavaBasics",
      description:
        "Build three practical Java functions step by step: print a range, sum a range, and sum only even numbers.",
    },
  },
} as const;

export type EpisodeKey = keyof typeof YOUTUBE_CONFIG.episodes;

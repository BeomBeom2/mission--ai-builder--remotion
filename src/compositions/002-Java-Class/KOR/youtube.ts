// src/compositions/002-Java-Class/KOR/youtube.ts
// YouTube 메타데이터 설정 — 002-Java-Class 시리즈 (KOR)

export const YOUTUBE_CONFIG = {
  playlist: {
    title: "자바 클래스와 객체",
    description: "자바의 클래스와 객체를 처음부터 배우는 시리즈입니다.",
  },
  defaults: {
    tags: ["java", "자바", "프로그래밍", "코딩", "클래스", "객체", "자바기초"],
    categoryId: "27", // Education
    privacyStatus: "public" as const,
    language: "ko",
  },
  episodes: {
    "001": {
      title: "Java 객체 — 흩어진 데이터를 묶는 이유 #Java #자바기초",
      description:
        "객체란 무엇인가? 흩어진 데이터를 하나로 묶어서 관리하는 이유를 알아봅니다.",
    },
    "002": {
      title: "Java 힙과 스택 — 객체는 어디에 사는가 #Java #자바기초",
      description:
        "프로그램이 실행되면 변수는 스택, 객체는 힙에 생성됩니다. 메모리 구조를 알아봅니다.",
    },
    "003": {
      title: "Java 참조형 변수 — 객체가 변수 밖에 생성되는 이유 #Java #자바기초",
      description:
        "객체는 너무 커서 변수 안에 담지 않고, 변수는 객체를 가리키는 주소만 갖습니다. 참조형 변수를 알아봅니다.",
    },
    "004": {
      title: "Java 배열 객체 — 배열도 객체다 #Java #자바기초",
      description:
        "배열은 참조형입니다. new 로 생성되는 건 전부 객체다는 원칙을 살펴봅니다.",
    },
    "005": {
      title: "Java 클래스 — 객체를 찍어내는 틀 #Java #자바기초",
      description:
        "클래스는 객체를 생성하기 위한 틀입니다. 틀이 있으면 같은 객체를 쉽게 여러 개 만들 수 있습니다.",
    },
    "006": {
      title: "Java 클래스가 필요한 이유 — 배열의 한계 #Java #자바기초",
      description:
        "왜 배열 대신 클래스를 써야 할까요? 배열의 한계와 클래스의 자유도를 비교합니다.",
    },
    "007": {
      title: "Java 필드와 메서드 — 명사와 동사 #Java #자바기초",
      description:
        "클래스는 필드를 정의하고, 객체는 필드를 가집니다. 필드와 메서드의 관계를 정리합니다.",
    },
    "008": {
      title: "Java 객체 맥락(context) — 같은 행동, 다른 결과 #Java #자바기초",
      description:
        "객체마다 상태가 다르기 때문에 같은 메서드라도 다른 결과를 냅니다. 객체의 맥락(context)을 이해해봅니다.",
    },
    "009": {
      title: "Java 지역변수 vs 인스턴스 변수 — 변수의 생명주기 #Java #자바기초",
      description:
        "변수는 언제 생성되고 언제 사라질까요? 지역변수와 인스턴스 변수의 생명주기를 비교합니다.",
    },
    "010": {
      title: "Java this 키워드 — 이름이 겹칠 때 #Java #자바기초",
      description:
        "매개변수와 인스턴스 변수의 이름이 같을 때, this 키워드로 둘을 구분하는 방법을 알아봅니다.",
    },
    "011": {
      title: "Java 생성자 — 필드 초기화 자동화 #Java #자바기초",
      description:
        "객체를 만들 때마다 필드를 하나씩 세팅하는 반복을 없애는 생성자를 배웁니다.",
    },
    "012": {
      title: "Java 매개변수 생성자 — 객체 생성을 한 줄로 #Java #자바기초",
      description:
        "매개변수 생성자로 필드 초기화까지 한 번에 끝내는 방법을 알아봅니다.",
    },
  },
} as const;

export type EpisodeKey = keyof typeof YOUTUBE_CONFIG.episodes;

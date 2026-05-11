import { describe, expect, it } from "vitest";

import { toDisplayText, toTTSText } from "./narration";

// ── toDisplayText ────────────────────────────────────────────

describe("toDisplayText", () => {
  it("인라인 문법 없는 일반 텍스트는 그대로 반환", () => {
    expect(toDisplayText("안녕하세요.")).toBe("안녕하세요.");
  });

  it("[X(pron:Y)] → 자막에는 X만 표시", () => {
    expect(toDisplayText("[유튜브(pron:유튭)]에서 확인")).toBe(
      "유튜브에서 확인",
    );
  });

  it("[X(pron:)] 묵음 — 자막에는 X 표시", () => {
    expect(toDisplayText("[(자료)(pron:)]형이란")).toBe("(자료)형이란");
  });

  it("코드 발음 — 자막에는 코드 표시", () => {
    expect(
      toDisplayText("[System.out.println(pron:print line)]으로 출력"),
    ).toBe("System.out.println으로 출력");
  });

  it("표시 문자열 안의 괄호도 자막에 그대로 남김", () => {
    expect(
      toDisplayText(
        "[메서드(함수)(pron:메서드)] 안의 지역 변수라고 생각하시면 됩니다.",
      ),
    ).toBe("메서드(함수) 안의 지역 변수라고 생각하시면 됩니다.");
  });

  it("여러 개의 인라인 문법 동시 처리", () => {
    expect(toDisplayText("[int(pron:인트)]형과 [double(pron:더블)]형")).toBe(
      "int형과 double형",
    );
  });

  it("인라인 문법 없는 부분은 그대로 유지", () => {
    expect(toDisplayText("변수를 [age(pron:에이지)]라고 합니다.")).toBe(
      "변수를 age라고 합니다.",
    );
  });

  // ── (mute:X) 구문 ──

  it("(mute:X) → 자막에는 (X) 표시", () => {
    expect(toDisplayText("상자(mute:변수) 안에")).toBe("상자(변수) 안에");
  });

  it("여러 개의 (mute:X) 동시 처리", () => {
    expect(toDisplayText("상자(mute:변수) 안에 보물(mute:값)이")).toBe(
      "상자(변수) 안에 보물(값)이",
    );
  });

  it("(mute:X) + [X(pron:Y)] 조합", () => {
    expect(toDisplayText("[int(pron:인트)](mute:정수)형")).toBe("int(정수)형");
  });
});

// ── toTTSText ────────────────────────────────────────────────

describe("toTTSText", () => {
  it("인라인 문법 없는 일반 텍스트는 그대로 반환", () => {
    expect(toTTSText("안녕하세요.")).toBe("안녕하세요.");
  });

  it("[X(pron:Y)] → TTS에는 Y만 읽힘", () => {
    expect(toTTSText("[유튜브(pron:유튭)]에서 확인")).toBe("유튭에서 확인");
  });

  it("[X(pron:)] 묵음 — TTS에는 빈 문자열 (앞뒤 공백 정규화)", () => {
    // [(자료)(pron:)]형이란 → 형이란 (묵음 처리 후 공백 정리)
    expect(toTTSText("[(자료)(pron:)]형이란")).toBe("형이란");
  });

  it("발음 값 앞뒤 공백 trim", () => {
    expect(toTTSText("[int(pron: 인트 )]형")).toBe("인트형");
  });

  it("코드 발음 — TTS에는 발음 텍스트 읽힘", () => {
    expect(toTTSText("[System.out.println(pron:print line)]으로 출력")).toBe(
      "print line으로 출력",
    );
  });

  it("표시 문자열 안의 괄호는 무시하고 발음만 읽힘", () => {
    expect(
      toTTSText(
        "[메서드(함수)(pron:메서드)] 안의 지역 변수라고 생각하시면 됩니다.",
      ),
    ).toBe("메서드 안의 지역 변수라고 생각하시면 됩니다.");
  });

  it("여러 개의 인라인 문법 동시 처리", () => {
    expect(toTTSText("[int(pron:인트)]형과 [double(pron:더블)]형")).toBe(
      "인트형과 더블형",
    );
  });

  it("\\n은 공백으로 변환 (TTS 쉼 방지)", () => {
    expect(toTTSText("첫 번째 문장.\n두 번째 문장.")).toBe(
      "첫 번째 문장. 두 번째 문장.",
    );
  });

  it("\\n 연속 → 공백 하나로 정규화", () => {
    expect(toTTSText("첫 줄\n\n두 줄")).toBe("첫 줄 두 줄");
  });

  it("연속 공백은 하나로 정규화", () => {
    expect(toTTSText("단어  두  개")).toBe("단어 두 개");
  });

  it("인라인 문법 + \\n 조합", () => {
    expect(toTTSText("[int(pron:인트)]형은\n변수 선언에 사용합니다.")).toBe(
      "인트형은 변수 선언에 사용합니다.",
    );
  });

  // ── (mute:X) 구문 ──

  it("(mute:X) → TTS에서는 제거", () => {
    expect(toTTSText("상자(mute:변수) 안에")).toBe("상자 안에");
  });

  it("여러 개의 (mute:X) 동시 처리", () => {
    expect(toTTSText("상자(mute:변수) 안에 보물(mute:값)이")).toBe(
      "상자 안에 보물이",
    );
  });

  it("(mute:X) + [X(pron:Y)] 조합", () => {
    expect(toTTSText("[int(pron:인트)](mute:정수)형")).toBe("인트형");
  });
});

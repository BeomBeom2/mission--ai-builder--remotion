import { describe, expect, it } from "vitest";

// 훅 내부 로직을 순수 함수로 분리해 테스트
function computeVisibleText(
  text: string,
  frame: number,
  startFrame: number,
  fps: number,
  charsPerSecond: number,
): { visibleText: string; isDone: boolean } {
  const charsVisible = Math.floor(
    (Math.max(0, frame - startFrame) / fps) * charsPerSecond,
  );
  return {
    visibleText: text.slice(0, charsVisible),
    isDone: charsVisible >= text.length,
  };
}

describe("computeVisibleText", () => {
  it("타이핑 시작 전(startFrame 이전)에는 빈 문자열 반환", () => {
    const { visibleText, isDone } = computeVisibleText(
      "int age;",
      10,
      20,
      30,
      10,
    );
    expect(visibleText).toBe("");
    expect(isDone).toBe(false);
  });

  it("startFrame 시점에는 빈 문자열 반환", () => {
    const { visibleText } = computeVisibleText("int age;", 20, 20, 30, 10);
    expect(visibleText).toBe("");
  });

  it("1초 후(fps=30, startFrame=20 → frame=50)에 10자 표시", () => {
    const { visibleText } = computeVisibleText("0123456789AB", 50, 20, 30, 10);
    expect(visibleText).toBe("0123456789");
  });

  it("모든 글자가 나오면 isDone=true", () => {
    const { visibleText, isDone } = computeVisibleText("hi", 200, 0, 30, 10);
    expect(visibleText).toBe("hi");
    expect(isDone).toBe(true);
  });

  it("텍스트 길이를 초과해도 잘리지 않음", () => {
    const { visibleText } = computeVisibleText("ab", 9999, 0, 30, 10);
    expect(visibleText).toBe("ab");
  });
});

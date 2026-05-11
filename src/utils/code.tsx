/**
 * JavaCode — shiki 기반 Java 구문 강조 컴포넌트
 *
 * VS Code Dark+ 테마로 자동 토큰화하며,
 * 타이핑 애니메이션 · 줄별 데코레이션 · 토큰 색상 오버라이드를 지원한다.
 *
 * 사용법:
 *   <JavaCode code={`int age = 25;`} />
 *   <JavaCode code={code} visibleChars={charsVisible} fontSize={28} />
 */
import React from "react";

import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import java from "shiki/langs/java.mjs";
import darkPlus from "shiki/themes/dark-plus.mjs";

import { CODE, MONO_NO_LIGA, monoFont } from "./scene";

// ── Shiki highlighter (싱글턴) ────────────────────────────────
const highlighter = createHighlighterCoreSync({
  themes: [darkPlus],
  langs: [java],
  engine: createJavaScriptRegexEngine(),
});

// ── 타입 ──────────────────────────────────────────────────────
interface Token {
  text: string;
  color: string;
}

/** 줄별 데코레이션 — 실행 하이라이트, 활성 줄 표시 등 */
export interface LineDecoration {
  /** 왼쪽 테두리 (예: "4px solid #c586c0") */
  borderLeft?: string;
  /** 줄 배경색 */
  background?: string;
  /** 줄 opacity (0~1) */
  opacity?: number;
  /** 왼쪽 패딩 추가 (들여쓰기 보정용) */
  paddingLeft?: number;
}

// ── Props ─────────────────────────────────────────────────────
export interface JavaCodeProps {
  /** Java 소스 코드 */
  code: string;
  /** 폰트 크기 — 기본 32 */
  fontSize?: number;
  /** 줄 간격 — 기본 1.9 */
  lineHeight?: number;
  /** 코드 블록 패딩 — 기본 "32px 44px" */
  padding?: string;
  /** 배경색 — 기본 "#2d2d2d" (BG_CODE) */
  background?: string;
  /** 모서리 둥글기 — 기본 14 */
  borderRadius?: number;
  /** 배경/패딩 없는 인라인 모드 */
  inline?: boolean;
  /** 전체 opacity */
  opacity?: number;
  /** 타이핑 애니메이션: 보이는 글자 수 (생략하면 전체 표시) */
  visibleChars?: number;
  /** 줄별 데코레이션 콜백 */
  lineDecoration?: (lineIndex: number) => LineDecoration | undefined;
  /** 토큰 색상 오버라이드 (예: { "for": "#4ec9b0" }) */
  tokenColors?: Record<string, string>;
  /** 추가 container 스타일 */
  style?: React.CSSProperties;
}

// ── 토큰화 ────────────────────────────────────────────────────
function tokenize(code: string): Token[][] {
  const trimmed = code.replace(/^\n+/, "").replace(/\n+$/, "");
  const result = highlighter.codeToTokens(trimmed, {
    lang: "java",
    theme: "dark-plus",
  });

  return result.tokens.map((line: { content: string; color?: string }[]) =>
    line.map((token: { content: string; color?: string }) => ({
      text: token.content,
      color: token.color ?? "#d4d4d4",
    })),
  );
}

// ── 토큰 색상 오버라이드 적용 ─────────────────────────────────
function applyOverrides(
  lines: Token[][],
  overrides: Record<string, string>,
): Token[][] {
  return lines.map((line) =>
    line.map((token) => {
      const trimmed = token.text.trim();
      if (trimmed && overrides[trimmed]) {
        return { ...token, color: overrides[trimmed] };
      }
      return token;
    }),
  );
}

// ── 타이핑 애니메이션 렌더링 ──────────────────────────────────
function renderLines(
  lines: Token[][],
  charLimit: number,
  lineDecoration?: (lineIndex: number) => LineDecoration | undefined,
): React.ReactNode[] {
  let remaining = charLimit;
  const result: React.ReactNode[] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    if (remaining <= 0 && charLimit !== Infinity) break;

    const tokens = lines[lineIdx];
    const deco = lineDecoration?.(lineIdx);
    const lineStyle: React.CSSProperties = {};
    if (deco?.borderLeft) {
      lineStyle.borderLeft = deco.borderLeft;
      lineStyle.paddingLeft = deco.paddingLeft ?? 12;
    }
    if (deco?.background) lineStyle.background = deco.background;
    if (deco?.opacity !== undefined) lineStyle.opacity = deco.opacity;
    if (deco?.paddingLeft && !deco.borderLeft) {
      lineStyle.paddingLeft = deco.paddingLeft;
    }

    const spans: React.ReactNode[] = [];
    for (let tokenIdx = 0; tokenIdx < tokens.length; tokenIdx++) {
      if (remaining <= 0 && charLimit !== Infinity) break;
      const token = tokens[tokenIdx];

      let text = token.text;
      if (charLimit !== Infinity) {
        if (text.length > remaining) {
          text = text.slice(0, remaining);
        }
        remaining -= token.text.length;
      }

      spans.push(
        <span key={tokenIdx} style={{ color: token.color }}>
          {text}
        </span>,
      );
    }

    result.push(
      <div key={lineIdx} style={lineStyle}>
        {spans.length > 0 ? spans : "\u200b"}
      </div>,
    );

    // 줄바꿈 문자 1개 차감
    if (charLimit !== Infinity) remaining -= 1;
  }

  return result;
}

// ── 컴포넌트 ─────────────────────────────────────────────────
export const JavaCode: React.FC<JavaCodeProps> = ({
  code,
  fontSize = CODE.xl,
  lineHeight = 1.9,
  padding = "32px 44px",
  background = "#2d2d2d",
  borderRadius = 14,
  inline = false,
  opacity,
  visibleChars,
  lineDecoration,
  tokenColors,
  style,
}) => {
  let lines = tokenize(code);
  if (tokenColors) {
    lines = applyOverrides(lines, tokenColors);
  }

  const charLimit = visibleChars ?? Infinity;
  const rendered = renderLines(lines, charLimit, lineDecoration);

  const containerStyle: React.CSSProperties = inline
    ? {
        fontFamily: monoFont,
        fontFeatureSettings: MONO_NO_LIGA,
        fontSize,
        lineHeight,
        ...(opacity !== undefined ? { opacity } : {}),
        ...style,
      }
    : {
        fontFamily: monoFont,
        fontFeatureSettings: MONO_NO_LIGA,
        fontSize,
        lineHeight,
        background,
        borderRadius,
        padding,
        ...(opacity !== undefined ? { opacity } : {}),
        ...style,
      };

  return <div style={containerStyle}>{rendered}</div>;
};

// ── 인라인 한 줄 토큰화 컴포넌트 ─────────────────────────────
/**
 * JavaLine — 한 줄 코드를 인라인 span으로 토큰화.
 * CodeLine (수동 regex) 대체용. 블록 래퍼 없이 <span> 만 반환.
 */
export const JavaLine: React.FC<{
  text: string;
  tokenColors?: Record<string, string>;
}> = ({ text, tokenColors }) => {
  if (!text) return null;
  let tokens = tokenize(text)[0] ?? [];
  if (tokenColors) {
    tokens = tokens.map((t) => {
      const trimmed = t.text.trim();
      if (trimmed && tokenColors[trimmed]) {
        return { ...t, color: tokenColors[trimmed] };
      }
      return t;
    });
  }
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} style={{ color: token.color }}>
          {token.text}
        </span>
      ))}
    </>
  );
};

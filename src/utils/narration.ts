/**
 * narration.ts — 인라인 발음 문법 파서
 *
 * 문법 1: [표시(pron:읽기)]
 *   예) [유튜브(pron:유튭)]  →  자막: 유튜브 / TTS: 유튭
 *       [System.out.println(pron:print line)]  →  자막: System.out.println / TTS: print line
 *       [(자료)(pron:)]  →  자막: (자료) / TTS: (없음, 묵음)
 *
 * 문법 2: (mute:텍스트)
 *   예) (mute:변수)  →  자막: (변수) / TTS: (없음, 완전 제거)
 *       (mute:자료)  →  자막: (자료) / TTS: (없음, 완전 제거)
 */

const INLINE_RE = /\[(.*?)\(pron:([^)]*)\)\]/g;
const MUTE_RE = /\(mute:([^)]*)\)/g;

/** 자막 표시용: [X(pron:Y)] → X, (mute:Z) → (Z) — 백틱 유지 */
export function toDisplayText(text: string): string {
  return text.replace(INLINE_RE, "$1").replace(MUTE_RE, "($1)");
}

/** 자막 하이라이팅용: 백틱 제거 (TTS 단어 수와 일치시키기 위함) */
export function toHighlightText(text: string): string {
  return toDisplayText(text).replace(/`/g, "");
}

/** TTS 읽기용: [X(pron:Y)] → Y, (mute:Z) → 제거, 백틱 제거, \n → 공백 (TTS 쉼 방지), 연속 공백 정규화 */
export function toTTSText(text: string): string {
  return text
    .replace(INLINE_RE, (_, _display, pron) => pron.trim())
    .replace(MUTE_RE, "")
    .replace(/`/g, "")
    .replace(/\n/g, " ")
    .replace(/  +/g, " ");
}

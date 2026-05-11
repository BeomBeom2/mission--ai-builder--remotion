# 001-Java-Basic Translation Notes

영어판에서 직역이 어색하거나 의미 왜곡 가능성이 있어 의도적으로 초월번역한 부분을 기록한다.
단순한 어순 변경, 경어체 제거, 문장 분리 등 일반적인 번역 작업은 제외하고 **의미가 달라진 경우**만 기록한다.

---

## 001 Variables

### interpret — `해석` → `read`

- KOR: `변수의 해석`, `공간으로 해석`, `값으로 해석`
- ENG: `How to Read a Variable`, `read as storage space`, `read as a value`
- Reason: `interpreted as space`는 번역투. `read`와 `storage space`로 강의체에 맞게 다듬었다.

### print — `System.out.println` TTS

- KOR TTS: `시스템 아웃 프린트 라인`
- ENG TTS: `print line`
- Reason: 영어권에서는 `System.out.println`을 풀어 읽지 않는다. 자막은 그대로, TTS만 `print line`.

---

## 002 Data Types

### intro — `자료형이란 자료의 형태`

- KOR: `자료형이란 자료의 형태, 즉 데이터의 형태입니다.`
- ENG: `A data type is how we classify values by kind.`
- Reason: `자료/데이터` 등식은 영어로 직역 불가. 개념 자체를 풀어 설명했다.

### intScene — 소수점 설명 생략

- KOR: `나이나 개수처럼 소수점이 없는 숫자에 사용합니다.`
- ENG: `Use it for things like age or count.`
- Reason: 소수점 없다는 설명은 앞 문장에서 이미 했으므로 중복 제거.

### stringScene — `참조` → `reference type`

- KOR: `정확히는 참조이지만`
- ENG: `Technically it's a reference type`
- Reason: `reference`만 쓰면 의미 불명확. `reference type`으로 보완.

---

## 004 Comparison

### summaryScene — 참/true 동어반복 해소

- KOR: `결과가 참이면 true, 거짓이면 false가 됩니다.`
- ENG: `True means the condition is met. False means it is not.`
- Reason: 한국어는 참↔true 매핑이 의미 있지만, 영어는 true→true가 동어반복. 의미를 뒤집어 설명했다.

### compareScene — 연산자 명칭

- KOR: `같음`, `다름`, `초과`, `미만`, `이상`, `이하`
- ENG: `equality`, `inequality`, `greater-than`, `less-than`, `greater-than-or-equal`, `less-than-or-equal`
- Reason: 한국어 수학 약어를 영어 CS 정식 명칭으로 치환.

---

## 005 Logical

### intro — 기호 → 영어 이름

- KOR: `&&, ||, !, 세 가지를 알아봅니다.`
- ENG: `We will look at three of them:.. AND,.. OR,.. and NOT.`
- Reason: 영어권은 기호보다 AND/OR/NOT 이름으로 부른다. `..`로 쉼표 효과 추가.

### summaryScene — 압축 문장 분리

- KOR: `&&는 모두 참이어야 결과가 참, ||는 하나라도 참이면 결과가 참, !은 반전입니다.`
- ENG: `AND needs every condition to be true. OR needs at least one true condition. NOT reverses the result.`
- Reason: 한 문장에 3개 개념을 넣은 한국어 구조를 영어에서 3문장으로 풀었다.

---

## 007 Switch

### multiCaseScene — `표현식` → `arrow syntax`

- KOR: `switch 표현식은 값을 반환하므로`
- ENG: `With arrow syntax, switch can produce a value`
- Reason: expression/statement 구분은 초보자에게 혼란. `arrow syntax`로 시각적 특징을 설명했다.

### overview — `if문 대신` → `long if chain`

- KOR: `if문 대신 더 깔끔하게`
- ENG: `more cleanly than a long if chain`
- Reason: `long` 추가로 switch가 해결하는 구체적 고통을 명시했다.

---

## 009 For Loop

### 전체 — `for문` → `for loop`

- KOR: `for문`
- ENG: `for loop`
- Reason: 영어권에서 `for statement`보다 `for loop`가 압도적으로 자연스럽다.

### intro — 용어 치환

- KOR: `초기식, 조건식, 증감식`
- ENG: `initializer, condition, update`
- Reason: 한국어 합성어를 영어 CS 표준 용어로 치환.

---

## 010 Function

### painScene — 한국 이름 제거

- KOR: `민준을 철수로 고쳐야 한다면`
- ENG: `If you had to change one name later`
- Reason: 문화 특화 이름을 일반화.

### realExampleScene — 통화 제거

- KOR: `삼만 원이 넘으면 할인하는 코드`
- ENG: `the discount logic`
- Reason: 원화 금액을 제거하고 개념만 남김.

---

## 011 Parameter

### painScene — 이름 일반화

- KOR: `민준에게만 인사할 수 있습니다`
- ENG: `can greet only one person`
- Reason: 한국 이름 → 일반 표현.

### conceptScene — 비유 치환

- KOR: `통로` (passage)
- ENG: `slot`
- Reason: 한국어 `통로` 비유 대신 영어권에서 직관적인 `slot` 비유 사용.

### argParamScene — 일관된 비유

- KOR: `자리` (seat/place)
- ENG: `slot`
- Reason: `slot` 비유를 parameter/argument 구분 전체에 일관 적용.

---

## 012 Return

### conceptScene — `밖으로` → `to the caller`

- KOR: `결과를 밖으로 돌려줍니다`
- ENG: `sends a value back to the caller`
- Reason: `밖으로`(outside)는 모호. `to the caller`로 목적지를 명시.

### comparisonScene — 프레이밍 반전

- KOR: `void 함수는 출력만 할 수 있습니다` (할 수 있는 것)
- ENG: `A void function cannot return a value to the caller` (할 수 없는 것)
- Reason: return 주제에서는 "못 하는 것"으로 설명하는 게 더 적절.

---

## 013 Practice

### sumRevealScene — `변수 하나` → `running total`

- KOR: `변수 하나에 숫자를 하나씩 더해서`
- ENG: `adds each number into one running total`
- Reason: 누적 패턴을 영어 관용어 `running total`로 표현.

### comparisonScene — 구조 변경

- KOR: `출력만 하거나, 합을 구하거나, 짝수만 합산합니다.`
- ENG: `One prints, one sums, and one sums only the even numbers.`
- Reason: `One... one... one...` 패턴으로 세 함수를 대조하는 영어 수사법 사용.

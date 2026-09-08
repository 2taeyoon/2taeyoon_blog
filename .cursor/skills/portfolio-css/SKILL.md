---
name: portfolio-css
description: Applies 2taeyoon portfolio CSS conventions—plain CSS, --pf* variables, rem sizing, no Tailwind, no clamp/min/max, no line-height. Use when editing src/styles/portfolio, projectSection, underlay, mainSection, sceneOverlay, or when the user mentions 포트폴리오 CSS, 스타일, 반응형.
paths:
  - "src/styles/portfolio/**/*.css"
  - "src/components/portfolio/**/*.tsx"
---

# Portfolio CSS

포트폴리오(`/`) 스타일은 일반 CSS만 쓴다. Tailwind 클래스와 유틸리티 CSS는 추가하지 않는다.

## 파일 위치

| 작업 | 파일 |
|------|------|
| 색 변수 | `src/styles/portfolio/variables.css` (`--pf*`만) |
| 섹션 스타일 | `src/styles/portfolio/<name>.css` |
| 반응형 | 같은 이름의 `*.reaction.css` |
| import | `src/styles/portfolio/index.css`에만 추가 |

블로그 변수(`src/styles/blog/variables.css`의 `--thema`, `--black` 등)를 포트폴리오에 쓰지 않는다. 포트폴리오 전용 `:root`를 새로 만들지 않는다.

`projectSection2.css`는 현재 `index.css`에 import되지 않는다. 미사용으로 보여도 삭제하지 않는다.

## 절대 금지

새 포트폴리오 CSS에는 다음을 쓰지 않는다.

- `clamp()`, `min()`, `max()`
- `min-width`, `max-width`, `min-height`, `max-height`
- `line-height` (`src/styles/base/reset.css`의 150%를 따른다)
- `font-size` 미디어쿼리 (`html { font-size }`가 이미 줄어든다)
- `em` 폰트 사이즈 (`rem` 또는 `px`)
- `border-radius` (프로젝트 섹션·카드는 직각)

크기는 `rem`, `%`, `vh`/`dvh`, 고정 `px`만 쓴다.

```css
/* 금지 */
font-size: clamp(48px, 5.4vw, 82px);
max-width: 860px;
min-height: 520px;
line-height: 1.2;

/* 허용 */
font-size: 7.2rem;
width: 86rem;
height: 100vh;
height: 100dvh;
```

## 타이포

- 한글: `"Pretendard", "Malgun Gothic", sans-serif`
- 영문/UI: `"Nunito Sans", sans-serif`
- 본문 기본 크기는 reset의 `1.6rem`을 따른다. 크게 키울 타이틀만 별도 `font-size`를 준다.
- `Project` 같은 히어로 타이틀은 미디어쿼리로 `font-size`를 줄이지 않는다.

## 클래스

`snake_case`에 컴포넌트 접두사를 붙인다.

```text
.project_section
.project_section_card
.underlay_intro_text_ko
.color_palette_swatch
```

상태 클래스는 `is_` 접두사: `is_selected`, `is_visible`, `is_embedded`.

## 반응형

`*.reaction.css`에 모은다. 미디어쿼리는 `(width <= Npx)`를 쓴다.

```css
@media (width <= 900px) { }
@media (width <= 640px) { }
```

`(max-width: ...)`는 포트폴리오 신규 코드에 쓰지 않는다.

## 색

하드코드 hex를 남발하지 말고 `var(--pfTextStrong)`, `var(--pfBgGray)` 같은 기존 변수를 쓴다. 배경을 바꿀 때는 `palette.ts`의 `syncPaletteCssVars`가 `--pfBgLavender`, `--pfBgGray`를 갱신한다는 점을 유지한다.

## 작업 후

추가한 선택자가 실제로 쓰이는지 확인한다. 다만 렌더되지 않는 `ProjectSection2` / `projectSection2.css`는 정리 대상으로 삼지 않는다.

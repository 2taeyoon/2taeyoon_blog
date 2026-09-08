---
name: portfolio-components
description: Maps 2taeyoon portfolio folders, section names, 3D cube color, and GSAP scroll layers. Use when editing MainSection, ProjectSection, Underlay, BaubleScene, palette, or when the user mentions 큐브, 프로젝트 섹션, 언더레이, 메인섹션.
paths:
  - "src/components/portfolio/**/*.tsx"
  - "src/lib/portfolio/**/*.ts"
  - "src/data/portfolio/**/*.ts"
  - "src/app/page.tsx"
---

# Portfolio components

`/`는 포트폴리오, `/blog`는 블로그다. 두 영역의 컴포넌트·CSS·변수를 섞지 않는다.

## 폴더

| 경로 | 역할 |
|------|------|
| `src/components/portfolio/` | 섹션 컴포넌트 |
| `src/components/portfolio/ui/` | Underlay, ColorPalette, Scene UI |
| `src/components/portfolio/scene/` | Three.js 씬 |
| `src/lib/portfolio/` | 팔레트, 재질, 씬 상태 |
| `src/data/portfolio/` | 프로젝트/스킬 데이터 |
| `src/styles/portfolio/` | 포트폴리오 CSS |
| `public/images/portfolio/` | 이미지 |

진입점은 `src/app/page.tsx` → `PortfolioSections`.

## 섹션 이름

- `ProjectSection`이 현재 프로젝트 갤러리(미러홀 원통 카드). `PortfolioSections`가 렌더한다.
- `ProjectSection2`는 예전 쇼케이스. **렌더하지 말고, 관련 파일도 삭제하지 않는다.**
- `ProjectSection`을 다시 "Mirror Hall"로 되돌리지 않는다.

스크롤 전환은 `PortfolioSections`의 GSAP `ScrollTrigger`가 `portfolio_project_layer`를 메인 위로 올린다. 메인 레이어를 축소하거나 불투명도로만 페이드인하지 않는다. 경계는 `--project-edge-feather` 마스크로 흐린다.

## UI 고정 요소

`underlay_top_row` / `underlay_top_row_global`은 모든 섹션에서 보여야 한다. 포털로 `document.body`에 고정되어 있다. 프로젝트 섹션 헤더는 이 바와 겹치지 않게 `top`을 조절한다.

모바일(`width <= 640px`)에서 `underlay_controls`(설정)는 `2taeyoon.com` 로고와 같은 높이에 둔다.

한글 인트로: `.underlay_intro_text_ko` + Pretendard.  
영문 인트로: `.underlay_intro_text_en` + Nunito Sans.

## 색상 시스템 (현재 코드)

설정 라벨은 `Theme Color` 하나다. `ballColor`가 큐브 재질과 배경 팔레트에 같이 들어간다.

- UI: `ColorPalette` (`fabric` 프리셋 + hex)
- 상태: `MainSection`의 `baubleColor` sessionStorage
- 큐브 재질: `src/lib/portfolio/baubleAppearance.ts` (`applyBallColor`)
- 배경/CSS 변수: `src/lib/portfolio/palette.ts` (`buildPalette`, `syncPaletteCssVars`) → `GiantGlassCube`

`fabric`은 인디고 베이스 + 오렌지 글로우 직물 텍스처다. 유채색이 매우 어두워도 무채색(검정/회색)으로 떨어지지 않게 한다. 채도 `hsl.s < 0.08`만 achromatic으로 본다. 어두운 유채색은 최소 명도를 올려 큐브가 보이게 한다.

큐브 색과 배경색을 분리하라는 요청이 없으면 현재 단일 `ballColor` 흐름을 유지한다.

## 3D / 모션

- 메인 큐브: `@react-three/fiber` + cannon. 공유 재질은 `pointerState`의 `baubleMaterial`.
- 씬 ID: `main | about | skills | projects | contact` (`src/lib/portfolio/scenes.ts`).
- 프로젝트 카드 트랙: GSAP. Swiper로 바꾸지 않는다.
- 카드는 수평 원통 곡선이다. 중앙이 정면, 좌우로 갈수록 **앞으로** 나오고 `rotationY`는 접선 방향.
- 호버 효과는 `.project_section_card` 단위. 뷰포트에 `grab` 커서를 넣지 않는다.
- 반사면은 약 90% 보이고, 물은 항상 약하게 일렁이며 마우스에서 강해진다. 카드 이미지가 통째로 평행이동하는 느낌이 되면 안 된다.

## 검증

포트폴리오 UI를 바꾸면 메인 → 스크롤 프로젝트 섹션 → 설정 드롭다운 → 모바일 상단바 순으로 확인한다. 브라우저 툴이 있으면 실제 클릭/스크롤로 확인하고, 없으면 그 한계를 말한다.

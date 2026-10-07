import * as THREE from "three";

export type BackdropPalette = {
  deep: THREE.Color;
  navy: THREE.Color;
  mid: THREE.Color;
  accent: THREE.Color;
  soft: THREE.Color;
  grid: THREE.Color;
  glow: THREE.Color;
  cssDeep: string;
  cssMid: string;
  cssHighlight: string;
};

/** 팔레트 색 → 다크 배경/격자용 톤 세트 */
export function buildPalette(ballColor: string): BackdropPalette {
  if (ballColor === "fabric") {
    return {
      deep: new THREE.Color(0.008, 0.012, 0.03),
      navy: new THREE.Color(0.015, 0.025, 0.07),
      mid: new THREE.Color(0.025, 0.04, 0.11),
      accent: new THREE.Color(0.04, 0.065, 0.16),
      soft: new THREE.Color(0.05, 0.08, 0.18),
      grid: new THREE.Color(0.04, 0.06, 0.12),
      glow: new THREE.Color(0.025, 0.05, 0.14),
      cssDeep: "#03050c",
      cssMid: "#04070f",
      cssHighlight: "#17295f",
    };
  }

  const base = new THREE.Color(ballColor);
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl, THREE.SRGBColorSpace);

  // 실제 채도가 낮은 색만 무채색으로 처리한다.
  // 어두운 유채색을 명도만으로 무채색 처리하면 특정 지점에서 색조가 갑자기 사라진다.
  const achromatic = hsl.s < 0.08;
  if (achromatic) {
    const cool = (r: number, g: number, b: number) => new THREE.Color(r, g, b);
    if (hsl.l > 0.5) {
      // #ffffff 계열 → 쿨 다크 그레이
      const deep = cool(0.035, 0.04, 0.05);
      const navy = cool(0.06, 0.07, 0.085);
      return {
        deep,
        navy,
        mid: cool(0.1, 0.11, 0.135),
        accent: cool(0.16, 0.175, 0.2),
        soft: cool(0.2, 0.22, 0.25),
        grid: cool(0.09, 0.1, 0.12),
        glow: cool(0.12, 0.13, 0.15),
        cssDeep: `#${deep.getHexString()}`,
        cssMid: `#${navy.getHexString()}`,
        cssHighlight: "#343944",
      };
    }
    // #000000 계열 → 딥 차콜
    const deep = cool(0.012, 0.013, 0.018);
    const navy = cool(0.03, 0.032, 0.04);
    return {
      deep,
      navy,
      mid: cool(0.055, 0.058, 0.07),
      accent: cool(0.085, 0.09, 0.105),
      soft: cool(0.11, 0.115, 0.13),
      grid: cool(0.065, 0.07, 0.085),
      glow: cool(0.07, 0.075, 0.09),
      cssDeep: `#${deep.getHexString()}`,
      cssMid: `#${navy.getHexString()}`,
      cssHighlight: "#20232b",
    };
  }

  const h = hsl.h;
  const s = THREE.MathUtils.clamp(hsl.s, 0.25, 1);
  const mk = (l: number, sat = s) => new THREE.Color().setHSL(h, sat, l);
  const deep = mk(0.028, s * 0.75);
  const navy = mk(0.055, s * 0.85);
  const highlight = mk(0.22, s * 0.82);
  return {
    deep,
    navy,
    mid: mk(0.1, s * 0.9),
    accent: mk(0.16, s),
    soft: mk(0.2, s * 0.75),
    grid: mk(0.09, s * 0.65),
    glow: mk(0.14, s * 0.8),
    cssDeep: `#${deep.getHexString()}`,
    cssMid: `#${navy.getHexString()}`,
    cssHighlight: `#${highlight.getHexString()}`,
  };
}

/** CSS 변수(--pfBg*)에 팔레트 배경색 반영 */
export function syncPaletteCssVars(palette: BackdropPalette) {
  const root = document.documentElement;
  root.style.setProperty("--pfBgLavender", palette.cssDeep);
  root.style.setProperty("--pfBgGray", palette.cssMid);
  root.style.setProperty("--pfProjectHighlight", palette.cssHighlight);
}

/** Theme Color를 페이지네이션 등 UI 강조색으로 반영 */
export function syncThemeAccent(ballColor: string) {
  const root = document.documentElement;
  const accent = themeAccentCss(ballColor);
  root.style.setProperty("--pfTheme", accent.background);
  root.style.setProperty("--pfThemeText", accent.text);
  root.style.setProperty("--pfThemeLabel", accent.label);
}

function themeAccentCss(ballColor: string) {
  if (ballColor === "fabric") {
    return { background: "#5a7fd4", text: "#ffffff", label: "#6b7280" };
  }

  const color = new THREE.Color(ballColor);
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);

  const label = themeLabelCss(hsl);

  if (hsl.l >= 0.28) {
    return {
      background: `#${color.getHexString()}`,
      text: hsl.l > 0.62 ? "#12141c" : "#ffffff",
      label,
    };
  }

  const accent = new THREE.Color().setHSL(hsl.h, hsl.s, 0.28);
  return { background: `#${accent.getHexString()}`, text: "#ffffff", label };
}

/** 상세 정보의 항목 이름. 파랑·남색은 기존 회색을 유지하고, 그 외 색은 같은 색조로 밝힌다. */
function themeLabelCss(hsl: { h: number; s: number; l: number }) {
  const coolBlue = hsl.h >= 0.55 && hsl.h <= 0.75;
  if (hsl.s < 0.12 || coolBlue) return "#6b7280";

  const label = new THREE.Color().setHSL(
    hsl.h,
    Math.min(0.48, Math.max(hsl.s * 0.62, 0.36)),
    0.72,
  );
  return `#${label.getHexString()}`;
}

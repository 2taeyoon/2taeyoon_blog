import * as THREE from "three";
import { buildPalette, type BackdropPalette } from "@/lib/portfolio/palette";

export const DREAMY_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const DREAMY_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform vec2 uMouseVel;
  uniform sampler2D uFlow;
  uniform vec3 uDeep;
  uniform vec3 uNavy;
  uniform vec3 uMid;
  uniform vec3 uAccent;
  uniform vec3 uSoft;
  uniform vec3 uGrid;
  uniform vec3 uGlow;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  vec2 curveUv(vec2 uv) {
    vec2 c = uv - 0.5;
    c.x *= uAspect;
    float r2 = dot(c, c);
    c *= 1.0 - r2 * 0.12;
    c.x /= uAspect;
    return c + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    vec2 cuv = curveUv(uv);

    float flow = texture2D(uFlow, clamp(uv, 0.0, 1.0)).r;
    vec2 m = uMouse * 0.5 + 0.5;
    vec2 toMouse = uv - m;
    toMouse.x *= uAspect;
    float md = length(toMouse);
    vec2 dir = normalize(toMouse + 1e-4);

    float speed = length(uMouseVel);
    float trail = smoothstep(0.015, 0.22, flow);
    float motionAmt = max(smoothstep(0.002, 0.02, speed), trail * 0.9);
    vec2 distort = vec2(0.0);
    vec2 vel = uMouseVel * vec2(1.0 / max(uAspect, 1.0), 1.0);
    distort += vel * flow * 0.045 * motionAmt;
    distort += dir * flow * 0.018 * trail;
    distort += dir * flow * 0.014 * motionAmt;
    distort += dir * flow * exp(-md * 2.5) * 0.008 * sin(md * 28.0 - uTime * 2.2) * motionAmt;

    vec2 duv = cuv + distort;
    vec2 fieldUv = vec2(duv.x * uAspect, duv.y);

    vec3 deep = uDeep;
    vec3 navy = uNavy;
    vec3 indigo = uMid;
    vec3 blue = uAccent;
    vec3 softBlue = uSoft;

    float a1 = fbm(fieldUv * 1.4 + 2.0);
    float a2 = fbm(fieldUv * 2.2 + 19.0);
    float marble = smoothstep(0.05, 0.5, abs(a1 - a2));
    vec3 patA = deep;
    patA = mix(patA, navy, smoothstep(0.28, 0.7, a1));
    patA = mix(patA, indigo, marble * 0.4);
    patA = mix(patA, blue, smoothstep(0.55, 0.9, a2) * 0.2);

    float b1 = fbm(fieldUv * 0.7 + 5.0);
    float b2 = fbm(fieldUv * 1.1 + vec2(8.0, 3.0));
    vec3 patB = deep;
    patB = mix(patB, navy, smoothstep(0.35, 0.65, b1));
    patB = mix(patB, indigo, smoothstep(0.45, 0.8, b2) * 0.45);
    patB = mix(patB, softBlue, smoothstep(0.7, 0.95, b1 * b2) * 0.18);

    float c1 = fbm(fieldUv * vec2(1.1, 2.4) + 40.0);
    float c2 = fbm(fieldUv * vec2(2.0, 0.9) + vec2(14.0, 6.0));
    float wave = smoothstep(0.3, 0.7, c1 * 0.55 + c2 * 0.45);
    vec3 patC = deep;
    patC = mix(patC, navy, smoothstep(0.2, 0.65, c1));
    patC = mix(patC, indigo, wave * 0.42);
    patC = mix(patC, blue, smoothstep(0.65, 0.92, c2) * 0.2);

    float band = fbm(vec2(fieldUv.x + fieldUv.y, fieldUv.x - fieldUv.y) * 1.8 + 22.0);
    float d1 = fbm(fieldUv * 1.2 + 27.0);
    vec3 patD = deep;
    patD = mix(patD, navy, smoothstep(0.25, 0.6, band));
    patD = mix(patD, indigo, abs(band - 0.5) * 0.7);
    patD = mix(patD, blue, smoothstep(0.6, 0.9, d1) * 0.22);

    float e1 = fbm(fieldUv * 3.2 + 50.0);
    float e2 = noise(fieldUv * 14.0 + 60.0);
    float cell = smoothstep(0.35, 0.75, e1) * (0.4 + 0.6 * e2);
    vec3 patE = deep;
    patE = mix(patE, navy, 0.5);
    patE = mix(patE, indigo, cell * 0.5);
    patE = mix(patE, softBlue, smoothstep(0.8, 1.0, e2) * 0.12);

    float cycle = uTime / 3.0;
    float idx = mod(floor(cycle), 5.0);
    float fade = smoothstep(0.0, 0.2, fract(cycle));
    vec3 prevCol = patA;
    vec3 nextCol = patA;
    if (idx < 0.5) { prevCol = patE; nextCol = patA; }
    else if (idx < 1.5) { prevCol = patA; nextCol = patB; }
    else if (idx < 2.5) { prevCol = patB; nextCol = patC; }
    else if (idx < 3.5) { prevCol = patC; nextCol = patD; }
    else { prevCol = patD; nextCol = patE; }

    vec3 col = mix(prevCol, nextCol, fade);
    float gAmt = exp(-length((uv - 0.5) * vec2(uAspect * 0.55, 1.0)) * 2.8);
    col += uGlow * gAmt * 0.05;

    float gridScale = 23.4;
    vec2 guv = (duv - 0.5);
    guv.x *= uAspect;
    vec2 gridCoord = guv * gridScale;
    vec2 gf = fract(gridCoord);
    vec2 fw = max(fwidth(gridCoord), vec2(1e-5));
    float px = 1.15;
    float lx = 1.0 - smoothstep(0.0, px, min(gf.x, 1.0 - gf.x) / fw.x);
    float ly = 1.0 - smoothstep(0.0, px, min(gf.y, 1.0 - gf.y) / fw.y);
    float grid = max(lx, ly);

    vec2 majorUv = guv * (gridScale * 0.25);
    vec2 fm = fract(majorUv);
    vec2 fwm = max(fwidth(majorUv), vec2(1e-5));
    float mxL = 1.0 - smoothstep(0.0, px * 1.35, min(fm.x, 1.0 - fm.x) / fwm.x);
    float myL = 1.0 - smoothstep(0.0, px * 1.35, min(fm.y, 1.0 - fm.y) / fwm.y);
    float major = max(mxL, myL);

    // 가로로 긴 타원 비네팅 — 좌우도 살짝 페이드, 모서리는 더 강하게
    vec2 gridEllip = (uv - 0.5) * vec2(1.58, 1.92);
    float gridVignette = smoothstep(1.0, 0.18, length(gridEllip));
    float gridA = (grid * 0.11 + major * 0.07) * gridVignette;
    gridA += flow * 0.03 * motionAmt * gridVignette;
    col += uGrid * gridA;

    float vig = smoothstep(1.2, 0.35, length((uv - 0.5) * vec2(uAspect * 0.75, 1.0)));
    col *= 0.72 + 0.28 * vig;
    col += (hash(uv * 1200.0 + fract(uTime) * 0.01) - 0.5) * 0.01;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createDreamyMaterial(flowTexture: THREE.Texture, palette: BackdropPalette = buildPalette("fabric")) {
  return new THREE.ShaderMaterial({
    transparent: false,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseVel: { value: new THREE.Vector2(0, 0) },
      uFlow: { value: flowTexture },
      uDeep: { value: palette.deep.clone() },
      uNavy: { value: palette.navy.clone() },
      uMid: { value: palette.mid.clone() },
      uAccent: { value: palette.accent.clone() },
      uSoft: { value: palette.soft.clone() },
      uGrid: { value: palette.grid.clone() },
      uGlow: { value: palette.glow.clone() },
    },
    vertexShader: DREAMY_VERTEX_SHADER,
    fragmentShader: DREAMY_FRAGMENT_SHADER,
  });
}

export function lerpDreamyPalette(
  uniforms: THREE.ShaderMaterial["uniforms"],
  palette: BackdropPalette,
  t: number,
) {
  (uniforms.uDeep.value as THREE.Color).lerp(palette.deep, t);
  (uniforms.uNavy.value as THREE.Color).lerp(palette.navy, t);
  (uniforms.uMid.value as THREE.Color).lerp(palette.mid, t);
  (uniforms.uAccent.value as THREE.Color).lerp(palette.accent, t);
  (uniforms.uSoft.value as THREE.Color).lerp(palette.soft, t);
  (uniforms.uGrid.value as THREE.Color).lerp(palette.grid, t);
  (uniforms.uGlow.value as THREE.Color).lerp(palette.glow, t);
}

/** 마우스 궤적 플로우맵 페인트 */
export function paintFlowMap(options: {
  ctx: CanvasRenderingContext2D;
  size: number;
  mouse: THREE.Vector2;
  prev: THREE.Vector2;
  aspect: number;
}) {
  const { ctx, size, mouse, prev, aspect } = options;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.018)";
  ctx.fillRect(0, 0, size, size);

  const mx = (mouse.x * 0.5 + 0.5) * size;
  const my = (1 - (mouse.y * 0.5 + 0.5)) * size;
  const speed = Math.min(Math.hypot(mx - prev.x, my - prev.y), 40);

  if (speed > 0.2) {
    const radius = 21 + speed * 0.84;
    ctx.save();
    ctx.translate(mx, my);
    ctx.scale(1 / Math.max(aspect, 0.01), 1);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    const strength = Math.min(0.9, 0.32 + speed * 0.022);
    grad.addColorStop(0, `rgba(255,255,255,${strength})`);
    grad.addColorStop(0.45, `rgba(255,255,255,${strength * 0.45})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  prev.set(mx, my);
}

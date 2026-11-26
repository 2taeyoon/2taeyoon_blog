import * as THREE from "three";
import { HERO_IMAGE } from "@/lib/portfolio/heroImage";

/** 흐름 자국 텍스처는 화면보다 이만큼 작게 만든다 (부드럽고 가볍다) */
const TRAIL_DOWNSCALE = 8;
/** 마우스 자국이 한 프레임마다 남는 비율. 1에 가까울수록 오래 흐른다 */
const TRAIL_DECAY = 0.955;
/** 마우스 자국 붓의 반지름 (화면 높이 대비) */
const TRAIL_RADIUS = 0.09;
/** 자국이 그림을 미는 세기 */
const DISPLACE_STRENGTH = 0.05;
/** 자국을 따라 색이 갈라지는 정도 */
const CHROMA_STRENGTH = 0.006;
/** 마우스 속도를 자국 세기로 바꾸는 배율과 상한 */
const VELOCITY_GAIN = 9;
const VELOCITY_MAX = 1.4;
/** 번짐이 한 프레임마다 남는 비율 (흐름보다 조금 오래 남아 연기처럼 사라진다) */
const FOG_DECAY = 0.975;
/** 마우스 속도가 번짐으로 쌓이는 배율 */
const FOG_GAIN = 1.6;
/** 번진 자리를 흐리게 섞는 반경 (화면 높이 대비) */
const FOG_BLUR = 0.07;
/** 번진 자리가 밝아지는 정도 */
const FOG_GLOW = 1.1;
/** 번진 자리에 반짝이는 그레인 세기 */
const FOG_GRAIN = 0.28;

const FULLSCREEN_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * 이전 자국을 흐름 방향으로 조금 밀고 옅게 한 뒤, 마우스 자리에 새 자국을 찍는다.
 * xy = 흐름 방향(그림을 미는 양), z = 번짐 세기(뿌옇게·밝게·그레인)
 */
const TRAIL_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uAspect;
  uniform float uRadius;
  uniform float uDecay;
  uniform float uFogDecay;
  uniform float uFogGain;
  varying vec2 vUv;

  void main() {
    vec2 previous = texture2D(uPrev, vUv).xy;
    vec3 advected = texture2D(uPrev, vUv - previous * 0.012).xyz;
    vec2 flow = advected.xy * uDecay;
    float fog = advected.z * uFogDecay;
    vec2 delta = vUv - uMouse;
    delta.x *= uAspect;
    float brush = exp(-dot(delta, delta) / (uRadius * uRadius));
    flow += uVelocity * brush;
    fog = min(1.0, fog + length(uVelocity) * brush * uFogGain);
    gl_FragColor = vec4(flow, fog, 1.0);
  }
`;

/** 그림을 cover로 깔고, 자국만큼 밀고, 남색 부분을 테마 색으로 바꾼다 */
const IMAGE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uImage;
  uniform sampler2D uTrail;
  uniform vec2 uScreen;
  uniform vec2 uDrawn;
  uniform vec2 uOffset;
  uniform float uDisplace;
  uniform float uChroma;
  uniform float uDim;
  uniform float uThemeAmount;
  uniform vec3 uThemeTint;
  uniform float uThemeChroma;
  uniform float uFogBlur;
  uniform float uFogGlow;
  uniform float uFogGrain;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec2 coverUv(vec2 screenUv) {
    vec2 pixel = vec2(screenUv.x * uScreen.x, (1.0 - screenUv.y) * uScreen.y);
    vec2 imageUv = (pixel - uOffset) / uDrawn;
    return vec2(imageUv.x, 1.0 - imageUv.y);
  }

  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }


  void main() {
    vec3 trail = texture2D(uTrail, vUv).xyz;
    vec2 flow = trail.xy;
    float fog = clamp(trail.z, 0.0, 1.0);
    vec2 uv = vUv - flow * uDisplace;
    vec2 split = flow * uChroma;
    vec3 color = vec3(
      texture2D(uImage, coverUv(uv - split)).r,
      texture2D(uImage, coverUv(uv)).g,
      texture2D(uImage, coverUv(uv + split)).b
    );

    // 마우스가 지나간 자리는 서리 낀 유리처럼 뿌옇게 번지고, 빛이 퍼지며, 모래알 같은 그레인이 반짝인다
    if (fog > 0.002) {
      float noise = hash(gl_FragCoord.xy + fract(uTime) * 91.7);
      float aspect = uScreen.x / uScreen.y;
      vec3 blurred = vec3(0.0);
      for (int i = 0; i < 12; i++) {
        float index = float(i) + noise;
        float angle = index * 2.39996;
        float radius = sqrt(index / 12.0) * fog * uFogBlur;
        vec2 offset = vec2(cos(angle) / aspect, sin(angle)) * radius;
        blurred += texture2D(uImage, coverUv(uv + offset)).rgb;
      }
      blurred /= 12.0;
      vec3 glow = blurred * (1.0 + fog * uFogGlow) + fog * uFogGlow * 0.08;
      color = mix(color, glow, smoothstep(0.0, 0.55, fog));
      color += (noise - 0.5) * uFogGrain * fog;
    }

    // 남색 계열(퍼즐 주황빛 제외)만 테마 색으로 물들인다.
    // 밝기는 그대로 두고 색만 입혀서 구름·창틀의 명암이 살아 있게 한다
    vec3 hsv = rgb2hsv(color);
    float hueDistance = abs(hsv.x - 0.63);
    float bluish = (1.0 - smoothstep(0.08, 0.2, hueDistance)) * smoothstep(0.03, 0.12, hsv.y);
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722)) * 1.15;
    vec3 themed = mix(vec3(luma), luma * uThemeTint, uThemeChroma);
    color = mix(color, themed, bluish * uThemeAmount);

    gl_FragColor = vec4(color * uDim, 1.0);
  }
`;

export interface HeroTheme {
  /** 0이면 그림 원래 색, 1이면 테마 색으로 물들인다 */
  amount: number;
  /** 입힐 색. 밝기(luma)가 1이 되도록 맞춘 값 */
  tint: THREE.Color;
  /** 색을 입히는 정도 (0이면 흑백, 1이면 tint 그대로) */
  chroma: number;
}

/** 물들일 색의 채도 상한. 높으면 빨강·초록 같은 테마에서 그림이 쨍해진다 */
const TINT_SATURATION_MAX = 0.38;
/** 색을 입히는 정도 */
const TINT_CHROMA = 0.6;

/** 테마 색(Theme Color)을 그림 물들이기 값으로 바꾼다. 기본 남색(fabric)은 그림 그대로 둔다 */
export function heroThemeFromColor(themeColor: string): HeroTheme {
  if (themeColor === "fabric") return { amount: 0, tint: new THREE.Color(1, 1, 1), chroma: 0 };
  const hsl = { h: 0, s: 0, l: 0 };
  new THREE.Color(themeColor).getHSL(hsl, THREE.SRGBColorSpace);
  // 흰색·검정 같은 무채색 테마는 흑백으로
  if (hsl.s < 0.08) return { amount: 1, tint: new THREE.Color(1, 1, 1), chroma: 0 };

  const tint = new THREE.Color().setHSL(hsl.h, Math.min(hsl.s, TINT_SATURATION_MAX), 0.5, THREE.SRGBColorSpace);
  const luma = tint.r * 0.2126 + tint.g * 0.7152 + tint.b * 0.0722;
  tint.multiplyScalar(1 / Math.max(luma, 0.05));
  return { amount: 1, tint, chroma: TINT_CHROMA };
}

function createTrailTarget(width: number, height: number) {
  return new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
  });
}

export interface HeroFluid {
  setTheme: (theme: HeroTheme) => void;
  /** 0~1. 프로젝트 섹션으로 넘어가며 그림을 어둡게 한다 */
  setExit: (progress: number) => void;
  dispose: () => void;
}

/**
 * 메인 배경 그림을 WebGL로 그리며 마우스가 지나간 자리에 물결이 흐르게 한다.
 * @param onReady 그림 텍스처를 다 불러왔을 때 한 번 부른다
 */
export function createHeroFluid(canvas: HTMLCanvasElement, onReady: () => void): HeroFluid {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.PlaneGeometry(2, 2);

  let trailRead = createTrailTarget(1, 1);
  let trailWrite = createTrailTarget(1, 1);

  const trailMaterial = new THREE.ShaderMaterial({
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: TRAIL_FRAGMENT,
    uniforms: {
      uPrev: { value: trailRead.texture },
      uMouse: { value: new THREE.Vector2(-10, -10) },
      uVelocity: { value: new THREE.Vector2() },
      uAspect: { value: 1 },
      uRadius: { value: TRAIL_RADIUS },
      uDecay: { value: TRAIL_DECAY },
      uFogDecay: { value: FOG_DECAY },
      uFogGain: { value: reduced ? 0 : FOG_GAIN },
    },
  });
  const imageMaterial = new THREE.ShaderMaterial({
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: IMAGE_FRAGMENT,
    uniforms: {
      uImage: { value: null },
      uTrail: { value: trailRead.texture },
      uScreen: { value: new THREE.Vector2(1, 1) },
      uDrawn: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2() },
      uDisplace: { value: reduced ? 0 : DISPLACE_STRENGTH },
      uChroma: { value: reduced ? 0 : CHROMA_STRENGTH },
      uDim: { value: 1 },
      uThemeAmount: { value: 0 },
      uThemeTint: { value: new THREE.Color(1, 1, 1) },
      uThemeChroma: { value: 0 },
      uFogBlur: { value: FOG_BLUR },
      uFogGlow: { value: FOG_GLOW },
      uFogGrain: { value: FOG_GRAIN },
      uTime: { value: 0 },
    },
  });

  const trailScene = new THREE.Scene();
  trailScene.add(new THREE.Mesh(quad, trailMaterial));
  const imageScene = new THREE.Scene();
  imageScene.add(new THREE.Mesh(quad, imageMaterial));

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    const trailWidth = Math.max(16, Math.round(width / TRAIL_DOWNSCALE));
    const trailHeight = Math.max(16, Math.round(height / TRAIL_DOWNSCALE));
    trailRead.setSize(trailWidth, trailHeight);
    trailWrite.setSize(trailWidth, trailHeight);
    trailMaterial.uniforms.uAspect.value = width / height;

    // heroImage.ts의 cover 계산과 같다 (퍼즐 꽃송이 자리와 맞아야 한다)
    const scale = Math.max(width / HERO_IMAGE.width, height / HERO_IMAGE.height);
    const drawnWidth = HERO_IMAGE.width * scale;
    const drawnHeight = HERO_IMAGE.height * scale;
    imageMaterial.uniforms.uScreen.value.set(width, height);
    imageMaterial.uniforms.uDrawn.value.set(drawnWidth, drawnHeight);
    imageMaterial.uniforms.uOffset.value.set(
      (width - drawnWidth) * 0.5,
      (height - drawnHeight) * HERO_IMAGE.focusY,
    );
  };

  const pointer = { x: -10, y: -10, lastX: -10, lastY: -10, moved: false };
  const onPointerMove = (event: PointerEvent) => {
    pointer.x = event.clientX / window.innerWidth;
    pointer.y = 1 - event.clientY / window.innerHeight;
    pointer.moved = true;
  };

  let frame = 0;
  let exit = 0;
  const render = () => {
    frame = window.requestAnimationFrame(render);
    if (exit >= 0.98 || !imageMaterial.uniforms.uImage.value) return;

    const velocity = trailMaterial.uniforms.uVelocity.value as THREE.Vector2;
    if (pointer.moved && pointer.lastX > -1 && !reduced) {
      velocity.set((pointer.x - pointer.lastX) * VELOCITY_GAIN, (pointer.y - pointer.lastY) * VELOCITY_GAIN);
      if (velocity.length() > VELOCITY_MAX) velocity.setLength(VELOCITY_MAX);
    } else {
      velocity.set(0, 0);
    }
    trailMaterial.uniforms.uMouse.value.set(pointer.x, pointer.y);
    pointer.lastX = pointer.x;
    pointer.lastY = pointer.y;
    pointer.moved = false;

    trailMaterial.uniforms.uPrev.value = trailRead.texture;
    renderer.setRenderTarget(trailWrite);
    renderer.render(trailScene, camera);
    [trailRead, trailWrite] = [trailWrite, trailRead];

    imageMaterial.uniforms.uTrail.value = trailRead.texture;
    imageMaterial.uniforms.uTime.value = performance.now() / 1000;
    renderer.setRenderTarget(null);
    renderer.render(imageScene, camera);
  };

  new THREE.TextureLoader().load(
    HERO_IMAGE.src,
    (texture) => {
      texture.colorSpace = THREE.NoColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      imageMaterial.uniforms.uImage.value = texture;
      onReady();
    },
    undefined,
    onReady,
  );

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onPointerMove);
  frame = window.requestAnimationFrame(render);

  return {
    setTheme(theme) {
      imageMaterial.uniforms.uThemeAmount.value = theme.amount;
      (imageMaterial.uniforms.uThemeTint.value as THREE.Color).copy(theme.tint);
      imageMaterial.uniforms.uThemeChroma.value = theme.chroma;
    },
    setExit(progress) {
      exit = progress;
      imageMaterial.uniforms.uDim.value = 1 - progress * 0.55;
    },
    dispose() {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      (imageMaterial.uniforms.uImage.value as THREE.Texture | null)?.dispose();
      trailRead.dispose();
      trailWrite.dispose();
      trailMaterial.dispose();
      imageMaterial.dispose();
      quad.dispose();
      renderer.dispose();
    },
  };
}

"use client";

import * as THREE from "three";

// ─── 공유 포인터 상태 (mutable singleton) ─────────────────────────────────────
export const pointerState = {
  down: false,
  x: 0,
  y: 0,
  z: -100,
  ndcX: 0,
  ndcY: 0,
  moved: false,
};

export const MOUSE_SPHERE_RADIUS = 2.4;

type PuzzlePauseListener = () => void;
const puzzlePauseListeners = new Set<PuzzlePauseListener>();

/** 프로젝트 섹션 호버 시 메인 퍼즐의 마우스 상호작용만 비활성 */
export const puzzleSimulation = {
  paused: false,
  setPaused(paused: boolean) {
    if (puzzleSimulation.paused === paused) return;
    puzzleSimulation.paused = paused;
    pointerState.down = false;
    if (paused) {
      pointerState.x = 0;
      pointerState.y = 0;
      pointerState.z = -100;
    }
    puzzlePauseListeners.forEach((listener) => listener());
  },
  subscribe(listener: PuzzlePauseListener) {
    puzzlePauseListeners.add(listener);
    return () => {
      puzzlePauseListeners.delete(listener);
    };
  },
};

// ─── Three.js 공유 에셋 ──────────────────────────────────────────────────────
export const baubleMaterial = new THREE.MeshLambertMaterial({
  color: "#0322ab",
  emissive: "#010a4d",
});

/**
 * 꽃송이 속에서 새어 나오는 주황 불빛 (기본 테마 전용, strength 0이면 꺼짐).
 * 조명으로 비추면 파란 표면 색과 곱해져 분홍빛이 되므로, 표면 색과 상관없이 빛을 더한다.
 * 꽃송이 중심에 가깝고 중심을 향한 면일수록 진하게 물든다.
 */
export const coreGlow = {
  center: { value: new THREE.Vector3(0, 0, -100) },
  radius: { value: new THREE.Vector2(1, 1) },
  color: { value: new THREE.Color("#ff7a2c") },
  strength: { value: 0 },
};

baubleMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uCoreCenter = coreGlow.center;
  shader.uniforms.uCoreRadius = coreGlow.radius;
  shader.uniforms.uCoreColor = coreGlow.color;
  shader.uniforms.uCoreStrength = coreGlow.strength;

  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      "#include <common>\nvarying vec3 vCoreWorldPos;\nvarying vec3 vCoreWorldNormal;",
    )
    .replace(
      "#include <project_vertex>",
      [
        "#include <project_vertex>",
        "vCoreWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;",
        "vCoreWorldNormal = normalize(mat3(modelMatrix) * objectNormal);",
      ].join("\n"),
    );

  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      [
        "#include <common>",
        "varying vec3 vCoreWorldPos;",
        "varying vec3 vCoreWorldNormal;",
        "uniform vec3 uCoreCenter;",
        "uniform vec2 uCoreRadius;",
        "uniform vec3 uCoreColor;",
        "uniform float uCoreStrength;",
        "float coreHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }",
        "float coreNoise(vec3 p) {",
        "  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);",
        "  return mix(mix(mix(coreHash(i), coreHash(i + vec3(1,0,0)), f.x),",
        "                 mix(coreHash(i + vec3(0,1,0)), coreHash(i + vec3(1,1,0)), f.x), f.y),",
        "             mix(mix(coreHash(i + vec3(0,0,1)), coreHash(i + vec3(1,0,1)), f.x),",
        "                 mix(coreHash(i + vec3(0,1,1)), coreHash(i + vec3(1,1,1)), f.x), f.y), f.z);",
        "}",
      ].join("\n"),
    )
    .replace(
      "#include <opaque_fragment>",
      [
        "if (uCoreStrength > 0.0) {",
        "  vec3 toCore = uCoreCenter - vCoreWorldPos;",
        "  float coreDist = length(toCore / vec3(uCoreRadius.x, uCoreRadius.y, uCoreRadius.x * 0.8));",
        "  float facing = clamp(dot(normalize(vCoreWorldNormal), normalize(toCore)), 0.0, 1.0);",
        "  float inner = pow(smoothstep(1.25, 0.0, coreDist), 1.6);",
        // 나뭇결 밝기를 따라 빛이 얼룩지게 번진다
        "  float grain = clamp(dot(diffuseColor.rgb, vec3(0.6, 0.3, 0.1)) * 14.0, 0.6, 1.3);",
        // 조각 틈으로 새는 빛처럼 군데군데 뭉쳐 보이게 한다
        "  float leak = smoothstep(0.3, 0.75, coreNoise(vCoreWorldPos * 1.3));",
        "  float glow = inner * mix(0.55, 1.0, facing) * grain * mix(0.35, 1.25, leak) * uCoreStrength;",
        "  float warm = smoothstep(0.04, 0.5, glow);",
        "  outgoingLight = mix(outgoingLight, uCoreColor * (0.3 + glow * 0.7), warm * 0.85);",
        "}",
        "#include <opaque_fragment>",
      ].join("\n"),
    );
};

/** 조각 크기 단계: 대 / 중 / 소 */
export const sizeSteps = [1.85, 1.4, 1];

/** Bauble 물리 속성 타입 */
export interface BaubleProps {
  args: number;
  variant: number;
  homeX: number;
  homeY: number;
  explodeX: number;
  explodeY: number;
  mass: number;
  angularDamping: number;
  linearDamping: number;
}

export const mainExit = {
  progress: 0,
};

type MainRenderListener = () => void;
const mainRenderListeners = new Set<MainRenderListener>();

/** 스크롤 진행도가 바뀔 때 demand frameloop과 물리 pause 상태를 깨운다. */
export const mainRenderState = {
  request() {
    mainRenderListeners.forEach((listener) => listener());
  },
  subscribe(listener: MainRenderListener) {
    mainRenderListeners.add(listener);
    return () => {
      mainRenderListeners.delete(listener);
    };
  },
};

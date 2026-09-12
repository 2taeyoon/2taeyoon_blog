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

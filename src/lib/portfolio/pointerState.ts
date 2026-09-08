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

type PuzzlePauseListener = () => void;
const puzzlePauseListeners = new Set<PuzzlePauseListener>();

/** 프로젝트 섹션 호버 시 메인 퍼즐 물리 일시정지 */
export const puzzleSimulation = {
  paused: false,
  setPaused(paused: boolean) {
    if (puzzleSimulation.paused === paused) return;
    puzzleSimulation.paused = paused;
    pointerState.down = false;
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
export const sizeSteps = [1.6, 1.2, 0.85];

/** Bauble 물리 속성 타입 */
export interface BaubleProps {
  args: number;
  variant: number;
  homeX: number;
  homeY: number;
  mass: number;
  angularDamping: number;
  linearDamping: number;
}

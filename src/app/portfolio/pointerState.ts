"use client";

import * as THREE from "three";
import { Triplet } from "@react-three/cannon";

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

// ─── Three.js 공유 에셋 ──────────────────────────────────────────────────────
export const baubleMaterial = new THREE.MeshLambertMaterial({
  color: "#0322ab",
  emissive: "#010a4d",
});

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

/** 큐브 크기 단계: 대 / 중 / 소 */
export const sizeSteps = [1.6, 1.2, 0.85];

/** Bauble 물리 속성 타입 */
export interface BaubleProps {
  args: number;
  mass: number;
  angularDamping: number;
  linearDamping: number;
}

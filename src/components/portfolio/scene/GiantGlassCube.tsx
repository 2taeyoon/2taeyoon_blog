"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { cubeSpinState } from "@/lib/portfolio/scenes";

/** 사이트 전체를 감싸는 거대한 글래스 큐브의 한 변 길이 */
export const GIANT_CUBE_SIZE = 44;

/**
 * 항상 존재하는 단 하나의 거대한 Glass Cube.
 * 카메라(및 모든 Scene 콘텐츠)는 이 큐브 내부에 위치하며,
 * 큐브는 천천히 회전해 유리 벽의 반사광이 은은하게 변화한다.
 */
export default function GiantGlassCube() {
  const groupRef = useRef<THREE.Group>(null);

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#1e2640",
        roughness: 0.04,
        metalness: 0.15,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        envMapIntensity: 1.1,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;

    // 섹션(face) 전환 시 목표 회전각을 향해 부드럽게 90° 회전
    cubeSpinState.current +=
      (cubeSpinState.target - cubeSpinState.current) * Math.min(1, delta * 2.4);

    group.rotation.y = t * 0.035 + cubeSpinState.current;
    group.rotation.x = Math.sin(t * 0.11) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh material={wallMaterial}>
        <boxGeometry args={[GIANT_CUBE_SIZE, GIANT_CUBE_SIZE, GIANT_CUBE_SIZE]} />
      </mesh>
    </group>
  );
}

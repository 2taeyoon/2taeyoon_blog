"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";

interface SceneTransitionProps {
  active: boolean;
  /** 화면이 큐브들로 가득 덮인 순간 — 이 시점에 Scene을 교체 */
  onCover: () => void;
  /** 트랜지션 종료 시점 */
  onComplete: () => void;
}

const COUNT = 240;
const DURATION = 2.8; // 전체 트랜지션 길이(초)
const COVER = 0.5; // 화면이 가득 덮이는 진행도

/** 카메라 이동량 — 덮이기 전 전진 깊이 / 덮인 직후 뒤에서 진입하는 거리 */
const DOLLY_IN = 9;
const REENTER_BACK = 6;

const easeInCubic = (t: number) => t * t * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

interface CubeSeed {
  x: number;
  y: number;
  z0: number;
  z1: number;
  delay: number;
  span: number;
  scale: number;
  rx: number;
  ry: number;
  spinX: number;
  spinY: number;
}

/**
 * Scene 전환 시 수많은 글래스 큐브가 카메라를 향해 우수수 날아오며
 * 화면을 가득 채우는 시네마틱 트랜지션.
 * 카메라도 함께 전진해 "큐브 내부로 진입"하는 감각을 만든다.
 */
export default function SceneTransition({ active, onCover, onComplete }: SceneTransitionProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const runningRef = useRef(false);
  const coveredRef = useRef(false);
  const progressRef = useRef(0);
  const baseZRef = useRef(20);

  const onCoverRef = useRef(onCover);
  const onCompleteRef = useRef(onComplete);
  onCoverRef.current = onCover;
  onCompleteRef.current = onComplete;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo<CubeSeed[]>(
    () =>
      [...Array(COUNT)].map(() => {
        // 절반은 카메라 진행 축 근처(화면을 확실히 덮음), 절반은 넓게 흩뿌림
        const nearAxis = Math.random() < 0.5;
        return {
          x: (Math.random() - 0.5) * (nearAxis ? 7 : 30),
          y: (Math.random() - 0.5) * (nearAxis ? 5 : 18),
          z0: -60 + Math.random() * 30,
          z1: 32 + Math.random() * 14,
          delay: Math.random() * 0.4,
          span: 0.45 + Math.random() * 0.3,
          scale: 0.5 + Math.random() * 1.7,
          rx: Math.random() * Math.PI,
          ry: Math.random() * Math.PI,
          spinX: (Math.random() - 0.5) * 6,
          spinY: (Math.random() - 0.5) * 6,
        };
      }),
    [],
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#bcd0f5",
        roughness: 0.08,
        metalness: 0.15,
        transparent: true,
        opacity: 0.55,
        envMapIntensity: 1.6,
      }),
    [],
  );

  useEffect(() => {
    if (active && !runningRef.current) {
      runningRef.current = true;
      coveredRef.current = false;
      progressRef.current = 0;
    }
  }, [active]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!runningRef.current) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    const camera = state.camera as PerspectiveCamera;

    // 시작 프레임에 현재 카메라 z를 기준점으로 저장
    if (progressRef.current === 0) {
      baseZRef.current = camera.position.z;
    }

    progressRef.current = Math.min(1, progressRef.current + delta / DURATION);
    const progress = progressRef.current;

    // ── 카메라 이동: 덮이기 전 전진 → 덮인 순간 뒤로 점프 → 다시 전진하며 새 Scene 진입
    if (!coveredRef.current) {
      if (progress >= COVER) {
        coveredRef.current = true;
        onCoverRef.current();
        camera.position.z = baseZRef.current + REENTER_BACK;
      } else {
        const k = easeInCubic(Math.min(1, progress / COVER));
        camera.position.z = baseZRef.current - DOLLY_IN * k;
      }
    } else {
      const k = easeOutCubic(Math.min(1, (progress - COVER) / (1 - COVER)));
      camera.position.z = baseZRef.current + REENTER_BACK * (1 - k);
    }

    // ── 큐브 스웜 갱신
    for (let i = 0; i < COUNT; i++) {
      const seed = seeds[i];
      const p = Math.min(1, Math.max(0, (progress - seed.delay) / seed.span));
      const move = smoothstep(p);

      if (p <= 0 || p >= 1) {
        dummy.scale.setScalar(0);
      } else {
        dummy.scale.setScalar(seed.scale);
      }
      dummy.position.set(seed.x, seed.y, seed.z0 + (seed.z1 - seed.z0) * move);
      dummy.rotation.set(seed.rx + seed.spinX * move, seed.ry + seed.spinY * move, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // ── 종료
    if (progress >= 1) {
      runningRef.current = false;
      mesh.visible = false;
      camera.position.z = baseZRef.current;
      onCompleteRef.current();
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, COUNT]}
      material={glassMaterial}
      frustumCulled={false}
      visible={false}
    >
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

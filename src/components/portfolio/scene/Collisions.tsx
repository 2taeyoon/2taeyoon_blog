"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { usePlane, useSphere } from "@react-three/cannon";
import { pointerState, puzzleSimulation, MOUSE_SPHERE_RADIUS, mainExit } from "@/lib/portfolio/pointerState";

/** 이보다 크게 한 번에 움직이면 순간이동(섹션 복귀 등)으로 보고 속도를 넘기지 않는다 */
const MAX_SPHERE_JUMP = 6;
/** 마우스를 아주 빠르게 휘둘러도 조각이 화면 밖으로 날아가지 않게 속도 상한을 둔다 */
const MAX_SPHERE_SPEED = 40;

export default function Collisions() {
  const wallsOpen = useRef(false);
  const sphereMoving = useRef(false);
  const spherePosition = useRef<[number, number, number]>([
    Number.NaN,
    Number.NaN,
    Number.NaN,
  ]);
  const [, backApi] = usePlane(() => ({ position: [0, 0, 0], rotation: [0, 0, 0] }));
  const [, frontApi] = usePlane(() => ({ position: [0, 0, 8], rotation: [0, -Math.PI, 0] }));
  const [, bottomApi] = usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }));
  const [, topApi] = usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }));

  // 마우스 구는 잠들면 안 된다. 구와 조각이 둘 다 잠들면 물리 엔진이 충돌 검사를 건너뛰어
  // 마우스가 조각을 그냥 통과해 버린다(= "가끔 안 퍼지는" 현상).
  const [, api] = useSphere(() => ({
    type: "Kinematic",
    args: [MOUSE_SPHERE_RADIUS],
    allowSleep: false,
  }));

  useFrame((_, delta) => {
    const exiting = mainExit.progress > 0.03;
    if (wallsOpen.current !== exiting) {
      wallsOpen.current = exiting;
      if (exiting) {
        backApi.position.set(0, 0, -60);
        frontApi.position.set(0, 0, 60);
        bottomApi.position.set(0, -60, 0);
        topApi.position.set(0, 60, 0);
      } else {
        backApi.position.set(0, 0, 0);
        frontApi.position.set(0, 0, 8);
        bottomApi.position.set(0, -4, 0);
        topApi.position.set(0, 4, 0);
      }
    }

    const parked = puzzleSimulation.paused || exiting;
    const nx = parked ? 0 : pointerState.x;
    const ny = parked ? 0 : pointerState.y;
    const nz = parked ? -100 : pointerState.z;
    const current = spherePosition.current;

    if (current[0] === nx && current[1] === ny && current[2] === nz) {
      // 마우스가 멈추면 구의 속도도 0으로 — 안 그러면 Kinematic 구가 계속 미끄러져 간다
      if (sphereMoving.current) {
        sphereMoving.current = false;
        api.velocity.set(0, 0, 0);
      }
      return;
    }

    // 위치만 순간이동시키면 구의 속도가 0이라 잠든 조각을 깨우지 못하고 밀어내는 힘도 약하다.
    // 실제 이동 속도를 같이 넘겨서 잠든 조각을 깨우고 마우스 속도만큼 튕겨 내게 한다.
    const dx = nx - current[0];
    const dy = ny - current[1];
    const dz = nz - current[2];
    const jump = Math.hypot(dx, dy, dz);
    if (Number.isFinite(jump) && jump < MAX_SPHERE_JUMP && delta > 0) {
      const speed = jump / delta;
      const scale = Math.min(1, MAX_SPHERE_SPEED / speed) / delta;
      api.velocity.set(dx * scale, dy * scale, dz * scale);
      sphereMoving.current = true;
    } else if (sphereMoving.current) {
      api.velocity.set(0, 0, 0);
      sphereMoving.current = false;
    }

    current[0] = nx;
    current[1] = ny;
    current[2] = nz;
    api.position.set(nx, ny, nz);
  });

  return null;
}

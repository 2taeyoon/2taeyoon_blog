"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { usePlane, useSphere } from "@react-three/cannon";
import { pointerState, puzzleSimulation, MOUSE_SPHERE_RADIUS, mainExit } from "@/lib/portfolio/pointerState";

export default function Collisions() {
  const wallsOpen = useRef(false);
  const spherePosition = useRef<[number, number, number]>([
    Number.NaN,
    Number.NaN,
    Number.NaN,
  ]);
  const [, backApi] = usePlane(() => ({ position: [0, 0, 0], rotation: [0, 0, 0] }));
  const [, frontApi] = usePlane(() => ({ position: [0, 0, 8], rotation: [0, -Math.PI, 0] }));
  const [, bottomApi] = usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }));
  const [, topApi] = usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }));

  const [, api] = useSphere(() => ({ type: "Kinematic", args: [MOUSE_SPHERE_RADIUS] }));

  useFrame(() => {
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

    const next: [number, number, number] =
      puzzleSimulation.paused || exiting
        ? [0, 0, -100]
        : [pointerState.x, pointerState.y, pointerState.z];
    const current = spherePosition.current;
    if (
      current[0] !== next[0] ||
      current[1] !== next[1] ||
      current[2] !== next[2]
    ) {
      spherePosition.current = next;
      api.position.set(next[0], next[1], next[2]);
    }
  });

  return null;
}

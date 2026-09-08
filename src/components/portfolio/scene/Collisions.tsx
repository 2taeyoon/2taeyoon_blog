"use client";

import { useFrame } from "@react-three/fiber";
import { usePlane, useSphere } from "@react-three/cannon";
import { pointerState, puzzleSimulation, MOUSE_SPHERE_RADIUS, mainExit } from "@/lib/portfolio/pointerState";

export default function Collisions() {
  const [, backApi] = usePlane(() => ({ position: [0, 0, 0], rotation: [0, 0, 0] }));
  const [, frontApi] = usePlane(() => ({ position: [0, 0, 8], rotation: [0, -Math.PI, 0] }));
  const [, bottomApi] = usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }));
  const [, topApi] = usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }));

  const [, api] = useSphere(() => ({ type: "Kinematic", args: [MOUSE_SPHERE_RADIUS] }));

  useFrame(() => {
    if (mainExit.progress > 0.03) {
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

    if (puzzleSimulation.paused || mainExit.progress > 0.03) {
      api.position.set(0, 0, -100);
      return;
    }
    api.position.set(pointerState.x, pointerState.y, pointerState.z);
  });

  return null;
}

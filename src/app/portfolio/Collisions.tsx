"use client";

import { useFrame } from "@react-three/fiber";
import { usePlane, useSphere } from "@react-three/cannon";
import { pointerState } from "./pointerState";

export default function Collisions() {
  usePlane(() => ({ position: [0, 0, 0], rotation: [0, 0, 0] }));
  usePlane(() => ({ position: [0, 0, 8], rotation: [0, -Math.PI, 0] }));
  usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }));
  usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }));

  const [, api] = useSphere(() => ({ type: "Kinematic", args: [2] }));

  useFrame(() =>
    api.position.set(pointerState.x, pointerState.y, pointerState.z),
  );

  return null;
}

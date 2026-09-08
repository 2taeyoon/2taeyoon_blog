"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useBox, type Triplet } from "@react-three/cannon";
import {
  pointerState,
  puzzleSimulation,
  baubleMaterial,
  type BaubleProps,
} from "@/lib/portfolio/pointerState";
import {
  PUZZLE_DEPTH,
  puzzleGeometries,
} from "@/lib/portfolio/puzzleGeometry";

export default function Bauble(props: BaubleProps) {
  const force = useRef(new THREE.Vector3());
  const geometry =
    puzzleGeometries[props.variant % puzzleGeometries.length];
  const [ref, api] = useBox(() => ({
    args: [props.args, props.args, props.args * PUZZLE_DEPTH] as Triplet,
    mass: props.mass,
    angularDamping: props.angularDamping,
    linearDamping: props.linearDamping,
    rotation: [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    ],
  }));

  useEffect(() => {
    const vec = force.current;
    const unsubscribe = api.position.subscribe((p) => {
      if (!puzzleSimulation.paused && pointerState.down) {
        vec.set(
          pointerState.x - p[0],
          pointerState.y - p[1],
          pointerState.z - p[2],
        );
        const dist = vec.length();
        if (dist <= 0.05) return;
        vec
          .normalize()
          .multiplyScalar(props.args * Math.min(144, 48 + dist * 21.6));
        api.applyForce(vec.toArray(), [0, 0, 0]);
        return;
      }

      const distFromHome = Math.hypot(
        p[0] - props.homeX,
        p[1] - props.homeY,
        p[2],
      );
      if (distFromHome < 0.32) return;

      api.applyForce(
        vec
          .set(p[0] - props.homeX, p[1] - props.homeY, p[2] * 0.4)
          .normalize()
          .multiplyScalar(-props.args * 28)
          .toArray(),
        [0, 0, 0],
      );
    });
    return () => unsubscribe();
  }, [api, props.args, props.homeX, props.homeY]);

  return (
    <group ref={ref as React.Ref<THREE.Group>}>
      <mesh
        castShadow
        receiveShadow
        scale={props.args}
        geometry={geometry}
        material={baubleMaterial}
      />
    </group>
  );
}

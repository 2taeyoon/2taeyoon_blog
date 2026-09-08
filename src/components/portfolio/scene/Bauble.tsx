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
  const velocity = useRef(new THREE.Vector3());
  const geometry =
    puzzleGeometries[props.variant % puzzleGeometries.length];
  const [ref, api] = useBox(() => ({
    args: [props.args, props.args, props.args * PUZZLE_DEPTH] as Triplet,
    mass: props.mass,
    angularDamping: props.angularDamping,
    linearDamping: props.linearDamping,
    allowSleep: true,
    sleepSpeedLimit: 0.18,
    sleepTimeLimit: 0.35,
    position: [
      props.homeX,
      props.homeY,
      (Math.random() - 0.5) * 1.1,
    ],
    rotation: [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    ],
  }));

  useEffect(() => {
    const vec = force.current;
    const vel = velocity.current;
    const unsubVelocity = api.velocity.subscribe((value) => {
      vel.set(value[0], value[1], value[2]);
    });
    const unsubscribe = api.position.subscribe((p) => {
      if (puzzleSimulation.paused) return;

      if (pointerState.down) {
        vec.set(
          pointerState.x - p[0],
          pointerState.y - p[1],
          pointerState.z - p[2],
        );
        const dist = vec.length();
        if (dist <= 0.05) return;
        vec.normalize().multiplyScalar(props.args * Math.min(120, 40 + dist * 18));
        api.applyForce(vec.toArray(), [0, 0, 0]);
        return;
      }

      const distFromHome = Math.hypot(
        p[0] - props.homeX,
        p[1] - props.homeY,
        p[2],
      );
      const speed = vel.length();
      if (distFromHome < 1.05 && speed < 0.42) {
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
        return;
      }
      if (distFromHome < 0.72) return;

      api.applyForce(
        vec
          .set(p[0] - props.homeX, p[1] - props.homeY, p[2])
          .normalize()
          .multiplyScalar(-props.args * 16)
          .toArray(),
        [0, 0, 0],
      );
    });
    return () => {
      unsubVelocity();
      unsubscribe();
    };
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

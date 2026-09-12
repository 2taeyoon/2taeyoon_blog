"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useBox, type Triplet } from "@react-three/cannon";
import {
  pointerState,
  puzzleSimulation,
  baubleMaterial,
  mainExit,
  type BaubleProps,
} from "@/lib/portfolio/pointerState";
import {
  PUZZLE_DEPTH,
  puzzleGeometries,
} from "@/lib/portfolio/puzzleGeometry";

const INTRO_KICK = 18;
const INTRO_MS = 720;

export default function Bauble(props: BaubleProps) {
  const force = useRef(new THREE.Vector3());
  const wasExit = useRef(false);
  const lastBurst = useRef(-1);
  const introUntil = useRef(performance.now() + INTRO_MS);
  const geometry =
    puzzleGeometries[props.variant % puzzleGeometries.length];
  const [ref, api] = useBox(() => ({
      args: [props.args, props.args, props.args * PUZZLE_DEPTH] as Triplet,
      mass: props.mass,
      angularDamping: props.angularDamping,
      linearDamping: props.linearDamping,
      position: [
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.35,
      ],
      velocity: [
        props.explodeX * INTRO_KICK,
        props.explodeY * INTRO_KICK,
        (Math.random() - 0.5) * 5,
      ],
      angularVelocity: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ],
  }));

  useEffect(() => {
    introUntil.current = performance.now() + INTRO_MS;
  }, []);

  useEffect(() => {
    const vec = force.current;
    const unsubscribe = api.position.subscribe((p) => {
      const burst = mainExit.progress;
      if (burst > 0.001) {
        wasExit.current = true;
        if (Math.abs(lastBurst.current - burst) < 0.0005) return;
        lastBurst.current = burst;
        const d = 36 * burst;
        api.position.set(
          props.homeX + props.explodeX * d,
          props.homeY + props.explodeY * d,
          burst * 8,
        );
        api.velocity.set(0, 0, 0);
        return;
      }

      if (wasExit.current) {
        wasExit.current = false;
        lastBurst.current = -1;
        api.position.set(props.homeX, props.homeY, 0);
        api.velocity.set(0, 0, 0);
        return;
      }

      if (performance.now() < introUntil.current) return;

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
  }, [api, props.args, props.homeX, props.homeY, props.explodeX, props.explodeY]);

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

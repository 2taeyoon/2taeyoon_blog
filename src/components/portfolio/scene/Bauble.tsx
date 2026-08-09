"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useBox, type Triplet } from "@react-three/cannon";
import {
  pointerState,
  boxGeometry,
  baubleMaterial,
  type BaubleProps,
} from "@/lib/portfolio/pointerState";

export default function Bauble(props: BaubleProps) {
  const force = useRef(new THREE.Vector3());
  const [ref, api] = useBox(() => ({
    ...props,
    args: [props.args, props.args, props.args] as Triplet,
  }));

  useEffect(() => {
    const vec = force.current;
    const unsubscribe = api.position.subscribe((p) => {
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

      // 중심에 모인 뒤에도 당기는 힘이 계속 들어가면 미세 진동이 생김 → 데드존
      const distFromOrigin = Math.hypot(p[0], p[1], p[2]);
      if (distFromOrigin < 0.22) return;

      api.applyForce(
        vec
          .set(p[0], p[1], p[2])
          .normalize()
          .multiplyScalar(-props.args * 35)
          .toArray(),
        [0, 0, 0],
      );
    });
    return () => unsubscribe();
  }, [api, props.args]);

  return (
    <group ref={ref as React.Ref<THREE.Group>}>
      <mesh castShadow receiveShadow scale={props.args} geometry={boxGeometry} material={baubleMaterial} />
    </group>
  );
}

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
        if (dist > 0.05)
          vec.normalize().multiplyScalar(props.args * Math.min(120, 40 + dist * 18));
        api.applyForce(vec.toArray(), [0, 0, 0]);
      } else {
        api.applyForce(
          vec
            .set(...p)
            .normalize()
            .multiplyScalar(-props.args * 35)
            .toArray(),
          [0, 0, 0],
        );
      }
    });
    return () => unsubscribe();
  }, [api, props.args]);

  return (
    <group ref={ref as React.Ref<THREE.Group>}>
      <mesh castShadow receiveShadow scale={props.args} geometry={boxGeometry} material={baubleMaterial} />
    </group>
  );
}

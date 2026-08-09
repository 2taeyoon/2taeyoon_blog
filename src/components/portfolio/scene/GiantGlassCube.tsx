"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { pointerState } from "@/lib/portfolio/pointerState";
import { buildPalette, syncPaletteCssVars } from "@/lib/portfolio/palette";
import {
  createDreamyMaterial,
  lerpDreamyPalette,
  paintFlowMap,
} from "@/lib/portfolio/dreamyBackdropShader";

const PLANE_Z = -28;
const FLOW_SIZE = 256;

/**
 * 몽환 배경 — 팔레트 색에 맞춰 배경·격자 톤이 함께 바뀐다.
 */
export default function GiantGlassCube({ ballColor = "fabric" }: { ballColor?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseSmooth = useRef(new THREE.Vector2(0, 0));
  const mouseVel = useRef(new THREE.Vector2(0, 0));
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const flowPos = useRef(new THREE.Vector2(0.5, 0.5));
  const paletteTarget = useRef(buildPalette(ballColor));

  const { flowTexture, flowCtx } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = FLOW_SIZE;
    canvas.height = FLOW_SIZE;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, FLOW_SIZE, FLOW_SIZE);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return { flowTexture: texture, flowCtx: ctx };
  }, []);

  const material = useMemo(() => createDreamyMaterial(flowTexture), [flowTexture]);

  useEffect(() => {
    paletteTarget.current = buildPalette(ballColor);
    syncPaletteCssVars(paletteTarget.current);
  }, [ballColor]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const v = state.viewport.getCurrentViewport(state.camera, [0, 0, PLANE_Z]);
    mesh.position.set(0, 0, PLANE_Z);
    mesh.scale.set(v.width, v.height, 1);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uAspect.value = v.width / Math.max(v.height, 1);

    // 팔레트 색 부드럽게 보간
    lerpDreamyPalette(material.uniforms, paletteTarget.current, 1 - Math.exp(-delta * 4));

    mouseTarget.current.set(
      pointerState.moved ? pointerState.ndcX : state.pointer.x,
      pointerState.moved ? pointerState.ndcY : state.pointer.y,
    );
    const px = mouseSmooth.current.x;
    const py = mouseSmooth.current.y;
    mouseSmooth.current.lerp(mouseTarget.current, 1 - Math.exp(-delta * 5));
    mouseVel.current.set(
      (mouseSmooth.current.x - px) / Math.max(delta, 0.001),
      (mouseSmooth.current.y - py) / Math.max(delta, 0.001),
    );
    mouseVel.current.multiplyScalar(0.018);
    material.uniforms.uMouse.value.copy(mouseSmooth.current);
    material.uniforms.uMouseVel.value.lerp(mouseVel.current, 1 - Math.exp(-delta * 8));

    paintFlowMap({
      ctx: flowCtx,
      size: FLOW_SIZE,
      mouse: mouseSmooth.current,
      prev: flowPos.current,
      aspect: material.uniforms.uAspect.value as number,
    });
    flowTexture.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} material={material} renderOrder={-10}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

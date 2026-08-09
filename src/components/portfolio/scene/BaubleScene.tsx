"use client";

import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import type { BaubleProps } from "@/lib/portfolio/pointerState";
import { createBaubleConfigs } from "@/lib/portfolio/createBaubles";
import { applyBallColor } from "@/lib/portfolio/baubleAppearance";
import type { SceneId } from "@/lib/portfolio/scenes";
import Bauble from "@/components/portfolio/scene/Bauble";
import PointerInput from "@/components/portfolio/scene/PointerInput";
import Collisions from "@/components/portfolio/scene/Collisions";
import ResponsiveCamera from "@/components/portfolio/scene/ResponsiveCamera";
import GiantGlassCube from "@/components/portfolio/scene/GiantGlassCube";

interface BaubleSceneProps {
  ballColor: string;
  scene: SceneId;
}

/** Main Scene 전용 — 물리 큐브들 (마운트될 때만 물리 월드 존재) */
function MainScene({ baubles }: { baubles: BaubleProps[] }) {
  return (
    <Physics gravity={[0, 0, 0]} iterations={10} broadphase="SAP">
      <Collisions />
      {baubles.map((props, i) => (
        <Bauble key={i} {...props} />
      ))}
    </Physics>
  );
}

/**
 * 사이트 전체의 단일 3D 월드.
 * - GiantGlassCube: 쉐이더 몽환 배경 (격자 + 모핑 + 마우스 유체)
 * - Main: 물리 큐브들
 */
export default function BaubleScene({ ballColor, scene }: BaubleSceneProps) {
  const baubles = useMemo(() => createBaubleConfigs(), []);

  useEffect(() => {
    applyBallColor(ballColor);
  }, [ballColor]);

  return (
    <Canvas
      className="bauble_scene"
      shadows
      dpr={[1, 2]}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
      gl={{ alpha: true, stencil: false, antialias: false }}
      camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 160 }}
      onCreated={(state) => {
        state.gl.toneMappingExposure = 1.35;
      }}
    >
      <ResponsiveCamera />
      <PointerInput />
      <ambientLight intensity={0.5 * Math.PI} color="#8899cc" />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="#dde4ff"
        castShadow
        shadow-mapSize={[512, 512]}
        intensity={0.75 * Math.PI}
      />
      <directionalLight position={[0, 5, -4]} intensity={2.6 * Math.PI} color="#c8d4f8" />
      <directionalLight position={[0, -15, -0]} intensity={0.6 * Math.PI} color="#de7c3a" />

      <GiantGlassCube ballColor={ballColor} />

      {scene === "main" && <MainScene baubles={baubles} />}

      <Environment files="/3d/adamsbridge.hdr" />
      <EffectComposer multisampling={0}>
        <N8AO aoRadius={2} intensity={7} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}

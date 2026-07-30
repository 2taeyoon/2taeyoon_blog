"use client";

import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { baubleMaterial, sizeSteps } from "@/lib/portfolio/pointerState";
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

/** 직물(리넨) 질감 + 인디고/오렌지 그라데이션 텍스처 생성 */
function createFabricTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // 인디고 베이스 그라데이션
    const base = ctx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, "#3a5494");
    base.addColorStop(0.55, "#27407c");
    base.addColorStop(1, "#16224d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // 우상단 오렌지 글로우
    const glow = ctx.createRadialGradient(size * 0.78, size * 0.22, 0, size * 0.78, size * 0.22, size * 0.75);
    glow.addColorStop(0, "rgba(222, 124, 58, 0.95)");
    glow.addColorStop(0.45, "rgba(205, 108, 52, 0.4)");
    glow.addColorStop(1, "rgba(205, 108, 52, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // 가로 위사 라인 — 밝고 어두운 실이 번갈아 가며 직물 결 표현
    ctx.lineWidth = 1;
    for (let y = 0; y < size; y += 2) {
      const alpha = 0.04 + Math.random() * 0.1;
      ctx.strokeStyle = Math.random() < 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(8, 12, 30, ${alpha + 0.05})`;
      ctx.beginPath();
      ctx.moveTo(0, y + Math.random());
      ctx.lineTo(size, y + Math.random());
      ctx.stroke();
    }

    // 세로 경사 라인 — 듬성듬성 교차하는 크로스해치
    for (let x = 0; x < size; x += 4) {
      if (Math.random() < 0.4) continue;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.02 + Math.random() * 0.05})`;
      ctx.beginPath();
      ctx.moveTo(x + Math.random(), 0);
      ctx.lineTo(x + Math.random(), size);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Main Scene 전용 — 물리 큐브들 (마운트될 때만 물리 월드 존재) */
function MainScene({ baubles }: { baubles: { args: number; mass: number; angularDamping: number; linearDamping: number }[] }) {
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
  const baubles = useMemo(
    () =>
      [...Array(50)].map(() => ({
        args: sizeSteps[Math.floor(Math.random() * sizeSteps.length)],
        mass: 1,
        angularDamping: 0.2,
        linearDamping: 0.95,
      })),
    [],
  );

  useEffect(() => {
    if (ballColor === "fabric") {
      const texture = createFabricTexture();
      baubleMaterial.map = texture;
      baubleMaterial.emissiveMap = texture;
      baubleMaterial.color.setHex(0xffffff);
      baubleMaterial.emissive.setHex(0xffffff).multiplyScalar(0.2);
      baubleMaterial.needsUpdate = true;
    } else {
      baubleMaterial.map = null;
      baubleMaterial.emissiveMap = null;
      const c = new THREE.Color(ballColor);
      baubleMaterial.color.copy(c);
      baubleMaterial.emissive.copy(c).multiplyScalar(0.2);
      baubleMaterial.needsUpdate = true;
    }
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
      <spotLight position={[20, 20, 25]} penumbra={1} angle={0.2} color="#dde4ff" castShadow shadow-mapSize={[512, 512]} intensity={0.75 * Math.PI} />
      <directionalLight position={[0, 5, -4]} intensity={2.6 * Math.PI} color="#c8d4f8" />
      <directionalLight position={[0, -15, -0]} intensity={0.6 * Math.PI} color="#de7c3a" />

      <GiantGlassCube />

      {scene === "main" && <MainScene baubles={baubles} />}

      <Environment files="/3d/adamsbridge.hdr" />
      <EffectComposer multisampling={0}>
        <N8AO aoRadius={2} intensity={7} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}

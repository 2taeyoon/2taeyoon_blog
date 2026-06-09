"use client";

import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { baubleMaterial, sizeSteps } from "@/lib/portfolio/pointerState";
import Bauble from "@/components/portfolio/scene/Bauble";
import PointerInput from "@/components/portfolio/scene/PointerInput";
import Collisions from "@/components/portfolio/scene/Collisions";

interface BaubleSceneProps {
  ballColor: string;
}

export default function BaubleScene({ ballColor }: BaubleSceneProps) {
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
    if (ballColor === "gradient") {
      const canvas = document.createElement("canvas");
      canvas.width = 2;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, "#b21210");
        gradient.addColorStop(1, "#0033ff");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 256);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

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
      style={{ position: "absolute", inset: 0, zIndex: 1 }}
      shadows
      dpr={1.5}
      gl={{ alpha: true, stencil: false, antialias: false }}
      camera={{ position: [0, 0, 20], fov: 35, near: 10, far: 40 }}
      onCreated={(state) => {
        state.gl.toneMappingExposure = 1.7;
      }}
    >
      <ambientLight intensity={1.0 * Math.PI} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="white"
        castShadow
        shadow-mapSize={[512, 512]}
        intensity={Math.PI}
      />
      <directionalLight position={[0, 5, -4]} intensity={4.5 * Math.PI} />
      <directionalLight
        position={[0, -15, -0]}
        intensity={1.5 * Math.PI}
        color="red"
      />
      <Physics gravity={[0, 0, 0]} iterations={10} broadphase="SAP">
        <PointerInput />
        <Collisions />
        {baubles.map((props, i) => (
          <Bauble key={i} {...props} />
        ))}
      </Physics>
      <Environment files="/adamsbridge.hdr" />
      <EffectComposer multisampling={0}>
        <N8AO aoRadius={2} intensity={10} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}

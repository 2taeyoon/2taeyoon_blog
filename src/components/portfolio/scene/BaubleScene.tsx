"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO, Noise, ToneMapping } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import {
  coreGlow,
  mainExit,
  mainRenderState,
  type BaubleProps,
} from "@/lib/portfolio/pointerState";
import { createBaubleConfigs, getBaubleCount } from "@/lib/portfolio/createBaubles";
import { applyBallColor } from "@/lib/portfolio/baubleAppearance";
import type { SceneId } from "@/lib/portfolio/scenes";
import { markSceneReady } from "@/lib/portfolio/sceneReady";
import Bauble from "@/components/portfolio/scene/Bauble";
import PointerInput from "@/components/portfolio/scene/PointerInput";
import Collisions from "@/components/portfolio/scene/Collisions";
import ResponsiveCamera from "@/components/portfolio/scene/ResponsiveCamera";
import { flowerAnchor, updateFlowerAnchor } from "@/lib/portfolio/heroImage";

interface BaubleSceneProps {
  ballColor: string;
  scene: SceneId;
}

/** 조각이 멈춘 뒤에도 이 프레임 수만큼은 그림자를 더 갱신한다 (변화 감지가 한 프레임 늦을 수 있어서) */
const SHADOW_SETTLE_FRAMES = 4;
const MOTION_EPSILON = 1e-5;
/** 회전(3x3)과 이동 성분 — matrix.elements 인덱스 */
const POSE_KEYS = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14];

/**
 * 그림자 맵은 조각이 움직일 때만 다시 그린다.
 * 조각이 모두 멈춰 있으면 직전 그림자와 결과가 같으므로, 매 프레임 50개 조각을 다시 그리는 비용을 아낀다.
 */
function ShadowUpdateGate({ target }: { target: React.RefObject<THREE.Group | null> }) {
  const gl = useThree((state) => state.gl);
  const lastPose = useRef<Float32Array | null>(null);
  const framesLeft = useRef(SHADOW_SETTLE_FRAMES);

  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);

  useFrame(() => {
    const group = target.current;
    if (!group) return;
    // @react-three/cannon은 position/quaternion이 아니라 object.matrix를 직접 덮어쓴다
    const pieces = group.children;
    const size = pieces.length * POSE_KEYS.length;
    let pose = lastPose.current;
    let moved = false;
    if (!pose || pose.length !== size) {
      pose = new Float32Array(size);
      lastPose.current = pose;
      moved = true;
    }
    for (let i = 0; i < pieces.length; i++) {
      const e = pieces[i].matrix.elements;
      const o = i * POSE_KEYS.length;
      for (let k = 0; k < POSE_KEYS.length; k++) {
        const value = e[POSE_KEYS[k]];
        if (Math.abs(pose[o + k] - value) > MOTION_EPSILON) moved = true;
        pose[o + k] = value;
      }
    }

    if (moved) framesLeft.current = SHADOW_SETTLE_FRAMES;
    if (framesLeft.current > 0) {
      framesLeft.current -= 1;
      gl.shadowMap.needsUpdate = true;
    }
  });

  return null;
}

/**
 * 꽃송이 속 주황 불빛(coreGlow)을 꽃송이 자리에 맞춘다.
 * 꽃송이 자리는 화면 크기에 따라 바뀌므로 매 프레임 따라간다.
 */
function FlowerCoreGlowSync() {
  useFrame(() => {
    coreGlow.center.value.set(flowerAnchor.x, flowerAnchor.y - flowerAnchor.ry * 0.1, -0.6);
    coreGlow.radius.value.set(flowerAnchor.rx, flowerAnchor.ry);
  });

  return null;
}

/** Main Scene 전용 — 물리 퍼즐 조각들 (마운트될 때만 물리 월드 존재) */
function MainScene({
  baubles,
  paused,
}: {
  baubles: BaubleProps[];
  paused: boolean;
}) {
  const piecesRef = useRef<THREE.Group>(null);

  return (
    <Physics
      gravity={[0, 0, 0]}
      iterations={8}
      maxSubSteps={2}
      broadphase="SAP"
      allowSleep
      isPaused={paused}
      shouldInvalidate={false}
    >
      <Collisions />
      <FlowerCoreGlowSync />
      <group ref={piecesRef}>
        {baubles.map((props, i) => (
          <Bauble key={i} {...props} />
        ))}
      </group>
      <ShadowUpdateGate target={piecesRef} />
    </Physics>
  );
}

/**
 * 배경 그림의 꽃송이 자리를 3D 좌표로 바꿔 둔다.
 * ResponsiveCamera가 카메라를 맞춘 다음에 계산해야 하므로 Canvas 안에서 그 뒤에 둔다.
 */
function FlowerAnchorSync() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    updateFlowerAnchor(size.width, size.height, visibleHeight / Math.max(size.height, 1));
    mainRenderState.request();
  }, [camera, size.width, size.height]);

  return null;
}

function SceneFrameLoop() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(
    () => mainRenderState.subscribe(invalidate),
    [invalidate],
  );

  useFrame(() => {
    if (mainExit.progress < 0.98) invalidate();
  });

  return null;
}

function SceneEffects() {
  const isMobile = useThree((state) => state.size.width <= 640);

  if (isMobile) {
    return (
      <EffectComposer multisampling={0}>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <N8AO
        aoRadius={1.6}
        intensity={3.5}
        halfRes
        quality="medium"
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      {/* 배경 그림의 필름 그레인과 맞춘다 */}
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.18} />
    </EffectComposer>
  );
}

function SceneLighting() {
  const isMobile = useThree((state) => state.size.width <= 640);

  return (
    <>
      <ambientLight intensity={0.5 * Math.PI} color="#8899cc" />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="#dde4ff"
        castShadow={!isMobile}
        shadow-mapSize={[512, 512]}
        intensity={0.75 * Math.PI}
      />
      <directionalLight
        position={[0, 5, -4]}
        intensity={2.6 * Math.PI}
        color="#c8d4f8"
      />
      <directionalLight
        position={[0, -15, 0]}
        intensity={0.6 * Math.PI}
        color="#de7c3a"
      />
    </>
  );
}

/**
 * 메인 3D 월드. 배경 그림(HeroBackdrop) 위에 투명하게 겹친다.
 * - Main: 물리 퍼즐 조각들. 배경 그림의 꽃대 위(heroImage.flowerAnchor)로 모여 꽃송이가 된다
 */
export default function BaubleScene({ ballColor, scene }: BaubleSceneProps) {
  const baubles = useMemo(() => createBaubleConfigs(getBaubleCount()), []);
  const [mainActive, setMainActive] = useState(true);

  useEffect(() => {
    applyBallColor(ballColor);
  }, [ballColor]);

  useEffect(
    () =>
      mainRenderState.subscribe(() => {
        setMainActive(mainExit.progress < 0.98);
      }),
    [],
  );

  return (
    <Canvas
      className="bauble_scene"
      shadows
      dpr={[1, 1.5]}
      frameloop="demand"
      style={{ touchAction: "pan-y" }}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
      gl={{ alpha: true, stencil: false, antialias: false }}
      camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 160 }}
      onCreated={(state) => {
        state.gl.toneMappingExposure = 1.35;
        state.gl.domElement.style.touchAction = "pan-y";
        // 로딩 화면(PortfolioLoader)에 첫 장면이 준비됐다고 알린다
        window.requestAnimationFrame(markSceneReady);
      }}
    >
      <SceneFrameLoop />
      <ResponsiveCamera />
      <FlowerAnchorSync />
      <PointerInput />
      <SceneLighting />

      {scene === "main" && (
        <MainScene baubles={baubles} paused={!mainActive} />
      )}

      <Environment files="/3d/adamsbridge.hdr" />
      <SceneEffects />
    </Canvas>
  );
}

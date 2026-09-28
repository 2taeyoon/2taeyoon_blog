"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { applyBallColor } from "@/lib/portfolio/baubleAppearance";
import { puzzleGeometries } from "@/lib/portfolio/puzzleGeometry";
import { baubleMaterial } from "@/lib/portfolio/pointerState";
import { usePortfolioSessionStore } from "@/stores/usePortfolioSessionStore";

type FloaterPiece = {
  side: -1 | 1;
  /** 화면 가장자리에서 안으로 들어오는 거리 */
  pad: number;
  y: number;
  scale: number;
  variant: number;
  phase: number;
  speed: number;
};

const PIECES: FloaterPiece[] = [
  { side: -1, pad: 4.6, y: 0.16, scale: 1.85, variant: 0, phase: 0.3, speed: 0.22 },
  { side: 1, pad: 4.4, y: 0.46, scale: 1.4, variant: 1, phase: 1.5, speed: 0.18 },
  { side: -1, pad: 2.8, y: 0.34, scale: 1, variant: 3, phase: 2.4, speed: 0.26 },
  { side: 1, pad: 2.2, y: 0.12, scale: 1, variant: 5, phase: 0.7, speed: 0.2 },
  { side: -1, pad: 7.4, y: 0.4, scale: 1.4, variant: 6, phase: 2.9, speed: 0.16 },
];

function FloatingPuzzle({
  piece,
  reducedMotion,
}: {
  piece: FloaterPiece;
  reducedMotion: boolean;
}) {
  const ref = useRef<Group>(null);
  const width = useThree((state) => state.viewport.width);
  const height = useThree((state) => state.viewport.height);
  const pixelHeight = useThree((state) => state.size.height);

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group || width < 1 || pixelHeight < 1) return;

    const time = reducedMotion ? 0 : clock.elapsedTime;
    const bob = Math.cos(time * piece.speed * 0.85 + piece.phase) * 0.18;
    const drift = Math.sin(time * piece.speed + piece.phase) * 0.08;
    const lift = (50 * height) / pixelHeight;

    group.position.x = piece.side * (width / 2 - piece.pad) + drift;
    group.position.y = (height / 2) * piece.y + lift + bob;
    group.rotation.x = 0.45 + Math.sin(time * 0.16 + piece.phase) * 0.18;
    group.rotation.y = Math.sin(time * piece.speed + piece.phase) * 0.55;
    group.rotation.z = -0.2 + Math.cos(time * 0.14 + piece.phase) * 0.16;
  });

  return (
    <group ref={ref} scale={piece.scale}>
      <mesh
        geometry={puzzleGeometries[piece.variant % puzzleGeometries.length]}
        material={baubleMaterial}
      />
    </group>
  );
}

function FloaterScene({ reducedMotion }: { reducedMotion: boolean }) {
  const width = useThree((state) => state.size.width);
  const pieces = width <= 800 ? PIECES.filter((piece) => piece.scale > 1) : PIECES;

  return (
    <>
      <ambientLight intensity={0.55 * Math.PI} color="#8899cc" />
      <spotLight position={[20, 20, 25]} angle={0.2} penumbra={1} color="#dde4ff" intensity={0.75 * Math.PI} />
      <directionalLight position={[0, 5, -4]} intensity={2.6 * Math.PI} color="#c8d4f8" />
      <directionalLight position={[0, -15, 0]} intensity={0.6 * Math.PI} color="#de7c3a" />
      {pieces.map((piece) => (
        <FloatingPuzzle
          key={`${piece.side}-${piece.variant}`}
          piece={piece}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}

export default function ProjectPageFloaters() {
  const themeColor = usePortfolioSessionStore((state) => state.themeColor);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(width <= 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    setReady(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    applyBallColor(themeColor);
  }, [themeColor]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="project_page_floaters" aria-hidden="true">
      {ready && !isMobile && (
        <Canvas
          style={{ pointerEvents: "none" }}
          resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
          dpr={[1, 1.5]}
          frameloop={reducedMotion ? "demand" : "always"}
          gl={{ alpha: true, antialias: true, stencil: false }}
          camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 80 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <FloaterScene reducedMotion={reducedMotion} />
        </Canvas>
      )}
    </div>
  );
}

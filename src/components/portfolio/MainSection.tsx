"use client";

import { useEffect, useState } from "react";
import BaubleScene from "@/components/portfolio/scene/BaubleScene";
import Underlay from "@/components/portfolio/ui/Underlay";
import SceneContent from "@/components/portfolio/ui/SceneContent";
import SceneNav from "@/components/portfolio/ui/SceneNav";
import { ColorPalette } from "@/components/portfolio/ui/ColorPalette";
import { SCENE_ORDER, cubeSpinState, type SceneId } from "@/lib/portfolio/scenes";

interface FaceTransition {
  from: SceneId;
  to: SceneId;
  dir: 1 | -1;
}

const STORAGE_KEY = "baubleColor";

function usePersistedBallColor() {
  const [ballColor, setBallColor] = useState("fabric");

  useEffect(() => {
    const savedColor = sessionStorage.getItem(STORAGE_KEY);
    if (savedColor) setBallColor(savedColor);
  }, []);

  const handleColorChange = (color: string) => {
    setBallColor(color);
    sessionStorage.setItem(STORAGE_KEY, color);
  };

  return { ballColor, handleColorChange };
}

function useSceneNavigation() {
  const [scene, setScene] = useState<SceneId>("main");
  const [faceTransition, setFaceTransition] = useState<FaceTransition | null>(null);
  const transitioning = faceTransition !== null;

  const goToScene = (target: SceneId) => {
    if (transitioning || target === scene) return;

    if (scene !== "main" && target !== "main") {
      // 섹션 간 이동 — 큐브 면 회전으로 전환
      const dir: 1 | -1 = SCENE_ORDER.indexOf(target) > SCENE_ORDER.indexOf(scene) ? 1 : -1;
      cubeSpinState.target += dir * -(Math.PI / 2);
      setFaceTransition({ from: scene, to: target, dir });
    } else {
      setScene(target);
    }
  };

  const handleFaceAnimationEnd = () => {
    if (!faceTransition) return;
    setScene(faceTransition.to);
    setFaceTransition(null);
  };

  return {
    scene,
    faceTransition,
    transitioning,
    goToScene,
    handleFaceAnimationEnd,
  };
}

/**
 * 사이트 전체 = 하나의 거대한 Glass Cube.
 * - 섹션 ↔ 섹션: 화면이 뒤로 빠지며 큐브 면이 90° 회전해 다음 면으로 전환 (CSS 3D)
 */
export default function MainSection() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { ballColor, handleColorChange } = usePersistedBallColor();
  const { scene, faceTransition, transitioning, goToScene, handleFaceAnimationEnd } = useSceneNavigation();

  const navigate = (target: SceneId) => {
    setPaletteOpen(false);
    goToScene(target);
  };

  return (
    <div className="main_section_container">
      <Underlay
        onTogglePalette={() => setPaletteOpen((prev) => !prev)}
        onClosePalette={() => setPaletteOpen(false)}
        heroVisible={scene === "main" && !transitioning}
      />

      {faceTransition ? (
        <div className="scene_stage" aria-hidden="true">
          <div
            className={`scene_cube is_animating ${faceTransition.dir === 1 ? "dir_next" : "dir_prev"}`}
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget) handleFaceAnimationEnd();
            }}
          >
            <div className="scene_face scene_face_front">
              <SceneContent scene={faceTransition.from} visible />
            </div>
            <div className="scene_face scene_face_side">
              <SceneContent scene={faceTransition.to} visible />
            </div>
          </div>
        </div>
      ) : (
        <SceneContent scene={scene} visible={!transitioning} />
      )}

      <SceneNav scene={scene} transitioning={transitioning} onNavigate={navigate} />

      {paletteOpen && <ColorPalette value={ballColor} onChange={handleColorChange} />}

      <BaubleScene ballColor={ballColor} scene={scene} />
    </div>
  );
}

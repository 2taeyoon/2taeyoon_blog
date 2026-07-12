"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * 사이트 전체 = 하나의 거대한 Glass Cube.
 * - Main ↔ 섹션: 큐브 스웜 + 카메라 전진 (SceneTransition)
 * - 섹션 ↔ 섹션: 화면이 뒤로 빠지며 큐브 면이 90° 회전해 다음 면으로 전환 (CSS 3D)
 */
export default function MainSection() {
  const [ballColor, setBallColor] = useState("fabric");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [scene, setScene] = useState<SceneId>("main");
  const [pendingScene, setPendingScene] = useState<SceneId | null>(null);
  const pendingRef = useRef<SceneId | null>(null);
  const [faceTransition, setFaceTransition] = useState<FaceTransition | null>(null);

  useEffect(() => {
    const savedColor = sessionStorage.getItem("baubleColor");
    if (savedColor) {
      setBallColor(savedColor);
    }
  }, []);

  const handleColorChange = (color: string) => {
    setBallColor(color);
    sessionStorage.setItem("baubleColor", color);
  };

  const transitioning = pendingScene !== null || faceTransition !== null;

  const goToScene = (target: SceneId) => {
    if (transitioning || target === scene) return;
    setPaletteOpen(false);

    if (scene !== "main" && target !== "main") {
      // 섹션 간 이동 — 참조 영상처럼 큐브 면 회전으로 전환
      const dir: 1 | -1 = SCENE_ORDER.indexOf(target) > SCENE_ORDER.indexOf(scene) ? 1 : -1;
      cubeSpinState.target += dir * -(Math.PI / 2);
      setFaceTransition({ from: scene, to: target, dir });
    } else {
      // Main 진입/이탈 — 큐브 스웜 + 카메라 전진
      pendingRef.current = target;
      setPendingScene(target);
    }
  };

  /** 스웜 전환: 화면이 가득 덮인 순간 Scene 교체 */
  const handleTransitionCover = () => {
    if (pendingRef.current) {
      setScene(pendingRef.current);
    }
  };

  const handleTransitionComplete = () => {
    pendingRef.current = null;
    setPendingScene(null);
  };

  /** 면 회전 전환: 회전 애니메이션 종료 시 Scene 교체 확정 */
  const handleFaceAnimationEnd = () => {
    if (!faceTransition) return;
    setScene(faceTransition.to);
    setFaceTransition(null);
  };

  return (
    <div className="main_section_container">
      <Underlay
        onTogglePalette={() => setPaletteOpen((prev) => !prev)}
        onClosePalette={() => setPaletteOpen(false)}
        onStart={() => goToScene("about")}
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

      <SceneNav scene={scene} transitioning={transitioning} onNavigate={goToScene} />

      {paletteOpen && <ColorPalette value={ballColor} onChange={handleColorChange} />}

      {/* 스웜 전환 절정에서 화면을 감싸는 글래스 플래시 (Scene 교체 순간을 가림) */}
      <div className={`scene_flash${pendingScene ? " is_active" : ""}`} aria-hidden="true" />

      <BaubleScene
        ballColor={ballColor}
        scene={scene}
        transitionActive={pendingScene !== null}
        onTransitionCover={handleTransitionCover}
        onTransitionComplete={handleTransitionComplete}
      />
    </div>
  );
}

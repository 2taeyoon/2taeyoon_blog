"use client";

import { SCENE_LABELS, SCENE_ORDER, nextScene, prevScene, type SceneId } from "@/lib/portfolio/scenes";

interface SceneNavProps {
  scene: SceneId;
  transitioning: boolean;
  onNavigate: (target: SceneId) => void;
}

/** 하단 중앙 Scene 내비게이션 — 하나의 큐브 안에서 Scene 간 이동 */
export default function SceneNav({ scene, transitioning, onNavigate }: SceneNavProps) {
  if (scene === "main") return null;

  return (
    <nav className="scene_nav" onPointerDown={(e) => e.stopPropagation()} aria-label="섹션 이동">
      <button
        type="button"
        className="scene_nav_arrow"
        onClick={() => onNavigate(prevScene(scene))}
        disabled={transitioning}
        aria-label="이전 섹션"
      >
        ←
      </button>

      <div className="scene_nav_dots">
        {SCENE_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            className={`scene_nav_dot${id === scene ? " is_current" : ""}`}
            onClick={() => onNavigate(id)}
            disabled={transitioning || id === scene}
            aria-label={`${SCENE_LABELS[id]} 섹션으로 이동`}
            aria-current={id === scene}
          >
            <span className="scene_nav_dot_mark" />
            <span className="scene_nav_dot_label">{SCENE_LABELS[id]}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="scene_nav_arrow"
        onClick={() => onNavigate(nextScene(scene))}
        disabled={transitioning}
        aria-label="다음 섹션"
      >
        →
      </button>
    </nav>
  );
}

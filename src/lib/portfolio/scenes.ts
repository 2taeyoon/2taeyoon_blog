/** 하나의 거대한 큐브 안에서 전환되는 Scene(Section) 정의 */
export type SceneId = "main" | "about" | "skills" | "projects" | "contact";

export const SCENE_ORDER: SceneId[] = ["main", "about", "skills", "projects", "contact"];

export const SCENE_LABELS: Record<SceneId, string> = {
  main: "MAIN",
  about: "ABOUT",
  skills: "SKILLS",
  projects: "PROJECTS",
  contact: "CONTACT",
};

/**
 * 섹션(face) 전환 시 배경의 거대 글래스 큐브가 90°씩 함께 회전하도록 하는
 * 공유 상태 (DOM 트랜지션과 Canvas 회전 동기화용)
 */
export const cubeSpinState = {
  target: 0,
  current: 0,
};

export function nextScene(current: SceneId): SceneId {
  const idx = SCENE_ORDER.indexOf(current);
  return SCENE_ORDER[(idx + 1) % SCENE_ORDER.length];
}

export function prevScene(current: SceneId): SceneId {
  const idx = SCENE_ORDER.indexOf(current);
  return SCENE_ORDER[(idx - 1 + SCENE_ORDER.length) % SCENE_ORDER.length];
}

/** 메인 3D 장면이 첫 프레임을 그렸을 때 로딩 화면에 알리는 신호 */
export const SCENE_READY_EVENT = "pf:scene-ready";

let sceneReady = false;

export function markSceneReady() {
  if (sceneReady) return;
  sceneReady = true;
  window.dispatchEvent(new Event(SCENE_READY_EVENT));
}

export function isSceneReady() {
  return sceneReady;
}

import * as THREE from "three";
import { sizeSteps, type BaubleProps } from "@/lib/portfolio/pointerState";

export const BAUBLE_COUNT = 50;

/** 메인 씬 물리 큐브 설정 목록 생성 */
export function createBaubleConfigs(count = BAUBLE_COUNT): BaubleProps[] {
  return Array.from({ length: count }, () => ({
    args: sizeSteps[Math.floor(Math.random() * sizeSteps.length)],
    mass: 1,
    angularDamping: 0.2,
    linearDamping: 0.95,
  }));
}

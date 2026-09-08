import { sizeSteps, type BaubleProps } from "@/lib/portfolio/pointerState";
import { PUZZLE_VARIANT_COUNT } from "@/lib/portfolio/puzzleGeometry";

export const BAUBLE_COUNT = 50;

/** 메인 씬 물리 퍼즐 조각 설정 목록 생성 */
export function createBaubleConfigs(count = BAUBLE_COUNT): BaubleProps[] {
  return Array.from({ length: count }, (_, index) => {
    const spread = count === 1 ? 0 : index / (count - 1);

    return {
      args: sizeSteps[Math.floor(Math.random() * sizeSteps.length)],
      variant: Math.floor(Math.random() * PUZZLE_VARIANT_COUNT),
      homeX: (spread - 0.5) * 7.4 + (Math.random() - 0.5) * 0.7,
      homeY: (Math.random() - 0.5) * 2.4,
      mass: 1,
      angularDamping: 0.82,
      linearDamping: 0.988,
    };
  });
}

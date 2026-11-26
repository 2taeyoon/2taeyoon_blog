import { sizeSteps, type BaubleProps } from "@/lib/portfolio/pointerState";
import { PUZZLE_VARIANT_COUNT } from "@/lib/portfolio/puzzleGeometry";

export const BAUBLE_COUNT = 42;
export const BAUBLE_COUNT_MOBILE = 15;
/** 배경 그림의 꽃송이 크기에 맞춘 조각 크기 배율 */
const PIECE_SCALE = 0.8;

export function getBaubleCount() {
  if (typeof window === "undefined") return BAUBLE_COUNT;
  return window.matchMedia("(width <= 640px)").matches
    ? BAUBLE_COUNT_MOBILE
    : BAUBLE_COUNT;
}

/** 메인 씬 물리 퍼즐 조각 설정 목록 생성 */
export function createBaubleConfigs(count = BAUBLE_COUNT): BaubleProps[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    // 꽃송이 안쪽 단위 원 위의 자리. 가운데로 갈수록 촘촘하게 모인다 (실제 위치는 heroImage.flowerHome)
    const homeAngle = Math.random() * Math.PI * 2;
    const homeRadius = Math.sqrt(Math.random()) * 0.88;

    return {
      args: sizeSteps[Math.floor(Math.random() * sizeSteps.length)] * PIECE_SCALE,
      variant: Math.floor(Math.random() * PUZZLE_VARIANT_COUNT),
      homeX: Math.cos(homeAngle) * homeRadius,
      homeY: Math.sin(homeAngle) * homeRadius,
      explodeX: Math.cos(angle),
      explodeY: Math.sin(angle) * 0.62,
      mass: 1,
      angularDamping: 0.2,
      linearDamping: 0.95,
    };
  });
}

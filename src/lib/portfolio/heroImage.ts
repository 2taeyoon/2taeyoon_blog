/**
 * 메인 배경 그림과, 그 위에 퍼즐 조각이 모여 꽃송이가 되는 자리.
 * 그림은 CSS object-fit: cover로 깔리므로 화면 크기에 따라 꽃송이 위치를 다시 계산해야 한다.
 */
export const HERO_IMAGE = {
  src: "/images/portfolio/main/hero_workshop.webp",
  width: 1504,
  height: 704,
  /** CSS object-position의 세로 값과 같아야 한다 (mainSection.css .hero_backdrop_image img) */
  focusY: 0.6,
};

/** 그림 안에서 꽃대 위 꽃송이가 놓일 자리 (그림 픽셀 기준 중심과 가로·세로 반지름) */
const FLOWER_HEAD = { x: 760, y: 292, rx: 232, ry: 158 };

/** 퍼즐 조각이 모일 꽃송이 자리 (3D 좌표). FlowerAnchorSync가 화면 크기가 바뀔 때마다 갱신한다 */
export const flowerAnchor = { x: 0, y: 1.6, rx: 4.6, ry: 3.2 };

/** cover로 깔린 그림 위 한 점을 화면 픽셀 위치로 바꾼다 */
function imagePointToScreen(pointX: number, pointY: number, viewWidth: number, viewHeight: number) {
  const scale = Math.max(viewWidth / HERO_IMAGE.width, viewHeight / HERO_IMAGE.height);
  const offsetX = (viewWidth - HERO_IMAGE.width * scale) * 0.5;
  const offsetY = (viewHeight - HERO_IMAGE.height * scale) * HERO_IMAGE.focusY;
  return { x: offsetX + pointX * scale, y: offsetY + pointY * scale, scale };
}

/**
 * 화면 크기와 카메라가 보는 범위로 꽃송이 자리를 3D 좌표로 바꿔 둔다.
 * @param worldPerPixel z=0 평면에서 화면 1px이 차지하는 3D 길이
 */
export function updateFlowerAnchor(viewWidth: number, viewHeight: number, worldPerPixel: number) {
  const point = imagePointToScreen(FLOWER_HEAD.x, FLOWER_HEAD.y, viewWidth, viewHeight);
  flowerAnchor.x = (point.x - viewWidth / 2) * worldPerPixel;
  flowerAnchor.y = -(point.y - viewHeight / 2) * worldPerPixel;
  flowerAnchor.rx = FLOWER_HEAD.rx * point.scale * worldPerPixel;
  flowerAnchor.ry = FLOWER_HEAD.ry * point.scale * worldPerPixel;
}

/** 조각 하나가 돌아갈 자리. home은 꽃송이 안쪽 단위 원(-1~1) 위의 좌표 */
export function flowerHome(homeX: number, homeY: number) {
  return {
    x: flowerAnchor.x + homeX * flowerAnchor.rx,
    y: flowerAnchor.y + homeY * flowerAnchor.ry,
  };
}

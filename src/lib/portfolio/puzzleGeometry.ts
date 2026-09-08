import * as THREE from "three";

export const PUZZLE_DEPTH = 0.26;

/** [top, right, bottom, left] — 1 돌기, -1 홈 */
const PUZZLE_VARIANTS: Array<[number, number, number, number]> = [
  [1, 1, -1, -1],
  [1, -1, -1, 1],
  [-1, 1, 1, -1],
  [1, -1, 1, -1],
  [-1, -1, 1, 1],
  [-1, 1, -1, 1],
  [1, 1, -1, 1],
  [-1, -1, 1, -1],
];

function normalizeDelta(from: number, to: number, clockwise: boolean) {
  let delta = to - from;
  if (clockwise) {
    while (delta > 0) delta -= Math.PI * 2;
    while (delta < -Math.PI * 2) delta += Math.PI * 2;
  } else {
    while (delta < 0) delta += Math.PI * 2;
    while (delta > Math.PI * 2) delta -= Math.PI * 2;
  }
  return delta;
}

function angleOnArc(start: number, target: number, clockwise: boolean) {
  const delta = normalizeDelta(start, target, clockwise);
  return clockwise ? delta < 0 : delta > 0;
}

function drawPuzzleEdge(
  shape: THREE.Shape,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  tab: number,
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const nux = dy;
  const nuy = -dx;

  if (tab === 0) {
    shape.lineTo(x1, y1);
    return;
  }

  const radius = 0.16;
  const neck = 0.105;
  const offset = Math.sqrt(radius * radius - neck * neck);
  const t0 = 0.5 - neck;
  const t1 = 0.5 + neck;
  const sx = x0 + dx * t0;
  const sy = y0 + dy * t0;
  const ex = x0 + dx * t1;
  const ey = y0 + dy * t1;
  const cx = x0 + dx * 0.5 + nux * tab * offset;
  const cy = y0 + dy * 0.5 + nuy * tab * offset;
  const farX = cx + nux * tab * radius;
  const farY = cy + nuy * tab * radius;
  const startAngle = Math.atan2(sy - cy, sx - cx);
  const endAngle = Math.atan2(ey - cy, ex - cx);
  const farAngle = Math.atan2(farY - cy, farX - cx);
  const ccwHitsFar = angleOnArc(startAngle, farAngle, false)
    && angleOnArc(startAngle, endAngle, false)
    && normalizeDelta(startAngle, farAngle, false)
      < normalizeDelta(startAngle, endAngle, false);

  shape.lineTo(sx, sy);
  shape.absarc(cx, cy, radius, startAngle, endAngle, !ccwHitsFar);
  shape.lineTo(x1, y1);
}

function createPuzzleShape(tabs: [number, number, number, number]) {
  const shape = new THREE.Shape();
  const s = 0.5;

  shape.moveTo(-s, -s);
  drawPuzzleEdge(shape, -s, -s, s, -s, tabs[2]);
  drawPuzzleEdge(shape, s, -s, s, s, tabs[1]);
  drawPuzzleEdge(shape, s, s, -s, s, tabs[0]);
  drawPuzzleEdge(shape, -s, s, -s, -s, tabs[3]);
  shape.closePath();

  return shape;
}

const puzzleUVGenerator = {
  generateTopUV(
    _geometry: THREE.ExtrudeGeometry,
    vertices: number[],
    indexA: number,
    indexB: number,
    indexC: number,
  ) {
    const toUV = (index: number) =>
      new THREE.Vector2(
        vertices[index * 3] + 0.5,
        vertices[index * 3 + 1] + 0.5,
      );

    return [toUV(indexA), toUV(indexB), toUV(indexC)];
  },

  generateSideWallUV(
    _geometry: THREE.ExtrudeGeometry,
    vertices: number[],
    indexA: number,
    indexB: number,
    indexC: number,
    indexD: number,
  ) {
    const toUV = (index: number, useX: boolean) => {
      const x = vertices[index * 3];
      const y = vertices[index * 3 + 1];
      const z = vertices[index * 3 + 2];
      return new THREE.Vector2((useX ? x : y) + 0.5, 1 - (z + PUZZLE_DEPTH / 2));
    };

    const ax = vertices[indexA * 3];
    const bx = vertices[indexB * 3];
    const ay = vertices[indexA * 3 + 1];
    const by = vertices[indexB * 3 + 1];
    const useX = Math.abs(ay - by) < Math.abs(ax - bx);

    return [
      toUV(indexA, useX),
      toUV(indexB, useX),
      toUV(indexC, useX),
      toUV(indexD, useX),
    ];
  },
};

function createPuzzleGeometry(tabs: [number, number, number, number]) {
  const geometry = new THREE.ExtrudeGeometry(createPuzzleShape(tabs), {
    depth: PUZZLE_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.022,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 16,
    UVGenerator: puzzleUVGenerator,
  });

  geometry.translate(0, 0, -PUZZLE_DEPTH / 2);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

export const puzzleGeometries = PUZZLE_VARIANTS.map((tabs) =>
  createPuzzleGeometry(tabs),
);

export const PUZZLE_VARIANT_COUNT = puzzleGeometries.length;

/** 직선 가장자리에 붙는 원형 퍼즐 요철. 좌표는 px. */
function round(value: number) {
  return Math.round(value * 100) / 100;
}

function arc(
  radius: number,
  x: number,
  y: number,
  sweep: 0 | 1,
) {
  return `A ${round(radius)} ${round(radius)} 0 1 ${sweep} ${round(x)} ${round(y)}`;
}

export function createPuzzleClipPath(width: number, height: number) {
  const radius = Math.min(width, height) * 0.16;
  const outset = radius * 0.62;
  const neck = Math.sqrt(radius * radius - outset * outset);
  const margin = outset + radius;

  const top = margin;
  const left = margin;
  const right = width;
  const bottom = height;

  const topX = width * 0.5;
  const rightY = height * 0.5;
  const bottomX = width * 0.42;
  const leftY = height * 0.5;

  return `path('M ${round(left)} ${round(top)} H ${round(topX - neck)} ${arc(radius, topX + neck, top, 1)} H ${round(right)} V ${round(rightY - neck)} ${arc(radius, right, rightY + neck, 0)} V ${round(bottom)} H ${round(bottomX + neck)} ${arc(radius, bottomX - neck, bottom, 0)} H ${round(left)} V ${round(leftY + neck)} ${arc(radius, left, leftY - neck, 1)} Z')`;
}

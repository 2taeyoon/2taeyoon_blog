export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export const mapRange = (
  v: number,
  iMin: number,
  iMax: number,
  oMin: number,
  oMax: number
): number => oMin + ((v - iMin) / (iMax - iMin)) * (oMax - oMin);

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

export const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeOutQuart = (t: number): number =>
  1 - Math.pow(1 - t, 4);

export const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;

export const damp = (a: number, b: number, lambda: number, dt: number): number =>
  lerp(a, b, 1 - Math.exp(-lambda * dt));

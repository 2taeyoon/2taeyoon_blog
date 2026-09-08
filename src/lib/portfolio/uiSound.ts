export const uiSound = {
  musicOn: false,
  volume: 1,
};

const HOVER_SRC = "/audio/ui-hover.wav?v=2";
const THROTTLE_MS = 90;
const POOL_SIZE = 3;

let pool: HTMLAudioElement[] | null = null;
let cursor = 0;
let lastPlay = 0;

function getPool() {
  if (pool) return pool;
  pool = Array.from({ length: POOL_SIZE }, () => {
    const audio = new Audio(HOVER_SRC);
    audio.preload = "auto";
    return audio;
  });
  return pool;
}

export function playUiHover() {
  if (!uiSound.musicOn || typeof window === "undefined") return;
  if (window.matchMedia("(width <= 640px)").matches) return;

  const now = performance.now();
  if (now - lastPlay < THROTTLE_MS) return;
  lastPlay = now;

  const voices = getPool();
  const audio = voices[cursor % voices.length];
  cursor += 1;
  audio.volume = uiSound.volume;
  audio.currentTime = 0;
  void audio.play().catch(() => {
    // 자동재생 정책으로 막히면 무시
  });
}

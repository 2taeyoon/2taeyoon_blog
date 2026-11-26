"use client";

import { useEffect, useRef, useState } from "react";
import { SCENE_READY_EVENT, isSceneReady } from "@/lib/portfolio/sceneReady";
import { usePortfolioSessionStore } from "@/stores/usePortfolioSessionStore";

/** 로딩 화면이 최소한 보이는 시간. 너무 빨리 사라지면 깜빡이는 것처럼 보인다 */
const MIN_VISIBLE_MS = 1400;
/** 3D 장면 신호가 오지 않아도 이 시간이 지나면 들어간다 */
const MAX_WAIT_MS = 6000;
/** 화면이 위로 걷히는 시간. CSS의 clip-path 전환 시간과 같아야 한다 */
const EXIT_MS = 1000;
/** 마우스를 따라오는 알약 버튼의 따라붙는 정도 (0~1) */
const PILL_FOLLOW = 0.14;

export const ENTERED_CLASS = "pf_entered";

type Phase = "loading" | "leaving" | "done";

function usePillFollower(active: boolean) {
  const pillRef = useRef<HTMLButtonElement>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const pill = pillRef.current;
    if (!active || !pill) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const current = { x: window.innerWidth * 0.55, y: window.innerHeight * 0.46 };
    target.current = { ...current };
    let frame = 0;

    const render = () => {
      const t = reduced ? 1 : PILL_FOLLOW;
      current.x += (target.current.x - current.x) * t;
      current.y += (target.current.y - current.y) * t;
      const tilt = (target.current.x - current.x) * 0.04;
      pill.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      frame = window.requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY - 36 };
    };

    window.addEventListener("pointermove", onMove);
    frame = window.requestAnimationFrame(render);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, [active]);

  return pillRef;
}

/**
 * 첫 진입 로딩 화면. 밝은 화면 한가운데 이름·역할·로딩 상태를 한 줄로 두고,
 * 3D 장면이 준비되면 화면이 위로 걷히며 메인 히어로가 드러난다.
 */
export default function PortfolioLoader() {
  const [phase, setPhase] = useState<Phase>(() => (isSceneReady() ? "done" : "loading"));
  const musicEnabled = usePortfolioSessionStore((state) => state.musicEnabled);
  const setMusicEnabled = usePortfolioSessionStore((state) => state.setMusicEnabled);
  const pillRef = usePillFollower(phase === "loading");

  // 로딩이 걷히기 시작하면 히어로 문장이 올라오도록 html에 표시를 단다
  useEffect(() => {
    if (phase !== "loading") document.documentElement.classList.add(ENTERED_CLASS);
  }, [phase]);

  useEffect(() => () => document.documentElement.classList.remove(ENTERED_CLASS), []);

  useEffect(() => {
    if (phase !== "loading") return;

    const startedAt = performance.now();
    const timers: number[] = [];
    let left = false;

    const leave = () => {
      if (left) return;
      left = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt));
      timers.push(
        window.setTimeout(() => {
          setPhase("leaving");
          timers.push(window.setTimeout(() => setPhase("done"), EXIT_MS));
        }, wait),
      );
    };

    window.addEventListener(SCENE_READY_EVENT, leave);
    timers.push(window.setTimeout(leave, MAX_WAIT_MS));
    if (isSceneReady()) leave();

    return () => {
      window.removeEventListener(SCENE_READY_EVENT, leave);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
    // 로딩 중일 때 한 번만 등록한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`pf_loader is_${phase}`} role="status" aria-live="polite">
      <div className="pf_loader_row">
        <span className="pf_loader_name">2taeyoon</span>
        <span className="pf_loader_role">Frontend · Backend Developer</span>
        <span className="pf_loader_status">
          <span className="pf_loader_spinner" aria-hidden="true" />
          {phase === "leaving" ? "Ready" : "Assembling pieces"}
        </span>
      </div>

      <button
        ref={pillRef}
        type="button"
        className={`pf_loader_pill${musicEnabled ? " is_on" : ""}`}
        onClick={() => setMusicEnabled(!musicEnabled)}
        aria-pressed={musicEnabled}
      >
        <span>{musicEnabled ? "Sound" : "Click"}</span>
        <span className="pf_loader_pill_dash" aria-hidden="true" />
        <span>{musicEnabled ? "On" : "To enable sound"}</span>
      </button>
    </div>
  );
}

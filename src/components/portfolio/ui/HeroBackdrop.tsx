"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createHeroFluid, heroThemeFromColor, type HeroFluid } from "@/lib/portfolio/heroFluid";
import { HERO_IMAGE } from "@/lib/portfolio/heroImage";
import { mainExit, mainRenderState } from "@/lib/portfolio/pointerState";
import { markSceneReady } from "@/lib/portfolio/sceneReady";
import { usePortfolioSessionStore } from "@/stores/usePortfolioSessionStore";

/** 공기 중에 떠다니는 먼지 개수 */
const DUST_COUNT = 28;

/** 매번 같은 자리에 먼지가 생기도록 고정된 값으로 흩뿌린다 */
const DUST = Array.from({ length: DUST_COUNT }, (_, index) => {
  const seed = Math.sin(index * 12.9898) * 43758.5453;
  const random = (offset: number) => {
    const value = Math.sin(seed + offset) * 10000;
    return value - Math.floor(value);
  };
  return {
    left: `${(random(1) * 100).toFixed(2)}%`,
    top: `${(random(2) * 100).toFixed(2)}%`,
    size: `${(1 + random(3) * 2.4).toFixed(2)}px`,
    duration: `${(14 + random(4) * 16).toFixed(2)}s`,
    delay: `${(-random(5) * 20).toFixed(2)}s`,
  };
});

/**
 * 메인 첫 화면 배경. 직접 만든 작업실 그림(꽃송이 없는 꽃대)을 WebGL로 그려
 * 마우스가 지나간 자리에 물결이 흐르게 하고, 남색 부분은 Theme Color에 맞춰 색을 바꾼다.
 * 꽃송이는 그 위 Canvas의 퍼즐 조각이 모여서 만든다.
 * WebGL을 못 쓰는 환경에서는 아래 깔린 이미지가 그대로 보인다.
 */
export default function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<HeroFluid | null>(null);
  const themeColor = usePortfolioSessionStore((state) => state.themeColor);
  const themeRef = useRef(themeColor);
  themeRef.current = themeColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let fluid: HeroFluid;
    try {
      fluid = createHeroFluid(canvas, () => {
        canvas.classList.add("is_ready");
        markSceneReady();
      });
    } catch {
      markSceneReady();
      return;
    }
    fluid.setTheme(heroThemeFromColor(themeRef.current));
    fluidRef.current = fluid;

    const unsubscribe = mainRenderState.subscribe(() => fluid.setExit(mainExit.progress));
    return () => {
      unsubscribe();
      fluid.dispose();
      fluidRef.current = null;
    };
  }, []);

  useEffect(() => {
    fluidRef.current?.setTheme(heroThemeFromColor(themeColor));
  }, [themeColor]);

  return (
    <div className="hero_backdrop" aria-hidden="true">
      <div className="hero_backdrop_image">
        <Image src={HERO_IMAGE.src} alt="" fill priority sizes="100vw" />
      </div>
      <canvas ref={canvasRef} className="hero_backdrop_canvas" />
      <div className="hero_backdrop_dust">
        {DUST.map((dust, index) => (
          <span
            key={index}
            style={{
              left: dust.left,
              top: dust.top,
              width: dust.size,
              height: dust.size,
              animationDuration: dust.duration,
              animationDelay: dust.delay,
            }}
          />
        ))}
      </div>
      <div className="hero_backdrop_shade" />
    </div>
  );
}

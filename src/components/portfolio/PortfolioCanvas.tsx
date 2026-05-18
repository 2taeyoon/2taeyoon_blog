"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  hue: number; pulse: number; pulseSpeed: number;
}

const N = 160;
const CONNECT_DIST = 115;
const REPEL_RADIUS = 140;
const REPEL_STR = 0.65;
const SPEED_CAP = 2.6;

function mkP(W: number, H: number): Particle {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    size: Math.random() * 1.6 + 0.6,
    opacity: Math.random() * 0.52 + 0.22,
    hue: 190 + Math.random() * 90,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.016 + Math.random() * 0.022,
  };
}

export default function PortfolioCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ps = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafId = useRef<number>(0);

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    ps.current = Array.from({ length: N }, () => mkP(c.width, c.height));
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const W = c.width;
    const H = c.height;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // Fade trail — low-alpha fill creates glowing trails
    ctx.fillStyle = "rgba(3, 3, 14, 0.15)";
    ctx.fillRect(0, 0, W, H);

    // Ambient nebula glow at viewport center
    const cg = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, W * 0.52);
    cg.addColorStop(0, "rgba(90, 45, 185, 0.055)");
    cg.addColorStop(0.55, "rgba(20, 175, 220, 0.025)");
    cg.addColorStop(1, "transparent");
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, W, H);

    const arr = ps.current;

    // Update physics
    for (const p of arr) {
      p.pulse += p.pulseSpeed;

      const dx = p.x - mx;
      const dy = p.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 0) {
        const dist = Math.sqrt(d2);
        const f = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STR;
        p.vx += (dx / dist) * f;
        p.vy += (dy / dist) * f;
      }

      p.vx *= 0.968;
      p.vy *= 0.968;
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > SPEED_CAP) { p.vx = (p.vx / spd) * SPEED_CAP; p.vy = (p.vy / spd) * SPEED_CAP; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < -8) p.x += W + 16; else if (p.x > W + 8) p.x -= W + 16;
      if (p.y < -8) p.y += H + 16; else if (p.y > H + 8) p.y -= H + 16;
    }

    // Connection lines
    ctx.lineWidth = 0.5;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const dx = arr[i].x - arr[j].x;
        const dy = arr[i].y - arr[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < CONNECT_DIST * CONNECT_DIST) {
          const t = 1 - Math.sqrt(d2) / CONNECT_DIST;
          const hue = (arr[i].hue + arr[j].hue) * 0.5;
          ctx.beginPath();
          ctx.moveTo(arr[i].x, arr[i].y);
          ctx.lineTo(arr[j].x, arr[j].y);
          ctx.strokeStyle = `hsla(${hue}, 70%, 65%, ${t * 0.32})`;
          ctx.stroke();
        }
      }
    }

    // Mouse repel indicator
    if (mx > -200) {
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, REPEL_RADIUS);
      mg.addColorStop(0, "rgba(160, 70, 255, 0.045)");
      mg.addColorStop(0.6, "rgba(40, 200, 235, 0.018)");
      mg.addColorStop(1, "transparent");
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(mx, my, REPEL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    // Particles with glow
    for (const p of arr) {
      const alpha = p.opacity * (0.85 + 0.15 * Math.sin(p.pulse));
      ctx.shadowBlur = 11;
      ctx.shadowColor = `hsla(${p.hue}, 85%, 72%, 0.9)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 88%, 78%, ${alpha})`;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    rafId.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onTouch = (e: TouchEvent) => {
      mouse.current.x = e.touches[0].clientX;
      mouse.current.y = e.touches[0].clientY;
    };
    const onResize = () => resize();
    resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    rafId.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(rafId.current);
    };
  }, [resize, draw]);

  return <canvas ref={canvasRef} className="pf-bg-canvas" aria-hidden="true" />;
}

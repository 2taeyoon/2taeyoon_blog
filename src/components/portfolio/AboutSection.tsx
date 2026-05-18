"use client";

import React, { useEffect, useRef } from "react";
import { useIntersection } from "@/hooks/useIntersection";

const STATS = [
  { value: "3+", label: "Years Experience" },
  { value: "40+", label: "Projects Shipped" },
  { value: "15+", label: "Technologies" },
  { value: "∞", label: "Curiosity" },
];

export default function AboutSection() {
  const sectionRef = useIntersection<HTMLElement>({ threshold: 0.1 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.008;

      // Flowing sine lines
      for (let row = 0; row < 8; row++) {
        const y0 = (row / 7) * H;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const wave = Math.sin(x * 0.012 + t + row * 0.7) * 18;
          const y = y0 + wave;
          if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
        const alpha = 0.04 + Math.sin(t + row) * 0.02;
        ctx.strokeStyle = `rgba(100, 80, 220, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="pf-about reveal-section">
      <canvas ref={canvasRef} className="pf-about__canvas" aria-hidden="true" />

      <div className="pf-about__inner">
        {/* Left */}
        <div className="pf-about__left">
          <p className="pf-section-label reveal-item">About Me</p>
          <h2 className="pf-section-title reveal-item">
            Building the web&apos;s
            <br />
            <em>next dimension.</em>
          </h2>
          <p className="pf-about__bio reveal-item">
            I&apos;m a frontend developer obsessed with the intersection of design and
            engineering. I build high-performance, visually striking web experiences
            using modern JavaScript, Canvas API, and WebGL.
          </p>
          <p className="pf-about__bio reveal-item">
            From pixel-perfect UI to real-time 3D rendering, I craft every detail
            with intention. Clean code meets bold visual storytelling.
          </p>
          <a href="#projects" className="pf-about__link reveal-item">
            See My Work
            <svg viewBox="0 0 20 10" fill="none" aria-hidden="true">
              <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Right */}
        <div className="pf-about__right">
          <div className="pf-about__stats">
            {STATS.map(({ value, label }) => (
              <div key={label} className="pf-about__stat reveal-item">
                <span className="pf-about__stat-value">{value}</span>
                <span className="pf-about__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

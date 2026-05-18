"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import { useIntersection } from "@/hooks/useIntersection";

const PROJECTS = [
  {
    num: "01",
    name: "Interactive Portfolio",
    desc: "A cinematic, canvas-driven portfolio site with particle physics, custom cursor, and scroll-driven storytelling. Built for maximum visual impact.",
    tech: ["Next.js", "Canvas API", "TypeScript", "GSAP"],
    role: "Frontend / Creative",
    color: "#7c3aed",
    accentColor: "#a78bfa",
    href: "#",
  },
  {
    num: "02",
    name: "3D Data Visualizer",
    desc: "Real-time 3D graph visualization of complex datasets using WebGL and Three.js. Supports 100k+ nodes with GPU-accelerated rendering.",
    tech: ["Three.js", "WebGL", "React", "D3.js"],
    role: "Frontend / WebGL",
    color: "#0891b2",
    accentColor: "#22d3ee",
    href: "#",
  },
  {
    num: "03",
    name: "Motion Design System",
    desc: "A comprehensive design system with 60fps animations, micro-interactions, and accessible motion tokens. Used across 5 production products.",
    tech: ["React", "CSS", "GSAP", "Storybook"],
    role: "Design / Engineering",
    color: "#be185d",
    accentColor: "#f472b6",
    href: "#",
  },
  {
    num: "04",
    name: "Generative Art Engine",
    desc: "A browser-based generative art platform that uses noise algorithms and canvas to create unique, printable artworks. 10k+ artworks generated.",
    tech: ["Canvas API", "TypeScript", "Vite", "Perlin Noise"],
    role: "Creative Coding",
    color: "#065f46",
    accentColor: "#34d399",
    href: "#",
  },
];

export default function ProjectsSection() {
  const sectionRef = useIntersection<HTMLElement>({ threshold: 0.05 });

  return (
    <section id="projects" ref={sectionRef} className="pf-projects reveal-section">
      <div className="pf-projects__header">
        <p className="pf-section-label reveal-item">Selected Work</p>
        <h2 className="pf-section-title reveal-item">
          Projects that
          <br />
          <em>define craft.</em>
        </h2>
        <p className="pf-projects__hint reveal-item">Swipe to explore →</p>
      </div>

      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        freeMode={{ enabled: true, momentum: true, momentumRatio: 0.5 }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        spaceBetween={24}
        grabCursor
        className="pf-projects__swiper"
      >
        {PROJECTS.map((project, i) => (
          <SwiperSlide key={project.num} className="pf-projects__slide">
            <article
              className="pf-project-card reveal-item"
              style={
                {
                  "--project-color": project.color,
                  "--project-accent": project.accentColor,
                  "--reveal-delay": `${i * 0.1}s`,
                } as React.CSSProperties
              }
            >
              <div className="pf-project-card__glow" aria-hidden="true" />
              <div className="pf-project-card__top">
                <span className="pf-project-card__num">{project.num}</span>
                <span className="pf-project-card__role">{project.role}</span>
              </div>

              <div className="pf-project-card__body">
                <h3 className="pf-project-card__name">{project.name}</h3>
                <p className="pf-project-card__desc">{project.desc}</p>
              </div>

              <div className="pf-project-card__bottom">
                <ul className="pf-project-card__tech">
                  {project.tech.map((t) => (<li key={t}>{t}</li>))}
                </ul>
                <a href={project.href} className="pf-project-card__link">
                  View
                  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 12 L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

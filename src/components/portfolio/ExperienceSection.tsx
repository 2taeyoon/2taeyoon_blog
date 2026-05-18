"use client";

import React, { useEffect, useRef } from "react";
import { useIntersection } from "@/hooks/useIntersection";

const EXPERIENCE = [
  {
    period: "2023 — Present",
    role: "Senior Frontend Developer",
    company: "Creative Studio X",
    companyUrl: "#",
    type: "Full-time",
    desc: "Leading frontend architecture for immersive web products. Implemented canvas-based interactive experiences that reduced bounce rate by 40%. Mentoring a team of 4 engineers.",
    stack: ["Next.js", "TypeScript", "Three.js", "GSAP", "Canvas API"],
  },
  {
    period: "2021 — 2023",
    role: "UI/UX Engineer",
    company: "Digital Agency Y",
    companyUrl: "#",
    type: "Full-time",
    desc: "Built award-winning campaign sites for global brands. Specialized in motion design systems, WebGL shaders, and performance-critical animations at 60fps.",
    stack: ["React", "SCSS", "WebGL", "GSAP", "Figma"],
  },
  {
    period: "2020 — 2021",
    role: "Frontend Developer",
    company: "Startup Z",
    companyUrl: "#",
    type: "Full-time",
    desc: "Developed core UI components for a SaaS dashboard. Reduced bundle size by 55% through code splitting and lazy loading strategies.",
    stack: ["Vue.js", "TypeScript", "CSS Modules", "Webpack"],
  },
  {
    period: "2019 — 2020",
    role: "Freelance Developer",
    company: "Independent",
    companyUrl: "#",
    type: "Freelance",
    desc: "Delivered custom websites and interactive experiences for 12+ clients. Focused on creative, performant frontends for portfolio and marketing sites.",
    stack: ["HTML/CSS/JS", "React", "GSAP", "WordPress"],
  },
];

export default function ExperienceSection() {
  const sectionRef = useIntersection<HTMLElement>({ threshold: 0.05 });
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((item, i) => {
      if (!item) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                item.classList.add("is-active");
              }, i * 100);
            }
          });
        },
        { threshold: 0.3 }
      );
      obs.observe(item);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="pf-experience reveal-section">
      <div className="pf-experience__inner">
        <div className="pf-experience__header">
          <p className="pf-section-label reveal-item">Career Path</p>
          <h2 className="pf-section-title reveal-item">
            Experience that
            <br />
            <em>shapes mastery.</em>
          </h2>
        </div>

        <div className="pf-experience__body">
          <div className="pf-timeline">
            <ul className="pf-timeline__list">
              {EXPERIENCE.map((item, i) => (
                <li
                  key={item.period}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  className="pf-timeline__item"
                >
                  <div className="pf-timeline__content">
                    <div className="pf-timeline__meta">
                      <span className="pf-timeline__period">{item.period}</span>
                      <span className="pf-timeline__type">{item.type}</span>
                    </div>
                    <h3 className="pf-timeline__role">{item.role}</h3>
                    <a href={item.companyUrl} className="pf-timeline__company">
                      {item.company}
                      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </a>
                    <p className="pf-timeline__desc">{item.desc}</p>
                    <ul className="pf-timeline__stack">
                      {item.stack.map((s) => (<li key={s}>{s}</li>))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { useIntersection } from "@/hooks/useIntersection";

const SKILLS = [
  {
    name: "JavaScript",
    category: "Language",
    level: 95,
    color: "#f7df1e",
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="3" fill="#f7df1e" />
        <path d="M10 22.5c.5 1.2 1.4 2 3 2 1.5 0 2.5-.75 2.5-2.3V13h-2.5v9c0 .7-.3 1-1 1-.6 0-1-.4-1.3-1L10 22.5zm8.5-.3c.6 1.5 1.8 2.3 3.8 2.3 2 0 3.4-.9 3.4-2.8 0-1.7-1-2.4-2.8-3.1l-.5-.2c-.9-.4-1.3-.7-1.3-1.3 0-.5.4-.9 1.1-.9.7 0 1.1.3 1.5 1L25 16c-.7-1.4-1.7-1.9-3.2-1.9-2 0-3.2 1.1-3.2 2.7 0 1.6 1 2.4 2.6 3l.5.2c1 .4 1.5.7 1.5 1.4 0 .6-.5 1.1-1.3 1.1-.9 0-1.5-.5-1.9-1.3L18.5 22.2z" fill="#000" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    category: "Language",
    level: 90,
    color: "#3178c6",
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="3" fill="#3178c6" />
        <path d="M8 14h16M14 9v18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 17c0-1.7 1.3-3 3-3s3 1.3 3 3v2c0 1.7-1.3 3-3 3s-3-1.3-3-3v-2z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: "React",
    category: "Framework",
    level: 92,
    color: "#61dafb",
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="16" rx="4" ry="4" fill="#61dafb" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61dafb" strokeWidth="1.5" fill="none" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    category: "Framework",
    level: 90,
    color: "#ffffff",
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#000" stroke="#fff" strokeWidth="1" />
        <path d="M10 22V10l14 14V10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Canvas API",
    category: "Web API",
    level: 88,
    color: "#a855f7",
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="3" y="3" width="26" height="26" rx="3" stroke="#a855f7" strokeWidth="1.5" />
        <path d="M8 22 Q12 12 16 18 Q20 24 24 10" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    name: "Three.js",
    category: "3D / WebGL",
    level: 78,
    color: "#06b6d4",
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 28,26 4,26" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
        <polygon points="16,10 22,22 10,22" stroke="#06b6d4" strokeWidth="1" fill="#06b6d420" />
      </svg>
    ),
  },
  {
    name: "CSS / SCSS",
    category: "Styling",
    level: 96,
    color: "#e879f9",
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M4 4 L6 28 L16 31 L26 28 L28 4Z" fill="#e879f920" stroke="#e879f9" strokeWidth="1.5" />
        <path d="M10 12h12M10 17l.5 7L16 25.5 21.5 24l.5-7M9 12l.5-4h13l.5 4" stroke="#e879f9" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    category: "Backend",
    level: 75,
    color: "#4ade80",
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M16 3 L27 9.5v13L16 29 5 22.5V9.5z" stroke="#4ade80" strokeWidth="1.5" fill="none" />
        <path d="M16 9v14M11 12l5 3 5-3M11 20l5-3 5 3" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function SkillsSection() {
  const sectionRef = useIntersection<HTMLElement>({ threshold: 0.05 });
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    cardsRef.current.forEach((card) => {
      if (!card) return;

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.04)`;
        card.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
        card.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
        card.classList.add("is-tilted");
      };

      const onLeave = () => {
        card.style.transform = "";
        card.classList.remove("is-tilted");
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="pf-skills reveal-section">
      <div className="pf-skills__inner">
        <div className="pf-skills__header">
          <p className="pf-section-label reveal-item">Expertise</p>
          <h2 className="pf-section-title reveal-item">
            Tools I wield
            <br />
            <em>with precision.</em>
          </h2>
        </div>

        <div className="pf-skills__grid">
          {SKILLS.map((skill, i) => (
            <div
              key={skill.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="pf-skill-card reveal-item"
              style={{ "--skill-color": skill.color, "--reveal-delay": `${i * 0.07}s` } as React.CSSProperties}
            >
              <div className="pf-skill-card__shine" aria-hidden="true" />
              <div className="pf-skill-card__icon">{skill.icon}</div>
              <div className="pf-skill-card__info">
                <span className="pf-skill-card__category">{skill.category}</span>
                <h3 className="pf-skill-card__name">{skill.name}</h3>
              </div>
              <div className="pf-skill-card__bar-wrap">
                <div
                  className="pf-skill-card__bar"
                  style={{ "--bar-width": `${skill.level}%` } as React.CSSProperties}
                />
              </div>
              <span className="pf-skill-card__level">{skill.level}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectSection from "@/components/portfolio/ProjectSection";
import MainSection from "@/components/portfolio/MainSection";
import { mainExit } from "@/lib/portfolio/pointerState";

function applyScrollProgress(progress: number, sections: HTMLElement | null, project: HTMLDivElement | null) {
  mainExit.progress = progress;
  sections?.style.setProperty("--main-exit", String(progress));
  sections?.style.setProperty("--project-enter", String(progress));
  project?.classList.toggle("is_ready", progress >= 0.92);
}

export default function PortfolioSections() {
  const sectionsRef = useRef<HTMLElement>(null);
  const projectLayerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: sectionsRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            applyScrollProgress(self.progress, sectionsRef.current, projectLayerRef.current);
          },
        });
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        applyScrollProgress(0, sectionsRef.current, projectLayerRef.current);
      });
    }, sectionsRef);

    return () => {
      applyScrollProgress(0, sectionsRef.current, projectLayerRef.current);
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionsRef} className="portfolio_sections">
      <div className="portfolio_main_layer">
        <MainSection />
      </div>
      <div ref={projectLayerRef} className="portfolio_project_layer">
        <ProjectSection />
      </div>
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectSection from "@/components/portfolio/ProjectSection";
import MainSection from "@/components/portfolio/MainSection";
import { mainExit } from "@/lib/portfolio/pointerState";

function applyScrollProgress(progress: number, sections: HTMLElement | null, project: HTMLDivElement | null) {
  const next = progress < 0.02 ? 0 : progress;
  mainExit.progress = next;
  sections?.style.setProperty("--main-exit", String(next));
  sections?.style.setProperty("--project-enter", String(next));
  project?.classList.toggle("is_ready", next >= 0.92);
}

function resetScrollTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function PortfolioSections() {
  const sectionsRef = useRef<HTMLElement>(null);
  const projectLayerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const previousRestoration = history.scrollRestoration;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    resetScrollTop();

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

    const pinTop = () => {
      resetScrollTop();
      applyScrollProgress(0, sectionsRef.current, projectLayerRef.current);
      ScrollTrigger.refresh();
    };

    const frame = window.requestAnimationFrame(pinTop);
    const timer = window.setTimeout(pinTop, 80);
    window.addEventListener("pageshow", pinTop);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("pageshow", pinTop);
      if ("scrollRestoration" in history) {
        history.scrollRestoration = previousRestoration;
      }
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

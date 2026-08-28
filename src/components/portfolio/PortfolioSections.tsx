"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectSection from "@/components/portfolio/ProjectSection";
import MainSection from "@/components/portfolio/MainSection";

export default function PortfolioSections() {
  const sectionsRef = useRef<HTMLElement>(null);
  const projectLayerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          projectLayerRef.current,
          {
            "--project-edge-feather": "96px",
          },
          {
            "--project-edge-feather": "0px",
            ease: "none",
            scrollTrigger: {
              trigger: sectionsRef.current,
              start: "top top",
              end: "+=114%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(projectLayerRef.current, {
          clearProps: "all",
        });
      });
    }, sectionsRef);

    return () => {
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

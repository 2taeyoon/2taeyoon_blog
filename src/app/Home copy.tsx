"use client";

import React from "react";
import { useLenis } from "@/hooks/useLenis";
import PortfolioCanvas from "@/components/portfolio/PortfolioCanvas";
import CustomCursor from "@/components/portfolio/CustomCursor";
import PortfolioNav from "@/components/portfolio/PortfolioNav";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ContactSection from "@/components/portfolio/ContactSection";
import "@/styles/pages/portfolio.css";

export default function Home() {
  useLenis();

  return (
    <main className="pf-root">
      <PortfolioCanvas />
      <div className="pf-page-wrap">
        <CustomCursor />
        <PortfolioNav />
				
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </div>
    </main>
  );
}

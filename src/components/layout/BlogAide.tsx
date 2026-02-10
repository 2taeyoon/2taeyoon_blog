"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const MENU_SECTIONS = [
  {
    id: "study",
    title: "STUDY",
    items: ["Dashboard", "Leaderboard", "Monitoring", "Analytics", "Message", "Settings"],
  },
  {
    id: "company",
    title: "COMPANY",
    items: ["Dashboard", "Leaderboard", "Monitoring", "Analytics", "Message", "Settings"],
  },
] as const;

export default function BlogAide() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      MENU_SECTIONS.reduce<Record<string, boolean>>((acc, section) => {
        acc[section.id] = true; // 초기 렌더 시 모든 섹션 열림
        return acc;
      }, {})
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;

    const handleResize = () => {
      const mobile = window.matchMedia("(max-width: 640px)").matches;
      setIsMobile(mobile);

      if (mobile) {
        layoutRoot?.classList.remove("open");
      } else {
        layoutRoot?.classList.add("open");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleOpen = () => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
    layoutRoot?.classList.toggle("open");
  };

  const handleToggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <aside className="blog_aide_sidebar" style={isMobile ? { display: "none" } : undefined}>
      <div className="blog_aide_inner">
        <div className="blog_aide_header">
          <Image src="/favicon/favicon-48x48.png" className="blog_aide_logo" alt="로고" width={40} height={40} unoptimized />
          <h1>2taeyoon</h1>
          <button className="blog_aide_toggle" type="button" onClick={toggleOpen} aria-label="open/close">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
              <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path>
            </svg>
          </button>
        </div>

        <div className="blog_aide_menu_list">
					{MENU_SECTIONS.map((section) => {
						const isOpen = !!openSections[section.id];

						return (
							<nav key={section.id} className="blog_aide_menu" aria-label={section.title}>
								<a
									href="#"
									className="blog_aide_menu_wrap"
									onClick={(e) => {
										e.preventDefault();
										handleToggleSection(section.id);
									}}
									aria-expanded={isOpen}
								>
									<div className="blog_aide_menu_title">{section.title}</div>
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
										<path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
									</svg>
								</a>

								{isOpen &&
									section.items.map((label, index) => (
										<a key={label} href="#" className="blog_aide_menu_button">
											<span>{index + 1}</span>
											<p>{label}</p>
										</a>
									))}
							</nav>
						);
					})}
				</div>
      </div>
    </aside>
  );
}

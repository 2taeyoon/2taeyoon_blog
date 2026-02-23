// 블로그 사이드바 컴포넌트 - 화면 왼쪽에 고정된 메뉴
"use client";

import React from "react";
import { MENU_SECTIONS } from "@/data/menuSections";
import { usePathActive } from "@/hooks/usePathActive";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useAccordion } from "@/hooks/useAccordion";
import BlogAideHeader from "@/components/layout/BlogAideHeader";
import BlogAideMenu from "@/components/layout/BlogAideMenu";

export default function BlogAide() {
  const { isPathActive } = usePathActive();
  const { handleClose, handleOpen } = useSidebarToggle();
  const { isMobile } = useMobileDetection();
  const { isOpen, toggleSection } = useAccordion(MENU_SECTIONS);

  return (
    <aside className="blog_aide_sidebar" style={isMobile ? { display: "none" } : undefined}>
      <div className="blog_aide_inner">
        <BlogAideHeader onClose={handleClose} />
        <BlogAideMenu
          sections={MENU_SECTIONS}
          isPathActive={isPathActive}
          isOpen={isOpen}
          onToggleSection={toggleSection}
        />
        {/* 사이드바 숨김 상태에서 왼쪽 가장자리 클릭 영역 */}
        <div className="blog_aide_bar" onClick={handleOpen}></div>
      </div>
    </aside>
  );
}

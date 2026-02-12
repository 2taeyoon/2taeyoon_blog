// 블로그 사이드바 컴포넌트 - 화면 왼쪽에 고정된 메뉴
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuSection } from "@/types/props.types";

// 메뉴 데이터
const MENU_SECTIONS: MenuSection[] = [
  {
    id: "study",
    title: "STUDY",
    items: [
      { label: "Design", href: "/ds" },
      { label: "Frontend", href: "/fs" },
      { label: "Backend", href: "/bs" },
    ],
    type: "withButtons",
  },
  {
    id: "insight",
    title: "INSIGHT",
    href: "/in",
    type: "linkOnly",
  },
];

export default function BlogAide() {
  // 현재 페이지 주소
  const pathname = usePathname();
  
  // 브라우저 로드 완료 여부 (Hydration 에러 방지용)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 현재 페이지가 특정 링크와 일치하는지 확인
  const isPathActive = (href: string) => {
    if (!isMounted) return false;
    if (!pathname) return false;
    if (pathname === href) return true;
    return pathname.startsWith(href + "/");
  };
  // 각 섹션의 열림/닫힘 상태 (아코디언 기능)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      MENU_SECTIONS.reduce<Record<string, boolean>>((acc, section) => {
        // 하위 버튼이 있는 섹션만 처음에 열림
        if (section.type === "withButtons") {
          acc[section.id] = true;
        }
        return acc;
      }, {})
  );
  
  // 모바일 여부
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 변경 감지 (모바일/데스크톱 전환)
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

  // 사이드바 닫기
  const handleClose = () => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
    layoutRoot?.classList.add("close");
  };

  // 사이드바 열기
  const handleOpen = () => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
    layoutRoot?.classList.remove("close");
  };

  // 섹션 열기/닫기 (아코디언)
  const handleToggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <aside className="blog_aide_sidebar" style={isMobile ? { display: "none" } : undefined}>
      <div className="blog_aide_inner">
        {/* 헤더: 로고, 제목, 닫기 버튼 */}
        <div className="blog_aide_header">
          <Image 
            src="/favicon/favicon-48x48.png" 
            className="blog_aide_logo" 
            alt="로고" 
            width={40} 
            height={40} 
            unoptimized 
          />
          <h1>2taeyoon</h1>
          <button 
            className="blog_aide_toggle" 
            type="button" 
            onClick={handleClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
              <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path>
            </svg>
          </button>
        </div>

        {/* 메뉴 목록 */}
        <div className="blog_aide_menu_list" suppressHydrationWarning>
					{MENU_SECTIONS.map((section) => {
						// linkOnly 타입: 단순 링크 (INSIGHT)
						if (section.type === "linkOnly") {
							const isActive = isPathActive(section.href);
							
							return (
								<nav key={section.id} className="blog_aide_menu">
									<a
										href={section.href}
										className={`blog_aide_menu_category${isActive ? " active" : ""}`}
										suppressHydrationWarning
									>
										<div className="blog_aide_menu_title">{section.title}</div>
									</a>
								</nav>
							);
						}

						// withButtons 타입: 하위 메뉴 있음 (STUDY)
						const isOpen = !!openSections[section.id];
						const hasActiveItem = section.items.some((item) => isPathActive(item.href));
						const categoryActive = hasActiveItem || isPathActive("/study");

						return (
							<nav key={section.id} className="blog_aide_menu">
								<a
									href="#"
									className={`blog_aide_menu_category${categoryActive ? " active" : ""}`}
									onClick={(e) => {
										e.preventDefault();
										handleToggleSection(section.id);
									}}
									suppressHydrationWarning
								>
									<div className="blog_aide_menu_title">{section.title}</div>
									{/* 아코디언 열림 상태에 따라 화살표 회전 */}
									<svg 
										xmlns="http://www.w3.org/2000/svg" 
										width="32" 
										height="32" 
										viewBox="0 0 256 256"
										className={isOpen ? "rotated" : ""}
									>
										<path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
									</svg>
								</a>

								{/* 하위 메뉴 버튼들 */}
								{isOpen &&
									section.items.map((item, index) => {
										const isActive = isPathActive(item.href);
										
										return (
											<a
												key={item.label}
												href={item.href}
												className={`blog_aide_menu_button${isActive ? " active" : ""}`}
												suppressHydrationWarning
											>
												<span>{index + 1}</span>
												<p>{item.label}</p>
											</a>
										);
									})}
							</nav>
						);
					})}
				</div>
        {/* 사이드바 숨김 상태에서 왼쪽 가장자리 클릭 영역 */}
				<div className="blog_aide_bar" onClick={handleOpen}></div>
      </div>
    </aside>
  );
}

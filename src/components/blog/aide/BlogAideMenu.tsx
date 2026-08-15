import Link from "next/link";
import { MenuSection } from "@/types/blog/menu.types";

function closeMobileSidebar() {
  if (typeof document === "undefined") return;

  const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
  if (!layoutRoot) return;

  // 모바일에서만 open/close 제거
  if (window.matchMedia("(max-width: 768px)").matches) {
    layoutRoot.classList.remove("open");
    layoutRoot.classList.remove("close");
  }
}

interface BlogAideMenuProps {
  sections: MenuSection[];
  isPathActive: (href: string, exact?: boolean) => boolean;
  isOpen: (sectionId: string) => boolean;
  onToggleSection: (sectionId: string) => void;
}

export default function BlogAideMenu({
  sections,
  isPathActive,
  isOpen,
  onToggleSection,
}: BlogAideMenuProps) {
  return (
    <div className="blog_aide_menu_list" suppressHydrationWarning>
      {sections.map((section) => {
        // linkOnly 타입: 단순 링크 (INSIGHT)
        if (section.type === "linkOnly") {
          const active = isPathActive(section.href, section.exact);

          return (
            <nav key={section.id} className="blog_aide_menu">
              <div className={`blog_aide_menu_category${active ? " active" : ""}`}>
                <Link href={section.href} className="blog_aide_menu_title" suppressHydrationWarning onClick={closeMobileSidebar}>
                  <span className="menu_title">{section.title}</span>
                  {section.count != null && <span className="menu_count">{section.count}</span>}
                </Link>
              </div>
            </nav>
          );
        }

        // withButtons 타입: 하위 메뉴 있음 (STUDY)
        const sectionOpen = isOpen(section.id);
        const hasActiveItem = section.items.some((item) => isPathActive(item.href));
        const categoryActive = hasActiveItem || isPathActive("/blog");

        return (
          <nav key={section.id} className="blog_aide_menu">
            <div className={`blog_aide_menu_category${categoryActive ? " active" : ""}`}>
              <Link href="/blog" className="blog_aide_menu_title" suppressHydrationWarning onClick={closeMobileSidebar}>
                <span className="menu_title">{section.title}</span>
								<span className="menu_count_wrap">
									{section.count != null && <span className="menu_count">{section.count}</span>}
									{/* 아코디언 열림 상태에 따라 화살표 회전 */}
									<div className="menu_arrow_wrap" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSection(section.id); }}
										style={{ cursor: "pointer" }}>
										<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" className={sectionOpen ? "rotated" : ""}>
											<path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
										</svg>
									</div>
								</span>
              </Link>
            </div>

            {/* 하위 메뉴 버튼들 */}
            {sectionOpen &&
              section.items.map((item) => {
                const active = isPathActive(item.href);
                
                return (
                  <div key={item.label} className={`blog_aide_menu_button${active ? " active" : ""}`}>
                    <p>
                      <Link href={item.href} suppressHydrationWarning onClick={closeMobileSidebar}>
                        <span className="menu_title">{item.label}</span>
												{item.count != null && <span className="menu_count">{item.count}</span>}
                      </Link>
                    </p>
                  </div>
                );
              })}
          </nav>
        );
      })}
    </div>
  );
}

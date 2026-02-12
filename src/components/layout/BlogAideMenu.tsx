import { MenuSection } from "@/types/props.types";

interface BlogAideMenuProps {
  sections: MenuSection[];
  isPathActive: (href: string) => boolean;
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
          const active = isPathActive(section.href);
          
          return (
            <nav key={section.id} className="blog_aide_menu">
              <a
                href={section.href}
                className={`blog_aide_menu_category${active ? " active" : ""}`}
                suppressHydrationWarning
              >
                <div className="blog_aide_menu_title">{section.title}</div>
              </a>
            </nav>
          );
        }

        // withButtons 타입: 하위 메뉴 있음 (STUDY)
        const sectionOpen = isOpen(section.id);
        const hasActiveItem = section.items.some((item) => isPathActive(item.href));
        const categoryActive = hasActiveItem || isPathActive("/study");

        return (
          <nav key={section.id} className="blog_aide_menu">
            <a
              href="#"
              className={`blog_aide_menu_category${categoryActive ? " active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                onToggleSection(section.id);
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
                className={sectionOpen ? "rotated" : ""}
              >
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </a>

            {/* 하위 메뉴 버튼들 */}
            {sectionOpen &&
              section.items.map((item, index) => {
                const active = isPathActive(item.href);
                
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`blog_aide_menu_button${active ? " active" : ""}`}
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
  );
}

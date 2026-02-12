import { useState } from "react";
import { MenuSection } from "@/types/props.types";

/**
 * 아코디언 메뉴의 열림/닫힘 상태를 관리하는 훅
 */
export function useAccordion(sections: MenuSection[]) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      sections.reduce<Record<string, boolean>>((acc, section) => {
        // 하위 버튼이 있는 섹션만 처음에 열림
        if (section.type === "withButtons") {
          acc[section.id] = true;
        }
        return acc;
      }, {})
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isOpen = (sectionId: string) => !!openSections[sectionId];

  return { isOpen, toggleSection };
}

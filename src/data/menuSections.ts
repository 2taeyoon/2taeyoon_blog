import { MenuSection } from "@/types/props.types";

export const MENU_SECTIONS: MenuSection[] = [
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

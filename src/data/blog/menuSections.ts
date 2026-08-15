import { MenuSection } from "@/types/blog/menu.types";
import { BLOG_CATEGORIES } from "./cards";

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "home",
    title: "HOME",
    href: "/blog",
    type: "linkOnly",
    exact: true,
  },
  ...BLOG_CATEGORIES.map(({ id, label, href, data }) => ({
    id,
    title: label,
    href,
    count: data.cards.length,
    type: "linkOnly" as const,
  })),
];

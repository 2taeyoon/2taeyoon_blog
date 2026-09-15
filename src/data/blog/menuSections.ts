import { MenuSection } from "@/types/blog/menu.types";
import { allBlogCards, BLOG_CATEGORIES } from "./cards";

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "home",
    title: "Home",
    href: "/blog",
    count: allBlogCards.length,
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

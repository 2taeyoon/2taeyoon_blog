import { MenuSection } from "@/types/blog/menu.types";
import { allBlogCards, BLOG_CATEGORIES } from "./cards";

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "blog",
    title: "BLOG",
    count: allBlogCards.length,
    items: BLOG_CATEGORIES.map(({ label, href, data }) => ({
      label,
      href,
      count: data.cards.length,
    })),
    type: "withButtons",
  },
];

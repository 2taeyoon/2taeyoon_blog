import { MenuSection } from "@/types/blog/menu.types";
import { allBlogCards, getCategoryCardCount } from "./cards";

const designCount = getCategoryCardCount("design");
const frontendCount = getCategoryCardCount("frontend");
const backendCount = getCategoryCardCount("backend");
const aiCount = getCategoryCardCount("ai");

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "blog",
    title: "BLOG",
    count: allBlogCards.length,
    items: [
      { label: "Design", href: "/blog/design", count: designCount },
      { label: "Frontend", href: "/blog/frontend", count: frontendCount },
      { label: "Backend", href: "/blog/backend", count: backendCount },
      { label: "AI", href: "/blog/ai", count: aiCount },
    ],
    type: "withButtons",
  },
];

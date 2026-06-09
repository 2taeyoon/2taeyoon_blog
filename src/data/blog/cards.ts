import type { CardProps } from "@/types/blog/card.types";
import designData from "./designData.json";
import frontendData from "./frontendData.json";
import backendData from "./backendData.json";
import aiData from "./aiData.json";

type CategoryData = { cards: CardProps[] };

export const BLOG_CATEGORIES = [
  {
    id: "design",
    label: "Design",
    href: "/blog/design",
    sessionName: "design",
    data: designData,
  },
  {
    id: "frontend",
    label: "Frontend",
    href: "/blog/frontend",
    sessionName: "frontend",
    data: frontendData,
  },
  {
    id: "backend",
    label: "Backend",
    href: "/blog/backend",
    sessionName: "backend",
    data: backendData,
  },
  {
    id: "ai",
    label: "AI",
    href: "/blog/ai",
    sessionName: "ai",
    data: aiData,
  },
] as const satisfies readonly {
  id: string;
  label: string;
  href: string;
  sessionName: string;
  data: CategoryData;
}[];

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]["id"];

export const blogCategoryData = Object.fromEntries(
  BLOG_CATEGORIES.map((category) => [category.id, category.data]),
) as Record<BlogCategory, CategoryData>;

export const allBlogCards: CardProps[] = BLOG_CATEGORIES.flatMap(
  (category) => category.data.cards,
);

export function getBlogCategory(category: BlogCategory) {
  const found = BLOG_CATEGORIES.find((item) => item.id === category);
  if (!found) {
    throw new Error(`Unknown blog category: ${category}`);
  }
  return found;
}

export function getCategoryCardCount(category: BlogCategory) {
  return blogCategoryData[category].cards.length;
}

export function getCombinedSliderCards(): CardProps[] {
  return BLOG_CATEGORIES.flatMap((category) =>
    category.data.cards.map((card) => ({
      ...card,
      type: `blog/${category.id}`,
    })),
  );
}

export function getSortedBlogCards(cards: CardProps[] = allBlogCards) {
  return [...cards].sort((a, b) => {
    const dateA = new Date(a.sortDate || "2024-01-01").getTime();
    const dateB = new Date(b.sortDate || "2024-01-01").getTime();
    return dateB - dateA;
  });
}

import type { CardProps } from "@/types/blog/card.types";
import designData from "./designData.json";
import frontendData from "./frontendData.json";
import backendData from "./backendData.json";
import aiData from "./aiData.json";

export type BlogCategory = "design" | "frontend" | "backend" | "ai";

export const blogCategoryData = {
  design: designData,
  frontend: frontendData,
  backend: backendData,
  ai: aiData,
} as const;

export const allBlogCards: CardProps[] = [
  ...designData.cards,
  ...frontendData.cards,
  ...backendData.cards,
  ...aiData.cards,
];

export function getCategoryCardCount(category: BlogCategory) {
  return blogCategoryData[category].cards.length;
}

export function getCombinedSliderCards(): CardProps[] {
  return [
    ...designData.cards.map((card) => ({ ...card, type: "blog/design" })),
    ...frontendData.cards.map((card) => ({ ...card, type: "blog/frontend" })),
    ...backendData.cards.map((card) => ({ ...card, type: "blog/backend" })),
    ...aiData.cards.map((card) => ({ ...card, type: "blog/ai" })),
  ];
}

export function getSortedBlogCards(cards: CardProps[] = allBlogCards) {
  return [...cards].sort((a, b) => {
    const dateA = new Date(a.sortDate || "2024-01-01").getTime();
    const dateB = new Date(b.sortDate || "2024-01-01").getTime();
    return dateB - dateA;
  });
}

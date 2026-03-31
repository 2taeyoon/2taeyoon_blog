import { MenuSection } from "@/types/props.types";
import designData from "@/data/blog/designData.json";
import frontendData from "@/data/blog/frontendData.json";
import backendData from "@/data/blog/backendData.json";
import aiData from "@/data/blog/aiData.json";

const designCount = designData.cards.length;
const frontendCount = frontendData.cards.length;
const backendCount = backendData.cards.length;
const aiCount = aiData.cards.length;

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "blog",
    title: "BLOG",
    count: designCount + frontendCount + backendCount + aiCount,
    items: [
      { label: "Design", href: "/blog/design", count: designCount },
      { label: "Frontend", href: "/blog/frontend", count: frontendCount },
      { label: "Backend", href: "/blog/backend", count: backendCount },
      { label: "AI", href: "/blog/ai", count: aiCount },
    ],
    type: "withButtons",
  },
];

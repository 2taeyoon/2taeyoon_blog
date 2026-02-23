import { MenuSection } from "@/types/props.types";
import designData from "@/data/designData.json";
import frontendData from "@/data/frontendData.json";
import backendData from "@/data/backendData.json";
import insightData from "@/data/insightData.json";

const designCount = designData.cards.length;
const frontendCount = frontendData.cards.length;
const backendCount = backendData.cards.length;
const insightCount = insightData.cards.length;

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "study",
    title: "STUDY",
    count: designCount + frontendCount + backendCount,
    items: [
      { label: "Design", href: "/design", count: designCount },
      { label: "Frontend", href: "/frontend", count: frontendCount },
      { label: "Backend", href: "/backend", count: backendCount },
    ],
    type: "withButtons",
  },
  {
    id: "insight",
    title: "INSIGHT",
    count: insightCount,
    href: "/insight",
    type: "linkOnly",
  },
];

import { useEffect, useLayoutEffect, useState } from "react";
import { CardProps } from "@/types/blog/card.types";
import { TocItem } from "@/components/blog/study-detail/types";

interface UseStudyDetailOptions {
  cards: CardProps[];
  title: string;
}

const extractTocFromMarkdown = (markdown: string): TocItem[] => {
  if (!markdown.trim()) return [];

  const items: TocItem[] = [];
  const pushItem = (rawText: string, level: 2 | 3) => {
    const text = rawText.replace(/<[^>]*>/g, "").trim();
    if (!text) return;

    items.push({ id: `toc-${items.length}`, text, level });
  };

  const lines = markdown.split("\n");
  for (const line of lines) {
    const h3Match = line.match(/^###\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);

    if (h2Match) pushItem(h2Match[1], 2);
    if (h3Match) pushItem(h3Match[1], 3);
  }

  return items;
};

const collectTocFromBlogDom = (): TocItem[] | null => {
  const headingNodes = Array.from(
    document.querySelectorAll<HTMLHeadingElement>(".blog h2, .blog h3"),
  );
  if (!headingNodes.length) return null;

  const domItems: TocItem[] = [];
  let seq = 0;
  headingNodes.forEach((node) => {
    const text = (node.textContent || "").trim();
    if (!text) return;

    const level: 2 | 3 = node.tagName.toLowerCase() === "h2" ? 2 : 3;
    domItems.push({ id: `toc-${seq++}`, text, level });
  });

  return domItems.length ? domItems : null;
};

export function useStudyDetail({ cards, title }: UseStudyDetailOptions) {
  const [markdown, setMarkdown] = useState("");
  const [notFoundState, setNotFoundState] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  const decodedParam = decodeURIComponent(title);
  const currentCard = cards.find(
    (item: CardProps) => item.title.replace(/\s+/g, "-") === decodedParam,
  );
  const decodedTitle = currentCard ? currentCard.title : decodedParam.replace(/-/g, " ");

  useEffect(() => {
    if (!currentCard) {
      setNotFoundState(true);
      return;
    }

    if (currentCard.mdFile) {
      fetch(currentCard.mdFile)
        .then((response) => response.text())
        .then((text) => setMarkdown(text));
    }
  }, [currentCard, title]);

  useLayoutEffect(() => {
    if (!markdown.trim()) {
      setTocItems([]);
      return;
    }

    let canceled = false;
    let rafId = 0;

    const apply = (items: TocItem[]) => {
      if (!canceled) setTocItems(items);
    };

    const sync = () => {
      const fromDom = collectTocFromBlogDom();
      if (fromDom) {
        apply(fromDom);
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        const retry = collectTocFromBlogDom();
        apply(retry ?? extractTocFromMarkdown(markdown));
      });
    };

    sync();

    return () => {
      canceled = true;
      window.cancelAnimationFrame(rafId);
    };
  }, [markdown]);

  return {
    markdown,
    notFoundState,
    decodedTitle,
    currentCard,
    tocItems,
  };
}

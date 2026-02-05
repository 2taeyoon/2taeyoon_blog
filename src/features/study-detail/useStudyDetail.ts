import { useEffect, useState } from "react";
import { CardProps } from "@/types/props.types";

interface UseStudyDetailOptions {
  cards: CardProps[];
  title: string;
}

export function useStudyDetail({ cards, title }: UseStudyDetailOptions) {
  const [markdown, setMarkdown] = useState("");
  const [notFoundState, setNotFoundState] = useState(false);

  const decodedTitle = decodeURIComponent(title).replace(/-/g, " ");
  const currentCard = cards.find((item: CardProps) => item.title === decodedTitle);

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

  return {
    markdown,
    notFoundState,
    decodedTitle,
    currentCard,
  };
}


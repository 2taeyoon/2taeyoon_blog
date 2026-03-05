import { useEffect, useState } from "react";
import { CardProps } from "@/types/props.types";

interface UseStudyDetailOptions {
  cards: CardProps[];
  title: string;
}

export function useStudyDetail({ cards, title }: UseStudyDetailOptions) {
  const [markdown, setMarkdown] = useState("");
  const [notFoundState, setNotFoundState] = useState(false);

  const decodedParam = decodeURIComponent(title);
  // 카드의 title을 슬러그 형태(공백 → 하이픈)로 변환해서 URL 파라미터와 비교
  const currentCard = cards.find(
    (item: CardProps) => item.title.replace(/\s+/g, "-") === decodedParam
  );
  // PageUrls 등에서 사용할 가독성 있는 제목
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

  return {
    markdown,
    notFoundState,
    decodedTitle,
    currentCard,
  };
}


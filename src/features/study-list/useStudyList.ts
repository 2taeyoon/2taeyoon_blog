import { useEffect, useState } from "react";
import { CardProps } from "@/types/props.types";

interface UseStudyListOptions {
  cards: CardProps[];
}

export function useStudyList({ cards }: UseStudyListOptions) {
  const [filteredCards, setFilteredCards] = useState<CardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // 현재는 해시태그 필터링 없이 전체 카드만 사용
    setFilteredCards(cards);
  }, [cards]);

  return {
    filteredCards,
    currentPage,
    setCurrentPage,
    setFilteredCards,
  };
}


import { useEffect, useState } from "react";
import { CardProps } from "@/types/props.types";

interface UseStudyListOptions {
  cards: CardProps[];
  sessionName: string;
}

export function useStudyList({ cards, sessionName }: UseStudyListOptions) {
  const [filteredCards, setFilteredCards] = useState<CardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // 세션스토리지에서 검색어 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = JSON.parse(sessionStorage.getItem(sessionName) || "{}");
      if (savedData.Search) {
        setSearchQuery(savedData.Search);
      }
    }
  }, [sessionName]);

  // 검색어로 카드 필터링
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCards(cards);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = cards.filter((card) => {
      // 제목, 부제목, 해시태그에서 검색
      const titleMatch = card.title?.toLowerCase().includes(query);
      const subTitleMatch = card.subTitle?.toLowerCase().includes(query);
      const hashMatch = card.hashs?.some((hash) =>
        hash.name.toLowerCase().includes(query)
      );
      
      return titleMatch || subTitleMatch || hashMatch;
    });

    setFilteredCards(filtered);
    // 검색 시 첫 페이지로 이동
    setCurrentPage(0);
  }, [cards, searchQuery]);

  // 검색어 변경 및 세션스토리지 저장
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (typeof window !== "undefined") {
      const savedData = JSON.parse(sessionStorage.getItem(sessionName) || "{}");
      sessionStorage.setItem(
        sessionName,
        JSON.stringify({ ...savedData, Search: query })
      );
    }
  };

  return {
    filteredCards,
    currentPage,
    setCurrentPage,
    searchQuery,
    handleSearch,
  };
}


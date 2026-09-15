import { useCallback, useMemo } from "react";
import { CardProps } from "@/types/blog/card.types";
import { useBlogSessionStore } from "@/stores/useBlogSessionStore";

interface UseStudyListOptions {
  cards: CardProps[];
  sessionName: string;
}

export function useStudyList({ cards, sessionName }: UseStudyListOptions) {
  const searchQuery = useBlogSessionStore(
    (state) => state.sessions[sessionName]?.searchQuery ?? "",
  );
  const currentPage = useBlogSessionStore(
    (state) => state.sessions[sessionName]?.currentPage ?? 0,
  );
  const updateSearchQuery = useBlogSessionStore(
    (state) => state.setSearchQuery,
  );
  const updateCurrentPage = useBlogSessionStore(
    (state) => state.setCurrentPage,
  );

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) {
      return cards;
    }

    const query = searchQuery.toLowerCase();
    return cards.filter((card) => {
      // 제목, 부제목, 해시태그에서 검색
      const titleMatch = card.title?.toLowerCase().includes(query);
      const subTitleMatch = card.subTitle?.toLowerCase().includes(query);
      const hashMatch = card.hashs?.some((hash) =>
        hash.name.toLowerCase().includes(query)
      );
      
      return titleMatch || subTitleMatch || hashMatch;
    });
  }, [cards, searchQuery]);

  const handleSearch = useCallback(
    (query: string) => updateSearchQuery(sessionName, query),
    [sessionName, updateSearchQuery],
  );

  const setCurrentPage = useCallback(
    (page: number) => updateCurrentPage(sessionName, page),
    [sessionName, updateCurrentPage],
  );

  return {
    filteredCards,
    currentPage,
    setCurrentPage,
    searchQuery,
    handleSearch,
  };
}


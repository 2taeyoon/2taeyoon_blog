import type { CardProps } from "@/types/blog/card.types";

export interface CardPaginationProps {
  filteredCards: CardProps[];
  sessionName: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export type CardPaginationHookArgs = Pick<
  CardPaginationProps,
  "filteredCards" | "currentPage" | "setCurrentPage"
>;

export type PaginationControlsProps = {
  pageCount: number;
  currentPage: number;
  visiblePages: number[];
  onFirst: () => void;
  onLast: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectPage: (page: number) => void;
};

export interface PageUrlsProps {
  hyphenRemoval: string;
  cards: CardProps[];
}

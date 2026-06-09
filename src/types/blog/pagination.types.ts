import type { Dispatch, SetStateAction } from "react";
import type { CardProps } from "@/types/blog/card.types";

export interface CardPaginationProps {
  filteredCards: CardProps[];
  sessionName: string;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export type CardPaginationHookArgs = Pick<
  CardPaginationProps,
  "filteredCards" | "sessionName" | "currentPage" | "setCurrentPage"
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

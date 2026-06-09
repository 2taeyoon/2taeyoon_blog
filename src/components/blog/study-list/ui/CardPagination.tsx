'use client';

import React from 'react';
import StudyCard from "@/components/blog/study-list/ui/StudyCard";
import StudyCardCompact from "@/components/blog/study-list/ui/StudyCardCompact";
import { CardPaginationProps } from "@/types/blog/pagination.types";
import { useCardPagination } from "@/components/blog/study-list/hooks/useCardPagination";
import PaginationControls from "@/components/blog/study-list/ui/PaginationControls";
export default function CardPagination(props: CardPaginationProps) {
	const {
		displayCards,
		pageCount,
		visiblePages,
		goToFirst,
		goToLast,
		goToPrev,
		goToNext,
		goToPage,
	} = useCardPagination(props);

	return (
		<div className="card_pagination">
			<div className="card_wrap">
				{displayCards.map((card) =>
					card.type ? (
						<StudyCardCompact key={card.title} cards={[card]} />
					) : (
						<StudyCard key={card.title} cards={[card]} sessionName={props.sessionName} />
					),
				)}
			</div>
			<PaginationControls
				pageCount={pageCount}
				currentPage={props.currentPage}
				visiblePages={visiblePages}
				onFirst={goToFirst}
				onLast={goToLast}
				onPrev={goToPrev}
				onNext={goToNext}
				onSelectPage={goToPage}
			/>
		</div>
	);
}
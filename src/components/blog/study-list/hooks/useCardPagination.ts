import { useEffect } from 'react';
import { CardPaginationHookArgs } from "@/types/blog/pagination.types";

const CARDS_PER_PAGE = 8;
const MAX_PAGE_BUTTONS = 5;

export function useCardPagination({
	filteredCards,
	sessionName,
	currentPage,
	setCurrentPage,
}: CardPaginationHookArgs) {
	const pageCount = Math.max(1, Math.ceil(filteredCards.length / CARDS_PER_PAGE));
	const displayCards = filteredCards.slice(
		currentPage * CARDS_PER_PAGE,
		(currentPage + 1) * CARDS_PER_PAGE,
	);

	const goToPage = (targetPage: number) => {
		const newPage = Math.min(Math.max(targetPage, 0), pageCount - 1);

		if (typeof window !== "undefined") {
			const storedData = JSON.parse(sessionStorage.getItem(sessionName) || "{}");
			const updatedData = { ...storedData, Pagination: newPage };
			sessionStorage.setItem(sessionName, JSON.stringify(updatedData));

			if (window.innerWidth <= 640) {
				window.scrollTo(0, 0);
			}
		}

		setCurrentPage(newPage);
	};

	useEffect(() => {
		const storedData = JSON.parse(sessionStorage.getItem(sessionName) || "{}");
		if (storedData.Pagination !== undefined) {
			setCurrentPage(storedData.Pagination);
		}
	}, [sessionName, setCurrentPage]);

	useEffect(() => {
		if (currentPage >= pageCount) {
			setCurrentPage(0);
		}
	}, [filteredCards, currentPage, setCurrentPage, pageCount]);

	const goToFirst = () => {
		if (pageCount > 0) {
			goToPage(0);
		}
	};

	const goToLast = () => {
		if (pageCount > 0) {
			goToPage(pageCount - 1);
		}
	};

	const goToPrev = () => {
		goToPage(currentPage - 1);
	};

	const goToNext = () => {
		goToPage(currentPage + 1);
	};

	const getVisiblePages = () => {
		if (pageCount <= MAX_PAGE_BUTTONS) {
			return Array.from({ length: pageCount }, (_, i) => i);
		}

		const half = Math.floor(MAX_PAGE_BUTTONS / 2);
		let start = currentPage - half;
		let end = currentPage + half;

		if (start < 0) {
			start = 0;
			end = start + MAX_PAGE_BUTTONS - 1;
		}

		if (end > pageCount - 1) {
			end = pageCount - 1;
			start = end - (MAX_PAGE_BUTTONS - 1);
		}

		const pages: number[] = [];
		for (let i = start; i <= end; i += 1) {
			pages.push(i);
		}
		return pages;
	};

	return {
		displayCards,
		pageCount,
		currentPage,
		visiblePages: getVisiblePages(),
		goToFirst,
		goToLast,
		goToPrev,
		goToNext,
		goToPage,
	};
}


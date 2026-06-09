import React from 'react';
import { PaginationControlsProps } from "@/types/blog/pagination.types";

const PrevIcon = (
	<svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg" data-svg="pagination-previous">
		<polyline fill="none" stroke="#000" strokeWidth="1.5" points="6 1 1 6 6 11" />
	</svg>
);

const NextIcon = (
	<svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg" data-svg="pagination-next">
		<polyline fill="none" stroke="#000" strokeWidth="1.5" points="1 1 6 6 1 11" />
	</svg>
);

export default function PaginationControls({
	pageCount,
	currentPage,
	visiblePages,
	onFirst,
	onLast,
	onPrev,
	onNext,
	onSelectPage,
}: PaginationControlsProps) {
	if (pageCount <= 1) {
		return null;
	}

	return (
		<div className="card_pagination_nav">
			<button type="button" className="pagination_first" aria-label="첫 페이지로 이동" onClick={onFirst}>
				<svg width="7" height="12" viewBox="0 0 7 12">
					<polyline fill="none" stroke="var(--black)" strokeWidth="1.5" points="6 1 1 6 6 11" />
				</svg>
				<svg width="7" height="12" viewBox="0 0 7 12">
					<polyline fill="none" stroke="var(--black)" strokeWidth="1.5" points="6 1 1 6 6 11" />
				</svg>
			</button>
			<ul className="pagination">
				<li>
					<a href="#" aria-label="이전 페이지로 이동" onClick={(e) => { e.preventDefault(); onPrev(); }} >
						{PrevIcon}
					</a>
				</li>
				{visiblePages.map((page) => (
					<li key={page} className={page === currentPage ? 'active' : ''}>
						<a href="#" aria-label={`${page + 1} 페이지로 이동`} onClick={(e) => { e.preventDefault(); onSelectPage(page); }} >
							{page + 1}
						</a>
					</li>
				))}
				<li>
					<a href="#" aria-label="다음 페이지로 이동" onClick={(e) => { e.preventDefault(); onNext(); }} >
						{NextIcon}
					</a>
				</li>
			</ul>
			<button type="button" className="pagination_last" aria-label="마지막 페이지로 이동" onClick={onLast}>
				<svg width="7" height="12" viewBox="0 0 7 12">
					<polyline fill="none" stroke="var(--black)" strokeWidth="1.5" points="1 1 6 6 1 11" />
				</svg>
				<svg width="7" height="12" viewBox="0 0 7 12">
					<polyline fill="none" stroke="var(--black)" strokeWidth="1.5" points="1 1 6 6 1 11" />
				</svg>
			</button>
		</div>
	);
}


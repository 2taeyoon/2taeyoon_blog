'use client';

import React, { useEffect } from 'react'
import StudyCard from "@/components/list/StudyCard";
import StudyCardCompact from "@/components/list/StudyCardCompact";
import ReactPaginate from 'react-paginate';
import { CardPaginationProps } from "@/types/props.types";


export default function CardPagination({filteredCards, sessionName, currentPage, setCurrentPage}: CardPaginationProps) {
	const cardsPerPage = 8; // 한 페이지에 표시할 카드 수
	const displayCards = filteredCards.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage); // 페이지에 따라 표시할 카드들을 계산
	const pageCount = Math.max(1, Math.ceil(filteredCards.length / cardsPerPage)); // pageCount를 안전하게 계산

	// 페이지 번호가 클릭되었을 때 호출되는 함수 START!
	const handlePageClick = (selectedItem: { selected: number }) => {
		const newPage = selectedItem.selected;

		// Hydration 오류 방지: sessionStorage 사용 전 window 체크
    if (typeof window !== "undefined") {
			// 현재 저장된 데이터를 가져옴
			const storedData = JSON.parse(sessionStorage.getItem(sessionName) || "{}");
			const updatedData = { ...storedData, Pagination: newPage };
			sessionStorage.setItem(sessionName, JSON.stringify(updatedData));
		}

		setCurrentPage(newPage);

		// 화면 너비가 640px 이하일 때 스크롤을 맨 위로 이동
		if (window.innerWidth <= 640) {
			window.scrollTo(0, 0);
		}
	};
	// 페이지 번호가 클릭되었을 때 호출되는 함수 END!


	// 컴포넌트 마운트 후 세션 스토리지에서 페이지 번호를 로드 START!
	useEffect(() => {
		const storedData = JSON.parse(sessionStorage.getItem(sessionName) || "{}");
		if (storedData.Pagination !== undefined) {
			setCurrentPage(storedData.Pagination);
		}
	}, [sessionName, setCurrentPage]);
	// 컴포넌트 마운트 후 세션 스토리지에서 페이지 번호를 로드 END!

	// filteredCards가 업데이트되면 현재 페이지를 초기화
	useEffect(() => {
		if (currentPage >= pageCount) {
				setCurrentPage(0); // 현재 페이지가 범위를 벗어나면 첫 페이지로 초기화
		}
	}, [filteredCards, currentPage, setCurrentPage, pageCount]);

	const prevButton = <svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg" data-svg="pagination-previous"><polyline fill="none" stroke="#000" strokeWidth="1.2" points="6 1 1 6 6 11"></polyline></svg>;
	const nextButton = <svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg" data-svg="pagination-next"><polyline fill="none" stroke="#000" strokeWidth="1.2" points="1 1 6 6 1 11"></polyline></svg>;

	return (
		<div className="card_pagination">
			<div className="card_wrap">
				{displayCards.map(card =>
					card.type ? (
						<StudyCardCompact key={card.title} cards={[card]} />
					) : (
						<StudyCard key={card.title} cards={[card]} sessionName={sessionName}/>
					)
				)}
			</div>
			<ReactPaginate
				previousLabel={prevButton} // 이전 페이지 버튼에 표시할 요소
				nextLabel={nextButton} // 다음 페이지 버튼에 표시할 요소
				breakLabel={'···'} // 페이지 번호 사이에 구분자 표시할 요소
				pageCount={pageCount} // 페이지네이션에 표시할 총 페이지 수
				marginPagesDisplayed={1} // 앞뒤로 보여줄 고정 페이지 수
				pageRangeDisplayed={2} // 현재 선택된 페이지 주변에 표시할 페이지 범위
				onPageChange={handlePageClick} // 페이지가 변경될 때 호출되는 콜백 함수
				containerClassName={'pagination'} // 최상단 부모 클래스 이름
				activeClassName={'active'} // 현재 선택된 페이지에 적용할 클래스 이름
				forcePage={currentPage} // 강제로 현재 페이지를 설정 (주로 상태 관리와 연계)
			/>
		</div>
	)
}
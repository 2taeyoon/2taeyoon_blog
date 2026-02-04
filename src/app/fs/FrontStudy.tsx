'use client';

import React, { useEffect, useState } from "react";
import frontStudyData from "@/data/frontStudyData.json";
import SliderFade from "@/components/ui/SliderFade";
import { CardProps } from "@/types/props";
//import Hashs from "@/components/utill/Hashs";
import Saying from "@/components/ui/Saying";
import CardPagination from "@/components/utill/CardPagination";
import BlogAide from "@/components/layout/BlogAide";
// import { usePathname } from "next/navigation";

export default function PublishingStudy() {
  //const [selectedHash, setSelectedHash] = useState<string | null>(null); // 해시태그를 상태로 관리
  const [filteredCards, setFilteredCards] = useState<CardProps[]>([]); // 필터링 카드를 상태로 관리
	const [currentPage, setCurrentPage] = useState(0);

	// const pathname = usePathname(); // 현재 경로 확인

	// useEffect(()=>{ // 세션 스토리지 fromHome 삭제
	// 	sessionStorage.removeItem("fromHome");
	// }, [pathname])

	// 선택된 해시태그에 따라 카드를 필터링하는 함수 START!
  useEffect(() => {
    // if (selectedHash) { // 카드 중 해시태그가 일치하는 카드만 필터링합니다.
    //   const newFilteredCards = frontStudyData.cards.filter(card =>
    //     card.hashs.some(hash => hash.name === selectedHash)
    //   );
    //   setFilteredCards(newFilteredCards);
    // } else { // 선택된 해시태그가 없다면 모든 카드를 표시
    //   setFilteredCards(frontStudyData.cards);
    // }
		setFilteredCards(frontStudyData.cards);
  }, [])

	// 카드에서 중복되지 않은 해시태그들만 추출하여 배열로 생성
	// const uniqueHashs = Array.from(new Set(frontStudyData.cards.flatMap(card => card.hashs.map(hash => hash.name))));

  return (
		<div className="layout_wrap">
			<BlogAide/>
			<div className="wrap">
				<div className="common_wrap pd_none_col">
					<SliderFade/>
					<Saying sessionName="fs"/>
					{/* <Hashs selectedHash={selectedHash} setSelectedHash={setSelectedHash} uniqueHashs={uniqueHashs} sessionName="fs" setCurrentPage={setCurrentPage}/> */}
				</div>
				<div className="common_wrap">
					<CardPagination filteredCards={filteredCards} sessionName="fs" currentPage={currentPage} setCurrentPage={setCurrentPage}/>
				</div>
			</div>
		</div>
  );
}
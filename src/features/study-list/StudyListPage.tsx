'use client';

import React from "react";
import SliderFade from "@/components/ui/SliderFade";
import Saying from "@/components/ui/Saying";
import CardPagination from "@/components/util/CardPagination";
import { StudyListPageProps } from "@/types/props.types";
import { useStudyList } from "./useStudyList";

export default function StudyListPage({ cards, sessionName }: StudyListPageProps) {
  const { filteredCards, currentPage, setCurrentPage, searchQuery, handleSearch } = useStudyList({ cards, sessionName });

  return (
    <div className="layout_wrap">
      <div className="wrap">
        <div className="common_wrap pd_none_col">
          <SliderFade />
          <Saying sessionName={sessionName} />
        </div>
        <div className="common_wrap">
          {/* 검색창 - card_pagination 위에 위치 */}
          <div className="study_search_wrap">
            <input
							id="studySearch"
              type="text"
              className="study_search_input"
              placeholder="제목, 내용, 해시태그로 검색..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="study_search_clear"
                onClick={() => handleSearch("")}
                aria-label="검색어 지우기"
              >
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4L12 12" stroke="var(--black)" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
          <CardPagination
            filteredCards={filteredCards}
            sessionName={sessionName}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}


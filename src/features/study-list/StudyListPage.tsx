'use client';

import React from "react";
import BlogAide from "@/components/layout/BlogAide";
import SliderFade from "@/components/ui/SliderFade";
import Saying from "@/components/ui/Saying";
import CardPagination from "@/components/util/CardPagination";
import { StudyListPageProps } from "@/types/props.types";
import { useStudyList } from "./useStudyList";



export default function StudyListPage({ cards, sessionName }: StudyListPageProps) {
  const { filteredCards, currentPage, setCurrentPage } = useStudyList({ cards });

  return (
    <div className="layout_wrap">
      <BlogAide />
      <div className="wrap">
        <div className="common_wrap pd_none_col">
          <SliderFade />
          <Saying sessionName={sessionName} />
          {/* 해시태그 필터링은 현재 사용하지 않지만,
              기존 주석 로직(Hashs, selectedHash 등)은
              필요 시 이 컴포넌트로 이동해 재사용할 수 있습니다. */}
        </div>
        <div className="common_wrap">
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


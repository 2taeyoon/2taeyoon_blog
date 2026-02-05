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


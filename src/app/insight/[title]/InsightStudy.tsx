'use client';
import { notFound } from "next/navigation";
import insightData from "@/data/insightData.json";
import { TitleProps } from "@/types/props.types";

import PageUrls from "@/components/util/PageUrl";
import Banner from "@/components/ui/Banner";
import { useStudyDetail } from "@/features/study-detail/useStudyDetail";
import StudyToc from "@/features/study-detail/StudyToc";
import { StudyMarkdown } from "@/features/study-detail/StudyMarkdown";

export default function InsightStudy({ title }: TitleProps) {
  const { markdown, notFoundState, decodedTitle, currentCard, tocItems } = useStudyDetail({
    cards: insightData.cards,
    title,
  });

  if (notFoundState) return notFound();

  return (
    <div className="layout_wrap">
      <div className="wrap">
        <div className="common_wrap banner_wrap">
          {currentCard && <Banner CardFind={currentCard} />}
        </div>
        <div className="common_wrap">
          <StudyToc items={tocItems} />
            <div className="blog">
              <StudyMarkdown markdown={markdown} />
              <PageUrls hyphenRemoval={decodedTitle} cards={insightData.cards} />
            </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { notFound } from "next/navigation";
import { CardProps } from "@/types/blog/card.types";
import { TitleProps } from "@/types/blog/content.types";
import Banner from "./components/Banner";
import PageUrls from "./components/PageUrls";
import { useStudyDetail } from "./hooks/useStudyDetail";
import StudyToc from "./StudyToc";
import { StudyMarkdown } from "./StudyMarkdown";

type StudyDetailPageProps = TitleProps & {
  cards: CardProps[];
};

export default function StudyDetailPage({ title, cards }: StudyDetailPageProps) {
  const { markdown, notFoundState, decodedTitle, currentCard, tocItems } = useStudyDetail({
    cards,
    title,
  });

  if (notFoundState) return notFound();

  return (
    <div className="layout_wrap">
      <div className="wrap">
        <div className="common_wrap banner_wrap">
          {currentCard && <Banner CardFind={currentCard} />}
        </div>
        <div className="blog_wrap">
          <div className="blog">
            <StudyMarkdown markdown={markdown} />
            <PageUrls hyphenRemoval={decodedTitle} cards={cards} />
          </div>
          <StudyToc items={tocItems} />
        </div>
      </div>
    </div>
  );
}

'use client';

import React from "react";
import { notFound } from "next/navigation";
import insightData from "@/data/insightData.json";
import { TitleProps } from "@/types/props.types";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import PageUrls from "@/components/util/PageUrl";
import Banner from "@/components/ui/Banner";
import { useStudyDetail } from "@/features/study-detail/useStudyDetail";
import StudyToc from "@/features/study-detail/StudyToc";
import { createMarkdownHeading } from "@/features/study-detail/markdownHeading";

export default function InsightStudy({ title }: TitleProps) {
  const { markdown, notFoundState, decodedTitle, currentCard, tocItems, activeTocId, handleTocClick, createHeadingId } = useStudyDetail({
    cards: insightData.cards,
    title,
  });
  // h2/h3 렌더러는 한 번만 만들고 재사용해야 스크롤 중 재마운트를 막을 수 있습니다.
  const headingComponents = React.useMemo(
    () => createMarkdownHeading(createHeadingId),
    [createHeadingId, markdown]
  );

  if (notFoundState) return notFound();

  return (
    <div className="layout_wrap">
      <div className="wrap">
        <div className="common_wrap banner_wrap">
          {currentCard && <Banner CardFind={currentCard} />}
        </div>
        <div className="common_wrap">
						<StudyToc items={tocItems} activeId={activeTocId} onSelect={handleTocClick} />
            <div className="blog">
							<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]} components={headingComponents}>
								{markdown}
							</ReactMarkdown>
              <PageUrls hyphenRemoval={decodedTitle} cards={insightData.cards} />
            </div>
        </div>
      </div>
    </div>
  );
}

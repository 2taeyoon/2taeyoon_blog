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

export default function InsightStudy({ title }: TitleProps) {
  const { markdown, notFoundState, decodedTitle, currentCard } = useStudyDetail({
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
          <div className="blog">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
              {markdown}
            </ReactMarkdown>
            <PageUrls hyphenRemoval={decodedTitle} cards={insightData.cards} />
          </div>
        </div>
      </div>
    </div>
  );
}

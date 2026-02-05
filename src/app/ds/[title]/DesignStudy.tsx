'use client';

import React from "react";
import { notFound } from "next/navigation";
import DesignCard from "@/data/designStudyData.json";
import { TitleProps } from "@/types/props.types";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import PageUrls from "@/components/util/PageUrl";
import Banner from "@/components/ui/Banner";
import { useStudyDetail } from "@/features/study-detail/useStudyDetail";

export default function DesignStudy({ title }: TitleProps) {
  const { markdown, notFoundState, decodedTitle, currentCard } = useStudyDetail({
    cards: DesignCard.cards,
    title,
  });

  if (notFoundState) return notFound();

  return (
    <>
      <div className="common_wrap banner_wrap">
        {currentCard && <Banner CardFind={currentCard} />}
      </div>
      <div className="common_wrap">
        <div className="blog">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
            {markdown}
          </ReactMarkdown>
          <PageUrls hyphenRemoval={decodedTitle} cards={DesignCard.cards} />
        </div>
      </div>
    </>
  );
}
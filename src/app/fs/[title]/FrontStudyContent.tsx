'use client';

import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import frontStudyData from "@/data/frontStudyData.json";
import { CardProps, TitleProps } from "@/types/props.types";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm";
import PageUrls from "@/components/util/PageUrl";
import Banner from "@/components/ui/Banner";

export default function PublishingStudyContent({title}: TitleProps) {
		const [markdown, setMarkdown] = useState("");
		const [notFoundState, setNotFoundState] = useState(false);

	  // URL 디코딩 (클라이언트에서도 한 번 더 안전 처리)
		const decodedTitle = decodeURIComponent(title).replace(/-/g, " ");
		const frontCardFind = frontStudyData.cards.find((item: CardProps) => item.title === decodedTitle);

		useEffect(() => {
			if (!frontCardFind) {
				setNotFoundState(true);
				return;
			}

			if (frontCardFind.mdFile) {
				fetch(frontCardFind.mdFile)
					.then((response) => response.text())
					.then((text) => setMarkdown(text));
			}
		}, [frontCardFind, title]);
	
		// 404 페이지 이동 처리 (useEffect 실행 후)
		if (notFoundState) return notFound();

  return (
    <>
			<div className="common_wrap banner_wrap">
				{frontCardFind && <Banner CardFind={frontCardFind} />}
			</div>
      <div className="common_wrap">
        <div className="blog">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
            {markdown}
          </ReactMarkdown>
					<PageUrls hyphenRemoval={decodedTitle} cards={frontStudyData.cards}/>
        </div>
      </div>
    </>
  );
}
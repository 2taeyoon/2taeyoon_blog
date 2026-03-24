"use client";

import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { rehypeHeadingAnchor } from "./rehypeHeadingAnchor";

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeRaw, rehypeHeadingAnchor, rehypeHighlight];

type StudyMarkdownProps = {
  markdown: string;
};

function StudyMarkdownInner({ markdown }: StudyMarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
      {markdown}
    </ReactMarkdown>
  );
}

/** activeTocId 등 부모 state 변경 시 본문 DOM이 다시 그려지지 않도록 분리합니다. */
export const StudyMarkdown = memo(StudyMarkdownInner);

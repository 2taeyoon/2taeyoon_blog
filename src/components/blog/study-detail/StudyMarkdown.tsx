"use client";

import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { rehypeHeadingAnchor } from "@/lib/blog/rehypeHeadingAnchor";

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

export const StudyMarkdown = memo(StudyMarkdownInner);

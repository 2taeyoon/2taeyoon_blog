"use client";

import { useEffect, useState } from "react";
import ProjectMarkdown from "@/components/portfolio/project/ProjectMarkdown";

interface ProjectMarkdownLoaderProps {
  mdFile: string;
}

export default function ProjectMarkdownLoader({
  mdFile,
}: ProjectMarkdownLoaderProps) {
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setMarkdown("");
    setError(false);

    fetch(mdFile, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load project markdown: ${response.status}`);
        }

        return response.text();
      })
      .then(setMarkdown)
      .catch((fetchError: unknown) => {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }

        setError(true);
      });

    return () => controller.abort();
  }, [mdFile]);

  if (error) {
    return (
      <p className="project_markdown_status">
        프로젝트 내용을 불러오지 못했습니다.
      </p>
    );
  }

  if (!markdown) {
    return <p className="project_markdown_status">Loading case study...</p>;
  }

  return <ProjectMarkdown markdown={markdown} />;
}

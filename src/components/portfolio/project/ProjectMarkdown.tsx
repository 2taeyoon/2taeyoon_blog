"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ProjectScreenshotSlider, {
  type ProjectScreenshot,
} from "@/components/portfolio/project/ProjectScreenshotSlider";

interface ProjectMarkdownProps {
  markdown: string;
}

function headingText(children: ReactNode) {
  if (Array.isArray(children)) return children.join("");
  return String(children ?? "");
}

function splitScreenshots(markdown: string) {
  const match = /^## Screenshots\s*$/m.exec(markdown);
  if (!match || match.index === undefined) {
    return { body: markdown, images: [] as ProjectScreenshot[] };
  }

  const before = markdown.slice(0, match.index);
  const after = markdown.slice(match.index + match[0].length);
  const nextHeading = after.search(/^## /m);
  const section = nextHeading === -1 ? after : after.slice(0, nextHeading);
  const rest = nextHeading === -1 ? "" : after.slice(nextHeading);
  const images = [...section.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)].map(
    (image) => ({
      alt: image[1],
      src: image[2],
    }),
  );

  if (images.length < 1) {
    return { body: markdown, images };
  }

  const sectionText = section.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim();
  const body = [before.trimEnd(), "## Screenshots", sectionText, rest.trim()]
    .filter(Boolean)
    .join("\n\n");

  return { body, images };
}

export default function ProjectMarkdown({ markdown }: ProjectMarkdownProps) {
  const { body, images } = splitScreenshots(markdown);

  return (
    <div className="project_markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h2: ({ children, ...props }) => (
            <>
              <h2 {...props}>{children}</h2>
              {headingText(children) === "Screenshots" && images.length > 0 && (
                <ProjectScreenshotSlider
                  key={images.map((image) => image.src).join("|")}
                  images={images}
                />
              )}
            </>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

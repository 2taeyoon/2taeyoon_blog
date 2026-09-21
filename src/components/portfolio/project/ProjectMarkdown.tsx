import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface ProjectMarkdownProps {
  markdown: string;
}

export default function ProjectMarkdown({
  markdown,
}: ProjectMarkdownProps) {
  return (
    <div className="project_markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

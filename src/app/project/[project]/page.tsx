import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCaseStudy from "@/components/portfolio/project/ProjectCaseStudy";
import {
  getProjectBySlug,
  projects,
  type Project,
} from "@/data/portfolio/projects";

interface ProjectDetailPageProps {
  params: Promise<{ project: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ project: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const project = getProjectBySlug((await params).project);

  if (!project) {
    return {
      title: "Project Not Found | 2taeyoon",
    };
  }

  return {
    title: `${project.title} | 2taeyoon`,
    description: project.subTitle,
    openGraph: {
      title: `${project.title} | 2taeyoon`,
      description: project.subTitle,
      images: [project.image],
      type: "article",
    },
  };
}

async function readProjectMarkdown(project: Project) {
  const publicRoot = path.resolve(process.cwd(), "public");
  const relativePath = project.mdFile.replace(/^[/\\]+/, "");
  const markdownPath = path.resolve(publicRoot, relativePath);

  if (!markdownPath.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error(`Invalid project markdown path: ${project.mdFile}`);
  }

  return readFile(markdownPath, "utf8");
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const project = getProjectBySlug((await params).project);

  if (!project) {
    notFound();
  }

  let markdown: string;

  try {
    markdown = await readProjectMarkdown(project);
  } catch {
    notFound();
  }

  return (
    <ProjectCaseStudy
      project={project}
      markdown={markdown}
    />
  );
}

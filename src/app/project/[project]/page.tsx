import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCaseStudy from "@/components/portfolio/project/ProjectCaseStudy";
import {
  getProjectBySlug,
  projects,
} from "@/data/portfolio/projects";

interface ProjectDetailPageProps {
  params: Promise<{ project: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ project: project.slug }));
}

export const dynamicParams = false;

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

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const project = getProjectBySlug((await params).project);

  if (!project) {
    notFound();
  }

  return <ProjectCaseStudy project={project} />;
}

import type { Metadata } from "next";
import ProjectCard from "@/components/portfolio/project/ProjectCard";
import { projects } from "@/data/portfolio/projects";

export const metadata: Metadata = {
  title: "Projects | 2taeyoon",
  description: "디자인과 기술을 연결해 완성한 프로젝트와 작업 과정을 소개합니다.",
  openGraph: {
    title: "Projects | 2taeyoon",
    description:
      "디자인과 기술을 연결해 완성한 프로젝트와 작업 과정을 소개합니다.",
    images: [projects[0].image],
    type: "website",
  },
};

export default function ProjectPage() {
  return (
    <main className="project_page">
      <header className="project_page_header">
        <h1>Projects</h1>
        <p className="project_page_intro">
          미학과 기술의 조각을 연결해 만든 디지털 경험과 그 과정입니다.
        </p>
        <p className="project_page_intro_en">
          Building digital experiences, one piece at a time.
        </p>
      </header>

      <section
        className="project_card_grid"
        aria-label="전체 프로젝트 목록"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </section>
    </main>
  );
}

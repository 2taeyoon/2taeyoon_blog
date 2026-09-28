"use client";

import { useEffect } from "react";
import Link from "next/link";
import { projects, type Project } from "@/data/portfolio/projects";

interface ProjectNeighborsProps {
  project: Project;
}

export default function ProjectNeighbors({ project }: ProjectNeighborsProps) {
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const previousProject = projects[currentIndex + 1];
  const nextProject = currentIndex > 0 ? projects[currentIndex - 1] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  return (
    <nav className="project_page_url" aria-label="다른 프로젝트">
      {previousProject ? (
        <Link
          className="project_page_url_link is_prev"
          href={`/projects/${previousProject.slug}`}
        >
          <span
            className="project_page_url_image"
            style={{ backgroundImage: `url('${previousProject.image}')` }}
            aria-hidden="true"
          />
          <span className="project_page_url_item">
            <svg className="project_page_url_arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            <span>
              <span className="project_page_url_label">이전 프로젝트</span>
              <span className="project_page_url_title">{previousProject.title}</span>
            </span>
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextProject ? (
        <Link
          className="project_page_url_link is_next"
          href={`/projects/${nextProject.slug}`}
        >
          <span
            className="project_page_url_image"
            style={{ backgroundImage: `url('${nextProject.image}')` }}
            aria-hidden="true"
          />
          <span className="project_page_url_item">
            <span>
              <span className="project_page_url_label">다음 프로젝트</span>
              <span className="project_page_url_title">{nextProject.title}</span>
            </span>
            <svg className="project_page_url_arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

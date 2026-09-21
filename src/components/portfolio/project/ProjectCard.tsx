"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/data/portfolio/projects";
import { playUiHover } from "@/lib/portfolio/uiSound";

type ProjectCardStyle = CSSProperties & {
  "--project-card-accent": string;
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const style: ProjectCardStyle = {
    "--project-card-accent": project.accentColor,
  };

  return (
    <article className="project_card" style={style}>
      <Link
        className="project_card_link"
        href={`/project/${project.slug}`}
        aria-label={`${project.title} 프로젝트 상세 보기`}
        onMouseEnter={playUiHover}
      >
        <div className="project_card_visual">
          <Image
            className="project_card_image"
            src={project.image}
            alt={`${project.title} 프로젝트 대표 이미지`}
            fill
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 23vw"
          />
          <div className="project_card_visual_overlay" aria-hidden="true" />
          <span className="project_card_view" aria-hidden="true">
            View Case Study
            <svg viewBox="0 0 24 24">
              <path d="M5 19L19 5M9 5h10v10" />
            </svg>
          </span>
        </div>

        <div className="project_card_body">
          <div className="project_card_heading">
            <h2>{project.title}</h2>
            <time dateTime={project.sortDate}>
              {project.sortDate.slice(0, 4)}
            </time>
          </div>
          <p>{project.subTitle}</p>
          <ul className="project_card_hashs" aria-label="프로젝트 태그">
            {project.hashs.map((hash) => (
              <li key={hash.name}>{hash.name}</li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}

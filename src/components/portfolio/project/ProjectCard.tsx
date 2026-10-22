"use client";

import Image from "next/image";
import Link from "next/link";
import { projectContextLabel, type Project } from "@/data/portfolio/projects";
import { playUiHover } from "@/lib/portfolio/uiSound";

interface ProjectCardProps {
  project: Project;
}

function projectCardDate(sortDate: string) {
  const [year, month] = sortDate.split("-");
  return `${year}.${month}`;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const siteLink = project.links?.find((link) => link.type === "site");
  const githubLink = project.links?.find((link) => link.type === "github");
  const detailHref = `/projects/${project.slug}`;

  return (
    <article className="project_card">
      <div className="project_card_visual">
        <Image
          className="project_card_image"
          src={project.image}
          alt={`${project.title} 프로젝트 대표 이미지`}
          fill
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 23vw"
        />
        <div className="project_card_visual_overlay" aria-hidden="true" />
        <Link
          className="project_card_link"
          href={detailHref}
          aria-label={`${project.title} 프로젝트 상세 보기`}
          tabIndex={-1}
          onMouseEnter={playUiHover}
        />
      </div>

      <Link className="project_card_body" href={detailHref} onMouseEnter={playUiHover}>
        <div className="project_card_heading">
          <time dateTime={project.sortDate}>{projectCardDate(project.sortDate)}</time>
          <h2>{project.title}</h2>
        </div>
        <p>{project.subTitle}</p>
        <span className="project_card_context">{projectContextLabel(project.context)}</span>
      </Link>
      <div className="project_card_links">
        <Link href={detailHref} onMouseEnter={playUiHover}>
          View Details
        </Link>
        {siteLink && (
          <a href={siteLink.href} target="_blank" rel="noreferrer" onMouseEnter={playUiHover}>
            Go to Site
          </a>
        )}
        {githubLink && (
          <a href={githubLink.href} target="_blank" rel="noreferrer" onMouseEnter={playUiHover}>
            Go to GitHub
          </a>
        )}
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { projectContextLabel, type Project } from "@/data/portfolio/projects";
import { playUiHover } from "@/lib/portfolio/uiSound";

interface ProjectCardProps {
  project: Project;
}

/** 카드에 들어올 때 한 번만 재생. 버튼 영역으로 바로 들어오면 재생하지 않음 */
function handleCardEnter(event: MouseEvent<HTMLElement>) {
  if ((event.target as Element).closest(".project_card_links")) return;
  playUiHover();
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const siteLink = project.links?.find((link) => link.type === "site");
  const githubLink = project.links?.find((link) => link.type === "github");
  const detailHref = `/projects/${project.slug}`;

  return (
    <article className="project_card" onMouseEnter={handleCardEnter}>
      <Link
        className="project_card_link"
        href={detailHref}
        aria-label={`${project.title} 프로젝트 상세 보기`}
      />
      <div className="project_card_visual">
        <Image
          className="project_card_image"
          src={project.image}
          alt={`${project.title} 프로젝트 대표 이미지`}
          fill
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 23vw"
        />
        <div className="project_card_visual_overlay" aria-hidden="true" />
      </div>

      <div className="project_card_body">
        <div className="project_card_heading">
          <time dateTime={project.sortDate}>{project.period}</time>
          <h2>{project.title}</h2>
        </div>
        <p>{project.subTitle}</p>
        <span className="project_card_context">{projectContextLabel(project.context)}</span>
      </div>
      <div className="project_card_links">
        <Link href={detailHref}>View Details</Link>
        {siteLink && (
          <a href={siteLink.href} target="_blank" rel="noreferrer">
            Go to Site
          </a>
        )}
        {githubLink && (
          <a href={githubLink.href} target="_blank" rel="noreferrer">
            Go to GitHub
          </a>
        )}
      </div>
    </article>
  );
}

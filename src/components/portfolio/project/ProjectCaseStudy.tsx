import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { projectContextLabel, type Project } from "@/data/portfolio/projects";
import { libraryBadge, shieldsBadgeUrl, skillBadges } from "@/data/portfolio/skills";
import ProjectMarkdownLoader from "@/components/portfolio/project/ProjectMarkdownLoader";
import ProjectNeighbors from "@/components/portfolio/project/ProjectNeighbors";

type ProjectDetailStyle = CSSProperties & {
  "--project-detail-accent": string;
};

interface ProjectCaseStudyProps {
  project: Project;
}

export default function ProjectCaseStudy({
  project,
}: ProjectCaseStudyProps) {
  const style: ProjectDetailStyle = {
    "--project-detail-accent": project.accentColor,
  };
  const siteLink = project.links?.find((link) => link.type === "site");
  const githubLink = project.links?.find((link) => link.type === "github");

  return (
    <main className="project_detail_page" style={style}>
      <Link className="project_detail_back" href="/projects">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Projects
      </Link>
      <article className="project_detail">
        <header className="project_detail_header">
          <div className="project_detail_title_group">
            <h1>{project.title}</h1>
            <p className="project_detail_subtitle_ko">{project.subTitle}</p>
            <p className="project_detail_subtitle_en">{project.subTitleEn}</p>
          </div>

          <div className="project_detail_hero">
            <Image
              src={project.image}
              alt={`${project.title} 프로젝트 대표 이미지`}
              fill
              priority
              sizes="(max-width: 700px) 92vw, 88vw"
            />
          </div>
        </header>

        <section className="project_detail_information" aria-label="프로젝트 정보">
          <dl>
            <div>
              <dt>Period</dt>
              <dd>{project.period}</dd>
            </div>
            <div>
              <dt>Context</dt>
              <dd>{projectContextLabel(project.context)}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Contribution</dt>
              <dd>{project.contribution}%</dd>
            </div>
            <div className="project_detail_tech">
              <dt>Skills</dt>
              <dd>
                <ul>
                  {project.skills.map((technology) => {
                    const skill = skillBadges[technology] ?? libraryBadge(technology);

                    return (
                      <li key={technology}>
                        <img src={shieldsBadgeUrl(skill)} alt={skill.label} />
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
            {project.libraries && project.libraries.length > 0 && (
              <div className="project_detail_tech">
                <dt>API &amp; Library</dt>
                <dd>
                  <ul>
                    {project.libraries.map((library) => (
                      <li key={library}>
                        <img src={shieldsBadgeUrl(libraryBadge(library))} alt={library} />
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          {(siteLink || githubLink) && (
            <div className="project_detail_links">
              <p>Links</p>
              <ul>
                {siteLink && (
                  <li>
                    <a href={siteLink.href} target="_blank" rel="noreferrer">
                      Site
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                )}
                {githubLink && (
                  <li>
                    <a href={githubLink.href} target="_blank" rel="noreferrer">
                      GitHub
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </section>

        <section className="project_detail_content" aria-label="프로젝트 상세 내용">
          <ProjectMarkdownLoader mdFile={project.mdFile} />
        </section>

        <ProjectNeighbors project={project} />
      </article>
    </main>
  );
}

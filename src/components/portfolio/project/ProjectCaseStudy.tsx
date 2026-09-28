import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/data/portfolio/projects";
import { skillBadges } from "@/data/portfolio/skills";
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

  return (
    <main className="project_detail_page" style={style}>
      <article className="project_detail">
        <header className="project_detail_header">
          <div className="project_detail_title_group">
            <h1>{project.title}</h1>
            <p className="project_detail_subtitle_ko">{project.subTitle}</p>
            <p className="project_detail_subtitle_en">{project.subTitleEn}</p>
          </div>

          <ul className="project_detail_hashs" aria-label="프로젝트 태그">
            {project.hashs.map((hash) => (
              <li key={hash.name}>{hash.name}</li>
            ))}
          </ul>

          <div className="project_detail_hero">
            <Image
              src={project.image}
              alt={`${project.title} 프로젝트 대표 이미지`}
              fill
              priority
              sizes="(max-width: 700px) 92vw, 88vw"
            />
            <span aria-hidden="true" />
          </div>
        </header>

        <section className="project_detail_information" aria-label="프로젝트 정보">
          <dl>
            <div>
              <dt>Period</dt>
              <dd>{project.period}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Contribution</dt>
              <dd>{project.contribution}</dd>
            </div>
            <div>
              <dt>Team</dt>
              <dd>{project.team}</dd>
            </div>
            {project.company && (
              <div>
                <dt>Company</dt>
                <dd>{project.company}</dd>
              </div>
            )}
            <div className="project_detail_tech">
              <dt>Tech Stack</dt>
              <dd>
                <ul>
                  {project.techStack.map((technology) => {
                    const skill = skillBadges[technology];

                    if (!skill) {
                      return <li key={technology}>{technology}</li>;
                    }

                    return (
                      <li key={technology} style={{ backgroundColor: skill.color }}>
                        <img src={skill.icon} alt="" />
                        <span>{skill.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          </dl>

          {project.links && project.links.length > 0 && (
            <div className="project_detail_links">
              <p>Links</p>
              <ul>
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
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

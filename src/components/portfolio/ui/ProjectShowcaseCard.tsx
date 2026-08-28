import Image from "next/image";
import type { CSSProperties, Ref } from "react";
import type { ShowcaseProject } from "@/data/portfolio/showcaseProjects";

type ProjectCardStyle = CSSProperties & {
  "--project-accent": string;
};

interface ProjectShowcaseCardProps {
  project: ShowcaseProject;
  selected: boolean;
  disabled: boolean;
  cardRef: Ref<HTMLButtonElement>;
  onSelect: (project: ShowcaseProject) => void;
}

export default function ProjectShowcaseCard({
  project,
  selected,
  disabled,
  cardRef,
  onSelect,
}: ProjectShowcaseCardProps) {
  const style: ProjectCardStyle = {
    "--project-accent": project.accentColor,
  };

  return (
    <button
      ref={cardRef}
      className={`project-card${selected ? " selected" : ""}`}
      type="button"
      data-project={project.id}
      aria-label={`${project.title} 프로젝트 상세 보기`}
      style={style}
      tabIndex={disabled ? -1 : 0}
      onClick={() => onSelect(project)}
      onPointerEnter={(event) => {
        event.currentTarget.dataset.hovered = "true";
      }}
      onPointerLeave={(event) => {
        event.currentTarget.dataset.hovered = "false";
      }}
    >
      <span className="project-frame" aria-hidden="true">
        <span className="project-shadow" />
        <span className="project-screen">
          <span className="browser-bar">
            <span className="browser-controls">
              <i />
              <i />
              <i />
            </span>
            <span className="browser-path">{project.browserPath}</span>
            <span className="browser-status" />
          </span>

          <span className="project-visual">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 700px) 84vw, (max-width: 1100px) 58vw, 42vw"
            />
            <span className="project-visual-tint" />
          </span>

          <span className="project-copy">
            <span className="project-eyebrow">{project.eyebrow}</span>
            <span className="project-title">{project.displayTitle}</span>
            <span className="project-subtitle">{project.subtitle}</span>
            <span className="project-stack">{project.stack}</span>
          </span>
        </span>
        <span className="open-badge">
          <span>View</span>
          <span aria-hidden="true">↗</span>
        </span>
      </span>
    </button>
  );
}

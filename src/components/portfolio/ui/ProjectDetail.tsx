import type { RefObject } from "react";
import type { ShowcaseProject } from "@/data/portfolio/showcaseProjects";

interface ProjectDetailProps {
  project: ShowcaseProject;
  hidden: boolean;
  saved: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onSave: () => void;
  onToast: (message: string) => void;
}

export default function ProjectDetail({
  project,
  hidden,
  saved,
  scrollRef,
  onSave,
  onToast,
}: ProjectDetailProps) {
  return (
    <section
      className="detail-panel"
      aria-live="polite"
      aria-hidden={hidden}
      inert={hidden}
    >
      <h2 className="detail-title">{project.title}</h2>
      <div
        ref={scrollRef}
        className="detail-scroll"
        tabIndex={0}
        aria-label="Getting started guide"
      >
        <p className="detail-description">{project.description}</p>

        <section className="doc-section" aria-labelledby="gettingStartedLabel">
          <p className="doc-label" id="gettingStartedLabel">
            Getting started
          </p>
          <ol className="doc-steps">
            {project.steps.map((step) => (
              <li key={step.title}>
                <span className="doc-step-copy">
                  <strong>{step.title}</strong>
                  <span>{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="doc-section" aria-labelledby="firstPromptLabel">
          <p className="doc-label" id="firstPromptLabel">
            Your first prompt
          </p>
          <div className="prompt-block">
            <code>{project.prompt}</code>
          </div>
        </section>

        <section className="doc-section" aria-labelledby="reviewLabel">
          <p className="doc-label" id="reviewLabel">
            Before you ship
          </p>
          <p className="doc-review">{project.review}</p>
        </section>
      </div>

      <div className="bottom-dock">
        <div className="meta-row" aria-label="Field edition and publication year">
          <div className="stars" aria-label="Field edition">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span className="dim">◇</span>
          </div>
          <span className="meta-divider" aria-hidden="true" />
          <span className="review-source">Field Notes</span>
          <span className="year">{project.year}</span>
        </div>
        <hr className="detail-rule" />

        <div className="action-rail" aria-label="Field manual actions">
          <button
            className="pill language"
            type="button"
            onClick={() => onToast(`Project edition · ${project.year}`)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
            Project Edition
          </button>
          <button
            className="pill"
            type="button"
            onClick={() => onToast("Notes opened.")}
          >
            Read Notes
          </button>
          <button
            className="pill"
            type="button"
            onClick={() => onToast("Guide opened.")}
          >
            View Guide
          </button>
          <button
            className="pill icon-only"
            type="button"
            aria-label="Save project"
            aria-pressed={saved}
            onClick={onSave}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.8 4.2h10.4v15.6L12 16.6l-5.2 3.2V4.2Z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

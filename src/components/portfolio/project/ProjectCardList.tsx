"use client";

import { useState } from "react";
import ProjectCard from "@/components/portfolio/project/ProjectCard";
import {
  PROJECT_FILTERS,
  projectFilterId,
  type Project,
  type ProjectFilter,
} from "@/data/portfolio/projects";
import { usePortfolioSessionStore } from "@/stores/usePortfolioSessionStore";

const PROJECTS_PER_PAGE = 8;
const MAX_PAGE_BUTTONS = 5;

const PrevIcon = (
  <svg viewBox="0 0 7 12" aria-hidden="true">
    <polyline points="6 1 1 6 6 11" />
  </svg>
);

const NextIcon = (
  <svg viewBox="0 0 7 12" aria-hidden="true">
    <polyline points="1 1 6 6 1 11" />
  </svg>
);

function visiblePages(pageCount: number, currentPage: number) {
  if (pageCount <= MAX_PAGE_BUTTONS) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const half = Math.floor(MAX_PAGE_BUTTONS / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 0) {
    start = 0;
    end = MAX_PAGE_BUTTONS - 1;
  }

  if (end > pageCount - 1) {
    end = pageCount - 1;
    start = end - (MAX_PAGE_BUTTONS - 1);
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function ProjectCardList({ projects }: { projects: Project[] }) {
  const currentPage = usePortfolioSessionStore((state) => state.projectPage);
  const setProjectPage = usePortfolioSessionStore((state) => state.setProjectPage);
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => projectFilterId(project.context) === filter);
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const safePage = Math.min(currentPage, pageCount - 1);
  const pageProjects = filteredProjects.slice(
    safePage * PROJECTS_PER_PAGE,
    (safePage + 1) * PROJECTS_PER_PAGE,
  );

  const goToPage = (targetPage: number) => {
    const nextPage = Math.min(Math.max(targetPage, 0), pageCount - 1);
    setProjectPage(nextPage);
  };

  const selectFilter = (nextFilter: ProjectFilter) => {
    setFilter(nextFilter);
    setProjectPage(0);
  };

  return (
    <>
      <div className="project_filter" role="toolbar" aria-label="프로젝트 구분">
        {PROJECT_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={filter === item.id ? "is_active" : undefined}
            aria-pressed={filter === item.id}
            onClick={() => selectFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="project_card_grid" aria-label="전체 프로젝트 목록">
        {pageProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
      {filteredProjects.length === 0 && (
        <p className="project_filter_empty">이 구분에 해당하는 프로젝트가 없습니다.</p>
      )}

      {pageCount > 1 && (
        <nav className="project_pagination_nav" aria-label="프로젝트 페이지">
          <button
            type="button"
            className="project_pagination_first"
            aria-label="첫 페이지로 이동"
            onClick={() => goToPage(0)}
          >
            {PrevIcon}
            {PrevIcon}
          </button>
          <ul className="project_pagination">
            <li>
              <button
                type="button"
                aria-label="이전 페이지로 이동"
                onClick={() => goToPage(safePage - 1)}
              >
                {PrevIcon}
              </button>
            </li>
            {visiblePages(pageCount, safePage).map((page) => (
              <li key={page}>
                <button
                  type="button"
                  className={page === safePage ? "is_active" : undefined}
                  aria-label={`${page + 1} 페이지로 이동`}
                  aria-current={page === safePage ? "page" : undefined}
                  onClick={() => goToPage(page)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                aria-label="다음 페이지로 이동"
                onClick={() => goToPage(safePage + 1)}
              >
                {NextIcon}
              </button>
            </li>
          </ul>
          <button
            type="button"
            className="project_pagination_last"
            aria-label="마지막 페이지로 이동"
            onClick={() => goToPage(pageCount - 1)}
          >
            {NextIcon}
            {NextIcon}
          </button>
        </nav>
      )}
    </>
  );
}

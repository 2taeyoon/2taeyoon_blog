import projectData from "@/data/portfolio/projectData.json";

export interface ProjectHash {
  name: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  type: "site" | "github" | "other";
}

export type ProjectContext =
  | "company-maintenance"
  | "company-project"
  | "academy-individual"
  | "academy-team"
  | "personal";

export type ProjectFilter =
  | "all"
  | "company-team"
  | "company-maintenance"
  | "personal-team"
  | "personal-individual";

export const PROJECT_FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "company-team", label: "Company · Team" },
  { id: "company-maintenance", label: "Company · Maintenance" },
  { id: "personal-team", label: "Personal · Team" },
  { id: "personal-individual", label: "Personal · Individual" },
];

const PROJECT_CONTEXT_FILTER: Record<
  ProjectContext,
  Exclude<ProjectFilter, "all">
> = {
  "company-project": "company-team",
  "company-maintenance": "company-maintenance",
  "academy-team": "personal-team",
  "academy-individual": "personal-individual",
  personal: "personal-individual",
};

export function projectFilterId(context: ProjectContext) {
  return PROJECT_CONTEXT_FILTER[context];
}

export interface Project {
  id: string;
  slug: string;
  mdFile: string;
  image: string;
  sortDate: string;
  title: string;
  subTitle: string;
  subTitleEn: string;
  hashs: ProjectHash[];
  period: string;
  context: ProjectContext;
  role: string;
  /** 이 프로젝트에서 맡은 비중. 0–100 */
  contribution: number;
  techStack: string[];
  accentColor: string;
  links?: ProjectLink[];
}

export function projectContextLabel(context: ProjectContext) {
  const filterId = projectFilterId(context);
  return PROJECT_FILTERS.find((filter) => filter.id === filterId)?.label ?? "";
}

export const projects = (projectData.projects as Project[])
  .slice()
  .sort(
    (projectA, projectB) =>
      new Date(projectB.sortDate).getTime() -
      new Date(projectA.sortDate).getTime(),
  );

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** 메인 프로젝트 섹션에 보여줄 작품. 적힌 순서대로 최대 8개. */
export const FEATURED_PROJECT_SLUGS = [
  "solar-tide",
  "copper-vein",
  "velvet-current",
  "eclipse-current",
  "amber-flux",
  "tide-pool",
  "ink-bloom",
  "night-lattice",
];

export const featuredProjects = FEATURED_PROJECT_SLUGS.slice(0, 8)
  .map((slug) => getProjectBySlug(slug))
  .filter((project): project is Project => Boolean(project));

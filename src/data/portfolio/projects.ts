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

const PROJECT_CONTEXT_LABEL: Record<ProjectContext, string> = {
  "company-maintenance": "Company · Maintenance",
  "company-project": "Company · Project",
  "academy-individual": "Academy · Individual",
  "academy-team": "Academy · Team",
  personal: "Personal",
};

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
  return PROJECT_CONTEXT_LABEL[context];
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

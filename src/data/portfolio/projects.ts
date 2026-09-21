import projectData from "@/data/portfolio/projectData.json";

export interface ProjectHash {
  name: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  type: "site" | "github" | "other";
}

export interface Project {
  id: string;
  slug: string;
  content: string;
  image: string;
  sortDate: string;
  title: string;
  subTitle: string;
  subTitleEn: string;
  hashs: ProjectHash[];
  contribution: string;
  period: string;
  role: string;
  team: string;
  techStack: string[];
  accentColor: string;
  company?: string;
  links?: ProjectLink[];
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

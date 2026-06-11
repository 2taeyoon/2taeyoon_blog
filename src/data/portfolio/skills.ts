export interface SkillCategory {
  id: string;
  label: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "design",
    label: "Design Tools",
    skills: ["Photoshop", "Illustrator", "InDesign"],
  },
  {
    id: "frontend",
    label: "FrontEnd Stack",
    skills: ["PHP", "HTML5", "CSS3", "Sass", "Tailwind CSS", "JavaScript", "TypeScript", "React", "Webpack", "Next.js"],
  },
  {
    id: "backend",
    label: "BackEnd Stack",
    skills: ["PHP", "Java", "Spring Boot", "MongoDB", "Vercel", "Supabase", "Firebase"],
  },
  {
    id: "devtools",
    label: "Dev Tools",
    skills: ["Git", "GitHub", "Markdown", "VS Code", "Cursor", "Antigravity"],
  },
];

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

export interface SkillBadge {
  label: string;
  icon: string;
  color: string;
}

export const skillBadges: Record<string, SkillBadge> = {
  photoshop: {
    label: "Photoshop",
    icon: "/images/skill/adobephotoshop.svg",
    color: "#31A8FF",
  },
  illustrator: {
    label: "Illustrator",
    icon: "/images/skill/adobeillustrator.svg",
    color: "#FF9A00",
  },
  indesign: {
    label: "InDesign",
    icon: "/images/skill/adobeindesign.svg",
    color: "#FF3366",
  },
  figma: {
    label: "Figma",
    icon: "/images/skill/figma.svg",
    color: "#F24E1E",
  },
  php: {
    label: "PHP",
    icon: "/images/skill/php.svg",
    color: "#777BB4",
  },
  html5: {
    label: "HTML5",
    icon: "/images/skill/html5.svg",
    color: "#E34F26",
  },
  css3: {
    label: "CSS3",
    icon: "/images/skill/css3.svg",
    color: "#1572B6",
  },
  sass: {
    label: "Sass",
    icon: "/images/skill/sass.svg",
    color: "#CC6699",
  },
  tailwindcss: {
    label: "Tailwind CSS",
    icon: "/images/skill/tailwindcss.svg",
    color: "#06B6D4",
  },
  javascript: {
    label: "JavaScript",
    icon: "/images/skill/javascript.svg",
    color: "#323330",
  },
  typescript: {
    label: "TypeScript",
    icon: "/images/skill/typescript.svg",
    color: "#007ACC",
  },
  react: {
    label: "React",
    icon: "/images/skill/react.svg",
    color: "#20232A",
  },
  webpack: {
    label: "Webpack",
    icon: "/images/skill/webpack.svg",
    color: "#4285F4",
  },
  nextjs: {
    label: "Next.js",
    icon: "/images/skill/nextjs.svg",
    color: "#000000",
  },
  python: {
    label: "Python",
    icon: "/images/skill/python.svg",
    color: "#3776AB",
  },
  mongodb: {
    label: "MongoDB",
    icon: "/images/skill/mongodb.svg",
    color: "#47A248",
  },
};

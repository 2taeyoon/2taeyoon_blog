export interface SkillCategory {
  id: string;
  label: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
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
  /** 배지 배경색 */
  color: string;
  /** Simple Icons 이름. 없으면 shields.io가 글자만 있는 배지를 그림 */
  logo?: string;
  logoColor?: string;
}

export const skillBadges: Record<string, SkillBadge> = {
  php: { label: "PHP", color: "#777BB4", logo: "php" },
  html5: { label: "HTML5", color: "#E34F26", logo: "html5" },
  css3: { label: "CSS", color: "#663399", logo: "css" },
  sass: { label: "Sass", color: "#CC6699", logo: "sass" },
  tailwindcss: { label: "Tailwind CSS", color: "#06B6D4", logo: "tailwindcss" },
  javascript: { label: "JavaScript", color: "#000000", logo: "javascript", logoColor: "F7DF1E" },
  typescript: { label: "TypeScript", color: "#007ACC", logo: "typescript" },
  nextjs: { label: "Next.js", color: "#000000", logo: "nextdotjs" },
  jquery: { label: "jQuery", color: "#0769AD", logo: "jquery" },
  firebase: { label: "Firebase", color: "#DD2C00", logo: "firebase" },
};

/** API & Library 이름 → Simple Icons 이름. 여기 없는 항목은 글자만 있는 검정 배지 */
const LIBRARY_LOGOS: Record<string, string> = {
  Swiper: "swiper",
  "jQuery UI": "jquery",
  "Kakao Maps": "kakao",
};

/** shields.io for-the-badge 스타일 배지 주소 */
export function shieldsBadgeUrl({ label, color, logo, logoColor = "white" }: SkillBadge) {
  // shields.io 경로에서 '-'와 '_'는 구분자라 두 번 써서 글자로 넣음
  const text = encodeURIComponent(label.replace(/-/g, "--").replace(/_/g, "__"));
  const params = new URLSearchParams({ style: "for-the-badge" });
  if (logo) {
    params.set("logo", logo);
    params.set("logoColor", logoColor);
  }
  return `https://img.shields.io/badge/${text}-${color.replace("#", "")}?${params}`;
}

export function libraryBadge(name: string): SkillBadge {
  return { label: name, color: "#000000", logo: LIBRARY_LOGOS[name] };
}

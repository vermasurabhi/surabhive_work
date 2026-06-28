export type SkillItem = {
  label: string;
  icon: string;
};

export type SkillCategory = {
  name: string;
  skills: SkillItem[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      { label: "React.js", icon: "react" },
      { label: "Next.js", icon: "nextdotjs" },
      { label: "JavaScript (ES6+)", icon: "javascript" },
      { label: "TypeScript", icon: "typescript" },
      { label: "HTML5", icon: "html5" },
      { label: "CSS3", icon: "css" },
      { label: "SCSS", icon: "sass" },
      { label: "Tailwind CSS", icon: "tailwindcss" },
      { label: "Bootstrap", icon: "bootstrap" },
      { label: "Redux basic", icon: "redux" },
    ],
  },
  {
    name: "State Management",
    skills: [
      { label: "Context API", icon: "react" },
      { label: "useReducer", icon: "react" },
    ],
  },
  {
    name: "APIs & Integrations",
    skills: [
      { label: "REST APIs", icon: "openapiinitiative" },
      { label: "Razorpay", icon: "razorpay" },
      { label: "Delhivery API", icon: "delhivery" },
    ],
  },
  {
    name: "Backend & CMS",
    skills: [
      { label: "Node.js", icon: "nodedotjs" },
      { label: "Strapi", icon: "strapi" },
    ],
  },
  {
    name: "Database",
    skills: [
      { label: "PostgreSQL", icon: "postgresql" },
      { label: "Supabase", icon: "supabase" },
      { label: "SQL", icon: "mysql" },
    ],
  },
  {
    name: "DevOps & Deployment",
    skills: [
      { label: "Docker", icon: "docker" },
      { label: "Vercel", icon: "vercel" },
      { label: "Coolify", icon: "coolify" },
      { label: "Railway", icon: "railway" },
    ],
  },
  {
    name: "Search & Tools",
    skills: [
      { label: "Typesense", icon: "typesense" },
      { label: "Git", icon: "git" },
      { label: "GitHub", icon: "github" },
      { label: "GitLab", icon: "gitlab" },
    ],
  },
];

export const ALL_SKILLS: SkillItem[] = SKILL_CATEGORIES.flatMap((c) => c.skills);

export function skillIconUrl(slug: string): string {
  return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;
}

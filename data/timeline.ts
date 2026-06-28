export type TimelineEntry = {
  id: string;
  kind: "education" | "experience";
  period: string;
  title: string;
  organization: string;
  projects?: string;
  highlights: string[];
};

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: "education",
    kind: "education",
    period: "2017 – 2021",
    title: "Bachelor of Technology – Electrical & Electronics Engineering",
    organization: "ABES Engineering College, Ghaziabad",
    highlights: ["Graduated with 8.23 SGPA"],
  },
  {
    id: "dxc",
    kind: "experience",
    period: "Aug 2021 – Nov 2022",
    title: "Associate Software Engineer",
    organization: "DXC Technology",
    projects: "Enterprise Database Systems & Cloud Migration Support",
    highlights: [
      "Managed SQL jobs, scheduling, and backend data workflows for enterprise systems",
      "Supported cloud migration initiatives, ensuring system reliability and data integrity",
      "Maintained database performance, monitoring, and operational stability",
    ],
  },
  {
    id: "megthink",
    kind: "experience",
    period: "Dec 2022 – Oct 2024",
    title: "Junior Web Developer",
    organization: "Megthink Solutions Pvt. Ltd.",
    projects: "Insurance Collection Platform & Admin Dashboards (Zurich Insurance Client)",
    highlights: [
      "Developed insurance premium collection web application for Zurich client using React.js",
      "Built multi-location admin dashboards for policy management, payments, and regional data insights",
      "Created 50+ reusable UI components and modular frontend architecture",
      "Managed source code using Git, GitHub, and GitLab",
    ],
  },
  {
    id: "kharesiya",
    kind: "experience",
    period: "Nov 2024 – Present",
    title: "React Developer",
    organization: "Kharesiya Brands",
    projects: "SellCo.ai (AI Sales & Analytics Platform), Gadda.co (D2C E-commerce Platform)",
    highlights: [
      "Led frontend development of SellCo.ai using Next.js with real-time data visualization",
      "Developed 10+ data-driven dashboard modules for sales insights and reporting",
      "Improved conversion rate by 45% and reduced page load time by 25%",
      "Integrated payment gateway and delivery APIs; handled production deployment",
    ],
  },
];

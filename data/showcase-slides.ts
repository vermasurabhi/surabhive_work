export type ShowcaseMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; posterSrc: string };

export type ShowcaseSlide = {
  id: string;
  overlayText: string;
  label: string;
  titleLine: string;
  categories: string[];
  visitUrl: string;
  media: ShowcaseMedia;
};

export const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: "wildcard",
    overlayText: "WILDCARD MOTION",
    label: "RECENT WORK",
    titleLine: "WILDCARD MOTION ‣ PORTFOLIO WEBSITE",
    categories: ["Web design"],
    visitUrl: "https://www.wildcardmotions.com/",
    media: { kind: "image", src: "/assets/wildcardmotion.png", alt: "WILDCARD MOTION project" },
  },
  {
    id: "sellco",
    overlayText: "SELLCO",
    label: "RECENT WORK",
    titleLine: "SELLCO AI ‣ ANALYTICS DASHBOARD",
    categories: ["Web Design", "Web Development", "Analytics"],
    visitUrl: "https://sellco.ai",
    media: { kind: "image", src: "/assets/sellco.png", alt: "Sellco project" },
  },
  {
    id: "gadda",
    overlayText: "GADDA CO",
    label: "RECENT WORK",
    titleLine: "GADDA CO ‣ SHOPIFY STORE",
    categories: ["ecommerce website"],
    visitUrl: "https://gadda.co",
    media: { kind: "image", src: "/assets/gadda.png", alt: "Gadda project" },
  },
  {
    id: "vidyashram",
    overlayText: "VIDYASHRAM",
    label: "RECENT WORK",
    titleLine: "VIDYASHRAM ‣ SCHOOL WEBSITE",
    categories: ["web site"],
    visitUrl: "https://vidyashram.org/",
    media: { kind: "image", src: "/assets/vidyashram.png", alt: "VIDYASHRAM project" },
  },
  {
    id: "artportfolio",
    overlayText: "ART PORTFOLIO",
    label: "RECENT WORK",
    titleLine: "ART WORK/BRANDING ‣ PERSONAL PROJECT",
    categories: ["web site"],
    visitUrl: "https://artportfolioprod.vercel.app/",
    media: { kind: "image", src: "/assets/artportfolio.png", alt: "artportfolio project" },
  },
];

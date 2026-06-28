export type CreativeHubItem = {
  id: string;
  image: string;
  alt: string;
  link: string;
  external?: boolean;
};

export const CREATIVE_HUB_ITEMS: CreativeHubItem[] = [
  {
    id: "font-hub",
    image: "/assets/fonts.jpg",
    alt: "Font Hub — favourite fonts collection",
    link: "/font-hub",
    external: false,
  },
  {
    id: "effect-hub",
    image: "/assets/effect.jpg",
    alt: "Effect Hub — interactive visual effects",
    link: "/effect-hub",
    external: false,
  },
];

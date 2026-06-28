export type EffectHubItem = {
  id: string;
  description: string;
  tags: string[];
  preview?: "liquid" | "mesh";
  image?: string;
  link?: string;
  external?: boolean;
};

export const EFFECT_HUB_ITEMS: EffectHubItem[] = [
  {
    id: "liquid-gradient",
    description: "Liquid gradient with touch effect",
    tags: ["interactive", "gradient", "touch", "hero"],
    image: "/assets/liquid_effect.png",
    link: "/liquid-hub",
    external: false,
  },
  {
    id: "mesh-gradient",
    description: "Custom mesh gradient",
    tags: ["mesh", "noise", "background", "canvas"],
    image: "/assets/mesh-generator.png",
    link: "https://gradient-generator-blond.vercel.app/",
    external: true,
  },
];

export function getEffectById(id: string): EffectHubItem | undefined {
  return EFFECT_HUB_ITEMS.find((item) => item.id === id);
}

export type FontInfo = {
  name: string;
  family: string;
  category: string;
  style: string;
  weight: number;
  italic: boolean;
  variable: boolean;
  designer: string;
  license: string;
  subsets: string[];
  source: string;
  download: string;
  /** Google Fonts CSS family param, e.g. Berkshire+Swash:wght@400 */
  googleParam: string;
  previewText?: string;
};

/** One grid card — holds one or more fonts */
export type FontHubCard = {
  id: string;
  primary: FontInfo;
  secondary?: FontInfo;
  moreFonts?: FontInfo[];
  tags: string[];
};

export const FONT_HUB_CARDS: FontHubCard[] = [
  {
    id: "script-display",
    primary: {
      name: "Berkshire Swash",
      family: "Berkshire Swash",
      category: "Script",
      style: "Regular",
      weight: 400,
      italic: false,
      variable: false,
      designer: "Astigmatic",
      license: "Open Font License",
      subsets: ["latin"],
      source: "Google Fonts",
      download: "https://fonts.google.com/download?family=Berkshire%20Swash",
      googleParam: "Berkshire+Swash:wght@400",
      previewText: "Berkshire Swash",
    },
    tags: ["script", "handwritten", "display", "open source"],
  },
  {
    id: "editorial-serifs",
    primary: {
      name: "Playfair Display",
      family: "Playfair Display",
      category: "Serif",
      style: "Regular",
      weight: 600,
      italic: false,
      variable: false,
      designer: "Claus Eggers Sørensen",
      license: "Open Font License",
      subsets: ["latin", "latin-ext"],
      source: "Google Fonts",
      download: "https://fonts.google.com/download?family=Playfair%20Display",
      googleParam: "Playfair+Display:wght@600",
      previewText: "Playfair",
    },
    secondary: {
      name: "Cormorant Garamond",
      family: "Cormorant Garamond",
      category: "Serif",
      style: "Regular",
      weight: 400,
      italic: false,
      variable: false,
      designer: "Christian Thalmann",
      license: "Open Font License",
      subsets: ["latin", "latin-ext"],
      source: "Google Fonts",
      download: "https://fonts.google.com/download?family=Cormorant%20Garamond",
      googleParam: "Cormorant+Garamond:wght@400",
      previewText: "Cormorant",
    },
    tags: ["serif", "editorial", "elegant", "open source"],
  },
  {
    id: "ui-sans",
    primary: {
      name: "Inter",
      family: "Inter",
      category: "Sans Serif",
      style: "Regular",
      weight: 400,
      italic: false,
      variable: true,
      designer: "Rasmus Andersson",
      license: "Open Font License",
      subsets: ["latin", "latin-ext"],
      source: "Google Fonts",
      download: "https://fonts.google.com/download?family=Inter",
      googleParam: "Inter:wght@400",
      previewText: "Inter",
    },
    secondary: {
      name: "Space Grotesk",
      family: "Space Grotesk",
      category: "Sans Serif",
      style: "Regular",
      weight: 400,
      italic: false,
      variable: false,
      designer: "Florian Karsten",
      license: "Open Font License",
      subsets: ["latin", "latin-ext"],
      source: "Google Fonts",
      download: "https://fonts.google.com/download?family=Space%20Grotesk",
      googleParam: "Space+Grotesk:wght@400",
      previewText: "Space Grotesk",
    },
    tags: ["sans-serif", "ui", "modern", "variable"],
  },
  {
    id: "headline-stack",
    primary: {
      name: "Playfair Display",
      family: "Playfair Display",
      category: "Serif",
      style: "Bold",
      weight: 700,
      italic: false,
      variable: false,
      designer: "Claus Eggers Sørensen",
      license: "Open Font License",
      subsets: ["latin"],
      source: "Google Fonts",
      download: "https://fonts.google.com/download?family=Playfair%20Display",
      googleParam: "Playfair+Display:wght@700",
      previewText: "Headlines",
    },
    moreFonts: [
      {
        name: "Inter",
        family: "Inter",
        category: "Sans Serif",
        style: "Regular",
        weight: 400,
        italic: false,
        variable: true,
        designer: "Rasmus Andersson",
        license: "Open Font License",
        subsets: ["latin"],
        source: "Google Fonts",
        download: "https://fonts.google.com/download?family=Inter",
        googleParam: "Inter:wght@400",
        previewText: "Body text",
      },
    ],
    tags: ["serif", "sans-serif", "pairing", "portfolio"],
  },
  {
    id: "accent-script",
    primary: {
      name: "Berkshire Swash",
      family: "Berkshire Swash",
      category: "Script",
      style: "Regular",
      weight: 400,
      italic: false,
      variable: false,
      designer: "Astigmatic",
      license: "Open Font License",
      subsets: ["latin"],
      source: "Google Fonts",
      download: "https://fonts.google.com/download?family=Berkshire%20Swash",
      googleParam: "Berkshire+Swash:wght@400",
      previewText: "Accent",
    },
    secondary: {
      name: "Cormorant Garamond",
      family: "Cormorant Garamond",
      category: "Serif",
      style: "Italic",
      weight: 400,
      italic: true,
      variable: false,
      designer: "Christian Thalmann",
      license: "Open Font License",
      subsets: ["latin"],
      source: "Google Fonts",
      download: "https://fonts.google.com/download?family=Cormorant%20Garamond",
      googleParam: "Cormorant+Garamond:ital,wght@1,400",
      previewText: "Cormorant Italic",
    },
    moreFonts: [
      {
        name: "Space Grotesk",
        family: "Space Grotesk",
        category: "Sans Serif",
        style: "Regular",
        weight: 400,
        italic: false,
        variable: false,
        designer: "Florian Karsten",
        license: "Open Font License",
        subsets: ["latin"],
        source: "Google Fonts",
        download: "https://fonts.google.com/download?family=Space%20Grotesk",
        googleParam: "Space+Grotesk:wght@400",
        previewText: "Labels",
      },
    ],
    tags: ["script", "serif", "sans-serif", "google fonts"],
  },
];

export function getFontsFromCard(card: FontHubCard): FontInfo[] {
  const fonts = [card.primary];
  if (card.secondary) fonts.push(card.secondary);
  if (card.moreFonts?.length) fonts.push(...card.moreFonts);
  return fonts;
}

export function getAllFontsFromCards(cards: FontHubCard[] = FONT_HUB_CARDS): FontInfo[] {
  return cards.flatMap(getFontsFromCard);
}

export function getCardById(
  id: string,
  cards: FontHubCard[] = FONT_HUB_CARDS,
): FontHubCard | undefined {
  return cards.find((card) => card.id === id);
}

export function getCardFontCount(card: FontHubCard): number {
  return getFontsFromCard(card).length;
}

export function getCardLabel(card: FontHubCard): string {
  const count = getCardFontCount(card);
  if (count <= 1) return card.primary.name;
  return `${card.primary.name} + ${count - 1}`;
}

export function getPreviewText(font: FontInfo): string {
  return font.previewText ?? font.name;
}

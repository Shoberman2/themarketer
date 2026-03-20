export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  ctaBackground: string;
  ctaText: string;
  gradient: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const lr = Math.min(255, Math.round(r + (255 - r) * amount));
  const lg = Math.min(255, Math.round(g + (255 - g) * amount));
  const lb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const dr = Math.max(0, Math.round(r * (1 - amount)));
  const dg = Math.max(0, Math.round(g * (1 - amount)));
  const db = Math.max(0, Math.round(b * (1 - amount)));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}

export function generatePalettes(
  primary: string,
  secondary: string,
  accent: string
): { dark: ColorPalette; light: ColorPalette; gradient: ColorPalette } {
  return {
    dark: {
      primary,
      secondary,
      accent,
      background: "#0f0f0f",
      text: "#ffffff",
      textSecondary: "#a0a0a0",
      ctaBackground: accent,
      ctaText: "#ffffff",
      gradient: `linear-gradient(135deg, #1a1a2e 0%, ${darken(primary, 0.7)} 100%)`,
    },
    light: {
      primary,
      secondary,
      accent,
      background: "#ffffff",
      text: "#1a1a1a",
      textSecondary: "#666666",
      ctaBackground: primary,
      ctaText: "#ffffff",
      gradient: `linear-gradient(135deg, ${lighten(primary, 0.9)} 0%, ${lighten(secondary, 0.85)} 100%)`,
    },
    gradient: {
      primary,
      secondary,
      accent,
      background: primary,
      text: "#ffffff",
      textSecondary: "rgba(255,255,255,0.8)",
      ctaBackground: "#ffffff",
      ctaText: primary,
      gradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)`,
    },
  };
}

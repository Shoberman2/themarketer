export interface AdSize {
  width: number;
  height: number;
  label: string;
  platform: string;
}

export const AD_SIZES: AdSize[] = [
  { width: 1080, height: 1080, label: "Square", platform: "Facebook/Instagram Feed" },
  { width: 1200, height: 628, label: "Landscape", platform: "Facebook Feed" },
  { width: 1080, height: 1920, label: "Story", platform: "Instagram Story" },
  { width: 1200, height: 627, label: "LinkedIn", platform: "LinkedIn" },
  { width: 1200, height: 675, label: "Twitter", platform: "Twitter/X" },
  { width: 300, height: 250, label: "Medium Rectangle", platform: "Google Display" },
  { width: 728, height: 90, label: "Leaderboard", platform: "Google Display" },
  { width: 160, height: 600, label: "Skyscraper", platform: "Google Display" },
];

export interface AdVariant {
  style: "dark" | "light" | "gradient";
  label: string;
}

export const AD_VARIANTS: AdVariant[] = [
  { style: "dark", label: "Dark Mode" },
  { style: "light", label: "Light Mode" },
  { style: "gradient", label: "Gradient" },
];

export interface GeneratedAd {
  id: string;
  taskId: string;
  template: string;
  variant: string;
  size: AdSize;
  imageData: string; // base64 PNG
}

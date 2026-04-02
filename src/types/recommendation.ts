import { AdTemplate } from "./plan";

export interface AdRecommendation {
  platform: string;
  platformReasoning: string;
  postingTime: string;
  postingTimeReasoning: string;
  messageAngle: "social-proof" | "price" | "quality" | "urgency" | "features";
  template: AdTemplate;
  adSize: { width: number; height: number; label: string };
  headline: string;
  subheadline: string;
  bodyText: string;
  ctaText: string;
  bulletPoints: string[];
  caption: string;
  confidence: number;
}

export const VALID_TEMPLATES: AdTemplate[] = [
  "hero-cta",
  "feature-grid",
  "testimonial",
  "comparison",
  "stats-banner",
  "problem-solution",
  "pricing-highlight",
  "social-post",
  "ugc-style",
  "case-study",
  "before-after",
  "urgency-offer",
  "app-download",
  "listicle",
  "trust-badges",
  "property-listing",
  "product-showcase",
  "food-visual",
  "video-hook",
  "travel-escape",
  "automotive",
];

export const PLATFORM_SIZES: Record<string, { width: number; height: number; label: string }> = {
  Instagram: { width: 1080, height: 1080, label: "Square" },
  Facebook: { width: 1200, height: 628, label: "Landscape" },
  LinkedIn: { width: 1200, height: 627, label: "LinkedIn" },
  "Twitter/X": { width: 1200, height: 675, label: "Twitter" },
  TikTok: { width: 1080, height: 1920, label: "Story" },
  Pinterest: { width: 1080, height: 1920, label: "Story" },
  YouTube: { width: 1200, height: 628, label: "Landscape" },
  "Google Ads": { width: 1080, height: 1080, label: "Square" },
};

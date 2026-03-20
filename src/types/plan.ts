import { SocialProfile } from "./social-profile";
import { InfluencerRecommendation } from "./influencer";

export type ContentType = "ad" | "social" | "video-script" | "email";
export type AdTemplate =
  | "hero-cta"
  | "feature-grid"
  | "testimonial"
  | "comparison"
  | "stats-banner"
  | "problem-solution"
  | "pricing-highlight"
  | "social-post"
  | "ugc-style"
  | "case-study"
  | "before-after"
  | "urgency-offer"
  | "app-download"
  | "listicle"
  | "trust-badges"
  | "property-listing"
  | "product-showcase"
  | "food-visual"
  | "video-hook"
  | "travel-escape"
  | "automotive";

export interface ImplementationGuide {
  steps: string[];
  bestTimeToPost: string;
  hashtags: string[];
  audienceTargeting: string;
  additionalTips: string;
}

export interface ContentTask {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  template: AdTemplate;
  headline: string;
  subheadline: string;
  bodyText: string;
  ctaText: string;
  bulletPoints: string[];
  platform: string;
  howToImplement?: ImplementationGuide;
}

export interface DayPlan {
  dayIndex: number;
  date: string;
  theme: string;
  weekPhase: string;
  tasks: ContentTask[];
  status: "pending" | "generated" | "skipped";
}

export interface MarketingPlan {
  id: string;
  url: string;
  createdAt: string;
  days: DayPlan[];
  weeklyThemes: string[];
  targetPlatforms?: string[];
  socialProfiles?: SocialProfile[];
  influencerRecommendations?: InfluencerRecommendation[];
  totalDays?: number;
  extendedAt?: string;
}

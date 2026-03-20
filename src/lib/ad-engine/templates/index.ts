import { AdTemplate, ContentTask } from "@/types/plan";
import { ColorPalette } from "../palettes";
import { HeroCta } from "./hero-cta";
import { FeatureGrid } from "./feature-grid";
import { Testimonial } from "./testimonial";
import { Comparison } from "./comparison";
import { StatsBanner } from "./stats-banner";
import { ProblemSolution } from "./problem-solution";
import { PricingHighlight } from "./pricing-highlight";
import { SocialPost } from "./social-post";
import { UgcStyle } from "./ugc-style";
import { CaseStudy } from "./case-study";
import { BeforeAfter } from "./before-after";
import { UrgencyOffer } from "./urgency-offer";
import { AppDownload } from "./app-download";
import { Listicle } from "./listicle";
import { TrustBadges } from "./trust-badges";
import { PropertyListing } from "./property-listing";
import { ProductShowcase } from "./product-showcase";
import { FoodVisual } from "./food-visual";
import { VideoHook } from "./video-hook";
import { TravelEscape } from "./travel-escape";
import { Automotive } from "./automotive";
import React from "react";

type TemplateComponent = (props: {
  task: ContentTask;
  palette: ColorPalette;
  width: number;
  height: number;
}) => React.ReactElement;

const TEMPLATE_MAP: Record<AdTemplate, TemplateComponent> = {
  "hero-cta": HeroCta,
  "feature-grid": FeatureGrid,
  testimonial: Testimonial,
  comparison: Comparison,
  "stats-banner": StatsBanner,
  "problem-solution": ProblemSolution,
  "pricing-highlight": PricingHighlight,
  "social-post": SocialPost,
  "ugc-style": UgcStyle,
  "case-study": CaseStudy,
  "before-after": BeforeAfter,
  "urgency-offer": UrgencyOffer,
  "app-download": AppDownload,
  listicle: Listicle,
  "trust-badges": TrustBadges,
  "property-listing": PropertyListing,
  "product-showcase": ProductShowcase,
  "food-visual": FoodVisual,
  "video-hook": VideoHook,
  "travel-escape": TravelEscape,
  automotive: Automotive,
};

export function getTemplate(name: AdTemplate): TemplateComponent {
  return TEMPLATE_MAP[name] || TEMPLATE_MAP["hero-cta"];
}

export function renderTemplate(
  templateName: AdTemplate,
  task: ContentTask,
  palette: ColorPalette,
  width: number,
  height: number
): React.ReactElement {
  const Template = getTemplate(templateName);
  return React.createElement(Template, { task, palette, width, height });
}

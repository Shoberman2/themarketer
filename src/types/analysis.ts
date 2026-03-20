export interface ScrapedData {
  url: string;
  title: string;
  description: string;
  headings: string[];
  paragraphs: string[];
  metaTags: Record<string, string>;
  colors: string[];
  imageUrls: string[];
  pricingContent: string[];
  testimonials: string[];
  features: string[];
  ctaTexts: string[];
}

export interface BrandProfile {
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  industry: string;
  tone: string;
}

export interface WebsiteAnalysis {
  brand: BrandProfile;
  valuePropositions: string[];
  targetAudience: string[];
  keyFeatures: { title: string; description: string }[];
  socialProof: string[];
  competitiveAdvantages: string[];
  pricingInfo: string | null;
  callToAction: string;
}

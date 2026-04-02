import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateRecommendation, formatPerformanceHistory } from "./recommend";
import { WebsiteAnalysis } from "@/types/analysis";
import { PerformanceReport } from "@/types/performance";

vi.mock("./openai", () => ({
  generateJSON: vi.fn(),
}));

import { generateJSON } from "./openai";

const mockAnalysis: WebsiteAnalysis = {
  brand: {
    name: "Acme Fitness",
    tagline: "Get fit fast",
    primaryColor: "#e63946",
    secondaryColor: "#1d3557",
    accentColor: "#f1faee",
    industry: "Fitness & Wellness",
    tone: "Energetic and motivational",
  },
  valuePropositions: ["30-minute HIIT classes"],
  targetAudience: ["Busy professionals"],
  keyFeatures: [{ title: "HIIT", description: "High intensity training" }],
  socialProof: ["2000+ members"],
  competitiveAdvantages: ["Flexible scheduling"],
  pricingInfo: "$49/mo",
  callToAction: "Start Free Trial",
};

const validRecommendation = {
  platform: "Instagram",
  platformReasoning: "Instagram has high engagement for fitness brands.",
  postingTime: "7:00 PM",
  postingTimeReasoning: "Evening posts get more engagement.",
  messageAngle: "social-proof" as const,
  template: "hero-cta" as const,
  adSize: { width: 1080, height: 1080, label: "Square" },
  headline: "Transform Your Body",
  subheadline: "Join 2000+ members",
  bodyText: "Get fit with 30-minute HIIT classes.",
  ctaText: "Start Free Trial",
  bulletPoints: ["Flexible scheduling", "Expert trainers"],
  caption: "Transform your body today! #fitness #HIIT",
  confidence: 8,
};

describe("generateRecommendation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a valid recommendation with all fields", async () => {
    vi.mocked(generateJSON).mockResolvedValue(validRecommendation);

    const result = await generateRecommendation(mockAnalysis);

    expect(result.platform).toBe("Instagram");
    expect(result.template).toBe("hero-cta");
    expect(result.headline).toBe("Transform Your Body");
    expect(result.confidence).toBe(8);
    expect(result.adSize).toEqual({ width: 1080, height: 1080, label: "Square" });
  });

  it("falls back to hero-cta for invalid template names", async () => {
    vi.mocked(generateJSON).mockResolvedValue({
      ...validRecommendation,
      template: "nonexistent-template",
    });

    const result = await generateRecommendation(mockAnalysis);
    expect(result.template).toBe("hero-cta");
  });

  it("corrects adSize to match platform", async () => {
    vi.mocked(generateJSON).mockResolvedValue({
      ...validRecommendation,
      platform: "Facebook",
      adSize: { width: 1080, height: 1080, label: "Square" }, // wrong for Facebook
    });

    const result = await generateRecommendation(mockAnalysis);
    expect(result.adSize).toEqual({ width: 1200, height: 628, label: "Landscape" });
  });

  it("defaults adSize to Square for unknown platforms", async () => {
    vi.mocked(generateJSON).mockResolvedValue({
      ...validRecommendation,
      platform: "SomeNewPlatform",
    });

    const result = await generateRecommendation(mockAnalysis);
    expect(result.adSize).toEqual({ width: 1080, height: 1080, label: "Square" });
  });

  it("clamps confidence to 1-10 range", async () => {
    vi.mocked(generateJSON).mockResolvedValue({
      ...validRecommendation,
      confidence: 15,
    });

    const result = await generateRecommendation(mockAnalysis);
    expect(result.confidence).toBe(10);
  });

  it("sets confidence to 5 if missing", async () => {
    vi.mocked(generateJSON).mockResolvedValue({
      ...validRecommendation,
      confidence: undefined,
    });

    const result = await generateRecommendation(mockAnalysis);
    expect(result.confidence).toBe(5);
  });

  it("passes performance history to the prompt", async () => {
    vi.mocked(generateJSON).mockResolvedValue(validRecommendation);

    const history: PerformanceReport[] = [
      {
        id: "r1",
        recommendationId: "rec1",
        platform: "Instagram",
        template: "hero-cta",
        messageAngle: "social-proof",
        postedAt: "2026-04-01T19:00:00Z",
        likes: 45,
        comments: 12,
        shares: 3,
        reach: 890,
        userNotes: "",
        reportedAt: "2026-04-02T10:00:00Z",
        engagementRate: 0.0674,
      },
    ];

    await generateRecommendation(mockAnalysis, history);

    const promptArg = vi.mocked(generateJSON).mock.calls[0][1];
    expect(promptArg).toContain("PERFORMANCE HISTORY");
    expect(promptArg).toContain("45 likes");
    expect(promptArg).toContain("Instagram");
    expect(promptArg).toContain("6.7% ER");
  });

  it("works without performance history", async () => {
    vi.mocked(generateJSON).mockResolvedValue(validRecommendation);

    await generateRecommendation(mockAnalysis);

    const promptArg = vi.mocked(generateJSON).mock.calls[0][1];
    expect(promptArg).not.toContain("PERFORMANCE HISTORY");
  });
});

describe("formatPerformanceHistory", () => {
  it("returns empty string for no reports", () => {
    expect(formatPerformanceHistory([])).toBe("");
  });

  it("formats reports with engagement rate", () => {
    const reports: PerformanceReport[] = [
      {
        id: "r1",
        recommendationId: "rec1",
        platform: "Instagram",
        template: "hero-cta",
        messageAngle: "social-proof",
        postedAt: "2026-04-01",
        likes: 45,
        comments: 12,
        shares: 3,
        reach: 890,
        userNotes: "",
        reportedAt: "2026-04-02",
        engagementRate: 0.0674,
      },
    ];

    const result = formatPerformanceHistory(reports);
    expect(result).toContain("PERFORMANCE HISTORY");
    expect(result).toContain("1 reports");
    expect(result).toContain("45 likes");
    expect(result).toContain("890 reach");
    expect(result).toContain("6.7% ER");
  });

  it("handles null reach gracefully", () => {
    const reports: PerformanceReport[] = [
      {
        id: "r1",
        recommendationId: "rec1",
        platform: "Facebook",
        template: "urgency-offer",
        messageAngle: "price",
        postedAt: "2026-04-01",
        likes: 10,
        comments: 2,
        shares: 1,
        reach: null,
        userNotes: "",
        reportedAt: "2026-04-02",
        engagementRate: null,
      },
    ];

    const result = formatPerformanceHistory(reports);
    expect(result).toContain("10 likes");
    expect(result).not.toContain("reach");
    expect(result).not.toContain("ER)");
  });
});

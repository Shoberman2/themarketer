import { NextRequest, NextResponse } from "next/server";
import { generateRecommendation } from "@/lib/ai/recommend";
import { renderSingleAdVariant } from "@/lib/ad-engine/renderer";
import { saveRecommendation, getRecentPerformanceHistory } from "@/lib/db/queries";
import { ContentTask } from "@/types/plan";
import { z } from "zod";
import { nanoid } from "nanoid";

const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  industry: z.string(),
  tone: z.string(),
});

const AnalysisSchema = z.object({
  brand: BrandSchema,
  valuePropositions: z.array(z.string()),
  targetAudience: z.array(z.string()),
  keyFeatures: z.array(z.object({ title: z.string(), description: z.string() })),
  socialProof: z.array(z.string()),
  competitiveAdvantages: z.array(z.string()),
  pricingInfo: z.string().nullable(),
  callToAction: z.string(),
});

const RequestSchema = z.object({
  analysis: AnalysisSchema,
  url: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis, url } = RequestSchema.parse(body);

    // Fetch performance history scoped to this URL
    const history = getRecentPerformanceHistory(10, url);

    const recommendation = await generateRecommendation(analysis, history);

    // Construct ContentTask from recommendation
    const task: ContentTask = {
      id: nanoid(12),
      type: "ad",
      title: `${recommendation.platform} Ad`,
      description: recommendation.platformReasoning,
      template: recommendation.template,
      headline: recommendation.headline,
      subheadline: recommendation.subheadline,
      bodyText: recommendation.bodyText,
      ctaText: recommendation.ctaText,
      bulletPoints: recommendation.bulletPoints,
      platform: recommendation.platform,
    };

    // Render single ad — light variant, platform-optimal size
    let imageData: string | null = null;
    try {
      const adSize = {
        width: recommendation.adSize.width,
        height: recommendation.adSize.height,
        label: recommendation.adSize.label,
        platform: recommendation.platform,
      };
      imageData = await renderSingleAdVariant(task, analysis.brand, "light", adSize);
    } catch (renderError) {
      console.error("Ad render failed:", renderError);
    }

    // Persist the recommendation so performance reports can reference it
    const recommendationId = saveRecommendation(
      url || "",
      analysis,
      recommendation,
      imageData
    );

    return NextResponse.json({ recommendation, imageData, recommendationId });
  } catch (error) {
    console.error("Recommendation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate recommendation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

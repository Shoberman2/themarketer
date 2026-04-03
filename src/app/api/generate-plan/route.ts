import { NextRequest, NextResponse } from "next/server";
import { generateMarketingPlan } from "@/lib/ai/generate-plan";
import { savePlan } from "@/lib/db/queries";
import { WebsiteAnalysis } from "@/types/analysis";
import { z } from "zod";

const RequestSchema = z.object({
  url: z.string().url(),
  analysis: z.any(),
  platforms: z.array(z.string()).optional(),
  socialProfiles: z
    .array(
      z.object({
        platform: z.string(),
        handle: z.string(),
        followerCount: z.number(),
        engagementRate: z.number(),
      })
    )
    .optional(),
  brandId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, analysis, platforms, socialProfiles, brandId } =
      RequestSchema.parse(body);
    const typedAnalysis = analysis as WebsiteAnalysis;

    const plan = await generateMarketingPlan(
      url,
      typedAnalysis,
      platforms,
      socialProfiles
    );
    savePlan(plan, typedAnalysis, brandId);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Plan generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

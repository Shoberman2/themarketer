import { WebsiteAnalysis } from "@/types/analysis";
import { AdRecommendation, VALID_TEMPLATES, PLATFORM_SIZES } from "@/types/recommendation";
import { AdTemplate } from "@/types/plan";
import { PerformanceReport } from "@/types/performance";
import { generateJSON } from "./openai";
import { RECOMMEND_SYSTEM_PROMPT, buildRecommendPrompt } from "./prompts";

export function formatPerformanceHistory(reports: PerformanceReport[]): string {
  if (reports.length === 0) return "";
  const lines = reports.map((r) => {
    const er = r.engagementRate !== null ? ` (${(r.engagementRate * 100).toFixed(1)}% ER)` : "";
    return `- ${r.platform}, ${r.template}, ${r.messageAngle}, posted ${r.postedAt}: ${r.likes} likes, ${r.comments} comments, ${r.shares} shares${r.reach !== null ? `, ${r.reach} reach` : ""}${er}`;
  });
  return `\n\nPERFORMANCE HISTORY (most recent first, ${reports.length} reports):\n${lines.join("\n")}\nNote: Not all posts have been tracked. Weight your recommendation toward patterns that performed well.`;
}

export async function generateRecommendation(
  analysis: WebsiteAnalysis,
  performanceHistory?: PerformanceReport[]
): Promise<AdRecommendation> {
  const analysisStr = JSON.stringify(analysis, null, 2);
  const historyStr = performanceHistory ? formatPerformanceHistory(performanceHistory) : "";
  const recommendation = await generateJSON<AdRecommendation>(
    RECOMMEND_SYSTEM_PROMPT,
    buildRecommendPrompt(analysisStr) + historyStr
  );

  // Validate template — fallback to hero-cta if GPT returns an invalid name
  if (!VALID_TEMPLATES.includes(recommendation.template as AdTemplate)) {
    recommendation.template = "hero-cta";
  }

  // Validate adSize — ensure it matches the platform
  const expectedSize = PLATFORM_SIZES[recommendation.platform];
  if (expectedSize) {
    recommendation.adSize = expectedSize;
  } else {
    // Default to Square if unknown platform
    recommendation.adSize = { width: 1080, height: 1080, label: "Square" };
  }

  // Clamp confidence to 1-10
  recommendation.confidence = Math.max(1, Math.min(10, Math.round(recommendation.confidence || 5)));

  return recommendation;
}

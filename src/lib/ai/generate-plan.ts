import { WebsiteAnalysis } from "@/types/analysis";
import { MarketingPlan, DayPlan, ContentTask } from "@/types/plan";
import { SocialProfile } from "@/types/social-profile";
import { InfluencerRecommendation } from "@/types/influencer";
import { generateJSON } from "./openai";
import {
  PLAN_SYSTEM_PROMPT,
  EXTEND_PLAN_SYSTEM_PROMPT,
  buildPlanPrompt,
  buildExtendPrompt,
} from "./prompts";
import { getMatchingInfluencers } from "@/lib/influencers/database";
import { nanoid } from "nanoid";

interface PlanResponse {
  days: {
    dayIndex: number;
    theme: string;
    weekPhase: string;
    tasks: Omit<ContentTask, "id">[];
  }[];
  weeklyThemes: string[];
  influencerRecommendations?: InfluencerRecommendation[];
}

export async function generateMarketingPlan(
  url: string,
  analysis: WebsiteAnalysis,
  platforms?: string[],
  socialProfiles?: SocialProfile[]
): Promise<MarketingPlan> {
  const planId = nanoid(12);
  const analysisStr = JSON.stringify(analysis, null, 2);

  let socialProfilesStr: string | undefined;
  if (socialProfiles && socialProfiles.length > 0) {
    socialProfilesStr = socialProfiles
      .map(
        (p) =>
          `${p.platform}: ${p.handle || "N/A"}, ${p.followerCount.toLocaleString()} followers, ${p.engagementRate}% engagement`
      )
      .join("\n");
  }

  const response = await generateJSON<PlanResponse>(
    PLAN_SYSTEM_PROMPT,
    buildPlanPrompt(
      analysis.brand.name,
      analysisStr,
      platforms,
      socialProfilesStr
    )
  );

  const startDate = new Date();
  const days: DayPlan[] = response.days.map((day, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);

    return {
      dayIndex: index,
      date: date.toISOString().split("T")[0],
      theme: day.theme,
      weekPhase: day.weekPhase,
      status: "pending" as const,
      tasks: day.tasks.map((task) => ({
        ...task,
        id: nanoid(8),
      })),
    };
  });

  // Merge AI-generated influencers with curated database matches
  const curatedInfluencers = getMatchingInfluencers(
    analysis.brand.industry,
    platforms,
    15
  );
  const aiInfluencers = response.influencerRecommendations || [];

  // Deduplicate by name (prefer curated since they have richer data)
  const seenNames = new Set<string>();
  const mergedInfluencers: InfluencerRecommendation[] = [];

  for (const inf of curatedInfluencers) {
    const key = inf.name.toLowerCase();
    if (!seenNames.has(key)) {
      seenNames.add(key);
      mergedInfluencers.push(inf);
    }
  }
  for (const inf of aiInfluencers) {
    const key = inf.name.toLowerCase();
    if (!seenNames.has(key)) {
      seenNames.add(key);
      mergedInfluencers.push(inf);
    }
  }

  return {
    id: planId,
    url,
    createdAt: new Date().toISOString(),
    days,
    weeklyThemes: response.weeklyThemes,
    targetPlatforms: platforms,
    socialProfiles,
    influencerRecommendations: mergedInfluencers,
    totalDays: 30,
  };
}

interface ExtendResponse {
  days: {
    dayIndex: number;
    theme: string;
    weekPhase: string;
    tasks: Omit<ContentTask, "id">[];
  }[];
  weeklyThemes: string[];
}

export async function extendMarketingPlan(
  existingPlan: MarketingPlan,
  analysis: WebsiteAnalysis
): Promise<{ newDays: DayPlan[]; newWeeklyThemes: string[] }> {
  const analysisStr = JSON.stringify(analysis, null, 2);

  const existingSummary = existingPlan.weeklyThemes
    .map((theme, i) => `Week ${i + 1}: ${theme}`)
    .join("\n");

  const response = await generateJSON<ExtendResponse>(
    EXTEND_PLAN_SYSTEM_PROMPT,
    buildExtendPrompt(
      analysis.brand.name,
      analysisStr,
      existingSummary,
      existingPlan.targetPlatforms
    )
  );

  const lastDay = existingPlan.days[existingPlan.days.length - 1];
  const lastDate = new Date(lastDay.date + "T00:00:00");

  const newDays: DayPlan[] = response.days.map((day, index) => {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + index + 1);

    return {
      dayIndex: 30 + index,
      date: date.toISOString().split("T")[0],
      theme: day.theme,
      weekPhase: day.weekPhase,
      status: "pending" as const,
      tasks: day.tasks.map((task) => ({
        ...task,
        id: nanoid(8),
      })),
    };
  });

  return {
    newDays,
    newWeeklyThemes: response.weeklyThemes,
  };
}

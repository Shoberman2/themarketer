import { NextResponse } from "next/server";
import { getBrand, getRecentPerformanceHistory, getPerformanceReportCount } from "@/lib/db/queries";
import { generateClaudeJSON } from "@/lib/ai/claude";
import { assembleBriefPrompt } from "@/lib/ai/prompt-assembler";
import { seedBrandMemories, } from "@/lib/ai/agent-seed";
import {
  getOrCreateArc,
  getTodayBrief,
  saveBrief,
  countApprovedBriefs,
} from "@/lib/db/agent-queries";
import { computeEngagementRate } from "@/types/performance";
import { VALID_TEMPLATES, PLATFORM_SIZES } from "@/types/recommendation";
import { AdTemplate } from "@/types/plan";

interface BriefResponse {
  content_recommendation: {
    headline: string;
    subheadline: string;
    body: string;
    cta: string;
    template: string;
    platform: string;
    confidence: number;
    reasoning: string;
  };
  performance_summary: {
    agent_commentary: string;
  };
  campaign_arc: {
    phase_recommendation: string | null;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json({ error: "brandId required" }, { status: 400 });
    }

    const brand = getBrand(brandId);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Check graduation status
    const approvedCount = countApprovedBriefs(brandId);
    const reportCount = getPerformanceReportCount(brandId);
    const graduated = approvedCount >= 3 && reportCount >= 1;

    // Check for cached today's brief
    const cached = getTodayBrief(brandId);
    if (cached) {
      return NextResponse.json({
        brief: cached.briefData,
        briefId: cached.id,
        action: cached.action,
        graduated,
        approvedCount,
        reportCount,
      });
    }

    // Auto-seed memories if needed
    seedBrandMemories(brandId);

    // Gather performance data for the prompt
    const recentReports = getRecentPerformanceHistory(10, brandId);
    const arc = getOrCreateArc(brandId);

    // Build performance context for the prompt
    let perfContext = "";
    if (recentReports.length > 0) {
      const last7 = recentReports.filter((r) => {
        const days = (Date.now() - new Date(r.reportedAt).getTime()) / 86400000;
        return days <= 7;
      });

      if (last7.length > 0) {
        const avgEr =
          last7.reduce((sum, r) => sum + (r.engagementRate || 0), 0) /
          last7.length;
        const prevWeek = recentReports.filter((r) => {
          const days = (Date.now() - new Date(r.reportedAt).getTime()) / 86400000;
          return days > 7 && days <= 14;
        });
        const prevAvgEr =
          prevWeek.length > 0
            ? prevWeek.reduce((sum, r) => sum + (r.engagementRate || 0), 0) /
              prevWeek.length
            : null;

        let trend: string = "insufficient_data";
        if (prevAvgEr !== null) {
          if (avgEr > prevAvgEr * 1.1) trend = "improving";
          else if (avgEr < prevAvgEr * 0.9) trend = "declining";
          else trend = "stable";
        }

        // Find top performer
        const topReport = [...last7].sort(
          (a, b) => (b.engagementRate || 0) - (a.engagementRate || 0)
        )[0];
        const topPerformer = topReport
          ? `${topReport.messageAngle} on ${topReport.platform}, ${topReport.postedAt}`
          : null;

        perfContext = `\n\nLAST 7 DAYS PERFORMANCE:\n- Average ER: ${(avgEr * 100).toFixed(1)}%\n- Trend: ${trend}\n- Reports: ${last7.length}\n${topPerformer ? `- Top performer: ${topPerformer}` : ""}`;
      }

      // Add full history
      perfContext += `\n\nFULL HISTORY (${recentReports.length} reports):\n`;
      recentReports.forEach((r) => {
        const er = r.engagementRate
          ? ` (${(r.engagementRate * 100).toFixed(1)}% ER)`
          : "";
        perfContext += `- ${r.platform}, ${r.template}, ${r.messageAngle}, ${r.postedAt}: ${r.likes}L ${r.comments}C ${r.shares}S${er}\n`;
      });
    }

    // Generate brief
    const systemPrompt = assembleBriefPrompt(brand, brandId);
    const result = await generateClaudeJSON<BriefResponse>(
      systemPrompt,
      `Generate today's morning brief for ${brand.name}.${perfContext}`
    );

    // Validate template
    if (
      !VALID_TEMPLATES.includes(
        result.content_recommendation.template as AdTemplate
      )
    ) {
      result.content_recommendation.template = "hero-cta";
    }

    // Clamp confidence
    result.content_recommendation.confidence = Math.max(
      1,
      Math.min(10, Math.round(result.content_recommendation.confidence || 5))
    );

    // Truncate commentary to 280 chars
    if (result.performance_summary.agent_commentary?.length > 280) {
      result.performance_summary.agent_commentary =
        result.performance_summary.agent_commentary.slice(0, 277) + "...";
    }

    // Get ad size for the platform
    const adSize = PLATFORM_SIZES[result.content_recommendation.platform] || {
      width: 1080,
      height: 1080,
      label: "Square",
    };

    // Compute performance summary stats
    const last7Reports = recentReports.filter((r) => {
      const days = (Date.now() - new Date(r.reportedAt).getTime()) / 86400000;
      return days <= 7;
    });
    const avgEr =
      last7Reports.length > 0
        ? last7Reports.reduce((sum, r) => sum + (r.engagementRate || 0), 0) /
          last7Reports.length
        : null;

    const daysInPhase = Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(arc.phaseStartedAt).getTime()) / 86400000
      )
    );

    const brief = {
      brand_id: brandId,
      generated_at: new Date().toISOString(),
      content_recommendation: {
        ...result.content_recommendation,
        adSize,
      },
      performance_summary: {
        last_7_days_avg_er: avgEr,
        trend:
          last7Reports.length >= 2 ? computeTrend(recentReports) : "insufficient_data",
        top_performer: findTopPerformer(last7Reports),
        agent_commentary: result.performance_summary.agent_commentary || "",
      },
      campaign_arc: {
        current_phase: arc.currentPhase,
        days_in_phase: daysInPhase,
        phase_recommendation: result.campaign_arc.phase_recommendation || arc.agentRecommendation || null,
      },
    };

    // Cache the brief
    const briefId = saveBrief(brandId, brief);

    return NextResponse.json({
      brief,
      briefId,
      action: null,
      graduated,
      approvedCount,
      reportCount,
    });
  } catch (err) {
    console.error("Agent brief error:", err);
    return NextResponse.json(
      { error: "Failed to generate brief" },
      { status: 500 }
    );
  }
}

function computeTrend(
  reports: { engagementRate: number | null; reportedAt: string }[]
): string {
  const last7 = reports.filter((r) => {
    const days = (Date.now() - new Date(r.reportedAt).getTime()) / 86400000;
    return days <= 7;
  });
  const prev7 = reports.filter((r) => {
    const days = (Date.now() - new Date(r.reportedAt).getTime()) / 86400000;
    return days > 7 && days <= 14;
  });

  if (last7.length === 0 || prev7.length === 0) return "insufficient_data";

  const avgLast =
    last7.reduce((s, r) => s + (r.engagementRate || 0), 0) / last7.length;
  const avgPrev =
    prev7.reduce((s, r) => s + (r.engagementRate || 0), 0) / prev7.length;

  if (avgLast > avgPrev * 1.1) return "improving";
  if (avgLast < avgPrev * 0.9) return "declining";
  return "stable";
}

function findTopPerformer(
  reports: {
    engagementRate: number | null;
    messageAngle: string;
    platform: string;
    postedAt: string;
  }[]
): string | null {
  if (reports.length === 0) return null;
  const top = [...reports].sort(
    (a, b) => (b.engagementRate || 0) - (a.engagementRate || 0)
  )[0];
  return `${top.messageAngle} on ${top.platform}, ${top.postedAt}`;
}

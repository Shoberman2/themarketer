import { NextResponse } from "next/server";
import { getBrand, listPerformanceReports } from "@/lib/db/queries";
import { generateClaudeJSON } from "@/lib/ai/claude";
import { assembleAnalysisPrompt } from "@/lib/ai/prompt-assembler";
import { seedBrandMemories } from "@/lib/ai/agent-seed";
import {
  upsertMemory,
  getOrCreateArc,
  updateArc,
  upsertInsight,
} from "@/lib/db/agent-queries";

interface AnalysisResult {
  commentary: string;
  strategy_update: string;
  phase_recommendation: "stay" | "transition";
  next_phase?: string;
  pattern_insights: {
    type: string;
    key: string;
    observation: string;
  }[];
}

const PHASE_ORDER = ["awareness", "consideration", "conversion", "retention"];

export async function POST(request: Request) {
  try {
    const { brandId, reportId } = await request.json();
    if (!brandId) {
      return NextResponse.json({ error: "brandId required" }, { status: 400 });
    }

    const brand = getBrand(brandId);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    seedBrandMemories(brandId);

    // Get all performance reports for this brand
    const reports = listPerformanceReports(brandId);
    if (reports.length === 0) {
      return NextResponse.json({
        commentary: "No performance data yet. After 3 reports, I'll start seeing patterns.",
        strategy_update: null,
      });
    }

    // Build report context
    const reportContext = reports
      .slice(0, 20)
      .map((r) => {
        const er = r.engagementRate
          ? ` (${(r.engagementRate * 100).toFixed(1)}% ER)`
          : "";
        return `- ${r.platform}, ${r.template}, ${r.messageAngle}, ${r.postedAt}: ${r.likes}L ${r.comments}C ${r.shares}S${er}${r.userNotes ? ` — Note: ${r.userNotes}` : ""}`;
      })
      .join("\n");

    const systemPrompt = assembleAnalysisPrompt(brand, brandId);
    const result = await generateClaudeJSON<AnalysisResult>(
      systemPrompt,
      `Analyze performance data for ${brand.name} (${reports.length} total reports):\n\n${reportContext}`
    );

    // Truncate commentary
    if (result.commentary?.length > 280) {
      result.commentary = result.commentary.slice(0, 277) + "...";
    }

    // Store analysis as memory
    const now = new Date().toISOString().split("T")[0];
    upsertMemory(
      brandId,
      `/performance/analysis/${now}.md`,
      [
        `# Performance Analysis: ${now}`,
        "",
        result.commentary,
        "",
        `**Strategy:** ${result.strategy_update}`,
        "",
        result.pattern_insights?.length
          ? `**Patterns:**\n${result.pattern_insights.map((p) => `- ${p.type}: ${p.key} — ${p.observation}`).join("\n")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
      "performance"
    );

    // Update strategy memory
    upsertMemory(
      brandId,
      "/strategy/current-arc.md",
      [
        `# Current Strategy`,
        `Updated: ${now}`,
        "",
        result.strategy_update,
        "",
        `Phase recommendation: ${result.phase_recommendation}`,
        result.next_phase ? `Suggested next phase: ${result.next_phase}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      "agent"
    );

    // Update campaign arc
    const arc = getOrCreateArc(brandId);
    const phaseReports = reports.filter((r) => {
      return new Date(r.reportedAt) >= new Date(arc.phaseStartedAt);
    });
    const phaseAvgEr =
      phaseReports.length > 0
        ? phaseReports.reduce((s, r) => s + (r.engagementRate || 0), 0) /
          phaseReports.length
        : 0;

    if (
      result.phase_recommendation === "transition" &&
      result.next_phase &&
      PHASE_ORDER.includes(result.next_phase)
    ) {
      updateArc(brandId, {
        currentPhase: result.next_phase,
        phaseStartedAt: new Date().toISOString(),
        phasePerfAvgEr: 0,
        phaseReportCount: 0,
        agentRecommendation: result.strategy_update,
      });
    } else {
      updateArc(brandId, {
        phasePerfAvgEr: phaseAvgEr,
        phaseReportCount: phaseReports.length,
        agentRecommendation: result.strategy_update,
      });
    }

    // Update portfolio insights
    if (result.pattern_insights?.length) {
      for (const insight of result.pattern_insights) {
        const existing = {
          observation: insight.observation,
          brand: brand.name,
          brand_id: brandId,
          updated: now,
          sample_size: reports.length,
        };
        upsertInsight(insight.type, insight.key, existing);
      }
    }

    return NextResponse.json({
      commentary: result.commentary,
      strategy_update: result.strategy_update,
      phase_recommendation: result.phase_recommendation,
      next_phase: result.next_phase,
      pattern_insights: result.pattern_insights,
    });
  } catch (err) {
    console.error("Agent analyze error:", err);
    return NextResponse.json(
      { error: "Failed to analyze performance" },
      { status: 500 }
    );
  }
}

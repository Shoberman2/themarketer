import { NextRequest, NextResponse } from "next/server";
import { extendMarketingPlan } from "@/lib/ai/generate-plan";
import { getPlan, appendDaysToPlan } from "@/lib/db/queries";
import { z } from "zod";

const RequestSchema = z.object({
  planId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId } = RequestSchema.parse(body);

    const data = getPlan(planId);
    if (!data) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const { plan, analysis } = data;

    if (plan.extendedAt || (plan.totalDays && plan.totalDays > 30)) {
      return NextResponse.json(
        { error: "Plan has already been extended" },
        { status: 400 }
      );
    }

    const { newDays, newWeeklyThemes } = await extendMarketingPlan(
      plan,
      analysis
    );

    const updatedWeeklyThemes = [...plan.weeklyThemes, ...newWeeklyThemes];
    appendDaysToPlan(planId, newDays, updatedWeeklyThemes);

    const updatedPlan = {
      ...plan,
      days: [...plan.days, ...newDays],
      weeklyThemes: updatedWeeklyThemes,
      totalDays: 60,
      extendedAt: new Date().toISOString(),
    };

    return NextResponse.json({ plan: updatedPlan });
  } catch (error) {
    console.error("Plan extension error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to extend plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

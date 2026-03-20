import { NextRequest, NextResponse } from "next/server";
import { renderAdsForTask } from "@/lib/ad-engine/renderer";
import { getPlan, updateDayStatus, saveGeneratedAsset } from "@/lib/db/queries";
import { z } from "zod";

const RequestSchema = z.object({
  planId: z.string(),
  dayIndex: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, dayIndex } = RequestSchema.parse(body);

    const result = getPlan(planId);
    if (!result) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const { plan, analysis } = result;
    const day = plan.days[dayIndex];
    if (!day) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    const allAds: {
      taskId: string;
      taskTitle: string;
      template: string;
      variant: string;
      sizeLabel: string;
      platform: string;
      imageData: string;
    }[] = [];

    for (const task of day.tasks) {
      if (task.type === "video-script") continue;

      const ads = await renderAdsForTask(task, analysis.brand);
      for (const ad of ads) {
        saveGeneratedAsset(
          task.id,
          planId,
          ad.variant,
          ad.sizeLabel,
          ad.imageData
        );
        allAds.push({
          taskId: task.id,
          taskTitle: task.title,
          template: task.template,
          ...ad,
        });
      }
    }

    updateDayStatus(planId, dayIndex, "generated");

    return NextResponse.json({ ads: allAds });
  } catch (error) {
    console.error("Content generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

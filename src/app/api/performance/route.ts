import { NextRequest, NextResponse } from "next/server";
import { savePerformanceReport, listPerformanceReports, getPerformanceReportCount } from "@/lib/db/queries";
import { z } from "zod";

const CreateSchema = z.object({
  recommendationId: z.string(),
  platform: z.string(),
  template: z.string(),
  messageAngle: z.string().default(""),
  postedAt: z.string(),
  likes: z.number().int().min(0),
  comments: z.number().int().min(0),
  shares: z.number().int().min(0),
  reach: z.number().int().min(0).nullable().default(null),
  userNotes: z.string().default(""),
  brandId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateSchema.parse(body);
    const id = savePerformanceReport(data);

    // Trigger agent analysis in the background (non-blocking)
    let agentCommentary: string | null = null;
    if (data.brandId) {
      try {
        const origin = request.nextUrl.origin;
        const analysisRes = await fetch(`${origin}/api/agent/analyze-performance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandId: data.brandId, reportId: id }),
        });
        if (analysisRes.ok) {
          const analysis = await analysisRes.json();
          agentCommentary = analysis.commentary;
        }
      } catch {
        // Agent analysis is non-critical
      }
    }

    return NextResponse.json({ id, agentCommentary });
  } catch (error) {
    console.error("Save performance report error:", error);
    const message = error instanceof Error ? error.message : "Failed to save report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId") || undefined;
    const reports = listPerformanceReports(brandId);
    const totalCount = getPerformanceReportCount(brandId);
    return NextResponse.json({ reports, totalCount });
  } catch (error) {
    console.error("List performance reports error:", error);
    return NextResponse.json({ error: "Failed to list reports" }, { status: 500 });
  }
}

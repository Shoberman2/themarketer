import { NextRequest, NextResponse } from "next/server";
import { listPerformanceReports, getPerformanceReportCount, listBrands, getBrand } from "@/lib/db/queries";
import { computeEngagementRate } from "@/types/performance";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId") || undefined;

    const reports = listPerformanceReports(brandId);
    const totalCount = getPerformanceReportCount(brandId);
    const brand = brandId ? getBrand(brandId) : null;

    // Compute summary stats
    const totalLikes = reports.reduce((s, r) => s + r.likes, 0);
    const totalComments = reports.reduce((s, r) => s + r.comments, 0);
    const totalShares = reports.reduce((s, r) => s + r.shares, 0);
    const reportsWithReach = reports.filter((r) => r.reach !== null && r.reach > 0);
    const avgEngagement = reportsWithReach.length > 0
      ? reportsWithReach.reduce((s, r) => s + (computeEngagementRate(r.likes, r.comments, r.shares, r.reach) || 0), 0) / reportsWithReach.length
      : null;

    // Best performing
    const byTemplate = new Map<string, { count: number; totalEngagement: number }>();
    const byPlatform = new Map<string, { count: number; totalEngagement: number }>();

    for (const r of reports) {
      const eng = r.likes + r.comments + r.shares;
      const t = byTemplate.get(r.template) || { count: 0, totalEngagement: 0 };
      t.count++;
      t.totalEngagement += eng;
      byTemplate.set(r.template, t);

      const p = byPlatform.get(r.platform) || { count: 0, totalEngagement: 0 };
      p.count++;
      p.totalEngagement += eng;
      byPlatform.set(r.platform, p);
    }

    const topTemplate = [...byTemplate.entries()]
      .sort((a, b) => b[1].totalEngagement / b[1].count - a[1].totalEngagement / a[1].count)[0];
    const topPlatform = [...byPlatform.entries()]
      .sort((a, b) => b[1].totalEngagement / b[1].count - a[1].totalEngagement / a[1].count)[0];

    return NextResponse.json({
      brandName: brand?.name || "All Brands",
      totalReports: totalCount,
      totalLikes,
      totalComments,
      totalShares,
      avgEngagementRate: avgEngagement ? (avgEngagement * 100).toFixed(1) + "%" : "N/A",
      topTemplate: topTemplate ? { name: topTemplate[0], avgEngagement: Math.round(topTemplate[1].totalEngagement / topTemplate[1].count) } : null,
      topPlatform: topPlatform ? { name: topPlatform[0], avgEngagement: Math.round(topPlatform[1].totalEngagement / topPlatform[1].count) } : null,
      reports: reports.slice(0, 20), // Top 20 for the report
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}

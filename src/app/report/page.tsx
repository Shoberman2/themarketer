"use client";

import { useState, useEffect } from "react";

interface ReportData {
  brandName: string;
  totalReports: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgEngagementRate: string;
  topTemplate: { name: string; avgEngagement: number } | null;
  topPlatform: { name: string; avgEngagement: number } | null;
  reports: {
    id: string;
    platform: string;
    template: string;
    likes: number;
    comments: number;
    shares: number;
    reach: number | null;
    engagementRate: number | null;
    reportedAt: string;
  }[];
  generatedAt: string;
}

export default function ReportPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const brandId = localStorage.getItem("activeBrandId");
        const params = brandId ? `?brandId=${brandId}` : "";
        const res = await fetch(`/api/report${params}`);
        if (res.ok) setData(await res.json());
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-8 print:py-4 print:px-0">
      {/* Print button (hidden in print) */}
      <div className="print:hidden mb-8 flex gap-3">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-sm font-medium bg-brand text-white"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={() => window.close()}
          className="px-4 py-2 text-sm font-medium border border-border text-foreground"
        >
          Close
        </button>
      </div>

      {/* Report header */}
      <div className="mb-12 border-b border-border pb-8">
        <div className="text-[10px] uppercase tracking-[3px] text-muted mb-2">Marketing Performance Report</div>
        <h1 className="font-serif italic text-4xl text-foreground mb-2">{data.brandName}</h1>
        <p className="text-sm text-muted">
          Generated {new Date(data.generatedAt).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          })}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Total Posts</div>
          <div className="text-2xl font-semibold text-foreground">{data.totalReports}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Total Engagement</div>
          <div className="text-2xl font-semibold text-foreground">
            {(data.totalLikes + data.totalComments + data.totalShares).toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Avg. Engagement Rate</div>
          <div className="text-2xl font-semibold text-foreground">{data.avgEngagementRate}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Best Platform</div>
          <div className="text-2xl font-semibold text-foreground">{data.topPlatform?.name || "—"}</div>
        </div>
      </div>

      {/* Top performers */}
      {(data.topTemplate || data.topPlatform) && (
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-foreground mb-4">Key Findings</h2>
          <div className="space-y-3">
            {data.topTemplate && (
              <div className="border border-border p-4">
                <span className="text-xs text-muted">Best performing template:</span>
                <span className="ml-2 font-medium text-foreground">{data.topTemplate.name}</span>
                <span className="ml-2 text-xs text-muted">({data.topTemplate.avgEngagement} avg engagement per post)</span>
              </div>
            )}
            {data.topPlatform && (
              <div className="border border-border p-4">
                <span className="text-xs text-muted">Best performing platform:</span>
                <span className="ml-2 font-medium text-foreground">{data.topPlatform.name}</span>
                <span className="ml-2 text-xs text-muted">({data.topPlatform.avgEngagement} avg engagement per post)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Posts table */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">Post History</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Date</th>
              <th className="text-left py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Platform</th>
              <th className="text-left py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Template</th>
              <th className="text-right py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Likes</th>
              <th className="text-right py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Comments</th>
              <th className="text-right py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Shares</th>
              <th className="text-right py-2 text-[10px] uppercase tracking-wider text-muted font-medium">ER</th>
            </tr>
          </thead>
          <tbody>
            {data.reports.map((r) => (
              <tr key={r.id} className="border-b border-border/50">
                <td className="py-2 text-muted text-xs">
                  {new Date(r.reportedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td className="py-2">{r.platform}</td>
                <td className="py-2 text-muted">{r.template}</td>
                <td className="py-2 text-right tabular-nums">{r.likes}</td>
                <td className="py-2 text-right tabular-nums">{r.comments}</td>
                <td className="py-2 text-right tabular-nums">{r.shares}</td>
                <td className="py-2 text-right tabular-nums font-medium">
                  {r.engagementRate !== null ? `${(r.engagementRate * 100).toFixed(1)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border text-center">
        <p className="text-xs text-muted">Generated by TheMarketer · AI Marketing Platform</p>
      </div>
    </div>
  );
}

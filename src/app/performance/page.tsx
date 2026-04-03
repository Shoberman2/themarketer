"use client";

import { useState, useEffect } from "react";
import { PerformanceReport } from "@/types/performance";

interface SummaryItem {
  label: string;
  avgEngagementRate: number | null;
  count: number;
}

function computeSummary(reports: PerformanceReport[]) {
  const byTemplate = new Map<string, { total: number; count: number; erSum: number; erCount: number }>();
  const byPlatform = new Map<string, { total: number; count: number; erSum: number; erCount: number }>();
  const byAngle = new Map<string, { total: number; count: number; erSum: number; erCount: number }>();
  const byBucket = new Map<string, { total: number; count: number; erSum: number; erCount: number }>();

  for (const r of reports) {
    const er = r.engagementRate;
    const addTo = (map: Map<string, { total: number; count: number; erSum: number; erCount: number }>, key: string) => {
      const cur = map.get(key) || { total: 0, count: 0, erSum: 0, erCount: 0 };
      cur.total += r.likes + r.comments + r.shares;
      cur.count++;
      if (er !== null) { cur.erSum += er; cur.erCount++; }
      map.set(key, cur);
    };

    addTo(byTemplate, r.template);
    addTo(byPlatform, r.platform);
    if (r.messageAngle) addTo(byAngle, r.messageAngle);

    const hour = new Date(r.postedAt).getHours();
    const bucket = hour >= 6 && hour < 12 ? "Morning" : hour >= 12 && hour < 18 ? "Afternoon" : hour >= 18 ? "Evening" : "Night";
    addTo(byBucket, bucket);
  }

  const toSummary = (map: Map<string, { total: number; count: number; erSum: number; erCount: number }>): SummaryItem[] =>
    Array.from(map.entries())
      .map(([label, d]) => ({
        label,
        avgEngagementRate: d.erCount > 0 ? d.erSum / d.erCount : null,
        count: d.count,
      }))
      .sort((a, b) => (b.avgEngagementRate ?? -1) - (a.avgEngagementRate ?? -1));

  return {
    byTemplate: toSummary(byTemplate),
    byPlatform: toSummary(byPlatform),
    byAngle: toSummary(byAngle),
    byBucket: toSummary(byBucket),
  };
}

function formatER(er: number | null): string {
  if (er === null) return "—";
  return `${(er * 100).toFixed(1)}%`;
}

export default function PerformancePage() {
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const brandId = localStorage.getItem("activeBrandId");
        const params = brandId ? `?brandId=${brandId}` : "";
        const res = await fetch(`/api/performance${params}`);
        if (res.ok) {
          const data = await res.json();
          setReports(data.reports);
          setTotalCount(data.totalCount);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Your marketing intelligence</h1>
        <p className="text-muted">
          Post your first ad and come back to report how it did.
          This is where your marketing intelligence grows.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-light transition-all"
        >
          Generate your first ad
        </a>
      </div>
    );
  }

  const summary = computeSummary(reports);
  const showInsights = totalCount >= 30;

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif italic text-2xl text-foreground">Performance</h1>
          <p className="text-sm text-muted mt-1">
            {totalCount} report{totalCount !== 1 ? "s" : ""} tracked
          {!showInsights && totalCount < 30 && (
            <span className="text-muted/60">
              {" "}· {30 - totalCount} more to unlock AI pattern insights
            </span>
          )}
        </p>
        </div>
        {totalCount > 0 && (
          <button
            onClick={() => {
              const brandId = localStorage.getItem("activeBrandId");
              const params = brandId ? `?brandId=${brandId}` : "";
              window.open(`/report${params}`, "_blank");
            }}
            className="px-4 py-2 text-xs font-medium border border-border text-foreground hover:bg-surface transition-colors"
          >
            Export Report
          </button>
        )}
      </div>

      {/* Pattern cards — only at 30+ reports */}
      {showInsights && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PatternCard title="Best Template" items={summary.byTemplate} />
          <PatternCard title="Best Platform" items={summary.byPlatform} />
          <PatternCard title="Best Message Angle" items={summary.byAngle} />
          <PatternCard title="Best Time of Day" items={summary.byBucket} />
        </div>
      )}

      {/* Top posts table */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {showInsights ? "All posts" : "Your posts"} (by engagement)
        </h2>
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="text-left px-4 py-2.5 font-medium">Platform</th>
                <th className="text-left px-4 py-2.5 font-medium">Template</th>
                <th className="text-right px-4 py-2.5 font-medium">Likes</th>
                <th className="text-right px-4 py-2.5 font-medium">Comments</th>
                <th className="text-right px-4 py-2.5 font-medium">Shares</th>
                <th className="text-right px-4 py-2.5 font-medium">ER</th>
              </tr>
            </thead>
            <tbody>
              {[...reports]
                .sort((a, b) => {
                  const aTotal = a.likes + a.comments + a.shares;
                  const bTotal = b.likes + b.comments + b.shares;
                  return bTotal - aTotal;
                })
                .map((r) => (
                  <tr key={r.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2.5 text-foreground">{r.platform}</td>
                    <td className="px-4 py-2.5 text-muted">{r.template}</td>
                    <td className="px-4 py-2.5 text-right text-foreground">{r.likes}</td>
                    <td className="px-4 py-2.5 text-right text-foreground">{r.comments}</td>
                    <td className="px-4 py-2.5 text-right text-foreground">{r.shares}</td>
                    <td className="px-4 py-2.5 text-right text-foreground font-medium">
                      {formatER(r.engagementRate)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PatternCard({ title, items }: { title: string; items: SummaryItem[] }) {
  if (items.length === 0) return null;
  const best = items[0];

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-4">
      <div className="text-xs font-medium text-muted mb-2">{title}</div>
      <div className="text-lg font-semibold text-foreground capitalize">
        {best.label.replace(/-/g, " ")}
      </div>
      <div className="text-xs text-muted mt-1">
        {formatER(best.avgEngagementRate)} avg engagement rate · {best.count} posts
      </div>
      {items.length > 1 && (
        <div className="mt-3 space-y-1">
          {items.slice(1, 4).map((item) => (
            <div key={item.label} className="flex justify-between text-xs text-muted">
              <span className="capitalize">{item.label.replace(/-/g, " ")}</span>
              <span>{formatER(item.avgEngagementRate)} ({item.count})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

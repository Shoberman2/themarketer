"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MarketingPlan, DayPlan, ContentTask } from "@/types/plan";
import { WebsiteAnalysis } from "@/types/analysis";
import Link from "next/link";

interface AdData {
  taskId: string;
  taskTitle: string;
  template: string;
  variant: string;
  sizeLabel: string;
  platform: string;
  imageData: string;
}

const PHASE_LABELS: Record<string, string> = {
  Awareness: "awareness",
  Consideration: "consideration",
  "Social Proof": "social-proof",
  Conversion: "conversion",
  "Retention & Engagement": "retention",
  "Scaling & Optimization": "scaling",
};

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function TaskCard({ task }: { task: ContentTask }) {
  return (
    <div className="border border-border p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted">
          {task.platform}
        </span>
        <span className="text-[10px] text-muted">·</span>
        <span className="text-[10px] text-muted">{task.template}</span>
      </div>
      <h4 className="text-sm font-semibold text-foreground">{task.headline}</h4>
      <p className="text-xs text-muted">{task.subheadline}</p>
      {task.bodyText && (
        <p className="text-xs text-muted/70 leading-relaxed">{task.bodyText}</p>
      )}
      {task.bulletPoints.length > 0 && (
        <ul className="text-xs text-muted/70 space-y-0.5">
          {task.bulletPoints.map((bp, i) => (
            <li key={i}>· {bp}</li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-medium text-foreground">{task.ctaText}</span>
        {task.howToImplement?.bestTimeToPost && (
          <span className="text-[10px] text-muted">{task.howToImplement.bestTimeToPost}</span>
        )}
      </div>
      {task.howToImplement?.hashtags && task.howToImplement.hashtags.length > 0 && (
        <div className="text-[10px] text-muted/60">
          {task.howToImplement.hashtags.slice(0, 5).join(" ")}
        </div>
      )}
    </div>
  );
}

function AdThumbnails({ ads }: { ads: AdData[] }) {
  // Show unique variants (one per sizeLabel)
  const shown = new Set<string>();
  const unique = ads.filter((ad) => {
    if (shown.has(ad.sizeLabel)) return false;
    shown.add(ad.sizeLabel);
    return true;
  });

  return (
    <div className="grid grid-cols-3 gap-2">
      {unique.slice(0, 3).map((ad, i) => (
        <a
          key={i}
          href={`data:image/png;base64,${ad.imageData}`}
          download={`ad-${ad.sizeLabel.toLowerCase()}.png`}
          className="block border border-border hover:border-foreground/20 transition-colors overflow-hidden"
        >
          <img
            src={`data:image/png;base64,${ad.imageData}`}
            alt={`${ad.sizeLabel} ad`}
            className="w-full h-auto"
          />
          <div className="px-2 py-1 text-[9px] text-muted text-center">
            {ad.sizeLabel} · {ad.variant}
          </div>
        </a>
      ))}
    </div>
  );
}

export default function CampaignDashboard() {
  const params = useParams();
  const planId = params.planId as string;

  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [generatingDay, setGeneratingDay] = useState<number | null>(null);
  const [dayAds, setDayAds] = useState<Record<number, AdData[]>>({});

  useEffect(() => {
    async function load() {
      const stored = localStorage.getItem(`plan-${planId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPlan(parsed.plan);
        setAnalysis(parsed.analysis);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/plans/${planId}`);
        if (!res.ok) throw new Error("Plan not found");
        const data = await res.json();
        setPlan(data.plan);
        setAnalysis(data.analysis);
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [planId]);

  // Load any previously generated ads from localStorage
  useEffect(() => {
    if (!plan) return;
    const loaded: Record<number, AdData[]> = {};
    for (const day of plan.days) {
      const stored = localStorage.getItem(`ads-${planId}-${day.dayIndex}`);
      if (stored) loaded[day.dayIndex] = JSON.parse(stored);
    }
    if (Object.keys(loaded).length > 0) setDayAds(loaded);
  }, [plan, planId]);

  async function handleGenerate(dayIndex: number) {
    setGeneratingDay(dayIndex);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, dayIndex }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setDayAds((prev) => ({ ...prev, [dayIndex]: data.ads }));
      localStorage.setItem(`ads-${planId}-${dayIndex}`, JSON.stringify(data.ads));
    } catch {
      // error handled silently
    } finally {
      setGeneratingDay(null);
    }
  }

  if (loading || !plan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  const weekCount = Math.ceil(plan.days.length / 7);
  const weeks: DayPlan[][] = [];
  for (let i = 0; i < weekCount; i++) {
    const start = i * 7;
    weeks.push(plan.days.slice(start, Math.min(start + 7, plan.days.length)));
  }

  const selectedDayData = selectedDay !== null ? plan.days.find((d) => d.dayIndex === selectedDay) : null;
  const selectedAds = selectedDay !== null ? dayAds[selectedDay] : undefined;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="text-xs text-muted hover:text-foreground transition-colors mb-2 block">
            ← Back
          </Link>
          <h1 className="font-serif italic text-3xl text-foreground">
            {analysis?.brand.name || "Campaign"}
          </h1>
          <p className="text-sm text-muted mt-1">
            {plan.days.length}-day campaign · {plan.weeklyThemes?.length || 4} phases
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left: Calendar */}
        <div className="flex-1 min-w-0">
          {weeks.map((week, weekIndex) => {
            const phase = week[0]?.weekPhase || "";
            return (
              <div key={weekIndex} className="mb-6">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-xs font-medium text-foreground">Week {weekIndex + 1}</span>
                  {phase && (
                    <span className="text-[10px] uppercase tracking-[2px] text-muted">
                      {phase}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-7 gap-px bg-border">
                  {week.map((day) => {
                    const isSelected = selectedDay === day.dayIndex;
                    const hasAds = !!dayAds[day.dayIndex];
                    const isToday = Math.floor(
                      (Date.now() - new Date(plan.createdAt).getTime()) / 86400000
                    ) === day.dayIndex;

                    return (
                      <button
                        key={day.dayIndex}
                        onClick={() => setSelectedDay(isSelected ? null : day.dayIndex)}
                        className={`text-left p-3 transition-colors ${
                          isSelected
                            ? "bg-brand text-white"
                            : "bg-[var(--background)] hover:bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono ${isSelected ? "opacity-70" : "text-muted"}`}>
                            {day.dayIndex + 1}
                          </span>
                          <div className="flex gap-1">
                            {isToday && (
                              <span className={`w-1.5 h-1.5 ${isSelected ? "bg-[var(--background)]" : "bg-foreground"}`} />
                            )}
                            {hasAds && (
                              <span className="w-1.5 h-1.5 bg-green-500" />
                            )}
                          </div>
                        </div>
                        <div className={`text-[11px] font-medium leading-tight line-clamp-2 ${
                          isSelected ? "" : "text-foreground"
                        }`}>
                          {day.theme}
                        </div>
                        <div className={`text-[9px] mt-1 ${isSelected ? "opacity-60" : "text-muted"}`}>
                          {day.tasks.length} task{day.tasks.length !== 1 ? "s" : ""} · {day.tasks[0]?.platform}
                        </div>
                      </button>
                    );
                  })}
                  {/* Fill empty cells for incomplete weeks */}
                  {week.length < 7 &&
                    Array.from({ length: 7 - week.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="bg-surface/50 p-3" />
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detail panel */}
        <div className="w-[400px] flex-shrink-0 sticky top-20 self-start">
          {selectedDayData ? (
            <div className="border border-border">
              {/* Day header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[2px] text-muted mb-1">
                      Day {selectedDayData.dayIndex + 1} · {formatShortDate(selectedDayData.date)}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedDayData.theme}
                    </h2>
                    <div className="text-xs text-muted mt-0.5">{selectedDayData.weekPhase}</div>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-3">
                <div className="text-[10px] uppercase tracking-[2px] text-muted mb-2">
                  Content ({selectedDayData.tasks.length})
                </div>
                {selectedDayData.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>

              {/* Generate / View ads */}
              <div className="p-4 border-t border-border">
                {selectedAds && selectedAds.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-[10px] uppercase tracking-[2px] text-muted">
                      Generated Ads
                    </div>
                    <AdThumbnails ads={selectedAds} />
                    <p className="text-[10px] text-muted text-center">Click to download</p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerate(selectedDayData.dayIndex)}
                    disabled={generatingDay === selectedDayData.dayIndex}
                    className="w-full py-3 bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30"
                  >
                    {generatingDay === selectedDayData.dayIndex ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 border-2 border-[var(--background)]/20 border-t-[var(--background)] animate-spin" />
                        Generating ads...
                      </span>
                    ) : (
                      "Generate Ads for This Day"
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-border p-8 text-center">
              <p className="text-sm text-muted">Select a day to see its content and generate ads.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

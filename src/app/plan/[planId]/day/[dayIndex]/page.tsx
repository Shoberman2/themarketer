"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DayPlan, ContentTask } from "@/types/plan";
import { WebsiteAnalysis } from "@/types/analysis";
import { GenerateButton } from "@/components/generate-button";
import { AdGallery } from "@/components/ad-gallery";
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

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ImplementationGuide({ task }: { task: ContentTask }) {
  const [open, setOpen] = useState(false);
  const guide = task.howToImplement;
  if (!guide) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[12px] text-brand font-medium hover:text-brand-light transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Implementation Guide
      </button>
      {open && (
        <div className="mt-3 bg-surface border border-border rounded-lg p-4 space-y-4">
          {guide.steps.length > 0 && (
            <div>
              <h4 className="text-[11px] text-muted font-semibold uppercase tracking-widest mb-2">
                Steps
              </h4>
              <ol className="text-[12px] text-foreground/80 space-y-1.5 list-decimal list-inside">
                {guide.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {guide.bestTimeToPost && (
              <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-brand/10 text-brand border border-brand/20 rounded-lg font-medium">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {guide.bestTimeToPost}
              </span>
            )}
          </div>
          {guide.hashtags.length > 0 && (
            <div>
              <h4 className="text-[11px] text-muted font-semibold uppercase tracking-widest mb-2">
                Hashtags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {guide.hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 bg-surface-raised border border-border rounded-md text-foreground/70"
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          )}
          {guide.audienceTargeting && (
            <div>
              <h4 className="text-[11px] text-muted font-semibold uppercase tracking-widest mb-2">
                Audience Targeting
              </h4>
              <p className="text-[12px] text-foreground/70">
                {guide.audienceTargeting}
              </p>
            </div>
          )}
          {guide.additionalTips && (
            <div>
              <h4 className="text-[11px] text-muted font-semibold uppercase tracking-widest mb-2">
                Tips
              </h4>
              <p className="text-[12px] text-foreground/70">
                {guide.additionalTips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DayDetailPage() {
  const params = useParams();
  const planId = params.planId as string;
  const dayIndex = parseInt(params.dayIndex as string);

  const [day, setDay] = useState<DayPlan | null>(null);
  const [, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [ads, setAds] = useState<AdData[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`plan-${planId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      const foundDay = parsed.plan.days.find(
        (d: DayPlan) => d.dayIndex === dayIndex
      );
      setDay(foundDay || null);
      setAnalysis(parsed.analysis);
    }

    const storedAds = localStorage.getItem(`ads-${planId}-${dayIndex}`);
    if (storedAds) {
      setAds(JSON.parse(storedAds));
    }
  }, [planId, dayIndex]);

  async function handleGenerate() {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, dayIndex }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setAds(data.ads);
      localStorage.setItem(
        `ads-${planId}-${dayIndex}`,
        JSON.stringify(data.ads)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  if (!day) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/plan/${planId}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Plan
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <span className="text-[10px] text-brand font-medium uppercase tracking-widest">
            {day.weekPhase} &middot; {formatFullDate(day.date)}
          </span>
          <h1 className="text-3xl font-bold text-foreground mt-1">
            Day {dayIndex + 1}: {day.theme}
          </h1>
        </div>
        <GenerateButton onClick={handleGenerate} isLoading={generating} />
      </div>

      <div className="space-y-4 mb-10">
        <h2 className="text-base font-semibold text-foreground">Content Tasks</h2>
        {day.tasks.map((task) => (
          <div
            key={task.id}
            className="bg-surface-raised border border-border rounded-xl p-5 hover:border-border-hover transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] px-2 py-0.5 bg-brand/10 text-brand border border-brand/20 rounded-md font-medium uppercase tracking-wider">
                {task.template}
              </span>
              <span className="text-[11px] text-muted">{task.platform}</span>
            </div>
            <h3 className="text-[15px] text-foreground font-semibold mb-1.5">{task.title}</h3>
            <p className="text-[13px] text-muted mb-4">{task.description}</p>
            <div className="bg-surface rounded-lg p-4 space-y-2.5 border border-border">
              <p className="text-[14px] font-semibold text-foreground">
                {task.headline}
              </p>
              <p className="text-[13px] text-foreground/60">{task.subheadline}</p>
              {task.bodyText && (
                <p className="text-[12px] text-muted">{task.bodyText}</p>
              )}
              {task.bulletPoints.length > 0 && (
                <ul className="text-[12px] text-muted space-y-1">
                  {task.bulletPoints.map((bp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand mt-0.5">-</span>
                      {bp}
                    </li>
                  ))}
                </ul>
              )}
              <div className="pt-1">
                <span className="text-[12px] text-brand font-medium">
                  CTA: {task.ctaText}
                </span>
              </div>
            </div>
            <ImplementationGuide task={task} />
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm mb-8">
          {error}
        </div>
      )}

      {ads.length > 0 && <AdGallery ads={ads} />}
    </div>
  );
}

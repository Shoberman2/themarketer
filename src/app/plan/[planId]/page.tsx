"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MarketingPlan } from "@/types/plan";
import { WebsiteAnalysis } from "@/types/analysis";
import { PlanOverview } from "@/components/plan-overview";
import { CalendarGrid } from "@/components/calendar-grid";
import { InfluencerSection } from "@/components/influencer-section";

function formatDateRange(days: { date: string }[]): string {
  if (days.length === 0) return "";
  const first = new Date(days[0].date + "T00:00:00");
  const last = new Date(days[days.length - 1].date + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = first.toLocaleDateString("en-US", opts);
  const endStr = last.toLocaleDateString("en-US", {
    ...opts,
    year: "numeric",
  });
  return `${startStr} \u2013 ${endStr}`;
}

export default function PlanPage() {
  const params = useParams();
  const planId = params.planId as string;

  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [extending, setExtending] = useState(false);

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
        localStorage.setItem(`plan-${planId}`, JSON.stringify(data));
      } catch {
        setError("Plan not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [planId]);

  async function handleExtend() {
    if (!plan) return;
    setExtending(true);
    try {
      const res = await fetch("/api/extend-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Extension failed");
      }
      const { plan: updatedPlan } = await res.json();
      setPlan(updatedPlan);
      localStorage.removeItem(`plan-${planId}`);
      localStorage.setItem(
        `plan-${planId}`,
        JSON.stringify({ plan: updatedPlan, analysis })
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to extend plan");
    } finally {
      setExtending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted">{error || "Plan not found"}</p>
        <a href="/" className="text-sm text-brand hover:text-brand-light transition-colors">
          Create a new plan
        </a>
      </div>
    );
  }

  const totalDays = plan.totalDays || plan.days.length;
  const isExtended = totalDays > 30;
  const canExtend = !isExtended && !plan.extendedAt;

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] text-brand font-medium uppercase tracking-widest">
            Campaign Strategy
          </span>
          <h1 className="text-3xl font-bold text-foreground mt-1">
            {isExtended ? "60-Day Plan" : "30-Day Plan"}
          </h1>
          <p className="text-muted text-sm mt-1">
            {plan.url}
            {plan.days.length > 0 && (
              <span className="ml-3 text-foreground/50">
                {formatDateRange(plan.days)}
              </span>
            )}
          </p>
        </div>
        <span className="text-[11px] text-muted">
          Created {new Date(plan.createdAt).toLocaleDateString()}
        </span>
      </div>
      {analysis && (
        <PlanOverview
          analysis={analysis}
          socialProfiles={plan.socialProfiles}
        />
      )}
      <CalendarGrid
        days={plan.days}
        planId={plan.id}
        weeklyThemes={plan.weeklyThemes}
      />
      {plan.influencerRecommendations && (
        <InfluencerSection
          recommendations={plan.influencerRecommendations}
        />
      )}
      {canExtend && (
        <div className="mt-10 text-center">
          <button
            onClick={handleExtend}
            disabled={extending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-light transition-colors disabled:opacity-50"
          >
            {extending ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Extending...
              </>
            ) : (
              "Craft Another 30 Days"
            )}
          </button>
          <p className="text-[11px] text-muted mt-2">
            Extend your campaign with weeks 5-8: Retention, Engagement, Scaling
            & Optimization
          </p>
        </div>
      )}
    </div>
  );
}

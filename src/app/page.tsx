"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UrlInput } from "@/components/url-input";
import { AnalysisProgress } from "@/components/analysis-progress";
import { FallbackForm } from "@/components/fallback-form";
import { RecommendationCard } from "@/components/recommendation-card";
import { MorningBrief } from "@/components/morning-brief";
import { WebsiteAnalysis } from "@/types/analysis";
import { AdRecommendation } from "@/types/recommendation";
import { MarketingPlan } from "@/types/plan";

type FlowState =
  | "checking"
  | "first-run"
  | "analyzing"
  | "recommending"
  | "recommend"
  | "fallback"
  | "today"
  | "brief"
  | "completed"
  | "generating-plan";

const ALL_PLATFORMS = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Twitter / X",
  "TikTok",
  "Pinterest",
  "YouTube",
  "Google Ads",
];

export default function Home() {
  const router = useRouter();
  const [flowState, setFlowState] = useState<FlowState>("checking");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [recommendation, setRecommendation] = useState<AdRecommendation | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [recommendationId, setRecommendationId] = useState<string | null>(null);
  const [todayPlan, setTodayPlan] = useState<{ plan: MarketingPlan; dayIndex: number } | null>(null);
  const [slowWarning, setSlowWarning] = useState(false);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [activeBrandName, setActiveBrandName] = useState<string>("");

  // Check for existing plans scoped to active brand
  useEffect(() => {
    const brandId = localStorage.getItem("activeBrandId");
    setActiveBrandId(brandId);

    async function checkExistingPlans() {
      try {
        // If no active brand, check if any brands exist
        if (!brandId) {
          const brandsRes = await fetch("/api/brands");
          if (brandsRes.ok) {
            const { brands } = await brandsRes.json();
            if (brands && brands.length > 0) {
              // Auto-select the first brand
              const first = brands[0];
              localStorage.setItem("activeBrandId", first.id);
              setActiveBrandId(first.id);
              setActiveBrandName(first.name);
              // Re-run with the selected brand
              window.location.reload();
              return;
            }
          }
          setFlowState("first-run");
          return;
        }

        // Get brand name
        const brandsRes = await fetch("/api/brands");
        if (brandsRes.ok) {
          const { brands } = await brandsRes.json();
          const activeBrand = brands?.find((b: { id: string }) => b.id === brandId);
          if (activeBrand) setActiveBrandName(activeBrand.name);
        }

        // For returning users with a brand: show Morning Brief
        const res = await fetch("/api/plans");
        if (!res.ok) {
          // No plans but brand exists — still show brief (agent can generate from brand data)
          setFlowState("brief");
          return;
        }
        const { plans } = await res.json();
        const brandPlans = plans?.filter((p: { brandId: string }) => p.brandId === brandId) || [];

        if (brandPlans.length === 0) {
          // Brand exists but no plans — show brief if brand has any data
          setFlowState("brief");
          return;
        }

        // Brand with plans — show Morning Brief (replaces old "today" view)
        setFlowState("brief");
      } catch {
        setFlowState("first-run");
      }
    }
    checkExistingPlans();
  }, []);

  async function handleSubmit(inputUrl: string) {
    setUrl(inputUrl);
    setFlowState("analyzing");
    setError("");
    setStep(0);
    setSlowWarning(false);

    // Show slow warning after 30s
    const slowTimer = setTimeout(() => setSlowWarning(true), 30000);

    try {
      // Step 1: Analyze
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!analyzeRes.ok) {
        const data = await analyzeRes.json();
        clearTimeout(slowTimer);
        // If scrape failed, show fallback form
        if (data.error?.includes("fetch") || data.error?.includes("timeout") || data.error?.includes("ENOTFOUND")) {
          setFlowState("fallback");
          return;
        }
        throw new Error(data.error || "Analysis failed");
      }

      const { analysis: analysisData } = await analyzeRes.json();
      setAnalysis(analysisData);
      setStep(2);

      // Auto-create or find brand
      const brandRes = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl, analysis: analysisData }),
      });
      let brandId = activeBrandId;
      if (brandRes.ok) {
        const { brandId: newBrandId } = await brandRes.json();
        brandId = newBrandId;
        localStorage.setItem("activeBrandId", newBrandId);
        setActiveBrandId(newBrandId);
      }

      // Step 2: Recommend
      setFlowState("recommending");
      await fetchRecommendation(analysisData, brandId);
      clearTimeout(slowTimer);
    } catch (err) {
      clearTimeout(slowTimer);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setFlowState("first-run");
    }
  }

  async function handleFallbackSubmit(manualAnalysis: WebsiteAnalysis) {
    setAnalysis(manualAnalysis);
    setFlowState("recommending");
    setStep(2);
    setSlowWarning(false);

    const slowTimer = setTimeout(() => setSlowWarning(true), 30000);
    try {
      await fetchRecommendation(manualAnalysis);
      clearTimeout(slowTimer);
    } catch (err) {
      clearTimeout(slowTimer);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setFlowState("first-run");
    }
  }

  async function fetchRecommendation(analysisData: WebsiteAnalysis, brandId?: string | null) {
    const recRes = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysis: analysisData, url, brandId: brandId || undefined }),
    });

    if (!recRes.ok) {
      const data = await recRes.json();
      throw new Error(data.error || "Recommendation failed");
    }

    const { recommendation: rec, imageData: img, recommendationId: recId } = await recRes.json();
    setRecommendation(rec);
    setImageData(img);
    setRecommendationId(recId);
    setStep(3);
    setFlowState("recommend");
  }

  async function handleSeeFullPlan() {
    if (!analysis || !url) return;

    setFlowState("generating-plan");
    setStep(2);
    setError("");

    try {
      const planRes = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          analysis,
          platforms: ALL_PLATFORMS,
          brandId: activeBrandId || undefined,
        }),
      });

      if (!planRes.ok) {
        const data = await planRes.json();
        throw new Error(data.error || "Plan generation failed");
      }

      const { plan } = await planRes.json();
      localStorage.setItem(
        `plan-${plan.id}`,
        JSON.stringify({ plan, analysis })
      );
      router.push(`/campaign/${plan.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setFlowState("recommend");
    }
  }

  // Loading states
  if (flowState === "checking") {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-5 h-5 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (flowState === "analyzing" || flowState === "recommending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-16">
        <div className="text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">
              {flowState === "analyzing"
                ? "Analyzing your brand"
                : "Crafting your recommendation"}
            </h2>
            <p className="text-sm text-muted">
              {flowState === "analyzing"
                ? "Scraping your website and extracting brand identity..."
                : "Picking the best platform, message, and creative for your first ad..."}
            </p>
            {slowWarning && (
              <p className="text-xs text-amber-500 mt-2">
                This is taking longer than usual. Large sites can take up to a minute.
              </p>
            )}
          </div>
          <AnalysisProgress currentStep={step} />
        </div>
      </div>
    );
  }

  if (flowState === "generating-plan") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-16">
        <div className="text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">
              Generating your 30-day plan
            </h2>
            <p className="text-sm text-muted">
              Creating a full campaign across all platforms...
            </p>
          </div>
          <AnalysisProgress currentStep={step} />
        </div>
      </div>
    );
  }

  if (flowState === "fallback") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <FallbackForm onSubmit={handleFallbackSubmit} isLoading={flowState === "fallback" && !!analysis} />
      </div>
    );
  }

  // Recommendation screen — first-run result
  if (flowState === "recommend" && recommendation && analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
        <RecommendationCard
          recommendation={recommendation}
          imageData={imageData}
          brand={analysis.brand}
          recommendationId={recommendationId || undefined}
          onSeeFullPlan={handleSeeFullPlan}
        />
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm max-w-md text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Returning user — Morning Brief
  if (flowState === "brief" && activeBrandId) {
    return (
      <div className="min-h-[80vh] py-12">
        <MorningBrief
          brandId={activeBrandId}
          brandName={activeBrandName}
          onNewCampaign={() => setFlowState("first-run")}
        />
      </div>
    );
  }

  // Returning user — today's task from active plan (legacy, kept as fallback)
  if (flowState === "today" && todayPlan) {
    const { plan, dayIndex } = todayPlan;
    const day = plan.days[dayIndex];
    const task = day?.tasks?.[0];

    if (!task) {
      // No task for today — show first-run
      return renderFirstRun();
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-3">
              <span className="text-[11px] text-brand font-medium uppercase tracking-widest">
                Day {dayIndex + 1} of {plan.totalDays || 30}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              Today&apos;s recommendation
            </h2>
            <p className="text-sm text-muted mt-1">{day.theme}</p>
          </div>

          {/* Task card */}
          <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-3">
            <div className="text-xs font-semibold text-brand uppercase tracking-wider">
              {task.platform}
            </div>
            <h3 className="text-lg font-semibold text-foreground">{task.headline}</h3>
            <p className="text-sm text-muted">{task.subheadline}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{task.bodyText}</p>
            {task.howToImplement && (
              <div className="pt-2 border-t border-border space-y-2">
                <div className="text-xs font-medium text-muted">
                  Best time: {task.howToImplement.bestTimeToPost}
                </div>
                {task.howToImplement.hashtags.length > 0 && (
                  <div className="text-xs text-brand">
                    {task.howToImplement.hashtags.join(" ")}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/campaign/${plan.id}`)}
              className="flex-1 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-light transition-all"
            >
              See Full Plan
            </button>
            <button
              onClick={() => setFlowState("first-run")}
              className="flex-1 py-3 bg-surface-raised border border-border text-foreground text-sm font-medium rounded-xl hover:bg-surface-hover transition-all"
            >
              New Campaign
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed plan
  if (flowState === "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Your plan is complete!
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            You&apos;ve finished your campaign. Ready to start a new one?
          </p>
        </div>
        <UrlInput onSubmit={handleSubmit} isLoading={false} />
      </div>
    );
  }

  // First-run — default
  return renderFirstRun();

  function renderFirstRun() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-14">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="text-[11px] text-muted uppercase tracking-[3px] mb-2">
            AI Marketing Platform
          </div>
          <h1 className="font-serif italic text-5xl sm:text-7xl tracking-tight leading-[1.05]">
            <span className="text-foreground">Your first ad in</span>
            <br />
            <span className="text-foreground">60 seconds.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto leading-relaxed">
            Paste your website. We&apos;ll tell you exactly what to post and where.
          </p>
        </div>
        <UrlInput onSubmit={handleSubmit} isLoading={false} />
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm max-w-md text-center">
            {error}
            <button
              onClick={() => setError("")}
              className="block mx-auto mt-2 text-xs text-red-400/70 hover:text-red-400 underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    );
  }
}

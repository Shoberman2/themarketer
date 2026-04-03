"use client";

import { useState } from "react";
import { AdRecommendation } from "@/types/recommendation";
import { BrandProfile } from "@/types/analysis";
import { ReportForm } from "./report-form";

export function RecommendationCard({
  recommendation,
  imageData,
  brand,
  recommendationId,
  onSeeFullPlan,
}: {
  recommendation: AdRecommendation;
  imageData: string | null;
  brand: BrandProfile;
  recommendationId?: string;
  onSeeFullPlan: () => void;
}) {
  const [showReport, setShowReport] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  function handleDownload() {
    if (!imageData) return;

    // Download PNG
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `${brand.name.replace(/\s+/g, "-").toLowerCase()}-ad-${recommendation.adSize.label.toLowerCase()}.png`;
    link.click();

    // Copy caption to clipboard
    navigator.clipboard?.writeText(recommendation.caption).catch(() => {
      // Clipboard API not available (HTTP) — silent fail
    });

    setDownloaded(true);
    if (recommendationId) {
      setShowReport(true);
    }
  }

  function handleOpenPlatform() {
    // Copy caption to clipboard first so user can paste immediately
    navigator.clipboard?.writeText(recommendation.caption).catch(() => {});

    // Use share intent URLs where available (pre-fills content)
    const caption = encodeURIComponent(recommendation.caption);
    const urls: Record<string, string> = {
      Instagram: "https://www.instagram.com/", // No share intent, user pastes
      Facebook: `https://www.facebook.com/sharer/sharer.php?quote=${caption}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=&summary=${caption}`,
      "Twitter/X": `https://twitter.com/intent/tweet?text=${caption}`,
      TikTok: "https://www.tiktok.com/upload",
      Pinterest: "https://www.pinterest.com/pin-creation-tool/",
      YouTube: "https://studio.youtube.com/",
      "Google Ads": "https://ads.google.com/",
    };
    const url = urls[recommendation.platform] || "https://www.instagram.com/";
    window.open(url, "_blank");
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Your first ad is ready
        </h2>
        <p className="text-sm text-muted mt-1">
          Based on {brand.name} analysis
        </p>
      </div>

      {/* Brand strip */}
      <div className="flex items-center gap-3 px-4 py-3 bg-surface-raised border border-border rounded-xl">
        <div className="w-9 h-9 bg-surface-hover border border-border rounded-lg flex items-center justify-center text-xs font-bold text-muted">
          {brand.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">
            {brand.name}
          </div>
          <div className="text-xs text-muted truncate">{brand.tone}</div>
        </div>
        <div className="flex gap-1">
          <span
            className="w-4 h-4 rounded border border-border/50"
            style={{ backgroundColor: brand.primaryColor }}
          />
          <span
            className="w-4 h-4 rounded border border-border/50"
            style={{ backgroundColor: brand.secondaryColor }}
          />
          <span
            className="w-4 h-4 rounded border border-border/50"
            style={{ backgroundColor: brand.accentColor }}
          />
        </div>
      </div>

      {/* AI Recommendation — the intelligence IS the product */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5 space-y-4">
        <div className="text-xs font-semibold text-green-600 uppercase tracking-wider">
          AI Recommendation
        </div>

        <div>
          <div className="text-base font-semibold text-foreground">
            Post this to {recommendation.platform} at {recommendation.postingTime}
          </div>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            {recommendation.platformReasoning}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3">
            <div className="text-xs font-medium text-muted mb-1">Best time</div>
            <div className="font-medium text-foreground">{recommendation.postingTime}</div>
            <div className="text-xs text-muted mt-0.5">{recommendation.postingTimeReasoning}</div>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3">
            <div className="text-xs font-medium text-muted mb-1">Message angle</div>
            <div className="font-medium text-foreground capitalize">
              {recommendation.messageAngle.replace("-", " ")}
            </div>
            <div className="text-xs text-muted mt-0.5">
              {recommendation.adSize.label} format, {recommendation.template} template
            </div>
          </div>
        </div>

        {recommendation.confidence < 6 && (
          <p className="text-xs text-muted/80 italic">
            This is a starting point — post it and see what happens. We&apos;ll
            refine from there.
          </p>
        )}
      </div>

      {/* Ad preview */}
      {imageData ? (
        <div className="border border-border rounded-xl overflow-hidden">
          <img
            src={`data:image/png;base64,${imageData}`}
            alt={`${brand.name} ad preview`}
            className="w-full"
          />
          <div className="px-4 py-2.5 flex justify-between items-center text-xs text-muted">
            <span className="font-medium text-foreground/70">
              {recommendation.template} / {recommendation.adSize.width}x{recommendation.adSize.height} {recommendation.adSize.label}
            </span>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted">
            Couldn&apos;t generate preview — but the recommendation above is still
            good to go. Use the caption below with your own creative.
          </p>
        </div>
      )}

      {/* Caption preview */}
      <div className="bg-surface-raised border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted">Ready-to-post caption</span>
          <button
            onClick={() => navigator.clipboard?.writeText(recommendation.caption)}
            className="text-xs text-brand hover:text-brand-light transition-colors"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {recommendation.caption}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={!imageData}
          className="flex-1 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Download &amp; Copy Caption
        </button>
        <button
          onClick={handleOpenPlatform}
          className="flex-1 py-3 bg-surface-raised border border-border text-foreground text-sm font-medium rounded-xl hover:bg-surface-hover transition-all"
        >
          Open {recommendation.platform}
        </button>
      </div>

      {/* Report form — appears after download */}
      {showReport && recommendationId && (
        <ReportForm
          recommendationId={recommendationId}
          platform={recommendation.platform}
          template={recommendation.template}
          messageAngle={recommendation.messageAngle}
          onSubmitted={() => setShowReport(false)}
        />
      )}

      {/* Report prompt — shown if downloaded but form not visible */}
      {downloaded && !showReport && recommendationId && (
        <div className="text-center">
          <button
            onClick={() => setShowReport(true)}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Report how this ad performed
          </button>
        </div>
      )}

      {/* See full plan link */}
      <div className="text-center space-y-1">
        <button
          onClick={onSeeFullPlan}
          className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-2"
        >
          See full 30-day campaign plan
        </button>
        <div>
          <a
            href="/performance"
            className="text-xs text-muted/70 hover:text-muted transition-colors"
          >
            View analytics
          </a>
        </div>
      </div>
    </div>
  );
}

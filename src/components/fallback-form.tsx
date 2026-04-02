"use client";

import { useState } from "react";
import { WebsiteAnalysis } from "@/types/analysis";

export function FallbackForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (analysis: WebsiteAnalysis) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !industry.trim() || !valueProposition.trim()) {
      setError("Please fill in at least business name, industry, and value proposition.");
      return;
    }

    const analysis: WebsiteAnalysis = {
      brand: {
        name: name.trim(),
        tagline: valueProposition.trim(),
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
        accentColor: "#3b82f6",
        industry: industry.trim(),
        tone: "Professional and approachable",
      },
      valuePropositions: [valueProposition.trim()],
      targetAudience: targetAudience.trim()
        ? targetAudience.split(",").map((s) => s.trim())
        : ["General audience"],
      keyFeatures: [],
      socialProof: [],
      competitiveAdvantages: [],
      pricingInfo: null,
      callToAction: "Learn More",
    };

    onSubmit(analysis);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Tell us about your business
        </h2>
        <p className="text-sm text-muted">
          We couldn&apos;t scrape your website. Fill in a few details and we&apos;ll
          still generate your first ad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Business Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Fitness"
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm bg-surface-raised border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-brand/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Industry *
          </label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Fitness & Wellness"
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm bg-surface-raised border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-brand/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            What do you offer? *
          </label>
          <textarea
            value={valueProposition}
            onChange={(e) => setValueProposition(e.target.value)}
            placeholder="We help busy professionals get fit with 30-minute HIIT classes and personalized meal plans."
            disabled={isLoading}
            rows={3}
            className="w-full px-4 py-3 text-sm bg-surface-raised border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-brand/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Target audience (comma-separated)
          </label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Busy professionals, Health-conscious millennials"
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm bg-surface-raised border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-brand/50"
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-brand text-black text-sm font-semibold rounded-xl hover:bg-brand-light transition-all disabled:opacity-30"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Generating your ad...
            </span>
          ) : (
            "Generate My First Ad"
          )}
        </button>
      </form>
    </div>
  );
}

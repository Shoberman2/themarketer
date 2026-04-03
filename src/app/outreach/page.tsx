"use client";

import { useState, useEffect } from "react";
import { InfluencerRecommendation } from "@/types/influencer";

function generateDMTemplate(brandName: string, influencer: InfluencerRecommendation): string {
  return `Hi ${influencer.name.split(" (")[0].split(" ")[0]},

I'm reaching out from ${brandName}. I've been following your content in the ${influencer.niche.toLowerCase()} space and think there's a natural fit for a partnership.

Here's what I had in mind: ${influencer.partnershipIdea}

We'd love to discuss this further. Would you be open to a quick chat?

Best,
${brandName} Team`;
}

export default function OutreachPage() {
  const [influencers, setInfluencers] = useState<InfluencerRecommendation[]>([]);
  const [brandName, setBrandName] = useState("Your Brand");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");

  useEffect(() => {
    async function load() {
      try {
        // Get active brand
        const brandId = localStorage.getItem("activeBrandId");
        if (brandId) {
          const brandRes = await fetch("/api/brands");
          if (brandRes.ok) {
            const { brands } = await brandRes.json();
            const active = brands.find((b: { id: string }) => b.id === brandId);
            if (active) setBrandName(active.name);
          }
        }

        // Get plans with influencer data
        const plansRes = await fetch("/api/plans");
        if (plansRes.ok) {
          const { plans } = await plansRes.json();
          const brandPlans = brandId
            ? plans.filter((p: { brandId: string }) => p.brandId === brandId)
            : plans;

          if (brandPlans.length > 0) {
            const planRes = await fetch(`/api/plans/${brandPlans[0].id}`);
            if (planRes.ok) {
              const { plan } = await planRes.json();
              if (plan.influencerRecommendations?.length > 0) {
                setInfluencers(plan.influencerRecommendations);
              }
            }
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleCopyDM(influencer: InfluencerRecommendation) {
    const template = generateDMTemplate(brandName, influencer);
    navigator.clipboard?.writeText(template);
    setCopiedId(influencer.name);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const platforms = ["all", ...new Set(influencers.map((i) => i.platform))];
  const filtered = filterPlatform === "all"
    ? influencers
    : influencers.filter((i) => i.platform === filterPlatform);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (influencers.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h1 className="font-serif italic text-2xl text-foreground">Influencer Outreach</h1>
        <p className="text-muted text-sm">
          Generate a campaign plan first. Influencer recommendations come with each 30-day plan.
        </p>
        <a href="/" className="inline-block mt-4 px-6 py-2.5 bg-brand text-white text-sm font-medium">
          Generate a campaign
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="font-serif italic text-3xl text-foreground">Influencer Outreach</h1>
        <p className="text-sm text-muted mt-1">
          {influencers.length} influencers matched for {brandName}. Click to visit their profile and DM them.
        </p>
      </div>

      {/* Platform filter */}
      <div className="flex gap-2 flex-wrap">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setFilterPlatform(p)}
            className={`px-3 py-1 text-xs font-medium border transition-colors ${
              filterPlatform === p
                ? "bg-brand text-white border-foreground"
                : "bg-transparent text-muted border-border hover:border-foreground/30"
            }`}
          >
            {p === "all" ? "All Platforms" : p}
          </button>
        ))}
      </div>

      {/* Influencer cards */}
      <div className="space-y-4">
        {filtered.map((inf) => (
          <div key={inf.name} className="border border-border p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-foreground">{inf.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
                    {inf.platform}
                  </span>
                  <span className="text-[10px] text-muted">{inf.followerRange}</span>
                </div>
                <p className="text-xs text-muted">{inf.niche}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {inf.profileUrl && (
                  <a
                    href={inf.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-medium bg-brand text-white hover:opacity-90 transition-opacity"
                  >
                    Visit Profile
                  </a>
                )}
                <button
                  onClick={() => handleCopyDM(inf)}
                  className="px-3 py-1.5 text-xs font-medium border border-border text-foreground hover:bg-surface transition-colors"
                >
                  {copiedId === inf.name ? "Copied!" : "Copy DM"}
                </button>
              </div>
            </div>

            <p className="text-sm text-foreground/80">{inf.whyRelevant}</p>

            <div className="bg-surface p-3 border border-border">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Partnership idea</div>
              <p className="text-sm text-foreground/70">{inf.partnershipIdea}</p>
            </div>

            {inf.openToPartnerships && (
              <div className="text-[10px] text-green-600 font-medium uppercase tracking-wider">
                Open to brand partnerships
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

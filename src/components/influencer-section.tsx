"use client";

import { InfluencerRecommendation } from "@/types/influencer";

export function InfluencerSection({
  recommendations,
}: {
  recommendations: InfluencerRecommendation[];
}) {
  if (!recommendations || recommendations.length === 0) return null;

  const grouped = recommendations.reduce(
    (acc, rec) => {
      const key = rec.platform;
      if (!acc[key]) acc[key] = [];
      acc[key].push(rec);
      return acc;
    },
    {} as Record<string, InfluencerRecommendation[]>
  );

  return (
    <div className="mt-10">
      <div className="flex items-baseline gap-3 mb-5">
        <h3 className="text-base font-semibold text-foreground">
          Influencer Recommendations
        </h3>
        <span className="text-[11px] text-brand font-medium uppercase tracking-wider">
          AI Suggested
        </span>
      </div>
      <div className="space-y-6">
        {Object.entries(grouped).map(([platform, recs]) => (
          <div key={platform}>
            <h4 className="text-[11px] text-muted font-semibold uppercase tracking-widest mb-3">
              {platform}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recs.map((rec, i) => (
                <div
                  key={i}
                  className="bg-surface-raised border border-border rounded-xl p-4 hover:border-border-hover transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-semibold text-foreground">
                      {rec.name}
                    </h5>
                    <span className="text-[10px] text-muted">
                      {rec.followerRange}
                    </span>
                  </div>
                  <span className="inline-block text-[10px] px-2 py-0.5 bg-brand/10 text-brand border border-brand/20 rounded-md font-medium mb-2">
                    {rec.niche}
                  </span>
                  <p className="text-[12px] text-muted mb-2">
                    {rec.whyRelevant}
                  </p>
                  <p className="text-[12px] text-foreground/70">
                    <span className="text-brand font-medium">Idea:</span>{" "}
                    {rec.partnershipIdea}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

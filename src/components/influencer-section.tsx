"use client";

import { useState } from "react";
import { InfluencerRecommendation } from "@/types/influencer";

export function InfluencerSection({
  recommendations,
}: {
  recommendations: InfluencerRecommendation[];
}) {
  const [expanded, setExpanded] = useState(false);

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

  const platformOrder = [
    "Instagram",
    "TikTok",
    "YouTube",
    "LinkedIn",
    "Twitter/X",
    "Pinterest",
    "Facebook",
  ];
  const sortedPlatforms = Object.keys(grouped).sort(
    (a, b) =>
      (platformOrder.indexOf(a) === -1 ? 99 : platformOrder.indexOf(a)) -
      (platformOrder.indexOf(b) === -1 ? 99 : platformOrder.indexOf(b))
  );

  // Show first 6 unless expanded
  const visibleCount = expanded ? recommendations.length : 6;
  let shown = 0;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-3">
          <h3 className="text-base font-semibold text-foreground">
            Influencer Recommendations
          </h3>
          <span className="text-[11px] text-brand font-medium uppercase tracking-wider">
            {recommendations.length} matches
          </span>
        </div>
      </div>
      <div className="space-y-6">
        {sortedPlatforms.map((platform) => {
          const recs = grouped[platform];
          const platformRecs: InfluencerRecommendation[] = [];
          for (const rec of recs) {
            if (shown >= visibleCount) break;
            platformRecs.push(rec);
            shown++;
          }
          if (platformRecs.length === 0) return null;

          return (
            <div key={platform}>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-[11px] text-muted font-semibold uppercase tracking-widest">
                  {platform}
                </h4>
                <span className="text-[10px] text-muted">
                  ({recs.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {platformRecs.map((rec, i) => (
                  <div
                    key={i}
                    className="bg-surface-raised border border-border rounded-xl p-4 hover:border-border-hover transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-semibold text-foreground">
                        {rec.name}
                      </h5>
                      <span className="text-[10px] text-brand font-semibold">
                        {rec.followerRange}
                      </span>
                    </div>
                    <span className="inline-block text-[10px] px-2 py-0.5 bg-brand/10 text-brand border border-brand/20 rounded-md font-medium mb-2">
                      {rec.niche}
                    </span>
                    <p className="text-[12px] text-muted mb-2 leading-relaxed">
                      {rec.whyRelevant}
                    </p>
                    <p className="text-[12px] text-foreground/70 leading-relaxed">
                      <span className="text-brand font-medium">Partnership idea:</span>{" "}
                      {rec.partnershipIdea}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {recommendations.length > 6 && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[13px] text-brand hover:text-brand-light transition-colors font-medium"
          >
            {expanded
              ? "Show less"
              : `Show all ${recommendations.length} recommendations`}
          </button>
        </div>
      )}
    </div>
  );
}

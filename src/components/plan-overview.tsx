"use client";

import { WebsiteAnalysis } from "@/types/analysis";
import { SocialProfile } from "@/types/social-profile";

export function PlanOverview({
  analysis,
  socialProfiles,
}: {
  analysis: WebsiteAnalysis;
  socialProfiles?: SocialProfile[];
}) {
  return (
    <div className="bg-surface-raised border border-border rounded-2xl p-6 mb-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-foreground">
              {analysis.brand.name}
            </h2>
            <span className="text-[10px] px-2 py-0.5 bg-brand/10 text-brand border border-brand/20 rounded-md font-medium uppercase tracking-wider">
              {analysis.brand.industry}
            </span>
          </div>
          <p className="text-foreground/60 text-[15px]">{analysis.brand.tagline}</p>
          <p className="text-muted text-xs mt-1.5">
            Tone: {analysis.brand.tone}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted uppercase tracking-wide mr-2">Brand</span>
          {[analysis.brand.primaryColor, analysis.brand.secondaryColor, analysis.brand.accentColor].map((color, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-lg border border-border"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 pt-5 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">
            Value Propositions
          </h3>
          <ul className="space-y-1.5">
            {analysis.valuePropositions.slice(0, 3).map((vp, i) => (
              <li key={i} className="text-[13px] text-foreground/70 leading-snug">
                {vp}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">
            Target Audience
          </h3>
          <ul className="space-y-1.5">
            {analysis.targetAudience.map((ta, i) => (
              <li key={i} className="text-[13px] text-foreground/70 leading-snug">
                {ta}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">
            Key Features
          </h3>
          <ul className="space-y-1.5">
            {analysis.keyFeatures.slice(0, 3).map((f, i) => (
              <li key={i} className="text-[13px] text-foreground/70 leading-snug">
                {f.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {socialProfiles && socialProfiles.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border">
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">
            Social Profiles
          </h3>
          <div className="flex flex-wrap gap-3">
            {socialProfiles.map((sp, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-lg px-3 py-2 text-[12px]"
              >
                <span className="text-foreground font-medium">{sp.platform}</span>
                {sp.handle && (
                  <span className="text-muted ml-2">{sp.handle}</span>
                )}
                {sp.followerCount > 0 && (
                  <span className="text-brand ml-2">
                    {sp.followerCount.toLocaleString()} followers
                  </span>
                )}
                {sp.engagementRate > 0 && (
                  <span className="text-muted ml-2">
                    {sp.engagementRate}% eng.
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { SocialProfile } from "@/types/social-profile";

export function SocialProfilesForm({
  platforms,
  onSubmit,
  onSkip,
}: {
  platforms: string[];
  onSubmit: (profiles: SocialProfile[]) => void;
  onSkip: () => void;
}) {
  const [profiles, setProfiles] = useState<Record<string, { handle: string; followerCount: string; engagementRate: string }>>(
    Object.fromEntries(platforms.map((p) => [p, { handle: "", followerCount: "", engagementRate: "" }]))
  );

  function update(platform: string, field: string, value: string) {
    setProfiles((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  }

  function handleSubmit() {
    const result: SocialProfile[] = platforms
      .map((p) => ({
        platform: p,
        handle: profiles[p].handle,
        followerCount: parseInt(profiles[p].followerCount) || 0,
        engagementRate: parseFloat(profiles[p].engagementRate) || 0,
      }))
      .filter((p) => p.handle || p.followerCount > 0);
    onSubmit(result);
  }

  const platformLabel = (id: string) =>
    id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Social Media Profiles
        </h2>
        <p className="text-sm text-muted">
          Optional: add your social profiles to personalize the plan.
        </p>
      </div>
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div
            key={platform}
            className="bg-surface-raised border border-border rounded-xl p-4 space-y-3"
          >
            <h3 className="text-sm font-medium text-foreground">
              {platformLabel(platform)}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="@handle"
                value={profiles[platform].handle}
                onChange={(e) => update(platform, "handle", e.target.value)}
                className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-brand/40"
              />
              <input
                type="text"
                placeholder="Followers"
                value={profiles[platform].followerCount}
                onChange={(e) => update(platform, "followerCount", e.target.value)}
                className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-brand/40"
              />
              <input
                type="text"
                placeholder="Eng. rate %"
                value={profiles[platform].engagementRate}
                onChange={(e) => update(platform, "engagementRate", e.target.value)}
                className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-brand/40"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-3 bg-surface-raised border border-border text-muted font-medium rounded-xl hover:bg-surface-hover transition-colors"
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-light transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

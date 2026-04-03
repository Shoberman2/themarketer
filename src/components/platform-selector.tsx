"use client";

import { useState } from "react";

const PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: "f" },
  { id: "instagram", name: "Instagram", icon: "ig" },
  { id: "linkedin", name: "LinkedIn", icon: "in" },
  { id: "twitter", name: "Twitter/X", icon: "X" },
  { id: "tiktok", name: "TikTok", icon: "tt" },
  { id: "pinterest", name: "Pinterest", icon: "P" },
  { id: "youtube", name: "YouTube", icon: "yt" },
  { id: "google-ads", name: "Google Ads", icon: "G" },
];

export function PlatformSelector({
  onSelect,
}: {
  onSelect: (platforms: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([
    "facebook",
    "instagram",
  ]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Select Platforms
        </h2>
        <p className="text-sm text-muted">
          Choose the platforms for your marketing campaign.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PLATFORMS.map((platform) => {
          const isActive = selected.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => toggle(platform.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                isActive
                  ? "bg-brand/10 border-brand/40 text-brand"
                  : "bg-surface-raised border-border text-muted hover:border-border-hover hover:text-foreground"
              }`}
            >
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-surface border border-border">
                {platform.icon}
              </span>
              <span className="text-[12px] font-medium">{platform.name}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onSelect(selected)}
        disabled={selected.length === 0}
        className="w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue with {selected.length} platform
        {selected.length !== 1 ? "s" : ""}
      </button>
    </div>
  );
}

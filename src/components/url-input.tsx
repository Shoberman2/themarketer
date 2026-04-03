"use client";

import { useState } from "react";

export function UrlInput({
  onSubmit,
  isLoading,
}: {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let normalized = url.trim();
    if (!normalized.startsWith("http")) {
      normalized = "https://" + normalized;
    }

    try {
      new URL(normalized);
      onSubmit(normalized);
    } catch {
      setError("Please enter a valid URL");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/20 to-brand-dark/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
        <div className="relative flex items-center bg-surface-raised border border-border rounded-2xl overflow-hidden">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-website.com"
            disabled={isLoading}
            className="flex-1 px-6 py-4.5 text-[15px] bg-transparent text-foreground placeholder:text-muted/50 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="mr-2 px-6 py-2.5 bg-brand text-white text-[13px] font-medium hover:bg-brand-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Analyzing
              </span>
            ) : (
              "Generate Plan"
            )}
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-red-400 text-xs text-center">{error}</p>
      )}
    </form>
  );
}

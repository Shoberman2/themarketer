"use client";

import { useState } from "react";

export function ReportForm({
  recommendationId,
  platform,
  template,
  messageAngle,
  onSubmitted,
}: {
  recommendationId: string;
  platform: string;
  template: string;
  messageAngle: string;
  onSubmitted: () => void;
}) {
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  const [reach, setReach] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationId,
          platform,
          template,
          messageAngle,
          postedAt: new Date().toISOString(),
          likes: parseInt(likes) || 0,
          comments: parseInt(comments) || 0,
          shares: parseInt(shares) || 0,
          reach: reach.trim() ? parseInt(reach) : null,
          userNotes: notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to save report");

      setSubmitted(true);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-center">
        <p className="text-sm text-green-600 font-medium">Report saved!</p>
        <p className="text-xs text-muted mt-1">
          Your next recommendation will be smarter.{" "}
          <a href="/performance" className="text-brand underline underline-offset-2">
            View your analytics
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-4">
      <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        How did it do?
      </h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="block text-[10px] text-muted mb-1">Likes</label>
            <input
              type="number"
              min="0"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-white/5 border border-border rounded-lg text-foreground focus:outline-none focus:border-brand/50"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted mb-1">Comments</label>
            <input
              type="number"
              min="0"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-white/5 border border-border rounded-lg text-foreground focus:outline-none focus:border-brand/50"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted mb-1">Shares</label>
            <input
              type="number"
              min="0"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-white/5 border border-border rounded-lg text-foreground focus:outline-none focus:border-brand/50"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted mb-1">
              Reach <span className="text-muted/50">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={reach}
              onChange={(e) => setReach(e.target.value)}
              placeholder="—"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-white/5 border border-border rounded-lg text-foreground focus:outline-none focus:border-brand/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-muted mb-1">
            Notes <span className="text-muted/50">(optional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any observations about this post..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-white/5 border border-border rounded-lg text-foreground placeholder:text-muted/40 focus:outline-none focus:border-brand/50"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-foreground/10 text-foreground text-xs font-medium rounded-lg hover:bg-foreground/15 transition-all disabled:opacity-30"
        >
          {isSubmitting ? "Saving..." : "Save Report"}
        </button>
      </form>
    </div>
  );
}

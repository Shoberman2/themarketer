"use client";

import { useState, useEffect, useCallback } from "react";

interface BriefContent {
  headline: string;
  subheadline: string;
  body: string;
  cta: string;
  template: string;
  platform: string;
  confidence: number;
  reasoning: string;
}

interface BriefData {
  brand_id: string;
  generated_at: string;
  content_recommendation: BriefContent & { adSize: { width: number; height: number; label: string } };
  performance_summary: {
    last_7_days_avg_er: number | null;
    trend: string;
    top_performer: string | null;
    agent_commentary: string;
  };
  campaign_arc: {
    current_phase: string;
    days_in_phase: number;
    phase_recommendation: string | null;
  };
}

interface MorningBriefProps {
  brandId: string;
  brandName: string;
  onNewCampaign: () => void;
}

export function MorningBrief({ brandId, brandName, onNewCampaign }: MorningBriefProps) {
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [briefId, setBriefId] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [graduated, setGraduated] = useState(false);
  const [approvedCount, setApprovedCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState<Partial<BriefContent>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [commentaryExpanded, setCommentaryExpanded] = useState(false);

  const fetchBrief = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/agent/brief?brandId=${brandId}`);
      if (!res.ok) throw new Error("Failed to load brief");
      const data = await res.json();
      setBrief(data.brief);
      setBriefId(data.briefId);
      setAction(data.action);
      setGraduated(data.graduated);
      setApprovedCount(data.approvedCount);
      setReportCount(data.reportCount);
    } catch {
      setError("Brief temporarily unavailable. Using standard mode.");
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchBrief();
  }, [fetchBrief]);

  async function handleAction(type: "approved" | "edited" | "rejected") {
    if (!brief || !briefId) return;
    setActionLoading(true);

    try {
      const payload: Record<string, unknown> = {
        brandId,
        briefId,
        action: type,
        originalContent: brief.content_recommendation,
      };

      if (type === "edited") {
        payload.editedContent = {
          ...brief.content_recommendation,
          ...editFields,
        };
      }
      if (type === "rejected" && rejectReason) {
        payload.rejectReason = rejectReason;
      }

      const res = await fetch("/api/agent/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAction(type);
        setEditing(false);
        setShowRejectInput(false);
      }
    } catch {
      // toast would go here
    } finally {
      setActionLoading(false);
    }
  }

  // --- Skeleton loading ---
  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto space-y-8" aria-busy="true">
        <div className="space-y-4">
          <div className="h-3 w-32 bg-surface rounded animate-pulse" />
          <div className="h-12 w-3/4 bg-surface rounded animate-pulse" />
          <div className="h-4 w-full bg-surface rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-surface rounded animate-pulse" />
          <div className="h-3 w-48 bg-surface rounded animate-pulse" />
        </div>
        <div className="border-t border-border pt-6 space-y-3">
          <div className="h-3 w-24 bg-surface rounded animate-pulse" />
          <div className="h-4 w-full bg-surface rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="max-w-[800px] mx-auto text-center space-y-4 py-20">
        <p className="text-sm text-muted">{error}</p>
        <button
          onClick={onNewCampaign}
          className="text-sm text-foreground underline underline-offset-4 hover:text-muted transition-colors"
        >
          Create new content
        </button>
      </div>
    );
  }

  if (!brief) return null;

  const rec = brief.content_recommendation;
  const perf = brief.performance_summary;
  const arc = brief.campaign_arc;
  const isDone = action === "approved" || action === "edited" || action === "rejected";
  const isIntermediate = !graduated;
  const commentary = perf.agent_commentary || "";
  const showCommentaryMore = commentary.length > 200 && !commentaryExpanded;

  // --- Confidence display ---
  const confidenceText =
    rec.confidence >= 5
      ? `Confidence: ${rec.confidence}/10`
      : "Early draft — your feedback sharpens this";

  // --- Trend arrow ---
  const trendDisplay: Record<string, string> = {
    improving: "↑ improving",
    declining: "↓ declining",
    stable: "→ stable",
    insufficient_data: "",
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-0">
      {/* Brand label */}
      <div className="text-[11px] uppercase tracking-[2px] text-muted mb-6">
        {brandName}
      </div>

      <div className="border-t border-border" />

      {/* Content recommendation */}
      <div className="py-8 space-y-4">
        {isIntermediate && (
          <p className="text-sm text-muted">
            Your agent is still learning {brandName}.
            {approvedCount < 3 && ` ${3 - approvedCount} more approvals to unlock full briefs.`}
            {reportCount < 1 && " Submit a performance report to unlock insights."}
          </p>
        )}

        {isDone ? (
          // Done state
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted">
              {action === "rejected" ? "✕" : "✓"}{" "}
              {action === "approved"
                ? "Approved"
                : action === "edited"
                  ? "Approved with edits"
                  : "Rejected"}
            </div>
            <h2
              className={`font-serif ${isIntermediate ? "text-[32px]" : "italic text-[48px] sm:text-[48px]"} leading-[1.1] tracking-tight ${
                isDone ? "text-muted" : "text-foreground"
              }`}
              style={{ fontSize: isIntermediate ? 32 : undefined }}
            >
              &ldquo;{rec.headline}&rdquo;
            </h2>
            <p className="text-sm text-muted">
              Your agent is learning from this. Come back tomorrow for your next
              brief.
            </p>
          </div>
        ) : editing ? (
          // Edit state
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs text-muted uppercase tracking-wider">
                Headline
              </span>
              <input
                type="text"
                defaultValue={rec.headline}
                onChange={(e) =>
                  setEditFields((f) => ({ ...f, headline: e.target.value }))
                }
                className="mt-1 block w-full px-3 py-2 text-sm bg-[var(--background)] border border-border rounded-[6px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted uppercase tracking-wider">
                Body
              </span>
              <textarea
                defaultValue={rec.body}
                rows={3}
                onChange={(e) =>
                  setEditFields((f) => ({ ...f, body: e.target.value }))
                }
                className="mt-1 block w-full px-3 py-2 text-sm bg-[var(--background)] border border-border rounded-[6px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted uppercase tracking-wider">
                CTA
              </span>
              <input
                type="text"
                defaultValue={rec.cta}
                onChange={(e) =>
                  setEditFields((f) => ({ ...f, cta: e.target.value }))
                }
                className="mt-1 block w-full px-3 py-2 text-sm bg-[var(--background)] border border-border rounded-[6px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("edited")}
                disabled={actionLoading}
                className="px-5 py-2.5 text-sm font-medium bg-foreground text-[var(--background)] rounded-[6px] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {actionLoading ? "Saving..." : "Approve with edits"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditFields({});
                }}
                className="px-5 py-2.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Normal display
          <div className="space-y-4">
            <h2
              className={`font-serif ${isIntermediate ? "text-[32px]" : "italic text-[48px] sm:text-[48px]"} leading-[1.1] tracking-tight text-foreground`}
              style={isIntermediate ? { fontSize: 32 } : undefined}
            >
              &ldquo;{rec.headline}&rdquo;
            </h2>

            {rec.subheadline && (
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                {rec.subheadline}
              </p>
            )}

            {rec.body && (
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                {rec.body}
              </p>
            )}

            <div className="text-xs text-muted space-x-2">
              <span>{rec.platform}</span>
              <span>·</span>
              <span>{confidenceText}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleAction("approved")}
                disabled={actionLoading}
                aria-label="Approve this content recommendation"
                className="px-5 py-2.5 text-sm font-medium bg-foreground text-[var(--background)] rounded-[6px] hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
              >
                {actionLoading ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit this content recommendation"
                className="px-5 py-2.5 text-sm font-medium border border-foreground text-foreground rounded-[6px] hover:bg-foreground hover:text-[var(--background)] transition-colors min-h-[44px]"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (showRejectInput) {
                    handleAction("rejected");
                  } else {
                    setShowRejectInput(true);
                  }
                }}
                disabled={actionLoading}
                aria-label="Reject this content recommendation"
                className="px-5 py-2.5 text-sm font-medium border border-foreground text-foreground rounded-[6px] hover:bg-foreground hover:text-[var(--background)] transition-colors min-h-[44px]"
              >
                {actionLoading && showRejectInput ? "Noted..." : "Reject"}
              </button>
            </div>

            {showRejectInput && (
              <div className="space-y-2">
                <textarea
                  placeholder="Why? (optional — helps your agent learn)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  className="block w-full px-3 py-2 text-sm bg-[var(--background)] border border-border rounded-[6px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance summary */}
      {(perf.last_7_days_avg_er !== null || perf.agent_commentary) && (
        <>
          <div className="border-t border-border" />
          <div className="py-6 space-y-3">
            <div className="text-xs uppercase tracking-[2px] text-muted">
              Last 7 days
            </div>

            {perf.last_7_days_avg_er !== null && (
              <div className="flex items-baseline gap-3">
                <span
                  className="text-sm text-foreground"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {(perf.last_7_days_avg_er * 100).toFixed(1)}% avg ER
                </span>
                {perf.trend && perf.trend !== "insufficient_data" && (
                  <span className="text-sm text-muted">
                    {trendDisplay[perf.trend] || ""}
                  </span>
                )}
              </div>
            )}

            {perf.top_performer && (
              <p className="text-sm text-muted">
                Top: {perf.top_performer}
              </p>
            )}

            {commentary && (
              <p className="text-sm italic text-muted" role="note">
                {showCommentaryMore
                  ? commentary.slice(0, 200) + "..."
                  : commentary}
                {showCommentaryMore && (
                  <button
                    onClick={() => setCommentaryExpanded(true)}
                    className="ml-1 underline underline-offset-2 text-xs hover:text-foreground transition-colors"
                  >
                    read more
                  </button>
                )}
              </p>
            )}
          </div>
        </>
      )}

      {/* Empty perf state */}
      {perf.last_7_days_avg_er === null && !perf.agent_commentary && reportCount === 0 && (
        <>
          <div className="border-t border-border" />
          <div className="py-6">
            <p className="text-sm text-muted">
              No performance data yet. After 3 reports, I&apos;ll start seeing patterns.
            </p>
          </div>
        </>
      )}

      {/* Campaign arc */}
      <>
        <div className="border-t border-border" />
        <div className="py-6 space-y-1">
          <div className="text-xs uppercase tracking-[2px] text-muted">
            Campaign arc
          </div>
          {approvedCount === 0 ? (
            <p className="text-sm text-muted">
              Campaign tracking starts after your first approved content.
            </p>
          ) : (
            <p className="text-sm text-foreground">
              <span className="font-semibold capitalize">{arc.current_phase}</span>
              {" · "}
              <span>Day {arc.days_in_phase}</span>
              {arc.phase_recommendation && (
                <>
                  {" · "}
                  <span className="text-muted">
                    &ldquo;{arc.phase_recommendation}&rdquo;
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SavedPlan {
  id: string;
  url: string;
  createdAt: string;
  brandName: string;
}

export default function SavedPlansPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/plans");
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(planId: string) {
    if (!confirm("Delete this plan?")) return;
    await fetch(`/api/plans?id=${planId}`, { method: "DELETE" });
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] text-brand font-medium uppercase tracking-widest">
          Your Campaigns
        </span>
        <h1 className="text-3xl font-bold text-foreground mt-1">Saved Plans</h1>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-surface-raised border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-muted mb-4">No campaigns yet.</p>
          <Link
            href="/"
            className="text-sm text-brand hover:text-brand-light transition-colors"
          >
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-surface-raised border border-border rounded-xl p-5 hover:bg-surface-hover hover:border-border-hover transition-all group"
            >
              <Link href={`/plan/${plan.id}`} className="block">
                <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-brand-light transition-colors">
                  {plan.brandName}
                </h3>
                <p className="text-[13px] text-muted mb-3 truncate">
                  {plan.url}
                </p>
                <p className="text-[11px] text-muted">
                  {new Date(plan.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </Link>
              <button
                onClick={() => handleDelete(plan.id)}
                className="mt-3 text-[11px] text-muted hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

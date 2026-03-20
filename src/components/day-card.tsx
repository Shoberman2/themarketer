"use client";

import Link from "next/link";
import { DayPlan } from "@/types/plan";

const PHASE_COLORS: Record<string, string> = {
  Awareness: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Consideration: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Social Proof": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Conversion: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Retention & Engagement":
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Scaling & Optimization":
    "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DayCard({
  day,
  planId,
}: {
  day: DayPlan;
  planId: string;
}) {
  const phaseClass =
    PHASE_COLORS[day.weekPhase] || "bg-white/5 text-muted border-border";

  return (
    <Link href={`/plan/${planId}/day/${day.dayIndex}`}>
      <div className="bg-surface-raised border border-border rounded-xl p-4 hover:bg-surface-hover hover:border-border-hover transition-all cursor-pointer group h-full">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <span className="text-[11px] text-muted font-mono tracking-wide">
              DAY {String(day.dayIndex + 1).padStart(2, "0")}
            </span>
            <div className="text-[10px] text-muted">
              {formatShortDate(day.date)}
            </div>
          </div>
          {day.status === "generated" && (
            <span className="w-2 h-2 rounded-full bg-brand" />
          )}
        </div>
        <h3 className="text-[13px] font-medium text-foreground/90 mb-3 line-clamp-2 leading-snug group-hover:text-foreground">
          {day.theme}
        </h3>
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${phaseClass}`}
          >
            {day.weekPhase}
          </span>
          <span className="text-[10px] text-muted">
            {day.tasks.length} task{day.tasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}

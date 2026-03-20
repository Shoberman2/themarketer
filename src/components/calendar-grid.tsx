"use client";

import { DayPlan } from "@/types/plan";
import { DayCard } from "./day-card";

const WEEK_LABELS: Record<number, string> = {
  0: "Awareness",
  1: "Consideration",
  2: "Social Proof",
  3: "Conversion",
  4: "Retention & Engagement",
  5: "Retention & Engagement",
  6: "Scaling & Optimization",
  7: "Scaling & Optimization",
};

export function CalendarGrid({
  days,
  planId,
  weeklyThemes,
}: {
  days: DayPlan[];
  planId: string;
  weeklyThemes: string[];
}) {
  const weekCount = Math.ceil(days.length / 7);
  const weeks: DayPlan[][] = [];
  for (let i = 0; i < weekCount; i++) {
    const start = i * 7;
    const end = Math.min(start + 7, days.length);
    if (start < days.length) {
      weeks.push(days.slice(start, end));
    }
  }

  return (
    <div className="space-y-10">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex}>
          <div className="flex items-baseline gap-3 mb-4">
            <h3 className="text-base font-semibold text-foreground">
              Week {weekIndex + 1}
            </h3>
            <span className="text-[11px] text-brand font-medium uppercase tracking-wider">
              {WEEK_LABELS[weekIndex] || `Week ${weekIndex + 1}`}
            </span>
            {weeklyThemes[weekIndex] && (
              <span className="text-xs text-muted ml-auto hidden sm:block">
                {weeklyThemes[weekIndex]}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {week.map((day) => (
              <DayCard key={day.dayIndex} day={day} planId={planId} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

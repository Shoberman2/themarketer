import { getDb } from "./index";
import { WebsiteAnalysis } from "@/types/analysis";
import { MarketingPlan, DayPlan } from "@/types/plan";
import { nanoid } from "nanoid";

export function savePlan(
  plan: MarketingPlan,
  analysis: WebsiteAnalysis
): void {
  const db = getDb();
  const insertPlan = db.prepare(
    "INSERT OR REPLACE INTO plans (id, url, analysis, strategy, created_at, target_platforms, social_profiles, influencer_recommendations, total_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertDay = db.prepare(
    "INSERT OR REPLACE INTO day_plans (id, plan_id, day_index, date, theme, tasks, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  const transaction = db.transaction(() => {
    insertPlan.run(
      plan.id,
      plan.url,
      JSON.stringify(analysis),
      JSON.stringify({ weeklyThemes: plan.weeklyThemes }),
      plan.createdAt,
      JSON.stringify(plan.targetPlatforms || []),
      JSON.stringify(plan.socialProfiles || []),
      JSON.stringify(plan.influencerRecommendations || []),
      plan.totalDays || 30
    );

    for (const day of plan.days) {
      insertDay.run(
        nanoid(12),
        plan.id,
        day.dayIndex,
        day.date,
        day.theme,
        JSON.stringify(day.tasks),
        day.status
      );
    }
  });

  transaction();
}

export function getPlan(planId: string): {
  plan: MarketingPlan;
  analysis: WebsiteAnalysis;
} | null {
  const db = getDb();

  const planRow = db
    .prepare("SELECT * FROM plans WHERE id = ?")
    .get(planId) as {
    id: string;
    url: string;
    analysis: string;
    strategy: string;
    created_at: string;
    target_platforms?: string;
    social_profiles?: string;
    influencer_recommendations?: string;
    total_days?: number;
    extended_at?: string;
  } | undefined;

  if (!planRow) return null;

  const dayRows = db
    .prepare(
      "SELECT * FROM day_plans WHERE plan_id = ? ORDER BY day_index"
    )
    .all(planId) as {
    day_index: number;
    date: string;
    theme: string;
    tasks: string;
    status: string;
  }[];

  const analysis = JSON.parse(planRow.analysis) as WebsiteAnalysis;
  const strategy = JSON.parse(planRow.strategy);

  const days: DayPlan[] = dayRows.map((row) => ({
    dayIndex: row.day_index,
    date: row.date,
    theme: row.theme,
    weekPhase: "",
    tasks: JSON.parse(row.tasks),
    status: row.status as DayPlan["status"],
  }));

  return {
    plan: {
      id: planRow.id,
      url: planRow.url,
      createdAt: planRow.created_at,
      days,
      weeklyThemes: strategy.weeklyThemes || [],
      targetPlatforms: safeJsonParse(planRow.target_platforms, []),
      socialProfiles: safeJsonParse(planRow.social_profiles, []),
      influencerRecommendations: safeJsonParse(
        planRow.influencer_recommendations,
        []
      ),
      totalDays: planRow.total_days || 30,
      extendedAt: planRow.extended_at || undefined,
    },
    analysis,
  };
}

function safeJsonParse<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function listPlans(): {
  id: string;
  url: string;
  createdAt: string;
  brandName: string;
}[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT id, url, analysis, created_at FROM plans ORDER BY created_at DESC")
    .all() as { id: string; url: string; analysis: string; created_at: string }[];

  return rows.map((row) => {
    const analysis = JSON.parse(row.analysis) as WebsiteAnalysis;
    return {
      id: row.id,
      url: row.url,
      createdAt: row.created_at,
      brandName: analysis.brand.name,
    };
  });
}

export function deletePlan(planId: string): void {
  const db = getDb();
  const transaction = db.transaction(() => {
    db.prepare("DELETE FROM generated_assets WHERE plan_id = ?").run(planId);
    db.prepare("DELETE FROM day_plans WHERE plan_id = ?").run(planId);
    db.prepare("DELETE FROM plans WHERE id = ?").run(planId);
  });
  transaction();
}

export function updateDayStatus(
  planId: string,
  dayIndex: number,
  status: DayPlan["status"]
): void {
  const db = getDb();
  db.prepare(
    "UPDATE day_plans SET status = ? WHERE plan_id = ? AND day_index = ?"
  ).run(status, planId, dayIndex);
}

export function saveGeneratedAsset(
  taskId: string,
  planId: string,
  variantName: string,
  sizeLabel: string,
  imageData: string
): void {
  const db = getDb();
  db.prepare(
    "INSERT INTO generated_assets (id, task_id, plan_id, variant_name, size_label, image_data, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
  ).run(nanoid(12), taskId, planId, variantName, sizeLabel, imageData);
}

export function getGeneratedAssets(
  planId: string,
  taskId: string
): { id: string; variant_name: string; size_label: string; image_data: string }[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, variant_name, size_label, image_data FROM generated_assets WHERE plan_id = ? AND task_id = ?"
    )
    .all(planId, taskId) as { id: string; variant_name: string; size_label: string; image_data: string }[];
}

export function appendDaysToPlan(
  planId: string,
  newDays: DayPlan[],
  updatedWeeklyThemes: string[]
): void {
  const db = getDb();
  const insertDay = db.prepare(
    "INSERT INTO day_plans (id, plan_id, day_index, date, theme, tasks, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  const transaction = db.transaction(() => {
    for (const day of newDays) {
      insertDay.run(
        nanoid(12),
        planId,
        day.dayIndex,
        day.date,
        day.theme,
        JSON.stringify(day.tasks),
        day.status
      );
    }

    db.prepare(
      "UPDATE plans SET strategy = ?, total_days = 60, extended_at = datetime('now') WHERE id = ?"
    ).run(
      JSON.stringify({ weeklyThemes: updatedWeeklyThemes }),
      planId
    );
  });

  transaction();
}

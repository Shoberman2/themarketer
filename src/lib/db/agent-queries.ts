import { getDb } from "./index";
import { nanoid } from "nanoid";

// --- Brand Memories ---

export interface BrandMemory {
  id: string;
  brandId: string;
  path: string;
  content: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export function upsertMemory(
  brandId: string,
  path: string,
  content: string,
  source: string
): string {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM brand_memories WHERE brand_id = ? AND path = ?")
    .get(brandId, path) as { id: string } | undefined;

  if (existing) {
    db.prepare(
      "UPDATE brand_memories SET content = ?, source = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(content, source, existing.id);
    return existing.id;
  }

  const id = nanoid(12);
  db.prepare(
    "INSERT INTO brand_memories (id, brand_id, path, content, source) VALUES (?, ?, ?, ?, ?)"
  ).run(id, brandId, path, content, source);
  return id;
}

export function getMemory(brandId: string, path: string): BrandMemory | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM brand_memories WHERE brand_id = ? AND path = ?")
    .get(brandId, path) as {
    id: string;
    brand_id: string;
    path: string;
    content: string;
    source: string;
    created_at: string;
    updated_at: string;
  } | undefined;
  if (!row) return null;
  return {
    id: row.id,
    brandId: row.brand_id,
    path: row.path,
    content: row.content,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listMemories(brandId: string, pathPrefix?: string): BrandMemory[] {
  const db = getDb();
  let query = "SELECT * FROM brand_memories WHERE brand_id = ?";
  const params: string[] = [brandId];
  if (pathPrefix) {
    query += " AND path LIKE ?";
    params.push(pathPrefix + "%");
  }
  query += " ORDER BY updated_at DESC";
  const rows = db.prepare(query).all(...params) as {
    id: string;
    brand_id: string;
    path: string;
    content: string;
    source: string;
    created_at: string;
    updated_at: string;
  }[];
  return rows.map((row) => ({
    id: row.id,
    brandId: row.brand_id,
    path: row.path,
    content: row.content,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export function countMemoriesByPrefix(brandId: string, prefix: string): number {
  const db = getDb();
  const row = db
    .prepare("SELECT COUNT(*) as count FROM brand_memories WHERE brand_id = ? AND path LIKE ?")
    .get(brandId, prefix + "%") as { count: number };
  return row.count;
}

// --- Campaign Arcs ---

export interface CampaignArc {
  id: string;
  brandId: string;
  currentPhase: string;
  phaseStartedAt: string;
  phasePerfAvgEr: number;
  phaseReportCount: number;
  agentRecommendation: string;
  createdAt: string;
}

export function getOrCreateArc(brandId: string): CampaignArc {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM campaign_arcs WHERE brand_id = ?")
    .get(brandId) as {
    id: string;
    brand_id: string;
    current_phase: string;
    phase_started_at: string;
    phase_perf_avg_er: number;
    phase_report_count: number;
    agent_recommendation: string;
    created_at: string;
  } | undefined;

  if (row) {
    return {
      id: row.id,
      brandId: row.brand_id,
      currentPhase: row.current_phase,
      phaseStartedAt: row.phase_started_at,
      phasePerfAvgEr: row.phase_perf_avg_er,
      phaseReportCount: row.phase_report_count,
      agentRecommendation: row.agent_recommendation,
      createdAt: row.created_at,
    };
  }

  const id = nanoid(12);
  db.prepare(
    "INSERT INTO campaign_arcs (id, brand_id) VALUES (?, ?)"
  ).run(id, brandId);

  return {
    id,
    brandId,
    currentPhase: "awareness",
    phaseStartedAt: new Date().toISOString(),
    phasePerfAvgEr: 0,
    phaseReportCount: 0,
    agentRecommendation: "",
    createdAt: new Date().toISOString(),
  };
}

export function updateArc(
  brandId: string,
  updates: {
    currentPhase?: string;
    phaseStartedAt?: string;
    phasePerfAvgEr?: number;
    phaseReportCount?: number;
    agentRecommendation?: string;
  }
): void {
  const db = getDb();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (updates.currentPhase !== undefined) {
    fields.push("current_phase = ?");
    values.push(updates.currentPhase);
  }
  if (updates.phaseStartedAt !== undefined) {
    fields.push("phase_started_at = ?");
    values.push(updates.phaseStartedAt);
  }
  if (updates.phasePerfAvgEr !== undefined) {
    fields.push("phase_perf_avg_er = ?");
    values.push(updates.phasePerfAvgEr);
  }
  if (updates.phaseReportCount !== undefined) {
    fields.push("phase_report_count = ?");
    values.push(updates.phaseReportCount);
  }
  if (updates.agentRecommendation !== undefined) {
    fields.push("agent_recommendation = ?");
    values.push(updates.agentRecommendation);
  }
  if (fields.length === 0) return;
  values.push(brandId);
  db.prepare(
    `UPDATE campaign_arcs SET ${fields.join(", ")} WHERE brand_id = ?`
  ).run(...values);
}

// --- Portfolio Insights ---

export function upsertInsight(
  insightType: string,
  insightKey: string,
  insightValue: object
): void {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM portfolio_insights WHERE insight_type = ? AND insight_key = ?")
    .get(insightType, insightKey) as { id: string } | undefined;

  if (existing) {
    db.prepare(
      "UPDATE portfolio_insights SET insight_value = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(JSON.stringify(insightValue), existing.id);
  } else {
    db.prepare(
      "INSERT INTO portfolio_insights (id, insight_type, insight_key, insight_value) VALUES (?, ?, ?, ?)"
    ).run(nanoid(12), insightType, insightKey, JSON.stringify(insightValue));
  }
}

export function getInsights(insightType?: string, limit: number = 10): {
  type: string;
  key: string;
  value: object;
}[] {
  const db = getDb();
  let query = "SELECT * FROM portfolio_insights";
  const params: (string | number)[] = [];
  if (insightType) {
    query += " WHERE insight_type = ?";
    params.push(insightType);
  }
  query += " ORDER BY updated_at DESC LIMIT ?";
  params.push(limit);

  const rows = db.prepare(query).all(...params) as {
    insight_type: string;
    insight_key: string;
    insight_value: string;
  }[];
  return rows.map((r) => ({
    type: r.insight_type,
    key: r.insight_key,
    value: JSON.parse(r.insight_value),
  }));
}

// --- Agent Briefs ---

export interface AgentBrief {
  id: string;
  brandId: string;
  briefData: object;
  action: string | null;
  actionAt: string | null;
  feedbackData: object | null;
  createdAt: string;
}

export function saveBrief(brandId: string, briefData: object): string {
  const db = getDb();
  const id = nanoid(12);
  db.prepare(
    "INSERT INTO agent_briefs (id, brand_id, brief_data) VALUES (?, ?, ?)"
  ).run(id, brandId, JSON.stringify(briefData));
  return id;
}

export function getTodayBrief(brandId: string): AgentBrief | null {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const row = db
    .prepare(
      "SELECT * FROM agent_briefs WHERE brand_id = ? AND created_at >= ? ORDER BY created_at DESC LIMIT 1"
    )
    .get(brandId, today) as {
    id: string;
    brand_id: string;
    brief_data: string;
    action: string | null;
    action_at: string | null;
    feedback_data: string | null;
    created_at: string;
  } | undefined;

  if (!row) return null;
  return {
    id: row.id,
    brandId: row.brand_id,
    briefData: JSON.parse(row.brief_data),
    action: row.action,
    actionAt: row.action_at,
    feedbackData: row.feedback_data ? JSON.parse(row.feedback_data) : null,
    createdAt: row.created_at,
  };
}

export function updateBriefAction(
  briefId: string,
  action: "approved" | "edited" | "rejected",
  feedbackData?: object
): void {
  const db = getDb();
  db.prepare(
    "UPDATE agent_briefs SET action = ?, action_at = datetime('now'), feedback_data = ? WHERE id = ?"
  ).run(action, feedbackData ? JSON.stringify(feedbackData) : null, briefId);
}

export function countApprovedBriefs(brandId: string): number {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT COUNT(*) as count FROM agent_briefs WHERE brand_id = ? AND action IN ('approved', 'edited')"
    )
    .get(brandId) as { count: number };
  return row.count;
}

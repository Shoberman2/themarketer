export const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  analysis TEXT NOT NULL,
  strategy TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS day_plans (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  day_index INTEGER NOT NULL,
  date TEXT NOT NULL,
  theme TEXT NOT NULL,
  tasks TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  primary_color TEXT DEFAULT '',
  secondary_color TEXT DEFAULT '',
  accent_color TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  tone TEXT DEFAULT '',
  analysis TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  analysis TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  image_data TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  reported INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS performance_reports (
  id TEXT PRIMARY KEY,
  recommendation_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  template TEXT NOT NULL,
  message_angle TEXT NOT NULL DEFAULT '',
  posted_at TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  reach INTEGER,
  user_notes TEXT DEFAULT '',
  reported_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (recommendation_id) REFERENCES recommendations(id)
);

CREATE TABLE IF NOT EXISTS generated_assets (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  size_label TEXT NOT NULL,
  image_data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const CREATE_AGENT_TABLES = `
CREATE TABLE IF NOT EXISTS brand_memories (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id),
  path TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(brand_id, path)
);

CREATE TABLE IF NOT EXISTS campaign_arcs (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id),
  current_phase TEXT NOT NULL DEFAULT 'awareness',
  phase_started_at TEXT NOT NULL DEFAULT (datetime('now')),
  phase_perf_avg_er REAL DEFAULT 0,
  phase_report_count INTEGER DEFAULT 0,
  agent_recommendation TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(brand_id)
);

CREATE TABLE IF NOT EXISTS portfolio_insights (
  id TEXT PRIMARY KEY,
  insight_type TEXT NOT NULL,
  insight_key TEXT NOT NULL,
  insight_value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(insight_type, insight_key)
);

CREATE TABLE IF NOT EXISTS agent_briefs (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id),
  brief_data TEXT NOT NULL,
  action TEXT DEFAULT NULL,
  action_at TEXT DEFAULT NULL,
  feedback_data TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const MIGRATE_COLUMNS = [
  "ALTER TABLE plans ADD COLUMN target_platforms TEXT DEFAULT '[]'",
  "ALTER TABLE plans ADD COLUMN social_profiles TEXT DEFAULT '[]'",
  "ALTER TABLE plans ADD COLUMN influencer_recommendations TEXT DEFAULT '[]'",
  "ALTER TABLE plans ADD COLUMN total_days INTEGER DEFAULT 30",
  "ALTER TABLE plans ADD COLUMN extended_at TEXT",
  "ALTER TABLE plans ADD COLUMN brand_id TEXT DEFAULT ''",
  "ALTER TABLE recommendations ADD COLUMN brand_id TEXT DEFAULT ''",
  "ALTER TABLE performance_reports ADD COLUMN brand_id TEXT DEFAULT ''",
];

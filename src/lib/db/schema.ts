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

export const MIGRATE_COLUMNS = [
  "ALTER TABLE plans ADD COLUMN target_platforms TEXT DEFAULT '[]'",
  "ALTER TABLE plans ADD COLUMN social_profiles TEXT DEFAULT '[]'",
  "ALTER TABLE plans ADD COLUMN influencer_recommendations TEXT DEFAULT '[]'",
  "ALTER TABLE plans ADD COLUMN total_days INTEGER DEFAULT 30",
  "ALTER TABLE plans ADD COLUMN extended_at TEXT",
];

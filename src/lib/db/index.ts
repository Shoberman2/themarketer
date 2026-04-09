import Database from "better-sqlite3";
import path from "path";
import { CREATE_TABLES, CREATE_AGENT_TABLES, MIGRATE_COLUMNS } from "./schema";
import { migrateBrands } from "./migrate-brands";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), "themarketer.db");
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.exec(CREATE_TABLES);
    db.exec(CREATE_AGENT_TABLES);

    for (const sql of MIGRATE_COLUMNS) {
      try {
        db.exec(sql);
      } catch {
        // Column already exists — ignore
      }
    }

    // Migrate existing data to brands (idempotent)
    migrateBrands();
  }
  return db;
}

import { getDb } from "./index";
import { WebsiteAnalysis } from "@/types/analysis";
import { extractDomain } from "@/types/brand";
import { nanoid } from "nanoid";

/**
 * One-time migration: creates brand entities from existing plans and
 * backfills brand_id on plans, recommendations, and performance_reports.
 * Idempotent — safe to run multiple times.
 */
export function migrateBrands(): void {
  const db = getDb();

  // Check if migration is needed (any plans without brand_id)
  const unmigratedCount = db
    .prepare("SELECT COUNT(*) as count FROM plans WHERE brand_id = '' OR brand_id IS NULL")
    .get() as { count: number };

  if (unmigratedCount.count === 0) return;

  const transaction = db.transaction(() => {
    // Get all plans with their URLs and analysis
    const plans = db
      .prepare("SELECT id, url, analysis FROM plans WHERE brand_id = '' OR brand_id IS NULL")
      .all() as { id: string; url: string; analysis: string }[];

    // Track created brands by domain
    const brandsByDomain = new Map<string, string>();

    for (const plan of plans) {
      const domain = extractDomain(plan.url);
      let brandId = brandsByDomain.get(domain);

      if (!brandId) {
        // Check if brand already exists for this domain
        const existing = db
          .prepare("SELECT id FROM brands WHERE domain = ?")
          .get(domain) as { id: string } | undefined;

        if (existing) {
          brandId = existing.id;
        } else {
          // Create brand from plan analysis
          brandId = nanoid(12);
          try {
            const analysis = JSON.parse(plan.analysis) as WebsiteAnalysis;
            db.prepare(
              `INSERT INTO brands (id, name, url, domain, primary_color, secondary_color, accent_color, industry, tone, analysis)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).run(
              brandId,
              analysis.brand.name,
              plan.url,
              domain,
              analysis.brand.primaryColor || "",
              analysis.brand.secondaryColor || "",
              analysis.brand.accentColor || "",
              analysis.brand.industry || "",
              analysis.brand.tone || "",
              plan.analysis
            );
          } catch {
            // If analysis parsing fails, create a minimal brand
            db.prepare(
              `INSERT INTO brands (id, name, url, domain) VALUES (?, ?, ?, ?)`
            ).run(brandId, domain, plan.url, domain);
          }
        }
        brandsByDomain.set(domain, brandId);
      }

      // Backfill plan
      db.prepare("UPDATE plans SET brand_id = ? WHERE id = ?").run(brandId, plan.id);
    }

    // Backfill recommendations by matching URL domain
    const recs = db
      .prepare("SELECT id, url FROM recommendations WHERE brand_id = '' OR brand_id IS NULL")
      .all() as { id: string; url: string }[];

    for (const rec of recs) {
      const domain = extractDomain(rec.url);
      const brandId = brandsByDomain.get(domain);
      if (brandId) {
        db.prepare("UPDATE recommendations SET brand_id = ? WHERE id = ?").run(brandId, rec.id);
      }
    }

    // Backfill performance_reports through recommendations
    db.prepare(`
      UPDATE performance_reports SET brand_id = (
        SELECT r.brand_id FROM recommendations r WHERE r.id = performance_reports.recommendation_id
      ) WHERE brand_id = '' OR brand_id IS NULL
    `).run();
  });

  transaction();
}

# TODOs

## ~~Add error handling to Satori render pipeline~~ DONE

Added try/catch to `renderSingleAd()` and `renderAdsForTask()`. Failed variants are skipped with console.error logging. `pngData.free()` now called in `finally` block to prevent WASM memory leaks.

## ~~Add SQLite error handling wrapper~~ DONE

Added `safeQuery()` wrapper and `DbError` class in `src/lib/db/index.ts`. Wrapped all write operations in `queries.ts` and `agent-queries.ts`.

## ~~Clean up/delete Next.js web app (legacy)~~ DONE

Removed src/, public/, node_modules/, .next/, and all Next.js config files. Influencer database was already embedded in the /influencers-outreach CLI command. README updated.

## ~~Fix RAM leak in PNG renderer~~ DONE

Root cause: `pngData.free()` was never called after `resvg.render()`, leaking WASM heap memory on every PNG render. Fixed with try/finally block.

---

## Consolidate AI providers: migrate OpenAI to Claude

**What:** Replace all OpenAI API calls (analyze-website.ts, generate-plan.ts, recommend.ts) with Claude API calls through the new claude.ts wrapper.

**Why:** Running dual AI providers (OpenAI + Claude) means two API bills, two failure modes, two prompt engineering styles, and two output characteristics.

**Note:** Now that the web app is deleted, this is only relevant if the web app is ever rebuilt. The CLI commands use Claude Code's built-in Claude API directly.

**Status:** May be obsolete — evaluate if web app is rebuilt.

## Consolidate /outreach-plan and /influencers-outreach

**What:** Evaluate whether /outreach-plan (generic outreach targets) should be replaced by /influencers-outreach (curated database with fit scoring) or if both serve distinct enough purposes to coexist.

**Why:** The two commands overlap in purpose. /outreach-plan generates generic profile descriptions ("find someone like X"), while /influencers-outreach matches against real curated influencers with scoring. Having both may confuse users.

**Effort:** S (human: ~30min / CC: ~5min)

**Priority:** P3

**Depends on:** /influencers-outreach shipped and tested. Observe real usage before consolidating.

## Expand curated influencer database

**What:** Add 20-30 more influencers to the curated database, focusing on underrepresented industries (automotive: 3 currently, real estate: 3, education: 3).

**Why:** Better match quality for niche industries. Currently some industries only have 2-3 influencer options, which limits the value of the scoring system.

**Effort:** M (human: ~2hrs research / CC: ~10min formatting)

**Priority:** P3

**Depends on:** /influencers-outreach shipped. Real usage data would inform which industries need more coverage.

## Competitive Intelligence (Phase 2)

**What:** Agent periodically web-searches competitors' marketing activity for each brand. Identifies what competitors are doing and suggests counter-positioning.

**Why:** A real marketing agency monitors competitors. This is the intelligence layer that differentiates the agent from a content generator.

**Effort:** M (human: ~2 days / CC: ~20 min)

**Depends on:** Web search capability (Claude Managed Agents or browse tool).

## Cross-Brand Pattern Mining (Phase 2+)

**What:** Agent mines performance patterns across all brands in the portfolio. Shared insights like "testimonial templates outperform hero-cta for service businesses across all brands."

**Why:** An agency's competitive advantage is cross-client pattern recognition. This is a unique differentiator.

**Effort:** M (human: ~2 days / CC: ~20 min)

**Depends on:** 50+ performance reports across multiple brands.

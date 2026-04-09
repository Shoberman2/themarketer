# TODOs

## Add error handling to Satori render pipeline

**What:** Add try/catch to `renderSingleAd()` and `renderAdsForTask()` in `src/lib/ad-engine/renderer.ts`.

**Why:** If Satori fails (font loading error, invalid JSX, memory), the entire API call crashes with an unhandled error. The new `/api/recommend` route has its own try/catch as a stopgap, but the existing `/api/generate-content` route is also vulnerable.

**Context:** Discovered during /plan-eng-review outside voice review. The render failure is silent — user sees a 500 error with no explanation. Should return a graceful error or skip the failed variant and continue with others.

**Depends on:** Nothing — can be done independently.

## Add input validation to performance report form

**What:** Add sanity check warnings to the performance report form (likes > 100K, reach > 10M). Warn, don't block.

**Why:** Self-reported data is unreliable. Without guardrails, a typo (999999 likes) pollutes the pattern analysis. Basic "are you sure?" confirmation for outliers.

**Context:** Discovered during /plan-eng-review outside voice for the adaptive feedback loop feature. The form accepts any number. A simple client-side warning for values beyond reasonable thresholds would catch most typos.

**Depends on:** Performance report form (components/report-form.tsx) must exist first.

## Consolidate AI providers: migrate OpenAI to Claude

**What:** Replace all OpenAI API calls (analyze-website.ts, generate-plan.ts, recommend.ts) with Claude API calls through the new claude.ts wrapper.

**Why:** Running dual AI providers (OpenAI + Claude) means two API bills, two failure modes, two prompt engineering styles, and two output characteristics. After Phase 1 validates the Claude agent thesis, consolidate to one provider.

**Context:** Discovered during /plan-ceo-review outside voice. Phase 1 intentionally adds Claude alongside OpenAI (additive, not replacement) to keep the weekend timeline realistic. After validation, migrate everything to Claude for simplicity and cost reduction.

**Effort:** M (human: ~1 week / CC: ~1 hour)

**Depends on:** Phase 1 agent validation complete. Claude API must produce equal or better results than GPT-4o for analyze, recommend, and plan generation tasks.

## Add SQLite error handling wrapper

**What:** Add try/catch wrapper at the query layer for all database operations in src/lib/db/queries.ts. Return typed error responses instead of 500s.

**Why:** SQLite errors (disk full, corruption, connection pool exhaustion) crash the app silently. With 3 new agent endpoints hitting SQLite heavily (brand_memories reads/writes, campaign_arcs updates, briefs cache), the blast radius of unhandled DB errors increases.

**Context:** Discovered during /plan-ceo-review Section 2 (Error & Rescue Map). Pre-existing gap in all existing endpoints, now more urgent with agent endpoints.

**Effort:** S (human: ~2 hours / CC: ~5 min)

**Depends on:** Nothing. Can be done independently.

## Competitive Intelligence (Phase 2)

**What:** Agent periodically web-searches competitors' marketing activity for each brand. Identifies what competitors are doing and suggests counter-positioning. Stored in Memory Store under /competitive/ path.

**Why:** A real marketing agency monitors competitors. This is the intelligence layer that differentiates the agent from a content generator.

**Context:** Deferred from /plan-ceo-review SCOPE EXPANSION. Requires Claude Managed Agents web search tool (built-in). Cannot be implemented in Phase 1 (raw API has no web search).

**Effort:** M (human: ~2 days / CC: ~20 min)

**Depends on:** Phase 2 migration to Claude Managed Agents complete.

## Cross-Brand Pattern Mining (Phase 2+)

**What:** Agent mines performance patterns across all brands in the portfolio. Shared insights like "testimonial templates outperform hero-cta for service businesses across all brands."

**Why:** An agency's competitive advantage is cross-client pattern recognition. This is a unique differentiator.

**Context:** Originally accepted in /plan-ceo-review, then deferred after outside voice challenge. With 5 brands and ~20 data points, there isn't enough data for meaningful statistical patterns. Build when 50+ performance reports exist across multiple brands.

**Effort:** M (human: ~2 days / CC: ~20 min)

**Depends on:** 50+ performance reports across multiple brands. Phase 2 migration preferred (maps to shared Memory Store).

## Add skeleton loading component

**What:** Create a reusable Skeleton component with shimmer animation on surface color (#F5F5F5 light / #141414 dark), configurable width/height.

**Why:** The design review specifies skeleton loading for all new agent surfaces (Morning Brief, performance summary, campaign arc). Without a shared component, each will implement shimmer differently.

**Context:** Discovered during /plan-design-review Pass 2 (Interaction State Coverage). DESIGN.md specifies 200ms transition duration and #F5F5F5 surface. Dark mode skeleton uses #141414.

**Effort:** S (human: ~1 hour / CC: ~5 min)

**Depends on:** Nothing. Can be done independently.

## Add rendered ad preview to Morning Brief

**What:** Show the rendered ad visual (via existing Satori pipeline) alongside the text copy in the Morning Brief, so users see what the ad looks like on the target platform.

**Why:** Text-only brief feels like reading a document. Seeing the actual rendered ad builds confidence in the recommendation and makes the "agency" feeling tangible.

**Context:** Discovered during /plan-design-review Pass 7 (NOT in scope for Phase 1). The Satori renderer already exists for the creative studio flow. This reuses it. Blocked by the existing TODO to add error handling to the render pipeline.

**Effort:** M (human: ~2 days / CC: ~20 min)

**Depends on:** Core Morning Brief working. Satori error handling TODO complete.

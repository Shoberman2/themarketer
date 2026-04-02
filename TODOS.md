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

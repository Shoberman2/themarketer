"use client";

const STEPS = [
  { label: "Scraping website content", description: "Extracting brand data" },
  { label: "Analyzing brand identity", description: "Understanding your market" },
  { label: "Crafting 30-day strategy", description: "Building your campaign" },
  { label: "Finalizing plan", description: "Preparing deliverables" },
];

export function AnalysisProgress({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {STEPS.map((step, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div
            key={index}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
              isActive
                ? "bg-surface-raised border border-border"
                : "border border-transparent"
            } ${isPending ? "opacity-25" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                isComplete
                  ? "bg-brand/20 text-brand"
                  : isActive
                    ? "bg-brand text-white"
                    : "bg-surface text-muted"
              }`}
            >
              {isComplete ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${isComplete ? "text-muted" : "text-foreground"}`}>
                {step.label}
              </div>
              <div className="text-[11px] text-muted">{step.description}</div>
            </div>
            {isActive && (
              <span className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}

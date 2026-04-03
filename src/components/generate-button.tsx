"use client";

export function GenerateButton({
  onClick,
  isLoading,
  label = "Generate All Ads",
}: {
  onClick: () => void;
  isLoading: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-light transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/15"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          Generating...
        </span>
      ) : (
        label
      )}
    </button>
  );
}

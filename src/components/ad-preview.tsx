"use client";

export function AdPreview({
  imageData,
  variant,
  sizeLabel,
  platform,
  taskTitle,
}: {
  imageData: string;
  variant: string;
  sizeLabel: string;
  platform: string;
  taskTitle: string;
}) {
  function handleDownload() {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `${taskTitle}-${variant}-${sizeLabel}.png`.replace(
      /\s+/g,
      "-"
    );
    link.click();
  }

  return (
    <div className="bg-surface-raised border border-border rounded-xl overflow-hidden group hover:border-border-hover transition-all">
      <div className="relative">
        <img
          src={`data:image/png;base64,${imageData}`}
          alt={`${taskTitle} - ${variant} - ${sizeLabel}`}
          className="w-full h-auto"
        />
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <button
            onClick={handleDownload}
            className="px-5 py-2 bg-brand text-white rounded-lg font-semibold text-[13px] hover:bg-brand-light transition-colors"
          >
            Download PNG
          </button>
        </div>
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-foreground/60 font-medium">{variant}</span>
        <span className="text-[11px] text-muted">
          {sizeLabel} &middot; {platform}
        </span>
      </div>
    </div>
  );
}

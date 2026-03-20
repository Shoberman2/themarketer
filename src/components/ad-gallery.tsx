"use client";

import { AdPreview } from "./ad-preview";

interface AdData {
  taskId: string;
  taskTitle: string;
  template: string;
  variant: string;
  sizeLabel: string;
  platform: string;
  imageData: string;
}

export function AdGallery({ ads }: { ads: AdData[] }) {
  const grouped = ads.reduce(
    (acc, ad) => {
      if (!acc[ad.taskId]) {
        acc[ad.taskId] = { title: ad.taskTitle, template: ad.template, ads: [] };
      }
      acc[ad.taskId].ads.push(ad);
      return acc;
    },
    {} as Record<string, { title: string; template: string; ads: AdData[] }>
  );

  function downloadAll() {
    ads.forEach((ad, i) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${ad.imageData}`;
        link.download = `${ad.taskTitle}-${ad.variant}-${ad.sizeLabel}.png`.replace(
          /\s+/g,
          "-"
        );
        link.click();
      }, i * 200);
    });
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">Generated Creatives</h3>
          <p className="text-xs text-muted mt-1">{ads.length} ad variations ready to download</p>
        </div>
        <button
          onClick={downloadAll}
          className="px-4 py-2 bg-surface-raised border border-border text-foreground rounded-lg text-[13px] font-medium hover:bg-surface-hover hover:border-border-hover transition-all"
        >
          Download All
        </button>
      </div>

      {Object.entries(grouped).map(([taskId, group]) => (
        <div key={taskId}>
          <div className="flex items-baseline gap-3 mb-4">
            <h4 className="text-base font-semibold text-foreground">
              {group.title}
            </h4>
            <span className="text-[10px] text-brand/80 font-medium uppercase tracking-wider">
              {group.template}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.ads.map((ad, i) => (
              <AdPreview
                key={i}
                imageData={ad.imageData}
                variant={ad.variant}
                sizeLabel={ad.sizeLabel}
                platform={ad.platform}
                taskTitle={ad.taskTitle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

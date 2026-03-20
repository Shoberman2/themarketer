import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

export function FeatureGrid({
  task,
  palette,
  width,
  height,
}: {
  task: ContentTask;
  palette: ColorPalette;
  width: number;
  height: number;
}) {
  const scale = Math.min(width, height) / 1080;
  const isWide = width / height > 2;
  const bullets = task.bulletPoints.slice(0, 4);
  const headlineSize = Math.round((isWide ? 30 : 40) * scale);
  const featureSize = Math.round((isWide ? 14 : 18) * scale);
  const padding = Math.round((isWide ? 20 : 40) * scale);
  const gap = Math.round(16 * scale);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding,
        background: palette.gradient,
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          fontSize: headlineSize,
          fontWeight: 700,
          color: palette.text,
          textAlign: "center",
          marginBottom: Math.round(32 * scale),
          lineHeight: 1.2,
        }}
      >
        {task.headline}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap,
          justifyContent: "center",
          maxWidth: "95%",
        }}
      >
        {bullets.map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: isWide ? `${Math.round(160 * scale)}px` : `${Math.round(220 * scale)}px`,
              padding: `${Math.round(20 * scale)}px`,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: Math.round(12 * scale),
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: Math.round(28 * scale),
                marginBottom: Math.round(8 * scale),
                display: "flex",
              }}
            >
              {["⚡", "🎯", "🚀", "✨"][i]}
            </div>
            <div
              style={{
                fontSize: featureSize,
                color: palette.text,
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {point}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

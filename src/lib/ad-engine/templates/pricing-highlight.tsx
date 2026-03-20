import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

export function PricingHighlight({
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
  const headlineSize = Math.round((isWide ? 28 : 42) * scale);
  const priceSize = Math.round((isWide ? 40 : 64) * scale);
  const bulletSize = Math.round((isWide ? 13 : 17) * scale);
  const padding = Math.round((isWide ? 20 : 48) * scale);

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
          marginBottom: Math.round(24 * scale),
          lineHeight: 1.2,
        }}
      >
        {task.headline}
      </div>
      <div
        style={{
          fontSize: priceSize,
          fontWeight: 700,
          color: palette.accent,
          marginBottom: Math.round(24 * scale),
          display: "flex",
        }}
      >
        {task.subheadline}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: Math.round(10 * scale),
          marginBottom: Math.round(32 * scale),
        }}
      >
        {task.bulletPoints.slice(0, 4).map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(8 * scale),
              fontSize: bulletSize,
              color: palette.text,
            }}
          >
            <span style={{ color: "#22c55e", display: "flex" }}>✓</span>
            <span>{point}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          backgroundColor: palette.ctaBackground,
          color: palette.ctaText,
          padding: `${Math.round(14 * scale)}px ${Math.round(40 * scale)}px`,
          borderRadius: Math.round(8 * scale),
          fontSize: Math.round(18 * scale),
          fontWeight: 700,
        }}
      >
        {task.ctaText}
      </div>
    </div>
  );
}

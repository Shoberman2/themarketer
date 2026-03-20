import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Product Showcase / Beauty & Fashion — Top performer in Beauty, Fashion, DTC
 * Clean product-forward layout with minimal text, aspirational feel, and
 * "shop the look" CTA. Based on research showing product demos appear in
 * 53.5% of top beauty ads with minimal text overlays letting visuals speak.
 */
export function ProductShowcase({
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
  const headlineSize = Math.round((isWide ? 30 : 48) * scale);
  const bodySize = Math.round((isWide ? 13 : 17) * scale);
  const padding = Math.round((isWide ? 20 : 44) * scale);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins",
        background: palette.background,
      }}
    >
      {/* Product area */}
      <div
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(180deg, ${palette.primary}18 0%, ${palette.secondary}28 100%)`,
          padding,
        }}
      >
        {/* Product placeholder circle */}
        <div
          style={{
            width: Math.round(Math.min(width * 0.4, height * 0.35)),
            height: Math.round(Math.min(width * 0.4, height * 0.35)),
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${palette.primary}40, ${palette.accent}60)`,
            border: `2px solid ${palette.accent}40`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: Math.round(48 * scale),
              color: palette.accent,
              display: "flex",
            }}
          >
            ✦
          </div>
        </div>
      </div>

      {/* Info section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding,
          gap: Math.round(10 * scale),
        }}
      >
        {/* Category label */}
        <div
          style={{
            display: "flex",
            fontSize: Math.round((isWide ? 10 : 12) * scale),
            color: palette.accent,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          {task.platform || "NEW ARRIVAL"}
        </div>

        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: palette.text,
            lineHeight: 1.1,
          }}
        >
          {task.headline}
        </div>

        <div
          style={{
            fontSize: bodySize,
            color: palette.textSecondary,
            lineHeight: 1.5,
          }}
        >
          {task.subheadline}
        </div>

        {/* Tags row */}
        <div
          style={{
            display: "flex",
            gap: Math.round(6 * scale),
            flexWrap: "wrap",
            marginTop: Math.round(4 * scale),
          }}
        >
          {task.bulletPoints.slice(0, 3).map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontSize: Math.round((isWide ? 10 : 12) * scale),
                color: palette.textSecondary,
                border: `1px solid ${palette.primary}30`,
                padding: `${Math.round(4 * scale)}px ${Math.round(10 * scale)}px`,
                borderRadius: Math.round(20 * scale),
              }}
            >
              {point}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: Math.round(16 * scale),
            marginTop: Math.round(8 * scale),
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: palette.ctaBackground,
              color: palette.ctaText,
              padding: `${Math.round(14 * scale)}px ${Math.round(36 * scale)}px`,
              borderRadius: Math.round(8 * scale),
              fontSize: Math.round((isWide ? 14 : 18) * scale),
              fontWeight: 700,
            }}
          >
            {task.ctaText}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: Math.round((isWide ? 18 : 24) * scale),
              fontWeight: 700,
              color: palette.accent,
              fontFamily: "Space Grotesk",
            }}
          >
            {task.bodyText || ""}
          </div>
        </div>
      </div>
    </div>
  );
}

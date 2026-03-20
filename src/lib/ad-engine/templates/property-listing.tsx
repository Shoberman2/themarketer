import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Property Listing / Showcase — Top performer in Real Estate, Travel
 * Magazine-style layout with hero image area, key specs, and tour CTA.
 * Based on research showing video tours drive 403% more inquiries and
 * real estate achieves 9.20% CTR on search — one of the highest of any industry.
 */
export function PropertyListing({
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
  const headlineSize = Math.round((isWide ? 28 : 44) * scale);
  const specSize = Math.round((isWide ? 16 : 22) * scale);
  const labelSize = Math.round((isWide ? 10 : 12) * scale);
  const padding = Math.round((isWide ? 20 : 40) * scale);

  const specs = task.bulletPoints.slice(0, 4);

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
      {/* Hero image area */}
      <div
        style={{
          flex: 1.2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding,
          background: `linear-gradient(180deg, ${palette.primary}40 0%, ${palette.primary}CC 40%, ${palette.secondary}EE 100%)`,
        }}
      >
        {/* "FEATURED" badge */}
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            fontSize: labelSize,
            fontWeight: 700,
            color: "#ffffff",
            backgroundColor: palette.accent,
            padding: `${Math.round(5 * scale)}px ${Math.round(12 * scale)}px`,
            borderRadius: Math.round(4 * scale),
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: Math.round(12 * scale),
          }}
        >
          FEATURED
        </div>

        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          {task.headline}
        </div>

        <div
          style={{
            fontSize: Math.round((isWide ? 14 : 18) * scale),
            color: "rgba(255,255,255,0.85)",
            marginTop: Math.round(6 * scale),
          }}
        >
          {task.subheadline}
        </div>
      </div>

      {/* Specs + CTA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding,
          gap: Math.round(16 * scale),
        }}
      >
        {/* Spec pills */}
        <div
          style={{
            display: "flex",
            gap: Math.round(8 * scale),
            flexWrap: "wrap",
          }}
        >
          {specs.map((spec, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(6 * scale),
                fontSize: specSize,
                color: palette.text,
                fontWeight: 600,
                fontFamily: "Space Grotesk",
                padding: `${Math.round(8 * scale)}px ${Math.round(16 * scale)}px`,
                backgroundColor: `${palette.primary}12`,
                borderRadius: Math.round(8 * scale),
                border: `1px solid ${palette.primary}25`,
              }}
            >
              {spec}
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
              fontSize: Math.round((isWide ? 11 : 13) * scale),
              color: palette.textSecondary,
            }}
          >
            {task.bodyText || "Limited availability"}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Before/After Transformation — Top performer in Health & Fitness, Beauty
 * Split-screen before/after with bold claim and stats. Based on research
 * showing before/after transformations appear in 29.7% of top beauty ads
 * and dominate fitness/supplement creative.
 */
export function BeforeAfter({
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
  const isNarrow = height / width > 1.5;
  const headlineSize = Math.round((isWide ? 26 : 40) * scale);
  const labelSize = Math.round((isWide ? 12 : 16) * scale);
  const bulletSize = Math.round((isWide ? 12 : 16) * scale);
  const padding = Math.round((isWide ? 16 : 36) * scale);

  const bullets = task.bulletPoints.slice(0, 3);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter",
        background: palette.background,
      }}
    >
      {/* Headline section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: `${Math.round(24 * scale)}px ${padding}`,
          gap: Math.round(8 * scale),
        }}
      >
        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: palette.text,
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          {task.headline}
        </div>
        <div
          style={{
            fontSize: Math.round((isWide ? 14 : 18) * scale),
            color: palette.textSecondary,
            textAlign: "center",
          }}
        >
          {task.subheadline}
        </div>
      </div>

      {/* Before / After split */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isNarrow ? "column" : "row",
          gap: Math.round(4 * scale),
          padding: `0 ${padding}`,
        }}
      >
        {/* Before */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: `${Math.round(20 * scale)}px`,
            backgroundColor: "rgba(239,68,68,0.08)",
            borderRadius: Math.round(12 * scale),
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div
            style={{
              fontSize: labelSize,
              fontWeight: 700,
              color: "#ef4444",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: Math.round(12 * scale),
              display: "flex",
            }}
          >
            BEFORE
          </div>
          {bullets.map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(6 * scale),
                fontSize: bulletSize,
                color: palette.textSecondary,
                marginBottom: Math.round(6 * scale),
              }}
            >
              <span style={{ color: "#ef4444", display: "flex" }}>✕</span>
              <span>{point} struggles</span>
            </div>
          ))}
        </div>

        {/* After */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: `${Math.round(20 * scale)}px`,
            background: `linear-gradient(135deg, ${palette.primary}20, ${palette.accent}20)`,
            borderRadius: Math.round(12 * scale),
            border: `1px solid ${palette.accent}40`,
          }}
        >
          <div
            style={{
              fontSize: labelSize,
              fontWeight: 700,
              color: "#22c55e",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: Math.round(12 * scale),
              display: "flex",
            }}
          >
            AFTER
          </div>
          {bullets.map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(6 * scale),
                fontSize: bulletSize,
                color: palette.text,
                marginBottom: Math.round(6 * scale),
                fontWeight: 600,
              }}
            >
              <span style={{ color: "#22c55e", display: "flex" }}>✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: `${Math.round(20 * scale)}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: palette.ctaBackground,
            color: palette.ctaText,
            padding: `${Math.round(14 * scale)}px ${Math.round(40 * scale)}px`,
            borderRadius: Math.round(8 * scale),
            fontSize: Math.round((isWide ? 14 : 18) * scale),
            fontWeight: 700,
          }}
        >
          {task.ctaText}
        </div>
      </div>
    </div>
  );
}

import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * UGC-Style Ad — Top performer in E-commerce/DTC
 * Mimics organic user-generated content: casual layout, "handwritten" feel,
 * product-forward with social proof and urgency. Based on research showing
 * UGC-style ads appear in 42% of top-spending ads across verticals.
 */
export function UgcStyle({
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
  const bodySize = Math.round((isWide ? 14 : 20) * scale);
  const badgeSize = Math.round((isWide ? 11 : 14) * scale);
  const padding = Math.round((isWide ? 20 : 44) * scale);

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
      {/* Top social proof bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: Math.round(8 * scale),
          padding: `${Math.round(12 * scale)}px ${padding}`,
          backgroundColor: palette.accent,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: badgeSize,
            fontWeight: 700,
            color: palette.ctaText,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          ★ TRENDING NOW ★
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding,
          gap: Math.round(16 * scale),
        }}
      >
        {/* "Handwritten" question hook */}
        <div
          style={{
            display: "flex",
            fontSize: Math.round((isWide ? 16 : 22) * scale),
            color: palette.accent,
            fontWeight: 600,
            fontStyle: "italic",
          }}
        >
          &ldquo;{task.subheadline}&rdquo;
        </div>

        {/* Bold headline */}
        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: palette.text,
            lineHeight: 1.15,
          }}
        >
          {task.headline}
        </div>

        {/* Body with checkmarks */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: Math.round(8 * scale),
          }}
        >
          {task.bulletPoints.slice(0, 3).map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(8 * scale),
                fontSize: bodySize,
                color: palette.text,
              }}
            >
              <span style={{ color: "#22c55e", display: "flex", fontWeight: 700 }}>✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${Math.round(16 * scale)}px ${padding}`,
          background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: Math.round((isWide ? 16 : 22) * scale),
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          {task.ctaText} →
        </div>
        <div
          style={{
            display: "flex",
            fontSize: badgeSize,
            color: "rgba(255,255,255,0.8)",
            fontWeight: 600,
          }}
        >
          LIMITED TIME
        </div>
      </div>
    </div>
  );
}

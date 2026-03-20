import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Listicle / Numbered Tips — Top performer in Education, Online Courses
 * Numbered-list format with educational hook and value-first approach.
 * Based on research showing course/education ads that lead with free value
 * and use numbered frameworks dramatically outperform direct-sell approaches.
 */
export function Listicle({
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
  const headlineSize = Math.round((isWide ? 26 : 40) * scale);
  const itemSize = Math.round((isWide ? 14 : 18) * scale);
  const numberSize = Math.round((isWide ? 20 : 28) * scale);
  const padding = Math.round((isWide ? 20 : 44) * scale);

  const bullets = task.bulletPoints.slice(0, 5);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter",
        background: palette.gradient,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${Math.round(28 * scale)}px ${padding} ${Math.round(16 * scale)}px`,
          gap: Math.round(8 * scale),
        }}
      >
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
          FREE GUIDE
        </div>
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
        <div
          style={{
            fontSize: Math.round((isWide ? 13 : 16) * scale),
            color: palette.textSecondary,
            lineHeight: 1.4,
          }}
        >
          {task.subheadline}
        </div>
      </div>

      {/* Numbered list */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `0 ${padding}`,
          gap: Math.round(10 * scale),
        }}
      >
        {bullets.map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(12 * scale),
              padding: `${Math.round(10 * scale)}px ${Math.round(14 * scale)}px`,
              backgroundColor: `${palette.primary}10`,
              borderRadius: Math.round(8 * scale),
              borderLeft: `3px solid ${palette.accent}`,
            }}
          >
            <div
              style={{
                fontSize: numberSize,
                fontWeight: 700,
                color: palette.accent,
                fontFamily: "Space Grotesk",
                minWidth: Math.round(30 * scale),
                display: "flex",
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: itemSize,
                color: palette.text,
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {point}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
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

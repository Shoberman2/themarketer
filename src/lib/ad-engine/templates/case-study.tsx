import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Case Study Card — Top performer in B2B / Professional Services
 * LinkedIn carousel-style single card with bold stat, problem/approach/result
 * structure. Based on LinkedIn carousels achieving 6.60% engagement rate,
 * dramatically outperforming standard image ads.
 */
export function CaseStudy({
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
  const bodySize = Math.round((isWide ? 14 : 18) * scale);
  const labelSize = Math.round((isWide ? 10 : 12) * scale);
  const padding = Math.round((isWide ? 20 : 48) * scale);

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
      {/* Accent top bar */}
      <div
        style={{
          height: Math.round(5 * scale),
          background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})`,
          display: "flex",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding,
          gap: Math.round(20 * scale),
        }}
      >
        {/* Case study label */}
        <div
          style={{
            display: "flex",
            fontSize: labelSize,
            color: palette.accent,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          CASE STUDY
        </div>

        {/* Big headline with result */}
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

        {/* Body text */}
        <div
          style={{
            fontSize: bodySize,
            color: palette.textSecondary,
            lineHeight: 1.6,
          }}
        >
          {task.bodyText || task.subheadline}
        </div>

        {/* Results row */}
        <div
          style={{
            display: "flex",
            gap: Math.round(16 * scale),
            marginTop: Math.round(8 * scale),
          }}
        >
          {bullets.map((point, i) => {
            const match = point.match(/^([\d,.%+x$]+)\s*(.*)/);
            const value = match ? match[1] : point.slice(0, 6);
            const label = match ? match[2] : point;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: `${Math.round(14 * scale)}px`,
                  backgroundColor: `${palette.primary}15`,
                  borderRadius: Math.round(8 * scale),
                  border: `1px solid ${palette.primary}30`,
                }}
              >
                <div
                  style={{
                    fontSize: Math.round((isWide ? 22 : 32) * scale),
                    fontWeight: 700,
                    color: palette.accent,
                    fontFamily: "Space Grotesk",
                    display: "flex",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: Math.round((isWide ? 10 : 13) * scale),
                    color: palette.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "flex",
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            backgroundColor: palette.ctaBackground,
            color: palette.ctaText,
            padding: `${Math.round(12 * scale)}px ${Math.round(32 * scale)}px`,
            borderRadius: Math.round(6 * scale),
            fontSize: Math.round((isWide ? 14 : 16) * scale),
            fontWeight: 700,
            alignSelf: "flex-start",
          }}
        >
          {task.ctaText}
        </div>
      </div>
    </div>
  );
}

import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Automotive / Vehicle Showcase — Top performer in Automotive
 * Cinematic dark layout with model name, key specs, and financing CTA.
 * Based on research showing 75% of car buyers are heavily influenced
 * by video ads, and AI-driven inventory ads with live specs are among
 * the most efficient tools. Imperfect, authentic content outperforms polished.
 */
export function Automotive({
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
  const headlineSize = Math.round((isWide ? 32 : 52) * scale);
  const specSize = Math.round((isWide ? 18 : 28) * scale);
  const labelSize = Math.round((isWide ? 10 : 12) * scale);
  const padding = Math.round((isWide ? 20 : 44) * scale);

  const specs = task.bulletPoints.slice(0, 3);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins",
        background: `linear-gradient(160deg, #0a0a0a 0%, ${palette.primary}30 60%, #0a0a0a 100%)`,
      }}
    >
      {/* Model badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${Math.round(16 * scale)}px ${padding}`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: labelSize,
            fontWeight: 700,
            color: palette.accent,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          {task.platform || "NOW AVAILABLE"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: labelSize,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          PERFORMANCE SERIES
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `0 ${padding}`,
          gap: Math.round(20 * scale),
        }}
      >
        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.05,
          }}
        >
          {task.headline}
        </div>

        <div
          style={{
            fontSize: Math.round((isWide ? 14 : 18) * scale),
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.5,
          }}
        >
          {task.subheadline}
        </div>

        {/* Specs row */}
        <div
          style={{
            display: "flex",
            gap: Math.round(20 * scale),
            marginTop: Math.round(8 * scale),
          }}
        >
          {specs.map((spec, i) => {
            const match = spec.match(/^([\d,.%+x$]+\s?\w*)\s+(.*)/);
            const value = match ? match[1] : spec;
            const label = match ? match[2] : "";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: `${Math.round(12 * scale)}px ${Math.round(20 * scale)}px`,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: Math.round(8 * scale),
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: specSize,
                    fontWeight: 700,
                    color: palette.accent,
                    fontFamily: "Space Grotesk",
                    display: "flex",
                  }}
                >
                  {value}
                </div>
                {label && (
                  <div
                    style={{
                      fontSize: Math.round((isWide ? 9 : 11) * scale),
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                    }}
                  >
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${Math.round(20 * scale)}px ${padding}`,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: palette.accent,
            color: "#000000",
            padding: `${Math.round(14 * scale)}px ${Math.round(36 * scale)}px`,
            borderRadius: Math.round(6 * scale),
            fontSize: Math.round((isWide ? 14 : 18) * scale),
            fontWeight: 700,
          }}
        >
          {task.ctaText}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: Math.round((isWide ? 12 : 14) * scale),
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {task.bodyText || "Book a test drive"}
        </div>
      </div>
    </div>
  );
}

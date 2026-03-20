import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * App Download / Mobile-First — Top performer in Mobile Apps, Fintech, Gaming
 * Phone-screen mockup style with star rating, download count social proof,
 * and immediate download CTA. Based on research showing hybrid video-playable
 * formats and mobile-first creative dominate UA strategies.
 */
export function AppDownload({
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
  const padding = Math.round((isWide ? 20 : 44) * scale);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: isWide ? "row" : "column",
        fontFamily: "Inter",
        background: palette.gradient,
      }}
    >
      {/* Content side */}
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
        {/* Rating stars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: Math.round(6 * scale),
          }}
        >
          <div style={{ display: "flex", color: "#fbbf24", fontSize: Math.round(18 * scale) }}>
            ★★★★★
          </div>
          <div
            style={{
              fontSize: Math.round((isWide ? 11 : 14) * scale),
              color: palette.textSecondary,
              display: "flex",
            }}
          >
            4.9 rating
          </div>
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
            fontSize: bodySize,
            color: palette.textSecondary,
            lineHeight: 1.5,
          }}
        >
          {task.subheadline}
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: Math.round(8 * scale),
          }}
        >
          {task.bulletPoints.slice(0, 3).map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontSize: Math.round((isWide ? 11 : 14) * scale),
                color: palette.text,
                backgroundColor: `${palette.accent}20`,
                border: `1px solid ${palette.accent}40`,
                padding: `${Math.round(6 * scale)}px ${Math.round(12 * scale)}px`,
                borderRadius: Math.round(20 * scale),
                fontWeight: 600,
              }}
            >
              {point}
            </div>
          ))}
        </div>

        {/* Download CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: Math.round(12 * scale),
            marginTop: Math.round(8 * scale),
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: palette.ctaBackground,
              color: palette.ctaText,
              padding: `${Math.round(14 * scale)}px ${Math.round(32 * scale)}px`,
              borderRadius: Math.round(10 * scale),
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
            Free to download
          </div>
        </div>
      </div>

      {/* Phone mockup side */}
      <div
        style={{
          flex: isWide ? 0.5 : 0,
          display: isWide ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          padding: Math.round(20 * scale),
        }}
      >
        <div
          style={{
            width: Math.round(180 * scale),
            height: Math.round(360 * scale),
            backgroundColor: palette.primary + "20",
            border: `2px solid ${palette.primary}40`,
            borderRadius: Math.round(24 * scale),
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: Math.round(16 * scale),
          }}
        >
          <div
            style={{
              fontSize: Math.round(36 * scale),
              fontWeight: 700,
              color: palette.accent,
              fontFamily: "Space Grotesk",
              display: "flex",
            }}
          >
            ▶
          </div>
        </div>
      </div>
    </div>
  );
}

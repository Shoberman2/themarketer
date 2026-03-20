import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Food / Sensory Visual — Top performer in Food & Restaurant
 * Warm-toned layout with large visual area, price/offer callout, and
 * "Order Now" urgency CTA. Based on research showing warm colors
 * (reds, oranges, yellows) stimulate appetite and time-limited promos
 * see 15-30% more redemptions. Avoids blues (appetite suppressant).
 */
export function FoodVisual({
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
  const bodySize = Math.round((isWide ? 14 : 18) * scale);
  const padding = Math.round((isWide ? 20 : 40) * scale);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins",
        background: `linear-gradient(160deg, #1a0a00 0%, ${palette.primary}40 50%, #1a0500 100%)`,
      }}
    >
      {/* Visual area with warm gradient */}
      <div
        style={{
          flex: 1.3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding,
          background: `radial-gradient(ellipse at 60% 40%, ${palette.accent}50 0%, transparent 70%)`,
        }}
      >
        {/* Offer badge */}
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: `${Math.round(8 * scale)}px ${Math.round(16 * scale)}px`,
            backgroundColor: "#ef4444",
            borderRadius: Math.round(20 * scale),
            marginBottom: Math.round(16 * scale),
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: Math.round((isWide ? 12 : 14) * scale),
              fontWeight: 700,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {task.bodyText || "FREE DELIVERY TODAY"}
          </div>
        </div>

        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          {task.headline}
        </div>

        <div
          style={{
            fontSize: bodySize,
            color: "rgba(255,255,255,0.8)",
            marginTop: Math.round(8 * scale),
            lineHeight: 1.4,
          }}
        >
          {task.subheadline}
        </div>
      </div>

      {/* Bottom section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding,
          gap: Math.round(14 * scale),
        }}
      >
        {/* Highlight features */}
        <div
          style={{
            display: "flex",
            gap: Math.round(12 * scale),
            flexWrap: "wrap",
          }}
        >
          {task.bulletPoints.slice(0, 3).map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(6 * scale),
                fontSize: Math.round((isWide ? 12 : 15) * scale),
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
              }}
            >
              <span style={{ color: "#f59e0b", display: "flex" }}>●</span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: Math.round(12 * scale),
          }}
        >
          <div
            style={{
              display: "flex",
              background: "linear-gradient(90deg, #ef4444, #f97316)",
              color: "#ffffff",
              padding: `${Math.round(14 * scale)}px ${Math.round(40 * scale)}px`,
              borderRadius: Math.round(8 * scale),
              fontSize: Math.round((isWide ? 16 : 20) * scale),
              fontWeight: 700,
            }}
          >
            {task.ctaText}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: Math.round((isWide ? 11 : 13) * scale),
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Ends tonight
          </div>
        </div>
      </div>
    </div>
  );
}

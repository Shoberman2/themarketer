import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Travel / Escape — Top performer in Travel & Hospitality
 * Aspirational full-bleed layout with destination name, experience highlights,
 * and booking CTA with urgency. Based on research showing hotels using real
 * images see 15% higher bookings and repurposed creator content boosts
 * performance 20-50% vs standard branded ads.
 */
export function TravelEscape({
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
  const padding = Math.round((isWide ? 20 : 44) * scale);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins",
        background: `linear-gradient(135deg, ${palette.primary}50 0%, ${palette.secondary}90 50%, ${palette.accent}70 100%)`,
      }}
    >
      {/* Top destination label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `${Math.round(16 * scale)}px ${padding}`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: Math.round((isWide ? 10 : 12) * scale),
            color: "rgba(255,255,255,0.7)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          ✈ ESCAPE TO
        </div>
        <div
          style={{
            display: "flex",
            fontSize: Math.round((isWide ? 10 : 12) * scale),
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {task.platform}
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
          gap: Math.round(16 * scale),
        }}
      >
        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            textShadow: "0 2px 16px rgba(0,0,0,0.3)",
          }}
        >
          {task.headline}
        </div>

        <div
          style={{
            fontSize: bodySize,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.5,
            maxWidth: "90%",
          }}
        >
          {task.subheadline}
        </div>

        {/* Experience highlights */}
        <div
          style={{
            display: "flex",
            gap: Math.round(10 * scale),
            flexWrap: "wrap",
            marginTop: Math.round(8 * scale),
          }}
        >
          {task.bulletPoints.slice(0, 4).map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(6 * scale),
                fontSize: Math.round((isWide ? 12 : 14) * scale),
                color: "#ffffff",
                fontWeight: 600,
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: `${Math.round(6 * scale)}px ${Math.round(14 * scale)}px`,
                borderRadius: Math.round(20 * scale),
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {["🏖", "🍽", "💆", "🌅"][i % 4]} {point}
            </div>
          ))}
        </div>
      </div>

      {/* Booking CTA bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${Math.round(20 * scale)}px ${padding}`,
          backgroundColor: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: Math.round((isWide ? 10 : 12) * scale),
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {task.bodyText || "Starting from"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: Math.round((isWide ? 22 : 28) * scale),
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "Space Grotesk",
            }}
          >
            {task.ctaText}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            backgroundColor: "#ffffff",
            color: palette.primary,
            padding: `${Math.round(12 * scale)}px ${Math.round(28 * scale)}px`,
            borderRadius: Math.round(8 * scale),
            fontSize: Math.round((isWide ? 14 : 16) * scale),
            fontWeight: 700,
          }}
        >
          Book Now →
        </div>
      </div>
    </div>
  );
}

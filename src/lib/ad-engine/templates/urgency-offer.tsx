import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Urgency / Limited-Time Offer — Top performer in Food, Retail, E-commerce
 * Countdown-style layout with bold price/offer, scarcity signals, and
 * immediate-action CTA. Based on research showing time-limited promotions
 * see 15-30% more redemptions across food/retail verticals.
 */
export function UrgencyOffer({
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
  const offerSize = Math.round((isWide ? 40 : 68) * scale);
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
        background: palette.gradient,
      }}
    >
      {/* Urgency banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: `${Math.round(10 * scale)}px`,
          backgroundColor: "#ef4444",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: Math.round((isWide ? 12 : 15) * scale),
            fontWeight: 700,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          ⏰ LIMITED TIME OFFER ⏰
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding,
          gap: Math.round(16 * scale),
          textAlign: "center",
        }}
      >
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

        {/* Big offer / price */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: `${Math.round(20 * scale)}px ${Math.round(40 * scale)}px`,
            backgroundColor: palette.accent + "20",
            borderRadius: Math.round(16 * scale),
            border: `2px dashed ${palette.accent}`,
          }}
        >
          <div
            style={{
              fontSize: offerSize,
              fontWeight: 700,
              color: palette.accent,
              lineHeight: 1,
              fontFamily: "Space Grotesk",
              display: "flex",
            }}
          >
            {task.subheadline}
          </div>
        </div>

        <div
          style={{
            fontSize: bodySize,
            color: palette.textSecondary,
            lineHeight: 1.5,
            maxWidth: "85%",
          }}
        >
          {task.bodyText}
        </div>

        {/* Bullet benefits */}
        <div
          style={{
            display: "flex",
            gap: Math.round(16 * scale),
            flexWrap: "wrap",
            justifyContent: "center",
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
                color: palette.text,
                fontWeight: 600,
              }}
            >
              <span style={{ color: palette.accent, display: "flex" }}>★</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: `${Math.round(20 * scale)}px`,
          background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#ffffff",
            color: palette.primary,
            padding: `${Math.round(14 * scale)}px ${Math.round(48 * scale)}px`,
            borderRadius: Math.round(8 * scale),
            fontSize: Math.round((isWide ? 16 : 20) * scale),
            fontWeight: 700,
          }}
        >
          {task.ctaText}
        </div>
      </div>
    </div>
  );
}

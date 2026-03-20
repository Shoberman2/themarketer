import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Trust Badges / Authority — Top performer in Finance, Insurance, Real Estate
 * Clean professional layout with trust signals, certifications, and guarantees.
 * Based on research showing finance/fintech ads that combine trust with
 * humor/personality outperform pure corporate, but trust signals are essential
 * in high-stakes purchase decisions.
 */
export function TrustBadges({
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
  const headlineSize = Math.round((isWide ? 28 : 42) * scale);
  const bodySize = Math.round((isWide ? 14 : 18) * scale);
  const badgeSize = Math.round((isWide ? 11 : 14) * scale);
  const padding = Math.round((isWide ? 20 : 44) * scale);

  const badges = ["✓ Verified", "✓ Secured", "✓ Trusted"];
  const bullets = task.bulletPoints.slice(0, 4);

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
      {/* Trust bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: Math.round(20 * scale),
          padding: `${Math.round(10 * scale)}px ${padding}`,
          backgroundColor: `${palette.primary}15`,
          borderBottom: `1px solid ${palette.primary}30`,
        }}
      >
        {badges.map((badge, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              fontSize: badgeSize,
              color: palette.accent,
              fontWeight: 600,
            }}
          >
            {badge}
          </div>
        ))}
      </div>

      {/* Main content */}
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
            lineHeight: 1.6,
          }}
        >
          {task.subheadline}
        </div>

        {/* Feature list with shields */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: Math.round(10 * scale),
          }}
        >
          {bullets.map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(10 * scale),
                padding: `${Math.round(10 * scale)}px ${Math.round(14 * scale)}px`,
                backgroundColor: `${palette.primary}08`,
                borderRadius: Math.round(8 * scale),
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: Math.round(16 * scale),
                  color: palette.accent,
                }}
              >
                🛡
              </div>
              <div
                style={{
                  fontSize: Math.round((isWide ? 13 : 16) * scale),
                  color: palette.text,
                  fontWeight: 500,
                }}
              >
                {point}
              </div>
            </div>
          ))}
        </div>

        {/* CTA with guarantee */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: Math.round(8 * scale),
            marginTop: Math.round(4 * scale),
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
              fontSize: Math.round((isWide ? 10 : 12) * scale),
              color: palette.textSecondary,
            }}
          >
            🔒 {task.bodyText || "No credit card required"}
          </div>
        </div>
      </div>
    </div>
  );
}

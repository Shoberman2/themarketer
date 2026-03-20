import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

export function StatsBanner({
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
  const headlineSize = Math.round((isWide ? 28 : 40) * scale);
  const statSize = Math.round((isWide ? 32 : 52) * scale);
  const labelSize = Math.round((isWide ? 12 : 16) * scale);
  const padding = Math.round((isWide ? 20 : 48) * scale);

  const stats = task.bulletPoints.slice(0, 3).map((bp) => {
    const match = bp.match(/^([\d,.%+x]+)\s+(.*)/);
    if (match) return { value: match[1], label: match[2] };
    return { value: bp.slice(0, 5), label: bp.slice(5) || bp };
  });

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding,
        background: palette.gradient,
        fontFamily: "Space Grotesk",
      }}
    >
      <div
        style={{
          fontSize: headlineSize,
          fontWeight: 700,
          color: palette.text,
          textAlign: "center",
          marginBottom: Math.round(40 * scale),
          lineHeight: 1.2,
        }}
      >
        {task.headline}
      </div>
      <div
        style={{
          display: "flex",
          gap: Math.round(isWide ? 32 : 48) * scale,
          justifyContent: "center",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(8 * scale),
            }}
          >
            <div
              style={{
                fontSize: statSize,
                fontWeight: 700,
                color: palette.accent,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: labelSize,
                color: palette.textSecondary,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

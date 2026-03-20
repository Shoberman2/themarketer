import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

export function Comparison({
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
  const isNarrow = height / width > 1.5;
  const headlineSize = Math.round((isWide ? 28 : 36) * scale);
  const itemSize = Math.round((isWide ? 14 : 18) * scale);
  const padding = Math.round((isWide ? 20 : 40) * scale);
  const bullets = task.bulletPoints.slice(0, 3);

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
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          fontSize: headlineSize,
          fontWeight: 700,
          color: palette.text,
          textAlign: "center",
          marginBottom: Math.round(32 * scale),
          lineHeight: 1.2,
        }}
      >
        {task.headline}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: isNarrow ? "column" : "row",
          gap: Math.round(20 * scale),
          width: "90%",
        }}
      >
        {/* Without */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: `${Math.round(20 * scale)}px`,
            backgroundColor: "rgba(239,68,68,0.15)",
            borderRadius: Math.round(12 * scale),
            border: "2px solid rgba(239,68,68,0.3)",
          }}
        >
          <div
            style={{
              fontSize: Math.round(16 * scale),
              fontWeight: 700,
              color: "#ef4444",
              marginBottom: Math.round(12 * scale),
              display: "flex",
            }}
          >
            Without
          </div>
          {bullets.map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(8 * scale),
                marginBottom: Math.round(8 * scale),
                fontSize: itemSize,
                color: palette.text,
              }}
            >
              <span style={{ color: "#ef4444", display: "flex" }}>✕</span>
              <span>{point} issues</span>
            </div>
          ))}
        </div>
        {/* With */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: `${Math.round(20 * scale)}px`,
            backgroundColor: "rgba(34,197,94,0.15)",
            borderRadius: Math.round(12 * scale),
            border: `2px solid ${palette.accent}`,
          }}
        >
          <div
            style={{
              fontSize: Math.round(16 * scale),
              fontWeight: 700,
              color: "#22c55e",
              marginBottom: Math.round(12 * scale),
              display: "flex",
            }}
          >
            With {task.headline.split(" ")[0]}
          </div>
          {bullets.map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(8 * scale),
                marginBottom: Math.round(8 * scale),
                fontSize: itemSize,
                color: palette.text,
              }}
            >
              <span style={{ color: "#22c55e", display: "flex" }}>✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

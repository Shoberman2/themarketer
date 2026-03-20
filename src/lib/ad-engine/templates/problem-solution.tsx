import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

export function ProblemSolution({
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
  const headlineSize = Math.round((isWide ? 24 : 36) * scale);
  const bodySize = Math.round((isWide ? 14 : 20) * scale);
  const padding = Math.round((isWide ? 20 : 40) * scale);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: isWide ? "row" : "column",
        fontFamily: "Inter",
      }}
    >
      {/* Problem */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding,
          backgroundColor: "#1a1a1a",
        }}
      >
        <div
          style={{
            fontSize: Math.round(14 * scale),
            color: "#ef4444",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: Math.round(12 * scale),
            display: "flex",
          }}
        >
          THE PROBLEM
        </div>
        <div
          style={{
            fontSize: headlineSize,
            color: "#ffffff",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: Math.round(12 * scale),
          }}
        >
          {task.subheadline}
        </div>
        <div
          style={{
            fontSize: bodySize,
            color: "#a0a0a0",
            lineHeight: 1.5,
          }}
        >
          {task.bodyText}
        </div>
      </div>
      {/* Solution */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding,
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
        }}
      >
        <div
          style={{
            fontSize: Math.round(14 * scale),
            color: "rgba(255,255,255,0.8)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: Math.round(12 * scale),
            display: "flex",
          }}
        >
          THE SOLUTION
        </div>
        <div
          style={{
            fontSize: headlineSize,
            color: "#ffffff",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: Math.round(16 * scale),
          }}
        >
          {task.headline}
        </div>
        <div
          style={{
            display: "flex",
            backgroundColor: "#ffffff",
            color: palette.primary,
            padding: `${Math.round(12 * scale)}px ${Math.round(28 * scale)}px`,
            borderRadius: Math.round(8 * scale),
            fontSize: Math.round(16 * scale),
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

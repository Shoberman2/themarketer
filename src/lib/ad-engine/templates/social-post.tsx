import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

export function SocialPost({
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
  const headlineSize = Math.round((isWide ? 26 : 36) * scale);
  const bodySize = Math.round((isWide ? 14 : 20) * scale);
  const padding = Math.round((isWide ? 20 : 48) * scale);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter",
        background: palette.gradient,
      }}
    >
      {/* Brand bar */}
      <div
        style={{
          height: Math.round(6 * scale),
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
        }}
      >
        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: palette.text,
            lineHeight: 1.2,
            marginBottom: Math.round(16 * scale),
          }}
        >
          {task.headline}
        </div>
        <div
          style={{
            fontSize: bodySize,
            color: palette.textSecondary,
            lineHeight: 1.6,
            marginBottom: Math.round(24 * scale),
          }}
        >
          {task.bodyText || task.subheadline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: Math.round(16 * scale),
            color: palette.primary,
            fontWeight: 700,
          }}
        >
          {task.ctaText} →
        </div>
      </div>
    </div>
  );
}

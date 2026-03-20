import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

export function Testimonial({
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
  const quoteSize = Math.round((isWide ? 20 : 32) * scale);
  const padding = Math.round((isWide ? 24 : 56) * scale);

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
          fontSize: Math.round(72 * scale),
          color: palette.accent,
          lineHeight: 0.8,
          marginBottom: Math.round(16 * scale),
          display: "flex",
        }}
      >
        &ldquo;
      </div>
      <div
        style={{
          fontSize: quoteSize,
          color: palette.text,
          textAlign: "center",
          fontStyle: "italic",
          lineHeight: 1.5,
          maxWidth: "85%",
          marginBottom: Math.round(24 * scale),
        }}
      >
        {task.bodyText || task.subheadline}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: Math.round(4 * scale),
        }}
      >
        <div
          style={{
            fontSize: Math.round(18 * scale),
            color: palette.text,
            fontWeight: 700,
          }}
        >
          {task.headline}
        </div>
        <div
          style={{
            fontSize: Math.round(14 * scale),
            color: palette.textSecondary,
          }}
        >
          {task.ctaText}
        </div>
      </div>
    </div>
  );
}

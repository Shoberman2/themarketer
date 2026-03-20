import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

export function HeroCta({
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
  const isWide = width / height > 2;
  const isNarrow = height / width > 1.5;
  const scale = Math.min(width, height) / 1080;
  const headlineSize = Math.round((isWide ? 36 : isNarrow ? 52 : 56) * scale);
  const subSize = Math.round((isWide ? 18 : 24) * scale);
  const ctaSize = Math.round((isWide ? 16 : 20) * scale);
  const padding = Math.round((isWide ? 24 : 48) * scale);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: isWide ? "flex-start" : "center",
        padding,
        background: palette.gradient,
        fontFamily: "Poppins",
      }}
    >
      <div
        style={{
          fontSize: headlineSize,
          fontWeight: 700,
          color: palette.text,
          lineHeight: 1.1,
          textAlign: isWide ? "left" : "center",
          maxWidth: "90%",
          marginBottom: Math.round(16 * scale),
        }}
      >
        {task.headline}
      </div>
      <div
        style={{
          fontSize: subSize,
          color: palette.textSecondary,
          textAlign: isWide ? "left" : "center",
          maxWidth: "80%",
          marginBottom: Math.round(32 * scale),
          lineHeight: 1.4,
        }}
      >
        {task.subheadline}
      </div>
      <div
        style={{
          display: "flex",
          backgroundColor: palette.ctaBackground,
          color: palette.ctaText,
          padding: `${Math.round(14 * scale)}px ${Math.round(36 * scale)}px`,
          borderRadius: Math.round(8 * scale),
          fontSize: ctaSize,
          fontWeight: 700,
        }}
      >
        {task.ctaText}
      </div>
    </div>
  );
}

import { ColorPalette } from "../palettes";
import { ContentTask } from "@/types/plan";
import React from "react";

/**
 * Video Hook / Reel Thumbnail — Top performer across all verticals
 * Designed to look like a paused video/reel with a bold text overlay,
 * play button, and engagement indicators. Based on research showing
 * video ads achieve 0.98% CTR on Facebook and Reels lead engagement
 * by 22% over static. This static version mimics that format.
 */
export function VideoHook({
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
  const bodySize = Math.round((isWide ? 14 : 20) * scale);
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
        position: "relative",
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)`,
          display: "flex",
        }}
      />

      {/* Play button center */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: Math.round(80 * scale),
            height: Math.round(80 * scale),
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "3px solid rgba(255,255,255,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              fontSize: Math.round(32 * scale),
              color: "#ffffff",
              marginLeft: Math.round(4 * scale),
              display: "flex",
            }}
          >
            ▶
          </div>
        </div>
      </div>

      {/* Bottom text overlay */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding,
          gap: Math.round(10 * scale),
          zIndex: 1,
        }}
      >
        {/* Hook question */}
        <div
          style={{
            display: "flex",
            fontSize: Math.round((isWide ? 14 : 18) * scale),
            color: palette.accent,
            fontWeight: 600,
          }}
        >
          {task.subheadline}
        </div>

        <div
          style={{
            fontSize: headlineSize,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          {task.headline}
        </div>

        <div
          style={{
            fontSize: bodySize,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.4,
          }}
        >
          {task.bodyText}
        </div>

        {/* Engagement bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: Math.round(16 * scale),
            marginTop: Math.round(8 * scale),
            paddingTop: Math.round(12 * scale),
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: palette.ctaBackground,
              color: palette.ctaText,
              padding: `${Math.round(10 * scale)}px ${Math.round(28 * scale)}px`,
              borderRadius: Math.round(6 * scale),
              fontSize: Math.round((isWide ? 13 : 16) * scale),
              fontWeight: 700,
            }}
          >
            {task.ctaText}
          </div>
          <div
            style={{
              display: "flex",
              gap: Math.round(12 * scale),
              fontSize: Math.round((isWide ? 11 : 13) * scale),
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <span style={{ display: "flex" }}>♥ Like</span>
            <span style={{ display: "flex" }}>↗ Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}

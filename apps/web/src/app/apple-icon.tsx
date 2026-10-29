import { ImageResponse } from "next/og";
import { brandColors } from "@/lib/brand-colors";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Mirrors app/icon.svg; iOS home screens need a PNG.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: brandColors.accent,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 39,
          top: 39,
          width: 62,
          height: 62,
          borderRadius: 14,
          backgroundColor: brandColors.bg,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 90,
          width: 51,
          height: 51,
          borderRadius: 11,
          backgroundColor: brandColors.yellow,
        }}
      />
    </div>,
    size,
  );
}

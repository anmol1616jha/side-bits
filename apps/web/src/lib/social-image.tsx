import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { socialImageSize } from "@/lib/social-image-size";

export { socialImageSize };
export const socialImageContentType = "image/png";

// Light-theme brand tokens (packages/ui/src/styles/index.css). Images can't read CSS variables.
const colors = {
  bg: "#f5f1e8",
  surface: "#fffcf6",
  text: "#20211f",
  muted: "#55564f",
  accent: "#b83f25",
  yellow: "#e9c75a",
  border: "#c8c0b3",
};

interface SocialImageProps {
  eyebrow: string;
  title: string;
  description: string;
}

/** Shared layout for Open Graph and Twitter preview images. */
export function renderSocialImage({
  eyebrow,
  title,
  description,
}: SocialImageProps): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: colors.bg,
        color: colors.text,
        borderBottom: `16px solid ${colors.accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: colors.accent,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: colors.surface,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 28,
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: colors.yellow,
            }}
          />
        </div>
        <div style={{ fontSize: 34, fontWeight: 700 }}>{siteConfig.name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 28, color: colors.accent }}>{eyebrow}</div>
        <div
          style={{
            fontSize: title.length > 40 ? 64 : 80,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 32, color: colors.muted, lineHeight: 1.35, maxWidth: 980 }}>
          {description}
        </div>
      </div>
    </div>,
    socialImageSize,
  );
}

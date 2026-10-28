import { siteConfig } from "@/config/site";
import { renderSocialImage, socialImageContentType, socialImageSize } from "@/lib/social-image";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function OpenGraphImage() {
  return renderSocialImage({
    eyebrow: siteConfig.tagline,
    title: "A little corner of the internet for things that didn't need to exist.",
    description: "Useful tools, odd experiments and tiny websites.",
  });
}

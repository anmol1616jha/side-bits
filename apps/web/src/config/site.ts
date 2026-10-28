/**
 * Brand and canonical URL in one place (spec section 1.4). "Side-bits" is a
 * working name; change it here. Server-only: `SITE_URL` is not exposed to the
 * client bundle.
 */
const DEVELOPMENT_URL = "http://localhost:3000";

if (!process.env.SITE_URL && process.env.NODE_ENV === "production") {
  console.warn(
    `[site] SITE_URL is not set; canonical URLs, the sitemap and social previews will point at ${DEVELOPMENT_URL}.`,
  );
}

export const siteConfig = {
  name: "Side-bits",
  tagline: "Small projects. Side quests. Questionable priorities.",
  description:
    "A little corner of the internet for things that didn't need to exist: useful tools, odd experiments and tiny websites made because someone asked “what if?”",
  url: new URL(process.env.SITE_URL || DEVELOPMENT_URL),
} as const;

/**
 * Brand and canonical URL in one place (spec section 1.4). "Side-bits" is a
 * working name; change it here. Server-only: `SITE_URL` is not exposed to the
 * client bundle.
 */
const DEVELOPMENT_URL = "http://localhost:3000";

function readSiteUrl(): URL {
  const value = process.env.SITE_URL?.trim();
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        `[site] SITE_URL is not set; canonical URLs, the sitemap and social previews will point at ${DEVELOPMENT_URL}.`,
      );
    }
    return new URL(DEVELOPMENT_URL);
  }

  let url: URL | null = null;
  try {
    url = new URL(value);
  } catch {
    // Reported below.
  }
  if (!url || (url.protocol !== "https:" && url.protocol !== "http:")) {
    throw new Error(
      `[site] SITE_URL must be an absolute http(s) URL such as https://example.com; got "${value}".`,
    );
  }
  return url;
}

export const siteConfig = {
  name: "Side-bits",
  tagline: "Small projects. Side quests. Questionable priorities.",
  description:
    "A little corner of the internet for things that didn't need to exist: useful tools, odd experiments and tiny websites made because someone asked “what if?”",
  url: readSiteUrl(),
  author: { name: "Anmol Jha", url: "https://anmol1616jha.com/" },
} as const;

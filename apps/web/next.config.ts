import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

const manifest = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  dependencies: Record<string, string>;
};

// Workspace packages ship TypeScript source; Next compiles them with the app.
// Derived from package.json so adding a sidequest needs no edit here.
const workspacePackages = Object.keys(manifest.dependencies).filter((name) =>
  name.startsWith("@side-bits/"),
);

const isDev = process.env.NODE_ENV === "development";

/**
 * Pages are statically generated, so per-request nonces aren't available and
 * Next's inline hydration scripts (and the theme script) need 'unsafe-inline'.
 * The policy still blocks third-party scripts, plugins, framing and form posts
 * elsewhere. Styles allow inline for React style attributes and Next.js internals.
 * If a project ever renders untrusted HTML, revisit this with nonces.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  // Only takes effect over HTTPS; harmless locally.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  transpilePackages: workspacePackages,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

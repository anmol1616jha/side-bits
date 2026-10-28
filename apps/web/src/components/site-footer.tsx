import { Code, Settings } from "lucide-react";
import { Container, VisuallyHidden } from "@side-bits/ui";
import { BackToTopLink } from "@/components/back-to-top-link";
import { siteConfig } from "@/config/site";

const footerLinkClassName =
  "inline-flex min-h-11 items-center gap-1.5 font-medium underline-offset-4 hover:text-text hover:underline";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-bg/60 backdrop-blur-sm">
      <Container className="py-10">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-text-muted">{siteConfig.tagline}</p>
          <p className="mt-3 text-sm text-text-muted">
            No accounts and no analytics. Every current project runs entirely in your browser.
          </p>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 py-2 font-mono text-meta tracking-wider text-text-muted uppercase">
          <p className="flex items-center gap-2">
            <Settings aria-hidden="true" className="size-4" strokeWidth={2} />
            <span aria-hidden="true">&amp;</span>
            <Code aria-hidden="true" className="size-4" strokeWidth={2} />
            <VisuallyHidden>Built and coded by </VisuallyHidden>
            <span aria-hidden="true">By</span>
            <a
              href={siteConfig.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className={footerLinkClassName}
            >
              {siteConfig.author.name}
              <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
            </a>
          </p>
          <BackToTopLink className={footerLinkClassName} />
        </Container>
      </div>
    </footer>
  );
}

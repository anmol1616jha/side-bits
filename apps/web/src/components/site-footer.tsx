import Link from "next/link";
import { Container } from "@side-bits/ui";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-text-muted">{siteConfig.tagline}</p>
          <p className="mt-3 text-sm text-text-muted">
            No accounts and no analytics. Every current project runs entirely in your browser.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-text-muted underline-offset-4 hover:text-text hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}

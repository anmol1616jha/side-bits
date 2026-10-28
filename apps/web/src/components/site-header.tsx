import Link from "next/link";
import { Container, ThemeToggle } from "@side-bits/ui";
import { MainNav } from "@/components/main-nav";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container className="flex flex-wrap items-center justify-between gap-x-4 py-2 sm:flex-nowrap">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-display text-xl font-semibold tracking-tight"
        >
          {siteConfig.name}
        </Link>
        {/* On small screens the nav drops to its own row instead of hiding behind a menu. */}
        <MainNav
          items={primaryNavigation}
          className="order-last -mx-3 w-full sm:order-none sm:mx-0 sm:mr-auto sm:w-auto"
        />
        <ThemeToggle />
      </Container>
    </header>
  );
}

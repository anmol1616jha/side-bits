"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button, Container, EmptyState, buttonClasses } from "@side-bits/ui";
import "./globals.css";

/**
 * Last-resort page for errors in the root layout itself, where error.tsx can't
 * help. It replaces the whole document, so it renders its own html and body.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <title>Something went wrong</title>
        <main>
          <Container className="py-16 sm:py-24">
            <EmptyState
              headingLevel={1}
              title="Something went wrong"
              description="The site failed to load. It's not something you did. Try again in a moment."
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <Button onClick={retry}>
                    <RotateCcw aria-hidden="true" className="size-5" strokeWidth={1.75} />
                    Try again
                  </Button>
                  {/* A plain link: a full page load is the most reliable way out of a broken layout. */}
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- see above */}
                  <a href="/" className={buttonClasses({ variant: "secondary" })}>
                    Go home
                  </a>
                </div>
              }
            />
          </Container>
        </main>
      </body>
    </html>
  );
}

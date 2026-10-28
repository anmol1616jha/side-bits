"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";
import { IconButton } from "../icon-button/icon-button";

/**
 * Toggles between light and dark. The pressed state reports the current theme
 * to assistive technology; the icon shows it visually. Icons switch with CSS so
 * the right one renders before hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <IconButton
      label="Dark theme"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={className}
      icon={
        <>
          <Sun className="size-5 dark:hidden" strokeWidth={1.75} />
          <Moon className="hidden size-5 dark:block" strokeWidth={1.75} />
        </>
      }
    />
  );
}

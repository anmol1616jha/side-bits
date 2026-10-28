export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "side-bits-theme";
export const THEME_ATTRIBUTE = "data-theme";
export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function parseTheme(value: unknown): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

/** An explicit user choice wins; otherwise follow the system preference. */
export function resolveTheme(stored: Theme | null, systemPrefersDark: boolean): Theme {
  if (stored) return stored;
  return systemPrefersDark ? "dark" : "light";
}

/**
 * Inline script for <head> that sets the theme before first paint, so there is
 * no flash of the wrong theme. Kept dependency-free and tolerant of blocked
 * storage. It must stay in sync with `resolveTheme`.
 */
export const themeInitScript = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia(${JSON.stringify(
  DARK_SCHEME_QUERY,
)}).matches?"dark":"light"}document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTRIBUTE,
)},t)})();`;

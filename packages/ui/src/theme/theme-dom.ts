import {
  DARK_SCHEME_QUERY,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  parseTheme,
  resolveTheme,
} from "./theme";
import type { Theme } from "./theme";

export function readStoredTheme(): Theme | null {
  try {
    return parseTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function systemPrefersDark(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(DARK_SCHEME_QUERY).matches;
}

export function readAppliedTheme(): Theme | null {
  return parseTheme(document.documentElement.getAttribute(THEME_ATTRIBUTE));
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
}

/** Persists only on an explicit user choice, as the spec requires. */
export function chooseTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode, policies); the choice still applies for this page.
  }
  applyTheme(theme);
}

/**
 * Keeps the applied theme in sync with system changes (when the user has not
 * chosen) and with choices made in other tabs. Returns a cleanup function.
 */
export function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [THEME_ATTRIBUTE],
  });

  const media =
    typeof window.matchMedia === "function" ? window.matchMedia(DARK_SCHEME_QUERY) : null;
  const onSystemChange = () => {
    if (readStoredTheme() === null) applyTheme(resolveTheme(null, systemPrefersDark()));
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(resolveTheme(parseTheme(event.newValue), systemPrefersDark()));
  };

  media?.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);

  return () => {
    observer.disconnect();
    media?.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

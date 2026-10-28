"use client";

import { useSyncExternalStore } from "react";
import { chooseTheme, readAppliedTheme, subscribeToTheme } from "../theme/theme-dom";
import type { Theme } from "../theme/theme";

const getServerSnapshot = () => null;

/** Current theme, or `null` during server rendering and before hydration. */
export function useTheme(): { theme: Theme | null; setTheme: (theme: Theme) => void } {
  const theme = useSyncExternalStore(subscribeToTheme, readAppliedTheme, getServerSnapshot);
  return { theme, setTheme: chooseTheme };
}

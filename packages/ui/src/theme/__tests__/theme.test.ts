import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY, parseTheme, resolveTheme, themeInitScript } from "../theme";
import { chooseTheme, readStoredTheme } from "../theme-dom";

function mockSystemDark(prefersDark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: prefersDark,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

function runInitScript() {
  new Function(themeInitScript)();
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("parseTheme", () => {
  it("accepts only known themes", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
    expect(parseTheme("sepia")).toBeNull();
    expect(parseTheme(null)).toBeNull();
    expect(parseTheme(1)).toBeNull();
  });
});

describe("resolveTheme", () => {
  it("follows the system when the user has not chosen", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("prefers the user's explicit choice over the system", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("themeInitScript", () => {
  it("applies the system theme on first visit without storing it", () => {
    mockSystemDark(true);
    runInitScript();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("applies a stored choice over the system preference", () => {
    mockSystemDark(true);
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    runInitScript();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("ignores an invalid stored value", () => {
    mockSystemDark(false);
    window.localStorage.setItem(THEME_STORAGE_KEY, "<script>");
    runInitScript();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("still applies a theme when storage is blocked", () => {
    mockSystemDark(true);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    runInitScript();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

describe("chooseTheme", () => {
  it("applies and persists an explicit choice", () => {
    chooseTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(readStoredTheme()).toBe("dark");
  });
});

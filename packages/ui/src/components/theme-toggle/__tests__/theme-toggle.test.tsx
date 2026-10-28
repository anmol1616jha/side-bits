import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "../../../theme/theme";
import { ThemeToggle } from "../theme-toggle";

describe("ThemeToggle", () => {
  it("has an accessible name and reports the current theme", () => {
    document.documentElement.setAttribute("data-theme", "light");
    render(<ThemeToggle />);
    const toggle = screen.getByRole("button", { name: "Dark theme" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
  });

  it("switches theme and remembers the explicit choice", async () => {
    document.documentElement.setAttribute("data-theme", "light");
    render(<ThemeToggle />);
    const toggle = screen.getByRole("button", { name: "Dark theme" });

    await act(async () => {
      fireEvent.click(toggle);
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
  });
});

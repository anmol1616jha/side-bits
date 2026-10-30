import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY } from "../constants";
import { WordGeneratorApp } from "../WordGeneratorApp";
import { CATEGORIES, WORDS } from "../lib/vocabulary";

const button = (name: string | RegExp) => screen.getByRole("button", { name }) as HTMLButtonElement;
const radio = (name: string) => screen.getByRole("radio", { name }) as HTMLInputElement;
const announced = () => screen.getAllByRole("status").at(-1)!.textContent;
const wordTiles = () => within(screen.getByRole("list")).getAllByRole("listitem", { hidden: true });

/** The real words on screen, read from the tiles' replace buttons. */
const shownWords = () =>
  screen
    .getAllByRole("button", { name: /^Replace / })
    .map((replace) => replace.getAttribute("aria-label")!.replace("Replace ", "").toLowerCase());

function settle() {
  act(() => {
    vi.advanceTimersByTime(3000);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("WordGeneratorApp", () => {
  it("starts on Medium, 2 words, somewhat related, with empty slots", () => {
    render(<WordGeneratorApp />);
    expect(radio("Medium").checked).toBe(true);
    expect(radio("2 words").checked).toBe(true);
    expect(radio("Somewhat related").checked).toBe(true);
    expect(wordTiles()).toHaveLength(2);
  });

  it("generates the chosen number of words at the chosen difficulty", () => {
    render(<WordGeneratorApp />);
    fireEvent.click(screen.getByRole("radio", { name: "Hard" }));
    fireEvent.click(screen.getByRole("radio", { name: "7 words" }));
    fireEvent.click(screen.getByRole("radio", { name: "Unrelated" }));
    fireEvent.click(button("Generate"));
    settle();
    const words = shownWords();
    expect(words).toHaveLength(7);
    for (const text of words) {
      expect(WORDS.find((word) => word.text === text)?.difficulty).toBe("hard");
    }
    expect(announced()).toContain("Your words:");
  });

  it("names the category of a closely related list", () => {
    render(<WordGeneratorApp />);
    fireEvent.click(screen.getByRole("radio", { name: "Closely related" }));
    fireEvent.click(button("Generate"));
    settle();
    const labels = CATEGORIES.map((category) => `All from: ${category.label}`);
    expect(screen.getByText((text) => labels.includes(text))).toBeTruthy();
  });

  it("keeps the real words available to screen readers while the shuffle plays", () => {
    render(<WordGeneratorApp />);
    fireEvent.click(button("Generate"));
    const words = shownWords();
    for (const text of words) {
      const real = screen.getByText(text.charAt(0).toUpperCase() + text.slice(1));
      expect(real.closest("[aria-hidden]")).toBeNull();
    }
  });

  it("replaces one word and leaves the others alone", () => {
    render(<WordGeneratorApp />);
    fireEvent.click(screen.getByRole("radio", { name: "5 words" }));
    fireEvent.click(button("Generate"));
    settle();
    const before = shownWords();
    fireEvent.click(screen.getAllByRole("button", { name: /^Replace / })[1]!);
    settle();
    const after = shownWords();
    expect(after[1]).not.toBe(before[1]);
    expect(after.filter((_, index) => index !== 1)).toEqual(
      before.filter((_, index) => index !== 1),
    );
    expect(announced()).toMatch(/^Replaced /);
  });

  it("remembers recent words across reloads", () => {
    const { unmount } = render(<WordGeneratorApp />);
    fireEvent.click(button("Generate"));
    settle();
    const words = shownWords();
    unmount();
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!) as { lists: string[][] };
    expect(saved.lists[0]).toEqual(words);
  });

  it("says so when fewer words match than were asked for", () => {
    render(<WordGeneratorApp />);
    fireEvent.click(screen.getByRole("radio", { name: "Hard" }));
    fireEvent.click(screen.getByRole("radio", { name: "10 words" }));
    fireEvent.click(screen.getByRole("radio", { name: "Closely related" }));
    fireEvent.click(button("Generate"));
    settle();
    const count = shownWords().length;
    if (count < 10) {
      expect(screen.getByText(`Only ${count} words matched your selected criteria.`)).toBeTruthy();
    } else {
      expect(screen.queryByText(/matched your selected criteria/)).toBeNull();
    }
  });
});

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DiceRollerApp } from "../DiceRollerApp";

const rollButton = () => screen.getByRole("button", { name: /^Roll/ });
const announced = () => screen.getByRole("status").textContent;
const historyRows = () => screen.queryAllByRole("listitem");

function land() {
  act(() => {
    vi.advanceTimersByTime(2000);
  });
}

/** Every die comes up as `face`. */
function rigDice(face: number) {
  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
    <T extends ArrayBufferView>(array: T) => {
      (array as unknown as Uint32Array)[0] = face - 1;
      return array;
    },
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("DiceRollerApp", () => {
  it("rolls the chosen number of dice and adds them up", () => {
    render(<DiceRollerApp />);
    fireEvent.click(screen.getByRole("radio", { name: "3 dice" }));
    expect(rollButton().textContent).toBe("Roll 3 dice");

    fireEvent.click(rollButton());
    expect(screen.getByText("Rolling…")).toBeTruthy();
    land();

    const match = /^Rolled ([1-6]), ([1-6]) and ([1-6])\. Total (\d+)\./.exec(announced() ?? "");
    expect(match).not.toBeNull();
    const [, a, b, c, total] = match!.map(Number);
    expect(total).toBe(a! + b! + c!);
    expect(screen.getByText(String(total), { selector: "p" })).toBeTruthy();
    expect(historyRows()).toHaveLength(1);
  });

  it("rolls a single die", () => {
    rigDice(4);
    render(<DiceRollerApp />);
    fireEvent.click(screen.getByRole("radio", { name: "1 die" }));
    fireEvent.click(rollButton());
    land();
    expect(announced()).toBe("Rolled 4.");
    expect(screen.getByText("You rolled")).toBeTruthy();
  });

  it("ignores extra presses while the dice are in the air", () => {
    render(<DiceRollerApp />);
    fireEvent.click(rollButton());
    fireEvent.click(rollButton());
    land();
    expect(historyRows()).toHaveLength(1);
    expect(screen.getByRole("radio", { name: "2 dice" })).toHaveProperty("disabled", false);
  });

  it("celebrates matching dice", () => {
    rigDice(1);
    render(<DiceRollerApp />);
    fireEvent.click(rollButton());
    land();
    expect(screen.getByText("Snake eyes!")).toBeTruthy();
    expect(announced()).toBe("Rolled 1 and 1. Total 2. Snake eyes!");
  });

  it("keeps the last ten rolls, newest first, and clears them", () => {
    render(<DiceRollerApp />);
    for (let index = 0; index < 12; index++) {
      fireEvent.click(rollButton());
      land();
    }
    const rows = historyRows();
    expect(rows).toHaveLength(10);
    expect(rows[0]!.textContent).toMatch(/^#12/);
    expect(rows[9]!.textContent).toMatch(/^#3/);

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(historyRows()).toHaveLength(0);
  });

  it("clears the result when the number of dice changes", () => {
    render(<DiceRollerApp />);
    fireEvent.click(rollButton());
    land();
    expect(screen.getByText("Total")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "5 dice" }));
    expect(screen.queryByText("Total")).toBeNull();
    expect(screen.getByText("Pick how many dice, then roll.")).toBeTruthy();
  });

  it("switches the dice sounds off and on", () => {
    render(<DiceRollerApp />);
    const toggle = screen.getByRole("button", { name: "Dice sounds" });
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    // jsdom has no Web Audio; rolling must still work either way.
    fireEvent.click(toggle);
    fireEvent.click(rollButton());
    land();
    expect(historyRows()).toHaveLength(1);
  });

  it("shows the result straight away when reduced motion is preferred", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce") }));
    try {
      render(<DiceRollerApp />);
      fireEvent.click(rollButton());
      expect(screen.queryByText("Rolling…")).toBeNull();
      expect(announced()).toMatch(/^Rolled/);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

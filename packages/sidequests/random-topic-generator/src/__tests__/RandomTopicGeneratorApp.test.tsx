import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY } from "../constants";
import { RandomTopicGeneratorApp } from "../RandomTopicGeneratorApp";
import { TOPICS } from "../lib/topics";

const MINUTE = 60_000;
const button = (name: string | RegExp) => screen.getByRole("button", { name }) as HTMLButtonElement;
const timer = () => screen.getByRole("timer");
const announced = () => screen.getByRole("status", { hidden: false }).textContent;

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function startResearch() {
  render(<RandomTopicGeneratorApp />);
  fireEvent.click(button("Get a topic"));
  fireEvent.click(button("Start research"));
}

beforeEach(() => {
  vi.useFakeTimers({ now: new Date("2026-10-28T10:00:00Z") });
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("RandomTopicGeneratorApp", () => {
  it("shows a topic at the chosen difficulty and rerolls it", () => {
    render(<RandomTopicGeneratorApp />);
    fireEvent.click(screen.getByRole("radio", { name: "Difficult" }));
    fireEvent.click(button("Get a topic"));
    const shownTopic = () =>
      screen.getByText((text) => TOPICS.difficult.includes(text)).textContent;
    advance(1500); // Let the shuffle land.
    const first = shownTopic();
    fireEvent.click(button("New topic"));
    advance(1500);
    expect(shownTopic()).not.toBe(first);
  });

  it("keeps the real topic available to screen readers while the shuffle plays", () => {
    render(<RandomTopicGeneratorApp />);
    fireEvent.click(button("Get a topic"));
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!) as { topic: string };
    const real = screen.getByText(saved.topic);
    expect(real.closest("[aria-hidden]")).toBeNull();
    advance(1500);
    expect(screen.getAllByText((text) => TOPICS.easy.includes(text))).toHaveLength(1);
  });

  it("counts down research and unlocks the test when time is up", () => {
    render(<RandomTopicGeneratorApp />);
    fireEvent.click(screen.getByRole("radio", { name: "45 min" }));
    fireEvent.click(button("Get a topic"));
    fireEvent.click(button("Start research"));
    expect(timer().textContent).toBe("45:00");
    expect(screen.queryByRole("button", { name: /Start the 1-minute test/ })).toBeNull();

    advance(10 * MINUTE);
    expect(timer().textContent).toBe("35:00");

    advance(35 * MINUTE);
    expect(button("Start the 1-minute test")).toBeTruthy();
    expect(announced()).toBe("Research time is up. You can start the test.");
  });

  it("pauses the research clock during a break", () => {
    startResearch();
    advance(5 * MINUTE);
    fireEvent.click(button("Take a break"));
    expect(screen.getByText(/Paused · on a break/)).toBeTruthy();

    advance(20 * MINUTE);
    expect(timer().textContent).toBe("25:00");
    expect(screen.getByText(/on a break for 20:00/)).toBeTruthy();

    fireEvent.click(button("Resume research"));
    advance(MINUTE);
    expect(timer().textContent).toBe("24:00");
    expect(screen.getByText("1 break, 20 min in total.")).toBeTruthy();
  });

  it("runs a one-minute test and shows a summary", () => {
    startResearch();
    fireEvent.click(button("I'm ready"));
    fireEvent.click(button("Yes, I'm ready"));
    fireEvent.click(button("Start the 1-minute test"));
    expect(timer().textContent).toBe("1:00");

    advance(MINUTE);
    expect(screen.getByRole("heading", { name: "That's a full minute. Nice." })).toBeTruthy();
    expect(screen.getByText("The full minute")).toBeTruthy();

    fireEvent.click(button("New topic, same settings"));
    expect(button("Start research")).toBeTruthy();
  });

  it("asks before giving up", () => {
    startResearch();
    fireEvent.click(button("Give up"));
    fireEvent.click(button("Keep researching"));
    expect(timer()).toBeTruthy();

    fireEvent.click(button("Give up"));
    fireEvent.click(button("Yes, give up"));
    expect(button("Get a topic")).toBeTruthy();
  });

  it("picks up a running session after a reload", () => {
    const { unmount } = render(<RandomTopicGeneratorApp />);
    fireEvent.click(button("Get a topic"));
    fireEvent.click(button("Start research"));
    advance(3 * MINUTE);
    unmount();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"phase":"research"');

    advance(2 * MINUTE);
    render(<RandomTopicGeneratorApp />);
    advance(300);
    expect(timer().textContent).toBe("25:00");
  });

  it("doesn't keep a topic that research hasn't started on after a reload", () => {
    const { unmount } = render(<RandomTopicGeneratorApp />);
    fireEvent.click(screen.getByRole("radio", { name: "Difficult" }));
    fireEvent.click(screen.getByRole("radio", { name: "45 min" }));
    fireEvent.click(button("Get a topic"));
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!) as { topic: string };
    unmount();

    render(<RandomTopicGeneratorApp />);
    expect(button("Get a topic")).toBeTruthy();
    expect((screen.getByRole("radio", { name: "Difficult" }) as HTMLInputElement).checked).toBe(
      true,
    );
    expect((screen.getByRole("radio", { name: "45 min" }) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(button("Get a topic"));
    advance(1500);
    expect(screen.queryByText(saved.topic)).toBeNull();
  });

  it("starts fresh when the saved session is unreadable", () => {
    window.localStorage.setItem(STORAGE_KEY, '{"phase":"research"}');
    render(<RandomTopicGeneratorApp />);
    expect(button("Get a topic")).toBeTruthy();
  });

  it("shows the time left in the tab title and restores it afterwards", () => {
    document.title = "Random Topic Generator";
    const { unmount } = render(<RandomTopicGeneratorApp />);
    fireEvent.click(button("Get a topic"));
    fireEvent.click(button("Start research"));
    expect(document.title).toBe("30:00 · Research · Random Topic Generator");
    unmount();
    expect(document.title).toBe("Random Topic Generator");
  });

  it("moves focus to the new step's heading", () => {
    startResearch();
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Research time" }));
  });
});

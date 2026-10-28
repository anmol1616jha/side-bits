import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "../copy-button";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CopyButton", () => {
  it("copies the value and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<CopyButton value={() => "hello"} label="Copy text" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy text" }));
    });

    expect(writeText).toHaveBeenCalledWith("hello");
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Copied to clipboard.");
  });

  it("explains when the clipboard is blocked", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    render(<CopyButton value="hello" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });

    expect(screen.getByText("Copy blocked. Select the text and copy it manually.")).toBeTruthy();
  });
});

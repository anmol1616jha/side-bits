import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MAX_INPUT_CHARACTERS } from "../constants";
import { TinyTextLabApp } from "../TinyTextLabApp";

const field = () => screen.getByRole("textbox", { name: "Your text" }) as HTMLTextAreaElement;
const button = (name: string) => screen.getByRole("button", { name }) as HTMLButtonElement;

describe("TinyTextLabApp", () => {
  it("disables transforms until there is text", () => {
    render(<TinyTextLabApp />);
    expect(button("UPPERCASE").disabled).toBe(true);
    fireEvent.change(field(), { target: { value: "hi" } });
    expect(button("UPPERCASE").disabled).toBe(false);
  });

  it("applies a transform, announces it, and can undo and redo", () => {
    render(<TinyTextLabApp />);
    fireEvent.change(field(), { target: { value: "hello world" } });
    fireEvent.click(button("Title Case"));
    expect(field().value).toBe("Hello World");
    expect(screen.getByText("Applied Title Case.").getAttribute("role")).toBe("status");

    fireEvent.click(button("Undo"));
    expect(field().value).toBe("hello world");
    fireEvent.click(button("Redo"));
    expect(field().value).toBe("Hello World");
  });

  it("says when a transform changes nothing", () => {
    render(<TinyTextLabApp />);
    fireEvent.change(field(), { target: { value: "QUIET" } });
    fireEvent.click(button("UPPERCASE"));
    expect(screen.getByText("UPPERCASE: nothing to change.")).toBeTruthy();
    expect(button("Undo").disabled).toBe(true);
  });

  it("shows live counts", () => {
    render(<TinyTextLabApp />);
    fireEvent.change(field(), { target: { value: "one two three" } });
    const words = screen.getByText("Words").nextElementSibling!;
    expect(words.textContent).toBe("3");
  });

  it("undoes and redoes transforms from the keyboard until the user types again", () => {
    render(<TinyTextLabApp />);
    fireEvent.change(field(), { target: { value: "hello" } });
    fireEvent.click(button("UPPERCASE"));
    fireEvent.keyDown(field(), { key: "z", ctrlKey: true });
    expect(field().value).toBe("hello");
    fireEvent.keyDown(field(), { key: "Z", metaKey: true, shiftKey: true });
    expect(field().value).toBe("HELLO");

    fireEvent.change(field(), { target: { value: "HELLO!" } });
    fireEvent.keyDown(field(), { key: "z", ctrlKey: true });
    expect(field().value).toBe("HELLO!");
  });

  it("links the length warning to the text box instead of shouting it on every keystroke", () => {
    render(<TinyTextLabApp />);
    fireEvent.change(field(), { target: { value: "x".repeat(MAX_INPUT_CHARACTERS + 1) } });
    const warning = screen.getByText(/The limit is/);
    expect(warning.closest("[role=alert]")).toBeNull();
    const describedBy = field().getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)!.textContent).toContain("The limit is");
    expect(screen.getByText("Too long: transformations are paused.").getAttribute("role")).toBe(
      "status",
    );
  });

  it("can bring back cleared text", () => {
    render(<TinyTextLabApp />);
    fireEvent.change(field(), { target: { value: "keep me" } });
    fireEvent.click(button("Clear"));
    expect(field().value).toBe("");
    fireEvent.click(button("Undo"));
    expect(field().value).toBe("keep me");
  });
});

describe("TinyTextLabApp tools panel", () => {
  it("comes right after the text box in reading and tab order", () => {
    render(<TinyTextLabApp />);
    const panel = screen.getByRole("region", { name: "Text tools" });
    expect(field().compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("labels each group of transformations", () => {
    render(<TinyTextLabApp />);
    for (const name of ["Case", "Whitespace", "Lines"]) {
      expect(screen.getByRole("group", { name })).toBeTruthy();
    }
    expect(screen.getByRole("radio", { name: "Whitespace" })).toBeTruthy();
  });
});

describe("TinyTextLabApp copy action", () => {
  it("puts copy, undo, redo and clear right after the text box, outside the tools panel", () => {
    render(<TinyTextLabApp />);
    const panel = screen.getByRole("region", { name: "Text tools" });
    for (const name of ["Copy text", "Undo", "Redo", "Clear"]) {
      const action = button(name);
      expect(panel.contains(action)).toBe(false);
      expect(
        field().compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });
});

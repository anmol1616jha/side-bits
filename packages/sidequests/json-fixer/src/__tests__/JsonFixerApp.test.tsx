import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JsonFixerApp } from "../JsonFixerApp";

function input() {
  return screen.getByRole("textbox", { name: "JSON to check" }) as HTMLTextAreaElement;
}
function output() {
  return screen.getByRole("textbox", { name: "Formatted JSON" }) as HTMLTextAreaElement;
}

describe("JsonFixerApp", () => {
  it("formats valid JSON and reports it as valid", () => {
    render(<JsonFixerApp />);
    fireEvent.change(input(), { target: { value: '{"a":[1,2]}' } });
    expect(output().value).toBe('{\n  "a": [\n    1,\n    2\n  ]\n}');
    expect(screen.getByText("Valid JSON.")).toBeTruthy();
    expect(input().getAttribute("aria-invalid")).toBe("false");
  });

  it("switches output style", () => {
    render(<JsonFixerApp />);
    fireEvent.change(input(), { target: { value: '{ "a" : 1 }' } });
    fireEvent.click(screen.getByRole("radio", { name: "Minified" }));
    expect(output().value).toBe('{"a":1}');
  });

  it("explains errors and links them to the input", () => {
    render(<JsonFixerApp />);
    fireEvent.change(input(), { target: { value: "[1 2]" } });
    expect(input().getAttribute("aria-invalid")).toBe("true");
    const describedBy = input().getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)!.textContent).toContain(
      "Line 1, column 4: Missing comma between items.",
    );
    expect(output().value).toBe("");
    expect((screen.getByRole("button", { name: "Copy JSON" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("highlights the character where the error is", () => {
    const { container } = render(<JsonFixerApp />);
    fireEvent.change(input(), { target: { value: '["😀😀" x]' } });
    expect(container.querySelector("pre span")!.textContent).toBe("x");
  });

  it("applies and undoes automatic fixes", () => {
    render(<JsonFixerApp />);
    fireEvent.click(screen.getByRole("button", { name: "Load example" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply fixes" }));
    expect(screen.getByText("Valid JSON.")).toBeTruthy();
    expect(output().value).toContain('"name": "Side-bits"');
    fireEvent.click(screen.getByRole("button", { name: "Undo fixes" }));
    expect(input().value).toContain("name: 'Side-bits'");
  });
});

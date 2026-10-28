import { describe, expect, it } from "vitest";
import { locate, snippetAround } from "../lib/location";

describe("locate", () => {
  it("counts lines and columns from 1", () => {
    expect(locate("ab\ncd", 0)).toEqual({ line: 1, column: 1 });
    expect(locate("ab\ncd", 4)).toEqual({ line: 2, column: 2 });
  });
});

describe("snippetAround", () => {
  it("returns the error line with a caret position", () => {
    expect(snippetAround("one\ntwo three\nfour", 8, 40)).toEqual({ text: "two three", caret: 4 });
  });

  it("clips long lines around the error", () => {
    const line = `${"a".repeat(100)}X${"b".repeat(100)}`;
    const snippet = snippetAround(line, 100, 5);
    expect(snippet.text).toBe("…aaaaaXbbbbb…");
    expect(snippet.text[snippet.caret]).toBe("X");
  });
});

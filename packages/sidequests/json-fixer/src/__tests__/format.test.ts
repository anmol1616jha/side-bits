import { describe, expect, it } from "vitest";
import { formatTokens } from "../lib/format";
import { parseJson } from "../lib/parse";

function format(text: string, style: Parameters<typeof formatTokens>[1]) {
  const result = parseJson(text);
  if (!result.ok) throw new Error(result.error.message);
  return formatTokens(result.tokens, style);
}

describe("formatTokens", () => {
  it("indents with two spaces", () => {
    expect(format('{"a":[1,2],"b":{}}', "2")).toBe(
      '{\n  "a": [\n    1,\n    2\n  ],\n  "b": {}\n}',
    );
  });

  it("supports four spaces and tabs", () => {
    expect(format("[1]", "4")).toBe("[\n    1\n]");
    expect(format("[1]", "tab")).toBe("[\n\t1\n]");
  });

  it("minifies", () => {
    expect(format('{\n  "a" : [ 1, 2 ]\n}', "minify")).toBe('{"a":[1,2]}');
  });

  it("keeps numbers and escapes exactly as written", () => {
    const text = '{"big": 12345678901234567890, "float": 1.0, "exp": 1E3, "esc": "\\u00e9\\/"}';
    const output = format(text, "minify");
    expect(output).toBe('{"big":12345678901234567890,"float":1.0,"exp":1E3,"esc":"\\u00e9\\/"}');
  });

  it("round-trips to the same value as JSON.parse", () => {
    const value = { a: [1, { b: "c" }], d: null, e: [], f: {} };
    expect(JSON.parse(format(JSON.stringify(value), "2"))).toEqual(value);
  });
});

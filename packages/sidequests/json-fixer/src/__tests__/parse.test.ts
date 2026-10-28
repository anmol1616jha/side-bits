import { describe, expect, it } from "vitest";
import { parseJson } from "../lib/parse";

function errorOf(text: string) {
  const result = parseJson(text);
  if (result.ok) throw new Error(`Expected "${text}" to be invalid`);
  return result.error;
}

describe("parseJson: valid input", () => {
  it.each([
    "{}",
    "[]",
    '"text"',
    "0",
    "-1.5e+10",
    "true",
    "null",
    '{"a": [1, 2, {"b": null}], "c": "\\u00e9\\n"}',
    ' \n\t{ "spaced" : true } \r\n',
  ])("accepts %s", (text) => {
    expect(parseJson(text).ok).toBe(true);
  });

  it("agrees with JSON.parse on a varied document", () => {
    const text = JSON.stringify({ a: [1, "two", { three: [null, true, false] }], é: " " });
    expect(parseJson(text).ok).toBe(true);
  });

  it("summarises the root value", () => {
    const result = parseJson('{"a": 1, "b": {"c": [1, 2]}}');
    expect(result.ok && result.summary).toEqual({ root: "object", size: 2, depth: 3 });
    const array = parseJson("[1, [2], 3]");
    expect(array.ok && array.summary).toEqual({ root: "array", size: 3, depth: 2 });
  });

  it("handles very deep nesting without overflowing the stack", () => {
    const depth = 100_000;
    expect(parseJson(`${"[".repeat(depth)}${"]".repeat(depth)}`).ok).toBe(true);
  });
});

describe("parseJson: errors", () => {
  it("reports line and column", () => {
    expect(errorOf('{\n  "a": 1\n  "b": 2\n}')).toMatchObject({
      message: "Missing comma between properties.",
      line: 3,
      column: 3,
    });
  });

  it.each([
    ['{"a": 1,}', "Trailing comma before “}”."],
    ["[1, 2,]", "Trailing comma before “]”."],
    ["{a: 1}", "Unexpected word “a”. Text must be wrapped in double quotes."],
    ["{'a': 1}", 'JSON strings must use straight double quotes (").'],
    ['{"a": True}', "Unexpected word “True”. JSON uses lowercase true, false and null."],
    [
      '{"a": undefined}',
      "Unexpected word “undefined”. JSON has no such value; use null or a string.",
    ],
    ["[1 2]", "Missing comma between items."],
    ['{"a" 1}', "Expected “:” after the property name."],
    ['{"a": }', "Expected a value but found “}”."],
    ["[1}", "Mismatched bracket: “}” closes an array that should end with “]”."],
    ["// hi\n{}", "Comments are not allowed in JSON."],
    [
      "01",
      "This is not a valid number. JSON numbers have no leading zeros, hex, or trailing dots.",
    ],
    ['"abc', "This string is never closed."],
    ['"a\\x"', "“\\x” is not a valid escape sequence."],
    ['"a\nb"', "Strings can't contain raw line breaks. Use \\n instead."],
    ["{} {}", "Unexpected content after the end of the JSON. Is a comma or bracket missing?"],
    ["{1: 2}", "Property names must be strings in double quotes."],
  ])("explains %j", (text, message) => {
    expect(errorOf(text).message).toBe(message);
  });

  it("names invisible characters instead of quoting them", () => {
    expect(errorOf('\uFEFF{"a": 1}').message).toBe(
      "Unexpected character an invisible byte order mark (U+FEFF).",
    );
    expect(errorOf('{\u00A0"a": 1}').message).toBe(
      "Unexpected character a non-breaking space (U+00A0).",
    );
  });

  it("reports early endings at the last content, not at trailing blank lines", () => {
    expect(errorOf('{"a": 1\n\n')).toMatchObject({ line: 1, column: 8 });
  });

  it("points at the unclosed container when input ends early", () => {
    expect(errorOf('{\n  "a": [1, 2').message).toBe(
      "Unexpected end of input: the array opened on line 2 is missing its closing “]”.",
    );
  });
});

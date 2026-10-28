import { describe, expect, it } from "vitest";
import { analyzeJson } from "../lib/analyze";
import { parseJson } from "../lib/parse";
import { repairJson } from "../lib/repair";
import { EXAMPLE_INPUT, MAX_INPUT_CHARACTERS } from "../constants";

function repaired(text: string) {
  const result = repairJson(text);
  expect(parseJson(result.text).ok).toBe(true);
  return result;
}

describe("repairJson", () => {
  it("removes comments and trailing commas", () => {
    const result = repaired('{\n  // note\n  "a": [1, 2, /* x */ ],\n}');
    expect(JSON.parse(result.text)).toEqual({ a: [1, 2] });
    expect(result.repairs).toEqual(["comments", "trailing-commas"]);
  });

  it("converts single-quoted strings, escaping inner double quotes", () => {
    const result = repaired(`{'say': 'it\\'s "fine"'}`);
    expect(JSON.parse(result.text)).toEqual({ say: `it's "fine"` });
    expect(result.repairs).toEqual(["single-quotes"]);
  });

  it("converts curly quotes from word processors", () => {
    expect(JSON.parse(repaired("{“a”: “b”}").text)).toEqual({ a: "b" });
  });

  it("quotes bare keys and converts Python literals", () => {
    const result = repaired("{name: True, other: None, ok: False}");
    expect(JSON.parse(result.text)).toEqual({ name: true, other: null, ok: false });
    expect(result.repairs).toEqual(["unquoted-keys", "python-literals"]);
  });

  it("escapes raw line breaks and tabs inside strings", () => {
    expect(JSON.parse(repaired('{"a": "line\none\there"}').text)).toEqual({ a: "line\none\there" });
  });

  it("removes byte order marks and replaces non-breaking spaces between tokens", () => {
    const result = repaired('\uFEFF{\u00A0"a":\u00A01,\u200B"b": "x\u00A0y"}');
    expect(JSON.parse(result.text)).toEqual({ a: 1, b: "x\u00A0y" });
    expect(result.repairs).toEqual(["unusual-whitespace"]);
  });

  it("never rewrites text inside strings", () => {
    const text = '{"url": "http://example.com", "words": "True, None, a: b", "c": "x,]"}';
    const result = repairJson(text);
    expect(result.text).toBe(text);
    expect(result.repairs).toEqual([]);
  });

  it("leaves unrepairable input for the validator to report", () => {
    expect(parseJson(repairJson('{"a": [1, 2').text).ok).toBe(false);
  });
});

describe("analyzeJson", () => {
  it("treats blank input as empty", () => {
    expect(analyzeJson("  \n", "2")).toEqual({ state: "empty" });
  });

  it("refuses oversized input", () => {
    expect(analyzeJson("1".repeat(MAX_INPUT_CHARACTERS + 1), "2").state).toBe("too-large");
  });

  it("offers a fix for the built-in example", () => {
    const analysis = analyzeJson(EXAMPLE_INPUT, "2");
    expect(analysis.state).toBe("invalid");
    if (analysis.state !== "invalid") return;
    expect(analysis.fix).not.toBeNull();
    expect(analysis.fix!.text).toContain("12345678901234567890");
  });

  it("offers no fix when repairs can't help", () => {
    const analysis = analyzeJson("{]", "2");
    expect(analysis.state === "invalid" && analysis.fix).toBeNull();
  });
});

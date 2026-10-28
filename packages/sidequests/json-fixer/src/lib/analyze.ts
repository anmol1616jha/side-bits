import { MAX_INPUT_CHARACTERS } from "../constants";
import type { IndentStyle } from "../constants";
import { formatTokens } from "./format";
import { parseJson } from "./parse";
import type { JsonError, JsonSummary } from "./parse";
import { repairJson } from "./repair";
import type { RepairKind } from "./repair";

export type Analysis =
  | { state: "empty" }
  | { state: "too-large"; length: number }
  | { state: "valid"; output: string; summary: JsonSummary }
  | {
      state: "invalid";
      error: JsonError;
      /** Present when the automatic repairs produce valid JSON. */
      fix: { text: string; repairs: RepairKind[] } | null;
    };

export function analyzeJson(input: string, style: IndentStyle): Analysis {
  if (input.trim() === "") return { state: "empty" };
  if (input.length > MAX_INPUT_CHARACTERS) return { state: "too-large", length: input.length };

  const result = parseJson(input);
  if (result.ok) {
    return { state: "valid", output: formatTokens(result.tokens, style), summary: result.summary };
  }

  const repaired = repairJson(input);
  const fixed = repaired.repairs.length > 0 ? parseJson(repaired.text) : null;
  return {
    state: "invalid",
    error: result.error,
    fix: fixed?.ok ? { text: formatTokens(fixed.tokens, "2"), repairs: repaired.repairs } : null,
  };
}

export function describeSummary(summary: JsonSummary): string {
  switch (summary.root) {
    case "object":
      return `An object with ${summary.size} ${summary.size === 1 ? "property" : "properties"}`;
    case "array":
      return `An array with ${summary.size} ${summary.size === 1 ? "item" : "items"}`;
    case "string":
      return "A single string";
    case "number":
      return "A single number";
    case "boolean":
      return "A single true/false value";
    case "null":
      return "A single null";
  }
}

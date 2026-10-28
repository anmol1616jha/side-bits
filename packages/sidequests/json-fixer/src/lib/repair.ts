export type RepairKind =
  | "comments"
  | "trailing-commas"
  | "single-quotes"
  | "curly-quotes"
  | "unquoted-keys"
  | "python-literals"
  | "raw-control-characters";

export const REPAIR_LABELS: Record<RepairKind, string> = {
  comments: "removed comments",
  "trailing-commas": "removed trailing commas",
  "single-quotes": "changed single quotes to double quotes",
  "curly-quotes": "changed curly quotes to straight quotes",
  "unquoted-keys": "added quotes around property names",
  "python-literals": "changed True/False/None to true/false/null",
  "raw-control-characters": "escaped line breaks and tabs inside strings",
};

export interface RepairResult {
  text: string;
  /** Repairs that changed something, in a stable order. */
  repairs: RepairKind[];
}

const PYTHON_LITERALS: Record<string, string> = { True: "true", False: "false", None: "null" };
const ESCAPED_CONTROL: Record<string, string> = { "\n": "\\n", "\r": "\\r", "\t": "\\t" };
const IDENTIFIER_START = /[A-Za-z_$]/;
const IDENTIFIER_PART = /[\w$]/;

/** Closing delimiters accepted for each opening quote. */
const QUOTE_PAIRS: Record<string, { close: string[]; kind: RepairKind | null }> = {
  '"': { close: ['"'], kind: null },
  "'": { close: ["'"], kind: "single-quotes" },
  "“": { close: ["”", "“"], kind: "curly-quotes" },
  "‘": { close: ["’", "‘"], kind: "curly-quotes" },
};

/**
 * Fixes common near-JSON mistakes (JavaScript object literals, Python dicts,
 * text pasted from documents). It works on a single pass that tracks whether
 * it is inside a string, so text inside strings is never rewritten except to
 * escape it correctly. The result still needs validating.
 */
export function repairJson(input: string): RepairResult {
  const repairs = new Set<RepairKind>();
  const out: string[] = [];
  const text = input.replace(/^\uFEFF/, "");
  let index = 0;

  /** Index of the next character that is not whitespace or a comment. */
  const skipInsignificant = (from: number): number => {
    let position = from;
    while (position < text.length) {
      const char = text[position]!;
      if (/\s/.test(char)) {
        position++;
      } else if (char === "/" && text[position + 1] === "/") {
        const end = text.indexOf("\n", position);
        position = end === -1 ? text.length : end;
      } else if (char === "/" && text[position + 1] === "*") {
        const end = text.indexOf("*/", position + 2);
        position = end === -1 ? text.length : end + 2;
      } else {
        break;
      }
    }
    return position;
  };

  while (index < text.length) {
    const char = text[index]!;

    // Comments
    if (char === "/" && (text[index + 1] === "/" || text[index + 1] === "*")) {
      const end =
        text[index + 1] === "/" ? text.indexOf("\n", index) : text.indexOf("*/", index + 2);
      index = end === -1 ? text.length : text[index + 1] === "/" ? end : end + 2;
      repairs.add("comments");
      continue;
    }

    // Strings, with any supported quote style
    const quote = QUOTE_PAIRS[char];
    if (quote) {
      if (quote.kind) repairs.add(quote.kind);
      let position = index + 1;
      let content = "";
      let closed = false;
      while (position < text.length) {
        const inner = text[position]!;
        if (quote.close.includes(inner)) {
          closed = true;
          break;
        }
        if (inner === "\\") {
          const escaped = text[position + 1] ?? "";
          // \' is only meaningful in single-quoted strings; JSON doesn't allow it.
          content += escaped === "'" ? "'" : `\\${escaped}`;
          position += 2;
          continue;
        }
        if (inner === '"' && char !== '"') {
          content += '\\"';
        } else if (ESCAPED_CONTROL[inner]) {
          repairs.add("raw-control-characters");
          content += ESCAPED_CONTROL[inner];
        } else {
          content += inner;
        }
        position++;
      }
      if (!closed) {
        // Leave an unterminated string untouched for the validator to report.
        out.push(text.slice(index));
        break;
      }
      out.push(`"${content}"`);
      index = position + 1;
      continue;
    }

    // Trailing commas
    if (char === ",") {
      const next = text[skipInsignificant(index + 1)];
      if (next === "}" || next === "]") {
        repairs.add("trailing-commas");
        index++;
        continue;
      }
    }

    // Bare words: unquoted keys and Python literals
    if (IDENTIFIER_START.test(char)) {
      let end = index + 1;
      while (end < text.length && IDENTIFIER_PART.test(text[end]!)) end++;
      const word = text.slice(index, end);
      const isKey = text[skipInsignificant(end)] === ":";
      if (isKey) {
        repairs.add("unquoted-keys");
        out.push(`"${word}"`);
      } else if (PYTHON_LITERALS[word]) {
        repairs.add("python-literals");
        out.push(PYTHON_LITERALS[word]);
      } else {
        out.push(word);
      }
      index = end;
      continue;
    }

    out.push(char);
    index++;
  }

  const order = Object.keys(REPAIR_LABELS) as RepairKind[];
  return { text: out.join(""), repairs: order.filter((kind) => repairs.has(kind)) };
}

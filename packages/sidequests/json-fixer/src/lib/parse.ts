import { locate } from "./location";

export type TokenType = "{" | "}" | "[" | "]" | ":" | "," | "string" | "number" | "literal";

export interface Token {
  type: TokenType;
  /** Exact source text, so numbers and escapes are preserved when reformatting. */
  text: string;
  offset: number;
}

export interface JsonError {
  message: string;
  offset: number;
  line: number;
  column: number;
}

export type RootKind = "object" | "array" | "string" | "number" | "boolean" | "null";

export interface JsonSummary {
  root: RootKind;
  /** Keys for an object root, items for an array root. */
  size: number;
  depth: number;
}

export type ParseResult =
  { ok: true; tokens: Token[]; summary: JsonSummary } | { ok: false; error: JsonError };

class JsonSyntaxError extends Error {
  constructor(
    message: string,
    readonly offset: number,
  ) {
    super(message);
  }
}

const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;
const WORD = /[A-Za-z_$][\w$]*/y;
const VALID_ESCAPES = new Set(['"', "\\", "/", "b", "f", "n", "r", "t"]);

function isWhitespace(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

/** Characters that are invisible or look like a plain space but aren't valid JSON whitespace. */
const INVISIBLE_NAMES: Record<string, string> = {
  "\uFEFF": "an invisible byte order mark (U+FEFF)",
  "\u00A0": "a non-breaking space (U+00A0)",
  "\u200B": "an invisible zero-width space (U+200B)",
};

function describe(char: string): string {
  if (char === "\n") return "a line break";
  const named = INVISIBLE_NAMES[char];
  if (named) return named;
  if (/\s/.test(char) || char.charCodeAt(0) < 0x20) {
    return `an unusual space or control character (U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")})`;
  }
  return `“${char}”`;
}

/** Splits text into JSON tokens, reporting the first lexical problem. */
function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < text.length) {
    const char = text[index]!;
    if (isWhitespace(char)) {
      index++;
      continue;
    }
    const start = index;

    if ("{}[]:,".includes(char)) {
      tokens.push({ type: char as TokenType, text: char, offset: start });
      index++;
      continue;
    }

    if (char === '"') {
      index++;
      for (;;) {
        if (index >= text.length) throw new JsonSyntaxError("This string is never closed.", start);
        const inner = text[index]!;
        if (inner === '"') break;
        if (inner === "\\") {
          const escape = text[index + 1] ?? "";
          if (escape === "u") {
            if (!/^[0-9a-fA-F]{4}$/.test(text.slice(index + 2, index + 6))) {
              throw new JsonSyntaxError("“\\u” must be followed by four hex digits.", index);
            }
            index += 6;
            continue;
          }
          if (!VALID_ESCAPES.has(escape)) {
            throw new JsonSyntaxError(`“\\${escape}” is not a valid escape sequence.`, index);
          }
          index += 2;
          continue;
        }
        if (inner.charCodeAt(0) < 0x20) {
          throw new JsonSyntaxError(
            inner === "\n"
              ? "Strings can't contain raw line breaks. Use \\n instead."
              : "Strings can't contain raw control characters such as tabs. Escape them (e.g. \\t).",
            index,
          );
        }
        index++;
      }
      index++;
      tokens.push({ type: "string", text: text.slice(start, index), offset: start });
      continue;
    }

    if (char === "-" || (char >= "0" && char <= "9")) {
      NUMBER.lastIndex = index;
      const match = NUMBER.exec(text);
      const end = match ? index + match[0].length : index;
      const next = text[end];
      if (!match || (next !== undefined && /[\w.+-]/.test(next))) {
        throw new JsonSyntaxError(
          "This is not a valid number. JSON numbers have no leading zeros, hex, or trailing dots.",
          start,
        );
      }
      tokens.push({ type: "number", text: match[0], offset: start });
      index = end;
      continue;
    }

    if (char === "'" || char === "‘" || char === "’" || char === "“" || char === "”") {
      throw new JsonSyntaxError('JSON strings must use straight double quotes (").', start);
    }
    if (char === "/" && (text[index + 1] === "/" || text[index + 1] === "*")) {
      throw new JsonSyntaxError("Comments are not allowed in JSON.", start);
    }

    WORD.lastIndex = index;
    const word = WORD.exec(text)?.[0];
    if (word === "true" || word === "false" || word === "null") {
      tokens.push({ type: "literal", text: word, offset: start });
      index += word.length;
      continue;
    }
    if (word) {
      const hint =
        word === "True" || word === "False" || word === "None"
          ? ` JSON uses lowercase true, false and null.`
          : word === "undefined" || word === "NaN" || word === "Infinity"
            ? " JSON has no such value; use null or a string."
            : " Text must be wrapped in double quotes.";
      throw new JsonSyntaxError(`Unexpected word “${word}”.${hint}`, start);
    }

    throw new JsonSyntaxError(`Unexpected character ${describe(char)}.`, start);
  }

  return tokens;
}

interface OpenContainer {
  type: "object" | "array";
  offset: number;
  size: number;
}

type Expect = "value" | "key-or-end" | "key" | "colon" | "comma-or-end" | "done";

const CLOSERS = { object: "}", array: "]" } as const;

/** Checks the token sequence against the JSON grammar without recursion. */
function checkGrammar(text: string, tokens: Token[]): JsonSummary {
  const stack: OpenContainer[] = [];
  let expect: Expect = "value";
  let depth = 0;
  let root: RootKind | null = null;
  let rootSize = 0;

  const afterValue = (): Expect => (stack.length === 0 ? "done" : "comma-or-end");

  for (const token of tokens) {
    const top = stack.at(-1);

    switch (expect) {
      case "done":
        throw new JsonSyntaxError(
          "Unexpected content after the end of the JSON. Is a comma or bracket missing?",
          token.offset,
        );

      case "value":
      case "key-or-end":
      case "key": {
        if (expect !== "value") {
          if (token.type === "}" && expect === "key-or-end") {
            stack.pop();
            expect = afterValue();
            break;
          }
          if (token.type === "}")
            throw new JsonSyntaxError("Trailing comma before “}”.", token.offset);
          if (token.type !== "string") {
            throw new JsonSyntaxError(
              "Property names must be strings in double quotes.",
              token.offset,
            );
          }
          top!.size++;
          expect = "colon";
          break;
        }
        if (token.type === "]" && top?.type === "array" && top.size === 0) {
          stack.pop();
          expect = afterValue();
          break;
        }
        if (token.type === "]" && top?.type === "array") {
          throw new JsonSyntaxError("Trailing comma before “]”.", token.offset);
        }
        if (token.type === "{" || token.type === "[") {
          if (top) top.size += top.type === "array" ? 1 : 0;
          const type = token.type === "{" ? "object" : "array";
          root ??= type;
          stack.push({ type, offset: token.offset, size: 0 });
          depth = Math.max(depth, stack.length);
          expect = type === "object" ? "key-or-end" : "value";
          break;
        }
        if (token.type === "string" || token.type === "number" || token.type === "literal") {
          if (top?.type === "array") top.size++;
          root ??=
            token.type === "literal" ? (token.text === "null" ? "null" : "boolean") : token.type;
          expect = afterValue();
          break;
        }
        throw new JsonSyntaxError(`Expected a value but found “${token.text}”.`, token.offset);
      }

      case "colon":
        if (token.type !== ":") {
          throw new JsonSyntaxError("Expected “:” after the property name.", token.offset);
        }
        expect = "value";
        break;

      case "comma-or-end":
        if (token.type === ",") {
          expect = top!.type === "object" ? "key" : "value";
          break;
        }
        if (token.type === CLOSERS[top!.type]) {
          stack.pop();
          if (stack.length === 0) rootSize = top!.size;
          expect = afterValue();
          break;
        }
        if (token.type === "}" || token.type === "]") {
          throw new JsonSyntaxError(
            `Mismatched bracket: “${token.text}” closes a${top!.type === "array" ? "n array" : "n object"} that should end with “${CLOSERS[top!.type]}”.`,
            token.offset,
          );
        }
        throw new JsonSyntaxError(
          top!.type === "object"
            ? "Missing comma between properties."
            : "Missing comma between items.",
          token.offset,
        );
    }
  }

  if (tokens.length === 0) throw new JsonSyntaxError("There's no JSON here yet.", 0);

  // Point just after the last real content, not at trailing blank lines.
  const end = text.trimEnd().length;
  const unclosed = stack.at(-1);
  if (unclosed) {
    const opened = locate(text, unclosed.offset);
    throw new JsonSyntaxError(
      `Unexpected end of input: the ${unclosed.type} opened on line ${opened.line} is missing its closing “${CLOSERS[unclosed.type]}”.`,
      end,
    );
  }
  if (expect !== "done") throw new JsonSyntaxError("Unexpected end of input.", end);

  return { root: root!, size: rootSize, depth };
}

/** Validates JSON text and returns its tokens, or the first error with its location. */
export function parseJson(text: string): ParseResult {
  try {
    const tokens = tokenize(text);
    const summary = checkGrammar(text, tokens);
    return { ok: true, tokens, summary };
  } catch (error) {
    if (!(error instanceof JsonSyntaxError)) throw error;
    return {
      ok: false,
      error: { message: error.message, offset: error.offset, ...locate(text, error.offset) },
    };
  }
}

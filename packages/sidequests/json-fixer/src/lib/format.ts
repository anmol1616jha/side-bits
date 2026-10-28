import type { IndentStyle } from "../constants";
import type { Token } from "./parse";

const INDENTS: Record<Exclude<IndentStyle, "minify">, string> = {
  "2": "  ",
  "4": "    ",
  tab: "\t",
};

/**
 * Re-emits validated tokens with new whitespace. Token text is copied as-is,
 * so large numbers, number formatting and string escapes are never altered.
 */
export function formatTokens(tokens: Token[], style: IndentStyle): string {
  if (style === "minify") return tokens.map((token) => token.text).join("");

  const unit = INDENTS[style];
  const parts: string[] = [];
  let level = 0;
  const newline = () => `\n${unit.repeat(level)}`;

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]!;
    switch (token.type) {
      case "{":
      case "[": {
        const next = tokens[index + 1];
        if (next && (next.type === "}" || next.type === "]")) {
          parts.push(token.text, next.text);
          index++;
          break;
        }
        level++;
        parts.push(token.text, newline());
        break;
      }
      case "}":
      case "]":
        level--;
        parts.push(newline(), token.text);
        break;
      case ",":
        parts.push(",", newline());
        break;
      case ":":
        parts.push(": ");
        break;
      default:
        parts.push(token.text);
    }
  }

  return parts.join("");
}

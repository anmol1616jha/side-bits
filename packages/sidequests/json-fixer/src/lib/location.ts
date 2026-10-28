export interface TextLocation {
  /** 1-based line number. */
  line: number;
  /** 1-based column, in UTF-16 code units. */
  column: number;
}

export function locate(text: string, offset: number): TextLocation {
  let line = 1;
  let lineStart = 0;
  for (let index = 0; index < offset && index < text.length; index++) {
    if (text.charCodeAt(index) === 10) {
      line++;
      lineStart = index + 1;
    }
  }
  return { line, column: offset - lineStart + 1 };
}

export interface Snippet {
  text: string;
  /** Position of the error within `text`, for drawing a caret. */
  caret: number;
}

/** The line containing `offset`, clipped to `radius` characters either side. */
export function snippetAround(text: string, offset: number, radius: number): Snippet {
  const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
  const newline = text.indexOf("\n", offset);
  const lineEnd = newline === -1 ? text.length : newline;
  const start = Math.max(lineStart, offset - radius);
  const end = Math.min(lineEnd, offset + radius + 1);
  const prefix = start > lineStart ? "…" : "";
  const suffix = end < lineEnd ? "…" : "";
  return {
    text: `${prefix}${text.slice(start, end).replace(/\t/g, " ")}${suffix}`,
    caret: prefix.length + offset - start,
  };
}

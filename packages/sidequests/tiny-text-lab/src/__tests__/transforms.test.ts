import { describe, expect, it } from "vitest";
import { TRANSFORMS } from "../lib/transforms";

const run = (id: string, text: string) =>
  TRANSFORMS.find((transform) => transform.id === id)!.apply(text);

describe("case transforms", () => {
  it("upper and lower case", () => {
    expect(run("upper", "Hello, wörld")).toBe("HELLO, WÖRLD");
    expect(run("lower", "Hello, WÖRLD")).toBe("hello, wörld");
  });

  it("title case keeps small words lowercase except at the start", () => {
    expect(run("title", "THE lord OF the rings")).toBe("The Lord of the Rings");
    expect(run("title", "don't stop\nof mice and men")).toBe("Don't Stop\nOf Mice and Men");
  });

  it("sentence case capitalises sentence starts and the pronoun I", () => {
    expect(run("sentence", "HELLO THERE. i think SO! what?\nnew line")).toBe(
      "Hello there. I think so! What?\nNew line",
    );
    expect(run("sentence", "it's mine, i'm sure")).toBe("It's mine, I'm sure");
  });

  it("converts to camel, snake and kebab case per line", () => {
    const text = "Hello world again\nparseHTTPResponse code\nalready_snake-case";
    expect(run("camel", text)).toBe("helloWorldAgain\nparseHttpResponseCode\nalreadySnakeCase");
    expect(run("snake", text)).toBe(
      "hello_world_again\nparse_http_response_code\nalready_snake_case",
    );
    expect(run("kebab", text)).toBe(
      "hello-world-again\nparse-http-response-code\nalready-snake-case",
    );
  });
});

describe("whitespace transforms", () => {
  it("trims each line", () => {
    expect(run("trim-lines", "  a  \n\tb\t")).toBe("a\nb");
  });

  it("collapses repeated spaces but keeps line breaks", () => {
    expect(run("collapse-spaces", "a   b \t c\n\nd")).toBe("a b c\n\nd");
  });

  it("removes extra blank lines and leading/trailing blanks", () => {
    expect(run("remove-blank-lines", "\n\na\n\n\n  \nb\n\n")).toBe("a\n\nb");
  });
});

describe("line transforms", () => {
  it("joins lines into one", () => {
    expect(run("join-lines", " a \n\n b\r\nc ")).toBe("a b c");
  });

  it("sorts lines naturally and case-insensitively", () => {
    expect(run("sort-lines", "item 10\nItem 2\napple\nBanana")).toBe(
      "apple\nBanana\nItem 2\nitem 10",
    );
  });

  it("removes duplicate lines, keeping the first", () => {
    expect(run("dedupe-lines", "a\nb\na\nc\nb")).toBe("a\nb\nc");
  });

  it("normalises Windows line endings", () => {
    expect(run("trim-lines", "a \r\nb ")).toBe("a\nb");
  });
});

describe("all transforms", () => {
  it.each(TRANSFORMS.map((transform) => [transform.id, transform] as const))(
    "%s leaves empty text empty",
    (_id, transform) => {
      expect(transform.apply("")).toBe("");
    },
  );
});

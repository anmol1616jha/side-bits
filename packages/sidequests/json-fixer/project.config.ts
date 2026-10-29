import type { ProjectMetadata } from "@side-bits/project-contract";

const metadata = {
  slug: "json-fixer",
  title: "JSON Fixer",
  description:
    "Paste messy JSON. Get it validated, tidied and ready to copy, without it leaving your browser.",
  summary:
    "JSON Fixer checks whether text is valid JSON and explains exactly where it breaks. It can repair common mistakes such as trailing commas, comments and single quotes, then reformat or minify the result without altering any values.",
  instructions: [
    "Paste or type JSON into the input box.",
    "Fix any error it points out, or apply the suggested automatic fixes.",
    "Choose an indentation style, or minify it.",
    "Copy the result.",
  ],
  dataHandling: "Everything runs in your browser. Nothing you paste is sent anywhere or stored.",
  tags: ["json", "formatter", "developer-tools"],
  collectionSlugs: ["actually-useful"],
  status: "live",
  featured: false,
  createdAt: "2026-10-27",
  updatedAt: "2026-10-27",
  preview: {
    kind: "illustration",
    alt: "Curly braces around neatly indented lines of code.",
  },
} satisfies ProjectMetadata;

export default metadata;

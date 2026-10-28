# JSON Fixer

JSON Fixer checks whether text is valid JSON, points to where it breaks, and reformats it with consistent indentation or minifies it to a single line.

Package: `@side-bits/sidequest-json-fixer` · Route: `/projects/json-fixer`

## Entry points

| Import                                           | Contents                                  |
| ------------------------------------------------ | ----------------------------------------- |
| `@side-bits/sidequest-json-fixer`                | `JsonFixerApp`, the interactive app       |
| `@side-bits/sidequest-json-fixer/project.config` | Registry metadata (plain data)            |
| `@side-bits/sidequest-json-fixer/preview`        | `JsonFixerPreview`, the card illustration |

## Local development

Run the whole site with `pnpm dev` from the repository root and open `/projects/json-fixer`.

```sh
pnpm --filter @side-bits/sidequest-json-fixer test
pnpm --filter @side-bits/sidequest-json-fixer typecheck
```

## How it works

- `src/lib/parse.ts`: a small validating tokenizer and grammar check. It reports precise, human-readable errors with line and column, consistently across browsers, and handles deep nesting without recursion.
- `src/lib/format.ts`: re-indents or minifies the validated tokens. Token text is copied verbatim, so large numbers (beyond JavaScript's safe integer range), number formatting such as `1.0`, and string escapes are never changed. This is why the tool does not use `JSON.stringify(JSON.parse(...))`.
- `src/lib/repair.ts`: optional automatic fixes for comments, trailing commas, single or curly quotes, unquoted keys, Python `True`/`False`/`None` and raw line breaks in strings. Text inside strings is never rewritten. Fixes are only offered when the result is valid, and can be undone.
- Input is capped at 1,000,000 characters (`src/constants.ts`).

## Dependencies

- `@side-bits/ui` for shared components and design tokens.
- `@side-bits/project-contract` for the `ProjectMetadata` type.
- `lucide-react` for icons.
- React and React DOM (peer dependencies, provided by the host app).

No network access, environment variables or secrets.

## Extracting into a standalone app

1. Copy this folder to a new repository.
2. Install React and the declared dependencies.
3. Replace `@side-bits/ui` and `@side-bits/project-contract` imports with published packages or a small local adapter (buttons, tokens CSS, `ProjectMetadata` type).
4. Add a page that renders `JsonFixerApp` with its own layout, and import the tokens stylesheet.
5. Run the tests and build.
6. Configure its own deployment.
7. Only once that deployment is live, update the main registry to link to it.

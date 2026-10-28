import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Package boundaries from the implementation spec (section 4.7). Enforced here
 * so a violation fails `pnpm lint` rather than relying on review.
 */
const noDeepPackageImports = {
  group: ["@side-bits/*/src/*", "@side-bits/*/src"],
  message: "Import from the package's public entry point, not its src folder.",
};

const boundaryRules = [
  {
    files: ["packages/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            noDeepPackageImports,
            {
              group: ["@side-bits/web", "@side-bits/web/*", "@side-bits/sidequest-*"],
              message: "The shared UI package must not depend on the app or on sidequests.",
            },
            {
              group: ["next", "next/*"],
              message: "Keep @side-bits/ui framework-agnostic so sidequests stay extractable.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/project-contract/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            noDeepPackageImports,
            {
              group: ["@side-bits/*", "!@side-bits/project-contract"],
              message: "The project contract must not depend on other workspace packages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/sidequests/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            noDeepPackageImports,
            {
              group: ["@side-bits/sidequest-*", "@side-bits/web", "@side-bits/web/*"],
              message: "Sidequests may only import @side-bits/ui and @side-bits/project-contract.",
            },
            {
              group: ["next", "next/*"],
              message: "Sidequests must not depend on Next.js so they can be extracted later.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["apps/web/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [noDeepPackageImports] }],
    },
  },
];

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/coverage/**",
      "**/next-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    linterOptions: { reportUnusedDisableDirectives: "error" },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      next: { rootDir: "apps/web/" },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-ignore": true, "ts-expect-error": "allow-with-description" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["scripts/**"],
    rules: { "no-console": "off" },
  },
  ...boundaryRules,
);

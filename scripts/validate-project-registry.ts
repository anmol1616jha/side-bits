/**
 * Validates the project registry and each sidequest package's shape.
 * Run with `pnpm validate:projects` (Node strips the types; no build step).
 *
 * Import-level boundaries (no cross-sidequest or app imports) are enforced by
 * ESLint; this script checks what ESLint cannot see: folder structure, package
 * manifests, registration in the app, and the metadata itself.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { collections } from "../apps/web/src/content/collections.ts";
import { validateRegistry } from "../packages/project-contract/src/index.ts";
import type { ProjectMetadata } from "../packages/project-contract/src/index.ts";

const root = join(import.meta.dirname, "..");
const sidequestsDir = join(root, "packages/sidequests");
const webDir = join(root, "apps/web");

const REQUIRED_FILES = ["package.json", "project.config.ts", "README.md", "src/index.ts"];
const FORBIDDEN_DEPENDENCIES = ["next", "@side-bits/web"];

interface PackageManifest {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

/** Source without comments, so a commented-out import doesn't count as registered. */
function readCode(path: string): string {
  return readFileSync(path, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

const errors: string[] = [];
const projects: ProjectMetadata[] = [];

const webManifest = readJson<PackageManifest>(join(webDir, "package.json"));
const registrySource = readCode(join(webDir, "src/lib/registry.ts"));
const appsSource = readCode(join(webDir, "src/lib/project-apps.ts"));

const folders = readdirSync(sidequestsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const folder of folders) {
  const dir = join(sidequestsDir, folder);
  const at = `packages/sidequests/${folder}`;
  const expectedName = `@side-bits/sidequest-${folder}`;

  const missing = REQUIRED_FILES.filter((file) => !existsSync(join(dir, file)));
  if (missing.length > 0) {
    errors.push(`${at}: missing ${missing.join(", ")}.`);
    continue;
  }

  const manifest = readJson<PackageManifest>(join(dir, "package.json"));
  if (manifest.name !== expectedName) {
    errors.push(`${at}: package name should be "${expectedName}", found "${manifest.name}".`);
  }
  const allDependencies = Object.keys({
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.peerDependencies,
  });
  for (const dependency of allDependencies) {
    if (dependency.startsWith("@side-bits/sidequest-")) {
      errors.push(`${at}: must not depend on another sidequest (${dependency}).`);
    }
    if (FORBIDDEN_DEPENDENCIES.includes(dependency)) {
      errors.push(`${at}: must not depend on ${dependency}.`);
    }
  }
  for (const dependency of ["react", "react-dom"]) {
    if (manifest.dependencies?.[dependency]) {
      errors.push(`${at}: ${dependency} must be a peer dependency so only one copy is installed.`);
    }
  }

  const config = (await import(pathToFileURL(join(dir, "project.config.ts")).href)) as {
    default?: ProjectMetadata;
  };
  if (!config.default) {
    errors.push(`${at}: project.config.ts must default-export the project metadata.`);
    continue;
  }
  if (config.default.slug !== folder) {
    errors.push(`${at}: slug "${config.default.slug}" must match the folder name.`);
  }
  projects.push(config.default);

  if (!webManifest.dependencies?.[expectedName]) {
    errors.push(`${at}: not listed in apps/web/package.json dependencies.`);
  }
  if (!registrySource.includes(`"${expectedName}/project.config"`)) {
    errors.push(`${at}: not registered in apps/web/src/lib/registry.ts.`);
  }
  if (!appsSource.includes(`import("${expectedName}")`)) {
    errors.push(`${at}: no app loader in apps/web/src/lib/project-apps.ts.`);
  }
}

errors.push(...validateRegistry(projects, collections));

if (errors.length > 0) {
  console.error(`Project registry has ${errors.length} problem(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Project registry OK: ${projects.length} projects, ${collections.length} collections.`);

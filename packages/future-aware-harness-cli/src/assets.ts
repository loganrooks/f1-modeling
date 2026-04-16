import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  pathExists,
  readJsonFile,
  readTextFile,
  sha256File,
} from "./shared.js";
import type {
  ProjectManifest,
  RuntimeManifest,
} from "./types.js";

interface LegacyRuntimeManifest {
  manifest_version: number;
  name: string;
  created_at?: string;
  runtime_root_default: string;
  receipt_dirname: string;
  stage?: string;
  targets: Array<{
    relative_path: string;
    role: string;
    expected_upstream_sha256: string;
    overlay_sha256: string;
  }>;
}

export interface RuntimeAssets {
  manifest: RuntimeManifest;
  manifestPath: string;
  overlayRoot: string;
}

export interface ProjectAssets {
  manifest: ProjectManifest;
  manifestPath: string;
  templatesRoot: string;
}

function resolvePackageRoot(): string {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(moduleDir, "..");
}

function resolveRepoRoot(packageRoot: string): string {
  return path.resolve(packageRoot, "..", "..");
}

async function packageVersion(packageRoot: string): Promise<string> {
  const packageJson = await readJsonFile<{ version: string }>(
    path.join(packageRoot, "package.json"),
  );
  return packageJson.version;
}

function normalizeLegacyRuntimeManifest(
  legacy: LegacyRuntimeManifest,
  frameworkVersion: string,
): RuntimeManifest {
  return {
    manifestVersion: legacy.manifest_version,
    frameworkName: legacy.name,
    frameworkVersion,
    createdAt: legacy.created_at,
    runtimeRootDefault: legacy.runtime_root_default,
    receiptDirname: ".future-aware-harness",
    legacyReceiptDirnames: [legacy.receipt_dirname],
    compatibilityProfiles: [
      {
        id: legacy.stage ?? "legacy-profile",
        label: legacy.stage ?? "legacy profile",
        targets: legacy.targets.map((target) => ({
          relativePath: target.relative_path,
          role: target.role,
          expectedUpstreamSha256: target.expected_upstream_sha256,
          overlaySha256: target.overlay_sha256,
        })),
      },
    ],
  };
}

export async function loadRuntimeAssets(): Promise<RuntimeAssets> {
  const packageRoot = resolvePackageRoot();
  const generatedManifestPath = path.join(
    packageRoot,
    "generated-assets",
    "runtime",
    "manifest.json",
  );

  if (await pathExists(generatedManifestPath)) {
    const manifest = await readJsonFile<RuntimeManifest>(generatedManifestPath);
    return {
      manifest,
      manifestPath: generatedManifestPath,
      overlayRoot: path.join(
        packageRoot,
        "generated-assets",
        "runtime",
        "overlay",
        "get-shit-done-reflect",
      ),
    };
  }

  const repoRoot = resolveRepoRoot(packageRoot);
  const sourceManifestPath = path.join(
    repoRoot,
    "tooling",
    "future-aware-harness",
    "manifest.json",
  );
  const frameworkVersion = await packageVersion(packageRoot);
  const legacyManifest =
    await readJsonFile<LegacyRuntimeManifest>(sourceManifestPath);

  return {
    manifest: normalizeLegacyRuntimeManifest(legacyManifest, frameworkVersion),
    manifestPath: sourceManifestPath,
    overlayRoot: path.join(
      repoRoot,
      "tooling",
      "future-aware-harness",
      "overlay",
      "get-shit-done-reflect",
    ),
  };
}

export async function loadProjectAssets(): Promise<ProjectAssets> {
  const packageRoot = resolvePackageRoot();
  const manifestPath = path.join(packageRoot, "assets", "project", "manifest.json");
  return {
    manifest: await readJsonFile<ProjectManifest>(manifestPath),
    manifestPath,
    templatesRoot: path.join(packageRoot, "assets", "project", "templates"),
  };
}

export async function loadProjectTemplate(templateName: string): Promise<string> {
  const projectAssets = await loadProjectAssets();
  return readTextFile(path.join(projectAssets.templatesRoot, templateName));
}

export async function manifestHash(manifestPath: string): Promise<string> {
  return sha256File(manifestPath);
}

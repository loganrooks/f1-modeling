import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { sha256File, writeJsonFile } from "./shared.js";
import type { RuntimeManifest } from "./types.js";

interface LegacyRuntimeManifest {
  manifest_version: number;
  name: string;
  stage?: string;
  created_at?: string;
  runtime_root_default: string;
  receipt_dirname: string;
  targets: Array<{
    relative_path: string;
    role: string;
    expected_upstream_sha256: string;
    overlay_sha256: string;
  }>;
}

async function copyDirectory(sourceDir: string, destinationDir: string): Promise<void> {
  await fs.mkdir(destinationDir, { recursive: true });
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await fs.mkdir(path.dirname(destinationPath), { recursive: true });
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

function packageRoot(): string {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(moduleDir, "..");
}

async function main(): Promise<void> {
  const root = packageRoot();
  const repoRoot = path.resolve(root, "..", "..");
  const packageJson = JSON.parse(
    await fs.readFile(path.join(root, "package.json"), "utf8"),
  ) as { version: string };
  const sourceManifestPath = path.join(
    repoRoot,
    "tooling",
    "future-aware-harness",
    "manifest.json",
  );
  const legacyManifest = JSON.parse(
    await fs.readFile(sourceManifestPath, "utf8"),
  ) as LegacyRuntimeManifest;
  const overlaySource = path.join(
    repoRoot,
    "tooling",
    "future-aware-harness",
    "overlay",
    "get-shit-done-reflect",
  );
  const generatedRoot = path.join(root, "generated-assets", "runtime");
  const overlayDestination = path.join(
    generatedRoot,
    "overlay",
    "get-shit-done-reflect",
  );

  await fs.rm(generatedRoot, { recursive: true, force: true });
  await copyDirectory(overlaySource, overlayDestination);

  const manifest: RuntimeManifest = {
    manifestVersion: legacyManifest.manifest_version,
    frameworkName: legacyManifest.name,
    frameworkVersion: packageJson.version,
    createdAt: legacyManifest.created_at,
    runtimeRootDefault: legacyManifest.runtime_root_default,
    receiptDirname: ".future-aware-harness",
    legacyReceiptDirnames: [legacyManifest.receipt_dirname],
    compatibilityProfiles: [
      {
        id: legacyManifest.stage ?? "legacy-profile",
        label: legacyManifest.stage ?? "legacy profile",
        targets: await Promise.all(
          legacyManifest.targets.map(async (target) => {
            const overlayPath = path.join(overlayDestination, target.relative_path);
            const overlaySha = await sha256File(overlayPath);
            if (overlaySha !== target.overlay_sha256) {
              throw new Error(
                `Overlay hash mismatch while syncing ${target.relative_path}`,
              );
            }

            return {
              relativePath: target.relative_path,
              role: target.role,
              expectedUpstreamSha256: target.expected_upstream_sha256,
              overlaySha256: target.overlay_sha256,
            };
          }),
        ),
      },
    ],
  };

  await writeJsonFile(path.join(generatedRoot, "manifest.json"), manifest);
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown runtime asset sync failure";
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
});

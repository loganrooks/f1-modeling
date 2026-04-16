import path from "node:path";

import { loadRuntimeAssets, manifestHash } from "./assets.js";
import {
  compactTimestamp,
  copyFileEnsureDir,
  ensureDir,
  expandHome,
  isoTimestamp,
  pathExists,
  readJsonFile,
  sha256File,
  writeJsonFile,
} from "./shared.js";
import type {
  RuntimeInspection,
  RuntimeManifest,
  RuntimePlan,
  RuntimePlanRow,
  RuntimeReceipt,
  VerifyResult,
} from "./types.js";

interface RuntimeOptions {
  runtimeRoot?: string | undefined;
  dryRun?: boolean | undefined;
}

function resolveRuntimeRoot(
  manifest: RuntimeManifest,
  override?: string,
): string {
  return expandHome(
    override ?? process.env.GSDR_RUNTIME_ROOT ?? manifest.runtimeRootDefault,
  );
}

async function resolveReceiptRoot(
  runtimeRoot: string,
  manifest: RuntimeManifest,
): Promise<string> {
  const preferred = path.join(runtimeRoot, manifest.receiptDirname);
  if (await pathExists(preferred)) {
    return preferred;
  }

  for (const legacy of manifest.legacyReceiptDirnames) {
    const legacyPath = path.join(runtimeRoot, legacy);
    if (await pathExists(legacyPath)) {
      return legacyPath;
    }
  }

  return preferred;
}

async function loadStableReceipt(
  stableReceiptPath: string,
): Promise<RuntimeReceipt | null> {
  if (!(await pathExists(stableReceiptPath))) {
    return null;
  }
  return readJsonFile<RuntimeReceipt>(stableReceiptPath);
}

async function resolveExistingBackupDir(
  stableReceiptPath: string,
  receiptsDir: string,
): Promise<string | null> {
  const stableReceipt = await loadStableReceipt(stableReceiptPath);
  if (stableReceipt?.backupDir) {
    return stableReceipt.backupDir;
  }

  if (!(await pathExists(receiptsDir))) {
    return null;
  }

  const files = (await import("node:fs/promises")).readdir(receiptsDir);
  const receiptFiles = (await files)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .reverse();

  for (const file of receiptFiles) {
    const receipt = await readJsonFile<RuntimeReceipt>(path.join(receiptsDir, file));
    if (receipt.backupDir) {
      return receipt.backupDir;
    }
  }

  return null;
}

function blockedReasonForState(state: RuntimeInspection["state"]): string | null {
  switch (state) {
    case "drift":
      return "Runtime drift detected. One or more files no longer match reviewed upstream or installed overlay hashes.";
    case "missing_runtime_root":
      return "Runtime root does not exist.";
    case "missing_targets":
      return "Runtime target files are missing.";
    default:
      return null;
  }
}

export async function inspectRuntime(
  options: RuntimeOptions = {},
): Promise<RuntimeInspection> {
  const assets = await loadRuntimeAssets();
  const manifest = assets.manifest;
  const runtimeRoot = resolveRuntimeRoot(manifest, options.runtimeRoot);
  const receiptRoot = await resolveReceiptRoot(runtimeRoot, manifest);
  const stableReceiptPath = path.join(receiptRoot, "install-receipt.json");
  const profile = manifest.compatibilityProfiles[0];
  if (!profile) {
    throw new Error("Runtime manifest has no compatibility profiles.");
  }

  const manifestSha = await manifestHash(assets.manifestPath);

  if (!(await pathExists(runtimeRoot))) {
    return {
      runtimeRoot,
      receiptRoot,
      stableReceiptPath,
      manifestHash: manifestSha,
      manifest,
      profile,
      state: "missing_runtime_root",
      recommendedAction: "manual-review",
      targets: [],
    };
  }

  const targets = [];
  for (const target of profile.targets) {
    const overlayPath = path.join(assets.overlayRoot, target.relativePath);
    if (!(await pathExists(overlayPath))) {
      throw new Error(`Overlay file missing: ${overlayPath}`);
    }

    const overlayHash = await sha256File(overlayPath);
    if (overlayHash !== target.overlaySha256) {
      throw new Error(`Overlay hash mismatch for ${target.relativePath}`);
    }

    const runtimePath = path.join(runtimeRoot, target.relativePath);
    let currentHash: string | null = null;
    let status: RuntimeInspection["targets"][number]["status"] = "missing";
    if (await pathExists(runtimePath)) {
      currentHash = await sha256File(runtimePath);
      if (currentHash === target.overlaySha256) {
        status = "overlay";
      } else if (currentHash === target.expectedUpstreamSha256) {
        status = "upstream";
      } else {
        status = "drift";
      }
    }

    targets.push({
      ...target,
      overlayPath,
      runtimePath,
      currentHash,
      status,
    });
  }

  let state: RuntimeInspection["state"] = "overlay_current";
  if (targets.some((target) => target.status === "missing")) {
    state = "missing_targets";
  } else if (targets.some((target) => target.status === "drift")) {
    state = "drift";
  } else if (targets.every((target) => target.status === "overlay")) {
    state = "overlay_current";
  } else if (targets.every((target) => target.status === "upstream")) {
    state = "upstream_current";
  } else {
    state = "mixed";
  }

  const recommendedAction =
    state === "overlay_current"
      ? "none"
      : state === "upstream_current"
        ? "install-runtime"
        : state === "mixed"
          ? "upgrade-runtime"
          : "manual-review";

  return {
    runtimeRoot,
    receiptRoot,
    stableReceiptPath,
    manifestHash: manifestSha,
    manifest,
    profile,
    state,
    recommendedAction,
    targets,
  };
}

export async function planRuntimeReconcile(
  mode: "install" | "upgrade",
  options: RuntimeOptions = {},
): Promise<RuntimePlan> {
  const inspection = await inspectRuntime(options);
  const blockedReason = blockedReasonForState(inspection.state);
  const actions: RuntimePlanRow[] = inspection.targets.map((target) => ({
    relativePath: target.relativePath,
    role: target.role,
    previousHash: target.currentHash,
    installedHash:
      target.status === "overlay" ? target.currentHash : target.overlaySha256,
    action:
      blockedReason !== null
        ? "blocked"
        : target.status === "upstream"
          ? "install_overlay"
          : "already_materialized",
  }));

  const needsBackup = actions.some((row) => row.action === "install_overlay");
  const backupDir =
    blockedReason !== null
      ? null
      : needsBackup
        ? path.join(
            inspection.receiptRoot,
            "backups",
            compactTimestamp(),
          )
        : await resolveExistingBackupDir(
            inspection.stableReceiptPath,
            path.join(inspection.receiptRoot, "receipts"),
          );

  return {
    inspection,
    mode,
    actions,
    blockedReason,
    backupDir,
  };
}

export async function reconcileRuntime(
  mode: "install" | "upgrade",
  options: RuntimeOptions = {},
): Promise<RuntimePlan> {
  const plan = await planRuntimeReconcile(mode, options);
  if (plan.blockedReason) {
    throw new Error(plan.blockedReason);
  }

  if (options.dryRun) {
    return plan;
  }

  await ensureDir(plan.inspection.receiptRoot);
  const receiptsDir = path.join(plan.inspection.receiptRoot, "receipts");
  await ensureDir(receiptsDir);

  if (plan.backupDir && plan.actions.some((row) => row.action === "install_overlay")) {
    await ensureDir(plan.backupDir);
  }

  for (const row of plan.actions) {
    if (row.action !== "install_overlay") {
      continue;
    }

    const target = plan.inspection.targets.find(
      (candidate) => candidate.relativePath === row.relativePath,
    );
    if (!target) {
      throw new Error(`Missing runtime target for ${row.relativePath}`);
    }

    if (!plan.backupDir || target.currentHash === null) {
      throw new Error(`Missing backup context for ${row.relativePath}`);
    }

    await copyFileEnsureDir(
      target.runtimePath,
      path.join(plan.backupDir, target.relativePath),
    );
    await copyFileEnsureDir(target.overlayPath, target.runtimePath);
    row.installedHash = await sha256File(target.runtimePath);
  }

  const appliedAt = isoTimestamp();
  const receipt: RuntimeReceipt = {
    frameworkName: plan.inspection.manifest.frameworkName,
    frameworkVersion: plan.inspection.manifest.frameworkVersion,
    profileId: plan.inspection.profile.id,
    mode,
    appliedAt,
    runtimeRoot: plan.inspection.runtimeRoot,
    manifestHash: plan.inspection.manifestHash,
    backupDir: plan.backupDir,
    targets: plan.actions,
  };

  const suffix = compactTimestamp();
  await writeJsonFile(plan.inspection.stableReceiptPath, receipt);
  await writeJsonFile(
    path.join(receiptsDir, `${mode}-${suffix}.json`),
    receipt,
  );

  return plan;
}

function receiptSearchRoots(
  runtimeRoot: string,
  manifest: RuntimeManifest,
): string[] {
  return [
    path.join(runtimeRoot, manifest.receiptDirname),
    ...manifest.legacyReceiptDirnames.map((dirname) => path.join(runtimeRoot, dirname)),
  ];
}

async function findStableReceiptPath(
  runtimeRoot: string,
  manifest: RuntimeManifest,
): Promise<string | null> {
  for (const root of receiptSearchRoots(runtimeRoot, manifest)) {
    const candidate = path.join(root, "install-receipt.json");
    if (await pathExists(candidate)) {
      return candidate;
    }
  }
  return null;
}

export async function restoreRuntime(
  options: RuntimeOptions = {},
): Promise<RuntimeReceipt> {
  const assets = await loadRuntimeAssets();
  const runtimeRoot = resolveRuntimeRoot(assets.manifest, options.runtimeRoot);
  const stableReceiptPath = await findStableReceiptPath(runtimeRoot, assets.manifest);
  if (!stableReceiptPath) {
    throw new Error("No install receipt found for runtime restore.");
  }

  const receipt = await readJsonFile<RuntimeReceipt>(stableReceiptPath);
  if (!receipt.backupDir) {
    throw new Error("Latest install receipt does not record a backup directory.");
  }

  const profile = assets.manifest.compatibilityProfiles[0];
  if (!profile) {
    throw new Error("Runtime manifest has no compatibility profile.");
  }

  for (const target of profile.targets) {
    const backupPath = path.join(receipt.backupDir, target.relativePath);
    if (!(await pathExists(backupPath))) {
      throw new Error(`Missing backup for ${target.relativePath}`);
    }
    await copyFileEnsureDir(backupPath, path.join(runtimeRoot, target.relativePath));
  }

  const restoredReceipt: RuntimeReceipt = {
    frameworkName: assets.manifest.frameworkName,
    frameworkVersion: assets.manifest.frameworkVersion,
    profileId: profile.id,
    mode: "restore",
    appliedAt: isoTimestamp(),
    runtimeRoot,
    manifestHash: await manifestHash(assets.manifestPath),
    backupDir: receipt.backupDir,
    targets: await Promise.all(
      profile.targets.map(async (target) => ({
        relativePath: target.relativePath,
        role: target.role,
        previousHash: await sha256File(path.join(runtimeRoot, target.relativePath)),
        installedHash: await sha256File(path.join(runtimeRoot, target.relativePath)),
        action: "restored_from_backup",
      })),
    ),
  };

  const receiptRoot = path.dirname(stableReceiptPath);
  await ensureDir(path.join(receiptRoot, "receipts"));
  await writeJsonFile(
    path.join(receiptRoot, "receipts", `restore-${compactTimestamp()}.json`),
    restoredReceipt,
  );

  return restoredReceipt;
}

export async function verifyRuntime(
  options: RuntimeOptions = {},
): Promise<VerifyResult & { inspection: RuntimeInspection }> {
  const inspection = await inspectRuntime(options);
  const issues: string[] = [];

  if (inspection.state !== "overlay_current") {
    issues.push(
      `Runtime state is ${inspection.state}; all managed targets must match the installed overlay.`,
    );
  }

  const stableReceipt = await loadStableReceipt(inspection.stableReceiptPath);
  if (!stableReceipt) {
    issues.push(`Missing stable receipt at ${inspection.stableReceiptPath}.`);
  } else if (stableReceipt.manifestHash !== inspection.manifestHash) {
    issues.push(
      `Stable receipt manifest hash ${stableReceipt.manifestHash} does not match current manifest ${inspection.manifestHash}.`,
    );
  }

  return {
    ok: issues.length === 0,
    issues,
    inspection,
  };
}

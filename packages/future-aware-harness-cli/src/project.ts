import { promises as fs } from "node:fs";
import path from "node:path";

import {
  loadProjectAssets,
  loadProjectTemplate,
  manifestHash,
} from "./assets.js";
import {
  buildManagedSection,
  compactTimestamp,
  ensureDir,
  isoTimestamp,
  markerBegin,
  markerEnd,
  normalizeNewlines,
  pathExists,
  readJsonFile,
  renderTemplate,
  sha256File,
  sha256Text,
  todayDate,
  writeJsonFile,
  writeTextFile,
} from "./shared.js";
import type {
  ProjectInspection,
  ProjectManagedFileManifest,
  ProjectManagedFileState,
  ProjectMarkerEntry,
  ProjectMarkerFile,
  ProjectPlan,
  ProjectPlanRow,
  ProjectStrategy,
  VerifyResult,
} from "./types.js";

interface ProjectOptions {
  projectRoot?: string | undefined;
  dryRun?: boolean | undefined;
}

interface SectionRange {
  start: number;
  end: number;
  body: string;
}

function resolveProjectRoot(override?: string): string {
  return path.resolve(override ?? process.cwd());
}

function projectVariables(projectRoot: string): Record<string, string> {
  return {
    PROJECT_NAME: path.basename(projectRoot),
    DATE: todayDate(),
  };
}

async function readMarker(markerPath: string): Promise<ProjectMarkerFile | null> {
  if (!(await pathExists(markerPath))) {
    return null;
  }
  return readJsonFile<ProjectMarkerFile>(markerPath);
}

async function desiredContentForFile(
  projectRoot: string,
  file: ProjectManagedFileManifest,
): Promise<string> {
  const template = await loadProjectTemplate(file.template);
  return renderTemplate(template, projectVariables(projectRoot));
}

function desiredHashForFile(
  file: ProjectManagedFileManifest,
  desiredContent: string,
): string {
  return file.strategy === "patch_managed_section"
    ? sha256Text(normalizeNewlines(desiredContent).trimEnd())
    : sha256Text(desiredContent);
}

function findSectionRange(content: string, sectionId: string): SectionRange | null {
  const begin = markerBegin(sectionId);
  const end = markerEnd(sectionId);
  const start = content.indexOf(begin);
  if (start === -1) {
    return null;
  }
  const endIndex = content.indexOf(end, start);
  if (endIndex === -1) {
    return null;
  }
  const bodyStart = start + begin.length + 1;
  const body = content.slice(bodyStart, endIndex).replace(/^\n/, "").replace(/\n$/, "");
  return {
    start,
    end: endIndex + end.length,
    body,
  };
}

function classifyManagedFileState(params: {
  file: ProjectManagedFileManifest;
  exists: boolean;
  desiredContent: string;
  desiredHash: string;
  currentContent: string | null;
  currentHash: string | null;
  markerEntry: ProjectMarkerEntry | null;
}): Pick<ProjectManagedFileState, "state" | "details" | "currentHash"> {
  const {
    file,
    exists,
    desiredContent,
    desiredHash,
    currentContent,
    currentHash,
    markerEntry,
  } = params;

  if (!exists) {
    return {
      state: "missing",
      details: "File does not exist yet.",
      currentHash: null,
    };
  }

  if (file.strategy === "create_if_missing") {
    return {
      state: "existing",
      details: "Bootstrap-only file already exists.",
      currentHash,
    };
  }

  if (file.strategy === "replace_if_framework_owned") {
    if (currentHash === desiredHash) {
      return {
        state: markerEntry ? "current" : "adoptable_match",
        details: markerEntry
          ? "Managed file already matches desired template."
          : "Existing file already matches the desired template and can be adopted.",
        currentHash,
      };
    }

    if (markerEntry?.managedHash && currentHash === markerEntry.managedHash) {
      return {
        state: "needs_update",
        details: "Managed file matches recorded framework content but template has changed.",
        currentHash,
      };
    }

    return {
      state: "conflict",
      details: "Existing file does not match managed or desired framework content.",
      currentHash,
    };
  }

  if (!file.sectionId) {
    return {
      state: "conflict",
      details: "Managed section strategy requires a section id.",
      currentHash,
    };
  }

  const normalizedCurrent = normalizeNewlines(currentContent ?? "");
  const sectionRange = findSectionRange(normalizedCurrent, file.sectionId);
  if (sectionRange) {
    const sectionHash = sha256Text(sectionRange.body);
    if (sectionHash === desiredHash) {
      return {
        state: "current",
        details: "Managed section already matches desired content.",
        currentHash: sectionHash,
      };
    }

    if (markerEntry?.managedHash && sectionHash === markerEntry.managedHash) {
      return {
        state: "needs_update",
        details: "Managed section matches recorded content but template has changed.",
        currentHash: sectionHash,
      };
    }

    return {
      state: "conflict",
      details: "Managed section exists but has local edits outside framework control.",
      currentHash: sectionHash,
    };
  }

  if (normalizedCurrent.includes(normalizeNewlines(desiredContent))) {
    return {
      state: "adoptable_legacy",
      details: "Legacy unmarked routing block found and can be wrapped into a managed section.",
      currentHash,
    };
  }

  return {
    state: "injectable",
    details: "Managed routing section can be prepended without overwriting the existing file.",
    currentHash,
  };
}

export async function inspectProject(
  options: ProjectOptions = {},
): Promise<ProjectInspection> {
  const projectRoot = resolveProjectRoot(options.projectRoot);
  const assets = await loadProjectAssets();
  const markerPath = path.join(projectRoot, assets.manifest.markerPath);
  const receiptRoot = path.join(projectRoot, assets.manifest.receiptDirname);
  const marker = await readMarker(markerPath);
  const manifestSha = await manifestHash(assets.manifestPath);

  const files: ProjectManagedFileState[] = [];
  for (const file of assets.manifest.managedFiles) {
    const absolutePath = path.join(projectRoot, file.relativePath);
    const exists = await pathExists(absolutePath);
    const desiredContent = await desiredContentForFile(projectRoot, file);
    const desiredHash = desiredHashForFile(file, desiredContent);
    const currentContent = exists
      ? normalizeNewlines(await fs.readFile(absolutePath, "utf8"))
      : null;
    const currentHash =
      exists && file.strategy !== "patch_managed_section"
        ? await sha256File(absolutePath)
        : exists
          ? sha256Text(currentContent ?? "")
          : null;
    const markerEntry = marker?.files[file.id] ?? null;
    const classification = classifyManagedFileState({
      file,
      exists,
      desiredContent,
      desiredHash,
      currentContent,
      currentHash,
      markerEntry,
    });

    files.push({
      ...file,
      absolutePath,
      exists,
      desiredContent,
      desiredHash,
      currentHash: classification.currentHash,
      state: classification.state,
      markerEntry,
      details: classification.details,
    });
  }

  const hasManagedArtifacts = files.some((file) => file.exists);
  const hasConflicts = files.some((file) => file.state === "conflict");
  const state: ProjectInspection["state"] = marker
    ? hasConflicts
      ? "ambiguous"
      : "managed"
    : hasManagedArtifacts
      ? hasConflicts
        ? "ambiguous"
        : "partial"
      : "absent";

  const recommendedAction: ProjectInspection["recommendedAction"] =
    state === "ambiguous"
      ? "manual-review"
      : state === "absent"
        ? "bootstrap-project"
        : "upgrade-project";

  return {
    projectRoot,
    markerPath,
    receiptRoot,
    manifestHash: manifestSha,
    manifest: assets.manifest,
    marker,
    state,
    recommendedAction,
    files,
  };
}

export async function planProjectReconcile(
  mode: "bootstrap" | "upgrade",
  options: ProjectOptions = {},
): Promise<ProjectPlan> {
  const inspection = await inspectProject(options);
  const actions: ProjectPlanRow[] = inspection.files.map((file) => {
    if (file.strategy === "create_if_missing") {
      return {
        id: file.id,
        relativePath: file.relativePath,
        action: file.state === "missing" ? "create_file" : "scaffold_present",
        currentHash: file.currentHash,
        nextHash: file.state === "missing" ? file.desiredHash : file.currentHash,
        details:
          file.state === "missing"
            ? "Create bootstrap-only scaffold."
            : "Leave existing bootstrap-only file in place.",
      };
    }

    if (file.strategy === "replace_if_framework_owned") {
      if (file.state === "missing") {
        return {
          id: file.id,
          relativePath: file.relativePath,
          action: "create_file",
          currentHash: file.currentHash,
          nextHash: file.desiredHash,
          details: "Create managed file from framework template.",
        };
      }

      if (file.state === "needs_update") {
        return {
          id: file.id,
          relativePath: file.relativePath,
          action: "replace_file",
          currentHash: file.currentHash,
          nextHash: file.desiredHash,
          details: "Replace managed file because the framework template changed.",
        };
      }

      if (file.state === "adoptable_match") {
        return {
          id: file.id,
          relativePath: file.relativePath,
          action: "adopt_file",
          currentHash: file.currentHash,
          nextHash: file.currentHash,
          details: "Adopt an existing file that already matches the desired framework template.",
        };
      }

      return {
        id: file.id,
        relativePath: file.relativePath,
        action: file.state === "current" ? "scaffold_present" : "blocked",
        currentHash: file.currentHash,
        nextHash: file.currentHash,
        details:
          file.state === "current"
            ? "Managed file already current."
            : file.details,
      };
    }

    if (file.state === "missing") {
      return {
        id: file.id,
        relativePath: file.relativePath,
        action: "create_section_file",
        currentHash: file.currentHash,
        nextHash: file.desiredHash,
        details: "Create root file with a managed planning routing section.",
      };
    }

    if (file.state === "needs_update") {
      return {
        id: file.id,
        relativePath: file.relativePath,
        action: "replace_section",
        currentHash: file.currentHash,
        nextHash: file.desiredHash,
        details: "Replace the managed routing section because the framework template changed.",
      };
    }

    if (file.state === "adoptable_legacy") {
      return {
        id: file.id,
        relativePath: file.relativePath,
        action: "wrap_legacy_section",
        currentHash: file.currentHash,
        nextHash: file.desiredHash,
        details: "Wrap the legacy unmarked routing block in managed section markers.",
      };
    }

    if (file.state === "injectable") {
      return {
        id: file.id,
        relativePath: file.relativePath,
        action: "prepend_section",
        currentHash: file.currentHash,
        nextHash: file.desiredHash,
        details: "Prepend a managed planning routing section to the existing file.",
      };
    }

    return {
      id: file.id,
      relativePath: file.relativePath,
      action: file.state === "current" ? "scaffold_present" : "blocked",
      currentHash: file.currentHash,
      nextHash: file.currentHash,
      details:
        file.state === "current"
          ? "Managed routing section already current."
          : file.details,
    };
  });

  const blocked = actions.filter((action) => action.action === "blocked");
  return {
    inspection,
    mode,
    actions,
    blockedReason:
      blocked.length > 0
        ? `Project reconciliation blocked by ${blocked.length} conflicting managed file(s).`
        : null,
  };
}

function applyManagedSectionMutation(
  file: ProjectManagedFileState,
  currentContent: string | null,
  action: ProjectPlanRow["action"],
): string {
  if (!file.sectionId) {
    throw new Error(`Missing section id for ${file.relativePath}`);
  }

  const managedBlock = `${buildManagedSection(file.sectionId, file.desiredContent)}\n`;
  if (action === "create_section_file") {
    return managedBlock;
  }

  const normalizedCurrent = normalizeNewlines(currentContent ?? "");
  if (action === "replace_section") {
    const range = findSectionRange(normalizedCurrent, file.sectionId);
    if (!range) {
      throw new Error(`Managed section missing from ${file.relativePath}`);
    }
    return `${normalizedCurrent.slice(0, range.start)}${managedBlock}${normalizedCurrent.slice(range.end)}`.replace(
      /\n{3,}/g,
      "\n\n",
    );
  }

  if (action === "wrap_legacy_section") {
    const legacyBody = normalizeNewlines(file.desiredContent);
    const index = normalizedCurrent.indexOf(legacyBody);
    if (index === -1) {
      throw new Error(`Legacy routing block missing from ${file.relativePath}`);
    }
    return `${normalizedCurrent.slice(0, index)}${managedBlock}${normalizedCurrent.slice(index + legacyBody.length)}`.replace(
      /\n{3,}/g,
      "\n\n",
    );
  }

  if (action === "prepend_section") {
    return normalizedCurrent.trimStart().length === 0
      ? managedBlock
      : `${managedBlock}\n${normalizedCurrent}`;
  }

  throw new Error(`Unsupported section action: ${action}`);
}

async function currentManagedHash(file: ProjectManagedFileState): Promise<string | null> {
  if (!(await pathExists(file.absolutePath))) {
    return null;
  }

  if (file.strategy !== "patch_managed_section") {
    return sha256File(file.absolutePath);
  }

  if (!file.sectionId) {
    throw new Error(`Missing section id for ${file.relativePath}`);
  }

  const content = normalizeNewlines(await fs.readFile(file.absolutePath, "utf8"));
  const range = findSectionRange(content, file.sectionId);
  return range ? sha256Text(range.body) : null;
}

export async function reconcileProject(
  mode: "bootstrap" | "upgrade",
  options: ProjectOptions = {},
): Promise<ProjectPlan> {
  const plan = await planProjectReconcile(mode, options);
  if (plan.blockedReason) {
    throw new Error(plan.blockedReason);
  }

  if (options.dryRun) {
    return plan;
  }

  await ensureDir(plan.inspection.receiptRoot);

  for (const action of plan.actions) {
    if (action.action === "scaffold_present" || action.action === "adopt_file") {
      continue;
    }

    const file = plan.inspection.files.find((candidate) => candidate.id === action.id);
    if (!file) {
      throw new Error(`Managed file state missing for ${action.id}`);
    }

    if (
      action.action === "create_file" ||
      action.action === "replace_file"
    ) {
      await writeTextFile(file.absolutePath, file.desiredContent);
      continue;
    }

    const currentContent = await pathExists(file.absolutePath)
      ? await fs.readFile(file.absolutePath, "utf8")
      : null;
    const nextContent = applyManagedSectionMutation(
      file,
      currentContent,
      action.action,
    );
    await writeTextFile(file.absolutePath, nextContent);
  }

  const marker: ProjectMarkerFile = {
    frameworkName: plan.inspection.manifest.frameworkName,
    frameworkVersion: plan.inspection.manifest.frameworkVersion,
    manifestVersion: plan.inspection.manifest.manifestVersion,
    projectRoot: plan.inspection.projectRoot,
    lastReconciledAt: isoTimestamp(),
    mode,
    files: {},
  };

  for (const file of plan.inspection.files) {
    const row = plan.actions.find((action) => action.id === file.id);
    const managedHash = await currentManagedHash(file);
    marker.files[file.id] = {
      path: file.relativePath,
      strategy: file.strategy,
      template: file.template,
      managedHash,
      templateHash: file.desiredHash,
      sectionId: file.sectionId,
      scaffoldOnly: file.strategy === "create_if_missing",
      lastAction: row?.action ?? "scaffold_present",
    };
  }

  await writeJsonFile(plan.inspection.markerPath, marker);

  const receipt = {
    frameworkName: marker.frameworkName,
    frameworkVersion: marker.frameworkVersion,
    mode,
    appliedAt: marker.lastReconciledAt,
    projectRoot: plan.inspection.projectRoot,
    manifestHash: plan.inspection.manifestHash,
    actions: plan.actions,
  };
  await writeJsonFile(
    path.join(
      plan.inspection.receiptRoot,
      `reconcile-${compactTimestamp()}.json`,
    ),
    receipt,
  );

  return plan;
}

export async function verifyProject(
  options: ProjectOptions = {},
): Promise<VerifyResult & { inspection: ProjectInspection }> {
  const inspection = await inspectProject(options);
  const issues: string[] = [];

  if (!inspection.marker) {
    issues.push(`Missing project marker at ${inspection.markerPath}.`);
  }

  for (const file of inspection.files) {
    if (file.strategy === "create_if_missing") {
      if (file.state === "missing") {
        issues.push(`${file.relativePath} is missing.`);
      }
      continue;
    }

    if (!file.markerEntry) {
      issues.push(`${file.relativePath} is not recorded in the project marker.`);
      continue;
    }

    if (file.state === "needs_update") {
      issues.push(`${file.relativePath} is framework-managed but stale.`);
      continue;
    }

    if (file.state === "conflict") {
      issues.push(`${file.relativePath} has drifted from recorded framework content.`);
      continue;
    }

    if (
      file.strategy === "patch_managed_section" &&
      !["current"].includes(file.state)
    ) {
      issues.push(`${file.relativePath} does not have a current managed routing section.`);
      continue;
    }

    if (
      file.strategy === "replace_if_framework_owned" &&
      !["current"].includes(file.state)
    ) {
      issues.push(`${file.relativePath} does not match the current framework template.`);
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    inspection,
  };
}

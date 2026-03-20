import { createRequire } from "node:module";
import { join } from "node:path";

import {
  createRunRecord,
  documentIdSchema,
  runRecordSchema,
  scenarioDocumentSchema,
  type RunRecord,
} from "@f1-modeling/domain";
import { runPhase1PlaceholderScenario } from "@f1-modeling/sim-core";

import type { LocalApiPaths } from "../app.js";
import { listJsonFiles, readJsonFile, writeJsonFile } from "../persistence/fileStore.js";
import { resolveScenarioPresetDocuments } from "./presetService.js";

const require = createRequire(import.meta.url);
const packageJson = require("../../package.json") as { version: string };

const PLACEHOLDER_PROVENANCE = {
  sourceType: "placeholder" as const,
  source: "Phase 1 placeholder harness",
  notes:
    "Run output remains deterministic placeholder data until later modeling phases replace it.",
};

export class ScenarioNotFoundError extends Error {
  constructor(scenarioId: string) {
    super(`Scenario "${scenarioId}" was not found.`);
    this.name = "ScenarioNotFoundError";
  }
}

export class RunDependencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RunDependencyError";
  }
}

export interface CreatePhase1RunInput {
  scenarioId: string;
}

function getScenarioFilePath(paths: LocalApiPaths, scenarioId: string): string {
  return join(paths.scenariosDir, `${scenarioId}.json`);
}

function getRunFilePath(paths: LocalApiPaths, runId: string): string {
  return join(paths.runsDir, `${runId}.json`);
}

function createRunId(scenarioId: string): string {
  return `run-${scenarioId}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

async function loadSavedScenario(
  paths: LocalApiPaths,
  scenarioId: string,
) {
  const storedScenario = await readJsonFile<unknown>(
    getScenarioFilePath(paths, scenarioId),
  );

  if (!storedScenario) {
    throw new ScenarioNotFoundError(scenarioId);
  }

  return scenarioDocumentSchema.parse(storedScenario);
}

export async function createPhase1Run(
  paths: LocalApiPaths,
  input: CreatePhase1RunInput,
): Promise<Readonly<RunRecord>> {
  const scenarioId = documentIdSchema.parse(input.scenarioId);
  const scenario = await loadSavedScenario(paths, scenarioId);

  let resolvedPresets;

  try {
    resolvedPresets = resolveScenarioPresetDocuments(paths.presetsRoot, scenario);
  } catch (error) {
    throw new RunDependencyError(
      error instanceof Error ? error.message : "Failed to resolve scenario presets.",
    );
  }

  const placeholderSummary = runPhase1PlaceholderScenario({
    scenarioId: scenario.scenarioId,
    scenarioLabel: scenario.name,
    seed: scenario.seed,
  });
  const runId = createRunId(scenario.scenarioId);
  const runRecord = createRunRecord({
    runId,
    scenario,
    resolvedPresets,
    versions: {
      modelVersion: placeholderSummary.modelVersion,
      appVersion: packageJson.version,
    },
    output: {
      summaryMetrics: {
        harnessId: placeholderSummary.harnessId,
        ...placeholderSummary.metrics,
      },
      artifacts: [
        {
          artifactId: `${runId}-trace`,
          artifactType: "phase1-placeholder-trace",
          label: "Phase 1 placeholder trace output",
          data: {
            trace: placeholderSummary.trace,
            notes: placeholderSummary.notes,
            placeholderRunId: placeholderSummary.runId,
          },
        },
      ],
      assumptionNotes: placeholderSummary.notes.map((note) => ({
        note,
        provenance: PLACEHOLDER_PROVENANCE,
      })),
    },
  });

  await writeJsonFile(getRunFilePath(paths, runId), runRecord);

  return runRecord;
}

export async function listRuns(paths: LocalApiPaths): Promise<RunRecord[]> {
  const storedRuns = await listJsonFiles<unknown>(paths.runsDir);

  return storedRuns
    .map((storedRun) => runRecordSchema.parse(storedRun))
    .sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt) ||
        right.runId.localeCompare(left.runId),
    );
}

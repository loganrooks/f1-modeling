import { createRequire } from "node:module";
import { join } from "node:path";

import {
  createRunRecord,
  documentIdSchema,
  getCircuitById,
  runRecordSchema,
  scenarioDocumentSchema,
  type CircuitDocument,
  type RunRecord,
} from "@f1-modeling/domain";
import { loadCircuitCatalogFromDisk } from "@f1-modeling/domain/node/circuit-catalog";
import {
  DEFAULT_VEHICLE_PARAMS,
  runPhase1PlaceholderScenario,
  solveLap,
  type VehicleParams,
} from "@f1-modeling/sim-core";

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

export interface CreateLapModelRunInput {
  scenarioId: string;
}

const LAP_MODEL_PROVENANCE = {
  sourceType: "engineering-inference" as const,
  source: "QSS lap model (Lenzo & Rossi 2020)",
  notes:
    "Quasi-steady-state point-mass model. Assumptions are documented in model output.",
};

function sampleSpeedProfile<T>(profile: T[], step: number): T[] {
  const sampled: T[] = [];
  for (let i = 0; i < profile.length; i += step) {
    sampled.push(profile[i]!);
  }
  // Always include the last point if not already included
  if (profile.length > 0 && (profile.length - 1) % step !== 0) {
    sampled.push(profile[profile.length - 1]!);
  }
  return sampled;
}

export async function createLapModelRun(
  paths: LocalApiPaths,
  input: CreateLapModelRunInput,
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

  // Load circuit catalog and find the requested circuit
  let circuits: CircuitDocument[];
  try {
    circuits = loadCircuitCatalogFromDisk(join(paths.presetsRoot, "circuits"));
  } catch (error) {
    throw new RunDependencyError(
      error instanceof Error ? error.message : "Failed to load circuit catalog.",
    );
  }

  const circuitId = scenario.circuit.circuitId;
  const circuit = getCircuitById(circuits, circuitId);

  if (!circuit) {
    throw new RunDependencyError(
      `Circuit "${circuitId}" not found in circuit catalog.`,
    );
  }

  // Resolve vehicle params: use scenario's if present, otherwise defaults
  const vehicleParams: VehicleParams = scenario.vehicleParams ?? DEFAULT_VEHICLE_PARAMS;

  // Run the QSS lap model
  const lapOutput = solveLap(circuit, vehicleParams);

  const runId = createRunId(scenario.scenarioId);

  const runRecord = createRunRecord({
    runId,
    scenario,
    resolvedPresets,
    versions: {
      modelVersion: "qss-lap-model/v1",
      appVersion: packageJson.version,
    },
    output: {
      summaryMetrics: {
        harnessId: "qss-lap-model",
        circuitId,
        vehicleParams,
        lapTime: lapOutput.lapTime,
        sectorResults: lapOutput.sectorResults,
        speedProfile: sampleSpeedProfile(lapOutput.speedProfile, 10),
        assumptions: lapOutput.assumptions,
      },
      artifacts: [
        {
          artifactId: `${runId}-speed-profile`,
          artifactType: "qss-speed-profile",
          label: "Full speed-vs-distance profile",
          data: {
            speedProfile: lapOutput.speedProfile,
            sectorResults: lapOutput.sectorResults,
          },
        },
      ],
      assumptionNotes: lapOutput.assumptions.map((note) => ({
        note,
        provenance: LAP_MODEL_PROVENANCE,
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

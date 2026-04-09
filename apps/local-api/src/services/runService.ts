import { readFileSync } from "node:fs";
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
  type WeatherPresetDocument,
} from "@f1-modeling/domain";
import { loadCircuitCatalogFromDisk } from "@f1-modeling/domain/node/circuit-catalog";
import {
  DEFAULT_LOAD_TRANSFER_PARAMS,
  DEFAULT_VEHICLE_PARAMS,
  DEFAULT_CONSERVATIVE_POLICY,
  DEFAULT_AGGRESSIVE_POLICY,
  runPhase1PlaceholderScenario,
  runRace,
  runStint,
  solveLap,
  type ElectricalPolicy,
  type InterruptionSpec as SimInterruptionSpec,
  type RaceConfig,
  type StintConfig,
  type StintSpec as SimStintSpec,
  type TireCompoundParams,
  type VehicleParams,
  type WeatherTimeline,
  type WeatherTimelineEntry,
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

// ---------------------------------------------------------------------------
// Tire inventory validation (local adapter)
// ---------------------------------------------------------------------------
// The canonical implementation lives in @f1-modeling/sim-core (raceModel/tireInventory.ts)
// and is exported from the sim-core barrel. This local adapter delegates to it when
// available, or provides an equivalent implementation for worktree builds where the
// node_modules symlink may resolve to the main repo before the barrel export is merged.
// After merge to main, this can be replaced with a direct import from @f1-modeling/sim-core.

interface TireSetAllocationInput {
  compound: string;
  totalSets: number;
}

interface TireUsageEntryInput {
  compound: string;
  session: string;
  stintIndex?: number | undefined;
}

const WET_COMPOUNDS = new Set(["intermediate", "wet"]);

function localValidateTireInventory(
  stints: readonly SimStintSpec[],
  allocation: readonly TireSetAllocationInput[],
  priorUsage: readonly TireUsageEntryInput[] = [],
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const usedByCompound = new Map<string, number>();

  for (const stint of stints) {
    const compound = stint.tireCompound.compoundId;
    usedByCompound.set(compound, (usedByCompound.get(compound) ?? 0) + 1);
  }

  for (const entry of priorUsage) {
    usedByCompound.set(entry.compound, (usedByCompound.get(entry.compound) ?? 0) + 1);
  }

  for (const [compound, used] of usedByCompound) {
    const alloc = allocation.find((a) => a.compound === compound);
    const available = alloc?.totalSets ?? 0;

    if (used > available) {
      errors.push(
        `${compound} tire allocation exceeded: used ${used} of ${available} available sets`,
      );
    }
  }

  const raceCompounds = new Set<string>();
  let hasWetCompound = false;

  for (const stint of stints) {
    const compound = stint.tireCompound.compoundId;
    raceCompounds.add(compound);
    if (WET_COMPOUNDS.has(compound)) {
      hasWetCompound = true;
    }
  }

  if (!hasWetCompound && raceCompounds.size < 2) {
    errors.push(
      "Mandatory two-compound rule: a dry race must use at least two different dry compounds",
    );
  }

  return { valid: errors.length === 0, errors };
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

// ---------------------------------------------------------------------------
// Stint model run
// ---------------------------------------------------------------------------

const STINT_MODEL_PROVENANCE = {
  sourceType: "engineering-inference" as const,
  source: "Multi-lap stint model (Phase 3)",
  notes:
    "Multi-lap stint simulation with tire degradation, electrical energy balance, and weather evolution. Assumptions are documented in model output.",
};

export interface CreateStintModelRunInput {
  scenarioId: string;
}

/**
 * Loads a tire compound preset from the presets/tires directory.
 */
function loadTireCompoundPreset(
  presetsRoot: string,
  compoundId: string,
): TireCompoundParams {
  const filePath = join(presetsRoot, "tires", `${compoundId}.json`);
  const raw = readJsonFileSync_preset(filePath);
  if (!raw) {
    throw new RunDependencyError(
      `Tire compound preset "${compoundId}" not found at ${filePath}.`,
    );
  }

  const doc = raw as { values?: Record<string, unknown> };
  if (!doc.values) {
    throw new RunDependencyError(
      `Tire compound preset "${compoundId}" has no values field.`,
    );
  }

  return doc.values as unknown as TireCompoundParams;
}

/**
 * Synchronous JSON file reader for preset loading.
 */
function readJsonFileSync_preset(filePath: string): unknown | null {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  } catch {
    return null;
  }
}

/**
 * Extracts a weather timeline from a resolved weather preset.
 */
function extractWeatherTimeline(
  weatherPreset: WeatherPresetDocument,
): WeatherTimeline {
  const values = weatherPreset.values as Record<string, unknown>;
  const timeline = values.weatherTimeline;

  if (Array.isArray(timeline)) {
    return timeline as WeatherTimelineEntry[];
  }

  // Fallback: single-point dry timeline from preset values
  const trackTemp = typeof values.trackTemperatureC === "number" ? values.trackTemperatureC : 33;
  return [
    { lap: 0, trackTemperatureC: trackTemp, surfaceWetness: 0, rainfall: "none" },
  ];
}

/**
 * Resolves an electrical deployment policy from a policy ID string.
 */
function resolveElectricalPolicy(policyId: string | undefined): ElectricalPolicy {
  if (policyId === "aggressive-deploy" || policyId === "aggressive") {
    return DEFAULT_AGGRESSIVE_POLICY;
  }
  return DEFAULT_CONSERVATIVE_POLICY;
}

/**
 * Finds the longest contiguous section of near-zero curvature to use as
 * a straight-mode zone. This is a heuristic for active-aero zone definition.
 */
function findStraightZones(
  circuit: CircuitDocument,
  curvatureThreshold: number = 0.001,
): Array<{ startDistance: number; endDistance: number }> {
  const points = circuit.points;
  if (points.length === 0) return [];

  let bestStart = 0;
  let bestEnd = 0;
  let bestLen = 0;
  let curStart = 0;
  let inStraight = false;

  for (let i = 0; i < points.length; i++) {
    const pt = points[i]!;
    if (Math.abs(pt.curvature) < curvatureThreshold) {
      if (!inStraight) {
        curStart = i;
        inStraight = true;
      }
      const len = pt.distance - points[curStart]!.distance;
      if (len > bestLen) {
        bestStart = curStart;
        bestEnd = i;
        bestLen = len;
      }
    } else {
      inStraight = false;
    }
  }

  if (bestLen > 0) {
    return [{
      startDistance: points[bestStart]!.distance,
      endDistance: points[bestEnd]!.distance,
    }];
  }

  return [];
}

export async function createStintModelRun(
  paths: LocalApiPaths,
  input: CreateStintModelRunInput,
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

  // Load circuit
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

  // Resolve stint parameters from scenario
  const stintConfig = scenario.stintConfig;
  const totalLaps = stintConfig?.totalLaps ?? 15;
  const tireCompoundId = stintConfig?.tireCompoundId ?? "medium-c3";

  // Load tire compound preset
  let tireCompound: TireCompoundParams;
  try {
    tireCompound = loadTireCompoundPreset(paths.presetsRoot, tireCompoundId);
  } catch (error) {
    throw new RunDependencyError(
      error instanceof Error ? error.message : `Failed to load tire compound "${tireCompoundId}".`,
    );
  }

  // Resolve electrical policy
  const electricalPolicy = resolveElectricalPolicy(stintConfig?.electricalPolicyId);

  // Extract weather timeline and ambient temperature from preset
  const weatherTimeline = extractWeatherTimeline(resolvedPresets.weather);
  const weatherValues = resolvedPresets.weather.values as Record<string, unknown>;
  const ambientTemperatureC = typeof weatherValues.ambientTemperatureC === "number"
    ? weatherValues.ambientTemperatureC
    : 24;

  // Resolve vehicle params
  const baseVehicle: VehicleParams = scenario.vehicleParams ?? DEFAULT_VEHICLE_PARAMS;

  // Build aero config from regulation preset if active aero is enabled
  const regValues = resolvedPresets.regulation.values as Record<string, unknown>;
  const aeroValues = regValues.aero as Record<string, unknown> | undefined;
  let aeroConfig: StintConfig["aeroConfig"] = null;

  if (aeroValues?.activeAeroModeSwitching === true) {
    const modes = aeroValues.modes as Record<string, Record<string, number>> | undefined;
    const straightMode = modes?.straightMode;
    const dragReduction = straightMode?.dragReduction ?? 0.55;
    const downforceReduction = straightMode?.downforceReduction ?? 0.30;

    const straightModeZones = findStraightZones(circuit);

    if (straightModeZones.length > 0) {
      aeroConfig = {
        straightModeZones,
        cornerModeDragFactor: baseVehicle.dragFactor,
        cornerModeDownforceFactor: baseVehicle.downforceFactor,
        straightModeDragFactor: baseVehicle.dragFactor * (1 - dragReduction),
        straightModeDownforceFactor: baseVehicle.downforceFactor * (1 - downforceReduction),
      };
    }
  }

  // Run the stint model
  const stintRunConfig: StintConfig = {
    circuit,
    baseVehicle,
    tireCompound,
    electricalPolicy,
    weatherTimeline,
    aeroConfig,
    loadTransferParams: DEFAULT_LOAD_TRANSFER_PARAMS,
    totalLaps,
    ambientTemperatureC,
  };

  const stintResult = runStint(stintRunConfig);

  // Build run record
  const runId = createRunId(scenario.scenarioId);
  const lapTimes = stintResult.lapTraces.map((t) => t.lapTime);

  const runRecord = createRunRecord({
    runId,
    scenario,
    resolvedPresets,
    versions: {
      modelVersion: "stint-model/v1",
      appVersion: packageJson.version,
    },
    output: {
      summaryMetrics: {
        harnessId: "stint-model",
        circuitId,
        vehicleParams: baseVehicle,
        tireCompound: tireCompound.compoundId,
        electricalPolicy: electricalPolicy.policyId,
        totalLaps,
        lapTimes,
        totalTime: stintResult.totalTime,
        finalTireWear: stintResult.finalState.tireState.wearFraction,
        finalElectricalSoC: stintResult.finalState.electricalState.stateOfCharge,
        assumptions: stintResult.assumptions,
      },
      artifacts: [
        {
          artifactId: `${runId}-stint-trace`,
          artifactType: "stint-trace",
          label: "Full stint trace (per-lap state snapshots)",
          data: {
            lapTraces: stintResult.lapTraces,
          },
        },
        {
          artifactId: `${runId}-tire-degradation-trace`,
          artifactType: "tire-degradation-trace",
          label: "Tire degradation over stint",
          data: {
            trace: stintResult.lapTraces.map((t) => ({
              lap: t.lapNumber,
              wearFraction: t.tireState.wearFraction,
              surfaceTemperature: t.tireState.surfaceTemperature,
              effectiveGrip: t.effectiveGrip,
              compound: t.tireState.compound,
            })),
          },
        },
        {
          artifactId: `${runId}-electrical-state-trace`,
          artifactType: "electrical-state-trace",
          label: "Electrical SoC evolution over stint",
          data: {
            trace: stintResult.lapTraces.map((t) => ({
              lap: t.lapNumber,
              stateOfCharge: t.electricalState.stateOfCharge,
              deployed: t.electricalState.lapEnergyDeployed,
              harvested: t.electricalState.lapEnergyHarvested,
            })),
          },
        },
        {
          artifactId: `${runId}-weather-evolution-trace`,
          artifactType: "weather-evolution-trace",
          label: "Weather evolution over stint",
          data: {
            trace: stintResult.lapTraces.map((t) => ({
              lap: t.lapNumber,
              trackTemperatureC: t.environmentState.trackTemperatureC,
              surfaceWetness: t.environmentState.surfaceWetness,
              gripModifier: t.environmentState.gripModifier,
              rubberEvolution: t.environmentState.rubberEvolution,
            })),
          },
        },
      ],
      assumptionNotes: stintResult.assumptions.map((note) => ({
        note,
        provenance: STINT_MODEL_PROVENANCE,
      })),
    },
  });

  await writeJsonFile(getRunFilePath(paths, runId), runRecord);

  return runRecord;
}

// ---------------------------------------------------------------------------
// Race simulation run
// ---------------------------------------------------------------------------

const RACE_MODEL_PROVENANCE = {
  sourceType: "engineering-inference" as const,
  source: "Race-state engine (Phase 3.1)",
  notes:
    "Multi-stint race simulation with pit-lane loss, interruptions, and tire inventory. Single-car model without opponent field.",
};

export interface CreateRaceSimulationRunInput {
  scenarioId: string;
  experimentTag?: string | undefined;
  parentRunId?: string | undefined;
  branchPoint?: {
    stintIndex: number;
    raceLap: number;
    branchType: "stint-boundary";
  } | undefined;
}

export async function createRaceSimulationRun(
  paths: LocalApiPaths,
  input: CreateRaceSimulationRunInput,
): Promise<Readonly<RunRecord>> {
  const scenarioId = documentIdSchema.parse(input.scenarioId);
  const scenario = await loadSavedScenario(paths, scenarioId);

  // Validate racePlan exists
  if (!scenario.racePlan) {
    throw new RunDependencyError(
      "Scenario does not contain a racePlan. Use stint-model for single-stint simulation.",
    );
  }
  const racePlan = scenario.racePlan;

  // Resolve presets
  let resolvedPresets;
  try {
    resolvedPresets = resolveScenarioPresetDocuments(paths.presetsRoot, scenario);
  } catch (error) {
    throw new RunDependencyError(
      error instanceof Error ? error.message : "Failed to resolve scenario presets.",
    );
  }

  // Load circuit
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

  // Resolve vehicle params
  const baseVehicle: VehicleParams = scenario.vehicleParams ?? DEFAULT_VEHICLE_PARAMS;

  // Resolve each stint from racePlan.stints
  const resolvedStints: SimStintSpec[] = [];
  for (const stintSpec of racePlan.stints) {
    let tireCompound: TireCompoundParams;
    try {
      tireCompound = loadTireCompoundPreset(paths.presetsRoot, stintSpec.tireCompoundId);
    } catch (error) {
      throw new RunDependencyError(
        error instanceof Error
          ? error.message
          : `Failed to load tire compound "${stintSpec.tireCompoundId}".`,
      );
    }

    const electricalPolicy = resolveElectricalPolicy(stintSpec.electricalPolicyId);

    resolvedStints.push({
      stintIndex: stintSpec.stintIndex,
      totalLaps: stintSpec.totalLaps,
      tireCompound,
      electricalPolicy,
    });
  }

  // Validate tire inventory if present
  if (racePlan.tireInventory) {
    const validation = localValidateTireInventory(
      resolvedStints,
      racePlan.tireInventory.allocation,
      racePlan.tireInventory.used,
    );
    if (!validation.valid) {
      throw new RunDependencyError(
        "Tire inventory validation failed: " + validation.errors.join("; "),
      );
    }
  }

  // Extract weather timeline and ambient temperature
  const weatherTimeline = extractWeatherTimeline(resolvedPresets.weather);
  const weatherValues = resolvedPresets.weather.values as Record<string, unknown>;
  const ambientTemperatureC = typeof weatherValues.ambientTemperatureC === "number"
    ? weatherValues.ambientTemperatureC
    : 24;

  // Build aero config from regulation preset
  const regValues = resolvedPresets.regulation.values as Record<string, unknown>;
  const aeroValues = regValues.aero as Record<string, unknown> | undefined;
  let aeroConfig: StintConfig["aeroConfig"] = null;

  if (aeroValues?.activeAeroModeSwitching === true) {
    const modes = aeroValues.modes as Record<string, Record<string, number>> | undefined;
    const straightMode = modes?.straightMode;
    const dragReduction = straightMode?.dragReduction ?? 0.55;
    const downforceReduction = straightMode?.downforceReduction ?? 0.30;

    const straightModeZones = findStraightZones(circuit);

    if (straightModeZones.length > 0) {
      aeroConfig = {
        straightModeZones,
        cornerModeDragFactor: baseVehicle.dragFactor,
        cornerModeDownforceFactor: baseVehicle.downforceFactor,
        straightModeDragFactor: baseVehicle.dragFactor * (1 - dragReduction),
        straightModeDownforceFactor: baseVehicle.downforceFactor * (1 - downforceReduction),
      };
    }
  }

  // Build RaceConfig
  const raceConfig: RaceConfig = {
    circuit,
    baseVehicle,
    weatherTimeline,
    aeroConfig,
    loadTransferParams: DEFAULT_LOAD_TRANSFER_PARAMS,
    pitLaneParams: racePlan.pitLaneParams,
    ambientTemperatureC,
  };

  // Resolve interruptions from racePlan
  const interruptions: SimInterruptionSpec[] = (racePlan.interruptions ?? []).map((intr) => ({
    type: intr.type,
    startLap: intr.startLap,
    endLap: intr.endLap,
  }));

  // Run the race engine
  const raceResult = runRace(resolvedStints, raceConfig, interruptions);

  // Build run record
  const runId = createRunId(scenario.scenarioId);

  // Per-stint artifacts
  const artifacts = [];
  for (let si = 0; si < raceResult.stintResults.length; si++) {
    const stintResult = raceResult.stintResults[si]!;
    const prefix = `${runId}-stint-${si}`;

    artifacts.push({
      artifactId: `${prefix}-stint-trace`,
      artifactType: "stint-trace",
      label: `Stint ${si} full trace (per-lap state snapshots)`,
      data: {
        lapTraces: stintResult.lapTraces,
      },
    });

    artifacts.push({
      artifactId: `${prefix}-tire-degradation-trace`,
      artifactType: "tire-degradation-trace",
      label: `Stint ${si} tire degradation`,
      data: {
        trace: stintResult.lapTraces.map((t) => ({
          lap: t.lapNumber,
          wearFraction: t.tireState.wearFraction,
          surfaceTemperature: t.tireState.surfaceTemperature,
          effectiveGrip: t.effectiveGrip,
          compound: t.tireState.compound,
        })),
      },
    });

    artifacts.push({
      artifactId: `${prefix}-electrical-state-trace`,
      artifactType: "electrical-state-trace",
      label: `Stint ${si} electrical SoC evolution`,
      data: {
        trace: stintResult.lapTraces.map((t) => ({
          lap: t.lapNumber,
          stateOfCharge: t.electricalState.stateOfCharge,
          deployed: t.electricalState.lapEnergyDeployed,
          harvested: t.electricalState.lapEnergyHarvested,
        })),
      },
    });

    artifacts.push({
      artifactId: `${prefix}-weather-evolution-trace`,
      artifactType: "weather-evolution-trace",
      label: `Stint ${si} weather evolution`,
      data: {
        trace: stintResult.lapTraces.map((t) => ({
          lap: t.lapNumber,
          trackTemperatureC: t.environmentState.trackTemperatureC,
          surfaceWetness: t.environmentState.surfaceWetness,
          gripModifier: t.environmentState.gripModifier,
          rubberEvolution: t.environmentState.rubberEvolution,
        })),
      },
    });
  }

  // Race-level timeline artifact
  artifacts.push({
    artifactId: `${runId}-race-timeline`,
    artifactType: "race-timeline",
    label: "Race timeline with events and stint summaries",
    data: {
      timeline: raceResult.timeline,
      stintSummaries: raceResult.stintSummaries,
      totalRaceTime: raceResult.totalRaceTime,
      totalPitTime: raceResult.totalPitTime,
    },
  });

  const totalRaceLaps = resolvedStints.reduce((sum, s) => sum + s.totalLaps, 0);

  const runRecord = createRunRecord({
    runId,
    scenario,
    resolvedPresets,
    versions: {
      modelVersion: "race-simulation/v1",
      appVersion: packageJson.version,
    },
    output: {
      summaryMetrics: {
        harnessId: "race-simulation",
        circuitId,
        vehicleParams: baseVehicle,
        stintCount: resolvedStints.length,
        totalRaceLaps,
        totalRaceTime: raceResult.totalRaceTime,
        totalPitTime: raceResult.totalPitTime,
        stintSummaries: raceResult.stintSummaries,
        assumptions: raceResult.assumptions,
      },
      artifacts,
      assumptionNotes: raceResult.assumptions.map((note) => ({
        note,
        provenance: RACE_MODEL_PROVENANCE,
      })),
    },
    ...(input.parentRunId !== undefined && { parentRunId: input.parentRunId }),
    ...(input.branchPoint !== undefined && { branchPoint: input.branchPoint }),
    ...(input.experimentTag !== undefined && { experimentTag: input.experimentTag }),
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

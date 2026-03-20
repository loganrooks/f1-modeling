import type { AssumptionNote } from "../common/provenance.js";
import { runRecordSchemaVersion } from "../common/schemaVersion.js";
import {
  presetReferenceSchema,
  scenarioDocumentSchema,
  type ScenarioDocument,
} from "../scenario/schema.js";
import {
  regulationPresetDocumentSchema,
  sessionPresetDocumentSchema,
  weatherPresetDocumentSchema,
  type PresetDocument,
  type RegulationPresetDocument,
  type SessionPresetDocument,
  type WeatherPresetDocument,
} from "../presets/schema.js";

import {
  runArtifactSchema,
  runRecordSchema,
  type RunArtifact,
  type RunRecord,
  type RunStatus,
} from "./schema.js";

export interface ResolvedPresetDocuments {
  regulation: RegulationPresetDocument;
  session: SessionPresetDocument;
  weather: WeatherPresetDocument;
}

export interface CreateRunRecordVersions {
  modelVersion: string;
  appVersion: string;
}

export interface CreateRunRecordOutput {
  status?: RunStatus;
  summaryMetrics: Record<string, unknown>;
  artifacts?: RunArtifact[];
  assumptionNotes?: AssumptionNote[];
}

export interface CreateRunRecordInput {
  runId: string;
  createdAt?: string;
  scenario: ScenarioDocument;
  resolvedPresets: ResolvedPresetDocuments;
  versions: CreateRunRecordVersions;
  output: CreateRunRecordOutput;
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);

    for (const nestedValue of Object.values(value as Record<string, unknown>)) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function ensurePresetMatchesReference(
  preset: PresetDocument,
  expectedPresetType: PresetDocument["presetType"],
  expectedPresetId: string,
) {
  if (preset.presetType !== expectedPresetType) {
    throw new Error(
      `Expected a ${expectedPresetType} preset document, received ${preset.presetType}.`,
    );
  }

  if (preset.presetId !== expectedPresetId) {
    throw new Error(
      `Preset mismatch for ${expectedPresetType}: expected ${expectedPresetId}, received ${preset.presetId}.`,
    );
  }
}

function resolvePresetReference(
  presetId: string,
  label: string | undefined,
) {
  return presetReferenceSchema.parse({
    presetId,
    ...(label ? { label } : {}),
  });
}

export function createRunRecord(input: CreateRunRecordInput): Readonly<RunRecord> {
  const scenario = scenarioDocumentSchema.parse(input.scenario);
  const regulationPreset = regulationPresetDocumentSchema.parse(
    input.resolvedPresets.regulation,
  );
  const sessionPreset = sessionPresetDocumentSchema.parse(
    input.resolvedPresets.session,
  );
  const weatherPreset = weatherPresetDocumentSchema.parse(
    input.resolvedPresets.weather,
  );

  ensurePresetMatchesReference(
    regulationPreset,
    "regulation",
    scenario.regulationPreset.presetId,
  );
  ensurePresetMatchesReference(
    sessionPreset,
    "session",
    scenario.sessionPreset.presetId,
  );
  ensurePresetMatchesReference(
    weatherPreset,
    "weather",
    scenario.weatherPreset.presetId,
  );

  const runRecord = runRecordSchema.parse({
    schemaVersion: runRecordSchemaVersion,
    runId: input.runId,
    createdAt: input.createdAt ?? new Date().toISOString(),
    scenarioId: scenario.scenarioId,
    scenarioSnapshot: cloneValue(scenario),
    presetReferences: {
      regulation: resolvePresetReference(
        scenario.regulationPreset.presetId,
        scenario.regulationPreset.label ?? regulationPreset.name,
      ),
      session: resolvePresetReference(
        scenario.sessionPreset.presetId,
        scenario.sessionPreset.label ?? sessionPreset.name,
      ),
      weather: resolvePresetReference(
        scenario.weatherPreset.presetId,
        scenario.weatherPreset.label ?? weatherPreset.name,
      ),
    },
    presetSnapshots: {
      regulation: cloneValue(regulationPreset),
      session: cloneValue(sessionPreset),
      weather: cloneValue(weatherPreset),
    },
    modelVersion: input.versions.modelVersion,
    appVersion: input.versions.appVersion,
    seed: scenario.seed,
    status: input.output.status ?? "completed",
    summaryMetrics: cloneValue(input.output.summaryMetrics),
    artifacts: runArtifactSchema
      .array()
      .parse(cloneValue(input.output.artifacts ?? [])),
    assumptionNotes: cloneValue(input.output.assumptionNotes ?? []),
  });

  return deepFreeze(runRecord);
}

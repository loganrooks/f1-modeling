import { z } from "zod";

import { assumptionNoteSchema } from "../common/provenance.js";
import {
  documentIdSchema,
  isoTimestampSchema,
  nonEmptyStringSchema,
  runRecordSchemaVersion,
} from "../common/schemaVersion.js";
import {
  presetReferenceSchema,
  scenarioDocumentSchema,
} from "../scenario/schema.js";
import {
  presetDocumentSchema,
  presetTypeSchema,
  regulationPresetDocumentSchema,
  sessionPresetDocumentSchema,
  weatherPresetDocumentSchema,
} from "../presets/schema.js";

export const runStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
]);

export const presetSnapshotSchema = presetDocumentSchema;

export const presetSnapshotsSchema = z
  .object({
    regulation: regulationPresetDocumentSchema,
    session: sessionPresetDocumentSchema,
    weather: weatherPresetDocumentSchema,
  })
  .strict();

export const presetReferencesSchema = z
  .object({
    regulation: presetReferenceSchema,
    session: presetReferenceSchema,
    weather: presetReferenceSchema,
  })
  .strict();

export const runArtifactSchema = z
  .object({
    artifactId: documentIdSchema,
    artifactType: nonEmptyStringSchema,
    label: nonEmptyStringSchema,
    location: nonEmptyStringSchema.optional(),
    mediaType: nonEmptyStringSchema.optional(),
    data: z.unknown().optional(),
  })
  .strict();

export const runRecordSchema = z
  .object({
    schemaVersion: z.literal(runRecordSchemaVersion),
    runId: documentIdSchema,
    createdAt: isoTimestampSchema,
    scenarioId: documentIdSchema,
    scenarioSnapshot: scenarioDocumentSchema,
    presetReferences: presetReferencesSchema,
    presetSnapshots: presetSnapshotsSchema,
    modelVersion: nonEmptyStringSchema,
    appVersion: nonEmptyStringSchema,
    seed: z.number().int().nonnegative(),
    status: runStatusSchema,
    summaryMetrics: z.record(z.string(), z.unknown()),
    artifacts: z.array(runArtifactSchema),
    assumptionNotes: z.array(assumptionNoteSchema),
  })
  .strict();

export type PresetSnapshot = z.infer<typeof presetSnapshotSchema>;
export type PresetSnapshots = z.infer<typeof presetSnapshotsSchema>;
export type PresetReferences = z.infer<typeof presetReferencesSchema>;
export type PresetType = z.infer<typeof presetTypeSchema>;
export type RunArtifact = z.infer<typeof runArtifactSchema>;
export type RunRecord = z.infer<typeof runRecordSchema>;
export type RunStatus = z.infer<typeof runStatusSchema>;

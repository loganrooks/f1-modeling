import { z } from "zod";

import { assumptionNoteSchema, provenanceSchema } from "../common/provenance.js";
import {
  documentIdSchema,
  isoTimestampSchema,
  nonEmptyStringSchema,
  runRecordSchemaVersion,
  schemaVersionSchema,
} from "../common/schemaVersion.js";
import { scenarioDocumentSchema } from "../scenario/schema.js";

export const runStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
]);

export const presetTypeSchema = z.enum(["regulation", "session", "weather"]);

export const presetSnapshotSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    presetId: documentIdSchema,
    presetType: presetTypeSchema,
    name: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    provenance: provenanceSchema,
    values: z.record(z.string(), z.unknown()),
  })
  .strict();

export const presetSnapshotsSchema = z
  .object({
    regulation: presetSnapshotSchema.extend({
      presetType: z.literal("regulation"),
    }),
    session: presetSnapshotSchema.extend({
      presetType: z.literal("session"),
    }),
    weather: presetSnapshotSchema.extend({
      presetType: z.literal("weather"),
    }),
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
export type PresetType = z.infer<typeof presetTypeSchema>;
export type RunArtifact = z.infer<typeof runArtifactSchema>;
export type RunRecord = z.infer<typeof runRecordSchema>;
export type RunStatus = z.infer<typeof runStatusSchema>;

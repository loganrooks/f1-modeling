import { z } from "zod";

import { assumptionNoteSchema, provenanceSchema } from "../common/provenance.js";
import {
  documentIdSchema,
  nonEmptyStringSchema,
  presetDocumentSchemaVersion,
} from "../common/schemaVersion.js";

export const presetTypeSchema = z.enum(["regulation", "session", "weather"]);

export const presetDocumentSchema = z
  .object({
    schemaVersion: z.literal(presetDocumentSchemaVersion),
    presetId: documentIdSchema,
    presetType: presetTypeSchema,
    name: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    provenance: provenanceSchema,
    assumptionNotes: z.array(assumptionNoteSchema),
    values: z.record(z.string(), z.unknown()),
  })
  .strict();

export const regulationPresetDocumentSchema = presetDocumentSchema.extend({
  presetType: z.literal("regulation"),
});

export const sessionPresetDocumentSchema = presetDocumentSchema.extend({
  presetType: z.literal("session"),
});

export const weatherPresetDocumentSchema = presetDocumentSchema.extend({
  presetType: z.literal("weather"),
});

export type PresetDocument = z.infer<typeof presetDocumentSchema>;
export type PresetType = z.infer<typeof presetTypeSchema>;
export type RegulationPresetDocument = z.infer<
  typeof regulationPresetDocumentSchema
>;
export type SessionPresetDocument = z.infer<
  typeof sessionPresetDocumentSchema
>;
export type WeatherPresetDocument = z.infer<
  typeof weatherPresetDocumentSchema
>;

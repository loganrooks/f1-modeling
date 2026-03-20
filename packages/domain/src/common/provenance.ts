import { z } from "zod";

import { isoTimestampSchema, nonEmptyStringSchema } from "./schemaVersion.js";

export const sourceTypeSchema = z.enum([
  "documented-fact",
  "engineering-inference",
  "placeholder",
]);

export const provenanceSchema = z
  .object({
    sourceType: sourceTypeSchema,
    source: nonEmptyStringSchema,
    recordedAt: isoTimestampSchema.optional(),
    referenceUrl: z.string().url().optional(),
    notes: nonEmptyStringSchema.optional(),
  })
  .strict();

export const placeholderProvenanceSchema = provenanceSchema
  .extend({
    sourceType: z.literal("placeholder"),
  })
  .strict();

export const assumptionNoteSchema = z
  .object({
    note: nonEmptyStringSchema,
    provenance: provenanceSchema,
  })
  .strict();

export type AssumptionNote = z.infer<typeof assumptionNoteSchema>;
export type PlaceholderProvenance = z.infer<typeof placeholderProvenanceSchema>;
export type Provenance = z.infer<typeof provenanceSchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;

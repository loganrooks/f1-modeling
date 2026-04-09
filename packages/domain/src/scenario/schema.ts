import { z } from "zod";

import {
  documentIdSchema,
  nonEmptyStringSchema,
  scenarioDocumentSchemaVersion,
} from "../common/schemaVersion.js";
import {
  assumptionNoteSchema,
  placeholderProvenanceSchema,
} from "../common/provenance.js";
import { racePlanSchema } from "./raceSchema.js";

export const vehicleParamsSchema = z
  .object({
    mass: z.number().positive(),
    dragFactor: z.number().nonnegative(),
    downforceFactor: z.number().nonnegative(),
    peakPower: z.number().positive(),
    gripCoefficient: z.number().positive(),
  })
  .strict();

export const presetReferenceSchema = z
  .object({
    presetId: documentIdSchema,
    label: nonEmptyStringSchema.optional(),
  })
  .strict();

export const circuitSelectionSchema = z
  .object({
    circuitId: documentIdSchema,
    name: nonEmptyStringSchema,
    configuration: nonEmptyStringSchema.optional(),
  })
  .strict();

export const driverProfilePlaceholderSchema = z
  .object({
    profileId: documentIdSchema,
    label: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    provenance: placeholderProvenanceSchema,
  })
  .strict();

export const reservedExtensionPointSchema = z
  .object({
    status: z.literal("placeholder"),
    description: nonEmptyStringSchema,
    provenance: placeholderProvenanceSchema,
  })
  .strict();

export const stintConfigSchema = z
  .object({
    totalLaps: z.number().int().positive(),
    tireCompoundId: documentIdSchema,
    electricalPolicyId: z.string().optional(),
    weatherPresetOverride: documentIdSchema.optional(),
  })
  .strict();

export const scenarioDocumentSchema = z
  .object({
    schemaVersion: z.literal(scenarioDocumentSchemaVersion),
    scenarioId: documentIdSchema,
    name: nonEmptyStringSchema,
    notes: z.array(nonEmptyStringSchema),
    circuit: circuitSelectionSchema,
    sessionPreset: presetReferenceSchema,
    regulationPreset: presetReferenceSchema,
    weatherPreset: presetReferenceSchema,
    driverProfile: driverProfilePlaceholderSchema,
    seed: z.number().int().nonnegative(),
    assumptionNotes: z.array(assumptionNoteSchema),
    vehicleParams: vehicleParamsSchema.optional(),
    stintConfig: stintConfigSchema.optional(),
    racePlan: racePlanSchema.optional(),
    observerConfigPlaceholder: reservedExtensionPointSchema,
    controllerConfigPlaceholder: reservedExtensionPointSchema,
    importedDataAlignmentPlaceholder: reservedExtensionPointSchema,
  })
  .strict();

export type VehicleParamsInput = z.infer<typeof vehicleParamsSchema>;
export type StintConfig = z.infer<typeof stintConfigSchema>;
export type CircuitSelection = z.infer<typeof circuitSelectionSchema>;
export type DriverProfilePlaceholder = z.infer<
  typeof driverProfilePlaceholderSchema
>;
export type PresetReference = z.infer<typeof presetReferenceSchema>;
export type ReservedExtensionPoint = z.infer<
  typeof reservedExtensionPointSchema
>;
export type ScenarioDocument = z.infer<typeof scenarioDocumentSchema>;

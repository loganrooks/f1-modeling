import { z } from "zod";

import { assumptionNoteSchema, provenanceSchema } from "../common/provenance.js";
import {
  circuitDocumentSchemaVersion,
  documentIdSchema,
  nonEmptyStringSchema,
} from "../common/schemaVersion.js";

/** A single distance-indexed point on the circuit centerline. */
export const circuitPointSchema = z
  .object({
    /** Distance in meters from the start/finish line. */
    distance: z.number().nonnegative(),
    /** Curvature in 1/m. Positive = left turn, negative = right turn, 0 = straight. */
    curvature: z.number(),
    /** Optional spatial x-coordinate in meters (local frame). */
    x: z.number().optional(),
    /** Optional spatial y-coordinate in meters (local frame). */
    y: z.number().optional(),
    /** Optional elevation in meters. Reserved for later phases. */
    elevation: z.number().optional(),
  })
  .strict();

/** A named sector boundary on the circuit. */
export const circuitSectorSchema = z
  .object({
    sectorIndex: z.number().int().nonnegative(),
    sectorName: nonEmptyStringSchema,
    startDistance: z.number().nonnegative(),
    endDistance: z.number().positive(),
  })
  .strict();

/** A named corner with apex and boundary distances. */
export const circuitCornerSchema = z
  .object({
    cornerIndex: z.number().int().nonnegative(),
    cornerName: nonEmptyStringSchema,
    apexDistance: z.number().nonnegative(),
    entryDistance: z.number().nonnegative(),
    exitDistance: z.number().nonnegative(),
  })
  .strict();

/** A complete circuit document with curvature array, sectors, corners, and provenance. */
export const circuitDocumentSchema = z
  .object({
    schemaVersion: z.literal(circuitDocumentSchemaVersion),
    circuitId: documentIdSchema,
    name: nonEmptyStringSchema,
    configuration: nonEmptyStringSchema,
    totalLength: z.number().positive(),
    points: z.array(circuitPointSchema).min(10),
    sectors: z.array(circuitSectorSchema).min(1),
    corners: z.array(circuitCornerSchema),
    provenance: provenanceSchema,
    assumptionNotes: z.array(assumptionNoteSchema),
  })
  .strict();

export type CircuitPoint = z.infer<typeof circuitPointSchema>;
export type CircuitSector = z.infer<typeof circuitSectorSchema>;
export type CircuitCorner = z.infer<typeof circuitCornerSchema>;
export type CircuitDocument = z.infer<typeof circuitDocumentSchema>;

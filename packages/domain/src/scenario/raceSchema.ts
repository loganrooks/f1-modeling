import { z } from "zod";

import { documentIdSchema, nonEmptyStringSchema } from "../common/schemaVersion.js";

// ---------------------------------------------------------------------------
// Stint specification (per-stint within a race plan)
// ---------------------------------------------------------------------------

export const stintSpecSchema = z
  .object({
    stintIndex: z.number().int().nonnegative(),
    totalLaps: z.number().int().positive(),
    tireCompoundId: documentIdSchema,
    electricalPolicyId: z.string().optional(),
  })
  .strict();

export type StintSpec = z.infer<typeof stintSpecSchema>;

// ---------------------------------------------------------------------------
// Interruption specification (user-authored race interruption)
// ---------------------------------------------------------------------------

export const interruptionSpecSchema = z
  .object({
    type: z.enum(["vsc", "sc", "red-flag"]),
    startLap: z.number().int().nonnegative(),
    endLap: z.number().int().positive(),
  })
  .strict()
  .refine((data) => data.endLap > data.startLap, {
    message: "endLap must be greater than startLap",
    path: ["endLap"],
  });

export type InterruptionSpec = z.infer<typeof interruptionSpecSchema>;

// ---------------------------------------------------------------------------
// Pit-lane parameters (circuit-specific pit-lane loss)
// ---------------------------------------------------------------------------

export const pitLaneParamsSchema = z
  .object({
    pitEntryTime: z.number().positive(),
    pitExitTime: z.number().positive(),
    pitBypassTime: z.number().positive(),
    serviceTime: z.number().nonnegative(),
  })
  .strict();

export type PitLaneParams = z.infer<typeof pitLaneParamsSchema>;

// ---------------------------------------------------------------------------
// Tire set allocation (per-compound)
// ---------------------------------------------------------------------------

export const tireSetAllocationSchema = z
  .object({
    compound: documentIdSchema,
    totalSets: z.number().int().positive(),
  })
  .strict();

export type TireSetAllocation = z.infer<typeof tireSetAllocationSchema>;

// ---------------------------------------------------------------------------
// Tire inventory (weekend tire tracking)
// ---------------------------------------------------------------------------

export const tireInventorySchema = z
  .object({
    allocation: z.array(tireSetAllocationSchema).min(1),
    used: z.array(
      z
        .object({
          compound: documentIdSchema,
          session: z.string(),
          stintIndex: z.number().int().nonnegative().optional(),
        })
        .strict(),
    ),
  })
  .strict();

export type TireInventory = z.infer<typeof tireInventorySchema>;

// ---------------------------------------------------------------------------
// Race plan (complete multi-stint race specification)
// ---------------------------------------------------------------------------

export const racePlanSchema = z
  .object({
    stints: z.array(stintSpecSchema).min(1),
    interruptions: z.array(interruptionSpecSchema).optional(),
    pitLaneParams: pitLaneParamsSchema,
    tireInventory: tireInventorySchema.optional(),
    totalRaceLaps: z.number().int().positive(),
  })
  .strict();

export type RacePlan = z.infer<typeof racePlanSchema>;

// ---------------------------------------------------------------------------
// Branch point (fork metadata on run record)
// ---------------------------------------------------------------------------

export const branchPointSchema = z
  .object({
    stintIndex: z.number().int().nonnegative(),
    raceLap: z.number().int().nonnegative(),
    branchType: z.enum(["stint-boundary"]),
  })
  .strict();

export type BranchPoint = z.infer<typeof branchPointSchema>;

/**
 * Tire-set inventory validation and tracking.
 *
 * FIA Sporting Regulations 2024-2025. 13 sets per standard weekend
 * (2H/3M/8S). 2026 allocation TBD -- use as configurable default.
 *
 * Validates that a race plan does not exceed allocated tire sets per
 * compound, and enforces the mandatory two-compound rule for dry races.
 * After execution, tracks which sets were used by session and stint.
 */

import type { StintSpec } from "./types.js";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/** Per-compound tire set allocation for the weekend. */
export interface TireSetAllocation {
  /** Compound identifier (matches CompoundId but string for flexibility). */
  compound: string;
  /** Total sets allocated for the weekend. */
  totalSets: number;
}

/** Record of a tire set used in a session/stint. */
export interface TireUsageEntry {
  /** Compound identifier. */
  compound: string;
  /** Session in which the set was used (e.g. "race", "qualifying", "FP1"). */
  session: string;
  /** Stint index within the session, if applicable. */
  stintIndex?: number;
}

// ---------------------------------------------------------------------------
// Default allocation
// ---------------------------------------------------------------------------

/**
 * Standard 2024-2025 tire allocation: 13 sets per weekend.
 *
 * FIA Sporting Regulations 2024-2025. 2026 allocation TBD -- use as
 * configurable default.
 */
export const DEFAULT_TIRE_ALLOCATION: TireSetAllocation[] = [
  { compound: "hard", totalSets: 2 },
  { compound: "medium", totalSets: 3 },
  { compound: "soft", totalSets: 8 },
];

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Wet-condition compound identifiers (exempt from two-compound rule). */
const WET_COMPOUNDS = new Set(["intermediate", "wet"]);

/**
 * Validates that a race plan does not exceed allocated tire sets per compound,
 * and enforces the mandatory two-compound rule for dry races.
 *
 * This is a PRE-EXECUTION validation. The race engine should not run if
 * inventory validation fails.
 *
 * @param stints - Ordered array of stint specifications from the race plan.
 * @param allocation - Per-compound tire set allocation for the weekend.
 * @param priorUsage - Optional prior usage from qualifying or other sessions.
 * @returns Validation result with errors array (empty if valid).
 */
export function validateTireInventory(
  stints: readonly StintSpec[],
  allocation: readonly TireSetAllocation[],
  priorUsage: readonly TireUsageEntry[] = [],
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Count sets used by compound: race stints + prior usage
  const usedByCompound = new Map<string, number>();

  for (const stint of stints) {
    const compound = stint.tireCompound.compoundId;
    usedByCompound.set(compound, (usedByCompound.get(compound) ?? 0) + 1);
  }

  for (const entry of priorUsage) {
    usedByCompound.set(entry.compound, (usedByCompound.get(entry.compound) ?? 0) + 1);
  }

  // Check each compound against allocation limits
  for (const [compound, used] of usedByCompound) {
    const alloc = allocation.find((a) => a.compound === compound);
    const available = alloc?.totalSets ?? 0;

    if (used > available) {
      errors.push(
        `${compound} tire allocation exceeded: used ${used} of ${available} available sets`,
      );
    }
  }

  // Mandatory two-compound rule: a dry race must use at least two
  // different dry compounds across all stints. Skip check if any stint
  // uses intermediate or wet (wet races have different rules).
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

// ---------------------------------------------------------------------------
// Usage tracking
// ---------------------------------------------------------------------------

/**
 * Produces an array of TireUsageEntry objects from a completed race's stint list.
 *
 * Each stint produces one entry recording the compound and stint index
 * within the session. This is used after execution to update the tire
 * inventory ledger for subsequent sessions.
 *
 * @param stints - Ordered array of stint specifications from the completed race.
 * @param session - Session name (e.g. "race", "qualifying").
 * @returns Array of usage entries, one per stint.
 */
export function trackTireUsage(
  stints: readonly StintSpec[],
  session: string,
): TireUsageEntry[] {
  return stints.map((stint) => ({
    compound: stint.tireCompound.compoundId,
    session,
    stintIndex: stint.stintIndex,
  }));
}

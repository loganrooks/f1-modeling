/**
 * Unit tests for tire inventory validation and usage tracking.
 *
 * Validates per-compound allocation limits, mandatory two-compound
 * dry-race rule, prior session usage accounting, wet-compound
 * exemptions, and trackTireUsage ledger output.
 */

import { describe, expect, it } from "vitest";

import {
  DEFAULT_TIRE_ALLOCATION,
  validateTireInventory,
  trackTireUsage,
  type TireSetAllocation,
  type TireUsageEntry,
} from "../raceModel/tireInventory.js";
import type { StintSpec } from "../raceModel/types.js";
import { DEFAULT_CONSERVATIVE_POLICY } from "../stintModel/index.js";
import type { CompoundId } from "../stintModel/types.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a minimal StintSpec with the specified compound ID. */
function makeStintSpec(
  compoundId: string,
  stintIndex: number,
  totalLaps: number = 15,
): StintSpec {
  return {
    stintIndex,
    totalLaps,
    tireCompound: {
      compoundId: compoundId as CompoundId,
      peakGrip: 1.0,
      baseWearRate: 0.01,
      wearAcceleration: 0.5,
      cliffThreshold: 0.7,
      cliffSeverity: 0.6,
      optimalTempLow: 85,
      optimalTempHigh: 115,
      thermalSensitivity: 0.003,
      warmupRate: 0.15,
      provenance: "test-fixture",
    },
    electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
  };
}

// ---------------------------------------------------------------------------
// validateTireInventory
// ---------------------------------------------------------------------------

describe("validateTireInventory", () => {
  it("valid 2-stop race (soft, medium, hard): passes with standard allocation", () => {
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("medium", 1),
      makeStintSpec("hard", 2),
    ];
    const result = validateTireInventory(stints, DEFAULT_TIRE_ALLOCATION);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("over-allocation: 9 soft stints with only 8 available: fails with descriptive error", () => {
    const stints = Array.from({ length: 9 }, (_, i) =>
      makeStintSpec("soft", i),
    );
    // Add a medium stint to satisfy two-compound rule
    stints.push(makeStintSpec("medium", 9));

    const result = validateTireInventory(stints, DEFAULT_TIRE_ALLOCATION);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes("soft"))).toBe(true);
    expect(result.errors.some((e) => e.includes("exceeded"))).toBe(true);
  });

  it("under-allocation of a compound used: fails when compound not in allocation", () => {
    // Use a compound that's not in the allocation at all
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("hypersoft", 1), // Not in allocation
    ];
    const result = validateTireInventory(stints, DEFAULT_TIRE_ALLOCATION);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("hypersoft"))).toBe(true);
  });

  it("prior usage from qualifying reduces available sets", () => {
    // 6 softs used in qualifying + 3 in race = 9 > 8 available
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("soft", 1),
      makeStintSpec("soft", 2),
    ];
    const priorUsage: TireUsageEntry[] = Array.from({ length: 6 }, (_, i) => ({
      compound: "soft",
      session: "qualifying",
      stintIndex: i,
    }));

    // Need a second dry compound to pass two-compound rule
    stints.push(makeStintSpec("medium", 3));

    const result = validateTireInventory(
      stints,
      DEFAULT_TIRE_ALLOCATION,
      priorUsage,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("soft"))).toBe(true);
  });

  it("mandatory two-compound rule: all stints on soft = fails (dry race)", () => {
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("soft", 1),
    ];
    const result = validateTireInventory(stints, DEFAULT_TIRE_ALLOCATION);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("two-compound"))).toBe(true);
  });

  it("two-compound rule passes when at least two different dry compounds used", () => {
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("hard", 1),
    ];
    const result = validateTireInventory(stints, DEFAULT_TIRE_ALLOCATION);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("wet compound stints skip the two-compound dry rule", () => {
    // All stints on wet/intermediate -> two-compound rule doesn't apply
    const stints = [
      makeStintSpec("intermediate", 0),
      makeStintSpec("intermediate", 1),
    ];
    // Custom allocation that includes wet compounds
    const allocation: TireSetAllocation[] = [
      { compound: "intermediate", totalSets: 4 },
      { compound: "wet", totalSets: 3 },
    ];
    const result = validateTireInventory(stints, allocation);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("empty allocation array for a compound: any use of that compound fails", () => {
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("medium", 1),
    ];
    // Empty allocation -- no compounds available
    const emptyAllocation: TireSetAllocation[] = [];
    const result = validateTireInventory(stints, emptyAllocation);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2); // Both soft and medium fail
  });

  it("valid plan with tireInventory.used from prior sessions", () => {
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("medium", 1),
    ];
    // 2 softs used in prior sessions, still under 8 total
    const priorUsage: TireUsageEntry[] = [
      { compound: "soft", session: "FP1", stintIndex: 0 },
      { compound: "soft", session: "FP2", stintIndex: 0 },
    ];
    // 2 prior + 1 race = 3 softs (under 8), 1 medium (under 3)
    const result = validateTireInventory(
      stints,
      DEFAULT_TIRE_ALLOCATION,
      priorUsage,
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// trackTireUsage
// ---------------------------------------------------------------------------

describe("trackTireUsage", () => {
  it("3-stint race produces 3 usage entries", () => {
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("medium", 1),
      makeStintSpec("hard", 2),
    ];
    const usage = trackTireUsage(stints, "race");
    expect(usage).toHaveLength(3);
  });

  it("each entry has correct compound, session, and stintIndex", () => {
    const stints = [
      makeStintSpec("soft", 0),
      makeStintSpec("medium", 1),
      makeStintSpec("hard", 2),
    ];
    const usage = trackTireUsage(stints, "race");

    expect(usage[0]).toEqual({
      compound: "soft",
      session: "race",
      stintIndex: 0,
    });
    expect(usage[1]).toEqual({
      compound: "medium",
      session: "race",
      stintIndex: 1,
    });
    expect(usage[2]).toEqual({
      compound: "hard",
      session: "race",
      stintIndex: 2,
    });
  });

  it("session string propagates correctly", () => {
    const stints = [makeStintSpec("soft", 0)];
    const usage = trackTireUsage(stints, "qualifying");
    expect(usage[0]!.session).toBe("qualifying");
  });
});

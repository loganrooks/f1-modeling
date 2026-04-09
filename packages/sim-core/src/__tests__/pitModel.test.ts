/**
 * Unit tests for pit-lane loss model and interruption effects.
 *
 * Validates computePitLoss formula (L_pit = traversalDelta + serviceTime),
 * discount factors under safety conditions, interruption lap-time factors,
 * and applyInterruptionsToLapTimes behavior including race-to-stint lap
 * mapping, immutability, and red-flag zeroing.
 */

import { describe, expect, it } from "vitest";

import { computePitLoss, DEFAULT_PIT_LANE_PARAMS } from "../raceModel/pitModel.js";
import {
  applyInterruptionsToLapTimes,
  interruptionLapTimeFactor,
  pitLossDiscountFactor,
} from "../raceModel/interruptionModel.js";
import type { InterruptionSpec, PitLaneParams } from "../raceModel/types.js";

// ---------------------------------------------------------------------------
// computePitLoss
// ---------------------------------------------------------------------------

describe("computePitLoss", () => {
  it("default params produce a total loss in the 18-25s range", () => {
    const result = computePitLoss(DEFAULT_PIT_LANE_PARAMS);
    expect(result.totalLoss).toBeGreaterThanOrEqual(18);
    expect(result.totalLoss).toBeLessThanOrEqual(25);
  });

  it("traversalDelta = (pitEntryTime + pitExitTime) - pitBypassTime", () => {
    const result = computePitLoss(DEFAULT_PIT_LANE_PARAMS);
    const expected =
      DEFAULT_PIT_LANE_PARAMS.pitEntryTime +
      DEFAULT_PIT_LANE_PARAMS.pitExitTime -
      DEFAULT_PIT_LANE_PARAMS.pitBypassTime;
    expect(result.traversalDelta).toBeCloseTo(expected, 10);
  });

  it("totalLoss = traversalDelta + serviceTime (no discount)", () => {
    const result = computePitLoss(DEFAULT_PIT_LANE_PARAMS);
    expect(result.totalLoss).toBeCloseTo(
      result.traversalDelta + result.serviceTime,
      10,
    );
  });

  it("with discount factor 0.65 (VSC): totalLoss is 65% of green-flag loss", () => {
    const greenFlag = computePitLoss(DEFAULT_PIT_LANE_PARAMS);
    const vsc = computePitLoss(DEFAULT_PIT_LANE_PARAMS, 0.65);
    expect(vsc.totalLoss).toBeCloseTo(greenFlag.totalLoss * 0.65, 10);
  });

  it("with discount factor 0.40 (SC): totalLoss is 40% of green-flag loss", () => {
    const greenFlag = computePitLoss(DEFAULT_PIT_LANE_PARAMS);
    const sc = computePitLoss(DEFAULT_PIT_LANE_PARAMS, 0.4);
    expect(sc.totalLoss).toBeCloseTo(greenFlag.totalLoss * 0.4, 10);
  });

  it("with discount factor 0.0 (red flag): totalLoss is 0", () => {
    const result = computePitLoss(DEFAULT_PIT_LANE_PARAMS, 0.0);
    expect(result.totalLoss).toBe(0);
  });

  it("custom params: different pit configurations produce expected results", () => {
    const customParams: PitLaneParams = {
      pitEntryTime: 15,
      pitExitTime: 12,
      pitBypassTime: 6,
      serviceTime: 3.0,
    };
    const result = computePitLoss(customParams);
    // traversalDelta = 15 + 12 - 6 = 21
    // totalLoss = 21 + 3.0 = 24.0
    expect(result.traversalDelta).toBeCloseTo(21, 10);
    expect(result.totalLoss).toBeCloseTo(24.0, 10);
    expect(result.serviceTime).toBe(3.0);
  });
});

// ---------------------------------------------------------------------------
// interruptionLapTimeFactor
// ---------------------------------------------------------------------------

describe("interruptionLapTimeFactor", () => {
  it('"vsc" returns 1.30', () => {
    expect(interruptionLapTimeFactor("vsc")).toBe(1.3);
  });

  it('"sc" returns 1.40', () => {
    expect(interruptionLapTimeFactor("sc")).toBe(1.4);
  });

  it('"red-flag" returns Infinity', () => {
    expect(interruptionLapTimeFactor("red-flag")).toBe(Infinity);
  });
});

// ---------------------------------------------------------------------------
// pitLossDiscountFactor
// ---------------------------------------------------------------------------

describe("pitLossDiscountFactor", () => {
  it('"vsc" returns 0.65', () => {
    expect(pitLossDiscountFactor("vsc")).toBe(0.65);
  });

  it('"sc" returns 0.40', () => {
    expect(pitLossDiscountFactor("sc")).toBe(0.4);
  });

  it('"red-flag" returns 0.0', () => {
    expect(pitLossDiscountFactor("red-flag")).toBe(0.0);
  });
});

// ---------------------------------------------------------------------------
// applyInterruptionsToLapTimes
// ---------------------------------------------------------------------------

describe("applyInterruptionsToLapTimes", () => {
  const baseLapTimes = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89];

  it("no interruptions: output equals input (identity)", () => {
    const result = applyInterruptionsToLapTimes(baseLapTimes, [], 0);
    expect(result).toEqual(baseLapTimes);
  });

  it("VSC from lap 5-8 (race-level) with raceStartLap 3: only stint-local laps 2-4 modified", () => {
    // Stint starts at race lap 3. VSC at race laps 5-8.
    // stint-local laps affected: 5-3=2, 6-3=3, 7-3=4 (endLap 8 is exclusive)
    const interruptions: InterruptionSpec[] = [
      { type: "vsc", startLap: 5, endLap: 8 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 3);

    // Unaffected
    expect(result[0]).toBe(80);
    expect(result[1]).toBe(81);
    // Affected (stint-local laps 2, 3, 4)
    expect(result[2]).toBeCloseTo(82 * 1.3, 5);
    expect(result[3]).toBeCloseTo(83 * 1.3, 5);
    expect(result[4]).toBeCloseTo(84 * 1.3, 5);
    // Unaffected (endLap 8 is exclusive)
    expect(result[5]).toBe(85);
  });

  it("SC from lap 10-12: affected laps are 40% slower", () => {
    // Stint starts at race lap 5. SC at race laps 10-12.
    // stint-local laps: 10-5=5, 11-5=6 (endLap 12 exclusive)
    const interruptions: InterruptionSpec[] = [
      { type: "sc", startLap: 10, endLap: 12 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 5);

    expect(result[5]).toBeCloseTo(85 * 1.4, 5);
    expect(result[6]).toBeCloseTo(86 * 1.4, 5);
    expect(result[7]).toBe(87); // Unaffected
  });

  it("red flag: affected laps set to 0", () => {
    const interruptions: InterruptionSpec[] = [
      { type: "red-flag", startLap: 3, endLap: 6 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 0);

    expect(result[2]).toBe(82); // Unaffected
    expect(result[3]).toBe(0); // Red flag
    expect(result[4]).toBe(0); // Red flag
    expect(result[5]).toBe(0); // Red flag
    expect(result[6]).toBe(86); // Unaffected
  });

  it("interruption outside stint range: no modification", () => {
    const interruptions: InterruptionSpec[] = [
      { type: "vsc", startLap: 20, endLap: 25 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 0);
    expect(result).toEqual(baseLapTimes);
  });

  it("multiple interruptions: each applied independently", () => {
    const interruptions: InterruptionSpec[] = [
      { type: "vsc", startLap: 1, endLap: 3 },
      { type: "sc", startLap: 5, endLap: 7 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 0);

    // VSC at stint-local laps 1, 2
    expect(result[1]).toBeCloseTo(81 * 1.3, 5);
    expect(result[2]).toBeCloseTo(82 * 1.3, 5);
    // SC at stint-local laps 5, 6
    expect(result[5]).toBeCloseTo(85 * 1.4, 5);
    expect(result[6]).toBeCloseTo(86 * 1.4, 5);
    // Others unaffected
    expect(result[0]).toBe(80);
    expect(result[3]).toBe(83);
    expect(result[4]).toBe(84);
    expect(result[7]).toBe(87);
  });

  it("output is a new array (input not mutated)", () => {
    const original = [...baseLapTimes];
    const interruptions: InterruptionSpec[] = [
      { type: "vsc", startLap: 0, endLap: 5 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 0);

    // Input unchanged
    expect(baseLapTimes).toEqual(original);
    // Output is different object
    expect(result).not.toBe(baseLapTimes);
    // But modified values differ
    expect(result[0]).not.toBe(baseLapTimes[0]);
  });
});

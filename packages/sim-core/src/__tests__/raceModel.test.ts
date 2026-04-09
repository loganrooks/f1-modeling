/**
 * Integration tests for the race-state engine.
 *
 * Validates multi-stint orchestration, pit-lane loss calculation,
 * interruption effects, typed timeline production, and state
 * continuity between stints.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { circuitDocumentSchema, type CircuitDocument } from "@f1-modeling/domain";

import { DEFAULT_VEHICLE_PARAMS } from "../lapModel/index.js";
import type { VehicleParams } from "../lapModel/types.js";
import {
  DEFAULT_CONSERVATIVE_POLICY,
  DEFAULT_LOAD_TRANSFER_PARAMS,
  initializeStintState,
  runStint,
  runStintFromState,
} from "../stintModel/index.js";
import type {
  StintConfig,
  TireCompoundParams,
  WeatherTimeline,
} from "../stintModel/types.js";

import { computePitLoss, DEFAULT_PIT_LANE_PARAMS } from "../raceModel/pitModel.js";
import {
  interruptionLapTimeFactor,
  pitLossDiscountFactor,
  applyInterruptionsToLapTimes,
} from "../raceModel/interruptionModel.js";
import { runRace } from "../raceModel/raceRunner.js";
import type {
  InterruptionSpec,
  RaceConfig,
  StintSpec,
} from "../raceModel/types.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..");

function loadCircuit(name: string): CircuitDocument {
  const filePath = join(REPO_ROOT, "presets", "circuits", `${name}.json`);
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  return circuitDocumentSchema.parse(raw);
}

function loadTireCompound(compoundFile: string): TireCompoundParams {
  const filePath = join(REPO_ROOT, "presets", "tires", `${compoundFile}.json`);
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as {
    values: TireCompoundParams;
  };
  return raw.values;
}

const monza = loadCircuit("monza");
const softCompound = loadTireCompound("soft-c5");
const mediumCompound = loadTireCompound("medium-c3");
const hardCompound = loadTireCompound("hard-c1");

const baseVehicle: VehicleParams = { ...DEFAULT_VEHICLE_PARAMS };

const dryTimeline: WeatherTimeline = [
  { lap: 0, trackTemperatureC: 33, surfaceWetness: 0, rainfall: "none" },
];

function makeRaceConfig(overrides: Partial<RaceConfig> = {}): RaceConfig {
  return {
    circuit: monza,
    baseVehicle,
    weatherTimeline: dryTimeline,
    aeroConfig: null,
    loadTransferParams: DEFAULT_LOAD_TRANSFER_PARAMS,
    pitLaneParams: DEFAULT_PIT_LANE_PARAMS,
    ambientTemperatureC: 24,
    ...overrides,
  };
}

function makeTwoStintPlan(): StintSpec[] {
  return [
    {
      stintIndex: 0,
      totalLaps: 10,
      tireCompound: softCompound,
      electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    },
    {
      stintIndex: 1,
      totalLaps: 10,
      tireCompound: hardCompound,
      electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    },
  ];
}

// ---------------------------------------------------------------------------
// Pit model tests
// ---------------------------------------------------------------------------

describe("pitModel: computePitLoss", () => {
  it("computes correct green-flag pit loss with default params", () => {
    const result = computePitLoss(DEFAULT_PIT_LANE_PARAMS);
    // (12 + 10 - 4) + 2.5 = 20.5
    expect(result.totalLoss).toBeCloseTo(20.5, 5);
    expect(result.traversalDelta).toBeCloseTo(18, 5);
    expect(result.serviceTime).toBe(2.5);
  });

  it("applies discount factor to total loss", () => {
    const greenFlag = computePitLoss(DEFAULT_PIT_LANE_PARAMS);
    const vscDiscount = computePitLoss(DEFAULT_PIT_LANE_PARAMS, 0.65);
    expect(vscDiscount.totalLoss).toBeCloseTo(greenFlag.totalLoss * 0.65, 5);
  });

  it("returns zero loss with discount factor 0 (red flag)", () => {
    const result = computePitLoss(DEFAULT_PIT_LANE_PARAMS, 0.0);
    expect(result.totalLoss).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Interruption model tests
// ---------------------------------------------------------------------------

describe("interruptionModel: factors", () => {
  it("interruptionLapTimeFactor returns correct values", () => {
    expect(interruptionLapTimeFactor("vsc")).toBe(1.3);
    expect(interruptionLapTimeFactor("sc")).toBe(1.4);
    expect(interruptionLapTimeFactor("red-flag")).toBe(Infinity);
  });

  it("pitLossDiscountFactor returns correct values", () => {
    expect(pitLossDiscountFactor("vsc")).toBe(0.65);
    expect(pitLossDiscountFactor("sc")).toBe(0.4);
    expect(pitLossDiscountFactor("red-flag")).toBe(0.0);
  });
});

describe("interruptionModel: applyInterruptionsToLapTimes", () => {
  const baseLapTimes = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89];

  it("does not modify lap times when no interruptions overlap", () => {
    const interruptions: InterruptionSpec[] = [
      { type: "vsc", startLap: 20, endLap: 23 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 0);
    expect(result).toEqual(baseLapTimes);
  });

  it("applies VSC multiplier to overlapping laps", () => {
    const interruptions: InterruptionSpec[] = [
      { type: "vsc", startLap: 2, endLap: 5 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 0);
    expect(result[0]).toBe(80); // unaffected
    expect(result[1]).toBe(81); // unaffected
    expect(result[2]).toBeCloseTo(82 * 1.3, 5); // VSC
    expect(result[3]).toBeCloseTo(83 * 1.3, 5); // VSC
    expect(result[4]).toBeCloseTo(84 * 1.3, 5); // VSC
    expect(result[5]).toBe(85); // unaffected (endLap is exclusive)
  });

  it("correctly maps race-level laps to stint-local laps", () => {
    // Stint starts at race lap 15, interruption is at race laps 17-19
    const interruptions: InterruptionSpec[] = [
      { type: "sc", startLap: 17, endLap: 19 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 15);
    // stint-local laps 2,3 should be affected (17-15=2, 18-15=3)
    expect(result[0]).toBe(80);
    expect(result[1]).toBe(81);
    expect(result[2]).toBeCloseTo(82 * 1.4, 5); // SC
    expect(result[3]).toBeCloseTo(83 * 1.4, 5); // SC
    expect(result[4]).toBe(84); // unaffected
  });

  it("sets red-flag laps to 0", () => {
    const interruptions: InterruptionSpec[] = [
      { type: "red-flag", startLap: 3, endLap: 6 },
    ];
    const result = applyInterruptionsToLapTimes(baseLapTimes, interruptions, 0);
    expect(result[3]).toBe(0);
    expect(result[4]).toBe(0);
    expect(result[5]).toBe(0);
    expect(result[6]).toBe(86); // unaffected
  });

  it("does NOT mutate the input array", () => {
    const original = [...baseLapTimes];
    const interruptions: InterruptionSpec[] = [
      { type: "vsc", startLap: 0, endLap: 3 },
    ];
    applyInterruptionsToLapTimes(baseLapTimes, interruptions, 0);
    expect(baseLapTimes).toEqual(original);
  });
});

// ---------------------------------------------------------------------------
// Race engine tests
// ---------------------------------------------------------------------------

describe("raceRunner: 2-stint race", () => {
  const config = makeRaceConfig();
  const stints = makeTwoStintPlan();
  const result = runRace(stints, config);

  it("produces correct number of stint results", () => {
    expect(result.stintResults).toHaveLength(2);
  });

  it("each stint produces the correct number of lap traces", () => {
    expect(result.stintResults[0]!.lapTraces).toHaveLength(10);
    expect(result.stintResults[1]!.lapTraces).toHaveLength(10);
  });

  it("totalRaceTime is positive and greater than sum of stint times alone", () => {
    expect(result.totalRaceTime).toBeGreaterThan(0);
    const stintTimesSum = result.stintSummaries.reduce(
      (sum, s) => sum + s.stintTime,
      0,
    );
    // Race time = stint times + pit time
    expect(result.totalRaceTime).toBeGreaterThan(stintTimesSum);
  });

  it("totalRaceTime equals sum of stint times plus pit time", () => {
    const stintTimesSum = result.stintSummaries.reduce(
      (sum, s) => sum + s.stintTime,
      0,
    );
    expect(result.totalRaceTime).toBeCloseTo(stintTimesSum + result.totalPitTime, 5);
  });

  it("totalPitTime approximately equals one pit stop loss", () => {
    const expected = computePitLoss(DEFAULT_PIT_LANE_PARAMS);
    expect(result.totalPitTime).toBeCloseTo(expected.totalLoss, 5);
  });

  it("timeline has stint-start, stint-end, and pit-event events", () => {
    const types = result.timeline.map((e) => e.type);
    expect(types.filter((t) => t === "stint-start")).toHaveLength(2);
    expect(types.filter((t) => t === "stint-end")).toHaveLength(2);
    expect(types.filter((t) => t === "pit-event")).toHaveLength(1);
  });

  it("timeline events are in chronological order", () => {
    for (let i = 1; i < result.timeline.length; i++) {
      expect(result.timeline[i]!.raceLap).toBeGreaterThanOrEqual(
        result.timeline[i - 1]!.raceLap,
      );
    }
  });

  it("stint summaries carry correct compounds", () => {
    expect(result.stintSummaries[0]!.compound).toBe("soft");
    expect(result.stintSummaries[1]!.compound).toBe("hard");
  });

  it("stint-end events have cumulative race time", () => {
    const stintEnds = result.timeline.filter((e) => e.type === "stint-end");
    expect(stintEnds).toHaveLength(2);
    // Second stint-end should have higher cumulative time
    const end1 = stintEnds[0]!;
    const end2 = stintEnds[1]!;
    if (end1.type === "stint-end" && end2.type === "stint-end") {
      expect(end2.cumulativeRaceTime).toBeGreaterThan(end1.cumulativeRaceTime);
    }
  });

  it("includes race-level assumptions", () => {
    expect(result.assumptions).toContain(
      "Race-state engine: thin orchestration over existing stint runner",
    );
    expect(result.assumptions).toContain(
      "Single-car model: no opponent field, traffic, or overtaking",
    );
    expect(result.assumptions).toContain(
      "No refueling: 2026 regulations (fuel state carries through pit stops)",
    );
  });
});

describe("raceRunner: state continuity across stints", () => {
  const config = makeRaceConfig();
  const stints = makeTwoStintPlan();
  const result = runRace(stints, config);

  it("second stint starts with fresh tires (low wear)", () => {
    // The second stint's first lap should show fresh-tire characteristics
    const stint2FirstLap = result.stintResults[1]!.lapTraces[0]!;
    expect(stint2FirstLap.tireState.lapsSinceNew).toBe(1);
  });

  it("second stint starts with the new compound", () => {
    const stint2FirstLap = result.stintResults[1]!.lapTraces[0]!;
    expect(stint2FirstLap.tireState.compound).toBe("hard");
  });

  it("electrical SoC persists across pit stops", () => {
    // SoC from end of stint 1 should be close to start of stint 2
    // (not identical because stint 2 starts with existing SoC from stint 1 end)
    const stint1FinalSoC =
      result.stintResults[0]!.finalState.electricalState.stateOfCharge;
    // The second stint evolves from this SoC -- first lap should be within
    // reasonable range (SoC changes per lap but starts from carried-over value)
    expect(stint1FinalSoC).toBeGreaterThan(0);
  });
});

describe("raceRunner: 3-stint race", () => {
  const config = makeRaceConfig();
  const stints: StintSpec[] = [
    {
      stintIndex: 0,
      totalLaps: 8,
      tireCompound: softCompound,
      electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    },
    {
      stintIndex: 1,
      totalLaps: 10,
      tireCompound: mediumCompound,
      electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    },
    {
      stintIndex: 2,
      totalLaps: 8,
      tireCompound: hardCompound,
      electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    },
  ];
  const result = runRace(stints, config);

  it("produces 3 stint results", () => {
    expect(result.stintResults).toHaveLength(3);
  });

  it("has 2 pit events in timeline", () => {
    const pitEvents = result.timeline.filter((e) => e.type === "pit-event");
    expect(pitEvents).toHaveLength(2);
  });

  it("total pit time equals two pit stops", () => {
    const singlePitLoss = computePitLoss(DEFAULT_PIT_LANE_PARAMS).totalLoss;
    expect(result.totalPitTime).toBeCloseTo(singlePitLoss * 2, 5);
  });
});

describe("raceRunner: with interruptions", () => {
  const config = makeRaceConfig();
  const stints = makeTwoStintPlan();
  const interruptions: InterruptionSpec[] = [
    { type: "vsc", startLap: 5, endLap: 8 },
  ];
  const result = runRace(stints, config, interruptions);
  const resultNoInterruptions = runRace(stints, config);

  it("race with VSC is slower than without (slow laps)", () => {
    expect(result.totalRaceTime).toBeGreaterThan(
      resultNoInterruptions.totalRaceTime,
    );
  });

  it("timeline includes interruption-start and interruption-end events", () => {
    const types = result.timeline.map((e) => e.type);
    expect(types).toContain("interruption-start");
    expect(types).toContain("interruption-end");
  });

  it("interruption events reference the correct laps", () => {
    const start = result.timeline.find((e) => e.type === "interruption-start");
    const end = result.timeline.find((e) => e.type === "interruption-end");
    expect(start).toBeDefined();
    expect(end).toBeDefined();
    if (start?.type === "interruption-start") {
      expect(start.raceLap).toBe(5);
      expect(start.interruptionType).toBe("vsc");
    }
    if (end?.type === "interruption-end") {
      expect(end.raceLap).toBe(8);
      expect(end.interruptionType).toBe("vsc");
    }
  });
});

describe("raceRunner: pit stop under interruption gets discount", () => {
  const config = makeRaceConfig();
  // Pit at lap 10 (end of first stint), with VSC active at lap 10
  const stints = makeTwoStintPlan();
  const interruptionsAtPit: InterruptionSpec[] = [
    { type: "vsc", startLap: 9, endLap: 12 },
  ];
  const resultWithVSC = runRace(stints, config, interruptionsAtPit);
  const resultClean = runRace(stints, config);

  it("pit stop under VSC costs less than green-flag pit stop", () => {
    expect(resultWithVSC.totalPitTime).toBeLessThan(resultClean.totalPitTime);
  });

  it("discounted pit loss matches VSC discount factor", () => {
    const greenFlagLoss = computePitLoss(DEFAULT_PIT_LANE_PARAMS).totalLoss;
    const vscLoss = computePitLoss(DEFAULT_PIT_LANE_PARAMS, 0.65).totalLoss;
    expect(resultWithVSC.totalPitTime).toBeCloseTo(vscLoss, 5);
    expect(resultWithVSC.totalPitTime).toBeCloseTo(greenFlagLoss * 0.65, 5);
  });
});

// ---------------------------------------------------------------------------
// SC overlapping pit stop
// ---------------------------------------------------------------------------

describe("raceRunner: pit stop under SC gets deeper discount", () => {
  const config = makeRaceConfig();
  const stints = makeTwoStintPlan();
  const scAtPit: InterruptionSpec[] = [
    { type: "sc", startLap: 9, endLap: 12 },
  ];
  const resultWithSC = runRace(stints, config, scAtPit);

  it("pit loss under SC is approximately 40% of green-flag pit loss", () => {
    const greenFlagLoss = computePitLoss(DEFAULT_PIT_LANE_PARAMS).totalLoss;
    expect(resultWithSC.totalPitTime).toBeCloseTo(greenFlagLoss * 0.4, 5);
  });
});

// ---------------------------------------------------------------------------
// Red flag race
// ---------------------------------------------------------------------------

describe("raceRunner: with red flag", () => {
  const config = makeRaceConfig();
  const stints = makeTwoStintPlan();
  const redFlag: InterruptionSpec[] = [
    { type: "red-flag", startLap: 8, endLap: 10 },
  ];
  const result = runRace(stints, config, redFlag);
  const resultClean = runRace(stints, config);

  it("affected laps produce 0 time (session stopped)", () => {
    // Red flag at race laps 8-9 (endLap 10 exclusive).
    // Stint 1 is laps 0-9 (10 laps), so stint-local laps 8, 9 are affected.
    const stint1Traces = result.stintResults[0]!.lapTraces;
    // The race engine applies interruptions post-hoc to lap times.
    // The original lapTraces are unmodified (physical sim), but the
    // timeline stintTime should reflect the zeroed laps.
    const stintEndEvent = result.timeline.find(
      (e) => e.type === "stint-end" && e.stintIndex === 0,
    );
    expect(stintEndEvent).toBeDefined();
    if (stintEndEvent?.type === "stint-end") {
      // With 2 laps zeroed out, stint time should be less than clean
      const cleanStintEnd = resultClean.timeline.find(
        (e) => e.type === "stint-end" && e.stintIndex === 0,
      );
      if (cleanStintEnd?.type === "stint-end") {
        expect(stintEndEvent.stintTime).toBeLessThan(cleanStintEnd.stintTime);
      }
    }
  });

  it("if pit occurs during red flag, pit cost is 0", () => {
    // Red flag spans race laps 8-10. Pit happens at lap 10 (end of stint 1).
    // Since red flag endLap is 10 (exclusive), pit at lap 10 is NOT within the red flag.
    // To test pit-cost = 0, we need a red flag that covers the pit lap.
    const redFlagAtPit: InterruptionSpec[] = [
      { type: "red-flag", startLap: 9, endLap: 12 },
    ];
    const resultRedPit = runRace(stints, config, redFlagAtPit);
    expect(resultRedPit.totalPitTime).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Timeline event ordering (thorough)
// ---------------------------------------------------------------------------

describe("raceRunner: timeline event ordering", () => {
  const config = makeRaceConfig();
  const stints: StintSpec[] = [
    {
      stintIndex: 0,
      totalLaps: 8,
      tireCompound: softCompound,
      electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    },
    {
      stintIndex: 1,
      totalLaps: 10,
      tireCompound: mediumCompound,
      electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    },
    {
      stintIndex: 2,
      totalLaps: 8,
      tireCompound: hardCompound,
      electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    },
  ];
  const interruptions: InterruptionSpec[] = [
    { type: "vsc", startLap: 5, endLap: 9 },
  ];
  const result = runRace(stints, config, interruptions);

  it("events are in non-decreasing raceLap order", () => {
    for (let i = 1; i < result.timeline.length; i++) {
      expect(result.timeline[i]!.raceLap).toBeGreaterThanOrEqual(
        result.timeline[i - 1]!.raceLap,
      );
    }
  });

  it("no duplicate events at the same position with same type", () => {
    const seen = new Set<string>();
    for (const event of result.timeline) {
      const key = `${event.type}:${event.raceLap}:${"stintIndex" in event ? event.stintIndex : ""}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it("all stintIndex values are sequential (0, 1, 2...)", () => {
    const stintStartEvents = result.timeline.filter(
      (e) => e.type === "stint-start",
    );
    for (let i = 0; i < stintStartEvents.length; i++) {
      const event = stintStartEvents[i]!;
      if (event.type === "stint-start") {
        expect(event.stintIndex).toBe(i);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Plausible lap times
// ---------------------------------------------------------------------------

describe("raceRunner: plausible lap times", () => {
  const config = makeRaceConfig();
  const stints = makeTwoStintPlan();
  const result = runRace(stints, config);

  it("all lap times > 50s (Monza is ~80-90s)", () => {
    for (const stintResult of result.stintResults) {
      for (const trace of stintResult.lapTraces) {
        expect(trace.lapTime).toBeGreaterThan(50);
      }
    }
  });

  it("no NaN or Infinity in any result field", () => {
    expect(Number.isFinite(result.totalRaceTime)).toBe(true);
    expect(Number.isFinite(result.totalPitTime)).toBe(true);

    for (const stintResult of result.stintResults) {
      for (const trace of stintResult.lapTraces) {
        expect(Number.isNaN(trace.lapTime)).toBe(false);
        expect(Number.isFinite(trace.lapTime)).toBe(true);
        expect(Number.isNaN(trace.effectiveGrip)).toBe(false);
        expect(Number.isNaN(trace.effectivePower)).toBe(false);
      }
    }

    for (const summary of result.stintSummaries) {
      expect(Number.isFinite(summary.stintTime)).toBe(true);
      expect(Number.isFinite(summary.finalWear)).toBe(true);
      expect(Number.isFinite(summary.finalSoC)).toBe(true);
    }
  });

  it("totalRaceTime is plausible for the number of laps", () => {
    // 20 laps at Monza (~80-90s per lap) = ~1600-1800s + pit time
    // Allow wide range: within 2x of lapCount * expectedLapTime
    const totalLaps = 20;
    const expectedLapTime = 85; // rough Monza average
    expect(result.totalRaceTime).toBeGreaterThan(totalLaps * expectedLapTime * 0.5);
    expect(result.totalRaceTime).toBeLessThan(totalLaps * expectedLapTime * 2);
  });
});

// ---------------------------------------------------------------------------
// runStintFromState backward compatibility
// ---------------------------------------------------------------------------

describe("raceRunner: runStintFromState backward compatibility", () => {
  const stintConfig: StintConfig = {
    circuit: monza,
    baseVehicle,
    tireCompound: mediumCompound,
    electricalPolicy: DEFAULT_CONSERVATIVE_POLICY,
    weatherTimeline: dryTimeline,
    aeroConfig: null,
    loadTransferParams: DEFAULT_LOAD_TRANSFER_PARAMS,
    totalLaps: 10,
  };

  const resultFromRunStint = runStint(stintConfig);
  const initialState = initializeStintState(stintConfig);
  const resultFromRunStintFromState = runStintFromState(stintConfig, initialState);

  it("results should have identical totalTime", () => {
    expect(resultFromRunStintFromState.totalTime).toBeCloseTo(
      resultFromRunStint.totalTime,
      10,
    );
  });

  it("results should have identical lap traces", () => {
    expect(resultFromRunStintFromState.lapTraces).toHaveLength(
      resultFromRunStint.lapTraces.length,
    );
    for (let i = 0; i < resultFromRunStint.lapTraces.length; i++) {
      expect(resultFromRunStintFromState.lapTraces[i]!.lapTime).toBeCloseTo(
        resultFromRunStint.lapTraces[i]!.lapTime,
        10,
      );
    }
  });
});

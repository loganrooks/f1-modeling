/**
 * Unit tests for the tire degradation, thermal window, and cliff behavior model.
 *
 * Tests tire subsystem in isolation: compound differentiation, cliff behavior,
 * thermal window, warm-up dynamics, and grip floor.
 */

import { describe, expect, it } from "vitest";

import {
  initializeTireState,
  tireWearGripFactor,
  tireThermalFactor,
  updateTireState,
} from "../stintModel/tireModel.js";
import type {
  EnvironmentState,
  TireCompoundParams,
  TireState,
} from "../stintModel/types.js";
import type { LapModelOutput, SpeedProfilePoint } from "../lapModel/types.js";

// ---------------------------------------------------------------------------
// Tire compound params (from presets)
// ---------------------------------------------------------------------------

const SOFT: TireCompoundParams = {
  compoundId: "soft",
  peakGrip: 1.85,
  baseWearRate: 0.030,
  wearAcceleration: 0.4,
  cliffThreshold: 0.70,
  cliffSeverity: 0.7,
  optimalTempLow: 85,
  optimalTempHigh: 115,
  thermalSensitivity: 0.008,
  warmupRate: 0.35,
  provenance: "engineering-inference",
};

const MEDIUM: TireCompoundParams = {
  compoundId: "medium",
  peakGrip: 1.70,
  baseWearRate: 0.018,
  wearAcceleration: 0.3,
  cliffThreshold: 0.80,
  cliffSeverity: 0.6,
  optimalTempLow: 95,
  optimalTempHigh: 130,
  thermalSensitivity: 0.006,
  warmupRate: 0.25,
  provenance: "engineering-inference",
};

const HARD: TireCompoundParams = {
  compoundId: "hard",
  peakGrip: 1.55,
  baseWearRate: 0.010,
  wearAcceleration: 0.2,
  cliffThreshold: 0.90,
  cliffSeverity: 0.5,
  optimalTempLow: 110,
  optimalTempHigh: 145,
  thermalSensitivity: 0.005,
  warmupRate: 0.18,
  provenance: "engineering-inference",
};

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

const DEFAULT_ENV: EnvironmentState = {
  trackTemperatureC: 33,
  ambientTemperatureC: 24,
  surfaceWetness: 0,
  rubberEvolution: 1.0,
  gripModifier: 1.0,
};

/** Minimal mock LapModelOutput with representative speed profile. */
function mockLapOutput(): LapModelOutput {
  const profile: SpeedProfilePoint[] = [];
  // 20-point profile: alternating acceleration and braking
  for (let i = 0; i < 20; i++) {
    profile.push({
      distance: i * 250,
      speed: 50 + i * 5,
      regime: i % 4 === 3 ? "braking" : "accelerating-grip",
      curvature: i % 4 === 2 ? 0.01 : 0,
      lateralG: i % 4 === 2 ? 1.5 : 0,
      longitudinalG: i % 4 === 3 ? -2.0 : 1.0,
      timeIncrement: i === 0 ? 0 : 0.5,
    });
  }
  return {
    lapTime: 80,
    speedProfile: profile,
    sectorResults: [
      { sectorIndex: 0, sectorName: "S1", startDistance: 0, endDistance: 1500, sectorTime: 25, minSpeed: 50, maxSpeed: 90, limitingFactor: "grip" },
      { sectorIndex: 1, sectorName: "S2", startDistance: 1500, endDistance: 3000, sectorTime: 27, minSpeed: 55, maxSpeed: 95, limitingFactor: "power" },
      { sectorIndex: 2, sectorName: "S3", startDistance: 3000, endDistance: 5000, sectorTime: 28, minSpeed: 50, maxSpeed: 100, limitingFactor: "mixed" },
    ],
    assumptions: ["test mock"],
  };
}

/** Runs updateTireState for N laps, returning the state after each lap. */
function simulateLaps(
  compound: TireCompoundParams,
  numLaps: number,
  initialTemp: number = 33,
): TireState[] {
  const states: TireState[] = [];
  let state = initializeTireState(compound, initialTemp);
  const lapOutput = mockLapOutput();

  for (let i = 0; i < numLaps; i++) {
    state = updateTireState(state, lapOutput, compound, DEFAULT_ENV);
    states.push(state);
  }

  return states;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("tireModel: degradation curves differ by compound", () => {
  it("soft degrades faster than medium, medium faster than hard at every 5-lap checkpoint", () => {
    const softStates = simulateLaps(SOFT, 30);
    const mediumStates = simulateLaps(MEDIUM, 30);
    const hardStates = simulateLaps(HARD, 30);

    // Check at laps 5, 10, 15, 20, 25, 30
    for (const checkpoint of [4, 9, 14, 19, 24, 29]) {
      expect(softStates[checkpoint]!.wearFraction).toBeGreaterThan(
        mediumStates[checkpoint]!.wearFraction,
      );
      expect(mediumStates[checkpoint]!.wearFraction).toBeGreaterThan(
        hardStates[checkpoint]!.wearFraction,
      );
    }
  });

  it("soft tire reaches cliff threshold before hard tire", () => {
    const softStates = simulateLaps(SOFT, 40);
    const hardStates = simulateLaps(HARD, 40);

    const softCliffLap = softStates.findIndex(
      (s) => s.wearFraction >= SOFT.cliffThreshold,
    );
    const hardCliffLap = hardStates.findIndex(
      (s) => s.wearFraction >= HARD.cliffThreshold,
    );

    // Soft should hit cliff earlier (lower index) or hard should never hit it in 40 laps
    if (hardCliffLap === -1) {
      // Hard never reaches cliff in 40 laps: soft must have reached it
      expect(softCliffLap).toBeGreaterThanOrEqual(0);
    } else {
      expect(softCliffLap).toBeLessThan(hardCliffLap);
    }
  });
});

describe("tireModel: cliff behavior", () => {
  it("grip drops much faster after crossing the cliff threshold", () => {
    // Start a soft tire just below cliff (0.68, cliff at 0.70)
    const preCliffState: TireState = {
      wearFraction: 0.68,
      surfaceTemperature: 100,
      coreTemperature: 95,
      compound: "soft",
      lapsSinceNew: 20,
    };

    // Compute grip at pre-cliff
    const gripPreCliff = tireWearGripFactor(preCliffState, SOFT);

    // Simulate 10 more laps from this state
    let state = preCliffState;
    const lapOutput = mockLapOutput();
    const grips: number[] = [gripPreCliff];

    for (let i = 0; i < 10; i++) {
      state = updateTireState(state, lapOutput, SOFT, DEFAULT_ENV);
      grips.push(tireWearGripFactor(state, SOFT));
    }

    // After crossing cliff, grip should drop faster than linear trend.
    // Compare grip at wear 0.80 (in cliff zone) vs the linear extrapolation.
    const wearAt80State: TireState = { ...preCliffState, wearFraction: 0.80 };
    const gripAt80 = tireWearGripFactor(wearAt80State, SOFT);

    // Linear prediction at 0.80 (extending the pre-cliff formula): 1.0 - 0.15 * 0.80 = 0.88
    const linearPrediction = 1.0 - 0.15 * 0.80;

    // Cliff grip should be measurably lower than the linear prediction
    // (the quadratic cliff penalty grows beyond the linear trend)
    expect(gripAt80).toBeLessThan(linearPrediction);

    // Additionally, the rate of grip loss should be accelerating:
    // grip loss from 0.70->0.80 (cliff zone) should exceed grip loss from 0.60->0.70 (pre-cliff)
    const wearAt60State: TireState = { ...preCliffState, wearFraction: 0.60 };
    const wearAt70State: TireState = { ...preCliffState, wearFraction: 0.70 };
    const gripAt60 = tireWearGripFactor(wearAt60State, SOFT);
    const gripAt70 = tireWearGripFactor(wearAt70State, SOFT);

    const preCliffDrop = gripAt60 - gripAt70;   // Linear region
    const cliffDrop = gripAt70 - gripAt80;       // Cliff region

    expect(cliffDrop).toBeGreaterThan(preCliffDrop);
  });
});

describe("tireModel: thermal window", () => {
  it("returns 1.0 inside the optimal temperature window", () => {
    const state: TireState = {
      wearFraction: 0,
      surfaceTemperature: 100, // SOFT window: 85-115
      coreTemperature: 95,
      compound: "soft",
      lapsSinceNew: 5,
    };

    expect(tireThermalFactor(state, SOFT)).toBe(1.0);
  });

  it("returns < 1.0 below the optimal window", () => {
    const state: TireState = {
      wearFraction: 0,
      surfaceTemperature: 50, // Well below SOFT window (85)
      coreTemperature: 50,
      compound: "soft",
      lapsSinceNew: 5,
    };

    expect(tireThermalFactor(state, SOFT)).toBeLessThan(1.0);
  });

  it("returns < 1.0 above the optimal window", () => {
    const state: TireState = {
      wearFraction: 0,
      surfaceTemperature: 150, // Well above SOFT window (115)
      coreTemperature: 140,
      compound: "soft",
      lapsSinceNew: 5,
    };

    expect(tireThermalFactor(state, SOFT)).toBeLessThan(1.0);
  });

  it("floors at 0.5 even at extreme low temperature (0C)", () => {
    const state: TireState = {
      wearFraction: 0,
      surfaceTemperature: 0,
      coreTemperature: 0,
      compound: "soft",
      lapsSinceNew: 0,
    };

    expect(tireThermalFactor(state, SOFT)).toBeGreaterThanOrEqual(0.5);
  });

  it("floors at 0.5 even at extreme high temperature (200C)", () => {
    const state: TireState = {
      wearFraction: 0,
      surfaceTemperature: 200,
      coreTemperature: 190,
      compound: "soft",
      lapsSinceNew: 0,
    };

    expect(tireThermalFactor(state, SOFT)).toBeGreaterThanOrEqual(0.5);
  });
});

describe("tireModel: warm-up dynamics", () => {
  it("surface temperature increases toward optimal range from cold start", () => {
    const states = simulateLaps(SOFT, 5, 20); // Start at 20C (cold)

    // Surface temperature should increase each lap
    let prevTemp = 20;
    for (const state of states) {
      expect(state.surfaceTemperature).toBeGreaterThan(prevTemp);
      prevTemp = state.surfaceTemperature;
    }

    // After 5 laps, should be approaching the optimal range (85C)
    expect(states[4]!.surfaceTemperature).toBeGreaterThan(40);
  });

  it("core temperature lags behind surface temperature", () => {
    const states = simulateLaps(SOFT, 5, 20); // Start at 20C

    // Core should lag behind surface throughout warm-up
    for (const state of states) {
      expect(state.coreTemperature).toBeLessThan(state.surfaceTemperature);
    }
  });
});

describe("tireModel: grip floor", () => {
  it("tireWearGripFactor never returns below 0.3 even at wearFraction = 1.0", () => {
    const state: TireState = {
      wearFraction: 1.0,
      surfaceTemperature: 100,
      coreTemperature: 95,
      compound: "soft",
      lapsSinceNew: 50,
    };

    const grip = tireWearGripFactor(state, SOFT);
    expect(grip).toBeGreaterThanOrEqual(0.3);
  });

  it("grip floor holds for all compounds at maximum wear", () => {
    for (const compound of [SOFT, MEDIUM, HARD]) {
      const state: TireState = {
        wearFraction: 1.0,
        surfaceTemperature: 100,
        coreTemperature: 95,
        compound: compound.compoundId,
        lapsSinceNew: 50,
      };

      const grip = tireWearGripFactor(state, compound);
      expect(grip).toBeGreaterThanOrEqual(0.3);
    }
  });
});

describe("tireModel: ambient temperature effect on equilibrium", () => {
  it("tire equilibrium temperature is lower with cold ambient (10C) vs hot ambient (30C)", () => {
    const coldEnv: EnvironmentState = {
      trackTemperatureC: 33,
      ambientTemperatureC: 10,
      surfaceWetness: 0,
      rubberEvolution: 1.0,
      gripModifier: 1.0,
    };
    const hotEnv: EnvironmentState = {
      trackTemperatureC: 33,
      ambientTemperatureC: 30,
      surfaceWetness: 0,
      rubberEvolution: 1.0,
      gripModifier: 1.0,
    };

    // Start at same initial temp
    let coldState = initializeTireState(SOFT, 33);
    let hotState = initializeTireState(SOFT, 33);
    const lapOutput = mockLapOutput();

    // Run 10 laps with each environment
    for (let i = 0; i < 10; i++) {
      coldState = updateTireState(coldState, lapOutput, SOFT, coldEnv);
      hotState = updateTireState(hotState, lapOutput, SOFT, hotEnv);
    }

    // Hot ambient should produce higher surface temperature (higher equilibrium)
    expect(hotState.surfaceTemperature).toBeGreaterThan(coldState.surfaceTemperature);
  });

  it("stint with cold ambient (10C) produces slower warm-up than hot ambient (30C)", () => {
    const coldEnv: EnvironmentState = {
      trackTemperatureC: 33,
      ambientTemperatureC: 10,
      surfaceWetness: 0,
      rubberEvolution: 1.0,
      gripModifier: 1.0,
    };
    const hotEnv: EnvironmentState = {
      trackTemperatureC: 33,
      ambientTemperatureC: 30,
      surfaceWetness: 0,
      rubberEvolution: 1.0,
      gripModifier: 1.0,
    };

    // Start from cold initial temp
    let coldState = initializeTireState(SOFT, 20);
    let hotState = initializeTireState(SOFT, 20);
    const lapOutput = mockLapOutput();

    // Run 5 laps
    for (let i = 0; i < 5; i++) {
      coldState = updateTireState(coldState, lapOutput, SOFT, coldEnv);
      hotState = updateTireState(hotState, lapOutput, SOFT, hotEnv);
    }

    // Hot ambient environment should warm up faster (higher surface temp after same laps)
    expect(hotState.surfaceTemperature).toBeGreaterThan(coldState.surfaceTemperature);
  });
});

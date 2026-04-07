/**
 * Unit tests for the dynamic weather evolution and environment coupling model.
 *
 * Tests weather interpolation, surface grip factor, rubber evolution
 * buildup and rain washout, and combined grip modifier transitions.
 */

import { describe, expect, it } from "vitest";

import {
  interpolateWeatherAtLap,
  surfaceGripFactor,
  rubberEvolutionFactor,
  initializeEnvironmentState,
  updateEnvironmentState,
} from "../stintModel/environmentModel.js";
import type { WeatherTimeline } from "../stintModel/types.js";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("environmentModel: weather interpolation", () => {
  const timeline: WeatherTimeline = [
    { lap: 0, trackTemperatureC: 30, surfaceWetness: 0, rainfall: "none" },
    { lap: 10, trackTemperatureC: 25, surfaceWetness: 0.6, rainfall: "moderate" },
    { lap: 20, trackTemperatureC: 20, surfaceWetness: 0.2, rainfall: "light" },
  ];

  it("interpolates halfway between two events correctly", () => {
    const result = interpolateWeatherAtLap(timeline, 5);

    // Halfway between lap 0 (30C, 0.0) and lap 10 (25C, 0.6)
    expect(result.trackTemperatureC).toBeCloseTo(27.5, 1);
    expect(result.surfaceWetness).toBeCloseTo(0.3, 1);
  });

  it("returns first event values at lap 0", () => {
    const result = interpolateWeatherAtLap(timeline, 0);

    expect(result.trackTemperatureC).toBe(30);
    expect(result.surfaceWetness).toBe(0);
  });

  it("returns last event values at lap 20", () => {
    const result = interpolateWeatherAtLap(timeline, 20);

    expect(result.trackTemperatureC).toBe(20);
    expect(result.surfaceWetness).toBe(0.2);
  });

  it("returns last event values after the last event", () => {
    const result = interpolateWeatherAtLap(timeline, 25);

    expect(result.trackTemperatureC).toBe(20);
    expect(result.surfaceWetness).toBe(0.2);
  });

  it("returns first event values before the first event", () => {
    const shifted: WeatherTimeline = [
      { lap: 5, trackTemperatureC: 30, surfaceWetness: 0, rainfall: "none" },
      { lap: 15, trackTemperatureC: 25, surfaceWetness: 0.6, rainfall: "moderate" },
    ];

    const result = interpolateWeatherAtLap(shifted, 2);
    expect(result.trackTemperatureC).toBe(30);
    expect(result.surfaceWetness).toBe(0);
  });

  it("handles an empty timeline with defaults", () => {
    const result = interpolateWeatherAtLap([], 5);
    expect(result.trackTemperatureC).toBe(33);
    expect(result.surfaceWetness).toBe(0);
  });
});

describe("environmentModel: surface grip factor", () => {
  it("returns 1.0 for dry surface (wetness 0.0)", () => {
    expect(surfaceGripFactor(0.0)).toBe(1.0);
  });

  it("returns approximately 0.775 for half-wet surface (wetness 0.5)", () => {
    // 1.0 - 0.45 * 0.5 = 0.775
    expect(surfaceGripFactor(0.5)).toBeCloseTo(0.775, 2);
  });

  it("returns >= 0.55 for fully wet surface (wetness 1.0)", () => {
    const factor = surfaceGripFactor(1.0);
    expect(factor).toBeGreaterThanOrEqual(0.55);
    // 1.0 - 0.45 * 1.0 = 0.55
    expect(factor).toBeCloseTo(0.55, 2);
  });

  it("is monotonically decreasing with increasing wetness", () => {
    const steps = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    for (let i = 1; i < steps.length; i++) {
      expect(surfaceGripFactor(steps[i]!)).toBeLessThanOrEqual(
        surfaceGripFactor(steps[i - 1]!),
      );
    }
  });
});

describe("environmentModel: rubber evolution buildup", () => {
  it("rubber increases toward 1.05 over 20 dry laps from 0.95", () => {
    let rubber = 0.95;
    for (let lap = 0; lap < 20; lap++) {
      rubber = rubberEvolutionFactor(lap, 0.0, rubber); // dry
    }

    expect(rubber).toBeGreaterThan(0.95);
    expect(rubber).toBeLessThanOrEqual(1.05);
  });

  it("rubber never exceeds 1.05", () => {
    let rubber = 0.95;
    for (let lap = 0; lap < 100; lap++) {
      rubber = rubberEvolutionFactor(lap, 0.0, rubber);
      expect(rubber).toBeLessThanOrEqual(1.05);
    }
  });
});

describe("environmentModel: rain washout", () => {
  it("rubber drops back toward 0.95 when rain arrives after buildup", () => {
    // Build rubber to > 1.0 over dry laps
    let rubber = 0.95;
    for (let lap = 0; lap < 30; lap++) {
      rubber = rubberEvolutionFactor(lap, 0.0, rubber);
    }

    expect(rubber).toBeGreaterThan(1.0);
    const builtUpRubber = rubber;

    // Apply rain (surfaceWetness 0.7)
    rubber = rubberEvolutionFactor(30, 0.7, rubber);

    expect(rubber).toBeLessThan(builtUpRubber);
    // Should be moving back toward 0.95
    expect(rubber).toBeLessThan(builtUpRubber);
  });

  it("rubber stays in valid range [0.90, 1.05] during washout", () => {
    let rubber = 1.04; // Near maximum
    for (let lap = 0; lap < 20; lap++) {
      rubber = rubberEvolutionFactor(lap, 1.0, rubber); // Full wet
      expect(rubber).toBeGreaterThanOrEqual(0.90);
      expect(rubber).toBeLessThanOrEqual(1.05);
    }
  });
});

describe("environmentModel: ambientTemperatureC tracking", () => {
  it("initializeEnvironmentState stores ambientTemperatureC from parameter", () => {
    const timeline: WeatherTimeline = [
      { lap: 0, trackTemperatureC: 33, surfaceWetness: 0, rainfall: "none" },
    ];

    const state = initializeEnvironmentState(timeline, 18);
    expect(state.ambientTemperatureC).toBe(18);
  });

  it("initializeEnvironmentState defaults ambientTemperatureC to 24 when not provided", () => {
    const timeline: WeatherTimeline = [
      { lap: 0, trackTemperatureC: 33, surfaceWetness: 0, rainfall: "none" },
    ];

    const state = initializeEnvironmentState(timeline);
    expect(state.ambientTemperatureC).toBe(24);
  });

  it("updateEnvironmentState propagates ambientTemperatureC from previous state", () => {
    const timeline: WeatherTimeline = [
      { lap: 0, trackTemperatureC: 33, surfaceWetness: 0, rainfall: "none" },
      { lap: 10, trackTemperatureC: 30, surfaceWetness: 0.2, rainfall: "light" },
    ];

    const initial = initializeEnvironmentState(timeline, 15);
    const updated = updateEnvironmentState(initial, 5, timeline);
    expect(updated.ambientTemperatureC).toBe(15);
  });
});

describe("environmentModel: combined grip modifier (dry-to-wet transition)", () => {
  it("gripModifier decreases when rain arrives", () => {
    const dryTimeline: WeatherTimeline = [
      { lap: 0, trackTemperatureC: 33, surfaceWetness: 0, rainfall: "none" },
      { lap: 10, trackTemperatureC: 33, surfaceWetness: 0, rainfall: "none" },
      { lap: 11, trackTemperatureC: 25, surfaceWetness: 0.7, rainfall: "heavy" },
      { lap: 20, trackTemperatureC: 22, surfaceWetness: 0.8, rainfall: "heavy" },
    ];

    let state = initializeEnvironmentState(dryTimeline);
    const gripBefore: number[] = [];

    // Dry laps (0-9)
    for (let lap = 0; lap < 10; lap++) {
      state = updateEnvironmentState(state, lap, dryTimeline);
      gripBefore.push(state.gripModifier);
    }

    // Wet laps (10-15)
    const gripAfter: number[] = [];
    for (let lap = 10; lap < 16; lap++) {
      state = updateEnvironmentState(state, lap, dryTimeline);
      gripAfter.push(state.gripModifier);
    }

    // Grip should be lower in wet laps than in dry laps
    const avgDryGrip = gripBefore.reduce((a, b) => a + b, 0) / gripBefore.length;
    const avgWetGrip = gripAfter.reduce((a, b) => a + b, 0) / gripAfter.length;
    expect(avgWetGrip).toBeLessThan(avgDryGrip);
  });

  it("grip change is physically plausible (not > 50% drop in one lap)", () => {
    const transitionTimeline: WeatherTimeline = [
      { lap: 0, trackTemperatureC: 33, surfaceWetness: 0, rainfall: "none" },
      { lap: 5, trackTemperatureC: 33, surfaceWetness: 0, rainfall: "none" },
      { lap: 6, trackTemperatureC: 25, surfaceWetness: 0.8, rainfall: "heavy" },
      { lap: 20, trackTemperatureC: 20, surfaceWetness: 0.9, rainfall: "heavy" },
    ];

    let state = initializeEnvironmentState(transitionTimeline);
    let prevGrip = state.gripModifier;

    for (let lap = 0; lap < 20; lap++) {
      state = updateEnvironmentState(state, lap, transitionTimeline);
      const currentGrip = state.gripModifier;

      // No single-lap drop should exceed 50%
      if (prevGrip > 0) {
        const dropFraction = (prevGrip - currentGrip) / prevGrip;
        expect(dropFraction).toBeLessThan(0.5);
      }

      prevGrip = currentGrip;
    }
  });
});

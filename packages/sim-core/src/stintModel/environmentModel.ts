/**
 * Dynamic weather evolution and environment coupling model.
 *
 * Implements per-lap weather interpolation from a deterministic timeline,
 * surface grip factors from wetness, and rubber evolution with rain washout.
 * Weather conditions evolve within a session -- not just static initial
 * conditions.
 *
 * The environment state feeds into tire grip (multiplicative gripModifier)
 * and electrical harvesting (via environmentState passed to updateElectricalState).
 *
 * Source: Phase 3 research synthesis. Engineering-inference parameters;
 * not calibrated to meteorological data.
 */

import type { EnvironmentState, WeatherTimeline } from "./types.js";

// ---------------------------------------------------------------------------
// Weather interpolation
// ---------------------------------------------------------------------------

/**
 * Linearly interpolates weather conditions at a given lap number from
 * a timeline of discrete events.
 *
 * Before the first event: uses first event values.
 * After the last event: uses last event values.
 * Between two events: linearly interpolates both trackTemperatureC and
 * surfaceWetness.
 *
 * This implements RESEARCH.md Pitfall 4 mitigation: if rain starts at
 * lap 5.5, lap 5 gets partial rain effect.
 *
 * @param timeline - Ordered weather timeline events.
 * @param lap - Current lap number (can be fractional).
 * @returns Interpolated weather state.
 */
export function interpolateWeatherAtLap(
  timeline: WeatherTimeline,
  lap: number,
): { trackTemperatureC: number; surfaceWetness: number } {
  // Empty timeline: return defaults
  if (timeline.length === 0) {
    return { trackTemperatureC: 33, surfaceWetness: 0 };
  }

  const first = timeline[0]!;

  // Before or at first event
  if (lap <= first.lap) {
    return {
      trackTemperatureC: first.trackTemperatureC,
      surfaceWetness: first.surfaceWetness,
    };
  }

  const last = timeline[timeline.length - 1]!;

  // After or at last event
  if (lap >= last.lap) {
    return {
      trackTemperatureC: last.trackTemperatureC,
      surfaceWetness: last.surfaceWetness,
    };
  }

  // Find the two bracketing events
  for (let i = 0; i < timeline.length - 1; i++) {
    const a = timeline[i]!;
    const b = timeline[i + 1]!;

    if (lap >= a.lap && lap <= b.lap) {
      const span = b.lap - a.lap;
      // Avoid division by zero for coincident events
      if (span === 0) {
        return {
          trackTemperatureC: a.trackTemperatureC,
          surfaceWetness: a.surfaceWetness,
        };
      }

      const t = (lap - a.lap) / span;
      return {
        trackTemperatureC: a.trackTemperatureC + t * (b.trackTemperatureC - a.trackTemperatureC),
        surfaceWetness: a.surfaceWetness + t * (b.surfaceWetness - a.surfaceWetness),
      };
    }
  }

  // Fallback (should not reach here with a well-formed timeline)
  return {
    trackTemperatureC: last.trackTemperatureC,
    surfaceWetness: last.surfaceWetness,
  };
}

// ---------------------------------------------------------------------------
// Surface grip factor
// ---------------------------------------------------------------------------

/**
 * Maps surface wetness (0.0 = dry, 1.0 = standing water) to a grip
 * multiplier via a piecewise linear function.
 *
 * Dry (0.0) = 1.0, full wet (1.0) = 0.55.
 * Formula: 1.0 - 0.45 * surfaceWetness, floored at 0.55.
 *
 * @param surfaceWetness - Surface wetness fraction (0.0 to 1.0).
 * @returns Grip multiplier (0.55 to 1.0).
 */
export function surfaceGripFactor(surfaceWetness: number): number {
  const factor = 1.0 - 0.45 * surfaceWetness;
  return Math.max(0.55, factor);
}

// ---------------------------------------------------------------------------
// Rubber evolution factor
// ---------------------------------------------------------------------------

/**
 * Computes rubber buildup evolution on the track surface.
 *
 * Track rubber builds up over laps, improving grip from 0.95 (green track)
 * toward 1.05 (fully rubbered in). The buildup has diminishing returns.
 * Rain washes rubber away: if surfaceWetness > 0.3, rubber resets
 * partially toward 0.95.
 *
 * @param lapNumber - Current lap number.
 * @param surfaceWetness - Current surface wetness fraction.
 * @param prevRubber - Previous rubber evolution factor.
 * @returns Updated rubber evolution factor, clamped to [0.90, 1.05].
 */
export function rubberEvolutionFactor(
  lapNumber: number,
  surfaceWetness: number,
  prevRubber: number,
): number {
  // Silence unused parameter lint -- lapNumber is accepted for future
  // extensions (e.g., non-linear buildup curves based on lap count).
  void lapNumber;

  let rubber = prevRubber;

  // Rain washout: if wet enough, rubber is partially washed away
  if (surfaceWetness > 0.3) {
    rubber = rubber - 0.3 * surfaceWetness * (rubber - 0.95);
  } else {
    // Rubber buildup: diminishing returns toward 1.05
    const increment = 0.005 * (1.05 - rubber) / 0.10;
    rubber = rubber + increment;
  }

  // Clamp to valid range
  return Math.max(0.90, Math.min(1.05, rubber));
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

/**
 * Creates the initial environment state from the first timeline event
 * (or defaults: trackTemperatureC 33, surfaceWetness 0, rubberEvolution 0.95).
 *
 * @param timeline - Weather timeline for the stint.
 * @returns Initial EnvironmentState.
 */
export function initializeEnvironmentState(timeline: WeatherTimeline): EnvironmentState {
  const trackTemperatureC = timeline.length > 0 ? timeline[0]!.trackTemperatureC : 33;
  const surfaceWetness = timeline.length > 0 ? timeline[0]!.surfaceWetness : 0;
  const rubberEvolution = 0.95;
  const gripModifier = surfaceGripFactor(surfaceWetness) * rubberEvolution;

  return {
    trackTemperatureC,
    surfaceWetness,
    rubberEvolution,
    gripModifier,
  };
}

// ---------------------------------------------------------------------------
// Per-lap update
// ---------------------------------------------------------------------------

/**
 * Updates the environment state for one lap.
 *
 * 1. Interpolates weather at the current lap number to get trackTemperatureC
 *    and surfaceWetness.
 * 2. Computes new rubber evolution from rubberEvolutionFactor().
 * 3. Computes composite gripModifier as surfaceGripFactor * rubberEvolution.
 *
 * @param prev - Previous environment state.
 * @param lapNumber - Current lap number.
 * @param timeline - Weather timeline for the stint.
 * @returns Updated EnvironmentState.
 */
export function updateEnvironmentState(
  prev: EnvironmentState,
  lapNumber: number,
  timeline: WeatherTimeline,
): EnvironmentState {
  const weather = interpolateWeatherAtLap(timeline, lapNumber);
  const rubberEvo = rubberEvolutionFactor(lapNumber, weather.surfaceWetness, prev.rubberEvolution);
  const gripModifier = surfaceGripFactor(weather.surfaceWetness) * rubberEvo;

  return {
    trackTemperatureC: weather.trackTemperatureC,
    surfaceWetness: weather.surfaceWetness,
    rubberEvolution: rubberEvo,
    gripModifier,
  };
}

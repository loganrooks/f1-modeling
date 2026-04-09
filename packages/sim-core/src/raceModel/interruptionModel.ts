/**
 * Race interruption effects model for a single-car simulation.
 *
 * Models the effects of VSC, SC, and red flags on lap times and
 * pit-stop cost in a single-car strategy model. Since this is a
 * single-car model (no opponent field), interruptions are modeled
 * purely as lap-time multipliers and pit-cost discounts.
 *
 * Source: Race strategy modelling literature (formula1.wiki, FlowRacers)
 *
 * Key simplification: The "strategic advantage" of pitting under SC
 * is captured purely through the pit-cost discount factor, not through
 * field-bunching dynamics. This is an honest limitation of the
 * single-car model, explicitly documented in race-level assumptions.
 */

import type { InterruptionSpec, InterruptionType } from "./types.js";

// ---------------------------------------------------------------------------
// Lap-time factor
// ---------------------------------------------------------------------------

/**
 * Returns the lap-time multiplier under an interruption condition.
 *
 * The multiplier is applied to the racing-pace lap time to compute
 * the actual lap time under the interruption.
 *
 * Source: VSC ~30% slower than racing pace (FlowRacers), SC ~40% slower
 * (following safety car formation). Red flag = session stopped.
 *
 * @param type - Interruption type.
 * @returns Multiplicative factor >= 1.0 (or Infinity for red flag).
 */
export function interruptionLapTimeFactor(type: InterruptionType): number {
  switch (type) {
    case "vsc":
      return 1.3; // ~30% slower than racing pace
    case "sc":
      return 1.4; // ~40% slower (following safety car)
    case "red-flag":
      return Infinity; // Session stopped -- no laps completed
  }
}

// ---------------------------------------------------------------------------
// Pit-loss discount factor
// ---------------------------------------------------------------------------

/**
 * Returns the pit-loss discount factor under an interruption condition.
 *
 * Under safety conditions, pit stops cost less relative time because the
 * field is already running slowly. The discount factor is multiplied with
 * the green-flag pit loss.
 *
 * Source: Race strategy modelling literature (formula1.wiki)
 * VSC: ~35% reduction. SC: ~60% reduction. Red flag: free tire change.
 *
 * @param type - Interruption type.
 * @returns Factor in [0.0, 1.0] where 0.0 = free pit stop.
 */
export function pitLossDiscountFactor(type: InterruptionType): number {
  switch (type) {
    case "vsc":
      return 0.65; // ~35% reduction in pit loss
    case "sc":
      return 0.4; // ~60% reduction (field bunched, lower relative cost)
    case "red-flag":
      return 0.0; // Free tire change during red flag
  }
}

// ---------------------------------------------------------------------------
// Apply interruptions to lap times
// ---------------------------------------------------------------------------

/**
 * Modifies stint-local lap times to account for race interruptions.
 *
 * Takes an array of stint-local lap times and returns a NEW modified
 * array with interruption effects applied. Does NOT mutate the input.
 *
 * For each interruption, maps race-level laps to stint-local indices:
 *   stintLocalLap = interruptionLap - raceStartLap
 *
 * For VSC/SC: affected laps are multiplied by interruptionLapTimeFactor.
 * For red flag: affected laps are set to 0 (session stopped; race distance
 * adjustment is the caller's responsibility).
 *
 * @param lapTimes - Array of stint-local lap times (seconds).
 * @param interruptions - Array of race-level interruption specs.
 * @param raceStartLap - The race-level lap number at which this stint begins.
 * @returns A new array of modified lap times.
 */
export function applyInterruptionsToLapTimes(
  lapTimes: readonly number[],
  interruptions: readonly InterruptionSpec[],
  raceStartLap: number,
): number[] {
  // Clone to avoid mutating the original
  const modified = [...lapTimes];

  for (const interruption of interruptions) {
    const factor = interruptionLapTimeFactor(interruption.type);

    for (let raceLap = interruption.startLap; raceLap < interruption.endLap; raceLap++) {
      const stintLocalLap = raceLap - raceStartLap;

      // Skip laps outside this stint's range
      if (stintLocalLap < 0 || stintLocalLap >= modified.length) {
        continue;
      }

      if (interruption.type === "red-flag") {
        // Session stopped -- lap time set to 0
        modified[stintLocalLap] = 0;
      } else {
        // VSC/SC: multiply racing-pace lap time by the slow-down factor
        modified[stintLocalLap] = modified[stintLocalLap]! * factor;
      }
    }
  }

  return modified;
}

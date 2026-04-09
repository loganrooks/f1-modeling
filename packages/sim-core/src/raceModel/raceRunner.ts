/**
 * Race-state engine: multi-stint orchestration loop.
 *
 * Sequences stints by calling the existing stint runner per stint,
 * applies pit-event state mutations between stints, injects
 * interruption effects as lap-time modifiers, and produces a typed
 * race timeline artifact.
 *
 * This is a thin orchestration layer over existing Phase 3
 * infrastructure -- no new physics models.
 *
 * Source: Race strategy modelling architecture (Heilmeier et al.,
 * TUMFTM race-simulation)
 */

import { initializeTireState } from "../stintModel/tireModel.js";
import { initializeStintState, runStint, runStintFromState } from "../stintModel/stintRunner.js";
import type {
  StintConfig,
  StintResult,
  StintState,
} from "../stintModel/types.js";

import { computePitLoss } from "./pitModel.js";
import {
  applyInterruptionsToLapTimes,
  pitLossDiscountFactor,
} from "./interruptionModel.js";
import type {
  InterruptionSpec,
  PitLossResult,
  RaceConfig,
  RaceResult,
  RaceTimelineEvent,
  StintSpec,
  StintSummary,
} from "./types.js";

// ---------------------------------------------------------------------------
// Pit-event state mutation
// ---------------------------------------------------------------------------

/**
 * Applies pit-event state modifications between stints.
 *
 * Fresh tires for the next compound; electrical state (SoC) carries
 * through; environment state carries through; fuel state persists
 * (no refueling in 2026 regulations).
 *
 * @param finalState - Final state from the completed stint.
 * @param nextStintSpec - Specification for the upcoming stint.
 * @returns Modified StintState ready for the next stint.
 */
function applyPitEvent(
  finalState: StintState,
  nextStintSpec: StintSpec,
): StintState {
  return {
    lapNumber: finalState.lapNumber,
    tireState: initializeTireState(
      nextStintSpec.tireCompound,
      finalState.environmentState.trackTemperatureC,
    ),
    electricalState: finalState.electricalState, // SoC carries through
    environmentState: finalState.environmentState, // Weather carries through
    fuelMass: finalState.fuelMass, // No refueling in 2026
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a StintConfig from a StintSpec and RaceConfig.
 */
function resolveStintConfig(
  spec: StintSpec,
  raceConfig: RaceConfig,
): StintConfig {
  return {
    circuit: raceConfig.circuit,
    baseVehicle: raceConfig.baseVehicle,
    tireCompound: spec.tireCompound,
    electricalPolicy: spec.electricalPolicy,
    weatherTimeline: raceConfig.weatherTimeline,
    aeroConfig: raceConfig.aeroConfig,
    loadTransferParams: raceConfig.loadTransferParams,
    totalLaps: spec.totalLaps,
    ambientTemperatureC: raceConfig.ambientTemperatureC,
  };
}

/**
 * Finds the active interruption at a given race lap, if any.
 * Returns the first matching interruption (they should not overlap).
 */
function findActiveInterruption(
  interruptions: readonly InterruptionSpec[],
  raceLap: number,
): InterruptionSpec | undefined {
  return interruptions.find(
    (intr) => raceLap >= intr.startLap && raceLap < intr.endLap,
  );
}

// ---------------------------------------------------------------------------
// Race engine
// ---------------------------------------------------------------------------

/**
 * Runs a multi-stint race simulation.
 *
 * Orchestrates the existing stint runner across an ordered sequence of
 * stints, applying pit-event state mutations between stints and
 * interruption effects to lap times.
 *
 * @param stints - Ordered array of stint specifications.
 * @param config - Race-level configuration (circuit, vehicle, weather, pit params, etc.).
 * @param interruptions - Optional array of race interruptions (VSC, SC, red flag).
 * @returns RaceResult with stint results, typed timeline, and summary metrics.
 */
export function runRace(
  stints: readonly StintSpec[],
  config: RaceConfig,
  interruptions: readonly InterruptionSpec[] = [],
): RaceResult {
  const allStintResults: StintResult[] = [];
  const timeline: RaceTimelineEvent[] = [];
  const stintSummaries: StintSummary[] = [];

  let cumulativeRaceTime = 0;
  let totalPitTime = 0;
  let raceStartLap = 0;
  let currentState: StintState | null = null;

  for (let i = 0; i < stints.length; i++) {
    const stintSpec = stints[i]!;
    const stintConfig = resolveStintConfig(stintSpec, config);

    // --- Run the stint ---
    let stintResult: StintResult;
    if (i === 0) {
      // First stint: fresh initialization
      stintResult = runStint(stintConfig);
    } else {
      // Subsequent stints: use pit-modified state from previous stint
      stintResult = runStintFromState(stintConfig, currentState!);
    }
    allStintResults.push(stintResult);

    // --- Record interruption-start events that begin within this stint ---
    for (const intr of interruptions) {
      if (intr.startLap >= raceStartLap && intr.startLap < raceStartLap + stintSpec.totalLaps) {
        timeline.push({
          type: "interruption-start",
          interruptionType: intr.type,
          raceLap: intr.startLap,
        });
      }
    }

    // --- Record stint-start event ---
    timeline.push({
      type: "stint-start",
      stintIndex: i,
      raceLap: raceStartLap,
      compound: stintSpec.tireCompound.compoundId,
      policyId: stintSpec.electricalPolicy.policyId,
    });

    // --- Apply interruption effects to lap times ---
    const originalLapTimes = stintResult.lapTraces.map((t) => t.lapTime);
    const modifiedLapTimes = interruptions.length > 0
      ? applyInterruptionsToLapTimes(originalLapTimes, interruptions, raceStartLap)
      : originalLapTimes;

    // Sum the (possibly modified) lap times for this stint
    let stintTime = 0;
    for (const lt of modifiedLapTimes) {
      stintTime += lt;
    }
    cumulativeRaceTime += stintTime;

    // --- Compute effective grip range for this stint ---
    let gripMin = Infinity;
    let gripMax = -Infinity;
    for (const trace of stintResult.lapTraces) {
      if (trace.effectiveGrip < gripMin) gripMin = trace.effectiveGrip;
      if (trace.effectiveGrip > gripMax) gripMax = trace.effectiveGrip;
    }

    // --- Record stint-end event ---
    timeline.push({
      type: "stint-end",
      stintIndex: i,
      raceLap: raceStartLap + stintSpec.totalLaps,
      stintTime,
      cumulativeRaceTime,
      finalTireWear: stintResult.finalState.tireState.wearFraction,
      finalSoC: stintResult.finalState.electricalState.stateOfCharge,
      effectiveGripRange: [gripMin, gripMax],
    });

    // --- Record stint summary ---
    stintSummaries.push({
      stintIndex: i,
      compound: stintSpec.tireCompound.compoundId,
      laps: stintSpec.totalLaps,
      stintTime,
      finalWear: stintResult.finalState.tireState.wearFraction,
      finalSoC: stintResult.finalState.electricalState.stateOfCharge,
    });

    // --- Record interruption-end events that end within this stint ---
    for (const intr of interruptions) {
      if (intr.endLap > raceStartLap && intr.endLap <= raceStartLap + stintSpec.totalLaps) {
        timeline.push({
          type: "interruption-end",
          interruptionType: intr.type,
          raceLap: intr.endLap,
        });
      }
    }

    // --- Apply pit event (unless last stint) ---
    if (i < stints.length - 1) {
      const nextStintSpec = stints[i + 1]!;
      const pitRaceLap = raceStartLap + stintSpec.totalLaps;

      // Check if an interruption is active at the pit lap for discount
      const activeInterruption = findActiveInterruption(interruptions, pitRaceLap);
      let pitResult: PitLossResult;
      if (activeInterruption) {
        const discount = pitLossDiscountFactor(activeInterruption.type);
        pitResult = computePitLoss(config.pitLaneParams, discount);
      } else {
        pitResult = computePitLoss(config.pitLaneParams);
      }

      cumulativeRaceTime += pitResult.totalLoss;
      totalPitTime += pitResult.totalLoss;

      // Mutate state for the next stint
      currentState = applyPitEvent(stintResult.finalState, nextStintSpec);

      // Record pit-event timeline event
      timeline.push({
        type: "pit-event",
        afterStintIndex: i,
        raceLap: pitRaceLap,
        pitLoss: pitResult,
        newCompound: nextStintSpec.tireCompound.compoundId,
      });
    }

    // Advance the race lap counter
    raceStartLap += stintSpec.totalLaps;
  }

  // --- Sort timeline events chronologically ---
  // Within the same raceLap, order: interruption-start < stint-start <
  // stint-end < pit-event < interruption-end
  const eventOrder: Record<string, number> = {
    "interruption-start": 0,
    "stint-start": 1,
    "stint-end": 2,
    "pit-event": 3,
    "interruption-end": 4,
  };
  timeline.sort((a, b) => {
    if (a.raceLap !== b.raceLap) return a.raceLap - b.raceLap;
    return (eventOrder[a.type] ?? 99) - (eventOrder[b.type] ?? 99);
  });

  // --- Collect all stint assumptions and add race-level ones ---
  const allAssumptions = new Set<string>();
  for (const result of allStintResults) {
    for (const a of result.assumptions) {
      allAssumptions.add(a);
    }
  }

  // Race-level assumptions
  const raceAssumptions = [
    "Race-state engine: thin orchestration over existing stint runner",
    "Pit-lane loss: L_pit = (t_entry + t_exit - t_bypass) + t_stop (engineering-inference)",
    "Single-car model: no opponent field, traffic, or overtaking",
    "Interruptions: lap-time multipliers and pit-cost discounts (engineering-inference)",
    "No refueling: 2026 regulations (fuel state carries through pit stops)",
  ];
  for (const a of raceAssumptions) {
    allAssumptions.add(a);
  }

  return {
    stintResults: allStintResults,
    timeline,
    totalRaceTime: cumulativeRaceTime,
    totalPitTime,
    stintSummaries,
    assumptions: [...allAssumptions],
  };
}

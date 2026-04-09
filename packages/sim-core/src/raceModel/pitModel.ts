/**
 * Reduced-order pit-lane loss model.
 *
 * Computes the time lost for a pit stop relative to staying on track.
 * The model decomposes pit loss into traversal overhead (entry + exit
 * minus the bypass time at racing speed) plus stationary service time.
 *
 * Formula: L_pit = (t_entry + t_exit - t_bypass) + t_stop
 *
 * Under safety conditions (VSC, SC, red flag), the total loss is
 * reduced by a discount factor because the field is slower.
 *
 * Source: Race strategy modelling literature (Heilmeier et al., formula1.wiki)
 */

import type { PitLaneParams, PitLossResult } from "./types.js";

// ---------------------------------------------------------------------------
// Pit-loss calculator
// ---------------------------------------------------------------------------

/**
 * Computes the time lost for a pit stop relative to staying on track.
 *
 * @param params - Circuit-specific pit-lane parameters.
 * @param discountFactor - Multiplier for safety conditions (1.0 = green flag, <1.0 = reduced loss under VSC/SC). Default 1.0.
 * @returns PitLossResult with total loss and breakdown.
 */
export function computePitLoss(
  params: PitLaneParams,
  discountFactor: number = 1.0,
): PitLossResult {
  // Source: Race strategy modelling literature (Heilmeier et al., formula1.wiki)
  // L_pit = (t_entry + t_exit - t_bypass) + t_stop
  const traversalDelta =
    params.pitEntryTime + params.pitExitTime - params.pitBypassTime;
  const totalLoss =
    (traversalDelta + params.serviceTime) * discountFactor;

  return {
    totalLoss,
    traversalDelta,
    serviceTime: params.serviceTime,
  };
}

// ---------------------------------------------------------------------------
// Default pit-lane parameters
// ---------------------------------------------------------------------------

/**
 * Generic circuit pit-lane defaults.
 *
 * Engineering-inference from published circuit data. Typical range: 18-25s.
 * These produce a ~20.5s green-flag pit delta.
 */
export const DEFAULT_PIT_LANE_PARAMS: PitLaneParams = {
  pitEntryTime: 12,
  pitExitTime: 10,
  pitBypassTime: 4,
  serviceTime: 2.5,
};

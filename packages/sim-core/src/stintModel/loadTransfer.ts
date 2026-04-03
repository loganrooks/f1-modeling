/**
 * 2-axle weight transfer and load sensitivity model.
 *
 * Computes the grip penalty from lateral and longitudinal load transfer
 * using tire load sensitivity (power-law exponent ~0.85).
 *
 * Source: Milliken & Milliken, Race Car Vehicle Dynamics.
 * Simplified to 2-axle (not per-corner) for Phase 3 educational fidelity.
 */

import type { SpeedProfilePoint } from "../lapModel/types.js";
import { DEFAULT_LOAD_TRANSFER_PARAMS } from "./types.js";
import type { LoadTransferParams } from "./types.js";

/**
 * Computes the grip penalty from load transfer at a single point.
 *
 * Lateral load shift fraction is derived from lateral G, CoG height,
 * and track width. The tire load sensitivity exponent (0.85) captures
 * the fact that doubling the load on a tire does NOT double its grip --
 * the heavily loaded tire gains less grip than the lightly loaded tire
 * loses, reducing total available grip.
 *
 * @param lateralG - Lateral acceleration in g-units.
 * @param _longitudinalG - Longitudinal acceleration in g-units (reserved for future use).
 * @param params - Vehicle geometric parameters.
 * @returns Grip ratio in (0, 1.0]. Returns 1.0 at zero load transfer.
 */
export function computeLoadSensitivityFactor(
  lateralG: number,
  _longitudinalG: number,
  params: LoadTransferParams = DEFAULT_LOAD_TRANSFER_PARAMS,
): number {
  // Lateral load transfer: fraction of weight shifted across the axle
  // lateralTransfer = |ay| * g * h_cog / track_width (normalized by static)
  const lateralShiftFraction = Math.min(
    Math.abs(lateralG) * 9.81 * params.cogHeight / params.trackWidth,
    0.9, // Cap at 90% to prevent singularity
  );

  const s = lateralShiftFraction;
  const loadSensitivityExponent = 0.85;

  // Two tires on an axle: one loaded (1+s), one unloaded (1-s)
  // Total grip ratio = ((1+s)^exp + (1-s)^exp) / 2
  const gripRatio =
    (Math.pow(1 + s, loadSensitivityExponent) +
      Math.pow(Math.max(0.01, 1 - s), loadSensitivityExponent)) /
    2;

  return gripRatio; // < 1.0 when load transfer is significant
}

/**
 * Computes the distance-weighted average load sensitivity factor
 * across a full lap speed profile.
 *
 * This gives a single representative load factor for the lap, suitable
 * for the lap-wise discretization approach where vehicle parameters are
 * constant within a lap.
 *
 * @param speedProfile - The solved speed profile for the lap.
 * @param params - Vehicle geometric parameters.
 * @returns Distance-weighted average load sensitivity factor.
 */
export function computeAverageLoadFactor(
  speedProfile: SpeedProfilePoint[],
  params: LoadTransferParams = DEFAULT_LOAD_TRANSFER_PARAMS,
): number {
  if (speedProfile.length < 2) {
    return 1.0; // No profile data: no load transfer penalty
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (let i = 1; i < speedProfile.length; i++) {
    const point = speedProfile[i]!;
    const prevPoint = speedProfile[i - 1]!;
    const segmentDistance = point.distance - prevPoint.distance;

    // Handle wrap-around at start/finish (distance resets)
    const weight = segmentDistance > 0 ? segmentDistance : 0;

    const factor = computeLoadSensitivityFactor(
      point.lateralG,
      point.longitudinalG,
      params,
    );

    weightedSum += factor * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) {
    return 1.0;
  }

  return weightedSum / totalWeight;
}

export { DEFAULT_LOAD_TRANSFER_PARAMS } from "./types.js";

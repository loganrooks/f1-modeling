/**
 * Friction ellipse constraint functions for the QSS lap model.
 *
 * Based on Lenzo & Rossi, "A Simple Mono-Dimensional Approach for
 * Lap Time Optimisation," Applied Sciences 2020, 10(4), 1498, Eq. 3-9.
 */

import type { VehicleParams } from "./types.js";

const g = 9.81;

/**
 * Computes the maximum cornering speed for a given absolute curvature
 * and vehicle parameters. Solves the speed-dependent grip quadratic:
 *
 *   v^2 * curvature = mu * (g + kz * v^2 / m)
 *   v_max = sqrt(mu * g / (curvature - mu * kz / m))
 *
 * @param curvature Absolute curvature in 1/m (must be >= 0).
 * @param vehicle Vehicle parameters.
 * @returns Maximum cornering speed in m/s. Returns Infinity when there
 *          is no grip-limited constraint (zero or sub-critical curvature).
 */
export function computeCorneringSpeedLimit(
  curvature: number,
  vehicle: VehicleParams,
): number {
  if (curvature <= 0) {
    return Infinity;
  }

  const { mass, downforceFactor: kz, gripCoefficient: mu } = vehicle;
  const effectiveCurvature = curvature - (mu * kz) / mass;

  if (effectiveCurvature <= 0) {
    // Beyond critical radius -- downforce provides enough lateral force
    // at any speed for this curvature.
    return Infinity;
  }

  return Math.sqrt((mu * g) / effectiveCurvature);
}

/**
 * Computes the maximum longitudinal acceleration available at a given
 * speed and curvature, accounting for the friction ellipse (lateral
 * force consumed by cornering reduces available longitudinal force)
 * and power limits.
 *
 * @param speed Current speed in m/s.
 * @param curvature Absolute curvature in 1/m (must be >= 0).
 * @param vehicle Vehicle parameters.
 * @returns Maximum forward acceleration in m/s^2. Clamped to >= 0.
 */
export function maxAcceleration(
  speed: number,
  curvature: number,
  vehicle: VehicleParams,
): number {
  const { mass, dragFactor: kx, downforceFactor: kz, peakPower, gripCoefficient: mu } = vehicle;
  const v2 = speed * speed;

  // Lateral acceleration consumed by cornering
  const ay = v2 * curvature;
  // Maximum lateral capacity (speed-dependent via downforce)
  const ayMax = mu * (g + (kz * v2) / mass);

  // Friction ellipse ratio
  const ayRatio = Math.min(ay / ayMax, 1);

  // Grip-limited longitudinal acceleration (friction ellipse, Eq. 5)
  // Available longitudinal grip = total grip capacity * sqrt(1 - lateral fraction^2)
  // minus aerodynamic drag deceleration
  const axGrip =
    mu * (g + (kz * v2) / mass) * Math.sqrt(1 - ayRatio * ayRatio) -
    (kx * v2) / mass;

  // Power-limited acceleration (Eq. 6)
  const effectiveSpeed = speed > 0.1 ? speed : 0.1;
  const axPower = (peakPower - kx * v2 * speed) / (mass * effectiveSpeed);

  // Return the more restrictive limit, clamped to non-negative
  return Math.max(Math.min(axGrip, axPower), 0);
}

/**
 * Computes the maximum deceleration (braking) magnitude at a given
 * speed and curvature. Drag assists braking.
 *
 * @param speed Current speed in m/s.
 * @param curvature Absolute curvature in 1/m (must be >= 0).
 * @param vehicle Vehicle parameters.
 * @returns Maximum deceleration magnitude in m/s^2 (positive value).
 */
export function maxDeceleration(
  speed: number,
  curvature: number,
  vehicle: VehicleParams,
): number {
  const { mass, dragFactor: kx, downforceFactor: kz, gripCoefficient: mu } = vehicle;
  const v2 = speed * speed;

  // Lateral acceleration consumed
  const ay = v2 * curvature;
  const ayMax = mu * (g + (kz * v2) / mass);
  const ayRatio = Math.min(ay / ayMax, 1);

  // Braking: grip + drag both help decelerate
  const axBrake =
    mu * (g + (kz * v2) / mass) * Math.sqrt(1 - ayRatio * ayRatio) +
    (kx * v2) / mass;

  return axBrake;
}

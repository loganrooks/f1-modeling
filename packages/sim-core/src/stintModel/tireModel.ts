/**
 * Tire degradation, thermal window, and cliff behavior model.
 *
 * Pure functions operating on TireState and TireCompoundParams.
 * No side effects or mutation -- each function returns a new value
 * or a new TireState.
 *
 * Sources:
 * - Degradation dynamics: adapted from arxiv.org/abs/2512.00640
 *   state-space tire degradation model
 * - Thermal window: standard F1 strategy simulation practice
 * - Load sensitivity: Milliken & Milliken, Race Car Vehicle Dynamics
 */

import type { LapModelOutput } from "../lapModel/types.js";
import type {
  EnvironmentState,
  TireCompoundParams,
  TireState,
} from "./types.js";

/**
 * Creates an initial tire state for a fresh set of tires.
 *
 * @param compound - Tire compound parameters.
 * @param ambientTemp - Ambient / initial track temperature in degrees C.
 * @returns Fresh TireState with zero wear and temperatures at ambient.
 */
export function initializeTireState(
  compound: TireCompoundParams,
  ambientTemp: number,
): TireState {
  return {
    wearFraction: 0,
    surfaceTemperature: ambientTemp,
    coreTemperature: ambientTemp,
    compound: compound.compoundId,
    lapsSinceNew: 0,
  };
}

/**
 * Computes the grip multiplier due to tire wear.
 *
 * Before the cliff threshold: linear degradation (1.0 - 0.15 * wear).
 * After the cliff threshold: quadratic cliff with compound-specific severity.
 * Floor at 0.3 to prevent solver collapse (see RESEARCH.md Pitfall 3).
 *
 * @param state - Current tire state.
 * @param compound - Tire compound parameters.
 * @returns Grip multiplier in [0.3, 1.0].
 */
export function tireWearGripFactor(
  state: TireState,
  compound: TireCompoundParams,
): number {
  if (state.wearFraction < compound.cliffThreshold) {
    // Linear degradation before cliff
    return 1.0 - 0.15 * state.wearFraction;
  }

  // Cliff zone: accelerating grip loss
  const preCliffGrip = 1.0 - 0.15 * compound.cliffThreshold;
  const cliffProgress =
    (state.wearFraction - compound.cliffThreshold) /
    (1.0 - compound.cliffThreshold);
  const cliffGrip =
    preCliffGrip * (1.0 - compound.cliffSeverity * cliffProgress * cliffProgress);

  // Floor at 0.3 to prevent solver collapse
  return Math.max(0.3, cliffGrip);
}

/**
 * Computes the grip multiplier due to tire surface temperature.
 *
 * Returns 1.0 when inside the optimal temperature window
 * [optimalTempLow, optimalTempHigh]. Outside the window, grip drops
 * linearly with thermalSensitivity per degree of deviation. Floor at 0.5.
 *
 * @param state - Current tire state.
 * @param compound - Tire compound parameters.
 * @returns Grip multiplier in [0.5, 1.0].
 */
export function tireThermalFactor(
  state: TireState,
  compound: TireCompoundParams,
): number {
  const temp = state.surfaceTemperature;

  if (temp >= compound.optimalTempLow && temp <= compound.optimalTempHigh) {
    return 1.0; // In optimal window: full grip
  }

  const deviation =
    temp < compound.optimalTempLow
      ? compound.optimalTempLow - temp
      : temp - compound.optimalTempHigh;

  return Math.max(0.5, 1.0 - compound.thermalSensitivity * deviation);
}

/**
 * Updates tire state after completing one lap.
 *
 * - Wear: increases based on baseWearRate and wearAcceleration (clamped 0-1).
 * - Surface temperature: exponential convergence toward an equilibrium
 *   temperature derived from track temperature and compound optimal window.
 * - Core temperature: slower convergence (30% rate) toward surface temperature.
 *
 * Note: The 10% per-lap grip clamp (RESEARCH.md Pitfall 1) is enforced in
 * the StintRunner's resolveEffectiveVehicle, not here.
 *
 * @param prev - Tire state before this lap.
 * @param _lapResult - Lap model output (available for future speed-dependent wear).
 * @param compound - Tire compound parameters.
 * @param envState - Current environment state.
 * @returns Updated tire state.
 */
export function updateTireState(
  prev: TireState,
  _lapResult: LapModelOutput,
  compound: TireCompoundParams,
  envState: EnvironmentState,
): TireState {
  // --- Wear update ---
  const newWear = Math.min(
    1.0,
    Math.max(
      0.0,
      prev.wearFraction +
        compound.baseWearRate * (1 + compound.wearAcceleration * prev.wearFraction),
    ),
  );

  // --- Surface temperature update ---
  // Equilibrium temperature: engineering estimate based on track temperature
  // and compound optimal window. Higher-performance compounds generate more heat.
  const equilibriumTemp = Math.max(
    envState.trackTemperatureC,
    compound.optimalTempLow + 5,
  );

  // Exponential convergence: close `warmupRate` fraction of the gap per lap
  const newSurfaceTemp =
    prev.surfaceTemperature +
    compound.warmupRate * (equilibriumTemp - prev.surfaceTemperature);

  // --- Core temperature update ---
  // Core converges toward surface at 30% rate (slower thermal inertia)
  const newCoreTemp =
    prev.coreTemperature + 0.3 * (newSurfaceTemp - prev.coreTemperature);

  return {
    wearFraction: newWear,
    surfaceTemperature: newSurfaceTemp,
    coreTemperature: newCoreTemp,
    compound: prev.compound,
    lapsSinceNew: prev.lapsSinceNew + 1,
  };
}

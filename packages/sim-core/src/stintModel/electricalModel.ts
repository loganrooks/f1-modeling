/**
 * Reduced-order electrical energy balance model (2026 single-pool, no MGU-H).
 *
 * Tracks battery state-of-charge (SoC) across laps via:
 *   - Harvesting: recoverable braking energy * efficiency, capped at regulatory limit.
 *   - Deployment: fraction of available SoC per lap, governed by policy.
 *   - Power modifier: effective peak power scales with SoC and deploy fraction.
 *
 * The model accepts an optional EnvironmentState to scale harvest efficiency
 * by surface wetness (wet conditions reduce recoverable braking energy via
 * reduced brake thermal transfer to MGU-K recovery path).
 *
 * Source: 2026 FIA PU Technical Regulations (Issue 7), Honda commentary,
 * Heilmeier et al. 2019 QSS energy management approach.
 */

import type { LapModelOutput, SpeedProfilePoint } from "../lapModel/types.js";
import type { ElectricalPolicy, ElectricalState, EnvironmentState } from "./types.js";

// ---------------------------------------------------------------------------
// 2026 FIA PU Technical Regulations reference values
// ---------------------------------------------------------------------------

// Source: Honda commentary + FIA Issue 7, provenance: engineering-inference
const REGULATION_2026 = {
  maxMguKPower: 350_000,       // 350 kW
  maxHarvestPerLap: 8_500_000, // 8.5 MJ
  maxDeltaSoC: 4_000_000,      // 4 MJ usable energy window
  icePower: 400_000,           // ~400 kW ICE (engineering estimate)
};

// ---------------------------------------------------------------------------
// Default deployment policies
// ---------------------------------------------------------------------------

/** Aggressive deployment: uses 70% of available SoC per lap. Higher power early, risks depletion. */
export const DEFAULT_AGGRESSIVE_POLICY: ElectricalPolicy = {
  policyId: "aggressive-deploy",
  deployFraction: 0.7,
  harvestEfficiency: 0.85,
  maxDeployPower: REGULATION_2026.maxMguKPower,
  maxHarvestPerLap: REGULATION_2026.maxHarvestPerLap,
};

/** Conservative deployment: uses 35% of available SoC per lap. More consistent power across the stint. */
export const DEFAULT_CONSERVATIVE_POLICY: ElectricalPolicy = {
  policyId: "conservative-deploy",
  deployFraction: 0.35,
  harvestEfficiency: 0.85,
  maxDeployPower: REGULATION_2026.maxMguKPower,
  maxHarvestPerLap: REGULATION_2026.maxHarvestPerLap,
};

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

/**
 * Creates the initial electrical state with full SoC.
 *
 * @param policy - Electrical deployment/harvest policy (used for context; maxCapacity
 *   defaults to the 2026 4 MJ delta SoC regulation value).
 * @returns Initial ElectricalState at full charge with zeroed counters.
 */
export function initializeElectricalState(policy: ElectricalPolicy): ElectricalState {
  // Silence unused-parameter lint: policy is accepted for future extensibility
  // (e.g., policy-specific initial SoC) but currently uses the regulation default.
  void policy;

  return {
    stateOfCharge: REGULATION_2026.maxDeltaSoC,
    maxCapacity: REGULATION_2026.maxDeltaSoC,
    lapEnergyDeployed: 0,
    lapEnergyHarvested: 0,
    totalDeployed: 0,
    totalHarvested: 0,
  };
}

// ---------------------------------------------------------------------------
// Braking energy estimation
// ---------------------------------------------------------------------------

/**
 * Estimates the total recoverable braking energy from a solved lap speed profile.
 *
 * Iterates through the speed profile and sums kinetic energy deltas where
 * longitudinalG < 0 (braking). The harvest fraction is applied separately
 * by the caller (updateElectricalState).
 *
 * @param lapResult - Output from the QSS lap solver.
 * @param vehicleMass - Vehicle mass in kg.
 * @returns Total dissipated braking energy in Joules.
 */
export function estimateBrakingEnergy(lapResult: LapModelOutput, vehicleMass: number): number {
  const profile: SpeedProfilePoint[] = lapResult.speedProfile;
  let totalBrakingEnergy = 0;

  for (let i = 1; i < profile.length; i++) {
    const current = profile[i]!;
    const previous = profile[i - 1]!;

    // Only count braking segments (deceleration)
    if (current.longitudinalG < 0) {
      // Kinetic energy delta: 0.5 * m * (v_prev^2 - v_current^2)
      const keDelta = 0.5 * vehicleMass * (previous.speed * previous.speed - current.speed * current.speed);
      if (keDelta > 0) {
        totalBrakingEnergy += keDelta;
      }
    }
  }

  return totalBrakingEnergy;
}

// ---------------------------------------------------------------------------
// Per-lap electrical state update
// ---------------------------------------------------------------------------

/**
 * Updates the electrical state for one lap.
 *
 * Energy flow:
 *   1. Harvest = min(brakingEnergy * effectiveHarvestEfficiency, maxHarvestPerLap)
 *   2. Deploy  = min(SoC * deployFraction, maxCapacity)
 *   3. New SoC = clamp(SoC + harvest - deploy, 0, maxCapacity)
 *
 * When environmentState is provided and surfaceWetness > 0, harvest efficiency
 * is reduced: effectiveEfficiency = harvestEfficiency * (1 - 0.2 * surfaceWetness).
 * This models reduced braking energy recovery in wet conditions (cold brakes
 * dissipate less energy through the MGU-K recovery path, and water on brake
 * surfaces reduces thermal transfer).
 *
 * @param prev - Previous electrical state.
 * @param lapResult - Output from the QSS lap solver (for braking energy estimation).
 * @param policy - Electrical deployment/harvest policy.
 * @param vehicleMass - Vehicle mass in kg.
 * @param environmentState - Optional environment state for wetness-scaled harvesting.
 * @returns Updated ElectricalState.
 */
export function updateElectricalState(
  prev: ElectricalState,
  lapResult: LapModelOutput,
  policy: ElectricalPolicy,
  vehicleMass: number,
  environmentState?: EnvironmentState,
): ElectricalState {
  // --- Compute effective harvest efficiency ---
  let effectiveHarvestEfficiency = policy.harvestEfficiency;
  if (environmentState !== undefined && environmentState.surfaceWetness > 0) {
    // Wet penalty: up to 20% reduction at full wetness
    effectiveHarvestEfficiency = policy.harvestEfficiency * (1 - 0.2 * environmentState.surfaceWetness);
  }

  // --- Harvest: braking energy recovery ---
  const brakingEnergy = estimateBrakingEnergy(lapResult, vehicleMass);
  const harvest = Math.min(
    brakingEnergy * effectiveHarvestEfficiency,
    policy.maxHarvestPerLap,
  );

  // --- Deploy: energy consumed from battery this lap ---
  const deploy = Math.min(
    prev.stateOfCharge * policy.deployFraction,
    prev.maxCapacity,
  );

  // --- New SoC: bounded by [0, maxCapacity] ---
  const newSoC = Math.max(0, Math.min(
    prev.maxCapacity,
    prev.stateOfCharge + harvest - deploy,
  ));

  return {
    stateOfCharge: newSoC,
    maxCapacity: prev.maxCapacity,
    lapEnergyDeployed: deploy,
    lapEnergyHarvested: harvest,
    totalDeployed: prev.totalDeployed + deploy,
    totalHarvested: prev.totalHarvested + harvest,
  };
}

// ---------------------------------------------------------------------------
// Power modifier
// ---------------------------------------------------------------------------

/**
 * Computes the effective peak power including electrical deployment.
 *
 * At full SoC with aggressive deploy, effective power = basePeakPower + maxDeployPower.
 * At empty SoC, effective power = basePeakPower (ICE only).
 * Total power is capped at basePeakPower + maxDeployPower.
 *
 * The deploy boost is proportional to (deployFraction * SoC/maxCapacity),
 * scaled so that at full charge and full deploy fraction the boost equals
 * maxDeployPower.
 *
 * @param electricalState - Current electrical state.
 * @param policy - Electrical deployment/harvest policy.
 * @param basePeakPower - ICE-only peak power in Watts.
 * @returns Effective peak power in Watts.
 */
export function computeElectricalPowerModifier(
  electricalState: ElectricalState,
  policy: ElectricalPolicy,
  basePeakPower: number,
): number {
  if (electricalState.stateOfCharge <= 0 || electricalState.maxCapacity <= 0) {
    return basePeakPower; // ICE only, no electrical deployment
  }

  const socFraction = electricalState.stateOfCharge / electricalState.maxCapacity;
  const deployBoost = policy.deployFraction * socFraction * policy.maxDeployPower;
  const effectivePower = basePeakPower + deployBoost;

  // Cap at base + max deploy power
  return Math.min(effectivePower, basePeakPower + policy.maxDeployPower);
}

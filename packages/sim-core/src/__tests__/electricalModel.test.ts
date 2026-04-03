/**
 * Unit tests for the electrical energy balance model.
 *
 * Tests SoC bounds, braking energy estimation, harvest cap, policy comparison,
 * power modifier, and environment-aware harvesting (cross-subsystem coupling).
 */

import { describe, expect, it } from "vitest";

import {
  initializeElectricalState,
  updateElectricalState,
  computeElectricalPowerModifier,
  estimateBrakingEnergy,
  DEFAULT_AGGRESSIVE_POLICY,
  DEFAULT_CONSERVATIVE_POLICY,
} from "../stintModel/electricalModel.js";
import type {
  ElectricalPolicy,
  ElectricalState,
  EnvironmentState,
} from "../stintModel/types.js";
import type { LapModelOutput, SpeedProfilePoint } from "../lapModel/types.js";

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

/**
 * Creates a lap output with configurable braking intensity.
 *
 * "heavy" braking: produces high braking energy (likely exceeds harvest cap)
 * "moderate" braking (default): produces energy below the 8.5 MJ harvest cap
 * so that efficiency scaling (wet/dry) is visible in harvested amounts.
 */
function mockLapOutput(variant: "moderate" | "heavy" = "moderate"): LapModelOutput {
  const profile: SpeedProfilePoint[] = [];

  if (variant === "heavy") {
    // High-speed braking: big speed deltas produce > 8.5 MJ braking energy
    for (let i = 0; i < 20; i++) {
      const isBraking = i % 4 === 3;
      profile.push({
        distance: i * 250,
        speed: isBraking ? 50 + (20 - i) * 3 : 50 + i * 5,
        regime: isBraking ? "braking" : "accelerating-grip",
        curvature: i % 4 === 2 ? 0.01 : 0,
        lateralG: i % 4 === 2 ? 1.5 : 0,
        longitudinalG: isBraking ? -3.0 : 1.0,
        timeIncrement: i === 0 ? 0 : 0.5,
      });
    }
  } else {
    // Moderate braking: small speed deltas produce ~3-5 MJ braking energy (below cap)
    for (let i = 0; i < 20; i++) {
      const isBraking = i % 5 === 4;
      const baseSpeed = 40 + (i % 10) * 4;
      profile.push({
        distance: i * 250,
        speed: isBraking ? baseSpeed - 8 : baseSpeed,
        regime: isBraking ? "braking" : "accelerating-grip",
        curvature: i % 5 === 3 ? 0.01 : 0,
        lateralG: i % 5 === 3 ? 1.0 : 0,
        longitudinalG: isBraking ? -1.5 : 0.5,
        timeIncrement: i === 0 ? 0 : 0.6,
      });
    }
  }

  return {
    lapTime: 80,
    speedProfile: profile,
    sectorResults: [
      { sectorIndex: 0, sectorName: "S1", startDistance: 0, endDistance: 1500, sectorTime: 25, minSpeed: 40, maxSpeed: 76, limitingFactor: "grip" },
      { sectorIndex: 1, sectorName: "S2", startDistance: 1500, endDistance: 3000, sectorTime: 27, minSpeed: 44, maxSpeed: 80, limitingFactor: "power" },
      { sectorIndex: 2, sectorName: "S3", startDistance: 3000, endDistance: 5000, sectorTime: 28, minSpeed: 40, maxSpeed: 76, limitingFactor: "mixed" },
    ],
    assumptions: ["test mock"],
  };
}

const VEHICLE_MASS = 798;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("electricalModel: SoC bounded", () => {
  it("SoC never goes below 0 with aggressive deployment over 50 laps", () => {
    const lapResult = mockLapOutput();
    let state = initializeElectricalState(DEFAULT_AGGRESSIVE_POLICY);

    for (let i = 0; i < 50; i++) {
      state = updateElectricalState(
        state,
        lapResult,
        DEFAULT_AGGRESSIVE_POLICY,
        VEHICLE_MASS,
      );
      expect(state.stateOfCharge).toBeGreaterThanOrEqual(0);
    }
  });

  it("SoC never exceeds maxCapacity with zero deployment over 50 laps", () => {
    const lapResult = mockLapOutput("heavy"); // High harvest to push SoC up
    const noDeployPolicy: ElectricalPolicy = {
      ...DEFAULT_CONSERVATIVE_POLICY,
      deployFraction: 0,
    };
    let state = initializeElectricalState(noDeployPolicy);

    for (let i = 0; i < 50; i++) {
      state = updateElectricalState(
        state,
        lapResult,
        noDeployPolicy,
        VEHICLE_MASS,
      );
      expect(state.stateOfCharge).toBeLessThanOrEqual(state.maxCapacity);
    }
  });
});

describe("electricalModel: harvest from braking", () => {
  it("estimateBrakingEnergy returns a positive value for profiles with braking", () => {
    const lapResult = mockLapOutput("moderate");
    const energy = estimateBrakingEnergy(lapResult, VEHICLE_MASS);
    expect(energy).toBeGreaterThan(0);
  });

  it("stronger braking produces more recoverable energy", () => {
    // Compare moderate braking (smaller speed deltas) vs heavy (larger speed deltas).
    // estimateBrakingEnergy computes raw braking energy from kinetic energy deltas,
    // before the harvest cap is applied.
    const moderateResult = mockLapOutput("moderate");
    const heavyResult = mockLapOutput("heavy");

    const moderateEnergy = estimateBrakingEnergy(moderateResult, VEHICLE_MASS);
    const heavyEnergy = estimateBrakingEnergy(heavyResult, VEHICLE_MASS);

    // Heavy braking should produce higher speed deltas and more recoverable energy
    expect(heavyEnergy).toBeGreaterThan(moderateEnergy);
  });
});

describe("electricalModel: harvest cap", () => {
  it("harvested energy per lap never exceeds maxHarvestPerLap", () => {
    const lapResult = mockLapOutput("heavy"); // High braking energy exceeds cap
    let state = initializeElectricalState(DEFAULT_AGGRESSIVE_POLICY);

    for (let i = 0; i < 10; i++) {
      state = updateElectricalState(
        state,
        lapResult,
        DEFAULT_AGGRESSIVE_POLICY,
        VEHICLE_MASS,
      );
      expect(state.lapEnergyHarvested).toBeLessThanOrEqual(
        DEFAULT_AGGRESSIVE_POLICY.maxHarvestPerLap,
      );
    }
  });
});

describe("electricalModel: policy comparison", () => {
  it("aggressive deploys more total energy and ends with lower SoC than conservative", () => {
    const lapResult = mockLapOutput();
    let aggressiveState = initializeElectricalState(DEFAULT_AGGRESSIVE_POLICY);
    let conservativeState = initializeElectricalState(DEFAULT_CONSERVATIVE_POLICY);

    for (let i = 0; i < 20; i++) {
      aggressiveState = updateElectricalState(
        aggressiveState,
        lapResult,
        DEFAULT_AGGRESSIVE_POLICY,
        VEHICLE_MASS,
      );
      conservativeState = updateElectricalState(
        conservativeState,
        lapResult,
        DEFAULT_CONSERVATIVE_POLICY,
        VEHICLE_MASS,
      );

      // Both must maintain non-negative SoC
      expect(aggressiveState.stateOfCharge).toBeGreaterThanOrEqual(0);
      expect(conservativeState.stateOfCharge).toBeGreaterThanOrEqual(0);
    }

    // Aggressive: higher total deployed, lower final SoC
    expect(aggressiveState.totalDeployed).toBeGreaterThan(
      conservativeState.totalDeployed,
    );
    expect(aggressiveState.stateOfCharge).toBeLessThan(
      conservativeState.stateOfCharge,
    );
  });
});

describe("electricalModel: power modifier", () => {
  const basePower = 400_000;

  it("returns higher power with high SoC and aggressive policy", () => {
    const fullSoCState: ElectricalState = {
      stateOfCharge: 4_000_000,
      maxCapacity: 4_000_000,
      lapEnergyDeployed: 0,
      lapEnergyHarvested: 0,
      totalDeployed: 0,
      totalHarvested: 0,
    };

    const power = computeElectricalPowerModifier(
      fullSoCState,
      DEFAULT_AGGRESSIVE_POLICY,
      basePower,
    );

    expect(power).toBeGreaterThan(basePower);
  });

  it("returns base power only when SoC is depleted", () => {
    const emptySoCState: ElectricalState = {
      stateOfCharge: 0,
      maxCapacity: 4_000_000,
      lapEnergyDeployed: 0,
      lapEnergyHarvested: 0,
      totalDeployed: 0,
      totalHarvested: 0,
    };

    const power = computeElectricalPowerModifier(
      emptySoCState,
      DEFAULT_AGGRESSIVE_POLICY,
      basePower,
    );

    expect(power).toBe(basePower);
  });

  it("aggressive policy at full SoC produces more power than conservative", () => {
    const fullSoCState: ElectricalState = {
      stateOfCharge: 4_000_000,
      maxCapacity: 4_000_000,
      lapEnergyDeployed: 0,
      lapEnergyHarvested: 0,
      totalDeployed: 0,
      totalHarvested: 0,
    };

    const aggressivePower = computeElectricalPowerModifier(
      fullSoCState,
      DEFAULT_AGGRESSIVE_POLICY,
      basePower,
    );
    const conservativePower = computeElectricalPowerModifier(
      fullSoCState,
      DEFAULT_CONSERVATIVE_POLICY,
      basePower,
    );

    expect(aggressivePower).toBeGreaterThan(conservativePower);
  });
});

describe("electricalModel: environment-aware harvesting (cross-subsystem)", () => {
  const lapResult = mockLapOutput();

  const dryEnv: EnvironmentState = {
    surfaceWetness: 0.0,
    trackTemperatureC: 33,
    rubberEvolution: 1.0,
    gripModifier: 1.0,
  };

  const wetEnv: EnvironmentState = {
    surfaceWetness: 0.7,
    trackTemperatureC: 18,
    rubberEvolution: 0.95,
    gripModifier: 0.6,
  };

  it("wet conditions produce less harvested energy than dry", () => {
    const initialState = initializeElectricalState(DEFAULT_CONSERVATIVE_POLICY);

    const dryResult = updateElectricalState(
      initialState,
      lapResult,
      DEFAULT_CONSERVATIVE_POLICY,
      VEHICLE_MASS,
      dryEnv,
    );

    const wetResult = updateElectricalState(
      initialState,
      lapResult,
      DEFAULT_CONSERVATIVE_POLICY,
      VEHICLE_MASS,
      wetEnv,
    );

    expect(wetResult.lapEnergyHarvested).toBeLessThan(
      dryResult.lapEnergyHarvested,
    );
  });

  it("wet harvest is approximately 86% of dry harvest at 0.7 wetness", () => {
    const initialState = initializeElectricalState(DEFAULT_CONSERVATIVE_POLICY);

    const dryResult = updateElectricalState(
      initialState,
      lapResult,
      DEFAULT_CONSERVATIVE_POLICY,
      VEHICLE_MASS,
      dryEnv,
    );

    const wetResult = updateElectricalState(
      initialState,
      lapResult,
      DEFAULT_CONSERVATIVE_POLICY,
      VEHICLE_MASS,
      wetEnv,
    );

    // 1 - 0.2 * 0.7 = 0.86, so wet should be ~86% of dry
    const ratio = wetResult.lapEnergyHarvested / dryResult.lapEnergyHarvested;
    expect(ratio).toBeCloseTo(0.86, 1);
  });

  it("undefined environmentState matches dry case (no penalty)", () => {
    const initialState = initializeElectricalState(DEFAULT_CONSERVATIVE_POLICY);

    const dryResult = updateElectricalState(
      initialState,
      lapResult,
      DEFAULT_CONSERVATIVE_POLICY,
      VEHICLE_MASS,
      dryEnv,
    );

    const noEnvResult = updateElectricalState(
      initialState,
      lapResult,
      DEFAULT_CONSERVATIVE_POLICY,
      VEHICLE_MASS,
      undefined,
    );

    expect(noEnvResult.lapEnergyHarvested).toBe(dryResult.lapEnergyHarvested);
  });
});

/**
 * Phase 3 stint model types.
 *
 * All types for multi-lap stint simulation: tire state, electrical state,
 * environment state, aero mode, load transfer, and the StintRunner
 * orchestration types.
 *
 * These are sim-core internal types (no Zod). Domain-level schemas live
 * in @f1-modeling/domain.
 */

import type { CircuitDocument } from "@f1-modeling/domain";

import type { VehicleParams } from "../lapModel/types.js";

// ---------------------------------------------------------------------------
// Compound identifiers
// ---------------------------------------------------------------------------

export type CompoundId = "soft" | "medium" | "hard" | "intermediate" | "wet";

// ---------------------------------------------------------------------------
// Tire compound parameters
// ---------------------------------------------------------------------------

export interface TireCompoundParams {
  /** Compound identifier. */
  compoundId: CompoundId;
  /** Peak grip coefficient (dimensionless, e.g. 1.85 for soft). */
  peakGrip: number;
  /** Wear fraction gained per lap at zero accumulated wear. */
  baseWearRate: number;
  /** How much accumulated wear accelerates further wear (dimensionless). */
  wearAcceleration: number;
  /** Wear fraction at which cliff behavior begins (e.g. 0.70). */
  cliffThreshold: number;
  /** Severity of grip loss in the cliff zone (0-1 scale). */
  cliffSeverity: number;
  /** Low end of the optimal surface temperature window (degrees C). */
  optimalTempLow: number;
  /** High end of the optimal surface temperature window (degrees C). */
  optimalTempHigh: number;
  /** Grip loss per degree C outside the optimal window. */
  thermalSensitivity: number;
  /** Fraction of the gap between current and equilibrium temperature closed per lap. */
  warmupRate: number;
  /** Data provenance label (e.g. "engineering-inference"). */
  provenance: string;
}

// ---------------------------------------------------------------------------
// Tire state
// ---------------------------------------------------------------------------

export interface TireState {
  /** Accumulated wear as a fraction: 0.0 (new) to 1.0 (fully worn). */
  wearFraction: number;
  /** Tire surface temperature in degrees C. */
  surfaceTemperature: number;
  /** Tire core (carcass) temperature in degrees C. */
  coreTemperature: number;
  /** Current compound identifier. */
  compound: CompoundId;
  /** Number of laps completed on this set of tires. */
  lapsSinceNew: number;
}

// ---------------------------------------------------------------------------
// Electrical state (stubbed -- filled by Plan 02)
// ---------------------------------------------------------------------------

export interface ElectricalState {
  /** Current state of charge in Joules. */
  stateOfCharge: number;
  /** Maximum battery energy capacity in Joules. */
  maxCapacity: number;
  /** Energy deployed during the most recent lap (Joules). */
  lapEnergyDeployed: number;
  /** Energy harvested during the most recent lap (Joules). */
  lapEnergyHarvested: number;
  /** Cumulative energy deployed over the stint (Joules). */
  totalDeployed: number;
  /** Cumulative energy harvested over the stint (Joules). */
  totalHarvested: number;
}

// ---------------------------------------------------------------------------
// Electrical policy (stubbed -- filled by Plan 02)
// ---------------------------------------------------------------------------

export interface ElectricalPolicy {
  /** Policy identifier, e.g. "aggressive-deploy". */
  policyId: string;
  /** Fraction of available SoC to deploy per lap (0-1). */
  deployFraction: number;
  /** Fraction of braking energy captured (0-1). */
  harvestEfficiency: number;
  /** Maximum electrical deployment power in Watts. */
  maxDeployPower: number;
  /** Maximum energy harvested per lap in Joules. */
  maxHarvestPerLap: number;
}

// ---------------------------------------------------------------------------
// Environment state (stubbed -- filled by Plan 03)
// ---------------------------------------------------------------------------

export interface EnvironmentState {
  /** Track surface temperature in degrees C. */
  trackTemperatureC: number;
  /** Ambient air temperature in degrees C. Affects tire cooling rate. */
  ambientTemperatureC: number;
  /** Surface wetness: 0.0 (fully dry) to 1.0 (fully wet). */
  surfaceWetness: number;
  /** Rubber buildup evolution factor: 0.95 (green track) to 1.05 (rubbered in). */
  rubberEvolution: number;
  /** Composite grip modifier (product of surface, rubber, etc.). */
  gripModifier: number;
}

// ---------------------------------------------------------------------------
// Weather timeline (stubbed -- filled by Plan 03)
// ---------------------------------------------------------------------------

export interface WeatherTimelineEntry {
  /** Lap number at which this weather state begins. */
  lap: number;
  /** Track surface temperature in degrees C. */
  trackTemperatureC: number;
  /** Surface wetness: 0.0 to 1.0. */
  surfaceWetness: number;
  /** Descriptive rainfall level. */
  rainfall: string;
}

export type WeatherTimeline = WeatherTimelineEntry[];

// ---------------------------------------------------------------------------
// Aero mode config (stubbed -- filled by Plan 02)
// ---------------------------------------------------------------------------

export interface AeroModeConfig {
  /** Distance ranges where Straight Mode is active. */
  straightModeZones: Array<{ startDistance: number; endDistance: number }>;
  /** Drag factor in Corner Mode (high downforce). */
  cornerModeDragFactor: number;
  /** Downforce factor in Corner Mode. */
  cornerModeDownforceFactor: number;
  /** Drag factor in Straight Mode (low drag). */
  straightModeDragFactor: number;
  /** Downforce factor in Straight Mode (reduced downforce). */
  straightModeDownforceFactor: number;
}

// ---------------------------------------------------------------------------
// Load transfer parameters
// ---------------------------------------------------------------------------

export interface LoadTransferParams {
  /** Center of gravity height in meters. */
  cogHeight: number;
  /** Wheelbase in meters. */
  wheelbase: number;
  /** Track width (front or rear, simplified) in meters. */
  trackWidth: number;
  /** Fraction of static weight on the front axle (0-1). */
  frontWeightFraction: number;
}

/**
 * Default load transfer parameters for a 2026-era F1 car.
 * Provenance: engineering-inference from public technical regulations.
 */
export const DEFAULT_LOAD_TRANSFER_PARAMS: LoadTransferParams = {
  cogHeight: 0.30,
  wheelbase: 3.6,
  trackWidth: 1.8,
  frontWeightFraction: 0.45,
};

// ---------------------------------------------------------------------------
// Stint state (evolves each lap)
// ---------------------------------------------------------------------------

export interface StintState {
  /** Current lap number (0-indexed during iteration; final = totalLaps). */
  lapNumber: number;
  /** Current tire state. */
  tireState: TireState;
  /** Current electrical state. */
  electricalState: ElectricalState;
  /** Current environment state. */
  environmentState: EnvironmentState;
  /** Remaining fuel mass in kg. */
  fuelMass: number;
}

// ---------------------------------------------------------------------------
// Stint configuration (input to runStint)
// ---------------------------------------------------------------------------

export interface StintConfig {
  /** Circuit to simulate on. */
  circuit: CircuitDocument;
  /** Baseline vehicle parameters before subsystem modifications. */
  baseVehicle: VehicleParams;
  /** Tire compound parameters for this stint. */
  tireCompound: TireCompoundParams;
  /** Electrical deployment/harvest policy. */
  electricalPolicy: ElectricalPolicy;
  /** Weather evolution over the stint. */
  weatherTimeline: WeatherTimeline;
  /** Active aero mode configuration, or null if not active. */
  aeroConfig: AeroModeConfig | null;
  /** Load transfer parameters for weight transfer model. */
  loadTransferParams: LoadTransferParams;
  /** Total number of laps to simulate. */
  totalLaps: number;
  /** Ambient air temperature in degrees C from weather preset. Default 24. */
  ambientTemperatureC?: number;
}

// ---------------------------------------------------------------------------
// Per-lap trace (recorded after each lap solve)
// ---------------------------------------------------------------------------

export interface LapTrace {
  /** Lap number (0-indexed). */
  lapNumber: number;
  /** Lap time in seconds. */
  lapTime: number;
  /** Tire state snapshot after this lap. */
  tireState: TireState;
  /** Electrical state snapshot after this lap. */
  electricalState: ElectricalState;
  /** Environment state snapshot after this lap. */
  environmentState: EnvironmentState;
  /** Effective grip coefficient used for this lap. */
  effectiveGrip: number;
  /** Effective peak power used for this lap (Watts). */
  effectivePower: number;
  /** Effective drag factor used for this lap. */
  effectiveDragFactor: number;
  /** Effective downforce factor used for this lap. */
  effectiveDownforceFactor: number;
}

// ---------------------------------------------------------------------------
// Stint result (output of runStint)
// ---------------------------------------------------------------------------

export interface StintResult {
  /** Per-lap traces for the entire stint. */
  lapTraces: LapTrace[];
  /** Final subsystem state after the last lap. */
  finalState: StintState;
  /** Total stint time in seconds (sum of lap times). */
  totalTime: number;
  /** Documented model assumptions and limitations. */
  assumptions: string[];
}

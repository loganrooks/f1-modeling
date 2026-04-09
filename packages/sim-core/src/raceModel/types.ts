/**
 * Phase 3.1 race model types.
 *
 * All types for multi-stint race simulation: race configuration,
 * pit-lane parameters, timeline events, and race results.
 *
 * These are sim-core internal types (no Zod). Domain-level schemas live
 * in @f1-modeling/domain.
 */

import type { CircuitDocument } from "@f1-modeling/domain";

import type { VehicleParams } from "../lapModel/types.js";
import type {
  AeroModeConfig,
  CompoundId,
  ElectricalPolicy,
  LoadTransferParams,
  StintResult,
  TireCompoundParams,
  WeatherTimeline,
} from "../stintModel/types.js";

// ---------------------------------------------------------------------------
// Pit-lane parameters
// ---------------------------------------------------------------------------

/** Circuit-specific pit-lane loss parameters. */
export interface PitLaneParams {
  /** Seconds to decelerate and traverse pit entry. */
  pitEntryTime: number;
  /** Seconds to accelerate and traverse pit exit. */
  pitExitTime: number;
  /** Seconds at racing speed over the pit lane distance (bypass time). */
  pitBypassTime: number;
  /** Stationary service time in seconds (e.g. ~2.5s for tire change). */
  serviceTime: number;
}

// ---------------------------------------------------------------------------
// Pit-loss result
// ---------------------------------------------------------------------------

/** Output of pit-loss calculation. */
export interface PitLossResult {
  /** Total time lost vs staying on track (seconds). */
  totalLoss: number;
  /** Entry + exit time minus bypass time (seconds). */
  traversalDelta: number;
  /** Stationary service time (seconds). */
  serviceTime: number;
}

// ---------------------------------------------------------------------------
// Interruption types
// ---------------------------------------------------------------------------

/** Race interruption type. */
export type InterruptionType = "vsc" | "sc" | "red-flag";

/** Input interruption event specification. */
export interface InterruptionSpec {
  type: InterruptionType;
  startLap: number;
  endLap: number;
}

// ---------------------------------------------------------------------------
// Stint specification (resolved, for race engine)
// ---------------------------------------------------------------------------

/** Per-stint specification with resolved compound and policy references. */
export interface StintSpec {
  stintIndex: number;
  totalLaps: number;
  tireCompound: TireCompoundParams;
  electricalPolicy: ElectricalPolicy;
}

// ---------------------------------------------------------------------------
// Race configuration
// ---------------------------------------------------------------------------

/** Full race engine configuration. */
export interface RaceConfig {
  circuit: CircuitDocument;
  baseVehicle: VehicleParams;
  weatherTimeline: WeatherTimeline;
  aeroConfig: AeroModeConfig | null;
  loadTransferParams: LoadTransferParams;
  pitLaneParams: PitLaneParams;
  ambientTemperatureC: number;
}

// ---------------------------------------------------------------------------
// Race timeline events (discriminated union on `type`)
// ---------------------------------------------------------------------------

export interface StintStartEvent {
  type: "stint-start";
  stintIndex: number;
  raceLap: number;
  compound: CompoundId;
  policyId: string;
}

export interface StintEndEvent {
  type: "stint-end";
  stintIndex: number;
  raceLap: number;
  stintTime: number;
  cumulativeRaceTime: number;
  finalTireWear: number;
  finalSoC: number;
  effectiveGripRange: [number, number];
}

export interface PitEvent {
  type: "pit-event";
  afterStintIndex: number;
  raceLap: number;
  pitLoss: PitLossResult;
  newCompound: CompoundId;
}

export interface InterruptionStartEvent {
  type: "interruption-start";
  interruptionType: InterruptionType;
  raceLap: number;
}

export interface InterruptionEndEvent {
  type: "interruption-end";
  interruptionType: InterruptionType;
  raceLap: number;
}

/** Discriminated union of all race timeline event types. */
export type RaceTimelineEvent =
  | StintStartEvent
  | StintEndEvent
  | PitEvent
  | InterruptionStartEvent
  | InterruptionEndEvent;

// ---------------------------------------------------------------------------
// Race result
// ---------------------------------------------------------------------------

/** Per-stint summary within the race result. */
export interface StintSummary {
  stintIndex: number;
  compound: CompoundId;
  laps: number;
  stintTime: number;
  finalWear: number;
  finalSoC: number;
}

/** Output of runRace. */
export interface RaceResult {
  stintResults: StintResult[];
  timeline: RaceTimelineEvent[];
  totalRaceTime: number;
  totalPitTime: number;
  stintSummaries: StintSummary[];
  assumptions: string[];
}

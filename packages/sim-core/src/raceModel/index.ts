/**
 * Race model barrel export.
 *
 * All type definitions and implementation functions for multi-stint
 * race simulation.
 */

// Types
export type {
  InterruptionEndEvent,
  InterruptionSpec,
  InterruptionStartEvent,
  InterruptionType,
  PitEvent,
  PitLaneParams,
  PitLossResult,
  RaceConfig,
  RaceResult,
  RaceTimelineEvent,
  StintEndEvent,
  StintSpec,
  StintStartEvent,
  StintSummary,
} from "./types.js";

// Race engine
export { runRace } from "./raceRunner.js";

// Pit model
export { computePitLoss, DEFAULT_PIT_LANE_PARAMS } from "./pitModel.js";

// Interruption model
export {
  interruptionLapTimeFactor,
  pitLossDiscountFactor,
  applyInterruptionsToLapTimes,
} from "./interruptionModel.js";

// Tire inventory
export {
  validateTireInventory,
  trackTireUsage,
  DEFAULT_TIRE_ALLOCATION,
} from "./tireInventory.js";
export type {
  TireSetAllocation,
  TireUsageEntry,
} from "./tireInventory.js";

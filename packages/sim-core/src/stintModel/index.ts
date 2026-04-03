/**
 * Stint model barrel export.
 *
 * Re-exports all types, constants, and functions from the stint model
 * subsystem for clean imports from "@f1-modeling/sim-core".
 */

// Types and constants
export type {
  AeroModeConfig,
  CompoundId,
  ElectricalPolicy,
  ElectricalState,
  EnvironmentState,
  LapTrace,
  LoadTransferParams,
  StintConfig,
  StintResult,
  StintState,
  TireCompoundParams,
  TireState,
  WeatherTimeline,
  WeatherTimelineEntry,
} from "./types.js";
export { DEFAULT_LOAD_TRANSFER_PARAMS } from "./types.js";

// Tire model functions
export {
  initializeTireState,
  tireWearGripFactor,
  tireThermalFactor,
  updateTireState,
} from "./tireModel.js";

// Load transfer functions
export {
  computeAverageLoadFactor,
  computeLoadSensitivityFactor,
} from "./loadTransfer.js";

// Stint runner
export {
  initializeStintState,
  resolveEffectiveVehicle,
  runStint,
} from "./stintRunner.js";

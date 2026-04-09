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

// Electrical model
export {
  initializeElectricalState,
  updateElectricalState,
  computeElectricalPowerModifier,
  estimateBrakingEnergy,
  DEFAULT_AGGRESSIVE_POLICY,
  DEFAULT_CONSERVATIVE_POLICY,
} from "./electricalModel.js";

// Environment model
export {
  initializeEnvironmentState,
  updateEnvironmentState,
  surfaceGripFactor,
  rubberEvolutionFactor,
  interpolateWeatherAtLap,
} from "./environmentModel.js";

// Aero model
export {
  resolveAeroPerPoint,
  computeAverageAeroFactors,
} from "./aeroModel.js";
export type { AeroResolvedPoint, AeroMode } from "./aeroModel.js";

// Stint runner
export {
  initializeStintState,
  resolveEffectiveVehicle,
  runStint,
  runStintFromState,
} from "./stintRunner.js";

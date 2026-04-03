export type {
  LapModelSummary,
  Phase1PlaceholderSummary,
  SimulationHarness,
  SimulationRunRequest,
  SimulationRunSummary,
  StintModelSummary,
} from "./contracts.js";
export { runPhase1PlaceholderScenario } from "./phase1Placeholder.js";

export {
  computeCorneringSpeedLimit,
  DEFAULT_VEHICLE_PARAMS,
  maxAcceleration,
  maxDeceleration,
  solveLap,
  solveSpeedProfile,
} from "./lapModel/index.js";
export type {
  CircuitLayoutPoint,
  LapModelOutput,
  SectorResult,
  SpeedProfilePoint,
  VehicleParams,
} from "./lapModel/index.js";

// Stint model (Phase 3)
export {
  computeAverageLoadFactor,
  computeLoadSensitivityFactor,
  DEFAULT_LOAD_TRANSFER_PARAMS,
  initializeStintState,
  initializeTireState,
  resolveEffectiveVehicle,
  runStint,
  tireWearGripFactor,
  tireThermalFactor,
  updateTireState,
} from "./stintModel/index.js";
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
} from "./stintModel/index.js";

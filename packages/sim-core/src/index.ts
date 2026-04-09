export type {
  LapModelSummary,
  Phase1PlaceholderSummary,
  RaceSimulationSummary,
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

// Race model (Phase 3.1)
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
} from "./raceModel/index.js";

// Stint model (Phase 3)
export {
  computeAverageLoadFactor,
  computeLoadSensitivityFactor,
  DEFAULT_AGGRESSIVE_POLICY,
  DEFAULT_CONSERVATIVE_POLICY,
  DEFAULT_LOAD_TRANSFER_PARAMS,
  initializeEnvironmentState,
  initializeStintState,
  initializeTireState,
  interpolateWeatherAtLap,
  resolveEffectiveVehicle,
  rubberEvolutionFactor,
  runStint,
  surfaceGripFactor,
  tireWearGripFactor,
  tireThermalFactor,
  updateEnvironmentState,
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

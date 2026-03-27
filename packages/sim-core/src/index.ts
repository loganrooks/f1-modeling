export type {
  SimulationHarness,
  SimulationRunRequest,
  SimulationRunSummary,
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

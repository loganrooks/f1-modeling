import type {
  SectorResult,
  SpeedProfilePoint,
  VehicleParams,
} from "./lapModel/types.js";
export interface SimulationRunRequest {
  scenarioId: string;
  scenarioLabel: string;
  seed?: number;
}

/**
 * Phase 1 placeholder summary. Preserved for backward compatibility.
 * Discriminated on harnessId: "phase1-placeholder".
 */
export interface Phase1PlaceholderSummary {
  runId: string;
  harnessId: "phase1-placeholder";
  modelVersion: "phase1-placeholder/v1";
  scenarioId: string;
  scenarioLabel: string;
  seed: number;
  placeholder: true;
  metrics: {
    placeholderScore: number;
    comparisonBaseline: number;
    tracePoints: number;
  };
  trace: Array<{
    step: number;
    label: string;
    value: number;
  }>;
  notes: string[];
}

/**
 * Phase 2 quasi-steady-state lap model summary.
 * Discriminated on harnessId: "qss-lap-model".
 */
export interface LapModelSummary {
  runId: string;
  harnessId: "qss-lap-model";
  modelVersion: string;
  scenarioId: string;
  scenarioLabel: string;
  seed: number;
  placeholder: false;
  vehicleParams: VehicleParams;
  circuitId: string;
  lapTime: number;
  sectorResults: SectorResult[];
  speedProfile: SpeedProfilePoint[];
  assumptions: string[];
  notes: string[];
}

/**
 * Phase 3 multi-lap stint model summary.
 * Discriminated on harnessId: "stint-model".
 */
export interface StintModelSummary {
  runId: string;
  harnessId: "stint-model";
  modelVersion: string;
  scenarioId: string;
  scenarioLabel: string;
  seed: number;
  placeholder: false;
  vehicleParams: VehicleParams;
  circuitId: string;
  tireCompound: string;
  electricalPolicy: string;
  totalLaps: number;
  lapTimes: number[];
  totalTime: number;
  finalTireWear: number;
  finalElectricalSoC: number;
  assumptions: string[];
  notes: string[];
}

/**
 * Phase 3.1 race simulation summary.
 * Discriminated on harnessId: "race-simulation".
 */
export interface RaceSimulationSummary {
  runId: string;
  harnessId: "race-simulation";
  modelVersion: string;
  scenarioId: string;
  scenarioLabel: string;
  seed: number;
  placeholder: false;
  vehicleParams: VehicleParams;
  circuitId: string;
  stintCount: number;
  totalRaceLaps: number;
  totalRaceTime: number;
  totalPitTime: number;
  stintSummaries: Array<{
    stintIndex: number;
    compound: string;
    laps: number;
    stintTime: number;
    finalWear: number;
    finalSoC: number;
  }>;
  assumptions: string[];
  notes: string[];
}

/**
 * Discriminated union of all simulation run summary types.
 * Discriminate on `harnessId` to narrow to a specific type.
 */
export type SimulationRunSummary =
  | LapModelSummary
  | Phase1PlaceholderSummary
  | RaceSimulationSummary
  | StintModelSummary;

export interface SimulationHarness {
  readonly harnessId: string;
  readonly modelVersion: string;
  run(request: SimulationRunRequest): SimulationRunSummary;
}

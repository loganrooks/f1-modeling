export interface SimulationRunRequest {
  scenarioId: string;
  scenarioLabel: string;
  seed?: number;
}

export interface SimulationRunSummary {
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

export interface SimulationHarness {
  readonly harnessId: string;
  readonly modelVersion: string;
  run(request: SimulationRunRequest): SimulationRunSummary;
}

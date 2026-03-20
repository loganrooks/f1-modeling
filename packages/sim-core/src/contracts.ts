export interface SimulationRunRequest {
  scenarioId: string;
  seed?: number;
}

export interface SimulationRunSummary {
  placeholder: true;
}

export interface SimulationHarness {
  run(request: SimulationRunRequest): SimulationRunSummary;
}

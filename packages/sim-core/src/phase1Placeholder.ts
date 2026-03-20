import type { SimulationRunRequest, SimulationRunSummary } from "./contracts.js";

export function runPhase1PlaceholderScenario(
  _request: SimulationRunRequest,
): SimulationRunSummary {
  return {
    placeholder: true,
  };
}

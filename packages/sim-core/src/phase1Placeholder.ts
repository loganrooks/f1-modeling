import type { SimulationRunRequest, SimulationRunSummary } from "./contracts.js";

const PHASE1_PLACEHOLDER_HARNESS = "phase1-placeholder" as const;
const PHASE1_PLACEHOLDER_MODEL_VERSION = "phase1-placeholder/v1" as const;
const TRACE_LABELS = [
  "inputs-accepted",
  "wiring-checked",
  "summary-ready",
] as const;

function stableHash(input: string): number {
  let hash = 2166136261;

  for (const character of input) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function runPhase1PlaceholderScenario(
  request: SimulationRunRequest,
): SimulationRunSummary {
  const seed = request.seed ?? 0;
  const baseHash = stableHash(
    `${request.scenarioId}:${request.scenarioLabel}:${seed}`,
  );
  const placeholderScore = 48 + (baseHash % 19);
  const comparisonBaseline = placeholderScore + ((baseHash >>> 3) % 5);
  const trace = TRACE_LABELS.map((label, step) => ({
    step,
    label,
    value: placeholderScore + step * 2 + (baseHash % 3),
  }));

  return {
    runId: `phase1-${baseHash.toString(16)}`,
    harnessId: PHASE1_PLACEHOLDER_HARNESS,
    modelVersion: PHASE1_PLACEHOLDER_MODEL_VERSION,
    scenarioId: request.scenarioId,
    scenarioLabel: request.scenarioLabel,
    seed,
    placeholder: true,
    metrics: {
      placeholderScore,
      comparisonBaseline,
      tracePoints: trace.length,
    },
    trace,
    notes: [
      "Deterministic Phase 1 placeholder harness for workspace wiring only.",
      "Not a lap model, stint model, or physics-based simulation.",
    ],
  };
}

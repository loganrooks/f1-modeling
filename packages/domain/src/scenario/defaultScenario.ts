import type { PlaceholderProvenance } from "../common/provenance.js";

import { scenarioDocumentSchema, type ScenarioDocument } from "./schema.js";
import { scenarioDocumentSchemaVersion } from "../common/schemaVersion.js";

export interface CreateDefaultScenarioOptions {
  scenarioId?: string;
  name?: string;
  seed?: number;
}

const basePlaceholderProvenance: PlaceholderProvenance = {
  sourceType: "placeholder",
  source: "Phase 1 default scenario factory",
  notes:
    "This placeholder data is intentionally minimal until later phases add richer contracts.",
};

function createPlaceholderProvenance(
  source: string,
  notes: string,
): PlaceholderProvenance {
  return {
    ...basePlaceholderProvenance,
    source,
    notes,
  };
}

function createReservedPlaceholder(
  description: string,
  notes: string,
): ScenarioDocument["observerConfigPlaceholder"] {
  return {
    status: "placeholder",
    description,
    provenance: createPlaceholderProvenance(
      "Phase 1 scenario document placeholder",
      notes,
    ),
  };
}

export function createDefaultScenario(
  options: CreateDefaultScenarioOptions = {},
): ScenarioDocument {
  return scenarioDocumentSchema.parse({
    schemaVersion: scenarioDocumentSchemaVersion,
    scenarioId: options.scenarioId ?? "phase1-default-scenario",
    name: options.name ?? "Phase 1 default scenario",
    notes: [
      "Canonical Phase 1 scenario scaffold for UI wiring, persistence, and tests.",
    ],
    circuit: {
      circuitId: "silverstone-gp",
      name: "Silverstone Circuit",
      configuration: "Grand Prix",
    },
    sessionPreset: {
      presetId: "grand-prix-race",
      label: "Grand Prix Race",
    },
    regulationPreset: {
      presetId: "fia-2026-baseline",
      label: "FIA 2026 Baseline",
    },
    weatherPreset: {
      presetId: "dry-baseline",
      label: "Dry Baseline",
    },
    driverProfile: {
      profileId: "phase1-driver-placeholder",
      label: "Driver placeholder",
      description:
        "Reserved placeholder for future driver-style and control-policy modeling.",
      provenance: createPlaceholderProvenance(
        "Phase 1 driver placeholder",
        "Driver-specific behavior remains a later-phase concern and is not modeled yet.",
      ),
    },
    seed: options.seed ?? 0,
    assumptionNotes: [
      {
        note: "Circuit metadata is identification-only in Phase 1 and does not imply a calibrated track model.",
        provenance: createPlaceholderProvenance(
          "Phase 1 scenario assumptions",
          "Track geometry, racing lines, and subsystem fidelity are still deferred.",
        ),
      },
    ],
    observerConfigPlaceholder: createReservedPlaceholder(
      "Reserved for future observer configuration.",
      "Observer methods are intentionally deferred until Phase 4.",
    ),
    controllerConfigPlaceholder: createReservedPlaceholder(
      "Reserved for future controller configuration.",
      "Control-policy settings are intentionally deferred until Phase 5.",
    ),
    importedDataAlignmentPlaceholder: createReservedPlaceholder(
      "Reserved for future imported-data alignment metadata.",
      "External session-data alignment is intentionally deferred until Phase 6.",
    ),
  });
}

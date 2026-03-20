import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  createRunRecord,
  createDefaultScenario,
  presetDocumentSchema,
  presetDocumentSchemaVersion,
  runRecordSchema,
  runRecordSchemaVersion,
  scenarioDocumentSchema,
} from "../index.js";
import { loadPresetCatalogFromDisk } from "@f1-modeling/domain/node/preset-catalog";

const presetsRoot = fileURLToPath(new URL("../../../../presets", import.meta.url));

function createPresetSnapshot(
  presetType: "regulation" | "session" | "weather",
  presetId: string,
  name: string,
) {
  return {
    schemaVersion: "preset-document/v1",
    presetId,
    presetType,
    name,
    description: `${name} snapshot`,
    provenance: {
      sourceType: "engineering-inference" as const,
      source: "Phase 1 contract test fixture",
      notes: "Representative preset payload for schema validation.",
    },
    assumptionNotes: [],
    values: {
      label: name,
      placeholder: presetType === "weather",
    },
  };
}

function createValidRunRecord() {
  const scenario = createDefaultScenario();

  return {
    schemaVersion: runRecordSchemaVersion,
    runId: "phase1-run-record",
    createdAt: "2026-03-20T02:45:00.000Z",
    scenarioId: scenario.scenarioId,
    scenarioSnapshot: scenario,
    presetReferences: {
      regulation: scenario.regulationPreset,
      session: scenario.sessionPreset,
      weather: scenario.weatherPreset,
    },
    presetSnapshots: {
      regulation: createPresetSnapshot(
        "regulation",
        "fia-2026-baseline",
        "FIA 2026 Baseline",
      ),
      session: createPresetSnapshot(
        "session",
        "grand-prix-race",
        "Grand Prix Race",
      ),
      weather: createPresetSnapshot(
        "weather",
        "dry-baseline",
        "Dry Baseline",
      ),
    },
    modelVersion: "phase1-placeholder/v1",
    appVersion: "0.1.0",
    seed: scenario.seed,
    status: "completed" as const,
    summaryMetrics: {
      placeholderScore: 52,
      comparisonBaseline: 55,
    },
    artifacts: [
      {
        artifactId: "phase1-summary-trace",
        artifactType: "trace",
        label: "Placeholder trace",
        data: {
          points: [
            { step: 0, label: "inputs-accepted", value: 52 },
            { step: 1, label: "summary-ready", value: 54 },
          ],
        },
      },
    ],
    assumptionNotes: [
      {
        note: "Run output is still the deterministic placeholder harness in Phase 1.",
        provenance: {
          sourceType: "placeholder" as const,
          source: "Phase 1 run contract test fixture",
          notes: "Real lap and subsystem models are deferred.",
        },
      },
    ],
  };
}

describe("presetDocumentSchema", () => {
  it("parses the seeded preset documents", () => {
    const catalog = loadPresetCatalogFromDisk(presetsRoot);
    const seededPresetDocuments = [
      ...catalog.regulation,
      ...catalog.session,
      ...catalog.weather,
    ];

    expect(seededPresetDocuments).toHaveLength(5);
    expect(
      seededPresetDocuments.every(
        (presetDocument) =>
          presetDocumentSchema.parse(presetDocument).schemaVersion ===
          presetDocumentSchemaVersion,
      ),
    ).toBe(true);
  });

  it("loads the preset catalog through the node-only package subpath", () => {
    const catalog = loadPresetCatalogFromDisk(presetsRoot);

    expect(catalog.regulation.map((document) => document.presetId)).toEqual([
      "fia-2026-baseline",
    ]);
    expect(catalog.session.map((document) => document.presetId)).toEqual([
      "grand-prix-race",
      "qualifying-session",
    ]);
    expect(catalog.weather.map((document) => document.presetId)).toEqual([
      "dry-baseline",
      "light-rain-placeholder",
    ]);
  });
});

describe("scenarioDocumentSchema", () => {
  it("parses the canonical default scenario", () => {
    const scenario = createDefaultScenario();

    expect(scenarioDocumentSchema.parse(scenario)).toEqual(scenario);
    expect(scenario).toEqual(createDefaultScenario());
  });

  it("keeps future extension points explicit placeholders", () => {
    const scenario = createDefaultScenario();
    const result = scenarioDocumentSchema.safeParse({
      ...scenario,
      observerConfigPlaceholder: {
        ...scenario.observerConfigPlaceholder,
        horizonSteps: 25,
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-placeholder driver profile data", () => {
    const scenario = createDefaultScenario();
    const result = scenarioDocumentSchema.safeParse({
      ...scenario,
      driverProfile: {
        ...scenario.driverProfile,
        provenance: {
          ...scenario.driverProfile.provenance,
          sourceType: "documented-fact",
        },
      },
    });

    expect(result.success).toBe(false);
  });
});

describe("runRecordSchema", () => {
  it("parses a valid run record with scenario and preset snapshots", () => {
    const runRecord = createValidRunRecord();

    expect(runRecordSchema.parse(runRecord)).toEqual(runRecord);
  });

  it("rejects invalid preset snapshot categories", () => {
    const runRecord = createValidRunRecord();
    const result = runRecordSchema.safeParse({
      ...runRecord,
      presetSnapshots: {
        ...runRecord.presetSnapshots,
        regulation: {
          ...runRecord.presetSnapshots.regulation,
          presetType: "session",
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid timestamps on run records", () => {
    const runRecord = createValidRunRecord();
    const result = runRecordSchema.safeParse({
      ...runRecord,
      createdAt: "2026-03-20",
    });

    expect(result.success).toBe(false);
  });

  it("creates an immutable run record with preset references and snapshots", () => {
    const scenario = createDefaultScenario();
    const catalog = loadPresetCatalogFromDisk(presetsRoot);
    const runRecord = createRunRecord({
      runId: "phase1-created-run-record",
      createdAt: "2026-03-20T03:15:00.000Z",
      scenario,
      resolvedPresets: {
        regulation: catalog.regulation[0],
        session: catalog.session[0],
        weather: catalog.weather[0],
      },
      versions: {
        modelVersion: "phase1-placeholder/v1",
        appVersion: "0.1.0",
      },
      output: {
        summaryMetrics: {
          placeholderScore: 52,
        },
        artifacts: [
          {
            artifactId: "phase1-summary-report",
            artifactType: "report",
            label: "Phase 1 summary report",
          },
        ],
        assumptionNotes: [
          {
            note: "Run outputs remain placeholder-level while the model stack is being scaffolded.",
            provenance: {
              sourceType: "placeholder",
              source: "Phase 1 run helper test fixture",
            },
          },
        ],
      },
    });

    expect(runRecord.presetReferences).toEqual({
      regulation: scenario.regulationPreset,
      session: scenario.sessionPreset,
      weather: scenario.weatherPreset,
    });
    expect(runRecord.presetSnapshots.regulation.presetId).toBe(
      "fia-2026-baseline",
    );
    expect(runRecord.presetSnapshots.session.name).toBe("Grand Prix Race");
    expect(Object.isFrozen(runRecord)).toBe(true);
    expect(Object.isFrozen(runRecord.presetSnapshots)).toBe(true);
  });

  it("rejects run construction when resolved presets do not match the scenario references", () => {
    const scenario = createDefaultScenario();
    const catalog = loadPresetCatalogFromDisk(presetsRoot);

    expect(() =>
      createRunRecord({
        runId: "phase1-invalid-run-record",
        scenario,
        resolvedPresets: {
          regulation: catalog.regulation[0],
          session: catalog.session[1],
          weather: catalog.weather[0],
        },
        versions: {
          modelVersion: "phase1-placeholder/v1",
          appVersion: "0.1.0",
        },
        output: {
          summaryMetrics: {
            placeholderScore: 41,
          },
        },
      }),
    ).toThrow("Preset mismatch for session");
  });
});

// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { createDefaultScenario, type PresetCatalog, type RunRecord } from "@f1-modeling/domain";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";

function createPresetCatalog(): PresetCatalog {
  return {
    regulation: [
      {
        schemaVersion: "preset-document/v1",
        presetId: "fia-2026-baseline",
        presetType: "regulation",
        name: "FIA 2026 Baseline",
        description: "Phase 1 regulation placeholder.",
        provenance: {
          sourceType: "engineering-inference",
          source: "test preset catalog",
          notes: "Test fixture",
        },
        assumptionNotes: [],
        values: {
          era: "2026",
        },
      },
    ],
    session: [
      {
        schemaVersion: "preset-document/v1",
        presetId: "grand-prix-race",
        presetType: "session",
        name: "Grand Prix Race",
        description: "Phase 1 session placeholder.",
        provenance: {
          sourceType: "engineering-inference",
          source: "test preset catalog",
          notes: "Test fixture",
        },
        assumptionNotes: [],
        values: {
          sessionKind: "race",
        },
      },
    ],
    weather: [
      {
        schemaVersion: "preset-document/v1",
        presetId: "dry-baseline",
        presetType: "weather",
        name: "Dry Baseline",
        description: "Phase 1 weather placeholder.",
        provenance: {
          sourceType: "placeholder",
          source: "test preset catalog",
          notes: "Test fixture",
        },
        assumptionNotes: [],
        values: {
          surfaceCondition: "dry",
        },
      },
    ],
  };
}

function createRunRecord(runId: string, scenarioName: string, seed: number): RunRecord {
  const scenario = createDefaultScenario({
    scenarioId: "phase1-default-scenario",
    name: scenarioName,
    seed,
  });
  const presetCatalog = createPresetCatalog();
  const regulation = presetCatalog.regulation[0]!;
  const session = presetCatalog.session[0]!;
  const weather = presetCatalog.weather[0]!;

  return {
    schemaVersion: "run-record/v1",
    runId,
    createdAt: "2026-03-20T03:30:00.000Z",
    scenarioId: scenario.scenarioId,
    scenarioSnapshot: scenario,
    presetReferences: {
      regulation: scenario.regulationPreset,
      session: scenario.sessionPreset,
      weather: scenario.weatherPreset,
    },
    presetSnapshots: {
      regulation,
      session,
      weather,
    },
    modelVersion: "phase1-placeholder/v1",
    appVersion: "0.1.0",
    seed: scenario.seed,
    status: "completed",
    summaryMetrics: {
      placeholderScore: 58,
      comparisonBaseline: 61,
      tracePoints: 3,
    },
    artifacts: [
      {
        artifactId: `${runId}-trace`,
        artifactType: "phase1-placeholder-trace",
        label: "Phase 1 placeholder trace output",
        data: {
          trace: [
            { step: 0, label: "inputs-accepted", value: 58 },
            { step: 1, label: "wiring-checked", value: 60 },
            { step: 2, label: "summary-ready", value: 62 },
          ],
        },
      },
    ],
    assumptionNotes: [
      {
        note: "Deterministic placeholder output only.",
        provenance: {
          sourceType: "placeholder",
          source: "test run fixture",
          notes: "Test fixture",
        },
      },
    ],
  };
}

describe("App", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    const presetCatalog = createPresetCatalog();
    const scenarios = [
      createDefaultScenario({
        scenarioId: "phase1-default-scenario",
        name: "Saved Silverstone Baseline",
        seed: 4,
      }),
    ];
    const runs = [createRunRecord("run-phase1-default-scenario-001", "Saved Silverstone Baseline", 4)];

    globalThis.fetch = vi.fn(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method ?? "GET";

      if (url === "/api/presets" && method === "GET") {
        return new Response(JSON.stringify(presetCatalog), { status: 200 });
      }

      if (url === "/api/scenarios" && method === "GET") {
        return new Response(JSON.stringify(scenarios), { status: 200 });
      }

      if (url.startsWith("/api/scenarios/") && method === "GET") {
        const scenarioId = url.split("/").pop();
        const scenario = scenarios.find((entry) => entry.scenarioId === scenarioId);
        return new Response(JSON.stringify(scenario), { status: scenario ? 200 : 404 });
      }

      if (url === "/api/scenarios" && method === "POST") {
        const payload = JSON.parse(String(init?.body));
        const existingIndex = scenarios.findIndex(
          (entry) => entry.scenarioId === payload.scenarioId,
        );

        if (existingIndex >= 0) {
          scenarios[existingIndex] = payload;
        } else {
          scenarios.push(payload);
        }

        return new Response(JSON.stringify(payload), {
          status: existingIndex >= 0 ? 200 : 201,
        });
      }

      if (url === "/api/runs" && method === "GET") {
        return new Response(JSON.stringify(runs), { status: 200 });
      }

      if (url === "/api/runs" && method === "POST") {
        const payload = JSON.parse(String(init?.body)) as { scenarioId: string };
        const scenario =
          scenarios.find((entry) => entry.scenarioId === payload.scenarioId) ??
          scenarios[0]!;
        const run = createRunRecord(
          `run-${scenario.scenarioId}-${String(runs.length + 1).padStart(3, "0")}`,
          scenario.name,
          scenario.seed,
        );

        runs.unshift(run);

        return new Response(JSON.stringify(run), { status: 201 });
      }

      return new Response(JSON.stringify({ message: `Unhandled ${method} ${url}` }), {
        status: 500,
      });
    }) as typeof fetch;
  });

  afterEach(() => {
    cleanup();
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("loads the Phase 1 workspace surfaces and shows saved history", async () => {
    render(<App />);

    await waitFor(
      () => {
        expect(
          screen.getByText("Loaded 1 saved scenarios and 1 placeholder runs."),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const scenarioNameInput = screen.getByRole("textbox", {
      name: "Scenario name",
    });

    expect(
      screen.getByRole("heading", { name: "Phase 1 scenario workbench" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(scenarioNameInput).toHaveValue("Saved Silverstone Baseline");
    });
    expect(screen.getAllByText("run-phase1-default-scenario-001").length).toBeGreaterThan(0);
    expect(screen.getByText(/shared visuals in use/i)).toBeInTheDocument();
    expect(screen.getAllByText(/placeholder output/i).length).toBeGreaterThan(0);
  });

  it("saves the edited scenario and appends a placeholder run through the mocked API", async () => {
    render(<App />);

    await waitFor(
      () => {
        expect(
          screen.getByText("Loaded 1 saved scenarios and 1 placeholder runs."),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const scenarioNameInput = screen.getByRole("textbox", {
      name: "Scenario name",
    });
    fireEvent.change(scenarioNameInput, {
      target: { value: "Wet validation draft" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save scenario" }));

    await waitFor(() => {
      expect(
        screen.getByText('Saved "Wet validation draft" to the local Phase 1 workspace.'),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Create placeholder run" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Saved "Wet validation draft" and appended placeholder run "run-phase1-default-scenario-002".',
        ),
      ).toBeInTheDocument();
    });

    expect((await screen.findAllByText("run-phase1-default-scenario-002")).length).toBeGreaterThan(0);
    expect(scenarioNameInput).toHaveValue("Wet validation draft");
  });
});

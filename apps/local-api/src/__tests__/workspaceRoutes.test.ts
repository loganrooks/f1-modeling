import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { createDefaultScenario } from "@f1-modeling/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildApp } from "../app.js";

const PRESETS_ROOT = fileURLToPath(
  new URL("../../../../presets", import.meta.url),
);

describe("workspace routes", () => {
  let workspaceRoot: string;
  let app: ReturnType<typeof buildApp>;

  beforeEach(async () => {
    workspaceRoot = await mkdtemp(join(tmpdir(), "f1-modeling-local-api-"));
    app = buildApp({
      workspaceRoot,
      presetsRoot: PRESETS_ROOT,
      logger: false,
    });

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    await rm(workspaceRoot, { recursive: true, force: true });
  });

  it("lists presets and round-trips a saved scenario through file-backed routes", async () => {
    const presetResponse = await app.inject({
      method: "GET",
      url: "/api/presets",
    });

    expect(presetResponse.statusCode).toBe(200);

    const presetCatalog = presetResponse.json();

    expect(presetCatalog.regulation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          presetId: "fia-2026-baseline",
          presetType: "regulation",
        }),
      ]),
    );
    expect(presetCatalog.session).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          presetId: "grand-prix-race",
          presetType: "session",
        }),
      ]),
    );
    expect(presetCatalog.weather).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          presetId: "dry-baseline",
          presetType: "weather",
        }),
      ]),
    );

    const scenario = createDefaultScenario({
      scenarioId: "workspace-route-scenario",
      name: "Workspace Route Scenario",
      seed: 7,
    });

    const saveScenarioResponse = await app.inject({
      method: "POST",
      url: "/api/scenarios",
      payload: scenario,
    });

    expect(saveScenarioResponse.statusCode).toBe(201);
    expect(saveScenarioResponse.json()).toEqual(scenario);

    const scenarioFile = await readFile(
      join(
        workspaceRoot,
        "workspace-data",
        "scenarios",
        `${scenario.scenarioId}.json`,
      ),
      "utf8",
    );

    expect(scenarioFile).toContain('\n  "assumptionNotes": [\n');
    expect(JSON.parse(scenarioFile)).toEqual(scenario);

    const listScenarioResponse = await app.inject({
      method: "GET",
      url: "/api/scenarios",
    });

    expect(listScenarioResponse.statusCode).toBe(200);
    expect(listScenarioResponse.json()).toEqual([scenario]);

    const getScenarioResponse = await app.inject({
      method: "GET",
      url: `/api/scenarios/${scenario.scenarioId}`,
    });

    expect(getScenarioResponse.statusCode).toBe(200);
    expect(getScenarioResponse.json()).toEqual(scenario);
  });

  it("creates append-only run history records with preset references and snapshots", async () => {
    const scenario = createDefaultScenario({
      scenarioId: "append-only-run-scenario",
      name: "Append Only Run Scenario",
      seed: 11,
    });

    const saveScenarioResponse = await app.inject({
      method: "POST",
      url: "/api/scenarios",
      payload: scenario,
    });

    expect(saveScenarioResponse.statusCode).toBe(201);

    const firstRunResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: scenario.scenarioId,
      },
    });

    expect(firstRunResponse.statusCode).toBe(201);

    const firstRun = firstRunResponse.json();

    expect(firstRun.runId).toMatch(/^run-append-only-run-scenario-/);
    expect(firstRun.scenarioId).toBe(scenario.scenarioId);
    expect(firstRun.modelVersion).toBe("phase1-placeholder/v1");
    expect(firstRun.appVersion).toBe("0.1.0");
    expect(firstRun.presetReferences.regulation.presetId).toBe(
      scenario.regulationPreset.presetId,
    );
    expect(firstRun.presetSnapshots.regulation.presetId).toBe(
      scenario.regulationPreset.presetId,
    );
    expect(firstRun.presetSnapshots.session.presetId).toBe(
      scenario.sessionPreset.presetId,
    );
    expect(firstRun.presetSnapshots.weather.presetId).toBe(
      scenario.weatherPreset.presetId,
    );
    expect(firstRun.artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          artifactType: "phase1-placeholder-trace",
        }),
      ]),
    );

    const secondRunResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: scenario.scenarioId,
      },
    });

    expect(secondRunResponse.statusCode).toBe(201);

    const secondRun = secondRunResponse.json();

    expect(secondRun.runId).not.toBe(firstRun.runId);

    const listRunsResponse = await app.inject({
      method: "GET",
      url: "/api/runs",
    });

    expect(listRunsResponse.statusCode).toBe(200);

    const runList = listRunsResponse.json();

    expect(runList).toHaveLength(2);
    expect(runList.map((run: { runId: string }) => run.runId).sort()).toEqual(
      [firstRun.runId, secondRun.runId].sort(),
    );

    const persistedRunContents = await readFile(
      join(
        workspaceRoot,
        "workspace-data",
        "runs",
        `${firstRun.runId}.json`,
      ),
      "utf8",
    );
    const persistedRun = JSON.parse(persistedRunContents);

    expect(persistedRun.runId).toBe(firstRun.runId);
    expect(persistedRun.scenarioId).toBe(scenario.scenarioId);
    expect(persistedRun.presetReferences.regulation.presetId).toBe(
      scenario.regulationPreset.presetId,
    );
    expect(persistedRun.presetSnapshots.regulation.presetId).toBe(
      scenario.regulationPreset.presetId,
    );
    expect(persistedRun.presetSnapshots.session.presetId).toBe(
      scenario.sessionPreset.presetId,
    );
    expect(persistedRun.presetSnapshots.weather.presetId).toBe(
      scenario.weatherPreset.presetId,
    );
    expect(persistedRun.scenarioSnapshot.scenarioId).toBe(scenario.scenarioId);
  });
});

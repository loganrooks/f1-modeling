/**
 * API integration tests for stint-model harnessId dispatch and run record structure.
 *
 * Tests the POST /api/runs endpoint with stint-model harnessId, verifies
 * backward compatibility with qss-lap-model, and tests invalid harnessId handling.
 */

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { createDefaultScenario } from "@f1-modeling/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildApp } from "../app.js";

const PRESETS_ROOT = fileURLToPath(
  new URL("../../../../presets", import.meta.url),
);

describe("stint model API routes", () => {
  let workspaceRoot: string;
  let app: ReturnType<typeof buildApp>;

  beforeEach(async () => {
    workspaceRoot = await mkdtemp(join(tmpdir(), "f1-modeling-stint-api-"));
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

  it("creates a stint model run with correct response structure", async () => {
    const scenario = createDefaultScenario({
      scenarioId: "stint-model-run",
      name: "Stint Model Run",
      seed: 42,
    });

    await app.inject({
      method: "POST",
      url: "/api/scenarios",
      payload: scenario,
    });

    const runResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: scenario.scenarioId,
        harnessId: "stint-model",
      },
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json();

    expect(run.summaryMetrics.harnessId).toBe("stint-model");
    expect(run.artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ artifactType: "stint-trace" }),
      ]),
    );
    expect(run.summaryMetrics.lapTimes).toBeInstanceOf(Array);
    expect(run.summaryMetrics.lapTimes.length).toBeGreaterThan(0);
    expect(run.summaryMetrics.totalLaps).toBeGreaterThan(0);
    expect(run.summaryMetrics.totalTime).toBeGreaterThan(0);
    expect(run.summaryMetrics.tireCompound).toBe("medium");
    expect(run.summaryMetrics.electricalPolicy).toBe("conservative-deploy");
    expect(run.summaryMetrics.assumptions.length).toBeGreaterThan(0);
  });

  it("Phase 2 qss-lap-model still works (backward compatibility)", async () => {
    const scenario = createDefaultScenario({
      scenarioId: "phase2-compat-run",
      name: "Phase 2 Compatibility Run",
      seed: 11,
    });

    await app.inject({
      method: "POST",
      url: "/api/scenarios",
      payload: scenario,
    });

    const runResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: scenario.scenarioId,
        harnessId: "qss-lap-model",
      },
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json();
    expect(run.summaryMetrics.harnessId).toBe("qss-lap-model");
    expect(run.summaryMetrics.lapTime).toBeGreaterThan(0);
  });

  it("rejects invalid harnessId with 400", async () => {
    const scenario = createDefaultScenario({
      scenarioId: "invalid-harness-run",
      name: "Invalid Harness Run",
      seed: 99,
    });

    await app.inject({
      method: "POST",
      url: "/api/scenarios",
      payload: scenario,
    });

    const runResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: scenario.scenarioId,
        harnessId: "nonexistent",
      },
    });

    expect(runResponse.statusCode).toBe(400);
  });

  it("stint model run includes all four artifact types", async () => {
    const scenario = createDefaultScenario({
      scenarioId: "stint-artifacts-run",
      name: "Stint Artifacts Run",
      seed: 7,
    });

    await app.inject({
      method: "POST",
      url: "/api/scenarios",
      payload: scenario,
    });

    const runResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: scenario.scenarioId,
        harnessId: "stint-model",
      },
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json();
    const artifactTypes = run.artifacts.map(
      (a: { artifactType: string }) => a.artifactType,
    );

    expect(artifactTypes).toContain("stint-trace");
    expect(artifactTypes).toContain("tire-degradation-trace");
    expect(artifactTypes).toContain("electrical-state-trace");
    expect(artifactTypes).toContain("weather-evolution-trace");
  });
});

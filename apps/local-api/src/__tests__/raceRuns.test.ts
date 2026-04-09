/**
 * API integration tests for race-simulation harnessId dispatch,
 * artifact persistence, lineage fields, and backward compatibility.
 *
 * Tests the POST /api/runs endpoint with harnessId "race-simulation",
 * verifies per-stint artifact fan-out, race-timeline artifact,
 * lineage fields (experimentTag, parentRunId, branchPoint), and
 * backward compatibility with existing stint-model and qss-lap-model.
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

// ---------------------------------------------------------------------------
// Helper: create a scenario with racePlan and save it
// ---------------------------------------------------------------------------

async function createRaceScenario(
  app: ReturnType<typeof buildApp>,
  scenarioId: string,
  options: {
    name?: string;
    stints?: Array<{
      stintIndex: number;
      totalLaps: number;
      tireCompoundId: string;
      electricalPolicyId?: string;
    }>;
    interruptions?: Array<{
      type: "vsc" | "sc" | "red-flag";
      startLap: number;
      endLap: number;
    }>;
    tireInventory?: {
      allocation: Array<{ compound: string; totalSets: number }>;
      used: Array<{ compound: string; session: string; stintIndex?: number }>;
    };
  } = {},
) {
  const base = createDefaultScenario({
    scenarioId,
    name: options.name ?? "Race Scenario",
    seed: 42,
  });

  const stints = options.stints ?? [
    { stintIndex: 0, totalLaps: 10, tireCompoundId: "soft-c5" },
    { stintIndex: 1, totalLaps: 10, tireCompoundId: "hard-c1" },
  ];

  const totalRaceLaps = stints.reduce((sum, s) => sum + s.totalLaps, 0);

  // Build scenario with racePlan
  const scenarioWithRacePlan = {
    ...base,
    racePlan: {
      stints,
      pitLaneParams: {
        pitEntryTime: 12,
        pitExitTime: 10,
        pitBypassTime: 4,
        serviceTime: 2.5,
      },
      totalRaceLaps,
      ...(options.interruptions
        ? { interruptions: options.interruptions }
        : {}),
      ...(options.tireInventory
        ? { tireInventory: options.tireInventory }
        : {}),
    },
  };

  await app.inject({
    method: "POST",
    url: "/api/scenarios",
    payload: scenarioWithRacePlan,
  });

  return scenarioWithRacePlan;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("race simulation API routes", () => {
  let workspaceRoot: string;
  let app: ReturnType<typeof buildApp>;

  beforeEach(async () => {
    workspaceRoot = await mkdtemp(join(tmpdir(), "f1-modeling-race-api-"));
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

  // -------------------------------------------------------------------------
  // 1. Race simulation dispatch
  // -------------------------------------------------------------------------

  it("creates a race simulation run with correct response structure", async () => {
    await createRaceScenario(app, "race-dispatch-test");

    const runResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: "race-dispatch-test",
        harnessId: "race-simulation",
      },
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json();

    expect(run.summaryMetrics.harnessId).toBe("race-simulation");
    expect(run.summaryMetrics.totalRaceTime).toBeGreaterThan(0);
    expect(run.summaryMetrics.totalPitTime).toBeGreaterThan(0);
    expect(run.summaryMetrics.stintSummaries).toBeInstanceOf(Array);
    expect(run.summaryMetrics.stintSummaries.length).toBe(2);
    expect(run.summaryMetrics.stintCount).toBe(2);
  });

  it("includes race-timeline artifact", async () => {
    await createRaceScenario(app, "race-timeline-test");

    const runResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: "race-timeline-test",
        harnessId: "race-simulation",
      },
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json();
    const timelineArtifact = run.artifacts.find(
      (a: { artifactType: string }) => a.artifactType === "race-timeline",
    );
    expect(timelineArtifact).toBeDefined();
    expect(timelineArtifact.data.timeline).toBeInstanceOf(Array);
    expect(timelineArtifact.data.timeline.length).toBeGreaterThan(0);
    expect(timelineArtifact.data.stintSummaries).toBeInstanceOf(Array);
    expect(timelineArtifact.data.totalRaceTime).toBeGreaterThan(0);
    expect(timelineArtifact.data.totalPitTime).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // 2. Per-stint artifacts in race run
  // -------------------------------------------------------------------------

  it("each stint produces its own set of artifacts with stint-index prefix", async () => {
    await createRaceScenario(app, "race-artifacts-test");

    const runResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: "race-artifacts-test",
        harnessId: "race-simulation",
      },
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json();
    const artifactTypes = run.artifacts.map(
      (a: { artifactType: string }) => a.artifactType,
    );

    // 2 stints x 4 artifact types + 1 race-timeline = 9 artifacts
    expect(run.artifacts.length).toBe(9);

    // Each stint produces: stint-trace, tire-degradation-trace,
    // electrical-state-trace, weather-evolution-trace
    for (const type of [
      "stint-trace",
      "tire-degradation-trace",
      "electrical-state-trace",
      "weather-evolution-trace",
    ]) {
      const matching = artifactTypes.filter((t: string) => t === type);
      expect(matching.length).toBe(2); // One per stint
    }

    // Artifact IDs include stint index for disambiguation
    const artifactIds = run.artifacts.map(
      (a: { artifactId: string }) => a.artifactId,
    );
    expect(artifactIds.some((id: string) => id.includes("stint-0"))).toBe(true);
    expect(artifactIds.some((id: string) => id.includes("stint-1"))).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 3. Race simulation without racePlan
  // -------------------------------------------------------------------------

  it("rejects race-simulation without racePlan with error response", async () => {
    // Create a regular scenario (no racePlan)
    const scenario = createDefaultScenario({
      scenarioId: "race-no-plan-test",
      name: "No Race Plan",
      seed: 55,
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
        scenarioId: "race-no-plan-test",
        harnessId: "race-simulation",
      },
    });

    // Should get an error (400 for RunDependencyError)
    expect(runResponse.statusCode).toBe(400);
    const body = runResponse.json();
    expect(body.message).toContain("racePlan");
  });

  // -------------------------------------------------------------------------
  // 4. Lineage fields on run record
  // -------------------------------------------------------------------------

  it("run record contains experimentTag when provided", async () => {
    await createRaceScenario(app, "race-lineage-test");

    const runResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: "race-lineage-test",
        harnessId: "race-simulation",
        experimentTag: "monza-2stop-test",
      },
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json();
    expect(run.experimentTag).toBe("monza-2stop-test");
  });

  it("run record contains parentRunId and branchPoint when provided", async () => {
    await createRaceScenario(app, "race-branch-test");

    // First run (parent)
    const parentResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: "race-branch-test",
        harnessId: "race-simulation",
      },
    });

    expect(parentResponse.statusCode).toBe(201);
    const parentRun = parentResponse.json();

    // Second run (branch from parent)
    const branchResponse = await app.inject({
      method: "POST",
      url: "/api/runs",
      payload: {
        scenarioId: "race-branch-test",
        harnessId: "race-simulation",
        parentRunId: parentRun.runId,
        branchPoint: {
          stintIndex: 1,
          raceLap: 10,
          branchType: "stint-boundary",
        },
      },
    });

    expect(branchResponse.statusCode).toBe(201);

    const branchRun = branchResponse.json();
    expect(branchRun.parentRunId).toBe(parentRun.runId);
    expect(branchRun.branchPoint).toEqual({
      stintIndex: 1,
      raceLap: 10,
      branchType: "stint-boundary",
    });
  });

  // -------------------------------------------------------------------------
  // 5. Existing endpoint backward compatibility
  // -------------------------------------------------------------------------

  it("stint-model harnessId still returns 201", async () => {
    const scenario = createDefaultScenario({
      scenarioId: "compat-stint-test",
      name: "Backward Compat Stint",
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
        scenarioId: "compat-stint-test",
        harnessId: "stint-model",
      },
    });

    expect(runResponse.statusCode).toBe(201);
    const run = runResponse.json();
    expect(run.summaryMetrics.harnessId).toBe("stint-model");
  });

  it("qss-lap-model harnessId still returns 201", async () => {
    const scenario = createDefaultScenario({
      scenarioId: "compat-lap-test",
      name: "Backward Compat Lap",
      seed: 22,
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
        scenarioId: "compat-lap-test",
        harnessId: "qss-lap-model",
      },
    });

    expect(runResponse.statusCode).toBe(201);
    const run = runResponse.json();
    expect(run.summaryMetrics.harnessId).toBe("qss-lap-model");
  });
});

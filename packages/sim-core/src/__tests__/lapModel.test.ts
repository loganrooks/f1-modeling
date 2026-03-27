import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { circuitDocumentSchema, type CircuitDocument } from "@f1-modeling/domain";

import {
  computeCorneringSpeedLimit,
  DEFAULT_VEHICLE_PARAMS,
  maxAcceleration,
  maxDeceleration,
  solveLap,
  solveSpeedProfile,
} from "../lapModel/index.js";
import type { CircuitLayoutPoint, VehicleParams } from "../lapModel/types.js";
import { runPhase1PlaceholderScenario } from "../phase1Placeholder.js";

// ---- Helpers ----

/** Resolve relative to the monorepo root (two levels up from this test file). */
const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..");

function loadCircuit(name: string): CircuitDocument {
  const filePath = join(REPO_ROOT, "presets", "circuits", `${name}.json`);
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  return circuitDocumentSchema.parse(raw);
}

/**
 * Build a simple synthetic circuit for targeted solver testing.
 * Layout: 200m straight + 200m corner (R=50m) + 200m straight +
 *         200m corner (R=100m) + 200m straight = 1000m
 */
function syntheticCircuit(): CircuitLayoutPoint[] {
  const ds = 5;
  const points: CircuitLayoutPoint[] = [];
  let dist = 0;

  // 200m straight
  for (let i = 0; i < 200 / ds; i++) {
    points.push({ distance: dist, curvature: 0 });
    dist += ds;
  }
  // 200m corner, R=50m, left
  for (let i = 0; i < 200 / ds; i++) {
    points.push({ distance: dist, curvature: 1 / 50 });
    dist += ds;
  }
  // 200m straight
  for (let i = 0; i < 200 / ds; i++) {
    points.push({ distance: dist, curvature: 0 });
    dist += ds;
  }
  // 200m corner, R=100m, right
  for (let i = 0; i < 200 / ds; i++) {
    points.push({ distance: dist, curvature: -1 / 100 });
    dist += ds;
  }
  // 200m straight
  for (let i = 0; i < 200 / ds; i++) {
    points.push({ distance: dist, curvature: 0 });
    dist += ds;
  }

  return points;
}

// ---- Tests ----

describe("computeCorneringSpeedLimit", () => {
  it("returns Infinity for zero curvature", () => {
    expect(computeCorneringSpeedLimit(0, DEFAULT_VEHICLE_PARAMS)).toBe(Infinity);
  });

  it("returns Infinity for negative curvature", () => {
    expect(computeCorneringSpeedLimit(-0.01, DEFAULT_VEHICLE_PARAMS)).toBe(Infinity);
  });

  it("returns a plausible speed for a tight corner", () => {
    // R = 10m (like Monaco hairpin), curvature = 0.1
    const speed = computeCorneringSpeedLimit(0.1, DEFAULT_VEHICLE_PARAMS);
    expect(speed).toBeGreaterThan(5); // faster than walking
    expect(speed).toBeLessThan(50); // slower than highway speed
  });

  it("returns a higher speed for a gentler corner", () => {
    const tightSpeed = computeCorneringSpeedLimit(0.02, DEFAULT_VEHICLE_PARAMS); // R=50m
    const wideSpeed = computeCorneringSpeedLimit(0.005, DEFAULT_VEHICLE_PARAMS); // R=200m
    expect(wideSpeed).toBeGreaterThan(tightSpeed);
  });

  it("returns Infinity when curvature is below the critical radius", () => {
    // The critical curvature is mu * kz / m
    const mu = DEFAULT_VEHICLE_PARAMS.gripCoefficient;
    const kz = DEFAULT_VEHICLE_PARAMS.downforceFactor;
    const m = DEFAULT_VEHICLE_PARAMS.mass;
    const criticalCurvature = (mu * kz) / m;

    // Just below critical curvature should return Infinity
    const speed = computeCorneringSpeedLimit(criticalCurvature * 0.5, DEFAULT_VEHICLE_PARAMS);
    expect(speed).toBe(Infinity);
  });
});

describe("maxAcceleration and maxDeceleration", () => {
  it("produces non-negative acceleration on a straight", () => {
    const ax = maxAcceleration(50, 0, DEFAULT_VEHICLE_PARAMS);
    expect(ax).toBeGreaterThanOrEqual(0);
  });

  it("produces positive deceleration", () => {
    const ax = maxDeceleration(50, 0, DEFAULT_VEHICLE_PARAMS);
    expect(ax).toBeGreaterThan(0);
  });

  it("reduces acceleration in a corner vs a straight", () => {
    const axStraight = maxAcceleration(50, 0, DEFAULT_VEHICLE_PARAMS);
    const axCorner = maxAcceleration(50, 0.01, DEFAULT_VEHICLE_PARAMS);
    expect(axCorner).toBeLessThanOrEqual(axStraight);
  });
});

describe("forward-backward solver (synthetic circuit)", () => {
  const circuit = syntheticCircuit();
  const profile = solveSpeedProfile(circuit, DEFAULT_VEHICLE_PARAMS);

  it("produces the correct number of points", () => {
    expect(profile.length).toBe(circuit.length);
  });

  it("has positive time increments for all non-first points", () => {
    for (let i = 1; i < profile.length; i++) {
      const point = profile[i];
      expect(point).toBeDefined();
      expect(point!.timeIncrement).toBeGreaterThan(0);
    }
  });

  it("first point has zero time increment", () => {
    const firstPoint = profile[0];
    expect(firstPoint).toBeDefined();
    expect(firstPoint!.timeIncrement).toBe(0);
  });

  it("speed at corner apex is below the cornering limit", () => {
    // Check the tight corner (R=50, curvature = 0.02, at distance 200-400m)
    const cornerPoints = profile.filter(
      (p) => p.distance >= 200 && p.distance < 400,
    );
    expect(cornerPoints.length).toBeGreaterThan(0);
    const limit = computeCorneringSpeedLimit(0.02, DEFAULT_VEHICLE_PARAMS);

    for (const p of cornerPoints) {
      expect(p.speed).toBeLessThanOrEqual(limit * 1.01); // 1% tolerance
    }
  });

  it("speed on straights is higher than in tight corners", () => {
    const straightPoints = profile.filter(
      (p) => p.distance >= 430 && p.distance < 570 && Math.abs(p.curvature) < 0.001,
    );
    const cornerPoints = profile.filter(
      (p) => p.distance >= 250 && p.distance < 350,
    );

    expect(straightPoints.length).toBeGreaterThan(0);
    expect(cornerPoints.length).toBeGreaterThan(0);

    const maxStraightSpeed = Math.max(...straightPoints.map((p) => p.speed));
    const minCornerSpeed = Math.min(...cornerPoints.map((p) => p.speed));

    expect(maxStraightSpeed).toBeGreaterThan(minCornerSpeed);
  });

  it("shows braking before corners", () => {
    // There should be braking regime points just before the tight corner
    const preBrakePoints = profile.filter(
      (p) => p.distance >= 150 && p.distance < 200,
    );
    const hasBraking = preBrakePoints.some((p) => p.regime === "braking");
    expect(hasBraking).toBe(true);
  });

  it("shows cornering at the apex", () => {
    const apexPoints = profile.filter(
      (p) => p.distance >= 250 && p.distance < 350,
    );
    const hasCornering = apexPoints.some((p) => p.regime === "cornering");
    expect(hasCornering).toBe(true);
  });

  it("produces a positive total lap time", () => {
    const totalTime = profile.reduce((sum, p) => sum + p.timeIncrement, 0);
    expect(totalTime).toBeGreaterThan(0);
  });
});

describe("Monza end-to-end", () => {
  const monza = loadCircuit("monza");
  const result = solveLap(monza, DEFAULT_VEHICLE_PARAMS);

  it("produces a lap time between 60 and 120 seconds", () => {
    expect(result.lapTime).toBeGreaterThan(60);
    expect(result.lapTime).toBeLessThan(120);
  });

  it("has 3 sector results", () => {
    expect(result.sectorResults.length).toBe(3);
  });

  it("sector times sum to approximately the total lap time", () => {
    const sectorSum = result.sectorResults.reduce(
      (sum, s) => sum + s.sectorTime,
      0,
    );
    expect(Math.abs(sectorSum - result.lapTime)).toBeLessThan(0.5);
  });

  it("speed profile has the expected number of points", () => {
    expect(result.speedProfile.length).toBe(monza.points.length);
  });

  it("assumptions array is non-empty", () => {
    expect(result.assumptions.length).toBeGreaterThan(0);
  });

  it("speed profile contains multiple regimes", () => {
    const regimes = new Set(result.speedProfile.map((p) => p.regime));
    expect(regimes.size).toBeGreaterThanOrEqual(2);
  });
});

describe("sensitivity sanity", () => {
  it("heavier car has a longer lap time at Monza", () => {
    const monza = loadCircuit("monza");

    const baseResult = solveLap(monza, DEFAULT_VEHICLE_PARAMS);
    const heavyParams: VehicleParams = {
      ...DEFAULT_VEHICLE_PARAMS,
      mass: DEFAULT_VEHICLE_PARAMS.mass * 1.1,
    };
    const heavyResult = solveLap(monza, heavyParams);

    expect(heavyResult.lapTime).toBeGreaterThan(baseResult.lapTime);
  });
});

describe("Monaco end-to-end", () => {
  const monaco = loadCircuit("monaco");
  const result = solveLap(monaco, DEFAULT_VEHICLE_PARAMS);

  it("produces a plausible Monaco lap time", () => {
    // Real Monaco ~73s, QSS should be within 5-15% range
    expect(result.lapTime).toBeGreaterThan(50);
    expect(result.lapTime).toBeLessThan(120);
  });

  it("Monaco is slower than Monza per meter (more corners)", () => {
    const monza = loadCircuit("monza");
    const monzaResult = solveLap(monza, DEFAULT_VEHICLE_PARAMS);

    const monacoTimePerKm = result.lapTime / (monaco.totalLength / 1000);
    const monzaTimePerKm = monzaResult.lapTime / (monza.totalLength / 1000);

    expect(monacoTimePerKm).toBeGreaterThan(monzaTimePerKm);
  });
});

describe("Silverstone end-to-end", () => {
  const silverstone = loadCircuit("silverstone");
  const result = solveLap(silverstone, DEFAULT_VEHICLE_PARAMS);

  it("produces a plausible Silverstone lap time", () => {
    // Real Silverstone ~89s, QSS should be within range
    expect(result.lapTime).toBeGreaterThan(60);
    expect(result.lapTime).toBeLessThan(130);
  });
});

describe("Phase 1 backward compatibility", () => {
  it("runPhase1PlaceholderScenario still works", () => {
    const result = runPhase1PlaceholderScenario({
      scenarioId: "test-scenario",
      scenarioLabel: "Test Scenario",
      seed: 42,
    });

    expect(result.harnessId).toBe("phase1-placeholder");
    expect(result.placeholder).toBe(true);
    expect(result.metrics.placeholderScore).toBeGreaterThan(0);
    expect(result.trace.length).toBe(3);
    expect(result.notes.length).toBeGreaterThan(0);
  });
});

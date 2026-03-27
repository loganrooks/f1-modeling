/**
 * Lap solver orchestrator: takes a CircuitDocument and VehicleParams,
 * runs the forward-backward speed profile solver, and produces a
 * complete LapModelOutput with sector results and documented assumptions.
 */

import type { CircuitDocument } from "@f1-modeling/domain";

import { solveSpeedProfile } from "./forwardBackward.js";
import type {
  CircuitLayoutPoint,
  LapModelOutput,
  SectorResult,
  SpeedProfilePoint,
  VehicleParams,
} from "./types.js";

/**
 * Determines the dominant limiting factor for a set of speed profile
 * points within a sector.
 */
function determineLimitingFactor(
  points: SpeedProfilePoint[],
): SectorResult["limitingFactor"] {
  const counts = { grip: 0, power: 0, aero: 0 };

  for (const point of points) {
    switch (point.regime) {
      case "cornering":
      case "accelerating-grip":
      case "braking":
        counts.grip++;
        break;
      case "accelerating-power":
        counts.power++;
        break;
    }
  }

  const total = points.length;
  if (total === 0) return "mixed";

  // If one factor dominates more than 60% of points, label it as such
  if (counts.grip / total > 0.6) return "grip";
  if (counts.power / total > 0.6) return "power";
  if (counts.aero / total > 0.6) return "aero";
  return "mixed";
}

/**
 * Solves a complete lap for the given circuit and vehicle parameters.
 *
 * @param circuit A validated CircuitDocument from the domain package.
 * @param vehicle Vehicle parameters for the solver.
 * @returns Complete lap model output with speed profile, sector results,
 *          lap time, and documented assumptions.
 */
export function solveLap(
  circuit: CircuitDocument,
  vehicle: VehicleParams,
): LapModelOutput {
  // Extract CircuitLayoutPoint[] from the document (just distance + curvature)
  const layoutPoints: CircuitLayoutPoint[] = circuit.points.map((p) => ({
    distance: p.distance,
    curvature: p.curvature,
  }));

  // Run the speed profile solver
  const speedProfile = solveSpeedProfile(layoutPoints, vehicle);

  // Derive sector results
  const sectorResults: SectorResult[] = circuit.sectors.map((sector) => {
    // Filter speed profile points within this sector
    const sectorPoints = speedProfile.filter(
      (p) => p.distance >= sector.startDistance && p.distance < sector.endDistance,
    );

    // Sum time increments for sector time
    let sectorTime = 0;
    let minSpeed = Infinity;
    let maxSpeed = 0;

    for (const point of sectorPoints) {
      sectorTime += point.timeIncrement;
      if (point.speed < minSpeed) minSpeed = point.speed;
      if (point.speed > maxSpeed) maxSpeed = point.speed;
    }

    // Handle edge case: if no points in sector
    if (sectorPoints.length === 0) {
      minSpeed = 0;
      maxSpeed = 0;
    }

    return {
      sectorIndex: sector.sectorIndex,
      sectorName: sector.sectorName,
      startDistance: sector.startDistance,
      endDistance: sector.endDistance,
      sectorTime,
      minSpeed,
      maxSpeed,
      limitingFactor: determineLimitingFactor(sectorPoints),
    };
  });

  // Compute total lap time from all time increments
  let lapTime = 0;
  for (const point of speedProfile) {
    lapTime += point.timeIncrement;
  }

  // Document model assumptions
  const assumptions: string[] = [
    "Quasi-steady-state point-mass model (Lenzo & Rossi 2020)",
    "Constant grip coefficient (no tire degradation)",
    "No elevation effects",
    "No lateral force balance (Phase 2 longitudinal only)",
    "No aero-mode switching",
    "Vehicle parameter defaults are engineering-inference, not calibrated",
  ];

  return {
    lapTime,
    speedProfile,
    sectorResults,
    assumptions,
  };
}

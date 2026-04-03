/**
 * Aero-mode pre-processing for 2026 Straight Mode / Corner Mode switching.
 *
 * Resolves per-circuit-point aero state based on whether each point falls
 * within a defined straight-mode zone. Computes distance-weighted average
 * drag/downforce factors for the StintRunner to feed into VehicleParams
 * (a simplification -- the per-point resolution is available for future
 * per-segment solving, but the current solver takes a single VehicleParams
 * per lap).
 *
 * Source: 2026 FIA Technical Regulations active aero specification.
 * Straight Mode: ~55% drag reduction, ~30% downforce reduction.
 * Corner Mode: baseline (no reduction).
 */

import type { CircuitLayoutPoint } from "../lapModel/types.js";
import type { AeroModeConfig } from "./types.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Aero mode identifier for 2026 active aero. */
export type AeroMode = "corner-mode" | "straight-mode";

/** A circuit point with resolved aero state. */
export interface AeroResolvedPoint {
  /** Distance in meters from the start/finish line. */
  distance: number;
  /** Curvature in 1/m at this point. */
  curvature: number;
  /** Resolved drag factor for this point. */
  dragFactor: number;
  /** Resolved downforce factor for this point. */
  downforceFactor: number;
  /** Active aero mode at this point. */
  aeroMode: AeroMode;
}

// ---------------------------------------------------------------------------
// Per-point aero mode resolution
// ---------------------------------------------------------------------------

/**
 * Maps each circuit point to its aero state based on straight-mode zone
 * definitions.
 *
 * Points whose distance falls within any straightModeZone get straight-mode
 * drag/downforce; points outside get corner-mode values.
 *
 * @param circuit - Array of circuit layout points (distance + curvature).
 * @param aeroConfig - Aero mode configuration with zone definitions and factors.
 * @returns Array of AeroResolvedPoint with resolved aero state per point.
 */
export function resolveAeroPerPoint(
  circuit: CircuitLayoutPoint[],
  aeroConfig: AeroModeConfig,
): AeroResolvedPoint[] {
  return circuit.map((point) => {
    const inStraightZone = aeroConfig.straightModeZones.some(
      (zone) => point.distance >= zone.startDistance && point.distance < zone.endDistance,
    );

    return {
      distance: point.distance,
      curvature: point.curvature,
      dragFactor: inStraightZone ? aeroConfig.straightModeDragFactor : aeroConfig.cornerModeDragFactor,
      downforceFactor: inStraightZone ? aeroConfig.straightModeDownforceFactor : aeroConfig.cornerModeDownforceFactor,
      aeroMode: inStraightZone ? ("straight-mode" as const) : ("corner-mode" as const),
    };
  });
}

// ---------------------------------------------------------------------------
// Distance-weighted average aero factors
// ---------------------------------------------------------------------------

/**
 * Computes distance-weighted average drag and downforce factors across the
 * circuit from resolved aero points.
 *
 * Each segment's weight is proportional to its distance span (the gap
 * between consecutive points). The first point uses the distance to the
 * second point as its weight. If only one point exists, its factors are
 * returned directly.
 *
 * @param resolvedPoints - Array of AeroResolvedPoint from resolveAeroPerPoint.
 * @returns Object with avgDragFactor and avgDownforceFactor.
 */
export function computeAverageAeroFactors(
  resolvedPoints: AeroResolvedPoint[],
): { avgDragFactor: number; avgDownforceFactor: number } {
  if (resolvedPoints.length === 0) {
    return { avgDragFactor: 1.0, avgDownforceFactor: 1.0 };
  }
  if (resolvedPoints.length === 1) {
    return {
      avgDragFactor: resolvedPoints[0]!.dragFactor,
      avgDownforceFactor: resolvedPoints[0]!.downforceFactor,
    };
  }

  let totalWeight = 0;
  let weightedDrag = 0;
  let weightedDownforce = 0;

  for (let i = 0; i < resolvedPoints.length; i++) {
    const current = resolvedPoints[i]!;
    let segmentLength: number;

    if (i < resolvedPoints.length - 1) {
      segmentLength = resolvedPoints[i + 1]!.distance - current.distance;
    } else {
      // Last point: use the same weight as the previous segment
      segmentLength = current.distance - resolvedPoints[i - 1]!.distance;
    }

    // Guard against zero or negative segment lengths
    segmentLength = Math.max(segmentLength, 0);

    weightedDrag += current.dragFactor * segmentLength;
    weightedDownforce += current.downforceFactor * segmentLength;
    totalWeight += segmentLength;
  }

  if (totalWeight === 0) {
    return { avgDragFactor: 1.0, avgDownforceFactor: 1.0 };
  }

  return {
    avgDragFactor: weightedDrag / totalWeight,
    avgDownforceFactor: weightedDownforce / totalWeight,
  };
}

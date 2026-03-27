/**
 * Forward-backward quasi-steady-state speed profile solver.
 *
 * Implements the two-pass global envelope approach:
 * 1. Compute cornering speed limits from curvature + grip + downforce.
 * 2. Forward pass: acceleration-limited (grip and power).
 * 3. Backward pass: braking-limited (grip and drag assist).
 * 4. Lap closure: iterate to ensure start/finish speed consistency.
 * 5. Build SpeedProfilePoint[] with regime labels and timing.
 *
 * Based on Lenzo & Rossi 2020, adapted to the global envelope method.
 */

import {
  computeCorneringSpeedLimit,
  maxAcceleration,
  maxDeceleration,
} from "./frictionEllipse.js";
import type { CircuitLayoutPoint, SpeedProfilePoint, VehicleParams } from "./types.js";

const CONVERGENCE_THRESHOLD = 0.1; // m/s
const MAX_ITERATIONS = 3;

/**
 * Runs a single forward pass: starting from startSpeed, compute the
 * acceleration-limited speed at each successive point, clamped to the
 * cornering speed limit.
 */
function forwardPass(
  circuit: CircuitLayoutPoint[],
  vehicle: VehicleParams,
  corneringLimits: Float64Array,
  startSpeed: number,
  output: Float64Array,
): void {
  const n = circuit.length;
  if (n === 0) return;

  const first = circuit[0];
  if (first === undefined) return;
  output[0] = Math.min(startSpeed, corneringLimits[0] ?? Infinity);

  for (let i = 1; i < n; i++) {
    const current = circuit[i];
    const previous = circuit[i - 1];
    if (current === undefined || previous === undefined) continue;

    const ds = current.distance - previous.distance;
    const prevSpeed = output[i - 1] ?? 0;
    const ax = maxAcceleration(prevSpeed, Math.abs(previous.curvature), vehicle);
    const vAccel = Math.sqrt(Math.max(0, prevSpeed * prevSpeed + 2 * ax * ds));
    output[i] = Math.min(vAccel, corneringLimits[i] ?? Infinity);
  }
}

/**
 * Runs a single backward pass: starting from endSpeed at the last point,
 * compute the braking-limited speed at each preceding point, clamped
 * to the forward-pass result.
 */
function backwardPass(
  circuit: CircuitLayoutPoint[],
  vehicle: VehicleParams,
  forwardResult: Float64Array,
  endSpeed: number,
  output: Float64Array,
): void {
  const n = circuit.length;
  if (n === 0) return;

  output[n - 1] = Math.min(forwardResult[n - 1] ?? 0, endSpeed);

  for (let i = n - 2; i >= 0; i--) {
    const next = circuit[i + 1];
    const current = circuit[i];
    if (next === undefined || current === undefined) continue;

    const ds = next.distance - current.distance;
    const nextSpeed = output[i + 1] ?? 0;
    const ax = maxDeceleration(nextSpeed, Math.abs(next.curvature), vehicle);
    const vBrake = Math.sqrt(Math.max(0, nextSpeed * nextSpeed + 2 * ax * ds));
    output[i] = Math.min(forwardResult[i] ?? 0, vBrake);
  }
}

/**
 * Checks if two speed arrays have converged to within the threshold.
 */
function hasConverged(a: Float64Array, b: Float64Array): boolean {
  for (let i = 0; i < a.length; i++) {
    if (Math.abs((a[i] ?? 0) - (b[i] ?? 0)) > CONVERGENCE_THRESHOLD) {
      return false;
    }
  }
  return true;
}

/**
 * Solves the speed profile for a circuit using the forward-backward
 * global envelope method with lap closure.
 *
 * @param circuit Array of circuit layout points (distance + curvature).
 * @param vehicle Vehicle parameters.
 * @returns Array of SpeedProfilePoint with speed, regime, timing, and g-forces.
 */
export function solveSpeedProfile(
  circuit: CircuitLayoutPoint[],
  vehicle: VehicleParams,
): SpeedProfilePoint[] {
  const n = circuit.length;
  if (n === 0) return [];

  // Step 1: Compute cornering speed limits at every point
  const corneringLimits = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const point = circuit[i];
    if (point === undefined) continue;
    corneringLimits[i] = computeCorneringSpeedLimit(
      Math.abs(point.curvature),
      vehicle,
    );
  }

  // Step 2-4: Iterative forward-backward passes for lap closure
  const vForward = new Float64Array(n);
  const vBackward = new Float64Array(n);
  let prevBackward = new Float64Array(n);

  // Initial forward pass: start from near-stationary
  let startSpeed = Math.min(corneringLimits[0] ?? Infinity, 1.0);
  forwardPass(circuit, vehicle, corneringLimits, startSpeed, vForward);
  backwardPass(circuit, vehicle, vForward, vForward[n - 1] ?? 0, vBackward);

  // Lap closure iterations
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    // Copy previous result for convergence check
    prevBackward.set(vBackward);

    // Use the backward pass start speed for the next forward pass
    startSpeed = Math.min(vBackward[0] ?? 0, corneringLimits[0] ?? Infinity);
    forwardPass(circuit, vehicle, corneringLimits, startSpeed, vForward);

    // Use the forward pass end speed for the next backward pass
    backwardPass(circuit, vehicle, vForward, vForward[n - 1] ?? 0, vBackward);

    if (hasConverged(prevBackward, vBackward)) {
      break;
    }
  }

  // Step 5: Build SpeedProfilePoint[] from the final speed array
  const result: SpeedProfilePoint[] = [];

  for (let i = 0; i < n; i++) {
    const point = circuit[i];
    if (point === undefined) continue;

    const speed = vBackward[i] ?? 0;
    const cornerLimit = corneringLimits[i] ?? Infinity;
    const fwdSpeed = vForward[i] ?? 0;

    // Determine regime
    let regime: SpeedProfilePoint["regime"];
    if (speed >= cornerLimit * 0.99) {
      regime = "cornering";
    } else if (speed < fwdSpeed * 0.99) {
      regime = "braking";
    } else {
      // Accelerating: determine if grip or power limited
      const mu = vehicle.gripCoefficient;
      const kz = vehicle.downforceFactor;
      const kx = vehicle.dragFactor;
      const m = vehicle.mass;
      const v2 = speed * speed;
      const absCurv = Math.abs(point.curvature);

      const ay = v2 * absCurv;
      const ayMax = mu * (9.81 + (kz * v2) / m);
      const ayRatio = Math.min(ay / ayMax, 1);
      const axGrip =
        mu * (9.81 + (kz * v2) / m) * Math.sqrt(1 - ayRatio * ayRatio) -
        (kx * v2) / m;

      const effectiveSpeed = speed > 0.1 ? speed : 0.1;
      const axPower =
        (vehicle.peakPower - kx * v2 * speed) / (m * effectiveSpeed);

      regime = axPower < axGrip ? "accelerating-power" : "accelerating-grip";
    }

    // Compute timing and g-forces
    let ds = 0;
    let timeIncrement = 0;
    let longitudinalG = 0;

    if (i > 0) {
      const prevPoint = circuit[i - 1];
      if (prevPoint !== undefined) {
        ds = point.distance - prevPoint.distance;
        const prevSpeed = vBackward[i - 1] ?? 0;
        const avgSpeed = (speed + prevSpeed) / 2;
        timeIncrement = avgSpeed > 0 ? ds / avgSpeed : 0;
        longitudinalG = ds > 0 ? (speed * speed - prevSpeed * prevSpeed) / (2 * ds * 9.81) : 0;
      }
    }

    const lateralG = (speed * speed * Math.abs(point.curvature)) / 9.81;

    result.push({
      distance: point.distance,
      speed,
      regime,
      curvature: point.curvature,
      lateralG,
      longitudinalG,
      timeIncrement,
    });
  }

  return result;
}

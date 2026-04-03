/**
 * Core multi-lap stint simulation runner.
 *
 * Wraps the existing single-lap QSS solver (solveLap) in a lap-iteration
 * loop that updates tire, electrical, environment, and fuel state between
 * laps. This is the standard lap-wise discretization architecture used by
 * TUMFTM's race-simulation (Heilmeier et al., 2019).
 *
 * The inner solver is never modified -- state evolution happens OUTSIDE
 * the solver between lap calls.
 */

import type { LapModelOutput, SpeedProfilePoint, VehicleParams } from "../lapModel/types.js";
import { solveLap } from "../lapModel/lapSolver.js";
import { resolveAeroPerPoint, computeAverageAeroFactors } from "./aeroModel.js";
import { updateElectricalState, initializeElectricalState, computeElectricalPowerModifier } from "./electricalModel.js";
import { computeAverageLoadFactor } from "./loadTransfer.js";
import { initializeTireState, tireWearGripFactor, tireThermalFactor, updateTireState } from "./tireModel.js";
import type {
  EnvironmentState,
  LapTrace,
  StintConfig,
  StintResult,
  StintState,
} from "./types.js";
import { DEFAULT_LOAD_TRANSFER_PARAMS } from "./types.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Approximate fuel consumption per lap in kg (engineering estimate). */
const FUEL_CONSUMPTION_PER_LAP_KG = 1.5;

/** Default environment state: dry, moderate temperature. */
const DEFAULT_ENVIRONMENT_STATE: EnvironmentState = {
  trackTemperatureC: 33,
  surfaceWetness: 0,
  rubberEvolution: 1.0,
  gripModifier: 1.0,
};

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

/**
 * Creates the initial stint state from configuration.
 *
 * @param config - Stint configuration.
 * @returns Initial StintState with fresh tires and full energy.
 */
export function initializeStintState(config: StintConfig): StintState {
  // Resolve initial track temperature from weather timeline
  const initialTrackTemp =
    config.weatherTimeline.length > 0
      ? config.weatherTimeline[0]!.trackTemperatureC
      : 25; // Safe fallback

  // Resolve initial environment state from weather timeline
  const initialEnv: EnvironmentState =
    config.weatherTimeline.length > 0
      ? {
          trackTemperatureC: config.weatherTimeline[0]!.trackTemperatureC,
          surfaceWetness: config.weatherTimeline[0]!.surfaceWetness,
          rubberEvolution: 1.0,
          gripModifier: 1.0,
        }
      : { ...DEFAULT_ENVIRONMENT_STATE };

  return {
    lapNumber: 0,
    tireState: initializeTireState(config.tireCompound, initialTrackTemp),
    electricalState: initializeElectricalState(config.electricalPolicy),
    environmentState: initialEnv,
    fuelMass: config.baseVehicle.mass * 0.04, // Approximate fuel fraction
  };
}

// ---------------------------------------------------------------------------
// Effective vehicle resolution
// ---------------------------------------------------------------------------

/**
 * Computes effective vehicle parameters for the current lap by applying
 * tire degradation, thermal window, environment grip, load transfer,
 * and fuel mass reduction to the baseline vehicle.
 *
 * @param baseVehicle - Baseline vehicle parameters.
 * @param state - Current stint state.
 * @param config - Stint configuration.
 * @param previousEffectiveGrip - Previous lap's effective grip (for 10% clamp), or null for first lap.
 * @param previousLapProfile - Previous lap's speed profile (for load transfer), or null for first lap.
 * @param aeroFactors - Pre-computed average aero factors from aero-mode resolution, or null if no aeroConfig.
 * @returns Modified VehicleParams for this lap's solver call.
 */
export function resolveEffectiveVehicle(
  baseVehicle: VehicleParams,
  state: StintState,
  config: StintConfig,
  previousEffectiveGrip: number | null,
  previousLapProfile: SpeedProfilePoint[] | null,
  aeroFactors: { avgDragFactor: number; avgDownforceFactor: number } | null = null,
): VehicleParams {
  // --- Grip composition (multiplicative factors) ---
  const baseGrip = config.tireCompound.peakGrip;
  const wearFactor = tireWearGripFactor(state.tireState, config.tireCompound);
  const thermalFactor = tireThermalFactor(state.tireState, config.tireCompound);
  const envGripMod = state.environmentState.gripModifier;

  // Load transfer: use previous lap's profile for average load factor,
  // or 1.0 for the first lap (no previous data)
  const loadFactor =
    previousLapProfile !== null
      ? computeAverageLoadFactor(previousLapProfile, config.loadTransferParams)
      : 1.0;

  let effectiveGrip = baseGrip * wearFactor * thermalFactor * envGripMod * loadFactor;

  // Enforce minimum grip floor (RESEARCH.md Pitfall 3)
  effectiveGrip = Math.max(0.4, effectiveGrip);

  // Enforce max 10% change per lap (RESEARCH.md Pitfall 1)
  if (previousEffectiveGrip !== null) {
    const maxDelta = previousEffectiveGrip * 0.1;
    if (effectiveGrip < previousEffectiveGrip - maxDelta) {
      effectiveGrip = previousEffectiveGrip - maxDelta;
    } else if (effectiveGrip > previousEffectiveGrip + maxDelta) {
      effectiveGrip = previousEffectiveGrip + maxDelta;
    }
    // Re-apply floor after clamp
    effectiveGrip = Math.max(0.4, effectiveGrip);
  }

  // --- Power: electrical deployment scales with SoC and policy ---
  const effectivePower = computeElectricalPowerModifier(
    state.electricalState,
    config.electricalPolicy,
    baseVehicle.peakPower,
  );

  // --- Aero: use pre-computed average factors if aeroConfig is active ---
  const effectiveDrag = aeroFactors !== null ? aeroFactors.avgDragFactor : baseVehicle.dragFactor;
  const effectiveDownforce = aeroFactors !== null ? aeroFactors.avgDownforceFactor : baseVehicle.downforceFactor;

  // --- Mass: reduce by fuel burn ---
  const initialFuelMass = config.baseVehicle.mass * 0.04;
  const fuelBurned = initialFuelMass - state.fuelMass;
  const effectiveMass = Math.max(
    baseVehicle.mass * 0.95, // Minimum 95% of base mass
    baseVehicle.mass - fuelBurned,
  );

  return {
    mass: effectiveMass,
    dragFactor: effectiveDrag,
    downforceFactor: effectiveDownforce,
    peakPower: effectivePower,
    gripCoefficient: effectiveGrip,
  };
}

// ---------------------------------------------------------------------------
// Main stint loop
// ---------------------------------------------------------------------------

/**
 * Runs a multi-lap stint simulation.
 *
 * For each lap:
 *   1. Resolves effective vehicle params from current subsystem state.
 *   2. Calls the existing QSS solveLap() with those params.
 *   3. Updates tire state based on the lap result.
 *   4. Updates electrical state (identity stub for Plan 02).
 *   5. Updates environment state (identity stub for Plan 03).
 *   6. Updates fuel state (1.5 kg/lap burn).
 *   7. Records a LapTrace snapshot.
 *
 * @param config - Stint configuration.
 * @returns StintResult with all lap traces, final state, total time, and assumptions.
 */
export function runStint(config: StintConfig): StintResult {
  let state = initializeStintState(config);
  const lapTraces: LapTrace[] = [];

  // Pre-compute aero-resolved points once (zones don't change per lap)
  let aeroFactors: { avgDragFactor: number; avgDownforceFactor: number } | null = null;
  if (config.aeroConfig !== null) {
    const circuitPoints = config.circuit.points.map((pt) => ({
      distance: pt.distance,
      curvature: pt.curvature,
    }));
    const resolvedAeroPoints = resolveAeroPerPoint(circuitPoints, config.aeroConfig);
    aeroFactors = computeAverageAeroFactors(resolvedAeroPoints);
  }

  let previousEffectiveGrip: number | null = null;
  let previousLapProfile: SpeedProfilePoint[] | null = null;

  for (let lap = 0; lap < config.totalLaps; lap++) {
    // 1. Resolve effective vehicle params from current state
    const effectiveVehicle = resolveEffectiveVehicle(
      config.baseVehicle,
      state,
      config,
      previousEffectiveGrip,
      previousLapProfile,
      aeroFactors,
    );

    // 2. Solve single lap with effective params
    const lapOutput: LapModelOutput = solveLap(config.circuit, effectiveVehicle);

    // 3. Update tire state
    const newTireState = updateTireState(
      state.tireState,
      lapOutput,
      config.tireCompound,
      state.environmentState,
    );

    // 4. Update electrical state: SoC evolves via harvesting from braking and deployment via policy
    // Phase 3 Plan 03: pass state.environmentState as 5th arg for weather->electrical coupling
    const newElectricalState = updateElectricalState(
      state.electricalState,
      lapOutput,
      config.electricalPolicy,
      effectiveVehicle.mass,
    );

    // 5. Update environment state (identity stub)
    // Phase 3 Plan 03: replace with updateEnvironmentState()
    const newEnvironmentState: EnvironmentState = { ...state.environmentState };

    // 6. Update fuel state
    const newFuelMass = Math.max(0, state.fuelMass - FUEL_CONSUMPTION_PER_LAP_KG);

    // Update state for next iteration
    state = {
      lapNumber: lap + 1,
      tireState: newTireState,
      electricalState: newElectricalState,
      environmentState: newEnvironmentState,
      fuelMass: newFuelMass,
    };

    // Track previous effective grip for the 10% clamp
    previousEffectiveGrip = effectiveVehicle.gripCoefficient;
    previousLapProfile = lapOutput.speedProfile;

    // 7. Build lap trace snapshot
    const trace: LapTrace = {
      lapNumber: lap,
      lapTime: lapOutput.lapTime,
      tireState: { ...newTireState },
      electricalState: { ...newElectricalState },
      environmentState: { ...newEnvironmentState },
      effectiveGrip: effectiveVehicle.gripCoefficient,
      effectivePower: effectiveVehicle.peakPower,
      effectiveDragFactor: effectiveVehicle.dragFactor,
      effectiveDownforceFactor: effectiveVehicle.downforceFactor,
    };

    lapTraces.push(trace);
  }

  // Compute total time
  let totalTime = 0;
  for (const trace of lapTraces) {
    totalTime += trace.lapTime;
  }

  // Documented assumptions
  const assumptions: string[] = [
    "Lap-wise discretization (TUMFTM race-simulation validated)",
    "Phenomenological tire model (engineering-inference, not calibrated)",
    "Fuel consumption 1.5 kg/lap (engineering estimate)",
    "Load transfer 2-axle model (Milliken & Milliken)",
    "Max 10% grip change per lap (solver stability constraint)",
    "Minimum effective grip 0.4 (solver collapse prevention)",
    "Reduced-order electrical energy balance (2026 single-pool, no MGU-H)",
    "Deployment power scales with SoC and policy fraction",
    "Environment coupling: stub (Plan 03)",
  ];

  if (config.aeroConfig !== null) {
    assumptions.push("Aero-mode switching: 2026 Straight Mode / Corner Mode (zone-averaged per lap)");
  }

  return {
    lapTraces,
    finalState: state,
    totalTime,
    assumptions,
  };
}

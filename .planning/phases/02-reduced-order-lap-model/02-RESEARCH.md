# Phase 2: Reduced-Order Lap Model - Research

**Researched:** 2026-03-26
**Domain:** Vehicle dynamics modeling, quasi-steady-state lap simulation, sensitivity visualization
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
No explicit "Decisions" section in CONTEXT.md. The phase boundary, derived constraints, and guardrails function as the binding constraints:

- Phase 2 replaces the Phase 1 placeholder with a real reduced-order model. It does NOT add tire degradation, electrical dynamics, weather coupling, strategy simulation, driver-style parameterization, or data import.
- The model must produce a lap estimate with visible intermediate factors rather than only a final score.
- Parameter changes must show which parts of the model caused the output shift.
- The Phase 1 placeholder must remain functional after Phase 2 contract generalization.
- Visualization is progressive and model-coupled -- no racing-line display without spatial model support.
- Phase 2 extends the existing scenario schema, visual primitives, and workspace orchestration -- it does not redesign them.

### Claude's Discretion
The five open questions in CONTEXT.md are research questions for Claude to answer:
1. What reduced-order lap model class to use
2. What circuit representation format to adopt
3. When track-map visualization is honest
4. How sensitivity analysis presents causal attribution
5. How the sim-core contract generalizes

### Deferred Ideas (OUT OF SCOPE)
- Tire degradation and temperature evolution -- Phase 3
- Electrical energy state, harvesting, and deployment effects -- Phase 3
- Weather and environment coupling -- Phase 3
- Multi-lap stint simulation -- Phase 3+
- Race-distance strategy comparison -- Phase 4
- Driver-style parameterization beyond a single profile -- Phase 5
- Real telemetry overlay against model output -- Phase 6
- Model calibration and confidence scoring -- Phase 7
- Higher-fidelity aero or suspension submodels -- v2
- Optimal trajectory / racing line computation -- Phase 5 (CTRL-05), but circuit format chosen here must support it
- Aero-mode switching (DRS, active aero) -- Phase 3, but regulation preset structure should not preclude it
- Lateral force balance and load transfer -- Phase 3 (MODL-01 refinement), but model architecture should accommodate it

</user_constraints>

## Summary

Phase 2's core modeling task is well-served by a **quasi-steady-state (QSS) point-mass lap time simulation** using a forward-backward speed profile integration over a curvature-discretized circuit. This is the standard approach used in F1 and motorsport engineering for design-phase sensitivity analysis, confirmed by multiple academic sources (Lenzo & Rossi 2020, Heilmeier et al. 2019, TUM laptime-simulation). The method divides a circuit into small distance steps (5m or finer), computes local speed limits from curvature + grip + downforce, then builds a complete speed-vs-distance profile by integrating forward (acceleration-limited) and backward (braking-limited) from each speed constraint point. The result is a rich set of intermediate outputs (per-point speed, acceleration regime, braking distances, sector times) that satisfy all transparency and sensitivity analysis requirements.

The circuit representation should use an **ordered array of distance-indexed curvature samples** with optional x/y spatial coordinates. This provides enough structure for the QSS model, honest speed-vs-distance visualization, and track-map overlays where spatial coordinates exist. FastF1 provides x/y position data at sufficient accuracy for visualization but not for precision geometry -- this is adequate for Phase 2's needs and should be documented with appropriate provenance caveats.

For sensitivity analysis, the model's structure naturally supports **per-mechanism attribution**: running the model twice with one parameter changed produces two speed profiles, and the delta can be decomposed into which segments shifted and whether the shift was grip-limited, power-limited, or braking-limited. A waterfall/bridge chart built with hand-rolled SVG (extending the existing MetricTracePanel pattern) is the right visualization.

**Primary recommendation:** Implement a curvature-discretized QSS point-mass lap model with forward-backward speed profile integration, curvature-array circuit format with optional spatial coordinates, and waterfall-chart sensitivity decomposition. Generalize sim-core contracts via a Zod discriminated union on `harnessId`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Zod | ^4.3.6 | Schema validation for vehicle params, circuit data, model outputs | Already in use; discriminated unions in v4 compose cleanly for contract generalization |
| TypeScript | ^5.9.3 | Type safety with `noUncheckedIndexedAccess` | Already in use; strict mode catches array access errors in model loops |
| Vitest | ^4.1.0 | Testing model correctness, sensitivity, regression | Already in use; fast watch mode for iterating on model equations |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React | ^19.2.4 | UI components for parameter editors, visualization | Already in use; extend existing visual primitives |
| Vite | ^8.0.1 | Dev server with HMR for fast visualization iteration | Already in use |
| Fastify | ^5.8.2 | API endpoints for model execution | Already in use; add lap-model execution endpoint |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled SVG charts | Recharts 3.x | Recharts has React 19 compatibility issues requiring react-is overrides; project already builds SVG charts in MetricTracePanel; hand-rolled SVG preserves full control and avoids dependency risk |
| Custom QSS implementation | Port of TUM laptime-simulation (Python) | TUM repo is Python/MATLAB; the physics is simple enough (5 equations) that a clean TypeScript implementation is more maintainable than a language bridge |
| Pure point-mass (no curvature) | Curvature-discretized QSS | Pure point-mass without curvature cannot produce per-corner speed limits or explain why corners are slow -- fails transparency requirement |

### No New Dependencies Required
Phase 2 requires no new npm packages. The model is pure TypeScript math (arithmetic, iteration). The visualization extends existing hand-rolled SVG patterns. The schema work uses existing Zod.

## Architecture Patterns

### Recommended Project Structure
```
packages/sim-core/src/
  contracts.ts             # Generalized: discriminated union on harnessId
  phase1Placeholder.ts     # Preserved unchanged
  lapModel/
    types.ts               # VehicleParams, CircuitLayout, LapModelOutput, SectorResult
    forwardBackward.ts     # Core speed profile solver (pure function, no side effects)
    frictionEllipse.ts     # Grip/power/aero constraint computation
    lapSolver.ts           # Orchestrates: circuit + vehicle -> LapModelOutput
    index.ts               # Public API re-exports

packages/domain/src/
  circuits/
    schema.ts              # CircuitDocument Zod schema (curvature array + metadata)
    registry.ts            # Circuit preset loading (parallels presets/registry.ts)
  scenario/
    schema.ts              # Extended: adds vehicleParams field to scenario
  runs/
    schema.ts              # Extended: summaryMetrics gains typed lap-model fields

packages/visuals/src/
  traces/
    SpeedProfileTrace.tsx  # Speed-vs-distance trace (extends MetricTracePanel pattern)
  inspectors/
    SensitivityWaterfall.tsx  # Waterfall/bridge chart for parameter attribution
    VehicleParamEditor.tsx    # Editable vehicle parameter surface
  workspace/
    TrackMap.tsx           # SVG track outline with speed-colored overlay (replaces placeholder when spatial data exists)

presets/
  circuits/               # Circuit JSON files (curvature arrays + optional spatial coords)
    monza.json
    monaco.json
    silverstone.json
```

### Pattern 1: Curvature-Discretized QSS Forward-Backward Solver
**What:** The track is represented as an array of distance-indexed points, each carrying curvature (1/R). The solver computes a maximum-cornering-speed envelope from curvature + grip + downforce, then sweeps forward (acceleration-limited by grip + power) and backward (braking-limited by grip + aero) to produce a speed profile that satisfies all constraints simultaneously.
**When to use:** This is the core lap model computation -- called for every run.
**Key equations (from Lenzo & Rossi 2020):**

```typescript
// Source: Lenzo & Rossi, Applied Sciences 2020, Eq. 3-9
// Vehicle parameters
interface VehicleParams {
  mass: number;           // kg
  dragFactor: number;     // kx = 0.5 * rho * Cd * S (Ns^2/m^2)
  downforceFactor: number; // kz = 0.5 * rho * Cl * S (Ns^2/m^2)
  peakPower: number;      // W
  gripCoefficient: number; // mu (dimensionless tire friction)
}

// Aerodynamic forces (Eq. 3)
// Fx_aero = kx * v^2   (drag)
// Fz_aero = kz * v^2   (downforce, adds to normal load)

// Maximum lateral acceleration (Eq. 4, simplified)
// ay_max = mu * (m*g + kz*v^2) / m

// Maximum cornering speed at curvature k (Eq. 9, 14)
// v^2 / R <= mu * g + mu * kz * v^2 / m
// Solving: v_max = sqrt(ay_max / k) where ay_max is speed-dependent

// Friction ellipse: combined longitudinal + lateral (Eq. 5)
// ax_accel = ax_grip * sqrt(1 - (ay / ay_max)^2)
// ax_brake = ax_brake_grip * sqrt(1 - (ay / ay_max)^2)

// Power-limited acceleration (Eq. 6)
// ax_power = (P - kx * v^3) / (m * v)

// Effective max acceleration = min(ax_grip_available, ax_power)
```

### Pattern 2: Discriminated Union Contract Generalization
**What:** Generalize `SimulationRunSummary` using a Zod discriminated union on `harnessId`, so Phase 1 placeholder and Phase 2 lap model coexist.
**When to use:** When defining the sim-core contract types.
**Example:**

```typescript
// In contracts.ts -- generalized
import { z } from "zod";

// Base fields shared by all harnesses
const baseRunSummarySchema = z.object({
  runId: z.string(),
  scenarioId: z.string(),
  scenarioLabel: z.string(),
  seed: z.number(),
  notes: z.array(z.string()),
});

// Phase 1 placeholder (preserved)
const phase1SummarySchema = baseRunSummarySchema.extend({
  harnessId: z.literal("phase1-placeholder"),
  modelVersion: z.literal("phase1-placeholder/v1"),
  placeholder: z.literal(true),
  metrics: z.object({
    placeholderScore: z.number(),
    comparisonBaseline: z.number(),
    tracePoints: z.number(),
  }),
  trace: z.array(z.object({
    step: z.number(),
    label: z.string(),
    value: z.number(),
  })),
});

// Phase 2 lap model
const lapModelSummarySchema = baseRunSummarySchema.extend({
  harnessId: z.literal("qss-lap-model"),
  modelVersion: z.string(),
  placeholder: z.literal(false),
  vehicleParams: vehicleParamsSchema,
  circuitId: z.string(),
  lapTime: z.number(), // seconds
  sectorTimes: z.array(sectorResultSchema),
  speedProfile: z.array(speedPointSchema),
  assumptions: z.array(z.string()),
});

// Discriminated union -- Zod 4 supports composition
const simulationRunSummarySchema = z.discriminatedUnion("harnessId", [
  phase1SummarySchema,
  lapModelSummarySchema,
]);

// TypeScript type inferred automatically
type SimulationRunSummary = z.infer<typeof simulationRunSummarySchema>;
```

### Pattern 3: Speed Profile as Primary Intermediate Output
**What:** The model's primary output is a speed-vs-distance array, where each point carries the speed, the acceleration regime (grip-limited-accel, power-limited-accel, grip-limited-brake, cornering), the local curvature, and the time increment. Sector times are derived by summing time increments within sector boundaries.
**When to use:** This is the data contract between the model and visualization layers.
**Example:**

```typescript
interface SpeedProfilePoint {
  distance: number;      // meters from start/finish
  speed: number;         // m/s
  regime: "accelerating-grip" | "accelerating-power" | "braking" | "cornering";
  curvature: number;     // 1/m (0 for straights)
  lateralG: number;      // lateral acceleration in g
  longitudinalG: number; // longitudinal acceleration in g
  timeIncrement: number; // seconds for this segment
}

interface SectorResult {
  sectorIndex: number;
  sectorName: string;
  startDistance: number;
  endDistance: number;
  sectorTime: number;    // seconds
  minSpeed: number;      // m/s (apex speed)
  maxSpeed: number;      // m/s (straight-end speed)
  limitingFactor: "grip" | "power" | "aero" | "mixed";
}
```

### Pattern 4: Circuit as Curvature Array with Optional Spatial Coordinates
**What:** A circuit is an ordered array of distance-indexed points, each carrying curvature and optionally x/y coordinates. The model uses only curvature and distance; visualization uses x/y when available.
**When to use:** Circuit data definition and loading.
**Example:**

```typescript
interface CircuitPoint {
  distance: number;    // meters from start/finish
  curvature: number;   // 1/R in 1/m (positive = left, negative = right, 0 = straight)
  x?: number;          // optional spatial coordinate (meters, local frame)
  y?: number;          // optional spatial coordinate (meters, local frame)
  elevation?: number;  // optional elevation (meters) -- reserved for later phases
}

interface CircuitDocument {
  schemaVersion: string;
  circuitId: string;
  name: string;
  configuration: string;  // "grand-prix", "sprint", etc.
  totalLength: number;    // meters
  points: CircuitPoint[];
  sectors: CircuitSector[];    // named sector boundaries
  corners: CircuitCorner[];    // named corners with apex distances
  provenance: Provenance;
  assumptionNotes: AssumptionNote[];
}
```

### Anti-Patterns to Avoid
- **Hardcoded corner radii instead of curvature arrays:** Using a list of "corner 1: R=100m, straight 1: 300m" loses the continuous nature of real track geometry and makes the forward-backward solver awkward. Use dense curvature arrays.
- **Coupling model math to React components:** The lap solver must be a pure function in `packages/sim-core` with no UI dependencies. Visualization consumes the output data; it never calls model internals.
- **Embedding vehicle defaults in the model code:** Vehicle parameters must come from the scenario/preset system, not from hardcoded values inside the solver. Default parameter sets belong in preset JSON files.
- **Using floating-point equality in speed profile convergence:** The forward-backward pass intersects two speed envelopes. Use the minimum of forward and backward speeds at each point, not convergence iteration.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Schema validation | Custom validation logic | Zod schemas with discriminated unions | Zod gives type inference + runtime validation in one declaration; the project already uses it everywhere |
| Unique run/artifact IDs | Custom UUID generator | `crypto.randomUUID()` | Built into Node.js and modern browsers; already used by Phase 1 patterns |
| Deep cloning for immutable records | Manual spread operators | `structuredClone()` | Already used in `createRunRecord`; handles nested objects correctly |
| Interpolation of sparse circuit data | Custom interpolation math | The model's curvature array itself | Define circuits at sufficient density (5m steps) rather than interpolating between sparse points |

**Key insight:** The physics equations themselves are simple enough to implement directly in TypeScript -- they are 5 algebraic expressions, not a differential equation solver. The complexity is in the data contracts, the forward-backward sweep logic, and the visualization -- not in requiring external math libraries.

## Common Pitfalls

### Pitfall 1: Speed-Dependent Grip Makes Corner Speed Implicit
**What goes wrong:** The maximum cornering speed depends on downforce, which depends on speed, creating a circular dependency: `v_max = sqrt(mu * (g + kz*v^2/m) / curvature)`. Naive implementations either ignore speed-dependent grip or iterate to convergence.
**Why it happens:** Downforce increases with v^2, so faster corners have more grip, but the speed limit depends on the grip.
**How to avoid:** For each curvature point, solve the quadratic equation directly:
```
v^2 * curvature = mu * g + mu * kz * v^2 / m
v^2 * (curvature - mu * kz / m) = mu * g
v_max = sqrt(mu * g / (curvature - mu * kz / m))
```
This has a closed-form solution. When `curvature < mu * kz / m` (the "critical radius" from Lenzo & Rossi Eq. 10), there is no grip-limited speed constraint and the corner is limited only by power or drag.
**Warning signs:** Iteration loops in the corner speed calculation; NaN or Infinity values at low-curvature points.

### Pitfall 2: Forward-Backward Intersection Logic
**What goes wrong:** The forward pass (max acceleration from each constraint point) and backward pass (max deceleration to each constraint point) produce two speed envelopes. Taking `min(forward, backward)` at each distance point gives the correct speed profile. But if implemented as a sequential forward-then-backward sweep, getting the transition points right is tricky.
**Why it happens:** The classic QSS approach identifies apex speeds first, then integrates forward and backward from each apex. A simpler and more robust approach is the "global envelope" method: compute the cornering speed limit at every point, then sweep forward from the start taking min(accel-limited, cornering-limit), then sweep backward from the end taking min(brake-limited, forward-result).
**How to avoid:** Use the two-pass global envelope approach: (1) forward pass: for each point, speed = min(speed from accelerating from previous point, cornering speed limit); (2) backward pass: for each point (in reverse), speed = min(current speed, speed from braking from next point). This is simpler and avoids apex-finding entirely.
**Warning signs:** Speed profile has discontinuities; car exceeds cornering limit between apex points; braking zones appear in wrong locations.

### Pitfall 3: Confusing Model Transparency with Model Accuracy
**What goes wrong:** Spending effort on numerical precision (sub-millisecond lap times, gear-ratio modeling, tire load sensitivity) when the model's value is in its explainability and parameter sensitivity, not its absolute accuracy.
**Why it happens:** Engineering instinct says "the model should be right." But Phase 2's epistemic guardrails explicitly require labeling model limitations rather than hiding them.
**How to avoid:** Document every simplification as an assumption note (constant grip coefficient, no tire degradation, simplified aero, no elevation effects). Present lap times with explicit uncertainty ranges ("within ~5-10% of reality for this model class" per QSS literature). Focus implementation effort on intermediate-factor visibility, not absolute accuracy.
**Warning signs:** Adding parameters (gear ratios, CG height, weight distribution) that the model has no way to validate; spending time on numerical convergence rather than visualization.

### Pitfall 4: Preset Values Field Remains Untyped
**What goes wrong:** The existing `values: z.record(z.string(), z.unknown())` in regulation presets means the model layer must do its own validation when extracting regulation parameters. If Phase 2 adds regulation-derived constraints (e.g., minimum weight, DRS availability) without a typed schema, errors surface at runtime rather than parse time.
**Why it happens:** Phase 1 deliberately left preset values loose because no model consumed them.
**How to avoid:** For Phase 2, define a typed `regulationValues` schema that the model layer validates against -- but keep the preset document's `values` field loose for forward compatibility. The model extracts and validates the subset it needs at run time, producing clear errors if regulation presets lack required fields. This avoids breaking Phase 3's need for additional aero-mode parameters.
**Warning signs:** `as unknown as RegulationValues` casts; uncaught `undefined` property access on preset values.

### Pitfall 5: Track Visualization Without Spatial Grounding
**What goes wrong:** Rendering a track outline from curvature data alone (by integrating heading angles from curvature) accumulates numerical error, producing distorted track shapes that don't close properly for a full lap.
**Why it happens:** Curvature integration is inherently drift-prone without reference coordinates.
**How to avoid:** Use actual x/y spatial coordinates from FastF1 position data for visualization. The curvature array drives the model; the spatial coordinates drive the visualization. When spatial coordinates are absent, show a speed-vs-distance profile (which is always honest) rather than a distorted track map.
**Warning signs:** Track outline doesn't close (start != end); corners appear in wrong locations relative to known track shape.

## Code Examples

### Core Forward-Backward Solver

```typescript
// Source: Derived from Lenzo & Rossi 2020 Eq. 3-9, adapted to TypeScript
// This is the critical algorithm -- the heart of the Phase 2 model

interface SolverInput {
  circuit: { distance: number; curvature: number }[];
  vehicle: VehicleParams;
}

function computeCorneringSpeedLimit(
  curvature: number,
  vehicle: VehicleParams,
): number {
  const { mass, downforceFactor, gripCoefficient: mu } = vehicle;
  const g = 9.81;

  // From Eq. 9: mv^2/R <= mu*m*g + mu*kz*v^2
  // Rearranging: v^2 * (1/R - mu*kz/m) <= mu*g
  const effectiveCurvature = curvature - (mu * downforceFactor) / mass;

  if (effectiveCurvature <= 0) {
    // Beyond critical radius -- no grip-limited speed constraint
    return Infinity;
  }

  return Math.sqrt((mu * g) / effectiveCurvature);
}

function maxAcceleration(
  speed: number,
  curvature: number,
  vehicle: VehicleParams,
): number {
  const { mass, dragFactor, downforceFactor, peakPower, gripCoefficient: mu } = vehicle;
  const g = 9.81;

  // Lateral acceleration consumed by cornering
  const ay = speed * speed * curvature;
  const ayMax = mu * (g + (downforceFactor * speed * speed) / mass);

  // Grip-limited longitudinal acceleration (friction ellipse, Eq. 5)
  const ayRatio = Math.min(ay / ayMax, 1);
  const axGrip = (mu * mass * g + mu * downforceFactor * speed * speed
    - dragFactor * speed * speed) / (2 * mass)
    * Math.sqrt(1 - ayRatio * ayRatio);

  // Power-limited acceleration (Eq. 6)
  const axPower = speed > 0
    ? (peakPower - dragFactor * speed * speed * speed) / (mass * speed)
    : peakPower / (mass * 0.1); // avoid division by zero at start

  return Math.min(axGrip, axPower);
}

function maxDeceleration(
  speed: number,
  curvature: number,
  vehicle: VehicleParams,
): number {
  const { mass, dragFactor, downforceFactor, gripCoefficient: mu } = vehicle;
  const g = 9.81;

  const ay = speed * speed * curvature;
  const ayMax = mu * (g + (downforceFactor * speed * speed) / mass);
  const ayRatio = Math.min(ay / ayMax, 1);

  // Braking: grip + drag both help decelerate (Eq. 4, 5)
  const axBrake = mu * (g + (downforceFactor * speed * speed) / mass)
    * Math.sqrt(1 - ayRatio * ayRatio)
    + (dragFactor * speed * speed) / mass;

  return axBrake; // positive value = deceleration magnitude
}

function solveSpeedProfile(input: SolverInput): SpeedProfilePoint[] {
  const { circuit, vehicle } = input;
  const n = circuit.length;

  // Step 1: Compute cornering speed limits
  const vCorner = circuit.map(pt =>
    computeCorneringSpeedLimit(Math.abs(pt.curvature), vehicle)
  );

  // Step 2: Forward pass (acceleration-limited)
  const vForward = new Float64Array(n);
  vForward[0] = Math.min(vCorner[0] ?? Infinity, 1); // start from ~0
  for (let i = 1; i < n; i++) {
    const ds = (circuit[i]?.distance ?? 0) - (circuit[i - 1]?.distance ?? 0);
    const prevSpeed = vForward[i - 1] ?? 0;
    const ax = maxAcceleration(prevSpeed, Math.abs(circuit[i - 1]?.curvature ?? 0), vehicle);
    // v^2 = v0^2 + 2*a*ds
    const vAccel = Math.sqrt(Math.max(0, prevSpeed * prevSpeed + 2 * ax * ds));
    vForward[i] = Math.min(vAccel, vCorner[i] ?? Infinity);
  }

  // Step 3: Backward pass (braking-limited)
  const vBackward = new Float64Array(n);
  vBackward[n - 1] = vForward[n - 1] ?? 0;
  for (let i = n - 2; i >= 0; i--) {
    const ds = (circuit[i + 1]?.distance ?? 0) - (circuit[i]?.distance ?? 0);
    const nextSpeed = vBackward[i + 1] ?? 0;
    const ax = maxDeceleration(nextSpeed, Math.abs(circuit[i + 1]?.curvature ?? 0), vehicle);
    const vBrake = Math.sqrt(Math.max(0, nextSpeed * nextSpeed + 2 * ax * ds));
    vBackward[i] = Math.min(vForward[i] ?? 0, vBrake);
  }

  // Step 4: Final profile = min(forward, backward) with regime labeling
  return circuit.map((pt, i) => {
    const speed = vBackward[i] ?? 0;
    const cornerLimit = vCorner[i] ?? Infinity;
    const forwardSpeed = vForward[i] ?? 0;

    let regime: SpeedProfilePoint["regime"];
    if (speed >= cornerLimit * 0.99) {
      regime = "cornering";
    } else if (speed < forwardSpeed * 0.99) {
      regime = "braking";
    } else {
      // Determine if grip or power limited during acceleration
      const axPower = vehicle.peakPower / (vehicle.mass * Math.max(speed, 0.1));
      const axGrip = maxAcceleration(speed, Math.abs(pt.curvature), vehicle);
      regime = axPower < axGrip ? "accelerating-power" : "accelerating-grip";
    }

    const ds = i > 0 ? pt.distance - (circuit[i - 1]?.distance ?? 0) : 0;
    const avgSpeed = i > 0 ? (speed + (vBackward[i - 1] ?? 0)) / 2 : speed;
    const timeIncrement = avgSpeed > 0 ? ds / avgSpeed : 0;

    return {
      distance: pt.distance,
      speed,
      regime,
      curvature: pt.curvature,
      lateralG: (speed * speed * Math.abs(pt.curvature)) / 9.81,
      longitudinalG: 0, // computed from speed deltas in post-processing
      timeIncrement,
    };
  });
}
```

### SVG Speed-vs-Distance Trace (Extending MetricTracePanel Pattern)

```typescript
// Source: Adapted from existing MetricTracePanel.tsx SVG approach
// The speed profile maps naturally to a trace where x = distance, y = speed
// Color-coding by regime (accelerating = green, braking = red, cornering = amber)

interface SpeedTraceProps {
  profile: SpeedProfilePoint[];
  circuitName: string;
  highlightSectors?: { start: number; end: number; label: string }[];
}

// Key insight: this reuses the SVG polyline pattern from MetricTracePanel
// but adds color segments by regime and sector annotations.
// Implementation follows the same inline-style, no-dependency pattern.
```

### Sensitivity Waterfall Chart

```typescript
// Source: Standard engineering sensitivity decomposition pattern
// When user changes a parameter, run the model twice (baseline + modified)
// and decompose the lap time delta by sector and mechanism

interface WaterfallItem {
  label: string;           // "Turn 1-3 (grip-limited)", "Back straight (power-limited)"
  baselineTime: number;    // seconds
  modifiedTime: number;    // seconds
  delta: number;           // seconds (positive = slower)
  mechanism: string;       // "corner speed", "braking distance", "top speed"
}

// The waterfall sums individual sector deltas to the total lap time delta,
// showing which sectors gained or lost time and why.
// SVG implementation: stacked horizontal bars with cumulative offset,
// colored by positive (red) / negative (green) delta.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Forward-backward from apex points | Global two-pass envelope (forward accel + backward brake) | ~2015+ | Simpler implementation, avoids apex-finding complexity, same result |
| Separate tire model + aero model | Combined friction ellipse with speed-dependent semi-axes | Lenzo & Rossi 2020 | Single closed-form expression for speed-dependent grip limits |
| Zod 3 discriminated unions (non-composable) | Zod 4 discriminated unions (composable, nestable) | 2025 | Can nest Phase 1 + Phase 2 + future harnesses in a single union cleanly |
| Recharts for React charting | Hand-rolled SVG (for React 19 compatibility) | 2025-2026 | Recharts 3.x has React 19 compatibility issues; hand-rolled SVG avoids the dependency |

**Deprecated/outdated:**
- Ergast API: Deprecated as of 2024, no telemetry data, only race-level aggregates. Not useful for circuit geometry.
- f1laps/f1-track-vectors repo: No longer maintained. The SVG files may still be usable as visualization reference but should not be treated as an authoritative source.

## Open Questions

### Resolved

- **Q1: What model class?** Use quasi-steady-state (QSS) point-mass with forward-backward speed profile integration over curvature-discretized circuit. This is the standard F1 engineering approach for design sensitivity analysis. It produces rich per-point intermediate state (speed, regime, acceleration, sector times) that directly satisfy the transparency requirements. The model is purely longitudinal for Phase 2 but the architecture accommodates lateral force balance addition in Phase 3 by extending the friction ellipse.

- **Q2: What circuit format?** Use an ordered array of distance-indexed curvature samples (5m spacing recommended) with optional x/y spatial coordinates, named sectors, and named corners with apex distances. FastF1 provides x/y position data for 2018+ circuits at ~10m accuracy (their own documentation states "not highly accurate but sufficient for visualization"). This is adequate for Phase 2's track-map overlay but must be documented with provenance caveats.

- **Q3: When is track-map visualization honest?** The model produces a speed-vs-distance profile and per-point regime classification. A speed-vs-distance trace is always honest. A track-map overlay with speed-colored segments is honest when spatial coordinates are available from a documented source (FastF1 position data), because the visualization shows real track shape + model-computed speed -- it does not imply a computed racing line or trajectory. A racing-line display is NOT honest in Phase 2 because the model has no lateral position optimization (CTRL-05, Phase 5). Clear honesty criteria: (1) track outline from external source = honest; (2) speed overlay on that outline = honest; (3) "optimal racing line" = dishonest until Phase 5.

- **Q4: How to present sensitivity?** Use a dual approach: (1) overlay two speed profiles (baseline + modified) on the same trace to show where speed changed, and (2) a waterfall/bridge chart decomposing the total lap time delta into per-sector contributions with mechanism labels (corner speed, braking distance, top speed). Both extend existing visual primitives (MetricTracePanel pattern for speed trace, new SensitivityWaterfall component for waterfall).

- **Q5: How to generalize sim-core contracts?** Use Zod 4 discriminated union on `harnessId`. Define a base schema with shared fields (runId, scenarioId, scenarioLabel, seed, notes), then extend it separately for Phase 1 placeholder and Phase 2 lap model. Zod 4's composable discriminated unions support adding Phase 3+ harnesses later without modifying the union definition pattern. The TypeScript types narrow correctly on harnessId value.

### Genuine Gaps
| Question | Criticality | Recommendation |
|----------|-------------|----------------|
| What are realistic vehicle parameter defaults for a 2026 F1 car? | Medium | Use published estimates from FIA technical regulations (minimum weight ~798kg, ~1000hp power unit) with explicit "engineering-inference" provenance. Not critical to get exactly right -- the model's value is in sensitivity, not absolute accuracy. |
| How should FastF1 circuit position data be exported to JSON for use in the TypeScript app? | Low | Defer to Phase 6 (data integration). For Phase 2, hand-author 2-3 circuit files using publicly available track layouts and FastF1 corner data as reference. Document provenance as "engineering-inference from public sources." |
| Should regulation presets gain typed vehicle-constraint fields (min weight, max power, DRS zones)? | Medium | Keep `values` field loose in preset schema but add a `regulationConstraints` optional typed field that the model validates. This preserves forward compatibility while giving Phase 2 runtime type safety. Accept risk of slight over-design if Phase 3 changes the constraint surface. |

### Still Open
- The exact discretization step size (5m vs 10m vs variable) affects both accuracy and performance in the browser. The Lenzo & Rossi paper used 0.1m for research precision but notes 5m is adequate for design analysis. A circuit like Monza (5.8km) at 5m steps = 1160 points, which is trivially fast in a browser. Recommend starting at 5m and adjusting if profiling shows issues.

## Sources

### Primary (HIGH confidence)
- Lenzo & Rossi, "A Simple Mono-Dimensional Approach for Lap Time Optimisation," Applied Sciences 2020, 10(4), 1498. -- Full paper read, equations verified. Provides the vehicle model (Eq. 3-9), friction ellipse, power constraint, critical radius formula, and iterative optimization approach. Core physics reference for Phase 2.
- FastF1 documentation (docs.fastf1.dev, v3.6.1-3.8.1) -- Circuit information API, telemetry data structure, position data format (X/Y/Z in 1/10 meter units), accuracy caveat ("manually created, not highly accurate, sufficient for visualization").
- Zod 4 release notes and API docs (zod.dev) -- Discriminated union composability, z.literal() multi-value support, confirmed no breaking changes from v3 discriminated union pattern.

### Secondary (MEDIUM confidence)
- [TUM TUMFTM/laptime-simulation](https://github.com/TUMFTM/laptime-simulation) -- Open-source QSS lap simulation in Python; confirms the approach is standard practice. Paper reference: Heilmeier et al. 2019 (IEEE).
- [Heilmeier et al., "A Quasi-Steady-State Lap Time Simulation for Electrified Race Cars"](https://ieeexplore.ieee.org/document/8813646/) -- IEEE 2019; covers QSS for electrified race cars with energy management; confirms the model class extends naturally to Phase 3's electrical dynamics.
- [Recharts React 19 compatibility issue](https://github.com/recharts/recharts/issues/4558) -- Confirms React 19 requires react-is override; validates decision to use hand-rolled SVG.

### Tertiary (LOW confidence)
- F1 2026 regulation vehicle parameters (mass, power) -- Based on publicly discussed regulation directions, not official FIA technical regulations document. Values used as defaults should carry "engineering-inference" provenance.
- FastF1 position data accuracy for circuit geometry seeding -- The documentation says "not highly accurate." Actual position error bounds are not published. The ~10m error estimate is from the telemetry note "expect an error of around +/-10m when overlapping telemetry data of different laps."

## Knowledge Applied

Checked knowledge base (`~/.gsd/knowledge/index.md`). The KB contains 201 signal entries and 0 lessons/0 spikes. No relevant entries found for this phase's domain (vehicle dynamics modeling, lap simulation, circuit representation, sensitivity visualization). One f1-modeling signal exists (premature agent interrupts on long runs) but is not relevant to Phase 2's technical domain.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new dependencies needed; all existing libraries confirmed compatible; Zod 4 discriminated unions verified
- Architecture: HIGH -- QSS forward-backward model is the textbook approach for F1 lap sensitivity analysis, confirmed by multiple academic sources and open-source implementations
- Pitfalls: HIGH -- Speed-dependent grip (circular dependency) and forward-backward intersection logic are well-documented challenges in the QSS literature; the closed-form solutions are verified from Lenzo & Rossi 2020
- Circuit format: MEDIUM -- The curvature-array approach is sound but hand-authoring initial circuits without a FastF1 export pipeline adds manual effort. The format decision is forward-compatible with Phase 5 trajectory optimization (spatial coordinates present).
- Visualization honesty threshold: HIGH -- Clear criteria established: track outline + speed overlay = honest; racing line = dishonest until Phase 5

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (30 days -- stable domain, no fast-moving library concerns)

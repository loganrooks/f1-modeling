# Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics - Research

**Researched:** 2026-04-02
**Domain:** Multi-lap vehicle dynamics simulation (tire degradation, electrical energy management, weather coupling, aero-mode switching, load transfer)
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
CONTEXT.md was auto-generated in exploratory mode. No explicit locked decisions or discretion areas were declared. The domain boundary, assumptions, constraints, and open questions from the discussion phase constrain research scope as documented below.

### Claude's Discretion
All architecture and model choices are open for research-informed recommendation, subject to the phase boundary (multi-lap simulation, no race-distance strategy, no pit optimization, no driver style, no data import, no calibration).

### Deferred Ideas (OUT OF SCOPE)
- Race-distance strategy comparison (Phase 4)
- Pit-stop optimization (Phase 4)
- Qualifying/sprint session modes (Phase 4)
- Observer/estimation layers (Phase 4)
- Driver-style parameterization (Phase 5)
- Data import and calibration (Phases 6-7)
</user_constraints>

## Summary

Phase 3 transforms the single-lap QSS speed profile solver into a multi-lap stint simulator where tire wear, electrical energy, weather conditions, and aero mode evolve lap-to-lap and interact. The existing `solveSpeedProfile` function in `forwardBackward.ts` becomes the inner-loop solver, called repeatedly with modified vehicle parameters reflecting evolving subsystem state. This is the standard architecture used by TUMFTM's race-simulation and Heilmeier et al.'s electrified QSS approach: lap-wise discretization with state updates between laps.

The core technical challenges are: (1) designing a transparent phenomenological tire model with compound differentiation, degradation, thermal windows, and cliff behavior that a learner can inspect; (2) implementing a reduced-order electrical energy model reflecting 2026 FIA regulations (350 kW MGU-K, ~8.5 MJ recovery per lap, no MGU-H, 50/50 power split) without implying powertrain simulation fidelity; (3) coupling weather evolution (track temperature, wetness, rubber buildup) as multiplicative grip modifiers that evolve per-lap; (4) adding discrete aero-mode switching (2026 Straight Mode / Corner Mode replacing DRS); and (5) introducing basic weight transfer for load-dependent cornering grip. All five subsystems feed into the existing friction ellipse by modifying `gripCoefficient`, `peakPower`, `dragFactor`, and `downforceFactor` before each lap solve.

**Primary recommendation:** Wrap the existing QSS solver in a `StintRunner` that iterates laps, updates subsystem state at lap boundaries, and collects per-lap traces. Subsystem models should be pure functions: `(previousState, lapResult) => newState`. This keeps the inner solver untouched while enabling inspectable state evolution.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.x | All simulation code | Existing codebase language; browser-safe |
| Zod | 3.x | Schema validation for new types | Existing project standard for domain schemas |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (no new dependencies) | - | Phase 3 adds domain models, not libraries | All models are pure TypeScript math |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom tire model | Pacejka/MF tire model library | Pacejka requires fitting data and is opaque; phenomenological model is transparent and educational |
| Custom energy model | Battery simulation library | Overkill for reduced-order lap-level energy balance; custom is simpler |
| Charting library for new traces | Hand-rolled SVG | Project convention is hand-rolled SVG; consistency matters more than convenience |

**Installation:**
```bash
# No new packages needed. Phase 3 extends existing sim-core and domain packages.
```

## Architecture Patterns

### Recommended Project Structure
```
packages/sim-core/src/
├── lapModel/                    # Existing QSS solver (unchanged)
│   ├── forwardBackward.ts
│   ├── frictionEllipse.ts
│   ├── lapSolver.ts
│   └── types.ts
├── stintModel/                  # NEW: Multi-lap stint simulation
│   ├── stintRunner.ts           # Lap iteration loop, state collection
│   ├── types.ts                 # StintState, StintConfig, StintResult, per-lap trace types
│   ├── tireModel.ts             # Compound params, degradation, thermal window, cliff
│   ├── electricalModel.ts       # Energy SoC, harvesting, deployment, power limiting
│   ├── environmentModel.ts      # Weather evolution, track grip, rubber buildup
│   ├── aeroModel.ts             # DRS/active-aero mode switching per-point
│   └── loadTransfer.ts          # Weight transfer, load-dependent grip
├── contracts.ts                 # Extended: StintModelSummary added to union
└── index.ts

packages/domain/src/
├── scenario/schema.ts           # Extended: optional tireStrategy, electricalMode fields
├── presets/schema.ts            # Unchanged (values bag is already extensible)
└── runs/schema.ts               # Extended: new artifact types

presets/
├── regulations/
│   └── fia-2026-baseline.json   # Extended: quantitative electrical + aero values
├── weather/
│   ├── dry-baseline.json        # Extended: grip evolution parameters
│   ├── light-rain-baseline.json # Upgraded from placeholder
│   └── drying-track.json        # NEW: transition weather preset
└── tires/                       # NEW: tire compound preset directory
    ├── soft-c5.json
    ├── medium-c3.json
    ├── hard-c1.json
    └── intermediate-wet.json

packages/visuals/src/
├── traces/
│   ├── TireDegradationTrace.tsx  # NEW: wear/temp vs lap number
│   ├── EnergySocTrace.tsx        # NEW: SoC vs lap or distance
│   └── WeatherEvolutionTrace.tsx # NEW: grip factor vs lap
└── cards/
    └── StintSummaryCard.tsx      # NEW: stint-level metrics
```

### Pattern 1: Lap-Wise State Update Loop (StintRunner)
**What:** The core multi-lap simulation loop. Each lap, the runner: (1) resolves effective vehicle params from current subsystem state, (2) calls the existing `solveLap()`, (3) updates all subsystem models with the lap result, (4) records per-lap traces.
**When to use:** All multi-lap stint simulation.
**Example:**
```typescript
// Source: Architecture derived from TUMFTM race-simulation lap-wise discretization
// (Heilmeier et al., 2019)

interface StintState {
  lapNumber: number;
  tireState: TireState;
  electricalState: ElectricalState;
  environmentState: EnvironmentState;
  fuelState: FuelState;         // mass reduction from fuel burn
}

interface StintConfig {
  circuit: CircuitDocument;
  baseVehicle: VehicleParams;
  tireCompound: TireCompoundParams;
  electricalPolicy: ElectricalPolicy;
  weatherTimeline: WeatherTimeline;
  aeroConfig: AeroModeConfig;
  totalLaps: number;
}

function runStint(config: StintConfig): StintResult {
  let state = initializeStintState(config);
  const lapTraces: LapTrace[] = [];

  for (let lap = 0; lap < config.totalLaps; lap++) {
    // 1. Resolve effective vehicle params from current state
    const effectiveVehicle = resolveEffectiveVehicle(
      config.baseVehicle,
      state,
      config,
    );

    // 2. Solve single lap with effective params
    const lapOutput = solveLap(config.circuit, effectiveVehicle);

    // 3. Update subsystem states based on lap result
    state = {
      lapNumber: lap + 1,
      tireState: updateTireState(state.tireState, lapOutput, config),
      electricalState: updateElectricalState(state.electricalState, lapOutput, config),
      environmentState: updateEnvironmentState(state.environmentState, lap, config),
      fuelState: updateFuelState(state.fuelState, lapOutput),
    };

    // 4. Record per-lap trace
    lapTraces.push(buildLapTrace(lap, lapOutput, state));
  }

  return { lapTraces, finalState: state };
}
```

### Pattern 2: Multiplicative Grip Composition
**What:** Effective grip is composed from multiple independent factors, each a dimensionless multiplier on base compound grip. This makes each factor independently inspectable and testable.
**When to use:** Whenever combining tire, environment, and load effects on grip.
**Example:**
```typescript
// Source: Standard F1 strategy tool pattern (multiplicative factors)
function resolveEffectiveGrip(
  compound: TireCompoundParams,
  tireState: TireState,
  envState: EnvironmentState,
  loadFactor: number,
): number {
  const baseGrip = compound.peakGrip;             // e.g., 1.8 for soft
  const wearFactor = tireWearGripFactor(tireState); // 0.0 to 1.0
  const thermalFactor = tireThermalFactor(tireState, compound); // 0.0 to 1.0
  const surfaceFactor = surfaceGripFactor(envState); // 0.0 to 1.0
  const rubberFactor = rubberEvolutionFactor(envState); // 0.95 to 1.05

  return baseGrip * wearFactor * thermalFactor * surfaceFactor * rubberFactor * loadFactor;
}
```

### Pattern 3: Subsystem as Pure State Machine
**What:** Each subsystem model is a pure function: `(previousState, inputs) => newState`. No side effects, no mutation. This makes models individually testable and composable.
**When to use:** All subsystem models (tire, electrical, environment, aero).
**Example:**
```typescript
// Source: Standard functional state machine pattern
interface TireState {
  wearFraction: number;    // 0.0 (new) to 1.0 (fully worn)
  surfaceTemperature: number; // degrees C
  coreTemperature: number;    // degrees C
  compound: CompoundId;
  lapsSinceNew: number;
}

function updateTireState(
  prev: TireState,
  lapResult: LapModelOutput,
  config: StintConfig,
): TireState {
  const compound = getTireCompound(prev.compound, config);
  const avgSpeed = computeAverageSpeed(lapResult);
  const energyInput = computeTireEnergyInput(lapResult);

  const newWear = prev.wearFraction + compound.wearRate * (1 + compound.wearAcceleration * prev.wearFraction);
  const newSurfaceTemp = computeSurfaceTemp(prev, energyInput, config.environmentState);

  return {
    ...prev,
    wearFraction: Math.min(newWear, 1.0),
    surfaceTemperature: newSurfaceTemp,
    coreTemperature: computeCoreTemp(prev, newSurfaceTemp),
    lapsSinceNew: prev.lapsSinceNew + 1,
  };
}
```

### Pattern 4: Harness Extension via Discriminated Union
**What:** Add `StintModelSummary` to the existing `SimulationRunSummary` discriminated union with a new harnessId. The existing QSS single-lap harness continues to work.
**When to use:** Integrating the stint model into the run pipeline.
**Example:**
```typescript
// Source: Existing codebase pattern in contracts.ts
export interface StintModelSummary {
  runId: string;
  harnessId: "stint-model";
  modelVersion: string;
  scenarioId: string;
  scenarioLabel: string;
  seed: number;
  placeholder: false;
  vehicleParams: VehicleParams;
  circuitId: string;
  tireCompound: string;
  electricalPolicy: string;
  totalLaps: number;
  lapTimes: number[];
  finalTireState: TireState;
  finalElectricalState: ElectricalState;
  assumptions: string[];
  notes: string[];
}

export type SimulationRunSummary =
  | LapModelSummary
  | Phase1PlaceholderSummary
  | StintModelSummary;
```

### Anti-Patterns to Avoid
- **Modifying the inner QSS solver for per-lap state:** The forward-backward solver should remain a pure function of circuit + vehicle params. State evolution happens OUTSIDE the solver between laps. Mixing per-point state updates into the solver would break convergence guarantees.
- **Coupling subsystem models directly to each other:** Tire model should not call electrical model. The StintRunner orchestrates all interactions through the shared state. This keeps models independently testable.
- **Using continuous-time ODEs for lap-level dynamics:** The educational goal is transparency. Lap-wise discrete updates are easier to inspect, explain, and visualize than continuous integration. The TUMFTM race-simulation uses the same lap-wise approach for exactly this reason.
- **Over-fitting tire parameters to real data:** This is an educational platform. Tire compound parameters should be plausible engineering estimates with clear provenance labels, not calibrated to specific race data (that comes in Phase 7).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full Pacejka tire model | Slip angle/ratio computation, empirical coefficient fitting | Simple phenomenological model: grip = f(wear, temp, compound) | Pacejka requires proprietary fitting data; phenomenological model is transparent and educational |
| Battery cell-level simulation | Electrochemical models, thermal runaway, cell balancing | Lap-level energy balance: SoC += harvest - deploy | Cell-level models are irrelevant at strategy timescale |
| Meteorological weather prediction | Rainfall probability, cloud physics | Deterministic weather timeline: scripted events at specified laps | Weather prediction is not the domain; weather EFFECTS on grip are |
| Full 4-tire load transfer model | Per-corner spring/damper, anti-roll bar, suspension geometry | 2-axle weight transfer: deltaF = m*a*h/wheelbase | Per-corner model requires suspension parameters that Phase 3 does not have; 2-axle is sufficient for load sensitivity demonstration |
| SVG charting library wrapper | D3, Recharts, Victory integration | Hand-rolled SVG following existing SpeedProfileTrace pattern | Project convention established in Phase 2; consistency across all visual components |

**Key insight:** Every "don't hand-roll" item above is about NOT adding complexity. Phase 3's value is making subsystem interactions visible, not maximizing fidelity. The models should be simple enough that a user can understand WHY their tire fell off a cliff or WHY they ran out of electrical energy.

## Common Pitfalls

### Pitfall 1: Solver Divergence with State-Dependent Grip
**What goes wrong:** If the grip coefficient fed to the QSS solver changes too drastically between laps (e.g., tire cliff drops grip from 1.7 to 0.5), the forward-backward solver may produce physically implausible speed profiles or fail to converge within its 3-iteration limit.
**Why it happens:** The solver assumes constant vehicle params within a lap. Large inter-lap parameter jumps create discontinuities.
**How to avoid:** Clamp maximum per-lap grip change to a reasonable delta (e.g., max 10% change per lap). If cliff behavior needs to be steeper, implement it as a rapid multi-lap decline rather than a single-lap step. Verify solver convergence after each lap.
**Warning signs:** Lap times that jump by more than 5 seconds between consecutive laps; solver not converging (all 3 iterations used without meeting 0.1 m/s threshold).

### Pitfall 2: Energy Accounting Mismatch
**What goes wrong:** The electrical energy harvested and deployed per lap does not match what the speed profile implies. For example, deploying 350 kW for the full straight but not accounting for the speed increase that deployment enabled.
**Why it happens:** The QSS solver uses `peakPower` as a single value. If `peakPower` includes electrical power, the energy consumed is implicit in the speed profile, not explicitly tracked.
**How to avoid:** Make the energy model a post-processing step on the solved speed profile. After solving the lap with an effective `peakPower` (ICE + electrical deployment), compute the energy consumed by integrating electrical power over the profile. If consumption exceeds available SoC, reduce deployment for the next lap.
**Warning signs:** SoC going negative; total energy harvested per lap exceeding 8.5 MJ (the 2026 regulatory cap); deployment exceeding battery capacity.

### Pitfall 3: Multiplicative Grip Factor Collapse
**What goes wrong:** When all grip factors are near their lower bounds simultaneously (worn tires + rain + cold track), the effective grip becomes unrealistically low (e.g., 0.3), making the solver produce corner speeds below what even a road car would achieve.
**Why it happens:** Independent multiplicative factors compound; each factor is calibrated in isolation but their product was never validated.
**How to avoid:** Impose a floor on effective grip (e.g., minimum 0.4 for any driveable condition). Add integration tests that run extreme-case stints (fully worn wet tires on cold track) and verify lap times remain in a plausible range (within 2x dry baseline).
**Warning signs:** Effective grip below 0.5; lap times exceeding 3x the dry baseline.

### Pitfall 4: Weather Timeline Synchronization
**What goes wrong:** Weather state updates at lap boundaries but the user expects weather changes to happen mid-lap (e.g., rain starting at lap 5.5). The lap-boundary model cannot represent this, leading to a jarring step change.
**Why it happens:** Lap-wise discretization is inherently coarse for mid-lap events.
**How to avoid:** Interpolate weather state across the lap boundary: if rain starts at lap 5.5, lap 5 gets 50% rain effect and lap 6 gets full effect. Document this as a model limitation. For this educational platform, lap-boundary granularity is acceptable.
**Warning signs:** Users confused by step changes in grip; weather effects not visible until the lap AFTER the event was specified.

### Pitfall 5: Breaking Phase 2 Backward Compatibility
**What goes wrong:** Extending `VehicleParams`, `SpeedProfilePoint`, or `SimulationRunSummary` in a way that breaks existing Phase 2 consumers (visualizations, comparison logic, API responses).
**Why it happens:** Adding required fields to existing interfaces; changing discriminated union behavior.
**How to avoid:** All new fields on existing interfaces MUST be optional. New harness type (`stint-model`) is a new union member, not a modification of `qss-lap-model`. Existing API routes continue to work. Run the full Phase 2 test suite after every structural change.
**Warning signs:** TypeScript compilation errors in Phase 2 code; existing tests failing; Phase 2 single-lap runs broken.

### Pitfall 6: Aero Mode Integrated Into Solver Instead of Pre-Processing
**What goes wrong:** Trying to modify the forward-backward solver to switch aero coefficients per-point based on DRS zones. This introduces per-point state dependence into what is currently a stateless solver.
**Why it happens:** Natural instinct to put aero switching inside the solver.
**How to avoid:** Pre-process the circuit: before calling `solveSpeedProfile`, resolve per-point aero state (Straight Mode vs Corner Mode) and build a per-point `dragFactor` and `downforceFactor` array. Either extend `CircuitLayoutPoint` to carry per-point aero factors, or modify the solver signature to accept per-point vehicle params. The former is simpler.
**Warning signs:** Solver complexity increasing; convergence issues from per-point parameter changes.

## Code Examples

Verified patterns from analysis of the existing codebase and published models:

### Tire Degradation Model (Phenomenological)
```typescript
// Source: Adapted from arxiv.org/abs/2512.00640 state-space tire degradation model
// and standard F1 strategy simulation approaches (TUMFTM race-simulation)

interface TireCompoundParams {
  compoundId: "soft" | "medium" | "hard" | "intermediate" | "wet";
  peakGrip: number;                // dimensionless, e.g., 1.8 for soft
  baseWearRate: number;            // wear fraction per lap, e.g., 0.025 for soft
  wearAcceleration: number;        // wear rate increases with accumulated wear
  cliffThreshold: number;          // wear fraction where cliff begins, e.g., 0.75
  cliffSeverity: number;           // grip drop rate in cliff zone
  optimalTempLow: number;          // degrees C, e.g., 85 for soft
  optimalTempHigh: number;         // degrees C, e.g., 115 for soft
  thermalSensitivity: number;      // grip loss per degree outside window
  warmupRate: number;              // degrees C per lap toward equilibrium
  provenance: string;              // e.g., "engineering-inference"
}

function tireWearGripFactor(state: TireState, compound: TireCompoundParams): number {
  if (state.wearFraction < compound.cliffThreshold) {
    // Linear degradation before cliff
    return 1.0 - 0.15 * state.wearFraction;
  }
  // Cliff zone: accelerating grip loss
  const cliffProgress = (state.wearFraction - compound.cliffThreshold) /
                         (1.0 - compound.cliffThreshold);
  const preCliffGrip = 1.0 - 0.15 * compound.cliffThreshold;
  return preCliffGrip * (1.0 - compound.cliffSeverity * cliffProgress * cliffProgress);
}

function tireThermalFactor(state: TireState, compound: TireCompoundParams): number {
  const temp = state.surfaceTemperature;
  if (temp >= compound.optimalTempLow && temp <= compound.optimalTempHigh) {
    return 1.0; // In window: full grip
  }
  const deviation = temp < compound.optimalTempLow
    ? compound.optimalTempLow - temp
    : temp - compound.optimalTempHigh;
  return Math.max(0.5, 1.0 - compound.thermalSensitivity * deviation);
}
```

### Electrical Energy Balance Model
```typescript
// Source: Derived from 2026 FIA PU Technical Regulations and
// Heilmeier et al. 2019 QSS energy management approach

interface ElectricalState {
  stateOfCharge: number;         // Joules, current battery energy
  maxCapacity: number;           // Joules, battery capacity (~4 MJ delta SoC)
  lapEnergyDeployed: number;     // Joules deployed this lap
  lapEnergyHarvested: number;    // Joules harvested this lap
  totalDeployed: number;         // Cumulative Joules deployed
  totalHarvested: number;        // Cumulative Joules harvested
}

interface ElectricalPolicy {
  policyId: string;              // e.g., "aggressive-deploy", "conservative"
  deployFraction: number;        // 0.0 to 1.0: fraction of available SoC to deploy per lap
  harvestEfficiency: number;     // 0.0 to 1.0: fraction of braking energy captured
  maxDeployPower: number;        // Watts, capped at 350_000 (350 kW)
  maxHarvestPerLap: number;      // Joules, capped at 8_500_000 (8.5 MJ)
}

// 2026 regulation reference values
const REGULATION_2026 = {
  maxMguKPower: 350_000,         // 350 kW
  maxHarvestPerLap: 8_500_000,   // 8.5 MJ
  maxDeltaSoC: 4_000_000,        // 4 MJ usable energy window
  icePower: 400_000,             // ~400 kW ICE
  totalSystemPower: 750_000,     // ~750 kW combined (engineering estimate)
};

function updateElectricalState(
  prev: ElectricalState,
  lapResult: LapModelOutput,
  policy: ElectricalPolicy,
): ElectricalState {
  // Estimate harvest from braking energy in the lap
  const brakingEnergy = estimateBrakingEnergy(lapResult);
  const harvest = Math.min(
    brakingEnergy * policy.harvestEfficiency,
    policy.maxHarvestPerLap,
  );

  // Compute deployment based on policy and available SoC
  const availableEnergy = prev.stateOfCharge;
  const targetDeploy = availableEnergy * policy.deployFraction;
  const deploy = Math.min(targetDeploy, prev.maxCapacity);

  const newSoC = Math.max(0, Math.min(
    prev.maxCapacity,
    prev.stateOfCharge + harvest - deploy,
  ));

  return {
    stateOfCharge: newSoC,
    maxCapacity: prev.maxCapacity,
    lapEnergyDeployed: deploy,
    lapEnergyHarvested: harvest,
    totalDeployed: prev.totalDeployed + deploy,
    totalHarvested: prev.totalHarvested + harvest,
  };
}
```

### Aero Mode Pre-Processing
```typescript
// Source: Derived from 2026 FIA Technical Regulations active aero specification

type AeroMode = "corner-mode" | "straight-mode";

interface AeroModeConfig {
  straightModeZones: Array<{ startDistance: number; endDistance: number }>;
  cornerModeDragFactor: number;       // base dragFactor (high downforce)
  cornerModeDownforceFactor: number;  // base downforceFactor
  straightModeDragFactor: number;     // reduced drag (~55% less)
  straightModeDownforceFactor: number; // reduced downforce (~30% less)
}

interface AeroResolvedPoint {
  distance: number;
  curvature: number;
  dragFactor: number;
  downforceFactor: number;
  aeroMode: AeroMode;
}

function resolveAeroPerPoint(
  circuit: CircuitLayoutPoint[],
  aeroConfig: AeroModeConfig,
): AeroResolvedPoint[] {
  return circuit.map(point => {
    const inStraightZone = aeroConfig.straightModeZones.some(
      zone => point.distance >= zone.startDistance && point.distance < zone.endDistance,
    );
    return {
      ...point,
      dragFactor: inStraightZone ? aeroConfig.straightModeDragFactor : aeroConfig.cornerModeDragFactor,
      downforceFactor: inStraightZone ? aeroConfig.straightModeDownforceFactor : aeroConfig.cornerModeDownforceFactor,
      aeroMode: inStraightZone ? "straight-mode" : "corner-mode",
    };
  });
}
```

### Weight Transfer (2-Axle Model)
```typescript
// Source: Standard vehicle dynamics (Milliken & Milliken, Race Car Vehicle Dynamics)

interface LoadTransferParams {
  cogHeight: number;       // meters, center of gravity height (~0.30 for F1)
  wheelbase: number;       // meters (~3.6 for F1)
  trackWidth: number;      // meters (~1.8 for F1)
  frontWeightFraction: number; // fraction of weight on front axle (~0.45)
}

function computeLoadSensitivityFactor(
  lateralG: number,
  longitudinalG: number,
  params: LoadTransferParams,
): number {
  // Lateral load transfer reduces total grip due to tire load sensitivity
  // The tire grip coefficient decreases with load (power law ~0.8)
  const lateralTransfer = Math.abs(lateralG) * 9.81 * params.cogHeight / params.trackWidth;
  // Normalize: lateralTransfer / static load gives fraction of weight shifted
  const lateralShiftFraction = Math.min(lateralTransfer * 2, 0.9); // cap at 90%

  // Load sensitivity: F_grip ~ F_normal^0.8 (typical tire)
  // Two tires: one loaded (1+shift), one unloaded (1-shift)
  // Total grip ratio = ((1+s)^0.8 + (1-s)^0.8) / 2
  const s = lateralShiftFraction;
  const loadSensitivityExponent = 0.85;
  const gripRatio = (
    Math.pow(1 + s, loadSensitivityExponent) +
    Math.pow(Math.max(0.01, 1 - s), loadSensitivityExponent)
  ) / 2;

  return gripRatio; // < 1.0 when load transfer is significant
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| MGU-K 120 kW + MGU-H | MGU-K 350 kW, no MGU-H | 2026 FIA regulations | Electrical contribution jumps from ~20% to ~50% of total power; single energy pool simplifies model |
| DRS rear wing only | Active aero front + rear (Straight Mode / Corner Mode) | 2026 FIA regulations | Affects both drag AND downforce simultaneously; front/rear balance maintained |
| Mass-based fuel flow (kg/h) | Energy-based fuel flow (MJ/h, 3000 MJ/h cap) | 2026 FIA regulations | Fuel management becomes energy accounting |
| Fixed tire compounds per season | C1-C6 (potentially C7) compound range with event-specific selection | Pirelli ongoing | More granular compound differentiation; for simulation, 3 dry + 1 wet is sufficient |
| Static grip coefficient | Evolving grip = f(wear, temp, surface, weather) | Phase 3 upgrade | Core enabler for multi-lap strategy relevance |

**Deprecated/outdated:**
- **MGU-H (Motor Generator Unit - Heat):** Removed from 2026 regulations. Do NOT model MGU-H; use a single electrical energy pool (MGU-K only). This simplifies the model significantly and matches regulatory reality.
- **DRS as implemented 2011-2025:** Replaced by active aero. The model should use "Straight Mode" / "Corner Mode" terminology, not "DRS open/closed." However, the zone-based activation mechanism is similar.

## Open Questions

### Resolved

1. **What multi-lap simulation architecture best wraps the existing single-lap solver?**
   Lap-wise discretization with state updates between laps. This is the standard approach (TUMFTM race-simulation, Heilmeier et al. 2019). The existing `solveLap()` is called N times with modified VehicleParams. State updates at lap boundaries produce plausible stint behavior -- this is validated by TUMFTM's race-simulation producing realistic F1 race results with the same approach.

2. **What reduced-order tire model captures degradation, thermal window, and cliff behavior transparently?**
   A phenomenological model with: (a) linear degradation + quadratic cliff after a threshold; (b) parabolic thermal window centered on compound-specific optimal temperature; (c) compound-specific parameters for wear rate, cliff threshold, and thermal sensitivity. This draws on the arxiv state-space approach (2512.00640) for the degradation dynamics and standard F1 strategy tool practice for the thermal window. Three dry compounds (soft/medium/hard) with distinct parameter sets plus one intermediate/wet compound.

3. **What electrical model granularity serves reduced-order education for 2026-era cars?**
   A single energy pool model (SoC tracking only, no MGU-H). The 2026 regulations eliminate MGU-H, making a single-pool model both simpler AND more accurate for the regulatory era. Key parameters: 350 kW max deploy, ~8.5 MJ max harvest per lap, ~4 MJ usable delta SoC. Two policies (aggressive deploy vs conservation) provide the comparison surface.

4. **How should weather transitions and grip evolution be modeled at the lap timescale?**
   Deterministic weather timeline: a sequence of (lap, weatherState) events with linear interpolation between events. Grip modifiers are multiplicative. Track rubber evolution is a monotonically increasing factor (0.95 to 1.05 range) that resets partially with rain. This is the standard approach in F1 strategy tools.

5. **How should DRS zones and 2026 aero modes be defined in the circuit/regulation data?**
   Aero mode zones are defined as distance ranges in the regulation preset (paired with circuit), analogous to current DRS detection zones. The solver receives per-point aero state pre-resolved before the solve. The regulation preset defines the drag/downforce deltas for each mode. Two modes: Straight Mode (low drag, low downforce) and Corner Mode (high drag, high downforce).

6. **What lateral force balance model is appropriate at this fidelity level?**
   2-axle weight transfer (longitudinal and lateral) with tire load sensitivity. The load sensitivity exponent (~0.8-0.85) captures the key insight: weight transfer reduces total grip. This is sufficient for Phase 3. Per-corner 4-wheel resolution adds complexity without meaningful educational value before Phase 5's driver-style work introduces asymmetric usage.

7. **Should Phase 3 introduce a new harnessId or extend the existing QSS harness?**
   New harnessId: `stint-model`. The stint harness internally delegates single-lap solving to the existing QSS solver. Phase 2 single-lap runs continue to work via `qss-lap-model`. Both harness types coexist in the `SimulationRunSummary` discriminated union.

### Genuine Gaps

| Question | Criticality | Recommendation |
|----------|-------------|----------------|
| Exact 2026 regulation numbers (final ratified versions) | Medium | Sources disagree on some values (8.5 MJ vs 9 MJ harvest cap). Use the most common values with provenance labels noting uncertainty. Accept-risk -- exact numbers are educational parameters, not competitive tools. |
| Tire compound temperature ranges for 2026 Pirelli tires | Low | No public data for 2026-specific compounds. Use engineering estimates based on historical data (soft: 85-115C, medium: 95-130C, hard: 110-145C). Label provenance clearly. Accept-risk. |
| Quantitative drag/downforce deltas for Straight Mode vs Corner Mode | Medium | FIA states ~55% drag reduction, ~30% downforce reduction in Straight Mode, but exact coefficients are not public. Use these percentages as starting values. Accept-risk -- can be refined in Phase 7 calibration. |

### Still Open
- The exact speed-dependent deployment taper curve for the 2026 MGU-K (deployment reducing above 290 kph, zero at 355 kph) is mentioned in some sources but not confirmed in the ratified regulations. Model this as a configurable parameter in the electrical policy rather than hardcoding.

## Sources

### Primary (HIGH confidence)
- Existing codebase: `packages/sim-core/src/lapModel/` -- verified solver architecture, types, friction ellipse implementation
- Existing codebase: `packages/domain/src/` -- verified schema patterns, preset structure, run record schema
- Existing codebase: `apps/local-api/src/services/runService.ts` -- verified harness dispatch pattern
- [FIA 2026 PU Technical Regulations Issue 7](https://www.fia.com/sites/default/files/fia_2026_formula_1_technical_regulations_pu_-_issue_7_-_2024-06-11_1.pdf) -- binary PDF, not fully extractable but confirmed by multiple secondary sources
- [Honda 2026 Regulations Commentary](https://global.honda/en/F1/features/2026_Commentary/regulations/) -- ICE ~400 kW, MGU-K 350 kW, ~8.5 MJ recovery, no MGU-H

### Secondary (MEDIUM confidence)
- [Formula1.com 2026 PU Regulations Explained](https://www.formula1.com/en/latest/article/explained-2026-power-unit-regulations-fia.68izKQ2tn1voQPWvgLVMXN) -- 350 kW MGU-K, deployment taper, overtake mode
- [Formula1.com 2026 Aero Regulations Explained](https://www.formula1.com/en/latest/article/explained-2026-aerodynamic-regulations-fia-twitter-mode-z-mode-.26c1CtOzCmN3GfLMywrgb2) -- Straight Mode / Corner Mode, ~30% downforce cut, ~55% drag reduction
- [arxiv 2512.00640 - State-Space Tire Degradation Model](https://arxiv.org/abs/2512.00640) -- Bayesian state-space tire degradation, compound-specific rates, warm-up dynamics
- [TUMFTM race-simulation](https://github.com/TUMFTM/race-simulation) -- lap-wise discretization pattern, tire degradation + fuel effect architecture
- [TUMFTM laptime-simulation](https://github.com/TUMFTM/laptime-simulation) -- QSS solver with energy management (Heilmeier et al. 2019)
- [Motorsport.tech 2026 PU Focus](https://motorsport.tech/formula-1/2026-f1-tech-regulations-in-focus) -- 4 MJ delta SoC, 9 MJ harvest, 16 kg MGU-K assembly
- [TracingInsights 2026 Regs](https://www.mintlify.com/TracingInsights/26Regs/technical/power-unit) -- 8.5 MJ battery capacity, 35 kg battery, 1000V DC

### Tertiary (LOW confidence)
- [F1technical.net forum - tire temperatures](https://www.f1technical.net/forum/viewtopic.php?t=26669) -- historical tire operating temperatures (2017 era, may not match 2026 Pirelli)
- [Wikipedia - Tire load sensitivity](https://en.wikipedia.org/wiki/Tire_load_sensitivity) -- load sensitivity exponent 0.7-0.9
- [Raceteq - tire degradation science](https://www.raceteq.com/articles/2024/08/the-science-behind-tyre-degradation-in-formula-1) -- general degradation mechanisms, graining/blistering
- [Catapult - track surface and temperature](https://www.catapult.com/blog/race-strategy-f1-track-surface) -- track rubber evolution, grip buildup patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies; pure TypeScript math extending existing codebase patterns
- Architecture (lap-wise state update): HIGH - validated by TUMFTM race-simulation and Heilmeier et al.; natural extension of existing solver
- Tire model: MEDIUM - phenomenological approach is well-established but specific parameter values are engineering estimates, not calibrated
- Electrical model: MEDIUM-HIGH - 2026 regulation structure is clear but some quantitative values have minor disagreements across sources
- Weather/environment: MEDIUM - multiplicative grip factor approach is standard but specific rubber evolution rates are not well-documented publicly
- Aero mode switching: MEDIUM - mode structure is clear but exact drag/downforce deltas are engineering estimates
- Load transfer: HIGH - standard vehicle dynamics equations (Milliken & Milliken); well-understood physics
- Pitfalls: HIGH - derived from direct analysis of the existing codebase constraints

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (30 days; regulations are stable, no fast-moving library concerns)

## Knowledge Applied

Checked knowledge base (`.planning/knowledge/index.md` and `~/.gsd/knowledge/index.md` fallback). The global KB contains only raw signals (207 entries) related to GSD workflow tooling, CI/CD, and configuration -- no lessons or spikes relevant to vehicle dynamics simulation, tire modeling, electrical energy management, or F1 domain knowledge. No relevant entries found for this phase's domain.

Spikes avoided: 0

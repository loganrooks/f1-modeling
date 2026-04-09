# Phase 4: Strategy, Race Simulation, and Explanation Surfaces - Research

**Researched:** 2026-04-08
**Domain:** Race strategy simulation, visualization architecture, F1 qualifying/sprint formats, factor-based explanation
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

1. **Phase 3.1 is the architectural prerequisite.** Phase 4 builds on Phase 3.1's race-state engine, multi-stint plans, pit events, interruptions, run lineage, and typed timeline artifacts. Phase 4 does NOT duplicate any of this scope.
2. **Visualization library deliberation is gating.** Hand-rolled SVG will not scale. A proper visualization library must be chosen before Phase 4 planning begins. This research resolves that question.
3. **Phase 4 scope narrowed by audit.** Observers moved to Phase 4.1. Phase 4 = strategy + race simulation + explanation surfaces.
4. **Requirements:** STRA-01 through STRA-08, PLAT-04, EDU-01, EDU-03, VISU-03.
5. **New audit requirements:** STRA-06 (pit-lane loss), STRA-07 (tire inventory), STRA-08 (traffic/rejoin penalties).
6. **Deploy-plan semantics needed.** Electrical deployment needs richer policy representation beyond aggressive/conservative.
7. **Type preset values.** Regulation preset `values` field is currently `z.record(string, unknown)`.
8. **Performance engineer is natural first role; strategy and race engineer are Phase 4 roles.**

### Claude's Discretion

1. **Visualization library choice** -- research options, recommend one. (Resolved below: visx.)
2. **Multi-strategy comparison presentation** -- overview + drill-down approach. (Resolved below.)
3. **Factor decomposition granularity** -- for "why a strategy wins." (Resolved below.)
4. **Qualifying modeling approach** -- variant of race engine or separate harness. (Resolved below.)
5. **Engineer-role view structure** -- separate views or filtered projections. (Resolved below.)
6. **Intervention interaction with branching** -- representation model. (Resolved below.)
7. **Sensitivity/perturbation workflow** at race distance. (Resolved below.)

### Deferred Ideas (OUT OF SCOPE)

- Observer layer, synthetic sensors, true/measured/estimated comparison -- Phase 4.1
- Driver-style parameterization and behavioral differences -- Phase 5
- Model-based control baseline (MPC) and optimal trajectory -- Phase 5
- Data import and telemetry alignment -- Phase 6
- Model calibration and confidence scoring -- Phase 7
- Full opponent/competitor model -- v2
- Monte Carlo race evolution and ensemble analysis -- v2
- Multi-car racecraft and overtaking logic -- v2
</user_constraints>

## Summary

Phase 4 transforms a single-stint simulation into a full race-strategy analysis tool. The core technical challenges are: (1) choosing a visualization library that scales to linked views, shared cursors, and strategy timelines while being compatible with React 19; (2) designing a strategy comparison engine that decomposes total-time deltas into factor-level attributions (pit loss, degradation, energy, weather); (3) modeling qualifying sessions as a constrained tire-allocation optimization distinct from race simulation; and (4) providing engineer-role learning views that present shared simulation data through role-specific lenses.

This phase depends entirely on Phase 3.1's race-state engine, typed timeline artifacts, pit events, interruptions, and run lineage. Phase 4 consumes these outputs; it does not build them. The research focuses on what Phase 4 adds ON TOP of Phase 3.1: strategy comparison logic, explanation surfaces, session mode variants (qualifying, sprint), in-race interventions, and the visualization architecture to present all of this.

The gating visualization library question is resolved: **use visx** (Airbnb's modular d3-for-React library). It provides the low-level primitives needed for linked views, brushing, custom tooltips, and shared cursors while remaining fully React-native and modular. The existing hand-rolled SVG components follow a pattern that maps naturally to visx primitives, making incremental migration feasible.

**Primary recommendation:** Adopt visx as the visualization foundation, build strategy comparison as multi-run analysis with stint-level factor decomposition, model qualifying as a separate session mode (not a race-engine variant), and implement engineer-role views as filtered projections over shared data surfaces with role-specific guiding questions.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @visx/xychart | 3.12.0+ (alpha for React 19) | High-level chart component with tooltip, crosshair, linked views | React-native chart composition with DataProvider/EventEmitterProvider for linked views |
| @visx/shape | 3.12.0+ | Low-level SVG shape primitives (Bar, Line, Area, etc.) | Fine-grained control for custom chart types (Gantt-style timelines, waterfall) |
| @visx/scale | 3.12.0+ | D3-compatible scale functions (scaleLinear, scaleBand, scaleTime) | Standard d3 scale math without d3 DOM manipulation |
| @visx/axis | 3.12.0+ | Axis rendering components | Declarative axes that integrate with visx scales |
| @visx/group | 3.12.0+ | SVG group wrapper | Positioning and transforms for chart sub-groups |
| @visx/brush | 3.12.0+ | Brush interaction primitive | Time-range selection for race timeline exploration |
| @visx/tooltip | 3.12.0+ | Tooltip positioning and rendering | Shared cursor/tooltip state across linked views |
| @visx/grid | 3.12.0+ | Grid line rendering | Background grid for chart readability |
| @visx/gradient | 3.12.0+ | SVG gradient definitions | Visual differentiation for tire compound bands |
| @visx/responsive | 3.12.0+ | Container-responsive chart sizing | Charts that adapt to panel layout |
| zod | 4.3.6 (existing) | Schema validation for new types (strategy presets, deploy plans, etc.) | Already in stack; extend for typed regulation/strategy presets |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @visx/event | 3.12.0+ | Event coordinate normalization | When building custom interactions beyond XYChart |
| @visx/text | 3.12.0+ | Smart text wrapping and positioning | Annotation labels on strategy timelines |
| @visx/annotation | 3.12.0+ | Chart annotations (lines, labels, circles) | Marking pit events, interruptions, interventions on timelines |
| @visx/threshold | 3.12.0+ | Threshold/area-between visualization | Showing strategy advantage/disadvantage bands |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| visx | Raw d3 + React refs | More control but d3 DOM manipulation fights React; visx gives same math with React rendering |
| visx | Observable Plot | Simpler API but weaker React integration (ref-based), no first-class linked views, stale React wrapper |
| visx | Recharts | Easy out-of-box charts but insufficient customization for Gantt timelines, waterfall attribution, custom strategy views |
| visx | Canvas-based (e.g., Pixi.js) | Better for thousands of data points; unnecessary for 50-70 lap race traces; loses SVG accessibility |

**Installation:**
```bash
npm install @visx/xychart @visx/shape @visx/scale @visx/axis @visx/group @visx/brush @visx/tooltip @visx/grid @visx/gradient @visx/responsive @visx/event @visx/text @visx/annotation @visx/threshold
```

### React 19 Compatibility Note

**CRITICAL:** This project uses React 19.2.4. visx 3.12.0 (stable) has peer dependency constraints that do not include React 19. However, visx has merged React 19 support (PR #1968) and released `3.13.0-alpha.0` with React 19 in peer dependencies. The stable release is expected imminently.

**Strategy:** Install `@visx/*@3.13.0-alpha.0` if available at planning time. If only 3.12.0 is stable, install with `--legacy-peer-deps` flag (safe -- visx works fine with React 19, the constraint is just a peerDependency range). Monitor for the stable 3.13.x release.

## Architecture Patterns

### Recommended Project Structure

```
packages/
  visuals/
    src/
      primitives/           # visx-based reusable chart primitives
        TimeSeriesChart.tsx  # Generic time-series with linked cursor support
        WaterfallChart.tsx   # Factor-attribution waterfall (extends existing pattern)
        GanttTimeline.tsx    # Stint/compound Gantt-style bar chart
        BrushableRange.tsx   # Time-range brush selector
      strategy/             # Strategy-specific visualization compositions
        StrategyComparison.tsx      # Multi-strategy overview (Gantt + delta)
        StintDeltaBreakdown.tsx     # Stint-by-stint factor decomposition
        RaceTimelineView.tsx        # Full race timeline with events
        PitWindowOverlay.tsx        # Pit window visualization
      roles/                # Engineer-role view compositions
        StrategyEngineerView.tsx    # Compound windows, pit timing, tire inventory
        RaceEngineerView.tsx        # Interventions, mode changes, driver comms
        PerformanceEngineerView.tsx # Degradation, energy, lap-time decomposition
      qualifying/           # Qualifying-specific views
        QualifyingTimeline.tsx      # Q1/Q2/Q3 session progression
        CompoundAllocationView.tsx  # Tire set inventory per session
      traces/               # Existing traces (migrated incrementally)
        SpeedProfileTrace.tsx       # Keep as-is initially; migrate later
        SoCTrace.tsx                # Keep as-is initially; migrate later
      inspectors/           # Existing inspectors
        SensitivityWaterfall.tsx    # Extend for strategy attribution
      workspace/            # Existing workspace components
  sim-core/
    src/
      raceModel/            # NEW: Race-level simulation (Phase 3.1 provides engine)
        strategyComparison.ts   # Compare multiple race run results
        factorDecomposition.ts  # Decompose time delta into factors
        qualifyingSession.ts    # Qualifying session mode
        sprintSession.ts        # Sprint session mode
        interventionModel.ts    # In-race intervention logic
        trafficModel.ts         # Low-fidelity traffic/rejoin penalties
      stintModel/           # Existing: unchanged
  domain/
    src/
      strategy/             # NEW: Strategy-specific domain types
        strategyPreset.ts   # Typed strategy configurations
        deployPlan.ts       # Richer electrical deployment plan schema
        qualifyingRules.ts  # Qualifying tire allocation rules
      presets/
        schema.ts           # MODIFIED: Type the `values` field per preset type
```

### Pattern 1: Linked Multi-Chart View with Shared Cursor
**What:** Multiple visx charts sharing cursor position and tooltip state via DataProvider/EventEmitterProvider.
**When to use:** Strategy comparison views where the user inspects multiple traces (tire wear, energy, lap time) at the same lap position.
**Example:**
```typescript
// Source: visx DataProvider/EventEmitterProvider documentation
import { DataProvider, EventEmitterProvider, XYChart, Tooltip } from '@visx/xychart';

// Wrap multiple charts in shared providers for linked tooltips
function LinkedStrategyView({ strategies }: { strategies: StrategyResult[] }) {
  return (
    <DataProvider xScale={{ type: 'linear' }} yScale={{ type: 'linear' }}>
      <EventEmitterProvider>
        {/* All XYCharts within this provider share cursor state */}
        <XYChart height={200}>
          {/* Lap time traces per strategy */}
        </XYChart>
        <XYChart height={150}>
          {/* Tire wear traces per strategy */}
        </XYChart>
        <XYChart height={150}>
          {/* Energy SoC traces per strategy */}
        </XYChart>
        <Tooltip snapTooltipToDatumX snapTooltipToDatumY />
      </EventEmitterProvider>
    </DataProvider>
  );
}
```

### Pattern 2: Strategy Comparison as Multi-Run Analysis
**What:** Each strategy is a separate race simulation run. Comparison is post-hoc analysis of multiple run results.
**When to use:** STRA-01 -- comparing pit timing, compound sequence, energy policy across strategies.
**Example:**
```typescript
// Strategy comparison is analysis of multiple completed race runs
interface StrategyComparisonInput {
  baselineRunId: string;
  comparisonRunIds: string[];
}

interface StrategyComparisonResult {
  baseline: RaceTimeline;
  comparisons: Array<{
    runId: string;
    timeline: RaceTimeline;
    totalDelta: number;              // Total time delta vs baseline
    stintDeltas: StintDelta[];       // Per-stint breakdown
    factorAttribution: FactorAttribution; // Why the delta exists
  }>;
}

interface FactorAttribution {
  pitLossDelta: number;        // Time lost/gained from pit stop count/timing
  tireDegradationDelta: number; // Time lost/gained from compound choice/wear
  energyDelta: number;         // Time from deployment policy differences
  weatherDelta: number;        // Time from weather-response differences
  interruptionDelta: number;   // Time from safety car/VSC response differences
  trafficDelta: number;        // Time from traffic/rejoin penalties
  residual: number;            // Unexplained remainder
}
```

### Pattern 3: Stint-Level Factor Decomposition
**What:** For each stint in a strategy comparison, decompose the per-stint time delta into contributing factors. This is the race-distance extension of the existing SensitivityWaterfall.
**When to use:** STRA-02 -- explaining why a strategy wins with stint-level detail.
**Example:**
```typescript
interface StintDelta {
  stintIndex: number;
  stintLabel: string;                // e.g., "Stint 1 (Medium, laps 1-18)"
  totalStintDelta: number;           // Total time delta for this stint
  factors: {
    paceBaseline: number;            // Time from baseline grip level
    degradation: number;             // Time from tire wear evolution
    thermal: number;                 // Time from tire temp in/out of window
    energy: number;                  // Time from energy deployment differences
    fuelMass: number;                // Time from fuel mass differences
    weather: number;                 // Time from weather/grip conditions
    traffic: number;                 // Time from rejoin/traffic penalties
  };
  compound: CompoundId;
  lapRange: [number, number];
}
```

### Pattern 4: Session Mode Dispatch
**What:** Extend the existing harness dispatch pattern (phase1-placeholder, qss-lap-model, stint-model) with session-mode-aware dispatchers for race, qualifying, and sprint.
**When to use:** PLAT-04 -- qualifying and sprint as distinct session modes.
**Example:**
```typescript
// Extend the discriminated union pattern
interface RaceSimulationSummary {
  harnessId: "race-simulation";
  sessionMode: "race" | "qualifying" | "sprint";
  // ... session-specific fields
}

// Qualifying is NOT a race-engine variant -- it has distinct semantics
interface QualifyingSessionConfig {
  sessionMode: "qualifying";
  sessions: {
    q1: { compound: CompoundId; laps: number; targetTime?: number };
    q2: { compound: CompoundId; laps: number; targetTime?: number };
    q3: { compound: CompoundId; laps: number; targetTime?: number };
  };
  tireInventory: TireInventoryState;
  ataEnabled: boolean;  // Alternative Tire Allocation rules
}
```

### Pattern 5: Intervention as Timeline Event with Branch Point
**What:** In-race interventions are typed events injected at specific laps that mutate subsequent race state. Each intervention creates a branch point for alternative comparison.
**When to use:** STRA-04 -- mode changes, pit timing responses, tire management.
**Example:**
```typescript
interface RaceIntervention {
  interventionId: string;
  triggerLap: number;
  type: "mode-change" | "pit-response" | "tire-management" | "strategy-override";
  params: Record<string, unknown>;  // Type-specific parameters
  description: string;              // Human-readable explanation
}

// Intervention at lap X creates a branch: "what if we hadn't intervened?"
// The branch uses Phase 3.1's run lineage (parentRunId, branchPoint)
```

### Anti-Patterns to Avoid

- **Building qualifying as a race-engine variant.** Qualifying is fundamentally different from racing -- push laps, elimination rounds, compound allocation constraints. Forcing it through the race-state engine creates artificial coupling. Use a separate session mode with its own harness.

- **Duplicating Phase 3.1 scope.** Phase 4 must NOT build its own race-state engine, pit events, or timeline artifacts. If Phase 3.1 is not complete, Phase 4 plans reference Phase 3.1 outputs as dependencies.

- **Creating engineer-role views as separate applications.** Role views are filtered projections over the same data, not independent dashboards. Shared concept modules are composed differently per role, not duplicated.

- **Migrating all existing SVG components in Phase 4.** Wrap existing components (SpeedProfileTrace, SoCTrace, TrackMap) in visx-compatible containers. Full migration can happen incrementally in later plans or phases.

- **Implying deterministic prediction from interruption scenarios.** Race interruptions (VSC, SC, red flag) are scenario exploration tools ("what happens IF"), not forecasting tools.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Chart scales and axes | Custom scale math and SVG axis rendering | @visx/scale + @visx/axis | d3 scale math is battle-tested; axis rendering handles edge cases (tick formatting, label collision) |
| Linked cursor across charts | Manual event coordination and state sync | @visx/xychart EventEmitterProvider | Built-in event pub/sub handles tooltip sync, cursor position sharing |
| Brush/range selection | Custom drag handlers and selection rectangles | @visx/brush | Brush handles edge cases: boundary clamping, resize handles, keyboard a11y |
| Responsive chart sizing | Manual ResizeObserver integration | @visx/responsive (ParentSize) | Handles debouncing, SSR, and container measurement |
| Waterfall cumulative math | Custom cumulative sum and bar positioning | Extend existing SensitivityWaterfall pattern with visx shapes | The cumulative-bar logic is already working; visx shapes just replace the raw SVG rects |
| F1 qualifying rules | Ad-hoc elimination logic | Typed qualifying rules config (CompoundAllocationRules) | Rules change between standard and ATA weekends; must be configurable, not hardcoded |

**Key insight:** The project already has working visualization patterns (waterfall, trace, comparison). visx replaces the *rendering* layer, not the *data* layer. Factor decomposition logic, comparison algorithms, and qualifying rules are custom domain logic that no library provides.

## Common Pitfalls

### Pitfall 1: React 19 + visx Peer Dependency Conflict
**What goes wrong:** `npm install` fails with peer dependency resolution errors because visx 3.12.0 specifies `react: "^16.0.0 || ^17.0.0 || ^18.0.0"`.
**Why it happens:** visx 3.13.0 (stable) has not been released yet; React 19 support is in alpha.
**How to avoid:** Install with `--legacy-peer-deps` flag, or use `@visx/*@3.13.0-alpha.0` if available. Test that tooltip and brush interactions work correctly after install.
**Warning signs:** `ERESOLVE unable to resolve dependency tree` during `npm install`.

### Pitfall 2: d3 + React Double-Rendering
**What goes wrong:** Using raw d3 alongside visx causes d3's DOM manipulation to conflict with React's virtual DOM, leading to stale or duplicated SVG elements.
**Why it happens:** d3 mutates the DOM directly; React expects to own DOM updates.
**How to avoid:** Use visx packages exclusively for rendering. Only use d3 for *math* (e.g., `d3-array` for statistical calculations) where visx doesn't provide an equivalent. Never use `d3.select()` in a React component.
**Warning signs:** SVG elements appearing twice, or chart state not updating on prop changes.

### Pitfall 3: Over-Scoped Strategy Comparison
**What goes wrong:** Trying to compare strategies at per-lap granularity for every subsystem creates overwhelming output that fails the pedagogical goal.
**Why it happens:** Engineers instinctively want maximum detail. But STRA-02 asks for explanation, not raw data dumps.
**How to avoid:** Default to stint-level factor decomposition. Allow drill-down to per-lap detail on demand. The overview must be readable at a glance.
**Warning signs:** Explanation views with more than 6-8 data rows per strategy comparison; users cannot quickly answer "which strategy is better and why."

### Pitfall 4: Qualifying Modeled as Race Variant
**What goes wrong:** Forcing qualifying through the race-state engine creates awkward abstractions (stints = sessions, pit events = compound changes) that don't map to qualifying semantics.
**Why it happens:** DRY instinct -- "reuse the race engine."
**How to avoid:** Model qualifying as a separate session mode. Qualifying involves push-lap optimization with elimination rounds and compound allocation constraints. These have different semantics from race stints: no tire degradation across laps (short sessions), no pit events, no fuel load evolution. Share subsystem models (tire grip, electrical) but use a different session orchestrator.
**Warning signs:** Qualifying config requires dummy pit events or zero-length stints to express session transitions.

### Pitfall 5: Visualization Migration as Big-Bang Rewrite
**What goes wrong:** Attempting to migrate all 7 existing SVG components to visx in a single plan exhausts context and creates regressions.
**Why it happens:** Desire for consistency.
**How to avoid:** Build new Phase 4 views in visx. Wrap existing Phase 1-3 views in visx-compatible containers (they still render as SVG, just inside visx responsive wrappers). Migrate existing views incrementally as they need enhancement (e.g., when adding linked cursors to SoCTrace).
**Warning signs:** Plan scope includes "migrate SpeedProfileTrace, SoCTrace, TrackMap, MetricTracePanel, etc." alongside new strategy views.

### Pitfall 6: Traffic/Rejoin Model Too Ambitious
**What goes wrong:** Building position-level race simulation with multi-car interaction when STRA-08 only requires "low-fidelity traffic/rejoin penalties."
**Why it happens:** F1 strategy is inherently multi-car; the temptation to model opponents is strong.
**How to avoid:** Model traffic as a time penalty function: `trafficPenalty(relativePosition, stintPhase) -> seconds/lap`. Undercut/overcut windows are expressed as time thresholds, not gap-to-opponent calculations. Full opponent modeling is explicitly v2.
**Warning signs:** Introducing a `Position` or `Opponent` type; simulating multiple cars in the same race engine.

## Code Examples

### Strategy Attribution Waterfall (extending existing pattern)

```typescript
// Source: Existing SensitivityWaterfall pattern + visx shapes
// The existing waterfall compares sector-level lap deltas.
// Phase 4 extends this to stint-level strategy factor deltas.

interface StrategyWaterfallBar {
  label: string;           // "Pit Loss", "Tire Deg", "Energy", "Weather", etc.
  delta: number;           // Seconds: positive = strategy is slower
  cumBefore: number;       // Cumulative delta before this factor
  cumAfter: number;        // Cumulative delta after this factor
  isTotal: boolean;        // Whether this is the summary bar
}

// Reuse the existing waterfall rendering logic, but feed it
// factor-level data from FactorAttribution instead of sector-level data.
// The visx migration replaces raw <rect> with <Bar> from @visx/shape.
```

### Qualifying Session Runner

```typescript
// Source: Domain knowledge from F1 2026 regulations research
interface QualifyingConfig {
  circuit: CircuitDocument;
  baseVehicle: VehicleParams;
  tireInventory: TireSetInventory;
  sessions: {
    q1: QSessionConfig;
    q2: QSessionConfig;
    q3: QSessionConfig;
  };
  ataRules: ATARules | null;     // Alternative Tire Allocation
  eliminationCounts: {
    q1Eliminated: number;         // 6 for 22-car grid (2026)
    q2Eliminated: number;         // 6
  };
}

interface QSessionConfig {
  compound: CompoundId;           // Which compound to use
  outLaps: number;                // Warm-up laps
  pushLaps: number;               // Timed push laps
  weatherConditions: WeatherTimeline;
}

interface ATARules {
  q1Compound: CompoundId;         // Hard in ATA events
  q2Compound: CompoundId;         // Medium in ATA events
  q3Compound: CompoundId;         // Soft in ATA events
}

// Qualifying result
interface QualifyingResult {
  sessions: QSessionResult[];     // Q1, Q2, Q3 results
  gridPosition: number;           // Final grid slot
  compoundsUsed: CompoundId[];    // For race tire allocation carry-forward
  tireSetsRemaining: TireSetInventory;
}
```

### Electrical Deploy Plan Schema (beyond aggressive/conservative)

```typescript
// Source: Audit finding #8 - deploy-plan semantics
// The current ElectricalPolicy has only deployFraction and harvestEfficiency.
// Phase 4 needs richer deploy plans that vary across a race.

interface DeployPlan {
  planId: string;
  label: string;                   // "Balanced", "Push Start", "Save & Sprint", etc.
  stintPolicies: StintDeployPolicy[];
  description: string;
}

interface StintDeployPolicy {
  stintIndex: number;
  phases: DeployPhase[];           // Phases within the stint
}

interface DeployPhase {
  fromLap: number;                 // Relative to stint start
  toLap: number;
  deployFraction: number;          // 0-1
  harvestEfficiency: number;       // 0-1
  maxDeployPower: number;          // Watts
}

// Example deploy plans:
// "Push Start":   Stint 1 high deploy for first 5 laps, then conserve
// "Save & Sprint": Low deploy for 80% of stint, high for final 20%
// "Balanced":     Constant moderate deploy throughout
```

### Traffic/Rejoin Penalty (Low-Fidelity Model)

```typescript
// Source: STRA-08 requirement - low-fidelity traffic penalties
// This is NOT multi-car simulation. It's a time penalty function.

interface TrafficPenaltyConfig {
  dirtyAirPenaltyPerLap: number;   // Seconds per lap in dirty air (~0.3-0.8s)
  undercutWindow: number;          // Laps of clean air before rival exits pit
  overcutWindow: number;           // Laps of tire advantage on fresh rubber
  rejoinPenalty: number;           // Seconds lost rejoining in traffic after pit
}

// Applied as a per-lap time penalty based on relative strategy phase:
// - Laps where this strategy is "in traffic" (after rival's stop, before ours) get penalty
// - Laps after our stop and before rival's get clean air (no penalty)
// This captures the undercut/overcut trade-off without simulating positions
```

## F1 Domain Knowledge (Verified)

### Qualifying Rules (2026)

| Parameter | Standard Weekend | Sprint Weekend | ATA Weekend |
|-----------|-----------------|----------------|-------------|
| Q1 duration | 18 min | 12 min (SQ1) | 18 min |
| Q2 duration | 15 min | 10 min (SQ2) | 15 min |
| Q3 duration | 13 min | 8 min (SQ3) | 13 min |
| Q1 eliminated | 6 (22-car grid) | 6 | 6 |
| Q2 eliminated | 6 | 6 | 6 |
| Tire sets total | 13 dry | 12 dry | 13 dry |
| Q3 bonus set | 1 extra soft | - | - |
| Compound constraint | Free choice | Sprint: Med Q1, Med Q2, Soft Q3 | Hard Q1, Med Q2, Soft Q3 |
| 107% rule | Yes | Yes | Yes |

**Source:** GPFans, F1Chronicle, WorldOfSpeed, Pirelli press releases.

### Tire Compounds (2026 Pirelli)

Five slick compounds: C1 (hardest) through C5 (softest). No C6. Pirelli selects three per event from C1-C5 range. Intermediate and wet compounds unchanged.

**Modeling implication:** The project already has 4 dry compounds (soft, medium, hard, intermediate). For 2026 accuracy, the compound system should use C1-C5 identifiers mapped to the existing compound parameter structure. However, for the reduced-order educational model, the existing soft/medium/hard/intermediate/wet taxonomy is sufficient and more legible.

### Pit Stop Time Loss Components

| Component | Typical Range | Circuit Dependence |
|-----------|---------------|-------------------|
| Pit-lane delta (entry + transit + exit) | 18-28 seconds | High (pit lane length, speed limit) |
| Stationary service time | 2.0-2.5 seconds (top teams) | None |
| Total pit loss vs staying on track | 20-30 seconds | High |

**Modeling implication:** The reduced-order model should parameterize pit loss as `pitEntryDelta + stationaryTime + pitExitDelta`, where the pit lane delta is a per-circuit parameter and service time is a global constant. Phase 3.1 already provides the pit event structure.

### Dirty Air / Traffic Penalties (2026 Regulations)

| Following Distance | Downforce Retained (2026 estimate) | Time Penalty (approx) |
|--------------------|-----------------------------------|-----------------------|
| 10m (1 car length) | ~80% | ~0.5-0.7 s/lap |
| 20m (2 car lengths) | ~90% | ~0.2-0.3 s/lap |
| 0.5s gap | ~82% (18% loss) | ~0.4-0.6 s/lap |

**Modeling implication:** The 2026 regulations significantly reduce dirty air effects vs 2024-2025. A low-fidelity model can use a simple penalty function: `penalty = k * (1 - downforceRetained)` where `k` scales with car speed. This is sufficient for STRA-08's educational purpose.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hand-rolled SVG charts | visx (d3 math + React rendering) | 2020 (visx release) | Eliminates d3/React DOM conflict; enables linked views |
| Single electrical policy (aggressive/conservative) | Stint-phased deploy plans | Phase 4 addition | Richer strategy space for energy management |
| Qualifying as race variant | Separate session mode | Phase 4 decision | Cleaner modeling of push-lap optimization |
| Per-lap factor analysis | Stint-level factor decomposition | Phase 4 decision | Right granularity for strategy explanation |
| Role-specific separate dashboards | Role as filtered projection on shared data | Pedagogy deliberation (2026-03-26) | Avoids content duplication; teaches perspective-taking |

**Deprecated/outdated:**
- **DRS (Drag Reduction System):** Replaced by active aero X-mode in 2026 regulations. The project already models 2026 Straight/Corner modes.
- **C6 tire compound:** Pirelli has abandoned the C6 for 2026. Only C1-C5 slick compounds.

## Open Questions

### Resolved

- **Q1: Which visualization library?** Use visx. It provides React-native d3 primitives, supports linked views via DataProvider/EventEmitterProvider, has an active React 19 compatibility path, and its modular package structure keeps bundle size small. Observable Plot lacks first-class React integration; Recharts lacks the customization needed for strategy timelines and waterfall attribution.

- **Q2: How to present multi-strategy comparison?** Two-level presentation: (1) Overview -- Gantt-style stint timeline showing compound bands, pit events, and total-time deltas for each strategy; (2) Drill-down -- linked charts showing stint-by-stint factor decomposition (waterfall) with per-lap traces (tire wear, energy, lap time) using shared cursor. This scales from 2 to 6+ strategies by stacking Gantt rows.

- **Q3: What factor decomposition granularity?** Stint-level as default. Each stint produces a FactorAttribution breakdown (pit loss, degradation, thermal, energy, weather, traffic, residual). Per-lap drill-down is available but not the default view. This matches the pedagogical goal: explain strategy outcomes without drowning in data.

- **Q4: How to model qualifying?** Separate session mode with its own harness. Qualifying has fundamentally different semantics (push laps, elimination rounds, compound allocation) that don't map to the race-state engine (stints, pit events, weather evolution). Share the underlying subsystem models (tire grip for push laps, electrical for energy management) but use a QualifyingSession orchestrator. Sprint qualifying uses the same structure with shorter durations.

- **Q5: What engineer-role learning paths belong in Phase 4?** Strategy engineer (primary) and race engineer (secondary) are the Phase 4 roles. Performance engineer was established in Phases 1-3. Role views are filtered projections: strategy engineer sees compound windows, pit timing, factor decomposition; race engineer sees interventions, mode changes, weather response. Each role view includes guiding questions drawn from real engineering practice, per the pedagogy deliberation.

- **Q6: How should in-race interventions interact with branching?** Interventions are typed timeline events (mode change, pit response, tire management, strategy override) injected at specific laps. Each intervention creates a branch point using Phase 3.1's run lineage. The UI presents diverging timelines from the branch point with cumulative delta visualization. The user specifies "intervene at lap X" and the system runs both the intervention and no-intervention branches.

- **Q7: How should sensitivity/perturbation workflows operate at race distance?** Batch mode: define a perturbation set (e.g., "weather shifts from dry to rain at laps 15, 20, 25"), queue all variants, compare results in the strategy comparison view. Interactive mode: change one parameter and rerun a single race. Both modes produce standard RaceTimeline artifacts that feed into the comparison engine. At race distance (~70 laps), a single run completes in well under 1 second (70 x single-lap QSS solve time), so interactive perturbation is feasible.

### Genuine Gaps

| Question | Criticality | Recommendation |
|----------|-------------|----------------|
| How should Phase 3.1's race timeline artifact be structured for efficient factor decomposition? | Critical | Defer to Phase 3.1 planning -- Phase 4 consumes whatever Phase 3.1 defines. Factor decomposition logic is Phase 4 responsibility, but the raw data must come from Phase 3.1 artifacts. |
| What is the exact visx React 19 stable release timeline? | Medium | Accept risk -- use alpha or --legacy-peer-deps. visx works with React 19; the constraint is just peerDependency metadata. |
| How should "probabilistic" interruption injection work (STRA-05)? | Medium | Defer detailed design to plan 04-01. Simplest approach: user specifies "SC probability per lap" and the system runs N scenarios with randomly-placed interruptions. This is distinct from Monte Carlo (v2) because it's small-N scenario exploration, not ensemble statistics. |

### Still Open

- Exact layout/UX for engineer-role switching -- whether it's a tab bar, a sidebar toggle, or integrated into the workspace shell. Low criticality; can be decided during plan 04-03 implementation.
- Whether the existing SensitivityWaterfall component should be refactored to share rendering logic with the new StrategyAttributionWaterfall, or whether they remain separate components with parallel structure. Low criticality; architectural convenience.

## Sources

### Primary (HIGH confidence)
- [visx GitHub](https://github.com/airbnb/visx) - Version (3.12.0 stable, 3.13.0-alpha.0 with React 19), package list, architecture
- [visx React 19 issue #1883](https://github.com/airbnb/visx/issues/1883) - React 19 support status (COMPLETED via PR #1968)
- [visx xychart npm](https://www.npmjs.com/package/@visx/xychart) - DataProvider/EventEmitterProvider for linked views
- [GPFans F1 2026 qualifying rules](https://www.gpfans.com/en/f1-news/1076792/f1-qualifying-rules/) - Session durations, elimination counts
- [Pirelli 2026 tire compounds](https://www.formula1.com/en/latest/article/pirelli-confirm-2026-tyre-compounds-as-f1-gets-set-for-a-new-era-of.6la0zKVsCYwWk9AAISz4Yw) - C1-C5 range, no C6
- [F1Chronicle qualifying formats](https://f1chronicle.com/f1-qualifying-formats-from-q1-to-q3/) - ATA rules, sprint qualifying compound constraints

### Secondary (MEDIUM confidence)
- [F1 pit stop time loss (F1Chronicle)](https://f1chronicle.com/how-does-formula-one-calculate-pit-stop-times/) - Pit-lane delta components and typical ranges
- [ScuderiaFans dirty air data](https://scuderiafans.com/ground-effect-regulations-failed-downforce-loss-now-at-35-as-2026-f1-reset-approaches/) - 2026 downforce retention estimates
- [The Race F1 aero losses data](https://www.the-race.com/formula-1/exclusive-new-data-f1-aero-losses-ruining-close-racing/) - Following-distance vs downforce retention
- [Querio 2026 React chart libraries](https://querio.ai/articles/top-react-chart-libraries-data-visualization) - visx ecosystem positioning

### Tertiary (LOW confidence)
- [Airbnb engineering blog on visx](https://medium.com/airbnb-engineering/introducing-visx-from-airbnb-fd6155ac4658) - Architecture philosophy (2020 article, patterns still apply)
- [Statathlon F1 pit strategy analysis](https://statathlon.com/analysis-of-the-pit-stop-strategy-in-f1/) - Strategy visualization patterns
- [MIA School of Race Engineering](https://www.schoolofraceengineering.co.uk/blog/post/15986/how-do-teams-analyse-f1-race-strategy/) - Real-world strategy analysis workflows

## Knowledge Applied

Checked knowledge base (`~/.gsd/knowledge/index.md`), no relevant lessons or spikes found for this phase's domain. The KB contains 207 signals but no distilled lessons or spike decisions. All entries are from other projects (zlibrary-mcp, get-shit-done-reflect, gsd-test-*) with no overlap to visualization, F1 modeling, or strategy simulation.

## Metadata

**Confidence breakdown:**
- Standard stack (visx): MEDIUM-HIGH -- visx is well-documented and battle-tested at Airbnb scale, but React 19 support is in alpha (PR merged, stable release pending). The library is the right architectural choice; the version constraint is the only risk.
- Architecture (strategy comparison, factor decomposition): HIGH -- patterns follow established analysis practices (multi-run comparison, factor attribution waterfall) and extend existing project patterns (SensitivityWaterfall, RunComparisonCard).
- Architecture (qualifying/sprint): MEDIUM -- qualifying rules are well-documented but the session mode abstraction is a design choice not validated by prior project patterns.
- Pitfalls: HIGH -- identified from direct codebase analysis (React 19 conflict, migration scope) and domain knowledge (qualifying semantics, traffic model scope).
- F1 domain (regulations, tire allocation, dirty air): HIGH -- verified against official F1 sources and Pirelli press releases for 2026 season.

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (visx release cadence may change React 19 status sooner)

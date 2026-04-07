# Strategic Gap Audit

Date: 2026-04-07
Project: F1 Modeling Lab
Auditor: Codex / gpt-5.4

## Executive Summary

The project is pointed at an interesting product, but the current roadmap still optimizes for adding modeled subsystems faster than it optimizes for building a credible race-analysis platform. The top strategic concerns, in impact order, are:

1. **Validation and data alignment are sequenced too late.** The roadmap puts data import in Phase 6 and calibration in Phase 7, after strategy, observers, and model-based control. That is backwards for a system whose value proposition is educational truthfulness. Without an earlier validation loop, Phase 4 and Phase 5 risk teaching simulator artifacts rather than F1 engineering.
2. **The core simulation architecture is still a single-lap solver wrapped in a lap loop, not a race engine.** `runStint()` explicitly wraps `solveLap()` and keeps state updates outside the inner solver (`packages/sim-core/src/stintModel/stintRunner.ts:4-10`). That is fine for Phase 3 stints, but it is not yet the right substrate for pit stops, safety cars, branching race state, or intervention timing.
3. **The scenario and run schemas are not ready for Phase 4+ workflows.** The scenario contract still has a single `stintConfig` and placeholder-only observer/controller/imported-data fields (`packages/domain/src/scenario/schema.ts:55-82`). The run record is generic enough to store anything, but too untyped to scale cleanly for branch lineage, experiment sets, multi-stint timelines, and observer outputs (`packages/domain/src/runs/schema.ts:47-74`).
4. **The 2026 electrical model is educationally useful but strategically too coarse.** The implementation is a single SoC pool with lap-level harvest/deploy and a scalar power boost (`packages/sim-core/src/stintModel/electricalModel.ts:120-218`). That is adequate for “aggressive vs conservative” intuition, but not for phase-accurate deployment strategy, control baselines, or explaining 2026-era power-unit behavior.
5. **The visualization stack is approaching a local maximum.** The current visuals package is a small set of hand-rolled SVG panels (`packages/visuals/src/traces/`, `packages/visuals/src/workspace/`, `packages/visuals/src/cards/`, `packages/visuals/src/inspectors/`). That works for Phase 2 traces, but it will not comfortably absorb strategy timelines, linked views, true-vs-measured-vs-estimated overlays, branch comparisons, and policy-intent inspection without a more deliberate interaction/data-vis architecture.

The short version: the project has built a plausible Phase 2/3 teaching demo, but the roadmap now needs an inserted “race-state + validation + typed artifacts” foundation before the next milestone grows into an overclaimed strategy/control product.

## Roadmap Ordering

### Overall judgment

Phases 1 through 3 are broadly in the right order. Phase 4 is overloaded. Phase 5 depends on an architectural layer that does not exist yet. Phases 6 and 7 are too late for a product that claims explainability and engineering education.

### What is ordered correctly

- **Phase 1 before Phase 2** is right. The project needed local-first scaffolding, scenario persistence, and reproducible runs first.
- **Phase 2 before Phase 3** is right. A reduced-order lap model had to exist before tire/electrical/environment coupling could be attached.
- **Phase 8 after validation** is directionally correct. Regulation and design trade studies should not become first-class until the sandbox is at least somewhat trustworthy.

### Where the ordering is weak or inverted

- **Data import and validation are too late.** The roadmap currently puts real-data integration in Phase 6 and calibration in Phase 7. That means strategy, observer, and control work are planned before the team has even established a reference corpus or a disciplined mismatch-reporting loop. Given the educational goal in `.planning/PROJECT.md` and `VAL-01` in `.planning/REQUIREMENTS.md`, some validation work needs to begin no later than Phase 3/4.
- **Phase 4 mixes three different kinds of work:** race-strategy simulation, learning/explanation surfaces, and observer methods. Those are related, but they are not the same dependency chain. Strategy needs a race-state engine. Explanations need stable typed artifacts. Observers need a sensor model. Bundling them together hides missing dependencies.
- **Phase 5 assumes a control-ready plant that does not exist.** `solveSpeedProfile()` takes a static `VehicleParams` object and returns a solved profile (`packages/sim-core/src/lapModel/forwardBackward.ts:106-221`). That is not yet a control-oriented state transition interface, so MPC and racing-line work do not merely depend on “Phase 4 complete”; they depend on an unplanned segment-level or time-step plant model.
- **Qualifying and sprint modes are planned inside the already-overloaded Phase 4.** They add session-format rules, tire-set allocation logic, and timing-window constraints, but do not help unlock the most urgent race-engine foundation.

### Implicit dependencies that should be documented but currently are not

- A **race-state/event model** for pit stops, interruptions, and intervention timing.
- **Branchable simulation state** for `VISU-05` and Phase 4 success criterion 9.
- A **typed artifact layer** for strategy timelines, observer outputs, event logs, and experiment metadata.
- A **tire-set inventory / session allocation model** for qualifying, sprint, and race weekends.
- A **segment-level or control-ready plant interface** before MPC and racing lines.
- A **reference-data baseline and mismatch workflow** before strong educational claims about strategy/control.
- A **visual interaction model** for linked brushing, shared cursors, overlays, and time scrubbing.

### Conclusion on ordering

The roadmap should not stay as a simple `3 -> 4 -> 5 -> 6 -> 7`. It needs at least one inserted foundation phase between current Phase 3 and Phase 4, and an earlier validation/data slice before control work becomes a milestone goal.

## Requirements Gaps

The requirements are broad and directionally good, but they are still too “capability-shaped” and not yet enough “workflow-shaped” for actual F1 engineering learning.

### Missing F1 concepts and use cases

- **Tire set inventory and age management.** Requirements discuss compounds and stint lengths, but not the actual operational problem of managing allocated sets across qualifying, sprint, and race.
- **Pit-lane loss and service model detail.** `STRA-01` and `STRA-02` mention pit timing and pit loss conceptually, but there is no explicit requirement for pit-entry/exit delta, stationary time, pit-window optimization, or service uncertainty.
- **Gap and track-position management.** A strategy engineer needs undercut/overcut windows, rejoin position risk, and traffic penalties. Traffic is mentioned in `MODL-04` and `SYSC-04`, but it is postponed too far to support meaningful race strategy.
- **Fuel targets and mode planning.** The model burns fuel in `runStint()` (`packages/sim-core/src/stintModel/stintRunner.ts:223-224`), but the requirements do not define fuel saving, lift-and-coast, or energy/fuel co-optimization workflows.
- **Thermal/cooling constraints outside tires.** Tires are covered. Power-unit, brake, and cooling constraints are not first-class in v1, even though they matter for 2026 electrical realism and strategy.
- **Uncertainty workflows.** Strategy engineering is probabilistic. The current requirements emphasize comparison and perturbation, but not Monte Carlo race evolution, confidence intervals, or scenario ensembles.
- **Opponent model / benchmark competitor abstraction.** Even a low-fidelity “reference competitor pace profile” would materially improve strategy education. Right now strategy is framed mostly as isolated single-car optimization.

### Missing user workflows by engineer role

- **Performance engineer:** needs lap decomposition by corner/sector, limiting factor attribution, tire temperature window reasoning, aero-mode sensitivity, and setup-style sweeps tied to specific pace losses.
- **Strategy engineer:** needs race timeline, stint plan editor, pit-window charts, interruption scenarios, traffic/rejoin estimates, and policy plans, not just ranked strategies.
- **Vehicle dynamics engineer:** needs balance/load-transfer interpretation that is localized in the lap, not collapsed to one lap-level effective grip scalar.
- **Power unit engineer:** needs deploy/harvest maps, SoC targets, power-limit reasons, and tradeoffs between attack/defense/conserve plans.
- **Controls/estimation learner:** needs explicit state, control, measurement, and constraint interfaces before “MPC” and “EKF” become meaningful educational surfaces.

### Recommendation

Add explicit requirements for:

- tire-set inventory/allocation
- pit-loss and pit-service modeling
- gap/track-position/traffic penalties
- experiment/batch/ensemble workflows
- branch lineage and mid-run restart
- typed observer/controller artifacts
- deploy-plan and mode-plan definition
- uncertainty reporting at the strategy-result level

## Architecture Scalability

### Current architecture

The current architecture is still “single-lap envelope solver plus outer lap loop.” `runStint()` resolves scalar vehicle modifiers, calls `solveLap()`, updates subsystem states, and records lap traces (`packages/sim-core/src/stintModel/stintRunner.ts:166-253`). `solveSpeedProfile()` itself assumes one static set of `VehicleParams` for the whole lap (`packages/sim-core/src/lapModel/forwardBackward.ts:106-221`). Active aero is reduced to a distance-weighted average for the lap (`packages/sim-core/src/stintModel/aeroModel.ts:5-9`, `:78-134`).

That architecture is a reasonable Phase 3 step, but it does not scale cleanly to the roadmap claims without an additional layer.

### Scale risk for Phase 4 strategy

It will struggle for multi-stint and pit-stop strategy because:

- `StintConfig` is single-stint by construction: one compound, one electrical policy, one weather override, one lap count (`packages/domain/src/scenario/schema.ts:55-61`).
- `StintState` has no concept of tire inventory, pit stop event, race gap, interruption state, or branch point (`packages/sim-core/src/stintModel/types.ts`).
- `LapTrace` captures only post-lap subsystem snapshots and effective scalar factors; it does not capture event timing, pit phase, mode changes, or causal annotations.
- `runStint()` assumes the only inter-lap transitions are tire/electrical/environment/fuel updates. Pit stops are not just another update function; they are discontinuities with service time, new tire state, and possibly new policy.

The likely failure mode is not performance. It is structural awkwardness: Phase 4 will bolt race logic around a data structure that was only designed for uninterrupted same-car same-policy stints.

### Scale risk for Phase 5 driver/control work

It will struggle much more for control and racing lines because:

- the solver exposes no control inputs over distance or time;
- the plant has no explicit state transition interface for optimizers or observers;
- the lap model is quasi-steady and globally solved, not rolled forward by chosen control actions;
- the aero and electrical models are collapsed to lap-level or zone-averaged modifiers rather than being applied where control decisions happen.

If Phase 5 proceeds without an inserted plant/interface refactor, the likely outcome is a “nominal MPC” that optimizes a surrogate disconnected from the main simulator, which would undermine the educational promise.

### Architectural commitments that will cause problems later

- **“The inner solver is never modified.”** That statement in `stintRunner.ts` (`:9-10`) is useful as a Phase 3 simplification, but dangerous if treated as a long-term rule.
- **Lap-level scalarization of subsystem effects.** `resolveEffectiveVehicle()` collapses tire, environment, load transfer, electrical, aero, and fuel effects into one `VehicleParams` object (`packages/sim-core/src/stintModel/stintRunner.ts:81-145`). That is convenient but erases where the effect happened.
- **Aero averaging across the lap.** `computeAverageAeroFactors()` converts per-point aero states into one average factor for the entire lap (`packages/sim-core/src/stintModel/aeroModel.ts:78-134`). That is specifically at odds with 2026 active-aero strategy and future control/racing-line work.
- **Stability clamps baked into behavior.** The 10% grip clamp and 0.4 floor (`packages/sim-core/src/stintModel/stintRunner.ts:104-117`) are pragmatic solver guards, but they will distort sensitivity studies and any gradient-like reasoning if not clearly surfaced.

### Recommendation

Introduce a new architectural layer:

- **Race engine:** sequences stints, pit events, interruptions, policies, and branch points.
- **Typed timeline/event artifacts:** so explanations, UI, and comparisons consume stable contracts.
- **Control-ready plant API:** a segment/time-step interface that can coexist with, not necessarily replace, the current envelope solver.

## Electrical Model Assessment

### What is good

For a first 2026 educational approximation, the model is defensible in one narrow sense: it reflects that the era is MGU-K centric and can show that deployment policy changes lap-time behavior. The regulation preset also correctly encodes the key headline numbers and the absence of MGU-H (`presets/regulations/fia-2026-baseline.json:24-31`).

### What is missing or too coarse

- **Deployment is lap-level, not location-level.** `deploy = prev.stateOfCharge * deployFraction` (`packages/sim-core/src/stintModel/electricalModel.ts:162-166`) means the model has no deploy map by straight, corner exit, attack zone, or defensive phase.
- **Power boost is a scalar added to peak power.** `computeElectricalPowerModifier()` simply scales peak power by SoC fraction and policy (`packages/sim-core/src/stintModel/electricalModel.ts:204-218`). That is not enough for 2026 drivability, traction, or aero/energy coupling.
- **Harvesting is based only on braking energy and wetness.** There is no explicit brake-by-wire, regen blending, rear-axle traction constraint, thermal derate, or pack power-limit behavior.
- **Policy initialization is ignored.** `initializeElectricalState()` explicitly discards the passed policy (`packages/sim-core/src/stintModel/electricalModel.ts:65-68`). That is a small code smell now and a bigger extensibility issue later.
- **The richer regulation preset is mostly not driving behavior.** `fuelEnergyFlowLimit`, `totalSystemPower`, and `mguHPresent` exist in the preset (`presets/regulations/fia-2026-baseline.json:29-48`), but search shows they are not meaningfully consumed by the current model.

### Is the single-energy-pool simplification adequate?

- **Adequate for Phase 3 pedagogy:** yes, if the claim is only “show basic attack vs conserve energy behavior.”
- **Not adequate for Phase 4 strategy:** not really. Strategy needs at least deploy-plan semantics, target SoC windows, and event response logic.
- **Not adequate for Phase 5 control:** no. A control baseline needs explicit states, constraints, and actuator semantics.

### Recommendation

Keep the single-pool model as the lowest-fidelity baseline, but add a next-step electrical contract with:

- battery SoC
- deploy power availability
- harvest headroom / recoverable braking window
- thermal or derate proxy
- location-aware deployment plan
- regulation-driven constraints loaded from presets rather than hardcoded constants

## Visualization Strategy

### Current state

The current visualization surface is coherent but still Phase 2-sized. `TrackMap.tsx`, `SpeedProfileTrace.tsx`, `SoCTrace.tsx`, `RunComparisonCard.tsx`, and `SensitivityWaterfall.tsx` are all custom React+SVG components with local scale math, local hover state, and duplicated styling logic. `TrackMap.tsx` alone performs its own bounds, scaling, sector matching, and legend rendering (`packages/visuals/src/workspace/TrackMap.tsx:124-216`).

That is perfectly reasonable for a small teaching surface. It is not yet a scalable interaction architecture.

### Why hand-rolled SVG will get strained in Phase 4+

- Strategy views want **timelines, events, linked selections, and multiple synchronized panes**.
- Observer views want **true/measured/estimated overlays** with shared cursors and uncertainty bands.
- Sensitivity workflows want **batch comparison, filtering, and matrix-style summaries**.
- Branching requires **lineage or scenario-tree UI**, not just one chart per artifact.
- Policy overlays will want **many traces at once**, which pushes React-managed SVG toward complexity and possibly performance pain.

### Recommendation

Use a hybrid strategy instead of abandoning the current work:

- Keep hand-rolled SVG for small semantic explainers and honest low-density charts.
- Introduce a shared visualization foundation for scales, legends, interactions, and linked state.
- Plan now for one denser timeline/overlay surface built on a more composable library stack.
- Treat “visual primitive” as a data contract and interaction pattern, not just a pretty panel.

### When and how racing lines should happen

Racing lines should **not** be treated as a Phase 2/3 visual backlog item. They should arrive only after there is a control/trajectory backend that can justify them. The current solver produces a speed envelope, not a true optimal path. The honest path is:

1. keep track-map and speed-profile views as the Phase 2/3 geometry surface;
2. add a trajectory/plant contract before MPC;
3. only then add racing-line visuals as a Phase 5 or 5.x deliverable.

## Educational Value

### Does the current system teach F1 engineering?

It teaches some of it. The current architecture is already decent for teaching reduced-order reasoning: parameter changes affect pace, subsystem states evolve, and the user can inspect traces rather than opaque scores. That is meaningful progress.

What it does **not** yet teach well is how F1 engineers actually work under competing objectives, uncertainty, and event timing. The system is still closer to “inspect a modeled run” than “perform race engineering or strategy analysis.”

### Can users explore what-if scenarios meaningfully?

Yes, but mostly in the narrow Phase 2/3 sense:

- vehicle parameter changes
- compound and weather differences
- simple energy policy comparison
- lap/stint-level trace inspection

Not yet in the richer sense of:

- branch at lap 14 and take the pit stop now
- compare undercut risk under three interruption probabilities
- inspect why the recommended response changed after a VSC
- compare controller intent against estimated hidden state

### Are role-based learning paths achievable?

- **Performance engineer:** achievable soon, if the project adds better lap decomposition and typed subsystem explanations.
- **Strategy engineer:** not yet. The race-event and gap-management layer is missing.
- **Vehicle dynamics engineer:** only partially. Current load-transfer and grip modeling are too collapsed to support a strong dynamics learning path.
- **Power unit engineer:** not with the present electrical abstraction.
- **Controls/estimation learner:** not until plant, sensor, and observer contracts are explicit.

### Recommendation

Turn role-based learning paths into actual product flows, not just view labels. Each role should have a defined question set, required artifacts, and comparison workflow.

## Data Model Extensibility

### Scenario schema

The scenario schema is still early-phase. The core issue is not that it is strict; strictness is good. The issue is that the current structured fields are too small and the future-facing fields are still placeholders.

Evidence:

- `stintConfig` only supports `totalLaps`, `tireCompoundId`, `electricalPolicyId`, and `weatherPresetOverride` (`packages/domain/src/scenario/schema.ts:55-61`).
- observer, controller, and import alignment are still placeholder shells (`packages/domain/src/scenario/schema.ts:79-81`).

That is not enough for:

- multi-stint race plans
- starting tire age / used-set status
- pit strategy candidates
- interruption injections
- driver style parameters
- observer settings
- experiment batches
- branch-from-state inputs

### Run records

The run record is append-only and snapshot-friendly, which is good. But the extensibility story is currently “put new things into `summaryMetrics` and `artifacts`,” and both are weakly typed (`packages/domain/src/runs/schema.ts:47-74`). That will scale badly for tooling, migrations, and UI composition.

### Will run records scale to multi-stint comparisons?

Not cleanly in their current form. They need, at minimum:

- `parentRunId` or branch lineage
- experiment/group ids
- typed event timeline artifacts
- typed stint summary artifacts
- comparison dimensions / tags
- scenario objective metadata
- selected policy/config snapshot separate from placeholders

### Recommendation

Add typed schemas for:

- race strategy plan
- pit events and interruptions
- driver profile
- observer config
- controller config
- run lineage / experiment membership
- structured artifacts for timelines, strategy tables, observer traces, and intervention logs

## Missing Features

The roadmap is missing several items that are strategically more important than some of the current later-phase ambitions.

### Missing roadmap items

- **Reference-data baseline and mismatch workbench before full telemetry alignment.**
- **Race-state engine and typed event timeline foundation.**
- **Branch lineage / experiment management.**
- **Batch sweeps and uncertainty/ensemble analysis.**
- **Tire-set inventory and weekend allocation logic.**
- **Pit-lane and service-time modeling.**
- **Low-fidelity traffic/rejoin model for strategy realism.**
- **Control-ready plant interface before MPC.**

### Low-hanging fruit

- Add `parentRunId` and experiment tags to run records.
- Add a typed timeline artifact before building strategy UI.
- Add tire age / used-set status to scenario config.
- Add batch-run support for weather/policy/compound sweeps.
- Add a simple reference-session import and mismatch panel before promising telemetry alignment as a late milestone.

## Gap Matrix

| Gap | Impact | Urgency | Phase Affected | Recommendation |
|---|---|---|---|---|
| Validation and reference data arrive too late | High | Immediate | 4, 5, 6, 7 | Pull a baseline data/validation slice forward into 3.x or 4.0 |
| No race-state engine between stint model and strategy milestone | High | Immediate | 4 | Insert a phase for race events, pit stops, interruptions, and timeline artifacts |
| Scenario schema still single-stint and placeholder-heavy | High | Immediate | 4, 5, 6 | Expand scenario contracts with typed strategy, driver, observer, and import configs |
| Run records lack lineage and typed higher-level artifacts | High | Near-term | 4, 5, 6 | Add parent/group metadata and typed artifact schemas |
| Electrical model is too coarse for 2026 strategy/control | High | Near-term | 4, 5 | Keep scalar baseline, add location-aware deploy-plan and constraint proxies |
| Current solver is not control-ready | High | Near-term | 5 | Add a segment/time-step plant interface before MPC/racing-line work |
| Visualization stack lacks linked-view interaction architecture | Medium | Near-term | 4, 5 | Introduce shared interaction/scales layer and one denser timeline surface |
| Requirements under-specify real engineer workflows | Medium | Near-term | 4, 5, 6 | Add workflow-shaped requirements per role |
| Pit/tire inventory/traffic are postponed too far | Medium | Near-term | 4 | Move low-fidelity operational strategy elements into early Phase 4 |
| Regulation preset is richer than the consuming models | Medium | Medium | 3, 4 | Stop hardcoding key electrical limits and consume preset values systematically |

## Proposed Roadmap Amendments

### 1. Insert a new Phase 3.1 before current Phase 4

**Phase 3.1: Race State, Typed Artifacts, and Branchable Runs**

Scope:

- multi-stint scenario contract
- pit event and interruption model
- typed race timeline artifact
- run lineage / parent-child branching
- experiment grouping metadata
- tire-set inventory foundation

Suggested plans: **4 plans**

- 03.1-01: Extend scenario and run schemas for race plans, lineage, and typed artifacts
- 03.1-02: Implement race-state engine that sequences stints, pit events, and interruptions
- 03.1-03: Persist typed timeline/stint artifacts and batch comparison metadata
- 03.1-04: Build minimal branch-from-state and experiment management workflow

### 2. Split current Phase 4 into two conceptual slices

**Phase 4:** Strategy engine and race analysis

- race-distance simulation
- pit strategy
- interruptions
- qualifying/sprint only if they do not block race analysis
- low-fidelity traffic/rejoin model

Suggested plans: **5 plans** instead of 6 broad ones.

**Phase 4.1 or Phase 5:** Explanations, role views, and observers

- explanation views
- engineer-role learning paths
- synthetic sensor model
- observer comparison surfaces
- timeline scrubbing on top of typed race artifacts

This reduces dependency confusion. Strategy needs race state first. Observer work can follow once artifact and timeline contracts are stable.

### 3. Pull data import and validation earlier

Amend sequencing so that an **initial data/validation slice** lands before control work.

Suggested change:

- Add a Phase 4.x plan for “reference session import + mismatch analysis.”
- Reframe current Phase 6 as “broader telemetry alignment and external adapters,” not the first moment real data enters the system.
- Reframe Phase 7 as “advanced calibration and confidence workbench,” not the beginning of validation.

### 4. Make Phase 5 depend on a new control-ready plant plan

Before MPC and racing lines, add a dedicated plan:

- define state vector, control vector, measurement vector, constraints, and transition step
- implement a segment/time-step plant API that can coexist with the current envelope solver
- define the trajectory artifact contract

Suggested Phase 5 plan count: **6 plans** instead of 5.

### 5. Amend requirements alongside the roadmap

Add or refine requirements for:

- pit-lane/service-time modeling
- tire-set inventory/allocation
- branch lineage and experiment management
- uncertainty/ensemble strategy analysis
- low-fidelity traffic/rejoin penalties
- typed observer/controller config
- deploy-plan semantics and power-unit explanation

## Final Assessment

The project is building something worth building, but it is at the point where strategic sequencing matters more than adding another subsystem checkbox. The central gap is not “more physics.” It is that the product now needs a stronger middle layer between subsystem simulation and the later ambitions of strategy, estimation, control, and education.

If the roadmap is amended now, the existing Phase 1-3 work becomes a solid foundation. If it is not, the likely failure mode is an impressive-looking but structurally fragile milestone where strategy, observer, and control features exist in name while leaning on abstractions that were only meant for uninterrupted single-stint analysis.

# Phase 2: Reduced-Order Lap Model - Context

**Gathered:** 2026-03-20
**Status:** Ready for research

<domain>
## Phase Boundary

Deliver the first transparent lap model with editable vehicle and circuit parameters. The user must be able to choose a circuit, regulation preset, and baseline car parameters before a run; the system must produce a lap estimate with visible intermediate factors; parameter changes must show which parts of the model caused the output shift; and where justified, the system can visualize trajectories or track-map context without implying unsupported fidelity.

This phase replaces the Phase 1 placeholder harness with a real reduced-order model. It does NOT add tire degradation, electrical dynamics, weather coupling, strategy simulation, driver-style parameterization, or data import — those belong to later phases.

</domain>

<assumptions>
## Working Model & Assumptions

### Lap model class
The likely model is a quasi-steady-state or sector-based point-mass approach: divide the circuit into segments (straights, corners of known curvature), compute local speed limits from grip/downforce/power, integrate sector times to produce a lap time. This is a working assumption — research must evaluate alternatives (pure point-mass, energy-based, curvature-continuous) and confirm which class best serves Phase 2's transparency and sensitivity-analysis requirements.

### Vehicle parameter surface
The editable vehicle parameters likely include at minimum: mass, aerodynamic drag coefficient, downforce coefficient (or a simplified CL/CD proxy), peak power, and a simplified tire grip coefficient. Research should determine whether gear ratios, power curves, or center-of-gravity height belong in Phase 2 or are premature before tire and electrical dynamics exist.

### Circuit representation
Circuits likely need a structured representation of ordered segments with length, curvature (or corner radius), elevation change, and surface type. Research should evaluate whether a minimal sector-based format is sufficient or whether a denser curvature profile is needed for honest trajectory output.

### Intermediate factors
The model should expose per-sector or per-segment intermediate state: corner entry/exit speeds, straight-line terminal speeds, braking distances, time contributions. Research should determine the right granularity — too coarse loses learning value, too fine implies unsupported fidelity.

</assumptions>

<constraints>
## Derived Constraints

### From Phase 1 codebase

1. **sim-core contract pattern**: `packages/sim-core/src/contracts.ts` defines `SimulationHarness`, `SimulationRunRequest`, and `SimulationRunSummary`. The `SimulationRunSummary` type is currently narrowly typed to `harnessId: "phase1-placeholder"` and `modelVersion: "phase1-placeholder/v1"`. Phase 2 must generalize these types to support the new lap model while preserving the Phase 1 placeholder for backward compatibility.

2. **Scenario schema**: `packages/domain/src/scenario/schema.ts` already includes circuit selection (`circuitId`, `name`, `configuration`), regulation/session/weather preset references, driver profile placeholder, seed, and reserved extension points for observer/controller/import. Phase 2 extends this — it does NOT redesign it.

3. **Preset values are loosely typed**: Regulation presets use `z.record(string, unknown)` for their `values` field. The existing `fia-2026-baseline.json` carries qualitative placeholders. Phase 2 must decide whether to add typed regulation value schemas or keep the loose record and validate at the model layer.

4. **Visual primitives available**: Phase 1 established `MetricTracePanel`, `RunComparisonCard`, `AssumptionPanel`, `TrackContextPlaceholder`, and `WorkbenchShell` in `packages/visuals`. Phase 2 visualization should extend these rather than creating parallel component systems.

5. **TrackContextPlaceholder**: Already exists as an honesty-aware placeholder surface. Phase 2 is the phase where this can be upgraded to a real track visualization — but only if the model actually produces data with meaningful spatial semantics.

6. **Workspace orchestration**: `useWorkspace` in `apps/web` already handles scenario editing, preset selection, save/load, and run creation. Phase 2 extends this flow with vehicle parameter editing and richer run output display.

7. **File-backed persistence**: Scenarios and runs persist as JSON under `workspace-data/`. Phase 2 run records will be larger (intermediate state, per-sector data) but must use the same append-only pattern.

8. **Browser-safe domain boundary**: `packages/domain` has a `node/preset-catalog` subpath for filesystem operations. Any circuit-data loading that touches the filesystem must follow this pattern.

### From requirements

- **PLAT-02**: User can choose circuit, regulation preset, weather preset, and session scenario before running. Phase 1 already provides preset selection UI; Phase 2 adds circuit choice and car parameter editing.
- **MODL-01**: Reduced-order lap and stint model with explicit inputs for mass, drag, downforce proxy, tire grip, and power-unit behavior. Phase 2 delivers the single-lap version; stint extension is Phase 3+.
- **VISU-02**: Trajectories, track-map views, or racing-line style outputs when the model supports them. Phase 2 must determine what the model honestly supports and visualize accordingly.

### From Phase 1 decisions

- Reduced-order, explainable models come before high-fidelity simulation.
- Visualization is a progressive, model-coupled learning surface — not disconnected polish.
- Encode honesty constraints directly: do not imply precision the model does not justify.
- The threshold for honest racing-line visualization was explicitly deferred to Phase 2 (from STATE.md blockers).

</constraints>

<questions>
## Open Questions

### 1. What reduced-order lap model class best serves transparency and sensitivity analysis?
- **Type:** material
- **Why it matters:** This is the core modeling decision of the phase. A point-mass approach is simple but may not produce meaningful sector-by-sector intermediate state. A curvature-continuous model produces richer output but is harder to explain. The choice directly determines what intermediate factors are available and what visualizations are honest.
- **Downstream decision:** Vehicle parameter surface, circuit representation format, visualization fidelity threshold, and how sensitivity analysis presents causal attribution.
- **Reversibility:** Medium — the model architecture shapes all Phase 2 plans and feeds into Phase 3 tire/electrical coupling.
- **Research should:** Survey reduced-order lap model approaches (point-mass, quasi-steady-state, sector-based, energy-based), evaluate each against the transparency and intermediate-factor requirements, and recommend one with explicit fidelity boundaries.

### 2. What circuit representation format supports the chosen model and honest visualization?
- **Type:** material
- **Why it matters:** The circuit format determines whether the model can produce per-corner or per-sector state, whether track-map visualization has spatial grounding, and whether circuits can be extended later for trajectory or racing-line display.
- **Downstream decision:** Whether `TrackContextPlaceholder` can be upgraded to a real track map, how circuits are stored and loaded, and what circuit metadata Phase 3+ can rely on.
- **Reversibility:** Medium — circuit format is consumed by the model and visualization layers, so changing it later requires migration.
- **Research should:** Evaluate minimum circuit data requirements for the recommended model class. Determine whether a lightweight sector list is sufficient or whether curvature profiles and spatial coordinates are needed. Consider what public circuit data is realistically available.

### 3. When is track-map or racing-line visualization honest for this model?
- **Type:** final
- **Why it matters:** Success criterion 4 requires trajectory or track-map visualization "where justified by the model." Phase 1 deferred this honesty threshold to Phase 2. If the model only produces sector times, a racing-line display would be dishonest. If it produces speed-vs-distance profiles, a track-map overlay may be warranted.
- **Downstream decision:** Whether to upgrade `TrackContextPlaceholder` or keep it as a placeholder with richer annotation. Whether to build a new track visualization component.
- **Reversibility:** High — visualization can always be added later if the model supports it.
- **Research should:** Determine what spatial output the recommended model class actually produces. Define explicit criteria for when a track visualization is honest vs. misleading. Propose what Phase 2 should show and what should remain labeled as placeholder.

### 4. How should sensitivity analysis present causal attribution?
- **Type:** formal
- **Why it matters:** Success criterion 3 requires showing "which parts of the model caused the output shift." This could be done through parameter sweeps with delta annotations, Jacobian-style local sensitivities, or comparative waterfall charts. The approach should teach the user about model structure, not just show numbers.
- **Downstream decision:** Whether sensitivity output is a separate view or integrated into the run comparison flow. What visual primitives are needed beyond existing `MetricTracePanel` and `RunComparisonCard`.
- **Reversibility:** High — visualization approach can be iterated.
- **Research should:** Evaluate sensitivity presentation patterns for engineering models. Recommend an approach that is both informative and honest about model limitations.

### 5. How should the sim-core contract generalize beyond the Phase 1 placeholder?
- **Type:** formal
- **Why it matters:** `SimulationRunRequest` and `SimulationRunSummary` are currently narrowly typed for the placeholder. Phase 2 needs a real model with richer inputs (vehicle params, circuit data) and richer outputs (per-sector state, intermediate factors). The generalization must preserve backward compatibility and support Phase 3+ model extensions.
- **Downstream decision:** Whether to use a discriminated union (harnessId-based), a generic type parameter, or a versioned contract family. Affects how run records store and compare outputs across model versions.
- **Reversibility:** Medium — this contract is consumed by the API, browser, and run-record persistence.
- **Research should:** Evaluate generalization strategies for the sim-core contract that keep the Phase 1 placeholder working while supporting richer Phase 2+ models.

</questions>

<guardrails>
## Epistemic Guardrails

1. **Model fidelity boundaries must be documented alongside outputs.** Every intermediate factor or visualization produced by the lap model must carry explicit notes about what assumptions it depends on and where it is likely wrong. Do not produce clean numerical output that implies calibrated accuracy.

2. **No trajectory or racing-line display without spatial model support.** If the chosen model class does not produce position-vs-distance or curvature-resolved speed data, do not render a track map with racing lines. A sector-time bar chart is honest; a fake racing line on a track outline is not.

3. **Sensitivity analysis must attribute to model structure, not just show deltas.** Changing mass and showing "lap time changed by 0.3s" is not sufficient. The output should show which sectors or which physical mechanisms (cornering speed, braking distance, straight-line speed) were affected and why.

4. **The Phase 1 placeholder must remain functional.** Phase 2 generalizes the sim-core contract, but the Phase 1 placeholder harness should still work. Runs created with the placeholder should remain loadable and comparable.

5. **Vehicle parameters must be labeled with provenance.** Editable car parameters should indicate whether they come from regulation constraints, engineering estimates, or user overrides. Do not present uncalibrated defaults as authoritative.

6. **Circuit data provenance matters.** Any circuit definitions shipped with the app must document their source and accuracy. A layout derived from public track maps is different from a surveyed FIA circuit file.

</guardrails>

<specifics>
## Specific Ideas

- The existing `MetricTracePanel` could serve as the primary visualization for per-sector intermediate state (speed profile, time contributions).
- `RunComparisonCard` is already designed for side-by-side comparison — Phase 2 should feed it real model deltas rather than placeholder scores.
- A "waterfall" or "bridge" chart showing how each parameter change contributes to the total lap time delta would be a strong sensitivity visualization.
- The `AssumptionPanel` should carry model-level assumptions (e.g., "no tire degradation in this model," "constant grip coefficient assumed") alongside run output.

</specifics>

<deferred>
## Deferred Ideas

- Tire degradation and temperature evolution — Phase 3
- Electrical energy state, harvesting, and deployment effects — Phase 3
- Weather and environment coupling — Phase 3
- Multi-lap stint simulation — Phase 3+
- Race-distance strategy comparison — Phase 4
- Driver-style parameterization beyond a single profile — Phase 5
- Real telemetry overlay against model output — Phase 6
- Model calibration and confidence scoring — Phase 7
- Higher-fidelity aero or suspension submodels — v2

</deferred>

---

*Phase: 02-reduced-order-lap-model*
*Context gathered: 2026-03-20*

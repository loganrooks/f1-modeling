# Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics - Context

**Gathered:** 2026-04-02
**Status:** Ready for research
**Mode:** Auto-generated (exploratory, --auto)

<domain>
## Phase Boundary

Add the core non-ideal dynamics that drive real race behavior: tire models with compound differentiation, degradation, and thermal effects; reduced-order electrical subsystem with energy harvesting, deployment, and limiting logic; dynamic weather and environment coupling that evolves within a session; aero-mode switching from regulation presets; and basic lateral force balance with load transfer. This transforms the simulator from a single-lap physics model into a multi-lap system where subsystem state evolves and affects strategy.

This phase does NOT add race-distance strategy comparison, pit-stop optimization, qualifying/sprint modes, observer/estimation layers, driver-style parameterization, data import, or calibration. Those belong to Phases 4-7. The output of Phase 3 is a multi-lap simulation where the user can see how tire wear, electrical energy, and weather change lap-to-lap and how these subsystems interact.

</domain>

<assumptions>
## Working Model & Assumptions

### Multi-lap simulation approach
The most likely architecture wraps the existing QSS forward-backward speed profile solver in a multi-lap runner. Each lap calls the existing solver with updated parameters (tire grip modified by wear/temperature, power limited by battery SoC, drag/downforce modified by aero mode). State updates happen at lap boundaries. This preserves Phase 2's solver as the inner loop and avoids rewriting the core physics. Research must validate whether per-lap state updates produce meaningful stint behavior or whether finer-grained (per-sector or per-point) state evolution is needed for any subsystem.

### Tire model class
A phenomenological tire model is appropriate for this educational platform — grip as a function of compound identity, wear state, and thermal state, with cliff thresholds per compound. Not a full Pacejka, Brush, or thermomechanical model — those are v2 fidelity. The model should be transparent enough that a user can see why cliff behavior occurs and how compound choice affects pace evolution. Research should survey published reduced-order tire models used in strategy tools and educational contexts.

### Electrical system as lap-level energy balance
A reduced-order electrical model tracks state-of-charge across laps. Each lap, the solver depletes energy during deployment (acceleration, straight-line boost) and harvests during braking and off-throttle phases. Deployment policy is parameterized (e.g., deploy fraction per lap, zone allocation). Battery limits constrain peak deployment power. The MGU-K/MGU-H distinction may or may not be needed at this abstraction level — research should determine whether collapsing them into a single energy flow preserves educational value or loses important 2026-era behavior.

### Environment coupling as grip-modifying layer
Environment state (track temperature, surface wetness, rubber evolution) evolves per-lap and modifies effective tire grip through multiplicative factors. This is mechanically: effective_grip = base_compound_grip x thermal_window_factor x surface_wetness_factor x rubber_evolution_factor. Weather transitions (rain onset, drying) happen at the lap timescale as interpolated state changes rather than step functions. Research should evaluate whether this multiplicative approach captures meaningful weather dynamics.

### Aero-mode switching as per-segment discrete state
DRS and 2026 active-aero are discrete states that modify drag and downforce within defined circuit zones. The speed profile solver reads aero state per-point from circuit/regulation configuration. DRS detection zones are defined as distance ranges in the circuit representation. Research should determine how many aero modes the 2026 regulations define and how to represent them in the existing preset structure.

### Lateral force balance via load-dependent grip
The existing friction ellipse already couples lateral and longitudinal forces. Phase 3 extends this with load-dependent grip: tire load sensitivity means front/rear loads shift under braking and cornering (simple weight transfer: delta_F = m x a x h / track_width), making corner speed dependent on load distribution. Research should evaluate whether a 2-axle model is sufficient or whether per-corner 4-wheel resolution adds educational value at this stage.

</assumptions>

<constraints>
## Derived Constraints

### From Phase 2 codebase

1. **Speed profile solver architecture** (`packages/sim-core/src/lapModel/forwardBackward.ts`): Two-pass forward-backward global envelope. Cornering speed limit formula includes downforce effect: `v_max = sqrt(mu * g / (curvature - mu * kz / m))`. The `mu` (gripCoefficient) and `kz` (downforceFactor) are currently constants — Phase 3 must make them state-dependent without breaking the solver convergence (up to 3 closure iterations, 0.1 m/s threshold).

2. **Friction ellipse** (`packages/sim-core/src/lapModel/frictionEllipse.ts`): Already couples lateral and longitudinal forces. Available longitudinal grip: `ax_grip = mu * (g + kz*v^2/m) * sqrt(1 - (ay/ay_max)^2) - drag`. Phase 3 extends `mu` to be tire-state-dependent and can add load-sensitivity terms.

3. **Speed regime classification** (`forwardBackward.ts` lines ~163-189): Labels each point as grip/power/braking/cornering. Phase 3 should add new regimes or sub-labels (e.g., energy-limited, tire-cliff-limited) without breaking existing regime consumers.

4. **VehicleParams interface** (`packages/sim-core/src/lapModel/types.ts`): Currently 5 fields: mass, dragFactor, downforceFactor, peakPower, gripCoefficient. Phase 3 can extend with optional fields (tire state, electrical state, aero mode) while keeping existing fields required for backward compatibility.

5. **Harness discriminated union** (`packages/sim-core/src/contracts.ts`): `SimulationRunSummary = LapModelSummary | Phase1PlaceholderSummary`. Phase 3 adds a new variant (e.g., StintModelSummary) to this union. The harnessId-based dispatch in `runService.ts` already supports this pattern.

6. **Regulation preset values** (`presets/regulations/fia-2026-baseline.json`): Contains qualitative placeholders: `activeAeroModeSwitching: true`, `electricalEnergyContribution: "increased-relative-to-prior-era"`. Phase 3 replaces these with quantitative values (energy limits in joules, deployment power limits, aero-mode drag/downforce deltas).

7. **Weather preset values** (`presets/weather/dry-baseline.json`, `light-rain-placeholder.json`): Currently carry surfaceCondition, rainfall, ambientTemperatureC, trackTemperatureC. Phase 3 extends with dynamic evolution parameters (grip evolution rate, rain intensity, drying rate) and adds new weather presets.

8. **Run artifact system** (`packages/domain/src/runs/schema.ts`): Supports multiple named artifacts per run. Current artifact type is `"qss-speed-profile"`. Phase 3 adds: tire-degradation-trace, electrical-state-trace, weather-evolution-trace.

9. **SpeedProfilePoint interface** (`types.ts`): Currently has speed, distance, regime, curvature, lateralG, longitudinalG, timeIncrement. New optional fields (tireTemp, compound, energyState, aeroMode) can be added without breaking existing visualization consumers.

10. **Visual components** (`packages/visuals/src/traces/SpeedProfileTrace.tsx`): Speed vs distance chart colored by regime. Phase 3 can add new trace types (tire degradation over laps, energy SoC over laps) following the same hand-rolled SVG pattern established in Phase 2.

11. **Scenario schema extension points** (`packages/domain/src/scenario/schema.ts`): Has `observerConfigPlaceholder`, `controllerConfigPlaceholder`, `importedDataAlignmentPlaceholder` as reserved extension points. Phase 3 may need new scenario-level fields for tire strategy and electrical mode, but should NOT touch the observer/controller placeholders (those are for Phases 4-5).

12. **Python sidecar pattern** (established in Phase 2.1): If Phase 3 needs Python-based computation (e.g., for tire model fitting or published model implementations), the sidecar pipeline pattern is already established. However, the core multi-lap simulation should stay in TypeScript within sim-core for consistency and browser-proximity.

### From requirements

- **MODL-02**: Tire wear and temperature across laps and stints, affecting pace.
- **MODL-03**: Reduced-order electrical energy, harvesting, deployment, limiting logic affecting lap time and straight-line performance.
- **MODL-04**: Non-ideal conditions including ambient/track temperature, rain/wetness, dynamic weather evolution within a session.
- **ENVR-01**: Car-environment interaction explicitly modeled — grip evolution, surface state, ambient effects.
- **ENVR-02**: Environment coupled into subsystem behavior, not isolated presets.
- **ELEC-01**: Electrical subsystem state as inspectable outputs (not hidden scalar).
- **ELEC-02**: Electrical state linked to strategy choices and driver-policy constraints.

### From Phase 1 and Phase 2 decisions

- Reduced-order, explainable models before high-fidelity simulation.
- Visualization is a progressive, model-coupled learning surface.
- Honesty constraints: label placeholder outputs, don't imply unsupported fidelity.
- Hand-rolled SVG for all visualizations (no charting library).
- Run records carry preset snapshots for reproducibility.
- Provenance tracking on all assumptions (sourceType: documented-fact | engineering-inference | placeholder).
- Phase 2 explicitly deferred lateral force balance and aero-mode switching to Phase 3.
- Educational pedagogy deliberation: performance engineer as first learning role — Phase 3's subsystem interactions are core to this role.

### From success criteria (ROADMAP.md)

1. Three dry + one wet compound, distinct degradation curves, thermal operating windows, cliff-effect behavior. Wear and temperature evolve over laps.
2. Electrical energy affects performance. Compare at least two energy-deployment policies (e.g., aggressive deploy vs. conservation).
3. Weather evolves within a session — dry↔wet transitions, track temperature changes, rubber evolution. Affects strategy dynamically.
4. Electrical state visibly linked to strategy windows and policy constraints.
5. Environment as coupling that influences multiple subsystems.
6. Aero-mode switching from regulation presets (DRS, 2026 active-aero).
7. Basic lateral force balance and load transfer — corner speed depends on more than single grip scalar.

</constraints>

<questions>
## Open Questions

### 1. What multi-lap simulation architecture best wraps the existing single-lap solver?
- **Type:** material
- **Why it matters:** This is the core architectural decision. Phase 2's solver computes one lap. Phase 3 needs N-lap state evolution (tire wear, energy SoC, weather changes). The choice between a loop-over-solver, a new integrated solver, or a state-machine-driven approach determines how all subsystems connect.
- **Downstream decision:** How the new harness is structured, what output format looks like, and how subsystems communicate state changes.
- **Reversibility:** Medium — the multi-lap runner is the spine of Phase 3.
- **Research should:** Evaluate whether a thin wrapper (call solveLap N times with modified params) produces physically plausible stint behavior, or whether any subsystem requires finer-grained coupling. Survey how strategy simulators and lap-time tools handle multi-lap state evolution.

### 2. What reduced-order tire model captures degradation, thermal window, and cliff behavior transparently?
- **Type:** material
- **Why it matters:** The tire model is the largest single subsystem addition. The mathematical form determines what the user can inspect, what sensitivity analysis reveals, and how compounds differentiate. Too simple loses educational value; too complex becomes opaque.
- **Downstream decision:** Number of state variables per tire, per-lap vs. per-sector update granularity, what visualization traces are meaningful.
- **Reversibility:** Medium — tire model feeds into all cross-subsystem interactions.
- **Research should:** Survey published reduced-order tire models used in strategy tools (e.g., Bain-type degradation, parabolic wear curves, empirical thermal windows). Evaluate 2-3 candidate models against transparency, educational inspectability, and the success criteria (3 dry + 1 wet, degradation curves, thermal windows, cliff effects).

### 3. What electrical model granularity serves reduced-order education for 2026-era cars?
- **Type:** material
- **Why it matters:** 2026 regulations significantly increase electrical energy contribution. The model must be detailed enough to show meaningful deployment policy tradeoffs but simple enough to be inspectable. The MGU-K/MGU-H distinction, battery SoC dynamics, and deployment limiting are interconnected choices.
- **Downstream decision:** How deployment policies are parameterized, what state variables are tracked, whether energy constraints appear per-lap or per-segment in the speed profile.
- **Reversibility:** Medium — electrical model is consumed by visualization and policy comparison logic.
- **Research should:** Review 2026 FIA power unit technical regulations for energy limits, deployment power caps, and harvesting constraints. Evaluate whether a single-energy-pool model (SoC only) or a split-source model (MGU-K + MGU-H + battery) better serves educational transparency. Survey published reduced-order electrical models for strategy tools.

### 4. How should weather transitions and grip evolution be modeled at the lap timescale?
- **Type:** formal
- **Why it matters:** MODL-04 requires weather evolution within a session — not just static conditions. The transition model (rain onset timing, drying rate, rubber buildup) determines whether weather strategy decisions are meaningful or trivial.
- **Downstream decision:** Weather preset structure (static initial conditions vs. evolution timeline), grip modification mechanism, whether multiple runs with different weather sequences are meaningfully different.
- **Reversibility:** High — weather model is a modifier layer, not structural.
- **Research should:** Evaluate how to parameterize weather evolution (timeline of events? probabilistic rain onset? linear drying?). Survey how existing F1 strategy tools model track rubber evolution and grip buildup over a session.

### 5. How should DRS zones and 2026 aero modes be defined in the circuit/regulation data?
- **Type:** formal
- **Why it matters:** Aero-mode switching requires knowing WHERE on the circuit states change and WHAT the drag/downforce deltas are. This is partially a data format question (circuit metadata) and partially a regulation preset question.
- **Downstream decision:** Whether DRS zones are circuit data or regulation data, how the speed profile solver reads aero state, what happens when regulation presets define different aero modes.
- **Reversibility:** High — zone definitions are configuration, not structural.
- **Research should:** Determine where DRS zones are best stored (circuit metadata vs. regulation-circuit joint config). Review 2026 active-aero specifications for number of modes and mechanical effects. Evaluate how aero state transitions integrate with the forward-backward solver.

### 6. What lateral force balance model is appropriate at this fidelity level?
- **Type:** formal
- **Why it matters:** Success criterion 7 requires corner speed to depend on "more than a single grip scalar." The existing friction ellipse already provides some coupling. The question is how much further to go — simple weight transfer, tire load sensitivity, or something more.
- **Downstream decision:** Whether VehicleParams needs center-of-gravity height, track width, and wheelbase. Whether tire model becomes load-dependent. Whether visualization shows load transfer.
- **Reversibility:** Medium — if the tire model becomes load-dependent, it affects all tire calculations.
- **Research should:** Evaluate a minimal weight transfer model (2-axle, longitudinal + lateral shifts). Determine whether tire load sensitivity is needed for meaningful differentiation or is premature before Phase 5's driver-style work. Compare educational value of showing load transfer vs. model complexity cost.

### 7. Should Phase 3 introduce a new harnessId or extend the existing QSS harness?
- **Type:** formal
- **Why it matters:** The harnessId determines run record compatibility and UI dispatch. A new harness (e.g., "phase3-stint-model") cleanly separates concerns but adds another code path. Extending the existing QSS harness keeps one model but complicates the summary type.
- **Downstream decision:** How run comparison works across Phase 2 and Phase 3 runs, what the default harness is, whether old runs remain comparable.
- **Reversibility:** High — harness dispatch is a thin routing layer.
- **Research should:** Evaluate whether a new harness that internally delegates single-lap solving to the existing QSS solver is the cleanest approach. Consider whether Phase 2 single-lap runs should still work alongside Phase 3 stint runs.

</questions>

<guardrails>
## Epistemic Guardrails

1. **Tire compound parameters must carry provenance.** Do not present degradation curves or thermal windows as calibrated reality. Label all compound parameters as engineering-inference or published-approximation with explicit source notes. The user should know these are educational models, not team-calibrated data.

2. **Electrical model must not imply powertrain simulation fidelity.** A reduced-order energy balance is not a powertrain model. Document what the electrical model captures (energy flow, SoC evolution, deployment limits) and what it ignores (thermal limits on electrical components, transient dynamics, control electronics).

3. **Weather transitions must not imply meteorological simulation.** A parameterized grip-evolution timeline is not a weather prediction system. Make clear that weather scenarios are authored inputs (the user defines "rain starts at lap 15"), not predictions.

4. **Multi-lap simulation must show state evolution, not just final results.** The educational value of Phase 3 is watching how tire wear, energy state, and grip evolve over laps. Outputs that only show final lap time or total stint time miss the learning objective.

5. **Cross-subsystem coupling assumptions must be documented per interaction.** When tire temperature affects electrical deployment or weather affects tire cliff onset, the coupling mechanism must be labeled with its physical basis and its simplifications.

6. **Aero-mode switching must match regulation preset definitions.** Don't hard-code DRS drag reduction values — they come from the regulation preset and can vary between regulatory eras. The model should read aero parameters, not assume them.

7. **Phase 2 single-lap runs must remain functional and comparable.** Phase 3 adds multi-lap capability but must not break the existing single-lap harness. A user should be able to run a Phase 2-style single lap and compare it to a Phase 3 stint simulation.

</guardrails>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase requirements and success criteria
- `.planning/ROADMAP.md` Phase 3 section — 7 success criteria defining what Phase 3 must deliver
- `.planning/REQUIREMENTS.md` — Requirements MODL-02, MODL-03, MODL-04, ENVR-01, ENVR-02, ELEC-01, ELEC-02

### Prior phase context and decisions
- `.planning/phases/02-reduced-order-lap-model/02-CONTEXT.md` — Phase 2 constraints, especially lateral force balance and aero-mode switching deferrals
- `.planning/phases/02.1-circuit-geometry-pipeline/02.1-CONTEXT.md` — Python sidecar pipeline pattern

### Core simulation code
- `packages/sim-core/src/contracts.ts` — Harness interface and SimulationRunSummary discriminated union
- `packages/sim-core/src/lapModel/forwardBackward.ts` — Speed profile solver (forward-backward passes, friction ellipse integration)
- `packages/sim-core/src/lapModel/frictionEllipse.ts` — Lateral/longitudinal force coupling
- `packages/sim-core/src/lapModel/lapSolver.ts` — Lap solver orchestrator
- `packages/sim-core/src/lapModel/types.ts` — VehicleParams, SpeedProfilePoint, SectorResult types

### Domain schemas
- `packages/domain/src/scenario/schema.ts` — Scenario schema with extension points
- `packages/domain/src/presets/schema.ts` — Generic preset envelope
- `packages/domain/src/circuits/schema.ts` — Circuit geometry schema (CircuitDocument, CircuitPoint)
- `packages/domain/src/runs/schema.ts` — Run record schema and artifact types

### Existing presets
- `presets/regulations/fia-2026-baseline.json` — Current regulation preset with qualitative placeholders
- `presets/weather/dry-baseline.json` — Dry weather baseline
- `presets/weather/light-rain-placeholder.json` — Rain placeholder

### API integration
- `apps/local-api/src/services/runService.ts` — Run execution flow and harness dispatch
- `apps/local-api/src/routes/runs.ts` — Run creation endpoint

### Visualization patterns
- `packages/visuals/src/traces/SpeedProfileTrace.tsx` — Speed vs distance trace (hand-rolled SVG, regime coloring)
- `packages/visuals/src/cards/RunComparisonCard.tsx` — Metric comparison with delta badges

### Project deliberations
- `.planning/deliberations/` — Prior deliberations on scope, control stack, visualization, data sources

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Forward-backward solver** (`forwardBackward.ts`): Core physics solver. Phase 3 wraps this in a multi-lap runner — it becomes the inner loop. Extend `mu` and `kz` inputs to be state-dependent.
- **Friction ellipse** (`frictionEllipse.ts`): Already couples lateral/longitudinal forces. Extension point for load-dependent grip and tire-state-dependent limits.
- **SpeedProfileTrace** (visuals): Regime-colored speed-vs-distance chart. Can serve as basis for new trace types (tire temp over laps, energy SoC over laps).
- **RunComparisonCard** (visuals): Delta badges and tone indicators. Phase 3 comparison includes tire strategy differences and energy policy differences.
- **AssumptionPanel** (visuals): Displays model assumptions. Phase 3 adds subsystem-specific assumptions (tire model class, electrical model simplifications).
- **Generic preset envelope**: `values: z.record(z.string(), z.unknown())` allows extending regulation and weather presets without schema migration.
- **Run artifact system**: Supports multiple named artifacts per run. Phase 3 adds tire-degradation-trace, electrical-state-trace, weather-evolution-trace artifact types.

### Established Patterns
- **Discriminated union on harnessId**: Phase 3 adds a new summary variant to the union.
- **Provenance tracking**: All assumptions carry sourceType metadata. Phase 3 subsystem parameters must follow this pattern.
- **Hand-rolled SVG**: All visualizations are hand-rolled SVG (no charting library). Phase 3 visuals must continue this convention.
- **Browser-safe domain boundary**: Filesystem ops in `packages/domain/node/` only. Core domain types stay browser-safe.
- **5m-spaced circuit points**: Circuit data at 5m spacing with curvature, optional x/y/elevation. Phase 3 can use this spacing for per-point aero-mode state.

### Integration Points
- **runService.ts harnessId dispatch**: Add new case for Phase 3 harness. Pattern: load scenario, resolve presets, execute model, build run record.
- **VehicleParams extension**: Add optional fields for tire state, electrical state, aero mode. Existing 5 fields remain required.
- **SpeedProfilePoint extension**: Add optional fields for per-point tire and electrical state. Existing visualization consumers ignore unknown fields.
- **Scenario schema**: Add optional tireStrategy, electricalMode, weatherEvolution fields. Do not touch observer/controller placeholders.
- **Preset values**: Regulation preset gets typed electrical and aero parameters. Weather preset gets evolution parameters.

</code_context>

<specifics>
## Specific Ideas

- The multi-lap simulation could output a "stint summary" view: a per-lap table showing tire wear, grip, energy SoC, lap time, and weather state. This is the natural first view for a performance engineer learning role.
- Tire compound comparison could reuse RunComparisonCard: compare soft vs. medium vs. hard on the same circuit, showing where cliff behavior diverges.
- Energy-deployment policy comparison (success criterion 2) could show two overlaid SoC traces: aggressive deployment (fast early, energy-limited late) vs. conservative (slower but consistent).
- Weather transition scenarios could be authored as a timeline: "dry for 10 laps, rain onset at lap 11, full wet by lap 15, drying from lap 30." This gives the user a concrete scenario to explore.
- The existing waterfall chart (SensitivityWaterfall) could be extended to show subsystem-level attribution: "your lap time increased by 1.2s — 0.7s from tire degradation, 0.3s from energy depletion, 0.2s from track temperature drop."

</specifics>

<deferred>
## Deferred Ideas

- Race-distance strategy comparison, pit timing optimization — Phase 4
- Qualifying and sprint session modes — Phase 4
- Engineer-role learning paths and explanation views — Phase 4
- Observer layer and synthetic sensor model — Phase 4
- Timeline scrubbing and sensitivity-analysis workflows — Phase 4
- Driver-style parameterization and behavioral differences — Phase 5
- Model-based control baseline (MPC) — Phase 5
- Optimal trajectory and racing line computation — Phase 5
- Data import and telemetry alignment — Phase 6
- Model calibration and confidence scoring — Phase 7
- Full Pacejka or thermomechanical tire models — v2
- Powertrain simulation beyond energy balance — v2
- Multi-car interaction and traffic effects — v2

### Reviewed Todos (not folded)
- "Add context-appropriate comparison modes for same-track and cross-track analysis" — UI comparison concern, better addressed in Phase 4 when strategy comparison views are built.

</deferred>

---

*Phase: 03-tire-electrical-weather-environment-and-energy-dynamics*
*Context gathered: 2026-04-02*

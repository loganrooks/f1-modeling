# Phase 4: Strategy, Race Simulation, and Explanation Surfaces - Context

**Gathered:** 2026-04-08
**Status:** Ready for research
**Mode:** Auto-generated (exploratory, --auto)

<domain>
## Phase Boundary

Turn the simulation into a race-strategy analysis tool. The user must be able to compare multi-stint strategies across a race distance, see why one strategy outperforms another with factor-level attribution, inject race interruptions and in-race interventions, simulate qualifying and sprint sessions, and inspect subsystem interactions through engineer-role learning views. Sensitivity studies enable quick "what if" exploration.

This phase does NOT add driver-style parameterization, optimal trajectory computation, model-based control (MPC), data import, telemetry alignment, or calibration. Those belong to Phases 5-7. The observer layer and synthetic sensing belong to Phase 4.1.

**Critical prerequisite:** Phase 3.1 (Race State, Typed Artifacts, and Branchable Runs) provides the race-state engine, multi-stint scenario contracts, pit events, interruptions, run lineage, and typed timeline artifacts that Phase 4 strategy work requires. Phase 4 builds ON these foundational capabilities; it does not build them.

**Visualization prerequisite:** The audit (2026-04-07) mandates a visualization library deliberation before Phase 4 planning begins. Hand-rolled SVG served Phases 1-3 but will not scale to strategy timelines, linked views, branch comparisons, and explanation surfaces. This deliberation must resolve library choice and migration strategy before the planner writes visualization plans.

</domain>

<assumptions>
## Working Model & Assumptions

### Strategy comparison as multi-run analysis
The most likely approach compares race simulations by running the same scenario with different strategy configurations (compound sequences, pit timing, energy policies) and then analyzing the resulting race timeline artifacts. Phase 3.1's race-state engine sequences stints; Phase 4 adds the comparison, attribution, and explanation layer on top. Research must validate whether strategy comparison is best modeled as multiple independent race runs, or as a single engine that evaluates alternatives internally.

### Explanation as factor decomposition
STRA-02 requires explaining "why one strategy outperforms another." The likely approach decomposes the total race-time delta between strategies into factor contributions: pit loss, tire degradation, electrical energy management, weather response, interruption effects. This is analogous to the existing sensitivity waterfall (which attributes single-lap time deltas to parameter changes) but extended to race distance. Research should evaluate whether a stint-by-stint factor decomposition is sufficient or whether event-level granularity is needed.

### Qualifying as constrained optimization over tire inventory
Qualifying (Q1/Q2/Q3) is fundamentally different from race simulation — it's a push-lap optimization problem with tire compound allocation constraints. Each session segment has elimination rules, and compound choice carries forward to the race. Research should determine the right abstraction: is qualifying a variant of the race-state engine (stints = sessions, pit events = compound changes) or a separate session mode with its own harness?

### Sprint race as short-distance race variant
Sprint races use the same race-state engine as full races but with shorter distances and potentially different compound constraints. Working assumption: sprint is a configuration variant of the race simulation, not a separate engine.

### In-race interventions as race-state mutations
STRA-04 requires mode changes, pit timing responses, and tire management instructions that alter outcomes based on timing. Working assumption: interventions are events injected into the race timeline that modify subsequent state (e.g., "switch to conservative energy mode at lap 25" or "pit one lap early in response to VSC"). These produce branch points that enable alternative comparison.

### Engineer-role views as filtered projections
EDU-03 and the pedagogy deliberation recommend role-specific learning paths. Working assumption: all subsystem data exists in the race timeline artifacts; engineer-role views are filtered projections showing the information each role uses (strategy engineer sees compound windows and pit timing; performance engineer sees degradation and energy; race engineer sees interventions and driver communication). Research should evaluate whether roles need distinct data or just distinct presentation.

### Visualization library adoption
The audit mandates adopting a proper visualization library for Phase 4+. The existing hand-rolled SVG components (SpeedProfileTrace, SoCTrace, SensitivityWaterfall, TrackMap, etc.) either need to be wrapped/migrated or rebuilt on the new foundation. Working assumption: the library should support linked views, shared cursors, time-axis brushing, and overlay composition. Research should evaluate candidates (d3+React, visx, observable Plot, canvas-based) against these requirements and the migration cost.

</assumptions>

<constraints>
## Derived Constraints

### From Phase 3.1 (architectural prerequisite)

Phase 3.1 provides the critical architectural bridge between single-stint simulation and race-level analysis. Its success criteria define what Phase 4 can assume exists:

1. **Multi-stint race plans** — Scenario schema supports per-stint compound, policy, and lap count. Phase 4 consumes this schema for strategy configuration.
2. **Race-state engine** — Sequences stints with pit events (pit-entry loss, service time, tire change) and produces typed race timeline artifacts. Phase 4 builds comparison and explanation views on these artifacts.
3. **Race interruptions** — VSC, SC, and red flag can be injected at specified laps. Phase 4 extends this with probabilistic injection and strategy-response logic.
4. **Run lineage** — Parent/branch lineage enables fork-from-state workflows. Phase 4 uses this for intervention and "what if" branching.
5. **Tire-set inventory** — Tracks allocated and used sets across race weekend. Phase 4 uses this for qualifying compound allocation.
6. **Typed timeline artifacts** — Structured race-level output for downstream UI. Phase 4 reads these for strategy comparison and explanation rendering.

**If Phase 3.1 is not yet complete when Phase 4 planning begins, the planner must not duplicate Phase 3.1 scope.** Phase 4 plans should reference Phase 3.1 outputs as dependencies.

### From Phase 3 codebase

7. **StintRunner architecture** (`packages/sim-core/src/stintModel/stintRunner.ts`): Runs multi-lap stints with per-lap subsystem updates. Returns `StintResult` with `LapTrace[]` snapshots. Phase 4 builds race-level orchestration on top of stint-level simulation.

8. **Subsystem models available**: Tire (4 compounds, degradation, thermal, cliff), electrical (SoC, 2 policies, harvest/deploy), environment (weather evolution, grip modifier, rubber), aero (2026 Straight/Corner modes), load transfer (2-axle). Phase 4 can vary all of these as strategy variables.

9. **Existing visualization components** (`packages/visuals/`): SpeedProfileTrace, SoCTrace, SensitivityWaterfall, RunComparisonCard, MetricTracePanel, AssumptionPanel, TrackMap, WorkbenchShell. All are hand-rolled SVG. Phase 4 adds strategy-specific visualizations and may migrate these to a proper library.

10. **Run artifact system**: Supports multiple named artifacts per run. Stint model produces 4 artifact types (stint-trace, tire-degradation-trace, electrical-state-trace, weather-evolution-trace). Phase 4 adds race-level artifacts from Phase 3.1.

11. **API harness dispatch** (`apps/local-api/src/services/runService.ts`): Three dispatchers exist (placeholder, lap-model, stint-model). Phase 4 adds a race simulation dispatcher and potentially qualifying/sprint dispatchers.

12. **Browser workspace** (`apps/web/`): Has scenario editor, run history, run summary panels, and stint/lap model views. Phase 4 adds strategy comparison views, explanation views, and session mode selection.

### From requirements

- **STRA-01**: Compare strategies across compounds, stint lengths, pit timing, and energy policy.
- **STRA-02**: Explain why a strategy wins or loses with stint-level and event-level detail.
- **STRA-03**: Sensitivity analyses by perturbing weather, wear, incidents, or policy assumptions.
- **STRA-04**: In-race interventions (mode changes, pit timing, tire management) with timing effects.
- **STRA-05**: Race interruptions (VSC, SC, red flag) at specified or probabilistic points.
- **PLAT-04**: Qualifying (Q1/Q2/Q3 compound allocation) and sprint races as session modes.
- **EDU-01**: Subsystem-level explanations of how systems interact.
- **EDU-03**: Engineer-role learning paths (race engineer, strategy engineer, performance engineer, etc.).
- **VISU-03**: Visual views tied to model semantics and uncertainty, not decorative dashboards.

### From audit findings (2026-04-07)

13. **Phase 4 scope narrowed**: Observers moved to Phase 4.1. Phase 4 = strategy + race simulation + explanation surfaces.
14. **Visualization library**: "Adopt a proper visualization library; deliberate during Phase 4 planning." Candidates: d3+React, visx, observable Plot, lightweight canvas for dense traces.
15. **Type preset values**: "Type preset values when Phase 4 planning begins" — regulation preset `values` field is currently `z.record(string, unknown)`.
16. **Deploy-plan semantics**: "Add deploy-plan semantics in Phase 4" — electrical deployment needs richer policy representation beyond aggressive/conservative.
17. **Pit-lane loss model**: New requirement STRA-06 added for pit-entry delta, service time, pit-exit rejoin.
18. **Tire-set inventory**: New requirement STRA-07 added for compound allocation tracking across weekend.
19. **Traffic/rejoin penalties**: New requirement STRA-08 added for low-fidelity position-risk modeling.

### From prior phase decisions

- Reduced-order, explainable models before high-fidelity simulation.
- Visualization is a progressive, model-coupled learning surface.
- Honesty constraints: don't imply fidelity the model doesn't support.
- Provenance tracking on all assumptions.
- Educational pedagogy deliberation: performance engineer as natural first role; race engineer and strategy engineer as primary Phase 4 roles.

### Future Awareness

- **Phase 4.1** needs the observer layer to sit between the plant and visualization. Phase 4's explanation views should leave seams for observer-aware overlays (true vs. estimated state) without implementing them.
- **Phase 5** needs a control-ready plant interface. Phase 4's race-state engine should avoid baking simulation semantics that would prevent a time-step interface from wrapping the same models.
- **Phase 6** needs to overlay imported telemetry on simulation output. Phase 4's visualization architecture should support external data overlays without redesigning the view layer.

</constraints>

<questions>
## Open Questions

### 1. Which visualization library should replace hand-rolled SVG, and what's the migration strategy?
- **Type:** material
- **Why it matters:** This is a gating prerequisite from the audit. Every visualization plan in Phase 4 depends on this choice. The library must support linked views, shared cursors, time-axis brushing, and overlay composition for strategy timelines. Migration cost for existing components (SpeedProfileTrace, SoCTrace, etc.) determines whether to rebuild or wrap.
- **Downstream decision:** All Phase 4 visualization plans, and whether Phase 1-3 components get migrated or wrapped.
- **Reversibility:** Low — visualization library choice affects every visual component going forward.
- **Research should:** Evaluate d3+React bindings, visx (Airbnb), observable Plot, and canvas-based approaches against Phase 4 requirements (linked views, brushing, overlay composition, dense traces). Consider bundle size and consumer-hardware constraints. Recommend library choice AND migration strategy (rebuild vs. wrap).

### 2. How should race-strategy comparison be presented to support both overview and drill-down?
- **Type:** material
- **Why it matters:** SC1 requires comparing "multiple pit and compound strategies across a race distance." The presentation must support both high-level comparison (which strategy is faster overall) and drill-down (which stint made the difference). This is the core UX of Phase 4.
- **Downstream decision:** What visualization components to build, what artifact structure strategy comparison consumes.
- **Reversibility:** Medium — visualization can be iterated, but the data structure for comparison artifacts propagates.
- **Research should:** Survey how existing F1 strategy tools present multi-strategy comparison. Evaluate timeline-based layouts, overlay traces, and tabular summaries. Recommend an approach that scales from 2 to 6+ strategies.

### 3. What factor decomposition serves "why a strategy wins" at the right granularity?
- **Type:** material
- **Why it matters:** STRA-02 requires explaining outcomes "including pit loss, degradation, thermal effects, and energy state." Too coarse (just total time) fails the learning objective. Too fine (per-lap per-subsystem) overwhelms. The decomposition determines what Phase 4's explanation engine computes and what the UI renders.
- **Downstream decision:** What intermediate data the race engine must produce beyond raw lap times, what explanation artifacts are generated.
- **Reversibility:** Medium — decomposition logic shapes explanation UI.
- **Research should:** Evaluate stint-level attribution (pit loss + degradation delta + energy delta + weather delta per stint) vs. event-level attribution. Determine minimum granularity that satisfies STRA-02's learning intent.

### 4. How should qualifying sessions (Q1/Q2/Q3) be modeled as distinct from race simulation?
- **Type:** formal
- **Why it matters:** Qualifying is fundamentally different — push-lap optimization with elimination rounds and compound carry-forward. The abstraction choice (variant of race engine vs. separate harness) affects code complexity and UX flow.
- **Downstream decision:** Whether qualifying uses the race-state engine or a separate session simulator.
- **Reversibility:** Medium — harness architecture choice is structural.
- **Research should:** Analyze qualifying rules (tire allocation per session, elimination thresholds, compound carry-forward to race). Evaluate whether Phase 3.1's race-state engine can express qualifying or whether a separate session mode is cleaner.

### 5. What engineer-role learning paths belong in Phase 4, and how are they differentiated?
- **Type:** formal
- **Why it matters:** EDU-03 requires discipline-specific learning paths. The pedagogy deliberation identified strategy engineer, race engineer, and performance engineer as primary Phase 4 roles. But the boundary between "role-specific view" and "filtered same view" is unclear.
- **Downstream decision:** Whether to build separate views per role or a single view with role-based filter/highlight.
- **Reversibility:** High — presentation can be iterated.
- **Research should:** Define what information each role (strategy engineer, race engineer, performance engineer) uses in race strategy analysis. Evaluate whether roles need distinct views or distinct emphasis within shared views.

### 6. How should in-race interventions interact with the race-state engine and branching?
- **Type:** formal
- **Why it matters:** STRA-04 requires mode changes, pit timing responses, and tire management instructions. These must produce branch points for alternative comparison. The interaction pattern between interventions and the race-state engine determines both the simulation API and the UI for "what if" workflows.
- **Downstream decision:** How interventions are represented in the scenario schema, how branches are created and compared.
- **Reversibility:** Medium — intervention model feeds into branching and comparison.
- **Research should:** Evaluate intervention representation (discrete events on timeline vs. conditional rules). Determine how interventions create branch points and how the UI presents branch comparison.

### 7. How should the sensitivity/perturbation workflow operate at race distance?
- **Type:** efficient
- **Why it matters:** STRA-03 requires perturbing weather, wear, incidents, or policy assumptions and comparing outcomes. At race distance, reruns are slower than single-lap perturbation. The workflow must balance exploration speed with output quality.
- **Downstream decision:** Whether perturbation is batch (run all variants, compare) or interactive (tweak and rerun).
- **Reversibility:** High — workflow UI can be iterated.
- **Research should:** Evaluate batch vs. interactive perturbation patterns. Determine which parameters are most useful to perturb at race distance.

</questions>

<guardrails>
## Epistemic Guardrails

1. **Strategy comparison must explain, not just rank.** Showing "Strategy A: 1:32:45, Strategy B: 1:33:12" is insufficient. The output must show what factors drove the delta — pit loss, degradation, energy, weather response — at minimum stint-level granularity.

2. **Race interruptions must not imply deterministic prediction.** VSC/SC/red flag injection should be clearly labeled as scenario exploration ("what happens IF VSC at lap 20") not forecasting.

3. **Qualifying must respect compound allocation rules.** Q1/Q2/Q3 compound carry-forward is a real constraint that affects race strategy. Don't simplify away tire inventory management.

4. **Engineer-role views must not be cosmetic relabeling.** Each role must see genuinely different information emphasis, not the same data with a different header. If role differentiation isn't meaningful, don't build it yet.

5. **Sensitivity analysis must preserve assumption transparency.** When perturbing parameters, the output must show which assumptions were changed and what their original provenance was. Don't let perturbation obscure the baseline model's honesty.

6. **Visualization must remain model-coupled.** Phase 4 adds richer visual surfaces, but every view must stay tied to model semantics and uncertainty (VISU-03). Strategy timelines must reflect actual simulation output, not stylized infographics.

7. **Phase 3.1 outputs are the foundation — don't duplicate scope.** Phase 4 plans must not re-implement race-state engine, pit events, or typed artifacts. Use the interfaces Phase 3.1 provides.

8. **Phase 2 and Phase 3 runs must remain functional.** The visualization migration and new harness additions must not break existing single-lap and single-stint run flows.

</guardrails>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase requirements and success criteria
- `.planning/ROADMAP.md` Phase 4 section — 8 success criteria
- `.planning/REQUIREMENTS.md` — STRA-01 through STRA-08, PLAT-04, EDU-01, EDU-03, VISU-03

### Prerequisites
- `.planning/ROADMAP.md` Phase 3.1 section — race-state engine, multi-stint, typed artifacts
- `.planning/audits/audit-response-2026-04-07.md` — Phase 4 scope narrowing, visualization library mandate, new requirements

### Prior phase context and decisions
- `.planning/phases/03-tire-electrical-weather-environment-and-energy-dynamics/03-CONTEXT.md` — Phase 3 architectural constraints

### Deliberations
- `.planning/deliberations/visualization-and-simulation-learning-surface.md` — Progressive learning surface principle
- `.planning/deliberations/educational-pedagogy-and-learning-paths.md` — Role-based entry points, performance engineer first

### Core simulation code
- `packages/sim-core/src/stintModel/stintRunner.ts` — StintRunner loop (Phase 4 races are sequences of stints)
- `packages/sim-core/src/stintModel/types.ts` — StintConfig, StintState, LapTrace, StintResult
- `packages/sim-core/src/contracts.ts` — SimulationHarness, SimulationRunSummary discriminated union

### Domain schemas
- `packages/domain/src/scenario/schema.ts` — ScenarioDocument with stintConfig, extension points
- `packages/domain/src/runs/schema.ts` — RunRecord, RunArtifact types
- `packages/domain/src/presets/schema.ts` — Generic preset envelope (values field needs typing per audit)

### Existing presets
- `presets/regulations/fia-2026-baseline.json` — 2026 regulation values
- `presets/tires/*.json` — Tire compound presets (soft-c5, medium-c3, hard-c1, intermediate-wet)
- `presets/weather/*.json` — Weather presets (dry-baseline, light-rain-placeholder, rain-transition)

### API and web
- `apps/local-api/src/services/runService.ts` — Run execution and harness dispatch
- `apps/web/src/app/useWorkspace.ts` — Browser workspace state and run creation
- `apps/web/src/features/runs/RunSummaryPanel.tsx` — Run display (has StintModelRunView)

### Visualization components
- `packages/visuals/src/traces/SpeedProfileTrace.tsx` — Speed-vs-distance (hand-rolled SVG)
- `packages/visuals/src/traces/SoCTrace.tsx` — SoC-over-laps (hand-rolled SVG)
- `packages/visuals/src/inspectors/SensitivityWaterfall.tsx` — Factor attribution chart
- `packages/visuals/src/workspace/TrackMap.tsx` — Track geometry visualization

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **StintRunner** (`stintRunner.ts`): Multi-lap simulation loop. Phase 4 races are sequences of stints orchestrated by Phase 3.1's race-state engine.
- **Subsystem models**: Tire (4 compounds), electrical (2 policies), environment (weather evolution), aero (mode switching), load transfer. All available as strategy variables.
- **SensitivityWaterfall** (`visuals`): Factor-attribution waterfall chart. Natural foundation for strategy explanation (extend from parameter deltas to stint-level strategy deltas).
- **RunComparisonCard** (`visuals`): Side-by-side metric comparison. Usable for strategy-level comparison.
- **Run artifact system**: Multiple named artifacts per run. Extensible for race-level artifacts.
- **Generic preset envelope**: Weather and tire presets already parameterized. Strategy presets could follow the same pattern.

### Established Patterns
- Discriminated union on harnessId for model dispatch.
- Provenance tracking on all assumptions.
- Run records carry preset snapshots for reproducibility.
- Browser-safe domain boundary (filesystem in node/ subpath).
- Scenario extension: stintConfig is optional for backward compatibility.

### Integration Points
- **runService.ts**: Add race simulation dispatcher.
- **useWorkspace.ts**: Add race simulation creation flow and strategy comparison state.
- **RunSummaryPanel.tsx**: Add RaceSimulationRunView for race-level output display.
- **ScenarioEditor.tsx**: Add race plan configuration (multi-stint, pit timing, compound sequence).

</code_context>

<specifics>
## Specific Ideas

- The existing SensitivityWaterfall could be extended into a "Strategy Attribution Waterfall" showing factor-by-factor contributions to total race-time delta between two strategies.
- Race timeline could use a Gantt-style visualization: horizontal bars for stints, vertical markers for pit events and interruptions, color-coded by compound.
- Engineer-role views could use a "lens" metaphor: same underlying race data, but the strategy engineer lens highlights compound windows and pit timing, the performance engineer lens highlights degradation and energy evolution, the race engineer lens highlights interventions and real-time state.
- Qualifying could be presented as a tree: Q1 → survivors → Q2 → survivors → Q3 → grid, with compound choices at each node.
- "What if" branching could show diverging timelines from a common branch point, with the delta accumulating visually over remaining laps.

</specifics>

<deferred>
## Deferred Ideas

- Observer layer, synthetic sensors, true/measured/estimated comparison — Phase 4.1
- Driver-style parameterization and behavioral differences — Phase 5
- Model-based control baseline (MPC) and optimal trajectory — Phase 5
- Data import and telemetry alignment — Phase 6
- Model calibration and confidence scoring — Phase 7
- Full opponent/competitor model — v2
- Monte Carlo race evolution and ensemble analysis — v2
- Multi-car racecraft and overtaking logic — v2

### Reviewed Todos (not folded)
- "Add context-appropriate comparison modes for same-track and cross-track analysis" — May be partially addressed by Phase 4's strategy comparison UI, but the specific same-track vs. cross-track framing is a Phase 5+ concern.

</deferred>

<future_awareness>
## Future Awareness

### Phase 4.1 (Observer Layer)
- Phase 4 explanation views should leave SEAMS for observer-aware overlays (true vs. estimated state) without implementing them.
- The race timeline artifact should include enough state for an observer to later reconstruct measurement channels.

### Phase 5 (Control Systems)
- Phase 4's race-state engine must not bake in semantics that prevent a time-step plant interface from wrapping the same models.
- Energy deployment in Phase 4 remains policy-parameterized (aggressive/conservative); Phase 5 may replace this with an optimal control formulation.

### Phase 6 (Data Import)
- Phase 4's visualization architecture should support external data overlays (imported telemetry alongside simulation) without redesigning the view layer.
- Strategy comparison views should accommodate comparing simulation output to real-world race data.

### v2 Ambitions
- Full opponent modeling would extend Phase 4's traffic/rejoin abstraction.
- Monte Carlo ensemble analysis would extend Phase 4's sensitivity workflow from single-perturbation to distribution-based exploration.

</future_awareness>

---

*Phase: 04-strategy-race-simulation-and-explanation-surfaces*
*Context gathered: 2026-04-08*

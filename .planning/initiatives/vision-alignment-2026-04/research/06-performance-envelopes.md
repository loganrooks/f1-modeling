# 06 Performance Envelopes

## 1. Metadata

- **Date:** 2026-04-11
- **Mode:** Terrain mapping with bounded envelope proposal
- **Primary consumers:** D1 (backend boundary architecture), D2 (visualization architecture)
- **Secondary consumers:** D3 and D5 adjacently, not as primary closure criteria
- **Overall confidence:** Medium-low
- **Validation status:** No benchmarks were run in this round. This document proposes provisional envelopes plus a measurement method.

## 2. Executive Summary

This round is best treated as a constraint-setting artifact, not as validated truth. The evidence supports a coupled two-strata framing: D1 and D2 are blocked less by "which library/runtime?" than by the absence of explicit UI/render and job/compute envelopes that can later be measured against real scenes. The strongest honest output here is bounded target ranges with explicit confidence markers, plus a benchmark method that can either validate or overturn them. The proposals below are grounded in the project vision, the Wave 1 research, the current code shape, and official performance/measurement guidance, but several numbers remain provisional until a harness exists.

## 3. Question as Received

Produce a performance-envelope research artifact that unblocks compute, streaming, and visualization deliberations for D1 and D2 specifically, covering both:

- UI/rendering envelopes for visible strategies, linked panels, marks, latency, cadence, render time, memory, and degradation behavior.
- Job/compute envelopes for submit/ack, first progress, single-race and batch completion, partial artifacts, cancellation, terminal events, and replay/reconnect assumptions.

The task explicitly asked for provisional envelopes plus measurement methodology, not architecture winners and not benchmarked results.

## 4. Reframing

The useful question is not "what is the right performance number?" and not "what renderer/backend wins?" The useful question is:

> What provisional performance envelopes are grounded enough to constrain D1 and D2 now, and what measurement method would validate or falsify them later?

That reframing matters because the blocking issue is cross-stratum. The UI cannot be closed without assumptions about artifact cadence, batch completion, and partial-result timing. The job protocol cannot be closed without assumptions about how many views stay linked, how fast hover/brush interactions must feel, and how often the UI should repaint. This is therefore a coupled platform-envelope task, not a visualization-only budget exercise.

## 5. Assumptions Surfaced

- **Load-bearing:** "Performance" here means interactive usefulness on consumer-adjacent hardware, not maximal throughput in isolation.
- **Load-bearing:** The primary closure need is for D1 and D2, not for the entire initiative. D3 and D5 are affected, but not equally blocked.
- **Load-bearing:** "Real-time" in the current vision is seconds-scale compute visibility plus sub-100ms interaction response, not 60fps telemetry animation across every panel.
- **Load-bearing:** Partial artifacts and graceful degradation are acceptable product behavior if they remain honest and explicit.
- The dionysus server is the compute baseline, but render responsiveness must still be acceptable on the weaker thin-client path from apollo over Tailscale.
- Phase 4 and near-horizon Phase 4.1 workloads are still lap/stint/race-aggregation oriented. Full telemetry-density streaming is adjacent precedent, not the primary v1 target.
- p95 responsiveness matters more than best-case latency, because the architecture choice is about sustained usability under dense linked scenes.

## 6. Option Space

This round does not compare renderers or backends. The option space here is about how to frame performance closure.

### Option A: UI-only performance budget

- Useful for D2.
- Incomplete for D1 because job protocol, partial artifacts, and cancellation semantics would remain unconstrained.

### Option B: Job/compute-only service-level targets

- Useful for D1.
- Incomplete for D2 because renderer, shared interaction state, and degradation policy would remain philosophical.

### Option C: Coupled two-strata envelope with shared benchmark scenes

- UI/render and job/compute envelopes are specified separately but validated against the same worst-plausible scenes.
- Best matches the evidence in R1, R2, R4, the audit response, and the boundary memo.

### Option D: Pure deferral until a harness exists

- Methodologically honest.
- Insufficient for D1/D2 closure because it leaves current deliberations without even provisional constraints.

## 7. Trajectory Analysis

### Option A: UI-only budget

- 1-year trajectory: helps D2 choose an initial renderer path.
- 3-year trajectory: weak, because compute/job assumptions leak back into the UI.
- 5-year trajectory: poor fit for local/remote/cloud flexibility.
- Doors opened: faster renderer discussion.
- Doors closed: credible backend/protocol closure.

### Option B: Job-only service targets

- 1-year trajectory: helps D1 define job protocol.
- 3-year trajectory: weak, because linked interaction and render density remain unresolved.
- 5-year trajectory: poor fit for "visualization is the product surface."
- Doors opened: cleaner backend deliberation.
- Doors closed: architecture-honest visualization closure.

### Option C: Coupled two-strata envelope

- 1-year trajectory: enough to constrain D1 and D2 without forcing winner selection.
- 3-year trajectory: resilient because both render and compute layers can evolve behind contracts.
- 5-year trajectory: strongest fit for local/remote/cloud compute plus hybrid renderer growth.
- Doors opened: shared benchmark scenes, contract-aware degradation policy, cross-stratum closure.
- Doors closed: some short-term simplicity.

### Option D: Pure deferral

- 1-year trajectory: safest epistemically, but stalls near-term deliberation.
- 3-year trajectory: fine only if the project accepts another loop before D1/D2.
- 5-year trajectory: neutral.
- Doors opened: avoids fabricated precision.
- Doors closed: timely architectural progress.

## 8. Precedent Analysis

### Current repo precedent

- The current web shell still hardcodes exactly three zones, which means "panels per workspace" is already a structural constraint, not an abstract one (`apps/web/src/app/App.tsx:185`).
- The current visualization layer is 2,736 lines of bespoke TSX and is still SVG/DOM-centric (`packages/visuals/src/**/*.tsx` total via `wc -l`).
- `SpeedProfileTrace` builds per-segment SVG lines and hover lookup in component state, which is fine for modest traces but not yet evidence for dense linked scenes (`packages/visuals/src/traces/SpeedProfileTrace.tsx:175-227`).
- `SensitivityWaterfall` similarly computes and renders one SVG bar set per sector, which is semantically clear but not yet a stress-tested dense-panel primitive (`packages/visuals/src/inspectors/SensitivityWaterfall.tsx:138-218`).
- `runRace` is still whole-run orchestration over stints that returns completed results; no job lifecycle, partial artifact semantics, or progress stream exists yet (`packages/sim-core/src/raceModel/raceRunner.ts:123-280`).

### RAIL and INP as responsiveness precedents

- web.dev's RAIL guidance keeps "respond in under 100 ms" as a useful interaction-level rule of thumb for perceived immediacy.
- web.dev's INP guidance defines good responsiveness as 200 ms or less at the page level, which suggests internal chart interactions should aim materially below that ceiling rather than use it as the target.

### OpenF1 as cadence precedent

- OpenF1 publishes live race-position/interval updates at about every 4 seconds and documents live data as arriving with a small delay relative to events.
- R2 also noted weather updates around one minute. That combination is important: "live" in adjacent F1 tooling is periodic typed refresh, not every-frame animation.

### Measurement-tooling precedent

- MDN `performance.measure()` and the browser performance timeline provide a standard way to measure between explicit marks.
- Node's `perf_hooks` API provides the matching server-side timing model for submit, progress, artifact, and terminal events.
- Playwright's trace tooling is well suited to preserve reproducible interaction traces and benchmark artifacts for developer review.

## 9. Stratum A: UI/rendering envelope

These are provisional envelopes for the browser-facing surface. Each is meant to constrain D2 and, secondarily, D1's event/artifact cadence assumptions.

| Dimension | Provisional envelope | Why it matters | Confidence | Measurement method | Honest deferral / revisit criteria |
| --- | --- | --- | --- | --- | --- |
| Visible strategies per workspace | **4-6 simultaneously visible strategies** in an active comparison workspace. `4` should be the comfort target; `6` is the required upper envelope for D2 consumption. Above `6`, require summary-first or focus mode. | Constrains shell layout, renderer selection, and whether D2 can assume full-detail parity across all strategies. | Likely | Playwright scene with 6 strategy artifacts across 4 linked panels, measure hover, brush, and memory together. | If D2 wants `8+` full-detail strategies with no summarization, revisit after a harness exists. |
| Linked panels with shared interaction state | **3-4 fully linked panels** should stay within latency budgets. `5-6` is acceptable only if inactive panels receive coarser sync, pinned snapshots, or reduced hover detail. | Constrains the shared interaction state contract and the future shell beyond the current three-zone app. | Likely | Measure `brush-start -> all-subscribed-panels next paint` and `cursor-move -> linked crosshair/tooltip paint`. | Full `6+` fully live linked panels should be treated as revisit-later unless backed by measurement. |
| Marks per panel | **Typical lap/timeline panels:** ~`500-1,500` addressable marks / SVG nodes or equivalent. **Dense subsystem panels:** ~`2,000-8,000` plotted samples are acceptable only if batched paths or non-DOM rendering are used; keep individually interactive DOM hit targets around or below `~1,000`. | Constrains SVG-only viability, batching strategy, and when Canvas/hybrid becomes mandatory rather than optional. | Plausible | Fixture families that vary plotted samples, interactive hit targets, and annotation count separately. | Exact crossover from SVG to Canvas is revisit-later; this round can only bound the likely zone. |
| Hover-to-tooltip latency | **p95 <= 50 ms**, with **100 ms as the red-line ceiling**. | Constrains hit-testing design, state propagation, and whether dense panels can remain DOM-driven. | Likely | Browser marks on pointer event start and tooltip-visible next paint; inspect p50/p95 under dense scenes. | If hover requires semantic lookups beyond local panel state, measure again after artifact IDs and anchors are implemented. |
| Brush-to-linked-panel update latency | **p95 <= 75-100 ms**, with **150 ms as failure territory**. | Constrains linked brushing design, shared-state fanout, and renderer batching. | Likely | Measure `brush-start -> linked panels painted` across 4-panel scenes. | If D2 insists on per-point linked highlighting across all panels, revisit after prototype benchmarking. |
| Initial render time after artifact receipt | **<= 250 ms typical**, **<= 500 ms worst-plausible first paint** after typed artifact receipt. | Constrains fetch-artifact vs inline-payload debate and determines whether partial artifacts are needed for perceived liveness. | Plausible | Mark `artifact-received` when fetch resolves, then observe first paint / chart-ready marker. | If artifacts become far larger than current lap/stint/race JSON, revisit with recorded fixtures. |
| Steady-state live-update cadence | **0.25-1 Hz** for active simulation-driven views; **1 Hz** is the aggressive upper target for 4 linked panels. External live-data precedent at **4 s** intervals and **~1 min** weather updates means D2 should not assume per-frame streaming. | Constrains event protocol, diff granularity, and rerender strategy. | Likely | Replay artifact updates at `0.25`, `0.5`, and `1 Hz` for 10-minute sessions; inspect latency drift and memory growth. | If D1 later requires faster than `1 Hz` partial-artifact updates for Phase 4.1, revisit with observer-specific scenes. |
| Memory ceiling per session | **Soft ceiling: 250-300 MB JS heap** for a normal active workspace. **Hard ceiling: 400-500 MB** for dense branch comparison or long sessions before degradation must engage. | Constrains caching, retained artifact strategy, and branch comparison design for apollo-class clients. | Speculative | Chromium heap snapshots or heap sampling during 10-15 minute scripted sessions. | If browser-memory tooling proves too noisy, keep this provisional and validate manually on apollo before D2 closure. |
| Degradation policy | Order of operations: **(1)** preserve semantic correctness and stable anchors, **(2)** aggregate/decimate dense series, **(3)** lower live-update cadence, **(4)** freeze hidden/inactive panels, **(5)** switch dense panel family to Canvas/hybrid, **(6)** finally cap visible strategies or require focus mode. | This is the policy choice that turns "escape hatch" into an actual contract rather than a vague future option. | Likely | Benchmark scenes should record which degradation step engaged and whether semantic/annotation correctness stayed intact. | If D2 cannot define degradation semantics without first defining artifact/anchor contracts, defer policy details but keep the sequence above as a guardrail. |

## 10. Stratum B: Job/compute envelope

These are provisional job and compute envelopes for D1. They assume the dionysus machine as the reference compute host and are intentionally phrased as transport-neutral job semantics, not framework picks.

| Dimension | Provisional envelope | Why it matters | Confidence | Measurement method | Honest deferral / revisit criteria |
| --- | --- | --- | --- | --- | --- |
| Submit-to-acknowledgement latency | **p95 <= 100 ms** on dionysus-local submission; **<= 250 ms** across the current remote dev path. | Constrains how much validation/compilation can happen before the job is formally accepted. | Likely | Mark request receipt, validation start/end, and acknowledgement send in server code. | If request compilation becomes materially heavier, split "accepted" from "compiled" explicitly rather than quietly violating the ack budget. |
| Submit-to-first-progress-event latency | **<= 250-500 ms** preferred; **1 s** is the outer ceiling before the UI feels inert. | Constrains whether job protocol needs explicit `job-started` / `queued` events apart from substantive progress. | Plausible | Mark `ack-sent -> first event observed`, including queue and worker startup. | If compute startup dominates, emit early state-transition events and treat substantive progress separately. |
| Single race simulation wall-time | **Representative 70-lap race target: 0.5-2.0 s** on dionysus reference hardware. **Investigate above ~3 s.** | Constrains whether synchronous completion is already untenable and whether partial artifacts are mandatory for Phase 4 workflows. | Speculative | Compute-only harness with fixed representative race fixtures, cold and warm runs measured separately. | This is load-bearing but not honestly crisp today; revisit after a harness exists or when the Phase 4 race artifact shape stabilizes. |
| Multi-strategy batch completion | **6 strategies x 70 laps target: 4-8 s makespan**, with **<5 s** as the aspirational interactive target and **>10 s** as failure territory for an active comparison workflow. | Constrains batching semantics, worker parallelism, and the value of partial artifact delivery. | Speculative | Benchmark both "one batch job with child runs" and "independent child jobs" on dionysus. | If D1 has not yet chosen a scheduler model, keep this as a makespan envelope rather than a single architectural conclusion. |
| Artifact-ready latency for partial results | **<= 500 ms** after a logical checkpoint closes; **<= 1 s** acceptable in early implementations. | Constrains artifact/provenance contract and determines whether the UI can visibly progress before whole-job completion. | Plausible | Mark checkpoint close, persistence complete, fetchable artifact availability, and subscriber observation separately. | If D1 cannot yet define checkpoint granularity, at minimum expose a checkpoint-summary artifact on this budget. |
| Cancellation acknowledgement timing | **Ack <= 150 ms**, visible transition to `cancelling` **<= 500 ms**, terminal `cancelled` **<= 1 s** or next safe lap/stint boundary. | Constrains state machine design and whether cancellation is honest or decorative. | Plausible | Time `cancel request -> ack -> state transition -> terminal event`. | If early backends only cancel at explicit safe points, state that contract explicitly and measure boundary latency instead of pretending immediate interruption. |
| Terminal-event timing | **<= 100-250 ms** from durable terminal state to subscriber notification and `/jobs/:id` terminal visibility. | Constrains replay semantics, completion UI, and whether the job registry is authoritative. | Likely | Mark `terminal state durable -> event emitted -> client observed -> status endpoint updated`. | If transport choice adds jitter, measure server and client legs separately before revising the envelope. |
| Replay/reconnect assumptions | **v1 should support short-lived per-job replay**, roughly **5-15 minutes or 256-1024 recent events**, whichever is smaller, plus durable artifact fetch and current status snapshot. Infinite historical event replay is out of scope for v1. | Constrains whether SSE/WebSocket semantics are append-only and whether reconnecting clients can rejoin a live job coherently. | Plausible | Script disconnect/reconnect at multiple job phases and confirm event recovery plus artifact/status reconstruction. | Full historical replay beyond the active-job horizon is revisit-later unless D1 decides it is required for later operator workflows. |

## 11. Worst-plausible scenario catalog

These scenarios are not predictions of immediate implementation. They are benchmark scenes the envelopes should accommodate or explicitly degrade under.

### Scenario 1: Strategy comparison scene

- Shape: `6 strategies x 4 linked panels x 70 laps x 1 Hz update during simulation`
- Stresses: visible strategies, linked panels, hover/brush latency, batch completion, partial artifacts, memory
- Pass: p95 hover <= 50 ms, brush <= 100 ms, live updates sustained at `0.5-1 Hz`, batch makespan <= 8 s, partial checkpoint artifacts visible before completion, session memory below hard ceiling
- Fail: the scene requires full page reloads, hidden spinners, or unbounded memory growth to remain usable

### Scenario 2: Race timeline scene

- Shape: `1 strategy x Gantt-style timeline x pit/interruption events x annotation overlays x hover-driven detail`
- Stresses: initial render, annotation anchors, mark density, tooltip latency
- Pass: first paint <= 250 ms typical, tooltip <= 50 ms, resize/scrub preserves anchor identity, annotations remain semantically attached after rerender
- Fail: event overlays or annotations force the panel to abandon interaction targets or break anchor stability

### Scenario 3: Branch comparison scene

- Shape: `2 parent runs x 4 branches each x shared cursor x diff visualization`
- Stresses: memory ceiling, linked panels, degradation policy, artifact identity
- Pass: eight branches may appear in summary form, but at least four detailed linked panels stay interactive within budgets and the branch lineage remains explicit
- Fail: the product silently attempts eight full-detail linked panels with no degradation path and collapses latency/memory budgets

### Scenario 4: Educational walkthrough scene

- Shape: `1 lesson x 8 chart states x annotation overlays x paused scrub controls`
- Stresses: initial render, anchor stability, cross-panel state, adjacent D3 integration
- Pass: step-to-step transitions <= 100 ms, overlays remain attached through state changes, and lesson stepping does not require a separate renderer path
- Fail: educational overlays require duplicating chart state or break when the underlying engineering panel rerenders

### Scenario 5: Observer overlay scene (Phase 4.1)

- Shape: `true/measured/estimated state comparison x time scrubbing x 3 linked panels x per-lap-step data`
- Stresses: dense subsystem traces, brush latency, partial artifacts, replay/reconnect assumptions
- Pass: decimated or windowed data stays within brush <= 100 ms and live/replay updates at `0.5-1 Hz`, while exact raw artifacts remain fetchable
- Fail: the scene requires full-resolution DOM interactivity across every sample to remain usable

## 12. Measurement methodology

### Reference hardware

- **Compute baseline:** dionysus (`Xeon W-2125`, `4c/8t`, `GTX 1080 Ti 11GB`, `32GB RAM`, NVMe), per `~/CLAUDE.md`
- **Client/render baseline:** apollo-class MacBook Air browser over the existing Tailscale path, because the browser runs on the thin client even when compute runs on dionysus
- Closure rule: D1 compute budgets should close on dionysus. D2 interaction budgets should close on the real client path, not only on a headless browser running on the server.

### Synthetic vs. recorded data

- Use **synthetic fixtures first** to map upper bounds before Phase 4 artifacts exist in stable form.
- Once Phase 4/4.1 artifacts exist, add **recorded artifact replays** so benchmarks exercise real JSON shape, annotation anchors, and branch lineage.
- Minimum fixture families:
  - `single-race-70-lap`
  - `batch-6x70-lap`
  - `timeline-annotation-heavy`
  - `branch-comparison`
  - `observer-overlay-windowed`
- Use synthetic data for volume and topology stress. Use recorded artifacts for realism and regression protection. Do not rely on only one of the two.

### Instrumentation points

- **Browser/UI**
  - `artifact-received`
  - `panel-render-start`
  - `panel-first-paint`
  - `hover-start`
  - `tooltip-painted`
  - `brush-start`
  - `linked-panels-painted`
  - optional heap snapshots at scene start/end
- **Server/job path**
  - `submit-received`
  - `submit-acked`
  - `job-dispatched`
  - `job-started`
  - `progress-emitted`
  - `checkpoint-closed`
  - `artifact-persisted`
  - `artifact-fetchable`
  - `cancel-requested`
  - `cancel-acked`
  - `terminal-state-durable`
  - `terminal-event-emitted`
- **Suggested APIs**
  - Browser `performance.mark()` / `performance.measure()` and PerformanceObserver-based collection
  - Node `perf_hooks.performance` and related observers for server-side timing

### Pass/fail vs. provisional

- **Pass**
  - p95 is inside the target envelope on reference hardware
  - degradation does not trigger inside the nominal envelope
  - 10-15 minute replay/update sessions do not show material memory drift beyond the soft ceiling
- **Yellow / investigate**
  - misses are within roughly `10-20%` of target
  - only cold-start paths fail
  - degradation engages earlier than desired but preserves semantics honestly
- **Fail**
  - hard ceiling exceeded
  - degradation is required inside the nominal envelope
  - semantic correctness, annotation anchors, or artifact honesty are lost to stay responsive
- **Provisional-only**
  - use when the harness cannot yet reproduce a scene or when the artifact contract is not stable enough to measure honestly

### Benchmark harness sketch

- **UI/render harness**
  - Playwright-driven benchmark scenes that load fixed fixture artifacts into dedicated benchmark routes or story-like pages
  - Browser marks exported as JSON after each run
  - Optional trace capture for failed or regressed runs
- **Compute/job harness**
  - Lightweight Node script or Vitest runner that submits representative jobs against the local API or a benchmark entrypoint
  - Server-side `perf_hooks` output written to JSON
  - Separate cold-start and warm-run modes
- **Cross-stratum harness**
  - One or two end-to-end scenes that combine job submission, first progress, partial artifact fetch, and linked-panel rendering on the apollo -> dionysus path

### Reporting

- Store machine-readable benchmark outputs under a dedicated path such as `.planning/benchmarks/performance-envelopes/<date>/`
- Surface developer-facing summaries in CI logs and attach Playwright traces / JSON timing artifacts when regressions occur
- Because the initiative's promised tech-debt registry does not yet appear to exist as a dedicated file, route failures meanwhile into:
  - the benchmark directory itself
  - `.planning/knowledge/signals/f1-modeling/` for material regressions or known envelope violations
  - later Wave 3 synthesis / tech-debt artifact once that registry is created

## 13. Cross-stratum coupling

- **First progress latency shapes UI honesty.** If submit-to-first-progress exceeds about `500 ms`, the UI must show explicit queued/starting states; otherwise a "live" strategy surface looks dead even if render latency is fine.
- **Partial artifacts are the bridge between compute and rendering.** If artifacts only appear at terminal completion, D2 cannot honestly design progressive comparison views around live updating.
- **Cadence and render cost are a coupled budget.** A renderer that handles `1 Hz` updates across 4 linked panels may still fail if D1 emits full snapshot payloads instead of compact checkpoint artifacts.
- **Memory pressure depends on job protocol shape.** Repeated full snapshots will push the browser toward the hard ceiling much faster than append-only or diff-aware artifact delivery.
- **Cancellation semantics affect workspace design.** If cancellation only becomes effective at lap or stint boundaries, D2 should model stop/cancel affordances around those safe points instead of implying immediate interruption.
- **Replay scope affects interaction recovery.** Short-lived event replay plus durable artifacts is enough for v1 linked views; without even that, reconnecting mid-job forces brittle UI state reconstruction.

## 14. Gray Areas Encountered

### [FOLLOW-AND-MARK] Thin-client rendering path entered the envelope question

- Why load-bearing: the browser runs on apollo while compute runs on dionysus, so "render performance" cannot close solely on server hardware.
- What this round did: treated compute and render baselines separately and required D2 closure on the real client path.
- What remains: a future harness needs to automate or at least repeatably reproduce that cross-machine setup.

### [FOLLOW-AND-MARK] Phase 4.1 observer density entered a Phase 4-centered task

- Why load-bearing: D1 and D2 should not lock into assumptions that fail immediately when observer overlays arrive.
- What this round did: included one near-horizon observer overlay scenario rather than narrating purely in Phase 4 chart terms.
- What remains: actual observer artifact granularity is not yet implemented, so the numbers stay provisional.

### [REVISIT-LATER] Exact single-race and batch wall-time numbers

- Why load-bearing: compute-backend closure depends on whether representative jobs land in the sub-second, low-single-digit-second, or much slower regime.
- Why not closed here: no benchmark harness exists, and the current reduced-order race model may change meaningfully as Phase 4 artifacts mature.
- Future round: re-run this question once a benchmark harness exists and representative race fixtures are stable.

### [DEFER] Phase 5 solver-specific performance envelopes

- Why deferred: MPC, EKF Jacobian, calibration, and optimizer-specific cadences are real future concerns, but they are not required to constrain D1/D2 closure for Phase 4 and near-horizon 4.1.
- Recommended pickup: a later focused round tied to the actual Phase 5 optimization problem statement.

## 15. Scope Expansion Notes

**Scope expansion encountered.**
Original framing: performance envelopes for UI/rendering and job/compute strata.
Expansion observed: benchmark reporting destination and thin-client baseline had to be treated explicitly.
Response: follow-and-mark.
Justification: an envelope without a reporting path or with the wrong client baseline would look more concrete than it actually is.

## 16. Path of Inquiry

- Started from the call framing and re-read the initiative methodology to keep the output in bounded-envelope mode instead of solution-evaluation mode.
- Read the vision, project, memo, audit response, and structure review to determine whether this was truly cross-cutting or only a visualization concern.
- Pursued R2, R4, and R1 because those files were the strongest evidence for D2 and D1 blockage.
- Checked current code only where it grounded envelope claims: the three-zone shell, the current SVG charts, the race runner, package versions, and local hardware.
- Considered a crisp-numbers-only output and abandoned it because the evidence did not justify that level of closure.
- Considered deferring the whole question until a harness exists and rejected that as insufficient for current D1/D2 work.
- Reframed the task around two coupled strata plus benchmark scenes, then filled the tables metric by metric with explicit confidence markers.

## 17. Dependencies and Relations

- **Depends on**
  - `VISION.md` for what "real-time", "production density", and "multi-strategy comparison" mean in this project
  - R2 for render/interaction/annotation pressure
  - R4 for job/event/progress/artifact semantics
  - R1 for compute trajectory and why budgets matter to backend closure
- **Affects strongly**
  - **D1** compute execution boundary, job/event protocol, artifact/provenance contract
  - **D2** renderer-agnostic visualization surface, shared interaction contract, degradation policy
- **Affects adjacently**
  - **D3** because educational overlays and walkthroughs inherit the same interaction and anchor budgets
  - **D5** because regulation comparison scenes may increase branch and comparability pressure, though not as the primary blocker
- **Coupling strength**
  - D1 <-> this file: tight
  - D2 <-> this file: tight
  - D3 <-> this file: moderate
  - D5 <-> this file: loose-to-moderate

## 18. Provisional Position

These envelopes are grounded enough to be consumed by D1 and D2 as **provisional constraints**, not as final validated budgets. The useful closure now is:

- D1 should assume a job model that can acknowledge quickly, emit early state/progress, surface partial artifacts, and support short-lived replay/reconnect.
- D2 should assume a comparison workspace that comfortably supports `4` strategies, must stretch to `6`, keeps `3-4` panels tightly linked, and treats SVG-only full-detail rendering beyond modest mark counts as unproven rather than guaranteed.
- Both deliberations should treat `1 Hz` live updates, `<= 50 ms` hover, `<= 100 ms` brush propagation, and low-single-digit-second single-job completion as the provisional target regime to design against.

The main epistemic limit is clear: exact crossover points and exact job wall-times still need a harness. That does not make the current output useless. It means the correct stance is "act on these envelopes, but build the harness before treating them as settled truth."

## 19. Confidence Ledger

| Claim / dimension | Confidence | Notes |
| --- | --- | --- |
| Need for coupled two-strata framing | High | Strongly evidenced across audit response, boundary memo, wave-2 review, R1/R2/R4 |
| Visible strategies `4-6` | Likely | Vision and audit pressure justify it; exact upper bound still unmeasured |
| Linked panels `3-4` tightly, `5-6` with degradation | Likely | R2 plus current shell constraints support this |
| Typical panel mark envelope | Plausible | Grounded in current SVG code shape, not yet benchmarked |
| Hover p95 `<= 50 ms` | Likely | Supported by interaction guidance and need to stay well below INP-scale ceilings |
| Brush p95 `<= 75-100 ms` | Likely | Good linked-view target, but unmeasured here |
| Initial render `<= 250/500 ms` | Plausible | Reasonable for fetched artifacts; depends on final artifact shape |
| Live update `0.25-1 Hz` | Likely | Supported by OpenF1 cadence precedent and product vision |
| Session memory soft/hard ceilings | Speculative | Directionally right, exact numbers need measurement on apollo |
| Degradation sequence proposed | Likely | Architecturally coherent and consistent with honesty constraints |
| Submit ack `<= 100/250 ms` | Likely | Standard job-acceptance expectation; should be easy if acceptance is lightweight |
| First progress `<= 250-500 ms` | Plausible | Depends on scheduler/process startup shape |
| Single-race wall-time `0.5-2.0 s` | Speculative | Load-bearing but not honestly validated yet |
| Batch `6x70 laps` in `4-8 s` | Speculative | Derived from interactive expectations and reference hardware, not benchmarked |
| Partial artifact `<= 500 ms` after checkpoint | Plausible | Good contract target, but requires explicit checkpoint semantics |
| Cancellation timing proposed | Plausible | Depends on whether cancellation is safe-point only |
| Terminal event `<= 100-250 ms` | Likely | Should follow from durable state plus event emission |
| Replay window `5-15 min` / `256-1024 events` | Plausible | Useful v1 compromise, not yet justified by observed workloads |

## 20. Unresolved Questions

- What representative Phase 4 race scenario should define the canonical `single-race-70-lap` benchmark fixture?
- Does Phase 4 need true `1 Hz` artifact refresh, or is `0.5 Hz` enough once partial artifacts are well designed?
- How large are branch-comparison artifacts likely to become once regulation snapshots, provenance, and annotation anchors are first-class?
- Will early cancellation be allowed only at lap boundaries, or also within longer compute kernels?
- What exact SVG -> Canvas -> hybrid crossover points appear on apollo once real Phase 4 artifacts exist?
- Should the future tech-debt registry own benchmark violations directly, or should benchmark failures stay in a dedicated benchmark/report directory with registry links?

## 21. References

### Local project files

- `.planning/VISION.md`
- `.planning/PROJECT.md`
- `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`
- `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`
- `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
- `.planning/initiatives/vision-alignment-2026-04/wave-2-structure-review.md`
- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`
- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`
- `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`
- `CLAUDE.md`
- `~/CLAUDE.md`
- `apps/web/src/app/App.tsx:139-247`
- `packages/visuals/src/traces/SpeedProfileTrace.tsx:127-227`
- `packages/visuals/src/inspectors/SensitivityWaterfall.tsx:114-218`
- `packages/sim-core/src/raceModel/raceRunner.ts:123-280`
- `package.json`

### External references

- web.dev, "Measure performance with the RAIL model" — https://web.dev/articles/rail
- web.dev, "Interaction to Next Paint (INP)" — https://web.dev/articles/inp
- MDN, `Performance.measure()` — https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure
- Node.js docs, `perf_hooks` — https://nodejs.org/api/perf_hooks.html
- Playwright docs, Trace Viewer — https://playwright.dev/docs/trace-viewer
- OpenF1 homepage and live-data notes — https://openf1.org/
- OpenF1 authentication/live transport page — https://openf1.org/auth.html

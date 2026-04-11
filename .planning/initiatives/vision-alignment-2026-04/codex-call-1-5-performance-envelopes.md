# Call 1.5: Performance Envelopes Research

**Wave:** 1.5 (targeted follow-up research)
**Model:** gpt-5.4
**Reasoning effort:** high
**Mode:** Terrain mapping with bounded envelope proposal (see RESEARCH-PRINCIPLES.md § Research Modes)
**Task:** R6 (performance envelopes for UI/rendering and job/compute strata)
**Trigger:** All 5 Wave 1 research files independently flagged the absence of measurable performance targets as load-bearing for compute, streaming, and visualization closure. The Codex GPT-5.4 xhigh review of Wave 2 structure decisions confirmed this is a "cross-cutting blocker for compute, streaming, and visualization closure" — not for the entire initiative equally, but for D1 and D2 specifically.

---

## MANDATORY: Read RESEARCH-PRINCIPLES.md first

Before doing ANY task work, read `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` completely. You are in **terrain mapping mode with bounded envelope proposal** — this is a hybrid mode.

What this hybrid means:
- You are NOT picking a winner among architecture options
- You ARE proposing measurable target ranges and methodology
- The proposed envelopes are **provisional** — explicitly framed as "envelopes plus measurement method," not validated truth
- Bounded ranges are an acceptable output if crisp single numbers cannot be honestly justified
- Failure to land on crisp targets is a legitimate outcome under RESEARCH-PRINCIPLES.md § Honest uncertainty

If you find yourself drifting toward "the right number is X" without evidence, stop and re-read the principles. Provisional ranges with explicit uncertainty are MORE useful than confident numbers without warrant.

---

## Why This Round Exists

Wave 1 research surfaced a universal gap: every architectural decision involving compute, streaming, or visualization is underdetermined without measurable targets. The Codex review of Wave 2 structure decisions tightened this finding:

- **Strongly evidenced for D1 (compute) and D2 (visualization) closure:**
  - `research/02-visualization-at-scale.md` § Performance budget methodology, § Gray Areas Encountered, § Unresolved Questions: renderer choice underdetermined without visible strategies, linked panels, latency, cadence, render time, memory, degradation policy
  - `research/04-streaming-architectures.md` § 9 Gray Areas Encountered, § 13 Provisional Position: streaming architecture underdetermined without target update rates, concurrency, completion latencies, failure semantics
  - `research/01-compute-backends.md` § 13 Provisional Position, § 15 Unresolved Questions: backend choice provisional without performance budgets and Phase 5 problem statement

- **NOT equally evidenced for D3 (education) and D5 (regulations):**
  - R3's blockers are concept graph, bindings, authoring, validation
  - R5's blockers are semantic axis choice, schema evolution, execution coupling
  - Performance considerations are adjacent for these but not primary closure criteria

This means your output should be sized and framed as unblocking compute, streaming, and visualization deliberations specifically — not narrated as if the entire initiative is equally frozen without it.

The consequence: this is **not a pure visualization performance research task**. The evidence says it is a **platform performance-envelope task with at least two coupled strata** — UI/rendering envelope and job/compute envelope. You must address both.

---

## Context files (read in this order)

1. `.planning/VISION.md` — the long-term platform vision (READ FIRST — anchor for what "production density" and "real-time" actually mean for this platform)
2. `.planning/PROJECT.md` — current project definition, especially constraints around consumer hardware
3. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodology
4. `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md` — synthesis of Wave 1 convergent insight; pay attention to "Cross-cutting 1: Performance envelope" and to the contract catalog (this memo names what your envelopes will eventually constrain)
5. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — Finding #10 (performance budget novel, accept disposition)
6. `.planning/initiatives/vision-alignment-2026-04/wave-2-structure-review.md` — Codex review section, specifically Decision 2 analysis and the wider-scope refinement
7. `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md` — UI/rendering envelope evidence
8. `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md` — job/compute envelope evidence
9. `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md` — backend trajectory and workload cadence framing
10. `.planning/CLAUDE.md` (project root, not the global one) — repo conventions, especially honesty constraints

You do NOT need to read R3 (education) or R5 (regulation typing) in depth — they are only adjacent to performance work. Skim if helpful, but don't burn context.

## Code files relevant to this research

Only as needed for grounding envelope proposals:

- `apps/web/src/App.tsx` — current 3-zone workspace shell (the structure that bounds "panels per workspace")
- `packages/visuals/src/traces/SpeedProfileTrace.tsx`, `packages/visuals/src/inspectors/SensitivityWaterfall.tsx` — current chart rendering for ballpark complexity
- `packages/sim-core/src/raceModel/raceRunner.ts` — current race simulation entry point for ballpark execution time per simulation
- Root `package.json` for React version

You should NOT instrument or run benchmarks. The output is proposed envelopes + measurement methodology, not measured numbers.

## Shell commands as needed

- `wc -l packages/visuals/src/**/*.tsx 2>/dev/null` — measure visual code base
- `wc -l packages/sim-core/src/**/*.ts 2>/dev/null` — measure compute code base
- `npm view <package> ...` for any precedent verification
- `curl -s <url>` for benchmark methodology references from external sources

---

## Research Task

Produce a single output file: `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md`

The output covers two strata and the methodology that ties them together.

### Stratum A: UI / rendering envelope

For each metric below, propose a target range (or single value if honestly justified) and a measurement method. Bounded ranges with explicit caveats are acceptable.

Required dimensions:

1. **Visible strategies per workspace** — how many simultaneous strategies can a multi-strategy comparison view present at once before it stops being usable?
2. **Linked panels with shared interaction state** — how many panels can share a cursor/brush before sync latency degrades?
3. **Marks per panel** — both for typical Phase 4 timeline panels (~50-70 lap traces) and for dense subsystem traces (per-lap energy state, tire temperature, etc.)
4. **Hover-to-tooltip latency** — target p95 budget for hover responses
5. **Brush-to-linked-panel update latency** — target p95 budget for cross-panel propagation
6. **Initial render time after artifact receipt** — target budget from "data arrived" to "first paint"
7. **Steady-state live-update cadence** — target cadence range for live updating views (note: OpenF1 telemetry cadence is approximately 4 seconds for intervals, 1 minute for weather — this is a precedent worth citing from `research/02-visualization-at-scale.md` § Precedent Analysis)
8. **Memory ceiling per session** — bounds on long-session or branch-comparison memory growth
9. **Degradation policy** — what should happen when a panel exceeds budget? Aggregate, decimate, switch renderer, reduce update frequency? This is a policy decision that affects renderer architecture.

Each dimension should also note:
- Why the target matters (which architectural decision it constrains)
- Confidence (known / likely / plausible / speculative / unknown)
- What measurement method would validate the target
- What "honest deferral" looks like if the target cannot be proposed (revisit-later with criteria)

### Stratum B: Job / compute envelope

For each metric below, propose a target range and a measurement method.

Required dimensions:

1. **Submit-to-acknowledgement latency** — how fast does the API acknowledge a simulation request submission?
2. **Submit-to-first-progress-event latency** — how fast does the first observable progress event appear after submission?
3. **Single race simulation wall-time** — target budget for a representative single 70-lap race simulation on reference hardware (dionysus: Xeon W-2125, GTX 1080 Ti, 32GB RAM — see `~/CLAUDE.md`)
4. **Multi-strategy batch completion** — target budget for representative multi-strategy batches (e.g., 6 strategies × 70 laps in parallel)
5. **Artifact-ready latency for partial results** — how fast can partial artifacts (e.g., per-stint results) become fetchable while later stints are still running?
6. **Cancellation acknowledgement timing** — how fast must a cancellation request take effect?
7. **Terminal-event timing** — how fast must job completion/failure events propagate to subscribers?
8. **Replay/reconnect assumptions** — if a client reconnects mid-job, what should the replay window be? (Or is replay out of scope for v1?)

Same per-dimension notes as Stratum A: why it matters, confidence, measurement method, deferral conditions.

### Worst-plausible scenario catalog

Define 3-5 representative "worst plausible" scenarios for Phase 4 and near-horizon Phase 4.1 work that the envelopes must accommodate. Examples:

- **Strategy comparison scene:** 6 strategies × 4 linked panels × per-lap state × 70 laps × 1Hz update during simulation
- **Race timeline scene:** 1 strategy × Gantt-style timeline × pit events × interruption events × annotation overlays × hover-driven detail
- **Branch comparison scene:** 2 parent runs × 4 branches each × diff visualization × shared cursor across branch panels
- **Educational walkthrough scene:** 1 lesson × guided tour stepping through 8 chart states × annotation overlays × paused scrub controls
- **Observer overlay scene (Phase 4.1):** True/measured/estimated state comparison × time scrubbing × 3 linked panels × per-lap-step data

For each scenario, note which envelope dimensions it stresses and what would constitute pass/fail.

### Measurement methodology

Propose how to actually validate envelopes. This is the closure criteria for "did we hit the budget?"

Required elements:

1. **Reference hardware** — cite dionysus specs (Xeon W-2125 4c/8t, GTX 1080 Ti 11GB, 32GB RAM, NVMe — see `~/CLAUDE.md`) as the v1 baseline. Note when targets should also apply to weaker client hardware (apollo MacBook Air over Tailscale).
2. **Synthetic vs. recorded data** — what fixture data shapes the benchmarks against? Should we record real run artifacts and replay, or generate synthetic data?
3. **Instrumentation points** — where in the codebase should performance markers exist? Browser performance API for UI, server-side timing for jobs?
4. **Pass/fail vs. provisional** — what constitutes a passing benchmark? What constitutes a failure that should be investigated vs. a known-acceptable trade-off?
5. **Benchmark harness sketch** — what does the actual benchmark harness look like? Vitest? Playwright? Custom node script? Lightweight outline only.
6. **Reporting** — how do benchmark results surface to developers and to the tech debt registry?

You do NOT need to implement the harness. You propose its shape.

### Explicit unknowns and closure criteria

For dimensions where you cannot propose envelopes honestly, mark them with the three-response framework:

- **Defer:** dimension is interesting but not load-bearing for D1 or D2 closure
- **Follow-and-mark:** dimension is load-bearing and you investigated but couldn't propose envelopes; mark the gap explicitly with what would resolve it
- **Revisit-later:** dimension is load-bearing and needs a focused future round (e.g., after a benchmark harness is built)

This is a legitimate output. Bounded provisional envelopes plus explicit unknowns are MORE useful than confident envelopes without warrant.

---

## Required output format

Write to `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md`.

Use cat heredoc to write the file. Match the structure of the other research files but adapted to this hybrid mode.

Required sections:

1. **Metadata** — date, mode (terrain mapping with bounded envelope proposal), confidence
2. **Executive Summary** — 3-5 sentences. Honest about what this round can and cannot produce.
3. **Question as Received**
4. **Reframing (if any)** — note the explicit narrowing to "unblocks compute/streaming/viz closure" rather than "unblocks entire initiative"
5. **Assumptions Surfaced** — what does the framing take for granted about what "performance" means here?
6. **Stratum A: UI/rendering envelope** — all 9 dimensions above with target ranges, why-it-matters, confidence, measurement method, deferral conditions
7. **Stratum B: Job/compute envelope** — all 8 dimensions above with same per-dimension structure
8. **Worst-plausible scenario catalog** — 3-5 scenarios with stress dimensions and pass/fail rules
9. **Measurement methodology** — all 6 elements above
10. **Cross-stratum coupling** — which UI envelope constraints depend on job envelope characteristics, and vice versa. This is where the "two coupled strata" framing gets cashed out concretely.
11. **Gray Areas Encountered** — three-response framework
12. **Scope Expansion Notes** — if any
13. **Path of Inquiry** — branching paths considered, pursued, abandoned, reframed
14. **Dependencies and Relations** — explicit references to which deliberations consume this output (D1, D2 strongly; D3, D5 adjacently)
15. **Provisional Position** — your overall read on whether the envelopes are well-grounded enough to act on, or whether they should be revisited after a benchmark harness exists
16. **Confidence Ledger** — per-dimension confidence levels for major envelope claims
17. **Unresolved Questions** — what this round surfaces but cannot answer
18. **References** — research file paths, external benchmark methodology sources, hardware specs

## Completion signal

```
Round 1.5 complete.
- research/06-performance-envelopes.md (XXX lines)

Strata covered: UI/rendering (9 dimensions), Job/compute (8 dimensions)
Worst-plausible scenarios proposed: [N]
Measurement methodology: [outlined / partial / deferred]
Gray areas: [count by response type]
Provisional position: [envelopes ready for D1/D2 consumption / partial / deferred]
```

## Reminders

- **Hybrid mode**: terrain mapping AND bounded envelope proposal. You are NOT picking architecture winners. You ARE proposing target ranges with explicit confidence.
- **Provisional, not validated**: the output should be framed as "proposed envelopes + measurement method," not "the right numbers are X." Bounded ranges with caveats are acceptable.
- **Two strata, coupled**: do not narrow this to a visualization-only investigation. The job/compute envelope is equally important and they couple.
- **Honest deferral allowed**: if you cannot propose an envelope for a dimension, say so explicitly with the three-response framework. Forced answers without warrant are worse than honest unknowns.
- **D1 and D2 are the consumers**: write the output assuming D1's backend boundary deliberation and D2's visualization architecture deliberation will read it as a constraint. D3 and D5 are not equally blocked; do not narrate as if the entire initiative depends on this.
- **Reference hardware is dionysus** (Xeon W-2125, GTX 1080 Ti, 32GB RAM). The user develops via SSH from a MacBook Air (apollo) over Tailscale, so latency targets should consider both the dev server and the thin client.

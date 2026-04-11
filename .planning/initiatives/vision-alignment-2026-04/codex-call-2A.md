# Call 2A: D1 — Backend Boundary Architecture Deliberation

**Wave:** 2a (foundational deliberation)
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** Deliberation (closure attempted, deferral and reframing allowed)
**Question type:** Contract (interface specification — see BOUNDARY-CONTRACT-MEMO.md § Two Kinds of Questions)
**Closes:** C1 (compute execution boundary), C2 (job/event protocol), C3 (artifact/provenance contract), the execution-flow slice of O2 (regulation flow into the compute boundary)
**Consumes:** Round 1.5 performance envelopes (when ready)
**Feeds:** D2 (visualization), D3 (educational content), D5 (regulation semantic model), D4 (long-horizon roadmap)

---

## MANDATORY: Read These Documents Before Any Task Work

In this exact order:

1. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodology. You are in **deliberation mode** (closure attempted). Deferral and reframing are valid outcomes per § 10 "Deferral as a valid outcome."

2. `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md` — synthesis of Wave 1 convergent insight. **This is the canonical framing for what you are closing.** It names the contracts you own, the closure criteria, and the cross-cutting constraints you must honor. Treat this as the primary scaffolding for your output.

3. `.planning/VISION.md` — long-term platform vision. Anchor for everything.

4. `.planning/PROJECT.md` — current project definition

5. `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md` — compute language/runtime terrain

6. `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md` — job/event protocol terrain

7. `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md` — regulation typing terrain. **Read § 9 Gray Areas Encountered (gray area 1) and § 10 Scope Expansion Notes carefully** — these document the discovered coupling between regulation typing and execution architecture. You are responsible for the execution-flow slice of this; D5 will handle the semantic-model slice.

8. `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md` — performance constraints from Round 1.5 (when ready). Consume the UI/rendering envelope as adjacent context, but treat the **job/compute envelope** as a hard input to your deliberation.

9. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — Findings #3, #4, #5, #6 are directly relevant to your scope

## Supporting reads as needed

- `packages/sim-core/src/contracts.ts` — current synchronous SimulationHarness
- `packages/sim-core/src/raceModel/raceRunner.ts` — current race orchestration
- `apps/local-api/src/services/runService.ts` — the "god service" (~900 LOC) that mixes compute orchestration, preset loading, and persistence — this is the current state of the boundary you are restructuring
- `apps/local-api/src/routes/runs.ts` — HTTP dispatch
- `packages/domain/src/runs/schema.ts` — current run record shape (which constrains current artifact assumptions)
- `packages/domain/src/presets/schema.ts` — current preset shape (the regulation typing problem starts here)
- `packages/sim-core/src/stintModel/electricalModel.ts` — the file with hardcoded 2026 electrical constants that R5 surfaced as a coupling point

---

## What You Are Closing

You are deliberating four coupled contracts that together constitute the **backend boundary architecture**:

### Contract 1: Compute execution boundary (C1)

The interface separating "what compute to run" from "how compute happens." Concretely, you are closing:

- The shape of a `SimulationBackend` interface (or whatever you choose to call it) that abstracts execution from transport
- Whether the initial implementation is in-process TypeScript, sidecar process, or another shape
- What the migration path looks like across the 1-year, 3-year, 5-year horizons
- Where this boundary lives in the package layout

Closure criteria: interface specification + initial implementation choice + migration shape

### Contract 2: Job/event protocol (C2)

The protocol for submit/observe/fetch/cancel job lifecycle. You are closing:

- The shape of typed event unions (which events exist, what payload each carries)
- The subscription model (per-job, broadcast, filtered)
- Cancellation semantics (best-effort vs. state-machine)
- Reconnection and replay semantics (or explicit deferral with criteria)
- Transport choice for the protocol (WebSocket / SSE / chunked HTTP / gRPC), conditional on R1.5 envelope evidence

Closure criteria: event union shape + subscription semantics + cancellation/replay model + transport binding

### Contract 3: Artifact / provenance contract (C3)

**This is the cross-cutting concern Codex's review identified as missing from no-single-deliberation ownership.** You own it. D2 and D3 will *consume* this contract; they cannot redefine it.

You are closing:

- What constitutes a typed artifact (envelope shape, type tags, schema version)
- How artifacts are identified (stable IDs across sessions and runs)
- What provenance fields each artifact carries (parent run, branch lineage, regulation snapshot reference, simulation harness ID, scenario hash, etc.)
- How artifact schemas evolve (versioning approach, migration story)
- How artifacts are fetched separately from live events (durable storage interface)
- How artifacts reference each other and reference regulations

This contract is referenced by R1, R2, R3, and R4 — you need to design it such that all four consumers can use it without renegotiation. Read the relevant sections of those research files explicitly to understand what each consumer needs.

Closure criteria: typed artifact envelope shape + ID semantics + provenance fields + evolution rules + fetch interface

### Contract 4: Regulation execution-flow slice (O2 partial)

R5 surfaced an unplanned coupling: regulation semantics are split between domain preset files, API extraction code, and hardcoded `sim-core` constants. The execution-flow portion of regulation handling is yours; the semantic model portion belongs to D5.

You are closing:

- Where regulation documents are canonicalized relative to the compute boundary (in domain layer? API layer? sim-core layer?)
- What typed regulation information crosses the backend request boundary (the full preset? a canonicalized subset? a derived "execution-relevant" view?)
- Whether run snapshots store raw documents, canonicalized runtime form, or both
- How artifacts and provenance reference regulation family and schema version (this connects to C3)
- Which `sim-core` hardcodings (e.g., the 2026 electrical constants in `electricalModel.ts`) must end for multi-era execution to work, and how the migration path looks

You are NOT closing:
- Era-family vs capability-first vs hybrid runtime organization (D5)
- Schema versioning approach for the regulation domain (D5)
- Cross-era comparability semantics (D5)
- Override model (D5)

D5's deliberation will operate within whatever execution-flow contract you produce. If your contract is too restrictive for D5's semantic model needs, D5 should push back during its own work and you may need to revise.

Closure criteria: contract — interface specification for regulation data crossing the compute boundary + migration path for sim-core hardcoding removal

---

## Cross-Cutting Constraints You Must Honor

From `BOUNDARY-CONTRACT-MEMO.md` § Cross-Cutting Constraints:

1. **Performance envelope (Round 1.5):** consume `research/06-performance-envelopes.md` as a hard input. The job/compute envelope dimensions (submit-to-ack latency, batch completion targets, artifact-ready latency, cancellation timing, replay/reconnect assumptions) directly constrain your contracts. If R1.5 hasn't landed yet, draft against the worst-plausible scenarios and explicitly mark dependencies on R1.5 outcomes for revision after you read it.

2. **Cross-era comparability affordance:** your artifact contract (C3) must accommodate non-comparable, derived-equivalence, and family-specific states across regulation eras. This is forward-flowing — D2's visualization architecture and D3's lesson architecture will both need to express these states. If C3 doesn't reserve space for them, D2/D3 will be silently constrained.

3. **Honesty constraints on placeholder vs real fidelity:** the artifact contract should support provenance fields that distinguish placeholder/reduced-order outputs from validated/high-fidelity outputs. CLAUDE.md and the audit response require this.

4. **The label-trap:** **DO NOT close at label level.** "We picked Python" is not a valid closure. The valid closure is "the backend boundary contract is X (interface specification), the initial implementation is Python because Y (warranted by R1.5 envelope evidence + R1 ecosystem analysis + 1/3/5-year trajectory considerations), and the migration shape is Z (how the contract supports later replacement of the initial implementation)." The label is downstream of the contract; the contract is the actual decision. If you find yourself writing "Python is the right choice" without naming the contract first, stop and re-read this section.

---

## Required Deliberation Format

Follow `RESEARCH-PRINCIPLES.md` § Required Output Sections for deliberation files. Mandatory sections:

1. **Metadata** — date, mode (deliberation), inputs consumed (which research files + the boundary memo), reasoning effort
2. **Question** — the four contracts you are closing, with any reframing from research
3. **Stakes** — what gets locked in or kept open by these decisions; who downstream depends on them
4. **Option Space (inherited from research, not re-invented)** — for each of the four contracts, the option space R1/R4/R5/R6 surfaced
5. **Tradeoffs** — not pros/cons but tradeoffs across time horizons (1/3/5-year) and dependencies (which other contracts each option implies)
6. **Gray Areas Still Unresolved** — what remains uncertain after research, using the three-response framework
7. **Closure Analysis** — for each contract: can it be closed now? On what evidence? If not, why not? What would resolve it?
8. **Outcome** — for each contract, ONE of:
   - **Recommendation** with warrant (closes the contract on a specific shape)
   - **Provisional recommendation** with closure criteria for revisiting
   - **Deferral** with explicit closure criteria (what would need to be true to decide)
   - **Reframing** (the question should be different)
9. **Implications if Closed / Implications if Deferred** — what follows from each outcome
10. **Dependencies and Relations** — explicit references to:
    - Which contracts D2 must consume (the artifact envelope shape, primarily)
    - Which contracts D3 must consume (artifact bindings, lesson-relative anchors built on top of C3)
    - Which contracts D5 must accept as constraints (the regulation execution-flow contract from this deliberation)
    - Cross-cutting concerns this deliberation touches that deserve roadmap synthesis attention (D4)
11. **Path of Deliberation** — how the reasoning proceeded across the four contracts; where coupling between them surfaced; where you found yourself wanting to push back on the boundary memo
12. **Open Sub-questions** — what this deliberation surfaces but does not resolve
13. **Decision Record** — empty template for user to fill in:
    ```
    ## Decision Record (to be filled by user)

    ### Contract 1 (compute execution boundary)
    - Decision:
    - Rationale:
    - Date:
    - Decider:

    ### Contract 2 (job/event protocol)
    - Decision:
    - Rationale:
    - Date:
    - Decider:

    ### Contract 3 (artifact/provenance contract)
    - Decision:
    - Rationale:
    - Date:
    - Decider:

    ### Contract 4 (regulation execution-flow slice)
    - Decision:
    - Rationale:
    - Date:
    - Decider:
    ```

Additionally, produce a **decision anchor** companion file at `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md` (~1 page, used by later deliberations as compact summary instead of re-reading the full file). The anchor must include:

- One-paragraph summary of each closed/deferred/reframed contract
- The most important constraint each contract imposes on D2, D3, D5
- The most important open question each contract leaves unresolved

---

## Output File

Write to `.planning/initiatives/vision-alignment-2026-04/deliberations/01-backend-boundary-architecture.md`

Use cat heredoc.

Also write the decision anchor to `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md` — same heredoc pattern.

## Completion signal

```
Wave 2A (D1) complete.
- deliberations/01-backend-boundary-architecture.md (XXX lines)
- deliberations/01-decision-anchor.md (XX lines)

Contracts addressed:
- C1 (compute execution boundary): [closed/provisional/deferred/reframed]
- C2 (job/event protocol): [closed/provisional/deferred/reframed]
- C3 (artifact/provenance contract): [closed/provisional/deferred/reframed]
- C4 (regulation execution-flow slice): [closed/provisional/deferred/reframed]

Performance envelope integration: [consumed / partial / not yet available]
Push-back on boundary memo: [yes — see section X / no]
```

## Reminders

- **xhigh reasoning is for substantive deliberation** — use it. Don't rush to close.
- **Deferral is valid.** If a contract isn't ready to close, defer with closure criteria. Forced closure without warrant is worse than honest deferral.
- **Reframing is valid.** If your work surfaces that the four contracts should be cut differently — for example, that C3 (artifact contract) deserves its own deliberation, or that C4 should be merged into D5 — say so explicitly. Push back on the boundary memo's framing.
- **Consume Round 1.5 as a hard constraint** for the job/compute envelope dimensions. If R1.5 isn't available when you start, mark every R1.5-dependent decision as "pending R1.5 outcome" and produce a draft that gets revised after R1.5 lands.
- **No label-level closure.** "Python," "WebSocket," "in-process," "sidecar" — these are downstream of the contract. The contract is the decision.
- **The artifact contract (C3) is the most important thing you do.** It is referenced by 4 of 5 research files and currently has no owner. If your deliberation gets it wrong, D2 and D3 will inherit a broken assumption. Take time on this one.
- **Honesty constraints**: every contract you close should support placeholder/real-fidelity distinction in artifacts and outputs.

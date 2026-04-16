# Call 2D: D4 — Long-Horizon Roadmap Synthesis Deliberation

**Wave:** 2d (roadmap synthesis deliberation after D1/D2/D3/D5)
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** Deliberation (closure attempted, deferral and reframing allowed)
**Question type:** Synthesis (roadmap projection, sequencing, and deferral criteria)
**Closes:** D4 (long-horizon roadmap synthesis)
**Consumes (as hard constraints):** D1/D2/D3/D5 decision anchors, all research outputs, VISION.md, REQUIREMENTS.md, ROADMAP.md, audit-response-2026-04-10.md
**Feeds:** Stage 3 synthesis (`3A` roadmap evolution + phase insertion proposals, `3B` guardrails + tech-debt registry + SUMMARY), later ROADMAP.md updates, later Claude cross-model audit before D4 acceptance

---

## MANDATORY: Read These Documents Before Any Task Work

In this exact order:

1. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodology. You are in **deliberation mode** even though this is synthesis-shaped work. Deferral and reframing are valid outcomes.

2. `.planning/VISION.md` — the long-horizon platform vision. D4 exists to project the roadmap toward this vision, not merely to tidy the current phase list.

3. `.planning/PROJECT.md` — current project definition, active commitments, open questions, and core-value framing.

4. `.planning/REQUIREMENTS.md` — D4 must respect requirement sequencing and surface where the current roadmap under- or over-serves requirements.

5. `.planning/ROADMAP.md` — current roadmap state. You are not editing it, but you are evaluating whether it remains structurally honest after D1-D5.

6. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — especially Findings 3-15, the six must-haves, the proposed follow-up plan, and the explicit question "where does the platform come into its own?"

7. `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md` — synthesis scaffolding for the contracts, ontologies, and cross-cutting constraints that now need roadmap embodiment.

8. `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md` — D1 backend boundary architecture

9. `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md` — D2 visualization architecture

10. `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md` — D3 educational content architecture

11. `.planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md` — D5 regulation semantic model

12. Wave 1 / 1.5 research outputs — read all six because D4 is explicitly a synthesis deliberation:
   - `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`
   - `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`
   - `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md`
   - `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`
   - `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`
   - `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md`

## Supporting reads (as needed for grounding)

- `.planning/initiatives/vision-alignment-2026-04/PLAN.md` — current initiative tracker only; do not treat it as substantive input over the accepted anchors
- `.planning/requirements-traceability.md` or other traceability aids if discovered relevant
- Current roadmap-adjacent phase context files only if you need to ground a specific sequencing concern; do not context-sprawl

---

## What You Are Closing

D4 is not a new contract or ontology. It is the **roadmap synthesis deliberation** that follows from the now-accepted D1/D2/D3/D5 architecture work.

You are closing:

- what must be true before Phase 4 planning can honestly resume
- whether the current roadmap needs inserted phases, split phases, renamed phases, or dependency changes after D1-D5
- what the remaining v1 milestone path should look like in light of accepted backend, visualization, education, and regulation architecture
- how the roadmap should project beyond v1 into v2 / v3 / v4+
- where the platform "comes into its own" rather than merely accumulating features
- what should remain deferred, and what triggers should cause those deferrals to be revisited
- what Stage 3 must concretely produce as roadmap diffs, phase insertion proposals, guardrails, and tech-debt artifacts

**Closure criteria:** explicit sequencing logic + milestone-boundary recommendations + v2/v3/v4+ thematic projection + concrete deferral / trigger logic + clear handoff to Stage 3 without rewriting ROADMAP.md inside D4

### What You Are NOT Closing

Do **not**:

- reopen D1, D2, D3, or D5 accepted closures
- directly edit `.planning/ROADMAP.md`, `.planning/PROJECT.md`, `.planning/CLAUDE.md`, or phase context files
- draft exact phase implementation plans (`PLAN.md` files for roadmap phases)
- collapse the work into buzzword milestone labels without dependency reasoning
- choose package names, schema file layouts, or implementation details that belong to later planning

You may recommend that Stage 3 propose roadmap edits, phase insertions, and guardrail files. You are not making those file changes here.

---

## Cross-Cutting Constraints You Must Honor

D4 must carry the accepted architectural commitments into roadmap shape rather than treating them as local implementation details.

### 1. Accepted architecture must become sequencing, not footnotes

D1-D5 are not background commentary. If the roadmap that follows them does not visibly embody:
- async compute / artifact / streaming boundaries
- visualization substrate and workspace-shell consequences
- educational content and preview/validation tooling
- regulation canonicalization and comparison semantics
then the initiative will have produced architecture with no roadmap consequence.

### 2. UI discipline commitments are roadmap commitments

Accessibility, thin-client responsiveness, and visible honesty labeling were accepted as architectural commitments in D2 and D3. D4 must keep them visible in roadmap structure. They cannot disappear into generic implementation polish.

### 3. Scientific compute is now an explicit roadmap thread

Finding #15 and D1 together mean the roadmap can no longer remain silent on computational-backend evolution. D4 does not need to choose the eventual language stack beyond D1's first implementation, but it must project where serious numerical / optimization / calibration work lives in v2/v3/v4+.

### 4. The label-trap still applies in roadmap form

Do not close at the level of milestone names alone.

Bad shape:
- "v2 = backend"
- "v3 = regulation"
- "v4 = collaboration"

Good shape:
- what dependency forced the phase boundary
- what becomes possible only after that work lands
- what remains deferred and why

### 5. Distinguish immediate blockers from long-horizon aspirations

D4 should not pull every vision-worthy thread into pre-Phase-4 work. It must separate:
- what blocks honest Phase 4 planning now
- what belongs in the remaining v1 milestone path
- what is real but properly v2/v3/v4+

This is the main anti-scope-creep discipline for D4.

---

## Required Deliberation Format

Follow `RESEARCH-PRINCIPLES.md` § Required Output Sections for deliberation files. In addition to the standard sections, D4 has **four explicit required subsections**.

### Standard mandatory sections

1. **Metadata** — date, mode, reasoning effort, inputs consumed
2. **Question** — D4 roadmap synthesis question, with any reframing
3. **Stakes** — what roadmap consequences follow from D1-D5; what happens if D4 stays vague
4. **Option Space** — the meaningful roadmap-shape options, inherited from the audit response, current roadmap, and accepted anchors
5. **Tradeoffs** — across near-term execution, 1/3/5-year horizons, and sequencing dependencies
6. **Gray Areas Still Unresolved** — using the three-response framework
7. **Closure Analysis** — what D4 is ready to close now, and what must remain deferred
8. **Outcome** — recommendation / provisional recommendation / deferral / reframing
9. **Implications if Closed / Implications if Deferred** — especially for Stage 3 and ROADMAP.md evolution
10. **Dependencies and Relations** — explicit relations among D1/D2/D3/D5, current roadmap phases, and future milestones
11. **Path of Deliberation** — which roadmap-shape branches were considered and why they were kept or rejected
12. **Open Sub-questions** — surfaced but unresolved
13. **Decision Record** — empty template for user to fill in

### Additional D4-specific required subsections

These subsections are mandatory and must be present somewhere in the deliberation.

#### D4.A: Pre-Phase-4 gate and foundation insertions

You must explicitly address:

- whether new roadmap phases or decimal phases are required before Phase 4 planning can honestly resume
- whether the accepted architecture implies new foundation work between current Phase 3.1 and current Phase 4
- what kinds of work belong in those insertions if they are recommended
  - backend/streaming implementation follow-through from D1
  - visualization substrate / shell / token / benchmark harness implementation follow-through from D2
  - educational preview / validation / authoring foundation from D3
  - regulation canonicalization / comparability registry groundwork from D5
- whether these should be separate insertions, folded into a reshaped Phase 4 foundation wave, or handled another way

This is the main place D4 must answer "what must happen before Phase 4 planning resumes?"

#### D4.B: Remaining v1 milestone reshaping

You must explicitly address:

- whether the current roadmap phases 4, 4.1, 5, 6, 7, and 8 still have the right boundaries after D1-D5
- whether education, observer work, control work, validation, and regulation/design exploration now need different sequencing
- whether the current Phase 4 is too broad, too shallow, or structurally mis-cut
- what the remaining v1 milestone path should optimize for once the new foundations are acknowledged

Do not merely restate the current roadmap. Evaluate whether it still serves the accepted architecture.

#### D4.C: v2 / v3 / v4+ projection

You must explicitly address:

- how far the roadmap should honestly project beyond v1
- what the major themes of v2, v3, and v4+ should be if the platform follows the accepted architecture
- where the scientific-compute migration story, historical regulation expansion, calibration depth, competitive/reference layers, and broader product expansion belong
- where the platform "comes into its own" rather than just extending the v1 loop

This subsection should answer the audit response's forward-projection question with real sequencing logic, not vague aspiration.

#### D4.D: Deferrals, rewrite triggers, and Stage 3 handoff

You must explicitly address:

- which important items should remain deferred even after D4
- what triggers should cause those items to be revisited
- what rewrite triggers or tech-debt edges Stage 3 should capture explicitly
- what concrete kinds of outputs Stage 3 must now produce for ROADMAP.md, phase insertion proposals, guardrails, and SUMMARY

This is where D4 hands the initiative cleanly into Stage 3 instead of trying to do Stage 3's work prematurely.

### Decision Record template

```markdown
## Decision Record (to be filled by user)

### D4 (long-horizon roadmap synthesis)
- Decision:
- Rationale:
- Date:
- Decider:

### D4.A (pre-Phase-4 gate and foundation insertions)
- Decision / Scope disposition:
- Rationale:
- Implication for roadmap diff:

### D4.B (remaining v1 milestone reshaping)
- Decision / Commitment level:
- Rationale:
- Milestone implication:

### D4.C (v2 / v3 / v4+ projection)
- Decision / Commitment level:
- Rationale:
- Horizon note:

### D4.D (deferrals, rewrite triggers, and Stage 3 handoff)
- Decision / Commitment level:
- Rationale:
- Handoff to Stage 3:
```

---

## Decision Anchor Companion File

After writing the main deliberation, produce a decision anchor at `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md` (~1 page, dense). Stage 3 will consume this anchor rather than the full deliberation. The anchor must include:

- one-paragraph summary of D4's overall outcome
- the most important Phase 4 planning implication
- the most important roadmap-shape implication for Stage 3A
- the most important guardrail / tech-debt implication for Stage 3B
- the most important unresolved question D4 leaves for future milestone audits
- brief disposition on D4.A-D

Format should mirror the prior decision anchors — dense paragraphs, not bullet lists.

---

## Output Files

Write to:

- `.planning/initiatives/vision-alignment-2026-04/deliberations/05-long-horizon-roadmap.md` (main deliberation)
- `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md` (dense summary)

Use cat heredoc for both.

## Completion Signal

```text
Wave 2D (D4) complete.
- deliberations/05-long-horizon-roadmap.md (XXX lines)
- deliberations/05-decision-anchor.md (XX lines)

Items addressed:
- D4 long-horizon roadmap synthesis: [closed/provisional/deferred/reframed]

D4-specific subsections:
- D4.A (pre-Phase-4 gate / foundation insertions): [closed/provisional/deferred]
- D4.B (remaining v1 milestone reshaping): [closed/provisional/deferred]
- D4.C (v2 / v3 / v4+ projection): [closed/provisional/deferred]
- D4.D (deferrals / rewrite triggers / Stage 3 handoff): [closed/provisional/deferred]

Push-back on current roadmap or accepted deliberations: [yes — see section X / no]
```

## Reminders

- **This is still a deliberation, not a file-editing phase.** Do not rewrite `ROADMAP.md` here.
- **D4 must synthesize, not merely recap.** If the output just summarizes D1-D5 without changing roadmap understanding, it has failed.
- **Deferral is valid.** D4 may conclude that some horizon questions should remain open with explicit revisit triggers.
- **Do not reopen D1-D5.** Their accepted closures are inputs, not fresh debates.
- **Do not let the roadmap hide accepted architectural costs.** If the architecture implies real foundation work, D4 must make that visible.
- **Avoid roadmap label-slop.** Name the dependency logic that justifies each projected milestone boundary.

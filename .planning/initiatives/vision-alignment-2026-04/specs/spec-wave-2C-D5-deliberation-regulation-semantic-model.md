# Call 2C: D5 — Regulation Semantic Model Deliberation

**Wave:** 2c (regulation semantic-model deliberation after D1/D2/D3)
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** Deliberation (closure attempted, deferral and reframing allowed)
**Question type:** Ontology (organizing axes plus explicit non-comparability rules)
**Closes:** O2 semantic-model slice (regulation identity / version / capability model)
**Consumes (as hard constraints):** D1 decision anchor, D2 decision anchor, D3 decision anchor, R5 research, BOUNDARY-CONTRACT-MEMO.md
**Feeds:** D4 (long-horizon roadmap), Phase 4 planning, synthesis stage

---

## MANDATORY: Read These Documents Before Any Task Work

In this exact order:

1. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodology. You are in **deliberation mode**. O2 is an ontology question. Deferral and reframing are valid outcomes.

2. `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md` — canonical framing for what you are closing. **Pay particular attention to:**
   - "Two Kinds of Questions" — O2 is ontology-shaped, not contract-shaped
   - `Ontology 2` — your primary scope
   - `Cross-Cutting Constraints 1-4` — these are your primary cross-cutting constraints
   - the note that D1 owns the execution-flow slice while D5 owns the semantic-model slice

3. `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md` — D1's closed contracts. This is a fixed input. You cannot reopen the execution-flow contract; you must produce a semantic model that compiles cleanly to D1's `ExecutionRegulationSnapshot`.

4. `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md` — D2's accepted/provisional visualization constraints. Pay attention to:
   - visible `semanticApplicability` states on comparison surfaces
   - cross-era non-comparability needing to surface through renderer and anchor fallback behavior
   - fidelity / validation / applicability being first-class visible UI states

5. `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md` — D3's accepted/provisional educational constraints. Pay attention to:
   - lesson bindings needing `direct`, `derived`, `family-specific`, or `non-comparable` semantics without false equivalence
   - `RegulationApplicability` and explicit non-applicability rules
   - the requirement that lessons remain honest when cross-era bindings do not map directly

6. `.planning/VISION.md` — the long-term platform vision, especially the multi-regulation scope and the requirement that presets not be hardcoded to 2026.

7. `.planning/REQUIREMENTS.md` — especially `DESN-01`, `VISU-04`, `VISU-03`, `EDU-01`, `EDU-02`, `EDU-03`, and `VAL-01`.

8. `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md` — R5 terrain map. This is your primary option-space input.

9. `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md` — secondary context only. D5 is not equally blocked by R1.5, but you should understand the loose-to-moderate performance coupling for comparison scenes.

10. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — especially the accepted finding that regulation typing is under-specified and must stop being 2026-shaped.

11. `.planning/initiatives/vision-alignment-2026-04/reviews/review-wave-2-structure-decisions.md` — specifically the rationale for splitting R5 into D1 execution-flow + D5 semantic-model rather than collapsing both into one deliberation.

## Supporting reads (for grounding, not for reopening D1)

- `packages/domain/src/presets/schema.ts` — current loose preset document shape
- `packages/domain/src/runs/schema.ts` — current snapshot shape
- `packages/domain/src/scenario/schema.ts` — scenario references to preset identity
- `apps/local-api/src/services/runService.ts` — current regulation extraction/casting behavior
- `packages/sim-core/src/stintModel/electricalModel.ts` — 2026-hardcoded electrical semantics that D1 already identified as contract debt

---

## What You Are Closing

You are deliberating the **semantic-model slice** of regulation architecture. D1 already closed the execution-flow slice. Your job is to close the ontology question that remains.

### Ontology 2: Regulation identity / version / capability model

This is an ontology question. You are closing:

- The primary organizing axis for regulation identity:
  - era-family-first
  - capability-first
  - hybrid
  - or another explicitly justified structure
- The relation among:
  - regulation family identity
  - capability presence / absence
  - document schema version
- The minimum viable canonical runtime model for multi-era regulation semantics
- How cross-era comparability should be modeled:
  - what is directly comparable
  - what is only derivably comparable
  - what is family-specific
  - what is explicitly non-comparable
- The override model for regulation patches or variants
- Whether stable semantic identifiers are required beyond property names
- What constraints this ontology imposes on the compiler step that produces D1's `ExecutionRegulationSnapshot`

**Closure criteria:** primary axis choice + minimum viable semantic model + schema evolution posture + explicit comparability / non-comparability rules + override posture + clean handshake to D1's execution snapshot

### What You Are NOT Closing

Do **not** reopen or renegotiate:

- D1's execution-flow contract
- D1's artifact / provenance contract
- D2's renderer / interaction / anchor contracts
- D3's lesson ontology or content-side binding semantics
- exact package APIs, exact Zod syntax, or implementation file placement

You may identify tensions those contracts create, but the correct response is to mark them as implications or future synthesis inputs, not to silently reopen accepted closures.

---

## Cross-Cutting Constraints You Must Honor

From `BOUNDARY-CONTRACT-MEMO.md`, D5 inherits four primary cross-cutting constraints. Honor them explicitly.

### 1. Performance envelope (secondary input, not a primary closure criterion)

D5 is not blocked the way D1 and D2 were, but your ontology still affects comparison pressure:

- A semantic model that explodes every cross-era comparison into bespoke per-era branches may become unusable for D2/D3 surfaces.
- A semantic model that collapses too aggressively may look simple while hiding non-comparability and downstream branch pressure.
- You should acknowledge the loose-to-moderate performance coupling without turning D5 into a benchmark exercise.

### 2. Cross-era comparability affordance

This is your hardest downstream responsibility.

Your ontology must make it possible for D2 and D3 to express:

- directly comparable
- derived-equivalence / derived-comparable
- family-specific
- non-comparable

Do not leave comparability as an implicit future visualization concern. D2 and D3 already accepted contracts that require these states to be surfaced honestly.

### 3. Honesty constraints on placeholder vs real fidelity

Comparability semantics must not erase fidelity semantics.

- A metric can be semantically comparable but still low-fidelity.
- A metric can be high-fidelity but not semantically comparable across families.
- Your ontology should preserve the distinction between "same kind of thing" and "same validation status."

If your model would encourage the UI or content layers to present cross-era comparisons as more authoritative than the underlying artifacts warrant, that is a design failure.

### 4. The label-trap

Do not close at label level:

- not "discriminated union wins"
- not "capability modules win"
- not "schema version is the main key"

Close at ontology level: what the durable semantic axes are, what stays stable, what varies, how comparability works, and what the first implementation representation should be in service of that ontology.

### Adjacent downstream constraint (not a primary closure criterion)

Accessibility, thin-client rendering, and visible UI surfacing are primarily D2/D3 responsibilities, but D5 must output states those layers can actually present:

- compact enough to surface in labels, badges, legends, and lesson callouts
- explicit enough that "not comparable" is not recoverable only from prose
- stable enough that future artifacts and lessons can carry them without ad hoc reinterpretation

---

## Required Deliberation Format

Follow `RESEARCH-PRINCIPLES.md` § Required Output Sections for deliberation files. In addition to the standard sections, D5 has **four explicit required subsections**.

### Standard mandatory sections

1. **Metadata** — date, mode, reasoning effort, inputs consumed
2. **Question** — O2 semantic-model slice, with any reframing
3. **Stakes** — what gets locked in or kept open; which downstream consumers depend on this ontology
4. **Option Space** — inherited from R5 and adjacent decision anchors, not re-invented
5. **Tradeoffs** — across 1/3/5-year horizons and dependencies
6. **Gray Areas Still Unresolved** — using the three-response framework
7. **Closure Analysis** — can O2 close now? on what evidence? if not, why not?
8. **Outcome** — recommendation / provisional recommendation / deferral / reframing
9. **Implications if Closed / Implications if Deferred** — especially for D4 and Phase 4 planning
10. **Dependencies and Relations** — explicit references to D1/D2/D3 constraints and future roadmap implications
11. **Path of Deliberation** — branching paths, reframings, pushback on the memo or on D1/D2/D3 assumptions
12. **Open Sub-questions** — surfaced but unresolved
13. **Decision Record** — empty template for user to fill in

### Additional D5-specific required subsections

These subsections are mandatory and must be present somewhere in the deliberation.

#### D5.A: Primary organizing axis and canonical runtime shape

You must explicitly address:

- whether the primary axis is era-family-first, capability-first, hybrid, or another structure
- what the minimum viable canonical runtime model is
- how family identity, capability presence, and runtime discrimination relate
- why this closure is ontology-shaped rather than implementation-shaped

This subsection is where you operationalize the label-trap for regulation modeling.

#### D5.B: Schema versioning and migration posture

You must explicitly address:

- whether `schemaVersion` is independent from semantic family identity
- whether raw documents, canonicalized forms, or both matter for migration
- what kind of migration or compatibility posture the project should assume
- whether old preset files and historical run snapshots need the same compatibility promise

Do not collapse schema evolution into family identity.

#### D5.C: Comparability, applicability, and non-comparability semantics

You must explicitly address:

- what kinds of regulation-aware comparison states are required
- how those states relate to D2's `semanticApplicability` slot and D3's lesson applicability / binding semantics
- when a metric is directly comparable, derivably comparable, family-specific, or non-comparable
- whether comparability belongs on metrics, artifacts, regulation families, or a combination

This subsection is the main place where D5 must feed honest downstream behavior into D2 and D3 without reopening their accepted contracts.

#### D5.D: Override model, semantic identifiers, and compile-to-execution handshake

You must explicitly address:

- what kind of override model the ontology implies (shallow merge, deep merge, field-aware patch, or another)
- whether stable semantic identifiers are needed beyond current property names
- how the chosen ontology compiles into D1's `ExecutionRegulationSnapshot`
- what information D1's snapshot must preserve from the ontology for artifacts, lessons, and comparisons to stay honest

Do not reopen D1's contract shape. Close the ontology-side obligations it imposes on the compiler and on future preset authoring.

### Decision Record template

```markdown
## Decision Record (to be filled by user)

### Ontology 2 (regulation identity / version / capability model)
- Decision:
- Rationale:
- Date:
- Decider:

### D5.A (primary organizing axis and canonical runtime shape)
- Decision / Scope disposition:
- Rationale:
- Handoff to: (phase or future plan)

### D5.B (schema versioning and migration posture)
- Decision / Scope disposition:
- Rationale:
- Handoff to: (phase or future plan)

### D5.C (comparability, applicability, and non-comparability semantics)
- Decision / Commitment level:
- Rationale:
- Downstream implication for D2/D3:

### D5.D (override model, semantic identifiers, and compile-to-execution handshake)
- Decision / Commitment level:
- Rationale:
- Constraint on D1 / Phase 4 planning:
```

---

## Decision Anchor Companion File

After writing the main deliberation, produce a decision anchor at `.planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md` (~1 page, dense). D4 will consume this anchor instead of the full deliberation. The anchor must include:

- one-paragraph summary of O2's outcome
- the most important constraint D5 imposes on D4's roadmap synthesis
- the most important constraints D5 imposes on Phase 4 planning
- the most important adjacent implications for D2 and D3 surfaces
- the most important open question each D5.A-D subsection leaves unresolved
- brief disposition on D5.A-D

Format should mirror `01-decision-anchor.md`, `02-decision-anchor.md`, and `03-decision-anchor.md` — dense paragraphs, not bullet lists.

---

## Output Files

Write to:

- `.planning/initiatives/vision-alignment-2026-04/deliberations/04-regulation-semantic-model.md` (main deliberation)
- `.planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md` (dense summary)

Use cat heredoc for both.

## Completion Signal

```text
Wave 2C (D5) complete.
- deliberations/04-regulation-semantic-model.md (XXX lines)
- deliberations/04-decision-anchor.md (XX lines)

Items addressed:
- O2 semantic-model slice (regulation identity / version / capability model): [closed/provisional/deferred/reframed]

D5-specific subsections:
- D5.A (primary organizing axis / runtime shape): [closed/scoped-out-with-handoff/deferred]
- D5.B (schema versioning / migration posture): [closed/scoped-out-with-handoff/deferred]
- D5.C (comparability / applicability / non-comparability): [closed/provisional/deferred]
- D5.D (override model / semantic identifiers / D1 handshake): [closed/provisional/deferred]

Push-back on D1/D2/D3 or the boundary memo: [yes — see section X / no]
```

## Reminders

- **xhigh reasoning is for substantive deliberation** — use it. Do not rush to close.
- **Deferral is valid.** If part of O2 is not ready to close, defer it with explicit closure criteria.
- **Reframing is valid.** If the ontology cut-line should be drawn differently, say so explicitly.
- **Do not reopen D1.** Consume D1's execution-flow contract as fixed input and close the ontology that compiles into it.
- **Comparability is the downstream load-bearing output.** If D5 closes on a model that still leaves D2 and D3 guessing what counts as comparable, the deliberation has failed its main job.
- **No label-level closure.** Era-family, capability modules, schema versioning, branded helpers, Zod patterns — these are downstream of the ontology, not the ontology itself.

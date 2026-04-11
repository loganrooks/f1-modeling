# Call 2B-ii: D3 — Educational Content Architecture Deliberation

**Wave:** 2b-ii (second of the iterative D2 -> D3 -> optional D2 revision sequence)
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** Deliberation (closure attempted, deferral and reframing allowed)
**Question type:** Ontology + contract (organizing axes plus content-side binding rules)
**Closes:** O1 (lesson concept graph and artifact-binding model), C6 (annotation-anchor / view-recipe contract — content side)
**Consumes (as hard constraints):** D1 decision anchor, D2 decision anchor, R3 research, BOUNDARY-CONTRACT-MEMO.md cross-cutting constraints
**Feeds:** optional D2 revision (2B-iii), D5 (regulation semantic model), D4 (long-horizon roadmap), synthesis stage

---

## MANDATORY: Read These Documents Before Any Task Work

In this exact order:

1. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodology. You are in **deliberation mode**. O1 is an ontology question and C6 (content side) is a contract question. Deferral and reframing are valid outcomes per the principles.

2. `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md` — canonical framing for what you are closing. **Pay particular attention to:**
   - "Two Kinds of Questions" — O1 is ontology-shaped; C6 is contract-shaped
   - `Ontology 1` — your primary scope
   - `Contract 6` — you are closing the content side while consuming D2's renderer-side closure
   - **Cross-Cutting Constraints 1-7** — these bind your deliberation; you must acknowledge all seven and design within them

3. `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md` — D1's closed contracts. You cannot redefine compute/job/artifact/regulation-flow contracts; your lesson architecture must consume them.

4. `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md` — D2's closed/provisional contracts. This is your fixed input for shared interaction semantics, renderer-neutral anchor identity, typed anchor failure modes, view recipes, accessibility commitments, and thin-client assumptions.

5. `.planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md` — full D2 deliberation for detail on:
   - C5 (`SharedInteractionState`) around line 292
   - C6 renderer-side anchor and recipe contract around line 380
   - D2.A-D around line 495
   You especially need to understand `ArtifactAnchorRef`, `AnchorResolutionStatus`, `ViewRecipe`, the shell handoff, and D2's limited push-back that view recipes are a renderer-plus-shell seam rather than purely renderer-internal.

6. `.planning/VISION.md` — the long-term platform vision. Education is first-class, not decorative.

7. `.planning/REQUIREMENTS.md` — especially `EDU-01`, `EDU-02`, `EDU-03`, plus any requirement that constrains explanation honesty or role-specific learning paths.

8. `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md` — R3 terrain map. This is your primary option-space input for lesson graph, body-format boundary, artifact binding, and authoring workflow.

9. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — Findings #7, #9, #10, and #15 are directly relevant; #1 and #14 remain adjacent through D2.

## Supporting reads (as needed for grounding)

- **Current workspace/app state:**
  - `apps/web/src/app/App.tsx` — current shell assumptions
  - `apps/web/src/app/useWorkspace.ts` — current app state model with no lesson graph
  - `packages/visuals/src/workspace/WorkbenchShell.tsx` — current shell shape D2 has already declared too narrow
- **Current repo absence checks:**
  - `rg --files . | rg 'lesson|learning|tutorial|content'`
  - `rg -n "Lesson|Overlay|Prerequisite|roleTags|conceptId" apps packages .planning`
- **Existing educationally relevant surfaces:**
  - `packages/visuals/src/` and `apps/web/src/features/` as examples of current engineering-first UI without a first-class content model

---

## What You Are Closing

You are deliberating one ontology and one coupled contract that together constitute the **educational content architecture** of the platform.

### Ontology 1: Lesson concept graph and artifact-binding model (O1)

This is an ontology question. You are closing:

- The primary organizing axes for lesson identity
- The minimum viable `LessonUnit` / concept-graph shape
- Role tags, difficulty/depth, prerequisite edges, recommended-next edges, and scenario/regulation context
- How artifact bindings relate to the concept graph
- Whether assessment hooks belong in the minimum viable ontology or remain adjacent
- The body-format adapter pattern: what remains stable regardless of whether body text is Markdown, MDX, TypeScript modules, notebook-like cells, or another format

**Closure criteria:** primary axes + minimum viable schema + explicit non-comparability / non-applicability rules + body-format adapter boundary

**Label-trap reminder:** "we picked MDX" or "we picked notebooks" is not a valid closure. "The stable lesson graph is X, the initial body format is Y because Z, and the migration/adapter shape is W" is a valid closure.

### Contract 6: Annotation-anchor / view-recipe contract (C6, content side)

This is a contract question. D2 already closed the renderer side. You are closing the **content side**:

- How lesson units reference `recipeId`, named panel slots, `ArtifactAnchorRef`, and D2's typed anchor failure modes
- How lesson steps trigger guided focus, cursor/brush state, pinned anchors, and recipe changes through D2's C5 action substrate
- What fallback semantics lesson content uses when anchors are `artifact-missing`, `anchor-missing`, `filtered-out`, `not-applicable`, or `renderer-unavailable`
- How content remains honest when bound artifacts differ in fidelity tier, validation state, or cross-era comparability
- How additive pedagogical metadata can extend `ViewRecipe` without reopening D2's identity/slot semantics

**Closure criteria:** content-side binding rules + lesson-step interaction semantics + typed fallback behavior + additive extension rules for recipe metadata

---

## Cross-Cutting Constraints You Must Honor

From `BOUNDARY-CONTRACT-MEMO.md` § Cross-Cutting Constraints. Your deliberation must honor **all seven** constraints. Each applies differently to D3 than it did to D2.

### 1. Performance envelope (secondary but real input)

R1.5 is not your primary closure input the way it was for D2, but D3 still inherits it:

- Lesson bodies, overlays, and guided-state payloads must be bounded enough to work on the apollo thin-client path.
- Guided interaction should operate on already-fetched artifacts and D2's local shared state wherever possible.
- The educational layer must not force frequent network round-trips just to narrate a lesson step.
- If your proposed content model would create large lesson blobs, expensive recomputation, or step transitions that routinely violate thin-client assumptions, that is a design failure.

### 2. Cross-era comparability affordance

Lessons must accommodate cases where referenced artifacts or comparisons are:

- `direct`
- `derived`
- `family-specific`
- `non-comparable`

Your architecture must support scenarios where a lesson step cannot bind cleanly in a different regulation family and must degrade honestly rather than pretending equivalence.

### 3. Honesty constraints on placeholder vs real fidelity

Educational content is especially vulnerable to false authority. Lessons must distinguish:

- explanatory framing
- modeled claims
- benchmarked/calibrated/validated claims

Your content architecture must support explicit epistemic framing when a lesson references placeholder or reduced-order artifacts.

### 4. The label-trap

Do not close at syntax level:

- not "MDX wins"
- not "notebooks win"
- not "TypeScript modules win"

Close the stable graph and binding boundary first. The initial authoring/body syntax is downstream and may remain provisional.

### 5. Accessibility as architectural constraint

**Required output:** explicitly address accessibility for both O1 and C6.

- Every lesson unit must have accessible text for guided content.
- Keyboard-only navigation through lesson flow is non-optional.
- If media is proposed, captions/transcripts are required.
- If a pedagogical pattern depends on purely visual recognition, you must propose an accessible equivalent or explicitly defer it with closure criteria.
- Lesson overlays must consume D2's accessible anchor labels rather than inventing visual-only cues.

### 6. Thin-client responsive rendering

**Required output:** explicitly address the apollo-over-Tailscale client path.

- The lesson system runs on the same thin client as D2.
- Guided tours and overlay flows must degrade gracefully under 20-80 ms RTT and limited browser-side resources.
- Recipe variants and lesson steps must remain viable on narrower viewports and focus-mode layouts.
- Touch is not a v1 requirement, but the lesson interaction model must not preclude future touch affordances.

### 7. Honesty labeling visible in the UI

**Required output:** explicitly describe how lesson surfaces keep D1/D2 fidelity and validation states visible.

- Lessons that reference artifacts must display the artifact's fidelity/validation state to the learner.
- A lesson step that makes a claim over a `placeholder` or `reduced-order` artifact must frame that claim with epistemic humility.
- Lesson-level validation should treat fidelity-tier mismatch as an authoring error where appropriate.
- Cross-era non-comparability must be visible in the lesson flow, not just buried in metadata.

---

## Required Deliberation Format

Follow `RESEARCH-PRINCIPLES.md` § Required Output Sections for deliberation files. In addition to the standard sections, D3 has **four explicit required subsections** corresponding to the content-specific concerns R3 and D2 surfaced.

### Standard mandatory sections

1. **Metadata** — date, mode, reasoning effort, inputs consumed
2. **Question** — O1 and content-side C6, with any reframing
3. **Stakes** — what gets locked in or kept open; who downstream depends on each closure
4. **Option Space** — inherited from R3 and D2, not re-invented
5. **Tradeoffs** — across 1/3/5-year horizons and dependencies
6. **Gray Areas Still Unresolved** — using the three-response framework
7. **Closure Analysis** — per ontology/contract: can it close now? on what evidence? if not, why not?
8. **Outcome** — per ontology/contract: recommendation / provisional recommendation / deferral / reframing
9. **Implications if Closed / Implications if Deferred** — what follows from each outcome
10. **Dependencies and Relations** — especially D2 and optional D2 revision pressure
11. **Path of Deliberation** — branching paths, pushback on D2 or the memo, reframings
12. **Open Sub-questions** — surfaced but not resolved
13. **Decision Record** — empty template for user to fill in

### Additional D3-specific required subsections

These subsections are mandatory and must be present somewhere in the deliberation.

#### D3.A: Body format and adapter boundary

R3 made clear the real question is not "pick a syntax." You must explicitly address:

- What part of the lesson system is stable regardless of body syntax
- Whether the initial body format should close now or remain provisional
- If provisional: what adapter contract keeps future body-format changes from reopening O1
- How the first likely authoring mode (developer-authored, content-author-authored, AI-assisted with review) affects the initial recommendation

This subsection is where you operationalize the label-trap for educational content.

#### D3.B: Lesson graph and progression semantics

You must explicitly address:

- `lessonId`, `conceptId`, role tags, difficulty/depth, prerequisite edges, recommended-next edges
- scenario/regulation context and non-applicability rules
- whether assessment hooks are in minimum viable scope or explicitly adjacent
- how role-based learning paths avoid collapsing into simple tag filters

This subsection closes the core ontology shape rather than leaving it implicit.

#### D3.C: Artifact binding, guided state, and fallback behavior

You must explicitly address:

- How lessons bind to D2 `recipeId`, panel slots, `ArtifactAnchorRef`, and `AnchorResolutionStatus`
- How lesson steps use D2's C5 shared interaction semantics rather than inventing a parallel lesson-only state substrate
- What fallback behavior occurs for `artifact-missing`, `anchor-missing`, `filtered-out`, `not-applicable`, and `renderer-unavailable`
- What additive recipe metadata D3 needs, if any, and whether that triggers optional D2 revision

**Known gap in D2's C6 closure that D3 must navigate explicitly:** D2 references an `AnchorRegistry` as the mechanism through which renderers register anchors and through which lesson bindings will resolve, but the register / lookup / update / remove / subscribe semantics are not specified in the D2 deliberation. This gap is tracked in signal `sig-2026-04-11-d2-underspecified-interface-types` at `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md`. D3 must either:

- propose a minimal `AnchorRegistry` API that satisfies its lesson-binding needs and flag it explicitly as additive Wave 2B-iii input (not a reopening of anchor identity), or
- document the minimum registry shape D3 assumes and mark it as a hard constraint D3 places on Phase 4 planning.

Do not close D3.C on a silent registry assumption. Silent drift on renderer-side primitives is exactly the failure mode the boundary memo was designed to prevent.

This is the most likely place where D3 may surface a genuine need for Wave 2B-iii. Be explicit.

#### D3.D: Authoring, validation, preview, accessibility, and thin-client workflow

R3 treated workflow as architecture, not operations. You must explicitly address:

- who authors and reviews lessons
- how preview works
- what validation checks are required (schema, prerequisites, artifact binding resolution, fidelity mismatch, accessibility, regulation applicability)
- how accessible text, keyboard-only flow, and honesty labeling are guaranteed
- how the lesson system remains bounded and responsive on the apollo thin-client path

Do not treat these as afterthoughts; they are part of the closure.

### Decision Record template

```markdown
## Decision Record (to be filled by user)

### Ontology 1 (lesson concept graph and artifact-binding model)
- Decision:
- Rationale:
- Date:
- Decider:

### Contract 6 (annotation-anchor / view-recipe contract, content side)
- Decision:
- Rationale:
- Date:
- Decider:

### D3.A (body format and adapter boundary)
- Decision / Scope disposition:
- Rationale:
- Handoff to: (phase or future plan)

### D3.B (lesson graph and progression semantics)
- Decision / Scope disposition:
- Rationale:
- Handoff to: (phase or future plan)

### D3.C (artifact binding, guided state, and fallback behavior)
- Decision / Commitment level:
- Rationale:
- Implication for D2 revision: (none / maybe / yes)

### D3.D (authoring, validation, preview, accessibility, and thin-client workflow)
- Decision / Commitment level:
- Rationale:
- Verification approach:
```

---

## Decision Anchor Companion File

After writing the main deliberation, produce a decision anchor at `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md` (~1 page, dense). D5 and D4 will consume this anchor instead of the full deliberation. The anchor must include:

- one-paragraph summary of O1 and content-side C6 outcomes
- the most important constraints D3 imposes on optional D2 revision specifically
- the most important constraints D3 imposes on D5 adjacently (regulation applicability and lesson non-comparability)
- the most important constraints D3 imposes on D4 for roadmap synthesis
- the most important open question each closure leaves unresolved
- brief disposition on D3.A-D

Format should mirror `01-decision-anchor.md` and `02-decision-anchor.md` — dense paragraphs, not bullet lists.

---

## Output Files

Write to:

- `.planning/initiatives/vision-alignment-2026-04/deliberations/03-educational-content-architecture.md` (main deliberation)
- `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md` (dense summary)

Use cat heredoc for both.

## Completion Signal

```text
Wave 2B-ii (D3) complete.
- deliberations/03-educational-content-architecture.md (XXX lines)
- deliberations/03-decision-anchor.md (XX lines)

Items addressed:
- O1 (lesson concept graph and artifact-binding model): [closed/provisional/deferred/reframed]
- C6 (annotation-anchor / view-recipe contract, content side): [closed/provisional/deferred/reframed]

Content-specific subsections:
- D3.A (body format / adapter boundary): [closed/scoped-out-with-handoff/deferred]
- D3.B (lesson graph / progression semantics): [closed/scoped-out-with-handoff/deferred]
- D3.C (artifact binding / guided state / fallback): [closed/provisional/deferred]
- D3.D (authoring / validation / preview / accessibility / thin-client): [committed to level X]

Cross-era applicability handling: [explicit / implicit / deferred]
Fidelity / honesty handling: [explicit / implicit / deferred]
Need for D2 revision (2B-iii): [none / possible / yes — see section X]
Push-back on D2 or boundary memo: [yes — see section X / no]
```

---

## Reminders

- **xhigh reasoning is for substantive deliberation** — use it. Do not rush to close.
- **Deferral is valid.** If O1 or content-side C6 is not ready to close, defer with closure criteria.
- **Reframing is valid.** If D3 discovers that the current O1/C6 cut is wrong or that a distinct lesson-state or workflow contract is missing, say so explicitly and mark the finding.
- **Consume D2 as a hard constraint.** You may request additive metadata or a D2 revision if truly needed, but do not casually reopen D2's anchor identity, failure modes, or shared-state semantics.
- **No label-level closure.** Graph and contract first, body syntax second, package/tooling labels last.
- **Workflow is part of the architecture here.** Authoring, preview, validation, accessibility, and thin-client viability are not operational afterthoughts.
- **You are drafting the SECOND of a bidirectionally coupled pair.** If you need Wave 2B-iii, say so clearly and narrowly.

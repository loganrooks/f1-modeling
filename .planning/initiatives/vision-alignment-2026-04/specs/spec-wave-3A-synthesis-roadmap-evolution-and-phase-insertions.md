# Call 3A: Roadmap Evolution and Phase Insertion Proposal Synthesis

**Wave:** 3 (first synthesis call after D1/D2/D3/D5/D4 acceptance)
**Model:** gpt-5.4
**Reasoning effort:** high
**Mode:** Synthesis (proposal generation from accepted decisions; no new architectural closure)
**Question type:** Roadmap embodiment and proposal drafting
**Closes:** Stage 3A (roadmap evolution + phase insertion proposals)
**Consumes (as hard constraints):** accepted D1/D2/D3/D5/D4 Decision Records, D1-D5 decision anchors, D4 formal audit response, VISION.md, PROJECT.md, REQUIREMENTS.md, ROADMAP.md, audit-response-2026-04-10.md, BOUNDARY-CONTRACT-MEMO.md
**Feeds:** Stage 3B (`guardrails-proposal.md`, `tech-debt-registry.md`, `SUMMARY.md`), later manual `ROADMAP.md` updates by the user

---

## MANDATORY: Read These Documents Before Any Task Work

In this exact order:

1. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodology still applies, but you are no longer in deliberation mode. Decisions have already been made. Your job is faithful synthesis and proposal drafting.

2. `.planning/VISION.md` — the long-horizon platform vision the roadmap must serve.

3. `.planning/PROJECT.md` — current project commitments, scope boundaries, and active framing.

4. `.planning/REQUIREMENTS.md` — the roadmap proposals must respect requirement sequencing and coverage.

5. `.planning/ROADMAP.md` — current roadmap state that Stage 3A is proposing to evolve.

6. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — especially Findings 3-15, the six must-haves, the proposed follow-up plan, and the original tech-debt registry.

7. `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md` — accepted contract/ontology scaffolding and cross-cutting constraints that must survive into roadmap proposals.

8. `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
9. `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md`
10. `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md`
11. `.planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md`
12. `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md`

13. `.planning/initiatives/vision-alignment-2026-04/deliberations/05-long-horizon-roadmap.md` — read the full D4 file, not just the anchor, because the filled Decision Record carries binding specifics and post-audit corrections.

14. `.planning/initiatives/vision-alignment-2026-04/audit/2026-04-11-d4-acceptance-response.md` — mandatory. Stage 3A must consume the audit's two substantive carry-forwards:
   - use the corrected Phase 4.1 framing rather than "broadened from EKF later"
   - leave `AccessibleChartContract` and `packages/visuals` zero-tests for explicit Stage 3B reconciliation rather than pretending D4 already carried them

## Supporting reads (as needed for grounding)

- Relevant full deliberation files (`01-04`) if you need exact wording beyond the decision anchors
- `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md` for understanding why Stage 3B must reconcile `AccessibleChartContract`
- Initiative `PLAN.md` for tracker context only; do not treat it as substantive authority over the accepted Decision Records
- Current phase context files only if you need to verify a concrete roadmap dependency; do not context-sprawl

---

## What You Are Closing

Stage 3A is not a new deliberation. It is the **proposal-writing synthesis pass** that turns accepted D4 conclusions into concrete roadmap-evolution artifacts the user can review and later apply manually.

You are closing:

- what exact structural changes to `ROADMAP.md` should be proposed after the accepted D4 outcome
- what the pre-Phase-4 insertion proposal set should look like in a copy-pasteable form
- how current Phases 4, 4.1, 5, 6, 7, and 8 should be rewritten or narrowed in proposal form
- how the roadmap should add high-level v2 / v3 / v4+ milestone direction without fabricating implementation-plan detail
- what dependency graph and milestone-boundary logic Stage 3 should hand to the user for manual application

**Closure criteria:** explicit roadmap-diff logic + copy-pasteable insertion proposals + concrete proposed rewrites for affected roadmap sections + dependency rationale that matches the accepted Decision Records + no reopening of architectural decisions

### What You Are NOT Closing

Do **not**:

- reopen D1, D2, D3, D5, or D4
- change the commitment level the user already chose in the Decision Records
- directly edit `.planning/ROADMAP.md`, `.planning/PROJECT.md`, `.planning/CLAUDE.md`, or any phase context file
- write guardrails, tech-debt registry entries, or summary prose that belongs to 3B
- draft exact implementation `PLAN.md` files for any inserted phase
- invent new architecture beyond what the accepted deliberations already decided

You are producing **proposal artifacts only**. The user applies any actual project-file changes later.

---

## Cross-Cutting Constraints You Must Honor

### 1. Accepted decisions are binding inputs, not suggestions

Stage 3A must embody the accepted Decision Records exactly. If you feel tempted to improve or simplify them, stop. This stage translates accepted decisions into proposal form; it does not renegotiate them.

### 2. Keep the pre-Phase-4 work bundles visible

D4.A binds explicit pre-Phase-4 insertions. You may choose the smallest honest packaging scheme, but you may **not** collapse them into a vague single "foundation wave". In particular:
- backend execution + regulation execution-flow foundation must remain visible
- visualization substrate + shell + performance foundation must remain visible
- educational foundation + minimal semantic groundwork must remain visible

D4's filled Decision Record explicitly allows Insertion 3 to be one phase or two adjacent decimal phases. That packaging choice is yours, but hiding the work is not.

### 3. Use the post-hoc audit's corrected Phase 4.1 framing

Do not describe Phase 4.1 as "broadened from EKF later." The audit found that wording slightly misreads the current `ROADMAP.md`. The correct framing is: current Phase 4.1 already spans synthetic sensors, observer, and observer-aware learning views/timeline work, but its plans must be rewritten to consume D1 checkpointed artifacts, D2 linked temporal interaction, and D3 guided overlays.

### 4. Keep roadmap shape tied to dependency logic, not labels

Do not propose milestones because the labels sound neat. Every insertion, narrowing, split, and v2/v3/v4+ theme must be justified by what it depends on, what it unblocks, and what remains deferred.

### 5. UI-discipline commitments remain roadmap commitments

Accessibility, thin-client responsiveness, and visible fidelity / validation / comparability labeling cannot disappear into generic polish language. Stage 3A should make room for them in roadmap structure even though their guardrail expression belongs to 3B.

### 6. Preserve the D4 commitment levels

- D4.A is accepted at scope level
- D4.B is provisional reshaping direction
- D4.C is provisional thematic projection
- D4.D is accepted handoff logic

Your proposals must reflect those commitment levels rather than silently upgrading or downgrading them.

### 7. Keep v2 / v3 / v4+ high-level

D4 deliberately projected beyond v1 thematically rather than with full phase detail. Preserve that discipline. A good Stage 3A output gives the user enough to evolve `ROADMAP.md` honestly without fabricating exact future plans.

---

## Required Output Format

Follow a structured synthesis style. You are not writing a deliberation with a new Decision Record, but you should still make the proposal artifacts easy to audit.

Produce **two files**.

### File 1: `synthesis/roadmap-evolution.md`

This file should contain, in order:

1. **Metadata** — date, mode, reasoning effort, inputs consumed
2. **Accepted Basis** — short section naming the binding accepted decisions from D1-D5 and the D4 audit carry-forwards
3. **Current-Roadmap Mismatches** — concise explanation of what is structurally dishonest in the current roadmap after D1-D5
4. **Proposed Structural Changes** — high-level summary of what changes in the roadmap and why
5. **Proposed `ROADMAP.md` Diff Guidance** — section-by-section proposal for what should change in `ROADMAP.md`
   - pre-Phase-4 insertions
   - Phase 4 rewrite
   - Phase 4.1 rewrite using the corrected framing
   - Phase 5 split visibility
   - Phase 6-7 ordering preservation
   - Phase 8 narrowing
   - v2 / v3 / v4+ milestone additions
6. **Dependency Graph and Sequencing Logic** — explicit explanation of what depends on what and why the boundaries land where they do
7. **Open Packaging Choices Reserved for User / Later Work** — what remains intentionally un-finalized (for example decimal numbering exactness)
8. **Application Notes** — how the user should interpret and later apply these proposals to `ROADMAP.md`

The `ROADMAP.md` diff guidance should be specific enough that the user could implement it later, but do not rewrite the entire file inline.

### File 2: `synthesis/phase-insertion-proposals.md`

This file should contain a ready-to-use proposal set for the pre-Phase-4 insertions.

For each proposed insertion, include:

1. **Proposed phase number or numbering options**
2. **Phase name**
3. **Goal statement**
4. **Depends on**
5. **Requirements mapping**
6. **Success criteria** — 4-6 concrete TRUE statements
7. **Plan breakdown** — 3-6 plans with short objectives
8. **Why this insertion exists**
9. **What it unblocks**
10. **Why this packaging is the smallest honest shape**

Important packaging rule:
- You must keep the three D4.A work bundles visible.
- You may keep Insertion 3 as one phase or split it into two adjacent decimal phases if and only if you justify that packaging as the smallest honest scheme.

---

## Specific Content You Must Carry Forward

Stage 3A must visibly embody these accepted D4 outcomes:

- Phase 4 planning remains paused until pre-Phase-4 insertions are proposed and later accepted by the user
- Phase 4 narrows to strategy workbench and session-workflow delivery
- Phase 4.1 stays in sequence after Phase 4, but its plans are rewritten against the accepted substrate
- Phase 5 likely needs explicit split visibility
- Phase 6 and 7 remain the reality-contact corridor in that order
- Phase 8 narrows to the first semantically grounded regulation / design exploration wave rather than full historical breadth
- v1 optimizes for an honest, inspectable, single-family engineering-and-education loop
- v2 is numerical and semantic deepening
- v3 is the clearest "comes into its own" threshold
- v4+ is operational and product-expansion horizon

---

## Output Files

Write to:

- `.planning/initiatives/vision-alignment-2026-04/synthesis/roadmap-evolution.md`
- `.planning/initiatives/vision-alignment-2026-04/synthesis/phase-insertion-proposals.md`

Use cat heredoc for both. Create the `synthesis/` directory if it does not already exist.

## Completion Signal

```text
Stage 3A complete.
- synthesis/roadmap-evolution.md (XXX lines)
- synthesis/phase-insertion-proposals.md (XXX lines)

Items addressed:
- roadmap evolution proposal: [complete]
- phase insertion proposal set: [complete]

Key packaging choice:
- Insertion 3 packaging: [single phase / two adjacent decimal phases]

Stage 3A carry-forwards honored:
- corrected Phase 4.1 framing from D4 audit: [yes/no]
- D4.A visible insertion bundles preserved: [yes/no]
- D4.C v2/v3/v4+ kept thematic rather than plan-detailed: [yes/no]

Push-back on accepted decisions: [no expected; if yes, explain]
```

## Reminders

- **This is not a new design pass.** If you find yourself making new architecture decisions, stop and fall back to the accepted records.
- **Do not write the whole future roadmap.** Write proposal artifacts that a human can review and later apply.
- **Keep dependency reasoning explicit.** A stage insertion without an unblock story is not good enough.
- **Do not leak 3B into 3A.** Guardrails, tech-debt registry content, and SUMMARY prose belong to the next call.
- **Respect the post-hoc audit.** The D4 acceptance stands, but the audit corrections must be carried forward explicitly.

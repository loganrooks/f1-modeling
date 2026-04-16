# Call 3B: Guardrails, Tech-Debt Registry, and Summary Synthesis

**Wave:** 3 (second synthesis call after Stage 3A)
**Model:** gpt-5.4
**Reasoning effort:** high
**Mode:** Synthesis (guardrail, registry, and summary drafting from accepted decisions)
**Question type:** Governance and carry-forward artifact synthesis
**Closes:** Stage 3B (guardrails proposal + tech-debt registry + SUMMARY)
**Consumes (as hard constraints):** accepted D1/D2/D3/D5/D4 Decision Records, D1-D5 decision anchors, D4 formal audit response, Stage 3A outputs, D2 underspec signal, VISION.md, PROJECT.md, ROADMAP.md, CLAUDE.md, audit-response-2026-04-10.md, BOUNDARY-CONTRACT-MEMO.md
**Feeds:** final user review, later manual updates to `CLAUDE.md`, planning templates/process guardrails, and future `/gsdr:plan-phase 04` work

---

## MANDATORY: Read These Documents Before Any Task Work

In this exact order:

1. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodology still applies, but this is synthesis of accepted outcomes, not another deliberation.

2. `.planning/VISION.md` — the long-horizon vision the guardrails are protecting.

3. `.planning/PROJECT.md` — current project framing and scope boundaries.

4. `.planning/ROADMAP.md` — current roadmap state, because 3B guardrails and registry items must make sense against how the project is actually organized today.

5. `CLAUDE.md` — 3B is expected to propose guardrail additions that the user can later apply here.

6. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — especially the initial tech-debt registry, honesty-labeling action, Future Awareness implication, and guardrail implementation note.

7. `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md` — cross-cutting commitments that must survive into guardrails.

8. `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
9. `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md`
10. `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md`
11. `.planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md`
12. `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md`

13. `.planning/initiatives/vision-alignment-2026-04/deliberations/05-long-horizon-roadmap.md` — read the full D4 file, especially D4.D and the filled Decision Record.

14. `.planning/initiatives/vision-alignment-2026-04/audit/2026-04-11-d4-acceptance-response.md` — mandatory. This audit explicitly requires Stage 3B to reconcile `AccessibleChartContract` and `packages/visuals` zero-tests into the registry/guardrail outputs.

15. `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md` — mandatory. This is the authoritative source for the `AccessibleChartContract` and `AnchorRegistry` carry-forward obligations.

16. `.planning/initiatives/vision-alignment-2026-04/synthesis/roadmap-evolution.md`
17. `.planning/initiatives/vision-alignment-2026-04/synthesis/phase-insertion-proposals.md`

## Supporting reads (as needed for grounding)

- Full deliberation files if you need exact wording beyond the decision anchors
- Additional audit files in `.planning/audits/` only if you need to verify wording for guardrail proposals
- Existing phase context files only if you need a concrete example of where a proposed guardrail would apply; do not context-sprawl

---

## What You Are Closing

Stage 3B is the **governance and carry-forward synthesis pass**. It turns the accepted architectural and roadmap outcomes into the process guardrails, tech-debt registry, and initiative summary that should shape the next phase-planning cycle.

You are closing:

- what guardrails should be proposed for `CLAUDE.md` and planning practice so the project does not regress into the failure modes this initiative surfaced
- what the durable tech-debt registry should contain, with explicit rewrite triggers and severity
- how the initiative should be summarized for later humans or agents who need the high-signal takeaways without rereading every artifact

**Closure criteria:** actionable guardrail proposal + reconciled tech-debt registry + concise initiative summary + explicit carry-forward of the post-hoc D4 audit findings + no reopening of accepted architectural or roadmap decisions

### What You Are NOT Closing

Do **not**:

- reopen D1, D2, D3, D5, D4, or Stage 3A
- directly edit `CLAUDE.md`, `ROADMAP.md`, or any phase context/template file
- create additional roadmap phases or alter the Stage 3A packaging choices
- turn the registry into an implementation plan
- write `/gsdr:plan-phase 04` artifacts or exact phase plans

You are writing proposal artifacts only.

---

## Cross-Cutting Constraints You Must Honor

### 1. Registry reconciliation is mandatory, not optional

The `tech-debt-registry.md` must reconcile at least these four sources:

- D4.D's seven explicit rewrite triggers
- the audit response's initial tech-debt registry (`audit-response-2026-04-10.md:301-314`)
- the D2 underspec signal (`AccessibleChartContract`, `AnchorRegistry`)
- any additional items Stage 3B identifies that are clearly implied by accepted decisions

If two sources mention the same underlying issue, reconcile them into one clear registry entry rather than duplicating them.

### 2. Two items must appear explicitly

The post-hoc D4 audit made these mandatory Stage 3B carry-forwards:

- `AccessibleChartContract`
- `packages/visuals` zero tests

Do not bury them inside broader entries.

### 3. Guardrails must protect against the actual failure modes this initiative surfaced

At minimum, the guardrail proposal must preserve:

- honesty labeling and fidelity visibility
- accessibility as architectural constraint, not polish
- thin-client responsiveness as a real baseline
- renderer-migration discipline (no uncontrolled legacy SVG growth)
- phase-gate pressure to serve the long-horizon vision rather than only the next milestone
- performance-budget enforcement as a planning-time concern

### 4. Keep guardrails proposal-ready, not aspirational

If a guardrail cannot be expressed as a concrete addition to `CLAUDE.md`, a concrete planning checklist, or a concrete phase-gate question, it is not specific enough.

### 5. SUMMARY must be high-signal and future-facing

The summary is not a changelog. It should let a future orchestrator or reviewer understand:
- what the initiative decided
- what artifacts now govern the next planning cycle
- what remains deferred
- what the next actual move is

### 6. Do not leak roadmap authoring back into 3B

3A already handled roadmap evolution and phase insertion proposals. 3B may reference them, but it should not attempt to rewrite or extend them.

---

## Required Output Format

Produce **three files**.

### File 1: `synthesis/guardrails-proposal.md`

This file should contain, in order:

1. **Metadata** — date, mode, reasoning effort, inputs consumed
2. **Accepted Basis** — the accepted decisions and audit carry-forwards that justify the guardrails
3. **Failure Modes to Guard Against** — concise list of the specific regressions the initiative was trying to prevent
4. **Proposed `CLAUDE.md` Additions / Changes** — concrete proposal text or diff-style snippets
5. **Proposed Planning / Phase-Gate Guardrails** — concrete rules or questions to apply in future phase planning and review
6. **Proposed Template / Process Guidance** — if you recommend additions to phase CONTEXT/PLAN expectations, write them as proposal text even if no dedicated template file exists yet
7. **Application Notes** — how the user should apply the guardrails later

Important: this file should be concrete enough that the user could later patch `CLAUDE.md` and associated planning guidance from it.

### File 2: `synthesis/tech-debt-registry.md`

This file should be structured and machine-readable enough to be maintained later. A markdown table plus stable IDs is acceptable; YAML-like blocks are also acceptable.

Minimum required fields per entry:

- `id`
- `title`
- `current_state`
- `rewrite_trigger`
- `severity`
- `source`
- `phase_target` or `milestone_target`
- `notes`

Minimum required entries:

1. `runService.ts` concern split
2. `packages/domain/src/presets/schema.ts` typed family issue or its accepted D5 equivalent expression
3. synchronous `SimulationHarness` / execution contract concern
4. `App.tsx` / three-zone shell retirement
5. legacy hand-rolled SVG migration discipline
6. `packages/visuals` zero tests
7. computational core TypeScript long-term limit
8. no performance instrumentation / benchmark reporting path
9. `AccessibleChartContract`
10. `AnchorRegistry`

You may add more entries, but do not produce fewer than 10.

The registry must reconcile duplicates rather than listing the same thing twice under different names.

### File 3: `SUMMARY.md`

This file should contain:

1. **What this initiative decided** — short paragraph per major deliberation/synthesis stage (D1, D2, D3, D5, D4, 3A, 3B)
2. **What artifacts now matter most** — high-signal list of the files the user or a future orchestrator should consult first
3. **What should be modified later** — likely `ROADMAP.md`, `CLAUDE.md`, planning/process guidance, and any other proposal-target files surfaced by Stage 3
4. **Suggested manual commit sequence** — ordered commit suggestions for when the user later applies project-file changes
5. **Remaining open questions / deferrals** — compact list only
6. **What happens next** — how to resume normal project planning after the initiative

Keep `SUMMARY.md` concise and readable. It should help a future fresh session onboard quickly.

---

## Specific Content You Must Carry Forward

Stage 3B must visibly carry forward these initiative results:

- D2/D3/D5/D4 honesty and comparability commitments are now governance commitments, not just deliberation prose
- benchmark enforcement from the R1.5 envelopes must have a durable home
- the phase-gate question "does this serve the vision or only the milestone?" should become an explicit planning guardrail
- renderer-migration discipline should freeze new legacy SVG feature growth
- `AccessibleChartContract` and `AnchorRegistry` are accepted Phase 4 obligations even though they were not blocking for D2 closure
- `packages/visuals` zero tests is a real registry item, not a footnote
- the project should return to normal planning only after the user reviews and applies the Stage 3 proposals they agree with

---

## Output Files

Write to:

- `.planning/initiatives/vision-alignment-2026-04/synthesis/guardrails-proposal.md`
- `.planning/initiatives/vision-alignment-2026-04/synthesis/tech-debt-registry.md`
- `.planning/initiatives/vision-alignment-2026-04/SUMMARY.md`

Use cat heredoc for all files.

## Completion Signal

```text
Stage 3B complete.
- synthesis/guardrails-proposal.md (XXX lines)
- synthesis/tech-debt-registry.md (XXX lines)
- SUMMARY.md (XXX lines)

Items addressed:
- guardrails proposal: [complete]
- tech-debt registry: [complete]
- initiative summary: [complete]

Registry reconciliation carried forward:
- D4.D rewrite triggers reconciled: [yes/no]
- audit-response initial tech-debt registry reconciled: [yes/no]
- D2 underspec signal reconciled: [yes/no]
- `AccessibleChartContract` explicit entry present: [yes/no]
- `packages/visuals` zero-tests explicit entry present: [yes/no]

Push-back on accepted decisions: [no expected; if yes, explain]
```

## Reminders

- **This is synthesis, not a new architecture pass.**
- **Do not lose the initiative's hard-won specificity.** Generic guardrails are not enough.
- **Be explicit about sources in the registry.** Future maintainers need to know why each entry exists.
- **Keep `SUMMARY.md` useful for fresh-session onboarding.**
- **Do not let the post-hoc D4 audit findings disappear.** They are part of the accepted carry-forward state now.

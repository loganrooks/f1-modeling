# Debrief Plan

## Objective

Run a disciplined retrospective on the Vision Alignment Initiative that produces durable carry-forward changes rather than a one-off discussion.

The debrief should evaluate four things separately:

1. **Substantive outcome quality** — did the initiative improve the roadmap and architectural direction?
2. **Process quality** — was the initiative run in a way that was efficient, legible, and correctable?
3. **Auditability quality** — could an outsider reconstruct what happened and why?
4. **Carry-forward quality** — were the lessons actually moved into live constraints, workflow, or backlog artifacts?

## Non-Goals

- Re-running the initiative
- Re-litigating every architectural decision from scratch
- Producing generic retrospective prose with no operational consequence

## Inputs

Read in this order unless a specific question requires a narrower slice:

1. `README.md`
2. `SPEC-INDEX.md`
3. `../README.md`
4. `../SPEC-INDEX.md`
5. `../APPLICATION-LEDGER.md`
6. `../SUMMARY.md`
7. `../audit/2026-04-11-d4-acceptance-response.md`
8. `../audit/2026-04-11-stage-3-application-response.md`
9. `../reviews/review-wave-2-structure-decisions.md`
10. `../reports/report-wave-1-orchestrator-execution.md`
11. `../handoffs/`
12. `../specs/`
13. `.planning/knowledge/signals/f1-modeling/2026-04-11-claude-bypassed-formal-audit-protocol.md`

Then read specific research, deliberation, synthesis, or archive files only when a finding needs direct evidence.

## Traceability Model

The debrief should preserve the same discipline the initiative used:

- every debrief output should cite the debrief spec that produced it
- every debrief spec should map back to the original initiative plan elements it is evaluating
- every finding should cite specific source files, and where relevant, the exact original wave, review gate, or application step involved

This is why the debrief has its own `SPEC-INDEX.md` and `specs/` directory rather than only freeform notes.

## Work Sequence

### Phase 1: Reconstruct the timeline

Produce a short factual sequence:

- trigger
- research waves
- deliberation sequence
- audits and review moments
- synthesis
- application to live files

Output target:
- `TIMELINE.md`
- evidence coverage updates in `EVIDENCE-INDEX.md` when gaps are found

### Phase 2: Evaluate what went well

Look for:

- places where the initiative corrected a real roadmap/architecture mistake
- places where cross-model review improved quality
- where the spec structure helped rather than hurt
- where audits caught real issues before or during application

Rule:
- every positive claim needs a file or commit reference

Output target:
- substantive-win entries in `FINDINGS.md`
- reusable entries in `PATTERNS-TO-KEEP.md`

### Phase 3: Evaluate what went wrong or almost went wrong

Separate failures by class:

- process failures
- documentation/state drift
- orchestration overhead
- audit protocol failures
- unnecessary complexity
- places where work duplicated itself

Important distinction:
- "annoying" is not enough
- the question is whether the issue distorted judgment, slowed progress materially, or made the record harder to trust

Output target:
- process, auditability, and near-failure entries in `FINDINGS.md`

### Phase 4: Convert findings into carry-forward actions

Every finding must end in one destination:

- `signal`
- `CLAUDE.md` / project guardrail
- `.planning/TECH-DEBT.md`
- GSD workflow/skill improvement backlog
- future initiative template
- no action, with reason

Record each accepted item in `CARRY-FORWARD-LEDGER.md`.

Output target:
- `CHANGES-BEFORE-NEXT-INITIATIVE.md`
- accepted items in `CARRY-FORWARD-LEDGER.md`

### Phase 5: Close with disposition

Produce `DEBRIEF-SUMMARY.md` with:

- what the initiative accomplished
- the top 3-5 process wins
- the top 3-5 process failures or near-failures
- what must change before the next initiative of this kind
- what was intentionally left unchanged

## Delegation Model

Recommended bounded work split:

1. `specs/spec-debrief-A-timeline-and-evidence-reconstruction.md`
2. `specs/spec-debrief-B-process-and-auditability-review.md`
3. `specs/spec-debrief-C-substantive-value-and-patterns-to-keep.md`
4. `specs/spec-debrief-D-carry-forward-synthesis-and-next-initiative-changes.md`

Guidance:

- Specs A, B, and C are good agent-sized evidence-gathering tasks.
- Spec D is synthesis and disposition work; keep final judgment local so one owner resolves contradictions and writes the final debrief.
- If delegation is used, agent outputs should be treated as evidence drafts until reviewed against the source files.

## Core Questions

Answer these explicitly:

1. Was the initiative worth doing relative to the problem it corrected?
2. Which parts of the initiative produced the highest leverage?
3. Which parts created the most overhead for the least value?
4. Did the spec/review/audit/handoff structure help or overcomplicate the work?
5. Where did state drift or stale docs create avoidable confusion?
6. Did the formal audit moments happen at the right times?
7. What should become standard for future strategic initiatives in this repo?
8. What should never be repeated in the same form?

## Standards For Findings

A finding is only valid if it has:

- a clear claim
- specific evidence
- consequence
- recommended disposition

Weak example:
- "There were too many documents."

Strong example:
- "Top-level initiative docs mixed canonical record and in-flight orchestration state, which created stale status contradictions between `README.md` and `.planning/STATE.md`; future initiatives should separate canonical record from process artifacts at creation time."

## Output Artifacts

Expected files in this directory:

- `README.md`
- `DEBRIEF-PLAN.md`
- `SPEC-INDEX.md`
- `EVIDENCE-INDEX.md`
- `CARRY-FORWARD-LEDGER.md`
- `TIMELINE.md`
- `FINDINGS.md`
- `PATTERNS-TO-KEEP.md`
- `CHANGES-BEFORE-NEXT-INITIATIVE.md`
- `DEBRIEF-SUMMARY.md` once the debrief is run

## Completion Criteria

The debrief is complete when:

1. `TIMELINE.md`, `FINDINGS.md`, `PATTERNS-TO-KEEP.md`, and `CHANGES-BEFORE-NEXT-INITIATIVE.md` are populated or intentionally marked not applicable
2. `DEBRIEF-SUMMARY.md` exists
3. all material findings have dispositions in `CARRY-FORWARD-LEDGER.md`
4. any accepted immediate follow-ups have been created or linked
5. any rejected findings have reasons recorded

Until then, the debrief is in progress, not done.

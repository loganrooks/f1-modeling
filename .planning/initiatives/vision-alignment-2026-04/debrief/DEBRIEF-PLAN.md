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

1. `../README.md`
2. `../SPEC-INDEX.md`
3. `../APPLICATION-LEDGER.md`
4. `../SUMMARY.md`
5. `../audit/2026-04-11-d4-acceptance-response.md`
6. `../audit/2026-04-11-stage-3-application-response.md`
7. `../reviews/review-wave-2-structure-decisions.md`
8. `../reports/report-wave-1-orchestrator-execution.md`
9. `../handoffs/`
10. `../specs/`
11. `.planning/knowledge/signals/f1-modeling/2026-04-11-claude-bypassed-formal-audit-protocol.md`

Then read specific research, deliberation, synthesis, or archive files only when a finding needs direct evidence.

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
- a dated timeline section in `DEBRIEF-SUMMARY.md`

### Phase 2: Evaluate what went well

Look for:

- places where the initiative corrected a real roadmap/architecture mistake
- places where cross-model review improved quality
- where the spec structure helped rather than hurt
- where audits caught real issues before or during application

Rule:
- every positive claim needs a file or commit reference

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

### Phase 4: Convert findings into carry-forward actions

Every finding must end in one destination:

- `signal`
- `CLAUDE.md` / project guardrail
- `.planning/TECH-DEBT.md`
- GSD workflow/skill improvement backlog
- future initiative template
- no action, with reason

Record each accepted item in `CARRY-FORWARD-LEDGER.md`.

### Phase 5: Close with disposition

Produce `DEBRIEF-SUMMARY.md` with:

- what the initiative accomplished
- the top 3-5 process wins
- the top 3-5 process failures or near-failures
- what must change before the next initiative of this kind
- what was intentionally left unchanged

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
- `EVIDENCE-INDEX.md`
- `CARRY-FORWARD-LEDGER.md`
- `DEBRIEF-SUMMARY.md` once the debrief is run

## Completion Criteria

The debrief is complete when:

1. `DEBRIEF-SUMMARY.md` exists
2. all material findings have dispositions in `CARRY-FORWARD-LEDGER.md`
3. any accepted immediate follow-ups have been created or linked
4. any rejected findings have reasons recorded

Until then, the debrief is in progress, not done.

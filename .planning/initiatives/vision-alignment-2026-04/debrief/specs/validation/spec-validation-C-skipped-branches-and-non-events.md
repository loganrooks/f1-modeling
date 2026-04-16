# Spec: Validation C - Skipped Branches And Non-Events

## Objective

Review planned-but-unexecuted branches, collapsed follow-ups, and other non-events so the debrief does not silently treat "recorded in the timeline" as equivalent to "evaluated for consequence."

## Debrief Traceability

This spec operationalizes:

- the `planned`, `executed`, and `applied` distinctions required by `../../DEBRIEF-PLAN.md`
- the need for factual reconstruction from Spec A before evaluative synthesis
- the H-lane warning that skipped branches were recorded in `../../TIMELINE.md` but not yet interrogated for whether they mattered

It validates whether the debrief has adequately considered non-events as part of the initiative record.

## Required Inputs

- `../../DEBRIEF-PLAN.md`
- `../../SPEC-INDEX.md`
- `../../TIMELINE.md`
- `../../FINDINGS.md`
- `../../EVIDENCE-INDEX.md`
- `../../../PLAN.md`
- `../../../SPEC-INDEX.md`
- `../../../reports/report-wave-1-orchestrator-execution.md`
- `../../../handoffs/`
- `../../../SUMMARY.md`

## Context Budget

Target:

- soft target: `<=55K` estimated tokens

Recommended core pack:

- `../../TIMELINE.md`
- `../../../PLAN.md`
- `../../../SPEC-INDEX.md`
- the key handoffs and execution reports that define planned branches and follow-ups

Escalation rule:

- Reopen detailed review or audit files only when the materiality of a skipped branch cannot be judged from the timeline plus the planning and handoff record.

## Questions To Answer

1. Which optional or planned branches were explicitly defined but never executed?
2. Which follow-ups narrowed, collapsed, or were replaced by a smaller substitute?
3. Which non-events were harmless, and which reduced evidence, review pressure, or correction opportunity?
4. Where should the debrief explicitly note consequence rather than only sequence?
5. Which skipped paths justify no action, and which should trigger `soften` or `reopen` on current debrief claims?

## Output Contract

Write only to `./report-validation-C-skipped-branches-and-non-events.md`.

## Required Sections

- `Planned But Unexecuted`
- `Collapsed Or Substituted Follow-Ups`
- `Materiality Assessment`
- `Consequences For Current Debrief Claims`
- `Disposition Recommendations`

## Standards

- A non-event is not automatically a failure; evaluate consequence, not mere absence.
- Distinguish `optional and intentionally unused`, `abandoned`, `collapsed`, and `unclear` branches.
- Name the evidence class each skipped branch would have added if it had run.
- Classify each branch outcome as `immaterial`, `worth noting`, `soften`, or `reopen`.
- If the timeline already mentions the non-event, the remaining question is whether the debrief drew the right consequence from it.
- Do not convert speculation about alternate history into findings; stay tied to explicit planned branches and their likely evidentiary role.

## Delegation Guidance

Good bounded task once `../../TIMELINE.md` exists. Keep the work on branch consequences, not general process criticism.

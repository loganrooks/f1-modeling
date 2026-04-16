# Debrief Plan

## Objective

Run a disciplined retrospective on the Vision Alignment Initiative that produces durable carry-forward changes rather than a one-off discussion.

The debrief should evaluate eight things separately:

1. **Substantive outcome quality** — did the initiative improve the roadmap and architectural direction?
2. **Process quality** — was the initiative run in a way that was efficient, legible, and correctable?
3. **Auditability quality** — could an outsider reconstruct what happened and why?
4. **Carry-forward quality** — were the lessons actually moved into live constraints, workflow, or backlog artifacts?
5. **Methodological fidelity** — did the research and deliberations meet the epistemic, traceability, boundary-contract, and handoff obligations they were supposed to operate under?
6. **Interaction quality** — how did the user, Codex, Claude, and subagents actually interact across the initiative, where did those interactions help, and where did they create friction or confusion?
7. **Role-fit quality** — which responsibilities were best handled by the user, Codex, Claude, and bounded subagents, and where did that division of labor help or hurt?
8. **Neglect and validation quality** — which claims remain under-supported, flattened, overconfident, or insufficiently verified even after the main debrief synthesis is drafted?

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
12. `../RESEARCH-PRINCIPLES.md`
13. `../BOUNDARY-CONTRACT-MEMO.md`
14. `../specs/`
15. `.planning/knowledge/signals/f1-modeling/2026-04-11-claude-bypassed-formal-audit-protocol.md`

Then read specific research, deliberation, synthesis, or archive files only when a finding needs direct evidence.

## Traceability Model

The debrief should preserve the same discipline the initiative used:

- every debrief output should cite the debrief spec that produced it
- every debrief spec should map back to the original initiative plan elements it is evaluating
- every finding should cite specific source files, and where relevant, the exact original wave, review gate, or application step involved

This is why the debrief has its own `SPEC-INDEX.md` and `specs/` directory rather than only freeform notes.

## Canonical Spec Stack

The debrief now has four canonical spec layers:

1. `specs/spec-debrief-A` through `specs/spec-debrief-H` for the main retrospective questions
2. `specs/transcript/` for transcript preparation, extraction, and residual miss-audit
3. `specs/validation/` for late-pass challenge checks before closeout hardens
4. `specs/runs/` for reusable run-manifest, lane-report, and orchestration doctrine

Historical lane executions, such as `runs/2026-04-16-llm-sweep/`, remain important evidence, but they are no longer the only place where the richer debrief architecture lives.

## Context Budget Discipline

Target per debrief lane:

- soft target: about `<=100K` estimated tokens
- acceptable stretch: about `<=115K` estimated tokens when the evidence requires it
- anything above that should be treated as a design mistake in the spec lane unless explicitly justified

Reading rules:

- Do not bulk-read whole directories just because a spec mentions them.
- Start with the core pack listed in the spec.
- Escalate to full research or deliberation files only when an evidence gap requires it.
- Prefer anchors, indexes, and synthesis summaries before full-file expansion.
- For chat/session evidence, follow `specs/transcript/` first. That layer owns transcript substrate rules, lane ids, artifact bundle shape, and residual miss-audit sequencing.
- The older prompts in `specs/extraction/` remain useful lane-level prompts, but they are subordinate to `specs/transcript/` if the two layers ever disagree.
- Prefer targeted extraction into `extracts/` before any synthesis lane reads transcript material directly.
- If a lane stretches past the soft target, record why.

## Work Sequence

### Phase 0: Prepare transcript evidence and residual miss-audit inputs

Run the canonical transcript layer before interaction-heavy synthesis:

- `specs/transcript/spec-transcript-prep-and-index.md`
- `specs/transcript/spec-transcript-extract-claude.md`
- `specs/transcript/spec-transcript-extract-codex.md`
- `specs/transcript/spec-transcript-extract-cross-model.md`
- `specs/transcript/spec-transcript-residual-miss-audit.md`

Output targets:

- transcript artifact bundles under `artifacts/transcript-nlp/`
- `extracts/claude-chat-extract.md`
- `extracts/codex-chat-extract.md`
- `extracts/cross-model-and-agent-usage-extract.md`
- residual miss-accounting required by the transcript layer before higher-level synthesis hardens interaction claims

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

### Phase 2: Evaluate methodological fidelity and contract adherence

Check explicitly:

- epistemic quality and calibration of the research outputs
- reliability and traceability of the deliberations
- adherence to `RESEARCH-PRINCIPLES.md`
- adherence to `BOUNDARY-CONTRACT-MEMO.md`
- adherence to the original orchestration goals in the handoffs
- where deviations occurred, whether they were justified, and what they cost

Output target:
- `EPISTEMIC-AND-CONTRACT-REVIEW.md`

### Phase 3: Synthesize interaction evidence

Check explicitly:

- moments of frustration, ambiguity, or repeated clarification
- moments where the interaction improved the work materially
- authorization and delegation confusion
- role shifts between Codex, Claude, and subagents
- where cross-model interaction caught real blind spots
- what the interaction history says about quality, not just artifacts

Output target:
- `extracts/`
- `INTERACTION-REVIEW.md`

### Phase 4: Evaluate what went well

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

### Phase 5: Evaluate role fit and division of labor

Check explicitly:

- where user gate ownership improved quality or corrected drift
- where Codex vs Claude role splits improved quality or introduced overhead
- where subagent usage was well-bounded versus underspecified
- which responsibilities should stay local rather than delegated

Output target:
- `MODEL-ROLE-AND-DIVISION-OF-LABOR.md`

### Phase 6: Evaluate what went wrong or almost went wrong

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

### Phase 7: Challenge the draft debrief for neglect, flattening, and weak verification

Run the explicit adversarial and validation passes:

- `specs/spec-debrief-H-neglect-and-counterevidence.md`
- `specs/validation/spec-validation-A-coverage-and-neglect.md`
- `specs/validation/spec-validation-B-synthesis-flattening-checks.md`
- `specs/validation/spec-validation-C-skipped-branches-and-non-events.md`
- `specs/validation/spec-validation-D-live-file-application-verification.md`

Output targets:

- `NEGLECT-AND-COUNTEREVIDENCE.md`
- compact validation reports under `specs/validation/`
- targeted corrections promoted into the canonical debrief files only after local review

### Phase 8: Convert findings into carry-forward actions

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

### Phase 9: Close with disposition

Produce `DEBRIEF-SUMMARY.md` with:

- what the initiative accomplished
- the top 3-5 process wins
- the top 3-5 process failures or near-failures
- what must change before the next initiative of this kind
- what was intentionally left unchanged

## Delegation Model

Recommended bounded work split:

1. `specs/transcript/spec-transcript-prep-and-index.md`
2. transcript extraction sublanes feeding `extracts/`
3. `specs/transcript/spec-transcript-residual-miss-audit.md`
4. `specs/spec-debrief-A-timeline-and-evidence-reconstruction.md`
5. `specs/spec-debrief-B-process-and-auditability-review.md`
6. `specs/spec-debrief-C-substantive-value-and-patterns-to-keep.md`
7. `specs/spec-debrief-E-epistemic-quality-and-contract-adherence.md`
8. `specs/spec-debrief-F-interaction-review.md`
9. `specs/spec-debrief-G-model-role-and-division-of-labor.md`
10. `specs/spec-debrief-H-neglect-and-counterevidence.md`
11. validation passes under `specs/validation/`
12. `specs/spec-debrief-D-carry-forward-synthesis-and-next-initiative-changes.md`

Guidance:

- Run the transcript prep/extraction/residual sequence first so later lanes inherit a bounded, auditable interaction substrate rather than raw log sprawl.
- Run Spec A early so the factual sequence is anchored.
- Specs B, C, and E are good agent-sized evidence-gathering tasks once A is complete.
- Run Spec F after transcript extraction and residual miss-audit so interaction analysis works from curated evidence plus explicit miss accounting.
- Run Spec G after Spec F so role-fit conclusions inherit the interaction synthesis rather than duplicating it.
- Run Spec H immediately before carry-forward synthesis so high-confidence claims are challenged while there is still time to soften or reopen them.
- Use validation passes late, after core outputs are drafted, to test coverage confidence, synthesis flattening, skipped branches, and live-file application claims.
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
7. Did the research outputs actually meet the epistemic and methodological requirements they were given?
8. Did the deliberations stay traceable, reliable, and boundary-contract compliant?
9. Did the initiative meet the original goals of the orchestrator handoff, and where did it deviate?
10. What does the interaction history reveal about moments of frustration, productive collaboration, and authorization ambiguity?
11. What does the interaction history reveal about Codex vs Claude roles, strengths, and blind spots in this initiative?
12. Which current debrief claims remain under-supported, flattened, or insufficiently verified before closeout?
13. What likely got missed or under-read, including skipped branches and non-events?
14. What should become standard for future strategic initiatives in this repo?
15. What should never be repeated in the same form?

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
- `EPISTEMIC-AND-CONTRACT-REVIEW.md`
- `INTERACTION-REVIEW.md`
- `MODEL-ROLE-AND-DIVISION-OF-LABOR.md`
- `NEGLECT-AND-COUNTEREVIDENCE.md`
- `PATTERNS-TO-KEEP.md`
- `CHANGES-BEFORE-NEXT-INITIATIVE.md`
- `DEBRIEF-SUMMARY.md` once the debrief is run

## Completion Criteria

The debrief is complete when:

1. `TIMELINE.md`, `FINDINGS.md`, `PATTERNS-TO-KEEP.md`, and `CHANGES-BEFORE-NEXT-INITIATIVE.md` are populated or intentionally marked not applicable
2. the transcript prep/extract/residual sequence has been run or intentionally waived with reason
3. `EPISTEMIC-AND-CONTRACT-REVIEW.md` is populated
4. `INTERACTION-REVIEW.md` is populated
5. `MODEL-ROLE-AND-DIVISION-OF-LABOR.md` is populated
6. `NEGLECT-AND-COUNTEREVIDENCE.md` is populated or intentionally marked not applicable
7. `DEBRIEF-SUMMARY.md` exists
8. any validation reports that were run have had accepted corrections promoted or explicitly deferred with reason
9. all material findings have dispositions in `CARRY-FORWARD-LEDGER.md`
10. any accepted immediate follow-ups have been created or linked
11. any rejected findings have reasons recorded

Until then, the debrief is in progress, not done.

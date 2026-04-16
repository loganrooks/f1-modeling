# Debrief Spec Index

The files in `specs/` are the bounded work contracts for running the post-initiative retrospective. They are traceable back to the original Vision Alignment plan so the debrief can be audited against what actually happened, not against hindsight alone.

## Debrief Spec Map

| Debrief spec | Purpose | Original traceability | Outputs | Delegation |
| --- | --- | --- | --- | --- |
| `specs/spec-debrief-A-timeline-and-evidence-reconstruction.md` | Reconstruct the factual sequence and evidence coverage | `../PLAN.md` wave structure and review gates; `../SPEC-INDEX.md`; `../APPLICATION-LEDGER.md` | `TIMELINE.md`, `EVIDENCE-INDEX.md` updates | Good agent task |
| `specs/spec-debrief-B-process-and-auditability-review.md` | Evaluate process quality, auditability, and near-failures | Review gates, handoffs, reports, advisory reviews, formal audits | `FINDINGS.md` process/auditability sections | Good agent task |
| `specs/spec-debrief-C-substantive-value-and-patterns-to-keep.md` | Evaluate whether the initiative corrected the right problem and which patterns are worth reusing | Research, deliberations, synthesis, application commits, live planning files | `FINDINGS.md` substantive sections, `PATTERNS-TO-KEEP.md` | Good agent task |
| `specs/spec-debrief-E-epistemic-quality-and-contract-adherence.md` | Evaluate research quality, deliberation reliability, traceability, and adherence to governing docs | `../RESEARCH-PRINCIPLES.md`; `../BOUNDARY-CONTRACT-MEMO.md`; handoffs; research and deliberation outputs | `EPISTEMIC-AND-CONTRACT-REVIEW.md` | Good agent task |
| `specs/spec-debrief-D-carry-forward-synthesis-and-next-initiative-changes.md` | Convert findings into concrete changes, dispositions, and closeout summary | Outputs of Specs A-C and E; `CLAUDE.md`; `.planning/ROADMAP.md`; `.planning/TECH-DEBT.md`; `.planning/STATE.md` | `CHANGES-BEFORE-NEXT-INITIATIVE.md`, `CARRY-FORWARD-LEDGER.md`, `DEBRIEF-SUMMARY.md` | Keep final synthesis local |

## Traceability Rule

Every populated debrief output should name:

- the debrief spec that produced it
- the original initiative wave, review gate, or application step it is discussing
- the evidence files that support the claim

If an output cannot be traced that way, it should be treated as working commentary rather than durable debrief record.

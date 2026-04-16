# Debrief Spec Index

The files in `specs/` are the bounded work contracts for running the post-initiative retrospective. They are traceable back to the original Vision Alignment plan so the debrief can be audited against what actually happened, not against hindsight alone.

The canonical debrief architecture now has four layers:

1. core debrief specs in `specs/spec-debrief-A` through `specs/spec-debrief-H`
2. transcript-processing specs in `specs/transcript/`
3. late-pass challenge specs in `specs/validation/`
4. reusable runbook/meta-specs in `specs/runs/`

The historical run in `runs/2026-04-16-llm-sweep/` remains important execution evidence, but it is no longer the only place where the richer retrospective architecture lives.

## Core Debrief Specs

| Debrief spec | Purpose | Original traceability | Outputs | Delegation |
| --- | --- | --- | --- | --- |
| `specs/spec-debrief-A-timeline-and-evidence-reconstruction.md` | Reconstruct the factual sequence and evidence coverage | `../PLAN.md` wave structure and review gates; `../SPEC-INDEX.md`; `../APPLICATION-LEDGER.md` | `TIMELINE.md`, `EVIDENCE-INDEX.md` updates | Good agent task |
| `specs/spec-debrief-B-process-and-auditability-review.md` | Evaluate process quality, auditability, and near-failures | Review gates, handoffs, reports, advisory reviews, formal audits | `FINDINGS.md` process/auditability sections | Good agent task |
| `specs/spec-debrief-C-substantive-value-and-patterns-to-keep.md` | Evaluate whether the initiative corrected the right problem and which patterns are worth reusing | Research, deliberations, synthesis, application commits, live planning files | `FINDINGS.md` substantive sections, `PATTERNS-TO-KEEP.md` | Good agent task |
| `specs/spec-debrief-D-carry-forward-synthesis-and-next-initiative-changes.md` | Convert findings into concrete changes, dispositions, and closeout summary | Outputs of Specs A-C and E-H; `CLAUDE.md`; `.planning/ROADMAP.md`; `.planning/TECH-DEBT.md`; `.planning/STATE.md` | `CHANGES-BEFORE-NEXT-INITIATIVE.md`, `CARRY-FORWARD-LEDGER.md`, `DEBRIEF-SUMMARY.md` | Keep final synthesis local |
| `specs/spec-debrief-E-epistemic-quality-and-contract-adherence.md` | Evaluate research quality, deliberation reliability, traceability, and adherence to governing docs | `../RESEARCH-PRINCIPLES.md`; `../BOUNDARY-CONTRACT-MEMO.md`; handoffs; research and deliberation outputs | `EPISTEMIC-AND-CONTRACT-REVIEW.md` | Good agent task |
| `specs/spec-debrief-F-interaction-review.md` | Synthesize interaction evidence from transcript extracts into collaboration findings | transcript extracts; handoffs; reports; timeline/findings context | `INTERACTION-REVIEW.md` | Good synthesis task after transcript prep |
| `specs/spec-debrief-G-model-role-and-division-of-labor.md` | Judge which responsibilities were best handled by the user, Codex, Claude, and subagents | handoffs; interaction review; audit/recovery record; role-shift evidence | `MODEL-ROLE-AND-DIVISION-OF-LABOR.md` | Good agent task after Spec F |
| `specs/spec-debrief-H-neglect-and-counterevidence.md` | Challenge draft debrief claims for blind spots, under-support, and skipped branches before closeout | Outputs of Specs A-C and E-G; evidence index; summary/application record | `NEGLECT-AND-COUNTEREVIDENCE.md`, targeted ledger updates | Good adversarial task before final synthesis |

## Transcript Processing Layer

This is the canonical transcript-processing sublayer. It owns transcript substrate rules, lane ids, artifact bundle shape, and residual miss-audit sequencing.

| Transcript spec | Purpose | Primary outputs |
| --- | --- | --- |
| `specs/transcript/spec-transcript-prep-and-index.md` | Prepare and verify the normalized transcript substrate before higher-level analysis | refreshed transcript artifacts under `artifacts/transcript-nlp/` |
| `specs/transcript/spec-transcript-extract-claude.md` | Produce the Claude-side interaction evidence pack | `extracts/claude-chat-extract.md` |
| `specs/transcript/spec-transcript-extract-codex.md` | Produce the Codex-side interaction evidence pack | `extracts/codex-chat-extract.md` |
| `specs/transcript/spec-transcript-extract-cross-model.md` | Produce the cross-model and agent-usage evidence pack | `extracts/cross-model-and-agent-usage-extract.md` |
| `specs/transcript/spec-transcript-residual-miss-audit.md` | Challenge the selected transcript windows with non-selected or underrepresented snippets before synthesis | transcript-layer miss accounting and residual audit output defined by the spec |

The older prompts in `specs/extraction/` remain useful lane-level prompts, but `specs/transcript/` wins on transcript-processing rules if the two layers ever disagree.

## Validation Layer

This late-pass challenge layer exists to test whether the drafted debrief is as well-supported as it claims to be before closeout hardens it into durable record.

| Validation spec | Purpose | Best run point | Default report |
| --- | --- | --- | --- |
| `specs/validation/spec-validation-A-coverage-and-neglect.md` | Measure actual evidence coverage and force explicit blind-spot accounting | After transcript extracts and core debrief outputs exist | `specs/validation/report-validation-A-coverage-and-neglect.md` |
| `specs/validation/spec-validation-B-synthesis-flattening-checks.md` | Compare nuanced upstream claims against later summary prose and detect over-compression | After findings and summary prose are drafted | `specs/validation/report-validation-B-synthesis-flattening-checks.md` |
| `specs/validation/spec-validation-C-skipped-branches-and-non-events.md` | Evaluate whether planned-but-unexecuted branches matter to the debrief's conclusions | After `TIMELINE.md` exists | `specs/validation/report-validation-C-skipped-branches-and-non-events.md` |
| `specs/validation/spec-validation-D-live-file-application-verification.md` | Verify that claimed live-file applications are proven by direct reread or diff evidence | Before final closeout | `specs/validation/report-validation-D-live-file-application-verification.md` |

## Runbook And Meta-Spec Layer

This layer turns `runs/2026-04-16-llm-sweep/` from a one-off execution example into reusable doctrine for future bounded sweeps.

| Run/meta spec | Purpose |
| --- | --- |
| `specs/runs/run-manifest-template.md` | Canonical shape for `runs/<run-id>/RUN-MANIFEST.md` |
| `specs/runs/lane-report-template.md` | Canonical invariant scaffold for worker-owned report outputs |
| `specs/runs/agent-orchestration-runbook.md` | Operating procedure for lane creation, launch, monitoring, and evidence-discipline |

## Traceability Rule

Every populated debrief output should name:

- the debrief spec or validation spec that produced it
- the original initiative wave, review gate, handoff, or application step it is discussing
- the evidence files that support the claim

If an output cannot be traced that way, it should be treated as working commentary rather than durable debrief record.

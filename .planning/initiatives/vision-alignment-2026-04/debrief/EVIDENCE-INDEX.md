# Evidence Index

This is the recommended evidence set for the Vision Alignment Initiative debrief.

## Trigger / Origin Record

- `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
  - use this before the initiative-local record when reconstructing Spec A from the original trigger; it names the initiating "wrong-sized question" problem and the proposed Stage 1-4 follow-up shape that the initiative later instantiated

## Primary Record

- `../README.md`
  - best current high-level description of what the initiative was and what changed
- `../SPEC-INDEX.md`
  - maps the executable specs to outputs
- `../APPLICATION-LEDGER.md`
  - shows what was actually applied to live project files
- `../SUMMARY.md`
  - historical Stage 3 closeout snapshot

## Governing Method And Contract Documents

- `../RESEARCH-PRINCIPLES.md`
- `../BOUNDARY-CONTRACT-MEMO.md`
- `../PLAN.md`

Use these to judge whether the initiative's research and deliberations met their stated epistemic, methodological, and contract-shaping obligations.

## Formal Audit Trail

- `../audit/2026-04-11-d4-acceptance-request.md`
- `../audit/2026-04-11-d4-acceptance-response.md`
- `../audit/2026-04-11-stage-3-application-request.md`
- `../audit/2026-04-11-stage-3-application-response.md`
- `../audit/README.md`

Use these to judge whether the formal audit machinery was helpful, mistimed, or under-specified.

## Process / Orchestration Record

- `../reviews/review-wave-2-structure-decisions.md`
- `../reports/report-wave-1-orchestrator-execution.md`
- `../handoffs/handoff-codex-primary-orchestrator.md`
- `../handoffs/handoff-claude-fallback-session.md`
- `../handoffs/handoff-claude-stage-3-formal-audit.md`

Use these to assess orchestration overhead, Gate 1 restructuring, handoff quality, protocol clarity, and whether the initiative met the goals of the original handoffs.

## Chat / Session Evidence

- `../logs/wave-1A.log`
- `../logs/wave-1B.log`
- `../logs/wave-1C.log`
- `~/.claude/projects/-home-rookslog-workspace-projects-f1-modeling/*.jsonl`
- `~/.claude/history.jsonl`
- `~/.codex/history.jsonl`
- `~/.codex/sessions/`

Use these to reconstruct user/model interaction quality, frustration points, positive collaboration moments, authorization ambiguity, cross-model role shifts, and subagent usage patterns.

Important:

- Do not bulk-read these stores into a synthesis lane.
- First extract targeted evidence into `extracts/`.
- Prefer project-scoped session files and initiative-date slices before global history files.

## Spec Layer

- `../specs/`

Use these to assess whether the initiative's executable-task-spec approach improved clarity and auditability or created unnecessary document sprawl.

## Research And Deliberation Layers

- `../research/`
- `../deliberations/`

Use these to assess research epistemic quality, deliberation traceability, adherence to the three-response framework, and conformance to the boundary-contract assignments.

## Decision Layer

- `../deliberations/01-decision-anchor.md`
- `../deliberations/02-decision-anchor.md`
- `../deliberations/03-decision-anchor.md`
- `../deliberations/04-decision-anchor.md`
- `../deliberations/05-decision-anchor.md`

Read the full deliberations only when a finding requires details beyond the anchors.

## Synthesis Layer

- `../synthesis/roadmap-evolution.md`
- `../synthesis/phase-insertion-proposals.md`
- `../synthesis/guardrails-proposal.md`
- `../synthesis/tech-debt-registry.md`

Use these to assess whether synthesis stayed faithful to prior decisions and whether it produced actionable outputs.

## Related Signals

- `.planning/knowledge/signals/f1-modeling/2026-04-11-claude-bypassed-formal-audit-protocol.md`

Add more linked signals here if the debrief surfaces them.

## Live Project State For Cross-Check

- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/TECH-DEBT.md`
- `CLAUDE.md`

These are the source of truth for what actually carried forward.

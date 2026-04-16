# Carry-Forward Ledger

Use this ledger to convert debrief findings into actual carry-forward actions.

| ID | Finding | Evidence | Consequence | Destination | Action | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CF-01` | Implicit-language authorization and recommendation flips created avoidable trust drag. | `FINDINGS.md:85-121`; `runs/2026-04-16-llm-sweep/reports/C-friction-pushback-and-recovery.md`; `runs/2026-04-16-llm-sweep/reports/D-delegation-agent-usage-and-orchestration.md` | Review gates and launch boundaries can be skipped by conversational shorthand. | `workflow`, `template` | Add per-launch authorization fields and artifact-lag checks to future initiative scaffolds and handoffs. | accepted | This is the main interaction/process carry-forward. |
| `CF-02` | Scheduled formal audits need a startup preflight, not just a written protocol. | `FINDINGS.md:42-68`; `runs/2026-04-16-llm-sweep/reports/F-deliberation-quality-and-contract-adherence.md` | Without a preflight, advisory-mode reflex can silently replace the real gate. | `workflow`, `guardrail` | Require `audit/` check plus explicit mode declaration before any high-stakes review. | accepted | D4 is the proof case; Stage 3 is the recovered pattern. |
| `CF-03` | Detached CLI orchestration was unreliable; bounded agent fallback was reliable. | `FINDINGS.md:30-40`; `runs/2026-04-16-llm-sweep/reports/D-delegation-agent-usage-and-orchestration.md` | Hidden state and stalled launches make the record harder to trust. | `workflow` | Ban detached `nohup ... codex exec ...` for strategic initiatives. | accepted | Prefer bounded Codex-native agents/subagents with explicit ownership. |
| `CF-04` | Canonical entrypoints and historical-snapshot banners are required once the record gets deep enough. | `FINDINGS.md:70-83`; `TIMELINE.md`; `runs/2026-04-16-llm-sweep/reports/A-timeline-and-event-alignment.md` | Later readers can misread historical scaffolds or renamed paths as live state. | `template` | Add canonical-entrypoint, historical-snapshot, and alias-map sections to future initiative templates. | accepted | Applies to both initiatives and debriefs. |
| `CF-05` | Transcript debrief coverage claims are currently stronger than the evidence manifests warrant. | `NEGLECT-AND-COUNTEREVIDENCE.md`; `specs/validation/report-validation-A-coverage-and-neglect.md`; `extracts/claude-chat-extract.md:33-35`; `extracts/codex-chat-extract.md:33-35`; `extracts/cross-model-and-agent-usage-extract.md:31-33` | Debrief summaries can overstate certainty and miss unreviewed evidence classes. | `workflow`, `template` | Add explicit coverage accounting, non-event analysis, synthesis-flattening checks, and an LLM residual miss-audit over non-selected snippet pools before making strong blind-spot claims. | accepted | This should feed the next transcript-NLP hardening pass. |
| `CF-06` | Correction-driven pushback and role-fit decisions were major positive patterns, not incidental chatter. | `FINDINGS.md:97-109`; `INTERACTION-REVIEW.md`; `runs/2026-04-16-llm-sweep/reports/B-positive-collaboration-and-what-worked.md`; `runs/2026-04-16-llm-sweep/reports/G-codex-vs-claude-role-comparison.md` | Future debriefs will undercount what worked if they only track failures and neutral process milestones. | `template` | Add positive-pattern prompts for correction loops, role transfers, and user calibration moments in future debrief scaffolds. | accepted | This is a debrief-template improvement rather than a repo guardrail. |
| `CF-07` | `AccessibleChartContract` and `AnchorRegistry` remain mandatory carry-forward obligations. | `EPISTEMIC-AND-CONTRACT-REVIEW.md`; `NEGLECT-AND-COUNTEREVIDENCE.md`; `specs/validation/report-validation-C-skipped-branches-and-non-events.md` | D2/D3 implementation can still outrun their interface closure if planning gets sloppy. | `tech-debt` | Re-verify these as explicit planning gates before 3.3/3.4 implementation. | applied | Already carried into `.planning/TECH-DEBT.md`; this debrief confirms the carry-forward should stand. |
| `CF-08` | R6 performance-envelope numbers are still provisional and need benchmark validation. | `EPISTEMIC-AND-CONTRACT-REVIEW.md` | Unbenchmarked numbers can be mistaken for hard constraints. | `tech-debt` | Re-verify benchmark/reporting work as a prerequisite before treating R6 numbers as hard planning bounds. | applied | Already reflected in the initiative's tech-debt carry-forward. |
| `CF-09` | Ledger-based application claims should be backed by a final live-file verification step. | `NEGLECT-AND-COUNTEREVIDENCE.md`; `specs/validation/report-validation-D-live-file-application-verification.md`; `TIMELINE.md` | Closeout can otherwise overtrust the application ledger without re-reading the applied files. | `workflow` | Add a final application-verification pass that rereads live files or diffs before declaring initiative closeout. | accepted | This is a closeout workflow improvement rather than a new planning artifact. |

## Destination Rules

- `signal` — the lesson should become a durable signal in the knowledge store
- `guardrail` — the lesson should change `CLAUDE.md`, planning conventions, or initiative rules
- `workflow` — the lesson should change GSD or initiative operating procedure
- `tech-debt` — the lesson belongs in `.planning/TECH-DEBT.md`
- `template` — the lesson should change future initiative/debrief scaffolding
- `none` — explicitly rejected or informational only

## Status Meanings

- `proposed` — identified but not yet accepted
- `accepted` — accepted and awaiting application
- `applied` — applied to its destination
- `rejected` — intentionally not carried forward

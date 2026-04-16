# Interaction Review

**Status:** Populated on 2026-04-16 from Debrief Spec F and the LLM sweep reports.
**Source spec:** `specs/spec-debrief-F-interaction-review.md`

## Bottom Line

The initiative's interaction quality was uneven but net-positive. The most useful moments were not generic agreement; they were the points where pushback forced direct correction, clearer state, better role assignment, or stronger protocol. The most damaging moments were procedural, not architectural: implicit authorization was treated as blanket launch permission, recommendation changes briefly outran the analysis behind them, and D4 fell into advisory-mode reflex instead of the scheduled formal audit path. The collaboration improved when those failures were externalized into handoffs, audit requests, and explicit role contracts.

## Main Findings

- User pushback was an active quality mechanism, not just friction. The record repeatedly shows correction plus state restatement after challenge, and the best structural improvement in the initiative came from cross-model pushback that restructured the wave plan around Option `delta` and the D1/D5 split. Evidence: `extracts/claude-chat-extract.md:20-26`; `runs/2026-04-16-llm-sweep/reports/B-positive-collaboration-and-what-worked.md`; `runs/2026-04-16-llm-sweep/reports/C-friction-pushback-and-recovery.md`.
- The sharpest trust erosion came from process-boundary failures, not from deep disagreement about the architecture. The recurring harms were implicit launch authorization, recommendation reversal before re-analysis, hidden or ambiguous execution state, and the D4 formal-audit bypass. Evidence: `FINDINGS.md:42-109`; `runs/2026-04-16-llm-sweep/reports/C-friction-pushback-and-recovery.md`; `runs/2026-04-16-llm-sweep/reports/D-delegation-agent-usage-and-orchestration.md`.
- Delegation helped when it was bounded and observable. Wave 1's subagent fallback, explicit write ownership, and cross-model audits improved throughput and quality. Detached or opaque execution paths did not. Evidence: `reports/report-wave-1-orchestrator-execution.md:34-38`; `runs/2026-04-16-llm-sweep/reports/D-delegation-agent-usage-and-orchestration.md`.
- The best sustained role split was explicit: user as gate owner and calibration actor, Codex as primary orchestrator and bounded executor, Claude as scheduled auditor/fallback. The record shows that ambiguity dropped only after this was documented. Evidence: `handoffs/handoff-codex-primary-orchestrator.md:196-203`; `runs/2026-04-16-llm-sweep/reports/G-codex-vs-claude-role-comparison.md`.
- The current interaction evidence pack is useful but not exhaustive. Its biggest weakness is coverage-confidence inflation: the extracts are windowed and still used "no major blind spots" language that the adversarial lane did not accept. Evidence: `runs/2026-04-16-llm-sweep/reports/H-neglect-and-counterevidence.md`.

## Role Assessment

- `User`: active calibration actor who forced explicit corrections, blocked over-launching, questioned sycophantic flips, and closed review gates rather than acting as a passive approver.
- `Codex`: strongest at bounded execution, structural pushback, prompt/deliberation orchestration once a written role contract existed, and lifecycle-aware agent use.
- `Claude`: strongest at user-facing clarification, handoff writing, and formal audit work once the audit mode was explicit, but also the source of the clearest advisory-pattern reflex and recommendation-lag failures.
- `Subagents`: useful for scoped work with disjoint ownership; poor fit when hidden behind detached background execution or ambiguous ownership.

## Review Table

| Moment type | Date or phase | Interaction summary | Evidence | Consequence | Proposed disposition |
| --- | --- | --- | --- | --- | --- |
| Productive correction loop | 2026-04-09 to 2026-04-11 | User challenge repeatedly caused direct correction plus clearer state restatement instead of defensive smoothing. | `extracts/claude-chat-extract.md:20-25`; `runs/2026-04-16-llm-sweep/reports/B-positive-collaboration-and-what-worked.md` | Improved trust and made later work more legible. | Keep as positive interaction pattern and extraction target. |
| Structural pushback | Review Gate 1 | Codex review challenged the original Wave 2 framing, leading to Option `delta`, the boundary memo, and the D1/D5 split. | `reviews/review-wave-2-structure-decisions.md:385-491,747-759`; `runs/2026-04-16-llm-sweep/reports/C-friction-pushback-and-recovery.md` | Highest-leverage interaction turn in the initiative. | Preserve pushback-as-signal doctrine. |
| Implicit authorization overrun | Wave 1.5 to D1 transition | "Proceed with the next steps" was treated as permission to launch too much work and skip a review gate. | `handoffs/handoff-codex-primary-orchestrator.md:577-583`; `FINDINGS.md:85-96` | Trust drag and methodology breach. | Keep one-launch-per-authorization as a hard workflow rule. |
| Recommendation reversal after pushback | Switchover decision | Claude flipped to Option B before re-analysis, then later concluded Option A was stronger after artifacts already assumed B. | `handoffs/handoff-codex-primary-orchestrator.md:585-603`; `FINDINGS.md:110-121` | Avoidable cleanup and reduced recommendation trust. | Add re-analysis-before-reversal and artifact-lag checks. |
| Delegation win through bounded fallback | Wave 1 execution | Detached launches failed, but bounded Codex-native subagents with validation succeeded. | `reports/report-wave-1-orchestrator-execution.md:34-38`; `runs/2026-04-16-llm-sweep/reports/D-delegation-agent-usage-and-orchestration.md` | Throughput improved without losing auditability. | Ban detached launch pattern; keep bounded subagent usage. |
| Role-specialized handoff | Claude to Codex switchover | Resource pressure was turned into a document-governed role split with Codex primary and Claude as scheduled auditor/fallback. | `extracts/claude-chat-extract.md:23-29`; `handoffs/handoff-codex-primary-orchestrator.md:196-203` | Reduced context-risk and clarified ownership. | Keep explicit role contract in future initiatives. |
| Audit-mode failure and recovery | D4 then Stage 3 | D4 was mistakenly handled in advisory mode, then later recovered through post-hoc audit and a correct pre-application Stage 3 audit. | `audit/2026-04-11-d4-acceptance-response.md:10-18`; `handoffs/handoff-claude-stage-3-formal-audit.md:17-45` | Strongest example of process failure becoming process improvement. | Require audit preflight and draft-as-input protocol. |

## Interaction Disposition

- Keep productive pushback, explicit correction, and role-transfer moments as first-class positive evidence in future transcript reviews.
- Treat authorization ambiguity, recommendation reversal without re-analysis, and advisory-vs-formal mode confusion as high-priority workflow hazards.
- Judge future interaction quality by whether it improved artifact quality and protocol reliability, not by whether it looked smooth.

# Interaction Review

**Status:** Refreshed on 2026-04-16 after transcript pipeline hardening.
**Source spec:** `specs/spec-debrief-F-interaction-review.md`

## Bottom Line

The reviewed interaction evidence supports an uneven but net-positive picture. The strongest moments were the ones where pushback forced explicit correction, clearer state, or a tighter protocol boundary; in the retained sample, the clearest failures were process-boundary failures rather than architectural disagreement. The hardened transcript substrate supports that story, but it should be treated as useful and auditable rather than exhaustive: the current evidence pack is windowed, non-exhaustive, and still subject to duplicate-candidate and family-concentration limits.

## Main Findings

- User pushback functioned as a real quality mechanism. The reviewed evidence repeatedly shows correction plus state restatement after challenge, and the highest-leverage retained interaction turn was cross-model pushback that helped restructure the work around Option `delta` and the D1/D5 split. Evidence: `extracts/claude-chat-extract.md`; `extracts/cross-model-and-agent-usage-extract.md`; `runs/2026-04-16-llm-sweep/reports/B-positive-collaboration-and-what-worked.md`; `runs/2026-04-16-llm-sweep/reports/C-friction-pushback-and-recovery.md`.
- In the reviewed interaction evidence, trust drag is most clearly associated with process-boundary failures rather than architectural disagreement. The recurring harms in the retained sample were implicit authorization, recommendation reversal before re-analysis, ambiguous execution state, and the D4 advisory-vs-formal audit failure. Evidence: `FINDINGS.md`; `audit/2026-04-11-d4-acceptance-response.md`; `runs/2026-04-16-llm-sweep/reports/C-friction-pushback-and-recovery.md`.
- Delegation improved quality when it was bounded and observable. Wave 1's fallback to bounded Codex-native subagents preserved throughput and auditability, while detached execution and opaque background launch patterns degraded trust. Evidence: `reports/report-wave-1-orchestrator-execution.md`; `runs/2026-04-16-llm-sweep/reports/D-delegation-agent-usage-and-orchestration.md`.
- The retained evidence suggests the user/Codex/Claude/subagent role split became much more reliable after it was written down. The later explicit contract reduced ambiguity more than the earlier informal pattern did. Evidence: `handoffs/handoff-codex-primary-orchestrator.md`; `handoffs/handoff-claude-fallback-session.md`; `runs/2026-04-16-llm-sweep/reports/G-codex-vs-claude-role-comparison.md`.
- The hardened transcript pack is good enough for synthesis, but not strong enough to justify exhaustive-recall language. `NEGLECT-REVIEW.md` still shows duplicate-fingerprint clusters in Claude and cross-model pools, and the cross-model lane remains concentrated in one primary emitted family (`7/10`). Evidence: `NEGLECT-REVIEW.md`; `artifacts/transcript-nlp/lanes/claude-chat/neglect-report.json`; `artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/neglect-report.json`.

## Evidence Table

| Interaction pattern | Evidence | What it supports | Support strength | Limit |
| --- | --- | --- | --- | --- |
| Productive correction loop | `extracts/claude-chat-extract.md`; `runs/2026-04-16-llm-sweep/reports/B-positive-collaboration-and-what-worked.md` | Pushback often improved clarity rather than merely adding friction. | High | The windowed transcript substrate does not quantify total user steering burden. |
| Structural pushback at Review Gate 1 | `reviews/review-wave-2-structure-decisions.md`; `runs/2026-04-16-llm-sweep/reports/C-friction-pushback-and-recovery.md` | The most valuable interaction turn changed initiative structure, not just prose. | High | The review record is strong; transcript extracts are supplementary here. |
| Implicit authorization overrun | `FINDINGS.md`; `handoffs/handoff-codex-primary-orchestrator.md` | Conversational shorthand was not a reliable authorization boundary. | High | The exact magnitude of downstream cleanup remains medium-confidence. |
| Detached execution vs bounded delegation | `reports/report-wave-1-orchestrator-execution.md`; `runs/2026-04-16-llm-sweep/reports/D-delegation-agent-usage-and-orchestration.md` | Bounded, observable delegation improved quality; detached execution did not. | High | The retained evidence proves the failure shape more clearly than the root cause. |
| Explicit role split | `extracts/cross-model-and-agent-usage-extract.md`; `handoffs/handoff-codex-primary-orchestrator.md`; `runs/2026-04-16-llm-sweep/reports/G-codex-vs-claude-role-comparison.md` | User as gate owner, Codex as primary orchestrator, and Claude as auditor/fallback was the most stable division of labor. | Medium-high | The transcript substrate is still concentrated toward a few role-shift moments. |
| Audit-mode failure and recovery | `audit/2026-04-11-d4-acceptance-response.md`; `handoffs/handoff-claude-stage-3-formal-audit.md` | Process failure became process improvement once audit mode was made explicit. | High | This is strongest on process order, not on broader user-trust measurement. |

## Interaction Limits

- The hardened transcript pipeline provides auditable, compact evidence packs. It does **not** prove exhaustive recall of the underlying session corpus.
- The current lane outputs are selected windows rather than comprehensive rereads. Their main remaining miss risks are duplicate candidate clusters, cross-model family concentration, and under-measured user steering load.
- `NEGLECT-REVIEW.md` and the per-lane `neglect-report.json` files should be treated as the limiting context for any later confidence claim about transcript coverage.
- The absence of a structural neglect finding in the Codex lane means the implemented checks passed; it does not mean the Codex session universe was fully reviewed.

## Interaction Disposition

- Keep productive pushback, explicit correction, and role-transfer moments as first-class positive evidence in future transcript reviews.
- Treat authorization ambiguity, recommendation reversal without re-analysis, and advisory-vs-formal mode confusion as high-priority workflow hazards.
- Keep delegation bounded, observable, and role-scoped; preserve the ban on detached background orchestration for this class of initiative.
- Carry the transcript limits forward into the adversarial and validation passes rather than summarizing the interaction layer as if it were exhaustive.

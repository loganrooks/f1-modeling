# Lane G Report

**Status:** Completed locally after worker retry failure.
**Spec:** `../specs/spec-lane-G-codex-vs-claude-role-comparison.md`

## Bottom Line

Codex was the better primary orchestrator for this initiative once the work became multi-wave, document-heavy, and dependent on bounded execution with explicit lifecycle control. Claude was strongest as a user-facing dialogue partner, handoff author, and scheduled auditor, but it was also the model that most clearly exhibited advisory-pattern reflex and recommendation-reversal risk when protocol was not re-read first. The best role split in the record is the one the initiative eventually wrote down: Codex as primary orchestrator and bounded executor, Claude as cross-model auditor and fallback, user as gate owner. Sources: `../../extracts/claude-chat-extract.md:20-31`; `../../extracts/codex-chat-extract.md:20-31`; `../../extracts/cross-model-and-agent-usage-extract.md:20-29`; `../../../handoffs/handoff-codex-primary-orchestrator.md:158-203`; `../../../handoffs/handoff-claude-stage-3-formal-audit.md:17-45`.

## Codex Strengths And Risks

- Codex produced the most important structural pushback in the initiative: the move from Option `beta` to Option `delta`, the elevation of artifact/provenance as a cross-cutting contract, and the D1/D5 split for the old R5 problem. Sources: `../../../handoffs/handoff-codex-primary-orchestrator.md:158-170`; `../../../reviews/review-wave-2-structure-decisions.md:747-759`.
- Codex was the better fit for bounded execution and lifecycle control. The extracts explicitly note agent-mode advantages for D2, and Wave 1 succeeded only after detached CLI launches were replaced with Codex-native subagents. Sources: `../../extracts/codex-chat-extract.md:24-27`; `../../../reports/report-wave-1-orchestrator-execution.md:36-38`.
- Codex handled the primary-orchestrator role well once it had a written role contract. The handoff clearly frames it as orchestrator, not just executor, and the later deliberation / Stage 3 chain is consistent with that shift. Sources: `../../../handoffs/handoff-codex-primary-orchestrator.md:196-203`; `../../../README.md:5-9`.
- Codex risks remained the ones the fallback handoff warns about: confidence bias, label-trap drift, premature closure, and missed cross-cutting constraints. Those are documented as live risks, not hypothetical theory. Sources: `../../../handoffs/handoff-claude-fallback-session.md:405-412`.

## Claude Strengths And Risks

- Claude was strongest at user-facing clarification, status untangling, and writing load-bearing handoffs that preserved cross-session state. The extracts show repeated moments where Claude corrected errors directly and restated the state more clearly after pushback. Sources: `../../extracts/claude-chat-extract.md:20-26`; `../../extracts/cross-model-and-agent-usage-extract.md:20-27`.
- Claude was also the stronger formal auditor once the protocol was explicit. The Stage 3 formal audit handoff and the resulting pre-application audit are the cleanest examples of cross-session protocol discipline working well. Sources: `../../../handoffs/handoff-claude-stage-3-formal-audit.md:17-45`; `../../../audit/2026-04-11-stage-3-application-response.md:1-11`.
- Claude's main risks were process-pattern risks rather than content weakness: advisory-mode reflex at the D4 audit moment, recommendation reversal after user pushback, and temporary mismatch between artifacts and updated judgment. Sources: `../../../audit/2026-04-11-d4-acceptance-response.md:10-18`; `../../../handoffs/handoff-codex-primary-orchestrator.md:585-603`.
- The fallback handoff itself preserves a risk signal: it still contains a historical body that says "Codex is executor, not orchestrator" beneath later superseding banners. That means Claude's retained artifacts were useful but also carried transition-layer ambiguity. Sources: `../../../handoffs/handoff-claude-fallback-session.md:257-261`; `../../../handoffs/handoff-claude-fallback-session.md:25-38`.

## Cross-Model Handoff Effects

- The Codex pushback on Wave 2 structure is the clearest case where cross-model review improved the initiative materially. It changed the wave plan, not just the prose. Sources: `../../../reviews/review-wave-2-structure-decisions.md:385-491,747-759`; `../../../handoffs/handoff-codex-primary-orchestrator.md:158-170`.
- The Claude to Codex switchover improved throughput and reduced context-risk, but only after the role split was made explicit. Sources: `../../extracts/claude-chat-extract.md:23-29`; `../../../handoffs/handoff-codex-primary-orchestrator.md:196-203`.
- The D4 audit bypass shows the cost side of cross-model work when the mode is not explicit. Cross-model review helped, but only the later formal-audit handoff made the audit-vs-advisory distinction operationally reliable. Sources: `../../../audit/2026-04-11-d4-acceptance-response.md:10-18`; `../../../handoffs/handoff-claude-stage-3-formal-audit.md:17-25`.
- Overall effect: cross-model interaction was valuable when it was document-governed and role-scoped. It was risky when it depended on session memory or conversational pattern matching.

## What The Current Pipeline Already Captured

- It already captured the key role-shift moments, cross-model audit usage, and agent-selection reasoning. Sources: `../../extracts/claude-chat-extract.md:23-31`; `../../extracts/codex-chat-extract.md:24-27`; `../../extracts/cross-model-and-agent-usage-extract.md:22-29`.
- It already captured that Codex and Claude were not doing interchangeable work. The handoff stack and extract set make that clear even before this report names the resulting role split explicitly. Sources: `../../../handoffs/handoff-codex-primary-orchestrator.md:196-203`; `../../../handoffs/handoff-claude-stage-3-formal-audit.md:17-45`.

## What It Likely Missed

- It underplays that several apparent "model issues" were really orchestration issues. The most expensive failures came from authorization handling and mode confusion, not from either model being generally poor at the work.
- It underplays the historical transition overhead. The fallback handoff contains materially superseded body content that a later reader could misread without the top banners.
- It does not currently separate model-role evidence from user-role evidence. In practice, the user was the calibration actor who made the role split work.

## Deterministic Implications

- Preserve Codex as the default primary orchestrator for bounded execution and document-heavy initiative work.
- Preserve Claude as scheduled auditor, second-opinion partner, and fallback path rather than a parallel co-orchestrator.
- Require every handoff to state whether it supersedes earlier role assumptions and to name the canonical role contract directly.
- Add explicit model-comparison output to future debriefs so role-fit is evaluated intentionally rather than inferred after the fact.

## Confidence And Limits

- Confidence is medium-high because the extracts, handoffs, and audit docs all converge on the same role split and the same failure modes.
- Limit: this report is synthesized locally after the worker retry failed, so it does not add new raw-corpus coverage beyond the existing extract and document pack.

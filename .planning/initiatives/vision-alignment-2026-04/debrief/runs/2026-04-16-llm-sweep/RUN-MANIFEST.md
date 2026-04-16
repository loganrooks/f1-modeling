# Run Manifest

**Run ID:** `2026-04-16-llm-sweep`
**Purpose:** Parallel xhigh analysis sweep for the Vision Alignment debrief
**Primary model:** `gpt-5.4`
**Reasoning effort:** `xhigh`
**Run date:** 2026-04-16

## Run Rules

- Use existing initiative and transcript artifacts as the retrieval substrate.
- Do not rewrite the top-level debrief files directly from worker lanes.
- Each lane owns exactly one file under `reports/`.
- Preferred pack size is `60K-85K` estimated tokens.
- Soft cap is `95K`; stretch cap is `110K` only when the lane explains why.
- Workers should note evidence gaps rather than padding claims.

## Lane Map

| Lane | Focus | Core evidence pack | Estimated input | Output |
| --- | --- | --- | ---: | --- |
| `A` | Timeline and event alignment | `../../TIMELINE.md`, `../../EVIDENCE-INDEX.md`, `../../../../README.md`, `../../../../APPLICATION-LEDGER.md`, `../../../../reports/report-wave-1-orchestrator-execution.md`, `../../../../handoffs/`, `../../../../audit/2026-04-11-d4-acceptance-response.md`, `../../../../audit/2026-04-11-stage-3-application-response.md` | `80K-90K` | `reports/A-timeline-and-event-alignment.md` |
| `B` | Positive collaboration and what worked | `../../extracts/claude-chat-extract.md`, `../../extracts/codex-chat-extract.md`, `../../extracts/cross-model-and-agent-usage-extract.md`, `../../FINDINGS.md`, `../../PATTERNS-TO-KEEP.md`, `../../../../reports/report-wave-1-orchestrator-execution.md`, `../../../../handoffs/` | `65K-80K` | `reports/B-positive-collaboration-and-what-worked.md` |
| `C` | Friction, pushback, trust erosion, and recovery | `../../extracts/claude-chat-extract.md`, `../../extracts/codex-chat-extract.md`, `../../extracts/cross-model-and-agent-usage-extract.md`, `../../FINDINGS.md`, `../../../../audit/2026-04-11-d4-acceptance-response.md`, `../../../../handoffs/`, `../../../../reviews/review-wave-2-structure-decisions.md` | `65K-85K` | `reports/C-friction-pushback-and-recovery.md` |
| `D` | Delegation, agent usage, and orchestration quality | `../../extracts/cross-model-and-agent-usage-extract.md`, `../../extracts/claude-chat-extract.md`, `../../extracts/codex-chat-extract.md`, `../../../../reports/report-wave-1-orchestrator-execution.md`, `../../../../handoffs/`, `../../../../logs/wave-1A.log`, `../../../../logs/wave-1B.log`, `../../../../logs/wave-1C.log` | `75K-90K` | `reports/D-delegation-agent-usage-and-orchestration.md` |
| `E` | Research quality and research-principles adherence | `../../EPISTEMIC-AND-CONTRACT-REVIEW.md`, `../../../../RESEARCH-PRINCIPLES.md`, `../../../../research/`, `../../../../specs/`, `../../extracts/claude-chat-extract.md`, `../../extracts/codex-chat-extract.md` | `80K-95K` | `reports/E-research-quality-and-principles-adherence.md` |
| `F` | Deliberation quality, boundary-contract adherence, and original-handoff fidelity | `../../EPISTEMIC-AND-CONTRACT-REVIEW.md`, `../../../../BOUNDARY-CONTRACT-MEMO.md`, `../../../../deliberations/`, `../../../../handoffs/handoff-codex-primary-orchestrator.md`, `../../../../handoffs/handoff-claude-fallback-session.md`, `../../../../audit/2026-04-11-d4-acceptance-response.md`, `../../extracts/cross-model-and-agent-usage-extract.md` | `85K-100K` | `reports/F-deliberation-quality-and-contract-adherence.md` |
| `G` | Codex vs Claude quality and division of labor | `../../extracts/claude-chat-extract.md`, `../../extracts/codex-chat-extract.md`, `../../extracts/cross-model-and-agent-usage-extract.md`, `../../INTERACTION-REVIEW.md`, `../../../../handoffs/`, `../../../../reports/report-wave-1-orchestrator-execution.md`, `../../../../README.md` | `70K-85K` | `reports/G-codex-vs-claude-role-comparison.md` |
| `H` | Neglect and counterevidence adversary | `../../extracts/claude-chat-extract.md`, `../../extracts/codex-chat-extract.md`, `../../extracts/cross-model-and-agent-usage-extract.md`, `../../FINDINGS.md`, `../../EPISTEMIC-AND-CONTRACT-REVIEW.md`, `../../TIMELINE.md`, `../../../../reviews/review-wave-2-structure-decisions.md`, `../../../../SUMMARY.md` | `70K-85K` | `reports/H-neglect-and-counterevidence.md` |

## Expected Downstream Use

These reports feed:

- `../../INTERACTION-REVIEW.md`
- `../../CHANGES-BEFORE-NEXT-INITIATIVE.md`
- `../../CARRY-FORWARD-LEDGER.md`
- `../../DEBRIEF-SUMMARY.md`

The reports should also surface deterministic implications for the transcript pipeline so later hardening work has direct evidence to act on.

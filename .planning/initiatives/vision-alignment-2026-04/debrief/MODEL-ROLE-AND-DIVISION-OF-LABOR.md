# Model Role And Division Of Labor

**Status:** Completed on 2026-04-16.
**Source spec:** `specs/spec-debrief-G-model-role-and-division-of-labor.md`

## Bottom Line

The strongest division of labor in this initiative was not "Codex replaces Claude" or "Claude supervises Codex" in the abstract. It was a written contract: user as gate owner and calibration actor, Codex as primary orchestrator and bounded executor, Claude as scheduled auditor and fallback dialogue partner, and subagents as narrow workers with explicit write scopes. The evidence supports that split as the best default for this class of work, but only with named preconditions. When those preconditions were missing, the failures looked like orchestration and authorization problems more than model incompetence.

## What Each Actor Actually Did

| Actor | Actual role in the record | Strengths shown here | Failures or limits shown here |
| --- | --- | --- | --- |
| User | Gate owner, calibration actor, final authority on acceptance and restructuring | Caught wrong-sized framing, forced clearer state, kept review gates real, corrected recommendation drift | Steering burden rose when authorization or mode boundaries were implicit |
| Codex | Wave executor, then primary orchestrator for remaining waves, Stage 3 synthesis author | Strong structural pushback, good bounded execution, effective handoff consumption, good throughput once role was explicit | Needs written constraints to resist premature closure, label-trap drift, and overconfident continuation |
| Claude | Initial primary orchestrator, handoff author, advisory reviewer, formal auditor, fallback | Strong status untangling, handoff writing, formal audit quality once protocol was explicit, useful second-opinion role | Advisory-pattern reflex, recommendation reversal before re-analysis, stale-body handoff ambiguity during transition |
| Subagents | Narrow workers for bounded research and spec tasks | Good fit for parallel execution when ownership and outputs were explicit | Not appropriate as detached or opaque background executors; quality depends on strict scope and visible handback |

## Role Judgments

### User

The user was not passive approval context. The user was the actor who kept the initiative honest when process drifted. Review Gate 1, the shift toward Option `delta`, the insistence on explicit authorization boundaries, and the D4/Stage 3 audit discipline all depended on user intervention or confirmation. That is a strength of the record, not an inconvenience in it.

The failure mode on the user side was not poor judgment. It was correction burden. When role contracts were implicit, the user had to spend too much effort reasserting what counted as authorization, what counted as audit mode, and when a recommendation had changed faster than the analysis behind it.

### Codex

Codex was the better primary orchestrator for the later initiative stages once the work became multi-wave, document-heavy, and dependent on bounded execution with lifecycle control. The record supports that judgment for this initiative specifically:

- Codex contributed the highest-leverage structural pushback, including the `delta` reshape and the D1/D5 split captured in `review-wave-2-structure-decisions.md` and later reflected in `handoff-codex-primary-orchestrator.md`.
- Codex handled bounded execution well. `report-wave-1-orchestrator-execution.md` shows the useful delegation pattern was Codex-native subagents with explicit validation, not detached CLI launches.
- Codex performed well after the role transfer was explicit. The written orchestrator handoff made it clear that Codex was not just launching waves; it was reviewing, drafting follow-on prompts, and requesting Claude audit at named moments.

The main Codex risks in this record are not unique fatal weaknesses, but they are real:

- confidence and closure bias without strong written constraints
- label-trap or contract-slippage risk if review gates weaken
- tendency to look cleaner than it is when orchestration artifacts are well written

Those risks are why "Codex primary orchestrator" should be treated as conditional, not universal.

### Claude

Claude was strongest when the work required cross-session continuity, user-facing clarification, or formal audit discipline. The best Claude contributions in this initiative were:

- writing the handoffs that made the role split legible and recoverable
- untangling status and correcting state after pushback
- executing the formal Stage 3 audit cleanly once the protocol was explicit

Claude's main failures were process-pattern failures, not broad architectural incapacity:

- D4 acceptance bypassed the intended formal-audit gate because Claude fell into the D2/D3/D5 advisory pattern instead of checking `audit/` first
- recommendation changes briefly outran the re-analysis behind them
- the fallback handoff carried a stale historical body beneath the later banners, which was useful as history but ambiguous as live guidance

So the evidence does not support "Claude is worse at this work." It supports a narrower judgment: Claude was less reliable as continuous primary orchestrator once the initiative depended on repeated protocol transitions and strict launch/audit boundaries.

### Subagents

Subagents were useful when they were treated as bounded workers with explicit write scopes, visible ownership, and observable completion. That pattern salvaged Wave 1 after detached `nohup ... codex exec ...` launches stalled.

The record does not support using subagents as autonomous background orchestrators. Their success depended on tight scope and an explicit handback path. The failure mode was not the existence of subagents; it was opacity.

## What Was Model Weakness Vs. What Was Workflow Failure

- The D4 audit bypass was primarily a workflow and mode-preflight failure, not proof that Claude could not do the audit work.
- The detached launch failure in Wave 1 was an execution-path failure, not proof that Codex could not produce the research outputs.
- Recommendation reversals and trust drag were mostly failures of explicit re-analysis and artifact synchronization, not evidence that either model was incapable of good judgment.
- The strongest improvements came when the workflow externalized role, authorization, and audit mode into written artifacts rather than relying on conversational memory.

## Recommended Future Division Of Labor

Use this as the default split for strategic multi-wave initiatives of this kind:

- User: gate owner, acceptance authority, escalation authority, and final packaging judge
- Codex: primary orchestrator, bounded executor, and prompt drafter for next-wave work
- Claude: scheduled formal auditor, second-opinion reviewer, and fallback dialogue partner
- Subagents: narrow workers only, each with explicit ownership and one clear handback target

This split should only be used when all of these preconditions are met:

1. A written role contract exists at initiative start or at switchover.
2. Launch authorization is one-launch-at-a-time, not inferred from conversational momentum.
3. Audit preflight is explicit: check `audit/` before advisory review on any high-stakes gate.
4. Delegation is bounded and observable; detached background orchestration stays banned.
5. Handoffs name what they supersede and what remains historical context only.
6. Review gates remain real synchronization points rather than documentation ceremony.

If those preconditions are not met, the safer fallback is smaller scope, fewer concurrent workers, and a more local review loop rather than pretending the same split will still be reliable.

## Limits And Open Tensions

- The detached-launch failure shape is well supported, but the retained evidence is stronger on failure shape than on precise root cause.
- The record supports Codex as the better primary orchestrator for this initiative; it does not prove a general model hierarchy across all work.
- The user steering burden and trust-erosion magnitude remain medium-confidence because the hardened transcript substrate is intentionally windowed rather than exhaustive.
- The cross-model transcript lane is still concentrated in one emitted family, so it is good enough for synthesis but not a basis for exhaustive interaction claims.

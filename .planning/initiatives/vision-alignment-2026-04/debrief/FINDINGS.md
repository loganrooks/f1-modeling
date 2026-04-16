# Findings

**Status:** Debrief Spec B findings drafted.
**Source spec:** `specs/spec-debrief-B-process-and-auditability-review.md`

## Purpose

Capture the main debrief findings in a single evidence-backed ledger before they are translated into carry-forward actions.

## Scope Guardrail

This file currently records process, auditability, and near-failure findings only. Substantive architecture-value findings are intentionally excluded unless inseparable from a process or auditability failure.

## Findings

### B-PROC-01 — Review-gate scaffolding created real process value by letting the initiative restructure around evidence instead of forcing the original plan

- **Class:** process win
- **Claim:** The initiative's "scaffolding, not execution contract" discipline was not decorative; it materially improved the process by letting Wave 1 findings change the shape of Wave 2 before the team locked into the wrong deliberation structure.
- **Evidence:**
  - `../PLAN.md:11-23` explicitly says the wave structure is provisional and that one valid review-gate outcome is "the planned structure is wrong; here is the right structure."
  - `../PLAN.md:80-96` makes Review Gate 1 responsible for deciding whether to commission Round 1.5, restructure deliberations, add or remove research tasks, or reframe scope.
  - `../reviews/review-wave-2-structure-decisions.md:67-93` records the convergent Wave 1 finding that all five research files favored stable boundaries/contracts over label-level picks.
  - `../reviews/review-wave-2-structure-decisions.md:745-759` recommends the actual restructure path that was then adopted: qualified `δ`, Round 1.5, a boundary/contract memo, and splitting R5's execution-boundary implications from the semantic-model question.
  - `../handoffs/handoff-claude-fallback-session.md:227-255` records that the initiative did in fact adopt the boundary memo, split R5 into D1 plus D5, and treat further structural change as expected rather than exceptional.
- **Consequence:** The process avoided carrying the initial wrong-sized framing forward into Wave 2. That reduced the risk of incompatible local assumptions and turned review gates into real decision points rather than ceremonial pauses.
- **Proposed disposition:** Keep review gates as mandatory restructuring moments, and keep the "Decision Record before next prompt" discipline so the next wave cannot draft against stale or hypothetical conclusions.
- **Status:** confirmed

### B-AUD-01 — Wave 1 execution reporting preserved auditability when the first orchestration method failed

- **Class:** auditability win
- **Claim:** The Wave 1 process handled an execution-path failure well because it recorded the failed launch mode, the fallback path, the produced artifact IDs, and the post-run validation in one report rather than silently swapping methods.
- **Evidence:**
  - `../reports/report-wave-1-orchestrator-execution.md:10-14` records each Wave 1 call, its output log, and the subagent-fallback IDs that actually produced the artifacts.
  - `../reports/report-wave-1-orchestrator-execution.md:36-38` states that detached `nohup ... codex exec ...` launches stalled at prompt ingest, that the process fell back to Codex-native parallel subagents, and that final validation found no missing artifacts or missing sections.
  - `../reports/report-wave-1-orchestrator-execution.md:52-58` explicitly stops at the review gate and tells the user that Wave 2 prompt authorship has not started yet.
- **Consequence:** The record stayed trustworthy even though the initial launch mechanism failed. Anyone auditing the run can tell what happened, why the fallback was used, and why the Wave 1 outputs were still accepted as valid inputs to Review Gate 1.
- **Proposed disposition:** Keep per-wave execution reports that name launch method, fallback path, raw log location, artifact validation result, and whether the next gate remains unopened.
- **Status:** confirmed

### B-NF-01 — Near-failure: D4 acceptance bypassed the intended formal audit gate because the review session pattern-matched into advisory mode

- **Class:** near-failure, auditability failure
- **Claim:** The D4 acceptance process nearly made the record untrustworthy by allowing acceptance to land before the scheduled formal audit, not because the substantive judgment was wrong, but because the gate function failed.
- **Evidence:**
  - `../audit/README.md:34-47` defines "before accepting D4" as a scheduled formal audit moment.
  - `../handoffs/handoff-codex-primary-orchestrator.md:424-445` independently schedules Claude cross-model audit before accepting D4 and before applying synthesis to `ROADMAP.md`.
  - `.planning/knowledge/signals/f1-modeling/2026-04-11-claude-bypassed-formal-audit-protocol.md:52-63` records that Claude reviewed D4 via the D2/D3/D5 advisory pattern, filled the Decision Record, and committed acceptance as `6050c50` without checking `audit/` even though a formal request already existed.
  - `.planning/knowledge/signals/f1-modeling/2026-04-11-claude-bypassed-formal-audit-protocol.md:79-87` identifies the primary cause as not checking `audit/` at session start, plus reliance on in-session pattern memory rather than cross-session written guidance.
  - `../audit/2026-04-11-d4-acceptance-response.md:10-18` confirms the audit then happened out of order and could only act as post-hoc validation or a revert trigger, not as the intended pre-acceptance gate.
- **Consequence:** The process lost its strongest preventative checkpoint at the most synthesis-heavy deliberation. Even though the post-hoc audit validated the substance, the order-of-operations failure weakened the audit trail and made acceptance depend on later repair instead of earlier prevention.
- **Proposed disposition:** Treat "check `audit/` first" as a mandatory session-start step for any review on later-wave initiative artifacts, and require an explicit audit-vs-advisory mode check before Decision Record filling begins.
- **Status:** confirmed near-failure; contained post-hoc

### B-NF-02 — Near-failure containment worked at Stage 3 because the process externalized the D4 lesson into handoff, request, and DRAFT-as-input mechanics

- **Class:** near-failure caught in time, auditability win
- **Claim:** After the D4 slip, the initiative's process recovered well: the Stage 3 formal audit happened in the correct order because the lesson was encoded into the handoff, the audit request was written before application, and the prior informal review was preserved as a draft input rather than mistaken for the formal record.
- **Evidence:**
  - `../handoffs/handoff-claude-stage-3-formal-audit.md:17-25` says the D4 protocol bypass had already happened once, that the same slip almost happened again, and that the first action for the fresh auditor must be checking `audit/`.
  - `../handoffs/handoff-claude-stage-3-formal-audit.md:31-46` gives a strict sequence: read the handoff, read the request, read the DRAFT as input, perform the formal audit independently, and write the formal response before any application edits.
  - `../handoffs/handoff-claude-stage-3-formal-audit.md:182-192` records the near-repeat, notes that Claude checked `audit/` at session start this time, and records Codex writing the formal audit request after the informal review.
  - `../handoffs/handoff-claude-stage-3-formal-audit.md:230-245` explicitly codifies "draft findings transfer as input, not output" and requires independent verification in the formal audit.
  - `../audit/2026-04-11-stage-3-application-response.md:6-11` confirms the Stage 3 audit was pre-application, used the DRAFT as input rather than transcription, and followed the correct order.
- **Consequence:** The second scheduled formal audit regained its intended gate function. The informal review still contributed value, but it did so without overwriting or collapsing the formal audit trail.
- **Proposed disposition:** Preserve the handoff-plus-request-plus-draft pattern for any future high-stakes cross-session audit, and keep "draft is input, not output" as an explicit rule whenever a fresh auditor inherits prior analysis.
- **Status:** confirmed

### B-RISK-01 — By initiative closeout, record layout had enough parallel artifacts that explicit canonical-entrypoint labeling became necessary to avoid stale-state confusion

- **Class:** record-layout risk
- **Claim:** The initiative accumulated enough historical, live, and superseded artifacts that a fresh reader could easily mistake a historical scaffold or a stale handoff for the current record unless the repository explicitly marked current entry points and historical snapshots.
- **Evidence:**
  - `../README.md:14-20` creates a "Start Here" list that points readers to `SPEC-INDEX.md`, `APPLICATION-LEDGER.md`, the final Stage 3 audit, and the debrief workspace rather than to the in-flight plan.
  - `../README.md:33-49` describes a record layout with parallel artifact classes: specs, research, deliberations, synthesis, reviews, audit, debrief, handoffs, reports, logs, and archive.
  - `../README.md:75-77` explicitly says `PLAN.md` and `SUMMARY.md` are historical snapshots and that current project state is governed elsewhere.
  - `../PLAN.md:3` adds a late status note telling readers not to treat the plan as the current record view.
  - `../handoffs/handoff-claude-stage-3-formal-audit.md:11` warns that references to the temporary Stage 3 DRAFT are now process history, not canonical retained output.
  - `../handoffs/handoff-claude-stage-3-formal-audit.md:61-63` records a dedicated commit that archived stale orchestrator handoffs.
- **Consequence:** The record remained auditable, but only because freshness had to be actively curated. Without those banners and archive moves, a later session could have acted on obsolete instructions or mistaken in-flight scaffolding for live state.
- **Proposed disposition:** Make canonical entrypoint sections, "historical snapshot" banners, and explicit superseded/archived labeling mandatory once an initiative has multiple handoffs, audits, and synthesis artifacts in flight.
- **Status:** confirmed risk; mitigated by documentation hygiene

### B-NF-03 — Near-failure: implicit-language authorization proved too weak for multi-wave orchestration and had to be hardened into one-launch-at-a-time rules

- **Class:** near-failure, process failure
- **Claim:** The initiative surfaced that conversational phrases like "proceed" are not reliable authorization boundaries in a multi-wave workflow; without a stronger rule, orchestration can outrun review gates and user decisions.
- **Evidence:**
  - `../handoffs/handoff-codex-primary-orchestrator.md:336-363` makes review gates hard synchronization points and forbids drafting the next wave before the current Decision Record is filled.
  - `../handoffs/handoff-codex-primary-orchestrator.md:380-388` requires explicit authorization prompts rather than inference from conversational momentum.
  - `../handoffs/handoff-codex-primary-orchestrator.md:577-583` records the prior failure mode: "let's proceed with the next steps" was interpreted as authorization for the whole chain, causing Round 1.5 and D1 to launch while skipping the implicit Review Gate 1.5.
  - `../handoffs/handoff-codex-primary-orchestrator.md:127-142` and `../handoffs/handoff-claude-fallback-session.md:176-191` both restate the corrected rule that D2 must not launch without explicit user authorization.
- **Consequence:** Without a per-launch authorization rule, the process compresses review and execution into one conversational act, which defeats the methodology's main protection against premature continuation.
- **Proposed disposition:** Keep one-launch-per-authorization as a hard rule and keep the rule repeated in handoffs, not just in the master plan, because this failure mode came from conversational interpretation rather than missing theory.
- **Status:** confirmed near-failure; user-corrected and codified

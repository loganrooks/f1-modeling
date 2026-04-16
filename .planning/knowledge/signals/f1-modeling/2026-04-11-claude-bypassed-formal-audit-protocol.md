---
id: sig-2026-04-11-claude-bypassed-formal-audit-protocol
type: signal
project: f1-modeling
tags: [gsdr-workflow, meta-work, advisory-pattern, audit-protocol, process-discipline, claude-self-correction, initiative]
created: 2026-04-11T00:00:00Z
updated: 2026-04-11T00:00:00Z
durability: convention
status: active
severity: minor
signal_type: struggle
signal_category: negative
polarity: negative
phase: null
plan: null
source: claude
occurrence_count: 1
related_signals:
  - sig-2026-04-10-workflow-gap-mid-milestone-strategic-refinement
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by claude self-observation at 2026-04-11T00:00:00Z after user pointed at the formal audit request file that claude had missed"
evidence:
  supporting:
    - "The Vision Alignment Initiative's handoff-codex-primary-orchestrator.md schedules D4 acceptance as one of the scheduled high-stakes moments requiring a formal cross-model audit via the audit/ protocol"
    - "Claude's own earlier D4 prompt review (commit 72c0456) explicitly flagged the formal audit protocol as the recommended D4 acceptance path: 'The user should NOT fill the D4 Decision Record on advisory review alone. D4 is a scheduled high-stakes audit moment per handoff-codex-primary-orchestrator.md.'"
    - "Codex wrote a formal audit request at audit/2026-04-11-d4-acceptance-request.md per the protocol at some point before Claude's D4 review session started"
    - "When the user returned to Claude with 'Wave 2D has finished, can you provide a review of the deliberation and how might you fill out the decision record?' Claude performed an advisory review (matching the D2/D3/D5 pattern) rather than checking audit/ for a pending formal audit request"
    - "Claude then filled the D4 Decision Record and committed acceptance as 6050c50 via the advisory-review pattern, explicitly noting in the commit message 'Treats the advisory review as sufficient for D4 acceptance rather than running the separately-available formal audit protocol' — treating the audit protocol as 'separately available' when it was actively requested"
    - "User pointed Claude at the audit request file after acceptance commit 6050c50 had already landed"
    - "Post-hoc audit performed at commit 68c9f37 found no blocking issues and validated the acceptance content, meaning the slip did not cause substantive harm to the initiative"
  counter:
    - "The user did not explicitly flag the formal audit protocol requirement when returning to Claude — Claude could have interpreted the request as 'treat D4 the same way we treated D2/D3/D5'"
    - "Claude's post-hoc audit produced substantively the same conclusions as the advisory review, so the slip had no effect on the final Decision Record content"
    - "The advisory review was itself substantive — Claude read the full deliberation, produced Decision Record drafts, and integrated Codex's independent review. The gap was procedural, not qualitative."
    - "The handoff-codex-primary-orchestrator.md document, which specifies D4 as a formal audit gate, is not in Claude's default session onboarding reading list — Claude would have had to know to check it at session start"
confidence: high
confidence_basis: "Claude self-reported the slip after the user pointed at the audit request file. The procedural sequence is directly traceable via git history and file mtimes. Claude's own earlier D4 prompt review (72c0456) explicitly flagged the formal audit protocol as the correct path, so the slip is unambiguous: Claude's later session contradicted its own earlier written recommendation."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.4+dev"
---

# Claude bypassed the audit/ formal audit protocol for D4 acceptance by reflexive pattern-matching on the advisory review flow

## What Happened

On 2026-04-11, during the Vision Alignment Initiative's Wave 2D (D4 long-horizon roadmap synthesis) review, Claude performed an advisory-mode review and filled the D4 Decision Record via the pattern established for D2/D3/D5, instead of performing the formal cross-model audit that the `handoff-codex-primary-orchestrator.md` schedules specifically for D4 acceptance.

The sequence of events:

1. The Vision Alignment Initiative's `handoff-codex-primary-orchestrator.md` schedules D4 acceptance as one of the scheduled high-stakes moments requiring a formal cross-model audit via the `audit/` protocol (before accepting D4, before applying synthesis to `ROADMAP.md`, when a deliberation produces surprising results, etc.).
2. Claude's own D4 prompt review (committed as `72c0456 docs(initiative): Claude advisory review of D4 prompt draft`) explicitly flagged this at the end of the review: *"D4 is the one scheduled formal audit trigger per handoff-codex-primary-orchestrator.md [...] The user should NOT fill the D4 Decision Record on advisory review alone. This is the one place where the formal audit protocol is not optional."*
3. When D4 completed, Codex wrote a formal audit request at `.planning/initiatives/vision-alignment-2026-04/audit/2026-04-11-d4-acceptance-request.md` per the protocol documented in `audit/README.md`. This happened before the user's next Claude session.
4. The user returned to Claude with *"Wave 2D has finished, can you provide a review of the deliberation and how might you fill out the decision record?"* — the same phrasing used for D2/D3/D5 reviews.
5. Claude performed an advisory review (matching the D2/D3/D5 pattern), produced Decision Record drafts, compared them against Codex's independent Decision Record recommendations, and filled the D4 Decision Record. Claude did not check `audit/` at any point during this session.
6. Claude committed D4 acceptance as `6050c50 docs(initiative): accept D4 decisions for long-horizon roadmap synthesis` with commit message language that explicitly treated the formal audit protocol as *"separately available"* — when it was in fact actively requested and waiting at `audit/2026-04-11-d4-acceptance-request.md`.
7. The user pointed Claude at the audit request file, at which point Claude performed the formal audit post-hoc and wrote findings to `2026-04-11-d4-acceptance-response.md`, committed as `68c9f37 docs(initiative): Claude formal audit response for D4 acceptance (post-hoc)`.
8. The post-hoc audit validated the advisory-review content and identified three minor non-blocking findings, which were applied as in-place corrections via commit `b913e53 docs(initiative): correct D4 Decision Record per post-hoc audit findings`.

## Why This Matters

The slip did not cause substantive harm to the initiative — the post-hoc audit validated the acceptance content. But the procedural slip matters because:

1. **The formal audit protocol exists for exactly this kind of high-stakes acceptance.** Wave 2D acceptance shapes how the roadmap is reworked before Phase 4 planning resumes. Catching problems before acceptance is cheaper than catching them after. In this case the advisory review happened to converge on the correct content, but there was no guarantee of that convergence.

2. **Claude's advisory-review pattern is reflexive after multiple iterations.** Having done D2/D3/D5 prompt reviews + deliberation reviews via the advisory pattern four times each, Claude defaulted to the same pattern for D4 without checking whether D4 required different handling. This is pattern-matching-as-shortcut, which is a general failure mode for iterative workflows where some iterations require different protocols.

3. **Claude contradicted its own earlier recommendation.** Claude's D4 prompt review (`72c0456`) explicitly said advisory review was insufficient for D4 acceptance. Claude then bypassed that recommendation in the next session. If Claude cannot follow its own written recommendations from prior sessions, the advisory-pattern documentation is less load-bearing than it appears.

4. **The user was not on the hook for noticing the miss.** The user returned with the same phrasing they had used for D2/D3/D5. There is no reason the user should have known that D4 required different handling — that's what the `handoff-codex-primary-orchestrator.md` and Claude's own prior review said. Claude should have checked.

## Root Cause Analysis

**Primary cause: Claude did not check `audit/` at the start of the D4 review session.**

Contributing factors:

1. The D2/D3/D5 advisory-review pattern had been repeated four times each, creating reflexive expectations.
2. The user's phrasing ("Wave 2D has finished, can you provide a review...") was identical to prior rounds and did not signal a protocol change.
3. Claude's earlier D4 prompt review (`72c0456`) was written in a prior session and was not automatically re-read when the D4 deliberation review session started. Claude relied on in-session context, not cross-session written recommendations.
4. The `handoff-codex-primary-orchestrator.md` document that schedules D4 as a formal audit gate is not in Claude's default session onboarding reading list. Claude would have needed to know to check it.
5. Claude wrote the acceptance commit message with language explicitly treating the formal audit protocol as *"separately available"* — which is wrong if Codex has actively written an audit request. Claude did not sanity-check the language against the actual state of `audit/`.

## Potential Remediation

**For future Claude advisory sessions on this initiative:**

1. **Check `audit/` at session start** whenever a review of any initiative artifact is requested. If a pending audit request exists, perform the formal audit via the protocol, not the advisory review.
2. **Re-read the `handoff-codex-primary-orchestrator.md` § "When to Request Claude Cross-Model Audit"** at the start of any D4 or later-wave session. That section names D4 acceptance, roadmap application, and ad-hoc high-stakes moments as formal audit triggers.
3. **If advisory review is the requested path and a formal audit should happen, surface the tension explicitly to the user** before proceeding. *"You're asking for an advisory review, but D4 acceptance is a scheduled formal audit moment per the handoff. Do you want me to do the formal audit via audit/ instead, or proceed with advisory review and note that the formal audit is still needed?"*
4. **Check in-session git log for prior Claude advisory reviews of the same subject** before starting a new review. If a prior advisory review flagged a different protocol for the subject, honor it.

**For the GSDR protocol itself (potential convention update):**

1. The `handoff-claude-fallback-session.md` advisory use pattern section could be updated to explicitly name the "check `audit/` first" discipline.
2. The `handoff-codex-primary-orchestrator.md` formal audit schedule could be cross-referenced from the `audit/README.md` directly, so a Claude session checking the audit-requests directory sees the schedule as context.
3. A session-start checklist for Claude advisory sessions on initiatives could be added to `handoff-claude-fallback-session.md` — something like: *"Before any review, check (a) `audit/` for pending audit requests, (b) `handoff-codex-primary-orchestrator.md` § formal audit schedule, (c) git log for prior Claude advisory reviews of the subject that may have flagged a different protocol."*

## Context

- **Initiative:** vision-alignment-2026-04
- **Wave:** 2D (D4 long-horizon roadmap synthesis)
- **Formal audit request:** `audit/2026-04-11-d4-acceptance-request.md` (Codex)
- **Formal audit response:** `audit/2026-04-11-d4-acceptance-response.md` (Claude, post-hoc)
- **Commits:**
  - `72c0456` — Claude D4 prompt review (flagged formal audit protocol as required)
  - `6050c50` — Claude D4 acceptance via advisory review pattern (the slip)
  - `68c9f37` — Claude post-hoc formal audit response (validated acceptance, three minor findings)
  - `b913e53` — In-place corrections per audit findings
- **No substantive harm:** the post-hoc audit found no blocking issues. The slip was procedural, not qualitative.
- **Related signal:** `sig-2026-04-10-workflow-gap-mid-milestone-strategic-refinement` — this is the same initiative that created the `audit/` protocol, so the advisory-pattern-vs-formal-audit distinction is new to the project. This signal is the first-recurrence check on whether the distinction holds in practice.

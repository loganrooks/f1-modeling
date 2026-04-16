# Formal Audit Protocol

This directory is where the **Codex primary orchestrator** writes formal audit requests when it needs a Claude cross-model audit on something. The audit results are written back to this directory.

## Why This Directory Exists

As of 2026-04-11, Codex is the primary orchestrator of the Vision Alignment Initiative (see `../handoff-codex-primary-orchestrator.md`). Claude is a fallback used for cross-model audits at specific high-stakes moments and for user dialogue when requested (see `../handoff-claude-fallback-session.md`).

Codex cannot directly invoke Claude. The user is the bridge between Codex and Claude sessions. This directory formalizes that bridge:

1. Codex writes an audit request document here describing what Claude should audit
2. Codex presents the request to the user and pauses
3. User reads the request, starts a Claude session, points Claude at the request document
4. Claude reads the request, performs the audit, writes findings to this directory
5. User reports Claude's findings back to Codex
6. Codex incorporates findings into its orchestration work

## Naming Convention

Audit requests:
```
YYYY-MM-DD-<topic-slug>-request.md
```

Audit responses (written by Claude):
```
YYYY-MM-DD-<topic-slug>-response.md
```

Example:
- `2026-04-15-d4-long-horizon-review-request.md`
- `2026-04-15-d4-long-horizon-review-response.md`

## When Codex Should Write an Audit Request

From `handoff-codex-primary-orchestrator.md` § "When to Request Claude Cross-Model Audit":

### Scheduled high-stakes moments
- **Before accepting D4 (long-horizon roadmap)** — synthesis deliberation shaping v2/v3/v4+ milestones
- **Before applying synthesis to ROADMAP.md** — irreversible file changes
- **When a deliberation produces surprising results** — unexpected reframings or unusual closure shapes

### Ad-hoc moments
- Codex is uncertain about a review outcome and wants verification
- Codex suspects sycophancy in its own response to a user suggestion
- User explicitly requests a second opinion
- Codex is about to make a decision affecting multiple waves

## Audit Request Document Template

```markdown
# Audit Request — [Topic]

**Requested by:** Codex primary orchestrator
**Request date:** YYYY-MM-DD
**Requested model:** Claude Opus 4.6
**Reason for audit:** [scheduled / ad-hoc / user-requested]

## What to Audit

[Specific files, specific sections, specific questions]

Files to read:
- `path/to/file/1.md` (sections X, Y)
- `path/to/file/2.md` (full)

Specific questions:
1. [Question 1]
2. [Question 2]

## What NOT to Do

- Do NOT modify any files
- Do NOT take over orchestration
- Do NOT proceed past audit scope
- [Any other role-specific boundaries]

## Required Output Format

Write findings to `YYYY-MM-DD-<topic-slug>-response.md` in this directory.

Include:
1. **Executive summary** (3-5 sentences)
2. **Findings** — specific observations with evidence
3. **Concerns** — things Codex should reconsider
4. **Confirmations** — things Codex got right
5. **Recommendation** — specific actions for the Codex orchestrator to take

## Context for the Auditor

[Why this audit matters. What hangs on it. What Codex has already decided
or is about to decide. Any nuances that aren't in the files being audited.]

## Codex's Current Position

[What Codex currently thinks about the topic. The auditor can push back on
this honestly; the audit's value is independent perspective, not validation.]
```

## Audit Response Document Template

```markdown
# Audit Response — [Topic]

**Auditor:** Claude Opus 4.6
**Response date:** YYYY-MM-DD
**Request:** [link to request document]

## Executive Summary

[3-5 sentences — overall verdict, biggest finding]

## Findings

[Substantive observations grounded in the files audited, cited by
file:line where possible]

## Concerns

[Things Codex should reconsider, with specific reasoning]

## Confirmations

[Things Codex got right, so Codex knows what to preserve]

## Recommendation

[Specific actionable recommendations for the Codex orchestrator]

## Confidence

[Calibrated confidence markers on the findings — known / likely /
plausible / speculative / unknown]
```

## How the User Facilitates This

When Codex writes an audit request and presents it to the user:

1. User reads the request to confirm it's sensible
2. User starts a Claude session (fresh or continuing, depending on context budget)
3. User says: "Read `.planning/initiatives/vision-alignment-2026-04/audit/YYYY-MM-DD-<topic>-request.md` and perform the audit per its instructions. You are in fallback auditor role, not primary orchestrator."
4. Claude reads `handoff-claude-fallback-session.md` § "Fresh Session Onboarding Protocol (Fallback Claude Role)" → "For Claude invoked as cross-model auditor"
5. Claude performs the audit and writes the response document
6. User confirms the response document exists
7. User relays findings back to Codex (either by pasting key excerpts or by telling Codex to read the response document directly)
8. Codex incorporates findings into its orchestration work

## Why Claude Doesn't Just Continue Working

Claude-as-cross-model-auditor is a **narrow role**. Claude reads, audits, writes findings, stops. Claude does NOT:
- Take over orchestration
- Modify project files (except the audit response itself)
- Launch new deliberations
- Draft new prompts
- Assume its audit findings override Codex's judgment

The audit is input to Codex's judgment, not a replacement for it. Codex decides what to do with the findings.

This boundary exists because the user explicitly chose Codex as primary orchestrator. Claude's role is strictly fallback. If the user later wants Claude to resume primary orchestration, that's a separate explicit decision — not a side effect of an audit request.

---

*Pattern established: 2026-04-11. Applies to all remaining waves of the Vision Alignment Initiative.*

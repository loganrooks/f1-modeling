# Audit Request -- [Topic]

**Requested by:** [name / role]
**Request date:** YYYY-MM-DD
**Requested auditor:** [model / person / role]
**Audit type:** [planning-system / roadmap / architecture-setting / protected-seam / rewrite-trigger / other]
**Reason for audit:** [scheduled / pre-application / pre-acceptance / ad hoc / user-requested]
**Expected response file:** `YYYY-MM-DD-<topic>-audit-response.md`

## Subject And Decision Boundary

- Change under audit:
- Decision this audit is informing:
- Files expected to change or be accepted:
- Why this is a formal gate instead of an advisory review:

## Required Preflight Inputs

Fill every field below. Use `not applicable` with a reason rather than leaving a section blank.

### Doctrine Refs

- `.planning/LONG-ARC.md`
- Other doctrine or governance refs:
- Specific posture, seam, or non-decision being certified:

### Tech-Debt Refs

- Relevant ids from `.planning/TECH-DEBT.md`:
- Why each id matters to this audit:
- If none, explain why no active debt entry is implicated:

### State And Routing Posture

- `.planning/STATE.md` items consumed:
- Current phase or initiative posture:
- Reduced-guarantee status, if any:
- Carry-forward or routing notes that matter:

### Phase Or Initiative Steering Inputs

- `CONTEXT.md`:
- `PLAN.md`:
- Other local steering artifacts:

### Relevant Decision Anchors

- Anchor files read:
- Why each anchor constrains the subject:
- If none, explain why no accepted anchor applies:

## Files And Evidence To Audit

- `[path/to/file]` -- [why it matters]
- `[path/to/file]` -- [why it matters]

## Questions For The Auditor

1. [question]
2. [question]

## What Not To Do

- Do not modify repo files.
- Do not widen the audit into adjacent subsystem lanes.
- Do not replace accepted repo doctrine with a fresh policy rewrite.
- Do not treat advisory reviews as sufficient evidence for this gate.

## Current Position

- What the requester currently believes:
- Known risks or uncertainties:
- What changes if the audit recommends revise or hold:

## Required Response Shape

Use `.planning/audits/templates/audit-response-template.md`.

The response must list consumed inputs, then provide:

- executive summary
- findings
- concerns
- confirmations
- recommendation
- confidence
- unresolved edges

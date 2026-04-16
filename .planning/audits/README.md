# Formal Audit Workspace

This directory is the repo-level home for formal audits and review gates that can certify whether a planning or governance change is ready to proceed.

## What Counts As A Formal Audit

Use `audits/` when the request is acting as a gate for:

- planning-system initiatives
- roadmap rewrites
- architecture-setting phase plans
- application packages that touch protected seams
- application packages that cross rewrite-trigger corridors
- any other change where the outcome can block or permit live planning or governance edits

If the work is only advisory, exploratory, or scope-shaping, use `.planning/reviews/` instead.

## What Does Not Belong Here

Do not use `audits/` for:

- early feedback on a draft
- low-stakes critique or second-opinion prompts
- wave review notes that are not certifying a gate
- initiative commentary that does not authorize live repo changes

Those belong in `.planning/reviews/`.

## Formal Audit Preflight

Before launching a formal audit request, read and cite the current versions of:

- `.planning/LONG-ARC.md`
- `.planning/TECH-DEBT.md`
- `.planning/STATE.md`
- the current `CONTEXT.md`, if a phase or initiative steering context exists
- the current `PLAN.md`, if a plan exists
- the relevant decision anchors when the subject depends on them

The request must explicitly record:

- doctrine refs being certified against
- active tech-debt ids that matter to the subject, or `not applicable` with a reason
- current state and routing posture, including any reduced-guarantee status
- relevant decision anchors, or `none` with a reason
- the exact files and decisions under review

## Templates

Start every new formal gate from:

- `.planning/audits/templates/audit-request-template.md`
- `.planning/audits/templates/audit-response-template.md`

Do not delete the preflight sections. If an item does not apply, mark it `not applicable` and explain why.

## Expected Response

A formal audit response must:

- link back to the request
- list the doctrine, debt, state, planning, and anchor inputs actually consumed
- provide an executive summary
- record concrete findings with evidence
- separate concerns from confirmations
- end with a recommendation suitable for a proceed, revise, or hold decision
- state confidence and any unresolved edge that still matters

## Naming

Use paired filenames:

- `YYYY-MM-DD-<topic>-audit-request.md`
- `YYYY-MM-DD-<topic>-audit-response.md`

## Relationship To Reviews

`audits/` certifies gates.
`reviews/` advises work.

A review can recommend escalation to a formal audit, but it does not become a formal gate unless it is rerun through the preflight defined here.

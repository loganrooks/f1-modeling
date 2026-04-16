# Advisory Review Workspace

This directory is the repo-level home for advisory reviews. Use it for critique, comparison, scope-shaping, and review-gate notes that inform work without certifying a formal application or acceptance boundary.

## What Belongs Here

Use `reviews/` for:

- advisory reviews of synthesis or application drafts
- review-gate decisions that narrow or redirect scope before a formal audit
- cross-model challenge prompts that are exploratory rather than certifying
- restructuring notes when an initiative or wave changes shape

## What Does Not Belong Here

Move the work to `.planning/audits/` when the request is being asked to:

- approve or block live planning or governance edits
- certify a roadmap rewrite or architecture-setting plan
- certify a change that touches protected seams
- certify a change that crosses a rewrite-trigger corridor
- stand in for the formal audit preflight required by `WORKFLOW.md`

## Review Expectations

Advisory reviews should:

- name the subject and files under review
- say whether the artifact is advisory or a decision-shaping review gate
- provide concrete findings or recommendations
- call out when the work should escalate to a formal audit

Advisory reviews may cite doctrine, debt, state, or anchors when helpful, but they do not certify against the full formal-audit input bundle. If a review needs that bundle to be credible, reroute it to `.planning/audits/`.

## Relationship To `audits/`

`reviews/` is for advice, narrowing, and challenge.
`audits/` is for certification and formal gate preflight.

Do not label an artifact as a formal audit unless it used the shared audit preflight and response structure or an equivalent structure that preserves the same required fields.

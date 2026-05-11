# Initiative Audit Workspace

This directory holds **formal-audit** requests and responses for the **initiative as a whole** — not for individual pilot tasks. Per-task audits (the autonomous loop's per-commit cross-model audits) live at `.planning/auto-execution/audits/AUDIT-task-*.md`.

## What goes here

- A panel-review request when the initiative's PLAN.md is ready for formal review (e.g., `2026-XX-XX-pilot-plan-audit-request.md` paired with `…-response.md`).
- An end-of-pilot acceptance audit when the first `/goal` pilot completes and the initiative is ready to be marked accepted.
- Any cross-cutting formal audit during the initiative's life (per `.planning/audits/README.md` — "What Counts As A Formal Audit": planning-system initiatives qualify).

## Naming convention

Per `.planning/audits/README.md`:

```
YYYY-MM-DD-<topic>-audit-request.md
YYYY-MM-DD-<topic>-audit-response.md
```

## Preflight

Per `.planning/audits/README.md` "Formal Audit Preflight" section, every formal audit request here must explicitly cite:

- `.planning/LONG-ARC.md`
- `.planning/TECH-DEBT.md`
- `.planning/STATE.md`
- this initiative's `PLAN.md` (the steering context)
- relevant decision anchors when the subject depends on them (D1-D5 anchors are tripwires per `PLAN.md` §4 R1)

## Templates

Start from:

- `.planning/audits/templates/audit-request-template.md`
- `.planning/audits/templates/audit-response-template.md`

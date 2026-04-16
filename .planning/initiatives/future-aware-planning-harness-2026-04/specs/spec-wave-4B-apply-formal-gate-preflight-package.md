# Wave 4B: Apply Formal Gate Preflight Package

**Wave:** 4B
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** repo-level governance application

---

## MANDATORY: Read initiative files first

Before doing anything else, read:

1. `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
2. `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
3. `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
4. `.planning/initiatives/future-aware-planning-harness-2026-04/SPEC-INDEX.md`
5. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/06-gsdr-subsystem-adaptation-policy.md`
6. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-4-gsdr-subsystem-adaptation-decisions.md`

Then read the live doctrine/governance shell that the formal gate package must consume:

7. `.planning/LONG-ARC.md`
8. `.planning/AGENTS.md`
9. `WORKFLOW.md`
10. `.planning/ARTIFACT-GOVERNANCE.md`
11. `.planning/STATE.md`
12. `.planning/TECH-DEBT.md`

Then inspect the current repo-tracked formal gate surfaces:

13. `.planning/initiatives/future-aware-planning-harness-2026-04/audit/README.md`
14. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/README.md`
15. `.planning/initiatives/vision-alignment-2026-04/audit/README.md`

---

## Application question

What repo-tracked formal gate package should be applied now so future formal audits and review gates in this repo must explicitly consume doctrine, debt, state, and relevant decision anchors, while advisory reviews remain clearly non-formal and the wave stays out of global skill patching?

This is an application wave, not another synthesis wave.

---

## Binding constraints

This wave must:

- stay repo-tracked and workspace-facing
- create a clear repo-level distinction between formal audits and advisory reviews
- create repo-level request/response templates for formal audits that explicitly require:
  - doctrine refs
  - active tech-debt ids when relevant
  - state/routing posture when relevant
  - relevant decision anchors when the subject depends on them
- update current initiative-local `audit/` and `reviews/` readmes so they point to the repo-level package rather than remaining self-contained one-offs

This wave must **not**:

- patch the home-level `gsdr-audit` skill
- redesign audit response semantics beyond the preflight package and template structure
- patch deliberation or decision-anchor schema
- patch signals or reflection
- patch routing/state or tech-debt surfaces
- patch `verify-phase.md` or `validate-phase.md`
- create generic initiative ledger scaffolding

---

## Required outputs

Create or update these repo-tracked files:

- `.planning/audits/README.md`
- `.planning/audits/templates/audit-request-template.md`
- `.planning/audits/templates/audit-response-template.md`
- `.planning/reviews/README.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/audit/README.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/README.md`
- `.planning/initiatives/vision-alignment-2026-04/audit/README.md`

Then write an application summary to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/07-formal-gate-preflight-application.md`

---

## Required application tasks

### Task 4B.1 — Create repo-level formal gate surfaces

Create a repo-level formal audit workspace README and explicit request/response templates.

They should make clear:

- what counts as a formal audit
- what counts as an advisory review
- what inputs must be read before a formal gate is launched
- what outputs a formal gate response must produce

### Task 4B.2 — Create repo-level advisory review workspace guidance

Create a repo-level `.planning/reviews/README.md` that keeps advisory reviews useful without turning them into formal audits.

The distinction between:

- `audit/`
- `reviews/`

must be explicit and durable.

### Task 4B.3 — Re-point initiative-local gate workspaces

Update the current initiative-local `audit/README.md` and `reviews/README.md` files so they point to the repo-level package while preserving any initiative-specific role notes that still matter.

Do the same for the Vision Alignment initiative audit README so an already-used high-stakes initiative points at the new shared formal-gate package.

### Task 4B.4 — Record application summary

Write `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/07-formal-gate-preflight-application.md`.

It must include:

1. Metadata
2. Files created or updated
3. What the repo-level formal gate package now does
4. What remains intentionally out of scope after `4B`
5. Risks or unresolved edges after application

---

## Review focus for the orchestrator

When this wave comes back, review for:

- whether the package stays repo-tracked rather than reaching into global skill patching
- whether formal audits and advisory reviews are separated clearly
- whether the audit request template really forces doctrine/debt/state/anchor preflight
- whether the wave stayed out of signals, deliberations, routing, and verifier surfaces

---

## Completion signal

At the end, print:

```text
Wave 4B complete.
- .planning/audits/README.md
- .planning/audits/templates/audit-request-template.md
- .planning/audits/templates/audit-response-template.md
- .planning/reviews/README.md
- .planning/initiatives/future-aware-planning-harness-2026-04/audit/README.md
- .planning/initiatives/future-aware-planning-harness-2026-04/reviews/README.md
- .planning/initiatives/vision-alignment-2026-04/audit/README.md
- synthesis/07-formal-gate-preflight-application.md (XXX lines)
```

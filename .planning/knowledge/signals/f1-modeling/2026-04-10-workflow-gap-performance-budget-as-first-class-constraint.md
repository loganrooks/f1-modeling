---
id: sig-2026-04-10-workflow-gap-performance-budget-as-first-class-constraint
type: signal
project: f1-modeling
tags: [gsdr-workflow, performance-budget, constraint, verification, metrics]
created: 2026-04-10T00:00:00Z
updated: 2026-04-10T00:00:00Z
durability: convention
status: active
severity: minor
signal_type: workflow-gap
signal_category: negative
polarity: negative
phase: null
plan: null
source: audit
occurrence_count: 1
related_signals: [sig-2026-04-10-workflow-gap-vision-alignment-guardrails]
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by Codex GPT-5.4 xhigh audit at 2026-04-10T00:00:00Z"
evidence:
  supporting:
    - "Codex xhigh vision audit (2026-04-08): 'The vision makes a production-density claim. The research chooses a rendering toolkit but never defines measurable budgets... That omission will make library debates philosophical instead of empirical.'"
    - "VISION.md claims production density (6+ strategies, 4+ linked panels, real-time updates) with no measurable targets"
    - "Phase 4 research picks visx without benchmark methodology"
    - "GSDR requirements support TRUE/FALSE success criteria but not quantitative budgets"
  counter:
    - "Quality gates in CLAUDE.md include typecheck and test runs, which are binary pass/fail"
    - "Projects can add custom benchmark tests, they just don't have workflow support"
confidence: high
confidence_basis: "Audit finding is specific and actionable. The gap is structural in GSDR's requirement model."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.3+dev"
---

# GSDR has no first-class concept of performance budget as a verifiable constraint

## What Happened

The Codex xhigh vision audit for F1 Modeling Lab (2026-04-08) identified that the project makes production-density claims (6+ strategies on screen, 4+ linked panels, real-time updating) without defining measurable performance targets. The observation: "That omission will make library debates philosophical instead of empirical." Either a rendering strategy meets the budget or it doesn't. Without a budget, discussions stay theoretical.

GSDR supports TRUE/FALSE success criteria (phase verification checks that things exist and work) but has no structural concept of measurable performance budgets that phases must hit.

## Why This Matters

Visualization performance, compute latency, simulation throughput, memory usage, and update cadence are all measurable. Projects claiming real-time capability or production scale need these to be first-class verifiable constraints, not afterthoughts.

Without structural support:

- Performance targets live in READMEs or prose and get forgotten
- Phase verification doesn't check performance
- Regressions go unnoticed until they become crises
- Library and architecture debates stay philosophical
- Benchmarks get written ad-hoc per phase instead of accumulating

## Potential Remediation

New GSDR concept: **Performance Budget** as a project-level constraint set.

`.planning/performance-budget.md`:

```yaml
budgets:
  - id: pb-hover-latency
    description: "Hover-to-tooltip latency"
    target: "<50ms p95"
    current: "unmeasured"
    test_command: "npm run bench:hover"
    applies_to: ["visualization"]
    phases_affected: ["04", "05", "06"]

  - id: pb-multi-strategy-render
    description: "Render 6 strategies on 4 linked panels"
    target: "<100ms initial, <16ms subsequent"
    current: "unmeasured"
    test_command: "npm run bench:multi-strategy"
    applies_to: ["visualization"]
    phases_affected: ["04"]

  - id: pb-simulation-throughput
    description: "Single race simulation wall-time"
    target: "<2s on reference hardware"
    current: "unmeasured"
    test_command: "npm run bench:race"
    applies_to: ["compute"]
    phases_affected: ["03", "04", "05"]
```

Workflow integration:

- `/gsdr:discuss-phase` surfaces budgets whose phases_affected includes the current phase
- `/gsdr:plan-phase` requires plans touching relevant surfaces to declare compliance strategy
- `/gsdr:execute-phase` runs budget test commands as part of the quality gate
- `/gsdr:verify-work` includes budget compliance in verification

New workflows:

- `/gsdr:budget-add` — register a new budget with a test command
- `/gsdr:budget-check` — run all applicable budgets for a phase
- `/gsdr:budget-report` — show current budget compliance across the project

Unlike tech debt (backward-looking — things we know are wrong), performance budgets are forward-looking — things we commit to. Both need first-class support for projects with serious platform ambitions.

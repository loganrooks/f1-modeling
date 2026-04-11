---
id: sig-2026-04-10-workflow-gap-mid-milestone-strategic-refinement
type: signal
project: f1-modeling
tags: [gsdr-workflow, meta-work, initiative, audit-to-action, deliberation, phase-model]
created: 2026-04-10T00:00:00Z
updated: 2026-04-10T00:00:00Z
durability: convention
status: active
severity: major
signal_type: workflow-gap
signal_category: negative
polarity: negative
phase: null
plan: null
source: user
occurrence_count: 1
related_signals: []
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by user observation at 2026-04-10T00:00:00Z during vision alignment initiative setup"
evidence:
  supporting:
    - "Three parallel audits surfaced 15 findings requiring coordinated research, deliberation, and roadmap evolution before Phase 4 planning can safely proceed"
    - "Work needed: 5 research tasks, 4 deliberations, roadmap projection, tech debt registry, guardrail design"
    - "None of this fits the GSDR phase model (discuss -> plan -> execute -> verify)"
    - "GSDR has individual workflows (research-phase, deliberate, new-milestone) but no orchestrator for cross-cutting mid-milestone strategic refinement"
    - "Created ad-hoc initiative at .planning/initiatives/vision-alignment-2026-04/ to hold the work"
  counter:
    - "User could run individual /gsdr:deliberate and /gsdr:research-phase invocations instead of creating an initiative"
    - "/gsdr:new-milestone exists but implies ending current milestone, which isn't the intent"
confidence: high
confidence_basis: "User explicitly identified the gap. The work clearly does not fit any existing GSDR workflow."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.3+dev"
---

# GSDR has no workflow for mid-milestone strategic refinement spanning research + deliberation + roadmap evolution

## What Happened

During vision alignment work for F1 Modeling Lab on 2026-04-10, the project needed to: (1) run parallel research on 5 domains informing architectural decisions, (2) conduct 4 structured deliberations consuming that research, (3) synthesize results into concrete ROADMAP.md changes, guardrails, and tech debt registry, and (4) project the roadmap beyond the current milestone. None of this produces code. None of it fits the GSDR phase model of discuss -> plan -> execute -> verify where the output is a verifiable code deliverable.

Existing GSDR workflows touch parts of this but none orchestrate the whole:

- `/gsdr:research-phase` researches ONE upcoming phase, not a cross-cutting architectural question
- `/gsdr:deliberate` handles ONE deliberation at a time with no batch/sequencing support
- `/gsdr:new-milestone` implies current milestone is ending
- `/gsdr:plan-milestone-gaps` closes gaps identified by audit but assumes the work is code-shaped
- `/gsdr:insert-phase` inserts a single phase but doesn't handle the thinking that precedes the insertion decision

The workaround was to create `.planning/initiatives/vision-alignment-2026-04/` as an ad-hoc meta-work container with three stages (research -> deliberations -> synthesis), each invocable via Codex, with human review gates between stages.

## Why This Matters

Mid-milestone strategic refinement is a real workflow need. It happens when:

- Vision expands or clarifies after work has started
- An audit surfaces coordinated gaps spanning multiple concerns
- Upstream dependencies need architectural decisions that weren't visible at milestone planning time
- The team needs to project forward past the current milestone before continuing

Without native support, projects either (a) lose track of the work as informal planning, (b) jam it awkwardly into a phase that doesn't fit, or (c) create ad-hoc containers like this initiative that have no GSDR lifecycle support.

## Potential Remediation

A new GSDR workflow: `/gsdr:initiative` or `/gsdr:strategic-refinement`. Characteristics:

- Creates a stage-gated structure (research -> deliberation -> synthesis) or allows custom stages
- Integrates with existing workflows (spawns `gsdr-phase-researcher` for research tasks, creates deliberation documents with proper frontmatter)
- Tracks progress across stages
- Produces outputs that flow into existing workflows (roadmap-evolution.md maps to `/gsdr:insert-phase` invocations, guardrails-proposal.md maps to CLAUDE.md edits, tech-debt-registry.md becomes a first-class artifact)
- Has a completion summary protocol
- Can pause/resume across sessions

The `.planning/initiatives/` directory convention could become part of GSDR's standard planning layout alongside `phases/`, `deliberations/`, and `audits/`.

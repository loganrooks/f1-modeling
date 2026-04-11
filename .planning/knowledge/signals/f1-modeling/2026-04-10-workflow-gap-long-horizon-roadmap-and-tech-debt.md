---
id: sig-2026-04-10-workflow-gap-long-horizon-roadmap-and-tech-debt
type: signal
project: f1-modeling
tags: [gsdr-workflow, roadmap, long-horizon, tech-debt, multi-milestone, projection]
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
related_signals: [sig-2026-04-10-workflow-gap-vision-alignment-guardrails]
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by user observation at 2026-04-10T00:00:00Z"
evidence:
  supporting:
    - "User requested 'ROADMAP.md and each phase needs to be more future oriented, not just to the end of this milestone, but several milestones, to however far we can project ourselves where the application platform comes into its own'"
    - "ROADMAP.md is milestone-scoped; no structured way to represent v2, v3, v4+ milestones"
    - "PROJECT.md carries vision but not projected milestone structure"
    - "Tech debt emerges phase-by-phase but has no durable registry, gets buried in audit responses"
    - "Previous audits identified gaps but their tracking lives in audit files, not a living registry"
  counter:
    - "/gsdr:new-milestone exists for when current milestone completes"
    - "Backlog concept exists for 999.x items but doesn't project forward"
confidence: high
confidence_basis: "User explicitly requested long-horizon projection. GSDR has no structure for it."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.3+dev"
---

# GSDR has no structure for long-horizon roadmap projection or tech debt registry lifecycle

## What Happened

During the vision alignment initiative on 2026-04-10, the user articulated a need to project ROADMAP.md beyond the current v1 milestone to "several milestones, to however far we can project ourselves where the application platform comes into its own." The current ROADMAP.md structure is strictly v1-scoped with phases 1-8. There is no place to represent v2/v3/v4+ milestone themes, the long-horizon success criteria, or the evolution of the platform across multiple milestones.

Simultaneously, the audit response surfaced a tech debt registry with 8 initial entries, each with severity, rewrite triggers, and rewrite readiness. GSDR has no durable home for this registry. If left in the audit response, the tech debt tracking dies with the audit. It needs to be a living document that phases check against, update, and eventually burn down.

## Why This Matters

### Long-horizon roadmap

Projects with ambitious long-term visions need to:

- Show where the platform is going 2-3 milestones out
- Make architectural decisions today that serve v3+ requirements
- Distinguish "v1 scope" from "platform scope"
- Surface the moment when the platform "comes into its own" vs. when it's still reaching for it
- Allow stakeholders to see the trajectory, not just the next step

Without this, projects risk optimizing each milestone locally and never reaching the platform vision. The Phase 4 research audit finding is a direct consequence: research scoped to Phase 4 missed Phase 5-8 and beyond.

### Tech debt registry

Tech debt identified by audits gets buried in audit response documents. Without a living registry:

- Phases don't systematically check in against known debt
- Rewrite triggers don't fire automatically
- Severity shifts over time are invisible
- Burn-down progress is untrackable
- New debt accumulates without being registered

The audit response included a seed registry; without GSDR support, it will rot.

## Potential Remediation

### Long-horizon roadmap structure

`.planning/ROADMAP.md` extended with a "Long-Horizon Milestone Projection" section:

```markdown
## v1: Foundations and Explainable Simulation [CURRENT]
[phase list]

## v2: Computational Backend Migration + Educational Content Scaffold
**Theme:** Migrate computational core to [language decided]. Launch first 10 lessons.
**Success criteria:** [TRUE statements]
**Themes:** [bulleted]

## v3: Historical Regulation Expansion + Calibration Workbench
[same structure]

## v4+: [decreasing specificity]
```

With decreasing specificity for further-out milestones, making clear what's committed vs. what's directional.

New workflow: `/gsdr:project-roadmap` to draft long-horizon milestones as part of vision work.

### Tech debt registry

`.planning/tech-debt.md` as a first-class file alongside ROADMAP.md, STATE.md, PROJECT.md.

Machine-readable format (YAML frontmatter or structured markdown):

```yaml
- id: td-001
  title: "..."
  current_state: "..."
  severity: high
  rewrite_trigger: "..."
  rewrite_readiness: medium
  blocked_by: ["td-XXX"]
  phase_target: "..."
  created: YYYY-MM-DD
  source: "audit-name"
  status: pending|in-progress|resolved
```

New workflows:

- `/gsdr:tech-debt-add` — register new debt
- `/gsdr:tech-debt-list` — list active debt by severity or trigger
- `/gsdr:tech-debt-check` — invoked by phase planning to surface relevant debt
- `/gsdr:tech-debt-resolve` — mark an entry resolved with link to phase/commit

Phase discuss and plan workflows should auto-check the registry and surface relevant entries.

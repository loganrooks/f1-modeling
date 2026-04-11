# Stage 3: Synthesis — Vision Alignment Initiative

**Model:** gpt-5.4 (high reasoning, 1M context)
**Purpose:** Turn accepted deliberations into concrete project-file changes.
**Prerequisite:** Stage 2 deliberations must be complete AND have decisions recorded by user.

---

You are executing the Synthesis stage of the Vision Alignment initiative for the F1 Modeling Lab. The user has reviewed the Stage 2 deliberations and marked decisions in each. Your job is to propose concrete, reviewable changes to project files based on those decisions.

**Critical:** You will NOT modify `.planning/ROADMAP.md`, `CLAUDE.md`, phase CONTEXT.md, or any other existing project files. You will produce PROPOSAL files in `synthesis/` that the user will review and apply (or reject) manually.

## Context files to read first

1. `.planning/VISION.md`
2. `.planning/PROJECT.md`
3. `.planning/ROADMAP.md`
4. `CLAUDE.md` (project root)
5. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
6. `.planning/initiatives/vision-alignment-2026-04/README.md`
7. `.planning/initiatives/vision-alignment-2026-04/PLAN.md`
8. All 4 deliberation files in `.planning/initiatives/vision-alignment-2026-04/deliberations/`
9. Optional: Stage 1 research files for detail lookup

Pay particular attention to the **Decision Record** sections in each deliberation. Those contain the user's accepted decisions. If a Decision Record is empty, stop and report which deliberations have not been decided.

## Synthesis tasks

---

### Synthesis 1: Roadmap Evolution

**Output file:** `.planning/initiatives/vision-alignment-2026-04/synthesis/roadmap-evolution.md`

**Content:**

1. **Proposed ROADMAP.md changes** — specific, diff-style where possible:
   - New foundation phases to insert (with phase numbers, names, goals, success criteria, plan breakdowns)
   - Modifications to existing Phase 4+ plans based on deliberation outcomes
   - New phases for compute backend migration, visualization primitives, educational content (if decided)
   - Updated dependency graph

2. **v2+ milestone projection** — the long-horizon roadmap from Deliberation 4:
   - Milestone themes for v2, v3, v4, v5 (decreasing specificity)
   - Success criteria at the milestone level
   - When the platform reaches "essentially what we always wanted"
   - Tech debt consolidation milestones
   - Optimization milestones

3. **ROADMAP.md proposed final text** — an actual draft of the new ROADMAP.md content, so the user can copy-paste or diff it.

---

### Synthesis 2: Guardrails Proposal

**Output file:** `.planning/initiatives/vision-alignment-2026-04/synthesis/guardrails-proposal.md`

**Content:**

1. **CLAUDE.md additions** — propose specific new sections or additions:
   - Vision alignment checkpoint: every phase CONTEXT.md must include a "Vision Impact" section (distinct from "Future Awareness")
   - Performance budget enforcement: every visualization phase runs the worst-plausible-view benchmark
   - Honesty constraints expansion: confidence labels on placeholder outputs
   - Phase gate question: "Does this serve the vision or just the milestone?"
   - Audit cadence: vision-alignment audit at the start of each new milestone, not just retrospectively
   - Tech debt registry reference: phases must check-in against the registry
   - Repo hygiene: atomic commits per plan, branch protection, cross-model audits at milestone boundaries

2. **Phase CONTEXT.md template additions** — propose a new template section:
   - Vision Impact section (how this phase serves the long-horizon vision)
   - Tech Debt Check (what this phase adds to or removes from the registry)
   - Performance Budget Compliance (if visualization work)

3. **Proposed diff** — actual CLAUDE.md diff ready for review

---

### Synthesis 3: Tech Debt Registry

**Output file:** `.planning/initiatives/vision-alignment-2026-04/synthesis/tech-debt-registry.md`

**Content:**

A structured, machine-parseable registry (YAML-like or table format) of deferred work. Seeded from the audit response, expanded with deliberation outcomes.

Each entry:
```yaml
- id: td-001
  title: "runService.ts mixing concerns"
  current_state: "~900 LOC god-service combining compute, presets, persistence"
  severity: high
  rewrite_trigger: "SimulationBackend abstraction landing"
  rewrite_readiness: medium  # how easy is it to rewrite when the trigger fires
  blocked_by: ["td-002"]  # other entries that must be resolved first
  phase_target: "3.2 (proposed)"
  created: 2026-04-10
  source: "vision-audit-2026-04-08"
```

Minimum 10 entries. Include everything from the audit response plus new entries surfaced by deliberations.

---

### Synthesis 4: Phase Insertion Proposals

**Output file:** `.planning/initiatives/vision-alignment-2026-04/synthesis/phase-insertion-proposals.md`

**Content:**

If the deliberations decided to insert foundation phases (likely: compute boundary, visualization primitives, educational scaffolding), produce ready-to-use phase insertion specs.

Each proposal:
- Proposed phase number (respecting GSDR decimal convention)
- Phase name
- Goal statement
- Depends on (prior phases)
- Requirements mapping
- Success criteria (4-6 specific TRUE statements)
- Plan breakdown (3-6 plans with names and brief objectives)
- Rationale for insertion
- What existing phases it unblocks

These should be copy-pasteable into ROADMAP.md or directly useable with `/gsdr:insert-phase`.

---

### Synthesis 5: Summary

**Output file:** `.planning/initiatives/vision-alignment-2026-04/SUMMARY.md`

**Content:**

- What this initiative decided (one paragraph per deliberation)
- Files that should be modified (ROADMAP.md, CLAUDE.md, phase CONTEXT.md templates, new phase directories)
- Specific commits the user should make (ordered, with commit message suggestions)
- What happens next (typically: return to `/gsdr:plan-phase 04` after modifications are applied)
- Open questions still unresolved
- Tech debt registry stats (total items, by severity)
- Links to all initiative artifacts

## Output constraints

1. **Use cat heredoc** for each file
2. **Do not modify existing files** — only write to `.planning/initiatives/vision-alignment-2026-04/synthesis/` and `SUMMARY.md`
3. **Make proposals specific and actionable** — not hand-wavy
4. **Ground everything in the deliberation decisions** — if a deliberation didn't decide something, don't invent it here
5. **If a deliberation decision is missing, STOP and report it** rather than guessing

## Completion signal

```
Stage 3 complete.
- synthesis/roadmap-evolution.md (XXX lines)
- synthesis/guardrails-proposal.md (XXX lines)
- synthesis/tech-debt-registry.md (XXX lines)
- synthesis/phase-insertion-proposals.md (XXX lines)
- SUMMARY.md (XXX lines)
```

After this stage, the user will review synthesis outputs, then manually apply changes to ROADMAP.md, CLAUDE.md, and phase templates via atomic commits. The initiative completes when those commits are made.

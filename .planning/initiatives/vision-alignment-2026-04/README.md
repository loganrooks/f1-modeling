# Initiative: Vision Alignment 2026-04

**Status:** Planned, awaiting Wave 1 execution
**Started:** 2026-04-10
**Owner:** Logan Rooks
**Runtime:** Codex GPT-5.4 (primary execution), Claude Opus 4.6 (oversight)

---

## Why This Is Not a Phase

GSDR phases are feature/capability-oriented with verifiable code deliverables that flow through discuss → plan → execute → verify. This work is **meta-work**:

- Inputs: three vision alignment audits + expanded VISION.md
- Outputs: research reports, deliberation decisions, roadmap evolution, tech debt registry, guardrail conventions
- Does not produce code directly — its outputs flow INTO phases as modifications to ROADMAP.md, CLAUDE.md, and new phase insertions

This exceeds the current GSDR formalized workflow in several ways. Workflow gap signals have been filed at `.planning/knowledge/signals/f1-modeling/` documenting the gaps so the GSDR tool itself can grow to support this kind of work natively.

## Methodological Foundation

This initiative critically inherits research methodology from prior work on the Prix Guesser project (2026-04). The core principles — non-foreclosure, terrain mapping over solution evaluation, hidden-assumption surfacing, trajectory analysis, explicit gray-area handling, path-of-inquiry traceability, deferral as valid outcome — are captured in `RESEARCH-PRINCIPLES.md`.

**Every Codex invocation in this initiative MUST read `RESEARCH-PRINCIPLES.md` before beginning its task.** The principles document overrides any tension with task-specific instructions.

The structural implication: research tasks are framed as terrain mapping, not solution selection. Deliberations permit deferral and reframing as outcomes, not just recommendations. Iteration is supported when findings warrant it. The wave structure is scaffolding, not an execution contract — it is subject to revision at every review gate.

## Trigger

Three parallel vision alignment audits (2026-04-08) identified 15 findings converging on a core message: the Phase 4 research answered the wrong-sized question. It resolved "which charting toolkit?" when the vision was asking "what architecture lets this become a serious engineering-and-education platform?"

The audits identified six must-haves that demand coordinated thinking before Phase 4 planning can safely proceed:

1. `SimulationBackend` abstraction (transport-neutral boundary + async job model + streaming)
2. Visualization primitive layer (renderer-agnostic, visx as first impl, Canvas escape hatch)
3. Typed regulation families (discriminated unions)
4. Educational content architecture (lesson schema, learning overlays)
5. Performance budget (measurable targets, not philosophical debates)
6. Computational backend strategy (TypeScript vs hybrid, language choice, migration path)

Plus a user-raised gap: **no explicit optimization / computational-efficiency track in the roadmap.**

## Scope

**In scope (current scaffolding — subject to revision at review gates):**
- Research on 5 domains (compute backends, visualization at scale, educational content, streaming, multi-regulation typing)
- Deliberations on computational backend strategy, visualization architecture, educational content architecture, long-horizon roadmap (approximate count — may change based on research findings)
- Synthesis: roadmap evolution, phase insertion proposals, guardrails, tech debt registry
- Iterative drafting of D2 (visualization) and D3 (education) to honor their bidirectional coupling

**Out of scope:**
- Implementation of any decisions (that happens in new/modified phases after this initiative)
- Immediate Phase 4 planning (blocked until deliberations resolve)

## Structure

See `PLAN.md` for detailed wave structure. Summary:

| Wave | Calls | Purpose |
|------|-------|---------|
| 1 | 1A, 1B, 1C (parallel) | Research Round 1 (terrain mapping) |
| Gate 1 | — | User review; reshape later waves if warranted |
| 1.5 | optional | Targeted follow-up research if findings warrant |
| 2a | 2A (serial) | D1 compute backend deliberation |
| Gate 2a | — | User review |
| 2b | 2B-i → 2B-ii → optional 2B-iii (serial, iterative) | D2 + D3 coupled deliberations via iterative drafting |
| Gate 2b | — | User review |
| 2c | 2C (serial) | D4 long-horizon deliberation |
| Gate 2c | — | User review |
| 3 | 3A, 3B (serial) | Synthesis: roadmap, phase insertions, guardrails, tech debt, summary |

**Minimum 9 Codex calls, 8 wall-clock steps.** Actual count may grow if Round 1.5 triggers or Wave 2b-iii runs.

## Key Files

- `RESEARCH-PRINCIPLES.md` — methodological manifesto, required reading for every Codex call
- `PLAN.md` — master plan with wave structure, dependencies, invocation patterns
- `codex-call-1A.md`, `codex-call-1B.md`, `codex-call-1C.md` — Wave 1 prompt files (ready to execute)
- Prompts for Waves 2 and 3 are **authored at the corresponding review gates**, informed by what earlier waves actually surface. This respects the "scaffolding not execution plan" principle.

## Source Documents

Every stage reads these (summarized in `RESEARCH-PRINCIPLES.md` references):

- `.planning/VISION.md` — the expanded platform vision
- `.planning/PROJECT.md` — current project definition
- `.planning/ROADMAP.md` — current 11-phase milestone
- `.planning/REQUIREMENTS.md` — 42 v1 requirements
- `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — consolidated audit response with 15 findings and dispositions
- `.planning/audits/vision-audit-2026-04-08/opus-audit.md` — Opus independent audit
- `.planning/audits/vision-audit-2026-04-08/codex-audit.md` — Codex high-reasoning audit
- `.planning/audits/vision-audit-2026-04-08/codex-xhigh-audit.md` — Codex xhigh-reasoning audit

## Archive

The `archive/` directory contains superseded earlier drafts of the initiative structure, retained for traceability. See `archive/README.md` for what changed and why.

## Completion Criteria

This initiative is complete when:

1. All research outputs pass epistemic hygiene review (assumptions surfaced, gray areas handled via the three-response framework, trajectories analyzed, precedents cited, confidence calibrated, path of inquiry documented)
2. All deliberations have outcomes recorded — recommendation with warrant, provisional recommendation with closure criteria, explicit deferral with closure criteria, or reframing (the number and shape of deliberations may differ from the initial scaffolding)
3. Synthesis outputs propose concrete project-file changes
4. User reviews and accepts synthesis outputs
5. ROADMAP.md, CLAUDE.md, and phase CONTEXT.md templates are updated via atomic commits
6. `SUMMARY.md` captures what was decided, what was deferred, what was reframed, and the path of inquiry across the initiative

After completion, Phase 4 planning (`/gsdr:plan-phase 04`) can safely proceed on the new architectural foundation.

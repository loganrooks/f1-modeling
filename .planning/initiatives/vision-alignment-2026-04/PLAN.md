# Master Plan: Vision Alignment Initiative

**Target runtime:** Codex GPT-5.4 (mode varies by stage)
**Required reading:** All Codex invocations MUST read `RESEARCH-PRINCIPLES.md` before beginning their task.
**Primary orchestrator (as of 2026-04-11):** Codex GPT-5.4. See `CODEX-ORCHESTRATOR-HANDOFF.md` for the complete orchestration role and methodology. Waves 1 and 2A were orchestrated by Claude Opus 4.6; from Wave 2B-i forward, primary orchestration shifts to Codex for usage-budget reasons. Claude remains available as cross-model auditor at specific high-stakes moments and as user dialogue partner on request.

---

## This Plan Is Scaffolding, Not an Execution Contract

**Read this section carefully.** The wave structure below is the current best guess at the right shape of the work, based on the 2026-04-08 audit findings and the methodological principles in `RESEARCH-PRINCIPLES.md`. It is **subject to revision at every review gate.**

At each review gate, one valid outcome is: **"the planned structure is wrong; here is the right structure."** That is not a failure of the plan — it is the plan doing its job. If research surfaces that different deliberation questions are warranted, that D2 and D3 should merge or split differently, that a new research lane is needed, or that the overall framing should be reconsidered, the plan restructures.

In particular, the **4 deliberations** currently listed (D1 compute, D2 visualization, D3 education, D4 long-horizon) are provisional handles. Research may reveal:
- The right number is 3 or 5, not 4
- Two deliberations should merge because they're really one question
- One deliberation should split because it contains distinct decisions
- A completely different deliberation structure emerges from a reframing

The goal of this plan is to map terrain so decisions are grounded, not to execute a predetermined pipeline. The structure serves the work, not the other way around.

---

## Methodological Foundation

This initiative critically inherits methodological lessons from prior research work (notably the Prix Guesser project, 2026-04) that learned the hard way to resist premature solution-space foreclosure. The core commitment:

> **Do not collapse the option space prematurely. Map terrain clearly enough that decisions are grounded, traceable, and recoverable when assumptions turn out wrong.**

Every stage operates under the principles in `RESEARCH-PRINCIPLES.md`. Non-negotiable requirements include:
- Hidden assumption surfacing
- Trajectory analysis (1/3/5-year)
- Precedent analysis (specific named cases)
- Gray area handling via the three-response framework (defer / follow-and-mark / revisit-later)
- Scope expansion tracking with explicit marking
- Path of inquiry traceability (branching paths, dependencies, reframings)
- Dependencies and relations mapping between questions
- Deferral and reframing as valid outcomes

---

## Structural Model

This initiative supports **iteration when warranted, not as busywork.**

The nominal flow is:

```
Research Round 1 → Review Gate → [Optional Round 1.5] → Deliberations (iterative within Wave 2b) → [Possible research loopback] → Synthesis
```

Any stage can trigger a loopback to an earlier stage if its findings reveal that earlier work needs extension. The user decides at each review gate whether to proceed, iterate, or reframe. Iteration is legitimate when findings warrant it; it is not required for its own sake.

---

## Wave Structure (Current Scaffolding)

The work is organized into approximately 9-10 Codex calls across multiple waves. Some waves run in parallel; some are strictly serial. Review gates between waves are mandatory.

### Wave 1 — Research Round 1 (parallel, 3 calls)

Launch simultaneously as background processes.

| Call | Tasks | Mode | Est. context |
|------|-------|------|--------------|
| **1A** | R1 (compute backends) + R4 (streaming architectures) | Terrain mapping | ~100K |
| **1B** | R2 (visualization at scale) + R3 (educational content) | Terrain mapping | ~90K |
| **1C** | R5 (multi-regulation typing) | Terrain mapping | ~50K |

**Batching rationale:**
- 1A: compute boundary IS the streaming/job boundary — architecturally inseparable
- 1B: user-facing surfaces with bidirectional coupling (viz capabilities ↔ education needs)
- 1C: genuinely independent, smallest research scope, standalone call

**Prompt files:** `codex-call-1A.md`, `codex-call-1B.md`, `codex-call-1C.md`

### Review Gate 1

User + Claude review all 5 research outputs. Decide:

1. Are the option spaces adequately mapped?
2. Are assumptions surfaced and tested?
3. Are gray areas clearly marked via the three-response framework, or are they being collapsed?
4. Did the research surface reframings that should change subsequent work?
5. Are the planned deliberation questions still the right questions, or does the research suggest different ones?
6. Is a Round 1.5 warranted? If yes, on which questions?

**Possible outcomes:**
- Proceed to Wave 2 as planned
- Commission Round 1.5 targeted follow-up research
- Restructure the deliberation plan based on reframings (e.g., merge deliberations, add new ones, remove planned ones)
- Add or remove research tasks from the initiative
- Reframe the initiative scope based on findings

### Wave 1.5 — Targeted Follow-Up Research (optional, 0-N calls)

Triggered only if Review Gate 1 identifies specific unresolved questions worth focused re-investigation. Each follow-up is a narrow Codex call with its own prompt file drafted at gate time.

**Prompt files:** ad-hoc, created at review gate if needed

### Wave 2a — Foundational Deliberation (1 call)

| Call | Task | Mode |
|------|------|------|
| **2A** | D1 (computational backend strategy) | Closure attempted, deferral and reframing allowed |

D1 goes alone because it's the foundation — its decision shapes D2 and D4. It cannot be drafted in parallel with D2/D3 because those depend on D1's decision anchor.

**Prompt file:** `codex-call-2A.md` (written after Review Gate 1, informed by Wave 1 findings)

### Review Gate 2a

User reviews D1. Decides:
- Accept the recommendation/deferral/reframing
- Request revision with specific concerns
- Loop back to Wave 1.5 for more research if the deliberation surfaced gaps

### Wave 2b — Iterative Coupled Deliberations (2-3 calls, Option B)

D2 (visualization architecture) and D3 (educational content architecture) have bidirectional coupling: viz capabilities constrain what education can teach, AND education's needs (annotation anchors, guided tours, progressive disclosure) dictate visualization primitives. To honor this coupling, they are drafted iteratively across sequential calls rather than batched in one.

| Call | Task | Mode |
|------|------|------|
| **2B-i** | D2 draft (visualization architecture) | Closure attempted, deferral allowed |
| **2B-ii** | D3 draft (educational content architecture), with D2 in context | Closure attempted, deferral allowed |
| **2B-iii** (optional) | D2 revision given D3's surfaced requirements | Revision only |

**Iteration rationale:** Each call has clean focus and working memory. 2B-ii literally has D2 to respond to, so D3 can explicitly reference or push back on D2's primitives. If D3 surfaces new requirements that D2 didn't anticipate (e.g., "education needs annotation anchor semantics that D2 didn't reserve"), 2B-iii revises D2 to accommodate them. If D3 fits cleanly within D2's proposed architecture, 2B-iii is skipped.

**Consumes:**
- 2B-i: D1 decision anchor, R2 research, relevant R3 insights
- 2B-ii: D1 decision anchor, R3 research, D2 (from 2B-i)
- 2B-iii: D2 (from 2B-i), D3 (from 2B-ii), specific surfaced requirements

**Prompt files:** `codex-call-2B-i.md`, `codex-call-2B-ii.md`, `codex-call-2B-iii.md` (written after Review Gate 2a)

### Review Gate 2b

User reviews D2 and D3 together. Decides:
- Accept both as they are
- Request D2 revision (triggering 2B-iii if not already run)
- Request D3 revision
- Loop back if coupling can't be resolved

### Wave 2c — Synthesis Deliberation (1 call)

| Call | Task | Mode |
|------|------|------|
| **2C** | D4 (long-horizon roadmap projection) | Synthesis across D1/D2/D3, deferral and reframing allowed |

**Consumes:** D1/D2/D3 decision anchors, all research, VISION.md

D4 is the hardest to do well because it synthesizes everything. It reads decision anchors (compact ~1-page summaries) from the prior deliberations rather than full files, preserving working context. D4 may recommend restructuring the project roadmap, propose new milestones, or defer long-horizon decisions with criteria for when they should be made.

**Prompt file:** `codex-call-2C.md` (written after Review Gate 2b)

### Review Gate 2c

User reviews D4. Stage 3 blocks until all deliberations have decision records marked (or explicit deferrals recorded with closure criteria).

### Wave 3 — Synthesis (2 serial calls)

| Call | Tasks | Mode |
|------|-------|------|
| **3A** | Roadmap evolution + phase insertion proposals | Solution evaluation (decisions made) |
| **3B** | Guardrails + tech debt registry + SUMMARY | Documentation |

3A must complete before 3B because the SUMMARY references the roadmap changes.

**Prompt files:** `codex-call-3A.md`, `codex-call-3B.md` (written after Review Gate 2c)

### Final Review

User reviews all synthesis outputs. Manually applies changes to `.planning/ROADMAP.md`, `CLAUDE.md`, and phase templates via atomic commits. Initiative is complete when commits are made.

---

## Call Summary

| Wave | Call | Task | Parallelism | Reasoning |
|------|------|------|-------------|-----------|
| 1 | 1A | R1+R4 research | Parallel | high |
| 1 | 1B | R2+R3 research | Parallel | high |
| 1 | 1C | R5 research | Parallel | high |
| — | Gate 1 | User review | — | — |
| 1.5 | optional | Targeted follow-ups | Serial/parallel | high |
| 2a | 2A | D1 compute deliberation | Serial | xhigh |
| — | Gate 2a | User review | — | — |
| 2b | 2B-i | D2 visualization deliberation | Serial | xhigh |
| 2b | 2B-ii | D3 education deliberation (with D2 in context) | Serial | xhigh |
| 2b | 2B-iii | D2 revision (optional, only if D3 surfaces new requirements) | Serial | xhigh |
| — | Gate 2b | User review | — | — |
| 2c | 2C | D4 long-horizon deliberation | Serial | xhigh |
| — | Gate 2c | User review | — | — |
| 3 | 3A | Roadmap synthesis | Serial | high |
| 3 | 3B | Guardrails synthesis | Serial | high |

**Wall-clock steps:** 8 minimum (Wave 1 parallel = 1 step; each subsequent serial wave = 1 step; Wave 2b can be 2-3 steps; Wave 3 = 2 steps)
**Total Codex calls (minimum):** 9 (adds up to 10 if 2B-iii runs; more if Round 1.5 triggers)
**Iteration:** Round 1.5 may add 1-N calls if warranted. Wave 2b-iii may be skipped if unnecessary.

---

## Reasoning Mode Guidance

- **Research (1A/1B/1C):** `high` reasoning — tool-heavy (reading files, running npm queries), not writing-heavy. xhigh risks burning output budget on thinking.
- **Deliberations (2A/2B/2C):** `xhigh` reasoning — writing-heavy synthesis benefits from deeper reasoning, less tool usage.
- **Synthesis (3A/3B):** `high` reasoning — file manipulation and structured output, not novel reasoning.

Do NOT set `-c model_context_window=1000000`. Use Codex defaults (~272K). All calls are designed to stay well under 200K working context. Raising the window encourages context-hungry behavior and degrades quality past ~250K.

---

## Invocation Pattern

For each call, pipe the prompt file to `codex exec`:

```bash
cat .planning/initiatives/vision-alignment-2026-04/codex-call-<X>.md | \
  codex exec -m gpt-5.4 \
  -c model_reasoning_effort=<high|xhigh> \
  -s danger-full-access -
```

Run parallel calls in separate terminals or using `&` backgrounding. Let each complete before the corresponding review gate.

---

## Prompt File Authorship Strategy

Prompt files for **Wave 1 are authored upfront** (before initiative begins). They are ready to execute once the user approves.

Prompt files for **Waves 2 and 3 are authored at the appropriate review gate**, informed by what earlier waves actually found. This respects the "scaffolding not execution plan" principle — later prompts are shaped by what research surfaces, not pre-committed based on assumptions.

At each review gate, Claude drafts the next wave's prompt files based on:
- Findings from completed waves
- User decisions at the review gate
- Any reframings or restructurings that surfaced

This approach means the plan appears incomplete at first — only Wave 1 prompts exist. That is intentional.

---

## Outputs

### Stage 1 outputs
- `research/01-compute-backends.md`
- `research/02-visualization-at-scale.md`
- `research/03-educational-content-architectures.md`
- `research/04-streaming-architectures.md`
- `research/05-multi-regulation-typing.md`

### Stage 1.5 outputs (if triggered)
- `research/1-5-<specific-question>.md` per follow-up

### Stage 2 outputs
- `deliberations/01-computational-backend-strategy.md`
- `deliberations/02-visualization-architecture.md`
- `deliberations/03-educational-content-architecture.md`
- `deliberations/04-long-horizon-roadmap.md`

Each deliberation also produces a `decision-anchor.md` companion — a 1-page compact summary that later deliberations consume instead of the full file. These decision anchors are what 2C (D4) reads, not the full deliberation files.

Note: the exact count and shape of deliberations may change at Review Gate 1 if research surfaces reframings.

### Stage 3 outputs
- `synthesis/roadmap-evolution.md`
- `synthesis/phase-insertion-proposals.md`
- `synthesis/guardrails-proposal.md`
- `synthesis/tech-debt-registry.md`
- `SUMMARY.md`

---

## Progress Tracker

| Wave | Call | Status | Started | Completed | Gate Outcome |
|------|------|--------|---------|-----------|--------------|
| 1 | 1A | ✅ Complete | 2026-04-10 | 2026-04-10 | 5 research outputs, terrain mapping held |
| 1 | 1B | ✅ Complete | 2026-04-10 | 2026-04-10 | (bundled with 1A/1C via subagent fallback) |
| 1 | 1C | ✅ Complete | 2026-04-10 | 2026-04-10 | (bundled with 1A/1B via subagent fallback) |
| Gate 1 | — | ✅ Passed | 2026-04-10 | 2026-04-11 | Convergent boundary insight, boundary memo written, Codex cross-model review triggered restructure to δ |
| 1.5 | R1.5 | ✅ Complete | 2026-04-11 | 2026-04-11 | UI/rendering envelope + job/compute envelope, 5 worst-plausible scenarios, measurement methodology |
| 2a | 2A (D1) | ✅ Complete | 2026-04-11 | 2026-04-11 | All 4 contracts addressed; C1 reframed (two-stage shape); C3 strongest recommendation with reserved semanticApplicability slot |
| Gate 2a | — | ✅ Passed | 2026-04-11 | 2026-04-11 | All 4 contracts Accepted (C1, C3, C4 closed; C2 provisional on edge transport) |
| 2b | 2B-i (D2) | 📝 Prompt drafted, awaiting launch authorization | — | — | Will close C4, C5, C6 + address D2.A-D UI discipline subsections |
| 2b | 2B-ii (D3) | ⏳ Prompt not yet drafted (awaits D2 completion) | — | — | — |
| 2b | 2B-iii | ⏳ Not triggered | — | — | Optional D2 revision if D3 surfaces new requirements |
| Gate 2b | — | ⏳ Pending | — | — | — |
| 2c | 2C (D5) | ⏳ Prompt not yet drafted (awaits D2/D3 completion) | — | — | Regulation semantic model ontology deliberation |
| Gate 2c | — | ⏳ Pending | — | — | — |
| 2d | 2D (D4) | ⏳ Prompt not yet drafted | — | — | Long-horizon roadmap synthesis |
| Gate 2d | — | ⏳ Pending | — | — | — |
| 3 | 3A | ⏳ Prompt not yet drafted | — | — | Roadmap evolution + phase insertion proposals |
| 3 | 3B | ⏳ Prompt not yet drafted | — | — | Guardrails + tech debt + SUMMARY |

Update this table as each wave completes.

---

## Completion Criteria

This initiative is complete when:

1. All research outputs pass epistemic hygiene review (assumptions surfaced, gray areas handled via the three-response framework, trajectories analyzed, precedents cited, confidence calibrated, path of inquiry documented)
2. All deliberations have outcomes recorded — recommendation with warrant, provisional recommendation with closure criteria, explicit deferral with closure criteria, or reframing (the number and shape of deliberations may differ from the initial plan)
3. Synthesis outputs propose concrete project-file changes
4. User reviews and accepts synthesis outputs
5. ROADMAP.md, CLAUDE.md, and phase CONTEXT.md templates are updated via atomic commits
6. `SUMMARY.md` captures what was decided, what was deferred, what was reframed, and the path of inquiry across the initiative

After completion, Phase 4 planning can safely resume on the new architectural foundation.

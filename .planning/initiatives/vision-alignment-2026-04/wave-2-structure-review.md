# Wave 2 Structure Review — Cross-Model Decision Document

**Date:** 2026-04-11
**Purpose:** Three structural decisions for Wave 2 of the Vision Alignment Initiative need fresh-eyes review before Wave 2 prompts are drafted. This document is written for a Codex GPT-5.4 xhigh reviewer who has not seen the planning conversation.
**Author of recommendations:** Claude Opus 4.6 (review by Logan Rooks already completed; this document collects Logan's decisions plus three he wants stress-tested before commitment)
**Reviewer instructions:** See the bottom of this document.

---

## Context You Need

The F1 Modeling Lab project ran three independent vision alignment audits on 2026-04-08 (one Claude Opus, two Codex GPT-5.4 — one `high` and one `xhigh`). All three converged on the finding that Phase 4 research had answered "the wrong-sized question" — it resolved a tactical visualization library question (visx) without addressing the architectural questions the long-term platform vision actually requires.

The user (Logan Rooks) consolidated those audits into a 15-finding response document and launched a structured **Vision Alignment Initiative** to do the deep architectural thinking before Phase 4 planning resumes. The initiative has three nominal stages — Research → Deliberations → Synthesis — and uses methodological principles critically inherited from prior research work on the Prix Guesser project (the principle being: resist premature solution-space foreclosure, allow reframings, support iteration when warranted).

**Wave 1 (research) is complete.** Five research outputs were produced by parallel Codex subagents on 2026-04-10:

- `research/01-compute-backends.md` (R1)
- `research/02-visualization-at-scale.md` (R2)
- `research/03-educational-content-architectures.md` (R3)
- `research/04-streaming-architectures.md` (R4)
- `research/05-multi-regulation-typing.md` (R5)

The original plan called for **Wave 2 to be 4 deliberations**:
- D1: Computational backend strategy
- D2: Visualization architecture
- D3: Educational content architecture
- D4: Long-horizon roadmap projection

**The research findings invite restructuring.** Three structural decisions need to be made before Wave 2 prompts are drafted. Your job is to stress-test the proposed answers and either endorse them, propose alternatives, or surface considerations that haven't been weighed.

---

## Required Reading

Read these files in order. They are all in `/home/rookslog/workspace/projects/f1-modeling/`:

### Methodological foundation (read first)
1. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — the methodological manifesto governing all initiative work. Key concepts: terrain mapping mode, three-response gray area framework (defer / follow-and-mark / revisit-later), non-foreclosure, deferral as valid outcome, scaffolding-not-execution-plan principle.
2. `.planning/VISION.md` — the long-term platform vision. This is the anchor for everything; the audits and initiative exist to align planning with this vision.

### Audit context
3. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — consolidated audit findings with dispositions. The 15 findings and 6 must-haves are the trigger for the initiative.

### Initiative scaffolding
4. `.planning/initiatives/vision-alignment-2026-04/README.md` — initiative overview and structure
5. `.planning/initiatives/vision-alignment-2026-04/PLAN.md` — current wave structure (the structure you may recommend changing)
6. `.planning/initiatives/vision-alignment-2026-04/wave-1-orchestrator-report.md` — Wave 1 execution status

### Wave 1 research outputs (the substance you must engage with)
7. `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`
8. `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`
9. `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md`
10. `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`
11. `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`

You do NOT need to read source code, Phase 4 research files, or the original three audit files — they are consolidated into the audit response.

**Estimated reading context:** ~80-120K tokens. Manageable in a single Codex session.

---

## The Convergent Finding (Synthesized)

Before stating the decisions, here is the convergent insight all 5 research files independently surface. You should verify this when you read the files; if you disagree with the synthesis, your review is more valuable.

**All 5 research files refuse the original framing and converge on the same architectural pattern: separate identity/contracts from implementation, then keep multiple options viable behind clean boundaries.**

| File | Original question | What the research surfaces |
|------|-------------------|----------------------------|
| R1 (compute) | Which language? | "Establish a transport-neutral backend contract, then keep multiple backend languages viable behind it" |
| R4 (streaming) | Which streaming library? | "Define a transport-neutral job protocol with typed event unions and fetchable artifacts" |
| R2 (viz) | Which charting library? | "Define a renderer-agnostic surface with shared interaction state, then allow multiple renderer families under it" |
| R3 (education) | Which content format? | "Make lesson identity, prerequisites, role tags, artifact bindings first-class typed objects, with body format separately swappable" |
| R5 (regulations) | How to type regulations? | "Three-axis model: regulation-family identity + capability-first structural typing + independent schema-version handling" |

The hybrid family wins terrain analysis in every single file. R1 Option G, R2 Option D, R3 Option F, R5 Option G — all converge on "multiple things behind a clean boundary, not one winner."

**Implied "boundary catalog" the platform needs:**
1. Compute boundary (`SimulationBackend` / async job model)
2. Job protocol (typed event unions, fetchable artifacts, cancellation)
3. Renderer boundary (renderer-agnostic chart contract)
4. Interaction contract (shared cursor, brush, selection)
5. Annotation anchor system (artifact-relative IDs)
6. Lesson concept graph (typed prerequisites, role tags, artifact bindings)
7. Regulation identity model (family + capability + version)

These boundaries are what the research suggests the architecture actually is. Implementations behind each can evolve independently.

**Cross-cutting findings worth noting:**
- **R5 was supposed to be independent but discovered a coupling.** R5 found that `sim-core` has hardcoded 2026 electrical constants — multi-regulation typing alone won't enable multi-era execution. This is a "discovered coupling" the original dependency analysis missed.
- **Performance budget is the universal blocker.** All 5 files flag the absence of measurable performance targets as a load-bearing gap. Without targets, library/architecture debates stay philosophical (this is the visx-failure pattern the audits identified).
- **R2 ↔ R3 bidirectional coupling is confirmed and substantive.** Both files cross-reference each other; the integration pattern (artifact-relative anchors) is the same insight from both directions.

---

## Decision 1: Wave 2 Structural Option

### The decision

Given the convergent boundary insight, what should Wave 2 actually look like?

### Options considered

#### Option α: Keep 4 deliberations, reshape questions, no Round 1.5

D1, D2, D3, D4 stay as nominal deliberations but their questions broaden:
- D1 absorbs R1+R4 (compute boundary + transport protocol)
- D2 absorbs R2 (renderer boundary + interaction + annotation)
- D3 absorbs R3 (lesson graph + body adapter)
- D4 stays as long-horizon roadmap synthesis

R5 becomes its own concern (see Decision 3 — fold or split).

**Pros:** Closest to original plan. Faster. No additional waves. Preserves user mental model.

**Cons:** Performance budget gap remains unaddressed. Deliberations stay philosophical without measurable targets. The convergent boundary insight gets diluted across deliberations rather than crystallized.

#### Option β (Claude's recommendation): Option α + Round 1.5 on performance budgets

Same 4-deliberation backbone as α, plus a focused Round 1.5 research call on performance budgets before Wave 2 deliberations begin.

Round 1.5 produces `research/06-performance-budget-definition.md` covering:
- What worst-plausible Phase 4 view should benchmark against
- Target metrics implied by the vision (strategies/panels/latency/cadence)
- Measurement methodology
- Output format: "proposed targets + measurement methodology" not "validated targets"

Estimated context: ~50K. Estimated output: 150-250 lines. Wall-clock: one additional step.

**Pros:** Addresses the universal gap flagged by 5/5 research files. Unblocks downstream deliberations by giving them measurable targets. Preserves user mental model. The methodology explicitly supports targeted follow-up rounds when "gray areas cluster around a specific question" — this is exactly that case.

**Cons:** One additional wall-clock step. Risk that Round 1.5 produces another set of "we don't know yet" findings rather than crisp targets. Performance budgets without actual benchmarking stay aspirational (proposing targets is not the same as validating them).

#### Option γ: Restructure entirely around the boundary catalog

Wave 2 becomes:
- **D1: The boundary catalog** — define all 7 boundaries, their interfaces, their relationships. Meta-architectural decision.
- **D2: Initial implementations behind boundaries** — given the catalog, which first implementations and which migration paths?
- **D3: Lesson and content architecture** — kept separate because content is product scope, not just architecture
- **D4: Long-horizon roadmap projection**

**Pros:** Most intellectually honest reframing. Directly reflects the convergent insight all 5 research files surface. Each subsequent deliberation can reference a single canonical boundary catalog rather than each deliberation re-deriving the boundary insight.

**Cons:** Biggest structural shift. Three concrete risks:
1. Meta-architectural deliberations are hard to write well. "What boundaries should the platform establish?" doesn't have a clean option-space the way "Python vs Rust" does. xhigh Codex tends to ramble when given meta-questions without grounded options.
2. Splitting "boundary definition" from "implementation choice" loses interaction effects. Knowing whether you'll use Python sidecar vs in-process TypeScript actually changes what the boundary looks like. The decisions interact, and splitting them into two waves means D1 commits to a boundary shape before D2 knows what implementation pressures will be. This is the same waterfall failure mode the iterative methodology is supposed to avoid.
3. The user has invested in the original mental model. γ requires relearning the deliberation map.

#### Option δ: Some other restructure entirely (open-ended)

You may identify a different structure that better reflects the research findings. We are not constrained to α/β/γ.

### Claude's recommendation

**Option β** — keep the 4-deliberation backbone, broaden the questions to reflect research findings, add Round 1.5.

### Claude's reasoning

1. **β preserves the option to evolve toward γ but γ precludes starting from familiar shapes.** If during D1 we discover that the boundary catalog deserves dedicated treatment, we can spawn it as a sub-deliberation. We can't easily reverse from γ.

2. **The performance budget gap is real and load-bearing.** Skipping Round 1.5 (the difference between α and β) means the gap stays unaddressed. The visx situation repeats — debates without measurable targets become aesthetic.

3. **γ's intellectual honesty is offset by practical risk.** The meta-architectural risk is the most worrying — D1 in γ might produce abstract output that doesn't resolve to concrete decision points, because "what boundaries should exist?" is harder to deliberate than "Python vs Rust given the boundary."

4. **β honors the research findings without throwing away the original plan structure.** The questions get broader to absorb what research surfaced, but the deliberation handles stay familiar.

### Where Claude is uncertain

- **Maybe γ would force better thinking** by demanding boundary clarity upfront. β might let D1 sneak by without rigorously cataloging boundaries. There is a real risk that without γ's explicit "boundary catalog" framing, the convergent insight gets diluted.
- **Claude might be too attached to "preserve the user's mental model"** and not attached enough to "let the research findings reshape the work." If the substance points to γ, ergonomic considerations shouldn't override it.
- **The choice of α vs β vs γ is structural, not substantive.** All three can produce good deliberations if executed well. The question is which structure makes good execution more likely.

### What Claude wants from you on Decision 1

1. Read the 5 research files and verify (or push back on) the convergent boundary insight synthesis.
2. Assess whether Claude's reasoning for β over γ is sound, or whether γ is being dismissed for the wrong reasons (ergonomics, momentum, fear of restructuring).
3. Consider whether there's an option δ — some other structure that better reflects what the research found.
4. Make a recommendation: β, γ, δ, or some qualified hybrid. If hybrid, specify which elements of each.

---

## Decision 2: Round 1.5 Performance Budget Research

### The decision

Should the initiative run a focused Round 1.5 research call on performance budgets before Wave 2 deliberations begin?

### Options considered

#### Alt A: Skip Round 1.5, fold performance budget definition into D2

D2 (visualization architecture) covers BOTH visualization architecture choice AND performance target definition in one deliberation.

**Pros:** Faster. No additional wave.
**Cons:** Overloads D2. Performance target definition is research work (fact-finding, precedent gathering, target proposal) — not deliberation work (choosing between options). Bundling them risks D2 hand-waving at "the right targets are roughly..." without rigor.

#### Alt B: Treat performance budget as its own full deliberation (D5)

Add a fifth deliberation for performance budgets.

**Pros:** Gives it appropriate weight as a load-bearing concern.
**Cons:** Performance budget definition isn't deliberation-shaped. There aren't competing options to choose between. There's "what does the vision imply, what's measurable, what methodology validates against targets." That's research/proposal work, not choice-between-options.

#### Alt C: Defer performance budget to a post-initiative phase

Skip it entirely; address performance budgets after the initiative completes.

**Pros:** Removes from initiative scope.
**Cons:** Defeats the audit findings. Without performance budgets, the initiative produces philosophical recommendations the team can't validate. Repeats the visx-failure pattern.

#### Alt D (Claude's recommendation): Run Round 1.5 as focused research before Wave 2

A small, narrow Codex call producing `research/06-performance-budget-definition.md`. Investigates worst-plausible views, target metrics, measurement methodology. Output explicitly framed as "proposed targets + methodology" not "validated targets."

**Pros:** Right type of work for the question. Unblocks downstream deliberations. Small (~50K context, 150-250 lines output). Methodology supports it (5/5 cluster is warranted iteration).
**Cons:** One additional wall-clock step. Risk it produces more provisional positions instead of crisp targets. Performance budgets stay aspirational without actual benchmarking.

### Claude's recommendation

**Alt D** — run Round 1.5.

### Claude's reasoning

1. **It's the right type of work.** Performance budget definition is fundamentally research (survey vision implications, gather precedents, propose measurable targets, define methodology). It doesn't have option-space-shaped competition between alternatives.

2. **It unblocks downstream deliberations.** If D2 has measurable targets ("brush-to-update <100ms across 6 strategies × 4 linked panels at 1 Hz update cadence"), then visx vs Canvas vs hybrid becomes empirically resolvable rather than philosophical.

3. **It's small.** Estimated context 50K, output 150-250 lines. Fast and cheap relative to unblocking value.

4. **The methodology supports it.** RESEARCH-PRINCIPLES.md § Iteration Norms: "Round 1 findings reveal framing problems or reframings that change what subsequent work should investigate." The performance budget cluster across 5 files is exactly that.

### Where Claude is uncertain

- **The Round 1.5 output may itself produce gray areas.** "What worst-plausible view should we benchmark?" might not have a confident answer. Round 1.5 could produce another set of provisional positions instead of crisp targets, in which case its unblocking value diminishes.
- **Performance budgets without actual benchmarking stay aspirational.** The research can propose targets; only running benchmarks validates them. Round 1.5 should explicitly produce "proposed targets + methodology" rather than claiming validated targets.
- **There's a small risk it duplicates work the deliberations would do anyway.** If D2 ends up regenerating the budget thinking in its own context, Round 1.5 was wasted.

### What Claude wants from you on Decision 2

1. Verify (or push back on) that performance budgets are the universal blocker the research files claim.
2. Assess whether Round 1.5 is the right shape for the work, or whether one of the alternatives (A/B/C) is better.
3. If Round 1.5, propose any refinements to its scope or methodology.

---

## Decision 3: D1 Scope — Absorb R5 or Split

### The decision

Should D1 (computational backend strategy, broadened) also address regulation typing flow through the execution pipeline, or should regulation typing get its own deliberation (D5)?

### Background

R5 was scoped as standalone research on "multi-regulation typing strategies" — how to type the regulation preset schema. Originally expected to be independent of compute/streaming research.

**R5 surfaced an unplanned coupling.** From `research/05-multi-regulation-typing.md` § 9 "Gray Areas Encountered" → "Gray area 1: execution semantics live partly outside the preset schema":

> "typing only the preset document would leave `sim-core` still hardcoded to 2026 electrical limits, which would make any multi-era typing answer incomplete at the execution boundary. Implication: regulation typing and execution-contract design are coupled earlier than the call framing suggested."

The current state: regulation semantics are split between domain preset files, `apps/local-api` extraction code, AND hardcoded `sim-core` constants. Multi-regulation typing alone won't enable multi-era execution.

### Options considered

#### Alt A: Split — D1 covers compute backend, D5 covers regulation typing

Two separate deliberations. D1 picks compute architecture without addressing regulation flow. D5 picks regulation typing without addressing execution context. They coordinate ad-hoc.

**Pros:** Each deliberation stays focused on one concern. Easier to review separately.
**Cons:** Splits a discovered coupling. The integration question (how does regulation typing flow through whichever compute backend is chosen?) IS the actual decision, and splitting ducks it.

#### Alt B: Defer regulation typing to a later phase entirely

Remove from initiative scope. Address after the initiative completes.

**Pros:** D1 stays simple.
**Cons:** Audit Finding #6 explicitly flagged regulation typing as HIGH-severity. Deferring leaves the gap. Effectively retreats from the multi-regulation vision commitment.

#### Alt C (Claude's recommendation): Fold regulation typing into D1's broadened scope

D1 becomes "Backend boundary architecture including regulation flow." It addresses compute language strategy + transport protocol + how regulation semantics flow through the execution pipeline. Consumes R1 + R4 + R5.

**Pros:** Honors the discovered coupling. Forces the integration question to be addressed directly. R1+R4+R5 in one deliberation produces ~120-150K context, manageable in one Codex call.
**Cons:** D1 might become too big to draft well. Risk of overload. The R5 author might think regulation typing deserves its own focused treatment regardless of the coupling.

### Claude's recommendation

**Alt C** — fold R5 into D1's broadened scope.

### Claude's reasoning

1. **R5 discovered the coupling, not the original plan.** The methodology says findings should reshape structure. The finding is that regulation typing is not actually independent of execution architecture.

2. **D1's broadened scope already addresses "how does compute consume domain data and produce typed artifacts."** Regulation values are exactly that kind of domain data. Folding R5 in makes D1 cover the full integration question.

3. **Splitting risks decision gaps.** If D1 picks "Python sidecar with JSON-RPC" and D5 picks "Zod discriminated union with three independent axes," who reconciles the integration? The integration is the actual decision.

4. **D1's overload risk is manageable.** R1+R4+R5 combined context probably 120-150K, well under the 200K target.

### Where Claude is uncertain

- **D1's overload risk is real.** R1 and R4 already make D1 substantial. Adding R5 means D1 covers compute language + transport protocol + regulation flow + execution boundary semantics in one deliberation. If the deliberation balloons past ~600 lines or starts losing coherence, splitting becomes pragmatic.
- **The R5 author chose to flag the coupling rather than restructure their own work around it.** They might think regulation typing deserves its own focused treatment regardless of the coupling.
- **D1 absorbing too much creates boundary diffusion.** D2/D3/D4 might unconsciously avoid topics that "feel like D1's territory," leading to gaps in their own coverage.

### What Claude wants from you on Decision 3

1. Read R5's "Gray Areas Encountered" and "Dependencies and Relations" sections directly. Assess whether the coupling discovery is as load-bearing as Claude claims.
2. Consider whether D1's combined scope (R1+R4+R5) is genuinely manageable, or whether it's the kind of overloading that produces incoherent deliberations.
3. Recommend: fold (Alt C), split (Alt A), or some other structure.

---

## Things Claude Is NOT Asking You to Review

These are decisions Claude has made with reasonable confidence; they're context for your review of the three above but not themselves under review:

1. **Wave 2b iterative drafting (D2 → D3 → optional D2 revision).** R2 and R3 confirmed substantial bidirectional coupling. The plan to iteratively draft them across sequential calls (rather than batching them in one call or merging them into one deliberation) was already settled. R2 ↔ R3 cross-references in the research files vindicate this choice.

2. **Methodological framing of deliberations.** Each deliberation will permit recommendation, provisional recommendation with closure criteria, deferral with closure criteria, or reframing as valid outcomes (per RESEARCH-PRINCIPLES.md § Required Output Sections for deliberation files).

3. **Per-call reasoning mode.** Research uses `high` (tool-heavy), deliberations use `xhigh` (writing-heavy), synthesis uses `high`. This was tested in Wave 1 and held up.

4. **Orchestrator handoff template revision.** Claude noted that the original handoff was over-conservative in forbidding orchestrator preparatory thinking at review gates. This is a methodological learning for future orchestrator handoffs but doesn't affect Wave 2 (which is being authored by Claude in this session, not via orchestrator).

If you think any of these "not under review" decisions are wrong, you're welcome to flag it — but the three structural decisions above are the primary review focus.

---

## Format for Your Response

Append your review at the bottom of this file in a new section titled `## Codex Review (2026-04-11)`. Use heredoc to write to this exact path:

`/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/vision-alignment-2026-04/wave-2-structure-review.md`

Use cat with append redirect, NOT cat with overwrite — preserve everything above. Example:

```bash
cat >> .planning/initiatives/vision-alignment-2026-04/wave-2-structure-review.md <<'REVIEW_EOF'

## Codex Review (2026-04-11)

[your review content]
REVIEW_EOF
```

Your review should cover, at minimum:

1. **Synthesis verification**: did Wave 1 actually surface the convergent boundary insight Claude described, or is Claude over-reading? Cite specific sections from the research files.

2. **Decision 1 analysis**: assess α / β / γ on their merits. Recommend one (or a hybrid). Be willing to disagree with Claude's choice — the value of cross-model review is independent perspective, not validation.

3. **Decision 2 analysis**: should Round 1.5 happen? What scope and methodology if yes?

4. **Decision 3 analysis**: should D1 absorb R5, split as D5, or something else?

5. **Anything else**: gaps, blind spots, methodological concerns, or cross-cutting observations Claude missed. The review's value is partly in finding things Claude didn't think to ask about.

**Required: cite the research files by file path and section.** Generic claims without grounding in the actual research outputs are not useful.

**Required: respect RESEARCH-PRINCIPLES.md.** You are operating under the same methodological framework. Terrain mapping mode where appropriate. Three-response gray area framework where you encounter uncertainty. Confidence calibration. Honest deferral allowed.

**Format expectations:**
- Length: substantive, but focused. Probably 300-600 lines.
- Tone: rigorous research collaborator, not salesperson. Push back where warranted.
- Structure: address each decision in order. Then add cross-cutting observations.
- Confidence markers: distinguish known/likely/plausible/speculative/unknown throughout.

**What Claude does NOT want:**
- Polite agreement that doesn't engage with the substance
- Generic methodological commentary divorced from the actual research findings
- A "third way" that's just splitting differences without substantive justification
- Reviewing the things marked "NOT under review" extensively at the expense of the three actual decisions

---

# === Codex Review Section (to be appended below this line) ===

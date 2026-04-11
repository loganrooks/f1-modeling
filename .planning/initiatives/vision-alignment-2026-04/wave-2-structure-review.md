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

## Codex Review (2026-04-11)

Read set complete: `RESEARCH-PRINCIPLES.md`, `VISION.md`, the audit response, initiative scaffolding, and all five Wave 1 research files.

Overall judgment:

- Claude's core convergence read is directionally right. Wave 1 did surface a repeated pattern of separating durable identity/contracts from swappable implementations or body formats.
- Two parts are overstated.
- First, the convergence is not a single homogeneous "boundary catalog" in the same sense across all five files. `R1`, `R2`, `R3`, and `R4` are mostly contract/substrate questions; `R5` is more a semantic-axis/ontology question.
- Second, the "performance budget is the universal blocker" claim is strongly evidenced in `R1`, `R2`, and `R4`, but not equally in `R3` and `R5`. That matters for sequencing.

### 1. Synthesis verification

Known:

- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`, `## 4. Reframing`, explicitly moves from language choice to "what boundary should own simulation execution, artifacts, and progress," and `## 13. Provisional Position` says the serious option space is "establish an async transport-neutral backend contract, then keep multiple backend languages viable behind it."
- `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`, `## 4. Reframing`, moves from transport choice to "define a transport-neutral job protocol," and `## 13. Provisional Position` repeats that the first durable move is typed event unions plus fetchable artifacts rather than "install WebSocket."
- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`, `## Reframing`, moves from chart-library choice to substrate design, and `## Provisional Position` says the durable move is a renderer-agnostic surface with typed artifacts, shared interaction state, and stable annotation anchors, with multiple renderer families underneath.
- `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md`, `## Reframing`, moves from file-format choice to "content graph and artifact-binding model," and `## Provisional Position` says lesson identity, prerequisites, role tags, artifact bindings, and overlay semantics should be first-class while body format stays swappable.
- `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`, `## 4. Reframing`, moves from "type the preset JSON" to "model regulation identity, capability presence, and schema evolution," and `## 13. Provisional Position` says the resilient design space is semantic family identity plus document schema version plus explicit capability modeling.

Likely:

- Claude is not over-reading the broad convergence. The five files really do refuse the original "pick one implementation artifact" framing.
- The strongest common pattern is not merely "hybrid family wins." It is "separate the thing that must remain stable from the thing that may vary." In `R1` that stable thing is the backend contract; in `R4` the job/event protocol; in `R2` the renderer-agnostic interaction/annotation substrate; in `R3` the lesson/artifact graph; in `R5` the regulation identity/version/capability model.

Important nuance:

- `R5` is only partially a boundary file. It is mostly a domain-ontology file. Treating it as the same kind of object as the renderer or job protocol boundaries will blur a real distinction between infrastructure contracts and semantic models. `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`, `## 6. Option Space` and `## 13. Provisional Position`, are about organizing axes, migrations, and comparability semantics more than "multiple implementations behind one interface."
- The implied boundary catalog is therefore a useful synthesis artifact, but it is still a synthesis artifact. It should not be mistaken for something Wave 1 itself already closed with equal strength across all items.

One missing item in Claude's boundary list:

- A typed artifact/provenance contract is more central than the current synthesis makes explicit.
- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`, `## 4. Reframing`, includes artifacts in the backend boundary.
- `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`, `## 6. Protocol Design Space`, separates progress events from durable artifacts and makes artifact fetch/replay first-class.
- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`, `## Provisional Position`, explicitly wants typed artifacts under the renderer surface.
- `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md`, `## Integration patterns with engineering visualization`, wants lessons to bind to artifact-relative anchors and view recipes.
- That is not just a sub-detail of the job protocol. It is a cross-cutting contract that D1, D2, and D3 all depend on.

Performance-budget nuance:

- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`, `## Performance budget methodology`, `## Gray Areas Encountered`, and `## Unresolved Questions`, makes performance budgets a direct blocker to renderer closure.
- `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`, `## 9. Gray Areas Encountered` and `## 13. Provisional Position`, makes update rates, concurrency, and failure semantics explicit blockers to streaming closure.
- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`, `## 13. Provisional Position` and `## 15. Unresolved Questions`, says backend choice remains underdetermined without explicit performance budgets and a clearer Phase 5 problem statement.
- `R3` does not make performance budgets a primary unresolved question. Its blockers are concept graph, bindings, authoring, and validation.
- `R5` does not make performance budgets a primary blocker either. Its blockers are semantic axis choice, schema evolution, and execution coupling.
- So the "universal blocker" formulation should be tightened to "cross-cutting blocker for compute, streaming, and visualization closure."

Working conclusion:

- High confidence: the convergence on contract/identity separation is real.
- Medium confidence: Claude's seven-boundary catalog is close to the right synthesis, but it should be treated as a guide for prompt authorship, not as a completed deliberation result.
- Medium confidence: the artifact/provenance contract should be elevated explicitly.

### 2. Decision 1: Wave 2 structure

Assessment of `Option α`:

- `Option α` is the weakest of the named options.
- It keeps the visible scaffold but leaves the most repeatedly evidenced unresolved variable untouched. `R2` and `R4` explicitly say architecture remains underdetermined without explicit budgets, and `R1` also conditions closure on them.
- It also risks letting each deliberation re-derive the boundary insight locally instead of consuming a shared synthesis. That is not fatal, but it is wasted motion.

Assessment of `Option β`:

- `Option β` is substantially better than `α`.
- It matches the iteration norms in `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`, `## Iteration Norms`: a clustered unresolved question is a valid reason for a targeted follow-up round.
- It also avoids the main failure mode of `γ`: forcing a meta-architectural closure question before the implementation pressures are in view.

Assessment of `Option γ`:

- `Option γ` is more honest about what Wave 1 discovered, but I do not think it is the right unit of closure.
- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`, `## 4. Reframing`, and `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`, `## 4. Reframing`, do not say "first settle the abstract boundary, then implementation choice is downstream." They say the migration shape and the contract shape are coupled.
- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md` and `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md` show a similar coupling. Annotation anchors, shared interaction state, and view recipes are not abstractly separable from the kinds of renderers and surfaces the system expects to host.
- The risk is not only "xhigh Codex may ramble." The deeper risk is that `γ` homogenizes different kinds of questions. A renderer contract, a job protocol, a lesson graph, and a regulation ontology are not all the same kind of thing.

Where Claude is right about `γ`:

- The fear of dilution under `β` is real.
- If no explicit synthesis artifact crystallizes the cross-file convergence, `β` can devolve into four prompts that each partially rediscover the same pattern.

Where Claude is slightly under-reading the need for restructuring:

- Preserving the original mental model should not be the decisive argument.
- The better argument against `γ` is not ergonomics. It is that a boundary catalog is better treated as synthesis input than as a standalone closure attempt.

Recommended structure: `Option δ`

- Keep `β`'s Round 1.5.
- Do not make the boundary catalog its own deliberation.
- Before Wave 2 prompt drafting, author a short cross-cutting synthesis artifact, call it a boundary/contract memo if you want, that names the contracts Wave 1 actually surfaced and marks which later deliberation owns closure for each.
- This memo is not a recommendation step. It is a prompt-authoring input and traceability device.

Why this is not a fake middle:

- It preserves `β`'s practical strength.
- It captures `γ`'s best insight, which is that the convergent pattern should be made explicit once, not re-derived in every deliberation.
- It avoids turning that insight into a separate meta-decision with weak closure criteria.

Suggested contents of the boundary/contract memo:

- Compute execution boundary.
- Job/event protocol.
- Artifact/provenance contract.
- Renderer contract.
- Shared interaction state contract.
- Annotation-anchor / view-recipe contract.
- Lesson graph / artifact-binding contract.
- Regulation identity / version / capability contract.

How this should affect Wave 2 prompt authorship:

- Each deliberation prompt should say which of those contracts it is allowed to close, which it must only consume, and which open questions it inherits.
- That directly operationalizes the methodology's dependencies-and-relations requirement from `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`, `## Trajectory and Path Documentation` and `## Required Output Sections`.
- It also fits `.planning/initiatives/vision-alignment-2026-04/README.md`, `## Methodological Foundation`, and `.planning/initiatives/vision-alignment-2026-04/PLAN.md`, `## This Plan Is Scaffolding, Not an Execution Contract`, both of which explicitly permit structural revision when research changes the right question.

My recommendation if choosing strictly among `α / β / γ`:

- Choose `β`, not `γ`.
- But choose `β` only in an augmented form where the convergence is crystallized into a shared synthesis artifact first.

My actual recommendation:

- `δ = β + explicit boundary/contract memo + modified treatment of R5`.
- That likely means Wave 2 is not exactly the original 4-deliberation shape anymore. That is methodologically acceptable; both `README.md` and `PLAN.md` explicitly say the structure is scaffolding, not contract.

Concrete structural recommendation:

- Round 1.5: performance budget / performance-envelope research.
- D1: compute execution boundary, job protocol, artifact envelope, and regulation-flow-through-execution contract.
- D2 / D3: iterative visualization and educational deliberations as already planned.
- D5: regulation semantic model and comparability semantics, unless the user deliberately wants to compress it into D1.
- D4: long-horizon roadmap synthesis after the above.

Confidence:

- Medium-high that `β` is better than `γ`.
- Medium that the best actual structure is a `δ` hybrid with an added D5 or an explicitly reserved regulation follow-on.
- Low that the original four-handles-only structure is the best fit after what Wave 1 actually found.

### 3. Decision 2: Round 1.5 performance-budget research

Answer:

- Yes, a Round 1.5 should happen.
- But it should be justified more precisely than "5/5 files say so."

Why yes:

- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`, `## Performance budget methodology`, is explicit that renderer choice is underdetermined without visible strategies, linked panels, latency, cadence, initial render time, memory ceiling, and degradation policy.
- `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`, `## 9. Gray Areas Encountered`, explicitly marks performance-budget definition as a revisit-later gray area because streaming architecture is underdetermined without target update rates and acceptable completion latencies.
- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`, `## 13. Provisional Position` and `## 15. Unresolved Questions`, keeps compute-backend closure provisional in part because performance budgets and the actual optimization/problem cadence are still unclear.

Why not `Alt A`:

- `Alt A` mixes research-shaped work with deliberation-shaped work.
- The methodology in `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`, `## Research Modes`, is explicit about not silently drifting from terrain mapping / fact-finding into solution evaluation.
- D2 is already a closure attempt around visualization architecture. If it also has to invent the performance envelope that adjudicates the option space, it will be deciding and defining its own criteria at the same time.

Why not `Alt B`:

- Claude is right that budget definition is not naturally a pick-among-alternatives question.
- The real deliverable is a target envelope plus measurement method plus degradation rules.

Why not `Alt C`:

- Deferral would repeat exactly the audit failure mode documented in `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`, `### Finding 10: Performance budget (novel)`.
- It would also leave D1 and D2 arguing about architecture with no shared latency or throughput frame.

Refinement to Claude's framing:

- Do not frame Round 1.5 as a pure visualization research task.
- The evidence says this is a platform performance-envelope task with at least two coupled strata.
- UI/rendering envelope.
- Job/compute envelope.

What the Round 1.5 output should contain:

- A worst-plausible scenario catalog for Phase 4 and near-horizon Phase 4.1.
- A proposed interaction/render envelope.
- visible strategies per workspace.
- linked panels.
- hover-to-tooltip latency.
- brush-to-linked-update latency.
- initial render after artifact receipt.
- live update cadence.
- memory/session ceiling.
- degradation policy.
- A proposed job/compute envelope.
- submit-to-ack latency.
- submit-to-first-progress-event latency.
- batch completion targets for representative multi-strategy workloads.
- artifact-ready latency for partial results.
- cancellation acknowledgement and terminal-event timing.
- replay/reconnect assumptions if applicable.
- Measurement methodology.
- reference hardware.
- artifact shapes.
- synthetic vs recorded datasets.
- instrumentation points.
- what counts as pass/fail vs provisional.
- Explicit unknowns and closure criteria if the round cannot produce crisp numbers.

Why this wider scope is warranted:

- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md` treats live update cadence and partial rerender cost as first-class.
- `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md` treats event cadence, queue depth, and failure/recovery semantics as first-class.
- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md` ties backend choice to workload cadence and problem class.
- A budget that only measures chart redraw misses half the architectural forcing function.

Caution:

- The output must be explicitly "proposed envelopes + measurement method," not validated truth.
- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`, `## Gray Areas Encountered`, is already clear that the repo lacks a benchmark harness and true crossover points.
- If Round 1.5 cannot honestly produce more than bounded ranges and prototype scenes, that is still a valid and useful output under `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`, `## Honest uncertainty` and `## Iteration Norms`.

Naming refinement:

- The existing proposed filename `research/06-performance-budget-definition.md` is acceptable.
- But the document should speak in terms of provisional envelopes and benchmark scenes, not pretend it is defining final validated budgets.

Sequencing nuance:

- The direct blockers are D1 and D2 more than D3 or R5-style domain ontology.
- I still support running Round 1.5 before Wave 2, because it is small and the shared language will help prompt drafting.
- But rhetorically, it should be described as unblocking compute/streaming/viz closure, not unblocking the entire initiative equally.

Confidence:

- High that some Round 1.5 is warranted.
- Medium-high that research, not deliberation, is the right shape.
- Medium that one compact file can cover both UI and job/compute envelopes cleanly.
- Unknown whether the output will land on crisp numbers or ranges. That uncertainty is acceptable.

### 4. Decision 3: should D1 absorb R5?

Short answer:

- Not as written in `Alt C`.
- The execution-coupling slice of `R5` should be folded into D1.
- The semantic-model slice of `R5` should remain a distinct deliberation or at minimum a clearly reserved follow-on decision.

Why the coupling is real:

- `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`, `## 9. Gray area 1: execution semantics live partly outside the preset schema`, is unambiguous that typing only the preset document leaves multi-era execution incomplete because `sim-core` still hardcodes 2026 electrical assumptions.
- `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`, `## 10. Scope Expansion Notes`, says ignoring that split would produce a storage-only answer that looks complete but is not implementable.
- That means D1 cannot ignore regulation flow through the execution pipeline.

Why full absorption is still the wrong move:

- `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`, `## 13. Provisional Position`, says the question is not ready to close on a winning schema design; it is ready for deliberation on the primary organizing axis: era-family-first vs capability-first, with schema versioning independent.
- That is not the same decision as compute language / backend migration / job protocol.
- `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`, `## 12. Dependencies and Relations`, explicitly says it is mostly independent from compute-backend and streaming research at the initiative level, while also naming the preset-to-sim-core contract as the coupling point.
- So the file itself argues for partial coupling, not total merger.

Why `Alt A` is also insufficient:

- A clean split where D1 ignores regulation flow and D5 later handles typing would miss the coupling `R5` discovered.
- If D1 chooses a backend request/artifact model without deciding where regulation semantics are canonicalized and how family/version/capability information crosses that boundary, the later regulation decision will be constrained silently.

Recommended alternative:

- D1 should include a regulation-flow contract decision.
- A later D5 should handle regulation semantic architecture.

What belongs in D1:

- Where regulation documents are canonicalized relative to the compute boundary.
- What typed regulation information crosses the backend request boundary.
- Whether run snapshots store raw documents, canonicalized runtime form, or both.
- How artifacts and provenance reference regulation family and schema version.
- Which execution semantics must stop being hardcoded in `sim-core` to make multi-era execution real.

What belongs in D5:

- Era-family-first vs capability-first vs hybrid runtime organization.
- Schema-version handling and migration posture.
- Override model.
- Cross-era comparability semantics and non-comparable states.
- Stable semantic identifiers if needed.

Why this split is structurally cleaner:

- D1 remains about execution architecture.
- D5 remains about domain semantic architecture.
- The coupling is handled explicitly at the contract boundary rather than by throwing the whole domain-typing problem into the compute deliberation.

Why I do not buy the context-size-is-manageable argument as the main criterion:

- The overload risk is conceptual, not token-budget-based.
- `R1 + R4` already define a substantial option space: compute family, job protocol, transport implications, queue semantics, artifact handling, cancellation, replay.
- Adding full `R5` turns D1 into a mixed deliberation about infrastructure, persistence semantics, domain ontology, and comparability rules.
- Those are related, but not the same closure question.

Secondary consequence for D2 and D3:

- Even if D5 is separate, D2 and D3 should receive one R5-derived open constraint up front.
- Cross-era comparison views and lessons may need explicit not-comparable, derived-comparable, or family-specific states.
- That comes directly from `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`, `## 9. Gray area 2: cross-era comparability ontology`, and should not wait until roadmap synthesis.

If forced to choose strictly among `Alt A` and `Alt C`:

- I would choose a modified `Alt A` over `Alt C`.
- But it must be an explicit split with a D1 contract handshake, not coordinate ad hoc.

My actual recommendation:

- Neither `Alt A` nor `Alt C` as written.
- Use `Alt D`: D1 absorbs the regulation-execution contract; a smaller D5 closes the semantic model.

Confidence:

- High that the coupling is real and load-bearing.
- Medium-high that full fold into D1 is too much.
- Medium that a smaller D5 is worth the extra structural complexity.
- Low only on exact placement of D5 in the wave order; multiple sequences could work if the prompt contracts are explicit.

### 5. Cross-cutting observations Claude did not foreground enough

1. Artifact contract ownership needs to be explicit.

- This is the main hidden cross-lane dependency I would not leave implicit.
- `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`, `## 6. Protocol Design Space`, distinguishes live events from durable artifacts.
- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`, `## Provisional Position`, wants typed artifacts underneath renderer choice.
- `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md`, `## Integration patterns with engineering visualization`, binds lessons to artifact-relative anchors and view recipes.
- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`, `## 4. Reframing`, includes artifacts in the compute boundary question.
- If no single deliberation owns artifact identity/provenance/schema stability, D1, D2, and D3 can all make incompatible local assumptions.

2. The boundary catalog should distinguish contract boundaries from semantic models.

- Compute boundary, job protocol, renderer contract, interaction contract, and annotation-anchor contract are contract-ish.
- Lesson graph and regulation identity/version/capability are closer to semantic models or ontologies.
- That distinction matters because closure criteria differ.
- Contract questions can often close provisionally on interface shape.
- Ontology questions often close on organizing axes and explicit non-comparability rules, not just interfaces.

3. Round 1.5 failure is a legitimate outcome.

- If the performance round cannot do better than ranges, benchmark scenes, and instrumentation plans, that is still useful.
- Do not let the existence of Round 1.5 create pressure to manufacture exact budgets.
- `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`, `## Honest uncertainty`, `## Calibrated commitment`, and `## Iteration Norms`, explicitly support provisional output and deferral.

4. D3 is less directly blocked by performance budgets than D1 and D2.

- This is not an argument against Round 1.5.
- It is an argument against narrating Round 1.5 as if the entire initiative is equally frozen without it.
- The evidence base is uneven. The process language should reflect that.

5. R5's comparability gray area is not just a future-data-model question.

- It will shape visualization semantics and educational honesty.
- `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`, `## 9. Gray area 2`, `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`, `## F1-specific demand map`, and `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md`, `## Integration patterns with engineering visualization`, together imply future views and lessons may need explicit non-equivalence affordances.
- If D2 later designs comparison surfaces assuming all eras collapse into the same axis system, the project will quietly reintroduce false clarity.

6. The strongest Wave 1 convergence is do-not-decide-at-the-label level yet.

- That is methodologically important.
- The prompt authors should guard against slipping back into label-level closure because it is easier to write.
- `R1` is not really a Python-vs-Rust prompt.
- `R2` is not really a visx-vs-Canvas prompt.
- `R3` is not really an MDX-vs-notebook prompt.
- `R5` is not really a discriminated-union-vs-versioning prompt.
- The deliberations need to preserve that deeper unit of analysis.

### 6. Recommended path in one place

Decision 1:

- Recommend `δ`: keep `β`'s Round 1.5, reject `γ` as a standalone meta-deliberation, and write a short boundary/contract memo before Wave 2 prompt drafting.
- If constrained to the named options only, choose a qualified `β`.

Decision 2:

- Recommend `Alt D`.
- Scope it as provisional performance envelopes plus benchmark scenes plus measurement methodology, covering both UI/rendering and job/compute service levels.

Decision 3:

- Recommend some other structure.
- Fold R5's execution-boundary implications into D1.
- Keep the semantic-model decision as a separate D5 or explicit reserved follow-on.

Net effect on Wave 2:

- The initiative probably wants 5 real decision surfaces, not 4, unless the user deliberately accepts heavier D1 compression.
- The extra surface is not busywork. It exists because Wave 1 found a domain-ontology question in `R5` that is coupled to execution but not reducible to it.

Final confidence read:

- High confidence that the current four-deliberation scaffold needs at least a small structural adjustment.
- High confidence that a performance follow-up round is justified.
- Medium confidence that the cleanest adjustment is a D1-contract-plus-D5-semantic split rather than full fold.
- Medium confidence that the boundary memo will materially improve prompt quality without creating new methodological risk.

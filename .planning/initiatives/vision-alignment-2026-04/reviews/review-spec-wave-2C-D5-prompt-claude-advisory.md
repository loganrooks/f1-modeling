# Claude Advisory Review — `spec-wave-2C-D5-deliberation-regulation-semantic-model.md` (D5 Prompt Draft)

**Reviewer:** Claude Opus 4.6 (1M)
**Review date:** 2026-04-11
**Review type:** Advisory — user-initiated, not a formal audit request under `audit/`
**Subject:** `.planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2C-D5-deliberation-regulation-semantic-model.md` (as committed in `3471d5f`)
**Status of subject:** Drafted and committed; **not yet launched** as of review time (verified — no `04-*.md` files in deliberations directory; Codex sessions only reference the filename in orchestrator context, not as exec input)
**Context of review:** User asked for a Claude second opinion on the D5 prompt before launch, continuing the advisory use pattern documented in `handoff-claude-fallback-session.md` and applied to the D3 prompt (review file `review-spec-wave-2B-ii-D3-prompt-claude-advisory.md`). This is not a formal cross-model audit and does not replace Codex's judgment — it is input for the Codex orchestrator to consider when deciding whether to amend the prompt before launching.

---

## Bottom Line

**Strong prompt. Run-ready. No substantive fixes required, though one minor calibration nudge is worth considering.** The D5 prompt is well-structured, correctly protects D1/D2/D3 from being re-opened (an important guardrail since D5 runs after three prior deliberations that have accepted closures), explicitly flags comparability semantics as "the hardest downstream responsibility," handles the contract-vs-ontology distinction at the right level, and lists the right four cross-cutting constraints with an adjacent-responsibility handling for CC5/6/7. My one non-blocking observation concerns how strongly the prompt guards against ontology closures drifting into contract-shaped closures (writing TypeScript types as the closure unit instead of closing on axes + rules). This is a real risk for ontology deliberations, but Codex has shown strong pattern-matching on the label-trap in prior rounds, so an explicit amendment is optional rather than required.

Confidence: **high** on the structural/methodology assessment; **medium-high** on the substantive content (I cannot predict exactly how Codex xhigh will calibrate ontology closure depth, only that the risk of contract-shaped drift is real and non-zero).

---

## Structural Checklist

All structural boxes checked against the D2/D3 prompt patterns and `RESEARCH-PRINCIPLES.md`.

| Criterion | Status | Notes |
|---|---|---|
| Header metadata (wave, model, effort, question type, closes, consumes, feeds) | ✓ Complete | Question type correctly named "Ontology" (not "ontology + contract" — D5 is pure ontology) |
| Consumes D1 + D2 + D3 + R5 + boundary memo as hard constraints | ✓ | D3 now in the consumes list since D3 has been accepted |
| "What You Are NOT Closing" explicit protection section | ✓ | Names D1 execution-flow, D1 artifact/provenance, D2 renderer/interaction/anchor, D3 lesson ontology and content-side binding, plus package APIs / Zod syntax / file placement. This is a strong guardrail that didn't appear in the D2 or D3 prompts and is specifically important for D5 because it runs latest. |
| Contract-vs-ontology distinction named | ✓ | "O2 is ontology-shaped, not contract-shaped" in required reading item 2 |
| Label-trap explicitly forbidden with specific wrong closures | ✓ | "Not 'discriminated union wins' / 'capability modules win' / 'schema version is the main key'" — three concrete wrong-shape closures named |
| Cross-cutting constraints 1-4 listed (D5 inherits four, not all seven) | ✓ | Matches the boundary memo's claim that D5 inherits "performance, comparability, honesty constraints, label-trap" |
| Adjacent handling for CC5/6/7 | ✓ | "Adjacent downstream constraint" section — D5 must output states D2/D3 can actually present (compact, explicit, stable) without D5 owning accessibility/thin-client/UI-visible-honesty directly |
| Required output sections match D2/D3 format | ✓ | 13 standard + 4 D5-specific subsections |
| D5-specific subsections (D5.A-D) parallel to D2.A-D / D3.A-D | ✓ | Axis/runtime shape, schema versioning, comparability/applicability, override model + D1 handshake |
| Decision Record template present and empty | ✓ | 5-entry template with D5.C `Downstream implication for D2/D3:` field and D5.D `Constraint on D1 / Phase 4 planning:` field — well-targeted for D5's cross-deliberation surface |
| Decision anchor companion file required | ✓ | `04-decision-anchor.md` with dense paragraph format mirroring 01/02/03 anchors |
| Output file paths correct | ✓ | `deliberations/04-regulation-semantic-model.md` (fourth deliberation file, closing D5 — numbering tracks file order, deliberation letters track conceptual sequence) |
| Completion signal structured for orchestrator parsing | ✓ | Fields for each D5.A-D disposition + D1/D2/D3/memo push-back |
| Deferral and reframing explicitly permitted | ✓ | In Reminders |
| `DESN-01`, `VISU-03`, `VISU-04`, `VAL-01`, `EDU-01/02/03` references | ✓ | All verified present in `REQUIREMENTS.md`: DESN-01 at line 139 (Phase 8), VISU-03 at line 25 (Phase 4), VISU-04 at line 27 (Phase 5), VAL-01 at line 132 (Phase 7), EDU-01/02/03 at lines 101/103/105 (Phase 4/5/4). All are real. Codex will find them. |
| `review-wave-2-structure-decisions.md` reference for R5 split rationale | ✓ | Item 11 in required reading — correctly points Codex at the Codex GPT-5.4 xhigh review that produced the D1/D5 split decision |

**All structural boxes checked.** The prompt reflects lessons from the D2 and D3 runs and adds specific D5-appropriate guardrails that weren't needed before.

---

## Confirmations — Good Calls Worth Preserving

These are things the prompt got right that Codex should not revise away if it amends the prompt.

1. **Explicit "What You Are NOT Closing" section.** This is new to the D5 prompt (D2 and D3 handled this implicitly through "consume as hard constraint" language). D5 runs after three prior deliberations that have accepted closures, so the risk of accidental re-opening is higher than for D2 or D3. Making the protection explicit — and adding *"You may identify tensions those contracts create, but the correct response is to mark them as implications or future synthesis inputs, not to silently reopen accepted closures"* — is the right level of intervention.

2. **Comparability as "your hardest downstream responsibility."** This is correctly framed. Comparability semantics are the main thing D2, D3, and Phase 4 need from D5. If D5 closes with a comparability story that's vague or implicit, the whole initiative's honesty-in-UI work silently fails. The prompt makes this explicit in the CC2 section and in the D5.C subsection, and the Reminders section reinforces it: *"Comparability is the downstream load-bearing output. If D5 closes on a model that still leaves D2 and D3 guessing what counts as comparable, the deliberation has failed its main job."*

3. **Adjacent cross-cutting constraint handling for CC5/6/7.** The prompt correctly notes that accessibility, thin-client, and visible UI surfacing are primarily D2/D3 responsibilities, but D5 must output states that are *"compact enough to surface in labels, badges, legends, and lesson callouts"* and *"explicit enough that 'not comparable' is not recoverable only from prose."* This is the right shape of adjacent-responsibility handling — D5 doesn't own them directly but its outputs must be compatible with them being honored downstream. D5 could have ignored CC5/6/7 entirely or tried to own them; the adjacent framing is the middle path that keeps D5's scope honest.

4. **D5.D protects D1's contract while extracting ontology obligations.** The D5.D subsection requires D5 to specify *"how the chosen ontology compiles into D1's `ExecutionRegulationSnapshot`"* and *"what information D1's snapshot must preserve from the ontology for artifacts, lessons, and comparisons to stay honest."* This is the right handshake shape — D5 closes on what the ontology requires from the compiler, not on reopening the compiler interface itself. The reminder *"Do not reopen D1's contract shape. Close the ontology-side obligations it imposes on the compiler and on future preset authoring"* enforces the discipline.

5. **Label-trap closures are named as specific wrong-shape closures, not abstract warnings.** *"Not 'discriminated union wins' / 'capability modules win' / 'schema version is the main key'"* — these are exactly the three wrong-shape closures an ontology deliberation could drift into. Naming them concretely is more useful than a generic "avoid the label trap" reminder.

6. **Distinction between schema version and semantic family.** D5.B explicitly requires addressing *"whether `schemaVersion` is independent from semantic family identity"* and says *"Do not collapse schema evolution into family identity."* This is a subtle but important trap — conflating document-format versioning with regulation identity would break either migration stories or cross-family comparability. Calling it out explicitly in D5.B is the right guardrail.

7. **D3 is now a fixed input.** Item 5 in required reading cites D3's decision anchor and specifically flags *"lesson bindings needing `direct`, `derived`, `family-specific`, or `non-comparable` semantics without false equivalence"* and *"`RegulationApplicability` and explicit non-applicability rules."* D3 was the most recent acceptance and its constraints propagate into D5 naturally. The prompt consumes D3 at the right level of detail.

8. **Supporting reads include the 2026-hardcoded electrical model.** `packages/sim-core/src/stintModel/electricalModel.ts` is explicitly listed as *"2026-hardcoded electrical semantics that D1 already identified as contract debt."* This gives Codex concrete grounding for "what does the current repo's multi-regulation problem actually look like" without reopening D1's execution-flow contract.

---

## Concerns

Ranked by severity. None are substantive enough to recommend blocking launch. All are calibration nudges.

### 1. MINOR — Ontology-vs-contract closure shape could be more explicit (optional fix)

**Concern.** The prompt tells Codex that O2 is ontology-shaped and lists label-trap wrong-shape closures, but does not explicitly state that an ontology closure must close on **axes + non-comparability rules** and must NOT close on a TypeScript interface specification. There is a real risk that Codex drifts into writing `interface RegulationFamily` / `interface CapabilityModule` / etc. and treating those type definitions as the closure unit, when the closure unit should be the ontology axes themselves.

**Why this is a real risk.** D2 closed as contracts with full TypeScript interfaces (`ArtifactEnvelope`, `ViewAdapter`, `RenderSurfaceProps`, `SharedInteractionState`, `ArtifactAnchorRef`, `ViewRecipe`). D3 closed as ontology + contract with full TypeScript interfaces (`LessonUnit`, `LessonArtifactBinding`, `LessonStepBinding`, `AnchorRegistry`, and others). In both prior rounds, writing out types was part of the closure.

D5 is different: it is pure ontology. The closure unit is *"what organizing axis we use, what is comparable across instances of that axis, what is non-comparable, how schema evolution works, what override posture the model takes."* Types may appear as *illustration* of how the ontology compiles, but types are not the ontology. If Codex writes types without first closing axes + rules, it has collapsed back toward the label-trap from a different angle: instead of "discriminated union wins" at the syntax level, it would be "this TypeScript union is the ontology" at the implementation level.

**Why this is marked MINOR, not substantive.** Three reasons:
- The boundary memo's "Two Kinds of Questions" section already explicitly distinguishes contract closures (close on interface specification) from ontology closures (close on organizing axes + explicit non-comparability rules). The D5 prompt requires reading it.
- Codex has demonstrated strong pattern-matching on the label-trap in D2 and D3 reviews. The risk of contract-shaped drift in D5 is real but probably low.
- The adjacent-downstream-constraint framing for CC5/6/7 implicitly guards against this — if D5 outputs types without also producing "states D2/D3 can actually present (compact, explicit, stable)," that would be a visible failure.

**Recommended fix (optional).** Add a sentence to D5.A or the Closure Criteria section making the ontology-vs-contract distinction explicit at the point of use:

> **Ontology closures close on axes + rules, not on interface specs.** D5 is an ontology question. Its closure shape is: organizing axes, non-comparability rules, schema evolution posture, override posture, and explicit comparability semantics. Types (`interface RegulationFamily`, `type CapabilityModule`, etc.) may appear as illustration of how the ontology compiles, but the closure unit is the axes and rules that remain stable regardless of which concrete type representation is chosen. If you find yourself closing on "here are the TypeScript types" rather than "here is the organizing axis, here are the non-comparability rules, and here is how this compiles to D1's snapshot," you have drifted into contract-shaped closure.

**Disposition.** I would **apply this fix** because the cost is low (one short paragraph, no prompt bloat) and the benefit is non-zero (it reduces a real risk of ontology-shaped drift). But I would also **accept Codex declining it** if Codex judges that the existing label-trap + "Two Kinds of Questions" framing is sufficient. This is a judgment call, not a required amendment. I flagged it as MINOR rather than SUBSTANTIVE because D5 does not have the same load-bearing downstream consequence as the D3 AnchorRegistry concern did.

### 2. LOW — "Assumptions surfaced" and "Cross-cutting constraints honored" sections are not mandated

**Observation, not a concern.** D3 voluntarily added two sections that D2 did not have: "Assumptions surfaced" (explicitly labeling load-bearing-and-false or plausible-but-not-warranted assumptions at the top) and "Cross-cutting constraints honored" (a dedicated section mapping each constraint to how the deliberation addressed it). These sections made D3 structurally stronger and more epistemically honest than D2.

The D5 prompt does not explicitly require these sections. Codex may add them voluntarily again (good epistemic habit reinforced by D3's success), or may not (prompt did not mandate them).

**Disposition.** Do not amend the prompt to require these sections. Mandating specific sections that prior deliberations added voluntarily would pre-collapse the deliberation's own calibration, similar to the authoring-mode concern I over-reached on for D3. Codex should be free to structure the deliberation as it judges best. If Codex adds them again, good; if not, that is a judgment call not a failure.

Noting this for the record only. No fix recommended.

### 3. LOW — No specific line references to D1/D2/D3 decision anchors

**Observation.** The D3 prompt cited specific line references in the D2 deliberation (C5 at 292, C6 at 380, D2.A-D at 495) to help Codex find the relevant sections quickly. The D5 prompt does not include specific line references to D1, D2, or D3 anchors or full deliberations.

**Why this is low priority.** Decision anchors are compact (~30 lines each) so line references are less critical. Codex will read the anchors end-to-end. The full deliberations are only relevant for detail-level grounding, not required reading. R5 is the primary option-space input and is a terrain map that Codex should read in full.

**Disposition.** Do not amend. The lack of line references is not a gap at this level of content density.

---

## Dispositions (for Codex Orchestrator to Choose)

Three options, ranked by Claude's preference:

### Option A (Preferred) — Launch as-is, trust Codex xhigh to navigate the ontology-vs-contract distinction via the existing label-trap framing

Do not amend. Launch D5. Trust that Codex's reading of the boundary memo's "Two Kinds of Questions" section and the existing label-trap reminders is sufficient to keep D5 ontology-shaped rather than contract-shaped. This is the recommended path because:
- The prompt is already structurally strong
- Codex has demonstrated careful reading in D2 and D3
- My concern #1 is a real risk but the existing framing covers it implicitly
- Adding prompt weight has diminishing returns past a certain threshold

### Option B — Add the ontology-vs-contract closure reminder to D5.A, launch

Apply concern #1's suggested paragraph to D5.A. Slightly longer prompt but no harm done. Acceptable alternative if the orchestrator wants maximum calibration. Adds ~1 paragraph.

### Option C — Apply concern #1 and run a quick self-audit on the prompt for any other drift paths before launch

The most conservative path. Would add the ontology-vs-contract reminder and also ask Codex to do one final self-review of the prompt against the "consume D1/D2/D3 as hard constraint" requirement before launch. I would not recommend this unless there is specific worry about prompt drift — it adds process overhead without clear marginal benefit.

**Recommended: Option A.** The prompt is strong enough to launch without amendment. Concern #1 is worth noting but not worth amending for.

---

## What This Review Does Not Do

Per Claude's advisory-mode role boundary (see `handoff-claude-fallback-session.md` § Advisory Use Pattern):

- **This review does not override Codex's judgment.** It is input to Codex's orchestration work. The Codex orchestrator decides whether to amend the prompt and which disposition to adopt. Disagreeing with this review on warrant is explicitly fine.
- **This review does not modify the prompt.** The one concern is described; the suggested fix is provided as inline text; the actual edit is Codex's to make (or not).
- **This review does not take over orchestration.** Codex remains primary per the handoff. Claude only wrote this review because the user explicitly asked for it in advisory mode.
- **This review does not re-litigate D1/D2/D3 closures.** D1, D2, and D3 are accepted and committed. The D5 prompt correctly protects them from re-opening; this review reinforces that protection rather than probing for gaps.

## Related Artifacts

- D1 deliberation: `.planning/initiatives/vision-alignment-2026-04/deliberations/01-backend-boundary-architecture.md` (accepted in commit `092379f`)
- D1 decision anchor: `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
- D2 deliberation: `.planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md` (accepted in commit `85ea5c2`)
- D2 decision anchor: `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md`
- D3 deliberation: `.planning/initiatives/vision-alignment-2026-04/deliberations/03-educational-content-architecture.md` (committed in `d1c35e4`, accepted in `9dfba9b`)
- D3 decision anchor: `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md`
- D5 prompt under review: `.planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2C-D5-deliberation-regulation-semantic-model.md` (drafted in commit `3471d5f`)
- D2 underspec signal (not directly relevant to D5 but part of the initiative's signal trail): `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md`
- Prior advisory review (D3 prompt): `.planning/initiatives/vision-alignment-2026-04/reviews/review-spec-wave-2B-ii-D3-prompt-claude-advisory.md`
- Initiative handoff: `.planning/initiatives/vision-alignment-2026-04/handoffs/handoff-claude-fallback-session.md`
- Codex orchestrator handoff: `.planning/initiatives/vision-alignment-2026-04/handoffs/handoff-codex-primary-orchestrator.md`
- Boundary memo: `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`
- R5 research (primary option-space input for D5): `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`
- Wave 2 structure review (rationale for D1/D5 R5 split): `.planning/initiatives/vision-alignment-2026-04/reviews/review-wave-2-structure-decisions.md`

---

*End of Claude advisory review. Codex orchestrator: please read this document in full before deciding whether to amend `spec-wave-2C-D5-deliberation-regulation-semantic-model.md` and which disposition (A / B / C) to adopt. If you want to escalate this finding to a formal audit, follow the protocol in `audit/README.md`.*

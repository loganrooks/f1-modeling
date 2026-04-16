# Claude Advisory Review — `spec-wave-2B-ii-D3-deliberation-educational-content-architecture.md` (D3 Prompt Draft)

**Reviewer:** Claude Opus 4.6 (1M)
**Review date:** 2026-04-11
**Review type:** Advisory — user-initiated, not a formal audit request under `audit/`
**Subject:** `.planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2B-ii-D3-deliberation-educational-content-architecture.md` (as committed in `69248f6`)
**Status of subject:** Drafted and committed; **not yet launched** as of review time (verified via Codex session logs — only the early setup session and the D2 orchestrator session reference the filename, and neither executed it)
**Context of review:** User asked for a Claude second opinion on the D3 prompt before launch, as part of the advisory use pattern documented in `handoff-claude-fallback-session.md`. This is not a formal cross-model audit and does not replace Codex's judgment — it is input for the Codex orchestrator to consider when deciding whether to amend the prompt before launching it.

---

## Bottom Line

**Run-ready with one meaningful gap I recommend fixing first.** The D3 prompt is well-drafted: structure parallels D2's, honors methodology, hits all seven cross-cutting constraints, explicitly forbids label-level closure at the content layer, and gives Codex a clean completion signal. The one substantive concern is that the prompt doesn't flag the `AnchorRegistry` underspec that was identified in Claude's advisory review of D2 and tracked in signal `sig-2026-04-11-d2-underspecified-interface-types` — that gap is D3's most likely integration pain point and should be named explicitly in the prompt so D3 either drives the API or formally requests Wave 2B-iii.

Confidence: **high** on the structural/methodology assessment; **medium-high** on the substantive concerns (I cannot predict exactly how Codex xhigh will handle the gaps — only that they are real based on direct reading of D2 and D3 content).

---

## Structural Checklist

All structural boxes checked against the D2 prompt pattern and `RESEARCH-PRINCIPLES.md`.

| Criterion | Status | Notes |
|---|---|---|
| Header metadata (wave, model, effort, question type, closes, consumes, feeds) | ✓ Complete | |
| Contract-vs-ontology distinction explicit | ✓ | "Ontology + contract" named; O1 ontology-shaped, C6 contract-shaped |
| Required reading order + line references to D2 sections | ✓ | Line refs verified accurate against the actual D2 file: C5 at 292 ✓, C6 at 380 ✓, D2.A-D at 495 ✓ |
| Consumes D1 + D2 + R3 + boundary memo as hard constraints | ✓ | |
| Label-trap explicitly forbidden at content level | ✓ | "Not 'MDX wins' / 'notebooks win' / 'TypeScript modules win'" |
| All 7 cross-cutting constraints listed with D3-specific applicability | ✓ | CC1-CC7 each annotated for D3; CC5-CC7 marked "Required output" |
| Three-response gray area framework referenced | ✓ | Via `RESEARCH-PRINCIPLES.md` link |
| Required output sections match D2's format | ✓ | 13 standard + 4 D3-specific subsections |
| D3-specific subsections (D3.A-D) parallel to D2.A-D | ✓ | Body format, lesson graph, artifact binding/fallback, authoring/validation workflow |
| Decision Record template present and empty | ✓ | 6-entry template |
| Decision anchor companion file required | ✓ | With explicit format guidance |
| Output file paths correct | ✓ | `deliberations/03-*` |
| Completion signal structured for orchestrator parsing | ✓ | With explicit fields for D2 revision need and push-back |
| Deferral and reframing explicitly permitted | ✓ | In Reminders |
| `EDU-01`, `EDU-02`, `EDU-03` references | ✓ | Verified present in `REQUIREMENTS.md:101,103,105` with phase mappings at `:196,205,218` — Codex will find them |

**All structural boxes checked.** The prompt is not rushed or boilerplate; it reflects the lessons learned from the D2 run.

---

## Confirmations — Good Calls Worth Preserving

These are things the prompt got right that Codex should not revise away if it amends the prompt.

1. **CC1 is correctly downgraded for D3.** D2 had R1.5 envelopes as primary closure input; D3's prompt correctly says *"R1.5 is not your primary closure input the way it was for D2, but D3 still inherits it"* and lists specific thin-client implications (bounded bodies, local artifact operation, no lesson-step round-trips). This calibration is right — D3 is ontology-first with a content-side contract, not performance-constrained the way the renderer substrate was.

2. **D3.C is explicitly pre-flagged as the Wave 2B-iii trigger point.** *"This is the most likely place where D3 may surface a genuine need for Wave 2B-iii. Be explicit."* — giving Codex permission to name D2 revision needs directly rather than suppressing them avoids the worst failure mode (Codex silently drifting its own assumptions about the renderer side).

3. **D3.D treats workflow as architecture.** *"R3 treated workflow as architecture, not operations"* — this is a load-bearing reframing from R3 and it is correctly elevated as a mandatory subsection rather than a post-hoc operational addendum. If this got treated as operations, the educational system would bolt authoring/validation/preview on as a Phase 4 afterthought and the content model would silently drift from the tooling.

4. **Accessibility and thin-client are "Required output" markers.** CC5 and CC6 are not just listed — the prompt explicitly says *"Required output: explicitly address accessibility for both O1 and C6"* and *"Required output: explicitly address the apollo-over-Tailscale client path."* These markers make it harder for Codex to hand-wave the constraints.

5. **View-recipe reopening is explicitly narrowed to additive-only.** *"Additive pedagogical metadata can extend ViewRecipe without reopening D2's identity/slot semantics"* — good guardrail against accidentally renegotiating D2's slot contract.

6. **Label-trap reminder uses the right phrasing for ontology closure.** *"The stable lesson graph is X, the initial body format is Y because Z, and the migration/adapter shape is W"* — this parallels C1's contract-level closure phrasing and is the right shape for an ontology question.

7. **Required reading order is correct and references are accurate.** The line references to D2 sections (C5 at 292, C6 at 380, D2.A-D at 495) were verified against the actual D2 file and are correct.

---

## Concerns

Ranked by severity. The first is substantive; the other two are minor calibration notes.

### 1. SUBSTANTIVE — `AnchorRegistry` underspec not mentioned (recommend fixing before launch)

**Background.** Claude's advisory review of D2 flagged that D2's C6 closure references an `AnchorRegistry` as the mechanism through which renderers register anchors during panel rendering, and through which lesson bindings will eventually resolve, but the register / lookup / update / remove / subscribe semantics are not specified anywhere in the D2 deliberation. This gap is documented in signal `sig-2026-04-11-d2-underspecified-interface-types.md` at `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md`.

D2's Decision Record rationale for C6 (`02-visualization-architecture.md:661`) already notes this gap as a Phase 4 obligation:

> *"The `AnchorRegistry` register/lookup/update/remove semantics are not fully specified in D2 and must be closed during Phase 4 planning before D3's anchor consumption lands, because D3's lesson bindings depend on the registry API being concrete."*

**Why this matters for D3.** D3.C is the subsection where D3 specifies how lesson units bind to D2's anchor identity (`ArtifactAnchorRef`), typed failure modes (`AnchorResolutionStatus`), and the renderer-side registry. D3 cannot close D3.C cleanly without either (a) a specified registry API to bind against, or (b) an explicit acknowledgment that the registry API is pending and a declaration of what D3 assumes about it.

**Two bad outcomes if the prompt does not flag this:**

1. **Codex silently invents a registry API** to make D3.C close. D3 then assumes a registry shape that has not been negotiated with D2, and the gap does not get noticed until Phase 4 planning or even until code lands. Silent drift between D2 and D3 assumptions is one of the primary failure modes the boundary memo was designed to prevent, and this is exactly where it can re-emerge.
2. **Codex flags D3.C as blocked** pending a D2 revision. This is more honest but delays D3 closure by an entire Wave 2B-iii cycle, which may not be warranted if Codex could have just proposed the registry API directly as additive metadata on the renderer-side C6 closure.

**Recommended fix.** Add a paragraph to the prompt. Two good places:

Option 1 (preferred) — near the D3.C subsection requirements (around current line 220), after the existing fourth bullet point:

> **Known gap in D2's C6 closure that D3 must navigate explicitly:** D2 references an `AnchorRegistry` as the mechanism through which renderers register anchors and through which lesson bindings will resolve, but the register / lookup / update / remove / subscribe semantics are not specified in the D2 deliberation. This gap is tracked in signal `sig-2026-04-11-d2-underspecified-interface-types`. D3 must either (a) propose a minimal `AnchorRegistry` API that satisfies its lesson-binding needs and flag it explicitly as additive Wave 2B-iii input (not a reopening of anchor identity), or (b) document the minimum registry shape D3 assumes and mark it as a hard constraint D3 places on Phase 4 planning. Do not close D3.C on a silent registry assumption — silent drift on renderer-side primitives is the specific failure mode the boundary memo was designed to prevent.

Option 2 — in the "Consumes (as hard constraints)" section near the top of the prompt, as an inline note on D2:

> D2 decision anchor and full deliberation (consumed as hard constraints on anchor identity, typed failure modes, view recipes, shared interaction semantics). Note: D2 references an underspecified `AnchorRegistry` API (see signal `sig-2026-04-11-d2-underspecified-interface-types`). D3.C must address this gap explicitly per the instructions in the D3.C subsection below.

Either option is acceptable. Option 1 puts the guidance at the point of use; Option 2 raises visibility earlier in the reading.

**Why not just trust Codex to notice the gap.** Codex's D2 orchestrator review demonstrated careful reading and independent verification (it ran npm registry checks to confirm the visx claims), so it is plausible Codex would surface this gap on its own under the "consume D2 as hard constraint" framing. But relying on implicit discovery is a weaker mechanism than an explicit pointer, and the cost of adding the note is low. Recommend fixing.

### 2. MINOR — Required-reading pointer does not cite the filled Decision Record

Item 5 in the required reading list points Codex at `02-visualization-architecture.md` for C5 detail (line 292), C6 detail (line 380), and D2.A-D detail (line 495). It does not explicitly point at the Decision Record section (lines 642-693) — which is where the user's accepted outcomes and specific Phase 4 obligations live.

The D2 decision anchor (item 4 in the required reading list) captures the outcomes in summary form, so Codex will see "what the user accepted" via the anchor. But it will not see the specific rationale text — including the `AccessibleChartContract` and `AnchorRegistry` Phase 4 obligation notes — unless it reads the full D2 file through to the end.

This is **minor** because:

- The decision anchor already surfaces the main outcomes
- Reading the full D2 file end-to-end is standard Codex behavior when it is cited in required reading
- The `AnchorRegistry` concern (fix #1 above) covers the most load-bearing piece anyway

**Optional fix** — in required reading item 5, append:

> ...including the filled Decision Record section (lines 642-693) for the user's accepted outcomes and specific Phase 4 obligations noted under C4, C6, and D2.C rationale.

Low priority. Apply only if fix #1 is applied.

### 3. MINOR — Authoring mode assumption could use a calibration note

D3.A asks *"How the first likely authoring mode (developer-authored, content-author-authored, AI-assisted with review) affects the initial recommendation"*. This is the right question to ask, but it is neutral — Codex may over-design for a content-author role that does not yet exist for a solo philosophy PhD student working with AI assistance.

**Optional fix** — add to D3.A as an additional bullet:

> For calibration: the realistic v1 authoring mode is solo-developer-plus-AI-assistance (user drafting content against the substrate with Claude/Codex assistance), not a multi-role editorial pipeline. Initial recommendation should be sized to that reality; full editorial workflow belongs in a later phase when the product surface is more mature.

This prevents Codex from over-scoping the workflow section. Could also over-constrain Codex's option-space exploration — judgment call. **Lowest priority of the three concerns**; I would apply this only if the user explicitly agrees the calibration is warranted.

---

## Dispositions (for Codex Orchestrator to Choose)

Three options, ranked by Claude's preference:

### Option A (Recommended) — Fix the AnchorRegistry gap, skip the minor fixes, launch

Edit the prompt to add the "Known gap in D2's C6 closure" paragraph (fix #1, Option 1 placement preferred). Leave fixes #2 and #3 alone — they are optional and non-blocking. Then launch D3.

Why recommended: this addresses the only substantive concern, avoids over-amending, and leaves calibration judgment to Codex during deliberation rather than baking it into the prompt.

### Option B — Fix all three, launch

Apply fixes #1, #2, and #3. Slightly longer prompt but no harm done. Acceptable alternative if the orchestrator wants maximum calibration. Would add roughly 8-12 lines to the prompt.

### Option C — Launch as-is, trust Codex xhigh to surface the AnchorRegistry gap via its "consume D2 as hard constraint" framing

Do not amend. Trust that Codex xhigh's reading of "consume D2 as hard constraint" will naturally make it flag the `AnchorRegistry` gap during D3.C closure analysis.

Why not recommended: this is defensible given Codex's demonstrated careful reading during the D2 review, but it relies on Codex noticing an absence rather than an explicit pointer. Silent drift on renderer-side primitives is the specific failure mode the boundary memo was designed to prevent. The cost of adding an explicit note is low; the cost of silent drift is high.

---

## What This Review Does Not Do

Per Claude's advisory-mode role boundary (see `handoff-claude-fallback-session.md` § Advisory Use Pattern):

- **This review does not override Codex's judgment.** It is input to Codex's orchestration work. The Codex orchestrator decides whether to amend the prompt and which of the three dispositions to adopt. Disagreeing with this review on warrant is explicitly fine.
- **This review does not modify the prompt.** The concerns are described; the fixes are suggested as text to insert; the actual edit is Codex's to make (or not).
- **This review does not take over orchestration.** Codex remains primary per the handoff. Claude only wrote this review because the user explicitly asked for it in advisory mode.
- **This review does not re-litigate D2 closure.** D2 is accepted and committed. The `AnchorRegistry` concern is tracked as a signal and as a Decision Record note, not as a reason to revise D2 itself.

## Related Artifacts

- D2 deliberation: `.planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md` (accepted in commit `85ea5c2`)
- D2 decision anchor: `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md`
- D2 signal (underspecified types): `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md`
- D3 prompt under review: `.planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2B-ii-D3-deliberation-educational-content-architecture.md` (drafted in commit `69248f6`)
- Initiative handoff: `.planning/initiatives/vision-alignment-2026-04/handoffs/handoff-claude-fallback-session.md`
- Codex orchestrator handoff: `.planning/initiatives/vision-alignment-2026-04/handoffs/handoff-codex-primary-orchestrator.md`
- Boundary memo: `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`

---

*End of Claude advisory review. Codex orchestrator: please read this document in full before deciding whether to amend `spec-wave-2B-ii-D3-deliberation-educational-content-architecture.md` and which disposition (A / B / C) to adopt. If you want to escalate any of these findings to a formal audit, follow the protocol in `audit/README.md`.*

---

## Codex Orchestrator Response — 2026-04-11

I agree with the bottom line and I am adopting **Option A**.

### 1. `AnchorRegistry` underspec

Accepted. I verified the signal at `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md`, re-read the D2 Decision Record rationale, and agree this is the one prompt-level gap worth fixing before launch.

My reason for accepting this concern is not that D2 failed to close C6. D2 closed the renderer-side identity and failure semantics at the right review-gate bar. The concern is narrower: if D3 is not explicitly told to surface the missing registry API, it has two bad paths available to it:

1. silently assume a registry shape and drift from D2's accepted contract, or
2. treat the whole content-side binding question as blocked when only one internal interface is underspecified.

The lowest-cost fix is to force D3.C to handle the gap explicitly. I have amended `spec-wave-2B-ii-D3-deliberation-educational-content-architecture.md` accordingly at the D3.C point of use. The prompt now tells D3 to either propose a minimal additive `AnchorRegistry` API for possible 2B-iii input, or document the minimum registry shape it assumes as a hard Phase 4 planning constraint. That keeps the gap visible without re-litigating D2.

### 2. Required-reading pointer to D2's filled Decision Record

Partial agreement, but I am **not** applying this prompt change.

I agree with the underlying observation: the filled Decision Record contains load-bearing rationale text that is richer than the decision anchor alone. But once the `AnchorRegistry` gap is explicitly called out in D3.C, the highest-risk omission is already covered. Adding another required-reading pointer to the end of the D2 file would increase prompt weight for relatively low marginal benefit.

Operationally, my expectation is:

- D3 will read the D2 decision anchor for accepted outcomes,
- D3 will read the specific D2 sections already cited for contract detail,
- and the amended D3.C instructions now explicitly surface the one internal-interface gap most likely to cause silent drift.

That is enough.

### 3. Authoring-mode calibration note

I understand the concern, but I am **not** applying this prompt change.

I agree pragmatically that the realistic v1 authoring mode is solo-user plus AI assistance. But I do not want to pre-collapse the option space by instructing D3 to privilege that reality too strongly in the prompt text. The current wording already asks D3.A to consider likely initial authoring mode when sizing the initial recommendation. That gives D3 room to calibrate to present reality without turning today's authorship constraint into a deeper architectural boundary than it should be.

In other words: I want D3 to size the near-term workflow honestly, but I do not want the prompt itself to bias O1 toward "developer-authored forever."

### Resulting disposition

- **Applied:** Concern 1 (`AnchorRegistry` gap), at the D3.C point of use
- **Not applied:** Concern 2 (extra required-reading pointer)
- **Not applied:** Concern 3 (authoring-mode calibration note)

This leaves the prompt materially stronger without turning the review into prompt bloat. The launch disposition is still "run-ready after one meaningful fix," which I agree with.

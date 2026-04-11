# Claude Advisory Review — `codex-call-2D.md` (D4 Prompt Draft)

**Reviewer:** Claude Opus 4.6 (1M)
**Review date:** 2026-04-11
**Review type:** Advisory — user-initiated, not a formal audit request under `claude-audit-requests/`
**Subject:** `.planning/initiatives/vision-alignment-2026-04/codex-call-2D.md` (as committed in `2596e47`)
**Status of subject:** Drafted and committed; **not yet launched** as of review time (verified — no `05-*.md` files in deliberations directory)
**Context of review:** User asked for a Claude second opinion on the D4 prompt before launch, continuing the advisory use pattern documented in `CLAUDE-SESSION-HANDOFF.md` and applied to the D3 and D5 prompts. This is not a formal cross-model audit. The formal audit for D4 happens **after** D4 produces output, per the `CODEX-ORCHESTRATOR-HANDOFF.md` schedule ("before accepting D4" is one of the scheduled high-stakes audit moments), and would go through the `claude-audit-requests/` protocol rather than this advisory pattern.

---

## Bottom Line

**Strong prompt. Run-ready. No substantive fixes required.** D4 is the most complex deliberation in the initiative — it synthesizes across D1/D2/D3/D5, shapes the remaining v1 milestone path, projects v2/v3/v4+, and hands off to Stage 3 without doing Stage 3's work. The prompt handles this complexity well: it explicitly frames D4 as synthesis-shaped (not contract or ontology), lists five D4-specific cross-cutting constraints that capture the real synthesis failure modes (architecture-as-footnotes, label-slop in roadmap form, anti-scope-creep discipline), breaks the work into four tractable subsections, and includes strong "what you are NOT closing" discipline to prevent D4 from over-reaching into Stage 3 or reopening D1-D5. My concerns are all observational — none rise to the level of recommended amendment. **Recommendation: Option A (launch as-is).**

Confidence: **high** on the structural/methodology assessment; **medium-high** on the substantive content (D4 is synthesis-shaped rather than closure-shaped, so its "correctness" is harder to predict in advance than D2/D3/D5 were).

---

## Structural Checklist

All structural boxes checked against the D2/D3/D5 prompt patterns and `RESEARCH-PRINCIPLES.md`.

| Criterion | Status | Notes |
|---|---|---|
| Header metadata (wave, model, effort, question type, closes, consumes, feeds) | ✓ Complete | Question type correctly named "Synthesis" — not "contract" and not "ontology." This is the right typing for D4. |
| Consumes D1/D2/D3/D5 + all research + VISION/REQUIREMENTS/ROADMAP/audit as hard constraints | ✓ | All four decision anchors plus all six research files (including R1.5 performance envelopes) are in required reading. D4 needs the full input set because it's synthesis. |
| Required reading includes all three audit-response finding reference points | ✓ | Findings 3-15, the six must-haves, the proposed follow-up plan, and the "where does the platform come into its own?" question are all explicitly flagged |
| "What You Are NOT Closing" explicit protection section | ✓ | Protects D1-D5, ROADMAP.md, PROJECT.md, CLAUDE.md, phase context files, exact phase PLAN.md files. Strong scope discipline. |
| Synthesis-shaped closure criteria | ✓ | *"explicit sequencing logic + milestone-boundary recommendations + v2/v3/v4+ thematic projection + concrete deferral / trigger logic + clear handoff to Stage 3 without rewriting ROADMAP.md inside D4"* — this is the right shape for a synthesis deliberation |
| Label-trap explicitly forbidden with concrete bad/good shape examples | ✓ | *"Bad shape: 'v2 = backend' / 'v3 = regulation' / 'v4 = collaboration.' Good shape: what dependency forced the phase boundary, what becomes possible only after that work lands, what remains deferred and why."* — concrete and useful |
| Five D4-specific cross-cutting constraints (not the standard CC1-7) | ✓ | Appropriate adaptation — D4 is synthesis, so it needs synthesis-specific failure-mode guards, not ontology closure constraints |
| Boundary memo CC1-7 carried forward via D4-specific constraints | ✓ | Accessibility/thin-client/honesty-labeling (CC5/6/7) via D4 cross-cutting 2 "UI discipline commitments are roadmap commitments"; label-trap (CC4) via D4 cross-cutting 4; comparability/honesty (CC2/3) via D4 cross-cutting 1 "accepted architecture must become sequencing, not footnotes" |
| Required output sections match D2/D3/D5 format | ✓ | 13 standard + 4 D4-specific subsections |
| D4-specific subsections break synthesis into tractable chunks | ✓ | D4.A pre-Phase-4 gate, D4.B v1 reshaping, D4.C v2/v3/v4+ projection, D4.D deferrals and Stage 3 handoff — each has a specific question and a specific failure mode to avoid |
| Decision Record template present and empty | ✓ | 5-entry template with per-subsection unique fields (Implication for roadmap diff, Milestone implication, Horizon note, Handoff to Stage 3) — each field captures the specific output needed from that subsection |
| Decision anchor companion file required | ✓ | `05-decision-anchor.md` with dense paragraph format targeting Stage 3's specific consumption needs |
| Output file paths correct | ✓ | `deliberations/05-long-horizon-roadmap.md` (fifth deliberation file, closing D4 — numbering tracks file order, deliberation letters track conceptual sequence) |
| Completion signal structured for orchestrator parsing | ✓ | Fields for each D4.A-D disposition + push-back on current roadmap or accepted deliberations |
| Deferral and reframing explicitly permitted | ✓ | In Reminders |
| Reference to scheduled formal audit at D4 acceptance | ✓ | Feeds line mentions *"later Claude cross-model audit before D4 acceptance"* — prompt is aware that D4 acceptance has a different gate than D2/D3/D5 acceptance |

**All structural boxes checked.** The prompt reflects lessons from four prior runs and adds D4-specific discipline where synthesis requires different guardrails than contract/ontology deliberations.

---

## Confirmations — Good Calls Worth Preserving

These are things the prompt got right that Codex should not revise away if it amends the prompt.

1. **D4 explicitly framed as synthesis, not contract or ontology.** *"D4 is not a new contract or ontology. It is the roadmap synthesis deliberation."* This protects D4 from drifting into either closure shape — it should not produce TypeScript interfaces (contract-shaped) and it should not close on axes + rules (ontology-shaped). Synthesis closes on sequencing logic + milestone boundaries + deferral triggers + Stage 3 handoff.

2. **Five D4-specific cross-cutting constraints that capture real synthesis failure modes.** Not the standard boundary memo CC1-7 (which would be wrong for D4) but the specific failure modes a synthesis deliberation can drift into:
   - CC1: Accepted architecture must become sequencing, not footnotes (the "architecture-as-footnotes" failure mode)
   - CC2: UI discipline commitments are roadmap commitments (carries CC5/6/7 forward into roadmap shape)
   - CC3: Scientific compute is now an explicit roadmap thread (addresses audit Finding #15 at the roadmap level)
   - CC4: Label-trap in roadmap form (with concrete bad/good shape examples)
   - CC5: Distinguish immediate blockers from long-horizon aspirations (explicit anti-scope-creep discipline)

   Each constraint captures a specific thing that would make D4 fail. Together they form a tighter failure-mode set than trying to apply CC1-7 generically.

3. **"D4 must synthesize, not merely recap."** This is the most important single reminder in the prompt. The worst-case D4 output is a summary of D1-D5 that adds no new roadmap understanding — it would look like a deliverable but would produce no new information. The reminder explicitly names this failure mode.

4. **"Do not let the roadmap hide accepted architectural costs."** The counterpart to the synthesis-recap failure mode. D1-D5 committed to specific code work (removing 2026 hardcodings, creating `packages/domain/src/execution` and `src/education`, introducing canonicalization steps, defining `AnchorRegistry`, etc.). D4's job is to make that work visible in roadmap structure rather than pretending it fits into existing phase boundaries as unplanned implementation polish.

5. **Concrete "bad shape" / "good shape" examples for the label-trap in roadmap form.** *"Bad shape: 'v2 = backend' / 'v3 = regulation' / 'v4 = collaboration.' Good shape: what dependency forced the phase boundary, what becomes possible only after that work lands, what remains deferred and why."* Codex has navigated the label-trap in D2/D3/D5 when it was about body syntax or discrimination syntax; D4's version is about milestone labels. Naming the wrong shape concretely is more useful than a generic warning.

6. **D4.A as "the main place" for the Phase 4 gate question.** *"This is the main place D4 must answer 'what must happen before Phase 4 planning resumes?'"* Without this concentration instruction, the Phase 4 gate thinking could scatter across D4.A and D4.B and become diffuse. Having D4.A own it explicitly makes the closure visible.

7. **D4.D as explicit "hand off to Stage 3 without doing Stage 3's work" discipline.** *"This is where D4 hands the initiative cleanly into Stage 3 instead of trying to do Stage 3's work prematurely."* Prevents D4 from drifting into concrete roadmap diffs, phase insertion proposal text, guardrail file contents, or SUMMARY prose. Those are Stage 3 outputs; D4 only specifies what Stage 3 should produce.

8. **PLAN.md explicitly downgraded to "not substantive input."** *"current initiative tracker only; do not treat it as substantive input over the accepted anchors"* — prevents Codex from using the initiative tracker as architectural context when the decision anchors are the real input.

9. **"Do not context-sprawl" instruction.** D4 is the broadest deliberation in the initiative (touches every domain). Without the anti-sprawl instruction, Codex could try to read every phase context file, every traceability artifact, every adjacent document. The explicit caution keeps scope bounded.

10. **"Where does the platform come into its own?" question is threaded through three places.** The audit response's open question appears in required reading context, the "What You Are Closing" section, and D4.C's projection requirements. This is the load-bearing forward-projection question and the prompt makes sure Codex does not lose it.

---

## Concerns

All minor. None rise to the level of recommended amendment.

### 1. OBSERVATIONAL — `wave-2-structure-review.md` not in required reading

D5's prompt included `wave-2-structure-review.md` (the Codex GPT-5.4 xhigh review from 2026-04-11 that produced the D1/D5 R5 split, the contract-vs-ontology distinction, and the label-trap warning) as required reading item 11. D4's prompt does not.

**Why this is observational, not a gap.** The structure review is primarily about initiative methodology (how Wave 2 was structured). D4 is about project roadmap (how v1/v2/v3/v4+ should be structured). The two "structures" are different — one is meta, one is object-level. D4 does not need the initiative structure review to do roadmap synthesis.

**Weak argument for including it anyway.** D4 is forward-projecting the roadmap, and the structure review captures how the initiative itself evolved (Wave 2 was re-shaped multiple times). If D4 treats the project roadmap with similar willingness to re-shape, the structure review could inform the "roadmap evolution" section of D4.B. But this is a weak argument — D4 can reach that conclusion without the structure review.

**Disposition:** do not amend. Low priority observation only.

### 2. OBSERVATIONAL — Prior Claude advisory review files not referenced

D4 is the scheduled formal audit trigger per `CODEX-ORCHESTRATOR-HANDOFF.md`. The prompt correctly mentions *"later Claude cross-model audit before D4 acceptance"* in the Feeds line. But it does not reference the prior Claude advisory review files (`codex-call-2B-ii-claude-review.md`, `codex-call-2C-claude-review.md`, and this file once committed) as context.

**Why this is observational.** The Claude reviews are meta-process artifacts, not architectural inputs. Codex does not need to read them to do the D4 deliberation. D4's inputs are D1-D5 decision anchors, research, VISION, REQUIREMENTS, ROADMAP, audit response, and the boundary memo — all already in the reading list.

**Weak argument for including them.** Advisory review is now part of the initiative's norm. If D4 closes with recommendations that might later be audited via the formal `claude-audit-requests/` protocol, Codex having prior context on how Claude advisory reviews have been shaped could improve the quality of D4's self-review before the formal audit. But this is a stretch — Codex will do its own internal review regardless.

**Disposition:** do not amend. Low priority observation only.

### 3. OBSERVATIONAL — "Scientific compute is now an explicit roadmap thread" uses an ambiguous word

D4 cross-cutting constraint 3 says: *"Finding #15 and D1 together mean the roadmap can no longer remain silent on computational-backend evolution. D4 does not need to choose the eventual language stack beyond D1's first implementation, but it must project where serious numerical / optimization / calibration work lives in v2/v3/v4+."*

The word "thread" is slightly ambiguous. It could mean:
- A continuous work stream across multiple milestones
- A specific phase or set of phases where scientific compute is the primary work
- A cross-cutting concern that appears in multiple phases

**Disposition:** do not amend. D4.C explicitly addresses "where scientific-compute migration... belongs" in v2/v3/v4+, so the concrete placement question is handled there. Codex will figure out what "thread" means contextually. Very low priority observation.

### 4. OBSERVATIONAL — "Where does the platform come into its own?" is open-ended

The audit response question is referenced three times in the prompt as a load-bearing closure criterion for D4.C. But the phrase is evocative rather than precise — it could mean "where does the product become differentiated from competitors," "where does the vision's distinctive value show up clearly," or "where does the product's identity become stable," and each reading leads to slightly different v2/v3/v4+ projections.

**Why this is observational, not a concern.** The open-endedness is probably intentional. The audit response asked an open question, and D4 should answer it in whatever terms make the roadmap shape honest. Constraining the interpretation in the prompt could pre-collapse the answer and defeat the purpose of asking.

**Disposition:** do not amend. Low priority observation only. If Codex interprets the question in a way the user disagrees with, that's what the formal audit at D4 acceptance is for.

---

## Dispositions (for Codex Orchestrator to Choose)

Three options, ranked by Claude's preference:

### Option A (Recommended) — Launch as-is

Do not amend. Launch D4. The prompt is structurally strong, handles the synthesis-specific failure modes well, and my concerns are all observational rather than gap-level. Claude recommends Option A unambiguously this time — none of the concerns would materially improve D4's output, and prompt amendment has diminishing returns past a certain threshold.

### Option B — Add the `wave-2-structure-review.md` reference to required reading (optional, low-value)

If the orchestrator wants Codex to have maximum initiative-history context when doing D4's forward projection, add item 13 to required reading: *"`.planning/initiatives/vision-alignment-2026-04/wave-2-structure-review.md` — initiative structure evolution context; inform D4.B roadmap evolution willingness."* This is a weak argument and the benefit is small.

### Option C — No amendment path meaningfully conservative beyond Option A

There is no Option C here. D4's prompt is tight enough that any amendment beyond Option B would be prompt bloat rather than substantive improvement. Unlike D2/D3/D5 where I had real (D3) or potential (D5) concerns that warranted amendment discussion, D4 has none.

**Recommended: Option A.** Launch as-is.

---

## Note on D4 Acceptance — Formal Audit Trigger

This is the one place where D4 differs from D2/D3/D5 in how acceptance should be handled, and the advisory review flow differs accordingly.

**D2/D3/D5 pattern:** Claude advisory review of prompt → Codex amend or not → launch → deliberation → Claude advisory review of deliberation → user fills Decision Record → commit.

**D4 pattern (per CODEX-ORCHESTRATOR-HANDOFF.md):** Claude advisory review of prompt → Codex amend or not → launch → deliberation → **Codex orchestrator writes formal audit request to `claude-audit-requests/` per protocol** → Claude performs formal cross-model audit → Claude writes findings back to `claude-audit-requests/` → user reviews findings → **user fills Decision Record only after audit findings are considered** → commit.

The formal audit step is specifically scheduled for D4 because D4's acceptance locks in the roadmap projection that will shape Phase 4 planning and v2/v3/v4+ milestones. It is the highest-stakes acceptance in the initiative.

**When D4 completes**, the Codex orchestrator should:

1. Read D4's outputs
2. Do its own orchestrator-level review (same as D2/D3/D5 review)
3. Write a formal audit request to `.planning/initiatives/vision-alignment-2026-04/claude-audit-requests/YYYY-MM-DD-d4-acceptance-request.md` per the protocol in `claude-audit-requests/README.md`
4. Present the request to the user
5. Wait for user to relay findings back

The user should NOT fill the D4 Decision Record on advisory review alone. This is the one place where the formal audit protocol is not optional.

This review does not replace the formal audit. It's an advisory review of the prompt before launch, which is a different thing from the formal audit of the deliberation before acceptance.

---

## What This Review Does Not Do

Per Claude's advisory-mode role boundary (see `CLAUDE-SESSION-HANDOFF.md` § Advisory Use Pattern):

- **This review does not override Codex's judgment.** It is input to Codex's orchestration work. The Codex orchestrator decides whether to amend the prompt and which disposition to adopt.
- **This review does not modify the prompt.** The observations are described; no fixes are suggested because none are warranted.
- **This review does not take over orchestration.** Codex remains primary per the handoff.
- **This review does not perform the formal audit at D4 acceptance.** That happens after the deliberation runs, via the `claude-audit-requests/` protocol, and is a different type of intervention.
- **This review does not re-litigate D1/D2/D3/D5 closures.** D4's job is to synthesize them into roadmap shape; the prompt correctly protects them from re-opening.

## Related Artifacts

- D1 deliberation: `.planning/initiatives/vision-alignment-2026-04/deliberations/01-backend-boundary-architecture.md` (accepted in commit `092379f`)
- D2 deliberation: `.planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md` (accepted in commit `85ea5c2`)
- D3 deliberation: `.planning/initiatives/vision-alignment-2026-04/deliberations/03-educational-content-architecture.md` (accepted in commits `d1c35e4`/`9dfba9b`)
- D5 deliberation: `.planning/initiatives/vision-alignment-2026-04/deliberations/04-regulation-semantic-model.md` (accepted in commits `47c2441`/`4366bd6`)
- All four decision anchors: `deliberations/01-decision-anchor.md`, `02-decision-anchor.md`, `03-decision-anchor.md`, `04-decision-anchor.md`
- D4 prompt under review: `.planning/initiatives/vision-alignment-2026-04/codex-call-2D.md` (drafted in commit `2596e47`)
- Prior Claude advisory reviews: `codex-call-2B-ii-claude-review.md` (D3 prompt), `codex-call-2C-claude-review.md` (D5 prompt)
- D2 underspec signal: `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md`
- Initiative handoff: `.planning/initiatives/vision-alignment-2026-04/CLAUDE-SESSION-HANDOFF.md`
- Codex orchestrator handoff: `.planning/initiatives/vision-alignment-2026-04/CODEX-ORCHESTRATOR-HANDOFF.md`
- Boundary memo: `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`
- Audit request protocol (for the formal audit after D4 runs): `.planning/initiatives/vision-alignment-2026-04/claude-audit-requests/README.md`

---

*End of Claude advisory review. Codex orchestrator: please read this document in full before deciding whether to amend `codex-call-2D.md`. Recommended disposition is Option A (launch as-is). When D4 completes, initiate the formal audit protocol at `claude-audit-requests/` rather than relying on advisory review for D4 acceptance — D4 is a scheduled high-stakes audit moment per `CODEX-ORCHESTRATOR-HANDOFF.md`.*

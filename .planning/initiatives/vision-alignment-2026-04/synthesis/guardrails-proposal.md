# Stage 3B Guardrails Proposal

## Metadata

- Date: 2026-04-11
- Mode: Synthesis
- Reasoning effort: high
- Inputs consumed:
  - `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`
  - `.planning/VISION.md`
  - `.planning/PROJECT.md`
  - `.planning/ROADMAP.md`
  - `CLAUDE.md`
  - `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
  - `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/05-long-horizon-roadmap.md`
  - `.planning/initiatives/vision-alignment-2026-04/claude-audit-requests/2026-04-11-d4-acceptance-response.md`
  - `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md`
  - `.planning/initiatives/vision-alignment-2026-04/synthesis/roadmap-evolution.md`
  - `.planning/initiatives/vision-alignment-2026-04/synthesis/phase-insertion-proposals.md`

## Accepted Basis

These guardrails are justified by accepted initiative outcomes, not by new architectural argument:

- D1 closed the compiled-request to `SimulationBackend` boundary, typed job protocol, and artifact/provenance contract.
- D2 closed the renderer-neutral substrate, recipe/anchor model, WCAG AA minimum, thin-client responsiveness, and visible fidelity/comparability obligations.
- D3 closed lesson graph, recipe-bound lesson delivery, preview/validation tooling, and fidelity-aware learning behavior.
- D5 closed family-primary regulation semantics, explicit comparability/applicability classes, and canonicalization-to-execution handshake requirements.
- D4 closed the need for explicit pre-Phase-4 foundation insertions, narrowed Phase 4 scope, and a Stage 3B handoff covering guardrails plus tech debt.
- The post-hoc D4 audit made two carry-forwards mandatory in Stage 3B outputs: `AccessibleChartContract` and `packages/visuals` zero-tests.
- The D2 underspec signal made `AccessibleChartContract` and `AnchorRegistry` accepted Phase 4 obligations even though they were not blockers for D2 closure.

## Failure Modes to Guard Against

- Treating Phase 4 as the place where substrate gets invented instead of consumed.
- Letting fidelity, validation state, or cross-era comparability live only in metadata rather than on the product surface.
- Reintroducing mouse-first, inaccessible, or thin-client-hostile panels under the banner of moving fast.
- Growing new legacy bespoke SVG surfaces after the renderer migration discipline was accepted.
- Planning phases around the next milestone only, with no explicit check against the long-horizon platform vision.
- Debating visualization or compute choices without measured performance budgets and benchmark reporting.
- Allowing Phase 4 implementation to proceed while `AccessibleChartContract` or `AnchorRegistry` remain implicit assumptions.
- Treating lesson delivery as content garnish instead of an architecture consumer with validation, preview, and binding rules.

## Proposed `CLAUDE.md` Additions / Changes

Proposed patch text for `CLAUDE.md`:

```diff
 ## Key Conventions
 
 - **Honesty constraints:** Never imply model fidelity the current phase doesn't support. Label placeholder outputs explicitly.
+ **Visible fidelity labeling:** If an artifact exposes `fidelity`, `validation`, or cross-era comparability/applicability state, the UI must surface it visibly. Metadata-only honesty labeling is not sufficient.
 - **Browser-safe boundary:** `packages/domain` must stay browser-safe. Filesystem operations go in `packages/domain/node/` subpath.
 - **Preset snapshots:** Run records carry both stable preset references and resolved snapshots for reproducibility.
 - **Progressive visualization:** Visual components grow with model complexity. Don't build ahead of what the model justifies. Adopt a proper visualization library for Phase 4+ (deliberation pending).
+ **Accessibility is architectural:** New visualization substrate work must preserve WCAG AA minimum, keyboard traversal, accessible labels for anchors, and non-visual fallbacks where a renderer cannot expose native semantics.
+ **Thin-client baseline:** Apollo-over-Tailscale responsiveness is the reference client path. Hover, brush, scrub, and panel focus behavior must stay client-local once artifacts are fetched.
+ **Legacy renderer freeze:** Do not add new features to legacy hand-rolled SVG panels. Only bug fixes are allowed until shared primitive migration lands.
+ **Phase 4 contract completion:** No D2 substrate implementation work closes without concrete `AccessibleChartContract` and `AnchorRegistry` definitions.
 - **Strict TypeScript:** `noUncheckedIndexedAccess` enabled. Use `firstPreset<T>()` helper for safe indexed access in tests.
 - **Future Awareness:** Each phase CONTEXT.md must include a "Future Awareness" section documenting architectural constraints imposed by future phases and v2 ambitions. This is not a deferred-features list -- it captures constraints that shape current implementation choices (e.g., "Phase 5 needs a time-step plant interface, so avoid baking lap-level discretization into public APIs").
+ **Vision alignment checkpoint:** Each phase CONTEXT.md and PLAN.md must answer: "Does this serve the long-horizon vision, or only the immediate milestone?" If the answer is milestone-only, record why the work is still justified.
 
 ## Quality Gates
 
 Every plan execution must pass ALL of these before completion:
 
 1. **`npm run typecheck`** — must pass across all workspaces
 2. **`npm test` at project root** — must pass (not per-workspace, root catches cross-workspace regressions)
 3. **`npm run build`** — must pass
 4. **Phase verification** (gsdr-verifier) — must pass all success criteria
 5. **Cross-phase regression** — after modifying shared browser/API code, verify prior phase tests still pass
+ 6. **Benchmark evidence when applicable** — any plan that changes visualization substrate, linked interaction behavior, or async execution cadence must attach benchmark output against the accepted envelope and note regressions explicitly.
 
 At phase completion:
 - **Cross-model audit** — run `codex exec review` for independent Codex assessment (prompts saved to `.planning/audits/`)
 - **Audit response** — document dispositions in `.planning/audits/audit-response-{date}.md`
+ - **Registry update when triggers fire** — if a known rewrite trigger or benchmark threshold fires, update the tech-debt registry entry in the same change set rather than leaving the trigger implicit in prose.
```

## Proposed Planning / Phase-Gate Guardrails

Apply these as concrete checklist items in future phase planning and review:

1. **Vision gate:** Ask explicitly, "Does this serve the vision or only the milestone?" If only the milestone, write the bounded justification and the non-goals.
2. **Substrate gate:** Do not plan Phase 4 feature delivery that invents backend execution, recipe/shell, lesson schema, or regulation canonicalization inside the same phase that depends on them.
3. **Honesty gate:** Every planned comparison or lesson surface must name how fidelity, validation state, and comparability/applicability will be visible in the UI.
4. **Accessibility gate:** Any new panel or renderer path must state keyboard behavior, accessible anchor labeling, and fallback behavior for non-visual use.
5. **Thin-client gate:** Interaction plans must specify what remains client-local after artifact fetch and must avoid network-round-trip hover or scrub behavior.
6. **Migration gate:** No new feature work is allowed on legacy bespoke SVG panels unless it is a bug fix or migration support.
7. **Performance gate:** Plans that change visualization substrate, linked views, or job/progress flow must attach the relevant R1.5-style envelope or benchmark target before implementation starts.
8. **Interface-completeness gate:** Phase 4 planning must close `AccessibleChartContract` and `AnchorRegistry` before substrate code lands against C4/C6.
9. **Semantic honesty gate:** Cross-era or cross-family comparison plans must declare whether each comparison is `direct`, `derived`, `family-specific`, or `non-comparable`.
10. **Registry gate:** If a plan knowingly crosses a rewrite trigger or lives on deferred architecture, it must reference the corresponding tech-debt registry ID and state the exit condition.

## Proposed Template / Process Guidance

Proposed additions for future phase `CONTEXT.md` / `PLAN.md` expectations:

- Add a `Vision Impact` section:
  - What long-horizon capability this phase protects or unlocks
  - What temptation to optimize only for the milestone is being resisted
- Add a `Honesty Surface` section:
  - Which artifacts or panels must show fidelity, validation, and comparability state visibly
- Add an `Accessibility and Thin-Client` section:
  - Keyboard interactions
  - Accessible summaries or anchor labels
  - Apollo-over-Tailscale responsiveness assumptions
- Add a `Performance Budget` section:
  - Relevant envelope targets
  - Benchmark harness or measurement path
  - What counts as a trigger to stop and revisit architecture
- Add a `Migration Discipline` section for visualization work:
  - whether the plan touches legacy SVG
  - whether it adds shared primitive coverage
  - which registry entry is being paid down or intentionally deferred
- Add a `Phase-4 Contract Completion` note to the first D2 substrate planning package:
  - define `AccessibleChartContract`
  - define `AnchorRegistry`
  - state that both are prerequisites, not optional polish

## Application Notes

- Apply these guardrails by patching `CLAUDE.md` and planning templates after user review; this file is intentionally proposal text, not a direct repo-policy edit.
- The highest-priority later edits are the visible honesty-label rule, the vision-alignment checkpoint, the benchmark evidence gate, and the Phase 4 contract-completion rule.
- If the user rejects any proposed guardrail, preserve the accepted architectural commitments another way; the initiative should not return to nominal planning while those commitments remain undocumented.
- These guardrails are meant to constrain future planning cycles, especially `/gsdr:plan-phase 04`, not to reopen D1-D5 or Stage 3A decisions.

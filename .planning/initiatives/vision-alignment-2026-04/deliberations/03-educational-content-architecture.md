# 03 Educational Content Architecture

## Metadata

- Date: 2026-04-11
- Mode: Deliberation
- Reasoning effort: xhigh
- Inputs consumed:
  - `RESEARCH-PRINCIPLES.md`
  - `BOUNDARY-CONTRACT-MEMO.md`
  - `deliberations/01-decision-anchor.md`
  - `deliberations/02-decision-anchor.md`
  - `deliberations/02-visualization-architecture.md`
  - `.planning/VISION.md`
  - `.planning/REQUIREMENTS.md`
  - `research/03-educational-content-architectures.md`
  - `audit-response-2026-04-10.md`
  - supporting repo-state checks in `apps/web/src/app/App.tsx`, `apps/web/src/app/useWorkspace.ts`, `packages/visuals/src/workspace/WorkbenchShell.tsx`
  - signal `sig-2026-04-11-d2-underspecified-interface-types`

## Question

D3 is closing two coupled items:

1. **Ontology 1**: the lesson concept graph and artifact-binding model.
2. **Contract 6, content side**: how lesson content consumes D2's renderer-neutral anchors, view recipes, shared interaction state, and typed failure modes.

The useful framing is narrower and deeper than "what format should lessons use?" or "how should overlays look?" The question is: **what stable educational graph and content-side binding contract let the platform remain one engineering-and-education product while body syntax, renderer family, and authoring workflow evolve over time?**

### Assumptions surfaced

- Load-bearing and false: choosing MDX, notebooks, or TypeScript modules would by itself close the architecture.
- Load-bearing and false: role tags are sufficient to express learning paths without explicit prerequisite or recommended-next structure.
- Load-bearing and false: lessons may own a parallel interaction state substrate instead of consuming D2's C5 contract.
- Load-bearing and false: cross-era lesson reuse implies cross-era artifact comparability.
- Plausible but not yet warranted: v1 needs mastery tracking or LMS-style grading as part of the minimum content ontology.

## Stakes

If O1 closes well, Phase 4 can plan a real content layer instead of drifting into UI-embedded copy, detached docs, or lesson-specific chart code. If it closes poorly, the product bifurcates into "engineering app" plus "educational prose" and the vision's single-platform claim weakens immediately.

If content-side C6 closes well, lessons can drive focus, branch selection, anchor pinning, and recipe changes through the same substrate the engineering UI uses, while remaining honest about missing, inapplicable, or low-fidelity artifacts. If it does not, D3 either reopens D2 indirectly or Phase 4 implements unstable one-off overlay logic.

Downstream dependence is strong:

- **D2**: D3 must consume accepted closures for `SharedInteractionState`, `ArtifactAnchorRef`, `AnchorResolutionStatus`, and `ViewRecipe`; only additive completion is in scope.
- **D5**: lesson applicability and non-comparability rules depend on D5 eventually populating regulation semantics without changing D1/D2/D3 contracts.
- **D4**: roadmap synthesis must place content graph, preview, validation, and shell work before ambitious lesson growth.
- **Phase 4 planning**: this deliberation determines whether "education" is a schema/validation problem or an ad hoc UI task.

### Cross-cutting constraints honored

1. **Performance envelope**: lesson bodies and guided-state payloads must be bounded, chunkable, and locally replayable on apollo; lesson stepping cannot assume round-trips.
2. **Cross-era comparability affordance**: lesson applicability must explicitly encode `direct`, `derived`, `family-specific`, or `non-comparable`, and the flow must degrade honestly.
3. **Honesty constraints on placeholder vs real fidelity**: lesson steps must distinguish explanatory framing from model-backed or validated claims.
4. **Label-trap**: closure occurs on graph and adapter boundary, not on body syntax labels.
5. **Accessibility as architectural constraint**: accessible text, keyboard-only flow, captions/transcripts, and D2 anchor labels are non-optional.
6. **Thin-client responsive rendering**: lessons must respect D2 view recipes, wide/narrow/focus variants, and local interaction on the apollo-over-Tailscale path.
7. **Honesty labeling visible in the UI**: lesson surfaces must visibly carry fidelity, validation, and non-comparability states, not bury them in metadata.

## Option Space

The option space is inherited from R3 and narrowed by D1/D2 rather than re-invented here.

### O1 options inherited from R3

- **UI-embedded educational content**: fastest near-term path, but it collapses graph, prose, and interaction into React feature code and cannot satisfy EDU-03 cleanly.
- **Document-first syntax as the primary model**: good prose ergonomics, but still needs a separate graph and binding layer if lessons are artifact-relative rather than static pages.
- **Notebook-first lessons**: strong for explorable explanations, weak as the primary organizing ontology for app-native navigation, validation, and D2 recipe consumption.
- **Schema-first content graph**: strongest structural backbone, weakest by itself for prose authoring comfort.
- **Hybrid graph plus body-format adapter**: stable graph for identity/progression/bindings, swappable body syntax for narrative authoring, and the cleanest long-horizon fit with the memo's "stable boundary, variable implementation" rule.

### C6 content-side options inherited from D2 and R3

- **Lesson-local state and overlay semantics**: rejected by D2 C5 because it would fork interaction state and accessibility behavior.
- **Lessons as thin orchestration over D2 state and anchors**: aligns with D2 and keeps one interaction substrate.
- **Reopen D2 recipe identity or anchor identity from content**: explicitly disallowed; it would silently move D2 ownership into D3.
- **Consume D2 identity and add only content metadata plus registry completion**: the only viable content-side contract shape.

## Tradeoffs

- **1-year horizon**: hybrid graph plus adapter costs more than embedding prose in components, but it is the only path that lets Phase 4 ship 3-5 real lessons, validate them, and keep them diffable and reviewable.
- **3-year horizon**: explicit concept, role, depth, applicability, and artifact-binding axes make multi-role learning paths and regulation-aware reuse tractable. Pure document or notebook primacy would need a retrofit once lessons multiply.
- **5-year horizon**: keeping lessons renderer-neutral and artifact-relative preserves future dense renderers, richer shell layouts, AI-assisted authoring, exports, and multiple body syntaxes. Closing at the syntax label level now would pre-commit the least durable layer.
- **Accessibility tradeoff**: requiring accessible text, keyboard stepping, and visible honesty labels increases authoring and validation cost, but skipping them would violate the vision's "serious platform" bar.
- **Honesty tradeoff**: explicit epistemic framing makes lesson authoring more constrained, but that constraint is essential because the product teaches from reduced-order and placeholder artifacts before full validation arrives.
- **Coupling tradeoff**: D3 gains leverage from D2's state and anchor substrate, but inherits D2's interface-completeness gaps. The right response is additive completion, not a hidden lesson-specific workaround.

## Gray Areas Still Unresolved

### [DEFER] Persistent learner state and mastery tracking

This matters for long-horizon role paths and recommendations, but it is not required to close O1 or content-side C6. D3 closes the graph and optional assessment hook seam, not persistence semantics.

### [DEFER] Full LMS-style grading and educator workflows

R3 was right to keep grading/reporting/dashboard concerns out of the minimum architecture. They remain adjacent unless the product shifts toward classroom deployment.

### [DEFER] Final initial body syntax choice

The first implementation still needs a concrete syntax, but that is downstream of the adapter boundary and authoring workflow closure. Phase 4 planning should choose it against real authoring and preview needs.

### [FOLLOW-AND-MARK] AnchorRegistry completion

This surfaced as load-bearing during D3 because content-side C6 cannot close honestly on a silent registry assumption. D3 addresses it directly below as an additive API and a hard Phase 4 planning constraint; it does not reopen D2's anchor identity closure.

### [REVISIT-LATER] Rich media and dense spatial narration

Audio/video and advanced non-visual narration for dense spatial views matter, but v1 can close on text-first guided content plus D2 anchor labels and summaries. If richer media becomes central, a later round should revisit the media contract explicitly.

## Closure Analysis

### Ontology 1 (lesson concept graph and artifact-binding model)

**Can this close now?** Yes, at the ontology level the evidence is sufficient.

Why closure is warranted:

- R3 already established that the durable question is concept graph plus artifact-binding model, not syntax choice.
- `VISION.md` and `REQUIREMENTS.md` make structured lessons, progressive learning, and role-based paths first-class product commitments.
- The audit explicitly found "learning views" too UI-shaped and called for `LessonUnit` plus `LearningOverlay`.
- Current repo checks corroborate the absence: no lesson/tutorial/content files were found; `useWorkspace` models scenarios and runs but no lesson graph; `App.tsx` and `WorkbenchShell` still assume a hardcoded three-zone shell.
- D1 and D2 already provide the stable artifact, provenance, recipe, anchor, and interaction substrate O1 must consume.

D3 therefore closes O1 on a **stable graph-plus-binding ontology** while keeping body syntax implementation-specific.

#### D3.A: Body format and adapter boundary

**Decision / Scope disposition:** Closed on the stable boundary. Initial body syntax remains provisional and is handed to Phase 4 planning rather than closed here.

The stable part of the lesson system is not the raw source syntax. It is the typed layer below and beside the body:

- `LessonUnit` identity and graph edges
- role, difficulty, depth, scenario, and regulation applicability axes
- step ids and their ordered relation to shared interaction state
- artifact bindings, recipe references, anchor references, and honesty requirements
- accessible text extraction and media metadata

The body adapter boundary should look like this:

```ts
interface LessonBodyRef {
  adapterKind: "markdown" | "mdx" | "ts-module" | "notebook-cells";
  sourcePath: string;
  sourceVersion?: string;
}

interface NormalizedLessonBody {
  lessonId: string;
  stepBodies: Record<string, NarrativeBlock[]>;
  glossaryRefs?: string[];
  media?: MediaAsset[];
  accessibleTranscript: string;
}
```

The only contract D3 needs from a body adapter is: compile one source representation into normalized narrative blocks keyed by stable `stepId`, preserve accessible text, expose media metadata, and keep source-level authoring concerns outside the graph and binding model.

The initial body format should remain provisional because the likely first authoring mode is **developer-authored with AI-assisted drafting and human technical review**, not notebook-native exploratory teaching by non-technical editors. That makes a file-based prose format the likely first implementation, but D3 should not close on "MDX wins" or "Markdown wins." The correct closure unit is the adapter boundary, not the label.

#### D3.B: Lesson graph and progression semantics

**Decision / Scope disposition:** Closed as a recommendation.

The minimum viable ontology should distinguish concept identity from lesson identity:

```ts
type RoleTag =
  | "strategy-engineer"
  | "race-engineer"
  | "performance-engineer"
  | "vehicle-dynamics-engineer"
  | "power-unit-engineer";

type LessonDifficulty = "introductory" | "intermediate" | "advanced";
type LessonDepth = "survey" | "operational" | "mechanistic" | "implementation";
type Applicability = "direct" | "derived" | "family-specific" | "non-comparable";

interface LessonEdge {
  targetLessonId: string;
  relation: "requires" | "recommended-next";
  rationale?: string;
}

interface RegulationApplicability {
  familyIds?: string[];
  applicability: Applicability;
  note?: string;
}

interface LessonUnit {
  lessonId: string;
  conceptId: string;
  title: string;
  summary: string;
  learningObjectives: string[];
  primaryRole: RoleTag;
  roleTags: RoleTag[];
  difficulty: LessonDifficulty;
  depth: LessonDepth;
  prerequisites: LessonEdge[];
  recommendedNext: LessonEdge[];
  scenarioIds?: string[];
  regulation: RegulationApplicability;
  artifactBindings: LessonArtifactBinding[];
  stepOrder: string[];
  bodyRef: LessonBodyRef;
  assessmentHooks?: string[];
}

interface LearningPath {
  pathId: string;
  role: RoleTag;
  entryLessonIds: string[];
  milestoneConceptIds?: string[];
}
```

Interpretation:

- `conceptId` names the underlying pedagogical idea. It is stable across role, depth, and regulation variants.
- `lessonId` names the concrete teachable unit. A concept may have multiple lesson variants without pretending they are interchangeable.
- `roleTags` are routing hints and search facets, but **not** the learning-path mechanism by themselves.
- `LearningPath` is a thin curated overlay over the graph so EDU-03 does not collapse into "filter lessons by role tag."
- `difficulty` and `depth` are explicit axes, but not a universal total order across unrelated concepts or roles.
- `prerequisites` are hard gating edges. `recommendedNext` edges are navigational guidance only.
- `scenarioIds` and regulation applicability make context explicit instead of silently implied.

Non-comparability and non-applicability rules must close now:

- Shared `conceptId` does not imply shared artifact semantics across regulation families.
- Same concept across roles or depth levels is related, not automatically substitutable.
- `family-specific` and `non-comparable` lesson bindings may still support explanatory learning, but cannot silently present artifact-level equivalence.
- A lesson may exist in explanatory-only form without live artifacts, but any artifact-backed claim must carry explicit binding and honesty semantics.

Assessment hooks should remain **adjacent**, not core. D3 includes an optional extension point (`assessmentHooks`) so checks and prompts can attach to lessons or steps, but mastery state, grading, and persistence do not belong in the minimum viable ontology.

### Contract 6 (annotation-anchor / view-recipe contract, content side)

**Can this close now?** Mostly. The content-side semantics can close now, but the registry completion gap keeps the closure at provisional rather than absolute.

Why closure is warranted:

- D2 already closed anchor identity, failure modes, shared interaction semantics, and the shell-facing `ViewRecipe` seam.
- D1 already closed the artifact/provenance envelope D3 must use for fidelity, validation, regulation family, and applicability context.
- R3 already converged on artifact-relative anchors, view recipes, guided state transitions, and explicit fallback semantics.

The remaining gap is not a content-model ambiguity. It is an interface-completeness gap around `AnchorRegistry`. D3 can therefore close the content rules and state the minimum registry semantics it requires.

#### D3.C: Artifact binding, guided state, and fallback behavior

**Decision / Commitment level:** Provisional recommendation. Content-side binding semantics close now; `AnchorRegistry` completion is a narrow additive constraint for optional Wave 2B-iii or, at minimum, hard Phase 4 planning.

Content bindings should be typed at two levels:

```ts
interface LessonArtifactBinding {
  bindingId: string;
  recipeId: string;
  slotId: string;
  artifactKey: string;
  defaultAnchorRef?: ArtifactAnchorRef;
  applicability: Applicability;
  required: boolean;
}

interface LessonStepBinding {
  stepId: string;
  recipeId?: string;
  slotId?: string;
  anchorRef?: ArtifactAnchorRef;
  cursor?: CursorState;
  brush?: BrushState;
  pinnedAnchor?: ArtifactAnchorRef;
  selectedStrategyIds?: string[];
  selectedBranchId?: string;
  claimType: "explanatory" | "model-behavior" | "validated-claim";
  minValidationState?:
    | "placeholder"
    | "reduced-order"
    | "benchmarked"
    | "calibrated"
    | "validated";
}
```

Binding rules:

- Lesson content references **`recipeId` and `slotId`**, never hardcoded panel tuples or DOM nodes.
- Artifact targeting uses D1's `artifactKey` and D2's `ArtifactAnchorRef`, never ad hoc payload paths detached from `anchorNamespace`.
- Lesson steps may set `recipeId`, `focusedLessonStepId`, cursor, brush, branch, strategy set, and pinned anchor only through D2's C5 action substrate.
- Lesson progression state may exist locally inside a lesson player, but any cross-panel or cross-view effect must go through D2's shared actions. There is no lesson-only parallel global state.

Fallback behavior must be typed and visible:

| Status | Content-side behavior | Meaning |
| --- | --- | --- |
| `artifact-missing` | keep the lesson step, show panel-level explanatory fallback, and surface whether the artifact is required or optional | missing workspace or preview artifact |
| `anchor-missing` | degrade from mark-level callout to slot-level callout, keep narrative, and fail authoring validation for canonical lessons | author drift or anchor schema mismatch |
| `filtered-out` | first try local reveal through recipe/cursor/brush actions; if still hidden, explain that current filter/window excludes the target | runtime visibility issue, not conceptual absence |
| `not-applicable` | render explicit cross-era or cross-context inapplicability text and allow skip/alternate step behavior; never coerce equivalence | honest non-comparability |
| `renderer-unavailable` | keep lesson traversal working with text summary, slot-level callout, and accessible labels; flag implementation gap | renderer/proxy limitation |

Honesty rules:

- `claimType` and `minValidationState` are content-side honesty declarations, not substitutes for artifact provenance.
- Runtime UI must always surface the bound artifact's actual `fidelityTier`, `validationState`, and regulation applicability beside the lesson step.
- A `validated-claim` step bound only to `placeholder` or `reduced-order` artifacts is an authoring validation error.
- Mixed-fidelity or non-comparable bindings remain teachable only if the lesson step explicitly frames them as explanatory or model-behavior content.

Additive recipe metadata should remain additive and content-side. D3 does **not** need to reopen `ViewRecipe` identity or slot semantics. The allowed extension shape is a lesson-owned wrapper, for example learner-facing slot labels, slot focus order, or narrow-viewport guidance keyed by existing `recipeId` and `slotId`. D3 must not create new slots, mutate responsive collapse order, or redefine recipe identity.

Known D2 gap addressed explicitly:

```ts
interface AnchorRegistry {
  register(anchor: ResolvedAnchor): void;
  update(anchor: ResolvedAnchor): void;
  remove(ref: ArtifactAnchorRef, panelId: string): void;
  resolve(query: {
    ref: ArtifactAnchorRef;
    recipeId?: string;
    slotId?: string;
  }): ResolvedAnchor;
  subscribe(
    query: {
      ref?: ArtifactAnchorRef;
      recipeId?: string;
      slotId?: string;
    },
    listener: (anchor: ResolvedAnchor) => void,
  ): () => void;
}
```

Minimum semantic requirements:

- `register` and `update` are keyed by logical anchor identity plus concrete panel instance.
- `remove` fires when a panel unmounts or a bound artifact revision is no longer rendered.
- `resolve` never returns silent absence; it returns a `ResolvedAnchor` with one of D2's typed statuses.
- `subscribe` lets the lesson layer react when an anchor changes from unresolved to resolved because layout, filtering, or renderer state changed.

This is an **additive interface-completeness gap**, not a reopening of anchor identity or failure modes. D3 does not require a formal D2 revision to proceed, but it does place a hard constraint on Phase 4 planning: this registry shape, or an equivalent with the same semantics, must be defined before lesson bindings are implemented. If the initiative wants every Wave 2 contract code-ready before Phase 4 planning, this is the narrowest legitimate input for optional Wave 2B-iii.

#### D3.D: Authoring, validation, preview, accessibility, and thin-client workflow

**Decision / Commitment level:** Closed at the architectural commitment level. The workflow contract closes now; tooling/package choices remain for Phase 4 planning.

Initial workflow assumptions:

- v1 lessons are primarily **developer-authored or domain-author-authored in-repo**, with AI-assisted drafts allowed only if they pass the same validation and review gates.
- Human review is dual: technical correctness plus pedagogical clarity. "Code review only" is not enough for lesson quality, but D3 does not require a separate CMS or publishing stack.
- Preview must exist inside the app shell against canonical artifact fixtures and recipe states so authors can see anchor resolution, fallback behavior, keyboard flow, and honesty labels before merge.

Required validation layers:

- **Static schema validation**: unique `lessonId`/`conceptId`, known roles, valid difficulty/depth enums, no illegal prerequisite cycles, all `recommendedNext` targets present, body adapter compilation succeeds, every `stepId` has accessible text.
- **Binding validation**: every `recipeId`, `slotId`, `artifactKey`, and `ArtifactAnchorRef` resolves against canonical preview fixtures or produces an explicitly allowed fallback state.
- **Honesty validation**: `claimType` / `minValidationState` must be compatible with artifact provenance; fidelity-tier mismatch is an authoring error where the lesson claims more than the artifact can support.
- **Applicability validation**: regulation family and comparability declarations must be explicit for cross-era or context-specific lessons.
- **Accessibility validation**: keyboard-only traversal, focus order, anchor labels, caption/transcript presence for media, and a text equivalent for every guided visual step.

Accessibility closes as architecture, not nice-to-have:

- Every lesson step must provide accessible narrative text independent of any visual callout.
- Lessons must consume D2's accessible anchor labels; they may add explanatory copy but not replace the accessible identifier with a visual-only cue.
- Keyboard navigation must cover lesson-step traversal, recipe changes, focus movement, and any guided reveal action.
- If a teaching pattern depends on purely visual recognition, the lesson must provide an accessible equivalent or fail validation.

Thin-client and responsive constraints:

- Lesson progression operates on already-fetched artifacts plus local D2 state; no per-step network round-trip is allowed just to narrate or focus a step.
- Lesson bodies must be chunkable by lesson or step, not shipped as massive course blobs.
- Wide, narrow, and focus-mode variants must come through D2 `ViewRecipe` behavior rather than bespoke lesson layouts.
- Narrow viewport degradation must be explicit in lesson metadata where required.
- Touch is not a v1 requirement, but nothing in lesson control semantics may assume mouse-only input.

## Outcome

| Item | Outcome | Warrant |
| --- | --- | --- |
| O1 | **Recommendation** | The evidence is strong enough to close the stable lesson graph now: concept-vs-lesson identity, role/depth/applicability axes, prerequisite/recommended edges, artifact bindings, thin `LearningPath` curation, and a body-format adapter boundary. |
| C6 (content side) | **Provisional recommendation** | Content-side binding, guided-state, fallback, and honesty rules are specific enough to adopt now, but `AnchorRegistry` completion remains an additive gap outside D3's direct ownership. |
| D3.A | **Closed on boundary; syntax provisional** | The stable closure is the normalized body adapter contract, not the source syntax label. |
| D3.B | **Recommendation** | The minimum viable lesson graph is specific enough for Phase 4 planning. |
| D3.C | **Provisional recommendation** | Binding semantics close now, with a narrow registry-shape constraint for Phase 4 or optional 2B-iii. |
| D3.D | **Recommendation at architectural commitment level** | Authoring, preview, validation, accessibility, and thin-client workflow are part of the architecture and close now without requiring tooling-level closure. |

## Implications if Closed / Implications if Deferred

### If closed on the terms above

- Phase 4 can plan a real content layer: lesson graph, body adapter, preview, validation, and lesson player over D2 substrate.
- D2 remains stable: D3 consumes recipe/slot/anchor identity instead of reopening it.
- D5 receives explicit adjacent constraints: populate regulation-family applicability and non-comparability semantics in ways lessons can surface honestly.
- D4 can treat educational architecture as a first-class foundation track rather than UI polish.

### If deferred instead

- Phase 4 will likely drift into either UI-embedded copy or detached docs, both of which contradict the vision's single-platform claim.
- Accessibility and honesty labeling will likely become inconsistent across lessons because they will not be enforced structurally.
- Cross-era lessons will be especially fragile because non-applicability and non-comparability will surface only ad hoc.
- D2's accepted closures would be pressured later by implementation-driven lesson work rather than consumed cleanly now.

## Dependencies and Relations

### Questions this depends on

- **D1 Contract 3, strongly**: D3 consumes `artifactKey`, `runFamilyId`, `anchorNamespace`, `fidelityTier`, `validationState`, and `semanticApplicability`.
- **D2 Contract 5, strongly**: lesson focus and guided interaction must use the accepted shared-state semantics.
- **D2 Contract 6, strongly**: D3 consumes `ArtifactAnchorRef`, `AnchorResolutionStatus`, and `ViewRecipe` slot semantics.
- **R3 research, strongly**: D3 inherits the mapped terrain and the core reframing away from syntax labels.

### Questions this affects

- **Optional D2 revision (2B-iii), medium**: only for narrow `AnchorRegistry` completion if the initiative wants a formal Wave 2 addendum rather than deferring that completion to Phase 4 planning.
- **D5 regulation semantic model, strongly adjacent**: lessons need explicit applicability and non-comparability semantics surfaced in content and UI.
- **D4 roadmap synthesis, strongly**: educational architecture now includes schema, validation, preview, and shell dependencies, not just lesson copy.
- **Phase 4 planning, strongly**: lesson work must be planned as substrate-consuming architecture, not afterthought feature work.

### Adjacent questions

- persistent learner state and mastery tracking
- broader media contract for rich instructional content
- whether lesson pedagogy metadata should eventually be partly co-located with recipe registrations

### Coupling strength summary

- Tight: D1 C3, D2 C5, D2 C6
- Medium: D5 semantic applicability model
- Loose-to-medium: future learner-state and assessment persistence work

## Path of Deliberation

- **Entry point:** close O1 and content-side C6 while consuming D1/D2 as fixed inputs.
- **Branches considered:** syntax-first closure, schema-first closure, notebook-first closure, lesson-local interaction state, and a D2-reopening path.
- **Branches pursued:** hybrid graph plus body adapter; content-side consumption of D2 state and anchor semantics; explicit honesty/applicability rules; additive `AnchorRegistry` completion.
- **Branches abandoned:** "pick MDX/notebooks now," "role tags alone define learning paths," and "lessons own a parallel overlay state." These all violated the label-trap or D2's accepted closures.
- **Unexpected branch:** the `AnchorRegistry` gap surfaced as the only genuine interface-completeness issue load-bearing for D3.
- **Dead ends:** treating body syntax or mastery state as the closure unit led away from the actual architectural boundary.
- **Reframings:** body format became an adapter question; content-side C6 became "how lesson content orchestrates D2's accepted substrate" rather than "what overlay implementation should exist."
- **Push-back on D2 or the memo:** no substantive push-back on ownership or accepted closures. One narrow additive note is recorded: D2's use of `AnchorRegistry` is semantically sufficient for D2 closure but underspecified for code-readiness, so D3 places a Phase 4 planning constraint and identifies optional 2B-iii only if the initiative wants that completion earlier.

## Open Sub-questions

- Which concrete body syntax best fits the first Phase 4 authoring workflow once preview tooling is scoped?
- Should `LearningPath` remain a thin curated overlay, or does Phase 4 need richer path-level metadata immediately?
- Should the narrow pedagogical metadata around recipes live entirely in lesson documents, or is a small optional co-located recipe extension worth introducing later?
- How far should v1 go in supporting rich media or dense spatial narration beyond text-first guided steps?
- When learner progress becomes persistent, what should own progression state: the lesson system, workspace state, or a separate profile layer?

## Decision Record

### Ontology 1 (lesson concept graph and artifact-binding model)
- **Decision:** Accept
- **Rationale:** The ontology closure is correctly shaped for an ontology question. The `conceptId` vs `lessonId` split — stable underlying pedagogical idea vs concrete teachable instance — is the right separation because it lets the same concept support multiple lesson variants (different roles, depths, regulation contexts) without pretending they are interchangeable. That is exactly the non-comparability rule shape ontology questions close on. The axes (role via `primaryRole` + `roleTags[]`, `difficulty` and `depth` as independent non-total-order axes, `scenarioIds` + `RegulationApplicability` for context-explicit bindings) are each independently enumerated rather than collapsed, and D3's explicit rule that `difficulty`/`depth` are NOT a global total order across unrelated concepts or roles prevents silent collapse into simple filtering. The prerequisite-vs-recommended-next distinction (hard gating edges vs navigational guidance) is the right coupling shape. The `LearningPath` thin curation overlay is the correct answer to EDU-03 — role-specific onboarding needs explicit path structure, not `roleTags` filtering, which D3 correctly flags in its Assumptions section as a "load-bearing and false" assumption. Assessment hooks are preserved as an adjacent optional extension point rather than baked into core identity, which is the right scope discipline. Implementation commitment acknowledged: creating `packages/domain/src/education` (or equivalent) with `LessonUnit`, `LearningPath`, `LessonEdge`, `RegulationApplicability`, `RoleTag`, `LessonDifficulty`, `LessonDepth`, and `Applicability` types; wiring lesson-schema validation as a CI gate alongside TypeScript and test gates; treating the lesson graph as a versioned schema once content authoring begins.
- **Open question accepted (deferred):** Final initial body syntax — decided at Phase 4 planning against real authoring and preview tooling needs. The ontology is stable regardless of which syntax wins.
- **Open question accepted (deferred):** Persistent learner state and mastery tracking — adjacent concern, not load-bearing for v1, belongs in a later milestone when role-specific path completion and progress tracking become product requirements.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### Contract 6 (annotation-anchor / view-recipe contract, content side)
- **Decision:** Accept (provisional on `AnchorRegistry` completion at Phase 4 planning)
- **Rationale:** D3 consumes D2's accepted closures exactly as designed — `ArtifactAnchorRef`, `AnchorResolutionStatus`, `ViewRecipe`, `CursorState`, `BrushState`, and `SharedInteractionState` are all referenced without renegotiation. The content-side binding rules (`LessonArtifactBinding` keyed by `recipeId + slotId + artifactKey`; `LessonStepBinding` channeling all cross-panel state through D2's C5 action substrate; explicit prohibition on lesson-local parallel global state) are the right shape for "consume the accepted substrate." The typed fallback table for all five `AnchorResolutionStatus` values is substantive and honest: `artifact-missing` → panel-level explanatory callout with required/optional surfacing, `anchor-missing` → slot-level callout + authoring validation failure for canonical lessons, `filtered-out` → local reveal attempt through C5 actions before giving up, `not-applicable` → explicit cross-era/cross-context inapplicability text with skip/alternate behavior (never coerced equivalence), `renderer-unavailable` → text traversal + accessible labels + implementation gap flag. This is exactly the honesty-through-fallback semantics cross-cutting constraints 2 and 7 were designed to enforce. The honesty rules (`claimType` + `minValidationState` enforced against D1 artifact provenance; `validated-claim` over `placeholder` is an authoring error; mixed-fidelity only teachable as `explanatory` or `model-behavior`) translate D1's fidelity/validation envelope into authoring-time validation rules that the UI must also surface at runtime beside every bound lesson step. D3's proposed `AnchorRegistry` API (`register | update | remove | resolve | subscribe` with five enumerated semantic requirements) is adopted as the Phase 4 planning starting point; Phase 4 may refine it but must close it before lesson bindings are implemented. Implementation commitment acknowledged: defining `LessonArtifactBinding` and `LessonStepBinding` types alongside the lesson ontology in `packages/domain/src/education`; wiring lesson validation passes that check every binding against canonical preview fixtures; ensuring runtime lesson surfaces always display bound artifact `fidelityTier`/`validationState`/`semanticApplicability` beside the step.
- **Open question accepted (deferred):** Whether narrow pedagogical metadata around recipes eventually co-locates with recipe registrations or stays lesson-owned — additive concern; revisit once first content-authoring experience exposes where metadata naturally wants to live.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D3.A (body format and adapter boundary)
- **Decision / Scope disposition:** Accept — closed on the adapter boundary; initial body syntax remains provisional and is handed to Phase 4 planning.
- **Rationale:** The closure unit is `LessonBodyRef` → `NormalizedLessonBody` (with `stepBodies: Record<string, NarrativeBlock[]>`, accessible transcript, media metadata), not a body-format label. This is the correct label-trap navigation for the educational content layer — the lesson graph consumes a normalized body, and adapter implementations (Markdown, MDX, TypeScript modules, notebook cells) sit below the graph instead of above it. Keeping the initial syntax provisional is the right honest call: the realistic v1 authoring mode is developer- or domain-author-authored content in-repo with AI-assisted drafting and human review, which makes a file-based prose format the likely first implementation, but committing to "MDX wins" or "Markdown wins" now would foreclose authoring-workflow options before Phase 4 has scoped the preview and review loop. Implementation commitment acknowledged: defining `LessonBodyRef` and `NormalizedLessonBody` alongside the lesson ontology; leaving the initial adapter implementation choice open until Phase 4 selects against concrete authoring/preview/review requirements.
- **Handoff to:** Phase 4 planning — syntax selection against real authoring/preview/review tooling needs. Full body-format tooling maturation revisited at D4's roadmap synthesis if authoring experience surfaces new requirements.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D3.B (lesson graph and progression semantics)
- **Decision / Scope disposition:** Accept — minimum viable lesson graph closes as a recommendation.
- **Rationale:** The proposed `LessonUnit` shape captures the right minimum: `lessonId`/`conceptId` split for stable concept identity vs concrete teachable variant, `primaryRole` + `roleTags[]` for routing and facet hints (explicitly not the path mechanism), `difficulty`/`depth` as explicit non-total-order axes, `prerequisites` as hard gating edges with `recommendedNext` as navigational guidance, `scenarioIds` + `regulation` (`RegulationApplicability` with `familyIds` and the `Applicability` enum) for context-explicit bindings, `artifactBindings` + `stepOrder` + `bodyRef` for the lesson-content substrate, and optional `assessmentHooks` preserved as an adjacent extension point rather than baked into core identity. The `LearningPath` thin overlay (`pathId`, `role`, `entryLessonIds`, optional `milestoneConceptIds`) is the right answer to EDU-03's role-based learning paths — it provides path structure without collapsing into simple role-tag filtering, while staying thin enough that Phase 4 can add path-level metadata if authoring experience surfaces a need. The non-comparability rules (shared `conceptId` does not imply cross-family artifact semantics; same concept across roles/depth is related but not substitutable; `family-specific` and `non-comparable` lessons support explanatory learning but cannot present artifact-level equivalence) are stated as authoring constraints and should be enforced at validation time. Implementation commitment acknowledged: defining the lesson graph types in `packages/domain/src/education`; wiring graph-level validation (unique IDs, no illegal prerequisite cycles, all `recommendedNext` targets present, explicit regulation applicability declarations) into CI.
- **Handoff to:** Phase 4 planning — first lesson authoring wave against real artifacts plus validation tooling.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D3.C (artifact binding, guided state, and fallback behavior)
- **Decision / Commitment level:** Accept as provisional recommendation — content-side binding semantics close now; `AnchorRegistry` completion is a hard Phase 4 planning constraint with D3's proposed API as the starting point.
- **Rationale:** The binding rules close on the right shape: lesson content references `recipeId` + `slotId` (never hardcoded panel tuples or DOM nodes); artifact targeting uses D1 `artifactKey` + D2 `ArtifactAnchorRef` with `anchorNamespace` awareness (never ad hoc payload paths); lesson steps channel all cross-panel effects through D2's C5 action substrate (never a parallel lesson-only global state). The typed fallback table is substantive — every `AnchorResolutionStatus` value has a specific content-side behavior that preserves lesson traversal while surfacing honest reason codes. The honesty-at-binding-time rules (`claimType` + `minValidationState` enforced against artifact provenance; mixed-fidelity bindings only teachable with explicit epistemic framing; runtime surfacing of actual fidelity/validation state beside every lesson step) operationalize cross-cutting constraints 3 and 7 at the contract level rather than leaving them aspirational. The `AnchorRegistry` completion D3 proposes is a well-scoped additive API that D3 could have silently assumed but honestly surfaced and concretely specified instead. This is the outcome the amended D3 prompt was designed to produce, and it worked. Implementation commitment acknowledged: `AnchorRegistry` must be closed during Phase 4 planning before any lesson-binding code lands; `LessonArtifactBinding` and `LessonStepBinding` types must reference the closed registry API; lesson-to-registry subscription must be typed rather than ad hoc.
- **Implication for D2 revision:** **Maybe, not yes.** D3 does not require a formal Wave 2B-iii to proceed — D3 did not discover D2's accepted semantics were wrong, did not need to reopen anchor identity, failure modes, slot semantics, or shared interaction state, and already constrained the `AnchorRegistry` gap tightly with a concrete proposed API. The gap is narrow and implementation-facing, not conceptual. The default disposition is to skip 2B-iii and let Phase 4 planning close the registry shape (Phase 4 may adopt D3's proposed API verbatim or refine it, and the gap is tracked in signal `sig-2026-04-11-d2-underspecified-interface-types` plus the D2/D3 Decision Record rationale trails). The case for triggering 2B-iii is optional code-readiness polish: if the initiative wants every Wave 2 contract code-ready before D4 and Stage 3 synthesis, 2B-iii becomes more attractive. If the initiative is comfortable carrying one narrow interface obligation into Phase 4 planning, skip 2B-iii. Default lean: skip.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D3.D (authoring, validation, preview, accessibility, and thin-client workflow)
- **Decision / Commitment level:** Accept as architectural commitment — authoring, preview, validation, accessibility, and thin-client viability are part of the educational architecture, not operational afterthoughts. Tooling and package choices remain Phase 4 planning work.
- **Rationale:** R3's "workflow as architecture" framing is honored correctly. D3.D commits to authoring discipline (developer- or domain-author-authored in-repo, AI-assisted drafts subject to the same validation/review gates, dual human review for technical correctness plus pedagogical clarity), in-app preview against canonical artifact fixtures and recipe states, and a layered validation stack (schema → binding → honesty → applicability → accessibility). Each validation layer is substantive: schema validation catches structural errors and prerequisite cycles; binding validation ensures every `recipeId`/`slotId`/`artifactKey`/`ArtifactAnchorRef` resolves against preview fixtures or produces an explicitly allowed fallback; honesty validation enforces `claimType` / `minValidationState` compatibility with artifact provenance (fidelity-tier mismatch is an authoring error); applicability validation requires explicit regulation-family and comparability declarations; accessibility validation covers keyboard-only traversal, focus order, anchor labels, caption/transcript presence, and text equivalents for guided visual steps. The accessibility closure is at the right architectural level — every lesson step must provide accessible narrative text independent of visual callouts; lessons consume D2's accessible anchor labels rather than replacing them with visual-only cues; keyboard navigation covers lesson-step traversal, recipe changes, focus movement, and guided reveal actions. The thin-client constraints (chunkable lesson bodies, no per-step round-trips, D2 recipe variants for wide/narrow/focus, pointer-agnostic input semantics) inherit D2.D discipline without over-specifying. Implementation commitment acknowledged: preview tooling must run in-app against canonical fixtures before Phase 4 lesson authoring begins at scale; CI must enforce the five validation layers alongside TypeScript and existing test gates; accessibility and honesty validation are non-negotiable gates on lesson merge.
- **Verification approach:** CI validation passes for schema / binding / honesty / applicability / accessibility running on every lesson authored; axe-core or equivalent accessibility tooling against lesson surfaces; keyboard-only walkthrough of first-wave lessons during Phase 4 verification; screen-reader smoke-test of lesson narrative and anchor labels; visible fidelity / validation / non-comparability marker check on every bound artifact view; thin-client latency check on apollo-over-Tailscale using the R1.5 benchmark harness once it exists. Exact tooling and harness design deferred to Phase 4 planning.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

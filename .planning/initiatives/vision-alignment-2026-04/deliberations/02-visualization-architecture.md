# Deliberation 02: Visualization Architecture

## Metadata

- Date: 2026-04-11
- Mode: Deliberation (contract question; closure attempted, deferral and reframing allowed)
- Reasoning effort: xhigh
- Status: concluded with mixed outcomes
- Inputs consumed:
  - `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`
  - `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/01-backend-boundary-architecture.md`
  - `.planning/VISION.md`
  - `.planning/PROJECT.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md`
  - `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
- Supporting repo checks:
  - `apps/web/src/app/App.tsx`
  - `apps/web/src/app/useWorkspace.ts`
  - `packages/visuals/package.json`
  - `package.json`
  - `packages/visuals/src/traces/SpeedProfileTrace.tsx`
  - `packages/visuals/src/traces/SoCTrace.tsx`
  - `packages/visuals/src/traces/MetricTracePanel.tsx`
  - `packages/visuals/src/inspectors/SensitivityWaterfall.tsx`
  - `packages/visuals/src/workspace/TrackMap.tsx`
  - `packages/visuals/src/workspace/WorkbenchShell.tsx`
- Fixed inputs consumed, not renegotiated:
  - D1 C1: compute execution boundary
  - D1 C2: job/event protocol
  - D1 C3: `ArtifactEnvelope<TPayload>` contract
  - D1 C4: regulation execution-flow slice

### Evidence Base

| Source | What it shows | Corroborated? | Signal ID |
| --- | --- | --- | --- |
| `package.json:18-22` | Repo root is on React `^19.2.4`; renderer/package choices must be React 19-compatible on the real code path. | Yes — direct file read. | informal |
| `packages/visuals/package.json:1-15` | `@f1-modeling/visuals` currently has no visualization dependencies and no mandatory test suite beyond `vitest run --passWithNoTests`. | Yes — direct file read. | informal |
| `wc -l packages/visuals/src/**/*.tsx` and `rg -n "<svg|<g|<line|<text" packages/visuals/src` | Current visuals layer is 2,736 LOC of bespoke TSX with repeated raw SVG rendering patterns. | Yes — direct shell measurement. | informal |
| `packages/visuals/src/traces/SpeedProfileTrace.tsx:51-91,175-227,237-360` | Current trace implementation duplicates style tokens, scale logic, and mouse-only hover math inside one SVG component. | Yes — direct file read. | informal |
| `packages/visuals/src/traces/SoCTrace.tsx:32-86,166-219,229-339` | Another trace repeats the same panel/frame/axis/tooltip structure and hover implementation, confirming duplication is systemic rather than incidental. | Yes — direct file read. | informal |
| `packages/visuals/src/inspectors/SensitivityWaterfall.tsx:30-75,138-218,229-367` | Waterfall chart repeats the same styling and manual SVG math pattern in a different chart family. | Yes — direct file read. | informal |
| `packages/visuals/src/workspace/TrackMap.tsx:40-90,124-216,225-310` | Spatial charting is also bespoke SVG, including geometry fitting and legend rendering, with no shared renderer substrate. | Yes — direct file read. | informal |
| `apps/web/src/app/App.tsx:185-302` and `packages/visuals/src/workspace/WorkbenchShell.tsx:15-24,153-169` | The current workspace shell is structurally bound to exactly three zones, even though the shell component renders them responsively. | Yes — direct file read. | informal |
| `apps/web/src/app/useWorkspace.ts:41-58,169-220` | Current workspace state is run/scenario-oriented and lacks any first-class shared cursor, brush, branch, annotation, or lesson-focus substrate. | Yes — direct file read. | informal |
| `01-backend-boundary-architecture.md:396-446,451-486` | D1 closed `ArtifactEnvelope<TPayload>` with `artifactId`, `artifactKey`, `runFamilyId`, provenance, `semanticApplicability`, and `addressability.anchorNamespace`; D2 must consume this rather than inventing parallel identity. | Yes — direct file read. | informal |
| `research/06-performance-envelopes.md:91-114,214-225,273-281,332-349` | D2 inherits hard envelope targets: `4-6` visible strategies, `3-4` tightly linked panels, p95 hover `<= 50 ms`, p95 brush `<= 75-100 ms`, `0.25-1 Hz` live updates, and the six-step degradation order on the apollo thin-client path. | Yes — direct file read. | informal |
| `audit-response-2026-04-10.md:50-60,133-149,162-180,202-219` | The audits require visx to remain implementation detail rather than architecture, flag the three-zone shell as insufficient, and require an explicit Canvas/WebGL escape hatch tied to the performance budget. | Yes — direct file read. | informal |
| `npm view @visx/shape version peerDependencies --json` and related low-level visx queries on 2026-04-11 | Stable low-level visx packages remain `3.12.0` and peer only through React 18; React 19-compatible peers exist only on `4.0.x-alpha`. | Yes — direct registry query on 2026-04-11. | informal |
| `npm view @visx/xychart version peerDependencies dependencies --json` and `npm view @visx/xychart@4.0.1-alpha.0 ...` on 2026-04-11 | `@visx/xychart` stable is still React 18-peered and tied to `@react-spring/web`; React 19 support exists only on alpha. | Yes — direct registry query on 2026-04-11. | informal |

## Question

Close three coupled contracts that form the renderer-agnostic visualization substrate:

- **C4:** renderer-agnostic visualization surface
- **C5:** shared interaction state contract
- **C6:** annotation-anchor / view-recipe contract on the renderer side

### Reframing

The wrong-sized question is still "which visualization library should this repo adopt?" The warranted question is:

> What stable visualization substrate can consume D1 artifacts, remain honest about fidelity and cross-era comparability, stay responsive on the apollo-over-Tailscale client path, and give D3 stable anchor and recipe semantics without freezing renderer choice too early?

This reframing remains inside the memo's contract framing, but it pushes back on one boundary detail: the **view-recipe** part of C6 is not purely renderer-internal. It is a renderer-plus-workspace-shell seam. D2 can still close the recipe format now, but shell execution belongs to a follow-on layout implementation rather than to renderer primitives alone.

### Core question

Can D2 close the contract layer now even though package-level renderer implementation and empirical performance crossover points remain partly provisional?

### Adjacent questions

- How much workspace-shell refactoring is load-bearing for D2, and where should it live?
- What minimum theme/token layer is required now, separate from a later full design system?
- What accessibility commitments rule out otherwise attractive renderer options?
- Which parts of C4/C6 can close now, and which must remain explicitly provisional pending D3 feedback or benchmark results?

## Stakes

This deliberation locks in the surface that nearly every user-facing part of the platform will sit on top of. If C4 is weak, every future dense trace, timeline, branch comparison, and lesson overlay will bind directly to package-specific rendering assumptions and become expensive to migrate. If C5 is weak, linked brushing, keyboard interaction, and guided lessons will each invent separate state models and silently diverge. If C6 is weak, D3 will bind lessons to brittle DOM coordinates, pixel positions, or renderer-specific nodes instead of stable artifact-relative semantics.

Downstream dependence is immediate and concrete. D3 needs stable anchor identity, resolution semantics, and lesson-driving interaction slots. D5 needs comparison surfaces that visibly honor `semanticApplicability`, fidelity, and validation rather than flattening eras into one implied axis system. D4 needs to know which work belongs in the near-horizon foundation plans: shell refactor, token layer, performance harness, and possible React 19 renderer compatibility spikes.

## Option Space

The option space is inherited from R2 and is not re-invented here. What changes in deliberation mode is how each option behaves against the D1 artifact contract, the R1.5 envelope, and the seven cross-cutting constraints.

| Option | Inherited shape | What survives deliberation |
| --- | --- | --- |
| A. Continue hand-rolled SVG | Extend current bespoke SVG components and add linked behavior piecemeal. | Rejected as the architectural center. It preserves control but fails the duplication, shell-growth, migration, and escape-hatch requirements already visible in the repo. |
| B. Low-level visx primitive layer | Use low-level visx packages behind repo-owned primitives, avoid `xychart`. | Survives only as a **possible semantic SVG implementation family**, not as architecture, and package selection is currently provisional because stable low-level visx still peers only through React 18. |
| C. Canvas-first engine | Dense time-series engine with DOM/SVG only for overlays. | Survives as the dense-panel renderer family, but not as the only renderer because accessibility, semantic overlays, and educational anchors would become unnecessarily expensive. |
| D. Dual-renderer substrate | Separate stable contracts from renderer implementations and choose per view family. | Survives as the strongest contract-level answer. It aligns with the audit findings, the boundary memo, the R1.5 degradation order, and the vision horizon. |
| E. GPU/layer engine | WebGL/WebGPU-backed panels for dense spatial/event views. | Survives as a future third family, not as the first default. It remains useful headroom, not an immediate v1 foundation. |
| F. High-level all-in-one platforms | Prebuilt chart suites own more of the mark and interaction model. | Rejected as the conceptual center because branch lineage, fidelity, comparability, and lesson anchors are first-class here. |

The main deliberative move is therefore not "pick visx" or "pick Canvas." It is "close a substrate that allows semantic SVG, dense Canvas, and eventual GPU renderers to coexist under one artifact/interaction/anchor contract."

## Tradeoffs

### 1-year tradeoffs

The 1-year pressure is migration ergonomics. The repo already thinks in custom charts, not commodity dashboards. That favors a semantic SVG family first, because the current `SpeedProfileTrace`, `SoCTrace`, `SensitivityWaterfall`, `MetricTracePanel`, and `TrackMap` code can be migrated by extracting tokens, adapters, and interaction contracts instead of rewriting the product surface around a foreign grammar. The cost is that SVG/DOM density has a ceiling and low-level visx is not cleanly stable on React 19 today.

### 3-year tradeoffs

The 3-year pressure is coexistence of educational overlays and dense engineering views. A pure SVG plan starts to look fragile once branch comparison, observer overlays, and denser trace families arrive. A pure Canvas plan makes annotation anchors, screen-reader semantics, and keyboard focus substantially harder than they need to be. A dual-renderer substrate absorbs this better: semantic layers remain accessible and annotation-rich; dense panels switch renderer family only when the budget demands it.

### 5-year tradeoffs

The 5-year pressure is platform optionality. The vision explicitly extends to real-time strategy analysis, multi-regulation comparison, telemetry alignment, and role-based guided learning. The renderer contract therefore needs to outlast any single library. A package-level commitment now that collapses renderer, interaction, and anchor semantics into one vendor API would close the wrong doors.

### Dependency tradeoffs

- **D1 coupling:** D2 gets stability by consuming `ArtifactEnvelope<TPayload>` as fixed input. The cost is that D2 cannot invent alternate artifact identity or provenance shortcuts when renderer ergonomics would make that convenient.
- **D3 coupling:** C5 and C6 must be explicit enough that D3 can consume them without renegotiation. The cost is that D2 has to reserve guided-focus and anchor-fallback semantics now, before D3 authors actual lesson content.
- **D5 coupling:** D2 must surface `semanticApplicability`, fidelity, and validation state even before D5 closes the ontology. The cost is visible complexity in every comparison surface; the benefit is honesty.

### Accessibility and honesty tradeoffs

Accessibility and honesty are not optional overlays here. Semantic SVG/HTML is easier for focus management, ARIA, and readable fidelity badges. Dense Canvas is harder, but still viable if and only if it ships with an explicit accessible proxy layer and non-visual summaries. Any renderer path that hides fidelity or makes chart interaction mouse-only fails the memo's constraints even if it performs well.

## Gray Areas Still Unresolved

### [REVISIT-LATER] Exact SVG -> Canvas crossover points on apollo

This is load-bearing for implementation prioritization but not for contract closure. R1.5 provides bounded envelopes and a degradation order; it does not provide measured crossover points for this repo's real artifacts. A benchmark harness on the apollo client path is still required before treating any specific mark-count threshold as settled truth.

### [FOLLOW-AND-MARK] Whether low-level visx should be the first semantic SVG implementation

The audit response assumed low-level visx was a relatively safe first implementation. The 2026-04-11 registry check complicates that: stable `3.12.0` low-level visx packages still peer only through React 18, while React 19-compatible peers live only on `4.0.x-alpha`. This does not block C4 closure, but it does downgrade the package-level recommendation from "closed" to "provisional pending compatibility spike."

### [DEFER] Full panel-management system design

D2 must close where shell work lives and what contract it consumes, but it does not need to design every saved-layout, drag-resize, and persistence feature of a mature workspace manager. That work belongs in a follow-on foundation plan that consumes the `ViewRecipe` and `PanelSlot` contract closed here.

### [DEFER] Full design-system maturation

D2 needs tokens now because duplicated chart styling is already a problem. D2 does not need a full cross-product design system with every component state, motion rule, and documentation artifact. The correct near-term closure is "shared visualization tokens now, richer design system later."

### [REVISIT-LATER] Accessible narration for spatial relationships

Track maps and future dense spatial overlays can provide summary text and anchored callouts now, but a really strong accessible narration model for spatial relationships deserves dedicated follow-up once those views become central rather than reserved surfaces.

## Closure Analysis

### Contract 4 (renderer-agnostic visualization surface)

**Can this close now?** Partially. The contract layer can close now. The package-level initial implementation cannot honestly close beyond a provisional recommendation.

**Evidence warranting closure:**

- D1 already supplies the stable raw unit: `ArtifactEnvelope<TPayload>` with `artifactKey`, `runFamilyId`, provenance, and `anchorNamespace`.
- R2 already reframed the problem from library selection to substrate design.
- R1.5 already supplies the envelope and degradation order that make per-view-family renderer choice necessary rather than optional.
- The repo already shows bespoke chart families and duplicated SVG logic, proving the immediate problem is not greenfield library selection.

**Recommended C4 contract**

Close C4 on a three-layer surface:

```ts
type RendererFamily = "semantic-svg" | "dense-canvas" | "gpu-layer";

type ViewFamily =
  | "strategy-timeline"
  | "trace"
  | "waterfall"
  | "track-map"
  | "comparison-summary";

type ArtifactBinding = {
  runFamilyId: string;
  artifactKey: string;
  artifactId?: string;
  revision?: number;
};

interface ViewAdapter<TPayload, TViewModel> {
  viewFamily: ViewFamily;
  payloadSchemas: string[];
  fromArtifacts(input: {
    artifacts: ArtifactEnvelope<TPayload>[];
    recipeId: string;
  }): TViewModel;
}

interface RenderSurfaceProps<TViewModel> {
  panelId: string;
  viewFamily: ViewFamily;
  rendererFamily: RendererFamily;
  model: TViewModel;
  interactionBindings: string[];
  anchors: RenderAnchorDescriptor[];
  provenanceBadges: ProvenanceBadgeModel[];
  accessibility: AccessibleChartContract;
}
```

Interpretation:

- **Raw input to the panel-composition layer:** only D1 `ArtifactEnvelope<TPayload>` instances and recipe bindings. No renderer parses ad hoc route payloads or bespoke local objects directly.
- **Normalization layer:** each panel family owns a `ViewAdapter` that converts artifacts into a renderer-neutral view model. This is where payload extraction happens.
- **Renderer layer:** semantic SVG, dense Canvas, or future GPU renderers consume the view model plus shared interaction, anchor, provenance, and accessibility descriptors.

This closes the "what data shape charts consume" question precisely: **charts do not consume raw route JSON; panel compositions consume typed artifacts and expose renderer-neutral view models.**

**Renderer choice mechanism**

Close renderer choice on a **view-family registry plus degradation ladder**, not on ad hoc chart-level preference:

- `strategy-timeline`, `waterfall`, `comparison-summary`, and early `track-map` panels default to `semantic-svg`.
- Dense `trace` panels may begin on `semantic-svg` but are required to support `dense-canvas` promotion when the R1.5 nominal envelope is exceeded.
- `gpu-layer` remains reserved for future spatial/event-cloud views and should not be the first default family.

Renderer selection must consider:

1. view family
2. estimated mark density / addressable targets
3. active linked-panel count
4. client capability and viewport
5. current degradation step from R1.5

The degradation order is inherited unchanged from R1.5 and is binding:

1. preserve semantic correctness and stable anchors
2. aggregate or decimate dense series
3. lower live-update cadence
4. freeze hidden or inactive panels
5. switch dense panel family to Canvas/hybrid
6. cap visible strategies or require focus mode

**Initial implementation choice**

The initial implementation family should be **semantic SVG/DOM**, because that is the most migration-friendly and accessibility-friendly fit for the current repo and the current product phase. But the package label within that family cannot be closed strongly today:

- **Not warranted:** `@visx/xychart` as the initial foundation. Stable remains React 18-peered and still pulls `@react-spring/web`; the alpha line remains alpha.
- **Only provisionally warranted:** low-level visx as the first semantic SVG package set. Stable low-level visx still peers only through React 18 today; React 19 support exists on `4.0.x-alpha` only.
- **Warranted now:** close the semantic SVG family as the first renderer family and keep package selection behind it provisional between repo-owned primitives and a tightly scoped visx alpha compatibility spike.

This is deliberate push-back on label-level closure. The correct closure unit is "semantic SVG renderer family first," not "`visx` first" while the React 19 compatibility story is still partly alpha-only.

The first primitives to build in that family should be:

1. chart shell and provenance badge rail
2. shared axes, grids, and focus-ring primitives
3. line/area trace primitives for `trace` panels
4. event-band / interval primitives for `strategy-timeline`
5. anchor overlay and accessible proxy-target primitives

That order matches the current repo's migration seams and keeps the first implementation focused on reusable semantic layers rather than on one-off chart rewrites.

**Package/module layout**

Do not create a spray of new workspaces yet. The current `@f1-modeling/visuals` package is the right place to host the new substrate, but it needs internal boundaries:

- `src/contracts/` — view-family, renderer-family, anchor, provenance, and accessibility types
- `src/view-models/` — artifact-to-view-model adapters
- `src/interaction/` — shared interaction store and action definitions
- `src/renderers/semantic-svg/` — semantic SVG implementation
- `src/renderers/dense-canvas/` — dense trace implementation when needed
- `src/recipes/` — named view recipes and slot contracts
- `src/theme/` — shared visualization tokens
- `src/panels/` — composed panels that bind recipes, adapters, renderers, and badges

**Migration strategy for legacy SVG**

Close migration on **freeze + wrap + replace**, not rewrite-everything-now:

1. Freeze legacy hand-rolled SVG components for bug fixes only.
2. Extract shared tokens and the interaction contract first.
3. Introduce adapters that let legacy panels consume new provenance badges and shared interaction state without rewriting every renderer at once.
4. Migrate the highest-leverage families first: `SpeedProfileTrace`, `SoCTrace`, `SensitivityWaterfall`, `MetricTracePanel`, `TrackMap`.
5. Treat any new D2-era panel as substrate-native from day one.

**Accessibility, thin-client, and honesty treatment for C4**

- Every panel must visibly surface fidelity and validation state, and comparison panels must make mixed-fidelity sets explicit.
- Every comparison-capable panel must surface `semanticApplicability` (`direct`, `derived`, `family-specific`, `non-comparable`) in the visible legend/badge layer, not only in hidden metadata.
- `semantic-svg` is easier to make WCAG AA-compliant and should be preferred for annotation-rich and keyboard-heavy panels.
- `dense-canvas` is only valid if it ships with accessible proxy elements and non-visual summaries; otherwise it is not a valid closure path.
- Apollo-over-Tailscale is the closure baseline, so no interaction may rely on round-tripping to dionysus to stay responsive.

**Closure result for C4**

The **contract is strong enough to adopt now**, but the **initial package binding remains provisional**. C4 therefore closes as a **provisional recommendation**, not as a fully settled implementation choice.

### Contract 5 (shared interaction state contract)

**Can this close now?** Yes.

**Evidence warranting closure:**

- The current workspace state has no first-class shared interaction model, so the gap is real and local.
- R2 already identified shared cursor, brush, branch, annotation, and lesson-step state as load-bearing.
- R1.5 gives concrete latency budgets that rule out broad context fan-out as the only coordination strategy.
- D3 needs these semantics before it authors lesson overlays.

**Recommended C5 contract**

Close C5 on a selector-driven shared interaction store with explicit action semantics:

```ts
type DomainAxis = "lap" | "distance" | "time";

interface CursorState {
  axis: DomainAxis;
  value: number;
  sourcePanelId: string;
  mode: "hover" | "keyboard" | "lesson";
}

interface BrushState {
  axis: DomainAxis;
  start: number;
  end: number;
  sourcePanelId: string;
  committed: boolean;
}

interface SharedInteractionState {
  recipeId: string | null;
  focusedPanelId: string | null;
  cursor: CursorState | null;
  brush: BrushState | null;
  selectedStrategyIds: string[];
  selectedBranchId: string | null;
  pinnedAnchor: ArtifactAnchorRef | null;
  focusedLessonStepId: string | null;
}
```

**Propagation semantics**

- Panels publish shared state in **data coordinates**, never in pixels.
- Panels subscribe to slices of state relevant to their domain and view family.
- Renderers can emit actions, but do not own global state directly.
- Shared updates are synchronous and client-local; no interaction waits on server acknowledgement.
- Artifact refresh from D1 updates the view models; it does not redefine the interaction model.

**Ownership rules**

- **Local panel-only:** raw pointer coordinates, tooltip box placement, transient hover geometry.
- **Shared store:** cursor position, committed brush window, strategy selection, branch selection, pinned anchor, focused lesson step, focused panel, active recipe.
- **External controls rather than chart marks:** discrete branch selection, strategy visibility sets, recipe switching, and lesson-step stepping should be rendered through explicit accessible controls and mirrored into the shared store. They should not exist only as hidden chart gestures.
- **Lesson engine (D3):** may set `focusedLessonStepId`, `pinnedAnchor`, `recipeId`, or cursor/brush state only through the same action API used by the rest of the product.

**React model**

Close on **external-store semantics with selector subscriptions**, not on raw React context as the canonical mechanism. An internal `useSyncExternalStore` implementation or a store library with the same semantics is acceptable; a broad context value that forces all linked panels to re-render on every cursor change is not.

This is a contract-level closure, not a package-level closure. The important point is the subscription and ownership model.

**Keyboard semantics**

WCAG AA requires chart interaction to be keyboard-driven. Close C5 on these minimum semantics:

- `Tab` / `Shift+Tab` move between panel shells and explicit controls.
- Within a focused chart, arrow keys move the shared cursor one logical step on the chart's primary axis.
- `Shift+Arrow` extends or shrinks the committed brush window.
- `Home` / `End` jump cursor or brush edge to the domain bounds.
- `Enter` or `Space` pins or unpins the currently focused anchor/mark.
- `Escape` clears transient cursor/brush/pin state in a predictable order.
- Strategy, branch, and lesson-step selection must also exist as standard listbox/radio/button controls, not just chart shortcuts.

**Accessibility, thin-client, and honesty treatment for C5**

- Shared interaction state must remain meaningful when panels downgrade renderer family or enter focus mode.
- Interaction state must not encode fidelity or comparability implicitly; those states stay visible in the panel chrome and accessible description, and mixed-fidelity selections must surface a visible workspace-level "mixed fidelity" status whenever cursor, brush, or pinned-anchor state spans artifacts with different fidelity/validation states.
- The store carries data-domain values, so Apollo-side interactions remain local even when D1 artifacts arrive over a 20-80 ms RTT path.

**Closure result for C5**

C5 closes as a **recommendation**. The state shape, propagation rules, ownership model, and keyboard semantics are specific enough for D3 and future implementation work to consume without renegotiation.

### Contract 6 (annotation-anchor / view-recipe contract, renderer side)

**Can this close now?** Mostly. Anchor identity and resolution semantics can close now. The recipe schema can close now on the renderer side, but future D3 work may add content metadata around it.

**Evidence warranting closure:**

- D1 already closed the identity pieces D2 needs: `artifactKey`, `runFamilyId`, `anchorNamespace`, and provenance.
- R2 and R3 both converge on artifact-relative anchors rather than pixel-relative overlays.
- The boundary memo explicitly assigns renderer-side anchor closure to D2 and content-side consumption to D3.

**Recommended C6 contract**

Close C6 on logical-first anchors with optional instance pinning:

```ts
interface ArtifactAnchorRef {
  runFamilyId: string;
  artifactKey: string;
  anchorNamespace: string;
  anchorPath: string;
  artifactId?: string;
  revision?: number;
}

type AnchorResolutionStatus =
  | "resolved"
  | "artifact-missing"
  | "anchor-missing"
  | "filtered-out"
  | "not-applicable"
  | "renderer-unavailable";

interface ResolvedAnchor {
  ref: ArtifactAnchorRef;
  panelId: string;
  status: AnchorResolutionStatus;
  label: string;
  description?: string;
  geometry?: { x: number; y: number; width: number; height: number };
}
```

Interpretation:

- **Default lesson and overlay binding:** logical anchor identity via `runFamilyId + artifactKey + anchorNamespace + anchorPath`, so bindings survive branch exploration and artifact revision.
- **Exact replay or audit mode:** optional `artifactId` or `revision` pins to a specific artifact instance.
- **Anchor path semantics:** renderer-agnostic, artifact-relative paths such as `strategy/baseline/stint/2/event/pit-in`, never raw DOM ids.

**Binding and resolution semantics**

- Each renderer registers anchors into an `AnchorRegistry` as it renders a panel.
- SVG/HTML renderers may resolve anchors through DOM-backed geometry.
- Canvas renderers must resolve anchors through a maintained geometry map and expose an accessible proxy target; lack of DOM nodes is not an excuse to lack anchor resolution.
- Anchor resolution returns geometry, accessible label, and explicit failure reason codes so D3 can respond without guessing.

**Fallback rules**

Fallback must be explicit and typed, not silent:

- `artifact-missing`: the recipe requested an artifact that is not present in the current workspace or branch.
- `anchor-missing`: the artifact exists, but the referenced anchor path is absent in this payload revision.
- `filtered-out`: the artifact and anchor exist, but the current view window or filter hides them.
- `not-applicable`: the anchor exists only in a regulation family or semantic context that does not apply to the current comparison state.
- `renderer-unavailable`: the active renderer family cannot currently resolve the anchor because the necessary proxy layer or geometry map is absent.

The UI consequence is also part of the contract:

- fall back from mark-level callout to panel-level callout before dropping the lesson step entirely
- always expose the reason visibly and accessibly
- surface fidelity, validation, and comparability on the fallback panel too

**View-recipe format**

Close the renderer-side recipe format as the shell-facing contract:

```ts
interface ViewRecipe {
  recipeId: string;
  title: string;
  panelSlots: Array<{
    slotId: string;
    viewFamily: ViewFamily;
    preferredRenderers: RendererFamily[];
    artifactBindings: ArtifactBinding[];
    interactionBindings: DomainAxis[];
    annotationMode: "full" | "summary" | "off";
  }>;
  responsiveVariants: Record<"wide" | "narrow", string[]>;
  focusModeSlotId?: string;
}
```

This is intentionally the renderer-and-shell seam. D3 may later add lesson metadata that references a recipe, but D3 should not redefine slot ids, view families, artifact bindings, or responsive collapse order.

**Accessibility, thin-client, and honesty treatment for C6**

- Every anchor must carry a readable label and optional description. Visual-only anchors are invalid.
- Recipe-driven panel arrangements must preserve keyboard reachability and sensible focus order across wide and narrow variants.
- Fallback states must visibly and programmatically explain missing anchors, fidelity state, and non-comparability.
- Touch is not v1, but the anchor registry and interaction model must remain pointer-agnostic so touch handlers can be added later.

**Closure result for C6**

C6 closes as a **provisional recommendation**: anchor identity and resolution semantics are strong enough now, but D3 may still surface additive recipe metadata needs in the next deliberation pass.

## Outcome

| Item | Outcome | Warrant |
| --- | --- | --- |
| C4 | Provisional recommendation | Contract can close now; renderer family and migration shape are warranted; package-level initial implementation remains provisional because React 19-compatible low-level visx is still alpha-only and the benchmark harness has not yet measured crossover points. |
| C5 | Recommendation | State shape, propagation semantics, ownership, and keyboard semantics are specific enough to support implementation and D3 consumption now. |
| C6 | Provisional recommendation | Logical anchor identity, resolution, and fallback rules can close now; D3 may still add additive recipe metadata without reopening the renderer-side identity contract. |

## UI Discipline

### D2.A Workspace shell implications

The current shell cannot host the D2 substrate as-is. `App.tsx` fixes a three-zone tuple and `WorkbenchShell` types `zones` as exactly three entries. That is already too narrow for the R1.5 envelope, the audit's strategy-comparison and timeline pressure, and the view-recipe semantics closed above.

**Decision:** D2 closes the **shell contract** but scopes the **full shell implementation** out to a follow-on foundation plan.

Required shell handoff contract:

- The workspace shell must consume `ViewRecipe`, not a hardcoded tuple.
- Panel slots must be named and recipe-driven.
- The shell must support wide and narrow variants, plus focus mode when the degradation ladder reaches step 6.
- Layout persistence, drag-resize, and richer panel management are implementation questions for the follow-on plan, not for this deliberation.

Responsive treatment:

- `wide`: 3-4 visible panels
- `narrow`: stacked or two-column recipe variant with secondary panels collapsible
- `focus mode`: one active dense panel plus secondary summaries when budget or viewport requires it

**Disposition:** scoped out with handoff.

### D2.B Design system foundation

The duplicated `panelStyle`, `eyebrowStyle`, `titleStyle`, `chartFrameStyle`, and `axisTextStyle` constants across the visuals package prove that new renderer work cannot remain style-local. D2 therefore needs a shared token layer now.

**Decision:** close D2.B on **shared visualization tokens now; full design system later**.

Minimum token set required now:

- typography roles: panel title, eyebrow, body, mono axis/annotation text
- spacing, radius, border, elevation
- chart roles: axis, grid, guide, focus ring, overlay stroke/fill
- fidelity states: `placeholder`, `reduced-order`, `benchmarked`, `calibrated`, `validated`
- comparability states: `direct`, `derived`, `family-specific`, `non-comparable`
- semantic tones for strategy, warnings, selection, and branch differentiation

The handoff is straightforward: new D2-era components must consume shared tokens immediately; legacy panels may remain frozen until migrated.

**Disposition:** closed, with full design-system maturation deferred.

### D2.C Accessibility constraints

WCAG AA is a hard viability filter, not a nicety. D2 closes the substrate only if each contract remains accessible:

- **C4:** every panel needs programmatic title/summary, visible and non-color-only status badges, and renderer-family-specific accessible targets. Semantic SVG is the easiest first family. Canvas and future GPU are valid only with accessible proxy layers and non-visual summaries.
- **C5:** cursor, brush, and pinned-anchor flows must all be keyboard-driven. Shared state cannot be mouse-only. Discrete selection dimensions need explicit controls.
- **C6:** every anchor needs an accessible label; missing or non-applicable anchors need readable fallback explanations.

Accessible alternatives for visual information are mandatory:

- tabular summaries for dense traces
- event lists for timeline-heavy views
- textual comparison summaries when cross-era metrics are derived or non-comparable
- panel-level summary text for spatial views where full geometry cannot be narrated mark-by-mark

Hard spots remain real: dense Canvas hit-testing, spatial narration, and multi-series comparisons with many simultaneous encodings. Those do not justify deferral of the constraint; they justify rejecting renderer paths that do not solve them.

**Disposition:** closed as a hard commitment to WCAG AA minimum.

### D2.D Cross-device / thin-client rendering

Apollo-over-Tailscale is the baseline client path. D2 therefore closes the architecture on the assumption that the browser is the weaker machine and that interaction responsiveness must remain local.

Operational implications:

- UI interactions must operate on already-fetched artifacts and local shared state; no hover, scrub, or brush interaction may depend on server round-trips.
- Renderer promotion, decimation, focus mode, and panel freezing are all client-side degradation tools.
- Responsive variants belong in `ViewRecipe`; they are not afterthought CSS.
- Touch is not a v1 requirement, but input semantics must remain pointer-agnostic so touch handlers can be added later without breaking the store or registry contracts.

Empirical performance closure is still pending the benchmark harness from R1.5. That is a verification gap, not a reason to leave the architecture undefined.

**Disposition:** closed at the architectural level, with empirical verification deferred to the benchmark harness.

## Implications if Closed / Implications if Deferred

### If C4/C5/C6 are adopted as written

- Phase 4 foundation work must implement the view-adapter layer, interaction store, anchor registry, recipe contract, and token layer before adding new feature-heavy charts.
- D3 can bind lesson content to stable anchors and recipes without negotiating renderer details.
- D5 can assume comparison surfaces visibly surface `semanticApplicability`, fidelity, and validation rather than silently collapsing them.
- The migration of current SVG charts can be incremental and bounded.

### If C4 remains deferred past this round

- New panels will keep binding to ad hoc payloads and renderer-specific assumptions.
- The three-zone shell will continue to masquerade as a generic workspace and accumulate hidden constraints.
- Any future Canvas or GPU move will likely require redoing panel, anchor, and interaction semantics instead of only replacing renderer implementations.

### If C5 remains deferred past this round

- Linked brushing, keyboard navigation, lesson focus, and branch selection will almost certainly diverge into multiple incompatible state models.
- D3 will either block or invent a lesson-specific state substrate that later has to be reconciled.

### If C6 remains deferred past this round

- Lessons will bind to unstable DOM details or one-off renderer hooks.
- Cross-era and missing-artifact fallbacks will become bespoke exception handling instead of typed product behavior.

## Dependencies and Relations

### Depends on

- **D1 C3 strongly:** `ArtifactEnvelope<TPayload>`, `artifactKey`, `runFamilyId`, `anchorNamespace`, fidelity/validation provenance, `semanticApplicability`
- **R1.5 strongly:** UI/render envelope and degradation policy
- **R2 strongly:** option-space map and renderer-family reframing
- **Boundary memo strongly:** contract framing and seven cross-cutting constraints

### Affects

- **D3 strongly:** must consume `SharedInteractionState`, `ArtifactAnchorRef`, `ResolvedAnchor` failure modes, and `ViewRecipe` ids/slot semantics
- **D5 moderately:** must populate `semanticApplicability` so D2 surfaces mean something real
- **D4 strongly:** must plan shell implementation, token extraction, benchmark harness, and likely a package-compatibility spike before overcommitting to a semantic SVG package family

### Adjacent questions

- benchmark harness design and reporting
- long-horizon GPU/spatial renderer needs
- future layout persistence and workspace personalization
- full design-system maturation

### Coupling strength

- D2 <-> D3: tight
- D2 <-> D1: tight
- D2 <-> D5: medium
- D2 <-> D4: strong planning dependence

## Path of Deliberation

- **Entry point:** close C4, C5, and C6 under the boundary memo and D1 fixed input.
- **Branches considered:** semantic SVG first, low-level visx first, Canvas-first, dual-renderer substrate, shell-in-scope vs shell-adjacent, full design system now vs token layer now, anchor identity at logical vs instance level.
- **Branches pursued:** current repo code shape, D1 artifact semantics, R1.5 performance envelope, audit findings, and npm registry state for the React 19 / visx reality check.
- **Branches abandoned:** high-level chart-suite evaluation as a serious foundation answer; it remained too library-shaped for the repo's semantics.
- **Unexpected branch:** package metadata moved the low-level visx story from "probably fine" to "still partly alpha if React 19 compatibility matters honestly." That changed C4 from a likely closed implementation choice to a provisional one.
- **Dead end:** treating view recipes as purely renderer-internal. The shell coupling was too strong; the recipe format is necessarily a shell-facing seam.
- **Reframing:** the core question stayed contract-shaped, but the C6 recipe slice had to be reframed as renderer-plus-shell rather than renderer-only.
- **Push-back on the boundary memo:** limited and specific. The memo is directionally correct about contract ownership, but the view-recipe slice of C6 is not purely renderer-side in practice; it is a D2-owned contract that a later shell implementation must consume. That push-back does not reopen D1 or the seven cross-cutting constraints.

## Open Sub-questions

- Should the first semantic SVG implementation stay fully repo-owned, or is a tightly bounded visx 4 alpha spike worth the dependency risk?
- What exact view-recipe catalog should exist for the first D2-era workspace: `strategy.compare.4up`, `race.timeline.focus`, `branch.compare.dual`, and what else?
- What are the real Apollo crossover points for promoting traces from semantic SVG to dense Canvas?
- How much layout persistence belongs in the first shell follow-on plan versus a later workspace-personalization phase?
- What accessible summary form works best for future dense spatial and branch-divergence views?

## Decision Record

### Contract 4 (renderer-agnostic visualization surface)
- **Decision:** Accept (provisional on semantic-SVG package binding)
- **Rationale:** The three-layer substrate — `ArtifactEnvelope<TPayload> → ViewAdapter<TPayload, TViewModel> → RenderSurfaceProps<TViewModel>` with per-view-family renderer registry — is the right closure unit. It makes explicit that charts consume typed artifacts plus recipe bindings, not raw route JSON, and it lets semantic SVG, dense Canvas, and future GPU renderers coexist behind one artifact/interaction/anchor contract without collapsing renderer choice into a vendor API. D2's refusal to close at label level ("we picked visx") is exactly the epistemic move the initiative exists to enforce — the 2026-04-11 npm registry check (independently verified during Codex review) confirmed stable low-level visx still peers only through React 18 and React 19-compatible peers live on `4.0.x-alpha` only, which honestly downgrades package binding from "closed" to "provisional." The degradation ladder is inherited unchanged from R1.5 and is binding. The freeze-wrap-replace migration strategy for legacy SVG is pragmatic and avoids a big-bang rewrite of `SpeedProfileTrace`, `SoCTrace`, `SensitivityWaterfall`, `MetricTracePanel`, and `TrackMap`. Implementation commitment acknowledged: adding `src/contracts/`, `src/view-models/`, `src/interaction/`, `src/renderers/semantic-svg/`, `src/recipes/`, `src/theme/`, and `src/panels/` subdirectories inside `packages/visuals`; extracting shared tokens and interaction contract before migrating any legacy panel; treating any new D2-era panel as substrate-native from day one. One type surface is named in `RenderSurfaceProps` but not defined in the deliberation and must be closed during Phase 4 planning before any panel claims conformance against the contract: `AccessibleChartContract` — load-bearing for the D2.C WCAG AA commitment, since the commitment is only real once the contract has a concrete shape that panels can be checked against.
- **Open question accepted (deferred):** Whether the first semantic-SVG implementation should stay fully repo-owned or include a tightly bounded visx 4 alpha compatibility spike — decide during Phase 4 planning once the scope of first-primitive work is concrete.
- **Open question accepted (deferred):** Exact Apollo SVG-to-Canvas crossover points — requires the R1.5 benchmark harness on real apollo hardware, not a contract-level answer.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### Contract 5 (shared interaction state contract)
- **Decision:** Accept
- **Rationale:** C5 is the cleanest closure in D2. The `SharedInteractionState` shape (recipeId, focusedPanelId, cursor, brush, selectedStrategyIds, selectedBranchId, pinnedAnchor, focusedLessonStepId) with `CursorState` and `BrushState` in data-domain coordinates (not pixels) keeps interaction local to apollo and honors the R1.5 envelope's ≤50ms hover / ≤75-100ms brush budgets without depending on server round-trips. The ownership split between local-panel state (raw pointer, tooltip geometry), shared-store state (cursor, brush, selection, pin, focus), and external-control mirroring (branch, strategy, recipe, lesson-step as accessible controls) is exactly what lets linked brushing, keyboard navigation, and lesson focus share one substrate instead of inventing three. The external-store-with-selector-subscription semantics (not context fan-out) matches the R1.5 latency budgets. The keyboard semantics are concrete enough to implement without renegotiation: Tab/Shift+Tab between panels, arrow keys for cursor movement on the primary axis, Shift+Arrow for brush resize, Home/End for bounds, Enter/Space for pin, Escape for clear. The mixed-fidelity workspace-level status surfacing is the right operationalization of cross-cutting 7 — fidelity state cannot hide inside metadata once interaction spans artifacts of different fidelity tiers. Implementation commitment acknowledged: building the shared store inside `packages/visuals/src/interaction/`, defining a stable action API that D3 can drive without inventing lesson-specific state, ensuring discrete selection dimensions (branch, strategy, recipe, lesson step) ship as explicit listbox/radio/button controls alongside chart shortcuts.
- **Open question accepted (deferred):** Whether the store implementation uses internal `useSyncExternalStore` or a library with the same semantics — decide during Phase 4 planning. The contract closes the subscription model and ownership rules; the package name is not architecture.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### Contract 6 (annotation-anchor / view-recipe contract, renderer side)
- **Decision:** Accept (provisional on additive D3 recipe metadata)
- **Rationale:** The logical-first anchor identity (`runFamilyId + artifactKey + anchorNamespace + anchorPath`, with optional `artifactId` / `revision` only when pinning a specific historical instance) is the right choice — lessons and overlays survive branch exploration and artifact revision by default, and exact-replay mode remains available when audit semantics require it. The typed `AnchorResolutionStatus` union (`resolved | artifact-missing | anchor-missing | filtered-out | not-applicable | renderer-unavailable`) gives D3 explicit reason codes rather than silent failure, which matters for lesson authoring robustness and for honestly explaining missing artifacts in cross-era comparison contexts. D2's push-back that the view-recipe slice of C6 is a renderer-plus-shell seam rather than purely renderer-internal is correct and well-scoped — the `ViewRecipe` shape (recipeId, panelSlots with slotId/viewFamily/preferredRenderers/artifactBindings/interactionBindings/annotationMode, responsiveVariants, focusModeSlotId) is the seam the D2.A shell handoff will consume. The fallback UI rules (mark-level callout → panel-level callout → lesson-step drop; always surface reason visibly and accessibly; always preserve fidelity/validation/comparability labels through fallback) close the loophole where renderer silence would mask missing or non-applicable artifacts. Implementation commitment acknowledged: defining the anchor identity and resolution types in `packages/visuals/src/contracts/`, registering anchors through an `AnchorRegistry` that each renderer populates as it renders a panel (SVG via DOM-backed geometry, Canvas via maintained geometry map plus accessible proxy targets), wiring fallback paths into every panel family. The `AnchorRegistry` register/lookup/update/remove semantics are not fully specified in D2 and must be closed during Phase 4 planning before D3's anchor consumption lands, because D3's lesson bindings depend on the registry API being concrete.
- **Open question accepted (deferred):** What additive recipe metadata D3 may need for pedagogical sequencing — accepted as additive (not a reopening of anchor identity or resolution semantics). Handled in D3 or Wave 2B-iii if required.
- **Open question accepted (deferred):** The first concrete view-recipe catalog (`strategy.compare.4up`, `race.timeline.focus`, `branch.compare.dual`, etc.) — belongs in Phase 4 planning, not contract closure.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D2.A (workspace shell implications)
- **Decision / Scope disposition:** Scoped out with handoff — shell **contract** closed here (workspace shell must consume `ViewRecipe` and named panel slots, must support wide/narrow/focus-mode responsive variants tied to the R1.5 degradation ladder), shell **implementation** deferred to a follow-on foundation plan.
- **Rationale:** The hardcoded three-zone tuple in `App.tsx` and `WorkbenchShell` is already insufficient for the R1.5 envelope (3-4 visible wide panels), the audit's strategy-comparison and timeline pressure, and the view-recipe semantics C6 closed. But full shell design — layout persistence, drag-resize, richer panel management, saved workspaces — is Phase-4-adjacent implementation work, not deliberation work. The correct closure is the handoff contract (what the shell must consume and how it must respond), not a completed shell design. This matches the initiative's "separate stable boundary from varying implementation" pattern at the shell layer.
- **Handoff to:** Pre-Phase-4 visualization/workspace foundation plan, to be placed by D4 / Stage 3 synthesis. D2.A only asserts that it must land before substantial new D2-era view growth; exact placement (standalone decimal phase, folded into Phase 4, or earlier foundation phase) is D4's call.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D2.B (design system foundation)
- **Decision / Scope disposition:** Accept limited-scope closure — shared visualization tokens now, full design-system maturation deferred.
- **Rationale:** The duplicated `panelStyle`, `eyebrowStyle`, `titleStyle`, `chartFrameStyle`, and `axisTextStyle` constants across `packages/visuals` prove private styling is already a real problem, not a hypothetical one. The minimum token set (typography roles, spacing/radius/border/elevation, chart roles, `fidelity states` enum, `comparability states` enum, strategy/warning/selection/branch semantic tones) is concretely enumerated and implementable. A full cross-product design system with every component state, motion rule, and documentation artifact is not what D2 needs to unblock the substrate; that level of maturity belongs in a later phase when the product surface is more fixed. The "legacy panels frozen until migrated; no new D2-era panel may introduce private styling constants" rule matches the freeze-wrap-replace migration strategy from C4. Implementation commitment acknowledged: creating `packages/visuals/src/theme/` with the enumerated token set, wiring tokens through new substrate-native panels from day one, leaving legacy `SpeedProfileTrace` etc. on frozen styles until their C4 migration.
- **Handoff to:** Near-term token extraction alongside first C4 primitives in the visualization foundation plan. Full design-system maturation revisited at D4's roadmap synthesis or a later milestone.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D2.C (accessibility constraints)
- **Decision / Commitment level:** Accept as hard commitment — WCAG AA minimum is a viability filter, not a target.
- **Rationale:** Accessibility is already established as cross-cutting constraint 5 in the boundary memo and is directly motivated by the "serious platform that up-and-coming racing engineers would use" vision. Treating it as a substrate viability filter rather than a feature correctly rules out renderer paths that cannot meet it (mouse-only interaction, color-only encoding, purely-visual pattern recognition without accessible alternatives) and correctly preserves paths that can (semantic SVG with proper ARIA, Canvas with accessible proxy targets and non-visual summaries, keyboard-driven cursor/brush/selection/anchor-pin flows). The accessibility commitments are distributed across all three contracts (C4 panel titles/summaries/badges, C5 keyboard semantics for every shared state mutation, C6 accessible labels and readable fallback explanations on every anchor), which is the right architectural shape — accessibility can't be a single module bolted on later. The tabular/event-list/textual-summary fallback requirement for dense visualizations addresses the hard case honestly rather than waving it away. Implementation commitment acknowledged: every substrate-native panel must ship with programmatic title/summary, non-color-only fidelity and validation badges, accessible proxy targets for non-DOM renderers, keyboard semantics matching the C5 spec, and readable accessible text for every anchor. The `AccessibleChartContract` type referenced in `RenderSurfaceProps` must be defined during Phase 4 planning before any panel claims WCAG AA conformance against the contract (tracked as an obligation under C4).
- **Verification approach:** Automated axe-core or equivalent tooling against substrate-native panels in CI; keyboard-only walkthroughs of every new panel (cursor, brush, pin, recipe switching); screen-reader smoke-test on panel summaries and anchor labels; non-color-only fidelity/comparability state check per panel; explicit accessibility gate for any Canvas/GPU panel before it ships. Exact harness design belongs in Phase 4 planning.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D2.D (cross-device / thin-client rendering)
- **Decision / Commitment level:** Accept at architectural level, with empirical verification pending — Apollo-over-Tailscale is the reference client path. Empirical verification deferred to the R1.5 benchmark harness.
- **Rationale:** The deployment model is unambiguous: the browser runs on apollo (MacBook Air) over Tailscale to dionysus, so the browser is the weaker machine and every UI decision must assume that. D2 correctly translates this into concrete architectural constraints: no interaction may depend on server round-trips (hover, scrub, brush stay local to already-fetched artifacts and shared client-side state); responsive variants belong in `ViewRecipe`, not afterthought CSS; focus mode is part of the degradation ladder, not an escape hatch; touch is not v1 but the input model must remain pointer-agnostic so touch handlers can be added later without breaking the store or registry contracts. The 20-80ms Tailscale RTT is assumed rather than ignored. The open empirical question (actual SVG-to-Canvas crossover on apollo hardware) is a benchmark question, not a contract question — and it's the right shape of deferral because contract closure does not depend on the exact crossover threshold, only on the architectural commitment that a crossover path exists. Implementation commitment acknowledged: all substrate work must operate on artifacts already fetched into the shared store; the benchmark harness from R1.5 must be built before any specific mark-count threshold is treated as settled truth; touch handlers stay out of v1 but none of the v1 APIs may bake mouse-only assumptions into the substrate.
- **Verification approach:** Benchmark harness on real apollo-over-Tailscale hardware measuring p95 hover/brush latency, renderer promotion thresholds, responsive recipe variant behavior, focus-mode transitions, and degradation-ladder step crossings under representative artifact loads. Harness design deferred to Phase 4 planning (an explicit R1.5 open item). Until the harness lands, all crossover claims should be treated as provisional.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

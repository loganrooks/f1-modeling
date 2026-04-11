# Call 2B-i: D2 — Visualization Architecture Deliberation

**Wave:** 2b-i (first of the iterative D2 → D3 → optional D2 revision sequence)
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** Deliberation (closure attempted, deferral and reframing allowed)
**Question type:** Contract (interface specification — see BOUNDARY-CONTRACT-MEMO.md § Two Kinds of Questions)
**Closes:** C4 (renderer-agnostic visualization surface), C5 (shared interaction state contract), C6 (annotation-anchor / view-recipe contract — renderer side)
**Consumes (as hard constraints):** D1 decision anchor, R1.5 UI/rendering envelope, R2 research, BOUNDARY-CONTRACT-MEMO.md cross-cutting constraints
**Feeds:** D3 (educational content — which consumes D2's annotation anchor semantics and interaction state), D4 (long-horizon roadmap), synthesis stage

---

## MANDATORY: Read These Documents Before Any Task Work

In this exact order:

1. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodology. You are in **deliberation mode**, closing contract-shaped questions. Deferral and reframing are valid outcomes per § 10 "Deferral as a valid outcome."

2. `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md` — canonical framing for what you are closing. **Pay particular attention to:**
   - The "Two Kinds of Questions" section — you are closing contract questions, not ontology questions
   - The catalog entries for C4, C5, C6 (your scope)
   - The catalog entry for C3 (what D1 closed that you MUST consume, not redefine)
   - **Cross-Cutting Constraints sections 1-7** — these are the constraints that bind your deliberation. You must acknowledge all seven and design within them.

3. `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md` — D1's closed contracts. This is your fixed input for compute boundary, job protocol, artifact envelope, and regulation execution flow. You cannot redefine any of these; you must design the visualization substrate that consumes them.

4. `.planning/initiatives/vision-alignment-2026-04/deliberations/01-backend-boundary-architecture.md` — full D1 deliberation for detail on the artifact envelope spec (C3). **You especially need to understand the `ArtifactEnvelope<TPayload>` shape, the `artifactId`/`artifactKey`/`runFamilyId`/`anchorNamespace` semantics, the fidelity/validation provenance fields, and the reserved `semanticApplicability` slot.** Read § "Contract 3 (artifact / provenance contract)" (around line 382) carefully.

5. `.planning/VISION.md` — long-term platform vision. Visualization is "the product surface," not decoration. Anchor for everything.

6. `.planning/PROJECT.md` — current project definition

7. `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md` — R2 terrain map of visualization options, the reframing around substrate design, the option space (hand-rolled SVG, low-level visx primitives, Canvas-first engines, dual-renderer patterns, GPU/layer engines, high-level platforms), the React 19 visx reality check, the performance budget methodology pointer

8. `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md` — R1.5 output. The **Stratum A: UI/rendering envelope** is a hard input to your deliberation. Treat the 9 envelope dimensions as binding constraints. The **Stratum B: Job/compute envelope** is secondary context — you need to know what D1's backend produces and at what cadence, but you do not redesign the job envelope.

9. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — Findings #1, #2, #7, #8, #10, #13, #14 are directly in your scope

## Supporting reads (as needed for grounding)

- **Current visualization code:**
  - `packages/visuals/src/traces/SpeedProfileTrace.tsx` — representative hand-rolled SVG chart
  - `packages/visuals/src/traces/SoCTrace.tsx` — duplication of the same pattern
  - `packages/visuals/src/inspectors/SensitivityWaterfall.tsx` — waterfall chart
  - `packages/visuals/src/workspace/TrackMap.tsx` — bespoke SVG track rendering
  - `packages/visuals/package.json` — current dependencies (empty for visualization libraries)
- **Current workspace shell:**
  - `apps/web/src/App.tsx` — hardcoded three-zone layout (audit Finding #13)
  - `apps/web/src/app/useWorkspace.ts` — current workspace state model
  - `apps/web/src/features/` structure
- **Root `package.json`** — React 19.2.4 is the version you are targeting

## Package metadata to verify (as needed)

- `npm view @visx/shape version peerDependencies --json 2>/dev/null`
- `npm view @visx/scale version peerDependencies --json 2>/dev/null`
- `npm view @visx/axis version peerDependencies --json 2>/dev/null`
- `npm view @visx/brush version peerDependencies --json 2>/dev/null`
- `npm view @visx/tooltip version peerDependencies --json 2>/dev/null`
- `npm view @visx/responsive version peerDependencies --json 2>/dev/null`
- `npm view @visx/xychart version peerDependencies dependencies --json 2>/dev/null` — verify the react-spring trap is still real
- Any alternatives you consider (uPlot, ECharts, Plotly, deck.gl, Nivo, etc.)

---

## What You Are Closing

You are deliberating three coupled contracts that together constitute the **renderer-agnostic visualization substrate**:

### Contract 4: Renderer-agnostic visualization surface (C4)

The interface that lets visualization implementations (visx-based SVG primitives, Canvas, WebGL, hybrid) coexist behind a common API. You are closing:

- What data shape charts consume (how do they receive `ArtifactEnvelope<TPayload>` and extract what they need?)
- What interaction state charts expose
- How renderer choice is made per-view-family
- How migration between renderer families happens incrementally
- The package layout for visualization primitives vs. view compositions vs. renderer implementations
- Initial implementation choice (which primitives get built first, in which renderer family)
- Migration strategy for the existing ~2,736 LOC of hand-rolled SVG components

**Closure criteria:** Data shape contract + interaction state shape + renderer-family selection mechanism + initial implementation + migration path

**Label-trap reminder:** "we picked visx" is not a valid closure. "The renderer contract is X (consuming `ArtifactEnvelope<T>` via Y shape, exposing Z interaction state), the initial implementation is visx low-level packages because A (warranted by the react-spring trap avoidance, R1.5 envelope compatibility, and migration ergonomics from existing SVG), and the migration shape is B" IS a valid closure.

### Contract 5: Shared interaction state contract (C5)

Shared cursor position, brush window, selected branch, pinned annotation, focused lesson step. The state that links multiple panels (linked brushing across 4+ views) and that lessons can step through. You are closing:

- The state shape (what keys exist, what types)
- Propagation semantics (how updates flow between panels)
- Ownership rules (which component sets each piece of state; which consumes it)
- How this interacts with React's reactivity model (context, atoms, store, event-emitter)
- Keyboard control semantics (how cursor/brush/selection respond to keyboard input — see Cross-cutting 5 in the memo)

**Closure criteria:** State shape + propagation semantics + ownership rules + keyboard semantics

### Contract 6: Annotation-anchor / view-recipe contract (C6, renderer side)

How annotations attach to chart marks or artifact states. You are closing the **renderer side** of this contract; D3 will close the content side. You must design an interface that D3's lesson overlays can consume without renegotiation.

- Stable anchor identity scheme — how are anchors referenced (artifact-relative IDs like `strategy/baseline/stint/2/event/pit-in`, built on D1's `artifactKey` + `anchorNamespace`)
- Binding/resolution semantics (how does the renderer find the DOM element or Canvas pixel for a given anchor)
- Fallback rules (what happens when a bound artifact is absent or the anchor cannot be resolved in the current view state)
- View recipes — canonical panel arrangements that lessons can reference by name

**Closure criteria:** Anchor identity scheme + resolution semantics + fallback rules + view recipe format

---

## Cross-Cutting Constraints You Must Honor

From `BOUNDARY-CONTRACT-MEMO.md` § Cross-Cutting Constraints. Your deliberation must honor **all seven** constraints. Each of the seven imposes specific requirements on D2's closure:

### 1. Performance envelope (R1.5 hard input)

Consume `research/06-performance-envelopes.md` § Stratum A completely. The 9 UI envelope dimensions (visible strategies, linked panels, marks per panel, hover latency, brush latency, initial render, update cadence, memory ceiling, degradation policy) are binding constraints on your architecture. Any renderer choice or primitive layer design that cannot meet these envelopes is not a valid closure. The degradation policy sequence from R1.5 (preserve semantic correctness → aggregate/decimate → lower cadence → freeze inactive → switch dense panel family → cap visible strategies) should be reflected in your renderer-family selection mechanism.

Performance envelope closure must be on the **real client path (apollo over Tailscale)**, not on headless browsers on dionysus. This interacts with Cross-cutting 6 below.

### 2. Cross-era comparability affordance

Your visualization architecture must accommodate `direct`, `derived`, `family-specific`, and `non-comparable` semantic states across regulation eras (from D1 C3's reserved `semanticApplicability` slot). Comparison views and overlays must express these states visibly when they arise. Design the renderer contract to consume the `semanticApplicability` provenance field and surface it to the user; do not silently collapse all eras into one axis system.

### 3. Honesty constraints on placeholder vs real fidelity (architectural)

D1's artifact envelope includes `fidelityTier` and `validationState`. Your deliberation must design the renderer contract to consume these fields as constraints on rendering — not just as metadata to ignore. See Cross-cutting 7 for the UI-surface manifestation.

### 4. The label-trap

No closure at label level. "visx" / "Canvas" / "hybrid" are not valid closures. The contract is the closure; the initial implementation is downstream. Every architectural recommendation must name the contract first, then the implementation, then the warrant.

### 5. Accessibility as architectural constraint (added 2026-04-11)

**Required output:** for each of C4, C5, C6, explicitly address accessibility.

- **C4:** must support keyboard navigation for all interactive chart elements. Must preserve focus management, accessible name/role/value semantics across the renderer family. WCAG AA is the minimum. Screen reader must be able to announce chart content programmatically.
- **C5:** interaction state must be keyboard-driven, not mouse-only. Shared cursor, brush, selection must be reachable and modifiable via keyboard.
- **C6:** annotation anchors must carry accessible labels that screen readers can announce. Visual-only annotations are not conformant.
- **Rejection criterion:** if a renderer option cannot meet WCAG AA, it is not a valid closure for C4 unless paired with an explicit accessible alternative.

### 6. Thin-client responsive rendering (added 2026-04-11)

**Required output:** for C4 and C5, explicitly address the thin-client constraint.

- Apollo is a MacBook Air (thin client, 8-16GB RAM, browser-side rendering). Dionysus is the dev server (compute-side). Your rendering architecture runs on apollo, not dionysus.
- R1.5 envelope closure must be on the real client path.
- The hardcoded three-zone `App.tsx` layout is not sufficient even for the current dev scenario — your deliberation must address workspace shell implications (see Required Section 2 below).
- Touch support is not v1 but substrate must not preclude it.
- Assume Tailscale latency (20-80ms RTT) on live updates.

### 7. Honesty labeling visible in the UI (added 2026-04-11)

**Required output:** for each of C4, C5, C6, describe how fidelity/validation state is visibly surfaced.

- Every chart must display the fidelity state of the artifacts it renders (`placeholder`, `reduced-order`, `benchmarked`, `calibrated`, `validated`). The form factor is your design call — icon, color ribbon, corner label, status badge — but presence is mandatory.
- Comparison views mixing fidelity tiers must make the mixing explicit.
- If your renderer contract cannot accommodate fidelity markers, redesign the contract.

---

## Required Deliberation Format

Follow `RESEARCH-PRINCIPLES.md` § Required Output Sections for deliberation files. In addition to the standard sections, D2 has **four explicit required subsections** corresponding to the UI discipline concerns this initiative identified as cross-cutting.

### Standard mandatory sections

1. **Metadata** — date, mode, reasoning effort, inputs consumed
2. **Question** — the three contracts you are closing (C4, C5, C6) with any reframing from research
3. **Stakes** — what gets locked in or kept open; who downstream depends on each contract
4. **Option Space** — inherited from R2, not re-invented
5. **Tradeoffs** — tradeoffs across time horizons (1/3/5-year) and dependencies
6. **Gray Areas Still Unresolved** — three-response framework (defer / follow-and-mark / revisit-later)
7. **Closure Analysis** — per contract: can it be closed now? on what evidence? if not, why not?
8. **Outcome** — per contract: recommendation / provisional recommendation / deferral / reframing
9. **Implications if Closed / Implications if Deferred** — what follows from each outcome
10. **Dependencies and Relations** — especially: what D3 must consume from C5/C6, what constraints D5 inherits, what D4 should pick up for roadmap synthesis
11. **Path of Deliberation** — branching paths, pushback on the boundary memo (if any), reframings
12. **Open Sub-questions** — what you surface but do not resolve
13. **Decision Record** — empty template for user to fill in (see template below)

### Additional D2-specific required subsections

These subsections are mandatory and must be present somewhere in the deliberation (suggested location: a dedicated "UI Discipline" section, or embedded within the contract closures). They are the UI concerns that are cross-cutting-but-concrete for D2.

#### D2.A: Workspace shell implications

The current `apps/web/src/App.tsx` is a hardcoded three-zone layout. Phase 4 will need more: strategy comparison views, engineer-role views, qualifying session views, race timeline views, branch comparison views. Your visualization substrate needs a container to live in, and the container matters.

**Required:**
- Explicit analysis of whether your renderer contract can plug into the current shell, or whether the shell itself needs refactoring as part of D2's scope
- If the shell needs refactoring: sketch the panel-management approach (dynamic zones, named panel slots, workspace layout contract, etc.)
- If the shell refactor is out of D2 scope: explicit handoff to a future plan (which phase? what does the handoff contract look like?)
- Responsive layout treatment (breakpoints for thin-client rendering)

This is not asking you to design a full panel-management system. It IS asking you to close the question of where workspace shell work lives and what constraints it inherits.

#### D2.B: Design system foundation

The current hand-rolled SVG components duplicate `panelStyle`, `eyebrowStyle`, `titleStyle`, `chartFrameStyle`, `axisTextStyle` across every file (audit Finding #9). Your renderer contract will need a shared visual language — typography, color palette, spacing, iconography — even if a full design system is beyond D2's scope.

**Required:**
- Explicit analysis of the theming/design system scope D2 needs
- What shared constants / design tokens does the renderer contract depend on?
- Is a full design system in D2 scope, or is "shared theme constants" sufficient for v1 with full design system maturation deferred to a later phase?
- If deferred: what handoff contract exists between v1 theme constants and a future full design system?

The audit's "duplicated styling" finding should be resolved at least at the level where new D2-era components consume shared constants. Legacy components' migration is an implementation detail, not a D2 closure requirement.

#### D2.C: Accessibility constraints

Cross-cutting 5 requires accessibility as architectural constraint. This subsection operationalizes it for D2 specifically.

**Required:**
- For each of C4, C5, C6, explicit treatment of accessibility implications
- WCAG AA conformance as baseline — is it achievable with your recommended renderer? Where are the hard spots?
- Keyboard navigation design for interactive charts (linked cursor, brush, panel switching)
- Screen reader semantics — how does a chart announce its content programmatically?
- Accessible alternatives for inherently visual information (trends, patterns, spatial relationships)
- Any renderer option that cannot be made accessible must be either rejected or paired with an explicit accessible fallback

#### D2.D: Cross-device / thin-client rendering

Cross-cutting 6 requires thin-client constraints. This subsection operationalizes it for D2.

**Required:**
- Explicit treatment of the apollo-over-Tailscale client path for each contract
- Performance envelope closure must be on apollo, not on dionysus-local browsers
- What rendering optimizations are needed for MacBook Air class hardware?
- How does your architecture handle Tailscale latency (20-80ms RTT) in interaction responsiveness?
- Responsive design treatment for viewport variations (even if the primary target remains desktop)
- Touch support affordances (not required for v1 but substrate must not preclude adding handlers later)

### Decision Record template

```markdown
## Decision Record (to be filled by user)

### Contract 4 (renderer-agnostic visualization surface)
- Decision:
- Rationale:
- Date:
- Decider:

### Contract 5 (shared interaction state contract)
- Decision:
- Rationale:
- Date:
- Decider:

### Contract 6 (annotation-anchor / view-recipe contract, renderer side)
- Decision:
- Rationale:
- Date:
- Decider:

### D2.A (workspace shell implications)
- Decision / Scope disposition:
- Rationale:
- Handoff to: (phase or future plan)

### D2.B (design system foundation)
- Decision / Scope disposition:
- Rationale:
- Handoff to: (phase or future plan)

### D2.C (accessibility constraints)
- Decision / Commitment level:
- Rationale:
- Verification approach:

### D2.D (cross-device / thin-client rendering)
- Decision / Commitment level:
- Rationale:
- Verification approach:
```

---

## Decision Anchor Companion File

After writing the main deliberation, produce a decision anchor at `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md` (~1 page, dense). D3 will consume this anchor instead of re-reading the full deliberation. The anchor must include:

- One-paragraph summary of each closed/provisional/deferred contract (C4, C5, C6)
- The most important constraint each contract imposes on D3 specifically (D3 consumes C5 and C6 heavily; D3 binds lesson anchors to C6's renderer-side semantics)
- The most important constraint each contract imposes on D5 adjacently (renderer accommodation of `semanticApplicability` states)
- The most important open question each contract leaves unresolved
- Brief disposition on D2.A, D2.B, D2.C, D2.D (scope/deferral/commitment level for each)

Format should mirror `01-decision-anchor.md` — dense paragraphs, not bullet lists.

---

## Output Files

Write to:
- `.planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md` (main deliberation)
- `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md` (dense summary)

Use cat heredoc for both.

## Completion Signal

```
Wave 2B-i (D2) complete.
- deliberations/02-visualization-architecture.md (XXX lines)
- deliberations/02-decision-anchor.md (XX lines)

Contracts addressed:
- C4 (renderer-agnostic visualization surface): [closed/provisional/deferred/reframed]
- C5 (shared interaction state contract): [closed/provisional/deferred/reframed]
- C6 (annotation-anchor / view-recipe contract, renderer side): [closed/provisional/deferred/reframed]

UI discipline subsections:
- D2.A (workspace shell): [closed/scoped-out-with-handoff/deferred]
- D2.B (design system foundation): [closed/scoped-out-with-handoff/deferred]
- D2.C (accessibility constraints): [committed to level X]
- D2.D (cross-device / thin-client): [committed to level X]

Performance envelope integration: [consumed / partial]
Push-back on boundary memo: [yes — see section X / no]
R5 semanticApplicability accommodation: [explicit / implicit / deferred]
```

---

## Reminders

- **xhigh reasoning is for substantive deliberation** — use it. Don't rush to close.
- **Deferral is valid.** If a contract isn't ready to close, defer with closure criteria. Forced closure without warrant is worse than honest deferral.
- **Reframing is valid.** If D2 surfaces that the three contracts should be cut differently (e.g., C5 deserves its own deliberation, or C6 should split into renderer-side and content-side as two separate contracts closed by D2 and D3), say so and mark it as a finding. Push back on the boundary memo's framing.
- **Consume D1's decision anchor and R1.5 envelopes as hard constraints.** The artifact envelope shape is fixed; the performance envelope is a constraint your architecture must meet on the real client path.
- **No label-level closure.** Contracts first, implementations second, labels last.
- **The three UI discipline subsections (D2.A-D) are not optional.** They are the reason this deliberation exists in its current expanded form.
- **You are drafting the FIRST of a bidirectionally coupled pair.** D3 will be drafted next and will consume your C5/C6 closures. If D3 surfaces new requirements, a D2 revision call (2B-iii) may happen. Your current deliberation should be as complete as possible but should also mark where you expect D3 to surface adjustments — this helps the iterative review.
- **Accessibility (Cross-cutting 5), thin-client (Cross-cutting 6), and honesty labeling in UI (Cross-cutting 7) are binding.** They are in the memo. Acknowledge and design within them.

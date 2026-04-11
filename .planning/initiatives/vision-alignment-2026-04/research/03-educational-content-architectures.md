# Educational Content Architectures

## Metadata

- Date: 2026-04-10
- Mode: Terrain mapping
- Confidence: Medium

## Executive Summary

The current project vision and requirements clearly want lessons, tutorials, role-based learning paths, and progressive disclosure, but the repo only contains application state and engineering views; there is no first-class content model yet. The most important finding is that "learning views" is too UI-shaped a frame: serious interactive learning systems separate content graph, artifact bindings, and presentation format even when those pieces live in one repo. Public precedents split in a useful way: Observable and Distill emphasize live, explorable narrative; MyST/Jupyter Book emphasize structured documents, metadata, and executable content; Khan Academy and Brilliant emphasize progression, mastery, and guided interaction but expose much less of their internal schema publicly. The option space therefore centers less on MDX vs JSON and more on whether the platform treats lesson identity, prerequisites, and artifact anchors as first-class objects independent of any one authoring surface.

## Question as Received

The roadmap currently treats educational requirements as "learning views," but `VISION.md` describes structured lessons, tutorials, and progressive learning paths with interactive visualizations of increasing complexity. The task was to investigate how serious interactive learning platforms structure content as a first-class concern, including lesson schema, prerequisite graphs, role tags, difficulty/depth levels, lesson-to-simulation-artifact binding, content storage formats, and authoring workflow. The task also explicitly asked for the coupling back to visualization architecture: how lessons attach to chart state, how annotation anchors work, and how guided tours and overlays compose with engineering views.

## Reframing

The more useful question is not "what file format should lessons use?" but "what content graph and artifact-binding model lets lessons, overlays, and engineering views stay coupled without becoming the same thing?"

Why this reframing is better:

- Public precedents differ radically in syntax and runtime, but the durable distinction is whether concept graph and artifact graph are explicit.
- The repo vision wants the same platform to serve both learning and engineering workflows, which means lessons cannot be modeled as static pages detached from live artifacts.
- Visualization research shows that annotation anchors and shared interaction state are load-bearing; educational architecture has to reserve those concepts up front.

## Assumptions Surfaced

- Load-bearing: "learning views" are enough, meaning pedagogy can be expressed entirely as conditional UI presentation over engineering data.
- Load-bearing: one authoring format choice, such as Markdown or MDX, will determine the content architecture by itself.
- Load-bearing: lesson content can be attached to rendered charts after the visualization architecture is chosen.
- Role tags alone are sufficient to express educational pathways without an explicit prerequisite graph.
- The first author is a developer, so content architecture does not need a durable authoring/review workflow.
- Assessment hooks and mastery/progression can be postponed indefinitely without shaping early lesson structure.

## Option Space

### Option A: UI-embedded educational content

What it is:

- Keep lessons as text, overlays, and prompts embedded directly in React components or route-level feature code.
- Let the UI own both engineering views and pedagogical copy.

Trade-space:

- Known: lowest setup cost.
- Likely: fast for one-off explanatory panels and tooltips.
- Likely: weakest at supporting prerequisite graphs, reviewable content changes, and multi-role lesson reuse.
- Likely: makes content diff poorly because prose and interaction code intertwine.

### Option B: Document-first content in Markdown or MDX

What it is:

- Author lessons as Markdown or MDX with frontmatter.
- Use embedded components for charts, overlays, questions, and callouts.

Trade-space:

- Known: strong fit for narrative, reviewability, and content-as-code workflows.
- Likely: good for long-form role primers, tutorials, and assumption explainers.
- Likely: needs an additional binding layer if a lesson must attach to live artifact state, branch lineage, or chart marks.
- Plausible: can drift toward "documentation site beside the app" unless artifact bindings are explicit.

### Option C: Notebook-style reactive lessons

Representative precedents:

- Observable notebooks

What it is:

- Treat lessons as sequences of reactive cells that mix prose, code, controls, and outputs.
- Allow local exploration and derived views to live directly inside the lesson runtime.

Trade-space:

- Known: strongest fit for explorable explanations, parameter sweeps, and direct manipulation.
- Likely: excellent for concept labs and isolated "understand this subsystem" experiences.
- Likely: weaker fit for stable app-level navigation, typed prerequisite graphs, and shared production UI contracts unless wrapped by a broader content system.
- Plausible: strong inspiration for local lesson modules even if the final platform is not literally notebook-native.

### Option D: Structured technical publishing/book system

Representative precedents:

- MyST / Jupyter Book

What it is:

- Treat learning content as a project with metadata, table of contents, Markdown, notebooks, directives, and executable outputs.
- Separate project metadata from page content.

Trade-space:

- Known: strong structure for navigation, metadata, preview, and build validation.
- Likely: better than raw MDX when lessons need explicit project-level config, site generation, and notebook integration.
- Likely: still needs an app-specific artifact-binding layer if lessons must target live chart state rather than static document outputs.
- Plausible: strongest precedent for content graph discipline, even if the runtime UI remains the main app rather than a separate book site.

### Option E: Schema-first content graph

What it is:

- Model lessons as typed data objects such as `LessonUnit`, `LearningOverlay`, `PrerequisiteEdge`, `AssessmentHook`, and `ArtifactBinding`.
- Render those objects through one or more frontends: in-app views, guided overlays, or static exports.

Trade-space:

- Known: strongest for validation, prerequisite checking, and robust bindings to simulation artifacts.
- Likely: weakest for authoring comfort if the narrative body also has to live in raw JSON or TS object literals.
- Plausible: ideal as the structural backbone even if the narrative body is still written in Markdown, MDX, or notebook cells.

### Option F: Hybrid graph + body-format adapter

What it is:

- Keep first-class typed lesson graph and artifact bindings in structured data.
- Let the narrative body be authored in a chosen format such as Markdown, MDX, notebook cells, or TypeScript modules.
- Treat overlays and guided tours as view adapters over the same concept/artifact graph.

Trade-space:

- Likely: best at separating identity, progression, and validation from authoring syntax.
- Likely: higher initial design cost than choosing a single format.
- Plausible: the cleanest way to preserve optionality between developer-authored, content-author-authored, and AI-assisted workflows.

### Schema dimensions that appear load-bearing across options

These were consistently more important than the storage format itself:

- `LessonUnit` identity: `lessonId`, `conceptId`, `title`, `summary`, `roleTags`, `difficulty`, `depthLevel`.
- Progression: prerequisite edges, recommended-next edges, optional branch edges.
- Scenario context: which simulation scenario, regulation family, or session mode the lesson assumes.
- Artifact bindings: references to chart families, artifact ids, branch ids, lap windows, event ids, or mark ids.
- Pedagogical scaffolding: guiding questions, common misconceptions, expected takeaways, confidence/provenance notes.
- Assessment hooks: prompts, checks, or tasks that can validate learner interaction without needing a full LMS.
- Display contracts: overlay type, panel targets, tour sequencing, and fallback behavior when bound artifacts are absent.

### Content storage format families

- Markdown / MDX:
  - strong prose ergonomics
  - moderate metadata
  - requires structured binding escape hatches
- JSON / YAML:
  - strong validation
  - weak rich narrative ergonomics
- TypeScript modules:
  - strong type safety and colocated logic
  - risks conflating content with code
- Notebook cells:
  - strong reactivity and exploratory pedagogy
  - weaker global structure unless wrapped
- Hybrid:
  - strongest flexibility
  - requires explicit conventions to avoid chaos

### Integration patterns with engineering visualization

The coupling back to R2 is strongest around five patterns:

- Artifact-relative anchors: bind to stable ids such as `strategy/baseline/stint/2/event/pit-in` instead of screen pixels.
- View recipes: lessons reference a canonical panel arrangement and focused artifacts, not just a URL.
- Overlay layers: prompts, annotations, and warnings render above the same engineering primitives instead of duplicating charts in a lesson-only renderer.
- Guided state transitions: lessons can step the workspace through prepared states, but the underlying artifact remains inspectable and branchable.
- Fallback semantics: if a referenced artifact does not exist in the current run, the lesson should degrade to explanatory mode rather than silently fail.

### Authoring workflow dimensions

These dimensions surfaced as architecture concerns, not operational afterthoughts:

- Who authors:
  - developer-authored
  - domain/content-author-authored
  - AI-assisted draft with human review
- How content is reviewed:
  - code review only
  - content review plus technical verification
- How preview works:
  - hot-reload in the app
  - standalone lesson preview
  - snapshot of bound artifacts
- How validation works:
  - prerequisite ids exist
  - role tags are known
  - artifact bindings resolve
  - lesson graph is acyclic where required
  - scenario references still exist after schema changes

## Trajectory Analysis

### Option A: UI-embedded content

- 1-year trajectory: fast for a handful of overlays or role-specific helper panels.
- 3-year trajectory: likely becomes brittle as lessons multiply and prose diffs are buried in application code.
- 5-year trajectory: weak fit for a serious educational platform with multiple roles and structured learning paths.
- Doors opened: speed, direct proximity to the UI.
- Doors closed: content reuse, review clarity, and first-class prerequisite graphs.

### Option B: Markdown or MDX documents

- 1-year trajectory: strong for shipping initial primers and tutorials quickly.
- 3-year trajectory: remains useful if lessons can bind cleanly to app artifacts; weakens if bindings stay ad hoc.
- 5-year trajectory: durable as a body format, but only if identity and artifact bindings live elsewhere.
- Doors opened: approachable authoring, prose review, static exports.
- Doors closed: if over-relied on, can push the product toward detached docs rather than integrated learning surfaces.

### Option C: Notebook-style reactive lessons

- 1-year trajectory: excellent for explorable prototypes and subsystem labs.
- 3-year trajectory: can become a parallel product surface if not integrated with the app's typed artifacts.
- 5-year trajectory: strongest where exploratory pedagogy matters most; weaker as the only content system.
- Doors opened: live play, parameterized explanation, cell-level reuse, rich exploratory exercises.
- Doors closed: stable app IA and globally typed lesson graphs unless additional structure is added.

### Option D: Structured publishing/book systems

- 1-year trajectory: strongest immediate precedent for content project structure, frontmatter, and preview loops.
- 3-year trajectory: good for maintaining a coherent curriculum or reference track beside the app.
- 5-year trajectory: still valuable for exports and durable educational archives, even if the main lesson runtime becomes more app-native.
- Doors opened: metadata discipline, executable docs, multi-format export.
- Doors closed: some directness of attaching to live in-app state unless custom bridges are built.

### Option E: Schema-first content graph

- 1-year trajectory: setup-heavy but yields strong validation and integration leverage.
- 3-year trajectory: scales well as roles, lesson families, and artifacts multiply.
- 5-year trajectory: strongest backbone for the "same platform with educational scaffolding toggled on" vision.
- Doors opened: validation, adaptive navigation, prerequisite reasoning, renderer-independent bindings.
- Doors closed: ergonomic authoring if no narrative-friendly layer sits above it.

### Option F: Hybrid graph + body adapter

- 1-year trajectory: more design effort than single-format choices, but already aligned with the vision's dual education/engineering identity.
- 3-year trajectory: most resilient to authoring changes, AI assistance, and new surface types.
- 5-year trajectory: keeps lesson graph stable while allowing format evolution and export diversification.
- Doors opened: optionality without losing structural rigor.
- Doors closed: none by design, though it does add complexity and convention pressure.

## Precedent Analysis

### Observable notebooks

- Observable describes notebooks as interactive, editable documents defined by code, composed from cells that mix text, code, and outputs.
- The docs explicitly support imports from named cells, comments, history, collaboration, and embeddability in React apps.

Outcome:

- Strong precedent for explorable explanation and reusable reactive lesson components.
- Also a warning that notebook-native thinking privileges local exploration over globally typed curriculum graphs.

### MyST / Jupyter Book ecosystem

- MyST quickstart demonstrates project-level config via `myst.yml`, local preview, table-of-contents generation, and mixed Markdown plus Jupyter Notebooks.
- The tool positions itself as a way to create interactive websites from Markdown and Jupyter Notebooks while preserving structured metadata and build outputs.

Outcome:

- Strong precedent for separating project metadata, page content, and build artifacts.
- Useful model for lesson validation and preview workflows, even if the final runtime stays in the app shell.

### Distill

- Distill explicitly argued for explanations that are "native to the Web," reactive diagrams, and legitimacy for non-traditional research artifacts.
- The Distill guide exposes article front matter, citations, appendix sections, and custom components while preserving flexibility in repository structure.
- The interactive-articles paper frames interactive articles as a medium that combines narrative with details-on-demand, play, models, and simulations.

Outcome:

- Strong precedent for treating explanation artifacts as first-class web-native compositions rather than static side documentation.
- Also evidence that explanation quality depends on authoring infrastructure, not only on visualization libraries.

### Brilliant

- Public product pages emphasize interactive visualizations, hands-on exploration, and animated conceptual walkthroughs.
- Internal schema and authoring workflow are not publicly inspectable from available sources.

Outcome:

- Useful precedent for pedagogy centered on guided interactivity and challenge progression.
- Weak precedent for technical implementation details because the underlying content model is proprietary.

### Khan Academy

- Publicly visible mastery help-center material shows that the platform distinguishes skill-level mastery states from broader course and unit mastery, and uses challenge mechanisms to revisit previously learned skills.
- Internal course/skill graph representation is not publicly documented in a way that supports architecture-level reconstruction.

Outcome:

- Strong precedent for separating local lesson artifacts from longer-horizon progression and mastery tracking.
- Weak precedent for authoring internals; public evidence is product-behavior oriented rather than schema oriented.

### F1-specific adjacent resources

- FastF1 positions itself as access to lap timing, telemetry, position, tyre, weather, schedule, and session results, and points to example-gallery driven learning and downstream strategy/telemetry websites.
- OpenF1 exposes structured APIs for laps, stints, intervals, pit, race control, weather, and other session artifacts.

Outcome:

- These are not full learning platforms, but they are important adjacent precedents: in F1 today, public educational/engineering resources are artifact-rich and content-light.
- That strengthens the case that F1 Modeling Lab's educational system should bind to typed artifacts instead of duplicating a separate curricular world.

## Gray Areas Encountered

### [FOLLOW-AND-MARK] Authoring workflow moved into core architecture

Why it is load-bearing:

- A lesson architecture that cannot be reviewed, previewed, or validated is not a durable architecture; it is a sketch.

What I did:

- I treated authoring, preview, and validation as part of the option space rather than operational detail.

What remains:

- Precise tooling choices belong in later deliberation and implementation planning.

### [REVISIT-LATER] Mastery tracking and learner state

Why it matters:

- Role-based learning paths eventually want progress, mastery, and "what next?" logic.

Why it cannot close here:

- The current product is local-first, single-user, and not yet at the point where persistence semantics for learner state have been defined.

Future round needed:

- A focused question on whether the first educational architecture needs lightweight local progress tracking or whether lesson graph and assessment hooks are enough for v1.

### [DEFER] Full LMS-style assessment and grading

Why deferred:

- Assessment hooks are relevant, but course-grade semantics, reporting, and educator dashboards are out of lane for the current vision-alignment initiative.

Recommended pickup:

- Only if the project starts targeting classroom deployment or teacher workflow.

## Scope Expansion Notes

**Scope expansion encountered.**
Original framing: content schema and storage formats.
Expansion observed: authoring/review/preview/validation workflow.
Response: follow-and-mark.
Justification: serious content systems are defined as much by validation and preview loops as by file format; omitting workflow would make the schema analysis incomplete.

**Scope expansion encountered.**
Original framing: educational content architecture.
Expansion observed: explicit artifact-binding and visualization-anchor semantics.
Response: follow-and-mark.
Justification: lessons that cannot target stable engineering artifacts collapse back into detached documentation, which is exactly the gap the audits identified.

## Path of Inquiry

- Entry point: determine how "educational content as first-class concern" differs from the roadmap's current "learning views" framing.
- Branches considered: document-first systems, notebook systems, challenge/mastery systems, schema-first systems, and pure UI-embedded approaches.
- Branches pursued: Observable, MyST/Jupyter-style structure, Distill-style interactive narrative, public mastery-platform signals, and F1-specific artifact resources.
- Branches abandoned: deep reverse engineering of proprietary platforms such as Brilliant and Khan Academy internals, because public sources do not expose enough technical detail to warrant strong claims.
- Unexpected branches: authoring workflow and validation surfaced as inseparable from content architecture.
- Dead ends: trying to infer complete internal schemas from public product behavior on Khan Academy and Brilliant was not productive enough for strong architectural claims.
- Reframings: the effective question shifted from storage format to concept graph plus artifact-binding model; that shift became unavoidable once the visualization coupling was made explicit.

## Dependencies and Relations

Questions this depends on:

- R2 visualization at scale, strongly; lessons need stable anchors, shared interaction state, and overlay primitives.
- Existing vision/requirements work, strongly; especially EDU-01, EDU-02, EDU-03 and the "same platform with educational scaffolding toggled" claim.

Questions this affects:

- Future visualization deliberation, strongly; educational demands constrain primitive and renderer boundaries.
- Phase 4 planning, strongly; the roadmap likely needs first-class content work rather than only role-specific panels.
- Validation and calibration surfaces, loosely; lessons and confidence/provenance overlays should eventually align.
- Long-horizon roadmap synthesis, strongly; this is a product-scope question, not only a UI question.

Adjacent questions:

- Compute and streaming, loosely; live artifacts change lesson attachment semantics but do not define the content graph.
- Multi-regulation typing, loosely; regulation-aware lessons will eventually need typed era/context metadata.

Coupling strength:

- Tight with visualization architecture.
- Medium with validation/provenance systems.
- Loose-to-medium with compute and regulation work.

Cross-reference:

- See `02-visualization-at-scale.md` for the inverse analysis of how renderer and interaction choices constrain lesson overlays and guided exploration.

## Provisional Position

Likely: the durable educational move is to make lesson identity, prerequisites, role tags, artifact bindings, and overlay semantics first-class typed objects, while keeping the narrative body format separately swappable.

Known: the current repo does not yet have any first-class content architecture; it has workspace state, engineering views, and assumptions/provenance surfaces, but no lesson graph or artifact-binding model. Likely: choosing only MDX, only notebooks, or only TS modules would close the option space too early because the deeper question is whether the graph and bindings are explicit.

Plausible: a hybrid architecture is the cleanest long-horizon fit. That is not a final recommendation on format. It is a terrain-level observation that concept graph and artifact graph should outlive any one body syntax.

Confidence is Medium because public precedent is strong on patterns and weak on proprietary internal schemas.

## Confidence Ledger

1. Known: the project vision and requirements already demand role-based learning paths, structured lessons/tutorials, and progressive disclosure.
2. Known: the repo currently lacks a first-class lesson/content graph.
3. Likely: "learning views" alone are insufficient because they do not encode prerequisite structure, lesson identity, or durable artifact bindings.
4. Known: Observable, MyST, and Distill each separate content structure from final presentation in materially useful ways.
5. Likely: public mastery platforms imply the importance of progression state, but their internal schemas are too opaque for strong reconstruction.
6. Likely: artifact-relative anchors are the core integration pattern between lessons and engineering visualization.
7. Plausible: a hybrid graph + body-adapter architecture keeps the most doors open for the project's education-plus-engineering vision.

## Unresolved Questions

- What is the minimum viable `LessonUnit` schema for Phase 4 without overbuilding a curriculum platform?
- Should lesson bindings target artifact ids only, or also view recipes and workspace panel arrangements?
- Does v1 need persistent learner progress or only stateless lesson sequencing plus assessment hooks?
- Which body format best matches the first likely author: Markdown/MDX, TypeScript modules, or something notebook-like?
- How should lessons degrade when a referenced scenario, artifact, or role view is unavailable?

## References

- Vision educational platform and progressive-disclosure framing: `.planning/VISION.md:19`
- Visualization layer must support educational interactivity: `.planning/VISION.md:35`
- Educational requirements EDU-01, EDU-02, EDU-03: `.planning/REQUIREMENTS.md:99`
- Audit finding that "learning views" are not content architecture: `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md:113`
- Current workspace state model with no lesson/content graph: `apps/web/src/app/useWorkspace.ts:41`
- Current three-zone shell and current feature framing: `apps/web/src/app/App.tsx:185`
- Observable notebooks docs: https://observablehq.com/documentation/notebooks/
- MyST quickstart and project structure: https://mystmd.org/guide/quickstart
- Distill about page: https://distill.pub/about/
- Distill authoring guide: https://distill.pub/guide/
- Distill interactive-articles paper: https://distill.pub/2020/communicating-with-interactive-articles/
- Brilliant public product page example: https://brilliant.org/ai/
- Khan Academy mastery help-center articles:
  - https://support.khanacademy.org/hc/en-us/articles/5548760867853--How-do-Khan-Academy-s-Mastery-levels-work
  - https://support.khanacademy.org/hc/en-us/articles/115002552631--Beta-What-are-Course-and-Unit-Mastery-
  - https://support.khanacademy.org/hc/en-us/articles/360037494231-What-are-Mastery-Challenges
- FastF1 docs: https://docs.fastf1.dev/
- OpenF1 docs: https://openf1.org/docs/

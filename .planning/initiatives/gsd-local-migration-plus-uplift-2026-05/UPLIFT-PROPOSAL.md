# GSD Local Migration Uplift Proposal

**Date:** 2026-05-16  
**Target:** mainline GSD-1, upstream clone `/home/rookslog/workspace/projects/get-shit-done-upstream`, tag `v1.42.2`  
**Installed local version checked:** `/home/rookslog/.claude/get-shit-done/VERSION` = `1.42.2`  
**Proposal count:** 13 changes proposed across 10 audited surface families plus source-layer propagation supports

Citation note: upstream citations are relative to `/home/rookslog/workspace/projects/get-shit-done-upstream` unless a path starts with `.planning/` or `CLAUDE.md`, which refers to this repo. External product citations use their source URL.

## Executive summary

This proposal keeps the GSD-1 uplift narrow: make local phase planning aware of the F1 Modeling Lab doctrine files that already govern this repo, without converting mainline GSD into GSDR, without adding enforcement hooks, and without changing current upstream behavior for projects that do not opt in or do not have these files. The gap is not that GSD lacks planning structure. Upstream already carries CONTEXT, RESEARCH, PLAN, plan-check, execution, summary, and verification contracts. The gap is that those contracts stop at generic project context and per-phase decisions, while this repo now has load-bearing doctrine in `.planning/VISION.md`, `.planning/LONG-ARC.md`, `.planning/TECH-DEBT.md`, and `CLAUDE.md`.

The proposed path adds an optional "project doctrine" lane that flows through existing GSD-1 surfaces. CJS runtime init and SDK init would discover the optional doctrine files. Discuss/context generation would capture protected seams, explicit non-decisions, current posture, and future shape notes. Research would treat doctrine constraints with the same seriousness it already gives `CLAUDE.md` and locked CONTEXT decisions. Pattern mapping would distinguish real code analogs from doctrine-carrying seams. Planning would emit explicit `future_preservation`, `tech_debt_disposition`, and `doctrine_alignment` records in PLAN frontmatter. Plan-check and verification would then validate that these obligations were translated and either delivered, intentionally deferred, or surfaced as gaps.

Revision D narrows the propagation model: installed workflows invoke the CJS runtime under `get-shit-done/bin/`, while the SDK TypeScript/dist path is a packaged CLI surface. UPLIFT-01 therefore patches both CJS init and SDK init, and the proposal adds two source-backed support UPLIFTs for config schema parity and canonical doctrine artifact recognition.

The proposal also adds an optional Claude Design lane for UI-heavy phases. Claude Design can be useful for chat-to-canvas exploration, alternative layouts, inline design comments, exports, and Claude Code handoff, but in this workflow it should remain a design-prototype input. Accepted outputs become durable design briefs or canonical references in `.planning/`; they do not bypass discuss-phase, plan-phase, accessibility/performance planning, or verification.

The uplift is upstream-compatible if implemented as optional file-presence/config behavior. For this repo, it gives local GSD enough VISION/LONG-ARC awareness to preserve long-horizon capability while still keeping each phase bounded. The plan deliberately leaves hooks and generic context profiles out of runtime enforcement; they remain inventoried surfaces, not the right place to carry this doctrine.

## Scope and constraints recap

- Proposal only: this file proposes patches but does not apply upstream, local install, or user-scope patches.
- Target is GSD-1 mainline from canonical upstream `github.com/gsd-build/get-shit-done`, inspected in `/home/rookslog/workspace/projects/get-shit-done-upstream`.
- The inspected tag is `v1.42.2`, matching the installed user-scope version.
- Excluded sources were not used for the proposal: GSD-2 directories, get-shit-done-reflect, get-shit-done-reflect-phase-59, upstream-v1.36.0, and fork remote.
- The proposal must preserve GSD-1 semantics. No GSDR-style signal system, persistent knowledge base, reflection workflow, or validator lane is proposed.
- The proposal must respect local repo doctrine: planning artifacts live under `.planning/`; Future-Aware Planning Contract requires new CONTEXT files to carry protected seams/non-decisions/posture/future notes and new PLAN files to map material future-aware items to explicit dispositions `.planning/AGENTS.md:26-31`.
- Doctrine requirements come from `CLAUDE.md`: phase planning should include Future Awareness plus Vision Impact, Honesty Surface, Accessibility and Thin-Client, Performance Budget, Migration Discipline, and Phase-4 Contract Completion when relevant `CLAUDE.md:82-91`.
- Long-arc doctrine says current planning must preserve future seams without importing later scope, record explicit non-actions, and cite LONG-ARC when sequencing or seam decisions interact with posture `.planning/LONG-ARC.md:70-75`.

## Investigation log

| Step | Result | Evidence |
| --- | --- | --- |
| Confirmed local installed GSD version | User-scope install reports `1.42.2`; no repo-local installed VERSION was present. | Local filesystem check, 2026-05-16 |
| Confirmed upstream remote | Upstream clone has canonical `origin https://github.com/gsd-build/get-shit-done.git`; fork remote was not used. | `git remote -v`, 2026-05-16 |
| Fetched upstream | `git fetch origin` succeeded and included tag `v1.42.2`. | Command output, 2026-05-16 |
| Checked out upstream tag | Detached checkout at `v1.42.2`, commit `a7f0af2c`. | Command output, 2026-05-16 |
| Installed upstream dependencies | `npm install` succeeded; audit reported 7 vulnerabilities, which is recorded but did not block source investigation. | Command output, 2026-05-16 |
| Ran upstream tests | `npm test` succeeded: 1470 suites, 9211 tests, 9211 pass, 0 fail, duration about 71.3s. | Command output, 2026-05-16 |
| Recorded version metadata drift | At tag `v1.42.2`, package/test banner generated `1.50.0-canary.0` metadata. This is drift in package metadata, not a test failure. | Command output, 2026-05-16 |
| Searched upstream for local doctrine terms | No upstream source support found for `Vision Impact`, `Vision Alignment`, `LONG-ARC`, `VISION`, `Future Awareness`, `Honesty Surface`, `Accessibility and Thin-Client`, `Performance Budget`, `Migration Discipline`, `Phase-4`, `preserved_seam`, `future_preservation`, `tech_debt_disposition`, or `doctrine_alignment`, other than unrelated "Phase-4-Persistence" text and "REVISION" fixtures. | Search output, 2026-05-16 |
| Compared local doctrine to upstream contract | Upstream has generic context/planning/verification lanes, but not the F1 doctrine fields. | See matrices and per-change records below |
| Reviewed Claude Design fit | Claude Design is a research-preview Anthropic Labs tool for conversational design/prototype creation with canvas iteration, screenshots/codebase context, chat/comments, exports, sharing, and Claude Code handoff. The local briefing adds more operational guidance: design system setup is prerequisite work, dense prompts beat vague prompts, variations should precede refinement, Tweaks/comments/chat have different cost profiles, and Codex handoff is lower fidelity than Claude Code handoff. | `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/CLAUDE-DESIGN-GUIDE.md`; https://support.claude.com/en/articles/14604416-get-started-with-claude-design |
| Reviewed build/install/update propagation | The npm package ships `sdk/src` and `sdk/dist`, builds SDK before publish/test, installs the runtime `get-shit-done/` payload, and explicitly does not install `sdk/` under the runtime config directory. | `package.json:10-24`, `package.json:60-75`, `sdk/package.json:36-45`, `bin/install.js:8359-8366`, `bin/install.js:10040-10227` |
| Verified installed runtime command path | Installed user-scope GSD has `get-shit-done/bin/lib` but no `sdk/`; `gsd-sdk` resolves to npm cache, not the runtime directory. Runtime init commands route through CJS `get-shit-done/bin/gsd-tools.cjs` and `get-shit-done/bin/lib/init.cjs`. | Local filesystem checks, 2026-05-16; `get-shit-done/bin/gsd-tools.cjs:172-186`, `get-shit-done/bin/gsd-tools.cjs:829-837` |
| Reviewed config schema propagation | Config keys are accepted only when registered in CJS schema, mirrored into SDK schema, and documented; missing keys make `config-set` reject documented behavior or fail parity tests. | `get-shit-done/bin/lib/config-schema.cjs:3-13`, `sdk/src/query/config-schema.ts:1-15`, `tests/config-schema-sdk-parity.test.cjs:58-74`, `tests/config-schema-docs-parity.test.cjs:29-44` |
| Reviewed canonical artifact propagation | `gsd-health` uses the canonical artifact registry to flag unrecognized `.planning/` root files; proposed doctrine files are not currently canonical exact matches. | `get-shit-done/bin/lib/artifacts.cjs:1-9`, `get-shit-done/bin/lib/artifacts.cjs:13-26`, `get-shit-done/workflows/health.md:164-182` |
| Reviewed patch reapply verifier | `verify-reapply-patches.cjs` verifies backed-up modified installed files from `gsd-local-patches/`; it is not an API for registering source patches or overlay adapters. | `get-shit-done/bin/verify-reapply-patches.cjs:10-24`, `get-shit-done/bin/verify-reapply-patches.cjs:192-247`, `get-shit-done/workflows/reapply-patches.md:121-173` |

## Doctrine coverage matrix

| Doctrine requirement | Local source | Current upstream coverage | Proposed coverage |
| --- | --- | --- | --- |
| Future Awareness | `CLAUDE.md:82-85`, `.planning/AGENTS.md:26-31` | CONTEXT exists for decisions, but not future-aware seam categories `get-shit-done/templates/context.md:23-73`. | UPLIFT-02, UPLIFT-05, UPLIFT-06, UPLIFT-08 |
| Vision Impact | `CLAUDE.md:84-87` | No upstream doctrine-term support found in search; planner currently receives state/roadmap/requirements/context/research/patterns, not VISION `get-shit-done/workflows/plan-phase.md:829-846`. | UPLIFT-01, UPLIFT-02, UPLIFT-05, UPLIFT-06, UPLIFT-08 |
| Vision Alignment Checkpoint | `CLAUDE.md:82` (Key Conventions) | None - no upstream mechanism asks the question | UPLIFT-02 (CONTEXT generation includes a one-line Vision Alignment Checkpoint with justification when milestone-only), UPLIFT-06 (plan-checker verifies the Checkpoint is present and answered when doctrine is expected) |
| Honesty Surface | `CLAUDE.md:86-88`, `.planning/VISION.md:103-108` | Verification checks truths/artifacts/wiring, not fidelity/comparability visibility `get-shit-done/templates/verification-report.md:23-60`. | UPLIFT-05, UPLIFT-06, UPLIFT-08 |
| Accessibility and Thin-Client | `CLAUDE.md:86-89`, `.planning/LONG-ARC.md:31-37` | Generic planning and verification can mention accessibility only if manually captured; no typed planning field exists `get-shit-done/templates/phase-prompt.md:15-31`. | UPLIFT-05, UPLIFT-06, UPLIFT-08 |
| Performance Budget | `CLAUDE.md:86-90`, `.planning/TECH-DEBT.md:24-27` | Executor can record metrics in SUMMARY/state, but planner has no doctrine-specific performance budget field `agents/gsd-executor.md:566-604`. | UPLIFT-05, UPLIFT-07, UPLIFT-08 |
| Migration Discipline | `CLAUDE.md:86-91`, `.planning/TECH-DEBT.md:17-27` | REQUIREMENTS/CONTEXT decisions are checked, but tech-debt IDs are not first-class inputs `get-shit-done/workflows/plan-phase.md:1401-1516`. | UPLIFT-01, UPLIFT-05, UPLIFT-06, UPLIFT-09 |
| Phase-4 Contract Completion | `CLAUDE.md:86-91`, `.planning/TECH-DEBT.md:25-27` | No current upstream awareness of `AccessibleChartContract` or `AnchorRegistry` was found. | UPLIFT-05, UPLIFT-06, UPLIFT-08 |
| Protected seams and explicit non-decisions | `.planning/LONG-ARC.md:29-62`, `.planning/LONG-ARC.md:70-75` | Upstream context has Deferred Ideas and Claude's Discretion, but not protected seams/current posture/future shape notes `get-shit-done/templates/context.md:30-73`. | UPLIFT-02, UPLIFT-04, UPLIFT-05, UPLIFT-06 |
| Reduced-guarantee no-context planning is explicit | `.planning/AGENTS.md:26-31` | Upstream already warns when CONTEXT is absent `get-shit-done/workflows/plan-phase.md:282-330`. | UPLIFT-01 extends that warning to absent doctrine when doctrine is expected |
| Artifact role and consumption discipline | `.planning/ARTIFACT-GOVERNANCE.md` read during investigation; upstream reference says unread artifacts are inert. | Upstream artifact taxonomy already states artifacts need consumers to matter `get-shit-done/references/artifact-types.md:1-6`. | UPLIFT-10 documents doctrine consumers instead of creating inert docs |
| Design exploration becomes phase contract only after review | `CLAUDE.md:82-91`, `.planning/AGENTS.md:26-31` | Upstream planner can receive `UI_SPEC_PATH` and `SKETCH_FINDINGS_PATH`, but no external design-prototype lane is defined `get-shit-done/workflows/plan-phase.md:839-841`. | UPLIFT-11 converts reviewed Claude Design output into durable CONTEXT/design refs, not direct execution authority |

## Surface inventory (10 families)

| Family | Current upstream surface | Proposed status |
| --- | --- | --- |
| 1. Workflows | `discuss-phase` generates CONTEXT and feeds researcher/planner `get-shit-done/workflows/discuss-phase.md:36-44`; `plan-phase` loads CONTEXT/RESEARCH/PATTERNS into planner `get-shit-done/workflows/plan-phase.md:829-846`; `execute-phase` passes CONTEXT/RESEARCH to rich prompts `get-shit-done/workflows/execute-phase.md:117-125`; `verify-phase` checks must-haves and decisions `get-shit-done/workflows/verify-phase.md:53-93`, `get-shit-done/workflows/verify-phase.md:189-225`. | Touch `discuss-phase`, `plan-phase`, `execute-phase`, `verify-phase`; touch `new-project` only to document optional doctrine scaffolding; touch `add-phase` only to mention doctrine carry-forward in next-step text if configured; add an optional design-prototype lane for UI-heavy phases before or alongside discuss-phase. |
| 2. Agents | Planner produces PLANs `agents/gsd-planner.md:421-456`; researcher treats `CLAUDE.md` constraints as authoritative `agents/gsd-phase-researcher.md:70-80`; pattern mapper consumes CONTEXT/RESEARCH `agents/gsd-pattern-mapper.md:46-74`; plan-checker verifies CONTEXT decisions `agents/gsd-plan-checker.md:300-312`; executor creates SUMMARY `agents/gsd-executor.md:565-604`; verifier creates VERIFICATION and distrusts SUMMARY claims `agents/gsd-verifier.md:14-23`. | Touch planner, phase-researcher, pattern-mapper, plan-checker, executor, verifier. No immediate change to roadmapper/project-researcher except optional new-project scaffolding docs. |
| 3. Templates | CONTEXT template captures phase boundary, decisions, canonical refs `get-shit-done/templates/context.md:23-73`; PLAN template has must_haves but no doctrine fields `get-shit-done/templates/phase-prompt.md:15-31`; verification template has truth/artifact/wiring tables `get-shit-done/templates/verification-report.md:23-60`; CLAUDE template is generated from PROJECT/STACK/CONVENTIONS/ARCHITECTURE sections `get-shit-done/templates/claude-md.md:1-8`. | Touch CONTEXT, PLAN, planner-subagent, SUMMARY, VERIFICATION, CLAUDE template docs, and add DESIGN-SYSTEM, DESIGN-BRIEF, and DESIGN-HANDOFF templates for reviewed external prototypes. |
| 4. References | Agent contracts define handoffs `get-shit-done/references/agent-contracts.md:44-64`; artifact types define consumed-by relationships `get-shit-done/references/artifact-types.md:1-39`. | Touch references to define the optional doctrine contract and consumers. |
| 5. Commands | Command stubs route to workflows and expose flags; plan-phase flag list is already dense `commands/gsd/plan-phase.md:1-16`, `commands/gsd/plan-phase.md:41-56`; discuss/execute/verify stubs resolve context inside workflows `commands/gsd/discuss-phase.md:41-45`, `commands/gsd/execute-phase.md:43-59`, `commands/gsd/verify-work.md:28-34`. | Avoid adding a new slash command. Optionally add one argument hint/config note only if implementation chooses explicit opt-in. |
| 6. Contexts | Context profiles guide output style, not planning doctrine `get-shit-done/contexts/dev.md:1-21`, `get-shit-done/contexts/research.md:1-22`. | No runtime change. Keep doctrine in planning artifacts, not generic output profiles. |
| 7. SDK and CJS runtime utilities | Phase init returns context/research paths but not doctrine paths in both SDK and CJS runtime surfaces `sdk/src/query/init.ts:500-539`, `sdk/src/types.ts:870-882`, `get-shit-done/bin/lib/init.cjs:288-350`; execute/phase-op init has the same artifact path pattern `sdk/src/query/init.ts:820-850`, `get-shit-done/bin/lib/init.cjs:790-845`. Installed workflow commands route through CJS `gsd-tools.cjs`, while `sdk/dist` is the packaged SDK CLI path `get-shit-done/bin/gsd-tools.cjs:172-186`, `get-shit-done/bin/gsd-tools.cjs:829-837`, `bin/install.js:8359-8366`. | Touch CJS init, SDK init/types, generated `sdk/dist`, and tests to expose optional `vision_path`, `long_arc_path`, and `tech_debt_path`. Add CJS/SDK parity-oriented assertions so the installed runtime and SDK do not drift. |
| 8. Hooks | Hooks are runtime guardrails such as context monitor warnings `hooks/gsd-context-monitor.js:3-18`. | No doctrine enforcement hook. Codex has no hook support in this repo runtime, and doctrine should flow through planning/verification artifacts. |
| 9. Tests | Upstream has template tests `tests/template.test.cjs:6-11`, size-budget tests for agents/workflows `tests/agent-size-budget.test.cjs:6-20`, `tests/workflow-size-budget.test.cjs:5-21`, context coverage tests `tests/bug-2492-context-coverage-gate.test.cjs`, CJS init path tests `tests/init.test.cjs:70-89`, config schema parity tests `tests/config-schema-sdk-parity.test.cjs:58-74`, and docs parity tests `tests/config-schema-docs-parity.test.cjs:29-44`. | Add targeted tests for doctrine paths across CJS and SDK, template sections, planner/plan-checker/verifier prompt coverage, design-brief ingestion, config docs/schema parity, canonical artifact recognition, and budget compliance. |
| 10. Docs | Upstream docs include command/config/user-guide surfaces; artifact and agent references are source-like docs. Config docs must stay in lockstep with schema `tests/config-schema-docs-parity.test.cjs:7-14`. | Touch configuration/user guide/references only enough to document optional doctrine files, optional config keys, optional Claude Design/design-prototype input, the local Claude Design briefing, the canonical artifact role, and the no-hook/no-command stance. |

## Per-change records UPLIFT-01..N

### UPLIFT-01 - Add optional doctrine artifact discovery to CJS and SDK init

- **Surface:** CJS runtime init, SDK init/types/dist, workflows, tests.
- **Current behavior with source citations:** `init.phase-op` and related init handlers expose phase paths such as `context_path`, `research_path`, `verification_path`, and `reviews_path`, but no project-doctrine paths in SDK `sdk/src/query/init.ts:500-539`, `sdk/src/query/init.ts:820-850` or installed CJS runtime `get-shit-done/bin/lib/init.cjs:288-350`, `get-shit-done/bin/lib/init.cjs:790-845`; SDK types include `context_path` and `research_path` but no doctrine path fields `sdk/src/types.ts:870-882`. Installed workflow commands route through CJS `gsd-tools.cjs`, not through a runtime-local SDK directory `get-shit-done/bin/gsd-tools.cjs:172-186`, `get-shit-done/bin/gsd-tools.cjs:829-837`, `bin/install.js:8359-8366`.
- **Proposed behavior:** Add optional `vision_path`, `long_arc_path`, and `tech_debt_path` to relevant init results when `.planning/VISION.md`, `.planning/LONG-ARC.md`, and `.planning/TECH-DEBT.md` exist. Add `doctrine_expected: true` when any of these files exist or `workflow.project_doctrine` is enabled.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Enables the planning sections required by `CLAUDE.md:82-91` to receive their source artifacts instead of relying on a human to remember them.
- **Patch sketch:** Update `get-shit-done/bin/lib/init.cjs` result assembly for installed workflow use; update `sdk/src/query/init.ts`, `sdk/src/types.ts`, and generated `sdk/dist` via `npm run build:sdk`; add fixtures in `tests/init.test.cjs`, `sdk/src/query/init.test.ts`, and phase-runner type tests; in `plan-phase`, display a reduced-guarantee warning when doctrine is expected but absent.
- **Contract dependencies:** Depends on UPLIFT-12 for config activation semantics and UPLIFT-13 for canonical doctrine artifact status. Feeds UPLIFT-02 through UPLIFT-08.
- **Upstream-compatible?** Configurable. Existing projects see null/absent fields unless files or config exist.
- **Risk:** Low technical risk; medium prompt-budget risk if workflows inline too much doctrine.
- **Testability:** Unit tests for CJS init JSON and SDK init JSON with zero, one, and all doctrine files; snapshot/shape tests for type exports; build check that `sdk/dist` reflects the TypeScript changes.
- **Rollback strategy:** Remove new fields and workflow references; existing context/research path behavior remains unchanged.

### UPLIFT-02 - Extend CONTEXT generation with Future-Aware Planning blocks

- **Surface:** `discuss-phase`, CONTEXT template, tests.
- **Current behavior with source citations:** Discuss-phase's job is to capture decisions for researcher and planner `get-shit-done/workflows/discuss-phase.md:36-44`; the CONTEXT template has phase boundary, decisions, specifics, canonical refs, and code context but no protected seams/current posture/future shape block `get-shit-done/templates/context.md:23-73`; canonical refs are already mandatory `get-shit-done/templates/context.md:341-351`.
- **Proposed behavior:** When doctrine files exist, the generated CONTEXT includes a `## Future Awareness` section with `Protected Seams`, `Explicit Non-Decisions`, `Current Posture`, and `Future Shape Notes`. The section should cite which items were imported from `.planning/LONG-ARC.md` and which were judged not relevant to the phase. It should also include `## Vision Impact` when `.planning/VISION.md` materially affects the phase. Additionally, when `VISION.md` exists or `workflow.project_doctrine` is enabled, the generated CONTEXT must include a one-line `## Vision Alignment Checkpoint` answering "Does this phase serve the long-horizon vision, or only the immediate milestone?", and if milestone-only, record why the work is still justified.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Implements Future Awareness and Vision Impact expectations from `CLAUDE.md:82-87` and the planning contract in `.planning/AGENTS.md:26-31`.
- **Patch sketch:** Update `get-shit-done/templates/context.md`; update `workflows/discuss-phase/templates/context.md` if separate; update discuss-mode output instructions to load doctrine paths from init and summarize only relevant doctrine; add test fixtures for context generation.
- **Contract dependencies:** Depends on UPLIFT-01; feeds UPLIFT-03, UPLIFT-04, UPLIFT-05, and UPLIFT-08.
- **Upstream-compatible?** Configurable. Could be file-presence-only with no behavior change for projects without doctrine files.
- **Risk:** Medium. If the prompt over-imports VISION, phases could absorb future scope. Mitigate by requiring explicit non-action and "not current scope" notes.
- **Testability:** Context template tests; discuss-mode tests that generated CONTEXT has required headers only when doctrine exists.
- **Rollback strategy:** Remove the new template section and discuss instructions; phase CONTEXT files remain valid because the additions are additive Markdown.

### UPLIFT-03 - Carry doctrine constraints through phase research

- **Surface:** `gsd-phase-researcher`, RESEARCH template/docs, tests.
- **Current behavior with source citations:** The phase researcher already extracts actionable `CLAUDE.md` directives into `## Project Constraints (from CLAUDE.md)` and treats them with the same authority as locked CONTEXT decisions `agents/gsd-phase-researcher.md:70-80`; it copies user constraints from CONTEXT first in RESEARCH `agents/gsd-phase-researcher.md:94-109`; it currently reads CONTEXT but not VISION/LONG-ARC/TECH-DEBT `agents/gsd-phase-researcher.md:590-618`.
- **Proposed behavior:** Add `## Project Doctrine Constraints` after User Constraints when doctrine files exist. The researcher should identify technical implications of protected seams and tech-debt triggers without researching alternatives to locked decisions.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Supports Honesty Surface, Accessibility and Thin-Client, Performance Budget, Migration Discipline, and Phase-4 Contract Completion by giving the planner researched implications for `CLAUDE.md:86-91`.
- **Patch sketch:** Add doctrine file paths to researcher prompt from plan-phase; update researcher instructions to extract only actionable constraints; update RESEARCH output checklist; add tests that RESEARCH includes doctrine constraints when paths are supplied.
- **Contract dependencies:** Depends on UPLIFT-01 and UPLIFT-02; feeds UPLIFT-04 and UPLIFT-05.
- **Upstream-compatible?** Yes, if optional.
- **Risk:** Medium. Researcher might over-index on long-arc ambition. Mitigate with a "preserve, do not implement future scope" rule from `.planning/LONG-ARC.md:70-75`.
- **Testability:** Agent prompt static tests; fixture-driven RESEARCH output tests; size-budget test.
- **Rollback strategy:** Remove researcher doctrine section; planner still receives CONTEXT and can function normally.

### UPLIFT-04 - Teach pattern mapping to surface doctrine-carrying seams

- **Surface:** `gsd-pattern-mapper`, PATTERNS.md, tests.
- **Current behavior with source citations:** Pattern mapper extracts files from CONTEXT/RESEARCH, classifies them, and writes PATTERNS.md for planner consumption `agents/gsd-pattern-mapper.md:22-29`; it treats CONTEXT sections as decisions/discretion/deferred ideas and RESEARCH sections as stack/patterns/examples `agents/gsd-pattern-mapper.md:46-74`; no current input covers protected seams or tech-debt IDs.
- **Proposed behavior:** Add a `## Doctrine-Carrying Seams` section to PATTERNS.md when doctrine constraints mention files, package boundaries, execution boundaries, visual substrate, artifact envelopes, or tech-debt IDs. The mapper should separate "copy this code pattern" from "preserve this seam".
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Supports Migration Discipline and Phase-4 Contract Completion from `CLAUDE.md:86-91`, especially where `.planning/TECH-DEBT.md:17-27` names transitional seams.
- **Patch sketch:** Extend mapper prompt; add PATTERNS template guidance; update planner prompt to read the new section; add pattern-mapper tests.
- **Contract dependencies:** Depends on UPLIFT-02/03; feeds UPLIFT-05.
- **Upstream-compatible?** Yes. PATTERNS.md is already optional and planner-consumed.
- **Risk:** Low to medium. Misclassification could make doctrine look like implementation instruction. Mitigate with explicit "seam, not task" wording.
- **Testability:** Fixture with a tech-debt ID and protected seam; assert PATTERNS contains doctrine seam notes but no implementation task.
- **Rollback strategy:** Drop the section; normal pattern assignment remains.

### UPLIFT-05 - Add doctrine fields to PLAN format and planner obligations

- **Surface:** `gsd-planner`, `plan-phase`, PLAN template, planner-subagent template, tests.
- **Current behavior with source citations:** Planner prompt reads state, roadmap, requirements, CONTEXT, RESEARCH, PATTERNS, verification, reviews, UI/spec, spike, and sketch findings `get-shit-done/workflows/plan-phase.md:829-846`; PLAN structure has frontmatter fields and `must_haves` but no `future_preservation`, `tech_debt_disposition`, or `doctrine_alignment` fields `agents/gsd-planner.md:421-456`; planner currently honors CONTEXT and RESEARCH `agents/gsd-planner.md:990-999`.
- **Proposed behavior:** Add optional PLAN frontmatter:
  - `future_preservation`: each material future-aware item mapped to `preserved_seam`, `sequencing_choice`, `validation_task`, or `explicit_non_action_rationale`.
  - `tech_debt_disposition`: tech-debt IDs touched, paid down, preserved, or intentionally not touched.
  - `doctrine_alignment`: short entries for Vision Impact, Honesty Surface, Accessibility and Thin-Client, Performance Budget, Migration Discipline, and Phase-4 Contract Completion when relevant.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Directly implements the section list in `CLAUDE.md:82-91` and the PLAN mapping rule in `.planning/AGENTS.md:26-31`.
- **Patch sketch:** Update `agents/gsd-planner.md`, `get-shit-done/templates/phase-prompt.md`, `get-shit-done/templates/planner-subagent-prompt.md`, and plan-phase prompt assembly. Keep details in a reference file if size-budget tests require it.
- **Contract dependencies:** Depends on UPLIFT-01 through UPLIFT-04; feeds UPLIFT-06 through UPLIFT-08.
- **Upstream-compatible?** Configurable. The fields are optional unless doctrine is expected.
- **Risk:** Medium. Frontmatter bloat and ambiguous YAML are likely failure modes. Mitigate with concise schema and tests.
- **Testability:** Template tests; planner-language regression tests; frontmatter parser tests; workflow/agent size-budget tests.
- **Rollback strategy:** Remove optional frontmatter fields; old PLANs remain valid.

### UPLIFT-06 - Add a doctrine translation gate to plan-checking

- **Surface:** `gsd-plan-checker`, `plan-phase`, tests.
- **Current behavior with source citations:** Plan-phase already verifies requirements and CONTEXT feature coverage `get-shit-done/workflows/plan-phase.md:1401-1517`; it also has a blocking decision coverage gate from CONTEXT decisions into PLANs `get-shit-done/workflows/plan-phase.md:1448-1512`; plan-checker independently checks CONTEXT decision compliance `agents/gsd-plan-checker.md:300-312`.
- **Proposed behavior:** Add a doctrine coverage dimension that checks:
  - each material Future Awareness item has exactly one disposition in PLAN frontmatter;
  - tech-debt IDs named by files touched are paid down, preserved, or explicitly not touched;
  - Phase-4 Contract Completion fields are present when plans touch visualization substrate contracts;
  - Honesty Surface/Accessibility/Performance/Migration entries are either present or explicitly not applicable.
  - the Vision Alignment Checkpoint is present in CONTEXT and answered (one-line question + justification if milestone-only) whenever doctrine is expected.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Converts `CLAUDE.md:82-91` from prose expectations into a pre-execution translation gate.
- **Patch sketch:** Extend checker prompt and plan-phase checker prompt with doctrine paths; add SDK helper only if parsing frontmatter by shell becomes brittle; consume `workflow.project_doctrine_gate` from the schema/defaults added in UPLIFT-12, defaulting to active only when doctrine files exist or the user explicitly enables project doctrine.
- **Contract dependencies:** Depends on UPLIFT-02 and UPLIFT-05; feeds UPLIFT-07 and UPLIFT-08.
- **Upstream-compatible?** Configurable.
- **Risk:** Medium-high if made blocking too broadly. Mitigate with file-presence/config activation and explicit no-context reduced-guarantee path.
- **Testability:** Fixtures where a protected seam is dropped, where a debt ID is missing, and where a section is correctly marked not applicable.
- **Rollback strategy:** Disable `workflow.project_doctrine_gate` or remove checker dimension; planning still has ordinary requirements/decision gates.

### UPLIFT-07 - Preserve doctrine closeout in execution summaries

- **Surface:** `gsd-executor`, `execute-phase`, SUMMARY template, tests.
- **Current behavior with source citations:** Execute-phase includes CONTEXT/RESEARCH in richer executor prompts for large-context models `get-shit-done/workflows/execute-phase.md:117-125`; executor reads the plan and honors CONTEXT if referenced `agents/gsd-executor.md:92-98`; executor writes SUMMARY with deviations, stubs, threat flags, self-check, and state updates `agents/gsd-executor.md:565-687`.
- **Proposed behavior:** When PLAN frontmatter contains doctrine fields, SUMMARY must include `## Doctrine Preservation` with:
  - future preservation items and what happened;
  - tech-debt IDs touched and disposition;
  - benchmark/accessibility/honesty evidence when claimed;
  - explicit deviations from doctrine plan fields.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Supports benchmark evidence and registry update expectations from `CLAUDE.md:56-66`, plus phase planning fields from `CLAUDE.md:82-91`.
- **Patch sketch:** Update executor prompt and summary template; add self-check items to verify claimed doctrine closeout; do not make executor invent doctrine not present in PLAN.
- **Contract dependencies:** Depends on UPLIFT-05/06; feeds UPLIFT-08.
- **Upstream-compatible?** Yes, optional.
- **Risk:** Low. The biggest risk is SUMMARY overclaiming; verifier should not trust it.
- **Testability:** Summary template tests and executor prompt static tests.
- **Rollback strategy:** Drop SUMMARY section; verification can still inspect PLAN/code directly.

### UPLIFT-08 - Verify doctrine outcomes in verification reports

- **Surface:** `verify-phase`, `gsd-verifier`, VERIFICATION template, tests.
- **Current behavior with source citations:** Verify-phase establishes must-haves from PLAN frontmatter, ROADMAP success criteria, or the phase goal `get-shit-done/workflows/verify-phase.md:53-93`; it warns on CONTEXT decisions not reflected in shipped artifacts `get-shit-done/workflows/verify-phase.md:189-225`; the verification report template covers truths, artifacts, wiring, and requirements `get-shit-done/templates/verification-report.md:23-60`; verifier starts from actual code evidence and does not trust SUMMARY claims `agents/gsd-verifier.md:14-23`.
- **Proposed behavior:** Add a `## Doctrine Verification` section to VERIFICATION when doctrine fields exist in PLANs. The verifier checks whether claimed Vision Impact, Honesty Surface, Accessibility/Thin-Client, Performance Budget, Migration Discipline, and Phase-4 Contract Completion outcomes are supported by source, tests, benchmark output, visible UI state, or explicit non-action rationale.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Verifies the `CLAUDE.md:82-91` planning fields and the completion gates in `CLAUDE.md:56-66`.
- **Patch sketch:** Update `get-shit-done/workflows/verify-phase.md`, `agents/gsd-verifier.md`, and `get-shit-done/templates/verification-report.md`; add fixture tests that a missing doctrine outcome is a warning/blocker based on whether it was a must-have.
- **Contract dependencies:** Depends on UPLIFT-05 through UPLIFT-07.
- **Upstream-compatible?** Configurable.
- **Risk:** Medium. Verifier can become too subjective. Mitigate by requiring evidence classes and allowing explicit non-action rationale.
- **Testability:** Verification tests with pass/fail doctrine fixtures; no reliance on SUMMARY-only evidence.
- **Rollback strategy:** Remove `## Doctrine Verification`; normal goal-backward verification remains.

### UPLIFT-09 - Document optional doctrine scaffolding in new-project/add-phase without auto-importing scope

- **Surface:** `new-project`, `add-phase`, commands/docs, tests.
- **Current behavior with source citations:** New-project creates PROJECT, config, research outputs, REQUIREMENTS, ROADMAP, STATE, and runtime instruction file `get-shit-done/workflows/new-project.md:1438-1450`; its success criteria include creating requirements, roadmap, and state `get-shit-done/workflows/new-project.md:1453-1470`; add-phase delegates phase creation to `gsd-sdk query phase.add` and updates ROADMAP/STATE `get-shit-done/workflows/add-phase.md:44-71`.
- **Proposed behavior:** Do not require upstream new projects to create VISION/LONG-ARC/TECH-DEBT. Add optional documentation and, if configured, scaffold empty doctrine docs with warnings that they are broad planning doctrine, not phase scope. Add-phase should not import future scope; it may remind the user that doctrine will be evaluated during discuss/plan.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Prevents the `CLAUDE.md:82-91` local planning expectations from being silently lost in new phase creation while preserving the phase-boundary discipline in `.planning/LONG-ARC.md:70-75`.
- **Patch sketch:** Update new-project docs/prompts and add-phase completion text only under config; add docs tests. No default requirement for upstream users.
- **Contract dependencies:** Optional. Feeds future projects into UPLIFT-01.
- **Upstream-compatible?** Configurable.
- **Risk:** Low. Avoids hardcoding F1 doctrine into mainline.
- **Testability:** New-project config tests; add-phase output tests with config on/off.
- **Rollback strategy:** Remove optional scaffolding/help text; existing projects unaffected.

### UPLIFT-10 - Update references, docs, and regression tests as the contract boundary

- **Surface:** References, docs, tests, commands/contexts/hooks inventory.
- **Current behavior with source citations:** Agent contracts document handoff fields and completion markers `get-shit-done/references/agent-contracts.md:44-79`; artifact-types emphasizes that an artifact without a consumer is inert `get-shit-done/references/artifact-types.md:1-6`; workflow/agent size-budget tests require shared boilerplate to move to references when prompts grow `tests/agent-size-budget.test.cjs:6-20`, `tests/workflow-size-budget.test.cjs:5-21`; hooks are runtime guardrails, not planning consumers `hooks/gsd-context-monitor.js:3-18`; context profiles are output-style profiles `get-shit-done/contexts/dev.md:1-21`.
- **Proposed behavior:** Add a concise reference page, e.g. `get-shit-done/references/project-doctrine.md`, and update `agent-contracts.md`, `artifact-types.md`, configuration docs, and relevant tests. The docs must state that hooks and generic context profiles are intentionally not doctrine-enforcement surfaces.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Documents how the `CLAUDE.md:82-91` phase planning requirements become consumed artifacts rather than inert local prose.
- **Patch sketch:** Add reference docs; update docs/config; add tests for docs parity, schema parity, prompt references, size budgets, template fields, and no hook/context doctrine wiring.
- **Contract dependencies:** Supports all other UPLIFTs.
- **Upstream-compatible?** Yes.
- **Risk:** Low, but docs drift is likely if not tested.
- **Testability:** Docs parity tests; config schema tests; size-budget tests; template and prompt tests.
- **Rollback strategy:** Remove docs/tests and references; optional code paths can remain or be reverted separately.

### UPLIFT-11 - Add optional Claude Design prototype intake for UI-heavy phases

- **Surface:** Workflows, templates, docs, tests.
- **Current behavior with source citations:** Plan-phase can already pass a `UI_SPEC_PATH` and `SKETCH_FINDINGS_PATH` to the planner when those artifacts exist `get-shit-done/workflows/plan-phase.md:839-841`, but upstream does not define how external design prototypes become durable phase inputs. Claude Design supports conversational canvas generation, adding screenshots/codebase context, chat and inline comment iteration, exports, sharing, and Claude Code handoff; the local briefing adds the operational rule that Claude Design sits between framing and production, not inside production, and that teams fail when they skip design-system setup or design and code in one conversation `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/CLAUDE-DESIGN-GUIDE.md:21-44`, `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/CLAUDE-DESIGN-GUIDE.md:67-92`, `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/CLAUDE-DESIGN-GUIDE.md:282-292`.
- **Proposed behavior:** Define an optional design-prototype intake lane for UI-heavy or visualization-heavy phases with three durable artifacts:
  - `DESIGN-SYSTEM.md` or `DESIGN-SYSTEM-SETUP.md`: records the Claude Design design-system inputs, owner, review cadence, source-of-truth rule, and scoped repo/UI-package context. This is prerequisite work, not a nice-to-have. Includes an explicit `source_of_truth_rule` field naming which system wins when the Claude Design design system and any future external design source (Figma library, brand-kit, etc.) disagree. Default for projects without a competing source-of-truth: `Claude Design system is exploratory; CLAUDE.md and .planning/VISION.md honesty + accessibility constraints are canonical.`
  - `DESIGN-BRIEF.md`: captures the dense four-part brief (goal, audience, content, layout/feel), accepted variant, rejected variants, clarifying answers, and links/exports. The brief cites the Claude Design session but is the durable contract.
  - `DESIGN-HANDOFF.md`: records whether the handoff target is Claude Code or Codex, what fidelity is expected, which generated code is reference-only, and who reviewed the handoff before it became implementation scope. Includes an explicit `expected_drift` field documenting that hi-fi Claude Design output is not 1:1 with the production component library - naming the drift areas typically observed (spacing tokens, component variants, placeholder copy) and how each will be reconciled at implementation time.
  The accepted brief can then be cited from CONTEXT canonical refs and consumed by planner as UI spec or sketch findings. Raw Claude Design output, inline comments, chat transcript, export bundle, or Claude Code handoff code are not authoritative until summarized into a reviewed artifact.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Supports Vision Impact, Honesty Surface, Accessibility and Thin-Client, Performance Budget, and Migration Discipline from `CLAUDE.md:82-91`, especially for visualization, artifact panels, lesson surfaces, and puzzle/practice flows.
- **Patch sketch:** Add `get-shit-done/templates/design-system-setup.md`, `get-shit-done/templates/design-brief.md`, and `get-shit-done/templates/design-handoff.md`; update discuss/plan docs to recognize reviewed design artifacts as canonical refs; add a reference note that Claude Design should link specific UI packages/subdirectories rather than whole monorepos, should use variation-first exploration before refinement, should use Tweaks/comments/chat in cost-aware order, and should paste disappearing inline comments into the durable brief. Document the compact-view save-error workaround alongside the disappearing-comment workaround. Update planner prompt to treat Claude Design handoff code as reference-only unless a PLAN explicitly scopes production adoption.
- **Contract dependencies:** Feeds UPLIFT-02, UPLIFT-05, UPLIFT-07, and UPLIFT-08. Does not depend on UPLIFT-01 unless doctrine-aware design fields are enabled.
- **Upstream-compatible?** Configurable. External-tool lane only; no default requirement and no dependency on Claude Design availability.
- **Risk:** Medium-high. Prototype output can seduce planning into implementing polish or future scope prematurely; design-system drift can produce generic "AI slop"; Codex handoff may lose intent compared with Claude Code handoff; and quota can disappear quickly if teams use chat for adjustments that Tweaks/comments should handle. Mitigate by requiring design-system setup first, dense briefs, variation-first exploration, explicit source-of-truth resolution, reviewed handoff artifacts, and a pilot before making the lane default.
- **Testability:** Template tests for DESIGN-SYSTEM, DESIGN-BRIEF, and DESIGN-HANDOFF; workflow test that a design brief appears in canonical refs; planner prompt test that handoff code is reference-only; negative test that raw design exports do not become executable PLAN authority; pilot checklist that validates the Codex handoff adaptation described in the local briefing.
- **Rollback strategy:** Remove the optional design artifacts and docs. Existing phase CONTEXT/PLAN behavior remains unchanged. Keep the local research briefing as reference-only even if the workflow lane is removed.

### UPLIFT-12 - Register project doctrine config keys across CJS, SDK, and docs parity

- **Surface:** CJS config schema/defaults, SDK config schema/defaults, docs, tests.
- **Current behavior with source citations:** `config-set` accepts only keys listed in the CJS schema, and adding a docs-only key makes runtime config reject it `get-shit-done/bin/lib/config-schema.cjs:3-13`, `get-shit-done/bin/lib/config-schema.cjs:15-84`. SDK has a mirrored config schema that must stay set-equal with CJS `sdk/src/query/config-schema.ts:1-15`, `tests/config-schema-sdk-parity.test.cjs:58-74`. Defaults exist separately in CJS and SDK config loaders `get-shit-done/bin/lib/core.cjs:284-312`, `sdk/src/config.ts:89-123`. Docs parity requires every exact CJS key to appear in `docs/CONFIGURATION.md` `tests/config-schema-docs-parity.test.cjs:29-44`.
- **Proposed behavior:** Add `workflow.project_doctrine` and `workflow.project_doctrine_gate` as documented config keys in both CJS and SDK schemas. Use explicit `auto`/`true`/`false` semantics: `auto` activates discovery/section generation from file presence, `true` expects doctrine and warns when absent, and `false` disables the optional lane. Gate behavior should default to `auto`, with blocking only when doctrine files exist or the user explicitly opts in.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Makes the optional planning doctrine lane configurable without relying on hidden local behavior, preserving the explicit planning expectations in `CLAUDE.md:82-91`.
- **Patch sketch:** Update `get-shit-done/bin/lib/config-schema.cjs`, `sdk/src/query/config-schema.ts`, `get-shit-done/bin/lib/core.cjs`, `sdk/src/config.ts`, `docs/CONFIGURATION.md`, and any config-set help text. Add value validation if the existing config mutation path supports enum validation for workflow settings; otherwise document accepted values and add direct tests around load/interpretation.
- **Contract dependencies:** Supports UPLIFT-01, UPLIFT-02, UPLIFT-06, UPLIFT-09, and UPLIFT-10. Must land before any workflow consumes `workflow.project_doctrine` or `workflow.project_doctrine_gate`.
- **Upstream-compatible?** Yes. Defaults preserve no-op behavior for projects without doctrine files.
- **Risk:** Low technical risk, medium semantics risk if `auto` is ambiguous. Mitigate with docs examples for absent files, file-present auto activation, explicit opt-in, and explicit opt-out.
- **Testability:** Config schema parity, docs parity, config-set accept/reject tests, and config load tests for omitted, `auto`, `true`, and `false`.
- **Rollback strategy:** Remove the two keys and make doctrine activation file-presence-only. Existing projects that never set the keys remain unaffected.

### UPLIFT-13 - Register optional doctrine root artifacts as canonical planning files

- **Surface:** Artifact registry, health workflow, docs, tests.
- **Current behavior with source citations:** The canonical artifact registry is the source `gsd-health` uses for W019 unrecognized `.planning/` root-file warnings `get-shit-done/bin/lib/artifacts.cjs:1-9`. Its exact root list includes standard files such as PROJECT, ROADMAP, STATE, REQUIREMENTS, config, and CLAUDE, but not VISION, LONG-ARC, or TECH-DEBT `get-shit-done/bin/lib/artifacts.cjs:13-26`. Health documents W019 as "Unrecognized .planning/ root file - not a canonical GSD artifact" `get-shit-done/workflows/health.md:164-182`.
- **Proposed behavior:** Register `VISION.md`, `LONG-ARC.md`, and `TECH-DEBT.md` as optional canonical doctrine artifacts when the project doctrine lane is present. Document that these files are broad planning doctrine consumed through CONTEXT/PLAN/verification, not automatic phase scope. Preserve W019 for unknown root files outside the canonical list.
- **Doctrine requirement implemented with `CLAUDE.md` cite:** Prevents doctrine files needed for `CLAUDE.md:82-91` from being flagged as stale/misnamed noise by the health surface that agents use to judge planning directory integrity.
- **Patch sketch:** Update `get-shit-done/bin/lib/artifacts.cjs`, health docs, artifact-type references, and tests covering canonical exact matches plus negative unknown-file behavior. If upstream prefers a single generic name, introduce `PROJECT-DOCTRINE.md` as an alternative canonical pattern while preserving F1-local files as config-documented conventions.
- **Contract dependencies:** Supports UPLIFT-01, UPLIFT-02, UPLIFT-09, and UPLIFT-10. Should land before optional scaffolding or health checks advertise doctrine files.
- **Upstream-compatible?** Yes. It only changes root-file recognition for named optional doctrine artifacts and keeps health warnings for unknown files.
- **Risk:** Low. The main risk is canonicalizing too many local artifact names. Mitigate by limiting the exact list to files that have named consumers in this proposal.
- **Testability:** Artifact registry unit tests; health fixture with VISION/LONG-ARC/TECH-DEBT accepted; health fixture with an unrelated root file still reports W019.
- **Rollback strategy:** Remove the optional artifact names from the registry and docs. The doctrine lane can still operate by explicit config, but health may warn on local root files again.

## Catalog — observed but not proposed as UPLIFT

### CATALOG-01 — Reapply verifier is not a patch-registration API

- **Surface:** `get-shit-done/bin/verify-reapply-patches.cjs:10-24`, `get-shit-done/bin/verify-reapply-patches.cjs:192-247`
- **Observation:** `verify-reapply-patches.cjs` deterministically verifies backed-up installed-file patches from `gsd-local-patches/`; it does not register external source patches or overlay adapters.
- **Why it's not an UPLIFT:** Fails Bar 1 for this proposal because D-5 recommends source-first propagation and uses the existing installer/reapply path only for emergency in-place runtime patches. No verifier API change is required.
- **Severity:** Medium
- **Effort to address if revisited:** Days
- **Trigger to revisit:** A future implementation requires durable installed-file overlays rather than source patches plus local install validation.

### CATALOG-02 — SDK dist ships in npm package but not runtime config installs

- **Surface:** `package.json:10-24`, `bin/install.js:8359-8366`, local filesystem check 2026-05-16
- **Observation:** The npm package ships `sdk/dist`, but runtime installs copy `get-shit-done/` and not `sdk/`; the installed user-scope runtime likewise has no `sdk/` directory.
- **Why it's not an UPLIFT:** The finding is already absorbed into UPLIFT-01 by changing its surface from SDK-only to CJS-plus-SDK. A separate UPLIFT would duplicate the same propagation correction.
- **Severity:** High
- **Effort to address if revisited:** Hours
- **Trigger to revisit:** A later execution plan tries to validate runtime behavior by editing only `sdk/src` or `sdk/dist`.

### CATALOG-03 — Structural drift detection does not cover doctrine-artifact drift

- **Surface:** `get-shit-done/bin/lib/drift.cjs:1-14`, `get-shit-done/bin/lib/drift.cjs:36-45`
- **Observation:** Drift detection currently detects structural codebase drift categories, not doctrine-artifact drift across CONTEXT, PLAN, SUMMARY, and VERIFICATION.
- **Why it's not an UPLIFT:** Fails Bar 3 for this round because it is useful future work but not load-bearing for UPLIFT-01..13 to land. Health canonicalization and plan-check/verification coverage address the immediate risk.
- **Severity:** Low
- **Effort to address if revisited:** Days
- **Trigger to revisit:** Doctrine fields begin drifting across artifacts despite UPLIFT-06 and UPLIFT-08 checks.

## Contract dependency graph

```text
UPLIFT-10 reference/docs/test contract skeleton
        |
        +--> UPLIFT-12 config schema/defaults register project-doctrine toggles
        |
        +--> UPLIFT-13 artifact registry accepts optional doctrine root files
                    |
                    v
Optional doctrine inputs
  .planning/VISION.md
  .planning/LONG-ARC.md
  .planning/TECH-DEBT.md
  CLAUDE.md
        |
        v
UPLIFT-01 CJS + SDK init discover doctrine paths
        |
        v
UPLIFT-02 discuss/context captures phase-relevant doctrine
        |
        +--> UPLIFT-03 researcher extracts technical doctrine implications
        |          |
        |          v
        +--> UPLIFT-04 pattern mapper identifies doctrine-carrying seams
                   |
                   v
UPLIFT-05 planner emits PLAN doctrine fields
        |
        v
UPLIFT-06 plan-checker blocks dropped doctrine translations
        |
        v
UPLIFT-07 executor summarizes doctrine preservation results
        |
        v
UPLIFT-08 verifier checks doctrine outcomes against evidence

UPLIFT-09 optional scaffolding feeds future projects into the same chain.
UPLIFT-10 references/docs/tests stabilize the contract and the no-hook/no-context-profile boundary.
Direct edge: UPLIFT-02 also feeds UPLIFT-06 because the checker verifies CONTEXT doctrine blocks directly, not only PLAN fields.
External Claude Design exploration
        |
        v
UPLIFT-11 reviewed design brief feeds CONTEXT canonical refs, PLAN UI/spec context, SUMMARY evidence, and VERIFICATION comparison.
```

## Implementation order

1. Add UPLIFT-10 reference skeleton first, because prompt growth must cite shared doctrine contract instead of duplicating prose.
2. Add UPLIFT-12 config schema/default/docs parity before any workflow consumes `workflow.project_doctrine` or `workflow.project_doctrine_gate`.
3. Add UPLIFT-13 canonical artifact recognition so health does not label doctrine files stale or misnamed.
4. Add UPLIFT-01 CJS and SDK path discovery, type/build output, and tests.
5. Add UPLIFT-02 CONTEXT template/discuss changes.
6. Add UPLIFT-11 design-brief intake, because it is easiest to wire as canonical CONTEXT input before planner semantics harden.
7. Add UPLIFT-03 researcher changes.
8. Add UPLIFT-04 pattern-mapper changes.
9. Add UPLIFT-05 planner/template changes.
10. Add UPLIFT-06 plan-checker gate after PLAN schema exists.
11. Add UPLIFT-07 SUMMARY closeout.
12. Add UPLIFT-08 verification only after PLAN and SUMMARY semantics are stable.
13. Add UPLIFT-09 optional new-project/add-phase docs last, because it is a project-bootstrap convenience, not required for this local migration.

## Test plan

- Baseline already run against upstream tag `v1.42.2`: `npm install` succeeded and `npm test` passed 9211/9211 tests.
- CJS/SDK init tests: `tests/init.test.cjs`, `sdk/src/query/init.test.ts`, phase-runner type tests, and build output checks for optional doctrine paths.
- Config tests: CJS schema, SDK schema parity, docs parity, config-set acceptance, and defaults/interpreter tests for `workflow.project_doctrine` and `workflow.project_doctrine_gate`.
- Health/artifact tests: canonical artifact registry tests and health fixtures proving VISION/LONG-ARC/TECH-DEBT do not trigger W019 while unrelated root files still do.
- Template tests: CONTEXT, PLAN, SUMMARY, and VERIFICATION template assertions for doctrine sections when enabled and absence when disabled.
- Workflow tests: discuss-phase generated CONTEXT; plan-phase prompt assembly; decision/doctrine coverage gate behavior; execute-phase prompt preservation; verify-phase report section.
- Agent prompt tests: planner, plan-checker, phase-researcher, pattern-mapper, executor, verifier include only reference links plus concise obligations.
- Regression tests: `tests/agent-size-budget.test.cjs` and `tests/workflow-size-budget.test.cjs` must remain green; if a budget must be raised, the PR must explain why shared-reference extraction was insufficient.
- Negative tests: hooks and generic context profiles do not become doctrine-enforcement paths.
- Design-intake tests: accepted DESIGN-SYSTEM, DESIGN-BRIEF, and DESIGN-HANDOFF artifacts can be cited from CONTEXT and passed to planner; raw Claude Design exports, comments, transcripts, or handoff code cannot bypass CONTEXT/PLAN authority.
- Local smoke fixture: a miniature project with VISION/LONG-ARC/TECH-DEBT should produce CONTEXT, PLAN, SUMMARY, and VERIFICATION doctrine sections without changing behavior for a fixture lacking those files.

## Upstream-compatible vs f1-modeling-specific split

**Upstream-compatible:**

- Optional doctrine path discovery with absent-file no-op behavior.
- Optional project-doctrine config keys/defaults with schema, SDK, and docs parity.
- Canonical recognition of optional doctrine root artifacts consumed by the proposal.
- Generic terms like project doctrine, protected seams, explicit non-decisions, future shape notes, and tech-debt disposition.
- Template and verification fields that are optional unless doctrine is configured or present.
- Optional design-system, design-brief, and design-handoff intake for external prototypes, including Claude Design, as reviewed phase input.
- Generic guidance that design-system setup, dense briefs, variation-first exploration, and reviewed handoff artifacts are required for external design tools to become planning inputs.
- Reference docs that explain artifact consumption and avoid hook enforcement.
- Tests proving default behavior is unchanged when doctrine files are absent.

**F1-modeling-specific overlay/application:**

- The specific doctrine files and contents: `.planning/VISION.md`, `.planning/LONG-ARC.md`, `.planning/TECH-DEBT.md`, and this repo's `CLAUDE.md`.
- The specific entries `AccessibleChartContract`, `AnchorRegistry`, puzzle/skill-practice slots, transport-neutral compute boundary, regulation-family semantics, benchmark trigger IDs, and VA-TD-01 through VA-TD-11.
- Local generated CONTEXT/PLAN language that names Formula 1 engineering, simulation artifacts, regulation snapshots, telemetry, thin-client behavior, and visualization substrate obligations.
- Claude Design use cases such as artifact/result views, visualization panels, lesson flows, puzzle/practice screens, and review prototypes for F1-specific operators.

## Rollback strategy overall

Implement in separable commits by dependency layer. If the uplift causes prompt bloat or false positives, disable `workflow.project_doctrine_gate` first while leaving optional artifact discovery and docs intact. If config semantics cause user confusion, fall back from `auto`/`true`/`false` to file-presence-only discovery plus one explicit gate toggle. If CJS/SDK init fields cause compatibility issues, remove only the optional doctrine fields from both runtime paths and keep the docs as future reference. If planner/verifier behavior becomes too subjective, retain CONTEXT/PLAN schema but downgrade verification from blocking to warning until evidence-class tests are stronger. Hooks and generic context profiles stay outside the rollback path because they should not be changed for doctrine enforcement.

## Revision D — SDK propagation path

### Current state observed

- Build and package: the parent package exports installer and SDK shims as bins and ships `sdk/src`, `sdk/dist`, and the runtime payload `get-shit-done/` in the npm package `package.json:5-24`. SDK build is TypeScript-to-`dist` with declarations/source maps `sdk/package.json:36-45`, `sdk/tsconfig.json:1-20`; parent `prepublishOnly` and `pretest` run `npm run build:sdk` `package.json:60-75`.
- Install layout: installer materializes the runtime payload by copying `get-shit-done/`; it explicitly notes the install does not copy `sdk/` and instead copies only the model catalog into `get-shit-done/bin/shared` for CJS runtime resolution `bin/install.js:8359-8366`. The local user-scope install checked on 2026-05-16 matches that shape: it has `get-shit-done/bin/lib` and no `sdk/`.
- Runtime command path: workflow init commands use `get-shit-done/bin/gsd-tools.cjs`, which imports CJS `./lib/init.cjs` and routes `init` commands to it `get-shit-done/bin/gsd-tools.cjs:172-186`, `get-shit-done/bin/gsd-tools.cjs:829-837`. SDK `init.ts` changes alone would not affect installed workflow init JSON.
- Update/reapply behavior: update warns that managed GSD directories are wiped and replaced, backs up modified GSD files to `gsd-local-patches/`, and tells users to run `/gsd:update --reapply` when patches are found `get-shit-done/workflows/update.md:394-409`, `get-shit-done/workflows/update.md:613-625`. The installer saves modified manifest-managed files before wipe and populates `gsd-pristine/` when possible for three-way verification `bin/install.js:7468-7550`, `bin/install.js:7552-7658`, `bin/install.js:7834-7843`.
- Reapply verifier: `verify-reapply-patches.cjs` takes `--patches-dir`, `--config-dir`, optional `--pristine-dir`, and verifies user-added lines from backed-up files; it exports helper functions but no registration/overlay API `get-shit-done/bin/verify-reapply-patches.cjs:10-24`, `get-shit-done/bin/verify-reapply-patches.cjs:87-100`, `get-shit-done/bin/verify-reapply-patches.cjs:192-247`.

### Options evaluated

| Option | Scope of work | Fragility | `gsd-update` survival | Upstream compatibility | Rollback shape |
| --- | --- | --- | --- | --- | --- |
| D-1 fork-then-build | Patch upstream source, build SDK, and install from the patched source or fork. | Medium if source patches include both CJS runtime and SDK; high if treated as SDK-only. | Survives only while the local install is refreshed from the fork/source build; ordinary upstream update overwrites it. | Good if patches are upstream-shaped and PR-ready. | Reinstall released upstream, or reset fork/source patches and reinstall. |
| D-2 in-place CJS patch | Patch files directly under `~/.claude/get-shit-done/` or repo-local runtime. | High because installed files become the authority and can drift from source/tests. | Overwritten by update, but manifest-backed changes can be backed up and reapplied through `/gsd:update --reapply`. | Weak unless the same patch is also ported to source. | Restore from new install or remove the backed-up local patch before reapply. |
| D-3 overlay adapter | Add a local wrapper/adapter around `gsd-tools` or SDK output. | Very high because it creates a second authority path around installed behavior. | Survives only if installed outside managed GSD directories; otherwise update can wipe it. | Weak; unlikely to be acceptable upstream without redesign. | Delete the overlay and return to shipped runtime behavior. |
| D-4 upstream-PR-first | Only change canonical upstream and wait for release before local adoption. | Low once merged; high schedule risk before merge/release. | Strong after release because updates carry the behavior normally. | Strongest. | Revert upstream PR or pin/rollback package version. |
| D-5 hybrid | Patch upstream source across CJS runtime, SDK TS, generated SDK dist, docs, and tests; install locally for validation; use reapply only for emergency in-place patches. | Medium; requires CJS/SDK synchronization discipline but keeps source as authority. | Local source installs survive local refreshes; ordinary `gsd-update` still overwrites emergency installed-file patches unless reapply is used. | Strong if the source patch remains PR-shaped and optional. | Reinstall released upstream, or remove source patch layers by dependency layer. |

### Recommendation

Use D-5 hybrid. The implementation source of truth should be the upstream checkout, not `~/.claude/get-shit-done/` and not an overlay adapter. Patch CJS runtime files under `get-shit-done/bin/lib/` for installed workflow behavior, patch SDK TypeScript/types for CLI/package parity, rebuild `sdk/dist`, and install from that source for local validation. Use in-place installed-file edits only as an emergency diagnostic path, and then rely on the existing manifest-backed `gsd-local-patches/` and `/gsd:update --reapply` flow to keep them visible rather than silently durable.

### Implications for existing UPLIFTs

- UPLIFT-01 is no longer SDK-only. Its surface and patch sketch now include `get-shit-done/bin/lib/init.cjs`, `sdk/src/query/init.ts`, `sdk/src/types.ts`, generated `sdk/dist`, CJS tests, and SDK tests.
- UPLIFT-06 should not invent an ad hoc config knob inside the checker prompt. It consumes `workflow.project_doctrine_gate` from UPLIFT-12.
- UPLIFT-09 optional scaffolding is misleading unless UPLIFT-13 prevents health from flagging the generated doctrine root files as unrecognized artifacts.
- UPLIFT-10 must document both runtime paths: installed CJS workflow behavior and SDK/package behavior.

### `verify-reapply-patches.cjs` integration answer

Do not extend `verify-reapply-patches.cjs` for this proposal. It is already the correct safety net for direct installed-file modifications: installer detects manifest-managed modified files, backs them up to `gsd-local-patches/backup-meta.json`, creates `gsd-pristine/` when possible, and `/gsd:update --reapply` invokes deterministic verification. The proposal should instead keep durable changes in upstream source. If an emergency in-place CJS patch is used, it must touch a manifest-managed installed file so the existing update/reapply path can see it; otherwise it is just a local overlay and should be documented as temporary.

## Open questions

1. Should upstream name this feature `project_doctrine`, `future_awareness`, or `planning_doctrine`? Recommendation: `project_doctrine`, because the mechanism is generic and not all projects will call the content future-awareness.
2. Should file-presence alone enable the gate, or should `.planning/config.json` explicitly opt in? Recommendation: file presence enables section generation, config controls blocking gates.
3. Should `VISION.md` be read by default or only when CONTEXT/ROADMAP/CLAUDE cites it? Recommendation: default to `LONG-ARC.md` and `TECH-DEBT.md`; load `VISION.md` when phase context is broad product identity or the file is cited.
4. Should tech-debt disposition be required for all plans or only when files intersect registered seams? Recommendation: only when files/interventions intersect registered seams.
5. Should Phase-4 Contract Completion remain an F1-local section name? Recommendation: upstream docs should describe "named future contract completion"; F1 overlay can keep the exact Phase-4 label.
6. Should plan-check doctrine failures block by default? Recommendation: block only dropped explicit preserved seams and missing tech-debt dispositions; warn for softer Vision Impact wording.
7. Should Claude Design intake be a first-class workflow flag or only a documented artifact convention? Recommendation: start as an artifact convention, because it avoids adding command surface while the tool is still research preview.
8. Who owns the Claude Design design system and source-of-truth sync? Recommendation: the same owner as design tokens or Storybook, with a review cadence before broader rollout.
9. Should Claude Code be used for the handoff step even when Codex owns implementation? Recommendation: run a structured pilot, because the local guide says Codex can consume the bundle but with reduced intent fidelity.

## Out-of-scope items observed

- No upstream code patch is included in this proposal.
- No local install patch under `~/.claude/get-shit-done/` or repo-local `.claude/get-shit-done/` is proposed here.
- No GSDR signal collection, reflection, knowledge-base, or roadmap-governance machinery is proposed.
- No hook-based doctrine enforcement is proposed; Codex hook support is absent in this runtime and upstream hooks are the wrong abstraction for planning doctrine.
- No new slash command is proposed.
- No direct production-code adoption from Claude Design handoff is proposed; handoff code remains reference-only unless a reviewed PLAN explicitly scopes it.
- No claim is made that Codex handoff from Claude Design has vendor-documented parity with Claude Code handoff; the local guide treats that adaptation as a pilot item.
- No immediate restructuring of this repo's `.planning/` doctrine files is proposed.
- The upstream `npm audit` vulnerability report from `npm install` was observed but is outside this doctrine-uplift proposal.
- The upstream version metadata drift (`v1.42.2` tag with `1.50.0-canary.0` package/test banner) was observed but is outside this proposal unless the user asks for a separate package-version investigation.

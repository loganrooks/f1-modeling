# Wave 3A Synthesis: Harness Patch Plan

## 1. Metadata

- Date: 2026-04-16
- Initiative: `future-aware-planning-harness-2026-04`
- Wave: `3A`
- Spec: `.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-3A-synthesis-harness-patch-plan.md`
- Output: `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/03-harness-patch-plan.md`
- Status: proposed
- Scope: Stage 3 repo-local harness/bootstrap and steering-chain patch plan only
- Doctrine shell consumed:
  - `.planning/LONG-ARC.md`
  - `.planning/AGENTS.md`
  - `WORKFLOW.md`
  - `.planning/ARTIFACT-GOVERNANCE.md`
  - `AGENTS.md`
  - `.planning/STATE.md`
  - `.planning/TECH-DEBT.md`
- Wave inputs consumed:
  - initiative `README.md`, `PLAN.md`, `RESEARCH-PRINCIPLES.md`, `SPEC-INDEX.md`
  - `review-wave-1-mechanism-and-adaptation-decisions.md`
  - `synthesis/01-doctrine-and-governance-package.md`
  - `synthesis/02-doctrine-and-governance-application.md`
  - `review-wave-2B-doctrine-and-governance-application.md`
  - `recheck-wave-2B-doctrine-and-governance-application.md`
- Runtime surfaces inspected:
  - active home runtime under `$HOME/.codex/get-shit-done-reflect/`
  - relevant `gsdr-*` skills under `$HOME/.codex/skills/`
  - `prix-guesser` portable overlay and setup path as mechanism reference

## 2. Executive Summary

Stage 3 should stay narrow and behavior-first:

- track a repo-local overlay as the reviewed source of truth
- activate it through a repo-local bootstrap script
- patch only the active steering-chain files that currently drive behavior
- keep the active Codex skills unchanged unless a later wave introduces a true repo-local Codex skill install

The narrowest viable Stage 3 path is not a full repo-local GSDR fork. The active Codex skill/runtime surface is still home-scoped, and the current GSDR code/docs do not show a clean Codex-native local-install precedence path. The practical Stage 3 answer is therefore:

1. version and review the patch in-repo
2. materialize it into the active home runtime with an explicit bootstrap script
3. limit the patch set to `discuss -> research -> plan -> plan-check -> state/progress/resume`
4. defer broader Reflect subsystem adaptation and later enforcement lanes

The steering-chain patch itself should do four things and no more:

- normalize `Future Awareness` in `CONTEXT.md`
- propagate `canonical_refs` into researcher, planner, and checker reads
- require structured `future_preservation` plus `tech_debt_disposition` in `PLAN.md`
- make reduced-guarantee no-context planning explicit in `PLAN.md` and `STATE.md`

## 3. Current Active Patch-Surface Map

| Surface | Why it matters now | Classification | Stage 3 treatment |
| --- | --- | --- | --- |
| `$HOME/.codex/get-shit-done-reflect/workflows/discuss-phase.md` | writes `CONTEXT.md`; already accumulates `canonical_refs` | behavior-changing now | patch |
| `$HOME/.codex/get-shit-done-reflect/templates/context.md` | defines active context shape | behavior-changing now | patch |
| `$HOME/.codex/get-shit-done-reflect/workflows/research-phase.md` | standalone research prompt path | behavior-changing now | patch |
| `$HOME/.codex/get-shit-done-reflect/workflows/plan-phase.md` | planner/checker orchestration, context gating, revision loop | behavior-changing now | patch |
| `$HOME/.codex/get-shit-done-reflect/templates/phase-prompt.md` | durable `PLAN.md` contract | behavior-changing now | patch |
| `$HOME/.codex/get-shit-done-reflect/workflows/progress.md` | next-action routing surface | behavior-changing now | patch narrowly |
| `$HOME/.codex/get-shit-done-reflect/workflows/resume-project.md` | session restoration and command routing | behavior-changing now | patch narrowly |
| `$HOME/.codex/get-shit-done-reflect/templates/state.md` | default `STATE.md` digest shape | behavior-changing now | patch narrowly |
| `$HOME/.codex/get-shit-done-reflect/templates/research.md` | research artifact shape | doctrine-adjacent | keep unchanged in Stage 3 |
| `$HOME/.codex/get-shit-done-reflect/workflows/quick.md` | separate quick-task path | real behavior surface, but not the Stage 3 proving ground | defer |
| `$HOME/.codex/get-shit-done-reflect/workflows/verify-phase.md` | post-execution verification | later consumer only | defer to Stage 5 if needed |
| `$HOME/.codex/get-shit-done-reflect/workflows/validate-phase.md` | Nyquist validation | later consumer only | defer |
| `$HOME/.codex/get-shit-done-reflect/bin/lib/template.cjs` | standalone template-fill helper | reference input only; not the active skill path | do not patch in Stage 3 |
| `$HOME/.codex/get-shit-done-reflect/templates/planner-subagent-prompt.md` | planner context helper doc | reference input only | do not patch unless application shows active use |
| `$HOME/.codex/skills/gsdr-discuss-phase/SKILL.md` | invokes home workflow path | reference input only under the proposed bootstrap model | keep unchanged |
| `$HOME/.codex/skills/gsdr-research-phase/SKILL.md` | invokes home workflow path | reference input only | keep unchanged |
| `$HOME/.codex/skills/gsdr-plan-phase/SKILL.md` | invokes home workflow path | reference input only | keep unchanged |
| `$HOME/.codex/skills/gsdr-progress/SKILL.md` | invokes home workflow path | reference input only | keep unchanged |
| `$HOME/.codex/skills/gsdr-resume-work/SKILL.md` | invokes home workflow path | reference input only | keep unchanged |
| `.planning/LONG-ARC.md`, `.planning/AGENTS.md`, `WORKFLOW.md`, `.planning/ARTIFACT-GOVERNANCE.md` | doctrine shell Stage 3 must operationalize | doctrine-adjacent but load-bearing | consume, do not restructure |
| `.planning/STATE.md` and `.planning/TECH-DEBT.md` | active routing and debt registry | load-bearing repo inputs | consume and lightly extend via template/routing rules |

### Stage 3 patch boundary

Stage 3 should patch only these active files:

- home runtime workflows: `discuss-phase.md`, `research-phase.md`, `plan-phase.md`, `progress.md`, `resume-project.md`
- home runtime templates: `context.md`, `phase-prompt.md`, `state.md`

Everything else should either remain an input or wait for a later wave.

## 4. Recommended Repo-Local Overlay/Bootstrap Strategy

### Recommended decision

Adopt a tracked repo-local overlay as the canonical patch source, then use a repo-local bootstrap script to copy that patch into the active home runtime.

This is the narrowest approach that is:

- repo-local and reviewable in git
- behavior-changing immediately after installation
- reversible without redesigning Codex skill discovery
- honest about the fact that the active runtime is still home-scoped

### Why not a full repo-local GSDR install in Stage 3

The current GSDR runtime and skill surface do not show a clean Codex-native local-install precedence story:

- the active skills are discovered from `$HOME/.codex/skills/`
- the active workflows/templates are read from `$HOME/.codex/get-shit-done-reflect/`
- dual-install references are still mostly framed around older local/global layouts, not a clear Codex-local path that this repo can rely on today

Trying to solve that in Stage 3 would turn a steering-chain patch into a runtime-install redesign. That belongs later if the repo decides it is worth doing.

### Activation path

Stage 3 should add a bootstrap surface with two commands:

- `scripts/setup-future-aware-harness.sh`
- `scripts/verify-future-aware-harness.sh`

Recommended package aliases:

- `npm run planning:harness:install`
- `npm run planning:harness:verify`

`setup-future-aware-harness.sh` should:

1. verify the expected upstream GSDR version before patching
2. back up only the selected home runtime files
3. copy the tracked overlay files into the matching home runtime paths
4. write an install receipt with source manifest hash and timestamp

`verify-future-aware-harness.sh` should:

1. compare overlay files against the currently patched home runtime files
2. report drift after upstream GSDR updates
3. fail loudly if the active runtime no longer matches the repo-tracked overlay

### Coexistence with the home-level GSDR install

The bootstrap should treat the home runtime as a materialization target, not as the source of truth.

- source of truth: repo overlay
- active runtime: home-level GSDR
- restore path: bootstrap `--restore` or backup replay

This keeps the patch reviewable in repo history while still using the currently active Codex workflow surface.

### Minimal viable Stage 3 path

The minimum acceptable Stage 3 implementation is:

- tracked overlay
- backup/restore bootstrap
- verify script
- the eight runtime files listed in Section 3

It should not attempt:

- a full home runtime mirror
- skill-registry rewrites
- repo-local copies of every GSDR template or workflow
- subsystem patches outside steering/routing

## 5. Recommended Target File Tree For Repo-Local Harness Surfaces

### Tracked in repo

```text
tooling/future-aware-harness/
  README.md
  manifest.json
  overlay/
    get-shit-done-reflect/
      workflows/
        discuss-phase.md
        research-phase.md
        plan-phase.md
        progress.md
        resume-project.md
      templates/
        context.md
        phase-prompt.md
        state.md
scripts/
  setup-future-aware-harness.sh
  verify-future-aware-harness.sh
```

### Materialized outside git

```text
$HOME/.codex/get-shit-done-reflect/.f1-modeling-stage3/
  backups/
  install-receipt.json
```

### Why this tree

- `tooling/future-aware-harness/` keeps patch source separate from product code and `.planning/` doctrine
- `manifest.json` gives the bootstrap a stable patched-file list and expected upstream version
- only overlayed files are tracked, not a raw copy of the whole runtime
- skills stay untouched because the proposed installation model patches the home workflow files in place

## 6. Steering-Chain Patch Plan

### 6.1 `CONTEXT.md` producer patch

Patch surfaces:

- `workflows/discuss-phase.md`
- `templates/context.md`

Required Stage 3 behavior:

1. Keep the current discuss/exploratory mode split.
2. Keep `Canonical References` mandatory.
3. Add a mandatory `Future Awareness` section with exactly these buckets:
   - `Protected Seams`
   - `Explicit Non-Decisions`
   - `Current Posture`
   - `Future Shape Notes`
4. Do not replace the existing mode-specific steering sections.
   - exploratory mode still owns working model, constraints, guardrails, questions, dependencies
   - discuss mode still owns decisions, discretion, specifics, deferred ideas

Recommended write order inside `CONTEXT.md`:

1. Phase Boundary
2. mode-specific steering sections
3. Canonical References
4. Future Awareness
5. Code Context
6. Specific Ideas
7. Deferred Ideas

Responsibility split:

- `CONTEXT.md` owns future-aware capture
- it does not own debt disposition
- it does not grow a research-disposition section
- it does not become a second `STATE.md`

Canonical-ref seeding rule:

- always seed `.planning/LONG-ARC.md` into `Canonical References`
- add decision anchors or initiative artifacts only when the active phase/spec explicitly depends on them
- do not re-list `.planning/ROADMAP.md`, `.planning/STATE.md`, or `.planning/REQUIREMENTS.md` there, because the workflows already load those as standard inputs

### 6.2 `RESEARCH.md` consumer patch

Patch surface:

- `workflows/research-phase.md`

Keep unchanged:

- `templates/research.md`
- `Genuine Gaps`
- `Still Open`
- spike-routing behavior

Required Stage 3 behavior:

1. Parse `Canonical References` from `CONTEXT.md` when present.
2. Read those refs before spawning the researcher.
3. Pass both the raw context and the resolved canonical-ref contents into the researcher prompt.
4. Pass `Future Awareness` as planning constraints, not as optional background.

What Stage 3 should not do here:

- no new `Research Disposition` section
- no cloned `future_preservation` block in research
- no special signal or audit routing from research output

`RESEARCH.md` remains the evidence-and-uncertainty artifact. It should still route unresolved issues through `Genuine Gaps` and `Still Open`.

### 6.3 `PLAN.md` producer and checker patch

Patch surfaces:

- `workflows/plan-phase.md`
- `templates/phase-prompt.md`

Required Stage 3 behavior:

1. Require `CONTEXT.md` by default for future-aware planning.
2. Add `--allow-no-context` as the only reduced-guarantee bypass.
3. When context exists, planner must map every material future-aware item exactly once.
4. Persist that mapping in `future_preservation`.
5. Persist touched debt outcomes in `tech_debt_disposition`.
6. Make the embedded plan-checker fail missing or generic preservation/debt entries.

Standard inputs to add to `plan-phase`:

- full `.planning/TECH-DEBT.md`
- active tech-debt ids from the `STATE.md` routing digest
- resolved canonical refs from `CONTEXT.md`

This keeps debt disposition grounded in the live registry rather than forcing `CONTEXT.md` to mirror debt content.

Recommended frontmatter additions:

```yaml
planning_posture:
  context_mode: full_context | legacy_context | reduced_guarantee_no_context
  context_path: .planning/phases/.../*-CONTEXT.md | null
  canonical_refs_resolved: true | false

future_preservation:
  - source_bucket: Protected Seams | Explicit Non-Decisions | Current Posture | Future Shape Notes
    item: "Preserve transport-neutral execution boundary"
    disposition: preserved_seam | sequencing_choice | validation_task | non_action_rationale
    plan_consequence: "Split request compilation from backend dispatch"

tech_debt_disposition:
  - id: VA-TD-01
    status: trigger_fired | retired | intentionally_deferred | not_applicable
    note: "runService split lands in this plan set"
```

Required checker rules in Stage 3:

- fail if a material future-aware item disappears between `CONTEXT.md` and `PLAN.md`
- fail if `future_preservation` entries are generic and not traceable to plan consequences
- fail if relevant active debt ids are omitted from `tech_debt_disposition`
- do not yet fail execute-time verification for these fields; that belongs later

### 6.4 Reduced-guarantee no-context signaling

Patch surfaces:

- `workflows/plan-phase.md`
- `workflows/progress.md`
- `workflows/resume-project.md`
- `templates/state.md`

Required Stage 3 behavior:

1. If no `CONTEXT.md` exists and `--allow-no-context` is absent, `plan-phase` stops and routes to `discuss-phase`.
2. If `--allow-no-context` is present:
   - `plan-phase` warns explicitly that this is reduced-guarantee planning
   - `PLAN.md` records `planning_posture.context_mode: reduced_guarantee_no_context`
   - `STATE.md` records the reduced-guarantee status until a full-context replan happens
3. `progress` and `resume` must surface that caution flag and recommend `discuss-phase` / replan before further execution when appropriate.

This is enough to prevent silent bypass without turning Stage 3 into a full enforcement or preflight system.

### 6.5 `STATE.md` routing digest patch

Patch surfaces:

- `templates/state.md`
- `workflows/progress.md`
- `workflows/resume-project.md`

Add one compact digest subsection, not a second doctrine file:

- `Active doctrine refs`
- `Active tech-debt ids`
- `Reduced-guarantee status`

Recommended routing behavior:

- `progress` shows the digest before next-action routing
- `resume` surfaces the digest in status presentation
- neither workflow should parse `CONTEXT.md` directly in Stage 3

That keeps routing lightweight and pointer-heavy, consistent with `WORKFLOW.md`.

## 7. Canonical-Reference Propagation Plan

### Carrier surface

`CONTEXT.md` remains the only Stage 3 carrier for canonical refs.

- no duplicate canonical-ref block in `RESEARCH.md`
- no duplicate canonical-ref block in `PLAN.md`
- no separate routing-only canonical-ref ledger

### Canonical-ref format

Stage 3 should keep the existing human-readable Markdown shape and formalize only the extraction rule:

- bullet list entries under `## Canonical References`
- first backtick-wrapped repo-relative path in each bullet is authoritative
- optional prose after the path explains why it matters
- duplicate paths are de-duplicated at read time

This is narrow enough to implement without inventing a new frontmatter schema.

Canonical refs are for extra authoritative inputs that the default init payload does not already load. In Stage 3 that primarily means:

- `.planning/LONG-ARC.md`
- relevant decision anchors
- relevant initiative specs or review artifacts when a phase is explicitly downstream of them

### Downstream consumers

Consumers in Stage 3:

1. `research-phase`
   - resolve and read canonical refs before the researcher prompt
2. `plan-phase` planner spawn
   - resolve and read canonical refs before the planner prompt
3. `plan-phase` plan-checker spawn
   - resolve and read the same canonical refs before checker verification

Non-consumers in Stage 3:

- `progress`
- `resume`
- `verify-phase`
- `validate-phase`
- `signal`
- `reflect`

Those lanes should rely on `STATE.md` routing digest or later-wave integration, not direct context parsing.

### Compatibility story

Three context modes should be recognized:

1. `full_context`
   - normalized `Future Awareness`
   - canonical refs present and resolvable
2. `legacy_context`
   - context exists, but older shape or missing normalized future-awareness buckets
   - planner still uses raw context plus doctrine shell
3. `reduced_guarantee_no_context`
   - no context file
   - explicit bypass only

Recommended first-pass rule:

- missing canonical ref in a new-shape context is a hard workflow error
- missing canonical ref section in a legacy context is not a hard error

### Narrowest viable first-pass implementation

Do not build a generic Markdown parser. The first pass should:

1. locate the `## Canonical References` section
2. extract backtick-wrapped repo-relative paths from bullets
3. verify the files exist
4. read them in deterministic order
5. inject them into researcher/planner/checker prompt context

That is enough to make canonical refs real behavior.

## 8. Compatibility And Migration Strategy

### Existing artifacts

Do not retrofit older phases wholesale.

- existing `CONTEXT.md`, `RESEARCH.md`, and `PLAN.md` files remain valid historical artifacts
- Stage 3 behavior applies to newly created planning packages and explicit replans
- old phases are only uplifted when a new planning pass actually touches them

### Backward-compatible behavior

- legacy contexts can still be consumed
- legacy plans without `future_preservation` remain historical and should not be mass-edited
- the new checker rules apply to new or revised plans created through the Stage 3 path

### When reduced-guarantee handling must be used

Use reduced-guarantee mode only when:

- a phase truly has no `CONTEXT.md`
- the operator intentionally invokes `--allow-no-context`
- the caution is recorded in both `PLAN.md` and `STATE.md`

It should not be a hidden default and should not become a persistent config toggle in Stage 3.

### First proving ground: Phase `3.2`

The first proving ground should be the first real `3.2` planning package, not a retrofitted older phase.

Required Stage 3 preparation for `3.2`:

1. scaffold the Phase `3.2` directory
2. create a new `3.2-CONTEXT.md` using the normalized Stage 3 shape
3. ensure `STATE.md` lists the active doctrine/debt digest for `3.2`
4. run `plan-phase` without `--allow-no-context`

Minimum `3.2` routing digest expectation:

- `Active doctrine refs`: `.planning/LONG-ARC.md`
- `Active tech-debt ids`: `VA-TD-01`, `VA-TD-02`, `VA-TD-03`
- `Reduced-guarantee status`: none

This proving ground is strong because `3.2` is exactly where the repo needs:

- backend boundary preservation
- regulation canonicalization
- `runService` split discipline
- typed artifact and async job planning without leaking later-phase decisions

## 9. Explicit Defer/Reject Decisions For Later Waves

| Item | Decision | Why it is not Stage 3 |
| --- | --- | --- |
| research-disposition follow-on beyond `Genuine Gaps` / `Still Open` | defer | overlaps with spike routing; not needed for the first steering-chain patch |
| deliberation or decision-anchor schema changes | defer to Stage 4 | Stage 3 should consume doctrine, not redesign anchor artifacts |
| audit subsystem expansion beyond later consumption hooks | defer to Stage 4/5 | Stage 3 should not redesign audit request/response flows |
| signal automation or stronger signal CRUD | defer to Stage 4 | governance lane, not steering-chain patch |
| verify-phase / validate-phase future-aware uplift | defer to Stage 5 | Stage 3 enforcement should stop at planner/checker |
| broader initiative/debrief carry-forward workflow changes | defer to Stage 4 | outside the narrow steering/routing scope |
| full artifact symmetry across Reflect surfaces | reject | directly conflicts with the Stage 2 doctrine shell |
| persistent config toggle for no-context planning | reject in Stage 3 | bypass must stay explicit per run |
| full repo-local Codex skill/runtime fork | reject in Stage 3 | runtime-install redesign, not a steering-chain patch |
| patching `quick.md` in the first Stage 3 pass | defer | useful only after the main phase-planning path proves out |

## 10. Risks And Open Review-Gate Decisions

### Risks

| Risk | Why it matters | Mitigation in this plan |
| --- | --- | --- |
| home-runtime mutation affects other repos | the active runtime is global | patch only eight files, back them up, and make restore one command |
| upstream GSDR updates overwrite the patch | home runtime can drift silently | manifest + verify script + version guard |
| `STATE.md` digest grows into a second doctrine file | routing becomes noisy and stops being read | keep digest to refs, debt ids, and reduced-guarantee flag only |
| legacy contexts produce ambiguous planner behavior | older artifacts do not carry normalized buckets | explicit `legacy_context` mode and `3.2` as the clean proving ground |
| checker strictness creates ceremony before value | over-enforcement would blur Stage 5 into Stage 3 | fail only plan-time preservation/debt omissions on new plans |

### Open review-gate decisions

The Wave 3 review should decide these explicitly:

1. Is patching `progress.md`, `resume-project.md`, and `templates/state.md` still acceptably narrow for Stage 3, or should routing be narrowed further?
2. Is the home-runtime materialization model acceptable, or does the repo want to split bootstrap work from steering-chain patching before `3B`?
3. Is the proposed `future_preservation` array shape narrow enough, or should the frontmatter schema be simplified further?
4. Should missing active debt disposition be a hard checker failure immediately for new plans, or start as a warning for one proving-ground phase?
5. Is leaving Codex `gsdr-*` skill wrappers untouched the right narrow choice, given the current home-scoped runtime reality?

## Conclusion

Stage 3 should proceed as a repo-tracked overlay plus a narrow bootstrap that patches the active home steering chain in place. The implementation target is not a general GSDR redesign. It is a concrete behavior patch that makes the Stage 2 doctrine shell real in:

- context creation
- research/planner/checker reads
- plan artifact structure
- reduced-guarantee routing

Everything broader should stay deferred until later waves prove the steering-chain patch is worth extending.

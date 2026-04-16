# Wave 1A Research: Mechanism Comparison And Patch-Surface Inventory

## Metadata

- Date: 2026-04-16
- Initiative: `future-aware-planning-harness-2026-04`
- Scope: Compare `prix-guesser` future-aware planning-harness mechanisms against current `f1-modeling` and active home-level GSDR behavior.
- Source runtime here: active home-level GSDR from `~/.codex/get-shit-done-reflect`, with project settings from `.planning/config.json`.
- Comparison runtime there: repo-local regular GSD overlay in `prix-guesser/tooling/portable-gsd/overlay`, installed by `scripts/setup-portable-gsd.sh`.
- Output note: the spec names the artifact `research/01-mechanism-comparison-and-patch-surfaces.md`, but this run is constrained to the owned output path `research/01-mechanism-comparison-and-patch-surface-inventory.md`.

## Executive Summary

`prix-guesser`'s strongest levers are not the bucket names themselves. The real behavioral chain is:

1. `discuss-phase` derives normalized future-aware context and accumulates canonical refs.
2. `plan-phase` blocks exploratory planning without `CONTEXT.md` unless the operator explicitly uses `--allow-no-context`.
3. `plan-phase` and `research-phase` resolve `canonical_refs` into concrete downstream reads.
4. planner instructions force every material future-aware item into a plan-time consequence.
5. plans persist that consequence in structured `future_preservation`.
6. checker instructions fail plans that drop or genericize the preservation record.
7. a repo-local setup script and tracked overlay make the behavior durable and reviewable.

`f1-modeling` already has strong future-aware doctrine in `VISION.md`, `PROJECT.md`, `ROADMAP.md`, `STATE.md`, `TECH-DEBT.md`, `CLAUDE.md`, and some hand-authored phase contexts. But those surfaces are mostly documentary or prompt-only. The active behavior still comes from home-level GSDR, and this repo currently has no repo-local `.codex/` runtime, no setup/bootstrap path, no root `AGENTS.md`, no `.planning/AGENTS.md`, no `WORKFLOW.md`, and no long-arc doctrine file.

The most important GSDR-specific nuance is that plain-GSD intuition becomes misleading here. `f1-modeling` already sits inside a richer Reflect stack with `progress`, `resume`, `reflect`, `signal`, `verify-phase`, and `validate-phase` surfaces. Adopting only the plain phase-planning patch ideas without deciding how those Reflect surfaces should see future-aware state would improve the discuss/plan path while still leaving later routing, closure, and reflection mostly blind.

## Mechanisms Extracted From `prix-guesser`

### 1. Normalized `Future Awareness` buckets in context artifacts

`prix-guesser` does not leave future-aware content as one free-form paragraph. Its discuss workflow derives a dedicated `<future_awareness>` accumulator with four normalized buckets:

- `Protected Seams`
- `Explicit Non-Decisions`
- `Current Posture`
- `Future Shape Notes`

This matters because it separates:

- architectural seams that must stay open now
- things that should remain intentionally undecided
- current trust/visibility/service posture
- constrained notes about later product shape

Relevant sources:

- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/discuss-phase.md:480-488`
- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/context.md:126-143`

### 2. Hard or semi-hard context gating

`prix-guesser` does not treat exploratory planning without `CONTEXT.md` as a neutral omission. In exploratory mode, `plan-phase` hard-stops unless the operator explicitly uses `--allow-no-context`. The bypass emits an explicit reduced-guarantee warning.

Relevant sources:

- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:230-252`

### 3. `canonical_refs` propagation into downstream reads

`prix-guesser` treats `canonical_refs` as operational input, not a polite note for later. `plan-phase` resolves the cited file paths from `CONTEXT.md` and injects them into downstream `<files_to_read>` for researcher, planner, and checker. Standalone `research-phase` does the same.

Relevant sources:

- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/discuss-phase.md:470-478`
- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:291-304`
- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:370-375`
- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/research-phase.md:48-63`

### 4. Structured `future_preservation` in plans

The plan artifact contract itself carries a structured `future_preservation` block with:

- `protected_seams`
- `non_decisions`
- `posture_assumptions`

This is what turns future-aware planning from memory into something auditable inside `PLAN.md`.

Relevant sources:

- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/phase-prompt.md:14-33`
- `prix-guesser/tooling/portable-gsd/overlay/agents/gsd-planner.toml:463-480`

### 5. Planner mapping rules for future-aware items

The planner prompt does not merely say "respect future awareness." It forces a mapping rule: every material item in `<future_awareness>` must become exactly one of:

- preserved seam
- sequencing choice
- validation task
- explicit non-action rationale

Relevant sources:

- `prix-guesser/tooling/portable-gsd/overlay/agents/gsd-planner.toml:75-88`
- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:694-713`

### 6. Checker failures for missing or generic preservation

The checker does not accept silent drops. It flags plans that violate `Future Awareness`, drop future-aware items without consequence, or include missing/generic `future_preservation`.

Relevant sources:

- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:840-844`
- `prix-guesser/tooling/portable-gsd/overlay/agents/gsd-plan-checker.toml:292-307`

### 7. Research disposition handling

`prix-guesser` adds `Research Disposition` so unresolved research is not left as ambient ambiguity. It distinguishes:

- resolved questions
- escalated planning obligations
- preserved non-decisions
- inconclusive items

The checker treats missing disposition as a blocker.

Relevant sources:

- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/research.md:41-55`
- `prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/research.md:267-282`
- `prix-guesser/tooling/portable-gsd/overlay/agents/gsd-plan-checker.toml:516-532`

### 8. Repo-local bootstrap and overlay behavior

`prix-guesser` does not rely on the operator remembering home-level mutations. `scripts/setup-portable-gsd.sh` installs local GSD, copies the tracked overlay into repo-local `.codex/`, and rewrites runtime defaults. This is what makes the patch durable and reviewable.

Relevant sources:

- `prix-guesser/scripts/setup-portable-gsd.sh:1-87`
- `prix-guesser/tooling/portable-gsd/overlay/...`

## Current `f1-modeling` Surfaces

| Surface | Type | What it currently provides | Current limit |
| --- | --- | --- | --- |
| `.planning/VISION.md` | documentary surface | strong long-horizon product/architecture intent | not part of active workflow routing by itself |
| `.planning/PROJECT.md` | documentary surface | live project identity, requirements, key decisions | no enforced future-aware transmission |
| `.planning/ROADMAP.md` | documentary surface | phase sequence and phase goals | no harness-level preservation requirement |
| `.planning/STATE.md` | documentary surface | current position, recent decisions, blockers | progress/resume consume it, but it does not encode long-arc/future-preservation state |
| `.planning/TECH-DEBT.md` | documentary surface | living rewrite-trigger registry | not yet coupled to future-aware planning behavior |
| `CLAUDE.md` | prompt-only surface | repo-visible future-awareness convention and added planning expectations | advisory only; current signal already calls out lack of workflow enforcement |
| `.planning/phases/03-CONTEXT.md`, `03.1-CONTEXT.md`, `04-CONTEXT.md` | repo-local artifact convention | some contexts already include `canonical_refs` and hand-authored `Future Awareness` sections | current runtime does not reliably generate or enforce that structure |
| `.planning/config.json` | active workflow behavior surface | exploratory discuss mode, plan check, verifier, validation, model intent | no future-aware gate, no repo-local overlay, no doctrine-to-workflow patching |
| `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-vision-alignment-guardrails.md` | documentary surface | explicit evidence that Future Awareness is advisory-only today | no remediation wired into runtime |
| root `AGENTS.md` | missing surface | none on disk | current repo guidance is not durably committed at the root |
| `.planning/AGENTS.md` | missing surface | none | no planning-specific repo-local governance file |
| `.planning/LONG-ARC.md` | missing surface | none | no durable doctrine layer separate from `VISION.md` |
| `WORKFLOW.md`, `.planning/ARTIFACT-GOVERNANCE.md` | missing surface | none | no repo-local governance shell around planning artifacts |
| repo-local `.codex/` overlay / setup script | missing surface | none | behavior still depends on home-level GSDR |

Important current evidence:

- `CLAUDE.md:49` defines a `Future Awareness` convention.
- `03.1-CONTEXT.md:176-208` shows existing `canonical_refs`.
- `03.1-CONTEXT.md:262-279` and `04-CONTEXT.md:291-310` show existing future-aware content, but with ad hoc phase/v2 headings rather than the normalized four-bucket schema.
- `03.1-01-PLAN.md:1-40` shows current plan frontmatter has `must_haves` but no `future_preservation`.
- `.planning/config.json:1-27` shows active GSDR settings, but no repo-local harness patch path.
- `package.json:12-24` exposes product build/test scripts only, not a planning-harness install/bootstrap path.

## Current Home-Level GSDR Surfaces That Materially Matter

### Discuss and context surfaces

Active GSDR already has a real `canonical_refs` mechanism:

- `~/.codex/get-shit-done-reflect/workflows/discuss-phase.md:510-518`
- `~/.codex/get-shit-done-reflect/workflows/discuss-phase.md:1037-1056`
- `~/.codex/get-shit-done-reflect/workflows/discuss-phase.md:1411-1413`
- `~/.codex/get-shit-done-reflect/templates/context.md:341-346`

But active GSDR does not define a dedicated `future_awareness` section or normalized buckets in the context template. The generic context template still centers decisions, specifics, deferred ideas, and exploratory claim sections:

- `~/.codex/get-shit-done-reflect/templates/context.md:17-72`
- `~/.codex/get-shit-done-reflect/workflows/discuss-phase.md:73-95`

This means `canonical_refs` is already partly present in GSDR, while normalized future-awareness structure is not.

### Planning surfaces

Active GSDR `plan-phase` loads `context_content` early and passes it through, but it does not hard-gate missing context, resolve `canonical_refs` into concrete downstream reads, or require `future_preservation`.

- `~/.codex/get-shit-done-reflect/workflows/plan-phase.md:48-54`
- `~/.codex/get-shit-done-reflect/workflows/plan-phase.md:97-123`

Its main post-research unresolved-question mechanism is `Genuine Gaps` plus optional spike routing:

- `~/.codex/get-shit-done-reflect/workflows/plan-phase.md:139-176`

That is a real behavior surface, but it is not the same as `prix-guesser`'s explicit research disposition or future-preservation chain.

### Research surfaces

Active GSDR standalone `research-phase` only passes phase description, requirements, prior decisions, and raw context into the researcher prompt. It does not resolve `canonical_refs`, name `future_awareness`, or add a structured disposition layer.

- `~/.codex/get-shit-done-reflect/workflows/research-phase.md:34-72`

The active research template still uses `Open Questions`, `Genuine Gaps`, and `Still Open`, not `Research Disposition`:

- `~/.codex/get-shit-done-reflect/templates/research.md:191-230`

### Progress, resume, reflect, signal, verify, validate

These Reflect surfaces matter because they keep shaping project memory and closure after planning:

- `progress.md` routes entirely from `STATE.md`, `ROADMAP.md`, plan counts, summaries, and `has_context`, not from future-preservation or long-arc carry-forward (`~/.codex/get-shit-done-reflect/workflows/progress.md:81-170`).
- `resume-project.md` restores from `STATE.md`, `PROJECT.md`, handoff files, and incomplete plans, not from doctrine or preserved seams (`~/.codex/get-shit-done-reflect/workflows/resume-project.md:49-137`).
- the `STATE.md` template itself is a short-term memory digest for position, decisions, blockers, and continuity, not a future-aware doctrine carrier (`~/.codex/get-shit-done-reflect/templates/state.md:1-120`).
- the deliberation template is rich about inquiry and prediction, but it has no future-preservation analogue or canonical doctrine propagation hook by default (`~/.codex/get-shit-done-reflect/templates/deliberation.md:1-120`).
- `reflect.md` analyzes KB signals and lifecycle state generically, with no future-aware drift taxonomy (`~/.codex/get-shit-done-reflect/workflows/reflect.md:1-180`).
- `signal.md` is just a redirect to a separate command surface, so there is no visible future-aware patch point in the workflow file itself (`~/.codex/get-shit-done-reflect/workflows/signal.md:1-20`).
- `verify-phase.md` checks must-haves, artifacts, and wiring, not future-preservation or doctrine carry-forward (`~/.codex/get-shit-done-reflect/workflows/verify-phase.md:46-120`).
- `validate-phase.md` audits automated test coverage, not planning-harness preservation (`~/.codex/get-shit-done-reflect/workflows/validate-phase.md:46-120`).

## Behavior-Changing Vs Doctrine-Only Classification

### Behavior-changing enough to matter now

- Hard/semi-hard context gating
- `canonical_refs` resolution into downstream reads
- planner mapping rules for future-aware items
- structured `future_preservation` in plans
- checker failures for missing/generic preservation
- repo-local bootstrap/install/overlay behavior

### Mixed: useful doctrine, but only behavior-changing when wired

- normalized `Future Awareness` buckets
- research disposition handling

### Doctrine-only today in `f1-modeling`

- `VISION.md`, `PROJECT.md`, `ROADMAP.md`, `STATE.md`, `TECH-DEBT.md`
- `CLAUDE.md` future-awareness convention
- existing hand-authored phase `Future Awareness` sections

Those surfaces matter. They just do not currently force the planning harness to preserve what they say.

## Mechanism-By-Mechanism Mapping Table

| Mechanism | Implemented where in `prix-guesser` | Nearest current surface in `f1-modeling` | Nearest current surface in active GSDR runtime | Patch target here | Classification | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| Normalized `Future Awareness` buckets | `workflows/discuss-phase.md:480-488`; `templates/context.md:126-143` | `CLAUDE.md:49`; `03.1-CONTEXT.md:262-279`; `04-CONTEXT.md:291-310` | nearest analog is exploratory steering sections in `workflows/discuss-phase.md:73-95`; dedicated future-awareness surface is missing | repo-local shadow/adaptation of `discuss-phase.md` and `templates/context.md`, plus repo-local artifact-governance docs | mixed | `adapt now` |
| Hard/semi-hard context gating | `workflows/plan-phase.md:230-252` | `.planning/config.json:9-20` puts repo in exploratory discuss mode, but nothing gates missing context | `plan-phase.md:48-54` loads context if present and otherwise continues; no `--allow-no-context` semantics | repo-local shadow/adaptation of home `plan-phase.md`, exposed through repo-local bootstrap/install path | behavior-changing | `adapt now` |
| `canonical_refs` propagation into downstream reads | `workflows/discuss-phase.md:470-478`; `plan-phase.md:291-304,370-375`; `research-phase.md:48-63` | existing contexts already carry `canonical_refs`, e.g. `03.1-CONTEXT.md:176-208` | `discuss-phase.md:510-518,1037-1056`; `templates/context.md:341-346`; but `plan-phase.md` and `research-phase.md` do not resolve or inject them | repo-local shadow/adaptation of `plan-phase.md` and `research-phase.md`; later optional routing uplift in progress/resume | behavior-changing | `borrow now` |
| Structured `future_preservation` in plans | `templates/phase-prompt.md:14-33`; `gsd-planner.toml:463-480`; `plan-phase.md:699-713` | current plans have no such field, e.g. `03.1-01-PLAN.md:1-40` | no active plan contract surface in the inspected GSDR files; `verify-phase.md:46-120` only knows `must_haves` | repo-local plan artifact contract plus planner/checker shadow surfaces | behavior-changing | `adapt now` |
| Planner mapping rules for future-aware items | `gsd-planner.toml:75-88`; `plan-phase.md:694-702` | only doctrine and hand-authored contexts currently mention future constraints | `plan-phase.md:97-123` passes raw context, but no mapping rule exists in the inspected home workflow files | repo-local shadow/adaptation of `plan-phase.md` prompt blocks and planner prompt surface | behavior-changing | `adapt now` |
| Checker failures for missing/generic preservation | `plan-phase.md:840-844`; `gsd-plan-checker.toml:292-307` | current closeout surfaces are `verify-phase` and `validate-phase`, neither checks preservation | active `verify-phase.md:46-120` and `validate-phase.md:46-120` check delivery/tests only; no preservation failure mode | repo-local shadow/adaptation of plan checker path first; later optional verify/validate uplift | behavior-changing | `adapt now` |
| Research disposition handling | `templates/research.md:41-55,267-282`; `gsd-plan-checker.toml:516-532` | current research artifacts use `Genuine Gaps` and `Still Open`, e.g. `03.1-RESEARCH.md`, `04-RESEARCH.md` | `templates/research.md:191-230` plus `plan-phase.md:139-176` Genuine Gaps/spike flow | adapt research artifact contract only after deciding how it coexists with GSDR Genuine Gaps/spike semantics | mixed | `borrow later` |
| Repo-local bootstrap / overlay behavior | `scripts/setup-portable-gsd.sh:1-87`; tracked `tooling/portable-gsd/overlay/...` | no repo-local `.codex/` tree, no setup/bootstrap script, no harness install command in `package.json:12-24` | active behavior lives in `~/.codex/get-shit-done-reflect`; project only supplies `.planning/config.json:1-27` | create repo-local GSDR bootstrap/install path and tracked overlay/shadow surface | behavior-changing | `adapt now` |

## Real Patch Surfaces In `f1-modeling`

### Repo-local doctrine and governance files

These are not enough by themselves, but they are real patch targets and currently missing:

- `AGENTS.md` at repo root
- `.planning/AGENTS.md`
- `.planning/LONG-ARC.md`
- `WORKFLOW.md`
- `.planning/ARTIFACT-GOVERNANCE.md`

They are needed because `f1-modeling` currently relies on a mix of planning canon, `CLAUDE.md`, and chat-level instructions rather than a committed repo-local governance shell.

### Repo-local artifact conventions

Real targets:

- future `*-CONTEXT.md` artifacts should use normalized `Future Awareness` buckets instead of ad hoc phase/v2 headings
- future `*-PLAN.md` artifacts should adopt `future_preservation`
- future `*-RESEARCH.md` artifacts may later add a disposition layer, but only after harmonizing it with GSDR `Genuine Gaps`

These are worthwhile only if paired with workflow behavior changes.

### Home-level GSDR workflow/template surfaces that would need local shadowing or adaptation

These are the real behavior patch points:

- `~/.codex/get-shit-done-reflect/workflows/discuss-phase.md`
- `~/.codex/get-shit-done-reflect/templates/context.md`
- `~/.codex/get-shit-done-reflect/workflows/plan-phase.md`
- `~/.codex/get-shit-done-reflect/workflows/research-phase.md`
- `~/.codex/get-shit-done-reflect/templates/research.md`

Later-stage follow-on surfaces, once plan-time preservation exists:

- `~/.codex/get-shit-done-reflect/workflows/verify-phase.md`
- `~/.codex/get-shit-done-reflect/workflows/validate-phase.md`
- possibly `progress.md`, `resume-project.md`, `reflect.md`, and the signal command path

### Repo-local bootstrap/install/overlay surface

This repo does not currently have one. That is itself a patch-surface finding.

The concrete target is a repo-local setup/install path that makes local GSDR shadowing reproducible and reviewable, similar in role to `prix-guesser/scripts/setup-portable-gsd.sh`, but aimed at `get-shit-done-reflect`, not plain `get-shit-done`.

### Checker and verification surface

Real enforcement target order:

1. plan-time checker failure for dropped/generic preservation
2. later closeout verification path if preserved seams must remain visible after execution

Without step 1, step 2 has almost nothing structured to verify.

## GSDR-Specific Consequence Of Adopting Each Mechanism

### Normalized `Future Awareness` buckets

On GSDR, this cannot stop at context shape. `progress`, `resume-project`, and `reflect` still route from `STATE.md`, summaries, and KB state. If bucketed future-aware content is not surfaced back into durable routing artifacts, the structure helps planning but still leaks between sessions.

### Hard context gate

On GSDR, the gate should be paired with clear reduced-guarantee messaging because `progress.md` and `resume-project.md` currently only report `CONTEXT: ✓/-`, not the difference between normal planning and bypassed planning.

### `canonical_refs` propagation

This is more valuable on GSDR than it first appears, because Reflect already has more canon and more sidecar artifacts. Without forced downstream reads, long-horizon doctrine can remain visible in repo docs while never reaching researcher/planner/checker prompts.

### `future_preservation`

On GSDR, adding the field only at plan-time is not enough. `verify-phase` and `validate-phase` will still close work on must-haves/tests unless later adapted. So `future_preservation` should be treated as the first structured foothold, not the whole enforcement story.

### Planner mapping rules

On GSDR, these rules should cooperate with the existing `Genuine Gaps` and spike system, not create a second unrelated unresolved-question lane. The planner must know when a future-aware item becomes a validation task versus a spike-worthy research gap.

### Checker failures

Because GSDR already has stronger closeout machinery, checker failures are the best immediate enforcement point. They catch dropped future-aware content before execution burns time and before later Reflect surfaces have to infer what was lost.

### Research disposition

This is the mechanism most likely to need adaptation rather than direct borrowing. GSDR already has `Genuine Gaps`, `Still Open`, and spike integration. A second unresolved-question schema would be counterproductive unless the two are merged.

### Repo-local bootstrap/overlay

This matters more on GSDR than on plain GSD because the active behavior currently lives outside the repo in `~/.codex/get-shit-done-reflect`. Without a repo-local patch layer, future-aware behavior remains operator-local and cannot be reviewed as project infrastructure.

## `borrow now` / `adapt now` / `borrow later` / `reject` Decisions

### `adapt now`

- Normalized `Future Awareness` buckets: strong value, but must be integrated with `f1-modeling`'s existing vision-alignment guardrails and Reflect-era planning surfaces.
- Hard/semi-hard context gating: high leverage, clearly behavior-changing, but should land through a repo-local GSDR shadow path rather than home-level mutation.
- Structured `future_preservation`: valuable only if planner/checker are adapted with it.
- Planner mapping rules: needed to make future awareness auditable rather than aspirational.
- Checker failures for missing/generic preservation: necessary if the prior items are meant to matter.
- Repo-local bootstrap/overlay behavior: prerequisite for durable, reviewable adaptation in this repo.

### `borrow now`

- `canonical_refs` propagation into downstream reads: the capture surface already partly exists in active GSDR, so the downstream resolution/injection mechanism is the most straightforward direct borrow.

### `borrow later`

- Research disposition handling: useful, but secondary to gating, canonical-ref propagation, and plan/check preservation. It should be revisited after deciding how to merge it with GSDR `Genuine Gaps` and spike routing.

### `reject`

- Reject the idea that copying `prix-guesser`'s plain-GSD overlay structure verbatim is sufficient here.
- Reject any rollout that stops at doc updates or template comments without a repo-local GSDR behavior path.
- Reject patching only the operator's home-level GSDR install as the initiative endpoint; that would change one machine, not the repo harness.

## Risks Of Superficial Adoption

- Adding normalized headings to `CONTEXT.md` without gating or checker enforcement will create stronger-looking docs without changing planning behavior.
- Adding `future_preservation` as an empty or generic frontmatter block will create false confidence and likely train reviewers to ignore it.
- Treating the current hand-authored `Future Awareness` sections in `f1-modeling` as proof that active GSDR already supports the mechanism would be a mistake; the current signal already says the convention is advisory-only.
- Porting only the plain phase-planning loop will ignore Reflect-only surfaces such as `progress`, `resume`, `reflect`, `signal`, `verify-phase`, and `validate-phase`, which continue to shape what stays visible and what gets forgotten.
- Copying `Research Disposition` directly without reconciling it against `Genuine Gaps` and spike routing would create two overlapping unresolved-question systems.
- Creating a repo-local doctrine package without a repo-local bootstrap/install path would still leave active behavior dependent on untracked home-level runtime state.

## Unresolved Questions

- What is the lightest repo-local GSDR shadowing path that is reviewable without copying the entire home install into the repo?
- Which active planner/checker prompt surfaces in GSDR should be shadowed locally versus adjusted through workflow prompt blocks?
- Should `future_preservation` become a closeout concern for `verify-phase` only, or also for `validate-phase`, `progress`, and `resume-project`?
- What is the right merger between `Research Disposition` and GSDR `Genuine Gaps` / spike integration?
- Should `.planning/LONG-ARC.md` be created before canonical-ref propagation is strengthened, so the doctrine target exists before the workflow tries to resolve it?
- How should future-aware drift be represented in the KB: new signal tags, explicit drift categories, or a dedicated reflect pass?

## References

### `f1-modeling`

- `.planning/VISION.md`
- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/TECH-DEBT.md`
- `CLAUDE.md:49-84`
- `.planning/config.json:1-27`
- `.planning/phases/03.1-race-state-typed-artifacts-and-branchable-runs/03.1-CONTEXT.md:176-208`
- `.planning/phases/03.1-race-state-typed-artifacts-and-branchable-runs/03.1-CONTEXT.md:262-279`
- `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md:291-310`
- `.planning/phases/03.1-race-state-typed-artifacts-and-branchable-runs/03.1-01-PLAN.md:1-40`
- `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-vision-alignment-guardrails.md:22-90`

### Active home-level GSDR runtime

- `/home/rookslog/.codex/get-shit-done-reflect/templates/context.md:17-72`
- `/home/rookslog/.codex/get-shit-done-reflect/templates/context.md:341-346`
- `/home/rookslog/.codex/get-shit-done-reflect/templates/deliberation.md:1-120`
- `/home/rookslog/.codex/get-shit-done-reflect/templates/research.md:191-230`
- `/home/rookslog/.codex/get-shit-done-reflect/templates/state.md:1-120`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/discuss-phase.md:73-95`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/discuss-phase.md:510-518`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/discuss-phase.md:1037-1056`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/discuss-phase.md:1411-1413`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/plan-phase.md:48-54`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/plan-phase.md:97-123`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/plan-phase.md:139-176`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/research-phase.md:34-72`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/progress.md:81-170`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/resume-project.md:49-137`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/reflect.md:1-180`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/signal.md:1-20`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/verify-phase.md:46-120`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/validate-phase.md:46-120`

### `prix-guesser`

- `/home/rookslog/workspace/projects/prix-guesser/AGENTS.md`
- `/home/rookslog/workspace/projects/prix-guesser/WORKFLOW.md`
- `/home/rookslog/workspace/projects/prix-guesser/.planning/LONG-ARC.md`
- `/home/rookslog/workspace/projects/prix-guesser/.planning/deliberations/2026-04-10-future-awareness-harness-patch.md`
- `/home/rookslog/workspace/projects/prix-guesser/scripts/setup-portable-gsd.sh:1-87`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/context.md:126-143`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/research.md:41-55`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/research.md:267-282`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/phase-prompt.md:14-33`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/discuss-phase.md:470-490`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:230-304`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:370-390`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:694-713`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md:840-844`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/research-phase.md:48-78`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/agents/gsd-planner.toml:75-88`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/agents/gsd-planner.toml:463-480`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/agents/gsd-plan-checker.toml:292-307`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/agents/gsd-plan-checker.toml:516-532`

Wave 1A complete.
- research/01-mechanism-comparison-and-patch-surface-inventory.md (447 lines)

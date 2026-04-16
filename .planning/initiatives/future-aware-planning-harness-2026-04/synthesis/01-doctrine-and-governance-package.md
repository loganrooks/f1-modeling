# Wave 2A Synthesis: Doctrine And Governance Package

## 1. Metadata

- Date: 2026-04-16
- Initiative: `future-aware-planning-harness-2026-04`
- Wave: `2A`
- Spec: `.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-2A-synthesis-doctrine-and-governance-package.md`
- Output: `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/01-doctrine-and-governance-package.md`
- Status: proposed
- Inputs consumed:
  - `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/SPEC-INDEX.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/research/01-mechanism-comparison-and-patch-surface-inventory.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/research/02-gsdr-subsystem-adaptation-inventory.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-1-mechanism-and-adaptation-decisions.md`
- Repo doctrine sources consulted:
  - `.planning/VISION.md`
  - `.planning/PROJECT.md`
  - `.planning/ROADMAP.md`
  - `.planning/STATE.md`
  - `.planning/TECH-DEBT.md`
  - `CLAUDE.md`
  - `.planning/initiatives/vision-alignment-2026-04/APPLICATION-LEDGER.md`
  - `.planning/initiatives/vision-alignment-2026-04/debrief/CARRY-FORWARD-LEDGER.md`

## 2. Executive Summary

`f1-modeling` should adopt a four-file doctrine and governance package that gives future-aware planning a durable repo-local home before any further harness patching:

- `.planning/LONG-ARC.md` becomes the durable doctrine layer between broad vision and live roadmap/state.
- `.planning/AGENTS.md` becomes the planning-specific agent contract that tells Codex what to read, what is binding, and which future-aware lanes are enforced now.
- `WORKFLOW.md` becomes the human-plus-agent operating procedure for future-aware planning, state routing, audit preflight, and initiative carry-forward.
- `.planning/ARTIFACT-GOVERNANCE.md` becomes the source-of-truth and lifecycle map for planning, audit, signal, deliberation, and initiative artifacts.

The package should be narrow and asymmetrical on purpose.

- Enforce now: phase steering artifacts, progress/resume/state routing, tech-debt disposition, and formal audit preflight.
- Govern now but do not schema-clone: decision anchors, signals/reflection, and initiative carry-forward.
- Reject full artifact symmetry across Reflect surfaces.
- Defer a dedicated research-disposition mechanism until it is reconciled with `Genuine Gaps`, `Still Open`, and spike routing.

The key synthesis decision is that these four files should not become a second roadmap or a duplicated memory layer. They should define hierarchy, handoff rules, and consumption rules so later Stage 3 harness changes have a stable repo-local doctrine shell to target.

The package should be paired with one immediate companion apply step: align a narrow root `AGENTS.md` so Codex has a reliable repo-root visibility path into `.planning/AGENTS.md` and the doctrine stack. That root file is a router, not a fifth heavy doctrine file.

## 3. Doctrine Stack Recommendation

### Recommended hierarchy

| Layer | Primary files | Role | Update cadence | Binding effect |
| --- | --- | --- | --- | --- |
| Vision | `.planning/VISION.md` | Broad platform identity, ambition, and eventual shape | rare | informs doctrine |
| Long-arc doctrine | `.planning/LONG-ARC.md` | Durable current posture, protected seams, explicit non-decisions, and future shape constraints that active planning must preserve | infrequent | binding for planning and audits |
| Operational canon | `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md` | Live requirements, roadmap sequence, and rewrite-trigger obligations | moderate | binding for planning and execution |
| Routing memory | `.planning/STATE.md` | Current phase, active carry-forward obligations, relevant doctrine refs, debt refs, and reduced-guarantee status | frequent | binding for progress/resume/session routing |
| Phase steering | `*-CONTEXT.md`, `*-RESEARCH.md`, `*-PLAN.md` | Local planning package for one phase or plan | frequent | binding for planning/execution of that unit |
| Runtime entrypoint | root `AGENTS.md` | Narrow Codex-visible entrypoint that routes planning work into `.planning/AGENTS.md` and the doctrine stack | low | binding for agent read routing |
| Governance interfaces | `.planning/AGENTS.md`, `WORKFLOW.md`, `.planning/ARTIFACT-GOVERNANCE.md` | Tell humans and agents how the stack works and how artifacts must relate | moderate | binding for process and interpretation |
| Secondary memory lanes | deliberations, decision anchors, audits, signals, initiatives, debriefs | Carry decisions, critique, and lessons into the stack through defined interfaces | situational | not co-equal doctrine sources by default |

### Recommended boundary between `VISION.md` and `LONG-ARC.md`

`VISION.md` should stay aspirational and identity-setting.

It already does the right job:

- defines the platform as an educational plus engineering tool
- names eventual compute, regulation, and visualization horizons
- keeps the broad ambition legible

`LONG-ARC.md` should instead answer:

- what present planning posture is binding now
- which future seams must stay open during current work
- which tempting decisions remain intentionally unmade
- which long-horizon bets are protected without widening active scope

This keeps `VISION.md` from becoming a planning contract and keeps `ROADMAP.md` from carrying doctrine by implication.

### Recommended relation to root `AGENTS.md` and `CLAUDE.md`

This synthesis should treat root `AGENTS.md` alignment as an immediate companion apply step to the four-file package, not as an optional later possibility.

- root `AGENTS.md` stays narrow and runtime-facing
- root `AGENTS.md` should tell Codex to read `.planning/AGENTS.md`, `.planning/STATE.md`, `.planning/LONG-ARC.md`, and the active phase or initiative files before doing planning work
- `.planning/AGENTS.md` carries planning doctrine and artifact rules
- `CLAUDE.md` should not remain the only future-aware planning carrier once the package lands

Recommended root `AGENTS.md` job description:

- identify the repo's planning source-of-truth stack in one screenful
- route planning work into `.planning/AGENTS.md`
- keep runtime-facing notes such as current planning harness posture or bootstrap pointer if needed
- avoid duplicating the doctrine, workflow, or artifact-governance content of the four-file shell

That makes root `AGENTS.md` the visibility bridge and `.planning/AGENTS.md` the planning contract. The companion root file should be applied alongside this package so the repo's desired Codex-visible planning surface actually exists.

## 4. Artifact Role Map

| Artifact or class | Primary authority | What it should contain | What it should not become | Main consumers |
| --- | --- | --- | --- | --- |
| `.planning/VISION.md` | broad vision | product identity and eventual horizon | roadmap or workflow policy | humans, long-horizon planning |
| `.planning/LONG-ARC.md` | doctrine | protected seams, current posture, explicit non-decisions, future shape notes | feature backlog or milestone roadmap | planners, auditors, review gates |
| `.planning/PROJECT.md` | operational canon | current requirements, key decisions, active open questions | substitute for doctrine hierarchy | planners, implementers |
| `.planning/ROADMAP.md` | operational canon | phase order, goals, success criteria, plan listings | hidden doctrine carrier | planners, progress/resume |
| `.planning/TECH-DEBT.md` | operational canon | rewrite triggers, deferred obligations, bridge architecture status | generic backlog | planners, audits, state routing |
| `.planning/STATE.md` | routing memory | current work position plus compact future-aware digest | full doctrine file | progress, resume, current session |
| `*-CONTEXT.md` | steering artifact | current decisions, canonical refs, normalized future awareness | free-form reminder dump | discuss, research, planning |
| `*-RESEARCH.md` | steering artifact | evidence, options, `Genuine Gaps`, `Still Open`, unresolved questions | first-pass research-disposition schema clone | planning and reviews |
| `*-PLAN.md` | steering artifact | execution plan plus `future_preservation` and debt disposition | local-only milestone plan blind to doctrine | execution, checking, audits |
| root `AGENTS.md` | runtime router | narrow repo-root pointer to `.planning/AGENTS.md` and the doctrine stack | heavy planning doctrine file | Codex entrypoint |
| decision anchors / deliberations | governance interface | ratified architecture choices and downstream constraint statements | plan-schema duplicate | planners, audits, later initiatives |
| audits / review gates | governance interface | independent critique against doctrine, debt, and local correctness | generic box-checking | human review, acceptance gates |
| signals / reflection | governance interface | durable observations and drift patterns | canonical doctrine source | future planning, reflection |
| initiative ledgers / debriefs | governance interface | carry-forward destinations and application history | mandatory phase-level bureaucracy | planning-system initiatives, roadmap resets |
| `.planning/AGENTS.md` | agent process contract | read order, enforcement-now lanes, governance-only lanes | broad workflow manual | Codex and other agents |
| `WORKFLOW.md` | operating procedure | human-plus-agent workflow, audit preflight, state updates, carry-forward | second artifact registry | humans, auditors, agents |
| `.planning/ARTIFACT-GOVERNANCE.md` | artifact policy | statuses, supersession, artifact-class obligations | second roadmap | humans, agents, initiative authors |

## 5. Proposed File Set And Purpose Of Each File

### `.planning/LONG-ARC.md`

Purpose:

- ratify durable future-aware doctrine into one planning-facing file
- hold the protected seams that active phases must preserve
- keep explicit non-decisions visible so planning does not collapse them by omission

Why it is needed here:

- `VISION.md` is strong but too broad to function as a direct planning contract
- `ROADMAP.md` and `STATE.md` currently carry future-aware implications without a dedicated doctrine home
- audits and future harness patches need one stable doctrine file to require and cite

### `.planning/AGENTS.md`

Purpose:

- tell Codex what files matter inside `.planning/`
- define the hierarchy above so agents do not treat every artifact as co-equal
- state the future-aware planning obligations in short, enforceable language

Why it is needed here:

- the repo currently lacks an on-disk planning-specific agent file
- future-aware planning lives partly in `CLAUDE.md` and partly in initiative memory
- Stage 3 harness patches need a repo-local agent contract to target

### `WORKFLOW.md`

Purpose:

- define the future-aware operating loop for humans and agents
- set the rules for reduced-guarantee planning, state updates, formal audit preflight, and initiative carry-forward
- make progress/resume/state a first-class future-aware lane rather than an afterthought

Why it is needed here:

- current repo workflow guidance is spread across runtime instructions and planning canon
- the Wave 1 gate explicitly named progress/resume/state and audit preflight as enforcement-now lanes

### `.planning/ARTIFACT-GOVERNANCE.md`

Purpose:

- define artifact classes, statuses, and supersession rules
- explain which surfaces are canonical doctrine, which are steering artifacts, and which are interface or evidence lanes
- reject full schema symmetry explicitly so later work has a written stopping point

Why it is needed here:

- Reflect adds many artifact surfaces; without a map, over-patching is likely
- the repo already uses initiatives, debriefs, audits, and signals as real planning carriers

### Companion visibility step: narrow root `AGENTS.md` alignment

Purpose:

- give Codex a reliable repo-root entrypoint into the four-file shell
- make the desired repo-local planning surface visible from the first file agents are likely to read

Why it is needed here:

- the initiative README names a Codex-visible repo-local planning surface as part of the desired end state
- Codex will not reliably discover `.planning/AGENTS.md` by itself
- without a root router, the four-file shell remains structurally correct but operationally underexposed

Constraint:

- this is not a fifth doctrine file
- it is a companion alignment step that points to the four-file shell and stays narrow

## 6. Proposed Treatment For GSDR-Only Subsystem Lanes At The Doctrine/Governance Layer

### Summary policy

| Lane | Treatment now | Governance rule | First-pass anti-overreach rule |
| --- | --- | --- | --- |
| Phase steering (`CONTEXT` / `RESEARCH` / `PLAN`) | enforced | normalize future-awareness and preservation chain | do not let free prose substitute for preserved consequences |
| Progress / resume / state routing | enforced | add compact doctrine/debt/carry-forward digest in `STATE` and require routing to read it | do not turn `STATE` into a second doctrine file |
| Tech-debt / rewrite-trigger governance | enforced | every relevant planning package must disposition relevant `TECH-DEBT` entries | do not require all plans to restate the whole registry |
| Formal audits / review gates | enforced for formal and high-stakes lanes | required reading must include doctrine, debt, and relevant anchors | do not force every casual review into the same ceremony |
| Deliberations / decision anchors | governance-only now | anchors must name downstream constraints and citation destinations | do not require plan-style `Future Awareness` buckets in every deliberation |
| Signals / reflection | governance-only now | future-aware drift and preservation failure become recognized signal topics | do not make every signal a strategic memo |
| Initiative / debrief carry-forward | governance-only for ordinary initiatives, enforced for planning-system or roadmap-reset initiatives | use destination-based carry-forward and application ledgers | do not burden ordinary phase work with initiative bureaucracy |
| Verification / validation | later | consume upstream preservation claims if needed later | do not create a second future-aware schema here yet |
| Research disposition | deferred | revisit only after reconciliation with `Genuine Gaps` and spike routing | do not smuggle it back in through file guidance |

### Detailed lane treatment

#### Phase steering artifacts

At the doctrine layer, require:

- `CONTEXT.md` carries normalized `Future Awareness` buckets
- `PLAN.md` carries structured `future_preservation`
- `PLAN.md` also records relevant tech-debt disposition

Do not require:

- a dedicated new research-disposition section in `RESEARCH.md`

#### Progress, resume, and state routing

At the doctrine layer, require `STATE.md` to carry a compact future-aware digest with:

- active doctrine refs that the next session must read
- active relevant `TECH-DEBT` ids
- any active planning-system or roadmap-reset carry-forward obligations
- whether current planning ran on a reduced-guarantee no-context path

This is a routing summary, not a full restatement of `LONG-ARC.md`.

#### Tech-debt and rewrite-trigger governance

At the doctrine layer, require:

- plans touching a registered seam must cite the relevant debt id
- the plan must classify it as `trigger fired`, `debt retired`, `intentionally deferred`, or `not applicable`
- audits and state routing must surface unresolved high-severity entries when they materially affect the current work

This keeps `TECH-DEBT.md` load-bearing without turning every plan into a registry mirror.

#### Formal audits and review gates

At the doctrine layer, require formal or high-stakes audits to read:

- `.planning/LONG-ARC.md`
- `.planning/TECH-DEBT.md`
- `.planning/STATE.md`
- current phase `CONTEXT.md` and `PLAN.md`
- relevant decision anchors when the phase or initiative depends on them

Audit outputs should answer both:

- is the local artifact or change internally correct
- is it aligned with doctrine, debt posture, and protected seams

#### Deliberations and decision anchors

At the doctrine layer, require:

- decision anchors to name what downstream work they constrain
- plans and audits that depend on an anchor to cite it explicitly

Do not require:

- `future_preservation` in deliberations
- copied `Future Awareness` buckets in every anchor

#### Signals and reflection

At the doctrine layer, allow and encourage:

- signal tags for future-aware drift
- signal tags for preservation failure
- reflection clustering that points back to workflow, guardrail, or tech-debt destinations

Do not require:

- new mandatory signal frontmatter
- automatic signal creation for every planning miss

#### Initiative and debrief carry-forward

At the doctrine layer, require only for planning-system and roadmap-reset initiatives:

- a carry-forward ledger with destinations
- an application ledger once live files are updated

Ordinary initiatives may use the same pattern when helpful, but it should not be mandatory everywhere.

## 7. Draft Content Guidance Or Draft Contents For Each File

### A. Draft Proposal For `.planning/LONG-ARC.md`

Recommended frontmatter:

```yaml
---
document: LONG-ARC
status: canonical
type: strategy-doctrine
scope: Durable long-arc product, architecture, modeling, compute, and governance doctrine that current planning must preserve without widening active phase scope.
related_documents:
  - .planning/VISION.md
  - .planning/PROJECT.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/TECH-DEBT.md
  - .planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md
  - .planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md
---
```

Recommended section structure and draft content:

#### `# Long-Arc Planning Doctrine`

State that the file exists to ratify durable future-aware planning doctrine into one repo-local planning surface. Make explicit that it is not a second roadmap and not a back door for importing later-scope delivery into the current phase.

#### `## Current Product And Planning Posture`

Draft content:

- The repo is building a local-first, single-user F1 modeling lab that is both an educational surface and a future engineering workbench.
- Current planning posture is reduced-order, explainable, honest-about-fidelity, and staged.
- The active roadmap center is Phase `3.2 -> 3.3 -> 3.4` as the D1/D2/D3/D5 foundation corridor before wider Phase 4 product surfaces.

#### `## Protected Seams`

Draft content:

- Preserve a transport-neutral execution boundary so compute can later move between local, remote, and cloud backends without rewriting the product surface.
- Preserve regulation-family-aware execution and semantics; do not let 2026-specific assumptions harden into the long-lived runtime path.
- Preserve typed artifacts with lineage, provenance, fidelity, validation, and comparability state as first-class product surfaces.
- Preserve the educational coupling between artifacts, anchors, lessons, and visual surfaces; do not split education into an unrelated presentation layer.
- Preserve the explicit layered stack of plant and sensor model -> observer -> model-based control -> later RL.
- Preserve honesty labeling, thin-client responsiveness, and accessibility as architectural obligations, not optional polish.

#### `## Current Posture`

Draft content:

- Local-first and single-user remain the active operating posture.
- Reduced-order models are the right current fidelity posture; engineer-grade direction does not justify false precision.
- TypeScript compute remains acceptable as a bridge architecture while empirical triggers in `TECH-DEBT.md` stay unmet.
- The repo treats visualization as a product surface, not decoration.

#### `## Explicit Non-Decisions`

Draft content:

- Do not commit yet to the long-term numerical backend language or deployment topology.
- Do not decide yet whether future remote or cloud compute is self-hosted only, partnered, or fully hosted.
- Do not commit yet to the eventual RL interface or reward structure.
- Do not collapse telemetry import architecture, observer design, and control architecture into one premature implementation choice.

#### `## Future Shape Notes`

Draft content:

- Multi-regulation comparison, calibration against imported data, observer-aware replay, MPC-ready control seams, and later RL remain visible future shapes.
- These are preserved future directions, not immediate scope imports.

#### `## Doctrine Interaction With Tech Debt`

Draft content:

- `TECH-DEBT.md` is the live rewrite-trigger registry that operationalizes long-arc doctrine when transitional seams are accepted temporarily.
- When a protected seam is intentionally bridged, the debt entry is part of the doctrine-carrying surface for that area.

#### `## What Current Planning Must Do`

Draft content:

- Cite this file when architectural seams, rewrite triggers, or phase-sequencing decisions materially interact with long-arc posture.
- Preserve future seams without padding the current phase into a later one.
- Record explicit non-actions when the right move is not to act now.

#### `## Reopen Conditions`

Draft content:

- Reopen this file only when product identity, compute posture, regulation-family doctrine, educational coupling doctrine, or control-stack doctrine materially changes.

### B. Draft Proposal For `.planning/AGENTS.md`

Recommended opening posture:

- narrow, agent-facing, planning-specific
- no broad devops or branch policy duplication
- short enough to stay loaded mentally

Recommended sections and draft content:

#### `# Planning Agents`

State that this file governs work under `.planning/` and is the planning contract that a narrow root `AGENTS.md` should route agents into.

#### `## Read Order`

Draft content:

1. `.planning/STATE.md`
2. `.planning/LONG-ARC.md`
3. `.planning/PROJECT.md`
4. `.planning/ROADMAP.md`
5. `.planning/TECH-DEBT.md`
6. active phase or initiative files
7. relevant decision anchors, audits, signals, or ledgers when cited

#### `## Doctrine Hierarchy`

Draft content:

- `VISION.md` explains broad ambition.
- `LONG-ARC.md` carries durable planning doctrine.
- `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, and `TECH-DEBT.md` are live operational canon.
- `STATE.md` is the routing digest.
- phase artifacts are local steering artifacts.
- deliberations, audits, signals, and initiative ledgers are interface and evidence lanes, not automatically co-equal doctrine.

#### `## Future-Aware Planning Contract`

Draft content:

- Every new `CONTEXT.md` should use `Protected Seams`, `Explicit Non-Decisions`, `Current Posture`, and `Future Shape Notes`.
- Every new `PLAN.md` should map each material future-aware item to exactly one of: preserved seam, sequencing choice, validation task, or explicit non-action rationale.
- Every plan that touches a registered debt seam should disposition the relevant `TECH-DEBT` ids.
- Reduced-guarantee no-context planning must be explicit and must be reflected in `STATE.md`.

#### `## Enforcement-Now Lanes`

Draft content:

- phase steering artifacts
- progress/resume/state routing
- tech-debt disposition
- formal audit preflight

#### `## Governance-Only Lanes`

Draft content:

- decision anchors and deliberations
- signals and reflection
- initiative carry-forward and application ledgers

State explicitly that these lanes need citation and consumption rules, not schema cloning.

#### `## Symmetry Rejection`

Draft content:

- Do not force every Reflect artifact to look like a phase plan.
- Do not add a dedicated research-disposition requirement in this first pass.

#### `## Audit Readiness Rule`

Draft content:

- Formal audits and review gates must read doctrine, debt, state, and relevant anchors before certifying planning or application changes.

### C. Draft Proposal For `WORKFLOW.md`

Recommended positioning:

- human-plus-agent operating workflow
- emphasize planning loop, routing loop, and review loop
- keep broad git or infra detail out unless directly tied to future-aware planning behavior

Recommended sections and draft content:

#### `# Workflow`

State that the file explains how future-aware planning moves through the repo and how doctrine is consumed during planning, review, and carry-forward.

#### `## Source-Of-Truth Stack`

Draft content:

- `LONG-ARC.md` for durable doctrine
- `PROJECT.md`, `ROADMAP.md`, `TECH-DEBT.md` for live operational canon
- `STATE.md` for routing
- phase artifacts for current steering

#### `## Standard Planning Loop`

Draft content:

1. Start from `STATE.md`, then read `LONG-ARC.md`, `ROADMAP.md`, and relevant `TECH-DEBT.md` entries.
2. Produce or update `CONTEXT.md` with normalized future-awareness and `canonical_refs`.
3. Research through current GSDR `Genuine Gaps` and spike routing conventions; do not invent a separate research-disposition layer yet.
4. Produce `PLAN.md` with `future_preservation` and debt disposition.
5. Execute and verify against both local success criteria and any preserved seams or validation tasks.
6. Update `STATE.md`, `TECH-DEBT.md`, signals, and initiative ledgers when the work changes those surfaces.

#### `## Reduced-Guarantee No-Context Rule`

Draft content:

- No-context planning is allowed only as an explicit reduced-guarantee path.
- When used, record it in the planning package and surface it in `STATE.md`.
- Formal audits should treat reduced-guarantee planning as a caution flag, not as a silent normal mode.

#### `## State And Resume Digest`

Draft content:

`STATE.md` should include:

- active doctrine refs
- active relevant `TECH-DEBT` ids
- active planning-system or roadmap-reset carry-forward items
- any reduced-guarantee status still in effect

Keep the digest compact and pointer-heavy.

#### `## Formal Audit Preflight`

Draft content:

Require preflight for:

- planning-system initiatives
- roadmap rewrites
- architecture-setting phase plans
- application gates that touch protected seams or rewrite-trigger corridors

Required reads:

- `LONG-ARC.md`
- `TECH-DEBT.md`
- `STATE.md`
- current `CONTEXT.md`
- current `PLAN.md`
- relevant decision anchors

#### `## Decision Anchor Consumption`

Draft content:

- When a plan or audit depends on a decision anchor, cite it directly.
- Decision anchors must state the downstream work or artifact classes they constrain.

#### `## Signals And Reflection`

Draft content:

- Material future-aware drift, preservation failure, or doctrine-routing misses should become signals when durable enough to matter later.
- Reflection should turn repeated misses into workflow, guardrail, or tech-debt proposals.

#### `## Initiative Carry-Forward`

Draft content:

- Planning-system and roadmap-reset initiatives must keep a carry-forward ledger with destinations and an application ledger once live files change.
- Ordinary initiatives may use the same structure when helpful, but it is not mandatory for every initiative.

### D. Draft Proposal For `.planning/ARTIFACT-GOVERNANCE.md`

Recommended positioning:

- artifact-class and lifecycle map
- explicit statement that not all artifacts are equal and not all need the same schema

Recommended sections and draft content:

#### `# Artifact Governance`

State that the file defines artifact classes, statuses, authority boundaries, and future-aware obligations.

#### `## Doctrine Hierarchy`

Draft content:

- `VISION.md` is broad vision
- `LONG-ARC.md` is durable planning doctrine
- `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `TECH-DEBT.md`, and `STATE.md` are live canon and routing
- phase artifacts are local steering
- other artifact classes are interface, evidence, or historical memory lanes

#### `## Artifact Classes`

Draft content:

- Doctrine
- Operational canon
- Routing memory
- Phase steering artifacts
- Decision anchors and deliberations
- Audits and review gates
- Signals and reflection
- Initiatives, debriefs, and ledgers
- Generated/reference/archive artifacts

For each class, define:

- authority
- expected status labels
- future-aware obligations
- primary consumers

#### `## Steering Artifact Rules`

Draft content:

- `CONTEXT.md` carries normalized future-awareness and `canonical_refs`
- `RESEARCH.md` carries evidence, options, `Genuine Gaps`, and `Still Open`
- `PLAN.md` carries `future_preservation` and tech-debt disposition

State explicitly that `RESEARCH.md` does not gain a mandatory new research-disposition block in this first pass.

#### `## Governance Interface Rules`

Draft content:

- Decision anchors must declare downstream constraints and likely consumer artifacts.
- Formal audits must cite required-reading doctrine and debt surfaces when they are acting as gates.
- Signals should classify future-aware drift when material, but remain lightweight observations.
- Initiative carry-forward ledgers should use explicit destinations such as `signal`, `guardrail`, `workflow`, `tech-debt`, `template`, or `none`.

#### `## Status And Supersession`

Draft content:

Artifacts likely to be revisited should be legible as:

- active
- historical
- superseded
- generated/reference
- archived

Require superseded artifacts to point to their replacement rather than simply remaining ambient.

#### `## Symmetry Rejection`

Draft content:

- Reject full artifact symmetry across Reflect surfaces.
- Enforce future-aware discipline at transmission points and gate interfaces.
- Preserve artifact-appropriate shapes for deliberations, audits, signals, and debriefs.

#### `## Maintenance Rule`

Draft content:

- Update this file when a new artifact class becomes common, a new formal gate is added, or the repo changes where doctrine or routing authority lives.

### Companion Apply Step For Root `AGENTS.md`

This is not part of the four-file doctrine/governance shell itself. It should be applied alongside it so the shell is actually visible from the repo root.

Recommended content shape:

- one short scope section saying the file is runtime-facing and points planning work into `.planning/`
- one short source-of-truth section that points to:
  - `.planning/AGENTS.md`
  - `.planning/STATE.md`
  - `.planning/LONG-ARC.md`
  - `.planning/PROJECT.md`
  - `.planning/ROADMAP.md`
  - `.planning/TECH-DEBT.md`
- one short rule saying planning work under this repo should read `.planning/AGENTS.md` first for the planning contract
- one short note that `WORKFLOW.md` and `.planning/ARTIFACT-GOVERNANCE.md` define operating procedure and artifact policy

Recommended draft wording:

```md
# AGENTS.md

## Scope

This file is the repo-root runtime entrypoint for agents. It stays narrow.

For planning work, read:

1. `.planning/AGENTS.md`
2. `.planning/STATE.md`
3. `.planning/LONG-ARC.md`
4. `.planning/PROJECT.md`
5. `.planning/ROADMAP.md`
6. `.planning/TECH-DEBT.md`
7. the active phase or initiative files

`WORKFLOW.md` defines the operating procedure.
`.planning/ARTIFACT-GOVERNANCE.md` defines artifact roles and supersession.

Do not treat this root file as the place for detailed planning doctrine. It routes planning work into `.planning/AGENTS.md` and the doctrine stack above.
```

Recommended apply rule:

- apply this root alignment in the same review or application window as the four-file shell, or immediately after it as the first companion follow-on
- do not defer it until after Stage 3 harness patching, because that would leave the package underexposed to Codex during the exact transition period when visibility matters most

## 8. Open Decisions That Should Remain At Review Gate

These questions should stay open for a later review gate rather than being silently decided inside the doctrine package:

1. What is the minimum `STATE.md` future-aware digest that improves routing without making the file noisy?
2. Which exact audit classes are formal enough to require doctrine-plus-debt preflight by default?
3. Do decision anchors eventually need a dedicated repo-local template, or is citation plus downstream-constraint guidance enough?
4. Should future-aware drift use a dedicated signal taxonomy, or is disciplined tagging sufficient initially?
5. When should missing tech-debt disposition become a hard checker failure instead of a review or audit finding?
6. After Stage 3 proves the steering-chain patch, does `verify-phase` or `validate-phase` need a light preservation-consumption layer, or is plan-time enforcement sufficient?

## 9. Risks / Tradeoffs

| Risk or tradeoff | Why it matters | Mitigation in this package |
| --- | --- | --- |
| `LONG-ARC.md` duplicates `VISION.md` | would create two vague doctrine files | keep `VISION.md` aspirational and make `LONG-ARC.md` about present planning posture, seams, and non-decisions |
| `STATE.md` digest becomes bloated | routing file could become unreadable | require compact refs and ids, not long prose |
| audit preflight becomes ceremony | formal review could slow down ordinary work | scope it to formal or high-stakes gates only |
| tech-debt disposition becomes box-checking | plans could mechanically cite debt without consequence | require explicit classification tied to the touched seam |
| governance-only lanes remain too weak | drift may still pass through deliberation or signals | keep clear citation and destination rules now, then revisit after Stage 3 evidence |
| root `AGENTS.md` alignment gets skipped | Codex may still rely on mixed repo surfaces during transition even if the four-file shell exists | treat narrow root `AGENTS.md` alignment as an immediate companion apply step to the package |
| rejecting symmetry may feel incomplete | some reviewers may want uniform schemas everywhere | state the interface discipline rationale clearly and keep enforcement focused where leverage is highest |

## 10. References To Stage 1 Findings

### Wave 1A: mechanism comparison and patch-surface inventory

- Wave 1A concluded that the highest-leverage changes are context gating, downstream `canonical_refs` propagation, planner mapping rules, `future_preservation`, checker failures, and repo-local bootstrap behavior.
- Wave 1A also found the repo is missing the exact doctrine and governance surfaces this synthesis depends on: root `AGENTS.md` as the repo-root visibility bridge, plus `.planning/AGENTS.md`, `.planning/LONG-ARC.md`, `WORKFLOW.md`, and `.planning/ARTIFACT-GOVERNANCE.md` as the four-file shell.
- Wave 1A classified normalized `Future Awareness` buckets as worth adapting now, but only as part of a real behavioral chain rather than as prose-only normalization.

Primary source:

- `.planning/initiatives/future-aware-planning-harness-2026-04/research/01-mechanism-comparison-and-patch-surface-inventory.md`

### Wave 1B: GSDR subsystem adaptation inventory

- Wave 1B concluded that the enforcement-now lanes should be phase steering, progress/resume/state routing, tech-debt governance, and formal audit preflight.
- Wave 1B concluded that deliberations/anchors, signals/reflection, and initiative carry-forward need governance and consumption rules now, but not schema-cloning.
- Wave 1B explicitly rejected a cross-cutting symmetry mandate.

Primary source:

- `.planning/initiatives/future-aware-planning-harness-2026-04/research/02-gsdr-subsystem-adaptation-inventory.md`

### Wave 1 review gate

- The review gate kept the initiative unified.
- The review gate bound Wave 2A to reject full artifact symmetry.
- The review gate bound this package to keep research disposition out of the required first pass until reconciled with `Genuine Gaps` and spike routing.
- The review gate confirmed that a doctrine-and-governance pass is the correct next step before harness implementation.

Primary source:

- `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-1-mechanism-and-adaptation-decisions.md`

### Repo doctrine sources that this package intentionally stabilizes

- `.planning/VISION.md`
- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/TECH-DEBT.md`
- `CLAUDE.md`
- `.planning/initiatives/vision-alignment-2026-04/APPLICATION-LEDGER.md`
- `.planning/initiatives/vision-alignment-2026-04/debrief/CARRY-FORWARD-LEDGER.md`

## Conclusion

The recommended Wave 2A package is deliberately narrow:

- one durable doctrine file
- one planning-specific agent contract
- one operating workflow file
- one artifact-governance file

That remains the full doctrine/governance shell. Apply it with one narrow companion root `AGENTS.md` alignment step so Codex can reliably see and enter that shell from the repo root without turning root `AGENTS.md` into a fifth heavy doctrine file.

Wave 2A complete.
- synthesis/01-doctrine-and-governance-package.md (782 lines)

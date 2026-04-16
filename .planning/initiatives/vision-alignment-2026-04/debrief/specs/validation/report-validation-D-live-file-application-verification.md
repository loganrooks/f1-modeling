# Validation Report: Live-File Application Verification

## Claimed Applications

This pass checked the debrief's main live-application claims against direct reread and available commit anchors.

| Claim ID | Claimed application | Main source(s) asserting it |
| --- | --- | --- |
| `APP-01` | The initiative inserted Phases `3.2`, `3.3`, and `3.4` ahead of Phase `4`, reframed Phases `4` and `4.1`, split Phase `5` into `5` and `5.1`, and narrowed Phase `8`. | `../../../APPLICATION-LEDGER.md`; `../../TIMELINE.md`; `../../../SUMMARY.md`; `../../DEBRIEF-SUMMARY.md` |
| `APP-02` | The initiative promoted `.planning/TECH-DEBT.md` into the live registry for accepted rewrite triggers and deferred obligations. | `../../../APPLICATION-LEDGER.md`; `../../../SUMMARY.md`; `../../CHANGES-BEFORE-NEXT-INITIATIVE.md`; `../../CARRY-FORWARD-LEDGER.md` |
| `APP-03` | The initiative applied accepted guardrails to `CLAUDE.md`, including honesty, accessibility, thin-client, benchmark, migration, and contract-completion expectations. | `../../../APPLICATION-LEDGER.md`; `../../../SUMMARY.md`; `../../DEBRIEF-SUMMARY.md`; `../../PATTERNS-TO-KEEP.md` |
| `APP-04` | The initiative changed live routing so the next real step became Phase `3.2` planning rather than direct Phase `4` planning. | `../../../APPLICATION-LEDGER.md`; `../../TIMELINE.md`; `../../../SUMMARY.md`; `../../DEBRIEF-SUMMARY.md` |
| `APP-05` | The initiative changed broader planning/process guidance or planning templates, not just `CLAUDE.md` and the four named live planning files. | `../../../SUMMARY.md`; `../../PATTERNS-TO-KEEP.md`; some closeout prose that says the initiative changed "operating docs" or planning practice broadly |

## Direct File Verification

| Claim ID | Live file(s) reread | Direct verification |
| --- | --- | --- |
| `APP-01` | `.planning/ROADMAP.md` | Current reread shows `3.2`, `3.3`, and `3.4` before `4`; `4.1` is now "Observer and Replay Workbench"; `5.1` is visible; `8` is now "First Regulation and Design Exploration Wave." Commit `e5e4a87` directly anchors these roadmap edits. |
| `APP-02` | `.planning/TECH-DEBT.md` | Current reread shows a live "Tech-Debt Registry" explicitly promoted from the initiative, including the accepted VA debt entries and the benchmark, `AccessibleChartContract`, and `AnchorRegistry` obligations. Commit `e5e4a87` directly anchors creation of the file and the initial registry payload. |
| `APP-03` | `CLAUDE.md` | Current reread shows the guardrail additions attributed to the initiative: visible fidelity labeling, renderer-substrate discipline, accessibility, thin-client baseline, legacy renderer freeze, Phase 4 contract-completion rule, benchmark evidence gate, registry-update rule, and vision-alignment checkpoint language. Commit `e5e4a87` directly anchors these additions. |
| `APP-04` | `.planning/STATE.md` | Current reread shows `current_phase: 03.2` and Phase 3.2 as the next planning step. Commit `6cb19f7` directly anchors the post-initiative state sync from Phase `4` to Phase `3.2`. |
| `APP-05` | `.planning/AGENTS.md`; live planning templates by implication | Current reread of `.planning/AGENTS.md` shows planning doctrine that is compatible with the initiative outcomes, but no application-ledger entry or cited application commit ties that file or any template change to the 2026-04-11 initiative application event. |

## Proof Class And Gaps

| Claim ID | Proof class | Gap note |
| --- | --- | --- |
| `APP-01` | `diff or commit anchor` | Strongest proof class. The roadmap consequence is directly visible in commit `e5e4a87` and still persists in the current reread. Current-state reread proves persistence, but later roadmap edits mean it should not be described as unchanged since application. |
| `APP-02` | `diff or commit anchor` | Strongest proof class for registry creation and initial carry-forward. Current reread proves the registry persisted and remains live, but some present wording may reflect later evolution beyond the original application event. |
| `APP-03` | `diff or commit anchor` | Strongest proof class for `CLAUDE.md` itself. The evidence does not prove that all broader planning/process guidance or template changes were applied on 2026-04-11. Keep the claim scoped to `CLAUDE.md` unless more file-level anchors are cited. |
| `APP-04` | `diff or commit anchor` | Strongest proof class for the original routing change. Current reread proves persistence of the Phase `3.2` routing, but the file has since evolved substantially beyond the initial sync. |
| `APP-05` | `unclear` | The current repo may now contain later doctrine or template changes, but this validation pass did not find a 2026-04-11 application commit or ledger proof tying those broader changes to the initiative application event. Ledger and summary language alone are not enough. |

## Verification Dispositions

| Claim ID | Disposition | Reason |
| --- | --- | --- |
| `APP-01` | `verified` | The exact roadmap reshaping is diff-anchored in `e5e4a87` and still visible in the current roadmap. |
| `APP-02` | `verified` | `.planning/TECH-DEBT.md` was created by the application commit and still functions as the live registry for initiative carry-forward. |
| `APP-03` | `verified` | `CLAUDE.md` guardrail changes are directly anchored by `e5e4a87` and remain visible now. |
| `APP-04` | `verified` | `.planning/STATE.md` was explicitly synced in `6cb19f7` and still routes the project to Phase `3.2`. |
| `APP-05` | `soften` | The debrief should not imply that broader planning templates or operating doctrine were proven to change as part of the 2026-04-11 application event unless it cites additional live files and commit anchors beyond `CLAUDE.md`, `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md`, and `.planning/STATE.md`. |

## Closeout Corrections

- Keep applied-governance language explicit and file-scoped: the application event is directly proven for `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md`, `CLAUDE.md`, and `.planning/STATE.md`.
- Soften any wording that says the initiative applied broader "planning/process guidance" or "planning-template/process guardrail changes" unless the debrief names additional live files and shows diff-grade proof for them.
- Treat `../../../SUMMARY.md` as a Stage 3 synthesis snapshot, not proof of application by itself. Its "should be modified later" and suggested commit sequence sections are planning intent, not application evidence.
- Where closeout prose says the initiative changed "operating docs," prefer "changed the roadmap, tech-debt registry, `CLAUDE.md`, and state routing" unless a wider file set is directly evidenced.
- Preserve the distinction between:
  - `current-state reread proves persistence now`
  - `diff or commit anchor proves the original application event`
- No correction is needed for the core claim that the initiative materially changed the live project state. That claim is now directly supported by commits `e5e4a87` and `6cb19f7`.

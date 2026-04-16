# Timeline

**Status:** Populated on 2026-04-16 for Debrief Spec A.
**Source spec:** `specs/spec-debrief-A-timeline-and-evidence-reconstruction.md`

## Evidence Scope Note

The recommended core pack covered most of the sequence. Two targeted escalations were needed to answer Spec A cleanly:

- `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` for the pre-initiative trigger
- `../reviews/review-wave-2-structure-decisions.md` for the Gate 1 restructure from the original scaffolding to the executed `delta` shape

## Purpose

Provide a dated, factual sequence from the original audit trigger through application of the Stage 3 outputs, with clear separation between:

- planned structure
- executed work
- review and audit checkpoints
- live-file application

## Traceability Rule

Each row should cite:

- date
- original plan element or review gate
- what actually happened
- evidence file(s)

## Timeline Table

| Date | Category | Original plan element | What happened | Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-04-08 to 2026-04-10 | Trigger | Pre-plan trigger outside `../PLAN.md` | Three independent vision audits were consolidated into a single audit response that said the Phase 4 research had answered the wrong-sized question and proposed a staged follow-up of research, deliberations, roadmap evolution, and guardrails. | `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`; `../README.md`; `../handoffs/handoff-codex-primary-orchestrator.md` | This is the initiating problem statement for the initiative, not yet initiative execution. |
| 2026-04-10 | Planned structure | `../PLAN.md` wave scaffold | The initiative was scaffolded as Wave 1 research, Review Gate 1, optional Wave 1.5, Waves 2a/2b/2c/2d deliberations, Wave 3 synthesis, and a final manual application step. | `../PLAN.md`; `../README.md` | Planned structure only. `../PLAN.md` explicitly treats this as revisable scaffolding rather than a fixed execution contract. |
| 2026-04-10 | Executed work | Wave 1 (`1A`, `1B`, `1C`) | Wave 1 ran and produced the five research outputs. The original detached `nohup` launch pattern failed, so execution fell back to three Codex-native parallel subagents. | `../reports/report-wave-1-orchestrator-execution.md`; `../PLAN.md`; `../SPEC-INDEX.md` | Output scope held; launch mechanics changed. |
| 2026-04-10 to 2026-04-11 | Review / restructure checkpoint | Review Gate 1 | Review Gate 1 did not simply advance the original plan. The work was restructured around a shared boundary/contract memo, Round 1.5 was commissioned, and regulation work was split so D1 would absorb execution-flow closure while a smaller D5 would later close semantic-model questions. | `../PLAN.md`; `../reviews/review-wave-2-structure-decisions.md`; `../handoffs/handoff-codex-primary-orchestrator.md` | This is the main plan-shape revision point (`delta = beta + memo + modified R5 treatment`). |
| 2026-04-11 | Executed work | Optional Wave 1.5 | The optional follow-up branch was actually used: R1.5 ran as performance-envelope research covering UI/rendering and job/compute envelopes, worst-plausible scenarios, and a measurement methodology. | `../PLAN.md`; `../SPEC-INDEX.md`; `../reviews/review-wave-2-structure-decisions.md` | No evidence in `../SPEC-INDEX.md` or `../PLAN.md` of additional Wave 1.5 follow-up calls beyond this executed R1.5 prompt. |
| 2026-04-11 | Executed work | Wave 2a / `2A` | D1 backend-boundary deliberation executed and addressed all four planned contracts. | `../PLAN.md`; `../SPEC-INDEX.md`; `../handoffs/handoff-codex-primary-orchestrator.md` | `../PLAN.md` records C1 reframed into a two-stage shape and C2 left provisional on edge transport. |
| 2026-04-11 | Review checkpoint | Review Gate 2a | The user accepted all four D1 contracts, allowing the initiative to proceed to the coupled D2/D3 deliberations. | `../PLAN.md`; `../handoffs/handoff-codex-primary-orchestrator.md` | Gate outcome in `../PLAN.md`: C1, C3, and C4 closed; C2 accepted provisionally. |
| 2026-04-11 | Executed work | Process/orchestration adjustment between Wave 2a and 2b | Primary orchestration shifted from Claude to Codex for the remaining initiative work; Claude moved into fallback and cross-model audit roles. | `../PLAN.md`; `../handoffs/handoff-codex-primary-orchestrator.md`; `../handoffs/handoff-claude-fallback-session.md` | This changed who ran the remaining waves, not the initiative's substantive scope. |
| 2026-04-11 | Executed work | Wave 2b / `2B-i` | D2 visualization-architecture deliberation executed. | `../PLAN.md`; `../SPEC-INDEX.md` | `../PLAN.md` records C4 provisional, C5 accepted, and C6 provisional. |
| 2026-04-11 | Executed work | Wave 2b / `2B-ii` | D3 educational-content-architecture deliberation executed with D2 in context. | `../PLAN.md`; `../SPEC-INDEX.md` | `../PLAN.md` records O1 accepted and content-side C6 accepted provisionally on `AnchorRegistry` completion. |
| 2026-04-11 | Review checkpoint | Review Gate 2b and optional `2B-iii` branch | D2 and D3 were accepted together, and the initiative moved forward to D5 without launching a D2 revision wave. | `../PLAN.md`; `../SPEC-INDEX.md` | Explicit unused optional branch: `2B-iii` was skipped, and `../SPEC-INDEX.md` says no separate `2B-iii` spec was authored. |
| 2026-04-11 | Executed work | Wave 2c / `2C` | D5 regulation semantic-model deliberation executed after D1 had already absorbed the execution-flow slice of the original R5 problem. | `../PLAN.md`; `../SPEC-INDEX.md` | `../PLAN.md` records O2 accepted provisionally and D5.A/B accepted. |
| 2026-04-11 | Review checkpoint | Review Gate 2c | D5 was accepted and the initiative proceeded to D4 roadmap synthesis. | `../PLAN.md` | No loopback is evidenced after Gate 2c. |
| 2026-04-11 | Executed work | Wave 2d / `2D` | D4 long-horizon roadmap deliberation executed, and the D4 acceptance Decision Record was committed as `6050c50`. | `../PLAN.md`; `../SPEC-INDEX.md`; `../audit/2026-04-11-d4-acceptance-response.md` | `../PLAN.md` records D4 as complete the same day and notes that the later formal audit validated the acceptance. |
| 2026-04-11 | Audit checkpoint | Review Gate 2d / formal D4 audit | The intended formal D4 audit did not happen before acceptance. Claude first handled D4 in advisory mode, the user accepted and committed `6050c50`, and only then did the formal audit run post hoc and validate that the acceptance should stand. | `../audit/2026-04-11-d4-acceptance-response.md`; `../PLAN.md` | Important order deviation: the audit response says this was out of protocol order but non-blocking. |
| 2026-04-11 | Executed work | Wave 3 / `3A` | Stage 3A synthesis produced `synthesis/roadmap-evolution.md` and `synthesis/phase-insertion-proposals.md` in commit `cfb2d81`. | `../APPLICATION-LEDGER.md`; `../PLAN.md` | The planned serial order was preserved: `3A` landed before `3B`. |
| 2026-04-11 | Executed work | Wave 3 / `3B` | Stage 3B synthesis produced `synthesis/guardrails-proposal.md`, `synthesis/tech-debt-registry.md`, and `SUMMARY.md` in commit `7d0d00e`. | `../APPLICATION-LEDGER.md`; `../PLAN.md`; `../SUMMARY.md` | This closed the initiative-side synthesis artifact set. |
| 2026-04-11 | Audit checkpoint | Final Review / pre-application formal audit | A formal Stage 3 application audit then ran in the correct pre-application order, found no blocking issues, and recorded the application-readiness gate in commit `f8cd670`. | `../audit/2026-04-11-stage-3-application-response.md`; `../APPLICATION-LEDGER.md` | Unlike the D4 audit, this one occurred before any live planning-file edits. |
| 2026-04-11 | Live-file application | Final Review manual application | Accepted Stage 3 outputs were applied to live planning/governance files in commit `e5e4a87`: `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md`, and `CLAUDE.md`. | `../APPLICATION-LEDGER.md`; `../README.md` | This is the point where initiative outputs changed live project guidance. No phase-template edits are evidenced in the application ledger. |
| 2026-04-11 | Live-file application | Post-application state sync | The live project state was then synced in commit `6cb19f7`, updating `.planning/STATE.md` so the next real project step became Phase 3.2 planning rather than direct Phase 4 planning. | `../APPLICATION-LEDGER.md`; `../README.md` | Application completed here. The initiative did not scaffold downstream phase files or perform downstream implementation work. |

## Explicitly Unused Or Unexercised Planned Branches

- `Wave 2B-iii` was planned as an optional D2 revision branch but was not launched; `../SPEC-INDEX.md` says no separate spec was authored.
- `Wave 1.5` was planned as `0-N` follow-up calls, but the evidence set only shows one executed R1.5 prompt, not multiple follow-up waves.
- `../PLAN.md`'s Final Review text anticipated possible phase-template edits, but `../APPLICATION-LEDGER.md` records live-file application only to `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md`, `CLAUDE.md`, and then `.planning/STATE.md`.

## Follow-Up Chronology Caveats

- `Review Gate 2b` was one gate, but not one undifferentiated event. D2 was accepted before the D3 prompt was drafted, which matters because D3 consumed accepted D2 outputs rather than a pending D2 draft. See the sweep follow-up in `runs/2026-04-16-llm-sweep/reports/A-timeline-and-event-alignment.md`.
- The D4 formal-audit request existed in workflow before acceptance, but the current canonical `audit/` layout is a later record normalization. Readers should not infer from present-day file paths alone that no request existed before `6050c50`.
- The current canonical directory layout is a later auditability cleanup, not the original 2026-04-11 runtime shape. The timeline is factual, but path-level chronology sometimes reflects later curation rather than same-day layout.

# Patterns To Keep

**Status:** Populated from Debrief Spec C.
**Source spec:** `specs/spec-debrief-C-substantive-value-and-patterns-to-keep.md`

## Purpose

Record the practices that materially improved outcome quality or project clarity so they can be reused intentionally rather than remembered vaguely.

## Inclusion Rule

Only record a pattern here if:

- it clearly improved the initiative
- the evidence is specific
- there is a plausible future reuse target

## Worked Well

| Pattern | Why it mattered | Evidence | Reuse target | Keep as-is or adapt? |
| --- | --- | --- | --- | --- |
| Decision anchors that close contracts and name downstream constraints | The initiative's highest-leverage decisions stayed usable because the anchors did not stop at preferences; they named the contract, the adjacent implications, and the open question boundary. That made Stage 3 synthesis and live-file application possible without reopening D1/D2/D3/D5. | `deliberations/01-decision-anchor.md:5-17`; `deliberations/02-decision-anchor.md:5-29`; `deliberations/03-decision-anchor.md:5-25`; `deliberations/04-decision-anchor.md:5-21`; `.planning/ROADMAP.md:117-206`; `CLAUDE.md:39-50` | Future architecture or roadmap-reset initiatives where multiple later phases depend on one accepted contract set. | Keep as-is |
| Dependency-honest roadmap reshaping through explicit phase insertions and narrowed scope | This is the pattern that materially corrected the wrong-sized Phase 4 framing. Instead of treating accepted architecture as commentary, the initiative turned it into sequencing: 3.2/3.3/3.4 became preconditions, Phase 4 narrowed, Phase 4.1 was reframed correctly, Phase 5 split became visible, and later milestones stayed thematic instead of fake-detailed. | `deliberations/05-decision-anchor.md:5-17`; `synthesis/roadmap-evolution.md:39-56`; `synthesis/roadmap-evolution.md:62-177`; `.planning/ROADMAP.md:17-27`; `.planning/ROADMAP.md:117-177`; `.planning/ROADMAP.md:284-341`; `.planning/STATE.md:167-181` | Any future initiative that discovers the next planned phase is hiding prerequisite substrate or semantic work. | Keep as-is |
| Promote accepted rewrite triggers into a living top-level tech-debt registry with phase targets | This converted architectural debt from scattered audit prose into a planning artifact that future work must look at. It materially improved project clarity because 3.2 and 3.3 now have named retirement work, explicit planning gates, and visible rewrite triggers instead of vague "clean this up later" language. | `synthesis/tech-debt-registry.md:15-25`; `synthesis/tech-debt-registry.md:27-45`; `.planning/TECH-DEBT.md:17-27`; `.planning/STATE.md:169`; `.planning/STATE.md:185-188` | Any initiative that accepts transitional architecture or known rewrite pressure. | Keep as-is |
| Translate accepted architecture into standing planning guardrails and template expectations | The initiative did not stop at "new roadmap words." It pushed honesty, accessibility, thin-client, benchmark, migration, and vision-alignment obligations into the operating docs that govern later phase planning. That materially improved clarity because the next planning cycle inherits the decision consequences by default. | `synthesis/guardrails-proposal.md:41-48`; `synthesis/guardrails-proposal.md:54-85`; `synthesis/guardrails-proposal.md:87-126`; `CLAUDE.md:39-50`; `CLAUDE.md:54-66`; `CLAUDE.md:84-91` | Future initiatives whose conclusions need to constrain planning behavior, not just change one roadmap section. | Keep as-is |

## Worked, But Too Expensively

| Pattern | Why it mattered | Evidence | Reuse target | Keep as-is or adapt? |
| --- | --- | --- | --- | --- |
| Full multi-stage initiative chain before live-file application | The full chain produced a clean, auditable application pack and did change the live project state. But the value ultimately concentrated in a small set of synthesis artifacts and four live planning/governance files, so this level of orchestration should be reserved for true roadmap or governance resets. | `APPLICATION-LEDGER.md:7-31`; `APPLICATION-LEDGER.md:36-43`; `audit/2026-04-11-stage-3-application-response.md:15-17`; `.planning/ROADMAP.md:17-27`; `.planning/TECH-DEBT.md:17-27`; `CLAUDE.md:39-66`; `.planning/STATE.md:27`; `.planning/STATE.md:167-181` | Future cross-cutting architectural resets that change roadmap shape, planning policy, and debt posture together. | Adapt: keep the decision-anchor -> synthesis -> application pattern, but time-box earlier and avoid re-running full-wave scope once the live-file consequences are already clear |

---
document: SEED
status: seed
type: future-initiative
created: 2026-05-15
related_documents:
  - .planning/VISION.md
  - .planning/LONG-ARC.md
  - .planning/deliberations/educational-pedagogy-and-learning-paths.md
---

# Seed: Puzzle / Skill-Practice Mode

## What this is

A future initiative seed for a **chess.com-style structured-practice layer** on the F1 Modeling Lab. Lessons and tutorials remain the primary pedagogy (per the 2026-04-08 implicit-pedagogy choice). Puzzle mode is an **optional explicit layer** that uses the same simulation artifacts to drill recognition, recall, judgment, and pattern fluency under controlled conditions.

This is a seed, not an active initiative. The 3.2 → 3.3 → 3.4 corridor protects the required architectural seams without delivering puzzle mode itself.

## Why it belongs

- The simulator produces deterministic ground truth — stints, races, telemetry — under known parameters. That is exactly the substrate good puzzles need.
- F1 engineering, like chess, has a large body of **pattern-recognition skill**: reading a degradation curve, recognizing a deployment strategy, identifying a circuit from telemetry, spotting a missed apex. These skills benefit from drill more than passive exposure.
- Puzzle mode is one of the strongest learning surfaces a serious platform can offer; it distinguishes a "lab" from a "calculator" and is a competitive moat against generic strategy tools.
- It composes cleanly with the implicit-pedagogy decision (it does not replace structural learning) and with the dual education-plus-engineering identity (puzzle practice for the engineering trainee; explanation surfaces for the practicing engineer).

## Example mechanic families

| Family | Example prompts | Source artifacts |
|---|---|---|
| **Recognition** | "Which circuit is this telemetry from?" "Which compound started this stint?" "Which weather state matches this grip evolution?" | Existing speed-trace, stint-trace, weather-evolution artifacts |
| **Judgment** | "Given this race state, when should the next pit stop happen?" "This deployment policy or that one — which wins?" "Which setup change caused this lap-time delta?" | Race-timeline + waterfall artifacts |
| **Spot-the-difference** | "Where in this stint could the driver have saved time?" "Two stints differ by one parameter — which one?" | Two artifacts plus a diff overlay |
| **Reconstruction** | "Given this lap-time outcome, rebuild the deployment policy that produced it" | Inverse-problem artifact + scoring against simulator |
| **Match-the-strategy** | "Match each strategy to its team given the race outcome" | Post-race forensic artifact ensemble |

## Difficulty progression

- **Beginner:** small candidate set (3-4 options), high-contrast distinguishing features, fully labeled context.
- **Intermediate:** larger candidate set, partially masked context, optional time pressure.
- **Advanced:** near-twin candidates (same era, similar circuits), heavily masked context, no labels, scoring includes confidence calibration.
- **Daily / ranked:** spaced-repetition rotation; per-mechanic skill rating; optional persistent ranking once the simulator and the Phase 7 calibration baseline are credible enough that the ground truth deserves a leaderboard.

## Architectural implications (load-bearing on 3.2 → 3.3 → 3.4)

Puzzle mode is not a Phase-4+ surface-only feature. It has real implications for the three corridor phases that are already being designed:

| Corridor phase | What puzzle mode needs that current plans don't yet provide |
|---|---|
| **3.2 — artifact envelope** | "Puzzle source" artifact role with selective component masking (show telemetry, hide circuit identity until reveal); scoring / judgment / reconstruction artifact roles; difficulty metadata on saved runs and scenarios |
| **3.3 — visualization substrate** | "Hide answer until revealed" interaction state; multiple-choice overlay primitive; timer / score chrome; reveal-with-explanation transition; selective-mask rendering primitives |
| **3.4 — lesson schema** | A `puzzle` lesson-body variant alongside the text / visualization variants; question / answer / scoring contract; difficulty-progression and (optionally) spaced-repetition metadata; ranking / ELO data shape if persistent |

The required move now is **seam-preservation, not delivery**. Each phase's CONTEXT.md and PLAN.md should be designed so puzzle-mode delivery later is additive — never a retrofit against locked schemas.

## Relationship to the 2026-04-08 implicit-pedagogy decision

The 2026-04-08 educational-pedagogy deliberation chose **implicit > explicit pedagogy** because the user is a self-directed learner with an engineering background who learns better through structured exposure than through quizzes. That choice still holds for the **primary** mode of the platform: structure-driven learning through inspectable simulation.

Puzzle / skill-practice mode is a **layered optional explicit pedagogy** that depends on, not replaces, the implicit primary mode. The reframe:

- **Implicit primary:** the simulator and its visualizations remain the main teaching surface. A learner who never opens puzzle mode still learns by structure.
- **Explicit optional:** for learners who want drill — and for educators who want to test understanding before a lesson advances — puzzle mode adds a structured-practice layer that consumes the same artifacts.

See `.planning/deliberations/educational-pedagogy-and-learning-paths.md` § Amendment 2026-05-15 for the formal note.

## Scope boundaries

- **Single-player.** No synchronous multiplayer. Async ranked / shared-puzzle-of-the-day is acceptable but not in early scope.
- **Built on existing artifacts.** Puzzles consume `ArtifactEnvelope` shapes that lessons and analysis views also consume. Puzzles are not a parallel data path.
- **Educational primary.** Puzzles are a teaching tool first, a game second. Scoring exists to drive spaced repetition and skill progression, not to displace the simulation/lesson surface.
- **Deterministic generation.** The simulator generates puzzle scenarios from regulation/scenario parameters. No hand-authored puzzle content beyond curriculum-level metadata.

## Revisit triggers — when should this seed become an active initiative?

Promote this seed to an initiative when **any** of the following hold:

1. Phase 4 strategy workbench + Phase 4 initial engineer-role lesson delivery are both shipped and the user has run them long enough to confirm the implicit-pedagogy primary mode is working. (Earliest possible: post-Phase-4 close.)
2. Phase 6 telemetry-import + Phase 7 calibration give the platform a credible non-simulated ground-truth source that real-data-vs-puzzle becomes possible.
3. The user identifies a specific learning objective (their own or a hypothetical user's) that the existing lesson + analysis surface cannot reach, and where puzzle drill is the obvious next step.
4. An external request (engineering trainee, racing program contact, educator) names puzzle practice as a desired feature — turning the abstract case into a concrete user.
5. The corridor (3.2/3.3/3.4) finishes and proves the seam-preservation has held — at that point, design cost to deliver puzzle mode is much lower and the seed can be promoted with confidence.

## Open questions (not blockers; revisit at promotion)

| Question | Why it matters |
|---|---|
| Where do per-user skill ratings live? Local disk only? A multi-user back end? | Local-disk only is consistent with the local-first posture. Multi-user back end is a separate vision shift. |
| Is the scoring rubric per-mechanic-family, or unified? | Per-family rubrics let "recognition" and "reconstruction" have different difficulty signals; a unified rubric is simpler but coarser. |
| Should puzzle scenarios be curated by hand or generated procedurally? | Curated gives quality; procedural gives volume and difficulty progression. Probably both, with curation defining "good puzzle" templates and procedural generation filling them. |
| How does puzzle mode interact with the calibration story? Should puzzles only use validated artifacts? | Honesty obligation: if the simulator is wrong about a phenomenon, puzzles about that phenomenon teach the wrong intuition. Validation state is a load-bearing input to puzzle authoring. |
| Spaced-repetition algorithm choice (SM-2, FSRS, custom)? | Off-the-shelf is the right starting point; the platform shouldn't be a spaced-repetition research project. |

## Status

Seed only. The 3.2 → 3.3 → 3.4 corridor is responsible for preserving the architectural slots; this seed is referenced from CONTEXT.md `<future_awareness>` blocks so the corridor design stays aware.

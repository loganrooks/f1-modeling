# Research Principles

This initiative is not a generic process-doc rewrite. It is a planning-harness adaptation effort. Research should therefore prioritize **behavioral leverage** over elegant language.

## Core commitment

Do not confuse:

- better doctrine prose
- repo-local Codex-readable guidance
- actual workflow enforcement

The initiative only succeeds if the work clearly distinguishes those layers and identifies where behavior really changes.

## Required posture

- Prefer mechanism over slogan.
- Prefer active workflow surfaces over passive documentation surfaces.
- Prefer repo-local reproducibility over home-install assumptions.
- Preserve distinctions between plain GSD and GSDR; do not flatten them.
- Treat GSDR-only subsystems as first-class inquiry targets, not afterthoughts.

## Required outputs for research files

Every research artifact in this initiative should make the following explicit:

1. What is currently true in `f1-modeling`
2. What is currently true in the comparison source (`prix-guesser`)
3. Which difference is merely documentary versus behavior-changing
4. Which patch surface in `f1-modeling` would actually have to move
5. Whether the recommendation is:
   - `borrow now`
   - `borrow later`
   - `adapt heavily`
   - `reject`

## Anti-patterns

Avoid these mistakes:

- treating a template comment as equivalent to enforcement
- treating `CLAUDE.md`-only policy as sufficient for Codex behavior
- assuming a plain-GSD patch automatically fits GSDR
- proposing broad governance docs without naming what downstream tool behavior they alter
- recommending a full harness replatform when a smaller repo-local overlay would suffice

## Comparison rule

When a `prix-guesser` mechanism is cited, research must answer all three:

1. What exact file or workflow implements it there?
2. What is the nearest analogous surface here?
3. Is the right move to copy, adapt, or deliberately not port it?

## GSDR adaptation rule

Every research pass should explicitly consider whether the recommendation affects any of these additional subsystems:

- deliberations / decision anchors
- audits / cross-model review
- signals / knowledge store
- progress / resume / state routing
- initiative / debrief / carry-forward surfaces
- tech-debt / rewrite-trigger governance

If the answer is no, say why.

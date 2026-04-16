# Audit Workspace

This initiative now uses the shared repo-level formal gate package in `.planning/audits/`.

Start every new formal audit from:

- `.planning/audits/README.md`
- `.planning/audits/templates/audit-request-template.md`
- `.planning/audits/templates/audit-response-template.md`

Use this directory only for formal audit artifacts that are specific to the Future-Aware Planning Harness initiative.

Relevant cases for this initiative include:

- pre-application audits before live planning or governance files change
- formal acceptance audits for doctrine or harness packages that affect normal project workflow
- post-application verification audits when the initiative claims a material harness change

Initiative-specific note:

- keep the request scoped to this initiative's planning-system files and accepted doctrine or routing inputs
- do not treat ordinary wave reviews as formal audits; those belong in `../reviews/`

This directory may stay sparse between gates. The shared repo-level package now defines the required preflight and response structure.

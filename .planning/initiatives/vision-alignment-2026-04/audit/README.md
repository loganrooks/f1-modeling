# Vision Alignment Audit Workspace

This initiative now points to the shared repo-level formal gate package in `.planning/audits/`.

Start any new formal audit from:

- `.planning/audits/README.md`
- `.planning/audits/templates/audit-request-template.md`
- `.planning/audits/templates/audit-response-template.md`

This folder remains the historical home for Vision Alignment audit artifacts and any follow-on formal rechecks tied to that initiative.

## Initiative-Specific Role Notes

The Vision Alignment initiative established a narrow cross-model audit boundary that still matters for artifacts in this folder:

- Codex was the primary orchestrator
- Claude served only as a fallback auditor when a second model was explicitly requested
- the user bridged between Codex and Claude sessions when an external auditor was used

The auditor is a reviewer, not a replacement orchestrator. Audit findings inform judgment; they do not take over the initiative.

## Cross-Model Bridge For This Initiative

When a Vision Alignment audit uses an external Claude auditor:

1. Codex writes the request in this folder, starting from the shared repo-level audit request template
2. The user starts a Claude session and points Claude at the request document
3. Claude reads the request, performs the audit in fallback-auditor role, and writes the response into this folder
4. The user confirms the response exists and relays the findings back to Codex
5. Codex decides what to do with the findings

This keeps the repo-level formal gate package as the shared structure while preserving the initiative's established user-bridge pattern for Codex-primary / Claude-fallback audits.

## Historical Naming Note

Existing Vision Alignment audit artifacts may use the earlier paired naming:

- `YYYY-MM-DD-<topic>-request.md`
- `YYYY-MM-DD-<topic>-response.md`

New follow-on work should prefer the repo-level naming:

- `YYYY-MM-DD-<topic>-audit-request.md`
- `YYYY-MM-DD-<topic>-audit-response.md`

Use the older style only when continuity with an existing request/response pair matters more than renaming consistency.

## When This Folder Should Be Used

Use this folder only for formal Vision Alignment audit artifacts that certify or re-check initiative outcomes.

Advisory review notes do not belong here and do not replace a formal audit.

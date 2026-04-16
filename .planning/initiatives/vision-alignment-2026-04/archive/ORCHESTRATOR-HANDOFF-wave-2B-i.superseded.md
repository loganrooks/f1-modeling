# Orchestrator Handoff — Wave 2B-i (D2 Visualization Architecture)

**Intended runtime:** Codex GPT-5.4, xhigh reasoning, `danger-full-access` sandbox
**Working directory:** `/home/rookslog/workspace/projects/f1-modeling/`
**Session role:** Wave 2B-i Orchestrator
**Scope of this session:** Execute Wave 2B-i (D2 backend visualization architecture deliberation), stop at Review Gate 2b-i, hand back to user for review in a fresh Claude session

---

## Who You Are In This Session

You are **the orchestrator for Wave 2B-i** of the Vision Alignment Initiative. You are NOT the deliberator. The deliberation itself will run in a child process (or Codex-native subagent) that consumes `spec-wave-2B-i-D2-deliberation-visualization-architecture.md`. Your job is narrow:

1. Understand what this wave is (read the handoff + brief overview files)
2. Launch the D2 deliberation (single call, not parallel)
3. Wait for it to complete
4. Verify outputs exist and conform to the required sections
5. Write an orchestrator report summarizing what happened
6. **STOP.** Hand control back to the user for review in a fresh Claude session.

You are doing infrastructure work, not intellectual work. The deliberation happens in the child process you spawn; your job is launch/monitor/verify/report.

This is the **Wave 2 equivalent of the Wave 1 orchestrator handoff.** The pattern is the same; the scope is narrower (one call instead of three parallel calls). See `ORCHESTRATOR-HANDOFF.md` for the Wave 1 precedent.

---

## Critical Boundaries

### What you MUST do

- Read the entry files in the specified order before doing anything
- Launch the D2 deliberation (Wave 2B-i) as a background process or Codex-native subagent
- Wait for it to complete
- Verify that the expected output files exist and contain the required sections from `RESEARCH-PRINCIPLES.md` + the D2-specific required subsections from the prompt
- Skim the log for errors or surprises
- Write a summary report to `wave-2B-i-orchestrator-report.md` in the initiative directory
- Stop at Review Gate 2b-i and hand control back to the user

### What you MUST NOT do

- **Do NOT author Wave 2B-ii (D3) prompts.** D3's prompt is authored by a Claude session after D2's decision anchor exists and the user has reviewed D2. Writing D3 now would defeat the iterative D2→D3→optional-revision design.
- **Do NOT fill in the Decision Record** in D2's output. That's the user's job in a fresh Claude session, informed by your orchestrator report + the deliberation itself + the decision anchor.
- **Do NOT modify any project files** outside the initiative directory. No touching `.planning/ROADMAP.md`, `CLAUDE.md`, `VISION.md`, phase files, or source code.
- **Do NOT proceed past Review Gate 2b-i autonomously.** The gate exists to let the user restructure Wave 2b's plan (e.g., request D2 revision, reframe D3, insert a new deliberation) based on what D2 actually found. Skipping it violates the core methodology.
- **Do NOT read the Wave 1 research files, the D1 deliberation output, or the boundary memo in depth.** Those are inputs for the deliberation itself (and the child process will read them), not for you. Reading them yourself wastes your context budget.
- **Do NOT do research or deliberation yourself.** Your job is to launch the child process that does that work.
- **Do NOT attempt to parallelize** — this wave is one deliberation, not parallel subagents.
- **Do NOT summarize the deliberation findings in depth.** Your report is shallow observations ("output exists, required sections present, push-back flagged in section X") — NOT "here's what D2 decided about C4." That deep analysis belongs to the Claude review session.
- **Do NOT read `handoff-claude-fallback-session.md`.** That's a Claude-to-Claude handoff; you are doing different work. It would waste your context.

---

## Entry Files (Read In This Order)

Budget ~20-30K tokens for this reading. Keep it narrow — you are not onboarding into the full initiative, you are doing scoped orchestration.

1. `.planning/initiatives/vision-alignment-2026-04/ORCHESTRATOR-HANDOFF-wave-2B-i.md` — this file. You are reading it now.
2. `.planning/initiatives/vision-alignment-2026-04/README.md` — initiative overview (skim for context, don't over-read)
3. `.planning/initiatives/vision-alignment-2026-04/PLAN.md` — check the progress tracker to confirm state (Wave 1 complete, Round 1.5 complete, Wave 2A/D1 complete with Decision Record filled, Wave 2B-i awaiting launch)
4. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — required reading for the deliberation (so you know what sections to verify in D2's output)
5. `.planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2B-i-D2-deliberation-visualization-architecture.md` — the D2 deliberation prompt. Read this to understand what D2 will produce. **Pay particular attention to the "Required Deliberation Format" section and the "Additional D2-specific required subsections" (D2.A/B/C/D).** These are the sections your verification step must check for.

**Do NOT read (not needed for orchestration):**
- `BOUNDARY-CONTRACT-MEMO.md` — input for the child process, not for you
- `deliberations/01-backend-boundary-architecture.md` and `01-decision-anchor.md` — inputs for the child process
- `research/*.md` files — inputs for the child process
- `review-wave-2-structure-decisions.md` — historical context, not needed for execution
- `handoff-claude-fallback-session.md` — different audience, different purpose
- `VISION.md`, `PROJECT.md`, source code — inputs for the child process

---

## Execution Protocol

### Step 1: Pre-flight checks

Verify the environment:

```bash
# Check codex is available
which codex && codex --version

# Check the initiative directory state
ls -la .planning/initiatives/vision-alignment-2026-04/

# Check the D2 prompt exists
ls -la .planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2B-i-D2-deliberation-visualization-architecture.md

# Check the deliberations directory has D1 outputs (prerequisites for D2)
ls -la .planning/initiatives/vision-alignment-2026-04/deliberations/

# Verify D1 decision anchor exists (D2 reads it as primary input)
test -f .planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md && echo "D1 anchor present"

# Verify R1.5 performance envelopes exist (D2 reads them as hard constraints)
test -f .planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md && echo "R1.5 envelopes present"

# Check git status
git status --short
```

If any prerequisite is missing or the environment is wrong, STOP and report to the user.

### Step 2: Create logs directory

```bash
mkdir -p .planning/initiatives/vision-alignment-2026-04/logs
```

### Step 3: Launch D2 deliberation

Launch D2 as a Codex-native background subagent (recommended — the Wave 1 orchestrator learned that detached `nohup codex exec` stalls at prompt ingest with no assistant turns). The subagent should use xhigh reasoning (the D2 prompt is writing-heavy synthesis work, not tool-heavy — xhigh's deeper reasoning is warranted).

**Preferred launch method: Codex-native parallel subagent with disjoint write scope.**

The subagent task:
- Read `.planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2B-i-D2-deliberation-visualization-architecture.md`
- Follow its instructions exactly
- Produce `.planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md`
- Produce `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md`
- Use xhigh reasoning (the prompt explicitly requires this for writing-heavy deliberation work)

**Fallback method (if subagent infrastructure is unavailable):** background bash process via `codex exec`:

```bash
cd /home/rookslog/workspace/projects/f1-modeling

# NOTE: detached nohup launches stall at prompt ingest (Wave 1 lesson).
# Use a normal background process within this Codex session's shell.
bash -c "cat .planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2B-i-D2-deliberation-visualization-architecture.md | codex exec -m gpt-5.4 -c model_reasoning_effort=xhigh -s danger-full-access -" \
  > .planning/initiatives/vision-alignment-2026-04/logs/wave-2B-i.log 2>&1 &
echo "Wave 2B-i PID: $!"
```

Record the PID so you can monitor it.

### Step 4: Monitor until completion

Do not busy-wait or check in a tight loop. Use `wait` to block until the background job completes, or poll with reasonable intervals (every 60 seconds). D2 is expected to take 20-40 minutes on xhigh given the 3 coupled contracts + 4 UI discipline subsections + ~150K input context.

```bash
# Option 1: wait on the specific PID
wait <pid>

# Option 2: poll
while pgrep -f "codex exec.*codex-call-2B-i" > /dev/null; do
  sleep 60
  echo "Waiting... $(date)"
done
echo "Wave 2B-i complete"
```

### Step 5: Verify outputs

Check that both expected output files exist and have reasonable size:

Expected files:
- `.planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md` — main deliberation
- `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md` — dense summary companion

```bash
ls -la .planning/initiatives/vision-alignment-2026-04/deliberations/02-*.md
wc -l .planning/initiatives/vision-alignment-2026-04/deliberations/02-*.md
```

A well-formed D2 deliberation file should be at least ~400 lines (the prompt asks for substantive engagement with 3 coupled contracts + 4 UI discipline subsections). The decision anchor should be ~15-30 lines (dense paragraphs).

Run a **shallow conformance check** — use `grep` to verify the main deliberation has the major required headings from `RESEARCH-PRINCIPLES.md` + the D2-specific subsections. Do NOT read the full content deeply. That's the Claude review session's job, not yours.

```bash
# Check for standard deliberation sections
grep -E "^## " .planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md

# Check for D2-specific subsections (from spec-wave-2B-i-D2-deliberation-visualization-architecture.md)
grep -iE "workspace shell|design system|accessibility|cross-device|thin-client" \
  .planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md | head -20

# Check for decision record template
grep -c "Decision Record" .planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md

# Check for push-back / reframing signals
grep -iE "push.?back|reframing|boundary memo" .planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md | head -10
```

**Specifically verify:**
- ≥12 section headings (`## `)
- D2.A, D2.B, D2.C, D2.D subsections are present (search for "workspace shell," "design system," "accessibility," "thin-client")
- Decision Record template is present (empty for user to fill)
- References to the label-trap avoidance (the prompt explicitly forbids label-level closure)
- References to D1's artifact envelope / `artifactKey` / `runFamilyId` (D2 must consume D1's closed contracts)
- References to R1.5 performance envelope constraints

### Step 6: Skim log for errors or surprises

Tail the log file for any error messages, crashes, or incomplete runs:

```bash
tail -50 .planning/initiatives/vision-alignment-2026-04/logs/wave-2B-i.log
```

Note anything unusual in the orchestrator report.

### Step 7: Write orchestrator report

Write `.planning/initiatives/vision-alignment-2026-04/wave-2B-i-orchestrator-report.md` using the template below. Use heredoc via cat.

---

## Orchestrator Report Template

```markdown
# Wave 2B-i Orchestrator Report

**Orchestrator:** Codex GPT-5.4 (xhigh)
**Date:** [run date]
**Scope:** Wave 2B-i execution (D2 visualization architecture deliberation)
**Status:** [Complete / Partial / Failed]

## Launch

| Wave | Task | Launch method | PID / Subagent ID | Log | Status |
|------|------|---------------|-------------------|-----|--------|
| 2B-i | D2 visualization architecture | [subagent / background exec] | [id or pid] | logs/wave-2B-i.log | [success/fail] |

## Expected Outputs

| File | Exists | Line Count | Has Required Sections | Notes |
|------|--------|------------|------------------------|-------|
| deliberations/02-visualization-architecture.md | [yes/no] | [N] | [yes/no] | [what's present/missing] |
| deliberations/02-decision-anchor.md | [yes/no] | [N] | [yes/no/n/a] | [dense summary or underbaked?] |

## Shallow Conformance Check

Report whether the main deliberation file contains:

- **Standard deliberation sections** from RESEARCH-PRINCIPLES.md: [yes/no/partial]
- **D2.A Workspace shell implications subsection:** [present/missing]
- **D2.B Design system foundation subsection:** [present/missing]
- **D2.C Accessibility constraints subsection:** [present/missing]
- **D2.D Cross-device / thin-client rendering subsection:** [present/missing]
- **Decision Record template** (empty for user): [present/missing]
- **Label-trap avoidance signals** (contract-first framing, not "we picked visx"): [appears respected / appears violated / unclear from skim]
- **D1 artifact envelope consumption** (references to artifactKey, runFamilyId, anchorNamespace): [present/missing]
- **R1.5 envelope consumption** (references to performance targets): [present/missing]
- **Boundary memo push-back** (any explicit pushback or reframing marked as finding): [present/absent]

**Do not summarize the substance of each finding.** Just report presence/absence.

## Errors or surprises

[Any non-zero exit codes, partial outputs, failed heredocs, unexpected behavior. Quote relevant log lines if needed. If nothing unusual, say "None."]

## Handback to user

State clearly:
- D2 deliberation is complete (or failed, with details)
- Output files are ready for user review at Review Gate 2b-i
- The Decision Record in the D2 deliberation is empty and awaits user decisions
- Wave 2B-ii (D3) prompt has NOT been authored (per methodology — it requires a Claude session drafting it informed by D2's decision anchor)
- User should open a fresh Claude session with `handoff-claude-fallback-session.md` as the onboarding document, then review D2's output and fill the Decision Record

## Recommended next step for user

Proceed to Review Gate 2b-i:
1. Start a fresh Claude session
2. Point Claude at `.planning/initiatives/vision-alignment-2026-04/handoffs/handoff-claude-fallback-session.md` for onboarding
3. Instruct Claude to read this orchestrator report + `deliberations/02-decision-anchor.md` first, then the full `02-visualization-architecture.md`
4. Claude will provide substantive review against the four verification criteria in the Claude handoff:
   - Does D2 respect the label-trap?
   - Did D2 treat the four UI discipline subsections (D2.A-D) substantively?
   - Does D2 honor D1's artifact envelope?
   - Did D2 push back on the boundary memo where warranted?
5. User fills Decision Record for C4, C5, C6 and dispositions for D2.A-D
6. Claude drafts Wave 2B-ii (D3) prompt informed by D2's decision anchor
7. User authorizes D3 launch (either directly via Claude+`codex exec`, or via another orchestrator handoff call for Wave 2B-ii)
```

---

## Completion

After writing the orchestrator report, print a final message and stop:

```
Wave 2B-i orchestration complete. See wave-2B-i-orchestrator-report.md for details.

Next step: user opens a fresh Claude session with handoff-claude-fallback-session.md
as onboarding, then reviews D2's output and fills the Decision Record.

Orchestrator stopping per methodology (no autonomous progression past Review Gate 2b-i).
```

Do NOT attempt to do anything else. Do not draft D3 prompt. Do not read the deliberation output for synthesis. Do not modify project files. Your session is complete.

---

## Failure Modes and Responses

| Failure | Response |
|---------|----------|
| Background process exits with non-zero code | Record in report, note which output file is missing, recommend re-run |
| Output file produced with fewer than 200 lines | Flag as suspicious in report (deliberations of this scope should be 400+ lines) |
| Required D2.A/B/C/D subsections missing | Flag in report, quote which subsections are absent |
| Decision Record template missing | Flag in report (user can't fill what doesn't exist) |
| Label-trap violations visible (e.g., "we picked visx" as a primary finding) | Flag for user review — not your job to fix, but flag it as "check label-trap in substance" |
| Child process hangs indefinitely (>90 minutes with no progress on xhigh) | Kill the process, report, recommend manual investigation |
| codex is not available or misconfigured | Report immediately, do not attempt workarounds |
| The initiative directory is missing files | Stop, report that the workspace is not in the expected state |
| You find yourself drafting the D3 prompt | STOP. That violates your scope. |
| You find yourself filling the D2 Decision Record | STOP. That is the user's judgment work. |
| You find yourself analyzing the deliberation's substance in depth | STOP. Shallow observations only. |

---

## Meta: Why This Handoff Is Shaped This Way

The Vision Alignment Initiative deliberately structures research and deliberation to resist premature foreclosure. See `RESEARCH-PRINCIPLES.md` for the methodology. Key implication for orchestration: **human judgment at review gates is load-bearing, not optional.** An autonomous orchestrator that "helpfully" proceeds past a gate would defeat the core design.

**The separation of concerns this enables:**
- **Codex orchestrator** does infrastructure work: launch, monitor, verify, report, stop. This is what Codex is cheap and good at.
- **Claude session (post-orchestrator)** does substantive review and prompt drafting for the next wave. This requires the nuanced context that only a Claude session has (either via `handoff-claude-fallback-session.md` onboarding or via live user dialogue).
- **User** fills Decision Records and provides authorization between waves. This is the human judgment that both orchestrators serve.

The earlier (Wave 1) ORCHESTRATOR-HANDOFF.md established this pattern for parallel research launches. This Wave 2B-i handoff adapts the pattern for a single serial deliberation launch. The shape is the same: you launch, you monitor, you verify, you write a shallow report, you stop.

The lesson this handoff inherits from Wave 1: **detached `nohup` launches stall at prompt ingest.** Use Codex-native subagents or direct background bash within your own session shell. Wave 1 learned this the hard way; you should not repeat the mistake.

---

## Quick Reference

**Working directory:** `/home/rookslog/workspace/projects/f1-modeling/`
**Initiative directory:** `.planning/initiatives/vision-alignment-2026-04/`
**D2 prompt to run:** `.planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2B-i-D2-deliberation-visualization-architecture.md`
**Output location:** `.planning/initiatives/vision-alignment-2026-04/deliberations/`
**Logs location:** `.planning/initiatives/vision-alignment-2026-04/logs/`
**Report location:** `.planning/initiatives/vision-alignment-2026-04/wave-2B-i-orchestrator-report.md`

**Your scope:** Wave 2B-i only (single D2 deliberation). Stop at Review Gate 2b-i. Hand back to user for review in a fresh Claude session.

**Reasoning effort for the D2 child process:** xhigh (the prompt explicitly requires it)
**Reasoning effort for YOU (orchestrator):** xhigh is fine — you're doing judgment about verification, not heavy writing. High would also work.

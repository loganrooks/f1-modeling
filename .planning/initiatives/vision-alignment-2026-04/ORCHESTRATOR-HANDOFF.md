# Orchestrator Handoff — Vision Alignment Initiative

**Intended runtime:** Codex GPT-5.4, xhigh reasoning, `danger-full-access` sandbox
**Working directory:** `/home/rookslog/workspace/projects/f1-modeling/`
**Session role:** Wave 1 Orchestrator
**Scope of this session:** Execute Wave 1 (research round 1), stop at Review Gate 1, hand back to user

---

## Who You Are In This Session

You are **the orchestrator for Wave 1** of a multi-wave research-and-deliberation initiative called "Vision Alignment 2026-04." You are NOT a research agent. You are NOT a deliberation author. Your job is narrow:

1. Understand what this initiative is (read the initiative files)
2. Launch the three Wave 1 research calls as parallel background processes
3. Wait for them to complete
4. Verify outputs exist and conform to requirements
5. Write an orchestrator report summarizing what happened
6. **STOP.** Hand control back to the user. Do not proceed to Wave 2.

This is a narrow scope. You are doing infrastructure work, not intellectual work. The research happens in the child processes you spawn; your job is to launch, monitor, verify, and report.

---

## Critical Boundaries

### What you MUST do

- Read the entry files in the specified order before doing anything
- Launch all three Wave 1 calls (1A, 1B, 1C) as parallel background processes
- Wait for all three to complete before reporting
- Verify that each expected output file exists and contains the required sections from `RESEARCH-PRINCIPLES.md`
- Write a summary report to `wave-1-orchestrator-report.md` in the initiative directory
- Stop at Review Gate 1 and hand control back to the user

### What you MUST NOT do

- **Do NOT author Wave 2 prompts.** Those are authored by the user (or a fresh Claude session) at Review Gate 1 based on what Wave 1 actually found. Writing them now would defeat the "scaffolding not execution plan" design.
- **Do NOT modify any project files** outside the initiative directory. No touching `.planning/ROADMAP.md`, `CLAUDE.md`, `VISION.md`, phase files, or source code.
- **Do NOT proceed past Review Gate 1 autonomously.** The gate exists to let the user restructure the plan based on findings. Skipping it violates the core methodology.
- **Do NOT do research yourself.** The three child processes do the research. You launch them and verify outputs.
- **Do NOT invent additional research tasks** beyond the three Wave 1 calls that already exist.
- **Do NOT attempt to parallelize by reading all three prompts into your own context.** Each prompt is ~100-140K when fully resolved with its file reads. Loading three at once will blow your context budget. Use child processes.
- **Do NOT summarize research findings beyond the surface level.** Deep synthesis is a separate task; your report just reports what landed and surfaces any glaring issues.

---

## Entry Files (Read In This Order)

Read these files in order before launching anything. Budget ~30-40K tokens for this reading.

1. `.planning/initiatives/vision-alignment-2026-04/README.md` — initiative overview
2. `.planning/initiatives/vision-alignment-2026-04/PLAN.md` — master plan with wave structure
3. `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` — methodological manifesto (the child processes will read this too; you need to know what's in it to verify outputs)
4. `.planning/initiatives/vision-alignment-2026-04/codex-call-1A.md` — Wave 1 Call A prompt
5. `.planning/initiatives/vision-alignment-2026-04/codex-call-1B.md` — Wave 1 Call B prompt
6. `.planning/initiatives/vision-alignment-2026-04/codex-call-1C.md` — Wave 1 Call C prompt

Do NOT read the audit files, VISION.md, PROJECT.md, ROADMAP.md, or any source code yourself. Those are for the child processes to read as part of their research tasks. Reading them yourself wastes context.

---

## Execution Protocol

### Step 1: Pre-flight checks

Verify the environment:

```bash
# Check codex is available
which codex && codex --version

# Check the initiative directory exists and has the expected files
ls -la .planning/initiatives/vision-alignment-2026-04/

# Check required subdirectories exist
ls -la .planning/initiatives/vision-alignment-2026-04/research/
ls -la .planning/initiatives/vision-alignment-2026-04/deliberations/
ls -la .planning/initiatives/vision-alignment-2026-04/synthesis/

# Verify git working tree is clean or record current state
git status --short
```

If any file is missing or the environment is wrong, STOP and report to the user.

### Step 2: Launch three parallel background calls

Launch Wave 1 calls as background processes using nohup so they survive if the orchestrator shell loses control. Each child process is an independent Codex session with its own context budget.

Create a log directory for the child process outputs:

```bash
mkdir -p .planning/initiatives/vision-alignment-2026-04/logs
```

Launch the three calls in parallel:

```bash
cd /home/rookslog/workspace/projects/f1-modeling

# Wave 1 Call A: R1 (compute backends) + R4 (streaming architectures)
nohup bash -c "cat .planning/initiatives/vision-alignment-2026-04/codex-call-1A.md | codex exec -m gpt-5.4 -c model_reasoning_effort=high -s danger-full-access -" \
  > .planning/initiatives/vision-alignment-2026-04/logs/wave-1A.log 2>&1 &
echo "Wave 1A PID: $!"

# Wave 1 Call B: R2 (visualization) + R3 (educational content)
nohup bash -c "cat .planning/initiatives/vision-alignment-2026-04/codex-call-1B.md | codex exec -m gpt-5.4 -c model_reasoning_effort=high -s danger-full-access -" \
  > .planning/initiatives/vision-alignment-2026-04/logs/wave-1B.log 2>&1 &
echo "Wave 1B PID: $!"

# Wave 1 Call C: R5 (multi-regulation typing)
nohup bash -c "cat .planning/initiatives/vision-alignment-2026-04/codex-call-1C.md | codex exec -m gpt-5.4 -c model_reasoning_effort=high -s danger-full-access -" \
  > .planning/initiatives/vision-alignment-2026-04/logs/wave-1C.log 2>&1 &
echo "Wave 1C PID: $!"
```

**Note the reasoning effort: `high`, not `xhigh`.** The research prompts are tool-heavy (reading files, npm queries) not writing-heavy. xhigh burns output budget on thinking. High is the right mode for the research children. Your own orchestrator session can be xhigh since you're doing judgment work.

Record the three PIDs so you can monitor them.

### Step 3: Monitor until all three complete

Do not busy-wait or check repeatedly in a tight loop. Use `wait` to block until all background jobs complete, or poll with reasonable intervals (every 30-60 seconds).

```bash
# Block until all background jobs finish
wait
```

If `wait` doesn't work in your context (e.g., the PIDs are from nohup and detached), poll with:

```bash
while pgrep -f "codex exec.*codex-call-1" > /dev/null; do
  sleep 30
  echo "Waiting... $(date)"
done
echo "All Wave 1 calls complete"
```

### Step 4: Verify outputs

Check that each expected output file exists and has reasonable size:

Expected files:
- `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md` (from 1A)
- `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md` (from 1A)
- `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md` (from 1B)
- `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md` (from 1B)
- `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md` (from 1C)

```bash
ls -la .planning/initiatives/vision-alignment-2026-04/research/
wc -l .planning/initiatives/vision-alignment-2026-04/research/*.md
```

A well-formed research file should be at least ~200 lines and contain the 16 required sections from RESEARCH-PRINCIPLES.md:

1. Metadata
2. Executive Summary
3. Question as Received
4. Reframing (if any)
5. Assumptions Surfaced
6. Option Space
7. Trajectory Analysis
8. Precedent Analysis
9. Gray Areas Encountered
10. Scope Expansion Notes
11. Path of Inquiry
12. Dependencies and Relations
13. Provisional Position
14. Confidence Ledger
15. Unresolved Questions
16. References

Do a light conformance check — use `grep` to verify each file has the major required headings. Do NOT read the full content deeply. That's the user's review job, not yours.

```bash
for f in .planning/initiatives/vision-alignment-2026-04/research/*.md; do
  echo "=== $f ==="
  grep -E "^## " "$f" | head -20
done
```

### Step 5: Check logs for errors or surprises

Skim the tail of each log file for signs of errors, failed heredocs, or incomplete runs:

```bash
for log in .planning/initiatives/vision-alignment-2026-04/logs/wave-1*.log; do
  echo "=== $log ==="
  tail -30 "$log"
done
```

Note any errors, warnings, or incomplete-looking outputs. Include them in your report.

### Step 6: Write orchestrator report

Write `.planning/initiatives/vision-alignment-2026-04/wave-1-orchestrator-report.md` using the template below. Use heredoc.

---

## Orchestrator Report Template

```markdown
# Wave 1 Orchestrator Report

**Orchestrator:** Codex GPT-5.4 (xhigh)
**Date:** [run date]
**Scope:** Wave 1 execution (research round 1)
**Status:** [Complete / Partial / Failed]

## Launches

| Call | Tasks | PID | Log | Status |
|------|-------|-----|-----|--------|
| 1A | R1+R4 (compute + streaming) | [pid] | logs/wave-1A.log | [success/fail] |
| 1B | R2+R3 (viz + education) | [pid] | logs/wave-1B.log | [success/fail] |
| 1C | R5 (regulation typing) | [pid] | logs/wave-1C.log | [success/fail] |

## Expected Outputs

| File | Exists | Line Count | Has All 16 Sections | Notes |
|------|--------|------------|---------------------|-------|
| research/01-compute-backends.md | [yes/no] | [N] | [yes/no] | |
| research/02-visualization-at-scale.md | [yes/no] | [N] | [yes/no] | |
| research/03-educational-content-architectures.md | [yes/no] | [N] | [yes/no] | |
| research/04-streaming-architectures.md | [yes/no] | [N] | [yes/no] | |
| research/05-multi-regulation-typing.md | [yes/no] | [N] | [yes/no] | |

## Surface-level observations

For each output file, record ONLY:
- Whether it appears to be a genuine terrain-mapping output or drifted toward recommendation
- Whether gray areas are tagged with the three-response framework
- Whether a reframing was proposed
- Whether scope expansion was marked
- Any glaring issues (e.g., missing sections, empty placeholders)

**Do not summarize findings in depth.** That is the user's review job. Your job is to confirm the outputs landed and flag obvious problems.

## Errors or surprises

Any non-zero exit codes, partial outputs, failed heredocs, or unexpected behavior from the child processes. Quote relevant log lines.

## Handback to user

State clearly:
- All three Wave 1 calls complete (or which failed)
- Output files are ready for user review at Review Gate 1
- Wave 2 prompts have NOT been authored (per methodology)
- User should review the research outputs and then initialize a new Claude or Codex session to draft Wave 2 prompts based on findings

## Recommended next step for user

One of:
- "Proceed to Review Gate 1: read the 5 research files and assess whether the option spaces are adequately mapped"
- "Re-run Wave 1 Call X: the output is missing/incomplete"
- "Abort and investigate: [specific issue]"
```

---

## Completion

After writing the orchestrator report, print a final message and stop:

```
Wave 1 orchestration complete. See wave-1-orchestrator-report.md for details.

Next step: user reviews the five research files at Review Gate 1.

Orchestrator stopping per methodology (no autonomous progression past review gates).
```

Do NOT attempt to do anything else. Do not draft Wave 2 prompts. Do not read the research outputs for synthesis. Do not modify project files. Your session is complete.

---

## Failure Modes and Responses

| Failure | Response |
|---------|----------|
| A child process exits with non-zero code | Record in report, note which file is missing, recommend re-run |
| A child process produces a file with fewer than 100 lines | Flag as suspicious in report |
| A child process produces a file missing required sections | Flag in report, quote which sections are missing |
| A child process hangs indefinitely (>2 hours with no progress) | Kill the process, report, recommend manual investigation |
| codex exec is not available or misconfigured | Report immediately, do not attempt workarounds |
| The initiative directory is missing files | Stop, report that the workspace is not in the expected state |
| You find yourself drafting Wave 2 prompts | STOP. That violates your scope. |
| You find yourself summarizing research findings in depth | STOP. That is the user's review job. |
| You find yourself modifying project files outside the initiative directory | STOP. That is completely out of scope. |

---

## Meta: Why This Handoff Is Shaped This Way

The Vision Alignment Initiative deliberately structures research and deliberation to resist premature foreclosure. See `RESEARCH-PRINCIPLES.md` for the methodology. Key implication for orchestration: **human judgment at review gates is load-bearing, not optional.** An autonomous orchestrator that "helpfully" proceeds past a gate would defeat the core design.

Your job is infrastructure: launch, monitor, verify, report, stop. You are disciplined enough NOT to overreach into the research or planning work, because you understand the methodology requires it.

The user will return to the initiative after reviewing Wave 1 outputs. They may launch you again (a fresh orchestrator session) for Wave 2 after the corresponding prompts are drafted. But that's a separate session.

---

## Quick Reference

**Working directory:** `/home/rookslog/workspace/projects/f1-modeling/`
**Initiative directory:** `.planning/initiatives/vision-alignment-2026-04/`
**Output location:** `.planning/initiatives/vision-alignment-2026-04/research/`
**Logs location:** `.planning/initiatives/vision-alignment-2026-04/logs/`
**Report location:** `.planning/initiatives/vision-alignment-2026-04/wave-1-orchestrator-report.md`

**Your scope:** Wave 1 only. Stop at Review Gate 1. Hand back to user.

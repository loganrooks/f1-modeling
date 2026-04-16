# Spec: Extract Claude Chat Evidence

## Objective

Extract the Claude-side interaction moments most relevant to the initiative debrief from project-scoped session records and closely related handoff context.

## Output

- `../extracts/claude-chat-extract.md`

## Context Budget

Target:

- soft target: `<=90K` estimated tokens

Method:

- Start with grep/filter passes over project-scoped Claude session files that align with the initiative dates and major handoff moments.
- Build a candidate hit list first; do not read large raw blocks until the hit list exists.
- Use targeted excerpts before opening large raw blocks.
- Do not read all Claude session files end-to-end.

Recommended model:

- `gpt-5.4-mini` with `high` reasoning

Typical input shape:

- filtered candidate hits from relevant Claude session files: `~15K-30K`
- targeted excerpt windows around selected hits: `~20K-40K`
- grounding docs such as handoffs or reports when needed: `~10K-20K`

Expected working total:

- usually `~45K-85K`

Output constraints:

- max `12` extracted moments unless a larger set is justified
- each row should be brief: `1-2` sentences plus evidence pointer
- include a short query manifest at top listing date range, session files touched, and search families used
- target extract output: `<=1.5K` tokens
- explicitly note blind spots or evidence not covered

## Include

- frustration or repeated clarification
- positive collaboration turns
- review-gate discussions
- authorization or scope ambiguity
- handoff-sensitive moments that affected later work

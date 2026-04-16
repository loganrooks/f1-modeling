# LLM Sweep Specs

These specs are the bounded worker contracts for the 2026-04-16 debrief sweep.

Each spec owns exactly one report file under `../reports/`.

Common contract:

- keep the report compact and evidence-first
- do not rewrite top-level debrief files
- cite exact file paths for substantive claims
- include both what the current deterministic pipeline already captured and what it likely missed
- end with deterministic implications that can later inform transcript-pipeline hardening

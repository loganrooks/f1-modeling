# Deliberation: Development and Deployment Architecture

**Date:** 2026-03-26
**Status:** concluded
**Trigger:** Gap analysis revealed that both dev servers (Vite on 5173, Fastify on 8787) were bound to 127.0.0.1, making the browser UI inaccessible from the user's MacBook Air (apollo) which connects via SSH over Tailscale. The env-var toggle fix has been implemented, but the broader question of development and deployment architecture for a remote-first workflow was never deliberated.
**Affects:** All phases; developer workflow; CI/preview patterns; any future deployment target
**Related:**
- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- Phase 1 dev-server configuration (pinned ports 5173, 8787)
- Machine context: CLAUDE.md (dionysus workstation profile)
- Tailscale mesh: dionysus (dev server), apollo (MacBook Air), orpheus (iPhone)

## Situation

The developer works exclusively via remote SSH from apollo (MacBook Air) to dionysus (Xeon W-2125, GTX 1080 Ti, Ubuntu 24.04) over a Tailscale mesh VPN. All code editing, building, and server processes run on dionysus. The browser used for viewing the application runs on apollo. orpheus (iPhone) is also a Tailscale peer with SSH terminal access.

Phase 1 established pinned localhost ports: Vite dev server on 5173 and Fastify API on 8787, with Vite's built-in proxy forwarding browser requests from 5173 to 8787. Both servers defaulted to binding 127.0.0.1, which meant the application was invisible to any machine other than dionysus itself. VNC on port 5900 exists but provides a poor experience for iterative web development.

An env-var toggle (`HOST=0.0.0.0`) has been implemented to allow remote binding. The question now is whether this is the right long-term pattern, and what else the remote-first workflow requires.

### Evidence Base

| Source | What it shows | Corroborated? | Signal ID |
|--------|--------------|---------------|-----------|
| Phase 1 gap analysis | Both dev servers bound to 127.0.0.1, unreachable from apollo | Yes, direct observation during gap closure | informal |
| Implemented fix | `HOST` env-var toggle added to Vite and Fastify configs | Yes, committed code | informal |
| CLAUDE.md machine profile | dionysus is the sole dev server; apollo connects via Tailscale SSH; orpheus is an SSH-capable peer | Yes, direct file read | informal |
| Vite documentation | Vite supports `--host` flag and `server.host` config; HMR works over network with WebSocket fallback | Yes, public Vite docs | informal |
| Tailscale documentation | Tailscale Serve can proxy local ports with automatic HTTPS certificates on the tailnet | Yes, public Tailscale docs | informal |

## Framing

The project is a local-first web application. There is no cloud deployment target. The entire development and usage loop runs on the Tailscale mesh. The core question is how to make that loop reliable and ergonomic without introducing security risk or unnecessary complexity.

**Core question:** What is the right development and deployment architecture for a remote-first, Tailscale-mesh workflow where the dev server runs on dionysus and the browser runs on apollo?

**Adjacent questions:**
- Should mobile access from orpheus be in scope?
- Does Vite HMR work reliably over Tailscale, or should a fallback be planned?
- Should `npm run dev` default to remote-accessible mode given the developer always works remotely?
- Is there a case for a production preview mode for testing built assets from apollo without HMR?

## Analysis

### Option A: SSH Port Forwarding

- **Claim:** Use SSH local port forwarding (`ssh -L 5173:localhost:5173 dionysus`) to tunnel browser traffic from apollo to dionysus. No code changes needed; servers stay bound to 127.0.0.1.
- **Grounds:** SSH tunneling is a standard remote development technique. It requires zero application-level changes and exposes nothing on the network.
- **Warrant:** Keeps the attack surface minimal. Works with any application that listens on localhost.
- **Rebuttal:** Adds friction to every development session: the tunnel must be established and maintained. HMR WebSocket connections may not survive tunnel reconnection cleanly. VS Code Remote SSH can forward ports automatically, but Claude Code terminal sessions and direct SSH do not. Multiple ports (5173, 8787) require multiple forwards or a range. If the tunnel drops, the developer sees a broken page with no obvious cause.
- **Qualifier:** Viable but fragile for daily use.

### Option B: Bind to 0.0.0.0 by Default

- **Claim:** Change Vite and Fastify configs to bind `0.0.0.0` unconditionally. The dev server is always reachable from any interface.
- **Grounds:** The developer always works remotely, so binding localhost by default serves no one.
- **Warrant:** Simplest possible configuration. No env vars, no tunnels, no documentation to forget.
- **Rebuttal:** Exposes the dev server on all interfaces, including any non-Tailscale network dionysus might join. Vite dev servers are not hardened; they serve source maps, allow arbitrary file reads via certain plugins, and should not be Internet-facing. Tailscale provides a trusted network perimeter, but defense in depth argues against assuming the perimeter is always intact.
- **Qualifier:** Acceptable only if dionysus is guaranteed to never have a non-Tailscale network route, which is not a safe assumption for a machine with an Ethernet interface.

### Option C: Env-Var Toggle with Documented Pattern

- **Claim:** Keep the current implementation: servers bind 127.0.0.1 by default, but `HOST=0.0.0.0` (set via `.env` or shell) switches to network binding. Document this in the project README and developer setup instructions.
- **Grounds:** Already implemented and working. The developer sets the env var once in their shell profile or `.env` file and forgets about it. Default remains safe for any context where the code is checked out on a different machine.
- **Warrant:** Balances security (safe default) with ergonomics (one-time setup). The toggle is a well-understood Vite convention (`--host` flag, `VITE_HOST` or `HOST` env var). Fastify follows the same pattern.
- **Rebuttal:** An env var the developer must remember to set is a paper cut. If the `.env` file is not committed (and it should not be), a fresh clone requires re-discovery. This is mitigated by documentation and by the fact that this project has a single developer who has already set it up.
- **Qualifier:** Strong. The implementation cost is zero (already done), the security posture is correct by default, and the ergonomic cost is a one-time setup step.

### Option D: Tailscale Serve for HTTPS-Native Access

- **Claim:** Use `tailscale serve` to proxy the dev server, providing automatic HTTPS certificates and a stable `https://dionysus.tailnet-name.ts.net:443` URL accessible from any Tailscale peer.
- **Grounds:** Tailscale Serve handles TLS termination, port mapping, and access control within the tailnet. It can proxy a localhost-bound service without changing any application code.
- **Warrant:** Provides HTTPS, which some browser APIs require. Provides a stable, memorable URL. No application-level changes needed.
- **Rebuttal:** Adds a dependency on Tailscale Serve configuration, which must be maintained separately from the application. HMR WebSocket upgrade through the Tailscale proxy is not guaranteed to work without testing. Adds latency (extra proxy hop). Overkill for a development server where HTTP is sufficient and no browser APIs requiring HTTPS are currently in use. If HTTPS becomes necessary later (e.g., for Web Crypto or Service Workers), this option can be revisited.
- **Qualifier:** Premature for current needs. Worth revisiting if HTTPS-only browser APIs enter scope.

### Option E: Production Preview Mode

- **Claim:** Add a `npm run preview` script that runs `vite build && vite preview` (or serves the built assets via Fastify in production mode), allowing the developer to test optimized, built output from apollo without HMR.
- **Grounds:** Vite's `preview` command serves the production build on a local HTTP server. This tests the actual artifacts that would be deployed, catches build-only bugs (tree-shaking errors, missing assets, CSS extraction issues), and provides a stable view without HMR churn.
- **Warrant:** A production preview mode is standard practice and independent of the remote access question. It complements dev mode rather than replacing it.
- **Rebuttal:** This is orthogonal to the remote access architecture. It should exist regardless of which option is chosen for dev mode. Including it in this deliberation risks conflating two concerns.
- **Qualifier:** Strong as an independent recommendation. Should be implemented but is not part of the core dev/deploy architecture decision.

## Tensions

- Security by default (127.0.0.1 binding) versus ergonomics for a single-developer remote workflow (always needs 0.0.0.0).
- Simplicity of unconditional 0.0.0.0 versus defense-in-depth for a machine with physical Ethernet.
- Vite HMR reliability over a network hop is empirically untested in this setup; the deliberation must plan for the case where it degrades.
- Mobile access from orpheus is conceivable but low-priority; the architecture should not block it but need not optimize for it.
- A production preview mode is genuinely useful but is a separate concern from the network binding question.

## Recommendation

Adopt Option C as the primary architecture, with Option E as an independent addition.

**Decision rationale:**

1. **Option C (env-var toggle) is already implemented, secure by default, and ergonomically sufficient.** The developer sets `HOST=0.0.0.0` once in a `.env` file or shell profile. The default remains safe for any other checkout context. This follows the Vite community convention and requires no additional infrastructure.

2. **Option A (SSH tunneling) is rejected** because it adds per-session friction and introduces WebSocket reliability concerns for HMR that the env-var approach avoids entirely.

3. **Option B (unconditional 0.0.0.0) is rejected** because it sacrifices defense-in-depth for marginal ergonomic gain over Option C. The one-time cost of setting an env var does not justify removing the safe default.

4. **Option D (Tailscale Serve) is deferred.** It introduces unnecessary complexity for the current HTTP-only development workflow. If the project later requires HTTPS-only browser APIs, this becomes the right answer and should be revisited at that point.

5. **Option E (production preview mode) is recommended as an independent addition.** A `npm run preview` script should be added to complement dev mode. This is orthogonal to the remote access decision.

**On mobile access from orpheus:** orpheus should be considered in-scope for lightweight monitoring (viewing the UI, checking build status) but not for active development. The env-var toggle with `HOST=0.0.0.0` already enables this: any Tailscale peer can reach `http://100.93.212.44:5173`. No additional work is needed.

**On HMR reliability over Tailscale:** Tailscale provides a WireGuard tunnel with low, stable latency between peers on the same LAN or nearby. Vite HMR uses WebSocket by default, with polling fallback configurable via `server.watch.usePolling`. If HMR proves unreliable, the mitigation path is:
1. First, check whether the issue is WebSocket-specific (Vite can be configured to use `server.hmr.protocol: 'ws'` explicitly and `server.hmr.host` set to the Tailscale IP).
2. If WebSocket HMR remains flaky, enable `server.watch.usePolling` as a fallback (higher CPU, but reliable).
3. If HMR is fundamentally broken over the link, fall back to the production preview mode (Option E) for visual verification and use the dev server only for code-level iteration.

**On defaulting npm run dev to remote mode:** No. The `npm run dev` script should not hardcode `HOST=0.0.0.0`. The env-var pattern means the script respects the developer's environment without assuming their network topology. A developer who clones this repo on a local machine should get localhost binding without surprises. The recommended workflow is to add `HOST=0.0.0.0` to the project `.env` file (which is gitignored) on dionysus.

## Predictions

**If adopted, we predict:**

| ID | Prediction | Observable by | Falsified if |
|----|-----------|---------------|-------------|
| P1 | The env-var toggle will require no further changes through Phase 2 and Phase 3 development | End of Phase 3 | Remote access configuration requires additional code changes or infrastructure before Phase 3 completes |
| P2 | HMR over Tailscale will work without degradation for typical development sessions | During Phase 2 active development | Developer reports frequent HMR failures, stale state, or WebSocket disconnections requiring manual refresh more than once per session |
| P3 | orpheus (iPhone) will be able to load the UI at the Tailscale IP without any additional configuration | First time the developer tries it | iPhone browser cannot reach or render the dev server at the Tailscale IP |
| P4 | No HTTPS-only browser API will be needed before Phase 4 | End of Phase 3 | A feature in Phase 2 or 3 requires HTTPS (Web Crypto, Service Workers, etc.), forcing a revisit of Option D |
| P5 | A production preview mode will catch at least one build-only issue that dev mode misses | During Phase 2 or 3 if preview mode is added | Preview mode never surfaces a discrepancy from dev mode through end of Phase 3 |

## Decision Record

**Decision:** Adopt env-var toggle (Option C) as the development access architecture; add production preview mode (Option E) independently; defer Tailscale Serve (Option D) until HTTPS is needed; plan HMR fallback path if Tailscale transport proves unreliable.
**Decided:** 2026-03-26
**Implemented via:** Env-var toggle already committed in Phase 1 gap closure. Production preview mode to be added when dev workflow scripts are next touched. HMR fallback path documented here for reference if needed.
**Signals addressed:** informal gap analysis observation

## Evaluation

**Evaluated:** Not yet evaluated
**Evaluation method:** Compare remote development experience during Phase 2 against predictions P1-P5

| Prediction | Outcome | Match? | Explanation |
|-----------|---------|--------|-------------|
| P1: Env-var toggle needs no changes through Phase 3 | Not yet evaluated | - | Pending Phase 2-3 development |
| P2: HMR works reliably over Tailscale | Not yet evaluated | - | Pending active development sessions |
| P3: orpheus can load UI at Tailscale IP | Not yet evaluated | - | Pending first mobile test |
| P4: No HTTPS-only API needed before Phase 4 | Not yet evaluated | - | Pending Phase 2-3 feature scope |
| P5: Preview mode catches a build-only issue | Not yet evaluated | - | Pending preview mode addition |

**Was this progressive or degenerating?** (Lakatos)
Not yet evaluated.

**Lessons for future deliberations:**
Infrastructure questions that seem solved by a quick fix (env-var toggle) still benefit from deliberation when the underlying assumption (localhost development) contradicts the actual development topology. The fix was correct, but without recording the reasoning, a future contributor could reasonably revert to localhost-only defaults.

## Supersession

**Superseded by:** Not superseded
**Reason:** N/A

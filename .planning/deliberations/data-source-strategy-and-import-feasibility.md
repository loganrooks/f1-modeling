# Deliberation: Data Source Strategy and Import Feasibility

**Date:** 2026-03-26
**Status:** concluded
**Trigger:** Gap analysis found that PROJECT.md has an open question about F1 TV Premium data formats but no specific data source strategy. The gap analysis identified FastF1 and OpenF1 API as the most practical external sources and proposed DATA-04 requiring at least one established source. This deliberation captures the full reasoning.
**Affects:** Phase 6, Phase 2; requirements DATA-01, DATA-02, DATA-03, proposed DATA-04; PROJECT.md open question on F1 TV Premium data formats
**Related:**
- `.planning/PROJECT.md` (open question: "What data format(s) will be realistically obtainable from F1 TV Premium or companion tooling?")
- `.planning/REQUIREMENTS.md` (DATA-01 through DATA-03, adapter-based ingestion)
- `.planning/ROADMAP.md` (Phase 6: data integration and validation)
- gap analysis identifying FastF1 and OpenF1 as practical sources

## Situation

The project roadmap defines Phase 6 as adapter-based data ingestion with requirements DATA-01 through DATA-03 covering format adapters, validation, and pipeline orchestration. PROJECT.md carries an open question about what data formats are realistically obtainable from F1 TV Premium or companion tooling. However, no deliberation has examined the actual landscape of available F1 data sources, their capabilities, their integration costs for a TypeScript/Node.js monorepo, or how they map to the project's modeling needs across phases.

The gap analysis surfaced that FastF1 (Python library) and OpenF1 (REST API) are the two most practical external sources, and proposed a new requirement DATA-04 mandating at least one established source. This deliberation evaluates four candidate data sources and four integration strategies to ground that requirement in concrete reasoning.

### Evidence Base

| Source | What it shows | Corroborated? | Signal ID |
|--------|--------------|---------------|-----------|
| FastF1 documentation and PyPI | MIT-licensed Python library providing lap times, car telemetry (~240ms), position data (x/y/z), weather, tire compounds, session results for 2018+ seasons; no API key needed; pulls from F1 Live Timing API | Yes, public documentation | gap-analysis |
| OpenF1 API documentation | Free REST API providing car data, driver info, intervals, laps, location, meetings, pit stops, positions, race control messages, sessions, stints, team radio, weather; no authentication | Yes, public documentation | gap-analysis |
| Ergast API status | REST API deprecated as of 2024; provides race results, standings, schedules, circuit info at race-level aggregates only; static data dumps available; no telemetry | Yes, public announcement | gap-analysis |
| F1 TV Premium service | Subscription service ($10/month) providing live timing, onboard cameras, telemetry overlays, team radio; no official structured export API; data presented visually | Yes, service description | gap-analysis |
| Project architecture | TypeScript/Node.js monorepo with packages structure; Python available via conda environments on dionysus; project values local-first operation and offline capability | Yes, direct project files | gap-analysis |

## Framing

The core question is not whether the project needs external data. Phase 6 already assumes adapter-based ingestion. The real question is which data sources to target, how to bridge the Python/Node.js boundary for the richest source, and whether the adapter interface design should anticipate multiple heterogeneous sources from the start.

**Core question:** Which F1 data sources should the project target, and what integration architecture connects them to the TypeScript monorepo while preserving local-first operation?

**Adjacent questions:**
- How should FastF1's Python runtime be bridged into a Node.js application?
- Can FastF1's circuit position data seed Phase 2 circuit representations?
- Should imported data be cached locally to avoid repeated API calls and support offline use?
- Does this resolve the PROJECT.md open question about F1 TV Premium?

## Analysis

### Option A: Target FastF1 as the Sole Primary Adapter

- **Claim:** Use FastF1 as the single data source, building a Python sidecar or pre-export pipeline to feed the Node.js application.
- **Grounds:** FastF1 provides the richest data: telemetry at ~240ms resolution, position data with x/y/z coordinates, tire compounds, weather, and session results spanning 2018+. It is MIT-licensed, well-documented, and widely used in the F1 analytics community. Its circuit position data could directly seed Phase 2 circuit representations.
- **Warrant:** A single rich source simplifies the initial pipeline and provides enough data diversity (telemetry, aggregates, spatial) to exercise all planned adapter patterns.
- **Rebuttal:** Creates a single point of failure. FastF1 is unofficial and depends on F1's Live Timing API, which could change without notice. The Python/Node.js boundary adds deployment complexity. No real-time capability.
- **Qualifier:** Moderate. Good for initial development but fragile as the sole long-term source.

### Option B: Target OpenF1 API as the Sole Primary Adapter

- **Claim:** Use OpenF1's REST API as the single data source, callable directly from Node.js without any Python dependency.
- **Grounds:** OpenF1 provides a clean REST interface that Node.js can consume natively via fetch or axios. No language boundary to bridge. Covers car data, laps, pit stops, positions, weather, and more. Free and unauthenticated.
- **Warrant:** Eliminates the Python integration problem entirely and keeps the stack purely TypeScript/Node.js.
- **Rebuttal:** OpenF1 is a newer project with less community history and potentially shallower historical coverage. Its data may not match FastF1's telemetry richness or 2018+ depth. Real-time focus may leave gaps in historical data availability. The project needs rich historical telemetry for model training and validation.
- **Qualifier:** Moderate. Clean integration but potentially insufficient data depth for the project's modeling ambitions.

### Option C: Support Both FastF1 and OpenF1 with a Shared Adapter Interface

- **Claim:** Design the adapter interface (DATA-02) to accommodate both FastF1 and OpenF1 from the start, with FastF1 as the primary source for historical telemetry and OpenF1 as a complementary source for real-time and structured REST access.
- **Grounds:** The two sources have complementary strengths. FastF1 excels at historical depth and telemetry richness. OpenF1 excels at native Node.js integration and real-time data. The adapter pattern in DATA-02 already anticipates multiple formats; designing for two concrete sources grounds that abstraction in reality.
- **Warrant:** Multiple sources reduce single-point-of-failure risk. The adapter interface becomes a tested abstraction rather than a speculative one. FastF1's pre-exported JSON files and OpenF1's REST responses exercise different adapter patterns, validating the interface design. Local caching of both sources supports offline operation.
- **Rebuttal:** More upfront design work. The Python bridge for FastF1 still needs solving. Risk of over-engineering the adapter interface for only two sources.
- **Qualifier:** Strong. The additional design cost is modest given that the adapter interface is already planned, and having two concrete sources makes the abstraction credible rather than theoretical.

### Option D: Defer Data Source Choice Entirely to Phase 6 Planning

- **Claim:** Do not commit to specific data sources now. Let Phase 6 planning make the decision when implementation is imminent.
- **Grounds:** Phase 6 is later in the roadmap; requirements and tooling may change.
- **Warrant:** Avoids premature commitment.
- **Rebuttal:** Leaves the PROJECT.md open question unresolved. Makes it impossible to plan Phase 2 circuit data seeding. The adapter interface in DATA-02 benefits from knowing its concrete targets during design. Deferral is appropriate when information is genuinely unavailable; here, the data source landscape is well-understood now.
- **Qualifier:** Weak. The information needed to decide is already available.

## Tensions

- FastF1's data richness is compelling, but its Python runtime creates a real integration boundary in a TypeScript monorepo. The bridge must be simple enough that it does not become its own maintenance burden.
- OpenF1's native REST compatibility is attractive, but if its historical depth proves insufficient, the project would need FastF1 anyway, making a two-source strategy pragmatic rather than perfectionist.
- Local-first operation argues for pre-exporting and caching data rather than depending on live API calls, which favors a batch pipeline model over a request-time adapter for FastF1.
- The adapter interface abstraction is more credible when grounded in two real sources, but the second source should earn its place by providing genuinely complementary data, not just architectural symmetry.
- FastF1's circuit position data is uniquely valuable for Phase 2 circuit representations. No other source provides comparable spatial track data. This cross-phase benefit weights the decision toward including FastF1 regardless of integration cost.

## Recommendation

Adopt Option C.

**Decision:** Target both FastF1 and OpenF1 with a shared adapter interface. FastF1 serves as the primary source for historical telemetry and circuit data. OpenF1 serves as the complementary source for structured REST access and potential real-time use.

**Integration architecture for FastF1:**

The Python/Node.js boundary should be bridged via a pre-export pipeline, not a live sidecar service. Specifically:

1. A Python script (runnable via conda environment on dionysus) uses FastF1 to fetch and cache session data locally.
2. The script exports structured JSON files to a known directory within the monorepo's data path.
3. The Node.js application reads these JSON files through a FastF1 file adapter implementing the DATA-02 interface.
4. This keeps the Node.js runtime Python-free while leveraging FastF1's full data richness.

This approach is preferred over a Python sidecar service (unnecessary runtime complexity for batch data), child process spawning (fragile, hard to test), or a thin Python HTTP server (overengineered for a pre-export workflow).

**Integration architecture for OpenF1:**

OpenF1 is consumed directly from Node.js via its REST API through an OpenF1 REST adapter implementing the same DATA-02 interface. Responses are cached locally after first fetch to support offline operation.

**Local caching:** Both sources cache locally. FastF1 data is cached by FastF1's own caching layer during export and again as JSON files. OpenF1 responses are cached by the REST adapter. This supports the project's local-first value and avoids repeated API calls during development and testing.

**Circuit data for Phase 2:** FastF1's track position data (x/y/z coordinates for circuit layouts) should be included in the export format. Phase 2 circuit representation planning can reference this as a seeding source, avoiding manual circuit definition.

**Resolving the PROJECT.md open question:** F1 TV Premium does not provide structured data export. Its data is presented as visual overlays during live viewing. The practical answer is that F1 TV Premium data is obtainable only indirectly, through tools like FastF1 that capture the underlying Live Timing API feeds that F1 TV Premium also consumes. The open question should be updated to reflect this conclusion.

**Ergast disposition:** Ergast is deprecated and provides only race-level aggregates. It is not worth targeting as a primary adapter. However, its static data dumps could serve as reference data for validation (comparing aggregated results against known race outcomes). This is a secondary concern and does not need an adapter in the initial design.

## Predictions

**If adopted, we predict:**

| ID | Prediction | Observable by | Falsified if |
|----|-----------|---------------|-------------|
| P1 | Phase 6 planning will define at least two concrete adapter implementations (FastF1 file adapter, OpenF1 REST adapter) behind a shared interface | When Phase 6 plans are written | Phase 6 planning defines only abstract adapter interfaces with no concrete source implementations |
| P2 | Phase 2 planning will reference FastF1 circuit position data as a seeding source for track representations | When Phase 2 plans are written | Phase 2 planning requires fully manual circuit definition with no mention of external position data |
| P3 | The FastF1 pre-export pipeline will be a standalone Python script, not a runtime service dependency | When Phase 6 is implemented | FastF1 integration requires a running Python service for the Node.js app to function |
| P4 | Local caching will enable full offline development after an initial data fetch | When data import is implemented | The application requires live API access to function during development |

## Decision Record

**Decision:** Target FastF1 (via pre-export JSON pipeline) and OpenF1 (via REST adapter) behind a shared adapter interface. FastF1 is primary for historical telemetry and circuit data. OpenF1 is complementary for REST access. F1 TV Premium is not a direct data source; its underlying feeds are accessed through FastF1. Ergast is deprecated and relegated to optional validation reference.
**Decided:** 2026-03-26
**Implemented via:** Deliberation record; informs Phase 6 planning (DATA-01 through DATA-04) and Phase 2 planning (circuit data seeding); resolves PROJECT.md open question on F1 TV Premium data formats
**Signals addressed:** gap-analysis identifying data source strategy gap

## Evaluation

**Evaluated:** Not yet evaluated
**Evaluation method:** Compare Phase 2 and Phase 6 plans against predictions P1-P4; verify adapter interface design accommodates both sources

| Prediction | Outcome | Match? | Explanation |
|-----------|---------|--------|-------------|
| P1: Phase 6 defines two concrete adapters | Not yet evaluated | - | Pending Phase 6 planning |
| P2: Phase 2 references FastF1 circuit data | Not yet evaluated | - | Pending Phase 2 planning |
| P3: FastF1 is pre-export, not runtime service | Not yet evaluated | - | Pending Phase 6 implementation |
| P4: Local caching enables offline development | Not yet evaluated | - | Pending data import implementation |

**Was this progressive or degenerating?** (Lakatos)
Not yet evaluated.

**Lessons for future deliberations:**
When a project has an open question about data availability, a concrete survey of the actual source landscape resolves it more effectively than leaving it as an implementation-time decision. The Python/Node.js boundary question is architectural but well-bounded; the pre-export pattern avoids turning a data source choice into a runtime architecture decision.

## Supersession

**Superseded by:** Not superseded
**Reason:** N/A

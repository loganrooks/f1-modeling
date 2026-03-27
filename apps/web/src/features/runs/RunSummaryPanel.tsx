import { type CircuitDocument, type RunRecord } from "@f1-modeling/domain";
import type { SectorResult, SpeedProfilePoint } from "@f1-modeling/sim-core";
import {
  AssumptionPanel,
  MetricTracePanel,
  RunComparisonCard,
  SensitivityWaterfall,
  SpeedProfileTrace,
  TrackMap,
  type AssumptionEntry,
  type MetricTraceSeries,
  type RunComparisonMetric,
  type SpeedProfileTracePoint,
  type TrackMapPoint,
} from "@f1-modeling/visuals";

// ---------------------------------------------------------------------------
// Helpers shared across both views
// ---------------------------------------------------------------------------

type PlaceholderTracePoint = {
  label: string;
  value: number;
};

function getSelectedRun(
  runs: RunRecord[],
  selectedRunId: string | null,
): RunRecord | null {
  if (selectedRunId) {
    const match = runs.find((entry) => entry.runId === selectedRunId);

    if (match) {
      return match;
    }
  }

  return runs[0] ?? null;
}

function getHarnessId(run: RunRecord): string {
  const id = run.summaryMetrics.harnessId;
  return typeof id === "string" ? id : "";
}

// ---------------------------------------------------------------------------
// Phase 1 placeholder helpers (preserved from original)
// ---------------------------------------------------------------------------

function getReferenceRun(
  runs: RunRecord[],
  selectedRun: RunRecord,
): RunRecord | null {
  return (
    runs.find(
      (entry) =>
        entry.runId !== selectedRun.runId &&
        entry.scenarioId === selectedRun.scenarioId,
    ) ??
    runs.find((entry) => entry.runId !== selectedRun.runId) ??
    null
  );
}

function getNumericMetric(run: RunRecord, key: string): number | null {
  const value = run.summaryMetrics[key];
  return typeof value === "number" ? value : null;
}

function formatMetric(value: number | null): string {
  return value === null ? "n/a" : value.toFixed(0);
}

function formatDelta(subject: number | null, reference: number | null): string {
  if (subject === null || reference === null) {
    return "n/a";
  }

  const delta = subject - reference;

  if (delta === 0) {
    return "No change";
  }

  return `${delta > 0 ? "+" : ""}${delta.toFixed(0)}`;
}

function extractTrace(run: RunRecord): PlaceholderTracePoint[] {
  const artifact = run.artifacts.find(
    (entry) => entry.artifactType === "phase1-placeholder-trace",
  );

  if (!artifact?.data || typeof artifact.data !== "object") {
    return [];
  }

  const trace = (artifact.data as { trace?: unknown }).trace;

  if (!Array.isArray(trace)) {
    return [];
  }

  return trace.flatMap((entry) => {
    if (
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as { label?: unknown }).label === "string" &&
      typeof (entry as { value?: unknown }).value === "number"
    ) {
      return [
        {
          label: (entry as { label: string }).label,
          value: (entry as { value: number }).value,
        },
      ];
    }

    return [];
  });
}

function buildComparisonMetrics(
  selectedRun: RunRecord,
  referenceRun: RunRecord | null,
): RunComparisonMetric[] {
  if (!referenceRun) {
    return [];
  }

  const metricKeys = [
    {
      key: "placeholderScore",
      label: "Placeholder score",
      note: "Deterministic harness scalar for wiring checks only.",
    },
    {
      key: "comparisonBaseline",
      label: "Comparison baseline",
      note: "Synthetic reference value, not validated pace or strategy output.",
    },
    {
      key: "tracePoints",
      label: "Trace points",
      note: "Harness execution checkpoints captured with the run.",
    },
  ];

  return metricKeys.map((metric) => {
    const subjectValue = getNumericMetric(selectedRun, metric.key);
    const referenceValue = getNumericMetric(referenceRun, metric.key);

    return {
      label: metric.label,
      referenceValue: formatMetric(referenceValue),
      subjectValue: formatMetric(subjectValue),
      delta: formatDelta(subjectValue, referenceValue),
      tone: "caution",
      note: metric.note,
    };
  });
}

function buildTraceSeries(
  selectedRun: RunRecord,
  referenceRun: RunRecord | null,
): MetricTraceSeries[] {
  const series: MetricTraceSeries[] = [];
  const selectedTrace = extractTrace(selectedRun);

  if (selectedTrace.length > 0) {
    series.push({
      id: selectedRun.runId,
      label: `${selectedRun.scenarioSnapshot.name} (${selectedRun.runId})`,
      tone: "accent",
      summary: "Selected placeholder run trace.",
      points: selectedTrace,
    });
  }

  if (referenceRun) {
    const referenceTrace = extractTrace(referenceRun);

    if (referenceTrace.length > 0) {
      series.push({
        id: referenceRun.runId,
        label: `${referenceRun.scenarioSnapshot.name} (${referenceRun.runId})`,
        tone: "muted",
        summary: "Comparison trace for side-by-side inspection.",
        points: referenceTrace,
      });
    }
  }

  return series;
}

// ---------------------------------------------------------------------------
// Phase 2 lap model helpers
// ---------------------------------------------------------------------------

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds - mins * 60;
  return `${mins}:${secs.toFixed(3).padStart(6, "0")}`;
}

function extractLapModelMetrics(run: RunRecord): {
  lapTime: number;
  sectorResults: SectorResult[];
  speedProfile: SpeedProfilePoint[];
  assumptions: string[];
  circuitId: string;
  vehicleParams: Record<string, number>;
} | null {
  const m = run.summaryMetrics;
  if (typeof m.lapTime !== "number") return null;

  return {
    lapTime: m.lapTime as number,
    sectorResults: Array.isArray(m.sectorResults) ? (m.sectorResults as SectorResult[]) : [],
    speedProfile: Array.isArray(m.speedProfile) ? (m.speedProfile as SpeedProfilePoint[]) : [],
    assumptions: Array.isArray(m.assumptions) ? (m.assumptions as string[]) : [],
    circuitId: typeof m.circuitId === "string" ? m.circuitId : "",
    vehicleParams: typeof m.vehicleParams === "object" && m.vehicleParams !== null
      ? (m.vehicleParams as Record<string, number>)
      : {},
  };
}

function extractFullSpeedProfile(run: RunRecord): SpeedProfilePoint[] {
  const artifact = run.artifacts.find(
    (entry) => entry.artifactType === "qss-speed-profile",
  );

  if (!artifact?.data || typeof artifact.data !== "object") {
    return [];
  }

  const data = artifact.data as { speedProfile?: unknown };
  return Array.isArray(data.speedProfile) ? (data.speedProfile as SpeedProfilePoint[]) : [];
}

function toTracePoints(profile: SpeedProfilePoint[]): SpeedProfileTracePoint[] {
  return profile.map((p) => ({
    distance: p.distance,
    speed: p.speed,
    regime: p.regime,
    curvature: p.curvature,
    lateralG: p.lateralG,
    longitudinalG: p.longitudinalG,
  }));
}

function buildTrackMapPoints(
  circuit: CircuitDocument,
  profile: SpeedProfilePoint[],
): TrackMapPoint[] | null {
  // Check if circuit has spatial coordinates
  const firstPoint = circuit.points[0];
  if (!firstPoint || firstPoint.x === undefined || firstPoint.y === undefined) {
    return null;
  }

  // Merge circuit spatial data with speed profile data
  // Use nearest-distance matching since profile and circuit may have different sampling
  return circuit.points.flatMap((cp) => {
    if (cp.x === undefined || cp.y === undefined) return [];

    // Find nearest speed profile point by distance
    let nearestSpeed = 0;
    let nearestRegime = "cornering";
    let bestDiff = Infinity;

    for (const sp of profile) {
      const diff = Math.abs(sp.distance - cp.distance);
      if (diff < bestDiff) {
        bestDiff = diff;
        nearestSpeed = sp.speed;
        nearestRegime = sp.regime;
      }
    }

    return [{ x: cp.x, y: cp.y, speed: nearestSpeed, regime: nearestRegime }];
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectorTable({ sectors }: { sectors: SectorResult[] }) {
  // Find the slowest sector
  let slowestIdx = 0;
  let slowestTime = 0;
  sectors.forEach((s, i) => {
    if (s.sectorTime > slowestTime) {
      slowestTime = s.sectorTime;
      slowestIdx = i;
    }
  });

  return (
    <div style={{
      borderRadius: 18,
      border: "1px solid rgba(26, 56, 74, 0.11)",
      background: "rgba(255, 255, 255, 0.76)",
      overflow: "hidden",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
        <thead>
          <tr style={{ background: "rgba(26, 56, 74, 0.06)" }}>
            <th style={thStyle}>Sector</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Min speed</th>
            <th style={thStyle}>Max speed</th>
            <th style={thStyle}>Limiting factor</th>
          </tr>
        </thead>
        <tbody>
          {sectors.map((sector, i) => (
            <tr
              key={sector.sectorIndex}
              style={{
                background: i === slowestIdx ? "rgba(239, 68, 68, 0.06)" : "transparent",
                borderTop: "1px solid rgba(26, 56, 74, 0.08)",
              }}
            >
              <td style={tdStyle}>
                <strong>{sector.sectorName}</strong>
              </td>
              <td style={tdStyleMono}>
                {sector.sectorTime.toFixed(3)}s
                {i === slowestIdx ? (
                  <span style={{
                    marginLeft: 8,
                    padding: "2px 6px",
                    borderRadius: 999,
                    background: "rgba(239, 68, 68, 0.12)",
                    color: "#b91c1c",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                  }}>
                    slowest
                  </span>
                ) : null}
              </td>
              <td style={tdStyleMono}>{(sector.minSpeed * 3.6).toFixed(0)} km/h</td>
              <td style={tdStyleMono}>{(sector.maxSpeed * 3.6).toFixed(0)} km/h</td>
              <td style={tdStyle}>{sector.limitingFactor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  color: "#5a6d7c",
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: "0.74rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  color: "#152634",
};

const tdStyleMono: React.CSSProperties = {
  ...tdStyle,
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: "0.86rem",
};

// ---------------------------------------------------------------------------
// Phase 1 placeholder view
// ---------------------------------------------------------------------------

function PlaceholderRunView({
  selectedRun,
  runs,
}: {
  selectedRun: RunRecord;
  runs: RunRecord[];
}) {
  const referenceRun = getReferenceRun(runs, selectedRun);
  const comparisonMetrics = buildComparisonMetrics(selectedRun, referenceRun);
  const traceSeries = buildTraceSeries(selectedRun, referenceRun);

  return (
    <section className="workspace-stack">
      <article className="workspace-card workspace-card--featured">
        <div className="workspace-row workspace-row--between">
          <div className="workspace-section-heading">
            <p className="workspace-kicker">Run summary</p>
            <h3>{selectedRun.scenarioSnapshot.name}</h3>
          </div>
          <span className="workspace-token workspace-token--warning">
            placeholder output
          </span>
        </div>

        <p className="workspace-copy">
          This run records model version, scenario snapshot, preset snapshots, and a deterministic
          placeholder trace without implying lap physics, controller fidelity, or telemetry truth.
        </p>

        <dl className="workspace-metadata-list">
          <div>
            <dt>Run id</dt>
            <dd>{selectedRun.runId}</dd>
          </div>
          <div>
            <dt>Model version</dt>
            <dd>{selectedRun.modelVersion}</dd>
          </div>
          <div>
            <dt>Scenario seed</dt>
            <dd>{selectedRun.seed}</dd>
          </div>
          <div>
            <dt>Saved status</dt>
            <dd>{selectedRun.status}</dd>
          </div>
        </dl>
      </article>

      <RunComparisonCard
        eyebrow="Comparison"
        title="Selected run versus recent reference"
        summary="Shared comparison card reused for early side-by-side inspection. Any delta remains a placeholder harness difference, not performance truth."
        referenceLabel={
          referenceRun
            ? `${referenceRun.scenarioSnapshot.name} -- ${referenceRun.runId}`
            : "No reference run yet"
        }
        subjectLabel={`${selectedRun.scenarioSnapshot.name} -- ${selectedRun.runId}`}
        metrics={comparisonMetrics}
        tags={[
          {
            label: "Regulation",
            value: selectedRun.presetReferences.regulation.presetId,
            tone: "accent",
          },
          {
            label: "Session",
            value: selectedRun.presetReferences.session.presetId,
          },
          {
            label: "Weather",
            value: selectedRun.presetReferences.weather.presetId,
            tone: "warning",
          },
        ]}
        footer={
          <p className="workspace-copy">
            Reference selection prefers another run from the same scenario, then falls back to the
            most recent different run in history.
          </p>
        }
        emptyState="Create at least two placeholder runs to populate the shared comparison surface."
      />

      <MetricTracePanel
        eyebrow="Trace surface"
        title="Deterministic Phase 1 harness trace"
        description="Shared trace panel reused for ordered placeholder checkpoints. The series describe harness progress only."
        xAxisLabel="Harness step"
        yAxisLabel="Placeholder metric"
        series={traceSeries}
        footer={
          <p className="workspace-copy">
            These trace values come from the Phase 1 placeholder harness and exist to prove data
            flow, provenance, and future overlay seams.
          </p>
        }
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Phase 2 lap model view
// ---------------------------------------------------------------------------

function LapModelRunView({
  selectedRun,
  comparisonRun,
  circuitCatalog,
}: {
  selectedRun: RunRecord;
  comparisonRun: RunRecord | null;
  circuitCatalog: CircuitDocument[];
}) {
  const metrics = extractLapModelMetrics(selectedRun);
  if (!metrics) {
    return (
      <section className="workspace-card workspace-card--muted">
        <p className="workspace-copy">
          This run claims to be a lap model output but contains no lap time metric.
        </p>
      </section>
    );
  }

  // Use full profile from artifact if available, fall back to sampled summary
  const fullProfile = extractFullSpeedProfile(selectedRun);
  const profile = fullProfile.length > 0 ? fullProfile : metrics.speedProfile;
  const tracePoints = toTracePoints(profile);

  // Sector annotations for the speed profile trace
  const sectorAnnotations = metrics.sectorResults.map((s) => ({
    sectorIndex: s.sectorIndex,
    sectorName: s.sectorName,
    startDistance: s.startDistance,
    endDistance: s.endDistance,
  }));

  // Circuit lookup for track map
  const circuit = circuitCatalog.find((c) => c.circuitId === metrics.circuitId);
  const trackMapPoints = circuit ? buildTrackMapPoints(circuit, profile) : null;

  // Comparison data
  const comparisonMetrics = comparisonRun ? extractLapModelMetrics(comparisonRun) : null;
  const comparisonFullProfile = comparisonRun ? extractFullSpeedProfile(comparisonRun) : [];
  const comparisonProfile = comparisonFullProfile.length > 0
    ? comparisonFullProfile
    : (comparisonMetrics?.speedProfile ?? []);

  // Assumptions
  const assumptionEntries: AssumptionEntry[] = metrics.assumptions.map((note, i) => ({
    id: `model-assumption-${i}`,
    label: `Model assumption ${i + 1}`,
    kind: "engineering-inference" as const,
    summary: note,
    confidence: "medium" as const,
  }));

  // Vehicle params label for comparison
  const massLabel = typeof metrics.vehicleParams.mass === "number"
    ? `${metrics.vehicleParams.mass} kg`
    : "default";

  const comparisonMassLabel = comparisonMetrics?.vehicleParams.mass !== undefined
    ? `${comparisonMetrics.vehicleParams.mass} kg`
    : "default";

  return (
    <section className="workspace-stack">
      {/* Header */}
      <article className="workspace-card workspace-card--featured">
        <div className="workspace-row workspace-row--between">
          <div className="workspace-section-heading">
            <p className="workspace-kicker">Lap model output</p>
            <h3>{selectedRun.scenarioSnapshot.name}</h3>
          </div>
          <span className="workspace-token workspace-token--accent" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(11, 111, 120, 0.12)",
            color: "#0d6770",
            fontSize: "0.84rem",
            fontWeight: 600,
          }}>
            QSS lap model
          </span>
        </div>

        <dl className="workspace-metadata-list">
          <div>
            <dt>Circuit</dt>
            <dd>{circuit?.name ?? metrics.circuitId}</dd>
          </div>
          <div>
            <dt>Lap time</dt>
            <dd style={{
              fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#0d6770",
            }}>
              {formatLapTime(metrics.lapTime)}
            </dd>
          </div>
          <div>
            <dt>Model version</dt>
            <dd>{selectedRun.modelVersion}</dd>
          </div>
          <div>
            <dt>Mass</dt>
            <dd>{massLabel}</dd>
          </div>
        </dl>
      </article>

      {/* Sector results table */}
      {metrics.sectorResults.length > 0 ? (
        <div>
          <div className="workspace-section-heading" style={{ marginBottom: 12 }}>
            <p className="workspace-kicker">Sector breakdown</p>
          </div>
          <SectorTable sectors={metrics.sectorResults} />
        </div>
      ) : null}

      {/* Speed profile trace */}
      <SpeedProfileTrace
        profile={tracePoints}
        sectors={sectorAnnotations}
        circuitName={circuit?.name ?? metrics.circuitId}
        comparisonProfile={
          comparisonProfile.length > 0 ? toTracePoints(comparisonProfile) : undefined
        }
        comparisonLabel={
          comparisonRun
            ? `${comparisonRun.scenarioSnapshot.name} (${comparisonMassLabel})`
            : undefined
        }
      />

      {/* Track map */}
      {circuit ? (
        <TrackMap
          points={trackMapPoints ?? []}
          circuitName={circuit.name}
          sectors={circuit.sectors.map((s) => ({
            sectorName: s.sectorName,
            startDistance: s.startDistance,
          }))}
          provenance={{
            sourceType: circuit.provenance.sourceType,
            source: circuit.provenance.source,
            notes: circuit.provenance.notes ?? "",
          }}
          noSpatialData={trackMapPoints === null}
        />
      ) : (
        <TrackMap
          points={[]}
          circuitName={metrics.circuitId}
          provenance={{
            sourceType: "placeholder",
            source: "No circuit document found",
            notes: "Circuit may not be in the catalog.",
          }}
          noSpatialData={true}
        />
      )}

      {/* Comparison waterfall */}
      {comparisonRun && comparisonMetrics && comparisonMetrics.sectorResults.length > 0 ? (
        <SensitivityWaterfall
          baselineSectors={metrics.sectorResults}
          modifiedSectors={comparisonMetrics.sectorResults}
          baselineLabel={`${selectedRun.scenarioSnapshot.name} (${massLabel})`}
          modifiedLabel={`${comparisonRun.scenarioSnapshot.name} (${comparisonMassLabel})`}
          totalBaselineTime={metrics.lapTime}
          totalModifiedTime={comparisonMetrics.lapTime}
        />
      ) : null}

      {/* Assumptions */}
      {assumptionEntries.length > 0 ? (
        <AssumptionPanel
          eyebrow="Model assumptions"
          title="QSS lap model limitations"
          description="These assumptions bound the model's fidelity. Results should be interpreted in this context."
          modelLabel="QSS lap model (Lenzo and Rossi 2020)"
          modelVersion={selectedRun.modelVersion}
          entries={assumptionEntries}
          updatedAt={selectedRun.createdAt}
        />
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

export type RunSummaryPanelProps = {
  runs: RunRecord[];
  selectedRunId: string | null;
  comparisonRunId?: string | null;
  circuitCatalog?: CircuitDocument[];
};

export function RunSummaryPanel({
  runs,
  selectedRunId,
  comparisonRunId,
  circuitCatalog = [],
}: RunSummaryPanelProps) {
  const selectedRun = getSelectedRun(runs, selectedRunId);

  if (!selectedRun) {
    return (
      <section className="workspace-card workspace-card--muted">
        <div className="workspace-section-heading">
          <p className="workspace-kicker">Run summary</p>
          <h3>No run selected</h3>
        </div>
        <p className="workspace-copy">
          Create a run to inspect its output. The lap model produces speed profiles, sector
          breakdowns, and visual explanations. Placeholder runs show Phase 1 wiring checks.
        </p>
      </section>
    );
  }

  const harnessId = getHarnessId(selectedRun);

  if (harnessId === "qss-lap-model") {
    const comparisonRun = comparisonRunId
      ? (runs.find((r) => r.runId === comparisonRunId) ?? null)
      : null;

    return (
      <LapModelRunView
        selectedRun={selectedRun}
        comparisonRun={comparisonRun}
        circuitCatalog={circuitCatalog}
      />
    );
  }

  // Fallback: Phase 1 placeholder view
  return <PlaceholderRunView selectedRun={selectedRun} runs={runs} />;
}

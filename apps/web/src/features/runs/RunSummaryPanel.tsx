import { type RunRecord } from "@f1-modeling/domain";
import {
  MetricTracePanel,
  RunComparisonCard,
  type MetricTraceSeries,
  type RunComparisonMetric,
} from "@f1-modeling/visuals";

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

type RunSummaryPanelProps = {
  runs: RunRecord[];
  selectedRunId: string | null;
};

export function RunSummaryPanel({
  runs,
  selectedRunId,
}: RunSummaryPanelProps) {
  const selectedRun = getSelectedRun(runs, selectedRunId);

  if (!selectedRun) {
    return (
      <section className="workspace-card workspace-card--muted">
        <div className="workspace-section-heading">
          <p className="workspace-kicker">Run summary</p>
          <h3>No placeholder run selected</h3>
        </div>
        <p className="workspace-copy">
          Create a placeholder run to inspect its reproducibility metadata, comparison surface,
          and deterministic trace output.
        </p>
      </section>
    );
  }

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
            ? `${referenceRun.scenarioSnapshot.name} · ${referenceRun.runId}`
            : "No reference run yet"
        }
        subjectLabel={`${selectedRun.scenarioSnapshot.name} · ${selectedRun.runId}`}
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

import type { CSSProperties, ReactNode } from 'react';

export type MetricTraceTone = 'accent' | 'warning' | 'muted';

export type MetricTracePoint = {
  label: string;
  value: number;
};

export type MetricTraceSeries = {
  id: string;
  label: string;
  points: MetricTracePoint[];
  tone?: MetricTraceTone;
  summary?: string;
};

export type MetricTracePanelProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  series: MetricTraceSeries[];
  footer?: ReactNode;
  emptyState?: string;
};

const panelStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
  padding: 22,
  border: '1px solid rgba(26, 56, 74, 0.14)',
  borderRadius: 24,
  background:
    'linear-gradient(180deg, rgba(248, 251, 252, 0.96) 0%, rgba(237, 243, 246, 0.96) 100%)',
  boxShadow: '0 22px 48px -38px rgba(20, 44, 58, 0.38)',
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: '#0f6974',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: '0.76rem',
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.25rem',
  lineHeight: 1.15,
  color: '#152634',
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  color: '#445766',
  lineHeight: 1.6,
};

const chartFrameStyle: CSSProperties = {
  display: 'grid',
  gap: 10,
  padding: 18,
  borderRadius: 22,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(245, 248, 250, 0.76) 100%)',
};

const axisLabelRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  color: '#5a6d7c',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: '0.75rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const legendStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
};

const legendItemStyle: CSSProperties = {
  display: 'grid',
  gap: 6,
  padding: '12px 14px',
  borderRadius: 18,
  background: 'rgba(255, 255, 255, 0.66)',
  border: '1px solid rgba(26, 56, 74, 0.1)',
};

const legendHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: '#152634',
  fontWeight: 600,
};

const legendSummaryStyle: CSSProperties = {
  margin: 0,
  color: '#5a6d7c',
  lineHeight: 1.5,
};

const axisTextStyle: CSSProperties = {
  fill: '#667887',
  fontSize: 10,
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
};

const toneColors: Record<MetricTraceTone, string> = {
  accent: '#0b6f78',
  warning: '#9f5f18',
  muted: '#60717f',
};

type Bounds = {
  min: number;
  max: number;
};

function getBounds(series: MetricTraceSeries[]): Bounds {
  const values = series.flatMap((entry) => entry.points.map((point) => point.value));

  if (values.length === 0) {
    return { min: 0, max: 1 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return { min: min - 1, max: max + 1 };
  }

  return { min, max };
}

function buildPolyline(points: MetricTracePoint[], bounds: Bounds): string {
  if (points.length === 0) {
    return '';
  }

  const width = 320;
  const height = 168;
  const xStep = points.length === 1 ? width / 2 : width / (points.length - 1);

  return points
    .map((point, index) => {
      const x = points.length === 1 ? width / 2 : index * xStep;
      const normalized = (point.value - bounds.min) / (bounds.max - bounds.min);
      const y = height - normalized * height;

      return `${x},${y}`;
    })
    .join(' ');
}

function longestSeriesLabels(series: MetricTraceSeries[]): string[] {
  return series.reduce<string[]>(
    (labels, entry) => (entry.points.length > labels.length ? entry.points.map((point) => point.label) : labels),
    [],
  );
}

export function MetricTracePanel({
  eyebrow,
  title,
  description,
  xAxisLabel = 'Sequence',
  yAxisLabel = 'Metric value',
  series,
  footer,
  emptyState = 'No trace data yet. Pass ordered metric points when model outputs become available.',
}: MetricTracePanelProps) {
  const populatedSeries = series.filter((entry) => entry.points.length > 0);

  if (populatedSeries.length === 0) {
    return (
      <article style={panelStyle}>
        <header>
          {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
          <h3 style={titleStyle}>{title}</h3>
          {description ? <p style={descriptionStyle}>{description}</p> : null}
        </header>
        <p style={descriptionStyle}>{emptyState}</p>
        {footer ? <div>{footer}</div> : null}
      </article>
    );
  }

  const bounds = getBounds(populatedSeries);
  const yTicks = [bounds.max, (bounds.max + bounds.min) / 2, bounds.min];
  const labels = longestSeriesLabels(populatedSeries);

  return (
    <article style={panelStyle}>
      <header>
        {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
        <h3 style={titleStyle}>{title}</h3>
        {description ? <p style={descriptionStyle}>{description}</p> : null}
      </header>

      <div style={chartFrameStyle}>
        <div style={axisLabelRowStyle}>
          <span>{yAxisLabel}</span>
          <span>{xAxisLabel}</span>
        </div>
        <svg
          aria-label={title}
          role="img"
          viewBox="0 0 360 220"
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        >
          <g transform="translate(24 20)">
            {[0, 84, 168].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y}
                x2={320}
                y2={y}
                stroke="rgba(26, 56, 74, 0.14)"
                strokeDasharray="4 6"
              />
            ))}

            {yTicks.map((tick, index) => (
              <text key={index} x={-10} y={index * 84 + 4} textAnchor="end" style={axisTextStyle}>
                {tick.toFixed(1)}
              </text>
            ))}

            {populatedSeries.map((entry) => {
              const tone = entry.tone ?? 'accent';

              return (
                <polyline
                  key={entry.id}
                  fill="none"
                  points={buildPolyline(entry.points, bounds)}
                  stroke={toneColors[tone]}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                />
              );
            })}

            {labels.map((label, index) => {
              const x = labels.length === 1 ? 160 : (index * 320) / Math.max(labels.length - 1, 1);

              return (
                <text key={label} x={x} y={188} textAnchor="middle" style={axisTextStyle}>
                  {label}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      <div style={legendStyle}>
        {populatedSeries.map((entry) => {
          const tone = entry.tone ?? 'accent';

          return (
            <div key={entry.id} style={legendItemStyle}>
              <div style={legendHeaderStyle}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: toneColors[tone],
                    boxShadow: `0 0 0 6px ${toneColors[tone]}1f`,
                  }}
                />
                <span>{entry.label}</span>
              </div>
              {entry.summary ? <p style={legendSummaryStyle}>{entry.summary}</p> : null}
            </div>
          );
        })}
      </div>

      {footer ? <div>{footer}</div> : null}
    </article>
  );
}

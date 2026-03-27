import type { CSSProperties } from 'react';

/** Sector result for the waterfall chart. Mirrors sim-core SectorResult contract. */
export type WaterfallSectorResult = {
  sectorIndex: number;
  sectorName: string;
  sectorTime: number;
  limitingFactor: string;
};

export type SensitivityWaterfallProps = {
  /** Sector results from the baseline run. */
  baselineSectors: WaterfallSectorResult[];
  /** Sector results from the modified run. */
  modifiedSectors: WaterfallSectorResult[];
  /** Label for the baseline run. */
  baselineLabel: string;
  /** Label for the modified run. */
  modifiedLabel: string;
  /** Baseline total lap time in seconds. */
  totalBaselineTime: number;
  /** Modified total lap time in seconds. */
  totalModifiedTime: number;
  /** SVG width (default 700). */
  width?: number | undefined;
  /** SVG height (default 350). */
  height?: number | undefined;
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

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.25rem',
  lineHeight: 1.15,
  color: '#152634',
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: '#0f6974',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: '0.76rem',
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  color: '#445766',
  lineHeight: 1.6,
};

const chartFrameStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(245, 248, 250, 0.76) 100%)',
};

const axisTextStyle: CSSProperties = {
  fill: '#667887',
  fontSize: 10,
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
};

const barLabelStyle: CSSProperties = {
  fill: '#152634',
  fontSize: 9,
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontWeight: 600,
};

const factorLabelStyle: CSSProperties = {
  fill: '#5a6d7c',
  fontSize: 8,
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
};

const legendRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  fontSize: '0.82rem',
  color: '#445766',
};

const legendItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const SLOWER_COLOR = '#ef4444';
const FASTER_COLOR = '#22c55e';
const TOTAL_NEUTRAL_COLOR = '#6b7280';
const MARGIN = { top: 40, right: 30, bottom: 70, left: 60 };

function formatDelta(seconds: number): string {
  const sign = seconds >= 0 ? '+' : '';
  return `${sign}${seconds.toFixed(3)}s`;
}

export function SensitivityWaterfall({
  baselineSectors,
  modifiedSectors,
  baselineLabel,
  modifiedLabel,
  totalBaselineTime,
  totalModifiedTime,
  width = 700,
  height = 350,
}: SensitivityWaterfallProps) {
  if (baselineSectors.length === 0 || modifiedSectors.length === 0) {
    return (
      <article style={panelStyle}>
        <header>
          <p style={eyebrowStyle}>Sensitivity</p>
          <h3 style={titleStyle}>Lap time comparison</h3>
        </header>
        <p style={descriptionStyle}>
          No sector data available for comparison. Both runs need valid sector results.
        </p>
      </article>
    );
  }

  // Compute per-sector deltas
  const sectorCount = Math.min(baselineSectors.length, modifiedSectors.length);
  type BarData = {
    label: string;
    delta: number;
    cumBefore: number;
    cumAfter: number;
    limitingFactor: string;
    isTotal: boolean;
  };
  const bars: BarData[] = [];
  let cumulative = 0;

  for (let i = 0; i < sectorCount; i++) {
    const baseline = baselineSectors[i];
    const modified = modifiedSectors[i];
    if (!baseline || !modified) continue;

    const delta = modified.sectorTime - baseline.sectorTime;
    const cumBefore = cumulative;
    cumulative += delta;

    // Show the limiting factor from whichever sector had a larger absolute delta
    const factor = Math.abs(modified.sectorTime) >= Math.abs(baseline.sectorTime)
      ? modified.limitingFactor
      : baseline.limitingFactor;

    bars.push({
      label: baseline.sectorName,
      delta,
      cumBefore,
      cumAfter: cumulative,
      limitingFactor: factor,
      isTotal: false,
    });
  }

  // Total bar
  const totalDelta = totalModifiedTime - totalBaselineTime;
  bars.push({
    label: 'Total',
    delta: totalDelta,
    cumBefore: 0,
    cumAfter: totalDelta,
    limitingFactor: '',
    isTotal: true,
  });

  // Compute chart scales
  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;

  const allValues = bars.flatMap((b) =>
    b.isTotal ? [0, b.cumAfter] : [b.cumBefore, b.cumAfter],
  );
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 0);
  const valRange = maxVal - minVal || 0.1;
  const paddedMin = minVal - valRange * 0.15;
  const paddedMax = maxVal + valRange * 0.15;
  const paddedRange = paddedMax - paddedMin;

  const barCount = bars.length;
  const barGroupWidth = plotW / barCount;
  const barWidth = Math.min(barGroupWidth * 0.6, 50);
  const barPadding = (barGroupWidth - barWidth) / 2;

  function scaleY(value: number): number {
    return plotH - ((value - paddedMin) / paddedRange) * plotH;
  }

  // Zero line
  const zeroY = scaleY(0);

  // Y-axis ticks
  const tickCount = 5;
  const yTicks: number[] = [];
  const yStep = paddedRange / (tickCount - 1);
  for (let i = 0; i < tickCount; i++) {
    yTicks.push(paddedMin + i * yStep);
  }

  return (
    <article style={panelStyle}>
      <header>
        <p style={eyebrowStyle}>Sensitivity analysis</p>
        <h3 style={titleStyle}>
          Lap Time Sensitivity: {baselineLabel} vs {modifiedLabel}
        </h3>
      </header>

      <div style={chartFrameStyle}>
        <svg
          aria-label={`Waterfall chart: ${baselineLabel} vs ${modifiedLabel}`}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
        >
          <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            {/* Grid lines */}
            {yTicks.map((tick, i) => (
              <line
                key={`grid-${i}`}
                x1={0}
                y1={scaleY(tick)}
                x2={plotW}
                y2={scaleY(tick)}
                stroke="rgba(26, 56, 74, 0.1)"
                strokeDasharray="4 6"
              />
            ))}

            {/* Y-axis labels */}
            {yTicks.map((tick, i) => (
              <text
                key={`ylabel-${i}`}
                x={-8}
                y={scaleY(tick) + 3}
                textAnchor="end"
                style={axisTextStyle}
              >
                {formatDelta(tick)}
              </text>
            ))}

            {/* Y-axis title */}
            <text
              x={-plotH / 2}
              y={-46}
              textAnchor="middle"
              transform="rotate(-90, 0, 0)"
              style={{ ...axisTextStyle, fontSize: 11 }}
            >
              Cumulative time delta (s)
            </text>

            {/* Zero line */}
            <line
              x1={0}
              y1={zeroY}
              x2={plotW}
              y2={zeroY}
              stroke="#152634"
              strokeWidth={1}
              opacity={0.4}
            />

            {/* Bars */}
            {bars.map((bar, i) => {
              const xOffset = i * barGroupWidth + barPadding;
              const isPositive = bar.delta >= 0;
              const barColor = bar.isTotal
                ? (totalDelta >= 0 ? SLOWER_COLOR : FASTER_COLOR)
                : (isPositive ? SLOWER_COLOR : FASTER_COLOR);

              let barTop: number;
              let barBottom: number;

              if (bar.isTotal) {
                barTop = scaleY(Math.max(0, bar.cumAfter));
                barBottom = scaleY(Math.min(0, bar.cumAfter));
              } else {
                const top = Math.max(bar.cumBefore, bar.cumAfter);
                const bottom = Math.min(bar.cumBefore, bar.cumAfter);
                barTop = scaleY(top);
                barBottom = scaleY(bottom);
              }

              const barHeight = Math.max(barBottom - barTop, 1);

              // Connector line to next bar
              const showConnector = !bar.isTotal && i < bars.length - 2;

              return (
                <g key={`bar-${i}`}>
                  {/* Bar */}
                  <rect
                    x={xOffset}
                    y={barTop}
                    width={barWidth}
                    height={barHeight}
                    fill={barColor}
                    rx={3}
                    opacity={0.85}
                  />

                  {/* Delta label above/below bar */}
                  <text
                    x={xOffset + barWidth / 2}
                    y={isPositive || bar.isTotal ? barTop - 6 : barBottom + 14}
                    textAnchor="middle"
                    style={barLabelStyle}
                  >
                    {formatDelta(bar.delta)}
                  </text>

                  {/* Sector name label */}
                  <text
                    x={xOffset + barWidth / 2}
                    y={plotH + 16}
                    textAnchor="middle"
                    style={{ ...axisTextStyle, fontSize: 10 }}
                  >
                    {bar.label}
                  </text>

                  {/* Limiting factor label */}
                  {bar.limitingFactor ? (
                    <text
                      x={xOffset + barWidth / 2}
                      y={plotH + 30}
                      textAnchor="middle"
                      style={factorLabelStyle}
                    >
                      {bar.limitingFactor}
                    </text>
                  ) : null}

                  {/* Connector line to next bar */}
                  {showConnector ? (
                    <line
                      x1={xOffset + barWidth}
                      y1={scaleY(bar.cumAfter)}
                      x2={xOffset + barGroupWidth + barPadding}
                      y2={scaleY(bar.cumAfter)}
                      stroke="rgba(26, 56, 74, 0.25)"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                  ) : null}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div style={legendRowStyle}>
        <div style={legendItemStyle}>
          <span
            aria-hidden="true"
            style={{ width: 10, height: 10, borderRadius: 2, background: SLOWER_COLOR }}
          />
          <span>Slower (positive delta)</span>
        </div>
        <div style={legendItemStyle}>
          <span
            aria-hidden="true"
            style={{ width: 10, height: 10, borderRadius: 2, background: FASTER_COLOR }}
          />
          <span>Faster (negative delta)</span>
        </div>
      </div>
    </article>
  );
}

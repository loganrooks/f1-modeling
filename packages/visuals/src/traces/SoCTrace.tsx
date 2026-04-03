import { type CSSProperties, useState } from 'react';

/** A single point in the SoC trace (one per lap). */
export type SoCTracePoint = {
  lap: number;
  stateOfCharge: number;
  deployed: number;
  harvested: number;
};

export type SoCTraceProps = {
  /** Per-lap SoC data from the electrical-state-trace artifact. */
  data: SoCTracePoint[];
  /** Max battery capacity in Joules (for Y-axis scaling). */
  maxCapacity: number;
  /** Chart title (default "Energy State of Charge"). */
  label?: string | undefined;
  /** Optional second dataset for policy comparison (shown as dashed line). */
  comparisonData?: SoCTracePoint[] | undefined;
  /** Label for comparison line. */
  comparisonLabel?: string | undefined;
  /** SVG width (default 800). */
  width?: number | undefined;
  /** SVG height (default 250). */
  height?: number | undefined;
};

// ---------------------------------------------------------------------------
// Shared visual styling (matches SpeedProfileTrace exactly)
// ---------------------------------------------------------------------------

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

const chartFrameStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(245, 248, 250, 0.76) 100%)',
  position: 'relative',
};

const axisTextStyle: CSSProperties = {
  fill: '#667887',
  fontSize: 10,
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
};

const tooltipStyle: CSSProperties = {
  position: 'absolute',
  padding: '10px 14px',
  borderRadius: 12,
  background: 'rgba(21, 38, 52, 0.94)',
  color: '#e8eef2',
  fontSize: '0.78rem',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  lineHeight: 1.6,
  pointerEvents: 'none',
  zIndex: 10,
  whiteSpace: 'nowrap',
};

const legendRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
};

const legendItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: '0.82rem',
  color: '#445766',
};

const MARGIN = { top: 30, right: 20, bottom: 40, left: 60 };

const PRIMARY_COLOR = '#0f6974';
const COMPARISON_COLOR = '#94a3b8';
const FILL_COLOR = 'rgba(15, 105, 116, 0.12)';

function joulesToMJ(joules: number): number {
  return joules / 1_000_000;
}

function joulesToKJ(joules: number): number {
  return joules / 1_000;
}

export function SoCTrace({
  data,
  maxCapacity,
  label = 'Energy State of Charge',
  comparisonData,
  comparisonLabel,
  width = 800,
  height = 250,
}: SoCTraceProps) {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    point: SoCTracePoint;
  } | null>(null);

  if (data.length === 0) {
    return (
      <article style={panelStyle}>
        <header>
          <p style={eyebrowStyle}>Energy state</p>
          <h3 style={titleStyle}>{label}</h3>
        </header>
        <p style={{ margin: 0, color: '#445766', lineHeight: 1.6 }}>
          No energy state data available. Run a stint simulation to generate SoC traces.
        </p>
      </article>
    );
  }

  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;

  // X-axis range: lap numbers
  const minLap = data[0]?.lap ?? 0;
  const maxLap = data[data.length - 1]?.lap ?? 1;
  const lapRange = maxLap - minLap || 1;

  // Y-axis range: 0 to maxCapacity in MJ
  const maxMJ = joulesToMJ(maxCapacity) * 1.1; // 10% headroom
  const minMJ = 0;

  function scaleX(lap: number): number {
    return lapRange > 0 ? ((lap - minLap) / lapRange) * plotW : 0;
  }

  function scaleY(mj: number): number {
    const range = maxMJ - minMJ;
    return range > 0 ? plotH - ((mj - minMJ) / range) * plotH : plotH;
  }

  // Build primary polyline
  const primaryPoints = data
    .map((p) => `${scaleX(p.lap)},${scaleY(joulesToMJ(p.stateOfCharge))}`)
    .join(' ');

  // Build fill polygon (area under curve)
  const fillPoints =
    `${scaleX(data[0]?.lap ?? 0)},${scaleY(0)} ` +
    primaryPoints +
    ` ${scaleX(data[data.length - 1]?.lap ?? 0)},${scaleY(0)}`;

  // Build comparison polyline
  let comparisonPolyline = '';
  if (comparisonData && comparisonData.length > 0) {
    comparisonPolyline = comparisonData
      .map((p) => `${scaleX(p.lap)},${scaleY(joulesToMJ(p.stateOfCharge))}`)
      .join(' ');
  }

  // Y-axis ticks (5 ticks from 0 to rounded max MJ)
  const yTicks: number[] = [];
  const yMax = Math.ceil(joulesToMJ(maxCapacity));
  const yStep = yMax / 4;
  for (let i = 0; i <= 4; i++) {
    yTicks.push(parseFloat((i * yStep).toFixed(1)));
  }

  // X-axis ticks (integer lap ticks, ~5 ticks)
  const xTicks: number[] = [];
  const xStep = Math.max(1, Math.round(lapRange / 5));
  for (let i = minLap; i <= maxLap; i += xStep) {
    xTicks.push(i);
  }
  if (xTicks[xTicks.length - 1] !== maxLap) {
    xTicks.push(maxLap);
  }

  function handleMouseMove(event: React.MouseEvent<SVGRectElement>) {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - MARGIN.left;
    const mouseY = event.clientY - rect.top;
    const lapFraction = (mouseX / plotW) * lapRange + minLap;
    const closestIdx = data.reduce((best, p, i) => {
      const bestP = data[best];
      if (!bestP) return i;
      return Math.abs(p.lap - lapFraction) < Math.abs(bestP.lap - lapFraction) ? i : best;
    }, 0);
    const point = data[closestIdx];
    if (point) {
      setHover({ x: mouseX + MARGIN.left + 12, y: mouseY - 10, point });
    }
  }

  return (
    <article style={panelStyle}>
      <header>
        <p style={eyebrowStyle}>Energy state</p>
        <h3 style={titleStyle}>{label}</h3>
      </header>

      <div style={chartFrameStyle}>
        <svg
          aria-label={`SoC trace: ${label}`}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
        >
          {/* Gradient definition for fill */}
          <defs>
            <linearGradient id="soc-fill-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity="0.18" />
              <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            {/* Grid lines */}
            {yTicks.map((tick) => (
              <line
                key={`grid-y-${tick}`}
                x1={0}
                y1={scaleY(tick)}
                x2={plotW}
                y2={scaleY(tick)}
                stroke="rgba(26, 56, 74, 0.12)"
                strokeDasharray="4 6"
              />
            ))}

            {/* Y-axis labels */}
            {yTicks.map((tick) => (
              <text
                key={`label-y-${tick}`}
                x={-8}
                y={scaleY(tick) + 3}
                textAnchor="end"
                style={axisTextStyle}
              >
                {tick}
              </text>
            ))}

            {/* X-axis labels */}
            {xTicks.map((tick) => (
              <text
                key={`label-x-${tick}`}
                x={scaleX(tick)}
                y={plotH + 20}
                textAnchor="middle"
                style={axisTextStyle}
              >
                {tick}
              </text>
            ))}

            {/* Axis titles */}
            <text
              x={plotW / 2}
              y={plotH + 36}
              textAnchor="middle"
              style={{ ...axisTextStyle, fontSize: 11 }}
            >
              Lap
            </text>
            <text
              x={-plotH / 2}
              y={-46}
              textAnchor="middle"
              transform="rotate(-90, 0, 0)"
              style={{ ...axisTextStyle, fontSize: 11 }}
            >
              SoC (MJ)
            </text>

            {/* Fill area under primary line */}
            <polygon
              points={fillPoints}
              fill="url(#soc-fill-gradient)"
            />

            {/* Comparison line (dashed) */}
            {comparisonPolyline ? (
              <polyline
                fill="none"
                points={comparisonPolyline}
                stroke={COMPARISON_COLOR}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {/* Primary SoC line */}
            <polyline
              fill="none"
              points={primaryPoints}
              stroke={PRIMARY_COLOR}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data point dots */}
            {data.map((p) => (
              <circle
                key={`dot-${p.lap}`}
                cx={scaleX(p.lap)}
                cy={scaleY(joulesToMJ(p.stateOfCharge))}
                r={2.5}
                fill={PRIMARY_COLOR}
              />
            ))}

            {/* Hover target */}
            <rect
              x={0}
              y={0}
              width={plotW}
              height={plotH}
              fill="transparent"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHover(null)}
            />
          </g>
        </svg>

        {/* Tooltip */}
        {hover ? (
          <div
            style={{
              ...tooltipStyle,
              left: hover.x,
              top: hover.y,
            }}
          >
            <div>Lap: {hover.point.lap}</div>
            <div>SoC: {joulesToMJ(hover.point.stateOfCharge).toFixed(2)} MJ</div>
            <div>Deployed: {joulesToKJ(hover.point.deployed).toFixed(0)} kJ</div>
            <div>Harvested: {joulesToKJ(hover.point.harvested).toFixed(0)} kJ</div>
          </div>
        ) : null}
      </div>

      {/* Legend */}
      <div style={legendRowStyle}>
        <div style={legendItemStyle}>
          <span
            aria-hidden="true"
            style={{
              width: 16,
              height: 0,
              borderTop: `2px solid ${PRIMARY_COLOR}`,
            }}
          />
          <span>SoC</span>
        </div>
        {comparisonData && comparisonData.length > 0 ? (
          <div style={legendItemStyle}>
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 0,
                borderTop: `2px dashed ${COMPARISON_COLOR}`,
              }}
            />
            <span>{comparisonLabel ?? 'Comparison'}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

import { type CSSProperties, useState } from 'react';

/** A single point in the speed profile. Mirrors sim-core SpeedProfilePoint contract. */
export type SpeedProfileTracePoint = {
  distance: number;
  speed: number;
  regime: 'accelerating-grip' | 'accelerating-power' | 'braking' | 'cornering';
  curvature: number;
  lateralG: number;
  longitudinalG: number;
};

export type SpeedProfileSector = {
  sectorIndex: number;
  sectorName: string;
  startDistance: number;
  endDistance: number;
};

export type SpeedProfileTraceProps = {
  /** The speed profile data points. */
  profile: SpeedProfileTracePoint[];
  /** Optional sector boundary annotations. */
  sectors?: SpeedProfileSector[] | undefined;
  /** Displayed as chart title. */
  circuitName: string;
  /** Optional second profile for overlay comparison (shown as dashed line). */
  comparisonProfile?: SpeedProfileTracePoint[] | undefined;
  /** Label for the comparison profile. */
  comparisonLabel?: string | undefined;
  /** SVG width (default 800). */
  width?: number | undefined;
  /** SVG height (default 300). */
  height?: number | undefined;
};

const regimeColors: Record<SpeedProfileTracePoint['regime'], string> = {
  'accelerating-grip': '#22c55e',
  'accelerating-power': '#16a34a',
  braking: '#ef4444',
  cornering: '#f59e0b',
};

const regimeLabels: Record<SpeedProfileTracePoint['regime'], string> = {
  'accelerating-grip': 'Accel (grip)',
  'accelerating-power': 'Accel (power)',
  braking: 'Braking',
  cornering: 'Cornering',
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

function msToKmh(speed: number): number {
  return speed * 3.6;
}

export function SpeedProfileTrace({
  profile,
  sectors,
  circuitName,
  comparisonProfile,
  comparisonLabel,
  width = 800,
  height = 300,
}: SpeedProfileTraceProps) {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    point: SpeedProfileTracePoint;
  } | null>(null);

  if (profile.length === 0) {
    return (
      <article style={panelStyle}>
        <header>
          <p style={eyebrowStyle}>Speed profile</p>
          <h3 style={titleStyle}>{circuitName}</h3>
        </header>
        <p style={{ margin: 0, color: '#445766', lineHeight: 1.6 }}>
          No speed profile data available. Run the lap model to generate a speed-vs-distance trace.
        </p>
      </article>
    );
  }

  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;

  const maxDistance = profile[profile.length - 1]?.distance ?? 0;
  const allSpeeds = profile.map((p) => msToKmh(p.speed));
  const compSpeeds = comparisonProfile ? comparisonProfile.map((p) => msToKmh(p.speed)) : [];
  const combinedSpeeds = [...allSpeeds, ...compSpeeds];
  const maxSpeedKmh = Math.max(...combinedSpeeds) * 1.1;
  const minSpeedKmh = 0;

  function scaleX(distance: number): number {
    return maxDistance > 0 ? (distance / maxDistance) * plotW : 0;
  }

  function scaleY(speedKmh: number): number {
    const range = maxSpeedKmh - minSpeedKmh;
    return range > 0 ? plotH - ((speedKmh - minSpeedKmh) / range) * plotH : plotH;
  }

  // Build colored segments for the primary profile
  const segments: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  for (let i = 0; i < profile.length - 1; i++) {
    const current = profile[i];
    const next = profile[i + 1];
    if (!current || !next) continue;
    segments.push({
      x1: scaleX(current.distance),
      y1: scaleY(msToKmh(current.speed)),
      x2: scaleX(next.distance),
      y2: scaleY(msToKmh(next.speed)),
      color: regimeColors[current.regime],
    });
  }

  // Build dashed comparison polyline
  let comparisonPolyline = '';
  if (comparisonProfile && comparisonProfile.length > 0) {
    comparisonPolyline = comparisonProfile
      .map((p) => `${scaleX(p.distance)},${scaleY(msToKmh(p.speed))}`)
      .join(' ');
  }

  // Y-axis ticks (5 ticks)
  const yTicks: number[] = [];
  const yStep = maxSpeedKmh / 4;
  for (let i = 0; i <= 4; i++) {
    yTicks.push(Math.round(i * yStep));
  }

  // X-axis ticks (distance in m, 5 ticks)
  const xTicks: number[] = [];
  const xStep = maxDistance / 4;
  for (let i = 0; i <= 4; i++) {
    xTicks.push(Math.round(i * xStep));
  }

  // Hover hit areas: divide the plot width into bins
  const binWidth = profile.length > 1 ? plotW / (profile.length - 1) : plotW;

  function handleMouseMove(event: React.MouseEvent<SVGRectElement>) {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - MARGIN.left;
    const mouseY = event.clientY - rect.top;
    const idx = Math.round((mouseX / plotW) * (profile.length - 1));
    const clamped = Math.max(0, Math.min(idx, profile.length - 1));
    const point = profile[clamped];
    if (point) {
      setHover({ x: mouseX + MARGIN.left + 12, y: mouseY - 10, point });
    }
  }

  return (
    <article style={panelStyle}>
      <header>
        <p style={eyebrowStyle}>Speed profile</p>
        <h3 style={titleStyle}>{circuitName} -- Speed vs Distance</h3>
      </header>

      <div style={chartFrameStyle}>
        <svg
          aria-label={`Speed profile trace for ${circuitName}`}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
        >
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
              Distance (m)
            </text>
            <text
              x={-plotH / 2}
              y={-46}
              textAnchor="middle"
              transform={`rotate(-90, 0, 0)`}
              style={{ ...axisTextStyle, fontSize: 11 }}
            >
              Speed (km/h)
            </text>

            {/* Sector boundaries */}
            {sectors?.map((sector) => (
              <g key={`sector-${sector.sectorIndex}`}>
                <line
                  x1={scaleX(sector.startDistance)}
                  y1={0}
                  x2={scaleX(sector.startDistance)}
                  y2={plotH}
                  stroke="rgba(26, 56, 74, 0.3)"
                  strokeDasharray="6 4"
                  strokeWidth={1}
                />
                <text
                  x={scaleX((sector.startDistance + sector.endDistance) / 2)}
                  y={-8}
                  textAnchor="middle"
                  style={{ ...axisTextStyle, fontSize: 9, fill: '#5a6d7c' }}
                >
                  {sector.sectorName}
                </text>
              </g>
            ))}

            {/* Comparison profile (dashed) */}
            {comparisonPolyline ? (
              <polyline
                fill="none"
                points={comparisonPolyline}
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {/* Primary speed profile segments */}
            {segments.map((seg, i) => (
              <line
                key={i}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke={seg.color}
                strokeWidth={2}
                strokeLinecap="round"
              />
            ))}

            {/* Invisible hover target */}
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
            <div>Distance: {hover.point.distance.toFixed(0)} m</div>
            <div>Speed: {msToKmh(hover.point.speed).toFixed(1)} km/h</div>
            <div>Regime: {regimeLabels[hover.point.regime]}</div>
            <div>Lateral G: {hover.point.lateralG.toFixed(2)} g</div>
            <div>Long. G: {hover.point.longitudinalG.toFixed(2)} g</div>
          </div>
        ) : null}
      </div>

      {/* Legend */}
      <div style={legendRowStyle}>
        {(Object.keys(regimeColors) as SpeedProfileTracePoint['regime'][]).map((regime) => (
          <div key={regime} style={legendItemStyle}>
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: regimeColors[regime],
              }}
            />
            <span>{regimeLabels[regime]}</span>
          </div>
        ))}
        {comparisonProfile && comparisonProfile.length > 0 ? (
          <div style={legendItemStyle}>
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 0,
                borderTop: '2px dashed #94a3b8',
              }}
            />
            <span>{comparisonLabel ?? 'Comparison'}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

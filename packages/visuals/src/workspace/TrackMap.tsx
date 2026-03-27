import type { CSSProperties } from 'react';

import { TrackContextPlaceholder } from './TrackContextPlaceholder';

export type TrackMapPoint = {
  x: number;
  y: number;
  speed: number;
  regime: string;
};

export type TrackMapSector = {
  sectorName: string;
  startDistance: number;
};

export type TrackMapProvenance = {
  sourceType: string;
  source: string;
  notes: string;
};

export type TrackMapProps = {
  /** Merged circuit spatial + speed profile data. */
  points: TrackMapPoint[];
  /** Circuit name. */
  circuitName: string;
  /** Optional sector start indicators. */
  sectors?: TrackMapSector[] | undefined;
  /** Provenance for the honesty label. */
  provenance: TrackMapProvenance;
  /** SVG width (default 400). */
  width?: number | undefined;
  /** SVG height (default 400). */
  height?: number | undefined;
  /** If true, render placeholder instead. */
  noSpatialData?: boolean | undefined;
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

const provenanceStyle: CSSProperties = {
  margin: 0,
  color: '#5a6d7c',
  fontSize: '0.78rem',
  fontStyle: 'italic',
  lineHeight: 1.5,
};

const chartFrameStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(245, 248, 250, 0.76) 100%)',
};

const legendBarContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: '0.78rem',
  color: '#5a6d7c',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
};

const PADDING = 30;

/**
 * Maps speed (as ratio 0-1) to an HSL color.
 * 0 (slow) = blue (hsl 240), 1 (fast) = red (hsl 0).
 */
function speedColor(ratio: number): string {
  const hue = 240 - ratio * 240;
  return `hsl(${hue}, 80%, 50%)`;
}

export function TrackMap({
  points,
  circuitName,
  sectors,
  provenance,
  width = 400,
  height = 400,
  noSpatialData = false,
}: TrackMapProps) {
  if (noSpatialData || points.length === 0) {
    return (
      <TrackContextPlaceholder
        eyebrow="Track map"
        title={`${circuitName} -- No spatial data`}
        description="No spatial coordinates available for this circuit. Speed-vs-distance trace shown instead."
        circuitLabel={circuitName}
        state="awaiting-geometry"
      />
    );
  }

  // Compute bounds
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const plotW = width - PADDING * 2;
  const plotH = height - PADDING * 2;

  // Maintain aspect ratio
  const scaleToFit = Math.min(plotW / rangeX, plotH / rangeY);
  const offsetX = PADDING + (plotW - rangeX * scaleToFit) / 2;
  const offsetY = PADDING + (plotH - rangeY * scaleToFit) / 2;

  function mapX(x: number): number {
    return offsetX + (x - minX) * scaleToFit;
  }

  function mapY(y: number): number {
    // Flip Y so positive Y is up
    return offsetY + (maxY - y) * scaleToFit;
  }

  const speeds = points.map((p) => p.speed);
  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);
  const speedRange = maxSpeed - minSpeed || 1;

  // Build colored segments
  const segments: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    if (!current || !next) continue;
    const ratio = (current.speed - minSpeed) / speedRange;
    segments.push({
      x1: mapX(current.x),
      y1: mapY(current.y),
      x2: mapX(next.x),
      y2: mapY(next.y),
      color: speedColor(ratio),
    });
  }

  // Find sector start point indices (nearest point by cumulative distance)
  // Since we only have x/y, approximate by finding nearest points to sector boundaries
  const sectorMarkers: { x: number; y: number; name: string }[] = [];
  if (sectors && sectors.length > 0) {
    // Compute cumulative distance for each point
    const cumDist: number[] = [0];
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (!prev || !curr) continue;
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const prevDist = cumDist[cumDist.length - 1] ?? 0;
      cumDist.push(prevDist + Math.sqrt(dx * dx + dy * dy));
    }

    for (const sector of sectors) {
      let bestIdx = 0;
      let bestDiff = Infinity;
      for (let i = 0; i < cumDist.length; i++) {
        const d = cumDist[i];
        if (d === undefined) continue;
        const diff = Math.abs(d - sector.startDistance);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      }
      const pt = points[bestIdx];
      if (pt) {
        sectorMarkers.push({ x: mapX(pt.x), y: mapY(pt.y), name: sector.sectorName });
      }
    }
  }

  // Start/finish marker
  const startPt = points[0];
  const startX = startPt ? mapX(startPt.x) : 0;
  const startY = startPt ? mapY(startPt.y) : 0;

  // Color legend gradient stops
  const gradientStops = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    offset: `${ratio * 100}%`,
    color: speedColor(ratio),
  }));

  return (
    <article style={panelStyle}>
      <header>
        <p style={eyebrowStyle}>Track map</p>
        <h3 style={titleStyle}>{circuitName}</h3>
      </header>

      <div style={chartFrameStyle}>
        <svg
          aria-label={`Track map for ${circuitName}`}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
        >
          <defs>
            <linearGradient id="track-speed-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientStops.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>

          {/* Track outline segments */}
          {segments.map((seg, i) => (
            <line
              key={i}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={seg.color}
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}

          {/* Start/finish marker */}
          <circle
            cx={startX}
            cy={startY}
            r={5}
            fill="#152634"
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text
            x={startX + 10}
            y={startY + 4}
            style={{ fill: '#152634', fontSize: 9, fontWeight: 600, fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace' }}
          >
            S/F
          </text>

          {/* Sector start markers */}
          {sectorMarkers.map((marker) => (
            <g key={marker.name}>
              <circle
                cx={marker.x}
                cy={marker.y}
                r={3.5}
                fill="#0f6974"
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <text
                x={marker.x + 8}
                y={marker.y + 3}
                style={{ fill: '#5a6d7c', fontSize: 8, fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace' }}
              >
                {marker.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Speed color legend */}
        <div style={legendBarContainerStyle}>
          <span>{Math.round(minSpeed * 3.6)} km/h</span>
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: 'linear-gradient(to right, hsl(240, 80%, 50%), hsl(180, 80%, 50%), hsl(120, 80%, 50%), hsl(60, 80%, 50%), hsl(0, 80%, 50%))',
            }}
          />
          <span>{Math.round(maxSpeed * 3.6)} km/h</span>
        </div>
      </div>

      <p style={provenanceStyle}>
        Track outline: {provenance.source}. {provenance.notes}
      </p>
    </article>
  );
}

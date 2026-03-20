import type { CSSProperties, ReactNode } from 'react';

export type TrackContextPlaceholderState =
  | 'awaiting-geometry'
  | 'coarse-context-only'
  | 'overlay-reserved';

export type TrackContextPlaceholderProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  circuitLabel?: string;
  state?: TrackContextPlaceholderState;
  plannedLayers?: string[];
  limitations?: string[];
  footer?: ReactNode;
};

const panelStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
  padding: 22,
  border: '1px solid rgba(26, 56, 74, 0.14)',
  borderRadius: 24,
  background:
    'linear-gradient(180deg, rgba(248, 250, 251, 0.96) 0%, rgba(236, 242, 245, 0.96) 100%)',
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

const heroStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 22,
  borderRadius: 22,
  border: '1px dashed rgba(26, 56, 74, 0.24)',
  background:
    'radial-gradient(circle at top left, rgba(11, 111, 120, 0.12), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.82) 0%, rgba(241, 246, 249, 0.82) 100%)',
};

const badgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  width: 'fit-content',
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(159, 95, 24, 0.14)',
  color: '#8e5517',
  fontSize: '0.8rem',
  fontWeight: 600,
};

const placeholderBoardStyle: CSSProperties = {
  position: 'relative',
  minHeight: 180,
  overflow: 'hidden',
  borderRadius: 18,
  border: '1px solid rgba(26, 56, 74, 0.12)',
  background:
    'linear-gradient(180deg, rgba(243, 247, 249, 0.94) 0%, rgba(235, 241, 244, 0.94) 100%)',
};

const placeholderMarkStyle: CSSProperties = {
  position: 'absolute',
  inset: 18,
  border: '2px dashed rgba(26, 56, 74, 0.22)',
  borderRadius: 18,
};

const placeholderChipStyle = (top: string, left: string, width: string): CSSProperties => ({
  position: 'absolute',
  top,
  left,
  width,
  padding: '8px 10px',
  borderRadius: 999,
  background: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(26, 56, 74, 0.11)',
  color: '#445766',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: '0.72rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
});

const centerCalloutStyle: CSSProperties = {
  position: 'absolute',
  inset: '50% auto auto 50%',
  transform: 'translate(-50%, -50%)',
  display: 'grid',
  gap: 8,
  width: 'min(82%, 340px)',
  padding: '18px 20px',
  borderRadius: 18,
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 18px 36px -28px rgba(20, 44, 58, 0.38)',
  textAlign: 'center',
};

const listGridStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
};

const listCardStyle: CSSProperties = {
  padding: '14px 16px',
  borderRadius: 18,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background: 'rgba(255, 255, 255, 0.72)',
};

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 10,
  margin: '12px 0 0',
  paddingLeft: 18,
  color: '#445766',
};

const stateLabels: Record<TrackContextPlaceholderState, string> = {
  'awaiting-geometry': 'Awaiting geometry source',
  'coarse-context-only': 'Coarse context only',
  'overlay-reserved': 'Overlay surface reserved',
};

const defaultPlannedLayers = [
  'Circuit outline or sector framing once the model owns stable geometry.',
  'Overlay hooks for later traces, policy markers, or lap annotations.',
];

const defaultLimitations = [
  'No racing line, trajectory, or controller path is implied here.',
  'Corner-by-corner fidelity is deferred until the simulator semantics support it.',
];

export function TrackContextPlaceholder({
  eyebrow,
  title = 'Track context placeholder',
  description,
  circuitLabel,
  state = 'awaiting-geometry',
  plannedLayers = defaultPlannedLayers,
  limitations = defaultLimitations,
  footer,
}: TrackContextPlaceholderProps) {
  return (
    <section style={panelStyle}>
      <header>
        {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
        <h3 style={titleStyle}>{title}</h3>
        <p style={descriptionStyle}>
          {description ??
            'This surface reserves space for future circuit and overlay context while making the current fidelity limit explicit.'}
        </p>
      </header>

      <div style={heroStyle}>
        <span style={badgeStyle}>{stateLabels[state]}</span>
        <div style={placeholderBoardStyle}>
          <div aria-hidden="true" style={placeholderMarkStyle} />
          <span style={placeholderChipStyle('18px', '18px', '132px')}>track frame only</span>
          <span style={placeholderChipStyle('18px', 'calc(100% - 154px)', '136px')}>no line data</span>
          <span style={placeholderChipStyle('calc(100% - 46px)', '18px', '146px')}>no path inference</span>
          <span style={placeholderChipStyle('calc(100% - 46px)', 'calc(100% - 160px)', '142px')}>
            no telemetry overlay
          </span>
          <div style={centerCalloutStyle}>
            <strong>{circuitLabel ? `${circuitLabel} context reserved` : 'Geometry placeholder only'}</strong>
            <span style={descriptionStyle}>
              The workbench may later show circuit context here, but this phase should not suggest
              that a solved trajectory or racing line already exists.
            </span>
          </div>
        </div>
      </div>

      <div style={listGridStyle}>
        <div style={listCardStyle}>
          <span style={eyebrowStyle}>Planned when justified</span>
          <ul style={listStyle}>
            {plannedLayers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={listCardStyle}>
          <span style={eyebrowStyle}>Current honesty guardrails</span>
          <ul style={listStyle}>
            {limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {footer ? <div>{footer}</div> : null}
    </section>
  );
}

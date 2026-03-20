import type { CSSProperties, ReactNode } from 'react';

export type AssumptionKind = 'documented-fact' | 'engineering-inference' | 'placeholder';
export type AssumptionConfidence = 'high' | 'medium' | 'low';

export type AssumptionEntry = {
  id: string;
  label: string;
  kind: AssumptionKind;
  summary: string;
  detail?: string;
  provenance?: string;
  confidence?: AssumptionConfidence;
};

export type AssumptionPanelNote = {
  label: string;
  value: ReactNode;
};

export type AssumptionPanelProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  modelLabel: string;
  modelVersion: string;
  updatedAt?: string;
  entries: AssumptionEntry[];
  notes?: AssumptionPanelNote[];
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
    'linear-gradient(180deg, rgba(249, 251, 252, 0.96) 0%, rgba(238, 243, 246, 0.96) 100%)',
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

const metadataGridStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
};

const metadataCardStyle: CSSProperties = {
  padding: '14px 16px',
  borderRadius: 18,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background: 'rgba(255, 255, 255, 0.72)',
};

const metadataLabelStyle: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  color: '#5a6d7c',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: '0.74rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const entryListStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
};

const entryCardStyle: CSSProperties = {
  display: 'grid',
  gap: 10,
  padding: '16px 18px',
  borderRadius: 18,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background: 'rgba(255, 255, 255, 0.76)',
};

const entryHeaderStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 10,
};

const entryLabelStyle: CSSProperties = {
  margin: 0,
  color: '#152634',
  fontWeight: 600,
};

const badgeBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  borderRadius: 999,
  fontSize: '0.8rem',
  fontWeight: 600,
};

const kindStyles: Record<AssumptionKind, CSSProperties> = {
  'documented-fact': {
    background: 'rgba(13, 121, 87, 0.12)',
    color: '#0f6a4d',
  },
  'engineering-inference': {
    background: 'rgba(11, 111, 120, 0.12)',
    color: '#0d6770',
  },
  placeholder: {
    background: 'rgba(159, 95, 24, 0.14)',
    color: '#8e5517',
  },
};

const confidenceStyles: Record<AssumptionConfidence, CSSProperties> = {
  high: {
    background: 'rgba(13, 121, 87, 0.1)',
    color: '#0f6a4d',
  },
  medium: {
    background: 'rgba(11, 111, 120, 0.1)',
    color: '#0d6770',
  },
  low: {
    background: 'rgba(145, 53, 53, 0.12)',
    color: '#8f2e2e',
  },
};

const noteGridStyle: CSSProperties = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
};

const kindLabels: Record<AssumptionKind, string> = {
  'documented-fact': 'Documented fact',
  'engineering-inference': 'Engineering inference',
  placeholder: 'Placeholder',
};

function badgeStyle(style: CSSProperties): CSSProperties {
  return {
    ...badgeBaseStyle,
    ...style,
  };
}

export function AssumptionPanel({
  eyebrow,
  title = 'Assumptions and provenance',
  description,
  modelLabel,
  modelVersion,
  updatedAt,
  entries,
  notes,
  footer,
  emptyState = 'No assumptions have been recorded yet. Pass documented facts, inferences, or placeholders to make model scope explicit.',
}: AssumptionPanelProps) {
  return (
    <section style={panelStyle}>
      <header>
        {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
        <h3 style={titleStyle}>{title}</h3>
        {description ? <p style={descriptionStyle}>{description}</p> : null}
      </header>

      <div style={metadataGridStyle}>
        <div style={metadataCardStyle}>
          <span style={metadataLabelStyle}>Model surface</span>
          <strong>{modelLabel}</strong>
        </div>
        <div style={metadataCardStyle}>
          <span style={metadataLabelStyle}>Version</span>
          <strong>{modelVersion}</strong>
        </div>
        {updatedAt ? (
          <div style={metadataCardStyle}>
            <span style={metadataLabelStyle}>Captured</span>
            <strong>{updatedAt}</strong>
          </div>
        ) : null}
      </div>

      {entries.length > 0 ? (
        <div style={entryListStyle}>
          {entries.map((entry) => (
            <article key={entry.id} style={entryCardStyle}>
              <div style={entryHeaderStyle}>
                <p style={entryLabelStyle}>{entry.label}</p>
                <span style={badgeStyle(kindStyles[entry.kind])}>{kindLabels[entry.kind]}</span>
                {entry.confidence ? (
                  <span style={badgeStyle(confidenceStyles[entry.confidence])}>
                    {entry.confidence} confidence
                  </span>
                ) : null}
              </div>
              <p style={descriptionStyle}>{entry.summary}</p>
              {entry.detail ? <p style={descriptionStyle}>{entry.detail}</p> : null}
              {entry.provenance ? (
                <div style={metadataCardStyle}>
                  <span style={metadataLabelStyle}>Provenance</span>
                  <span>{entry.provenance}</span>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p style={descriptionStyle}>{emptyState}</p>
      )}

      {notes?.length ? (
        <div style={noteGridStyle}>
          {notes.map((note) => (
            <div key={note.label} style={metadataCardStyle}>
              <span style={metadataLabelStyle}>{note.label}</span>
              <span>{note.value}</span>
            </div>
          ))}
        </div>
      ) : null}

      {footer ? <div>{footer}</div> : null}
    </section>
  );
}

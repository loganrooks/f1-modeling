import type { CSSProperties, ReactNode } from 'react';

export type RunComparisonTone = 'improved' | 'regressed' | 'neutral' | 'caution';
export type RunComparisonTagTone = 'default' | 'accent' | 'warning';

export type RunComparisonMetric = {
  label: string;
  referenceValue: ReactNode;
  subjectValue: ReactNode;
  delta?: ReactNode;
  tone?: RunComparisonTone;
  note?: string;
};

export type RunComparisonTag = {
  label: string;
  value: ReactNode;
  tone?: RunComparisonTagTone;
};

export type RunComparisonCardProps = {
  eyebrow?: string;
  title: string;
  summary?: string;
  referenceLabel: string;
  subjectLabel: string;
  metrics: RunComparisonMetric[];
  tags?: RunComparisonTag[];
  footer?: ReactNode;
  emptyState?: string;
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
  padding: 22,
  border: '1px solid rgba(26, 56, 74, 0.14)',
  borderRadius: 24,
  background:
    'linear-gradient(180deg, rgba(250, 252, 253, 0.94) 0%, rgba(239, 244, 247, 0.94) 100%)',
  boxShadow: '0 22px 48px -38px rgba(20, 44, 58, 0.4)',
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

const summaryStyle: CSSProperties = {
  margin: 0,
  color: '#445766',
  lineHeight: 1.6,
};

const labelsStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
};

const labelCardStyle: CSSProperties = {
  padding: '14px 16px',
  borderRadius: 18,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background: 'rgba(255, 255, 255, 0.72)',
};

const labelTextStyle: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  color: '#5a6d7c',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: '0.75rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const metricListStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
};

const metricRowStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(120px, 1fr) minmax(120px, 1fr)',
  padding: '14px 16px',
  borderRadius: 18,
  border: '1px solid rgba(26, 56, 74, 0.11)',
  background: 'rgba(255, 255, 255, 0.72)',
};

const metricValueStackStyle: CSSProperties = {
  display: 'grid',
  gap: 4,
};

const metricLabelStyle: CSSProperties = {
  margin: 0,
  color: '#152634',
  fontWeight: 600,
};

const metricNoteStyle: CSSProperties = {
  margin: 0,
  color: '#5a6d7c',
  fontSize: '0.92rem',
  lineHeight: 1.5,
};

const metricValueStyle: CSSProperties = {
  color: '#152634',
  fontSize: '1rem',
  fontWeight: 600,
};

const deltaToneStyles: Record<RunComparisonTone, CSSProperties> = {
  improved: {
    background: 'rgba(13, 121, 87, 0.12)',
    color: '#0f6a4d',
  },
  regressed: {
    background: 'rgba(145, 53, 53, 0.12)',
    color: '#8f2e2e',
  },
  neutral: {
    background: 'rgba(28, 55, 72, 0.08)',
    color: '#415564',
  },
  caution: {
    background: 'rgba(159, 95, 24, 0.14)',
    color: '#8e5517',
  },
};

const tagToneStyles: Record<RunComparisonTagTone, CSSProperties> = {
  default: {
    background: 'rgba(28, 55, 72, 0.08)',
    color: '#415564',
  },
  accent: {
    background: 'rgba(11, 111, 120, 0.12)',
    color: '#0d6770',
  },
  warning: {
    background: 'rgba(159, 95, 24, 0.14)',
    color: '#8e5517',
  },
};

const tagListStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
};

function deltaBadgeStyle(tone: RunComparisonTone): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    width: 'fit-content',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: '0.84rem',
    fontWeight: 600,
    ...deltaToneStyles[tone],
  };
}

function tagStyle(tone: RunComparisonTagTone): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 999,
    fontSize: '0.84rem',
    ...tagToneStyles[tone],
  };
}

export function RunComparisonCard({
  eyebrow,
  title,
  summary,
  referenceLabel,
  subjectLabel,
  metrics,
  tags,
  footer,
  emptyState = 'No comparison metrics yet. Provide paired summary values to populate this card.',
}: RunComparisonCardProps) {
  return (
    <article style={cardStyle}>
      <header>
        {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
        <h3 style={titleStyle}>{title}</h3>
        {summary ? <p style={summaryStyle}>{summary}</p> : null}
      </header>

      <div style={labelsStyle}>
        <div style={labelCardStyle}>
          <span style={labelTextStyle}>Reference</span>
          <strong>{referenceLabel}</strong>
        </div>
        <div style={labelCardStyle}>
          <span style={labelTextStyle}>Compared run</span>
          <strong>{subjectLabel}</strong>
        </div>
      </div>

      {metrics.length > 0 ? (
        <div style={metricListStyle}>
          {metrics.map((metric) => {
            const tone = metric.tone ?? 'neutral';

            return (
              <div key={metric.label} style={metricRowStyle}>
                <div style={metricValueStackStyle}>
                  <p style={metricLabelStyle}>{metric.label}</p>
                  {metric.note ? <p style={metricNoteStyle}>{metric.note}</p> : null}
                </div>
                <div style={metricValueStackStyle}>
                  <span style={labelTextStyle}>Reference</span>
                  <span style={metricValueStyle}>{metric.referenceValue}</span>
                </div>
                <div style={metricValueStackStyle}>
                  <span style={labelTextStyle}>Compared</span>
                  <span style={metricValueStyle}>{metric.subjectValue}</span>
                  {metric.delta ? <span style={deltaBadgeStyle(tone)}>{metric.delta}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={summaryStyle}>{emptyState}</p>
      )}

      {tags?.length ? (
        <div style={tagListStyle}>
          {tags.map((tag) => (
            <span key={`${tag.label}-${String(tag.value)}`} style={tagStyle(tag.tone ?? 'default')}>
              <strong>{tag.label}:</strong> {tag.value}
            </span>
          ))}
        </div>
      ) : null}

      {footer ? <div>{footer}</div> : null}
    </article>
  );
}

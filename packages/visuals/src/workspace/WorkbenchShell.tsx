import type { CSSProperties, ReactNode } from 'react';

export type WorkbenchShellTone = 'default' | 'featured' | 'muted';

export type WorkbenchShellZone = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  content: ReactNode;
  footer?: ReactNode;
  tone?: WorkbenchShellTone;
};

export type WorkbenchShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  status?: ReactNode;
  headerMeta?: ReactNode;
  zones: [WorkbenchShellZone, WorkbenchShellZone, WorkbenchShellZone];
  footer?: ReactNode;
  minZoneHeight?: number;
};

const shellStyle: CSSProperties = {
  display: 'grid',
  gap: 20,
};

const frameStyle: CSSProperties = {
  border: '1px solid rgba(26, 56, 74, 0.14)',
  borderRadius: 28,
  background:
    'linear-gradient(180deg, rgba(245, 248, 250, 0.95) 0%, rgba(232, 238, 243, 0.92) 100%)',
  boxShadow: '0 28px 60px -42px rgba(20, 44, 58, 0.42)',
  backdropFilter: 'blur(16px)',
};

const headerStyle: CSSProperties = {
  ...frameStyle,
  display: 'grid',
  gap: 20,
  gridTemplateColumns: 'minmax(0, 1.7fr) minmax(220px, 0.9fr)',
  padding: 28,
};

const headerMetaStyle: CSSProperties = {
  marginTop: 14,
};

const statusStyle: CSSProperties = {
  display: 'grid',
  alignContent: 'start',
  gap: 12,
};

const zonesStyle: CSSProperties = {
  display: 'grid',
  gap: 20,
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
};

const zoneContentStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
};

const zoneFooterStyle: CSSProperties = {
  paddingTop: 16,
  borderTop: '1px solid rgba(26, 56, 74, 0.12)',
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: '#0f6974',
  fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
  fontSize: '0.78rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'clamp(1.6rem, 2.2vw, 2.5rem)',
  lineHeight: 1.08,
  color: '#142532',
};

const zoneTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.28rem',
  lineHeight: 1.15,
  color: '#142532',
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  color: '#445766',
  lineHeight: 1.6,
};

const toneStyles: Record<WorkbenchShellTone, CSSProperties> = {
  default: {
    background:
      'linear-gradient(180deg, rgba(250, 252, 253, 0.88) 0%, rgba(241, 245, 248, 0.9) 100%)',
  },
  featured: {
    background:
      'linear-gradient(180deg, rgba(228, 240, 243, 0.95) 0%, rgba(239, 247, 248, 0.95) 100%)',
    boxShadow: '0 28px 60px -42px rgba(11, 92, 102, 0.48)',
  },
  muted: {
    background:
      'linear-gradient(180deg, rgba(244, 246, 248, 0.95) 0%, rgba(236, 240, 243, 0.95) 100%)',
  },
};

function zoneStyle(minZoneHeight: number, tone: WorkbenchShellTone): CSSProperties {
  return {
    ...frameStyle,
    ...toneStyles[tone],
    display: 'grid',
    alignContent: 'start',
    gap: 18,
    minHeight: minZoneHeight,
    padding: 24,
  };
}

export function WorkbenchShell({
  eyebrow,
  title,
  description,
  status,
  headerMeta,
  zones,
  footer,
  minZoneHeight = 320,
}: WorkbenchShellProps) {
  return (
    <section style={shellStyle}>
      <header style={headerStyle}>
        <div>
          {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
          <h1 style={titleStyle}>{title}</h1>
          {description ? <p style={descriptionStyle}>{description}</p> : null}
          {headerMeta ? <div style={headerMetaStyle}>{headerMeta}</div> : null}
        </div>
        {status ? <div style={statusStyle}>{status}</div> : <div aria-hidden="true" />}
      </header>

      <div style={zonesStyle}>
        {zones.map((zone, index) => {
          const tone = zone.tone ?? (index === 1 ? 'featured' : 'default');

          return (
            <article key={zone.id} style={zoneStyle(minZoneHeight, tone)}>
              <header>
                {zone.eyebrow ? <p style={eyebrowStyle}>{zone.eyebrow}</p> : null}
                <h2 style={zoneTitleStyle}>{zone.title}</h2>
                {zone.description ? <p style={descriptionStyle}>{zone.description}</p> : null}
              </header>
              <div style={zoneContentStyle}>{zone.content}</div>
              {zone.footer ? <div style={zoneFooterStyle}>{zone.footer}</div> : null}
            </article>
          );
        })}
      </div>

      {footer ? <div style={zoneFooterStyle}>{footer}</div> : null}
    </section>
  );
}

import { useEffect, useState } from 'react';

type HealthPayload = {
  host: string;
  port: number;
  service: string;
  status: string;
  checkedAt: string;
};

type ApiStatus =
  | { state: 'checking'; label: string }
  | { state: 'online'; label: string; payload: HealthPayload }
  | { state: 'offline'; label: string };

const scenarioPlaceholders = [
  'Circuit, session, and regulation selectors arrive in the next plan group.',
  'Environment and driver placeholders stay explicit even before model logic exists.',
  'Saved scenario persistence remains local-first and human-inspectable.',
];

const workbenchBoundaries = [
  'No scenario schema editing is wired yet.',
  'No persistence, run history, or comparison engine is wired yet.',
  'This shell exists to reserve layout, copy, and status surfaces for later plans.',
];

const assumptionPanels = [
  'Plant, observer, controller, and later RL layers stay visibly separated.',
  'Track or racing-line visuals remain deferred until the model semantics justify them.',
  'Pinned localhost ports keep later smoke checks deterministic: web 5173, API 8787.',
];

export function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    state: 'checking',
    label: 'Checking local API handshake...',
  });

  useEffect(() => {
    let active = true;

    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health', {
          headers: { accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as HealthPayload;

        if (!active) {
          return;
        }

        setApiStatus({
          state: 'online',
          label: `${payload.service} responding on ${payload.host}:${payload.port}`,
          payload,
        });
      } catch (error) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'unknown failure';

        setApiStatus({
          state: 'offline',
          label: `Local API not reachable yet (${message})`,
        });
      }
    };

    void checkHealth();
    const intervalId = window.setInterval(() => void checkHealth(), 15000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const statusTone =
    apiStatus.state === 'online'
      ? 'status-pill status-pill--online'
      : apiStatus.state === 'offline'
        ? 'status-pill status-pill--offline'
        : 'status-pill';

  return (
    <div className="shell">
      <header className="shell__header panel">
        <div>
          <p className="eyebrow">F1 Modeling Lab</p>
          <h1>Phase 1 workbench foundation</h1>
          <p className="shell__lede">
            Local-first shell for scenario editing, run inspection, and assumption tracing.
            This pass only reserves the surfaces and verifies the local stack wiring.
          </p>
        </div>
        <div className="status-cluster">
          <span className={statusTone}>{apiStatus.label}</span>
          <p className="status-meta">
            {apiStatus.state === 'online'
              ? `Last API heartbeat: ${apiStatus.payload.checkedAt}`
              : 'Start the local API to light up stack status through the Vite proxy.'}
          </p>
        </div>
      </header>

      <main className="workspace">
        <section className="panel">
          <div className="panel__header">
            <p className="eyebrow">Editable lane</p>
            <h2>Scenario drafting surface</h2>
          </div>
          <ul className="signal-list">
            {scenarioPlaceholders.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="note-card">
            <span className="note-card__label">Next honest addition</span>
            <p>Schema-backed input controls, not decorative knobs.</p>
          </div>
        </section>

        <section className="panel panel--center">
          <div className="panel__header">
            <p className="eyebrow">Run surface</p>
            <h2>Workspace and results lane</h2>
          </div>
          <div className="stack-card">
            <div>
              <p className="stack-card__label">Local stack status</p>
              <strong>{apiStatus.state === 'online' ? 'Proxy + API reachable' : 'Waiting for API'}</strong>
            </div>
            <p>
              The browser shell polls <code>/api/health</code> through the local Vite proxy so
              the workbench can surface stack state before any domain contracts exist.
            </p>
          </div>
          <ul className="signal-list">
            {workbenchBoundaries.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel__header">
            <p className="eyebrow">Assumptions</p>
            <h2>System state and guardrails</h2>
          </div>
          <ul className="signal-list">
            {assumptionPanels.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="port-grid">
            <div>
              <span>Web</span>
              <strong>127.0.0.1:5173</strong>
            </div>
            <div>
              <span>API</span>
              <strong>127.0.0.1:8787</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

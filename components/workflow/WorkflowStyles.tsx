export const WORKFLOW_CSS = `
  /* Stage pipeline */
  .wf-stage-item { cursor: default; transition: background 0.13s; }
  .wf-stage-item.active { background: #1E3A5F !important; }
  .wf-stage-item:hover  { background: #1F2937; }

  /* Workflow card (listing) */
  .wf-card { transition: box-shadow 0.15s, border-color 0.15s; cursor: pointer; }
  .wf-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-color: #2563EB !important; }

  /* Stage progress bar segments */
  .wf-seg { transition: background 0.2s; }

  /* Action button */
  .wf-action-primary { transition: background 0.14s, transform 0.1s; }
  .wf-action-primary:hover { background: #1D4ED8 !important; transform: translateY(-1px); }

  /* Match score bar */
  .wf-score-bar { height: 4px; border-radius: 2px; background: #E5E7EB; overflow: hidden; }
  .wf-score-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }

  /* History entry */
  .wf-history-item:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 7px; top: 22px;
    width: 1px; height: calc(100% + 8px);
    background: #E5E7EB;
  }

  /* Intelligence query card */
  .iq-card { transition: box-shadow 0.14s, border-color 0.14s; cursor: pointer; }
  .iq-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); border-color: #2563EB !important; }
  .iq-card.active { border-color: #2563EB !important; background: #EFF6FF !important; }

  /* OS layout */
  .os-layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  .os-content { overflow-y: auto; }
  @media (max-width: 900px) {
    .os-layout { grid-template-columns: 1fr; }
  }
`

export function WorkflowStyles() {
  return <style>{WORKFLOW_CSS}</style>
}

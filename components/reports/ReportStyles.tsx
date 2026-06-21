import { C, FONT } from '@/lib/ds'

const MONO = FONT.mono
const SANS = FONT.sans
const DISP = FONT.display

export const REPORT_CSS = `
/* ─── Section layout ───────────────────────────────────────── */
.rp-layout { display: grid; grid-template-columns: 1fr 288px; gap: 0; align-items: start; }
.rp-sidebar { position: sticky; top: 80px; max-height: calc(100vh - 100px); overflow-y: auto; }

/* ─── Section blocks ───────────────────────────────────────── */
.rp-section { border-bottom: 1px solid ${C.border}; }
.rp-section:last-child { border-bottom: none; }

/* ─── Attribute bars ───────────────────────────────────────── */
.rp-bar-track {
  flex: 1;
  height: 4px;
  background: ${C.border};
  border-radius: 2px;
  overflow: hidden;
}
.rp-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: ${C.blue};
  transition: width 0.6s ease;
}

/* ─── Strength / Weakness items ────────────────────────────── */
.rp-sw-item { border-left: 3px solid transparent; transition: border-left-color 0.15s, background 0.15s; }
.rp-strength:hover { border-left-color: #059669; background: #F0FDF4; }
.rp-weakness:hover { border-left-color: #D97706; background: #FFFBEB; }

/* ─── ToC links ─────────────────────────────────────────────── */
.rp-toc-link {
  display: flex; align-items: baseline; gap: 8px;
  text-decoration: none; padding: 7px 0;
  border-bottom: 1px solid ${C.borderSubtle};
  transition: color 0.14s;
  font-family: ${SANS}; font-size: 11px; color: ${C.textSecondary};
}
.rp-toc-link:last-child { border-bottom: none; }
.rp-toc-link:hover { color: ${C.blue}; }

/* ─── Season stat cards ─────────────────────────────────────── */
.rp-stat-card {
  border: 1px solid ${C.border};
  border-radius: 8px; text-align: center;
  transition: border-color 0.15s, box-shadow 0.15s;
  cursor: default;
}
.rp-stat-card:hover {
  border-color: rgba(37,99,235,0.25);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

/* ─── Verdict badge ─────────────────────────────────────────── */
.rp-verdict-recommended { background: rgba(5,150,105,0.08); border-color: rgba(5,150,105,0.25); color: #059669; }
.rp-verdict-monitor     { background: rgba(217,119,6,0.08);  border-color: rgba(217,119,6,0.25);  color: #D97706; }
.rp-verdict-under-review{ background: rgba(124,58,237,0.08); border-color: rgba(124,58,237,0.25); color: #7C3AED; }
.rp-verdict-not-recommended { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25); color: #DC2626; }

/* ─── Tags ──────────────────────────────────────────────────── */
.rp-tag { transition: background 0.14s, color 0.14s; }
.rp-tag:hover { background: ${C.blueLight} !important; color: ${C.blue} !important; border-color: rgba(37,99,235,0.3) !important; }

/* ─── Download CTA ──────────────────────────────────────────── */
.rp-dl-btn:hover { background: #1D4ED8 !important; }
.rp-contact-btn:hover { background: #F3F4F6 !important; }

/* ─── Breadcrumb ────────────────────────────────────────────── */
.rp-bc-link { transition: color 0.14s; }
.rp-bc-link:hover { color: ${C.blue} !important; }

/* ─── Related report card ───────────────────────────────────── */
.rp-related-card { transition: background 0.15s, border-color 0.15s; }
.rp-related-card:hover { background: ${C.bgLight} !important; border-color: rgba(37,99,235,0.22) !important; }
.rp-related-card:hover .rp-related-name { color: ${C.blue}; }

/* ─── Responsive ─────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .rp-layout { grid-template-columns: 1fr !important; }
  .rp-sidebar { position: static !important; max-height: none !important; border-left: none; border-top: 1px solid ${C.border}; }
  .rp-sidebar-sticky { position: static !important; }
}
@media (max-width: 680px) {
  .rp-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .rp-hero-meta { flex-direction: column !important; gap: 4px !important; }
}
`

export function ReportStyles() {
  return <style>{REPORT_CSS}</style>
}

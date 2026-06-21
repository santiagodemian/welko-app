import { C } from '@/lib/ds'

export const EDITORIAL_CSS = `
/* ─── Article Card ─────────────────────────────────────────── */
.ed-card {
  background: #FFFFFF;
  border: 1px solid ${C.border};
  border-radius: 10px;
  display: flex; flex-direction: column; gap: 10px;
  text-decoration: none;
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
  cursor: pointer;
}
.ed-card:hover {
  box-shadow: 0 8px 28px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
  transform: translateY(-2px);
  border-color: rgba(37,99,235,0.22);
}
.ed-card:hover .ed-card-title { color: ${C.blue}; }

/* ─── Featured Article ─────────────────────────────────────── */
.ed-featured {
  border: 1px solid ${C.border};
  border-radius: 12px;
  overflow: hidden;
  background: #FFFFFF;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  text-decoration: none; display: block;
}
.ed-featured:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.05);
  border-color: rgba(37,99,235,0.22);
}
.ed-featured:hover .ed-featured-title { color: ${C.blue}; }
.ed-featured-split .ed-featured-right {
  border-left: 1px solid ${C.border};
}

/* ─── Ranked list (Trending / Most Read) ─────────────────────── */
.ed-ranked-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 10px 0; border-bottom: 1px solid ${C.border};
  text-decoration: none;
  transition: opacity 0.15s;
}
.ed-ranked-item:last-child { border-bottom: none; }
.ed-ranked-item:hover { opacity: 0.7; }
.ed-ranked-item:hover .ed-ranked-title { color: ${C.blue}; }

/* ─── Tag ──────────────────────────────────────────────────── */
.ed-tag {
  transition: background 0.14s, color 0.14s, border-color 0.14s;
}
.ed-tag:hover {
  background: #EFF6FF !important;
  color: ${C.blue} !important;
  border-color: rgba(37,99,235,0.3) !important;
}

/* ─── Editor's Pick ────────────────────────────────────────── */
.ed-pick {
  border: 1px solid ${C.border};
  border-radius: 10px;
  text-decoration: none; display: block;
  transition: box-shadow 0.18s ease, border-color 0.18s ease;
}
.ed-pick:hover {
  box-shadow: 0 8px 28px rgba(0,0,0,0.08);
  border-color: rgba(37,99,235,0.22);
}
.ed-pick:hover .ed-pick-title { color: ${C.blue}; }

/* ─── Category header link ──────────────────────────────────── */
.ed-cat-link { transition: color 0.14s; }
.ed-cat-link:hover { color: ${C.blue} !important; }

/* ─── Article grid ─────────────────────────────────────────── */
.ed-grid-2 { grid-template-columns: repeat(2, 1fr); }
.ed-grid-3 { grid-template-columns: repeat(3, 1fr); }
.ed-grid-4 { grid-template-columns: repeat(4, 1fr); }

/* ─── Responsive ───────────────────────────────────────────── */
@media (max-width: 900px) {
  .ed-featured-split .ed-featured-split-inner {
    display: flex !important; flex-direction: column !important;
  }
  .ed-featured-split .ed-featured-right {
    border-left: none !important; border-top: 1px solid ${C.border};
  }
  .ed-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
  .ed-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 560px) {
  .ed-grid-2, .ed-grid-3, .ed-grid-4 { grid-template-columns: 1fr !important; }
  .ed-featured-split .ed-featured-split-inner { flex-direction: column !important; }
}
`

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar }       from '@/components/layout/Navbar'
import { Footer }       from '@/components/layout/Footer'
import { Eyebrow }      from '@/components/ui/Eyebrow'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { C, FONT, SECTION, BTN } from '@/lib/ds'
import {
  EditorialStyles,
  FeaturedArticle,
  ArticleGrid,
  TrendingBlock,
  EditorsPick,
  CategoryHeader,
} from '@/components/editorial'
import {
  featuredArticle,
  editorsPickArticle,
  trendingArticles,
  latestArticles,
  CATEGORY_LIST,
  ARTICLES,
  CAT,
} from '@/lib/editorial-data'

export const metadata = {
  title: 'Intelligence — Polaris Football',
  description: 'Scouting reports, player analysis, recruitment intelligence, tactical analysis, and football business coverage from Polaris.',
}

const CATEGORY_META: Record<string, { status: Parameters<typeof StatusBadge>[0]['status']; count: number; desc: string }> = {
  'transfer-market':     { status: 'available',    count: 2,  desc: 'Market movements, deal valuations, contract windows, and transfer window analysis.'                              },
  'emerging-talents':    { status: 'available',    count: 2,  desc: 'High-potential players in secondary markets — identified before they price out of reach.'                        },
  'football-business':   { status: 'available',    count: 2,  desc: 'Ownership structures, financial analysis, governance, and the business side of football.'                        },
  'club-intelligence':   { status: 'beta',         count: 2,  desc: 'Squad composition, coaching philosophy, ownership, and strategic direction by club.'                             },
  'player-reports':      { status: 'research',     count: 2,  desc: 'Individual performance, contract status, market value, and professional development.'                            },
  'recruitment-reports': { status: 'development',  count: 2,  desc: 'End-to-end recruitment analysis combining scouting, network intelligence, and market context.'                  },
  'tactical-analysis':   { status: 'research',     count: 2,  desc: 'Playing systems, pressing structures, set-piece analysis, and positional tendencies.'                            },
  'league-analysis':     { status: 'research',     count: 2,  desc: 'Tactical and structural breakdown of leagues, conferences, and divisions across Europe and beyond.'              },
  'free-agents':         { status: 'development',  count: 2,  desc: 'Available players by position, league, and contract expiry. Updated each transfer window.'                      },
}

export default function IntelligencePage() {
  const PH   = SECTION.padH
  const MONO = FONT.mono

  const secondaryArticles = ARTICLES.filter(a => !a.featured && !a.editorsPick).slice(0, 6)
  const allTrending       = trendingArticles.length > 0 ? trendingArticles : ARTICLES.slice(0, 5)

  return (
    <div style={{ fontFamily: FONT.sans, background: C.bgLight, minHeight: '100vh' }}>
      <style>{`
        /* ─── Category nav ─── */
        .int-cat-nav { display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .int-cat-nav::-webkit-scrollbar { display: none; }
        .int-cat-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px; border-right: 1px solid ${C.border};
          white-space: nowrap; text-decoration: none;
          font-family: ${MONO}; font-size: 8px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: ${C.textMuted}; background: transparent;
          transition: background 0.14s, color 0.14s;
          flex-shrink: 0;
        }
        .int-cat-tab:hover { background: #FFFFFF; color: #111827; }

        /* ─── Layout grid ─── */
        .int-main-grid { display: grid; grid-template-columns: 1fr 320px; gap: 0; }
        .int-cat-section { display: grid; grid-template-columns: repeat(3, 1fr); }

        /* ─── Sidebar ─── */
        .int-sidebar { border-left: 1px solid ${C.border}; }

        /* ─── Category strip ─── */
        .int-cat-strip { display: grid; grid-template-columns: repeat(2, 1fr); }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .int-main-grid { grid-template-columns: 1fr !important; }
          .int-sidebar { border-left: none; border-top: 1px solid ${C.border}; }
          .int-cat-section { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 680px) {
          .int-cat-section { grid-template-columns: 1fr !important; }
          .int-cat-strip { grid-template-columns: 1fr !important; }
        }
        /* ─── Buttons ─── */
        .int-btn-o:hover { background: #F3F4F6 !important; }
      `}</style>
      <EditorialStyles />

      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ CATEGORY HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <CategoryHeader
        category={{ name: 'Intelligence', slug: 'intelligence', color: C.blue }}
        description="Football intelligence covering recruitment, transfers, players, clubs, and the business of the game — built for professionals who need more than headlines."
        articleCount={ARTICLES.length}
        lastUpdated="June 2026"
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ CATEGORY NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="int-cat-nav" style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        {CATEGORY_LIST.map(cat => (
          <a key={cat.slug} href={`#${cat.slug}`} className="int-cat-tab">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cat.color, display: 'inline-block', flexShrink: 0 }} />
            {cat.name}
          </a>
        ))}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ FEATURED STORY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingTop: 'clamp(16px,2vw,22px)', paddingBottom: 'clamp(10px,1.2vw,14px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Lead Story
          </span>
        </div>
        <div style={{ padding: `clamp(20px,2.5vw,32px) ${PH}` }}>
          <FeaturedArticle article={featuredArticle} label="Lead Story" layout="split" />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ MAIN CONTENT + SIDEBAR ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="int-main-grid" style={{ background: C.bgLight, borderBottom: `1px solid ${C.border}` }}>

        {/* Left — article grid */}
        <div>
          <div style={{ paddingTop: 'clamp(14px,1.8vw,20px)', paddingBottom: 'clamp(10px,1.2vw,14px)', paddingLeft: PH, paddingRight: PH, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Latest Intelligence
            </span>
          </div>
          <div style={{ padding: `clamp(18px,2.2vw,26px) ${PH}` }}>
            <ArticleGrid articles={secondaryArticles} columns={2} variant="standard" gap={16} />
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 'clamp(12px,1.5vw,18px)', paddingBottom: 'clamp(12px,1.5vw,18px)', paddingLeft: PH, paddingRight: PH }}>
            <Link href="/intelligence" className="int-btn-o" style={{ ...BTN.outline, fontSize: 10 }}>
              Load more <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="int-sidebar">
          {/* Trending */}
          <div style={{ padding: 'clamp(18px,2.2vw,26px) clamp(16px,2vw,24px)', borderBottom: `1px solid ${C.border}` }}>
            <TrendingBlock articles={allTrending} limit={5} />
          </div>
          {/* Editor's pick */}
          <div style={{ padding: 'clamp(18px,2.2vw,26px) clamp(16px,2vw,24px)' }}>
            <EditorsPick
              article={editorsPickArticle}
              note="The most important intelligence we've published this quarter. Essential reading for anyone navigating the summer window."
            />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ CATEGORY STRIPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {CATEGORY_LIST.map((cat) => {
        const meta    = CATEGORY_META[cat.slug]
        const catArts = ARTICLES.filter(a => a.category.slug === cat.slug)
        if (!meta || catArts.length === 0) return null

        return (
          <section key={cat.slug} id={cat.slug} style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}` }}>
            {/* Category sub-header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 'clamp(16px,2vw,22px)', paddingBottom: 'clamp(12px,1.5vw,18px)',
              paddingLeft: PH, paddingRight: PH,
              borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, display: 'inline-block', flexShrink: 0 }} />
                <h2 style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  {cat.name}
                </h2>
                <StatusBadge status={meta.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {meta.count} reports
                </span>
                <Link href="/intelligence" style={{ fontFamily: MONO, fontSize: 8, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <ArrowRight size={8} />
                </Link>
              </div>
            </div>

            {/* Articles for this category */}
            <div style={{ padding: `clamp(16px,2vw,22px) ${PH}` }}>
              <div className="int-cat-strip" style={{ gap: 14 }}>
                {catArts.map(article => (
                  <Link key={article.id} href={article.href} style={{ textDecoration: 'none' }}>
                    <div className="ed-card" style={{ padding: 'clamp(14px,1.8vw,20px)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <StatusBadge status={article.status} />
                        <span style={{ fontFamily: MONO, fontSize: 8, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {article.readTime} min
                        </span>
                      </div>
                      <h3 className="ed-card-title" style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.2, transition: 'color 0.15s' }}>
                        {article.title}
                      </h3>
                      <p style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textSecondary, margin: 0, lineHeight: 1.7 }}>
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━ BOTTOM CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: SECTION.maxW, margin: '0 auto', padding: `clamp(36px,4.5vw,56px) ${PH}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <Eyebrow mb={8}>Need tailored intelligence?</Eyebrow>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.textSecondary, margin: 0, maxWidth: 440, lineHeight: 1.8 }}>
              Commission a player report, recruitment analysis, or club intelligence brief through Polaris Consulting.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ ...BTN.primary }}>
              Commission a report <ArrowRight size={12} />
            </Link>
            <Link href="/solutions" className="int-btn-o" style={{ ...BTN.outline }}>
              View all services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

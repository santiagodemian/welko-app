'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BLOG_POSTS, CATEGORY_COUNTS, type BlogCategory } from '@/lib/blog-data'
import { C } from '@/lib/ds'

const N = C.dark
const G = C.blue

const CATEGORIES: { label: string; value: BlogCategory | 'ALL' }[] = [
  { label: 'All',         value: 'ALL'         },
  { label: 'News',        value: 'NEWS'        },
  { label: 'Development', value: 'DEVELOPMENT' },
  { label: 'Scouting',    value: 'SCOUTING'    },
  { label: 'Career',      value: 'CAREER'      },
  { label: 'Clubs',       value: 'CLUBS'       },
]

const CATEGORY_COLORS: Record<string, string> = {
  NEWS:        '#3B82F6',
  DEVELOPMENT: '#059669',
  SCOUTING:    '#7C3AED',
  CAREER:      '#D97706',
  CLUBS:       '#DC2626',
}

const PAGE_SIZE = 6

function CategoryBadge({ cat }: { cat: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
      background: `${CATEGORY_COLORS[cat] ?? G}18`,
      color: CATEGORY_COLORS[cat] ?? G,
    }}>
      {cat}
    </span>
  )
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = BLOG_POSTS.filter(p => {
    const matchCat = activeCategory === 'ALL' || p.category === activeCategory
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const featured    = filtered.find(p => p.featured) ?? filtered[0]
  const rest        = paginated.filter(p => p !== featured || page > 1)

  function goPage(n: number) {
    setPage(Math.max(1, Math.min(n, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function changeCategory(val: BlogCategory | 'ALL') {
    setActiveCategory(val)
    setPage(1)
  }

  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#fff', minHeight: '100vh' }}>
      <style>{`
        /* ── Blog grid ── */
        .blog-grid     { display: grid; grid-template-columns: 1fr 320px; gap: 48px; align-items: flex-start; }
        .blog-articles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        @media (max-width: 1100px) {
          .blog-grid    { display: flex !important; flex-direction: column !important; }
          .blog-sidebar { width: 100% !important; }
        }
        @media (max-width: 700px) {
          .blog-articles { grid-template-columns: 1fr !important; }
        }

        /* ── Hero ── */
        .blog-hero-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 380px; }
        @media (max-width: 900px) {
          .blog-hero-grid { display: flex !important; flex-direction: column !important; }
          .blog-hero-photo { min-height: 280px !important; }
        }
        @media (max-width: 600px) {
          .blog-hero-photo { min-height: 220px !important; }
        }

        /* ── Interactions ── */
        .cat-tab { transition: color 0.15s, border-color 0.15s; cursor: pointer; }
        .article-card:hover .article-title { color: ${G} !important; }
        .article-card { transition: box-shadow 0.2s, transform 0.2s; }
        .article-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .read-link { transition: gap 0.15s; }
        .read-link:hover { gap: 8px !important; }
      `}</style>

      <Navbar />

      {/* ── HERO — split: text left / cinematic photo right ── */}
      <section style={{ borderBottom: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div className="blog-hero-grid">
          {/* Left — headline + description */}
          <div style={{
            padding: 'clamp(56px,7vw,96px) clamp(24px,5vw,80px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            background: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1.5, background: G }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                Blog
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 700,
              color: N, margin: '0 0 24px',
              letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1.02,
            }}>
              Insights.<br />Stories.<br /><span style={{ color: G }}>Football.</span>
            </h1>

            <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 360 }}>
              News, tips and stories from the world of football. Inspiration, knowledge and everything that drives the game forward.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
                {BLOG_POSTS.length} articles
              </span>
              <div style={{ width: 1, height: 14, background: '#E5E7EB' }} />
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
                {CATEGORIES.length - 1} categories
              </span>
            </div>
          </div>

          {/* Right — cinematic football photo */}
          <div className="blog-hero-photo" style={{
            position: 'relative', overflow: 'hidden',
            background: '#050505', minHeight: 380,
            borderLeft: '1px solid #E5E7EB',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/diseño11.jpeg"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'right center',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 30%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(5,5,5,0.35)',
            }} />

            {/* Overlay badge */}
            <div style={{
              position: 'absolute', bottom: 28, left: 28, zIndex: 1,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-montserrat), sans-serif',
              }}>
                Polaris Football — Editorial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTERS — sticky tab bar ── */}
      <section style={{
        borderBottom: '1px solid #E5E7EB',
        background: 'rgba(250,250,250,0.97)',
        padding: '0 clamp(24px,5vw,80px)',
        position: 'sticky', top: 72, zIndex: 20,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => changeCategory(c.value)}
                className="cat-tab"
                style={{
                  padding: '15px 16px', background: 'none', border: 'none',
                  borderBottom: `2px solid ${activeCategory === c.value ? G : 'transparent'}`,
                  fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: activeCategory === c.value ? N : '#9CA3AF',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1.5px solid #E5E7EB',
            borderRadius: 8, padding: '7px 12px', minWidth: 200,
          }}>
            <Search size={13} color="#9CA3AF" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search articles..."
              style={{
                border: 'none', outline: 'none', fontSize: 13,
                color: N, background: 'transparent',
                fontFamily: 'var(--font-montserrat), sans-serif', width: '100%',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="blog-grid">

            {/* Left — articles */}
            <div>
              {/* Featured post (page 1, no search, matching category) */}
              {page === 1 && !search && featured && (activeCategory === 'ALL' || featured.category === activeCategory) && (
                <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 32 }}>
                  <div className="article-card" style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    {/* Photo */}
                    <div style={{ height: 300, position: 'relative', background: '#0A0A0A', overflow: 'hidden' }}>
                      {featured.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={featured.image} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.7 }} />
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
                      <div style={{ position: 'absolute', top: 18, left: 18 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', padding: '5px 12px', borderRadius: 4,
                          background: G, color: '#fff',
                        }}>
                          Featured
                        </span>
                      </div>
                      {/* Category + read time inside photo */}
                      <div style={{ position: 'absolute', bottom: 18, left: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
                          background: `${CATEGORY_COLORS[featured.category] ?? G}CC`,
                          color: '#fff',
                        }}>
                          {featured.category}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={10} /> {featured.readTime} min read
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div style={{ padding: '28px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{featured.date}</span>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>· {featured.author}</span>
                      </div>
                      <h2 className="article-title" style={{
                        fontFamily: 'var(--font-space-grotesk), sans-serif',
                        fontSize: 22, fontWeight: 700, color: N,
                        margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.2,
                        transition: 'color 0.15s',
                      }}>
                        {featured.title}
                      </h2>
                      <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 22px', lineHeight: 1.7 }}>
                        {featured.excerpt}
                      </p>
                      <span className="read-link" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: 12, fontWeight: 700, color: G, letterSpacing: '0.04em',
                      }}>
                        Read more <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Article grid */}
              <div className="blog-articles">
                {(page === 1 && !search ? rest : paginated).map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="article-card" style={{
                      borderRadius: 10, overflow: 'hidden',
                      border: '1.5px solid #E5E7EB', height: '100%',
                      display: 'flex', flexDirection: 'column',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                      {/* Photo */}
                      <div style={{ height: 168, position: 'relative', background: '#0A0A0A', overflow: 'hidden', flexShrink: 0 }}>
                        {post.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.image} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.7 }} />
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                        <div style={{ position: 'absolute', top: 12, left: 12 }}>
                          <CategoryBadge cat={post.category} />
                        </div>
                      </div>
                      {/* Content */}
                      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{post.date}</span>
                          <span style={{ fontSize: 11, color: '#C4C9D1' }}>·</span>
                          <span style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Clock size={10} /> {post.readTime} min
                          </span>
                        </div>
                        <h3 className="article-title" style={{
                          fontFamily: 'var(--font-space-grotesk), sans-serif',
                          fontSize: 15, fontWeight: 700, color: N,
                          margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: 1.3,
                          transition: 'color 0.15s', flex: 1,
                        }}>
                          {post.title}
                        </h3>
                        <p style={{
                          fontSize: 13, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.65,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {post.excerpt}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{post.author}</span>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 11, fontWeight: 700, color: G,
                          }}>
                            Read <ArrowRight size={11} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Empty state */}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '56px 20px' }}>
                  <p style={{ fontSize: 16, color: '#9CA3AF', margin: '0 0 12px' }}>No articles found.</p>
                  <button
                    onClick={() => { setSearch(''); setActiveCategory('ALL') }}
                    style={{
                      fontSize: 13, color: G, background: 'none', border: 'none',
                      cursor: 'pointer', fontWeight: 600,
                      fontFamily: 'var(--font-montserrat), sans-serif',
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 44 }}>
                  <button
                    onClick={() => goPage(page - 1)}
                    disabled={page === 1}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      border: '1.5px solid #E5E7EB', background: '#fff',
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: page === 1 ? 0.4 : 1, transition: 'opacity 0.15s',
                    }}
                  >
                    <ChevronLeft size={16} color={N} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => goPage(n)}
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        border: `1.5px solid ${n === page ? G : '#E5E7EB'}`,
                        background: n === page ? G : '#fff',
                        color: n === page ? '#fff' : N,
                        cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        fontFamily: 'var(--font-montserrat), sans-serif',
                        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => goPage(page + 1)}
                    disabled={page === totalPages}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      border: '1.5px solid #E5E7EB', background: '#fff',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: page === totalPages ? 0.4 : 1, transition: 'opacity 0.15s',
                    }}
                  >
                    <ChevronRight size={16} color={N} />
                  </button>
                </div>
              )}
            </div>

            {/* Right — sidebar */}
            <div className="blog-sidebar">
              {/* About Polaris card */}
              <div style={{
                borderRadius: 12, overflow: 'hidden',
                border: '1.5px solid #E5E7EB', marginBottom: 20,
              }}>
                <div style={{ height: 100, position: 'relative', background: '#050505', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/diseño4.jpeg"
                    alt=""
                    aria-hidden="true"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.5 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,5,0.4)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/polariswhitelogo.jpeg" alt="Polaris Football" style={{ height: 32, objectFit: 'contain', opacity: 0.9 }} />
                  </div>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: N, margin: '0 0 6px' }}>About Polaris Football</p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 14px', lineHeight: 1.65 }}>
                    Elite football representation connecting talent with opportunity across five continents.
                  </p>
                  <Link href="/about" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 700, color: G, textDecoration: 'none',
                  }}>
                    Learn more <ArrowRight size={11} />
                  </Link>
                </div>
              </div>

              {/* Categories */}
              <div style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: N, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Categories</p>
                </div>
                {CATEGORIES.filter(c => c.value !== 'ALL').map((c, i, arr) => (
                  <button
                    key={c.value}
                    onClick={() => changeCategory(c.value)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '11px 18px',
                      background: activeCategory === c.value ? `${G}08` : 'transparent',
                      border: 'none',
                      borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      transition: 'background 0.1s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[c.value] ?? G, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: activeCategory === c.value ? G : N }}>{c.label}</span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: '#9CA3AF',
                      background: '#F3F4F6', padding: '2px 7px', borderRadius: 10,
                    }}>
                      {CATEGORY_COUNTS[c.value] ?? 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Newsletter */}
              <div style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '22px 20px', background: '#FAFAFA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 1.5, background: G }} />
                  <p style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                    Newsletter
                  </p>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontSize: 15, fontWeight: 700, color: N,
                  margin: '0 0 8px', letterSpacing: '-0.01em',
                }}>
                  Stay ahead of the game
                </h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.65 }}>
                  Get the latest news, transfer insights and opportunities delivered to your inbox.
                </p>
                <form onSubmit={e => { e.preventDefault(); (e.currentTarget.reset()) }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    style={{
                      padding: '10px 14px', border: '1.5px solid #E5E7EB',
                      borderRadius: 8, fontSize: 13, color: N,
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      outline: 'none', background: '#fff',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '10px 16px', background: G, color: '#fff',
                      borderRadius: 8, fontSize: 12, fontWeight: 600,
                      border: 'none', cursor: 'pointer',
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      transition: 'background 0.15s',
                    }}
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

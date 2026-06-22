import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { C, FONT, T, SECTION, S, R } from '@/lib/ds'
import articlesData from '@/content/articles.json'
import categoriesData from '@/content/categories.json'
import authorsData from '@/content/authors.json'

interface Tag { label: string; slug: string }

interface Article {
  id: string
  slug: string
  categorySlug: string
  authorKey: string
  title: string
  excerpt: string
  publishedAt: string
  readTime: number
  status: string
  tags: Tag[]
  featured?: boolean
  editorsPick?: boolean
  trending?: boolean
  href: string
  body?: string[]
}

interface Category {
  name: string
  slug: string
  color: string
}

interface Author {
  name: string
  role: string
  initials: string
}

interface Authors {
  [key: string]: Author
}

const ARTICLES = articlesData as Article[]
const CATEGORIES = categoriesData as Category[]
const AUTHORS = authorsData as Authors

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) return { title: 'Article Not Found — Polaris Football' }
  return {
    title: `${article.title} — Polaris Football Intelligence`,
    description: article.excerpt,
  }
}

const STATUS_COLORS: Record<string, string> = {
  available:   '#059669',
  beta:        '#7C3AED',
  research:    '#2563EB',
  development: '#D97706',
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) notFound()

  const category = CATEGORIES.find(c => c.slug === article.categorySlug)
  const author = AUTHORS[article.authorKey]
  const related = ARTICLES.filter(
    a => a.categorySlug === article.categorySlug && a.slug !== article.slug
  ).slice(0, 3)

  const catColor = category?.color ?? C.blue
  const statusColor = STATUS_COLORS[article.status] ?? C.blue
  const PH = SECTION.padH

  return (
    <div style={{ fontFamily: FONT.sans, background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .art-grid { display: grid; grid-template-columns: 1fr 300px; gap: 0; }
        .art-sidebar { border-left: 1px solid ${C.border}; padding: clamp(32px,3.5vw,48px) clamp(20px,2.5vw,32px); }
        @media (max-width: 960px) {
          .art-grid { grid-template-columns: 1fr !important; }
          .art-sidebar { border-left: none !important; border-top: 1px solid ${C.border}; padding: 32px clamp(20px,5vw,48px) !important; }
        }
        .rel-card:hover { background: ${C.bgLight} !important; }
      `}</style>

      <Navbar />

      <main style={{ flex: 1 }}>
        <section style={{
          background: C.bgLight,
          backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          borderBottom: `1px solid ${C.border}`,
          padding: `clamp(64px,8vw,96px) ${PH} clamp(40px,5vw,60px)`,
        }}>
          <div style={{ maxWidth: SECTION.maxW, margin: '0 auto' }}>
            <Link href="/intelligence" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, color: C.textMuted,
              textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: 32, transition: 'color 0.15s',
            }}>
              <ArrowLeft size={11} /> Back to Intelligence
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              {category && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: R.badge,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: `${catColor}15`, color: catColor,
                  border: `1px solid ${catColor}30`,
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: catColor, display: 'inline-block' }} />
                  {category.name}
                </span>
              )}
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '4px 10px', borderRadius: R.badge,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                background: `${statusColor}12`, color: statusColor,
                border: `1px solid ${statusColor}25`,
              }}>
                {article.status}
              </span>
            </div>

            <h1 style={{
              fontFamily: FONT.display, fontSize: 'clamp(26px,3.5vw,48px)', fontWeight: 700,
              color: C.textPrimary, margin: '0 0 20px', letterSpacing: '-0.025em', lineHeight: 1.1,
              maxWidth: 780,
            }}>
              {article.title}
            </h1>

            <p style={{
              ...T.bodyLg, color: C.textSecondary, margin: '0 0 28px',
              maxWidth: 660, lineHeight: 1.8,
            }}>
              {article.excerpt}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {author && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: C.blueDim, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: 700, color: C.blue }}>
                      {author.initials}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                      {author.name}
                    </p>
                    <p style={{ fontFamily: FONT.sans, fontSize: 11, color: C.textMuted, margin: 0 }}>
                      {author.role}
                    </p>
                  </div>
                </div>
              )}
              <div style={{ width: 1, height: 28, background: C.border }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={12} color={C.textMuted} />
                <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.textMuted }}>
                  {article.publishedAt}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={12} color={C.textMuted} />
                <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.textMuted }}>
                  {article.readTime} min read
                </span>
              </div>
            </div>

            {article.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
                {article.tags.map(tag => (
                  <span key={tag.slug} style={{
                    padding: '4px 10px', borderRadius: R.badge,
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: C.bgAlt, color: C.textSecondary,
                    border: `1px solid ${C.border}`,
                  }}>
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="art-grid" style={{ maxWidth: '100%', borderBottom: `1px solid ${C.border}` }}>
          <article style={{ padding: `clamp(40px,5vw,64px) ${PH}`, maxWidth: 760 }}>
            {article.body && article.body.length > 0 ? (
              article.body.map((para, i) => (
                <p key={i} style={{
                  ...T.bodyLg,
                  color: i === 0 ? C.textPrimary : '#374151',
                  margin: '0 0 24px',
                  lineHeight: 1.85,
                  fontSize: i === 0 ? 17 : 15,
                  fontWeight: i === 0 ? 500 : 400,
                }}>
                  {para}
                </p>
              ))
            ) : (
              <p style={{ ...T.bodyLg, color: C.textSecondary }}>
                Full article content coming soon.
              </p>
            )}

            <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
              <Link href="/intelligence" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 11, fontWeight: 700, color: C.textPrimary,
                textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
                borderBottom: `1.5px solid ${C.textPrimary}`, paddingBottom: 2,
                transition: 'color 0.15s',
              }}>
                <ArrowLeft size={11} /> All Intelligence Reports
              </Link>
            </div>
          </article>

          <aside className="art-sidebar">
            {category && (
              <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${C.border}` }}>
                <p style={{
                  fontFamily: FONT.mono, fontSize: 9, fontWeight: 700, color: C.textMuted,
                  letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px',
                }}>
                  Category
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: catColor, flexShrink: 0 }} />
                  <span style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                    {category.name}
                  </span>
                </div>
              </div>
            )}

            {related.length > 0 && (
              <div>
                <p style={{
                  fontFamily: FONT.mono, fontSize: 9, fontWeight: 700, color: C.textMuted,
                  letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 16px',
                }}>
                  Related Articles
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {related.map(rel => (
                    <Link key={rel.slug} href={rel.href} className="rel-card" style={{
                      display: 'block', padding: '14px', borderRadius: R.card,
                      border: `1.5px solid ${C.border}`, textDecoration: 'none',
                      transition: 'background 0.15s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{
                          padding: '2px 7px', borderRadius: R.badge,
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                          background: `${STATUS_COLORS[rel.status] ?? C.blue}12`,
                          color: STATUS_COLORS[rel.status] ?? C.blue,
                        }}>
                          {rel.status}
                        </span>
                        <span style={{ fontFamily: FONT.mono, fontSize: 9, color: C.textMuted }}>
                          {rel.readTime} min
                        </span>
                      </div>
                      <p style={{
                        fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: C.textPrimary,
                        margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3,
                      }}>
                        {rel.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              marginTop: 32, padding: '20px', borderRadius: R.card,
              background: C.blueDim, border: `1px solid ${C.blueStr}`,
            }}>
              <p style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: '0 0 8px', textTransform: 'uppercase' }}>
                Need tailored intelligence?
              </p>
              <p style={{ ...T.small, color: C.textSecondary, margin: '0 0 14px', lineHeight: 1.7 }}>
                Commission a player report or recruitment analysis from the Polaris consulting team.
              </p>
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 700, color: C.blue,
                textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                Get in Touch <ArrowRight size={10} />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

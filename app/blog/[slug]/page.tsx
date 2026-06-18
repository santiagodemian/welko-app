import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-data'

const N = '#0A0A0A'
const G = '#2563EB'

const CATEGORY_COLORS: Record<string, string> = {
  NEWS:        '#3B82F6',
  DEVELOPMENT: '#059669',
  SCOUTING:    '#7C3AED',
  CAREER:      '#D97706',
  CLUBS:       '#DC2626',
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Polaris Football`,
    description: post.excerpt,
  }
}

function renderContent(content: string) {
  const paragraphs = content.trim().split('\n\n')
  return paragraphs.map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null

    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
      return (
        <h3 key={i} style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 17, fontWeight: 700, color: N, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>
          {trimmed.slice(2, -2)}
        </h3>
      )
    }

    const parts = trimmed.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, margin: '0 0 20px' }}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} style={{ color: N, fontWeight: 700 }}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    )
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2)
  const catColor = CATEGORY_COLORS[post.category] ?? G

  return (
    <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', background: '#fff', minHeight: '100vh' }}>
      <style>{`
        .post-grid { display: grid; grid-template-columns: 1fr 300px; gap: 56px; align-items: flex-start; }
        @media (max-width: 1000px) {
          .post-grid { display: flex !important; flex-direction: column !important; }
        }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background: N, padding: 'clamp(56px,6vw,80px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 32, transition: 'color 0.15s' }}>
            <ArrowLeft size={13} /> Back to Blog
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 4, background: `${catColor}25`, color: catColor }}>
              {post.category}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {post.readTime} min read
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{post.date}</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(26px, 4vw, 52px)', fontWeight: 700, color: '#fff', margin: '0 0 20px', letterSpacing: '-0.025em', lineHeight: 1.1, maxWidth: 760 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 600, margin: 0 }}>
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      {post.image && (
        <div style={{ height: 'clamp(220px, 35vw, 420px)', overflow: 'hidden', position: 'relative', background: '#0A0A0A' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.75 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 40%, rgba(255,255,255,0.05) 100%)' }} />
        </div>
      )}

      {/* ── CONTENT ── */}
      <section style={{ padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="post-grid">

            {/* Main content */}
            <article>
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 32, marginBottom: 32 }}>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                  By <strong style={{ color: N }}>{post.author}</strong> · {post.date}
                </p>
              </div>

              {renderContent(post.content)}

              <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 48, paddingTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#6B7280', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  <ArrowLeft size={13} /> All Articles
                </Link>
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', padding: '11px 22px', borderRadius: 8, fontWeight: 600, fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Work With Us <ArrowRight size={13} />
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside>
              <div style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '24px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: N, margin: '0 0 16px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>About Polaris</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/polarispnglogo.jpeg" alt="Polaris Football" style={{ height: 32, objectFit: 'contain', marginBottom: 12 }} />
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65, margin: '0 0 16px' }}>
                  We represent football players worldwide, connecting elite talent with the right clubs and opportunities.
                </p>
                <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: G, textDecoration: 'none' }}>
                  Learn more <ArrowRight size={12} />
                </Link>
              </div>

              {related.length > 0 && (
                <div style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: N, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Related Articles</p>
                  </div>
                  {related.map((r, i) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ padding: '16px 20px', borderTop: i > 0 ? '1px solid #F3F4F6' : 'none' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: CATEGORY_COLORS[r.category] ?? G }}>
                          {r.category}
                        </span>
                        <p style={{ fontSize: 13, fontWeight: 600, color: N, margin: '6px 0 4px', lineHeight: 1.4 }}>
                          {r.title}
                        </p>
                        <span style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={10} /> {r.readTime} min read
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/polariswhitelogo.jpeg" alt="Polaris Football" style={{ height: 36, objectFit: 'contain' }} />
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', margin: 0 }}>
            © {new Date().getFullYear()} Polaris Football. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

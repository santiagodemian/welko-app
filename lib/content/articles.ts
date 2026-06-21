import rawArticles    from '@/content/articles.json'
import rawCategories  from '@/content/categories.json'
import rawAuthors     from '@/content/authors.json'
import type { Article, Author, Category } from '@/lib/editorial'
import type { Status } from '@/components/ui/StatusBadge'

// ─── Lookup maps ──────────────────────────────────────────────────────────────

const categoryBySlug = Object.fromEntries(
  rawCategories.map(c => [c.slug, c as Category])
)

const authorByKey = rawAuthors as Record<string, Author>

// ─── Resolver ─────────────────────────────────────────────────────────────────

function resolve(raw: (typeof rawArticles)[0]): Article {
  return {
    id:          raw.id,
    slug:        raw.slug,
    title:       raw.title,
    excerpt:     raw.excerpt,
    category:    categoryBySlug[raw.categorySlug],
    author:      authorByKey[raw.authorKey],
    publishedAt: raw.publishedAt,
    readTime:    raw.readTime,
    status:      raw.status as Status,
    tags:        raw.tags,
    featured:    raw.featured,
    trending:    raw.trending,
    editorsPick: raw.editorsPick,
    href:        raw.href,
  }
}

// ─── Dataset ─────────────────────────────────────────────────────────────────

const ARTICLES: Article[] = rawArticles.map(resolve)

// ─── Category map (camelCase key → Category) ─────────────────────────────────

export const CAT: Record<string, Category> = Object.fromEntries(
  rawCategories.map(c => {
    const key = c.slug.replace(/-([a-z])/g, (_, l: string) => l.toUpperCase())
    return [key, c as Category]
  })
)

export const CATEGORY_LIST: Category[] = rawCategories as Category[]

// ─── Author map ───────────────────────────────────────────────────────────────

export const AUTHORS: Record<string, Author> = authorByKey

// ─── Derived views ────────────────────────────────────────────────────────────

export { ARTICLES }

export const featuredArticle    = ARTICLES.find(a => a.featured)    ?? ARTICLES[0]
export const editorsPickArticle = ARTICLES.find(a => a.editorsPick) ?? ARTICLES[0]
export const trendingArticles   = ARTICLES.filter(a => a.trending)
export const latestArticles     = ARTICLES.slice(0, 6)

export function getByCategory(slug: string, limit?: number): Article[] {
  const results = ARTICLES.filter(a => a.category.slug === slug)
  return limit ? results.slice(0, limit) : results
}

import type { Article } from '@/lib/editorial'
import { ArticleCard } from './ArticleCard'
import type { CardVariant } from './ArticleCard'

interface ArticleGridProps {
  articles: Article[]
  columns?: 2 | 3 | 4
  variant?: CardVariant
  gap?: number | string
}

export function ArticleGrid({ articles, columns = 3, variant = 'standard', gap = 20 }: ArticleGridProps) {
  return (
    <div
      className={`ed-grid-${columns}`}
      style={{ display: 'grid', gap }}
    >
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} variant={variant} />
      ))}
    </div>
  )
}

import type { Article } from '@/lib/editorial'
import { TrendingBlock } from './TrendingBlock'

interface MostReadProps {
  articles: Article[]
  limit?: number
}

export function MostRead({ articles, limit = 5 }: MostReadProps) {
  return <TrendingBlock articles={articles} title="Most Read" limit={limit} />
}

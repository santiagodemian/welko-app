// Content now lives in content/articles.json — this file re-exports the
// resolved data so existing imports don't need to change.
export {
  ARTICLES,
  CATEGORY_LIST,
  CAT,
  AUTHORS,
  featuredArticle,
  editorsPickArticle,
  trendingArticles,
  latestArticles,
  getByCategory,
} from './content/articles'

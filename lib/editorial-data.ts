import type { Article, Author, Category } from './editorial'

// ─── Categories ───────────────────────────────────────────────────────────────

export const CAT: Record<string, Category> = {
  transferMarket:     { name: 'Transfer Market',     slug: 'transfer-market',      color: '#D97706' },
  emergingTalents:    { name: 'Emerging Talents',    slug: 'emerging-talents',     color: '#059669' },
  footballBusiness:   { name: 'Football Business',   slug: 'football-business',    color: '#374151' },
  clubIntelligence:   { name: 'Club Intelligence',   slug: 'club-intelligence',    color: '#7C3AED' },
  playerReports:      { name: 'Player Reports',      slug: 'player-reports',       color: '#2563EB' },
  recruitmentReports: { name: 'Recruitment Reports', slug: 'recruitment-reports',  color: '#DC2626' },
  tacticalAnalysis:   { name: 'Tactical Analysis',   slug: 'tactical-analysis',    color: '#0891B2' },
  leagueAnalysis:     { name: 'League Analysis',     slug: 'league-analysis',      color: '#B45309' },
  freeAgents:         { name: 'Free Agents',         slug: 'free-agents',          color: '#64748B' },
}

export const CATEGORY_LIST = Object.values(CAT)

// ─── Authors ──────────────────────────────────────────────────────────────────

export const AUTHORS: Record<string, Author> = {
  polarisIntel: { name: 'Polaris Intelligence', role: 'Editorial',        initials: 'PI' },
  scoutingDesk: { name: 'Scouting Desk',        role: 'Analysis',         initials: 'SD' },
  dataTeam:     { name: 'Polaris Data Team',    role: 'Data & Analytics', initials: 'DT' },
  transferDesk: { name: 'Transfer Desk',        role: 'Market Coverage',  initials: 'TD' },
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

const T = {
  window:       { label: 'Transfer Window',  slug: 'transfer-window'  },
  freeAgent:    { label: 'Free Agent',       slug: 'free-agent'       },
  valuation:    { label: 'Valuation',        slug: 'valuation'        },
  u23:          { label: 'Under-23',         slug: 'u23'              },
  africa:       { label: 'Africa',           slug: 'africa'           },
  southAmerica: { label: 'South America',    slug: 'south-america'    },
  privateEquity:{ label: 'Private Equity',   slug: 'private-equity'   },
  ownership:    { label: 'Ownership',        slug: 'ownership'        },
  data:         { label: 'Data',             slug: 'data'             },
  pressing:     { label: 'Pressing',         slug: 'pressing'         },
  setPiece:     { label: 'Set Pieces',       slug: 'set-pieces'       },
  ligue1:       { label: 'Ligue 1',          slug: 'ligue-1'          },
  allsvenskan:  { label: 'Allsvenskan',      slug: 'allsvenskan'      },
  contract:     { label: 'Contract',         slug: 'contract'         },
  midfielder:   { label: 'Midfielder',       slug: 'midfielder'       },
  defender:     { label: 'Defender',         slug: 'defender'         },
  mandate:      { label: 'Mandate',          slug: 'mandate'          },
  balkans:      { label: 'Balkans',          slug: 'balkans'          },
  falsNine:     { label: 'False Nine',       slug: 'false-nine'       },
  brighton:     { label: 'Brighton',         slug: 'brighton'         },
  premierLeague:{ label: 'Premier League',   slug: 'premier-league'   },
}

// ─── Articles ─────────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [
  // ── Transfer Market ───────────────────────────────────────────────────────
  {
    id: 'tm-01',
    slug: 'free-agent-windows-opportunity',
    title: 'Free Agent Windows: The Opportunity Most Clubs Consistently Overlook',
    excerpt: 'A structured analysis of where market value concentrates between formal windows — and the calendar patterns that create predictable inefficiencies year after year.',
    category: CAT.transferMarket,
    author: AUTHORS.transferDesk,
    publishedAt: 'June 2026',
    readTime: 8,
    status: 'available',
    tags: [T.window, T.freeAgent, T.valuation],
    featured: true,
    editorsPick: true,
    href: '/intelligence',
  },
  {
    id: 'tm-02',
    slug: 'q3-2026-window-preview',
    title: 'Q3 2026 Transfer Window Preview: Five Stories to Watch',
    excerpt: 'From Serie A defensive restructuring to Bundesliga\'s push into South American markets — the narratives that will define this summer\'s business.',
    category: CAT.transferMarket,
    author: AUTHORS.transferDesk,
    publishedAt: 'May 2026',
    readTime: 12,
    status: 'available',
    tags: [T.window, T.valuation],
    trending: true,
    href: '/intelligence',
  },

  // ── Emerging Talents ──────────────────────────────────────────────────────
  {
    id: 'et-01',
    slug: 'u23-midfielders-secondary-markets',
    title: 'Five Under-23 Midfielders From Secondary Markets Poised for the Next Level',
    excerpt: 'Our scouting network identifies midfielders operating in secondary markets whose profile, age, and contract situation position them for an elite step within 12–18 months.',
    category: CAT.emergingTalents,
    author: AUTHORS.scoutingDesk,
    publishedAt: 'June 2026',
    readTime: 6,
    status: 'available',
    tags: [T.u23, T.midfielder],
    trending: true,
    href: '/intelligence',
  },
  {
    id: 'et-02',
    slug: 'african-football-next-wave',
    title: 'African Football\'s Next Wave: South American Clubs Are Watching Closely',
    excerpt: 'While European scouts concentrate on CAF tournaments, a number of South American clubs have quietly built systematic scouting pipelines across West and Central Africa.',
    category: CAT.emergingTalents,
    author: AUTHORS.scoutingDesk,
    publishedAt: 'May 2026',
    readTime: 9,
    status: 'available',
    tags: [T.africa, T.southAmerica, T.u23],
    href: '/intelligence',
  },

  // ── Football Business ─────────────────────────────────────────────────────
  {
    id: 'fb-01',
    slug: 'private-equity-ownership-landscape',
    title: 'The New Ownership Landscape: How Private Equity Is Reshaping Club Structure',
    excerpt: 'How institutional capital is changing recruitment mandates, wage structures, squad composition models, and long-term sporting strategy — and what it means for agents and clubs operating around these new owners.',
    category: CAT.footballBusiness,
    author: AUTHORS.polarisIntel,
    publishedAt: 'April 2026',
    readTime: 10,
    status: 'research',
    tags: [T.privateEquity, T.ownership],
    trending: true,
    href: '/intelligence',
  },
  {
    id: 'fb-02',
    slug: 'revenue-diversification-transfer-model',
    title: 'Revenue Diversification and the End of the Transfer-Dependent Model',
    excerpt: 'The clubs building structural financial resilience are doing so by decoupling growth from transfer fees — here\'s what that looks like from the inside.',
    category: CAT.footballBusiness,
    author: AUTHORS.dataTeam,
    publishedAt: 'March 2026',
    readTime: 8,
    status: 'research',
    tags: [T.ownership, T.data],
    href: '/intelligence',
  },

  // ── Club Intelligence ─────────────────────────────────────────────────────
  {
    id: 'ci-01',
    slug: 'brighton-data-model-inside',
    title: 'What Brighton\'s Data Model Actually Looks Like From the Inside',
    excerpt: 'Beyond the public narrative of "data-driven football" — the actual infrastructure, recruitment criteria, and decision-making process that makes Brighton\'s model function.',
    category: CAT.clubIntelligence,
    author: AUTHORS.dataTeam,
    publishedAt: 'June 2026',
    readTime: 9,
    status: 'beta',
    tags: [T.brighton, T.premierLeague, T.data],
    href: '/intelligence',
  },
  {
    id: 'ci-02',
    slug: 'gladbach-rebuild-direction',
    title: 'Mönchengladbach\'s Rebuild: From Identity Crisis to Clear Sporting Direction',
    excerpt: 'How Gladbach\'s leadership restructured their scouting network, changed their recruitment philosophy, and what profile of player they are now systematically targeting.',
    category: CAT.clubIntelligence,
    author: AUTHORS.scoutingDesk,
    publishedAt: 'May 2026',
    readTime: 11,
    status: 'beta',
    tags: [T.mandate],
    href: '/intelligence',
  },

  // ── Player Reports ────────────────────────────────────────────────────────
  {
    id: 'pr-01',
    slug: 'modern-false-nine-profile',
    title: 'Position Profile: The Modern False Nine in High-Press Systems',
    excerpt: 'The statistical and qualitative markers that define elite false nines in pressing-intensive systems — and how clubs are increasingly profiling for this position versus traditional striker metrics.',
    category: CAT.playerReports,
    author: AUTHORS.scoutingDesk,
    publishedAt: 'June 2026',
    readTime: 7,
    status: 'research',
    tags: [T.falsNine, T.pressing, T.data],
    trending: true,
    href: '/intelligence',
  },
  {
    id: 'pr-02',
    slug: 'contract-clauses-player-direction',
    title: 'Reading Between the Lines: What Contract Clauses Tell You About a Player\'s Direction',
    excerpt: 'Release clauses, performance bonuses, image rights structures, and notice periods — what these elements signal about a player\'s current relationship with their club.',
    category: CAT.playerReports,
    author: AUTHORS.transferDesk,
    publishedAt: 'April 2026',
    readTime: 6,
    status: 'research',
    tags: [T.contract, T.mandate],
    href: '/intelligence',
  },

  // ── Recruitment Reports ───────────────────────────────────────────────────
  {
    id: 'rr-01',
    slug: 'mandate-system-why-clubs-fail',
    title: 'The Mandate System: Why Most Clubs Never Find the Players They\'re Actually Looking For',
    excerpt: 'An investigation into how poor mandate construction — vague criteria, conflicting requirements, and absent decision-making frameworks — creates systemic failure in football recruitment.',
    category: CAT.recruitmentReports,
    author: AUTHORS.polarisIntel,
    publishedAt: 'May 2026',
    readTime: 12,
    status: 'development',
    tags: [T.mandate, T.data],
    href: '/intelligence',
  },
  {
    id: 'rr-02',
    slug: 'scouting-balkans-value-2026',
    title: 'Scouting in the Balkans: Where the Value Is Moving in 2026',
    excerpt: 'The Serbian SuperLiga, Croatian HNL, and Slovenian PrvaLiga are producing more export-ready profiles than at any point in the last decade — and pricing is still rational.',
    category: CAT.recruitmentReports,
    author: AUTHORS.scoutingDesk,
    publishedAt: 'April 2026',
    readTime: 8,
    status: 'development',
    tags: [T.balkans, T.valuation],
    href: '/intelligence',
  },

  // ── Tactical Analysis ─────────────────────────────────────────────────────
  {
    id: 'ta-01',
    slug: 'pressing-intensity-vs-triggers',
    title: 'Pressing Intensity vs. Pressing Triggers: The Distinction That Separates Good From Elite',
    excerpt: 'The most common scouting error when evaluating pressing systems is conflating how hard a team presses with when and why they press — a distinction that explains much of the performance variance between elite and near-elite squads.',
    category: CAT.tacticalAnalysis,
    author: AUTHORS.dataTeam,
    publishedAt: 'June 2026',
    readTime: 14,
    status: 'research',
    tags: [T.pressing, T.data],
    href: '/intelligence',
  },
  {
    id: 'ta-02',
    slug: 'set-piece-design-european',
    title: 'Set-Piece Design in European Football: From Routine to Competitive Weapon',
    excerpt: 'How elite coaching staffs have transformed set-piece preparation from repetitive practice to systematic opponent-specific design — and why most clubs still underinvest in this area.',
    category: CAT.tacticalAnalysis,
    author: AUTHORS.scoutingDesk,
    publishedAt: 'March 2026',
    readTime: 10,
    status: 'research',
    tags: [T.setPiece, T.data],
    href: '/intelligence',
  },

  // ── League Analysis ───────────────────────────────────────────────────────
  {
    id: 'la-01',
    slug: 'ligue1-after-psg',
    title: 'Ligue 1 After PSG: How the League Is Rebuilding Its Competitive Identity',
    excerpt: 'Without a dominant financial outlier at the summit, Ligue 1 is undergoing a genuine competitive rebalancing — and the talent pipeline that emerges will look different to the one French football has produced for two decades.',
    category: CAT.leagueAnalysis,
    author: AUTHORS.scoutingDesk,
    publishedAt: 'May 2026',
    readTime: 9,
    status: 'research',
    tags: [T.ligue1],
    href: '/intelligence',
  },
  {
    id: 'la-02',
    slug: 'swedish-model-allsvenskan',
    title: 'The Swedish Model: What Allsvenskan\'s Development Pipeline Does Differently',
    excerpt: 'Sweden consistently produces technically proficient, tactically literate players relative to population and investment. The structural reasons are more specific — and more replicable — than the generic "Swedish football culture" narrative suggests.',
    category: CAT.leagueAnalysis,
    author: AUTHORS.polarisIntel,
    publishedAt: 'April 2026',
    readTime: 7,
    status: 'research',
    tags: [T.allsvenskan, T.u23],
    href: '/intelligence',
  },

  // ── Free Agents ───────────────────────────────────────────────────────────
  {
    id: 'fa-01',
    slug: 'defenders-available-pre-window',
    title: 'The Post-Contract Market: Defenders Available Before the Window Closes',
    excerpt: 'A curated list of out-of-contract defenders by position, age, and last league — including market value estimates and known interest from licensed agents within the Polaris network.',
    category: CAT.freeAgents,
    author: AUTHORS.transferDesk,
    publishedAt: 'June 2026',
    readTime: 5,
    status: 'development',
    tags: [T.freeAgent, T.defender, T.contract],
    href: '/intelligence',
  },
  {
    id: 'fa-02',
    slug: 'midfield-free-agents-worth-scouting',
    title: 'Midfield Intelligence: Free Agents Worth Scouting Before the Window',
    excerpt: 'Six midfielders currently without clubs whose profile, age bracket, and physical state suggest they represent underpriced options for clubs operating in the lower half of the professional pyramid.',
    category: CAT.freeAgents,
    author: AUTHORS.scoutingDesk,
    publishedAt: 'June 2026',
    readTime: 6,
    status: 'development',
    tags: [T.freeAgent, T.midfielder, T.contract],
    href: '/intelligence',
  },
]

// ─── Derived views ────────────────────────────────────────────────────────────

export const featuredArticle   = ARTICLES.find(a => a.featured) ?? ARTICLES[0]
export const editorsPickArticle = ARTICLES.find(a => a.editorsPick) ?? ARTICLES[0]
export const trendingArticles  = ARTICLES.filter(a => a.trending)
export const latestArticles    = ARTICLES.slice(0, 6)

export function getByCategory(slug: string, limit?: number): Article[] {
  const results = ARTICLES.filter(a => a.category.slug === slug)
  return limit ? results.slice(0, limit) : results
}

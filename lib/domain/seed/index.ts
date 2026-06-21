import type {
  Country, Competition, Club, Organization,
  Agent, Player, Request, Contact, DomainReport,
} from '../types'

// ─── Countries ───────────────────────────────────────────────────────────────

export const COUNTRIES: Country[] = [
  { id: 'cnt-ma', name: 'Morocco',     code: 'MA', continent: 'Africa',        topLeagueId: 'cmp-botola' },
  { id: 'cnt-ar', name: 'Argentina',   code: 'AR', continent: 'South America', topLeagueId: 'cmp-ligapro' },
  { id: 'cnt-be', name: 'Belgium',     code: 'BE', continent: 'Europe',        topLeagueId: 'cmp-prolea' },
  { id: 'cnt-nl', name: 'Netherlands', code: 'NL', continent: 'Europe',        topLeagueId: 'cmp-eredivisie' },
  { id: 'cnt-es', name: 'Spain',       code: 'ES', continent: 'Europe',        topLeagueId: 'cmp-laliga' },
  { id: 'cnt-se', name: 'Sweden',      code: 'SE', continent: 'Europe',        topLeagueId: 'cmp-allsvenskan' },
  { id: 'cnt-sn', name: 'Senegal',     code: 'SN', continent: 'Africa',        },
]

// ─── Competitions ─────────────────────────────────────────────────────────────

export const COMPETITIONS: Competition[] = [
  {
    id: 'cmp-botola', name: 'Botola Pro D1', shortName: 'Botola Pro',
    countryId: 'cnt-ma', tier: 1, type: 'league',
    currentSeason: '2025/26', status: 'active', color: '#D97706',
  },
  {
    id: 'cmp-ligapro', name: 'Liga Profesional Argentina', shortName: 'Liga Prof.',
    countryId: 'cnt-ar', tier: 1, type: 'league',
    currentSeason: '2025', status: 'active', color: '#2563EB',
  },
  {
    id: 'cmp-prolea', name: 'Belgian Pro League', shortName: 'Pro League',
    countryId: 'cnt-be', tier: 2, type: 'league',
    currentSeason: '2025/26', status: 'active', color: '#DC2626',
  },
  {
    id: 'cmp-eredivisie', name: 'Eredivisie', shortName: 'Eredivisie',
    countryId: 'cnt-nl', tier: 2, type: 'league',
    currentSeason: '2025/26', status: 'active', color: '#F97316',
  },
  {
    id: 'cmp-laliga', name: 'La Liga', shortName: 'La Liga',
    countryId: 'cnt-es', tier: 1, type: 'league',
    currentSeason: '2025/26', status: 'active', color: '#7C3AED',
  },
  {
    id: 'cmp-allsvenskan', name: 'Allsvenskan', shortName: 'Allsvenskan',
    countryId: 'cnt-se', tier: 2, type: 'league',
    currentSeason: '2025', status: 'active', color: '#FBBF24',
  },
  {
    id: 'cmp-caf-cl', name: 'CAF Champions League', shortName: 'CAF CL',
    countryId: 'international', tier: 1, type: 'continental',
    currentSeason: '2025/26', status: 'active', color: '#059669',
  },
]

// ─── Organizations ────────────────────────────────────────────────────────────

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org-mediterr', name: 'Méditerranée Sports', shortName: 'MSM',
    type: 'agency', countryId: 'cnt-es',
    agentIds: ['agt-vidal'], clubIds: [], contactIds: [],
    status: 'active', createdAt: '2026-06-01', updatedAt: '2026-06-21',
  },
  {
    id: 'org-eurolink', name: 'EuroLink Football Network', shortName: 'ELFN',
    type: 'scouting-network', countryId: 'cnt-nl',
    agentIds: [], clubIds: [], contactIds: ['con-dewit'],
    status: 'active', createdAt: '2026-01-10', updatedAt: '2026-06-21',
  },
]

// ─── Clubs ────────────────────────────────────────────────────────────────────

export const CLUBS: Club[] = [
  {
    id: 'cl-wydad', name: 'Wydad Athletic Club', shortName: 'Wydad',
    countryId: 'cnt-ma', city: 'Casablanca',
    primaryCompetitionId: 'cmp-botola', tier: 1,
    recruitmentPhilosophy: {
      style: ['possession', 'technical'], formations: ['4-2-3-1', '4-3-3'],
      ageRange: { min: 18, max: 30 }, passportPreference: 'any',
    },
    contactIds: [], openRequestIds: [], organizationIds: [],
    status: 'active', createdAt: '2026-01-01', updatedAt: '2026-06-21',
  },
  {
    id: 'cl-tucuman', name: 'Club Atlético Tucumán', shortName: 'Tucumán',
    countryId: 'cnt-ar', city: 'Tucumán',
    primaryCompetitionId: 'cmp-ligapro', tier: 2,
    recruitmentPhilosophy: {
      style: ['physical', 'counter'], formations: ['4-4-2', '4-3-3'],
      ageRange: { min: 20, max: 32 }, passportPreference: 'any',
    },
    contactIds: [], openRequestIds: [], organizationIds: [],
    status: 'active', createdAt: '2026-01-01', updatedAt: '2026-06-21',
  },
  {
    id: 'cl-brugge', name: 'Club Brugge KV', shortName: 'Brugge',
    countryId: 'cnt-be', city: 'Bruges',
    primaryCompetitionId: 'cmp-prolea', tier: 2,
    recruitmentPhilosophy: {
      style: ['high-press', 'technical', 'possession'], formations: ['4-2-3-1'],
      ageRange: { min: 20, max: 27 }, passportPreference: 'EU',
      budgetTransfer: { amount: 3_000_000, currency: 'EUR' },
    },
    contactIds: ['con-vdb'], openRequestIds: ['req-brugge-cm'], organizationIds: [],
    status: 'active', createdAt: '2026-01-01', updatedAt: '2026-06-21',
  },
  {
    id: 'cl-ajax', name: 'AFC Ajax', shortName: 'Ajax',
    countryId: 'cnt-nl', city: 'Amsterdam',
    primaryCompetitionId: 'cmp-eredivisie', tier: 2,
    recruitmentPhilosophy: {
      style: ['possession', 'high-press', 'technical'], formations: ['4-3-3', '3-4-3'],
      ageRange: { min: 19, max: 26 }, passportPreference: 'any',
      budgetTransfer: { amount: 4_500_000, currency: 'EUR' },
    },
    contactIds: ['con-dewit'], openRequestIds: ['req-ajax-rb'], organizationIds: [],
    status: 'active', createdAt: '2026-01-01', updatedAt: '2026-06-21',
  },
  {
    id: 'cl-betis', name: 'Real Betis Balompié', shortName: 'Betis',
    countryId: 'cnt-es', city: 'Seville',
    primaryCompetitionId: 'cmp-laliga', tier: 1,
    recruitmentPhilosophy: {
      style: ['possession', 'technical', 'pressing'], formations: ['4-2-3-1', '4-3-3'],
      ageRange: { min: 22, max: 29 }, passportPreference: 'EU',
      budgetTransfer: { amount: 1_500_000, currency: 'EUR' },
    },
    contactIds: ['con-quesada'], openRequestIds: ['req-betis-cdm'], organizationIds: [],
    status: 'active', createdAt: '2026-01-01', updatedAt: '2026-06-21',
  },
]

// ─── Agents ───────────────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: 'agt-vidal', name: 'Carlos Vidal',
    company: 'Méditerranée Sports Management',
    organizationId: 'org-mediterr',
    countryId: 'cnt-es',
    playerIds: ['plr-benjdida'],
    licensed: true, licenseBody: 'FIFA',
    status: 'active', createdAt: '2026-01-15', updatedAt: '2026-06-21',
  },
  {
    id: 'agt-rodriguez', name: 'Martina Rodríguez',
    company: 'AR Sports Group',
    countryId: 'cnt-ar',
    playerIds: ['plr-may', 'plr-diallo'],
    licensed: true, licenseBody: 'AFA',
    status: 'active', createdAt: '2026-02-01', updatedAt: '2026-06-21',
  },
]

// ─── Players ──────────────────────────────────────────────────────────────────

export const PLAYERS: Player[] = [
  {
    id: 'plr-benjdida',
    firstName: 'Soufiane', lastName: 'Benjdida', name: 'Soufiane Benjdida',
    nationalityId: 'cnt-ma', nationality2Id: 'cnt-es',
    born: '2002-02-14', age: 24,
    height: '1.76 m', weight: '70 kg',
    preferredFoot: 'Left',
    position: 'CAM', positions: ['CAM', 'CM'], positionGroup: 'midfielder',
    currentClubId: 'cl-wydad',
    currentContract: { clubId: 'cl-wydad', startDate: '2023-07-01', endDate: '2026-06-30' },
    transferHistory: [],
    agentId: 'agt-vidal',
    marketValue: { amount: 280_000, currency: 'EUR' },
    status: 'free-agent',
    reportIds: ['rpt-pr001'],
    requestMatchIds: ['req-brugge-cm', 'req-ajax-rb'],
    tags: ['Free Agent 2026', 'Dual Passport', 'Technical', 'Progressive Carrier'],
    createdAt: '2026-06-01', updatedAt: '2026-06-21',
  },
  {
    id: 'plr-may',
    firstName: 'Guillermo', lastName: 'May', name: 'Guillermo May',
    nationalityId: 'cnt-ar',
    born: '1999-09-03', age: 26,
    height: '1.80 m', weight: '76 kg',
    preferredFoot: 'Right',
    position: 'RB', positions: ['RB', 'RM'], positionGroup: 'defender',
    currentClubId: 'cl-tucuman',
    currentContract: { clubId: 'cl-tucuman', startDate: '2024-01-01', endDate: '2026-12-31' },
    transferHistory: [],
    agentId: 'agt-rodriguez',
    marketValue: { amount: 350_000, currency: 'EUR' },
    status: 'active',
    reportIds: ['rpt-pr002'],
    requestMatchIds: ['req-ajax-rb'],
    tags: ['South America', 'Physical', 'Attacking Full-Back', 'Crossing'],
    createdAt: '2026-06-01', updatedAt: '2026-06-21',
  },
  {
    id: 'plr-andersson',
    firstName: 'Karl', lastName: 'Andersson', name: 'Karl Andersson',
    nationalityId: 'cnt-se',
    born: '2001-11-18', age: 24,
    height: '1.85 m', weight: '78 kg',
    preferredFoot: 'Right',
    position: 'CB', positions: ['CB', 'CDM'], positionGroup: 'defender',
    currentClubId: 'cl-brugge',
    currentContract: { clubId: 'cl-brugge', startDate: '2024-07-01', endDate: '2027-06-30' },
    transferHistory: [],
    agentId: undefined,
    marketValue: { amount: 2_200_000, currency: 'EUR' },
    status: 'active',
    reportIds: [], requestMatchIds: [],
    tags: ['EU Passport', 'Ball-Playing CB', 'Allsvenskan Background'],
    createdAt: '2026-04-10', updatedAt: '2026-06-21',
  },
  {
    id: 'plr-diallo',
    firstName: 'Oumar', lastName: 'Diallo', name: 'Oumar Diallo',
    nationalityId: 'cnt-sn',
    born: '2000-05-22', age: 26,
    height: '1.82 m', weight: '75 kg',
    preferredFoot: 'Left',
    position: 'LB', positions: ['LB', 'LWB', 'LW'], positionGroup: 'defender',
    currentClubId: undefined,
    currentContract: undefined,
    transferHistory: [],
    agentId: 'agt-rodriguez',
    marketValue: { amount: 180_000, currency: 'EUR' },
    status: 'free-agent',
    reportIds: [], requestMatchIds: [],
    tags: ['Free Agent', 'Africa', 'Physical', 'Left-Footed'],
    createdAt: '2026-05-15', updatedAt: '2026-06-21',
  },
]

// ─── Recruitment Requests ─────────────────────────────────────────────────────

export const REQUESTS: Request[] = [
  {
    id: 'req-brugge-cm',
    clubId: 'cl-brugge',
    title: 'Central Midfielder / Attacking Midfielder — Summer 2026',
    description: 'Technical profile for the 8/10 role in a high-press 4-2-3-1. EU passport required due to squad composition. Free agent or low-cost acquisition strongly preferred.',
    season: 'Summer 2026',
    positionRequirement: {
      positions: ['CM', 'CAM'], positionGroup: 'midfielder',
      minAge: 21, maxAge: 27, preferredFoot: 'Left',
    },
    budget: {
      transfer: { amount: 800_000, currency: 'EUR' },
      maxWage:  { amount: 12_000,  currency: 'EUR' },
    },
    requirements: {
      passportPreference: 'EU',
      style: ['technical', 'progressive'],
      maxMarketValue: { amount: 1_200_000, currency: 'EUR' },
    },
    deadline: '2026-07-31',
    priority: 'High',
    status: 'open',
    matchedPlayerIds: ['plr-benjdida'],
    shortlistedPlayerIds: ['plr-benjdida'],
    assignedTo: 'Polaris Scouting Desk',
    createdAt: '2026-05-01', updatedAt: '2026-06-21',
  },
  {
    id: 'req-ajax-rb',
    clubId: 'cl-ajax',
    title: 'Right Back / Wing-Back — Summer 2026',
    description: 'Attacking full-back who can function as a wing-back in a 3-4-3 shape. High physical output required, ability to cross at volume. South American market welcome.',
    season: 'Summer 2026',
    positionRequirement: {
      positions: ['RB', 'RWB', 'RM'], positionGroup: 'defender',
      minAge: 22, maxAge: 28, preferredFoot: 'Right',
    },
    budget: {
      transfer: { amount: 2_000_000, currency: 'EUR' },
      maxWage:  { amount: 18_000,  currency: 'EUR' },
    },
    requirements: {
      passportPreference: 'any',
      style: ['physical', 'attacking'],
      maxMarketValue: { amount: 2_500_000, currency: 'EUR' },
    },
    deadline: '2026-08-15',
    priority: 'Medium',
    status: 'matched',
    matchedPlayerIds: ['plr-may'],
    shortlistedPlayerIds: ['plr-may'],
    assignedTo: 'Polaris Scouting Desk',
    createdAt: '2026-04-20', updatedAt: '2026-06-21',
  },
  {
    id: 'req-betis-cdm',
    clubId: 'cl-betis',
    title: 'Holding Midfielder (Loan) — January 2027',
    description: 'Loan acquisition of a technically competent CDM to provide depth and rotation. Must hold an EU passport. Preferably from La Liga ecosystem for adaptation reasons.',
    season: 'January 2027',
    positionRequirement: {
      positions: ['CDM', 'CM'], positionGroup: 'midfielder',
      minAge: 22, maxAge: 29,
    },
    budget: {
      loan:    { amount: 150_000, currency: 'EUR' },
      maxWage: { amount: 22_000,  currency: 'EUR' },
    },
    requirements: {
      passportPreference: 'EU',
      style: ['technical', 'possession'],
    },
    deadline: '2027-01-31',
    priority: 'Low',
    status: 'open',
    matchedPlayerIds: [],
    shortlistedPlayerIds: [],
    createdAt: '2026-06-10', updatedAt: '2026-06-21',
  },
]

// ─── Contacts ─────────────────────────────────────────────────────────────────

export const CONTACTS: Contact[] = [
  {
    id: 'con-vdb', name: 'Marc Vandenberghe',
    role: 'Head of Recruitment',
    clubId: 'cl-brugge',
    countryId: 'cnt-be',
    relationshipStrength: 'medium',
    lastContactDate: '2026-05-14',
    notes: 'Met at Scouting Innovation conference in Brussels. Interested in African market profiles.',
    status: 'active', createdAt: '2026-03-01', updatedAt: '2026-06-21',
  },
  {
    id: 'con-dewit', name: 'Loes de Wit',
    role: 'Sporting Director',
    clubId: 'cl-ajax', organizationId: 'org-eurolink',
    countryId: 'cnt-nl',
    relationshipStrength: 'strong',
    lastContactDate: '2026-06-10',
    notes: 'Regular contact. Confirmed interest in Argentine market for physical profiles. Prefers direct approaches through Polaris.',
    status: 'active', createdAt: '2025-11-01', updatedAt: '2026-06-21',
  },
  {
    id: 'con-quesada', name: 'Andrés Quesada',
    role: 'Head of International Recruitment',
    clubId: 'cl-betis',
    countryId: 'cnt-es',
    relationshipStrength: 'weak',
    lastContactDate: '2026-02-18',
    notes: 'Initial introduction via shared network. Requires EU-passport profiles exclusively for squad registration reasons.',
    status: 'active', createdAt: '2026-02-01', updatedAt: '2026-06-21',
  },
  {
    id: 'con-vidal-agent', name: 'Carlos Vidal',
    role: 'Agent',
    agentId: 'agt-vidal',
    countryId: 'cnt-es',
    relationshipStrength: 'strong',
    lastContactDate: '2026-06-15',
    notes: 'Primary contact for Benjdida. Actively seeking European placement. Cooperative and responsive.',
    status: 'active', createdAt: '2026-04-01', updatedAt: '2026-06-21',
  },
]

// ─── Domain Reports (index entries — full content in content/players.json) ────

export const DOMAIN_REPORTS: DomainReport[] = [
  {
    id: 'rpt-pr001', slug: 'soufiane-benjdida', reportNumber: 'PR-001',
    type: 'player', subjectType: 'player', subjectId: 'plr-benjdida',
    title: 'Soufiane Benjdida — Player Scouting Report',
    analyst: 'Polaris Scouting Desk',
    publishedAt: 'June 2026', readTime: 9,
    status: 'available', confidentiality: 'Public',
    verdict: 'Recommended', priority: 'High',
    tags: ['Morocco', 'Botola Pro', 'CAM', 'Free Agent 2026', 'Dual Passport'],
    relatedReportIds: ['rpt-pr002'],
    href: '/reports/player/soufiane-benjdida',
  },
  {
    id: 'rpt-pr002', slug: 'guillermo-may', reportNumber: 'PR-002',
    type: 'player', subjectType: 'player', subjectId: 'plr-may',
    title: 'Guillermo May — Player Scouting Report',
    analyst: 'Polaris Scouting Desk',
    publishedAt: 'June 2026', readTime: 8,
    status: 'available', confidentiality: 'Public',
    verdict: 'Recommended', priority: 'Medium',
    tags: ['Argentina', 'Liga Profesional', 'Right Back', 'Physical'],
    relatedReportIds: ['rpt-pr001'],
    href: '/reports/player/guillermo-may',
  },
]

// ─── Registry (lookup maps) ───────────────────────────────────────────────────

export const SEED = {
  countries:    Object.fromEntries(COUNTRIES.map(c => [c.id, c])),
  competitions: Object.fromEntries(COMPETITIONS.map(c => [c.id, c])),
  clubs:        Object.fromEntries(CLUBS.map(c => [c.id, c])),
  organizations:Object.fromEntries(ORGANIZATIONS.map(o => [o.id, o])),
  agents:       Object.fromEntries(AGENTS.map(a => [a.id, a])),
  players:      Object.fromEntries(PLAYERS.map(p => [p.id, p])),
  requests:     Object.fromEntries(REQUESTS.map(r => [r.id, r])),
  contacts:     Object.fromEntries(CONTACTS.map(c => [c.id, c])),
  reports:      Object.fromEntries(DOMAIN_REPORTS.map(r => [r.id, r])),
}

export function getCountry(id: string)      { return SEED.countries[id] }
export function getCompetition(id: string)  { return SEED.competitions[id] }
export function getClub(id: string)         { return SEED.clubs[id] }
export function getOrganization(id: string) { return SEED.organizations[id] }
export function getAgent(id: string)        { return SEED.agents[id] }
export function getPlayer(id: string)       { return SEED.players[id] }
export function getRequest(id: string)      { return SEED.requests[id] }
export function getContact(id: string)      { return SEED.contacts[id] }
export function getDomainReport(id: string) { return SEED.reports[id] }

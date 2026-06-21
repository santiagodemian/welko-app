// The Intelligence Graph — defines every relationship between domain entities.
// This is the schema of the football intelligence network, not an ORM.

export type EntityType =
  | 'player'
  | 'club'
  | 'agent'
  | 'competition'
  | 'request'
  | 'report'
  | 'organization'
  | 'country'
  | 'contact'

export type Cardinality = '1:1' | '1:n' | 'n:1' | 'n:n'

export interface Edge {
  from:         EntityType
  to:           EntityType
  label:        string        // "plays for"
  inverseLabel: string        // "has player"
  cardinality:  Cardinality   // from the `from` entity's perspective
  description:  string
}

// ─── The full entity graph ───────────────────────────────────────────────────

export const ENTITY_GRAPH: Edge[] = [

  // ── Player edges ──────────────────────────────────────────────────────────
  {
    from: 'player', to: 'club',
    label: 'plays for', inverseLabel: 'has players',
    cardinality: 'n:1',
    description: 'A Player is contracted to one Club at a time; a Club can have many Players.',
  },
  {
    from: 'player', to: 'agent',
    label: 'represented by', inverseLabel: 'represents',
    cardinality: 'n:1',
    description: 'A Player is represented by one Agent; an Agent can represent many Players.',
  },
  {
    from: 'player', to: 'competition',
    label: 'competes in', inverseLabel: 'features player',
    cardinality: 'n:n',
    description: 'A Player competes in one or more Competitions through their Club.',
  },
  {
    from: 'player', to: 'report',
    label: 'covered by', inverseLabel: 'covers player',
    cardinality: '1:n',
    description: 'A Player may have one or many scouting Reports filed against their profile.',
  },
  {
    from: 'player', to: 'request',
    label: 'matches', inverseLabel: 'matched to player',
    cardinality: 'n:n',
    description: 'A Player can match multiple Club Requests — the core recruitment intelligence edge.',
  },
  {
    from: 'player', to: 'country',
    label: 'citizen of', inverseLabel: 'has citizens',
    cardinality: 'n:1',
    description: 'A Player holds one primary (and optionally dual) nationality.',
  },

  // ── Club edges ────────────────────────────────────────────────────────────
  {
    from: 'club', to: 'competition',
    label: 'competes in', inverseLabel: 'features club',
    cardinality: 'n:n',
    description: 'A Club participates in one or more Competitions per season.',
  },
  {
    from: 'club', to: 'request',
    label: 'has open mandate', inverseLabel: 'issued by club',
    cardinality: '1:n',
    description: 'A Club issues Requests (recruitment mandates); each Request belongs to one Club.',
  },
  {
    from: 'club', to: 'contact',
    label: 'has contact', inverseLabel: 'affiliated with club',
    cardinality: '1:n',
    description: 'A Club has one or more Contacts (sporting directors, scouts, executives).',
  },
  {
    from: 'club', to: 'country',
    label: 'based in', inverseLabel: 'home to clubs',
    cardinality: 'n:1',
    description: 'A Club is based in one Country.',
  },
  {
    from: 'club', to: 'organization',
    label: 'part of group', inverseLabel: 'owns club',
    cardinality: 'n:n',
    description: 'A Club may belong to a multi-club Organization (ownership group).',
  },

  // ── Agent edges ───────────────────────────────────────────────────────────
  {
    from: 'agent', to: 'player',
    label: 'manages', inverseLabel: 'managed by',
    cardinality: '1:n',
    description: 'An Agent manages one or more Players on their roster.',
  },
  {
    from: 'agent', to: 'organization',
    label: 'works at', inverseLabel: 'employs agent',
    cardinality: 'n:1',
    description: 'An Agent may be affiliated with an Agency Organization.',
  },
  {
    from: 'agent', to: 'country',
    label: 'based in', inverseLabel: 'home to agents',
    cardinality: 'n:1',
    description: 'An Agent is primarily based in one Country.',
  },

  // ── Organization edges ────────────────────────────────────────────────────
  {
    from: 'organization', to: 'club',
    label: 'owns', inverseLabel: 'owned by',
    cardinality: '1:n',
    description: 'An Organization (multi-club group) can own one or more Clubs.',
  },
  {
    from: 'organization', to: 'agent',
    label: 'employs', inverseLabel: 'employed by',
    cardinality: '1:n',
    description: 'An Organization (agency) employs one or more Agents.',
  },
  {
    from: 'organization', to: 'country',
    label: 'based in', inverseLabel: 'home to orgs',
    cardinality: 'n:1',
    description: 'An Organization is registered in one Country.',
  },

  // ── Competition edges ─────────────────────────────────────────────────────
  {
    from: 'competition', to: 'country',
    label: 'in', inverseLabel: 'hosts competition',
    cardinality: 'n:1',
    description: 'A Competition belongs to one Country (or is international).',
  },

  // ── Contact edges ─────────────────────────────────────────────────────────
  {
    from: 'contact', to: 'club',
    label: 'affiliated with', inverseLabel: 'has contact',
    cardinality: 'n:1',
    description: 'A Contact is affiliated with one Club or Organization.',
  },
  {
    from: 'contact', to: 'organization',
    label: 'affiliated with', inverseLabel: 'has contact',
    cardinality: 'n:1',
    description: 'A Contact may be affiliated with an Organization (agency, network, etc.).',
  },
]

// ─── Entity metadata ──────────────────────────────────────────────────────────

export interface EntityMeta {
  type:        EntityType
  label:       string
  plural:      string
  description: string
  color:       string
  outDegree:   number   // edges going out of this entity
}

export const ENTITY_META: Record<EntityType, EntityMeta> = {
  player:       { type: 'player',       label: 'Player',       plural: 'Players',       color: '#2563EB', outDegree: 6, description: 'The core subject of the intelligence graph. Every scouting activity originates here.' },
  club:         { type: 'club',         label: 'Club',         plural: 'Clubs',         color: '#059669', outDegree: 5, description: 'The demand side of the market. Issues recruitment mandates and employs contacts.' },
  agent:        { type: 'agent',        label: 'Agent',        plural: 'Agents',        color: '#7C3AED', outDegree: 3, description: 'Represents players and facilitates deals. Critical network node.' },
  competition:  { type: 'competition',  label: 'Competition',  plural: 'Competitions',  color: '#0891B2', outDegree: 1, description: 'League or tournament context that qualifies player and club data.' },
  request:      { type: 'request',      label: 'Request',      plural: 'Requests',      color: '#D97706', outDegree: 0, description: 'Recruitment mandates issued by clubs. The intelligence matching trigger.' },
  report:       { type: 'report',       label: 'Report',       plural: 'Reports',       color: '#DC2626', outDegree: 0, description: 'Scouting analysis products. The primary deliverable of the intelligence desk.' },
  organization: { type: 'organization', label: 'Organization', plural: 'Organizations', color: '#374151', outDegree: 3, description: 'Agencies, multi-club groups, and networks. The institutional layer.' },
  country:      { type: 'country',      label: 'Country',      plural: 'Countries',     color: '#B45309', outDegree: 0, description: 'Geographic and administrative context. Drives passport and league classification.' },
  contact:      { type: 'contact',      label: 'Contact',      plural: 'Contacts',      color: '#64748B', outDegree: 2, description: 'Decision-makers and intermediaries. The human network layer.' },
}

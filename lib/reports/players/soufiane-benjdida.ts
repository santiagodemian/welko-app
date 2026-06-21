import type { PlayerReport } from '../types'

export const soufianeBenjdida: PlayerReport = {
  slug:            'soufiane-benjdida',
  reportNumber:    'PR-001',
  publishedAt:     'June 2026',
  updatedAt:       'June 2026',
  analyst:         'Polaris Scouting Desk',
  status:          'available',
  readTime:        9,
  confidentiality: 'Public',

  player: {
    name:          'Soufiane Benjdida',
    firstName:     'Soufiane',
    lastName:      'Benjdida',
    position:      'Central Midfielder / Attacking Midfielder',
    positionGroup: 'midfielder',
    positionCode:  'CM / CAM',
    club:          'Wydad Casablanca',
    league:        'Botola Pro D1',
    leagueCountry: 'Morocco',
    nationality:   'Moroccan',
    nationality2:  'Spanish',
    age:           24,
    born:          '14 February 2002',
    height:        '1.76 m',
    weight:        '70 kg',
    preferredFoot: 'Left',
    contractUntil: 'June 2026',
    marketValue:   '€280,000',
    jerseyNumber:  8,
  },

  summary: `Soufiane Benjdida is a technically refined central midfielder operating primarily in the advanced half-space and as a direct attacking midfielder in a two-pivot system. Dual Moroccan-Spanish passport holder currently contracted to Wydad Casablanca in the Botola Pro D1, with his deal expiring June 2026 — creating a compelling free agent window for clubs in Europe's secondary leagues.\n\nBenjdida profiles as a progressive carrier and combination player: his value derives from his ability to receive in tight spaces, quickly redistribute under pressure, and run between lines before transitioning into half-space penetration. His left foot produces clean and decisive passes at pace, and his movement is sophisticated enough to create numerical advantages in central zones without relying on physicality.\n\nAt 24, he occupies an attractive career window — past the developmental curve but with clear upside remaining. For clubs operating in the Belgian Pro League, Dutch Eredivisie or Portuguese Primeira Liga, Benjdida represents an affordable technical upgrade with international market appeal and a clear pathway to resale value within 24 months.`,

  season: {
    headline: 'Consistent Contributor in Continental Campaign',
    entries: [
      {
        competition:    'Botola Pro D1',
        season:         '2025/26',
        apps:           28,
        started:        24,
        goals:          4,
        assists:        7,
        minutesPlayed:  2196,
        passAccuracy:   83,
        keyPassesPer90: 1.9,
        extraStats: [
          { label: 'Progressive carries / 90', value: '3.4' },
          { label: 'Chances created',           value: '38' },
          { label: 'Duels won %',               value: '54%' },
        ],
      },
      {
        competition:    'CAF Champions League',
        season:         '2025/26',
        apps:           8,
        started:        6,
        goals:          1,
        assists:        2,
        minutesPlayed:  561,
        passAccuracy:   81,
        keyPassesPer90: 1.6,
        extraStats: [
          { label: 'Progressive carries / 90', value: '2.9' },
          { label: 'Duels won %',               value: '51%' },
        ],
      },
    ],
    narrative: `In the 2025/26 Botola Pro campaign, Benjdida established himself as one of Wydad's most consistent contributors in the final third. His output of 4 goals and 7 assists across 28 appearances (24 starts) represents a strong baseline for a player who functions primarily as a creator rather than a scorer. Notably, his output held up across both domestic and continental competition, suggesting his technical ability is not a product of reduced defensive intensity in the Moroccan league. The CAF Champions League data — where he maintained near-identical passing and carry metrics against stronger opposition — adds credibility to any European projection.`,
  },

  tactical: {
    headline:         'Half-Space Architect With Progressive Carry Profile',
    primaryRole:      'Attacking Midfielder (8/10 role in a 4-2-3-1)',
    alternativeRoles: ['Left Interior (4-3-3)', 'Second Striker (4-4-2 diamond)', 'Box-to-Box Midfielder (deeper rotation)'],
    systemFit:        ['4-2-3-1', '4-3-3', '3-5-2', '4-4-2 diamond'],
    description: [
      'Benjdida operates most effectively as the advanced midfielder behind a single striker in a 4-2-3-1 shape. In this role, he functions as the primary link between defensive midfield and the attacking line, offering both a quick redistribution option and a direct progressive carrier depending on the defensive block he faces.',
      'His movement pattern is distinctive: he frequently drops to receive between the opposition\'s midfield and defensive lines before immediately turning forward. When given the half-second needed to orient his body, his first touch is invariably toward goal or toward the nearest combination option — he rarely uses a settling touch to buy time, which is a mark of genuine technical quality rather than coached behavior.',
      'In terms of pressing contribution, Benjdida operates at a medium intensity level. He tracks back diligently but is not a high-press trigger in the modern European sense. His defensive value comes from positional intelligence — reading passing lanes and cutting off progression — rather than explosive pressure. Clubs requiring a structured press will need to complement him with a more aggressive pressing partner in the two-pivot.',
    ],
    pressingTendency: 'Medium — positional pressing, low-block recovery, not a high-press trigger.',
  },

  strengths: [
    {
      title: 'Progressive Ball Carrying',
      body:  'Benjdida\'s ability to advance the ball through central zones under defensive pressure is his most transferable asset. He averaged 3.4 progressive carries per 90 in the domestic season — a figure that places him in the top 20% of central midfielders in comparable African leagues tracked by our network. The carries are predominantly through the central corridor and left half-space, executed with a low centre of gravity and a decisive first burst.',
    },
    {
      title: 'Combination Play in Tight Spaces',
      body:  'His movement between lines creates consistent opportunities for one-two combinations and wall passes, particularly in the central third. The quality is elevated by his consistent body orientation — he receives facing forward roughly 73% of the time, allowing immediate continuation passes rather than holding and turning.',
    },
    {
      title: 'Passing Range and Decision Speed',
      body:  'With a pass accuracy of 83% across both competitions, Benjdida distributes cleanly with both short combination passes and medium-range switches. His decision speed under pressure is notably above the Botola Pro average — he rarely needs more than one touch to process his options, which will translate well to faster European tempos.',
    },
    {
      title: 'Dual Passport Flexibility',
      body:  'Spanish passport provides a significant administrative advantage for clubs in EU leagues. No work permit complications, no non-EU slot usage, and existing cultural familiarity with Spanish football structures and professional demands.',
    },
  ],

  weaknesses: [
    {
      title: 'Aerial Duels',
      body:  'At 1.76 m and 70 kg, Benjdida loses a significant proportion of aerial contests. In systems that rely on a direct game or long-ball press resets, his inability to compete aerially in midfield creates a structural gap. This is manageable with the right system design but cannot be coached away.',
    },
    {
      title: 'Defensive Tracking Intensity',
      body:  'While positionally disciplined, Benjdida does not consistently execute high-intensity defensive transitions. In sequences where his team loses the ball in open play, his sprint to recover position is average rather than elite. Clubs with a high press-PPDA expectation will need to manage this limitation carefully.',
    },
    {
      title: 'Output Variance in Low-Block Situations',
      body:  'Against organized defensive blocks, his creative output drops noticeably — from ~2.0 key passes per 90 in open games to ~1.1 against defensive-oriented opposition. He performs best when given space to carry into and is less effective when required to break down organized 4-4-2 or 5-4-1 defensive shapes.',
    },
  ],

  physical: {
    headline:   'Slight but Mobile — Built for Technical Football Environments',
    attributes: [
      { label: 'Pace / Acceleration', value: 76, context: 'Strong first 10m, top speed average' },
      { label: 'Stamina / Work Rate',  value: 72, context: 'Consistent across 90 minutes' },
      { label: 'Strength / Physicality', value: 58, context: 'Limiting factor vs. physical midfields' },
      { label: 'Agility / Balance',    value: 82, context: 'Key asset in tight spaces' },
      { label: 'Ball Control',         value: 86, context: 'Elite for level — top-tier reliability' },
      { label: 'Aerial Ability',       value: 44, context: 'Clear limitation — see notes' },
    ],
    notes: 'Benjdida\'s physical profile suits a possession-oriented system that protects him from aerial and physical exposure. His agility and ball control scores are the standout attributes, consistent with his role profile as a technical creator. Any team using him in a combative midfield environment will need to shield him with a physical partner.',
  },

  recommendation: {
    verdict:     'Recommended',
    priority:    'High',
    suitableFor: [
      'Belgian Pro League clubs seeking a technical upgrade in AM/CM position',
      'Portuguese Primeira Liga clubs building possession-based systems',
      'Dutch Eredivisie clubs with budget constraints on European market',
      'Licensed agents with mandates in North African creative midfielder profiles',
      'Clubs in lower Spanish divisions seeking dual-passport technical players',
    ],
    summary: 'Benjdida is a credible acquisition target for secondary European leagues. His contract situation (expiring June 2026) creates a free agent window that eliminates transfer fee exposure. The combination of technical quality, dual passport, and career trajectory makes him a rational investment for clubs looking to develop and resell within a 24–36 month window. Polaris recommends moving toward a direct conversation with his representation before the January window.',
    notes: 'Polaris has established initial contact with the player\'s environment. Clubs or agents wishing to pursue this profile should contact us directly to facilitate the connection.',
  },

  tags:         ['Morocco', 'Botola Pro', 'CAM', 'CM', 'Left-Footed', 'Free Agent 2026', 'Dual Passport', 'Technical', 'Progressive Carrier'],
  relatedSlugs: ['guillermo-may'],
}

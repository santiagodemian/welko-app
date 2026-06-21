import type { PlayerReport } from '../types'

export const guillermoMay: PlayerReport = {
  slug:            'guillermo-may',
  reportNumber:    'PR-002',
  publishedAt:     'June 2026',
  updatedAt:       'June 2026',
  analyst:         'Polaris Scouting Desk',
  status:          'available',
  readTime:        8,
  confidentiality: 'Public',

  player: {
    name:          'Guillermo May',
    firstName:     'Guillermo',
    lastName:      'May',
    position:      'Right Back / Right Midfielder',
    positionGroup: 'defender',
    positionCode:  'RB / RM',
    club:          'Club Atlético Tucumán',
    league:        'Liga Profesional Argentina',
    leagueCountry: 'Argentina',
    nationality:   'Argentine',
    age:           26,
    born:          '3 September 1999',
    height:        '1.80 m',
    weight:        '76 kg',
    preferredFoot: 'Right',
    contractUntil: 'December 2026',
    marketValue:   '€350,000',
    jerseyNumber:  2,
  },

  summary: `Guillermo May is a dynamic right back with a strong attacking contribution profile, currently contracted to Club Atlético Tucumán in the Argentine Liga Profesional. At 26, May is entering his peak physical years and represents a well-structured profile for a lateral role in a European secondary league — combining defensive reliability, high work rate, and consistent offensive output along the right flank.\n\nMay is not a traditional defensive full-back. His game is built on power, recovery speed, and the ability to function as a wide attacking option in high defensive lines. He completes defensive duties competently but his true value is unlocked when the team builds with him acting as an overlapping outlet — his crossing quality and timing of runs into the box are notably above the Argentine average at his level.\n\nWith a contract expiring December 2026, May enters the second half of his deal and creates a plausible transfer window at a manageable cost. Clubs in Spain's Primera RFEF, Portugal's Liga 3, or Scandinavian leagues seeking an upgrade at the right back position would find May a competitive and physically ready candidate.`,

  season: {
    headline: 'High-Volume Output on the Right Flank — Domestic and Copa Argentina',
    entries: [
      {
        competition:    'Liga Profesional Argentina',
        season:         '2025',
        apps:           31,
        started:        29,
        goals:          2,
        assists:        5,
        minutesPlayed:  2614,
        passAccuracy:   79,
        keyPassesPer90: 0.9,
        extraStats: [
          { label: 'Crosses attempted / 90', value: '3.1' },
          { label: 'Crosses completed %',    value: '34%' },
          { label: 'Successful dribbles / 90', value: '1.4' },
          { label: 'Ground duels won %',     value: '61%' },
          { label: 'Aerial duels won %',     value: '58%' },
        ],
      },
      {
        competition:    'Copa Argentina',
        season:         '2025',
        apps:           5,
        started:        5,
        goals:          0,
        assists:        1,
        minutesPlayed:  450,
        passAccuracy:   77,
        extraStats: [
          { label: 'Ground duels won %', value: '63%' },
        ],
      },
    ],
    narrative: `May's 2025 Liga Profesional campaign was his most productive to date. Across 31 appearances — 29 as a starter — he contributed directly to 7 goals (2 scored, 5 assisted), a strong return for a right back at his level. His crossing volume of 3.1 per 90 with a 34% completion rate is consistent with European standards for the position. Crucially, his output showed no regression in the second half of the season, suggesting physical consistency over a full campaign — an important indicator when projecting adaptation to European league intensities.`,
  },

  tactical: {
    headline:         'Attacking Full-Back With Physicality and Defensive Competence',
    primaryRole:      'Right Back (Attacking — overlapping profile in a 4-2-3-1 or 4-3-3)',
    alternativeRoles: ['Right Midfielder (5-3-2 or 3-4-3 wing-back)', 'Right Mid in a flat 4-4-2'],
    systemFit:        ['4-2-3-1', '4-3-3', '3-4-3 (wing-back)', '4-4-2 flat'],
    description: [
      'May functions best in a back four with explicit license to attack. He understands the timing of overlap runs and does not advance indiscriminately — he reads the trigger points (wide striker dropping, central midfielder holding position) before initiating the run, which reduces positional exposure on transitions.',
      'In possession sequences, he is an effective first pass receiver from the goalkeeper or central defenders in build-up. His touch is reliable under low press but he can struggle with body orientation when pressed quickly — he defaults to a long ball rather than a composed short exit when under direct pressure, which is a coachable behavior but worth noting at higher levels.',
      'Defensively, May operates with correct compactness in a medium block. His acceleration over the first 10-15 meters is his primary defensive tool — recovery runs are fast and his ground duel win rate (61%) is above the Argentine league average for the position. He will need to adapt to shorter defensive distances and higher pressing intensities in European football, but his physical capacity suggests this is a manageable transition.',
    ],
    pressingTendency: 'Medium-High — proactive in the wide channel, good at cutting inside passing lanes along the flank.',
  },

  strengths: [
    {
      title: 'Physical Profile and Recovery Speed',
      body:  'May\'s most translatable asset is his athleticism. His recovery pace is the primary reason he can operate with the attacking license his coaches give him — when caught high, he closes the gap quickly and consistently wins defensive situations on recovery. His ground duel rate (61%) and aerial win rate (58%) suggest he competes effectively across both categories.',
    },
    {
      title: 'Crossing Volume and Delivery',
      body:  'With 3.1 crosses per 90, May provides a consistent wide supply option. Completion at 34% is sustainable for a player at this volume — the balls that don\'t connect are typically ambitious early crosses rather than miscalculations in technique. When the team is in position for his overlap run to mature, his final delivery quality is competitive with European secondary league standards.',
    },
    {
      title: 'Duel Competitiveness — Ground and Aerial',
      body:  'Winning over 60% of ground duels as an attacking full-back is a significant positive indicator. May is not timid in contact situations, which is uncommon for players with his attacking profile. This makes him viable in physical leagues where full-backs are regularly targeted as transitional vulnerabilities.',
    },
    {
      title: 'Work Rate and Full-Season Consistency',
      body:  'Playing 2,614 minutes across a compact Argentine league season with no significant dip in performance indicators is a reliable signal of physical durability. He has the capacity to handle a European calendar with proper management.',
    },
  ],

  weaknesses: [
    {
      title: 'Composure Under Direct Press in Build-Up',
      body:  'When pressed directly in his defensive third with limited time, May tends to default to a long ball or a rushed lateral pass rather than executing a composed short exit. In European leagues that apply a structured high press, this will be targeted. A coaching program focused on his body orientation and press-reading in build-up is advisable.',
    },
    {
      title: 'Crossing Decision-Making — Volume Over Selectivity',
      body:  'May\'s crossing volume (3.1/90) is productive but occasionally reflects decision-making based on opportunity rather than advantage. He sometimes delivers early when a half-yard of additional progress would create a better crossing angle or cutback option. In better-organized European defenses, this margin matters.',
    },
    {
      title: 'Positioning in High Defensive Lines',
      body:  'Argentine football tends to use a deeper defensive block than is standard in European technical leagues. May\'s experience in a high line is limited relative to what clubs in Belgium, Portugal, or Spain would require. His positional instincts will need calibrating during the early months of any European adaptation.',
    },
  ],

  physical: {
    headline:   'Physical Peak — Power and Acceleration Drive His Entire Game',
    attributes: [
      { label: 'Pace / Acceleration',    value: 84, context: 'Strong in both initial burst and sustained speed' },
      { label: 'Stamina / Work Rate',    value: 86, context: 'Full-season durability confirmed across 2,614 min' },
      { label: 'Strength / Physicality', value: 79, context: 'Wins physical duels consistently' },
      { label: 'Agility / Balance',      value: 71, context: 'Functional — not the primary asset' },
      { label: 'Aerial Ability',         value: 76, context: '58% aerial duel rate — competitive for a full-back' },
      { label: 'Ball Control',           value: 68, context: 'Solid, not elite — deteriorates under direct pressure' },
    ],
    notes: 'May\'s physical ceiling is his primary differentiator. Pace, stamina, and ground strength are all above the expected profile for a European secondary league right back. The technical attributes are sufficient but not exceptional — his value case rests on the physical foundation supporting a relentless attacking contribution.',
  },

  recommendation: {
    verdict:     'Recommended',
    priority:    'Medium',
    suitableFor: [
      'Spanish Primera RFEF or Segunda División clubs rebuilding defensive width',
      'Scandinavian clubs (Allsvenskan, Eliteserien) seeking physical right back upgrade',
      'Portuguese Liga 3 clubs with ambitions to Segunda Liga',
      'Agents with mandates for attacking full-back profiles in secondary European markets',
      'Clubs operating a high back four who need physicality behind the attacking right option',
    ],
    summary: 'Guillermo May is a viable European transfer for clubs in secondary leagues with the budget ceiling to work within Argentine market pricing. His physical profile transfers well, his attacking output is consistent, and his contract situation allows for a structured approach. Polaris rates him Medium priority — below free agent profiles in terms of financial efficiency, but above speculative prospects in terms of certainty of output.',
    notes: 'Polaris recommends a follow-up report focusing on his adaptation to high-press defensive shapes ahead of any formal approach. Contact us to access the expanded version of this report (Restricted).',
  },

  tags:         ['Argentina', 'Liga Profesional', 'Right Back', 'Wing-Back', 'Physical', 'Attacking Full-Back', 'Crossing', 'South America'],
  relatedSlugs: ['soufiane-benjdida'],
}

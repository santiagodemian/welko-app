import type { ID, DateString } from './shared'
import type { Status } from '@/components/ui/StatusBadge'

export type ReportType          = 'player' | 'club' | 'league' | 'market' | 'recruitment' | 'tactical'
export type ReportVerdict       = 'Recommended' | 'Monitor' | 'Under Review' | 'Not Recommended'
export type ReportPriority      = 'High' | 'Medium' | 'Low'
export type ReportConfidentiality = 'Public' | 'Restricted' | 'Private'

// DomainReport is the index entry for any report.
// Full content is in lib/reports/types.ts (PlayerReport) or future equivalents.
export interface DomainReport {
  id:           ID
  slug:         string
  reportNumber: string      // "PR-001"
  type:         ReportType

  subjectType: 'player' | 'club' | 'league' | 'market'
  subjectId?:  ID           // Player / Club / Competition ID

  title:       string
  analyst:     string
  publishedAt: DateString
  revisedAt?:  DateString
  readTime:    number

  status:          Status
  confidentiality: ReportConfidentiality

  verdict?:  ReportVerdict
  priority?: ReportPriority

  tags:           string[]
  relatedReportIds: ID[]

  href: string              // URL to the full rendered report
}

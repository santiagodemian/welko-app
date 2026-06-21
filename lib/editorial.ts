import type { Status } from '@/components/ui/StatusBadge'

export type { Status }

export interface Author {
  name: string
  role: string
  initials: string
}

export interface Category {
  name: string
  slug: string
  color: string
}

export interface Tag {
  label: string
  slug: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  category: Category
  author: Author
  publishedAt: string
  readTime: number
  status: Status
  tags: Tag[]
  featured?: boolean
  trending?: boolean
  editorsPick?: boolean
  href: string
}

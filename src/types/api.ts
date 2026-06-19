export interface ServiceDoc {
  _id: string
  slug: string
  title: string
  description: string
  price: string
  features: string[]
  badge?: string
  sortOrder: number
}

export interface ReviewDoc {
  _id: string
  name: string
  role: string
  text: string
  rating: number
  date: string
  sortOrder: number
}

export interface NavItemDoc {
  _id: string
  path: string
  label: string
  icon: string
  sortOrder: number
}

export interface CmsBlockDoc {
  _id: string
  page: string
  key: string
  type: string
  value: string
  imageUrl?: string | null
  videoUrl?: string | null
  meta?: {
    href?: string
    videoUrl?: string
    slot?: string
    align?: string
  }
  sortOrder: number
}

export interface ProfileMe {
  profile: {
    _id: string
    userId: string
    name: string
    email?: string
    avatarUrl?: string
    isGuest: boolean
    isAdmin?: boolean
  }
  orders: Array<{
    _id: string
    project: string
    status: 'done' | 'in_progress' | 'pending'
    dueDate?: string
    sortOrder: number
  }>
  stats: {
    total: number
    active: number
    completed: number
  }
  avatarUrl: string | null
  isGuest: boolean
  isAdmin: boolean
}

export type ThemeColors = Record<string, string>

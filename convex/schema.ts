import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,

  userProfiles: defineTable({
    userId: v.id('users'),
    name: v.string(),
    email: v.optional(v.string()),
    avatarStorageId: v.optional(v.id('_storage')),
    isGuest: v.boolean(),
    isAdmin: v.optional(v.boolean()),
  }).index('by_userId', ['userId']),

  cmsBlocks: defineTable({
    page: v.string(),
    key: v.string(),
    type: v.union(
      v.literal('text'),
      v.literal('image'),
      v.literal('button'),
      v.literal('video'),
    ),
    value: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    videoStorageId: v.optional(v.id('_storage')),
    meta: v.optional(
      v.object({
        href: v.optional(v.string()),
        videoUrl: v.optional(v.string()),
        slot: v.optional(v.string()),
        align: v.optional(v.union(v.literal('left'), v.literal('center'), v.literal('right'))),
      }),
    ),
    sortOrder: v.number(),
  })
    .index('by_page_key', ['page', 'key'])
    .index('by_page', ['page', 'sortOrder']),

  siteTheme: defineTable({
    key: v.literal('default'),
    colors: v.record(v.string(), v.string()),
  }).index('by_key', ['key']),

  services: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    price: v.string(),
    features: v.array(v.string()),
    badge: v.optional(v.string()),
    sortOrder: v.number(),
  }).index('by_sortOrder', ['sortOrder']),

  reviews: defineTable({
    name: v.string(),
    role: v.string(),
    text: v.string(),
    rating: v.number(),
    date: v.string(),
    sortOrder: v.number(),
  }).index('by_sortOrder', ['sortOrder']),

  orders: defineTable({
    userId: v.id('users'),
    project: v.string(),
    status: v.union(v.literal('done'), v.literal('in_progress'), v.literal('pending')),
    dueDate: v.optional(v.string()),
    sortOrder: v.number(),
  }).index('by_user', ['userId', 'sortOrder']),

  navItems: defineTable({
    path: v.string(),
    label: v.string(),
    icon: v.string(),
    sortOrder: v.number(),
  }).index('by_sortOrder', ['sortOrder']),
})

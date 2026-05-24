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
  }).index('by_userId', ['userId']),

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
})

import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/requireAdmin'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('reviews').withIndex('by_sortOrder').collect()
  },
})

export const averageRating = query({
  args: {},
  handler: async (ctx) => {
    const reviews = await ctx.db.query('reviews').collect()
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    text: v.string(),
    rating: v.number(),
    date: v.string(),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const maxOrder = await ctx.db.query('reviews').withIndex('by_sortOrder').order('desc').first()
    return await ctx.db.insert('reviews', {
      ...args,
      sortOrder: args.sortOrder ?? (maxOrder?.sortOrder ?? -1) + 1,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('reviews'),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    text: v.optional(v.string()),
    rating: v.optional(v.number()),
    date: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx)
    const patch: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) patch[k] = val
    }
    await ctx.db.patch(id, patch)
  },
})

export const remove = mutation({
  args: { id: v.id('reviews') },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)
    await ctx.db.delete(id)
  },
})

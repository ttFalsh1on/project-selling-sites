import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/requireAdmin'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('navItems').withIndex('by_sortOrder').collect()
  },
})

export const create = mutation({
  args: {
    path: v.string(),
    label: v.string(),
    icon: v.string(),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const maxOrder = await ctx.db.query('navItems').withIndex('by_sortOrder').order('desc').first()
    return await ctx.db.insert('navItems', {
      ...args,
      sortOrder: args.sortOrder ?? (maxOrder?.sortOrder ?? -1) + 1,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('navItems'),
    path: v.optional(v.string()),
    label: v.optional(v.string()),
    icon: v.optional(v.string()),
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
  args: { id: v.id('navItems') },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)
    const all = await ctx.db.query('navItems').collect()
    if (all.length <= 1) throw new Error('Нельзя удалить последний пункт меню')
    await ctx.db.delete(id)
  },
})

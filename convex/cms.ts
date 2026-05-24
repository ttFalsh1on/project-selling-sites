import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/requireAdmin'

export const listByPage = query({
  args: { page: v.string() },
  handler: async (ctx, { page }) => {
    const blocks = await ctx.db
      .query('cmsBlocks')
      .withIndex('by_page', (q) => q.eq('page', page))
      .collect()

    return Promise.all(
      blocks.map(async (block) => ({
        ...block,
        imageUrl: block.imageStorageId ? await ctx.storage.getUrl(block.imageStorageId) : null,
      })),
    )
  },
})

export const upsert = mutation({
  args: {
    page: v.string(),
    key: v.string(),
    type: v.union(v.literal('text'), v.literal('image'), v.literal('button')),
    value: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    meta: v.optional(v.object({ href: v.optional(v.string()) })),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const existing = await ctx.db
      .query('cmsBlocks')
      .withIndex('by_page_key', (q) => q.eq('page', args.page).eq('key', args.key))
      .unique()

    if (existing) {
      if (args.imageStorageId && existing.imageStorageId && args.imageStorageId !== existing.imageStorageId) {
        await ctx.storage.delete(existing.imageStorageId)
      }
      await ctx.db.patch(existing._id, {
        type: args.type,
        value: args.value,
        imageStorageId: args.imageStorageId,
        meta: args.meta,
        sortOrder: args.sortOrder ?? existing.sortOrder,
      })
      return existing._id
    }

    return await ctx.db.insert('cmsBlocks', {
      page: args.page,
      key: args.key,
      type: args.type,
      value: args.value,
      imageStorageId: args.imageStorageId,
      meta: args.meta,
      sortOrder: args.sortOrder ?? 0,
    })
  },
})

export const remove = mutation({
  args: { page: v.string(), key: v.string() },
  handler: async (ctx, { page, key }) => {
    await requireAdmin(ctx)

    const existing = await ctx.db
      .query('cmsBlocks')
      .withIndex('by_page_key', (q) => q.eq('page', page).eq('key', key))
      .unique()

    if (!existing) return

    if (existing.imageStorageId) {
      await ctx.storage.delete(existing.imageStorageId)
    }
    await ctx.db.delete(existing._id)
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return await ctx.storage.generateUploadUrl()
  },
})

import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import type { Id } from './_generated/dataModel'
import type { QueryCtx } from './_generated/server'
import { requireAdmin } from './lib/requireAdmin'

const blockType = v.union(
  v.literal('text'),
  v.literal('image'),
  v.literal('button'),
  v.literal('video'),
)

const blockMeta = v.optional(
  v.object({
    href: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    slot: v.optional(v.string()),
    align: v.optional(v.union(v.literal('left'), v.literal('center'), v.literal('right'))),
  }),
)

async function enrichBlock(
  ctx: QueryCtx,
  block: {
    _id: string
    page: string
    key: string
    type: 'text' | 'image' | 'button' | 'video'
    value: string
    sortOrder: number
    imageStorageId?: Id<'_storage'>
    videoStorageId?: Id<'_storage'>
    meta?: {
      href?: string
      videoUrl?: string
      slot?: string
      align?: 'left' | 'center' | 'right'
    }
  },
) {
  return {
    ...block,
    imageUrl: block.imageStorageId ? await ctx.storage.getUrl(block.imageStorageId) : null,
    videoUrl: block.videoStorageId
      ? await ctx.storage.getUrl(block.videoStorageId)
      : (block.meta?.videoUrl ?? null),
  }
}

export const listByPage = query({
  args: { page: v.string() },
  handler: async (ctx, { page }) => {
    const blocks = await ctx.db
      .query('cmsBlocks')
      .withIndex('by_page', (q) => q.eq('page', page))
      .collect()

    return Promise.all(blocks.map((block) => enrichBlock(ctx, block)))
  },
})

export const upsert = mutation({
  args: {
    page: v.string(),
    key: v.string(),
    type: blockType,
    value: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    videoStorageId: v.optional(v.id('_storage')),
    meta: blockMeta,
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
      if (args.videoStorageId && existing.videoStorageId && args.videoStorageId !== existing.videoStorageId) {
        await ctx.storage.delete(existing.videoStorageId)
      }
      await ctx.db.patch(existing._id, {
        type: args.type,
        value: args.value,
        imageStorageId: args.imageStorageId,
        videoStorageId: args.videoStorageId,
        meta: args.meta,
        sortOrder: args.sortOrder ?? existing.sortOrder,
      })
      return existing._id
    }

    const pageBlocks = await ctx.db
      .query('cmsBlocks')
      .withIndex('by_page', (q) => q.eq('page', args.page))
      .collect()
    const maxOrder = pageBlocks.reduce((max, b) => Math.max(max, b.sortOrder), -1)

    return await ctx.db.insert('cmsBlocks', {
      page: args.page,
      key: args.key,
      type: args.type,
      value: args.value,
      imageStorageId: args.imageStorageId,
      videoStorageId: args.videoStorageId,
      meta: args.meta,
      sortOrder: args.sortOrder ?? maxOrder + 1,
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
    if (existing.videoStorageId) {
      await ctx.storage.delete(existing.videoStorageId)
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

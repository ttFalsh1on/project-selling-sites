import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { mutation, query, type MutationCtx, type QueryCtx } from './_generated/server'

async function getProfileByUserId(ctx: QueryCtx | MutationCtx, userId: Id<'users'>) {
  return await ctx.db
    .query('userProfiles')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .unique()
}

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const profile = await getProfileByUserId(ctx, userId)
    if (!profile) return null

    const orders = await ctx.db
      .query('orders')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    const avatarUrl = profile.avatarStorageId
      ? await ctx.storage.getUrl(profile.avatarStorageId)
      : null

    const stats = {
      total: orders.length,
      active: orders.filter((order) => order.status === 'in_progress').length,
      completed: orders.filter((order) => order.status === 'done').length,
    }

    return {
      profile,
      orders,
      stats,
      avatarUrl,
      isGuest: profile.isGuest,
    }
  },
})

export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Не авторизован')

    const user = await ctx.db.get(userId)
    const isGuest = user?.isAnonymous ?? true

    const existing = await getProfileByUserId(ctx, userId)
    if (existing) {
      if (!isGuest && existing.isGuest) {
        await ctx.db.patch(existing._id, {
          isGuest: false,
          email: user?.email ?? existing.email,
        })
      }
      return existing._id
    }

    return await ctx.db.insert('userProfiles', {
      userId,
      name: isGuest ? 'Гость SiteForge' : 'Пользователь SiteForge',
      email: user?.email,
      isGuest,
    })
  },
})

export const completeRegistration = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { name, email }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Не авторизован')

    const profile = await getProfileByUserId(ctx, userId)
    if (!profile) throw new Error('Профиль не найден')

    await ctx.db.patch(profile._id, {
      name: name.trim(),
      email: email.trim(),
      isGuest: false,
    })

    return profile._id
  },
})

export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Не авторизован')

    const profile = await getProfileByUserId(ctx, userId)
    if (!profile) throw new Error('Профиль не найден')

    await ctx.db.patch(profile._id, { name: name.trim() })
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Не авторизован')
    return await ctx.storage.generateUploadUrl()
  },
})

export const saveAvatar = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, { storageId }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Не авторизован')

    const profile = await getProfileByUserId(ctx, userId)
    if (!profile) throw new Error('Профиль не найден')

    if (profile.avatarStorageId) {
      await ctx.storage.delete(profile.avatarStorageId)
    }

    await ctx.db.patch(profile._id, { avatarStorageId: storageId })
    return await ctx.storage.getUrl(storageId)
  },
})

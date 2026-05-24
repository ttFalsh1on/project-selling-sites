import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireAdmin } from './lib/requireAdmin'

export const promoteToAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const callerId = await getAuthUserId(ctx)
    const callerProfile = callerId
      ? await ctx.db
          .query('userProfiles')
          .withIndex('by_userId', (q) => q.eq('userId', callerId))
          .unique()
      : null

    const existingAdmins = await ctx.db
      .query('userProfiles')
      .filter((q) => q.eq(q.field('isAdmin'), true))
      .first()

    if (existingAdmins && !callerProfile?.isAdmin) {
      throw new Error('Только администратор может назначать других админов')
    }

    const normalizedEmail = email.trim().toLowerCase()

    const profiles = await ctx.db.query('userProfiles').collect()
    const profileByEmail = profiles.find((p) => p.email?.toLowerCase() === normalizedEmail)

    if (profileByEmail) {
      await ctx.db.patch(profileByEmail._id, { isAdmin: true, isGuest: false })
      return { success: true, userId: profileByEmail.userId }
    }

    const users = await ctx.db.query('users').collect()
    const targetUser = users.find((u) => u.email?.toLowerCase() === normalizedEmail)
    if (!targetUser) {
      throw new Error('Пользователь с таким email не найден. Сначала зарегистрируйтесь на сайте.')
    }

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', targetUser._id))
      .unique()

    if (!profile) throw new Error('Профиль пользователя не найден')

    await ctx.db.patch(profile._id, { isAdmin: true, isGuest: false })
    return { success: true, userId: targetUser._id }
  },
})

export const isCurrentUserAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return false

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique()

    return profile?.isAdmin ?? false
  },
})

export const requireAdminCheck = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdmin(ctx)
      return true
    } catch {
      return false
    }
  },
})

import { query } from './_generated/server'

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

export const flexUrl = import.meta.env.VITE_FLEX_URL as string | undefined

if (!flexUrl) {
  throw new Error(
    'VITE_FLEX_URL не задан. Добавьте переменную в Vercel или в .env.local (например http://localhost:3210).',
  )
}

export const FLEX_TOKEN_KEY = 'siteforge_flex_token'

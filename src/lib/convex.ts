import { ConvexReactClient } from 'convex/react'

const convexUrl = import.meta.env.VITE_CONVEX_URL

if (!convexUrl) {
  throw new Error(
    'VITE_CONVEX_URL не задан. Добавьте переменную в Vercel (Settings → Environment Variables) или в .env.local для локальной разработки.',
  )
}

export { convexUrl }

export const convex = new ConvexReactClient(convexUrl)

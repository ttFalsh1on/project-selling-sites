const configuredFlexUrl = import.meta.env.VITE_FLEX_URL as string | undefined
const configuredProjectId = import.meta.env.VITE_FLEX_PROJECT_ID as string | undefined

if (!configuredFlexUrl || !configuredProjectId) {
  throw new Error(
    'Задайте VITE_FLEX_URL и VITE_FLEX_PROJECT_ID в .env.local.',
  )
}

export const flexUrl: string = configuredFlexUrl
export const flexProjectId: string = configuredProjectId

export const FLEX_TOKEN_KEY = 'siteforge_flex_token'

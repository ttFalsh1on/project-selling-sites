export const userProfile = {
  name: 'Клиент SiteForge',
  email: 'client@siteforge.ru',
} as const

export function getInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return '?'

  const spaceIndex = trimmed.indexOf(' ')
  if (spaceIndex === -1) {
    return trimmed.charAt(0).toUpperCase()
  }

  const firstWord = trimmed.slice(0, spaceIndex)
  const secondWord = trimmed.slice(spaceIndex + 1).trim()

  if (!secondWord) {
    return firstWord.charAt(0).toUpperCase()
  }

  return (firstWord.charAt(0) + secondWord.charAt(0)).toUpperCase()
}

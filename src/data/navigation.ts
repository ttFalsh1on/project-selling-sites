export const mainNavItems = [
  { path: '/', label: 'Главная', icon: '🏠' },
  { path: '/services', label: 'Услуги', icon: '⚡' },
  { path: '/reviews', label: 'Отзывы', icon: '💬' },
] as const

export const profilePath = '/profile' as const

export const navItems = [...mainNavItems, { path: profilePath, label: 'Профиль', icon: '👤' }] as const

export const pageTitles: Record<string, string> = {
  '/': 'Главная',
  '/services': 'Услуги',
  '/reviews': 'Отзывы',
  '/profile': 'Профиль',
}

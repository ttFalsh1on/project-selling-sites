export const THEME_COLOR_KEYS = {
  cyberBg: '--color-cyber-bg',
  cyberCyan: '--color-cyber-cyan',
  cyberMagenta: '--color-cyber-magenta',
  cyberGreen: '--color-cyber-green',
  cyberPurple: '--color-cyber-purple',
  accentPurple: '--color-accent-purple',
  accentPurpleHover: '--color-accent-purple-hover',
  accentTeal: '--color-accent-teal',
  glassBg: '--color-glass-bg',
  glassBorder: '--color-glass-border',
  glassHover: '--color-glass-hover',
  sidebar: '--color-sidebar',
  sidebarHover: '--color-sidebar-hover',
  sidebarActive: '--color-sidebar-active',
} as const

export type ThemeColorKey = keyof typeof THEME_COLOR_KEYS

export const THEME_COLOR_LABELS: Record<ThemeColorKey, string> = {
  cyberBg: 'Фон сайта',
  cyberCyan: 'Неон cyan',
  cyberMagenta: 'Неон magenta',
  cyberGreen: 'Неон green',
  cyberPurple: 'Фиолетовый фон',
  accentPurple: 'Кнопки (фиолетовый)',
  accentPurpleHover: 'Кнопки при наведении',
  accentTeal: 'Акцент teal',
  glassBg: 'Стекло (фон)',
  glassBorder: 'Стекло (рамка)',
  glassHover: 'Стекло (hover)',
  sidebar: 'Сайдбар',
  sidebarHover: 'Сайдбар hover',
  sidebarActive: 'Сайдбар active',
}

export const DEFAULT_THEME_COLORS: Record<ThemeColorKey, string> = {
  cyberBg: '#0a0a0a',
  cyberCyan: '#00ffff',
  cyberMagenta: '#ff00ff',
  cyberGreen: '#39ff14',
  cyberPurple: '#1a0033',
  accentPurple: '#bb86fc',
  accentPurpleHover: '#cfa9ff',
  accentTeal: '#03dac6',
  glassBg: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassHover: 'rgba(255, 255, 255, 0.18)',
  sidebar: '#1a1a2e',
  sidebarHover: '#252547',
  sidebarActive: '#4361ee',
}

export type CmsSlotId =
  | 'page-end'
  | 'hero-after'
  | 'stats-after'
  | 'services-after'
  | 'review-after'
  | 'header-after'
  | 'list-after'

export const CMS_SLOTS: Record<string, { id: CmsSlotId; label: string }[]> = {
  home: [
    { id: 'hero-after', label: 'После главного баннера' },
    { id: 'stats-after', label: 'После статистики' },
    { id: 'services-after', label: 'После услуг' },
    { id: 'review-after', label: 'После отзыва' },
    { id: 'page-end', label: 'В конце страницы' },
  ],
  services: [
    { id: 'header-after', label: 'После заголовка' },
    { id: 'list-after', label: 'После списка услуг' },
    { id: 'page-end', label: 'В конце страницы' },
  ],
  reviews: [
    { id: 'header-after', label: 'После заголовка' },
    { id: 'list-after', label: 'После списка отзывов' },
    { id: 'page-end', label: 'В конце страницы' },
  ],
}

export function getCmsSlots(page: string): { id: CmsSlotId; label: string }[] {
  if (page.startsWith('p.')) {
    return [
      { id: 'header-after', label: 'После заголовка' },
      { id: 'page-end', label: 'В конце страницы' },
    ]
  }
  return CMS_SLOTS[page] ?? CMS_SLOTS.home
}

export type CmsPage = 'home' | 'services' | 'reviews' | string

export const CMS_DEFAULTS: Record<
  CmsPage,
  Record<string, { type: 'text' | 'button'; value: string; href?: string }>
> = {
  home: {
    'home.hero.tagline': { type: 'text', value: 'Сервис по продаже сайтов' },
    'home.hero.title': { type: 'text', value: 'Создаём сайты,' },
    'home.hero.titleHighlight': { type: 'text', value: 'которые продают' },
    'home.hero.description': {
      type: 'text',
      value:
        'SiteForge — студия полного цикла. От лендинга до интернет-магазина: дизайн, разработка, запуск и поддержка.',
    },
    'home.hero.btnServices': { type: 'button', value: 'Смотреть услуги', href: '/services' },
    'home.hero.btnReviews': { type: 'button', value: 'Читать отзывы', href: '/reviews' },
    'home.stat.0.value': { type: 'text', value: '150+' },
    'home.stat.0.label': { type: 'text', value: 'Сайтов запущено' },
    'home.stat.1.value': { type: 'text', value: '4.9' },
    'home.stat.1.label': { type: 'text', value: 'Средняя оценка' },
    'home.stat.2.value': { type: 'text', value: '7 дн.' },
    'home.stat.2.label': { type: 'text', value: 'Срок лендинга' },
    'home.services.title': { type: 'text', value: 'Популярные услуги' },
    'home.services.link': { type: 'button', value: 'Все услуги →', href: '/services' },
    'home.review.title': { type: 'text', value: 'Последний отзыв' },
  },
  services: {
    'services.page.title': { type: 'text', value: 'Услуги' },
    'services.page.description': {
      type: 'text',
      value: 'Выберите формат сайта — мы разработаем, запустим и передадим готовый продукт.',
    },
  },
  reviews: {
    'reviews.page.title': { type: 'text', value: 'Отзывы' },
    'reviews.page.description': {
      type: 'text',
      value: 'Что говорят клиенты о работе с SiteForge.',
    },
  },
}

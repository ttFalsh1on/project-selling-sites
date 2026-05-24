export type CmsPage = 'home' | 'services' | 'reviews'

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

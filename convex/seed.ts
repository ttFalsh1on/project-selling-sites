import { internalMutation, mutation, type MutationCtx } from './_generated/server'

const servicesSeed = [
  {
    slug: 'landing',
    title: 'Лендинг',
    description: 'Одностраничный сайт для продажи продукта или услуги с высокой конверсией.',
    price: 'от 25 000 ₽',
    features: ['Адаптивная вёрстка', 'SEO-оптимизация', 'Форма заявки', 'Срок: 5–7 дней'],
    badge: 'Популярное',
    sortOrder: 0,
  },
  {
    slug: 'business',
    title: 'Корпоративный сайт',
    description: 'Многостраничный сайт для компании с разделами услуг, команды и контактов.',
    price: 'от 55 000 ₽',
    features: ['До 10 страниц', 'CMS для контента', 'Аналитика', 'Срок: 14–21 день'],
    sortOrder: 1,
  },
  {
    slug: 'shop',
    title: 'Интернет-магазин',
    description: 'Полноценный e-commerce с каталогом, корзиной и онлайн-оплатой.',
    price: 'от 90 000 ₽',
    features: ['Каталог товаров', 'Корзина и оплата', 'Личный кабинет', 'Срок: 21–30 дней'],
    badge: 'Premium',
    sortOrder: 2,
  },
  {
    slug: 'redesign',
    title: 'Редизайн',
    description: 'Обновление существующего сайта: новый дизайн, UX и современный стек.',
    price: 'от 35 000 ₽',
    features: ['Аудит текущего сайта', 'Новый UI/UX', 'Миграция контента', 'Срок: 10–14 дней'],
    sortOrder: 3,
  },
]

const reviewsSeed = [
  {
    name: 'Алексей Иванов',
    role: 'CEO, TechStart',
    text: 'Заказали лендинг для запуска продукта — получили за 6 дней. Конверсия выросла на 40%. Отличная команда!',
    rating: 5,
    date: '15.03.2026',
    sortOrder: 0,
  },
  {
    name: 'Мария Петрова',
    role: 'Владелец салона красоты',
    text: 'Сделали красивый сайт с онлайн-записью. Клиенты теперь записываются сами, звонков стало меньше.',
    rating: 5,
    date: '02.03.2026',
    sortOrder: 1,
  },
  {
    name: 'Дмитрий Козлов',
    role: 'Маркетолог, RetailPro',
    text: 'Интернет-магазин запустили в срок. Интеграция с оплатой и доставкой работает без сбоев.',
    rating: 4,
    date: '20.02.2026',
    sortOrder: 2,
  },
  {
    name: 'Елена Сидорова',
    role: 'Фрилансер',
    text: 'Редизайн портфолио полностью обновил мой имидж. Получаю больше заказов после запуска.',
    rating: 5,
    date: '10.02.2026',
    sortOrder: 3,
  },
]

async function insertSeedData(ctx: MutationCtx) {
  const existingServices = await ctx.db.query('services').first()
  if (existingServices) return { seeded: false }

  for (const service of servicesSeed) {
    await ctx.db.insert('services', service)
  }

  for (const review of reviewsSeed) {
    await ctx.db.insert('reviews', review)
  }

  return { seeded: true }
}

export const seedIfEmpty = mutation({
  args: {},
  handler: async (ctx) => insertSeedData(ctx),
})

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => insertSeedData(ctx),
})

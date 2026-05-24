import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { api } from '../../convex/_generated/api'
import { GlassCard } from '../components/GlassCard'
import { LoadingState } from '../components/LoadingState'

export function HomePage() {
  const services = useQuery(api.services.list)
  const reviews = useQuery(api.reviews.list)

  if (services === undefined || reviews === undefined) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <GlassCard className="relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-400/10" />
        <div className="relative space-y-4 py-6 sm:space-y-6 sm:py-8 md:py-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold uppercase tracking-widest text-cyan-400 sm:text-sm"
            style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}
          >
            Сервис по продаже сайтов
          </motion.p>
          <h1 className="font-nunito text-2xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Создаём сайты,{' '}
            <span className="bg-gradient-to-r from-accent-purple to-accent-teal bg-clip-text text-transparent">
              которые продают
            </span>
          </h1>
          <p className="mx-auto max-w-2xl px-1 text-sm text-white/60 sm:text-base">
            SiteForge — студия полного цикла. От лендинга до интернет-магазина: дизайн, разработка,
            запуск и поддержка.
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 px-2 sm:flex-row sm:items-center sm:px-0">
            <Link to="/services" className="btn-primary w-full sm:w-auto">
              Смотреть услуги
            </Link>
            <Link to="/reviews" className="btn-secondary w-full sm:w-auto">
              Читать отзывы
            </Link>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        {[
          { value: '150+', label: 'Сайтов запущено' },
          { value: '4.9', label: 'Средняя оценка' },
          { value: '7 дн.', label: 'Срок лендинга' },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.1} className="text-center">
            <p className="neon-logo text-2xl font-bold sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs text-white/50 sm:text-sm">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-white sm:mb-4 sm:text-xl">Популярные услуги</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.slice(0, 2).map((service, i) => (
            <GlassCard key={service._id} delay={i * 0.1}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-base font-bold text-white sm:text-lg">{service.title}</h3>
                {service.badge && (
                  <span className="rounded-full bg-accent-purple/20 px-2 py-0.5 text-xs font-semibold text-accent-purple">
                    {service.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-white/55">{service.description}</p>
              <p className="mt-3 text-base font-bold text-accent-teal sm:text-lg">{service.price}</p>
            </GlassCard>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/services" className="btn-secondary w-full sm:w-auto">
            Все услуги →
          </Link>
        </div>
      </div>

      {reviews[0] && (
        <GlassCard>
          <h2 className="mb-3 text-lg font-bold text-white sm:mb-4 sm:text-xl">Последний отзыв</h2>
          <div className="flex gap-1 text-base sm:text-lg">
            {Array.from({ length: reviews[0].rating }).map((_, i) => (
              <span key={i} className="text-accent-purple">
                ★
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-white/70 sm:text-base">&ldquo;{reviews[0].text}&rdquo;</p>
          <p className="mt-3 text-sm font-semibold text-cyan-400">{reviews[0].name}</p>
          <p className="text-xs text-white/40">{reviews[0].role}</p>
        </GlassCard>
      )}
    </div>
  )
}

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { GlassCard } from '../components/GlassCard'
import { LoadingState } from '../components/LoadingState'

export function ServicesPage() {
  const services = useQuery(api.services.list)

  if (services === undefined) {
    return <LoadingState />
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Услуги</h1>
        <p className="mt-2 text-sm text-white/55 sm:text-base">
          Выберите формат сайта — мы разработаем, запустим и передадим готовый продукт.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {services.map((service, i) => (
          <GlassCard key={service._id} delay={i * 0.08} className="flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-white sm:text-xl">{service.title}</h2>
              {service.badge && (
                <span
                  className="shrink-0 rounded-full border border-fuchsia-400/30 px-2.5 py-0.5 text-xs font-semibold text-fuchsia-300"
                  style={{ textShadow: '0 0 8px rgba(255,0,255,0.5)' }}
                >
                  {service.badge}
                </span>
              )}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{service.description}</p>
            <ul className="mt-4 space-y-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-white/70">
                  <span
                    className="mt-0.5 shrink-0 text-cyber-green"
                    style={{ textShadow: '0 0 6px #39ff14' }}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-lg font-bold text-accent-teal sm:text-xl">{service.price}</span>
              <button type="button" className="btn-primary w-full text-sm sm:w-auto">
                Заказать
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

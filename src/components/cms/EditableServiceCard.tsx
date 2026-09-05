import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMutation } from '../../hooks/useApi'
import { api } from '../../api/paths'
import type { ServiceDoc } from '../../types/api'
import { GlassCard } from '../GlassCard'
import { EditableEntityWrapper } from './EditableEntityWrapper'
import { ServiceEditModal } from './ServiceEditModal'
import { OrderModal } from './OrderModal'

interface EditableServiceCardProps {
  service: ServiceDoc
  delay?: number
  compact?: boolean
}

export function EditableServiceCard({ service, delay = 0, compact = false }: EditableServiceCardProps) {
  const remove = useMutation(api.services.remove)
  const [editing, setEditing] = useState(false)
  const [ordering, setOrdering] = useState(false)

  const handleDelete = async () => {
    if (window.confirm(`Удалить услугу «${service.title}»?`)) {
      await remove({ id: service._id })
    }
  }

  const card = compact ? (
    <GlassCard delay={delay}>
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
  ) : (
    <GlassCard delay={delay} className="flex flex-col">
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
            <span className="mt-0.5 shrink-0 text-cyber-green" style={{ textShadow: '0 0 6px #39ff14' }}>
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-lg font-bold text-accent-teal sm:text-xl">{service.price}</span>
        <button
          type="button"
          onClick={() => setOrdering(true)}
          className="btn-primary w-full text-sm sm:w-auto"
        >
          Заказать
        </button>
      </div>
    </GlassCard>
  )

  return (
    <>
      <EditableEntityWrapper onEdit={() => setEditing(true)} onDelete={() => void handleDelete()}>
        {card}
      </EditableEntityWrapper>
      {editing && <ServiceEditModal service={service} onClose={() => setEditing(false)} />}
      <AnimatePresence>
        {ordering && <OrderModal service={service} onClose={() => setOrdering(false)} />}
      </AnimatePresence>
    </>
  )
}

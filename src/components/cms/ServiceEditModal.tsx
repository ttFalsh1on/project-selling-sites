import { useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import type { Doc } from '../../../convex/_generated/dataModel'
import { api } from '../../../convex/_generated/api'

interface ServiceEditModalProps {
  service: Doc<'services'>
  onClose: () => void
}

export function ServiceEditModal({ service, onClose }: ServiceEditModalProps) {
  const update = useMutation(api.services.update)
  const [title, setTitle] = useState(service.title)
  const [description, setDescription] = useState(service.description)
  const [price, setPrice] = useState(service.price)
  const [badge, setBadge] = useState(service.badge ?? '')
  const [featuresText, setFeaturesText] = useState(service.features.join('\n'))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTitle(service.title)
    setDescription(service.description)
    setPrice(service.price)
    setBadge(service.badge ?? '')
    setFeaturesText(service.features.join('\n'))
  }, [service])

  const handleSave = async () => {
    setSaving(true)
    try {
      await update({
        id: service._id,
        title,
        description,
        price,
        badge: badge || undefined,
        features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Редактировать услугу</h3>
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="Бейдж (необязательно)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            placeholder="Особенности (по одной на строку)"
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

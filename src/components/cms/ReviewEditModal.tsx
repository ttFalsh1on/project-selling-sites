import { useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import type { Doc } from '../../../convex/_generated/dataModel'
import { api } from '../../../convex/_generated/api'

interface ReviewEditModalProps {
  review: Doc<'reviews'>
  onClose: () => void
}

export function ReviewEditModal({ review, onClose }: ReviewEditModalProps) {
  const update = useMutation(api.reviews.update)
  const [name, setName] = useState(review.name)
  const [role, setRole] = useState(review.role)
  const [text, setText] = useState(review.text)
  const [rating, setRating] = useState(review.rating)
  const [date, setDate] = useState(review.date)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setName(review.name)
    setRole(review.role)
    setText(review.text)
    setRating(review.rating)
    setDate(review.date)
  }, [review])

  const handleSave = async () => {
    setSaving(true)
    try {
      await update({ id: review._id, name, role, text, rating, date })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Редактировать отзыв</h3>
        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Должность"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Текст отзыва"
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <div className="flex gap-3">
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n} className="bg-[#1a1a2e]">
                  {n} ★
                </option>
              ))}
            </select>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Дата"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
            />
          </div>
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

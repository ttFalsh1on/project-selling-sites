import { useState } from 'react'
import { useMutation } from '../../hooks/useApi'
import { api } from '../../api/paths'
import type { ReviewDoc } from '../../types/api'
import { GlassCard } from '../GlassCard'
import { EditableEntityWrapper } from './EditableEntityWrapper'
import { ReviewEditModal } from './ReviewEditModal'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-accent-purple' : 'text-white/20'}
          style={i < rating ? { textShadow: '0 0 6px rgba(187,134,252,0.6)' } : undefined}
        >
          ★
        </span>
      ))}
    </div>
  )
}

interface EditableReviewCardProps {
  review: ReviewDoc
  delay?: number
  compact?: boolean
}

export function EditableReviewCard({ review, delay = 0, compact = false }: EditableReviewCardProps) {
  const remove = useMutation(api.reviews.remove)
  const [editing, setEditing] = useState(false)

  const handleDelete = async () => {
    if (window.confirm(`Удалить отзыв от «${review.name}»?`)) {
      await remove({ id: review._id })
    }
  }

  const card = compact ? (
    <GlassCard delay={delay}>
      <div className="flex gap-1 text-base sm:text-lg">
        {Array.from({ length: review.rating }).map((_, i) => (
          <span key={i} className="text-accent-purple">
            ★
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-white/70 sm:text-base">&ldquo;{review.text}&rdquo;</p>
      <p className="mt-3 text-sm font-semibold text-cyan-400">{review.name}</p>
      <p className="text-xs text-white/40">{review.role}</p>
    </GlassCard>
  ) : (
    <GlassCard delay={delay}>
      <StarRating rating={review.rating} />
      <p className="mt-4 text-sm leading-relaxed text-white/70">&ldquo;{review.text}&rdquo;</p>
      <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-cyan-400" style={{ textShadow: '0 0 8px rgba(0,255,255,0.3)' }}>
            {review.name}
          </p>
          <p className="text-xs text-white/40">{review.role}</p>
        </div>
        <span className="text-xs text-white/30">{review.date}</span>
      </div>
    </GlassCard>
  )

  return (
    <>
      <EditableEntityWrapper onEdit={() => setEditing(true)} onDelete={() => void handleDelete()}>
        {card}
      </EditableEntityWrapper>
      {editing && <ReviewEditModal review={review} onClose={() => setEditing(false)} />}
    </>
  )
}

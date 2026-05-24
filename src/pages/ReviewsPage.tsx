import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { GlassCard } from '../components/GlassCard'
import { LoadingState } from '../components/LoadingState'

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

export function ReviewsPage() {
  const reviews = useQuery(api.reviews.list)
  const avgRating = useQuery(api.reviews.averageRating)

  if (reviews === undefined || avgRating === undefined) {
    return <LoadingState />
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Отзывы</h1>
          <p className="mt-2 text-sm text-white/55 sm:text-base">
            Что говорят клиенты о работе с SiteForge.
          </p>
        </div>
        <GlassCard className="w-full px-6 py-4 text-center sm:w-auto">
          <p className="neon-logo text-2xl font-bold sm:text-3xl">{avgRating.toFixed(1)}</p>
          <p className="text-xs text-white/45">{reviews.length} отзывов</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((review, i) => (
          <GlassCard key={review._id} delay={i * 0.08}>
            <StarRating rating={review.rating} />
            <p className="mt-4 text-sm leading-relaxed text-white/70">&ldquo;{review.text}&rdquo;</p>
            <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className="font-semibold text-cyan-400"
                  style={{ textShadow: '0 0 8px rgba(0,255,255,0.3)' }}
                >
                  {review.name}
                </p>
                <p className="text-xs text-white/40">{review.role}</p>
              </div>
              <span className="text-xs text-white/30">{review.date}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuery } from '../hooks/useApi'
import { api } from '../api/paths'
import type { ReviewDoc } from '../types/api'
import { CmsSlot, useCustomBlocks } from '../components/cms/CmsSlot'
import { EditableBlock } from '../components/cms/EditableBlock'
import { EditableReviewCard } from '../components/cms/EditableReviewCard'
import { GlassCard } from '../components/GlassCard'
import { LoadingState } from '../components/LoadingState'
import { ReviewForm } from '../components/ReviewForm'
import { useCmsPage } from '../hooks/useCmsPage'

export function ReviewsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const reviews = useQuery<ReviewDoc[]>(api.reviews.list)
  const avgRating = useQuery<number>(api.reviews.averageRating)
  const cms = useCmsPage('reviews')
  const customBlocks = useCustomBlocks(cms.blocks)

  if (reviews === undefined || avgRating === undefined || cms.isLoading) {
    return <LoadingState />
  }

  if (!reviews || avgRating === null) {
    return <LoadingState />
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <EditableBlock page="reviews" cmsKey="reviews.page.title" type="text" value={cms.getText('reviews.page.title')} className="text-2xl font-bold text-white sm:text-3xl" as="h1" />
          <EditableBlock page="reviews" cmsKey="reviews.page.description" type="text" value={cms.getText('reviews.page.description')} className="mt-2 text-sm text-white/55 sm:text-base" as="p" />
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-stretch">
          <button
            type="button"
            onClick={() => setIsFormOpen((open) => !open)}
            aria-expanded={isFormOpen}
            className="btn-primary w-full sm:w-auto"
          >
            {isFormOpen ? 'Скрыть форму' : 'Написать отзыв'}
          </button>
          <GlassCard className="w-full px-6 py-4 text-center sm:w-auto">
            <p className="neon-logo text-2xl font-bold sm:text-3xl">{avgRating.toFixed(1)}</p>
            <p className="text-xs text-white/45">{reviews.length} отзывов</p>
          </GlassCard>
        </div>
      </div>

      <CmsSlot page="reviews" slot="header-after" blocks={customBlocks} />

      {isFormOpen && <ReviewForm onClose={() => setIsFormOpen(false)} />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((review, i) => (
          <EditableReviewCard key={review._id} review={review} delay={i * 0.08} />
        ))}
      </div>

      <CmsSlot page="reviews" slot="list-after" blocks={customBlocks} />
      <CmsSlot page="reviews" slot="page-end" blocks={customBlocks} />
    </div>
  )
}

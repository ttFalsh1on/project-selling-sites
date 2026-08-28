import { useState, type FormEvent } from 'react'
import { api } from '../api/paths'
import { useMutation, useQuery } from '../hooks/useApi'
import type { ProfileMe } from '../types/api'
import { GlassCard } from './GlassCard'

const otherProjectType = 'Другое'

const projectTypes = [
  'Заказывал(а) лендинг',
  'Заказывал(а) корпоративный сайт',
  'Заказывал(а) интернет-магазин',
  'Заказывал(а) редизайн сайта',
  otherProjectType,
] as const

type SubmitReviewArgs = {
  role: string
  text: string
  rating: number
}

type SubmitReviewResult = {
  id: string
  authorName: string
}

interface ReviewFormProps {
  onClose: () => void
}

export function ReviewForm({ onClose }: ReviewFormProps) {
  const submitReview = useMutation<SubmitReviewArgs, SubmitReviewResult>(api.reviews.submit)
  const profileData = useQuery<ProfileMe>(api.profiles.getMe)
  const [role, setRole] = useState<string>(projectTypes[0])
  const [customRole, setCustomRole] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [publishedAs, setPublishedAs] = useState<string | null>(null)
  const selectedRole = role === otherProjectType ? customRole.trim() : role
  const accountName = profileData && !profileData.isGuest ? profileData.profile.name : null
  const canPublishFromAccount = Boolean(accountName)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const result = await submitReview({ role: selectedRole, text, rating })
      setPublishedAs(result.authorName)
      setText('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не удалось опубликовать отзыв')
    } finally {
      setSaving(false)
    }
  }

  if (publishedAs) {
    return (
      <GlassCard className="border border-cyber-green/25 bg-cyber-green/5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyber-green/15 text-2xl text-cyber-green">
          ✓
        </div>
        <h2 className="mt-3 text-lg font-bold text-white">Спасибо за отзыв!</h2>
        <p className="mt-2 text-sm text-white/55">
          Он опубликован от имени вашего профиля:{' '}
          <span className="font-semibold text-cyan-400">{publishedAs}</span>.
        </p>
        <button type="button" onClick={onClose} className="btn-secondary mt-5">
          Закрыть
        </button>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="border border-accent-purple/25">
      <div>
        <h2 className="text-lg font-bold text-white sm:text-xl">Написать отзыв</h2>
        <p className="mt-1 text-xs text-white/45 sm:text-sm">
          {profileData === undefined
            ? 'Проверяем ваш аккаунт...'
            : canPublishFromAccount
              ? `Отзыв будет опубликован от имени ${accountName}.`
              : 'Чтобы опубликовать отзыв, войдите в аккаунт или завершите регистрацию.'}
        </p>
      </div>

      <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-white/70">Ваша оценка</legend>
          <div className="flex gap-1" aria-label={`${rating} из 5`}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} из 5`}
                aria-pressed={rating === value}
                className={`rounded px-1 text-2xl transition hover:scale-110 ${
                  value <= rating ? 'text-accent-purple' : 'text-white/20'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white/70">Что вы заказывали?</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#151527] px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent-purple"
          >
            {projectTypes.map((projectType) => (
              <option key={projectType} value={projectType}>
                {projectType}
              </option>
            ))}
          </select>
        </label>

        {role === otherProjectType && (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white/70">
              Укажите, что вы заказывали
            </span>
            <input
              value={customRole}
              onChange={(event) => setCustomRole(event.target.value)}
              placeholder="Например, сайт-портфолио"
              minLength={3}
              maxLength={80}
              required
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-accent-purple"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white/70">
            Ваш отзыв <span className="font-normal text-white/40">(не менее 20 символов)</span>
          </span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Расскажите, что заказывали, как прошла работа и что получилось в итоге"
            minLength={20}
            maxLength={1000}
            rows={5}
            required
            className="w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-accent-purple"
          />
          <span className="mt-1 block text-right text-xs text-white/30">{text.length}/1000</span>
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">
            Отмена
          </button>
          <button
            type="submit"
            disabled={
              saving ||
              !canPublishFromAccount ||
              text.trim().length < 20 ||
              selectedRole.length < 3
            }
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Публикуем...' : 'Опубликовать отзыв'}
          </button>
        </div>
      </form>
    </GlassCard>
  )
}

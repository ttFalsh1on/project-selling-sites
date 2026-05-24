import { useState } from 'react'
import { useQuery } from 'convex/react'
import { useMutation } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'
import { GlassCard } from '../components/GlassCard'
import { LoadingState } from '../components/LoadingState'
import { UserAvatar } from '../components/UserAvatar'
import { AvatarUpload } from '../components/AvatarUpload'
import { CreateAccountForm } from '../components/CreateAccountForm'
import { SignInForm } from '../components/SignInForm'

const statusLabels = {
  done: { label: 'Готово', className: 'bg-cyber-green/15 text-cyber-green' },
  in_progress: { label: 'В работе', className: 'bg-accent-purple/20 text-accent-purple' },
  pending: { label: 'Ожидание', className: 'bg-white/10 text-white/50' },
} as const

export function ProfilePage() {
  const profileData = useQuery(api.profiles.getMe)
  const updateName = useMutation(api.profiles.updateName)
  const { signOut } = useAuthActions()
  const [signingOut, setSigningOut] = useState(false)

  if (profileData === undefined) {
    return <LoadingState label="Загрузка профиля..." />
  }

  if (profileData === null) {
    return <LoadingState label="Вход как гость..." />
  }

  const { profile, orders, stats, avatarUrl, isGuest } = profileData

  const handleEditName = async () => {
    const nextName = window.prompt('Ваше имя', profile.name)
    if (!nextName?.trim()) return
    await updateName({ name: nextName.trim() })
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Профиль</h1>
        <p className="mt-2 text-sm text-white/55 sm:text-base">
          {isGuest
            ? 'Вы вошли как гость — регистрация не обязательна.'
            : 'Ваш личный кабинет клиента SiteForge.'}
        </p>
      </div>

      {isGuest && (
        <GlassCard className="border border-cyan-400/20 bg-cyan-400/5">
          <p className="text-sm text-cyan-300">
            👤 Гостевой режим активен. Можете смотреть услуги и отзывы без регистрации.
          </p>
        </GlassCard>
      )}

      <GlassCard className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        <UserAvatar name={profile.name} avatarUrl={avatarUrl} size="md" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{profile.name}</h2>
          <p className="truncate text-sm text-white/50">
            {profile.email ?? (isGuest ? 'Гость без email' : 'Email не указан')}
          </p>
          <p
            className={`mt-1 text-xs ${isGuest ? 'text-cyan-400' : 'text-cyber-green'}`}
            style={{ textShadow: isGuest ? undefined : '0 0 6px #39ff14' }}
          >
            {isGuest ? '● Гостевой вход' : '● Аккаунт активен'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto">
          <AvatarUpload />
          {!isGuest && (
            <button type="button" onClick={() => void handleEditName()} className="btn-secondary w-full">
              Редактировать имя
            </button>
          )}
          {!isGuest && (
            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className="btn-secondary w-full text-red-300 hover:text-red-200"
            >
              {signingOut ? 'Выход...' : 'Выйти'}
            </button>
          )}
        </div>
      </GlassCard>

      {!isGuest && (
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4">
          {[
            { label: 'Заказов', value: stats.total },
            { label: 'Активных', value: stats.active },
            { label: 'Завершено', value: stats.completed },
          ].map((stat, i) => (
            <GlassCard key={stat.label} delay={i * 0.08} className="text-center">
              <p className="text-2xl font-bold text-accent-purple sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-white/45 sm:text-sm">{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      )}

      {!isGuest && orders.length > 0 && (
        <GlassCard>
          <h3 className="mb-4 text-base font-bold text-white sm:text-lg">Последние заказы</h3>
          <div className="-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/35">
                  <th className="pb-3 pr-4">Проект</th>
                  <th className="pb-3 pr-4">Статус</th>
                  <th className="pb-3">Срок</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                {orders.map((order) => {
                  const status = statusLabels[order.status]
                  return (
                    <tr key={order._id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 font-medium text-white">{order.project}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3">{order.dueDate ?? '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {isGuest && (
        <div className="grid gap-4 lg:grid-cols-2">
          <CreateAccountForm />
          <SignInForm />
        </div>
      )}

      <GlassCard>
        <h3 className="mb-3 text-base font-bold text-white sm:text-lg">Связаться с менеджером</h3>
        <p className="mb-4 text-sm text-white/55">
          Нужна консультация по новому проекту? Напишите нам — ответим в течение часа.
        </p>
        <button type="button" className="btn-primary w-full sm:w-auto">
          Написать в поддержку
        </button>
      </GlassCard>
    </div>
  )
}

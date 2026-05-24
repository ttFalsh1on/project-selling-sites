import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { GlassCard } from './GlassCard'

export function CreateAccountForm() {
  const { signIn } = useAuthActions()
  const completeRegistration = useMutation(api.profiles.completeRegistration)
  const ensureProfile = useMutation(api.profiles.ensureProfile)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signIn('password', {
        flow: 'signUp',
        email: email.trim(),
        password,
        name: name.trim(),
      })
      await ensureProfile()
      await completeRegistration({ name: name.trim(), email: email.trim() })
    } catch {
      setError('Не удалось создать аккаунт. Проверьте email и пароль (мин. 8 символов).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard>
      <h3 className="mb-1 text-lg font-bold text-white">Создать аккаунт</h3>
      <p className="mb-4 text-sm text-white/55">
        Необязательно — вы уже вошли как гость и можете пользоваться сайтом без регистрации.
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent-purple"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent-purple"
        />
        <input
          type="password"
          placeholder="Пароль (мин. 8 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent-purple"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
          {loading ? 'Создание...' : 'Создать аккаунт'}
        </button>
      </form>
    </GlassCard>
  )
}

import { useState } from 'react'
import { useFlexAuth } from '../providers/FlexAuthProvider'
import { GlassCard } from './GlassCard'

export function SignInForm() {
  const { login } = useFlexAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(email.trim(), password)
    } catch {
      setError('Неверный email или пароль.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard>
      <h3 className="mb-4 text-lg font-bold text-white">Войти в аккаунт</h3>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent-teal"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent-teal"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-secondary w-full sm:w-auto">
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </GlassCard>
  )
}

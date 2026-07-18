import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { FlexProvider } from '../lib/flexClient'
import { api } from '../api/paths'
import { FLEX_TOKEN_KEY, flexUrl } from '../lib/flex'

interface FlexAuthContextValue {
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  upgradeGuest: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const FlexAuthContext = createContext<FlexAuthContextValue | null>(null)

async function runMutation<T>(path: string, args: Record<string, unknown>, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${flexUrl}/api/run`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ path, args }),
  })
  const data = (await res.json()) as { value?: T; error?: string }
  if (!res.ok) throw new Error(data.error ?? res.statusText)
  return data.value as T
}

export function FlexAuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(FLEX_TOKEN_KEY)
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(!token)

  const setToken = useCallback((next: string | null) => {
    try {
      if (next) localStorage.setItem(FLEX_TOKEN_KEY, next)
      else localStorage.removeItem(FLEX_TOKEN_KEY)
    } catch {
      /* ignore */
    }
    setTokenState(next)
  }, [])

  useEffect(() => {
    if (token) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    void (async () => {
      try {
        const result = await runMutation<{ token: string }>(api.auth.guestLogin, {})
        if (!cancelled) setToken(result.token)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token, setToken])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await runMutation<{ token: string }>(api.auth.login, { email, password })
      setToken(result.token)
    },
    [setToken],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await runMutation<{ token: string }>(api.auth.register, { name, email, password })
      setToken(result.token)
    },
    [setToken],
  )

  const upgradeGuest = useCallback(
    async (name: string, email: string, password: string) => {
      if (!token) throw new Error('Не авторизован')
      await runMutation(api.auth.upgradeGuest, { name, email, password }, token)
    },
    [token],
  )

  const logout = useCallback(async () => {
    if (token) {
      try {
        await runMutation(api.auth.logout, {}, token)
      } catch {
        /* ignore */
      }
    }
    setToken(null)
    const result = await runMutation<{ token: string }>(api.auth.guestLogin, {})
    setToken(result.token)
  }, [token, setToken])

  const value = useMemo(
    () => ({
      token,
      isLoading,
      isAuthenticated: !!token,
      setToken,
      login,
      register,
      upgradeGuest,
      logout,
    }),
    [token, isLoading, setToken, login, register, upgradeGuest, logout],
  )

  if (isLoading || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white/60">
        Подключение...
      </div>
    )
  }

  return (
    <FlexAuthContext.Provider value={value}>
      <FlexProvider url={flexUrl} token={token} key={token}>
        {children}
      </FlexProvider>
    </FlexAuthContext.Provider>
  )
}

export function useFlexAuth() {
  const ctx = useContext(FlexAuthContext)
  if (!ctx) throw new Error('useFlexAuth: оберните приложение в FlexAuthProvider')
  return ctx
}

/** Совместимость с @convex-dev/auth/react */
export function useAuthActions() {
  const { login, logout, register } = useFlexAuth()
  return {
    signIn: async (
      provider: 'password' | 'anonymous',
      params?: { flow?: string; email?: string; password?: string; name?: string },
    ) => {
      if (provider === 'anonymous') return
      if (params?.flow === 'signUp' && params.email && params.password && params.name) {
        await register(params.name, params.email, params.password)
        return
      }
      if (params?.email && params.password) {
        await login(params.email, params.password)
      }
    },
    signOut: logout,
  }
}

export function useConvexAuth() {
  const { isAuthenticated, isLoading } = useFlexAuth()
  return { isAuthenticated, isLoading }
}

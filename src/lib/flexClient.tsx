import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface FlexApi {
  query: <T = unknown>(path: string, args?: Record<string, unknown>) => Promise<T>
  mutation: <T = unknown>(path: string, args?: Record<string, unknown>) => Promise<T>
}

const FlexContext = createContext<FlexApi | null>(null)

function createHttpApi(url: string, token?: string | null): FlexApi {
  const base = url.replace(/\/$/, '')

  const headers = (): Record<string, string> => {
    const h: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) h.Authorization = `Bearer ${token}`
    return h
  }

  const run = async <T,>(path: string, args: Record<string, unknown> = {}): Promise<T> => {
    const res = await fetch(`${base}/api/run`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ path, args }),
    })
    const data = (await res.json()) as { value?: T; error?: string }
    if (!res.ok) throw new Error(data.error ?? res.statusText)
    return data.value as T
  }

  return { query: run, mutation: run }
}

export function FlexProvider({
  url,
  token,
  children,
}: {
  url: string
  token?: string | null
  children: ReactNode
}) {
  const api = useMemo(() => createHttpApi(url, token), [url, token])
  return <FlexContext.Provider value={api}>{children}</FlexContext.Provider>
}

export function useFlexApi(): FlexApi {
  const ctx = useContext(FlexContext)
  if (!ctx) throw new Error('useFlexApi: оберните приложение в <FlexProvider>')
  return ctx
}

export function useFlexMutation<
  T = unknown,
  A extends Record<string, unknown> = Record<string, unknown>,
>(path: string): { mutate: (args: A) => Promise<T>; loading: boolean; error: Error | null } {
  const api = useFlexApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(
    async (args: A) => {
      setLoading(true)
      setError(null)
      try {
        return await api.mutation<T>(path, args)
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err))
        setError(e)
        throw e
      } finally {
        setLoading(false)
      }
    },
    [api, path],
  )

  return { mutate, loading, error }
}

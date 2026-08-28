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

function createHttpApi(
  url: string,
  token?: string,
  projectId?: string,
): FlexApi {
  const base = url.replace(/\/$/, '')

  const run = async <T,>(
    path: string,
    args: Record<string, unknown> = {},
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers.Authorization = `Bearer ${token}`
    if (projectId) headers['X-Project-Id'] = projectId

    const response = await fetch(`${base}/api/run`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ path, args }),
    })
    const data = (await response.json()) as { value?: T; error?: string }
    if (!response.ok) throw new Error(data.error ?? response.statusText)
    return data.value as T
  }

  return { query: run, mutation: run }
}

export function FlexProvider({
  url,
  token,
  projectId,
  children,
}: {
  url: string
  token?: string
  projectId?: string
  children: ReactNode
}) {
  const api = useMemo(
    () => createHttpApi(url, token, projectId),
    [url, token, projectId],
  )
  return <FlexContext.Provider value={api}>{children}</FlexContext.Provider>
}

export function useFlexApi(): FlexApi {
  const api = useContext(FlexContext)
  if (!api) throw new Error('useFlexApi: оберните приложение в FlexProvider')
  return api
}

export function useFlexMutation<
  T = unknown,
  A extends Record<string, unknown> = Record<string, unknown>,
>(path: string) {
  const api = useFlexApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(
    async (args: A) => {
      setLoading(true)
      setError(null)
      try {
        return await api.mutation<T>(path, args)
      } catch (cause) {
        const nextError =
          cause instanceof Error ? cause : new Error(String(cause))
        setError(nextError)
        throw nextError
      } finally {
        setLoading(false)
      }
    },
    [api, path],
  )

  return { mutate, loading, error }
}

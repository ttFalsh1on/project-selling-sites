import { useEffect, useRef, useState } from 'react'
import { useFlexApi, useFlexMutation } from '../lib/flexClient'

const POLL_INTERVAL_MS = 2500

export function useQuery<T>(path: string): T | undefined | null
export function useQuery<T>(path: string, args: Record<string, unknown>): T | undefined | null
export function useQuery<T>(
  path: string,
  args: Record<string, unknown> = {},
): T | undefined | null {
  const api = useFlexApi()
  const [data, setData] = useState<T | null | undefined>()
  const argsKey = JSON.stringify(args)
  const lastValue = useRef<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    lastValue.current = undefined
    setData(undefined)

    const fetchValue = async () => {
      try {
        const value = await api.query<T | null>(
          path,
          JSON.parse(argsKey) as Record<string, unknown>,
        )
        if (cancelled) return
        const serialized = JSON.stringify(value ?? null)
        if (serialized !== lastValue.current) {
          lastValue.current = serialized
          setData(value ?? null)
        }
      } catch {
        if (!cancelled && lastValue.current === undefined) setData(null)
      }
    }

    void fetchValue()
    const timer = window.setInterval(fetchValue, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [api, path, argsKey])

  return data
}

export function useMutation<A extends Record<string, unknown> = Record<string, unknown>, T = unknown>(
  path: string,
) {
  const { mutate } = useFlexMutation<T, A>(path)
  return (args: A) => mutate(args)
}

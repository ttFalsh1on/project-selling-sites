import { useFlexMutation, useFlexQuery } from '@flex/react'

export function useQuery<T>(path: string): T | undefined | null
export function useQuery<T>(path: string, args: Record<string, unknown>): T | undefined | null
export function useQuery<T>(
  path: string,
  args: Record<string, unknown> = {},
): T | undefined | null {
  const { data, loading } = useFlexQuery<T | null>(path, args)
  if (loading && data === undefined) return undefined
  return data ?? null
}

export function useMutation<A extends Record<string, unknown> = Record<string, unknown>, T = unknown>(
  path: string,
) {
  const { mutate } = useFlexMutation<T, A>(path)
  return (args: A) => mutate(args)
}

import { useEffect, useRef } from 'react'
import { useConvexAuth } from '../providers/FlexAuthProvider'
import { useMutation } from '../hooks/useApi'
import { api } from '../api/paths'

export function GuestAuthBootstrap() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const ensureProfile = useMutation(api.profiles.ensureProfile)
  const started = useRef(false)

  useEffect(() => {
    if (isLoading || !isAuthenticated || started.current) return
    started.current = true
    void ensureProfile({}).catch(() => {
      started.current = false
    })
  }, [isLoading, isAuthenticated, ensureProfile])

  return null
}

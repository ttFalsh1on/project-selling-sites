import { useEffect, useRef } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function GuestAuthBootstrap() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn } = useAuthActions()
  const ensureProfile = useMutation(api.profiles.ensureProfile)
  const started = useRef(false)

  useEffect(() => {
    if (isLoading || started.current) return

    const init = async () => {
      started.current = true
      try {
        if (!isAuthenticated) {
          await signIn('anonymous')
        }
        await ensureProfile()
      } catch {
        started.current = false
      }
    }

    void init()
  }, [isLoading, isAuthenticated, signIn, ensureProfile])

  return null
}

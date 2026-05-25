import { useEffect, useRef } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convexUrl } from '../lib/convex'

function hasStoredRefreshToken() {
  if (!convexUrl) return false
  const namespace = convexUrl.replace(/[^a-zA-Z0-9]/g, '')
  try {
    return localStorage.getItem(`__convexAuthRefreshToken_${namespace}`) !== null
  } catch {
    return false
  }
}

export function GuestAuthBootstrap() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn } = useAuthActions()
  const ensureProfile = useMutation(api.profiles.ensureProfile)
  const guestStarted = useRef(false)
  const restoreWaited = useRef(false)

  useEffect(() => {
    if (isLoading) return

    const init = async () => {
      try {
        if (isAuthenticated) {
          await ensureProfile()
          return
        }

        if (hasStoredRefreshToken() && !restoreWaited.current) {
          restoreWaited.current = true
          await new Promise((resolve) => setTimeout(resolve, 1500))
          return
        }

        if (guestStarted.current) return
        guestStarted.current = true

        await signIn('anonymous')
        await ensureProfile()
      } catch {
        guestStarted.current = false
      }
    }

    void init()
  }, [isLoading, isAuthenticated, signIn, ensureProfile])

  return null
}

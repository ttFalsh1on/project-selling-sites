import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '../../hooks/useApi'
import { api } from '../../api/paths'
import type { ProfileMe } from '../../types/api'
import { CmsToolbar } from './CmsToolbar'

interface CmsContextValue {
  isCmsMode: boolean
}

const CmsContext = createContext<CmsContextValue>({ isCmsMode: false })

export function useCmsMode() {
  return useContext(CmsContext).isCmsMode
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams()
  const me = useQuery<ProfileMe | null>(api.profiles.getMe)
  const cmsParam = searchParams.get('cms') === '1'
  const wasAdminRef = useRef(false)

  useEffect(() => {
    if (me?.isAdmin) wasAdminRef.current = true
    if (!cmsParam) wasAdminRef.current = false
  }, [me?.isAdmin, cmsParam])

  const isCmsMode = useMemo(() => {
    if (!cmsParam) return false
    if (me?.isAdmin) return true
    if (me === undefined && wasAdminRef.current) return true
    return false
  }, [cmsParam, me])

  return (
    <CmsContext.Provider value={{ isCmsMode }}>
      {isCmsMode && (
        <div className="fixed bottom-4 left-1/2 z-[300] -translate-x-1/2 rounded-full border border-cyan-400/40 bg-[rgba(10,10,30,0.95)] px-4 py-2 text-xs font-semibold text-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)] sm:text-sm">
          Режим редактирования — + добавить блок, 🎨 цвета
        </div>
      )}
      <CmsToolbar />
      {children}
    </CmsContext.Provider>
  )
}

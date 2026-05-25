import { useState } from 'react'
import { useCmsMode } from './CmsProvider'
import { CmsAddModal } from './CmsAddModal'
import { CmsThemePanel } from './CmsThemePanel'

export function CmsToolbar() {
  const isCmsMode = useCmsMode()
  const [showAdd, setShowAdd] = useState(false)
  const [showTheme, setShowTheme] = useState(false)

  if (!isCmsMode) return null

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-3 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setShowTheme(true)}
          title="Цвета сайта"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-400/40 bg-[rgba(10,10,30,0.95)] text-lg shadow-[0_0_20px_rgba(255,0,255,0.25)] transition-transform hover:scale-105"
        >
          🎨
        </button>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          title="Добавить блок"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/50 bg-[rgba(10,10,30,0.95)] text-3xl font-light leading-none text-cyan-400 shadow-[0_0_24px_rgba(0,255,255,0.35)] transition-transform hover:scale-105"
        >
          +
        </button>
      </div>

      {showAdd && <CmsAddModal onClose={() => setShowAdd(false)} />}
      {showTheme && <CmsThemePanel onClose={() => setShowTheme(false)} />}
    </>
  )
}

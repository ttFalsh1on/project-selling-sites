import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { mainNavItems } from '../data/navigation'

export function HamburgerMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <motion.nav
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="fixed left-0 top-0 z-[210] flex h-dvh w-[min(88vw,320px)] flex-col border-r border-white/10 bg-[#1a1a2e] shadow-[4px_0_40px_rgba(0,0,0,0.6)] sm:w-72"
            aria-label="Основная навигация"
          >
            <div className="flex items-start justify-between border-b border-white/10 px-5 py-5">
              <div>
                <p className="neon-logo text-base sm:text-lg">SiteForge</p>
                <p className="mt-1 text-xs text-white/45">Сервис по продаже сайтов</p>
              </div>
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              <p className="mb-2 px-2 text-[0.65rem] font-bold uppercase tracking-widest text-white/35">
                Разделы
              </p>
              <ul className="space-y-2">
                {mainNavItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors sm:text-base ${
                          isActive
                            ? 'bg-[#4361ee] text-white'
                            : 'text-white/70 hover:bg-[#252547] hover:text-white'
                        }`
                      }
                    >
                      <span className="w-6 shrink-0 text-center text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/10 p-4 text-xs leading-relaxed text-white/40">
              Профиль открывается по круглому аватару справа в шапке сайта.
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="relative z-[220] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 backdrop-blur-md transition-colors hover:bg-white/15 sm:h-11 sm:w-11"
      >
        <motion.span
          animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="block h-0.5 w-5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00ffff]"
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          className="block h-0.5 w-5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00ffff]"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="block h-0.5 w-5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00ffff]"
        />
      </button>

      {createPortal(drawer, document.body)}
    </>
  )
}

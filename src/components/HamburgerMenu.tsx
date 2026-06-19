import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '../hooks/useApi'
import { AnimatePresence, motion } from 'framer-motion'
import type { NavItemDoc } from '../types/api'
import { api } from '../api/paths'
import { mainNavItems } from '../data/navigation'
import { useCmsAwarePath } from '../hooks/useCmsAwarePath'
import { CmsActionMenu } from './cms/CmsActionMenu'
import { NavAddModal } from './cms/NavAddModal'
import { NavEditModal } from './cms/NavEditModal'
import { useCmsMode } from './cms/CmsProvider'

function NavItemRow({
  item,
  index,
  onClose,
}: {
  item: NavItemDoc | (typeof mainNavItems)[number]
  index: number
  onClose: () => void
}) {
  const isCmsMode = useCmsMode()
  const cmsPath = useCmsAwarePath()
  const navigate = useNavigate()
  const location = useLocation()
  const remove = useMutation(api.navItems.remove)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [editing, setEditing] = useState(false)

  const path = item.path
  const targetPath = cmsPath(path)
  const isActive =
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(`${path}/`)

  const isDbItem = '_id' in item

  const handleDelete = async () => {
    if (!isDbItem) return
    setMenu(null)
    if (window.confirm(`Удалить пункт «${item.label}»?`)) {
      await remove({ id: item._id })
    }
  }

  if (isCmsMode && isDbItem) {
    return (
      <>
        <motion.li
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setMenu({ x: e.clientX, y: e.clientY })
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold ring-2 ring-cyan-400/40 ring-offset-2 ring-offset-[#1a1a2e] transition-colors sm:text-base ${
              isActive ? 'bg-[#4361ee] text-white' : 'text-white/70 hover:bg-[#252547] hover:text-white'
            }`}
          >
            <span className="w-6 shrink-0 text-center text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        </motion.li>

        {menu && (
          <CmsActionMenu
            x={menu.x}
            y={menu.y}
            onOpen={() => {
              setMenu(null)
              onClose()
              navigate(targetPath)
            }}
            onEdit={() => {
              setMenu(null)
              setEditing(true)
            }}
            onDelete={() => void handleDelete()}
            onClose={() => setMenu(null)}
          />
        )}

        {editing && <NavEditModal item={item} onClose={() => setEditing(false)} />}
      </>
    )
  }

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <NavLink
        to={targetPath}
        end={path === '/'}
        onClick={onClose}
        className={() =>
          `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors sm:text-base ${
            isActive ? 'bg-[#4361ee] text-white' : 'text-white/70 hover:bg-[#252547] hover:text-white'
          }`
        }
      >
        <span className="w-6 shrink-0 text-center text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    </motion.li>
  )
}

export function HamburgerMenu() {
  const isCmsMode = useCmsMode()
  const [open, setOpen] = useState(false)
  const [showAddNav, setShowAddNav] = useState(false)
  const navItems = useQuery<NavItemDoc[]>(api.navItems.list)
  const items = navItems && navItems.length > 0 ? navItems : mainNavItems

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
                {items.map((item, index) => (
                  <NavItemRow
                    key={'_id' in item ? item._id : item.path}
                    item={item}
                    index={index}
                    onClose={() => setOpen(false)}
                  />
                ))}
              </ul>

              {isCmsMode && (
                <button
                  type="button"
                  onClick={() => setShowAddNav(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-400/5 px-4 py-3 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/10"
                >
                  <span className="text-lg leading-none">+</span>
                  Добавить вкладку
                </button>
              )}
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

      {showAddNav && (
        <NavAddModal
          onClose={() => setShowAddNav(false)}
          onCreated={() => setOpen(false)}
        />
      )}
    </>
  )
}


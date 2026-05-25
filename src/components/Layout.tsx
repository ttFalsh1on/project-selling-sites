import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { NeonBackground } from './NeonBackground'
import { HamburgerMenu } from './HamburgerMenu'
import { ProfileAvatarLink } from './ProfileAvatarLink'
import { CmsLink } from './cms/CmsLink'
import { pageTitles } from '../data/navigation'

export function Layout() {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? 'SiteForge'

  return (
    <div className="scanlines relative flex min-h-dvh flex-col">
      <NeonBackground />

      <header className="relative z-50 shrink-0 border-b border-white/10 bg-[rgba(10,10,30,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:h-16 sm:gap-4 sm:px-5 md:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <HamburgerMenu />
            <CmsLink
              to="/"
              className="neon-logo truncate text-sm no-underline sm:text-base md:text-lg"
            >
              SiteForge
            </CmsLink>
          </div>

          <h1 className="hidden truncate text-sm font-semibold text-white/55 md:block lg:text-base">
            {pageTitle}
          </h1>

          <div className="relative z-[220] flex shrink-0 items-center gap-2 sm:gap-3">
            <span
              className="hidden items-center gap-1.5 text-xs text-cyber-green sm:flex sm:text-sm"
              style={{ textShadow: '0 0 8px #39ff14' }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-cyber-green shadow-[0_0_8px_#39ff14]" />
              Онлайн
            </span>
            <ProfileAvatarLink />
          </div>
        </div>

        <div className="border-t border-white/5 px-3 py-2 md:hidden">
          <p className="truncate text-center text-xs font-medium text-white/45 sm:text-sm">
            {pageTitle}
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

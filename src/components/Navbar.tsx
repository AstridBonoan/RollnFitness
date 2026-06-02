import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { navLinks, site } from '../data/site'
import { Logo } from './Logo'

interface NavbarProps {
  pathname: string
  onNavigate: (path: string) => void
}

export function Navbar({ pathname, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavigate = (path: string) => {
    onNavigate(path)
    setMenuOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 nav-glass">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <button
          type="button"
          onClick={() => handleNavigate('/')}
          className="touch-target rounded-lg"
          aria-label={`${site.fullName} home`}
        >
          <Logo variant="compact" glow />
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => handleNavigate(link.path)}
              aria-current={pathname === link.path ? 'page' : undefined}
              className={`touch-target rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.path
                  ? 'bg-brand-900/50 text-brand-200'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="touch-target rounded-lg p-2 text-slate-300 hover:bg-white/10 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm md:hidden"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(85vw,320px)] flex-col border-l border-white/10 bg-navy-900 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="font-display text-lg font-bold text-white">Menu</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="touch-target rounded-lg p-2 text-slate-300 hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4" aria-label="Mobile navigation links">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.path}
                    type="button"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: 'easeOut' }}
                    onClick={() => handleNavigate(link.path)}
                    aria-current={pathname === link.path ? 'page' : undefined}
                    className={`touch-target rounded-xl px-4 py-3.5 text-left text-base font-medium transition-colors ${
                      pathname === link.path
                        ? 'bg-brand-900/50 text-brand-200'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

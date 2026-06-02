import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { User } from '../lib/auth'
import { navLinks, site } from '../data/site'
import { Logo } from './Logo'

interface NavbarProps {
  pathname: string
  onNavigate: (path: string) => void
  currentUser: User | null
  onSignOut: () => void
}

export function Navbar({ pathname, onNavigate, currentUser, onSignOut }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [menuActive, setMenuActive] = useState(false)

  const handleNavigate = (path: string) => {
    onNavigate(path)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setMenuActive(true))
      })
      return () => cancelAnimationFrame(raf)
    }

    setMenuActive(false)
    const timer = window.setTimeout(() => setMenuMounted(false), 320)
    return () => window.clearTimeout(timer)
  }, [menuOpen])

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

  const mobileMenu = menuMounted
      ? createPortal(
          <>
            <button
              type="button"
              className={`mobile-nav-overlay ${menuActive ? 'mobile-nav-overlay--open' : ''}`}
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />

            <div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-hidden={!menuActive}
              aria-label="Mobile navigation"
              className={`mobile-nav-drawer ${menuActive ? 'mobile-nav-drawer--open' : ''}`}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
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
                {currentUser && (
                  <p className="mb-2 px-4 text-sm font-medium text-brand-300">
                    Welcome, {currentUser.username}
                  </p>
                )}
                {navLinks.map((link) => {
                  const label =
                    link.path === '/join' && currentUser ? 'Account' : link.label

                  return (
                    <button
                      key={link.path}
                      type="button"
                      onClick={() => handleNavigate(link.path)}
                      aria-current={pathname === link.path ? 'page' : undefined}
                      className={`touch-target rounded-xl px-4 py-3.5 text-left text-base font-medium transition-colors ${
                        pathname === link.path
                          ? 'bg-brand-900/50 text-brand-200'
                          : 'text-slate-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      onSignOut()
                      setMenuOpen(false)
                    }}
                    className="touch-target mt-4 rounded-xl border border-white/10 px-4 py-3.5 text-left text-base font-medium text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    Sign out
                  </button>
                )}
              </nav>
            </div>
          </>,
          document.body,
        )
      : null

  return (
    <>
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
            {navLinks.map((link) => {
              const label =
                link.path === '/join' && currentUser ? 'Account' : link.label

              return (
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
                  {label}
                </button>
              )
            })}
            {currentUser && (
              <>
                <span className="mx-1 hidden text-slate-600 lg:inline" aria-hidden="true">
                  |
                </span>
                <span className="hidden text-sm text-brand-300 lg:inline">
                  Welcome, {currentUser.username}
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="touch-target rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  Sign out
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
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
      </header>

      {mobileMenu}
    </>
  )
}

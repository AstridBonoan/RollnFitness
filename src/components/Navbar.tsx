import { useState } from 'react'
import { navLinks, site } from '../data/site'
import { Logo } from './Logo'

interface NavbarProps {
  isDark: boolean
  onThemeToggle: () => void
  pathname: string
  onNavigate: (path: string) => void
}

export function Navbar({ isDark, onThemeToggle, pathname, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavigate = (path: string) => {
    onNavigate(path)
    setMenuOpen(false)
  }

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
          <Logo variant="compact" />
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
                  ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onThemeToggle}
            className="touch-target rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="touch-target rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-white/10"
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
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-white/10 dark:bg-slate-950"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => handleNavigate(link.path)}
                aria-current={pathname === link.path ? 'page' : undefined}
                className={`touch-target rounded-lg px-4 py-3 text-left text-base font-medium ${
                  pathname === link.path
                    ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

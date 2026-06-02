import { useState } from 'react'
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

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-white/10 bg-navy-900 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => handleNavigate(link.path)}
                aria-current={pathname === link.path ? 'page' : undefined}
                className={`touch-target rounded-lg px-4 py-3 text-left text-base font-medium ${
                  pathname === link.path
                    ? 'bg-brand-900/50 text-brand-200'
                    : 'text-slate-200'
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

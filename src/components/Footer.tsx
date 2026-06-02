import { navLinks, site } from '../data/site'
import { Logo } from './Logo'

interface FooterProps {
  onNavigate: (path: string) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo variant="compact" className="mb-4" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {site.description} Making fitness accessible to every body.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
              {site.parentTagline}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Explore
            </p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    className="text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Ecosystem
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">RollnFitness</strong> — Core platform
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Sports Pass</strong> — Sport-specific training
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">RollnFitness+</strong> — Coming soon
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Phase 1 — Mobile-first web platform
          </p>
        </div>
      </div>
    </footer>
  )
}

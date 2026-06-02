import { sportsPrograms } from '../../data/site'
import { Button } from '../ui/Button'
import { PageShell } from '../ui/PageShell'

interface SportsPassPageProps {
  onNavigate: (path: string) => void
}

export function SportsPassPage({ onNavigate }: SportsPassPageProps) {
  return (
    <PageShell
      title="RollnFitness Sports Pass"
      description="Premium sport-specific training programs for adaptive athletes. Go beyond general fitness with programs built for your sport."
    >
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">Premium add-on</p>
        <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          Train like an athlete in your sport
        </p>
        <p className="mt-3 max-w-2xl text-brand-100">
          Sports Pass unlocks specialized programs with periodized training, sport-specific drills, and
          performance tracking — designed by adaptive sports coaches.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {sportsPrograms.map((program) => (
          <article
            key={program.title}
            className="card-hover rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
          >
            <span className="text-4xl" aria-hidden="true">{program.icon}</span>
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{program.title}</h2>
            <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{program.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-brand-600 dark:text-brand-400">
              Included with Sports Pass
            </span>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center rounded-2xl border border-slate-200 bg-surface p-8 text-center dark:border-white/10 dark:bg-slate-900/40 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Launching with Phase 1
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
          Be first to access Sports Pass
        </h2>
        <p className="mt-3 max-w-md text-slate-600 dark:text-slate-300">
          Join the waitlist to get notified when Sports Pass programs go live and receive early-bird pricing.
        </p>
        <Button size="lg" className="mt-6" onClick={() => onNavigate('/join')}>
          Join the waitlist
        </Button>
      </div>
    </PageShell>
  )
}

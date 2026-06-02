import { nutritionTips } from '../../data/site'
import { PageShell } from '../ui/PageShell'

export function NutritionPage() {
  return (
    <PageShell
      title="Nutrition Guidance"
      description="Personalized nutrition support designed for adaptive athletes and active wheelchair users. Fuel your training with guidance that fits your lifestyle."
    >
      <div className="mb-10 rounded-2xl border border-accent-500/30 bg-accent-500/5 p-6 dark:bg-accent-500/10">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
          Personalized plans — coming with early access
        </p>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Phase 1 includes foundational nutrition guidance. Full personalized meal planning and macro
          targets arrive as we onboard early users.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {nutritionTips.map((tip) => (
          <article
            key={tip.title}
            className="card-hover rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{tip.title}</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{tip.body}</p>
          </article>
        ))}
      </div>

      <section className="mt-12 rounded-2xl bg-brand-600 p-8 text-white dark:bg-brand-700" aria-labelledby="hydration-heading">
        <h2 id="hydration-heading" className="text-2xl font-bold">Daily hydration reminder</h2>
        <p className="mt-3 max-w-xl text-brand-100">
          Adaptive athletes often underestimate fluid needs during seated training. Keep water within
          reach and aim for consistent intake throughout the day — not just during workouts.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-3/5 rounded-full bg-white" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label="Daily hydration goal 60% complete" />
          </div>
          <span className="text-sm font-semibold">6 / 10 cups</span>
        </div>
      </section>
    </PageShell>
  )
}

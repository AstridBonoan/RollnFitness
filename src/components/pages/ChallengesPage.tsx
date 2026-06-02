import { challenges } from '../../data/site'
import { Button } from '../ui/Button'
import { PageShell } from '../ui/PageShell'

export function ChallengesPage() {
  return (
    <PageShell
      title="Challenges"
      description="Stay consistent with adaptive challenges, encouragement, and accountability. Join community goals that meet you where you are."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <article key={challenge.title} className="card-hover card-surface flex flex-col p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-brand-900/50 px-3 py-1 text-xs font-semibold text-brand-200">
                Active
              </span>
              <span className="text-sm text-slate-400">{challenge.daysLeft} days left</span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">{challenge.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
              {challenge.description}
            </p>
            <p className="mt-4 text-sm text-slate-400">{challenge.participants} participants</p>
            <Button className="mt-5 w-full" aria-label={`Join ${challenge.title} — coming soon`}>
              Join challenge (coming soon)
            </Button>
          </article>
        ))}
      </div>

      <div className="banner-achievement mt-10" role="status">
        <p className="text-xs font-bold uppercase tracking-widest text-circuit-400">Milestone unlocked</p>
        <p className="mt-1 font-display text-lg font-bold text-steel-50">
          You hit your weekly movement goal — keep the streak alive.
        </p>
      </div>

      <section className="mt-12 rounded-2xl border border-dashed border-octane-700/50 bg-carbon-900/50 p-8 text-center">
        <h2 className="text-xl font-bold text-white">Create your own challenge</h2>
        <p className="mx-auto mt-3 max-w-md text-slate-300">
          Invite friends, set a goal, and track progress together. Custom challenges launch with early access.
        </p>
      </section>
    </PageShell>
  )
}

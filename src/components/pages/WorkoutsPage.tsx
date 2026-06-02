import { useState } from 'react'
import { mobilityLevels, workouts } from '../../data/site'
import { PageShell } from '../ui/PageShell'

export function WorkoutsPage() {
  const [filter, setFilter] = useState<string>('all')

  const filtered =
    filter === 'all'
      ? workouts
      : workouts.filter((w) => (w.mobility as readonly string[]).includes(filter))

  return (
    <PageShell
      title="Adaptive Workouts"
      description="Browse seated, standing, and hybrid routines designed for your mobility level. Every workout includes clear modifications and accessibility notes."
    >
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by mobility level">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          All
        </FilterButton>
        {mobilityLevels.map((level) => (
          <FilterButton
            key={level.id}
            active={filter === level.id}
            onClick={() => setFilter(level.id)}
          >
            {level.icon} {level.label}
          </FilterButton>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((workout) => (
          <article key={workout.id} className="card-hover card-surface flex flex-col p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-brand-900/50 px-3 py-1 text-xs font-semibold text-brand-200">
                {workout.level}
              </span>
              <span className="text-sm text-slate-400">{workout.duration}</span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">{workout.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{workout.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {workout.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="btn-start-now touch-target mt-5 w-full py-3 text-sm"
              aria-label={`Start ${workout.title} workout — coming soon`}
            >
              Start now (coming soon)
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-500 text-white'
          : 'bg-white/10 text-slate-200 hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, mobilityLabel } from '../../lib/auth'
import {
  sortWorkoutsForUser,
  workoutMatchesMobility,
  workouts,
} from '../../lib/workouts'
import { mobilityLevels } from '../../data/site'
import type { WorkoutProgram } from '../../data/workouts'
import { PageShell } from '../ui/PageShell'

interface WorkoutsPageProps {
  onNavigate: (path: string) => void
}

export function WorkoutsPage({ onNavigate }: WorkoutsPageProps) {
  const user = getCurrentUser()
  const [filter, setFilter] = useState<string>(
    user?.mobility && user.mobility !== '' ? user.mobility : 'all',
  )

  useEffect(() => {
    if (user?.mobility) setFilter(user.mobility)
  }, [user?.mobility])

  const sorted = useMemo(
    () => sortWorkoutsForUser(workouts, user?.mobility),
    [user?.mobility],
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted
    return sorted.filter((w) => (w.mobility as readonly string[]).includes(filter))
  }, [filter, sorted])

  const recommended = useMemo(
    () =>
      user?.mobility
        ? sorted.filter((w) => workoutMatchesMobility(w, user.mobility))
        : [],
    [sorted, user?.mobility],
  )

  return (
    <PageShell
      title="Adaptive Workouts"
      description={
        user?.mobility
          ? `Programs matched to ${mobilityLabel(user.mobility)} appear first. Each workout includes a full guided video and mobility-specific modifications.`
          : 'Browse seated, standing, and hybrid routines. Each workout includes a guided video program and modifications for your mobility level — sign in to personalize your library.'
      }
    >
      {user?.mobility && (
        <p className="mb-6 rounded-xl border border-octane-600/30 bg-octane-950/40 px-4 py-3 text-sm text-octane-200">
          Showing programs suited for <strong>{mobilityLabel(user.mobility)}</strong>. Use filters
          below to explore other levels.
        </p>
      )}

      {recommended.length > 0 && filter === 'all' && (
        <section className="mb-10" aria-labelledby="for-you-heading">
          <h2 id="for-you-heading" className="font-display text-lg font-bold text-white">
            Recommended for you
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.slice(0, 3).map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                forYou
                onOpen={() => onNavigate(`/workouts/${workout.id}`)}
              />
            ))}
          </div>
        </section>
      )}

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

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-400">
          No workouts in this filter. Try &quot;All&quot; or complete your mobility profile on the{' '}
          <button
            type="button"
            className="font-medium text-octane-400 underline hover:text-octane-300"
            onClick={() => onNavigate('/join')}
          >
            Join
          </button>{' '}
          page.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              forYou={workoutMatchesMobility(workout, user?.mobility)}
              onOpen={() => onNavigate(`/workouts/${workout.id}`)}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}

function WorkoutCard({
  workout,
  forYou,
  onOpen,
}: {
  workout: WorkoutProgram
  forYou?: boolean
  onOpen: () => void
}) {
  return (
    <article className="card-hover card-surface flex flex-col p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-brand-900/50 px-3 py-1 text-xs font-semibold text-brand-200">
          {workout.level}
        </span>
        <span className="text-sm text-slate-400">{workout.duration}</span>
      </div>
      {forYou && (
        <span className="mt-3 inline-flex w-fit rounded-full border border-vitality-500/40 bg-vitality-950/50 px-2.5 py-0.5 text-xs font-semibold text-vitality-300">
          Matches your profile
        </span>
      )}
      <h2 className="mt-3 text-xl font-bold text-white">{workout.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{workout.description}</p>
      <p className="mt-3 text-xs text-slate-500">
        Video program · {workout.video.instructor}
      </p>
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
        onClick={onOpen}
        aria-label={`Start ${workout.title} — open video program`}
      >
        Start program
      </button>
    </article>
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
